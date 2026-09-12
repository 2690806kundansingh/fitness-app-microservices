package com.fitness.userservice.controller;

import com.fitness.userservice.dto.*;
import com.fitness.userservice.service.DailyProgressService;
import com.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final DailyProgressService dailyProgressService;

    public UserController(UserService userService, DailyProgressService dailyProgressService) {
        this.userService = userService;
        this.dailyProgressService = dailyProgressService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping({"/profile/{userId}", "/{userId}/profile"})
    public ResponseEntity<UserProfileResponse> getDetailedProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getDetailedProfile(userId));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getDetailedProfileHeader(
            @RequestHeader(value = "X-User-ID", required = false) String headerUserId,
            @RequestParam(value = "userId", required = false) String paramUserId) {
        String effectiveUserId = headerUserId != null && !headerUserId.isBlank() ? headerUserId : paramUserId;
        if (effectiveUserId == null || effectiveUserId.isBlank()) {
            effectiveUserId = "default-user";
        }
        return ResponseEntity.ok(userService.getDetailedProfile(effectiveUserId));
    }

    @PutMapping({"/profile/{userId}", "/{userId}/profile"})
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @PathVariable String userId,
            @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(userService.updateUserProfile(userId, request));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateUserProfileHeader(
            @RequestHeader(value = "X-User-ID", required = false) String headerUserId,
            @RequestBody UserProfileRequest request) {
        String effectiveUserId = headerUserId;
        if (effectiveUserId == null || effectiveUserId.isBlank()) {
            effectiveUserId = request.getUserId();
        }
        if (effectiveUserId == null || effectiveUserId.isBlank()) {
            effectiveUserId = "default-user";
        }
        return ResponseEntity.ok(userService.updateUserProfile(effectiveUserId, request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId) {
        return ResponseEntity.ok(userService.existByUserId(userId));
    }

    // Daily Progress & Check-in Endpoints
    @GetMapping("/{userId}/daily-progress")
    public ResponseEntity<DailyProgressResponse> getDailyProgress(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(dailyProgressService.getDailyProgress(userId, date));
    }

    @PostMapping("/{userId}/daily-progress")
    public ResponseEntity<DailyProgressResponse> recordDailyCheckin(
            @PathVariable String userId,
            @RequestBody DailyCheckinRequest request) {
        return ResponseEntity.ok(dailyProgressService.saveDailyCheckin(userId, request));
    }

    @GetMapping("/{userId}/streak")
    public ResponseEntity<StreakResponse> getUserStreak(@PathVariable String userId) {
        return ResponseEntity.ok(dailyProgressService.calculateStreak(userId));
    }

    @GetMapping("/{userId}/daily-progress/history")
    public ResponseEntity<List<DailyProgressResponse>> getDailyProgressHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dailyProgressService.getRecentHistory(userId, days));
    }
}
