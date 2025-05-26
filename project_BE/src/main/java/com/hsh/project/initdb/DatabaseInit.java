package com.hsh.project.initdb;

import com.hsh.project.pojo.*;
import com.hsh.project.pojo.enums.*;
import com.hsh.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

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

            SubscriptionType premiumMonthly = new SubscriptionType();
            premiumMonthly.setName("Premium Monthly");
            premiumMonthly.setPrice(9.99f);
            premiumMonthly.setDuration(30);

            SubscriptionType premiumYearly = new SubscriptionType();
            premiumYearly.setName("Premium Yearly");
            premiumYearly.setPrice(99.99f);
            premiumYearly.setDuration(365);

            subscriptionTypeRepository.saveAll(List.of(free, premiumMonthly, premiumYearly));
        }
    }

    private void initUserSubscriptions() {
        if (userSubscriptionRepository.count() == 0) {
            User premiumUser = userRepository.findByUserName("premium_user");
            SubscriptionType premiumMonthly = subscriptionTypeRepository.findByName("Premium Monthly");

            UserSubscription subscription = new UserSubscription();
            subscription.setUser(premiumUser);
            subscription.setSubscriptionType(premiumMonthly);
            subscription.setStartDate(LocalDateTime.now());
            subscription.setEndDate(LocalDateTime.now().plusDays(30));
            subscription.setIsActive(true);

            userSubscriptionRepository.save(subscription);
        }
    }

    private void initHashtags() {
        if (hashtagRepository.count() == 0) {
            Hashtag technology = new Hashtag();
            technology.setTag("technology");
            technology.setTotalPost(0);

            Hashtag food = new Hashtag();
            food.setTag("food");
            food.setTotalPost(0);

            Hashtag travel = new Hashtag();
            travel.setTag("travel");
            travel.setTotalPost(0);

            Hashtag fashion = new Hashtag();
            fashion.setTag("fashion");
            fashion.setTotalPost(0);

            hashtagRepository.saveAll(List.of(technology, food, travel, fashion));
        }
    }

    private void initReviews() {
        if (reviewRepository.count() == 0) {
            User premiumUser = userRepository.findByUserName("premium_user");
            User regularUser = userRepository.findByUserName("regular_user");

            Review techReview = new Review();
            techReview.setTitle("Great new smartphone");
            techReview.setContent("The camera quality is amazing and battery lasts all day");
            techReview.setUrlImageGIFVideo("smartphone.jpg");
            techReview.setPerspective("As a photographer");
            techReview.setStatus(EnumReviewStatus.PUBLISHED);
            techReview.setRelevantStar(4.5f);
            techReview.setObjectiveStar(4.0f);
            techReview.setUser(premiumUser);

            Review foodReview = new Review();
            foodReview.setTitle("Disappointing restaurant experience");
            foodReview.setContent("The food was cold and service was slow");
            foodReview.setUrlImageGIFVideo("restaurant.jpg");
            foodReview.setPerspective("As a food critic");
            foodReview.setStatus(EnumReviewStatus.ACTIVATED);
            foodReview.setRelevantStar(2.0f);
            foodReview.setObjectiveStar(3.0f);
            foodReview.setUser(regularUser);

            Review travelReview = new Review();
            travelReview.setTitle("Beautiful beach destination");
            travelReview.setContent("The water was crystal clear and the sand was perfect");
            travelReview.setUrlImageGIFVideo("beach.mp4");
            travelReview.setPerspective("As a frequent traveler");
            travelReview.setStatus(EnumReviewStatus.ACTIVATED);
            travelReview.setRelevantStar(5.0f);
            travelReview.setObjectiveStar(4.5f);
            travelReview.setUser(premiumUser);

            reviewRepository.saveAll(List.of(techReview, foodReview, travelReview));
        }
    }

    private void initReviewHashtags() {
        if (reviewHashtagRepository.count() == 0) {
            Review techReview = reviewRepository.findAll().get(0);
            Review foodReview = reviewRepository.findAll().get(1);
            Review travelReview = reviewRepository.findAll().get(2);

            Hashtag technology = hashtagRepository.findByTag("technology");
            Hashtag food = hashtagRepository.findByTag("food");
            Hashtag travel = hashtagRepository.findByTag("travel");

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

            Hashtag technology = hashtagRepository.findByTag("technology");
            Hashtag food = hashtagRepository.findByTag("food");
            Hashtag travel = hashtagRepository.findByTag("travel");

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

    private void initComments() {
        if (commentRepository.count() == 0) {
            User admin = userRepository.findByUserName("admin");
            User premiumUser = userRepository.findByUserName("premium_user");
            Review techReview = reviewRepository.findAll().get(0);
            Review foodReview = reviewRepository.findAll().get(1);

            Comment mainComment = new Comment();
            mainComment.setContent("I agree with your review!");
            mainComment.setUser(admin);
            mainComment.setReview(techReview);

            Comment replyComment = new Comment();
            replyComment.setContent("Thanks for your feedback!");
            replyComment.setUser(premiumUser);
            replyComment.setReview(techReview);
            replyComment.setParentComment(mainComment);

            Comment foodComment = new Comment();
            foodComment.setContent("I had a similar experience last week");
            foodComment.setUser(premiumUser);
            foodComment.setReview(foodReview);

            commentRepository.saveAll(List.of(mainComment, replyComment, foodComment));
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
