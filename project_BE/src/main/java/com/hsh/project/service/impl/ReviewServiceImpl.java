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
import com.hsh.project.pojo.enums.EnumHashtagStatus;
import com.hsh.project.pojo.enums.EnumReviewStatus;
import com.hsh.project.pojo.enums.EnumReviewUploadType;
import com.hsh.project.pojo.enums.EnumTargetType;
import com.hsh.project.repository.*;
import com.hsh.project.service.spec.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.util.stream.Collectors;

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
    public void createReview(CreateReviewRequest request, List<MultipartFile> mediaFiles) {

        User user = userRepository.findById(request.getUserId()).orElse(null);

        Review review = new Review();
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setStatus(EnumReviewStatus.PENDING);
        review.setUser(user);

        reviewRepository.save(review);

        List<ReviewHashtag> list = new ArrayList<>();

        // Xử lý hashtag
        for (Integer tagName : request.getHashtags()) {
            Hashtag hashtag = hashtagRepository.findById(tagName).orElse(null);
//            if (hashtag == null) {
//                Hashtag newTag = new Hashtag();
//                newTag.setTag(tagName);
//                newTag.setStatus(EnumHashtagStatus.PENDING);
//                hashtagRepository.save(newTag);
//            }
            ReviewHashtag reviewHashtag = ReviewHashtag.builder()
                    .hashtag(hashtag)
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

        // Lưu media

        long videoCount = mediaFiles.stream()
                .filter(file -> {
                    String contentType = file.getContentType();
                    return contentType != null && contentType.startsWith("video");
                })
                .count();

        if (videoCount > 1) {
            throw new BadRequestException("Chỉ được phép upload tối đa 1 video.");
        }

        int order = 1;
        for (MultipartFile file : mediaFiles) {
//            String fileName = storeFile(file); // bạn tự xử lý phần lưu file
            EnumReviewUploadType type = detectType(file); // ví dụ: IMAGE/VIDEO

            String uploadedUrl = null;
            if (type == EnumReviewUploadType.IMAGE) {
                uploadedUrl = uploadImages(file);  // <-- TRẢ VỀ URL
            } else if (type == EnumReviewUploadType.VIDEO) {
                uploadedUrl = uploadSingleVideo(file);  // <-- TRẢ VỀ URL
            }

            ReviewMedia media = new ReviewMedia();
            media.setReview(review);
            media.setUrlImageGIFVideo(uploadedUrl);
            media.setTypeUploadReview(type);
            media.setOrderDisplay(order++);
            reviewMediaRepository.save(media);
        }
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
                .setContentType(contentType)  // <-- đúng loại file thật
                .build();

        try (InputStream inputStream = ReviewServiceImpl.class.getClassLoader().getResourceAsStream(fileConfigFirebase)) {
            Credentials credentials = GoogleCredentials.fromStream(inputStream);
            Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
            storage.create(blobInfo, Files.readAllBytes(file.toPath()));
        }

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
        File tempFile = new File(fileName);          // create newFile ưith String of fileName (random String + "extension") and save to Current Working Directory or Java Virtual Machine (JVM)
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

//    public List<String> uploadImages(MultipartFile imageFiles) {
//        List<String> urls = new ArrayList<>();
//        try {
//
//                String extension = getExtension(imageFiles.getOriginalFilename());
//                if (!isImage(extension)) throw new BadRequestException("Must be an image");
//
//                String fileName = UUID.randomUUID() + extension;
//                File convertedFile = convertToFile(imageFiles, fileName);
//                String url = uploadFile(convertedFile, fileName);
//                urls.add(url);
//                convertedFile.delete();
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return urls;
//    }
//
//    public String uploadSingleVideo(MultipartFile videoFile) {
//        try {
//            String extension = getExtension(videoFile.getOriginalFilename());
//            if (!isVideo(extension)) {
//                throw new IllegalArgumentException("Chỉ cho phép upload video (.mp4, .mov, ...)");
//            }
//
//            String fileName = UUID.randomUUID() + extension;
//            File convertedFile = convertToFile(videoFile, fileName);
//            String url = uploadFile(convertedFile, fileName);
//            convertedFile.delete();
//            return url;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Video upload thất bại";
//        }
//    }



//    private String uploadFile(File file, String fileName, String contentType) throws IOException {  // file vs fileName is equal
//        String folder = folderContainImage + "/" + fileName;  // 1 is folder and fileName is "randomString + "extension""
//        BlobId blobId = BlobId.of(bucketName, folder); // blodId is a path to file in firebase
//        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(contentType).build();  // blodInfo contains blodID and more
//        InputStream inputStream = ReviewServiceImpl.class.getClassLoader().getResourceAsStream(fileConfigFirebase); // change the file name with your one
//        Credentials credentials = GoogleCredentials.fromStream(inputStream);
//        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
//        storage.create(blobInfo, Files.readAllBytes(file.toPath()));
//        // saved image on firebase
//        String DOWNLOAD_URL = urlFirebase;
//        return String.format(DOWNLOAD_URL, URLEncoder.encode(folder, StandardCharsets.UTF_8));
//    }



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

        // Build response
        return ReviewResponseDTO.builder()
                .reviewID(review.getReviewID())
                .title(review.getTitle())
                .content(review.getContent())
                .perspective(review.getPerspective())
                .viewCount(review.getViewCount())
                .status(review.getStatus().name())
                .relevantStar(review.getRelevantStar())
                .objectiveStar(review.getObjectiveStar())
                .comments(rootComments)
                .ratings(ratingDTOs)
                .reviewMedias(mediaDTOs)
                .likes(likeDTOs)
                .build();
    }

    private List<CommentResponseDTO> buildCommentTree(List<Comment> allComments, Comment parent) {
        return allComments.stream()
                .filter(c -> Objects.equals(c.getParentComment(), parent))
                .map(comment -> {
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
    public List<ReviewResponseDTO> getTopTrendingReviews(int limit) {
        // 1. Lấy top hashtag có nhiều review nhất
        List<Long> topHashtagIds = reviewHashtagRepository.findTopHashtagIdsByReviewCount(PageRequest.of(0, 5));

        // 2. Lấy review thuộc các hashtag đó
        List<Review> reviews = reviewRepository.findDistinctReviewsByHashtagIds(topHashtagIds);

        // 3. Tính tương tác (like + comment)
        List<ReviewResponseDTO> reviewDTOs = reviews.stream()
                .map(this::mapReviewToDTOWithoutUser)
                .sorted(Comparator.comparingInt(r -> -((r.getLikes() != null ? r.getLikes().size() : 0) + (r.getComments() != null ? r.getComments().size() : 0))))
                .limit(limit)
                .collect(Collectors.toList());

        return reviewDTOs;
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByUserHashtags(Long userId) {
        // 1. Lấy tất cả hashtag mà user đã đăng ký
        List<Long> userHashtagIds = UserHashtagRepository.findHashtagIdsByUserId(userId);

        // 2. Lấy review thuộc các hashtag đó
        List<Review> reviews = reviewRepository.findDistinctReviewsByHashtagIds(userHashtagIds);

        // 3. Lọc những review không bị block
        List<ReviewResponseDTO> reviewDTOs = reviews.stream()
                .filter(review -> !blockReviewRepository.existsByUser_UserIdAndReview_ReviewID(userId, review.getReviewID()))
                .map(review -> {
                    boolean isSaved = savedReviewRepository.existsByUser_UserIdAndReview_ReviewIDAndStatusTrue(userId, review.getReviewID());
                    return mapReviewToDTOWithUser(review, userId, isSaved);
                })
                .sorted(Comparator.comparingInt(r -> -((r.getLikes() != null ? r.getLikes().size() : 0) + (r.getComments() != null ? r.getComments().size() : 0))))
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
                .comments(rootComments)
                .ratings(ratingDTOs)
                .likes(likeDTOs)
                .isSaved(isSaved)
//                .isBlocked(isBlocked)
                .build();
    }

}
