package com.fitness.aiservice.controller;

import com.fitness.aiservice.dto.BotChatRequest;
import com.fitness.aiservice.dto.BotChatResponse;
import com.fitness.aiservice.model.BotMessage;
import com.fitness.aiservice.service.BotChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations/bot")
public class BotMessageController {

    private final BotChatService botChatService;

    public BotMessageController(BotChatService botChatService) {
        this.botChatService = botChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<BotChatResponse> chat(@RequestBody BotChatRequest request) {
        return ResponseEntity.ok(botChatService.handleUserMessage(request));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<BotMessage>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(botChatService.getChatHistory(userId));
    }

    @DeleteMapping("/history/{userId}")
    public ResponseEntity<Void> clearHistory(@PathVariable String userId) {
        botChatService.clearHistory(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/greeting/{userId}")
    public ResponseEntity<BotChatResponse> getDailyGreeting(@PathVariable String userId) {
        return ResponseEntity.ok(botChatService.generateDailyGreeting(userId));
    }
}
