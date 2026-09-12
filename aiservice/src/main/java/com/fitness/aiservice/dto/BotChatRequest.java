package com.fitness.aiservice.dto;

public class BotChatRequest {
    private String userId;
    private String message;
    private String contextGoal;
    private String fitnessLevel;

    public BotChatRequest() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getContextGoal() { return contextGoal; }
    public void setContextGoal(String contextGoal) { this.contextGoal = contextGoal; }

    public String getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }
}
