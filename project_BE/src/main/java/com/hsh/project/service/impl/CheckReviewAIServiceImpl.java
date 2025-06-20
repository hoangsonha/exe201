//package com.hsh.project.service.impl;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.node.ArrayNode;
//import com.fasterxml.jackson.databind.node.ObjectNode;
//import com.hsh.project.pojo.Review;
//import com.hsh.project.pojo.ReviewMedia;
//import com.hsh.project.pojo.enums.EnumReviewUploadType;
//import com.hsh.project.repository.ReviewRepository;
//import com.hsh.project.service.spec.CheckReviewAIService;
//import lombok.RequiredArgsConstructor;
//import okhttp3.*;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.InputStreamReader;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.concurrent.TimeUnit;
//
//@Service
//@RequiredArgsConstructor
//public class CheckReviewAIServiceImpl implements CheckReviewAIService {
//
//    private final OkHttpClient client = new OkHttpClient.Builder()
//            .connectTimeout(30, TimeUnit.SECONDS)
//            .readTimeout(30, TimeUnit.SECONDS)
//            .build();
//    private final ObjectMapper mapper = new ObjectMapper();
//
//    @Value("${huggingface.api.token}")
//    private String apiToken;
//
//    @Override
//    public Review checkReview(Review review) {
//
//        String combinedText = review.getTitle() + ". " + review.getContent();
//
//        String urlVideo = "";
//
//        List<String> urlsImage = new ArrayList<>();
//
//        List<ReviewMedia> lists = review.getReviewMedias();
//
//        for (ReviewMedia reviewMedia : lists) {
//            if (reviewMedia.getTypeUploadReview().equals(EnumReviewUploadType.VIDEO)) {
//                urlVideo = reviewMedia.getUrlImageGIFVideo();
//            } else {
//                urlsImage.add(reviewMedia.getUrlImageGIFVideo());
//            }
//        }
//
//        try {
//            String perspective = getPerspective(combinedText);
//            int relevantStar = getRelevantStar(combinedText, urlsImage, urlVideo);
//            Integer objectiveStar = getObjectiveStar(combinedText);
//            String summary = getSummary(combinedText);
//
//            if (objectiveStar != null) {
//                review.setObjectiveStar((float) objectiveStar);
//            }
//            review.setRelevantStar((float) relevantStar);
//            review.setPerspective(perspective);
//            review.setSummary(summary);
//
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//        }
//
//        return review;
//    }
//
//    private String getPerspective(String text) throws IOException {
//        String url = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";
//
//        ObjectNode requestJson = mapper.createObjectNode();
//        requestJson.put("inputs", sanitizeText(text));
//
//        RequestBody body = RequestBody.create(
//                MediaType.parse("application/json"),
//                requestJson.toString()
//        );
//
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", "Bearer " + apiToken)
//                .post(body)
//                .build();
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                throw new IOException("Hugging Face API error: " + response.code() + " - " + response.body().string());
//            }
//
//            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
//            JsonNode scores = json.get(0);
//
//            int predictedStar = 3;
//            double maxScore = 0;
//
//            for (JsonNode node : scores) {
//                String label = node.get("label").asText(); // e.g., "5 stars"
//                double score = node.get("score").asDouble();
//                int stars = Integer.parseInt(label.substring(0, 1));
//                if (score > maxScore) {
//                    maxScore = score;
//                    predictedStar = stars;
//                }
//            }
//
//            if (predictedStar >= 4) return "TÍCH CỰC";
//            if (predictedStar == 3) return "TRUNG LẬP";
//            return "TIÊU CỰC";
//        }
//    }
//
//    private String sanitizeText(String text) {
//        return text.replaceAll("[\\x00-\\x1F\\x7F]", "");
//    }
//
//    private Integer getObjectiveStar(String text) throws IOException {
//        String url = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";
//
//        ObjectNode requestJson = mapper.createObjectNode();
//        requestJson.put("inputs", sanitizeText(text));
//
//        RequestBody body = RequestBody.create(
//                MediaType.parse("application/json"),
//                requestJson.toString()
//        );
//
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", "Bearer " + apiToken)
//                .post(body)
//                .build();
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                String errorBody = response.body().string();
//                throw new IOException("Hugging Face API error: " + response.code() + " - " + errorBody);
//            }
//
//            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
//            JsonNode scores = json.get(0);
//
//            int predictedStar = 3;
//            double maxScore = 0;
//
//            for (JsonNode node : scores) {
//                String label = node.get("label").asText(); // e.g., "5 stars"
//                double score = node.get("score").asDouble();
//                int stars = Integer.parseInt(label.substring(0, 1));
//                if (score > maxScore) {
//                    maxScore = score;
//                    predictedStar = stars;
//                }
//            }
//
//            // Đảo ngược score vì khách quan = ít cảm xúc (gần 3 sao nhất là khách quan nhất)
//            int objectiveScore = 5 - Math.abs(predictedStar - 3); // Max = 5 khi = 3 sao
//            return Math.max(1, Math.min(5, objectiveScore));
//        }
//    }
//
//    private int getRelevantStar(String text, List<String> imageUrls, String videoUrl) throws IOException {
//        List<String> command = new ArrayList<>();
//        command.add("python");
//        command.add("clip_processor.py");
//        command.add(text);
//
//        if (imageUrls != null) {
//            command.addAll(imageUrls);
//        }
//
//        // Nếu videoUrl rỗng/null thì vẫn truyền vào chuỗi rỗng
//        command.add(videoUrl != null ? videoUrl : "");
//
//        ProcessBuilder pb = new ProcessBuilder(command);
//        pb.redirectErrorStream(true); // Gộp cả stdout và stderr
//
//        Process process = pb.start();
//
//        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//        String line;
//        int star = 3; // Mặc định
//
//        while ((line = reader.readLine()) != null) {
//            try {
//                star = Integer.parseInt(line.trim());
//            } catch (NumberFormatException ignored) {
//                // Không xử lý được thì bỏ qua dòng này
//            }
//        }
//
//        try {
//            process.waitFor();
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//
//        return Math.max(1, Math.min(5, star)); // Clamp từ 1 -> 5
//    }
//
//    private String getSummary(String text) throws IOException {
//        String url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
//
//        ObjectNode requestJson = mapper.createObjectNode();
//        requestJson.put("inputs", text);
//        ObjectNode parameters = requestJson.putObject("parameters");
//        parameters.put("max_length", 50);
//        parameters.put("min_length", 20);
//        parameters.put("do_sample", false);
//
//        RequestBody body = RequestBody.create(
//                MediaType.parse("application/json"),
//                requestJson.toString()
//        );
//
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", "Bearer " + apiToken)
//                .post(body)
//                .build();
//
//        try (Response response = client.newCall(request).execute()) {
//            if (!response.isSuccessful()) {
//                throw new IOException("Summary API error: " + response.code() + " - " + response.body().string());
//            }
//
//            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
//            return json.get(0).get("summary_text").asText();
//        }
//    }
//
//}

