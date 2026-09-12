package com.fitness.aiservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {
    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    private final WebClient webClient;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=}")
    private String geminiApiUrl;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final java.util.List<String> FALLBACK_MODELS = java.util.List.of(
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-flash-lite-latest",
            "gemini-flash-latest"
    );

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[] {
                        Map.of("parts", new Object[]{
                                Map.of("text", question)
                        })
                }
        );

        String primaryUrl = buildUrl(geminiApiUrl, geminiApiKey);
        Exception lastException = null;

        try {
            log.info("Querying primary Gemini endpoint...");
            return executePost(primaryUrl, requestBody);
        } catch (Exception e) {
            lastException = e;
            log.warn("Primary Gemini call failed: {}. Trying fallback models...", e.getMessage());
        }

        // Try candidate fallback models
        for (String modelName : FALLBACK_MODELS) {
            String fallbackBase = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=";
            String fallbackUrl = buildUrl(fallbackBase, geminiApiKey);
            if (fallbackUrl.equalsIgnoreCase(primaryUrl)) {
                continue;
            }

            try {
                log.info("Attempting Gemini fallback model: {}", modelName);
                return executePost(fallbackUrl, requestBody);
            } catch (Exception e) {
                lastException = e;
                log.warn("Gemini model {} failed: {}", modelName, e.getMessage());
            }
        }

        if (lastException instanceof RuntimeException) {
            throw (RuntimeException) lastException;
        }
        throw new RuntimeException("Gemini API call failed across all models", lastException);
    }

    private String buildUrl(String url, String key) {
        String trimmed = url.trim();
        if (trimmed.contains("?key=") || trimmed.contains("&key=")) {
            return trimmed + key.trim();
        } else if (trimmed.contains("?")) {
            return trimmed + "&key=" + key.trim();
        } else {
            return trimmed + "?key=" + key.trim();
        }
    }

    private String executePost(String url, Map<String, Object> body) {
        return webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
