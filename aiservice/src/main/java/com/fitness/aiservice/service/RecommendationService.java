package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.CoachRequest;
import com.fitness.aiservice.dto.PlanRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class RecommendationService {
    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final RecommendationRepository recommendationRepository;
    private final ActivityAIService aiService;
    private final GeminiService geminiService;
    private final WebClient.Builder webClientBuilder;

    public RecommendationService(RecommendationRepository recommendationRepository,
                                 ActivityAIService aiService,
                                 GeminiService geminiService,
                                 WebClient.Builder webClientBuilder) {
        this.recommendationRepository = recommendationRepository;
        this.aiService = aiService;
        this.geminiService = geminiService;
        this.webClientBuilder = webClientBuilder;
    }

    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {
        Recommendation existing = recommendationRepository.findByActivityId(activityId).orElse(null);
        if (existing != null && existing.getRecommendation() != null && !existing.getRecommendation().contains("Unable to generate detailed analysis")) {
            return existing;
        }
        return generateAndSaveRecommendation(activityId);
    }

    public Recommendation generateAndSaveRecommendation(String activityId) {
        try {
            log.info("Fetching activity {} to generate recommendation on-demand...", activityId);
            Activity activity = webClientBuilder.build()
                    .get()
                    .uri("http://localhost:8082/api/activities/" + activityId)
                    .retrieve()
                    .bodyToMono(Activity.class)
                    .block();

            if (activity != null) {
                log.info("Generating AI recommendation for activity: {}", activityId);
                Recommendation recommendation = aiService.generateRecommendation(activity);
                recommendationRepository.findByActivityId(activityId)
                        .ifPresent(old -> recommendation.setId(old.getId()));
                return recommendationRepository.save(recommendation);
            }
        } catch (Exception e) {
            log.error("Failed to generate recommendation on-demand for activity {}: {}", activityId, e.getMessage());
        }
        return recommendationRepository.findByActivityId(activityId).orElse(null);
    }

    public Map<String, Object> askCoach(CoachRequest request) {
        String question = request.question != null ? request.question : "How can I improve my aerobic endurance?";
        String goal = request.goal != null ? request.goal : "General Fitness & Health";
        String level = request.fitnessLevel != null ? request.fitnessLevel : "Intermediate";

        String prompt = String.format("""
            You are FitPulse AI, an elite sports science coach and certified exercise physiologist.
            Answer this fitness/training question for an athlete with goal '%s' and level '%s':
            Question: %s
            
            Provide your response in this EXACT JSON format:
            {
              "headline": "Direct concise answer summary (1-2 sentences)",
              "explanation": "Detailed physiological and practical explanation with clear coaching principles",
              "actionableTips": [
                "Actionable tip 1",
                "Actionable tip 2",
                "Actionable tip 3"
              ],
              "recommendedWorkout": "A specific recommended workout or drill to implement this advice",
              "nutritionOrRecoveryTip": "A key nutrition or recovery guideline"
            }
            """, goal, level, question);

        try {
            String aiResponse = geminiService.getAnswer(prompt);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(aiResponse);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText().trim();
            
            int firstBrace = rawText.indexOf('{');
            int lastBrace = rawText.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                rawText = rawText.substring(firstBrace, lastBrace + 1);
            }
            return mapper.readValue(rawText, Map.class);
        } catch (Exception e) {
            log.error("Failed to get AI coach response: {}", e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("headline", "Consistency and progressive aerobic overload are key to achieving your " + goal.toLowerCase() + " goals.");
            fallback.put("explanation", "Maintaining 70-80% of your weekly volume in Zone 2 aerobic intensity builds mitochondrial density, improves lactate clearance, and prevents injury while boosting endurance.");
            fallback.put("actionableTips", List.of(
                    "Track your resting heart rate each morning to gauge systemic recovery.",
                    "Alternate high-intensity workouts with dedicated active recovery or mobility sessions.",
                    "Ensure adequate hydration and electrolyte replenishment after each training session."
            ));
            fallback.put("recommendedWorkout", "35-minute steady-state conversational pace run or ride, maintaining an RPE (rate of perceived exertion) of 5 out of 10.");
            fallback.put("nutritionOrRecoveryTip", "Consume 20-30g of protein and complex carbohydrates within 45 minutes post-workout for optimal glycogen resynthesis.");
            return fallback;
        }
    }

    public Map<String, Object> generateWorkoutPlan(PlanRequest request) {
        String goal = request.goal != null ? request.goal : "Fat Loss & Aerobic Conditioning";
        String level = request.fitnessLevel != null ? request.fitnessLevel : "Intermediate";
        int days = request.daysPerWeek != null && request.daysPerWeek > 0 ? request.daysPerWeek : 4;
        int duration = request.sessionMinutes != null && request.sessionMinutes > 0 ? request.sessionMinutes : 40;

        String prompt = String.format("""
            You are FitPulse AI, a professional athletic director. Design a customized %d-day weekly workout schedule for an athlete:
            Goal: %s
            Experience: %s
            Typical Session Duration: %d minutes
            
            Provide the response in this EXACT JSON format:
            {
              "planTitle": "Catchy Plan Name",
              "overview": "Comprehensive strategic overview of the training philosophy",
              "targetHeartRateZones": "Recommended target heart rate zones for this week",
              "weeklySchedule": [
                {
                  "day": "Day 1",
                  "focus": "Aerobic Base / Intervals / Recovery",
                  "activityType": "RUNNING / CYCLING / WALKING / STRENGTH",
                  "duration": %d,
                  "intensity": "Moderate / High / Low",
                  "warmup": "Warmup routine",
                  "mainSet": "Step-by-step main workout protocol",
                  "cooldown": "Cooldown routine"
                }
              ],
              "progressionTips": [
                "Progression tip 1",
                "Progression tip 2"
              ]
            }
            Ensure weeklySchedule contains exactly %d days.
            """, days, goal, level, duration, duration, days);

        try {
            String aiResponse = geminiService.getAnswer(prompt);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(aiResponse);
            String rawText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText().trim();
            
            int firstBrace = rawText.indexOf('{');
            int lastBrace = rawText.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                rawText = rawText.substring(firstBrace, lastBrace + 1);
            }
            return mapper.readValue(rawText, Map.class);
        } catch (Exception e) {
            log.error("Failed to generate workout plan: {}", e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("planTitle", goal + " - Weekly Progression");
            fallback.put("overview", "A balanced " + days + "-day program alternating aerobic capacity, threshold work, and active recovery to maximize adaptation.");
            fallback.put("targetHeartRateZones", "Zone 2 (65-75% Max HR) for Base days, Zone 4 (85-90% Max HR) for Interval surges.");
            
            List<Map<String, Object>> schedule = new ArrayList<>();
            for (int i = 1; i <= days; i++) {
                Map<String, Object> day = new HashMap<>();
                day.put("day", "Day " + i);
                if (i % 2 == 1) {
                    day.put("focus", "Aerobic Base & Endurance");
                    day.put("activityType", "RUNNING");
                    day.put("duration", duration);
                    day.put("intensity", "Moderate (Zone 2)");
                    day.put("warmup", "5 min dynamic leg swings and light jog");
                    day.put("mainSet", (duration - 10) + " min steady conversational pace effort");
                    day.put("cooldown", "5 min walk and calf/hamstring stretching");
                } else {
                    day.put("focus", "High-Intensity Interval Surge");
                    day.put("activityType", "CYCLING");
                    day.put("duration", duration);
                    day.put("intensity", "High (Zone 4)");
                    day.put("warmup", "8 min progressive cadence ramp");
                    day.put("mainSet", "6 rounds of: 2 min hard effort + 1.5 min easy spin recovery");
                    day.put("cooldown", "5 min easy recovery spin");
                }
                schedule.add(day);
            }
            fallback.put("weeklySchedule", schedule);
            fallback.put("progressionTips", List.of(
                    "Increase total weekly volume by no more than 10% in the following week.",
                    "Prioritize 7-8 hours of sleep for neuromuscular adaptation."
            ));
            return fallback;
        }
    }
}
