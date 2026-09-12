package com.fitness.userservice.dto;

import java.time.LocalDate;
import java.util.List;

public class StreakResponse {
    private String userId;
    private int currentStreak;
    private int longestStreak;
    private long totalCheckins;
    private boolean checkedInToday;
    private List<LocalDate> recentCheckinDates;

    public StreakResponse() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public long getTotalCheckins() { return totalCheckins; }
    public void setTotalCheckins(long totalCheckins) { this.totalCheckins = totalCheckins; }

    public boolean isCheckedInToday() { return checkedInToday; }
    public void setCheckedInToday(boolean checkedInToday) { this.checkedInToday = checkedInToday; }

    public List<LocalDate> getRecentCheckinDates() { return recentCheckinDates; }
    public void setRecentCheckinDates(List<LocalDate> recentCheckinDates) { this.recentCheckinDates = recentCheckinDates; }
}