//

package com.hsh.project.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hsh.project.pojo.*;
import com.hsh.project.pojo.enums.*;
import com.hsh.project.repository.*;
import com.hsh.project.service.spec.*;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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
    private String apiToken;

    @Override
    public Review checkReview(Review review) {
        String combinedText = review.getTitle() + ". " + review.getContent();
        List<String> imageUrls = new ArrayList<>();
        String videoUrl = null;

        // Phân loại media
        for (ReviewMedia media : review.getReviewMedias()) {
            if (media.getTypeUploadReview() == EnumReviewUploadType.VIDEO) {
                videoUrl = media.getUrlImageGIFVideo();
            } else {
                imageUrls.add(media.getUrlImageGIFVideo());
            }
        }

        try {
            // Gọi các service AI
            String perspective = getPerspective(combinedText);
            RelevantStarResult relevantResult = getRelevantStar(combinedText, imageUrls, videoUrl);
            Integer objectiveStar = getObjectiveStar(combinedText);
            String summary = getMultimodalSummary(combinedText, imageUrls, videoUrl);

            // Tính toán và lưu kết quả
            double avgSimilarity = relevantResult.getSimilarities().stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.5);

            saveToCheckReviewAI(review, avgSimilarity, relevantResult.getSimilarities());

            // Cập nhật review
            review.setPerspective(perspective);
            review.setRelevantStar((float) (avgSimilarity * 5));
            review.setObjectiveStar(objectiveStar != null ? (float) objectiveStar : 3.0f);
            review.setSummary(summary);

        } catch (Exception e) {
            logger.error("AI Service Error: ", e);
            review.setPerspective("TRUNG LẬP");
            review.setRelevantStar(3.0f);
            review.setObjectiveStar(3.0f);
            review.setSummary("Không thể tạo tóm tắt tự động");
        }

        return review;
    }


    private Integer getObjectiveStar(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";

        ObjectNode requestJson = mapper.createObjectNode();
        requestJson.put("inputs", sanitizeText(text));

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"),
                requestJson.toString()
        );

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiToken)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body().string();
                throw new IOException("Hugging Face API error: " + response.code() + " - " + errorBody);
            }

            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
            JsonNode scores = json.get(0);

            int predictedStar = 3;
            double maxScore = 0;

            for (JsonNode node : scores) {
                String label = node.get("label").asText(); // e.g., "5 stars"
                double score = node.get("score").asDouble();
                int stars = Integer.parseInt(label.substring(0, 1));
                if (score > maxScore) {
                    maxScore = score;
                    predictedStar = stars;
                }
            }

            // Đảo ngược score vì khách quan = ít cảm xúc (gần 3 sao nhất là khách quan nhất)
            int objectiveScore = 5 - Math.abs(predictedStar - 3); // Max = 5 khi = 3 sao
            return Math.max(1, Math.min(5, objectiveScore));
        }
    }

    private String getPerspective(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";

        ObjectNode requestJson = mapper.createObjectNode();
        requestJson.put("inputs", sanitizeText(text));

        Request request = buildHuggingFaceRequest(url, requestJson);

        try (Response response = client.newCall(request).execute()) {
            validateResponse(response);
            JsonNode scores = mapper.readTree(response.body().string()).get(0);

            int predictedStar = 3;
            double maxScore = 0;

            for (JsonNode node : scores) {
                String label = node.get("label").asText();
                double score = node.get("score").asDouble();
                int stars = Integer.parseInt(label.substring(0, 1));
                if (score > maxScore) {
                    maxScore = score;
                    predictedStar = stars;
                }
            }

            return convertToPerspective(predictedStar);
        }
    }

    private RelevantStarResult getRelevantStar(String text, List<String> imageUrls, String videoUrl) throws IOException {
        List<String> command = new ArrayList<>(Arrays.asList(
                "python",
                "-W", "ignore",
                "clip_processor.py",
                text
        ));

        // Thêm URLs ảnh
        if (imageUrls.isEmpty()) {
            command.add("null");
        } else {
            command.addAll(imageUrls);
        }

        // Thêm URL video
        command.add(videoUrl != null ? videoUrl : "null");

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);

        try {
            Process process = pb.start();
            String output = captureProcessOutput(process);

            int exitCode = process.waitFor();
            JsonNode result = mapper.readTree(extractJson(output));

            validatePythonResult(exitCode, result);

            return parseRelevantStarResult(result);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Process interrupted", e);
        }
    }

    private String getMultimodalSummary(String text, List<String> imageUrls, String videoUrl) throws IOException {
        // Bước 1: Chuẩn hóa text đầu vào
        String normalizedText = normalizeVietnameseText(text);

        // Bước 2: Xây dựng context
        String context = buildSummaryContext(normalizedText, imageUrls, videoUrl);

        // Bước 3: Gọi API với encoding chuẩn
        String url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

        ObjectNode requestJson = mapper.createObjectNode();
        requestJson.put("inputs", context);

        ObjectNode parameters = requestJson.putObject("parameters");
        parameters.put("max_length", 120);  // Tăng độ dài để đủ chứa tiếng Việt
        parameters.put("min_length", 50);
        parameters.put("do_sample", false);
        parameters.put("clean_up_tokenization_spaces", true);

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + apiToken)
                .header("Content-Type", "application/json; charset=utf-8")
                .post(RequestBody.create(
                        requestJson.toString().getBytes(StandardCharsets.UTF_8),
                        MediaType.parse("application/json; charset=utf-8")
                ))
                .build();

        try (Response response = client.newCall(request).execute()) {
            validateResponse(response);

            // Bước 4: Xử lý response với encoding UTF-8
            String responseBody = new String(response.body().bytes(), StandardCharsets.UTF_8);
            JsonNode json = mapper.readTree(responseBody);

            // Bước 5: Chuẩn hóa kết quả
            String summary = json.get(0).get("summary_text").asText();
            return cleanVietnameseText(summary);
        }
    }

    // ===== Các phương thức helper mới =====
    private String normalizeVietnameseText(String text) {
        // Chuẩn hóa các ký tự tiếng Việt phổ biến
        return text.replaceAll("[\\x00-\\x1F\\x7F]", "")
                .replaceAll("[ạảãàáâậầấẩẫăắằặẳẵ]", "a")
                .replaceAll("[ẠẢÃÀÁÂẬẦẤẨẪĂẮẰẶẲẴ]", "A")
                .replaceAll("[đ]", "d")
                .replaceAll("[Đ]", "D")
                .replaceAll("[ệểễèéêềếểễë]", "e")
                .replaceAll("[ỆỂỄÈÉÊỀẾỂỄË]", "E")
                .replaceAll("[ịỉĩìíîï]", "i")
                .replaceAll("[ỊỈĨÌÍÎÏ]", "I")
                .replaceAll("[ọỏõòóôộồốổỗơớờợởỡ]", "o")
                .replaceAll("[ỌỎÕÒÓÔỘỒỐỔỖƠỚỜỢỞỠ]", "O")
                .replaceAll("[ụủũùúûưứừựửữ]", "u")
                .replaceAll("[ỤỦŨÙÚÛƯỨỪỰỬỮ]", "U")
                .replaceAll("[ỳýỵỷỹ]", "y")
                .replaceAll("[ỲÝỴỶỸ]", "Y")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private String cleanVietnameseText(String text) {
        // Lọc các ký tự lạ nhưng giữ lại tiếng Việt
        return text.replaceAll("[^\\p{L}\\p{M}\\p{N}\\p{P}\\p{Z}\\p{Cf}\\p{Cs}\\s]", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

//    private String getMultimodalSummary(String text, List<String> imageUrls, String videoUrl) throws IOException {
//        String context = buildSummaryContext(text, imageUrls, videoUrl);
//        String url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
//
//        ObjectNode requestJson = mapper.createObjectNode();
//        requestJson.put("inputs", context);
//
//        ObjectNode parameters = requestJson.putObject("parameters");
//        parameters.put("max_length", 150);
//        parameters.put("min_length", 30);
//        parameters.put("do_sample", false);
//        parameters.put("clean_up_tokenization_spaces", true);
//
//        Request request = buildHuggingFaceRequest(url, requestJson);
//
//        try (Response response = client.newCall(request).execute()) {
//            validateResponse(response);
//            String responseBody = response.body().string();
//            return mapper.readTree(responseBody)
//                    .get(0)
//                    .get("summary_text")
//                    .asText();
//        }
//    }

    // ===== Các phương thức helper =====
    private String sanitizeText(String text) {
        return text.replaceAll("[\\x00-\\x1F\\x7F]", "");
    }

    private Request buildHuggingFaceRequest(String url, ObjectNode requestJson) {
        return new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiToken)
                .post(RequestBody.create(
                        requestJson.toString(),
                        MediaType.parse("application/json")
                ))
                .build();
    }

    private void validateResponse(Response response) throws IOException {
        if (!response.isSuccessful()) {
            throw new IOException("API error: " + response.code() + " - " +
                    (response.body() != null ? response.body().string() : "No body"));
        }
    }

    private String convertToPerspective(int predictedStar) {
        if (predictedStar >= 4) return "TÍCH CỰC";
        if (predictedStar == 3) return "TRUNG LẬP";
        return "TIÊU CỰC";
    }

    private String buildSummaryContext(String text, List<String> imageUrls, String videoUrl) {
        StringBuilder context = new StringBuilder(text);
        if (!imageUrls.isEmpty() || videoUrl != null) {
            context.append(" [Media: ");
            if (!imageUrls.isEmpty()) context.append(imageUrls.size()).append(" ảnh ");
            if (videoUrl != null) context.append("1 video");
            context.append("]");
        }
        return context.toString();
    }

    private String captureProcessOutput(Process process) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

    private String extractJson(String output) throws IOException {
        // Tìm dòng JSON cuối cùng
        String[] lines = output.split("\n");
        for (int i = lines.length - 1; i >= 0; i--) {
            String line = lines[i].trim();
            if (line.startsWith("{") && line.endsWith("}")) {
                return line;
            }
        }
        throw new IOException("No valid JSON found in Python output");
    }

    private void validatePythonResult(int exitCode, JsonNode result) throws IOException {
        if (exitCode != 0 || !result.path("status").asText().equals("success")) {
            String errorMsg = result.path("error").asText();
            throw new IOException("Python script failed: " +
                    (errorMsg.isEmpty() ? "Unknown error" : errorMsg));
        }
    }

    private RelevantStarResult parseRelevantStarResult(JsonNode result) {
        int star = result.path("relevant_star").asInt();
        List<Double> similarities = new ArrayList<>();
        result.path("media_similarities").forEach(sim ->
                similarities.add(sim.asDouble()));
        return new RelevantStarResult(star, similarities);
    }

    private void saveToCheckReviewAI(Review review, double avgSimilarity, List<Double> similarities) {
        try {
            CheckReviewAI aiAnalysis = Optional.ofNullable(review.getCheckReviewAI())
                    .orElseGet(() -> {
                        CheckReviewAI newAnalysis = new CheckReviewAI();
                        newAnalysis.setReview(review);
                        newAnalysis.setType(EnumAICheckType.AI);
                        return newAnalysis;
                    });

            aiAnalysis.setPoint(avgSimilarity * 5);
            aiAnalysis.setBrefContent(mapper.writeValueAsString(similarities));
            aiAnalysis.setRelevance((int) (avgSimilarity * 100));
            aiAnalysis.setCheckedAt(LocalDateTime.now());

            checkReviewAIRepository.save(aiAnalysis);
        } catch (Exception e) {
            logger.error("Failed to save CheckReviewAI", e);
        }
    }

    @RequiredArgsConstructor
    private static class RelevantStarResult {
        private final int relevantStar;
        private final List<Double> similarities;

        public int getRelevantStar() { return relevantStar; }
        public List<Double> getSimilarities() { return similarities; }
    }
}