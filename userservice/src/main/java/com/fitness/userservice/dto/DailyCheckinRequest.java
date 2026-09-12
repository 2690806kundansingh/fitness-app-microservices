package com.fitness.userservice.dto;

import java.time.LocalDate;
import java.util.List;

public class DailyCheckinRequest {
    private LocalDate date;
    private Integer waterMl;
    private Double sleepHours;
    private Double weight;
    private String mood;
    private String notes;
    private List<String> completedTasks;
    private Boolean isCompleted;

    public DailyCheckinRequest() {}

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getWaterMl() { return waterMl; }
    public void setWaterMl(Integer waterMl) { this.waterMl = waterMl; }

    public Double getSleepHours() { return sleepHours; }
    public void setSleepHours(Double sleepHours) { this.sleepHours = sleepHours; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<String> getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(List<String> completedTasks) { this.completedTasks = completedTasks; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean completed) { isCompleted = completed; }
}
