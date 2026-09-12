package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendation(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendation(@PathVariable String activityId) {
        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));
    }

    @org.springframework.web.bind.annotation.PostMapping("/activity/{activityId}/generate")
    public ResponseEntity<Recommendation> regenerateActivityRecommendation(@PathVariable String activityId) {
        return ResponseEntity.ok(recommendationService.generateAndSaveRecommendation(activityId));
    }

    @org.springframework.web.bind.annotation.PostMapping("/coach")
    public ResponseEntity<java.util.Map<String, Object>> askCoach(@RequestBody com.fitness.aiservice.dto.CoachRequest request) {
        return ResponseEntity.ok(recommendationService.askCoach(request));
    }

    @org.springframework.web.bind.annotation.PostMapping("/plan")
    public ResponseEntity<java.util.Map<String, Object>> generatePlan(@RequestBody com.fitness.aiservice.dto.PlanRequest request) {
        return ResponseEntity.ok(recommendationService.generateWorkoutPlan(request));
    }
}
