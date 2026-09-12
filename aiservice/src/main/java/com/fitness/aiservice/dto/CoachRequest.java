package com.fitness.aiservice.dto;

import java.util.List;

public class CoachRequest {
    public String question;
    public String goal;
    public String fitnessLevel;
    public List<String> recentActivities;

    public CoachRequest() {}

    public CoachRequest(String question, String goal, String fitnessLevel, List<String> recentActivities) {
        this.question = question;
        this.goal = goal;
        this.fitnessLevel = fitnessLevel;
        this.recentActivities = recentActivities;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public String getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }

    public List<String> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<String> recentActivities) { this.recentActivities = recentActivities; }
}