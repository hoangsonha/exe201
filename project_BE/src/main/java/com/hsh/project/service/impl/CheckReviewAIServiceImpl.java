package com.hsh.project.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsh.project.dto.ReviewSummaryResult;
import com.hsh.project.pojo.*;
import com.hsh.project.pojo.enums.*;
import com.hsh.project.repository.*;
import com.hsh.project.service.spec.*;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import okhttp3.MediaType;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CheckReviewAIServiceImpl implements CheckReviewAIService {
    private static final Logger logger = LoggerFactory.getLogger(CheckReviewAIServiceImpl.class);

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

    private final ObjectMapper mapper;
    private final CheckReviewAIRepository checkReviewAIRepository;

    @Value("${huggingface.api.token}")
    private String apiTokenHuggingface;

    @Value("${openrouter.api.token}")
    private String apiTokenOpenrouter;

    @Override
    public Review checkReview(Review review) {
        List<String> imageUrls = new ArrayList<>();
        String videoUrl = null;

        if (review.getReviewMedias() != null) {
            for (ReviewMedia media : review.getReviewMedias()) {
                if (media.getTypeUploadReview() == EnumReviewUploadType.VIDEO) {
                    videoUrl = media.getUrlImageGIFVideo();
                } else {
                    imageUrls.add(media.getUrlImageGIFVideo());
                }
            }

            List<String> imageCaptions = new ArrayList<>();

            for (String imageUrl : imageUrls) {
//                byte[] imageBytes = fetchImageFromFirebase(imageUrl);
//                imageCaptions.add(extractLabels(imageBytes).stream().collect(Collectors.joining(", ")));
                imageCaptions.add(getHfCaption(imageUrl));

            }

            String resultImageCaption = "";
            for (int i = 0; i < imageCaptions.size(); i++) {
                String com = " và ";
                if (i == imageCaptions.size() -1) {
                    com = ".";
                }
                resultImageCaption = "ảnh thứ " + (i + 1) + " có caption là: " + imageCaptions.get(i) + com;
            }

            ReviewSummaryResult reviewSummaryResult = summarizeReview(review.getTitle(), review.getContent(), resultImageCaption);
            String perspective = reviewSummaryResult.getPerspective();
            Float relevantResult = reviewSummaryResult.getRelevantStar();
            Float objectiveStar = reviewSummaryResult.getRelevantStar();
            String summary = reviewSummaryResult.getSummary();

            review.setPerspective(perspective);
            review.setRelevantStar(relevantResult);
            review.setObjectiveStar(objectiveStar);
            review.setSummary(summary);

        } else {
            try {
                ReviewSummaryResult reviewSummaryResult = summarizeReview(review.getTitle(), review.getContent(), null);

                String perspective = reviewSummaryResult.getPerspective();
                Float relevantResult = reviewSummaryResult.getRelevantStar();
                Float objectiveStar = reviewSummaryResult.getRelevantStar();
                String summary = reviewSummaryResult.getSummary();

                review.setPerspective(perspective);
                review.setRelevantStar(relevantResult);
                review.setObjectiveStar(objectiveStar);
                review.setSummary(summary);

            } catch (Exception e) {
                logger.error("AI Service Error: ", e);
                review.setPerspective("TRUNG LẬP");
                review.setRelevantStar(3.0f);
                review.setObjectiveStar(3.0f);
                review.setSummary("Không thể tạo tóm tắt tự động");
            }
        }
        return review;
    }

    public String getHfCaption(String imageUrl) {

        JSONObject body = new JSONObject();
        body.put("image_url", imageUrl);

        Request request = new Request.Builder()
//                .url("http://localhost:5000/caption")
                .url("http://103.176.24.249:5000/caption")
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(body.toString(), MediaType.parse("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {

            if (!response.isSuccessful()) {
                throw new IOException("Unexpected response: " + response);
            }

            String json = response.body().string();
            JSONObject result = new JSONObject(json);
            return result.getString("caption");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public ReviewSummaryResult summarizeReview(String title, String content, String imageCaption) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiTokenOpenrouter);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        String prompt = buildPrompt(title, content, null);

        if (imageCaption != null) {
            prompt = buildPrompt(title, content, imageCaption);
        }

        Map<String, Object> requestBody = Map.of(
                "model", "meta-llama/llama-3-8b-instruct",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity("https://openrouter.ai/api/v1/chat/completions", request, Map.class);

        Map<String, Object> body = response.getBody();
        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String contentReply = (String) message.get("content");

        return parseResponse(contentReply);
    }

    private String buildPrompt(String title, String content, String imageCaption) {
        if (imageCaption != null) {
            return """
                Bạn là một hệ thống phân tích đánh giá người dùng trên nền tảng thương mại điện tử, có khả năng hiểu được cả văn bản và hình ảnh.
                
                Nhiệm vụ của bạn là: Dựa trên một bài đánh giá bao gồm **tiêu đề (title)**, **nội dung chi tiết (content)**, và **mô tả nội dung hình ảnh (imageCaption) với caption ngắn của hình ảnh bằng tiếng anh**, hãy phân tích và phản hồi duy nhất dưới dạng JSON với đầy đủ 4 trường sau và trả ra kết quả bằng tiếng việt:
                
                1. `"perspective"`: đánh giá tổng thể của người viết là tích cực, tiêu cực hay trung lập. Trả về một trong ba chuỗi: `"tích cực"`, `"tiêu cực"`, hoặc `"trung lập"`.
                2. `"relevantStar"`: số sao phù hợp với nội dung người dùng muốn truyền tải, có thể suy luận từ cả nội dung và hình ảnh. Giá trị là **số thực** từ 1.0 đến 5.0.
                3. `"objectiveStar"`: đánh giá theo độ hợp lý giữa tiêu đề, nội dung và ảnh minh họa. Nếu hình ảnh mâu thuẫn hoặc làm rõ hơn nội dung, hãy phản ánh vào điểm số này. Cũng là số thực từ 1.0 đến 5.0.
                4. `"summary"`: tóm tắt ngắn gọn nhất có thể nội dung của cả `title`, `content`, và `imageCaption` — tối đa 2 câu, dưới 300 ký tự.
                
                ⚠️ **Yêu cầu bắt buộc:**
                - Chỉ trả về **duy nhất** một object JSON, không thêm bất kỳ giải thích, chú thích, hay dòng mô tả nào khác.
                - Format JSON phải **đúng chuẩn**, không thiếu dấu ngoặc, dấu phẩy, hay dấu ngoặc kép.
                
                ---
                
                Dưới đây là thông tin bài review:
                
                Title: %s
                
                Content: %s
                
                Image Caption (từ ảnh đính kèm): %s
                
                Hãy trả về kết quả JSON dưới định dạng:
                {
                  "perspective": "...",
                  "relevantStar": ...,
                  "objectiveStar": ...,
                  "summary": "..."
                }
                """.formatted(title, content, imageCaption);
        }

        return """
                Bạn là một hệ thống phân tích đánh giá người dùng trên nền tảng thương mại điện tử.
                
                Nhiệm vụ của bạn là: Dựa trên một bài đánh giá bao gồm **title** và **content**, hãy phân tích và phản hồi duy nhất dưới dạng JSON với đầy đủ 4 trường sau:
                
                1. "perspective": đánh giá tổng thể của người viết là tích cực, tiêu cực hay trung lập. Trả về một trong ba chuỗi: "tích cực", "tiêu cực", "trung lập".
                2. "relevantStar": số sao tương ứng với nội dung mà người dùng thật sự muốn truyền tải, **dù họ không nói rõ**. Giá trị là số thực từ 1.0 đến 5.0.
                3. "objectiveStar": số sao đánh giá khách quan dựa trên **mức độ hợp lý giữa tiêu đề và nội dung**, tức có mâu thuẫn hay khớp nhau không. Giá trị cũng là số thực từ 1.0 đến 5.0.
                4. "summary": tóm tắt súc tích nhất có thể nội dung **title** và **content** (tối đa 2 câu, dưới 300 ký tự).
                
                ⚠️ **Yêu cầu quan trọng:**
                - Chỉ trả về **duy nhất** một object JSON, không thêm bất kỳ dòng giải thích, ghi chú, hay mô tả nào.
                - Format JSON phải đúng chuẩn, không thiếu dấu ngoặc hoặc dấu phẩy.
                
                ---
                
                Dưới đây là một bài review cần bạn phân tích:
                
                Title: %s
                
                Content: %s
                
                Hãy trả kết quả JSON:
                {
                  "perspective": "...",
                  "relevantStar": ...,
                  "objectiveStar": ...,
                  "summary": "..."
                }
                """.formatted(title, content);
    }

    private ReviewSummaryResult parseResponse(String contentReply) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            int jsonStart = contentReply.indexOf("{");
            int jsonEnd = contentReply.lastIndexOf("}") + 1;

            if (jsonStart == -1 || jsonEnd == -1) {
                throw new RuntimeException("Không tìm thấy JSON trong phản hồi: " + contentReply);
            }

            String jsonPart = contentReply.substring(jsonStart, jsonEnd);

            return mapper.readValue(jsonPart, ReviewSummaryResult.class);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi parse kết quả từ AI: " + contentReply, e);
        }
    }


    public byte[] fetchImageFromFirebase(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            return out.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Không thể tải ảnh từ Firebase", e);
        }
    }

}