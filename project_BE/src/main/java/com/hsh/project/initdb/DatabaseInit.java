package com.hsh.project.initdb;

import com.hsh.project.pojo.*;
import com.hsh.project.pojo.enums.*;
import com.hsh.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DatabaseInit implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final UserLegalAcceptanceRepository userLegalAcceptanceRepository;
    private final SubscriptionTypeRepository subscriptionTypeRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final HashtagRepository hashtagRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewHashtagRepository reviewHashtagRepository;
    private final UserHashtagRepository userHashtagRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final RatingRepository ratingRepository;
    private final CheckReviewAIRepository checkReviewAIRepository;
    private final HistoryPointRepository historyPointRepository;
    private final SavedReviewRepository savedReviewRepository;
    private final ReportRepository reportRepository;
    private final NotificationRepository notificationRepository;
    private final AdvertiseRepository advertiseRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ReviewMediaRepository reviewMediaRepository;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        initUsers();
        initPolicies();
        initUserLegalAcceptances();
        initSubscriptionTypes();
        initUserSubscriptions();
        initHashtags();
        initReviews();
        initReviewHashtags();
        initUserHashtags();
        initComments();
        initLikes();
        initRatings();
        initCheckReviewAI();
        initHistoryPoints();
        initSavedReviews();
        initReports();
        initNotifications();
        initAdvertises();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setRoleName(EnumRoleNameType.ROLE_ADMIN);

            Role userRole = new Role();
            userRole.setRoleName(EnumRoleNameType.ROLE_USER);

            Role premiumRole = new Role();
            premiumRole.setRoleName(EnumRoleNameType.ROLE_PREMIUM);

            Role moderatorRole = new Role();
            moderatorRole.setRoleName(EnumRoleNameType.ROLE_MANAGER);

            roleRepository.saveAll(List.of(adminRole, userRole, premiumRole, moderatorRole));
        }
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_ADMIN);
            Role userRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_USER);
            Role premiumRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_PREMIUM);
            Role moderatorRole = roleRepository.getRoleByRoleName(EnumRoleNameType.ROLE_MANAGER);

            User admin = new User();
            admin.setUserName("admin");
            admin.setPassword(bCryptPasswordEncoder.encode("admin123"));
            admin.setGender(EnumGenderType.MALE);
            admin.setEmail("admin@example.com");
            admin.setPhone("0987654321");
            admin.setAvatar("admin_avatar.jpg");
            admin.setRole(adminRole);
            admin.setPoint(1000);
            admin.setEnabled(true);
            admin.setNonLocked(true);
            admin.setAvatar("https://firebasestorage.googleapis.com/v0/b/swp391-f046d.appspot.com/o/exe201_project%2Fanonymous.png?alt=media&token=097bad4a-2ec7-4467-ae5e-42f0f5f59048");

            User premiumUser = new User();
            premiumUser.setUserName("premium_user");
            premiumUser.setPassword(bCryptPasswordEncoder.encode("premium123"));
            premiumUser.setGender(EnumGenderType.FEMALE);
            premiumUser.setEmail("premium@example.com");
            premiumUser.setPhone("0987654322");
            premiumUser.setAvatar("premium_avatar.jpg");
            premiumUser.setRole(premiumRole);
            premiumUser.setPoint(500);
            premiumUser.setEnabled(true);
            premiumUser.setNonLocked(true);
            premiumUser.setAvatar("https://firebasestorage.googleapis.com/v0/b/swp391-f046d.appspot.com/o/exe201_project%2Fanonymous.png?alt=media&token=097bad4a-2ec7-4467-ae5e-42f0f5f59048");

            User regularUser = new User();
            regularUser.setUserName("regular_user");
            regularUser.setPassword(bCryptPasswordEncoder.encode("user123"));
            regularUser.setGender(EnumGenderType.OTHER);
            regularUser.setEmail("user@example.com");
            regularUser.setPhone("0987654323");
            regularUser.setAvatar("user_avatar.jpg");
            regularUser.setRole(userRole);
            regularUser.setPoint(100);
            regularUser.setEnabled(true);
            regularUser.setNonLocked(true);
            regularUser.setAvatar("https://firebasestorage.googleapis.com/v0/b/swp391-f046d.appspot.com/o/exe201_project%2Fanonymous.png?alt=media&token=097bad4a-2ec7-4467-ae5e-42f0f5f59048");

            User moderator = new User();
            moderator.setUserName("moderator");
            moderator.setPassword(bCryptPasswordEncoder.encode("mod123"));
            moderator.setGender(EnumGenderType.MALE);
            moderator.setEmail("mod@example.com");
            moderator.setPhone("0987654324");
            moderator.setAvatar("mod_avatar.jpg");
            moderator.setRole(moderatorRole);
            moderator.setPoint(300);
            moderator.setEnabled(true);
            moderator.setNonLocked(true);
            moderator.setAvatar("https://firebasestorage.googleapis.com/v0/b/swp391-f046d.appspot.com/o/exe201_project%2Fanonymous.png?alt=media&token=097bad4a-2ec7-4467-ae5e-42f0f5f59048");

            userRepository.saveAll(List.of(admin, premiumUser, regularUser, moderator));
        }
    }

    private void initPolicies() {
        if (policyRepository.count() == 0) {
            Policy privacyPolicy = new Policy();
            privacyPolicy.setStatus(true);
            privacyPolicy.setContent("We respect your privacy...");
            privacyPolicy.setVersion("1.0");
            privacyPolicy.setEffectiveDate(LocalDateTime.now());

            Policy termsPolicy = new Policy();
            termsPolicy.setStatus(true);
            termsPolicy.setContent("By using our service you agree to...");
            termsPolicy.setVersion("1.0");
            termsPolicy.setEffectiveDate(LocalDateTime.now());

            policyRepository.saveAll(List.of(privacyPolicy, termsPolicy));
        }
    }

    private void initUserLegalAcceptances() {
        if (userLegalAcceptanceRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            User premiumUser = userRepository.findByUserName("premium_user");
            Policy privacyPolicy = policyRepository.findAll().get(0);
            Policy termsPolicy = policyRepository.findAll().get(1);

            UserLegalAcceptance adminPrivacyAcceptance = new UserLegalAcceptance();
            adminPrivacyAcceptance.setUser(admin);
            adminPrivacyAcceptance.setPolicy(privacyPolicy);
            adminPrivacyAcceptance.setAcceptanceDate(LocalDateTime.now());

            UserLegalAcceptance adminTermsAcceptance = new UserLegalAcceptance();
            adminTermsAcceptance.setUser(admin);
            adminTermsAcceptance.setPolicy(termsPolicy);
            adminTermsAcceptance.setAcceptanceDate(LocalDateTime.now());

            UserLegalAcceptance premiumPrivacyAcceptance = new UserLegalAcceptance();
            premiumPrivacyAcceptance.setUser(premiumUser);
            premiumPrivacyAcceptance.setPolicy(privacyPolicy);
            premiumPrivacyAcceptance.setAcceptanceDate(LocalDateTime.now());

            userLegalAcceptanceRepository.saveAll(List.of(
                    adminPrivacyAcceptance,
                    adminTermsAcceptance,
                    premiumPrivacyAcceptance
            ));
        }
    }

    private void initSubscriptionTypes() {
        if (subscriptionTypeRepository.count() == 0) {
            SubscriptionType free = new SubscriptionType();
            free.setName("Free");
            free.setPrice(0f);
            free.setDuration(0);
            free.setTitle("tỏi thường");
            free.setOriginalPrice(null);
            free.setFeatures("không có chức năng tỏi AI tóm tắt, không có boost tương tác bài viết, không đổi được tên & ava, có quảng cáo");

            SubscriptionType premiumMonthly = new SubscriptionType();
            premiumMonthly.setName("VIP");
            premiumMonthly.setPrice(25000F);
            premiumMonthly.setDuration(30);
            premiumMonthly.setFeatures("tỏi AI giúp bạn tóm tắt review nhanh hơn, các bài viết của bạn sẽ được boost tương tác, bạn có thể customize nhiều thứ hơn- đổi tên & ava xịn sò, không bị quảng cáo");
            premiumMonthly.setOriginalPrice(35000F);
            premiumMonthly.setTitle("tỏi VIP");

            SubscriptionType premiumYearly = new SubscriptionType();
            premiumYearly.setName("Business");
            premiumYearly.setPrice(100000f);
            premiumYearly.setDuration(30);
            premiumYearly.setFeatures("tài khoản được đánh dấu doanh nghiệp - đổi ava và tên, tạo tag review chính thức, có thể quảng cáo trên toireview, xem analytics từ tỏi AI - xu hướng của mọi người là gì");
            premiumYearly.setOriginalPrice(150000F);
            premiumYearly.setTitle("tỏi business");

            subscriptionTypeRepository.saveAll(List.of(free, premiumMonthly, premiumYearly));
        }
    }

    private void initUserSubscriptions() {
        if (userSubscriptionRepository.count() == 0) {
            List<User> users = userRepository.findAll();

            SubscriptionType subscriptionType = subscriptionTypeRepository.findByName("Free");

            if (subscriptionType != null) {
                for (User user : users) {
                    List<UserSubscription> userSubscriptions = new ArrayList<>();
                    LocalDateTime localDate = LocalDateTime.now();
                    UserSubscription userSubscription = UserSubscription.builder()
                            .user(user)
                            .subscriptionType(subscriptionType)
                            .isActive(true)
                            .startDate(localDate)
                            .endDate(null)
                            .build();

                    userSubscriptions.add(userSubscription);

                    user.setSubscriptions(userSubscriptions);

                    userRepository.save(user);
                }
            }
        }
    }

    private void initHashtags() {
        if (hashtagRepository.count() == 0) {
            Hashtag technology = new Hashtag();
            technology.setTag("công nghệ");
            technology.setTotalPost(0);

            Hashtag food = new Hashtag();
            food.setTag("đồ ăn");
            food.setTotalPost(0);

            Hashtag travel = new Hashtag();
            travel.setTag("du lịch");
            travel.setTotalPost(0);

            Hashtag fashion = new Hashtag();
            fashion.setTag("thời trang");
            fashion.setTotalPost(0);

            Hashtag movies = new Hashtag();
            movies.setTag("phim ảnh");
            movies.setTotalPost(0);

            Hashtag education = new Hashtag();
            education.setTag("giáo dục");
            education.setTotalPost(0);

            Hashtag art = new Hashtag();
            art.setTag("hội họa");
            art.setTotalPost(0);

            Hashtag household = new Hashtag();
            household.setTag("gia dụng");
            household.setTotalPost(0);

            Hashtag nature = new Hashtag();
            nature.setTag("tự nhiên");
            nature.setTotalPost(0);

            Hashtag job = new Hashtag();
            job.setTag("nghề nghiệp");
            job.setTotalPost(0);

            Hashtag music = new Hashtag();
            music.setTag("âm nhạc");
            music.setTotalPost(0);

            Hashtag vehicle = new Hashtag();
            vehicle.setTag("xe cộ");
            vehicle.setTotalPost(0);

            Hashtag law = new Hashtag();
            law.setTag("pháp luật");
            law.setTotalPost(0);

            Hashtag science = new Hashtag();
            science.setTag("khoa học");
            science.setTotalPost(0);

            Hashtag sports = new Hashtag();
            sports.setTag("thể thao");
            sports.setTotalPost(0);

            hashtagRepository.saveAll(List.of(technology, food, travel, fashion, movies, education, art, household, nature, job, music, vehicle, law, science, sports));
        }
    }

    private void initReviews() {
        if (reviewRepository.count() == 0) {
            User premiumUser = userRepository.findByUserName("premium_user");
            User regularUser = userRepository.findByUserName("regular_user");

            // Tạo review
            Review techReview = new Review();
            techReview.setTitle("Great new smartphone");
            techReview.setContent("The camera quality is amazing and battery lasts all day");
            techReview.setPerspective("As a photographer");
            techReview.setStatus(EnumReviewStatus.PUBLISHED);
            techReview.setRelevantStar(4.5f);
            techReview.setObjectiveStar(4.0f);
            techReview.setUser(premiumUser);

            Review foodReview = new Review();
            foodReview.setTitle("Disappointing restaurant experience");
            foodReview.setContent("The food was cold and service was slow");
            foodReview.setPerspective("As a food critic");
            foodReview.setStatus(EnumReviewStatus.PENDING);
            foodReview.setRelevantStar(2.0f);
            foodReview.setObjectiveStar(3.0f);
            foodReview.setUser(regularUser);

            Review travelReview = new Review();
            travelReview.setTitle("Beautiful beach destination");
            travelReview.setContent("The water was crystal clear and the sand was perfect");
            travelReview.setPerspective("As a frequent traveler");
            travelReview.setStatus(EnumReviewStatus.PUBLISHED);
            travelReview.setRelevantStar(5.0f);
            travelReview.setObjectiveStar(4.5f);
            travelReview.setUser(premiumUser);

            // Lưu review trước
            reviewRepository.saveAll(List.of(techReview, foodReview, travelReview));

            // Tạo media tương ứng
            List<ReviewMedia> mediaList = new ArrayList<>();

            mediaList.add(createMedia(techReview, "https://www.electronicsforu.com/wp-contents/uploads/2016/07/smartphone-1.jpg", EnumReviewUploadType.IMAGE, 1));
            mediaList.add(createMedia(techReview, "https://fscl01.fonpit.de/userfiles/7687254/image/Best_Smartphones_Mai_2023.jpg", EnumReviewUploadType.IMAGE, 2));

            mediaList.add(createMedia(foodReview, "https://img3.parisbouge.com/W3ucCm-KATQRXVQIB--Uf1Ii3wL0oHrIQ5LPrilYW9s/rs:fill:1500:1000:1/g:ce/M2Q2MTI1OWMtOGNmZS00MzQ3LTlmNDEtM2NmZWNlNWUyYzdmLmpwZw.jpg", EnumReviewUploadType.IMAGE, 1));

            mediaList.add(createMedia(travelReview, "https://www.youtube.com/embed/Kz1_dIN-sjA?si=f8jShfAPWG8NvO1i", EnumReviewUploadType.VIDEO, 1));

            reviewMediaRepository.saveAll(mediaList);
        }
    }

    private ReviewMedia createMedia(Review review, String url, EnumReviewUploadType type, int order) {
        ReviewMedia media = new ReviewMedia();
        media.setReview(review);
        media.setUrlImageGIFVideo(url);
        media.setTypeUploadReview(type);
        media.setOrderDisplay(order);
        return media;
    }

    private void initReviewHashtags() {
        if (reviewHashtagRepository.count() == 0) {
            Review techReview = reviewRepository.findAll().get(0);
            Review foodReview = reviewRepository.findAll().get(1);
            Review travelReview = reviewRepository.findAll().get(2);

            Hashtag technology = hashtagRepository.findByTag("công nghệ");
            Hashtag food = hashtagRepository.findByTag("đồ ăn");
            Hashtag travel = hashtagRepository.findByTag("du lịch");

            ReviewHashtag techTag = new ReviewHashtag();
            techTag.setReview(techReview);
            techTag.setHashtag(technology);

            ReviewHashtag foodTag = new ReviewHashtag();
            foodTag.setReview(foodReview);
            foodTag.setHashtag(food);

            ReviewHashtag travelTag = new ReviewHashtag();
            travelTag.setReview(travelReview);
            travelTag.setHashtag(travel);

            reviewHashtagRepository.saveAll(List.of(techTag, foodTag, travelTag));
        }
    }

    private void initUserHashtags() {
        if (userHashtagRepository.count() == 0) {
            User premiumUser = userRepository.findByUserName("premium_user");
            User regularUser = userRepository.findByUserName("regular_user");

            Hashtag technology = hashtagRepository.findByTag("công nghệ");
            Hashtag food = hashtagRepository.findByTag("đồ ăn");
            Hashtag travel = hashtagRepository.findByTag("du lịch");

            UserHashtag userTech = new UserHashtag();
            userTech.setUser(premiumUser);
            userTech.setHashtag(technology);

            UserHashtag userFood = new UserHashtag();
            userFood.setUser(regularUser);
            userFood.setHashtag(food);

            UserHashtag userTravel = new UserHashtag();
            userTravel.setUser(premiumUser);
            userTravel.setHashtag(travel);

            userHashtagRepository.saveAll(List.of(userTech, userFood, userTravel));
        }
    }

