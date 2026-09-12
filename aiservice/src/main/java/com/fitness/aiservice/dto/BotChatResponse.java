package com.fitness.aiservice.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BotChatResponse {
    private String id;
    private String userId;
    private String reply;
    private List<String> quickReplies;
    private LocalDateTime timestamp;

    public BotChatResponse() {}

    public BotChatResponse(String id, String userId, String reply, List<String> quickReplies, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.reply = reply;
        this.quickReplies = quickReplies;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<String> getQuickReplies() { return quickReplies; }
    public void setQuickReplies(List<String> quickReplies) { this.quickReplies = quickReplies; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
