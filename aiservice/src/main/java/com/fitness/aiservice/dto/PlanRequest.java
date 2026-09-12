package com.fitness.aiservice.dto;

public class PlanRequest {
    public String goal;
    public String fitnessLevel;
    public Integer daysPerWeek;
    public Integer sessionMinutes;
    public String preferences;

    public PlanRequest() {}

    public PlanRequest(String goal, String fitnessLevel, Integer daysPerWeek, Integer sessionMinutes, String preferences) {
        this.goal = goal;
        this.fitnessLevel = fitnessLevel;
        this.daysPerWeek = daysPerWeek;
        this.sessionMinutes = sessionMinutes;
        this.preferences = preferences;
    }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public String getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }

    public Integer getDaysPerWeek() { return daysPerWeek; }
    public void setDaysPerWeek(Integer daysPerWeek) { this.daysPerWeek = daysPerWeek; }

    public Integer getSessionMinutes() { return sessionMinutes; }
    public void setSessionMinutes(Integer sessionMinutes) { this.sessionMinutes = sessionMinutes; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }
}