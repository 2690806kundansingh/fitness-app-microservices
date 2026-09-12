package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class ActivityAIService {
    private static final Logger log = LoggerFactory.getLogger(ActivityAIService.class);
    private final GeminiService geminiService;

    public ActivityAIService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public Recommendation generateRecommendation(Activity activity) {
        try {
            String prompt = createPromptForActivity(activity);
            String aiResponse = geminiService.getAnswer(prompt);
            log.info("RESPONSE FROM AI: {} ", aiResponse);
            return processAiResponse(activity, aiResponse);
        } catch (Exception e) {
            log.error("Failed to generate AI recommendation, using default recommendation: {}", e.getMessage());
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String rawText = textNode.asText().trim();
            String jsonContent = rawText;
            int firstBrace = rawText.indexOf('{');
            int lastBrace = rawText.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                jsonContent = rawText.substring(firstBrace, lastBrace + 1);
            } else {
                if (jsonContent.startsWith("```json")) {
                    jsonContent = jsonContent.substring(7);
                } else if (jsonContent.startsWith("```")) {
                    jsonContent = jsonContent.substring(3);
                }
                if (jsonContent.endsWith("```")) {
                    jsonContent = jsonContent.substring(0, jsonContent.length() - 3);
                }
                jsonContent = jsonContent.trim();
            }

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            if (analysisNode.isMissingNode() || analysisNode.isNull()) {
                analysisNode = analysisJson;
            }
            
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();
            
        } catch (Exception e) {
            log.error("Error parsing AI response, falling back to default recommendation: {}", e.getMessage());
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        String type = activity.getType() != null ? activity.getType() : "WORKOUT";
        int duration = activity.getDuration() != null ? activity.getDuration() : 30;
        int calories = activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 250;

        String analysis = String.format(
                "Overall: Great job completing your %d-minute %s session with %d kcal burned! This workout successfully stimulates cardiovascular endurance and metabolic efficiency.\n\n" +
                "Pace: An expenditure of %d kcal over %d minutes indicates steady, sustainable pacing. Strive to maintain this cadence while progressively challenging your resistance or speed in future sessions.\n\n" +
                "Heart Rate: Your energy burn reflects solid work across moderate aerobic training (Zone 2 - Zone 3), which is optimal for mitochondrial adaptation and fat oxidation.\n\n" +
                "Calories: Burning approximately %.1f kcal/minute aligns with effective cardiovascular training for %s.",
                duration, type, calories, calories, duration, (double) calories / Math.max(duration, 1), type
        );

        List<String> improvements = Arrays.asList(
                String.format("Pacing Strategy: Progressively increase your %s tempo in the middle third of your workout to stimulate higher anaerobic threshold capacity.", type),
                "Heart Rate Monitoring: Utilize a chest strap or optical sensor to track real-time HR zones and ensure you spend adequate time in your target aerobic window.",
                "Active Recovery: Integrate dynamic mobility and foam rolling post-workout to speed up muscular recovery and minimize delayed onset muscle soreness (DOMS)."
        );

        List<String> suggestions = Arrays.asList(
                String.format("Interval Training: Next session, perform a %d-minute interval session alternating 2 minutes of higher intensity with 1 minute of recovery.", duration),
                String.format("Endurance Progression: Add 5-10 minutes to your next %s session at a steady conversational pace to further build aerobic capacity.", type),
                "Cross-Training: Complement this session with 20 minutes of core strengthening and posterior chain resistance work."
        );

        List<String> safety = Arrays.asList(
                "Dynamic Warm-Up: Dedicate 3-5 minutes to dynamic joint mobility before starting high-intensity movement.",
                "Hydration: Consume 250-500ml of water with electrolytes after intense physical output to replenish lost fluids.",
                "Recovery Awareness: Listen to your body and schedule a rest or low-impact active recovery day if experiencing joint stiffness."
        );

        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation(analysis)
                .improvements(improvements)
                .suggestions(suggestions)
                .safety(safety)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> {
                String txt = item.asText().trim();
                if (!txt.isEmpty()) {
                    safety.add(txt);
                }
            });
        }
        return safety.isEmpty() ?
                List.of(
                        "Dynamic Warm-Up: Dedicate 3-5 minutes to dynamic stretching before exercising.",
                        "Hydration: Stay hydrated with adequate fluid intake before, during, and after activity.",
                        "Body Awareness: Pay attention to joint alignment and pain signals to avoid overtraining."
                ) :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = getFieldText(suggestion, "workout", "Workout", "title", "Title", "name", "Name");
                String description = getFieldText(suggestion, "description", "Description", "detail", "Detail", "recommendation", "Recommendation");
                if (!workout.isEmpty() && !description.isEmpty()) {
                    suggestions.add(String.format("%s: %s", workout, description));
                } else if (!description.isEmpty()) {
                    suggestions.add(description);
                } else if (!workout.isEmpty()) {
                    suggestions.add(workout);
                }
            });
        }
        return suggestions.isEmpty() ?
                List.of("Interval Progression: Incorporate interval surges into your next session to elevate anaerobic conditioning.") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = getFieldText(improvement, "area", "Area", "title", "Title");
                String detail = getFieldText(improvement, "recommendation", "Recommendation", "detail", "Detail", "description", "Description");
                if (!area.isEmpty() && !detail.isEmpty()) {
                    improvements.add(String.format("%s: %s", area, detail));
                } else if (!detail.isEmpty()) {
                    improvements.add(detail);
                } else if (!area.isEmpty()) {
                    improvements.add(area);
                }
            });
        }
        return improvements.isEmpty() ?
                List.of("Cadence and Pacing: Focus on sustaining an even tempo throughout the middle duration of your workout.") :
                improvements;
    }

    private String getFieldText(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            JsonNode f = node.path(fieldName);
            if (!f.isMissingNode() && !f.isNull() && !f.asText().trim().isEmpty()) {
                return f.asText().trim();
            }
        }
        return "";
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        String val = getFieldText(analysisNode, key, Character.toUpperCase(key.charAt(0)) + key.substring(1));
        if (!val.isEmpty()) {
            fullAnalysis.append(prefix).append(" ")
                    .append(val)
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
        {
          "analysis": {
            "overall": "Overall analysis here",
            "pace": "Pace analysis here",
            "heartRate": "Heart rate analysis here",
            "caloriesBurned": "Calories analysis here"
          },
          "improvements": [
            {
              "area": "Area name",
              "recommendation": "Detailed recommendation"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout name",
              "description": "Detailed workout description"
            }
          ],
          "safety": [
            "Safety point 1",
            "Safety point 2"
          ]
        }

        Analyze this activity:
        Activity Type: %s
        Duration: %d minutes
        Calories Burned: %d
        Additional Metrics: %s
        
        Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
        Ensure the response follows the EXACT JSON format shown above.
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }
}
