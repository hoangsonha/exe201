package com.hsh.project.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
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
            int objectiveStar = getObjectiveStar(combinedText);
            String summary = getSummary(combinedText);

            review.setObjectiveStar((float) objectiveStar);
            review.setRelevantStar((float) relevantStar);
            review.setPerspective(perspective);
            review.setSummary(summary);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return review;
    }

    private String getPerspective(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
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
            String jsonString = response.body().string();
            System.out.println("Debug: Perspective response = " + jsonString); // Log để debug
            ArrayNode json = (ArrayNode) mapper.readTree(jsonString);
            return json.get(0).get("label").asText();
        }
    }

//    private String getPerspective(String text) throws IOException {
//        String url = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
//        RequestBody body = RequestBody.create(
//                MediaType.parse("application/json"),
//                "{\"inputs\": \"" + text.replace("\"", "\\\"") + "\"}"
//        );
//        Request request = new Request.Builder()
//                .url(url)
//                .addHeader("Authorization", "Bearer " + apiToken)
//                .post(body)
//                .build();
//        try (Response response = client.newCall(request).execute()) {
//
//            if (!response.isSuccessful()) {
//                String errorBody = response.body().string();
//                throw new IOException("Hugging Face API error: " + response.code() + " - " + errorBody);
//            }
//            String jsonString = response.body().string();
//            System.out.println("Debug: Perspective response = " + jsonString);
//
//            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
//            return json.get(0).get("label").asText();
//        }
//    }

    private int getRelevantStar(String text, List<String> imageUrls, String videoUrl) throws IOException {
        // Gọi script Python
        List<String> command = new ArrayList<>();
        command.add("python");
        command.add("clip_processor.py");
        command.add(text);
        command.addAll(imageUrls != null ? imageUrls : List.of());
        command.add(videoUrl != null ? videoUrl : "");

        ProcessBuilder pb = new ProcessBuilder(command);
        Process process = pb.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line = reader.readLine();
        return line != null ? Integer.parseInt(line.trim()) : 3; // Default 3 nếu lỗi
    }

    private int getObjectiveStar(String text) throws IOException {
//        String url = "https://api-inference.huggingface.co/models/roberta-base";

        String url = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment";

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
            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
            double emotionalScore = 0;
            for (JsonNode node : json.get(0)) {
                String label = node.get("label").asText();
                if (label.equals("POSITIVE") || label.equals("NEGATIVE")) {
                    emotionalScore += node.get("score").asDouble();
                }
            }
            int objectiveStar = (int) Math.round((1 - emotionalScore) * 5);
            return Math.max(1, Math.min(5, objectiveStar));
        }
    }

    private String getSummary(String text) throws IOException {
        String url = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"),
                "{\"inputs\": \"" + text.replace("\"", "\\\"") + "\", \"parameters\": {\"max_length\": 50, \"min_length\": 20}}"
        );
        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + apiToken)
                .post(body)
                .build();
        try (Response response = client.newCall(request).execute()) {
            ArrayNode json = (ArrayNode) mapper.readTree(response.body().string());
            return json.get(0).get("summary_text").asText();
        }
    }

}
