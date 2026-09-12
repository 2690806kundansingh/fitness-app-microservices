package com.fitness.aiservice.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "bot_messages")
public class BotMessage {
    @Id
    private String id;
    private String userId;
    private String sender; // "USER" or "BOT"
    private String message;
    private List<String> quickReplies = new ArrayList<>();

    @CreatedDate
    private LocalDateTime timestamp;

    public BotMessage() {
        this.timestamp = LocalDateTime.now();
    }

    public BotMessage(String userId, String sender, String message) {
        this.userId = userId;
        this.sender = sender;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public BotMessage(String userId, String sender, String message, List<String> quickReplies) {
        this.userId = userId;
        this.sender = sender;
        this.message = message;
        this.quickReplies = quickReplies != null ? quickReplies : new ArrayList<>();
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getQuickReplies() { return quickReplies; }
    public void setQuickReplies(List<String> quickReplies) { this.quickReplies = quickReplies; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