//    private void initComments() {
//        if (commentRepository.count() == 0) {
//            User admin = userRepository.findByUserName("admin");
//            User premiumUser = userRepository.findByUserName("premium_user");
//            Review techReview = reviewRepository.findAll().get(0);
//            Review foodReview = reviewRepository.findAll().get(1);
//
//            Comment mainComment = new Comment();
//            mainComment.setContent("I agree with your review!");
//            mainComment.setUser(admin);
//            mainComment.setReview(techReview);
//
//            Comment replyComment = new Comment();
//            replyComment.setContent("Thanks for your feedback!");
//            replyComment.setUser(premiumUser);
//            replyComment.setReview(techReview);
//            replyComment.setParentComment(mainComment);
//
//            Comment foodComment = new Comment();
//            foodComment.setContent("I had a similar experience last week");
//            foodComment.setUser(premiumUser);
//            foodComment.setReview(foodReview);
//
//            commentRepository.saveAll(List.of(mainComment, replyComment, foodComment));
//        }
//    }

    private void initComments() {
        if (commentRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            User premiumUser = userRepository.findByUserName("premium_user");
            User user1 = userRepository.findByUserName("regular_user");
            User user2 = userRepository.findByUserName("moderator");

            List<Review> reviews = reviewRepository.findAll();
            if (reviews.size() < 2) return;

            Review techReview = reviews.get(0);
            Review foodReview = reviews.get(1);

            List<Comment> comments = new ArrayList<>();

            // ===== Comment cho Tech Review =====
            Comment main1 = new Comment();
            main1.setContent("Bài viết rất hay, cảm ơn bạn!");
            main1.setUser(admin);
            main1.setReview(techReview);
            comments.add(main1);

            Comment reply1_1 = new Comment();
            reply1_1.setContent("Mình cũng thấy vậy.");
            reply1_1.setUser(user1);
            reply1_1.setReview(techReview);
            reply1_1.setParentComment(main1);
            comments.add(reply1_1);

            Comment reply1_2 = new Comment();
            reply1_2.setContent("Tác giả có vẻ rất hiểu chủ đề này.");
            reply1_2.setUser(user2);
            reply1_2.setReview(techReview);
            reply1_2.setParentComment(main1);
            comments.add(reply1_2);

            // Một comment khác (main)
            Comment main2 = new Comment();
            main2.setContent("Mình không đồng tình lắm, thiếu dẫn chứng.");
            main2.setUser(premiumUser);
            main2.setReview(techReview);
            comments.add(main2);

            Comment reply2_1 = new Comment();
            reply2_1.setContent("Mỗi người một quan điểm thôi.");
            reply2_1.setUser(user1);
            reply2_1.setReview(techReview);
            reply2_1.setParentComment(main2);
            comments.add(reply2_1);

            // ===== Comment cho Food Review =====
            Comment foodMain1 = new Comment();
            foodMain1.setContent("Quán này mình ăn rồi, ngon thật.");
            foodMain1.setUser(user1);
            foodMain1.setReview(foodReview);
            comments.add(foodMain1);

            Comment foodReply1 = new Comment();
            foodReply1.setContent("Bạn ăn món gì vậy?");
            foodReply1.setUser(user2);
            foodReply1.setReview(foodReview);
            foodReply1.setParentComment(foodMain1);
            comments.add(foodReply1);

            Comment foodMain2 = new Comment();
            foodMain2.setContent("Chưa ăn nhưng đọc review là thèm rồi.");
            foodMain2.setUser(admin);
            foodMain2.setReview(foodReview);
            comments.add(foodMain2);

            commentRepository.saveAll(comments);
        }
    }

    private void initLikes() {
        if (likeRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            User premiumUser = userRepository.findByUserName("premium_user");
            Review techReview = reviewRepository.findAll().get(0);
            Comment mainComment = commentRepository.findAll().get(0);

            Like reviewLike = new Like();
            reviewLike.setUser(admin);
            reviewLike.setTargetType(EnumTargetType.REVIEW);
            reviewLike.setTargetId(techReview.getReviewID());
            reviewLike.setType(EnumLikeType.LIKE);

            Like commentLike = new Like();
            commentLike.setUser(premiumUser);
            commentLike.setTargetType(EnumTargetType.COMMENT);
            commentLike.setTargetId(mainComment.getCommentID());
            commentLike.setType(EnumLikeType.HEART);

            likeRepository.saveAll(List.of(reviewLike, commentLike));
        }
    }

    private void initRatings() {
        if (ratingRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            User premiumUser = userRepository.findByUserName("premium_user");
            Review techReview = reviewRepository.findAll().get(0);
            Review foodReview = reviewRepository.findAll().get(1);

            Rating techRating = new Rating();
            techRating.setStars(4.5);
            techRating.setUser(admin);
            techRating.setReview(techReview);

            Rating foodRating = new Rating();
            foodRating.setStars(2.0);
            foodRating.setUser(premiumUser);
            foodRating.setReview(foodReview);

            ratingRepository.saveAll(List.of(techRating, foodRating));
        }
    }

    private void initCheckReviewAI() {
        if (checkReviewAIRepository.count() == 0) {
            Review techReview = reviewRepository.findAll().get(0);
            Review foodReview = reviewRepository.findAll().get(1);

            CheckReviewAI techCheck = new CheckReviewAI();
            techCheck.setReview(techReview);
            techCheck.setSentiment(EnumAISentimentType.POSITIVE);
            techCheck.setType(EnumAICheckType.AI);
            techCheck.setRelevance(90);
            techCheck.setObjectivity(85);
            techCheck.setCheckedAt(LocalDateTime.now());
            techCheck.setPoint(8.7);
            techCheck.setBrefContent("Positive review about smartphone");

            CheckReviewAI foodCheck = new CheckReviewAI();
            foodCheck.setReview(foodReview);
            foodCheck.setSentiment(EnumAISentimentType.NEGATIVE);
            foodCheck.setType(EnumAICheckType.AI);
            foodCheck.setRelevance(75);
            foodCheck.setObjectivity(80);
            foodCheck.setCheckedAt(LocalDateTime.now());
            foodCheck.setPoint(5.2);
            foodCheck.setBrefContent("Negative restaurant experience");

            checkReviewAIRepository.saveAll(List.of(techCheck, foodCheck));
        }
    }

    private void initHistoryPoints() {
        if (historyPointRepository.count() == 0) {
            User premiumUser = userRepository.findByUserName("premium_user");
            Review techReview = reviewRepository.findAll().get(0);

            HistoryPoint point = new HistoryPoint();
            point.setUser(premiumUser);
            point.setReview(techReview);
            point.setPoint(10.0);
            point.setDescription("Points earned for review");

            historyPointRepository.save(point);
        }
    }

    private void initSavedReviews() {
        if (savedReviewRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            Review techReview = reviewRepository.findAll().get(0);

            SavedReview saved = new SavedReview();
            saved.setUser(admin);
            saved.setReview(techReview);
            saved.setStatus(true);

            savedReviewRepository.save(saved);
        }
    }

    private void initReports() {
        if (reportRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            Review foodReview = reviewRepository.findAll().get(1);
            Comment foodComment = commentRepository.findAll().get(2);

            Report reviewReport = new Report();
            reviewReport.setContent("This review contains false information");
            reviewReport.setStatus(EnumReportType.PENDING);
            reviewReport.setReview(foodReview);
            reviewReport.setUser(admin);

            Report commentReport = new Report();
            commentReport.setContent("This comment is offensive");
            commentReport.setStatus(EnumReportType.PENDING);
            commentReport.setComment(foodComment);
            commentReport.setUser(admin);

            reportRepository.saveAll(List.of(reviewReport, commentReport));
        }
    }

    private void initNotifications() {
        if (notificationRepository.count() == 0) {
            User premiumUser = userRepository.findByUserName("premium_user");
            Review techReview = reviewRepository.findAll().get(0);
            Comment mainComment = commentRepository.findAll().get(0);
            Like reviewLike = likeRepository.findAll().get(0);

            Notification reviewNotification = new Notification();
            reviewNotification.setContent("Your review has been published");
            reviewNotification.setNotificationType(EnumNotificationType.REVIEW_PUBLISHED);
            reviewNotification.setIsRead(false);
            reviewNotification.setUser(premiumUser);
            reviewNotification.setReview(techReview);

            Notification commentNotification = new Notification();
            commentNotification.setContent("Someone commented on your review");
            commentNotification.setNotificationType(EnumNotificationType.NEW_COMMENT);
            commentNotification.setIsRead(false);
            commentNotification.setUser(premiumUser);
            commentNotification.setReview(techReview);
            commentNotification.setComment(mainComment);

            Notification likeNotification = new Notification();
            likeNotification.setContent("Someone liked your review");
            likeNotification.setNotificationType(EnumNotificationType.NEW_LIKE);
            likeNotification.setIsRead(false);
            likeNotification.setUser(premiumUser);
            likeNotification.setReview(techReview);
            likeNotification.setLike(reviewLike);

            notificationRepository.saveAll(List.of(
                    reviewNotification,
                    commentNotification,
                    likeNotification
            ));
        }
    }

    private void initAdvertises() {
        if (advertiseRepository.count() == 0) {
            Advertise techAd = new Advertise();
            techAd.setPrice(1000f);
            techAd.setStatus("ACTIVE");
            techAd.setDuration(30L);
            techAd.setName("Tech Gadgets");
            techAd.setUrl("https://example.com/ads/tech");
            techAd.setType(EnumAdvertiseType.MONTH);

            Advertise foodAd = new Advertise();
            foodAd.setPrice(800f);
            foodAd.setStatus("ACTIVE");
            foodAd.setDuration(15L);
            foodAd.setName("Food Delivery");
            foodAd.setUrl("https://example.com/ads/food");
            foodAd.setType(EnumAdvertiseType.YEAR);

            advertiseRepository.saveAll(List.of(techAd, foodAd));
        }
    }
}
