package com.fitness.aiservice.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "recommendations")
public class Recommendation {
    @Id
    private String id;
    private String activityId;
    private String userId;
    private String activityType;
    private String recommendation;
    private List<String> improvements;
    private List<String> suggestions;
    private List<String> safety;

    @CreatedDate
    private LocalDateTime createdAt;

    public Recommendation() {}

    public Recommendation(String id, String activityId, String userId, String activityType,
                          String recommendation, List<String> improvements, List<String> suggestions,
                          List<String> safety, LocalDateTime createdAt) {
        this.id = id;
        this.activityId = activityId;
        this.userId = userId;
        this.activityType = activityType;
        this.recommendation = recommendation;
        this.improvements = improvements;
        this.suggestions = suggestions;
        this.safety = safety;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String activityId;
        private String userId;
        private String activityType;
        private String recommendation;
        private List<String> improvements;
        private List<String> suggestions;
        private List<String> safety;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder activityId(String activityId) { this.activityId = activityId; return this; }
        public Builder userId(String userId) { this.userId = userId; return this; }
        public Builder activityType(String activityType) { this.activityType = activityType; return this; }
        public Builder recommendation(String recommendation) { this.recommendation = recommendation; return this; }
        public Builder improvements(List<String> improvements) { this.improvements = improvements; return this; }
        public Builder suggestions(List<String> suggestions) { this.suggestions = suggestions; return this; }
        public Builder safety(List<String> safety) { this.safety = safety; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Recommendation build() {
            return new Recommendation(id, activityId, userId, activityType, recommendation,
                    improvements, suggestions, safety, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getActivityId() { return activityId; }
    public void setActivityId(String activityId) { this.activityId = activityId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<String> getSafety() { return safety; }
    public void setSafety(List<String> safety) { this.safety = safety; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
