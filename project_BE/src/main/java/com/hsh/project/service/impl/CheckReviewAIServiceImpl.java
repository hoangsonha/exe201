package com.hsh.project.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hsh.project.pojo.Review;
import com.hsh.project.pojo.ReviewMedia;
import com.hsh.project.pojo.enums.EnumReviewUploadType;
import com.hsh.project.repository.ReviewRepository;
import com.hsh.project.service.spec.CheckReviewAIService;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CheckReviewAIServiceImpl implements CheckReviewAIService {

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${huggingface.api.token}")
    private String apiToken;

    @Override
    public Review checkReview(Review review) {

        String combinedText = review.getTitle() + ". " + review.getContent();

        String urlVideo = "";

        List<String> urlsImage = new ArrayList<>();

        List<ReviewMedia> lists = review.getReviewMedias();

        for (ReviewMedia reviewMedia : lists) {
            if (reviewMedia.getTypeUploadReview().equals(EnumReviewUploadType.VIDEO)) {
                urlVideo = reviewMedia.getUrlImageGIFVideo();
            } else {
                urlsImage.add(reviewMedia.getUrlImageGIFVideo());
            }
        }

        try {
            String perspective = getPerspective(combinedText);
            int relevantStar = getRelevantStar(combinedText, urlsImage, urlVideo);
            Integer objectiveStar = getObjectiveStar(combinedText);
            String summary = getSummary(combinedText);

            if (objectiveStar != null) {
                review.setObjectiveStar((float) objectiveStar);
            }
            review.setRelevantStar((float) relevantStar);
            review.setPerspective(perspective);
            review.setSummary(summary);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return review;
    }

    private String getPerspective(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"),
                "{\"inputs\": \"" + text.replace("\"", "\\\"") + "\"}"
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
            JsonNode scores = json.get(0); // list of {"label": "X stars", "score": ...}

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

            // Trả lại nhãn như: POSITIVE / NEGATIVE / NEUTRAL tương ứng với số sao
            if (predictedStar >= 4) return "POSITIVE";
            if (predictedStar == 3) return "NEUTRAL";
            return "NEGATIVE";
        }
    }

    private Integer getObjectiveStar(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment";

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"),
                "{\"inputs\": \"" + text.replace("\"", "\\\"") + "\"}"
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


    private int getRelevantStar(String text, List<String> imageUrls, String videoUrl) throws IOException {
        List<String> command = new ArrayList<>();
        command.add("python");
        command.add("clip_processor.py");
        command.add(text);

        if (imageUrls != null) {
            command.addAll(imageUrls);
        }

        // Nếu videoUrl rỗng/null thì vẫn truyền vào chuỗi rỗng
        command.add(videoUrl != null ? videoUrl : "");

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true); // Gộp cả stdout và stderr

        Process process = pb.start();

        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        int star = 3; // Mặc định

        while ((line = reader.readLine()) != null) {
            try {
                star = Integer.parseInt(line.trim());
            } catch (NumberFormatException ignored) {
                // Không xử lý được thì bỏ qua dòng này
            }
        }

        try {
            process.waitFor();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return Math.max(1, Math.min(5, star)); // Clamp từ 1 -> 5
    }

    private String getSummary(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

        ObjectNode requestJson = mapper.createObjectNode();
        requestJson.put("inputs", text);
        ObjectNode parameters = requestJson.putObject("parameters");
        parameters.put("max_length", 50);
        parameters.put("min_length", 20);
        parameters.put("do_sample", false);

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
                throw new IOException("Summary API error: " + response.code() + " - " + response.body().string());
            }

            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
            return json.get(0).get("summary_text").asText();
        }
    }

}
