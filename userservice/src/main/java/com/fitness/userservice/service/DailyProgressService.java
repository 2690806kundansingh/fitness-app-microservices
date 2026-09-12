package com.fitness.userservice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.userservice.dto.DailyCheckinRequest;
import com.fitness.userservice.dto.DailyProgressResponse;
import com.fitness.userservice.dto.StreakResponse;
import com.fitness.userservice.model.DailyProgress;
import com.fitness.userservice.repository.DailyProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DailyProgressService {
    private static final Logger log = LoggerFactory.getLogger(DailyProgressService.class);

    private final DailyProgressRepository dailyProgressRepository;
    private final ObjectMapper objectMapper;

    public DailyProgressService(DailyProgressRepository dailyProgressRepository) {
        this.dailyProgressRepository = dailyProgressRepository;
        this.objectMapper = new ObjectMapper();
    }

    public DailyProgressResponse getDailyProgress(String userId, LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        LocalDate finalDate = date;
        DailyProgress progress = dailyProgressRepository.findByUserIdAndDate(userId, finalDate)
                .orElseGet(() -> {
                    DailyProgress newProgress = new DailyProgress(userId, finalDate);
                    return dailyProgressRepository.save(newProgress);
                });
        return mapToResponse(progress);
    }

    public DailyProgressResponse saveDailyCheckin(String userId, DailyCheckinRequest request) {
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();
        DailyProgress progress = dailyProgressRepository.findByUserIdAndDate(userId, date)
                .orElseGet(() -> new DailyProgress(userId, date));

        if (request.getWaterMl() != null) progress.setWaterMl(request.getWaterMl());
        if (request.getSleepHours() != null) progress.setSleepHours(request.getSleepHours());
        if (request.getWeight() != null) progress.setWeight(request.getWeight());
        if (request.getMood() != null) progress.setMood(request.getMood());
        if (request.getNotes() != null) progress.setNotes(request.getNotes());
        if (request.getIsCompleted() != null) progress.setIsCompleted(request.getIsCompleted());

        if (request.getCompletedTasks() != null) {
            try {
                progress.setCompletedTasks(objectMapper.writeValueAsString(request.getCompletedTasks()));
            } catch (Exception e) {
                log.warn("Failed to serialize completed tasks: {}", e.getMessage());
            }
        }

        DailyProgress saved = dailyProgressRepository.save(progress);
        return mapToResponse(saved);
    }

    public StreakResponse calculateStreak(String userId) {
        List<DailyProgress> allCheckins = dailyProgressRepository.findByUserIdOrderByDateDesc(userId);
        
        Set<LocalDate> completedDates = new HashSet<>();
        List<LocalDate> recentDates = new ArrayList<>();

        for (DailyProgress dp : allCheckins) {
            if (Boolean.TRUE.equals(dp.getIsCompleted())) {
                completedDates.add(dp.getDate());
                if (recentDates.size() < 14) {
                    recentDates.add(dp.getDate());
                }
            }
        }

        LocalDate today = LocalDate.now();
        boolean checkedInToday = completedDates.contains(today);

        // Calculate current streak
        int currentStreak = 0;
        LocalDate cursor = today;
        if (!checkedInToday) {
            // Check if streak is still active from yesterday
            cursor = today.minusDays(1);
        }

        while (completedDates.contains(cursor)) {
            currentStreak++;
            cursor = cursor.minusDays(1);
        }

        // Calculate longest streak
        int longestStreak = 0;
        if (!completedDates.isEmpty()) {
            List<LocalDate> sortedDates = new ArrayList<>(completedDates);
            Collections.sort(sortedDates);
            int tempStreak = 0;
            LocalDate prev = null;
            for (LocalDate d : sortedDates) {
                if (prev == null || d.equals(prev.plusDays(1))) {
                    tempStreak++;
                } else if (!d.equals(prev)) {
                    tempStreak = 1;
                }
                longestStreak = Math.max(longestStreak, tempStreak);
                prev = d;
            }
        }

        StreakResponse response = new StreakResponse();
        response.setUserId(userId);
        response.setCurrentStreak(currentStreak);
        response.setLongestStreak(Math.max(longestStreak, currentStreak));
        response.setTotalCheckins(dailyProgressRepository.countByUserIdAndIsCompletedTrue(userId));
        response.setCheckedInToday(checkedInToday);
        response.setRecentCheckinDates(recentDates);

        return response;
    }

    public List<DailyProgressResponse> getRecentHistory(String userId, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days > 0 ? days : 7);
        List<DailyProgress> list = dailyProgressRepository.findByUserIdAndDateGreaterThanEqualOrderByDateAsc(userId, startDate);
        List<DailyProgressResponse> result = new ArrayList<>();
        for (DailyProgress p : list) {
            result.add(mapToResponse(p));
        }
        return result;
    }

    private DailyProgressResponse mapToResponse(DailyProgress p) {
        DailyProgressResponse res = new DailyProgressResponse();
        res.setId(p.getId());
        res.setUserId(p.getUserId());
        res.setDate(p.getDate());
        res.setWaterMl(p.getWaterMl() != null ? p.getWaterMl() : 0);
        res.setSleepHours(p.getSleepHours() != null ? p.getSleepHours() : 0.0);
        res.setWeight(p.getWeight());
        res.setMood(p.getMood());
        res.setNotes(p.getNotes());
        res.setIsCompleted(Boolean.TRUE.equals(p.getIsCompleted()));
        res.setUpdatedAt(p.getUpdatedAt());

        try {
            if (p.getCompletedTasks() != null && !p.getCompletedTasks().isEmpty()) {
                res.setCompletedTasks(objectMapper.readValue(p.getCompletedTasks(), new TypeReference<List<String>>() {}));
            } else {
                res.setCompletedTasks(Collections.emptyList());
            }
        } catch (Exception e) {
            res.setCompletedTasks(Collections.emptyList());
        }

        return res;
    }
}
