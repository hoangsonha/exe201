package com.hsh.project.service.impl;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.hsh.project.dto.request.BlockReviewRequest;
import com.hsh.project.dto.request.CreateReviewRequest;
import com.hsh.project.dto.response.*;
import com.hsh.project.exception.BadRequestException;
import com.hsh.project.exception.ElementNotFoundException;
import com.hsh.project.pojo.*;
import com.hsh.project.pojo.enums.*;

import com.hsh.project.repository.*;
import com.hsh.project.service.spec.CheckReviewAIService;
import com.hsh.project.service.spec.LikeService;
import com.hsh.project.service.spec.RatingService;
import com.hsh.project.service.spec.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import lombok.extern.slf4j.Slf4j;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final RatingRepository ratingRepository;
    private final ReviewHashtagRepository reviewHashtagRepository;
    private final UserRepository userRepository;
    private final UserHashtagRepository UserHashtagRepository;
    private final BlockReviewRepository blockReviewRepository;
    private final SavedReviewRepository savedReviewRepository;
    private final ReviewMediaRepository reviewMediaRepository;
    private final HashtagRepository hashtagRepository;
    private final LikeService likeService;

    private final RatingService ratingService;
    private final CheckReviewAIService checkReviewAIService;


    // Firebase

    @Value("${firebase.bucket.name}")
    private String bucketName;

    @Value("${firebase.get.stream}")
    private String fileConfigFirebase;

    @Value("${firebase.get.url}")
    private String urlFirebase;

    @Value("${firebase.get.folder}")
    private String folderContainImage;


    @Transactional
    @Override
    public ReviewResponseDTO createReview(CreateReviewRequest request, List<MultipartFile> mediaFiles) {

        User user = userRepository.findById(request.getUserId()).orElse(null);

        Review review = new Review();
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setStatus(EnumReviewStatus.PENDING);
        review.setUser(user);

        reviewRepository.save(review);

        List<ReviewHashtag> list = new ArrayList<>();

        if (request.getHashtags().isEmpty()) {
            throw new BadRequestException("Hashtags can not be empty");
        }

        for (String tagName : request.getHashtags()) {
            Hashtag hashtag = hashtagRepository.findByTag(tagName);
            if (hashtag == null) {
                Hashtag newHashtag = Hashtag.builder()
                        .tag(tagName)
                        .status(EnumHashtagStatus.ADDED)
                        .build();
                hashtagRepository.save(newHashtag);
            }

            ReviewHashtag reviewHashtag = ReviewHashtag.builder()
                    .hashtag(hashtagRepository.findByTag(tagName))
                    .review(review)
                    .build();
            list.add(reviewHashtag);
        }
        if (review.getReviewHashtags() != null) {
            review.getReviewHashtags().addAll(list);
        } else {
            review.setReviewHashtags(list);
        }

        reviewRepository.save(review);

//        // Auto-like the review
//        likeService.createLike(
//            request.getUserId(),     // userId
//            EnumTargetType.REVIEW,   // targetType
//            review.getReviewID(),    // targetId (reviewID)
//            EnumLikeType.LIKE        // likeType (assuming EnumLikeType.LIKE exists)
//        );
//
//        ratingService.createRating(
//            request.getUserId(),     // userId
//            review.getReviewID(),    // reviewId
//            1.0                     // stars (default value)
//    );

        // Lưu media

        if (mediaFiles != null && !mediaFiles.isEmpty()) {
            long videoCount = mediaFiles.stream()
                    .filter(file -> {
                        String contentType = file.getContentType();
                        return contentType != null && contentType.startsWith("video");
                    })
                    .count();

            if (videoCount > 1) {
                throw new BadRequestException("Chỉ được phép upload tối đa 1 video.");
            }

            List<ReviewMedia> reviewMediaList = new ArrayList<>();

            String typeUpload = "";

            int order = 1;
            for (MultipartFile file : mediaFiles) {
//            String fileName = storeFile(file); // bạn tự xử lý phần lưu file
                EnumReviewUploadType type = detectType(file); // ví dụ: IMAGE/VIDEO

                String uploadedUrl = null;
                if (type == EnumReviewUploadType.IMAGE) {
                    typeUpload = "image";
                    uploadedUrl = uploadImages(file);  // <-- TRẢ VỀ URL
                } else if (type == EnumReviewUploadType.VIDEO) {
                    typeUpload = "video";
                    uploadedUrl = uploadSingleVideo(file);
                }

                ReviewMedia media = new ReviewMedia();
                media.setReview(review);
                media.setUrlImageGIFVideo(uploadedUrl);
                media.setTypeUploadReview(type);
                media.setOrderDisplay(order++);

                reviewMediaList.add(media);
            }

            review.setReviewMedias(reviewMediaList);

            if (typeUpload.equals("video")) {
                review.setStatus(EnumReviewStatus.PENDING);
                return this.mapReviewToDTOWithoutUser(reviewRepository.save(review));
            }
        }

        review = checkReviewAIService.checkReview(review);

        if (review.getPerspective() == "NEGATIVE" || review.getObjectiveStar() <= 2 ||  review.getObjectiveStar() > 5 || review.getRelevantStar() <= 2 || review.getRelevantStar() > 5) {
            review.setStatus(EnumReviewStatus.REMOVED);
            review.setDeleted(true);
        } else {
            review.setStatus(EnumReviewStatus.PUBLISHED);

            List<String> hashtags = review.getReviewHashtags().stream().map(rvht -> rvht.getHashtag().getTag()).toList();

            List<User> users = new ArrayList<>();

            String stringNoti = "";

            for (int i = 0; i < hashtags.size(); i++) {
                Hashtag tag = hashtagRepository.findByTag(hashtags.get(i));

                String com = ", ";

                if (i == hashtags.size() -1) {
                    com = ".";
                }

                if (tag != null) {
                    stringNoti = tag.getTag() + com;

                    List<UserHashtag> userHashtags = tag.getUserHashtags();
                    for (UserHashtag userHashtag : userHashtags) {
                        users.add(userHashtag.getUser());
                    }
                }
            }

            users = users.stream().filter(u -> u != user).toList();

            List<Notification> notifications = new ArrayList<>();

            if (users.size() > 0) {
                for (User user1 : users) {
                    Notification notification = Notification.builder()
                            .isRead(false)
                            .content("Đã có 1 bài viết liên quan tới chủ đề " + stringNoti)
                            .user(user1)
                            .notificationType(EnumNotificationType.REVIEW_PUBLISHED)
                            .isRead(false)
                            .review(review)
                            .build();
                    notifications.add(notification);
                }
            }
            review.setNotifications(notifications);
        }

        return this.mapReviewToDTOWithoutUser(reviewRepository.save(review));
    }

    public String uploadImages(MultipartFile imageFile) {
        try {
            String extension = getExtension(imageFile.getOriginalFilename());
            if (!isImage(extension)) throw new BadRequestException("Must be an image");

            String fileName = UUID.randomUUID() + extension;
            File convertedFile = convertToFile(imageFile, fileName);
            String url = uploadFile(convertedFile, fileName, imageFile.getContentType());  // <-- lấy đúng content-type
            convertedFile.delete();
            return url;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String uploadSingleVideo(MultipartFile videoFile) {
        try {
            String extension = getExtension(videoFile.getOriginalFilename());
            if (!isVideo(extension)) throw new BadRequestException("Chỉ cho phép upload video");

            String fileName = UUID.randomUUID() + extension;
            File convertedFile = convertToFile(videoFile, fileName);
            String url = uploadFile(convertedFile, fileName, videoFile.getContentType());  // <-- lấy đúng content-type
            convertedFile.delete();
            return url;
        } catch (Exception e) {
            e.printStackTrace();
            return "Video upload thất bại";
        }
    }

    private String uploadFile(File file, String fileName, String contentType) throws IOException {
        String folder = folderContainImage + "/" + fileName;
        BlobId blobId = BlobId.of(bucketName, folder);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(contentType)
                .build();

        Credentials credentials;
        String envPath = System.getenv("FIREBASE_KEY_PATH");

        InputStream keyStream;

        if (envPath != null && !envPath.isBlank()) {
            System.out.println("✅ Đang dùng FIREBASE_KEY_PATH từ biến môi trường: " + envPath);
            keyStream = new FileInputStream(envPath);
        } else {
            // Local dev fallback
            String fallbackPathInResources = "keys/key_firebase.json"; // hoặc lấy từ fileConfigFirebase nếu bạn set
            System.out.println("🔁 Không có biến FIREBASE_KEY_PATH, dùng file trong resources: " + fallbackPathInResources);
            keyStream = ReviewServiceImpl.class.getClassLoader().getResourceAsStream(fallbackPathInResources);

            if (keyStream == null) {
                throw new ElementNotFoundException("Không tìm thấy key Firebase trong resources: " + fallbackPathInResources);
            }
        }

        credentials = GoogleCredentials.fromStream(keyStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));

        return String.format(urlFirebase, URLEncoder.encode(folder, StandardCharsets.UTF_8));
    }

    private boolean deleteImageOnFireBase(String urlImage, String contentType) throws IOException {
        String folder = folderContainImage + "/" + urlImage;
        BlobId blobId = BlobId.of(bucketName, folder); // Replace with your bucker name
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();
        InputStream inputStream = ReviewServiceImpl.class.getClassLoader().getResourceAsStream(fileConfigFirebase); // change the file name with your one
        Credentials credentials = GoogleCredentials.fromStream(inputStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        return storage.delete(blobId);
    }

    private File convertToFile(MultipartFile multipartFile, String fileName) throws IOException {
//        File tempFile = new File(fileName);
        File tempFile = File.createTempFile("upload_", "_" + fileName);// create newFile ưith String of fileName (random String + "extension") and save to Current Working Directory or Java Virtual Machine (JVM)
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(multipartFile.getBytes());
        }
        return tempFile;
    }

    private String storeFile(MultipartFile file) {
        return file.getOriginalFilename();
    }

    private String getExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    }

    private EnumReviewUploadType detectType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) return EnumReviewUploadType.IMAGE;

        if (contentType.startsWith("image")) return EnumReviewUploadType.IMAGE;
        if (contentType.startsWith("video")) return EnumReviewUploadType.VIDEO;
        return EnumReviewUploadType.IMAGE;
    }

    private boolean isImage(String extension) {
        return extension.matches("(?i)\\.(jpg|jpeg|png|gif)$");
    }

    private boolean isVideo(String extension) {
        return extension.matches("(?i)\\.(mp4|mov|avi|mkv)$");
    }

    @Override
    public ReviewResponseDTO getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(Math.toIntExact(reviewId))
                .orElseThrow(() -> new ElementNotFoundException("Review not found"));

        // Map comments đệ quy
        List<Comment> allComments = commentRepository.findByReview_ReviewID(reviewId);
        List<CommentResponseDTO> rootComments = buildCommentTree(allComments, null);

        // Map ratings
        List<Rating> ratings = ratingRepository.findByReview_ReviewID(reviewId);
        List<RatingDTO> ratingDTOs = ratings.stream()
                .map(this::mapRatingToDTO)
                .collect(Collectors.toList());

        // Map likes
        List<Like> likes = likeRepository.findByTargetTypeAndTargetId(EnumTargetType.REVIEW, reviewId);
        List<LikeDTO> likeDTOs = likes.stream()
                .map(this::mapLikeToDTO)
                .collect(Collectors.toList());

        List<ReviewMedia> mediaList = reviewMediaRepository.findByReview_ReviewID(reviewId);
        List<ReviewMediaDTO> mediaDTOs = mediaList.stream()
                .map(m -> new ReviewMediaDTO(m.getId(), m.getUrlImageGIFVideo(), m.getTypeUploadReview().name(), m.getOrderDisplay()))
                .collect(Collectors.toList());

        List<HashTagResponseDTO> hashTagResponseDTOS = new ArrayList<>();
        List<ReviewHashtag> reviewHashtags = review.getReviewHashtags();

        for (ReviewHashtag reviewHashtag : reviewHashtags) {
            Hashtag hashtag = reviewHashtag.getHashtag();
            hashTagResponseDTOS.add(mapHashtagToDTO(hashtag));
        }

        boolean isPremium = isPremiumUser(review.getUser());
        return ReviewResponseDTO.builder()
                .reviewID(review.getReviewID())
                .title(review.getTitle())
                .content(review.getContent())
                .perspective(review.getPerspective())
                .viewCount(review.getViewCount())
                .status(review.getStatus().name())
                .relevantStar(review.getRelevantStar())
                .objectiveStar(review.getObjectiveStar())
                .summary(review.getSummary())
                .comments(rootComments)
                .ratings(ratingDTOs)
                .reviewHashtags(hashTagResponseDTOS)
                .reviewMedias(mediaDTOs)
                .likes(likeDTOs)
                .isPremium(isPremium) // Now valid with updated ReviewResponseDTO
                .build();
    }

    public List<CommentResponseDTO> buildCommentTree(List<Comment> allComments, Comment parent) {
        return allComments.stream()
                .filter(c -> Objects.equals(c.getParentComment(), parent))
                .<CommentResponseDTO>map(comment -> {
                    // Lấy likes cho comment
                    List<Like> commentLikes = likeRepository.findByTargetTypeAndTargetId(
                            EnumTargetType.COMMENT, comment.getCommentID());

                    List<LikeDTO> likeDTOs = commentLikes.stream()
                            .map(this::mapLikeToDTO)
                            .collect(Collectors.toList());

                    // Tạo DTO cho user
                    User user = comment.getUser();
                    UserSimpleDTO userDTO = UserSimpleDTO.builder()
                            .userId(user.getUserId())
                            .userName(user.getUserName())
                            .avatar(user.getAvatar())
                            .build();

                    return CommentResponseDTO.builder()
                            .commentID(comment.getCommentID())
                            .content(comment.getContent())
                            .user(userDTO)
                            .likes(likeDTOs)
                            .totalLikes(likeDTOs.size())
                            .replies(buildCommentTree(allComments, comment))
                            .build();
                })
                .collect(Collectors.toList());
    }

    private RatingDTO mapRatingToDTO(Rating rating) {
        return RatingDTO.builder()
                .ratingID(rating.getRatingID())
                .stars(rating.getStars())
                .user(mapUserToSimpleDTO(rating.getUser()))
                .build();
    }

    private HashTagResponseDTO mapHashtagToDTO(Hashtag hashtag) {
        return HashTagResponseDTO.builder()
                .id(hashtag.getHashtagID())
                .name(hashtag.getTag())
                .build();
    }

    private LikeDTO mapLikeToDTO(Like like) {
        return LikeDTO.builder()
                .likeID(like.getLikeID())
                .targetType(like.getTargetType().name())
                .targetId(like.getTargetId())
                .type(like.getType().name())
                .user(mapUserToSimpleDTO(like.getUser()))
                .build();
    }

    private UserSimpleDTO mapUserToSimpleDTO(User user) {
        return UserSimpleDTO.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .avatar(user.getAvatar())
                .build();
    }

    @Override
    public List<ReviewResponseDTO> getTopTrendingReviews() {
        // 1. Lấy top hashtag có nhiều review nhất
        List<Long> topHashtagIds = reviewHashtagRepository.findTopHashtagIdsByReviewCount(PageRequest.of(0, 5));

        // 2. Lấy review thuộc các hashtag đó
        List<Review> reviews = reviewRepository.findDistinctReviewsByHashtagIds(topHashtagIds);

        // 3. Tính tương tác (like + comment) và ưu tiên premium users
        List<ReviewResponseDTO> reviewDTOs = reviews.stream()
                .map(review -> {
                    boolean isPremium = isPremiumUser(review.getUser()); // CHANGED: Use updated isPremiumUser
                    ReviewResponseDTO dto = mapReviewToDTOWithoutUser(review);
                    dto.setIsPremium(isPremium); // Set isPremium in DTO
                    return dto;
                })
                .filter(re -> re.getStatus().equals(EnumReviewStatus.PUBLISHED.name()))
                .sorted((r1, r2) -> {
                    // Prioritize premium users
                    boolean isPremium1 = r1.getIsPremium();
                    boolean isPremium2 = r2.getIsPremium();
                    if (isPremium1 && !isPremium2) return -1; // r1 is premium, r2 is not
                    if (!isPremium1 && isPremium2) return 1;  // r2 is premium, r1 is not
                    // If both are premium or both are not, sort by engagement
                    int engagement1 = (r1.getLikes() != null ? r1.getLikes().size() : 0) + (r1.getComments() != null ? r1.getComments().size() : 0);
                    int engagement2 = (r2.getLikes() != null ? r2.getLikes().size() : 0) + (r2.getComments() != null ? r2.getComments().size() : 0);
                    return Integer.compare(engagement2, engagement1); // Descending order
                })
                .collect(Collectors.toList());

        return reviewDTOs;
    }

   @Override
    public List<ReviewResponseDTO> searchReview(String search, List<String> hashtags) {
        List<Review> reviews = new ArrayList<>();

        // Chuẩn hóa search term
        String searchTerm = (search != null && !search.trim().isEmpty()) ? search.trim() : null;

        // Chuẩn hóa hashtags
        List<String> normalizedHashtags = (hashtags != null && !hashtags.isEmpty())
                ? hashtags.stream()
                .filter(tag -> tag != null && !tag.trim().isEmpty())
                .map(String::trim)
                .collect(Collectors.toList())
                : null;

        if (normalizedHashtags != null) {
            if (searchTerm != null) {
                reviews = reviewRepository.findByTitleContainingAndHashtags(searchTerm, normalizedHashtags);
            } else {
                reviews = reviewRepository.findByHashtagsIn(normalizedHashtags);
            }
        } else {
            reviews = reviewRepository.findByTitleContainingIgnoreCaseAndStatus(
                    searchTerm != null ? searchTerm : "",
                    EnumReviewStatus.PUBLISHED
            );
        }

        return reviews.stream()
                .map(review -> {
                    boolean isPremium = isPremiumUser(review.getUser());
                    ReviewResponseDTO dto = mapReviewToDTOWithoutUser(review);
                    dto.setIsPremium(isPremium); // Now valid with updated ReviewResponseDTO
                    return dto;
                })
                .sorted((r1, r2) -> {
                    boolean isPremium1 = r1.getIsPremium();
                    boolean isPremium2 = r2.getIsPremium();
                    if (isPremium1 && !isPremium2) return -1; // r1 is premium, r2 is not
                    if (!isPremium1 && isPremium2) return 1;  // r2 is premium, r1 is not
                    return 0; // Maintain original order if same premium status
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByUserHashtags(Long userId) {
        // 1. Lấy tất cả hashtag mà user đã đăng ký
        List<Long> userHashtagIds = UserHashtagRepository.findHashtagIdsByUserId(userId);

        // 2. Lấy review thuộc các hashtag đó
        List<Review> reviews = reviewRepository.findDistinctReviewsByHashtagIds(userHashtagIds);

        // 3. Lọc những review không bị block và ưu tiên premium users
        List<ReviewResponseDTO> reviewDTOs = reviews.stream()
                .filter(review -> !blockReviewRepository.existsByUser_UserIdAndReview_ReviewID(userId, review.getReviewID()))
                .filter(re -> re.getStatus().equals(EnumReviewStatus.PUBLISHED))
                .filter(re -> !re.getUser().getUserId().equals(userId))
                .map(review -> {
                    boolean isSaved = savedReviewRepository.existsByUser_UserIdAndReview_ReviewIDAndStatusTrue(userId, review.getReviewID());
                    boolean isPremium = isPremiumUser(review.getUser());
                    ReviewResponseDTO dto = mapReviewToDTOWithUser(review, userId, isSaved);
                    dto.setIsPremium(isPremium); // Now valid with updated ReviewResponseDTO
                    return dto;
                })
                .sorted((r1, r2) -> {
                    // Prioritize premium users
                    boolean isPremium1 = r1.getIsPremium();
                    boolean isPremium2 = r2.getIsPremium();
                    if (isPremium1 && !isPremium2) return -1; // r1 is premium, r2 is not
                    if (!isPremium1 && isPremium2) return 1;  // r2 is premium, r1 is not
                    // If both are premium or both are not, sort by engagement
                    int engagement1 = (r1.getLikes() != null ? r1.getLikes().size() : 0) + (r1.getComments() != null ? r1.getComments().size() : 0);
                    int engagement2 = (r2.getLikes() != null ? r2.getLikes().size() : 0) + (r2.getComments() != null ? r2.getComments().size() : 0);
                    return Integer.compare(engagement2, engagement1); // Descending order
                })
                .collect(Collectors.toList());

        return reviewDTOs;
    }

    @Override
    public BlockReviewResponseDTO blockReview(BlockReviewRequest request) {

        if (!reviewRepository.existsById(Math.toIntExact(request.getReviewerID()))) {
            throw  new ElementNotFoundException("Review not found");
        }

        boolean alreadyBlocked = blockReviewRepository.existsByUser_UserIdAndReview_ReviewID(request.getUserID(), request.getReviewerID());
        if (alreadyBlocked) {
            throw new BadRequestException("Review already blocked");
        }

        BlockReview block = new BlockReview();
        block.setUser(userRepository.getReferenceById(Math.toIntExact(request.getUserID())));
        block.setReview(reviewRepository.getReferenceById(Math.toIntExact(request.getReviewerID())));
        blockReviewRepository.save(block);

        return new BlockReviewResponseDTO(request.getReviewerID(), true);
    }

    @Override
    public ReviewResponseDTO saveReview(BlockReviewRequest request) {

        if (!reviewRepository.existsById(Math.toIntExact(request.getReviewerID()))) {
            throw  new ElementNotFoundException("Review not found");
        }

        boolean alreadySaved = savedReviewRepository.existsByUser_UserIdAndReview_ReviewID(request.getUserID(), request.getReviewerID());
        if (alreadySaved) {
            throw new BadRequestException("Review already saved");
        }

        Review review = reviewRepository.getReferenceById(Math.toIntExact(request.getReviewerID()));
        User user = userRepository.getReferenceById(Math.toIntExact(request.getUserID()));

        SavedReview savedReview = new SavedReview();
        savedReview.setUser(user);
        savedReview.setReview(review);
        savedReview.setStatus(true);
        savedReviewRepository.save(savedReview);

        return mapReviewToDTOWithUser(review, user.getUserId(), true);
    }

    @Override
    public ReviewResponseDTO unSaveReview(BlockReviewRequest request) {

        if (!reviewRepository.existsById(Math.toIntExact(request.getReviewerID()))) {
            throw  new ElementNotFoundException("Review not found");
        }

        boolean alreadySaved = savedReviewRepository.existsByUser_UserIdAndReview_ReviewID(request.getUserID(), request.getReviewerID());
        if (!alreadySaved) {
            throw new BadRequestException("Review not saved before");
        }

        SavedReview savedReview = savedReviewRepository.findByUser_UserIdAndReview_ReviewID(request.getUserID(), request.getReviewerID());

        savedReviewRepository.delete(savedReview);

        return mapReviewToDTOWithUser(savedReview.getReview(), request.getUserID(), false);
    }

    @Override
    public List<ReviewResponseDTO> getReviewSavedByUserId(Long userId) {
        return savedReviewRepository.findByUserUserIdAndStatusTrue(userId).stream()
                .map(saved -> mapReviewToDTOWithUser(saved.getReview(), userId, true))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponseDTO> getMyReview(Long userId) {
        return reviewRepository.findByUserUserId(userId).stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .map(review -> mapReviewToDTOWithUser(review, userId, false))
                .collect(Collectors.toList());
    }

    public ReviewResponseDTO mapReviewToDTOWithoutUser(Review review) {
        return mapReviewToDTOWithUser(review, null, null);
    }

    public ReviewResponseDTO mapReviewToDTOWithUser(Review review, Long userId, Boolean isSaved) {
        List<Comment> allComments = commentRepository.findByReview_ReviewID(review.getReviewID());
        List<CommentResponseDTO> rootComments = buildCommentTree(allComments, null);

        List<Rating> ratings = ratingRepository.findByReview_ReviewID(review.getReviewID());
        List<RatingDTO> ratingDTOs = ratings.stream().map(this::mapRatingToDTO).collect(Collectors.toList());

        List<Like> likes = likeRepository.findByTargetTypeAndTargetId(EnumTargetType.REVIEW, review.getReviewID());
        List<LikeDTO> likeDTOs = likes.stream().map(this::mapLikeToDTO).collect(Collectors.toList());

        List<ReviewMedia> mediaList = reviewMediaRepository.findByReview_ReviewID(review.getReviewID());
        List<ReviewMediaDTO> mediaDTOs = mediaList.stream()
                .map(m -> new ReviewMediaDTO(m.getId(), m.getUrlImageGIFVideo(), m.getTypeUploadReview().name(), m.getOrderDisplay()))
                .collect(Collectors.toList());

        List<HashTagResponseDTO> hashTagResponseDTOS = new ArrayList<>();

        List<ReviewHashtag> reviewHashtags = review.getReviewHashtags();

        for (ReviewHashtag reviewHashtag : reviewHashtags) {
            Hashtag hashtag = reviewHashtag.getHashtag();
            hashTagResponseDTOS.add(mapHashtagToDTO(hashtag));
        }

        return ReviewResponseDTO.builder()
                .reviewID(review.getReviewID())
                .title(review.getTitle())
                .content(review.getContent())
                .perspective(review.getPerspective())
                .viewCount(review.getViewCount())
                .reviewMedias(mediaDTOs)
                .status(review.getStatus().name())
                .relevantStar(review.getRelevantStar())
                .objectiveStar(review.getObjectiveStar())
                .summary(review.getSummary())
                .comments(rootComments)
                .reviewHashtags(hashTagResponseDTOS)
                .ratings(ratingDTOs)
                .likes(likeDTOs)
                .isSaved(isSaved)
//                .isBlocked(isBlocked)
                .build();
    }

    @Override
    public UserSimpleDTO getReviewCreatorById(long id) {
        log.info("Fetching creator for review ID: {}", id);
        Review review = reviewRepository.findByReviewID(id)
                .orElseThrow(() -> new ElementNotFoundException("Review not found with ID: " + id));
        User creator = review.getUser();
        if (creator == null) {
            log.warn("No creator associated with review ID: {}", id);
            return null;
        }
        log.debug("Creator found: user ID {}, username: {}", creator.getUserId(), creator.getUserName());
        return UserSimpleDTO.builder()
                .userId(creator.getUserId())
                .userName(creator.getUserName())
                .build();
    }

    private boolean isPremiumUser(User user) {
        Role role = user.getRole(); // CHANGED: Use getRole() instead of getRoles()
        return role != null && role.getRoleName() == EnumRoleNameType.ROLE_PREMIUM;
    }

}
