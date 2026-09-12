package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.BotChatRequest;
import com.fitness.aiservice.dto.BotChatResponse;
import com.fitness.aiservice.model.BotMessage;
import com.fitness.aiservice.repository.BotMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BotChatService {
    private static final Logger log = LoggerFactory.getLogger(BotChatService.class);

    private final BotMessageRepository botMessageRepository;
    private final GeminiService geminiService;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public BotChatService(BotMessageRepository botMessageRepository,
                          GeminiService geminiService,
                          NotificationService notificationService) {
        this.botMessageRepository = botMessageRepository;
        this.geminiService = geminiService;
        this.notificationService = notificationService;
        this.objectMapper = new ObjectMapper();
    }

    public BotChatResponse handleUserMessage(BotChatRequest request) {
        String userId = request.getUserId() != null ? request.getUserId() : "anonymous";
        String userText = request.getMessage() != null ? request.getMessage().trim() : "Hello FitBot!";
        String goal = request.getContextGoal() != null ? request.getContextGoal() : "General Health & Fitness";
        String level = request.getFitnessLevel() != null ? request.getFitnessLevel() : "Intermediate";

        // Save incoming user message
        BotMessage userMsg = new BotMessage(userId, "USER", userText);
        botMessageRepository.save(userMsg);

        // Generate response with Gemini AI or fallback
        BotChatResponse botReply = generateBotReply(userId, userText, goal, level);

        // Save bot reply
        BotMessage botMsg = new BotMessage(userId, "BOT", botReply.getReply(), botReply.getQuickReplies());
        BotMessage savedBotMsg = botMessageRepository.save(botMsg);
        botReply.setId(savedBotMsg.getId());

        return botReply;
    }

    private BotChatResponse generateBotReply(String userId, String message, String goal, String level) {
        String prompt = String.format("""
            You are FitBot, an encouraging, certified fitness director, sports nutritionist, and daily wellness mentor.
            Athlete Context:
            - Primary Goal: %s
            - Experience Level: %s
            - User's Message: %s
            
            Provide a warm, highly motivating, clear, and actionable fitness coaching answer.
            Return your response in this EXACT JSON format:
            {
              "reply": "Your friendly, motivating coaching response. Use markdown formatting with bullet points and emojis where helpful.",
              "quickReplies": [
                "Suggested follow-up 1 (short phrase)",
                "Suggested follow-up 2 (short phrase)",
                "Suggested follow-up 3 (short phrase)"
              ]
            }
            Keep quickReplies to 2-3 concise options under 35 characters.
            """, goal, level, message);

        try {
            String rawJson = geminiService.getAnswer(prompt);
            JsonNode root = objectMapper.readTree(rawJson);
            String candidateText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText().trim();

            int firstBrace = candidateText.indexOf('{');
            int lastBrace = candidateText.lastIndexOf('}');
            if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
                candidateText = candidateText.substring(firstBrace, lastBrace + 1);
            }

            JsonNode parsed = objectMapper.readTree(candidateText);
            String reply = parsed.path("reply").asText();
            List<String> quickReplies = new ArrayList<>();
            JsonNode qrNode = parsed.path("quickReplies");
            if (qrNode.isArray()) {
                for (JsonNode n : qrNode) {
                    quickReplies.add(n.asText());
                }
            }
            if (quickReplies.isEmpty()) {
                quickReplies = getDefaultQuickReplies();
            }

            return new BotChatResponse(null, userId, reply, quickReplies, java.time.LocalDateTime.now());
        } catch (Exception e) {
            log.warn("Gemini API call failed or timed out for FitBot. Using smart fallback: {}", e.getMessage());
            return buildFallbackResponse(userId, message, goal);
        }
    }

    private BotChatResponse buildFallbackResponse(String userId, String message, String goal) {
        String lower = message.toLowerCase();
        String reply;
        List<String> quickReplies;

        if (lower.contains("sore") || lower.contains("pain") || lower.contains("recover") || lower.contains("rest")) {
            reply = "### 🧘‍♂️ Recovery & Muscle Soreness Protocol\n\n" +
                    "Delayed Onset Muscle Soreness (DOMS) is completely normal when challenging your muscular system! Here is your quick recovery action plan:\n\n" +
                    "- **Hydrate with Electrolytes:** Drink at least 500ml water with a pinch of salt or electrolytes.\n" +
                    "- **Active Recovery:** Go for a gentle 15-20 min walk or easy cycle in Zone 1 to flush metabolic byproducts.\n" +
                    "- **Foam Rolling & Dynamic Stretch:** Spend 5-10 minutes on tight quads, hamstrings, and calves.\n" +
                    "- **Sleep Quality:** 7-8 hours of restful sleep is where 90% of cellular muscle repair takes place!";
            quickReplies = List.of("Show mobility stretches", "What should I eat for recovery?", "Can I workout tomorrow?");
        } else if (lower.contains("eat") || lower.contains("diet") || lower.contains("nutrition") || lower.contains("food") || lower.contains("protein")) {
            reply = "### 🥗 Performance Nutrition Guidance\n\n" +
                    "To support your goal of **" + goal + "**:\n\n" +
                    "- **Pre-Workout (45-60m before):** Complex carbohydrates with low fiber (e.g. oatmeal with banana or rice cake with peanut butter).\n" +
                    "- **Post-Workout Window:** Aim for 20-30g of high-quality protein (whey, eggs, tofu, Greek yogurt) paired with carbs to restore muscle glycogen.\n" +
                    "- **Daily Protein Target:** Aim for 1.6 – 2.0g per kilogram of target body weight for optimal recovery.";
            quickReplies = List.of("Hydration guidelines", "Healthy snack ideas", "How many calories today?");
        } else if (lower.contains("workout") || lower.contains("exercise") || lower.contains("routine") || lower.contains("plan") || lower.contains("run")) {
            reply = "### ⚡ Workout Strategy & Progression\n\n" +
                    "Consistency beats intensity every single time! Here is a recommended structure for your next session:\n\n" +
                    "1. **Warm-Up (5 min):** Arm swings, walking lunges, and high knees.\n" +
                    "2. **Main Block (25-35 min):** Maintain a steady aerobic pace where you can still speak short sentences (Zone 2 cardio).\n" +
                    "3. **Cool-Down (5 min):** Easy walk and calf stretches.\n\n" +
                    "Keep logging your sessions—every minute builds your endurance capacity!";
            quickReplies = List.of("Suggest a 20 min HIIT", "How to track heart rate?", "Log another workout");
        } else if (lower.contains("check") || lower.contains("progress") || lower.contains("streak") || lower.contains("today")) {
            reply = "### 🎯 Daily Progress & Check-in\n\n" +
                    "You are doing fantastic! Remember to tap **'Daily Check-in'** to record today's hydration, sleep, and completed habits to maintain your daily streak! 🔥\n\n" +
                    "Small daily habits compound into massive physical transformations over weeks and months.";
            quickReplies = List.of("Open Daily Check-in", "How to increase streak?", "Weekly review");
        } else {
            reply = "### 👋 FitBot at Your Service!\n\n" +
                    "I am here to support your fitness journey towards **" + goal + "**! Whether you need pacing advice, heart rate zone targets, workout ideas, or recovery tips, just ask me.\n\n" +
                    "What would you like to focus on right now?";
            quickReplies = List.of("Quick 20m workout idea", "Recovery tips for sore legs", "How to improve my endurance?");
        }

        return new BotChatResponse(null, userId, reply, quickReplies, java.time.LocalDateTime.now());
    }

    public BotChatResponse generateDailyGreeting(String userId) {
        String greeting = "🌅 **Good day, Athlete!** FitBot here. Ready to conquer your daily fitness targets? Remember to log today's active minutes, stay hydrated, and complete your daily check-in to keep your streak going strong! 🔥";
        List<String> quickReplies = List.of("Check today's progress", "Suggest today's workout", "Nutrition tip of the day");
        
        BotMessage botMsg = new BotMessage(userId, "BOT", greeting, quickReplies);
        botMessageRepository.save(botMsg);

        // Also trigger a motivating notification
        notificationService.createNotification(
                userId,
                "FitBot Daily Motivation 🤖",
                "Your daily fitness companion is ready. Keep your daily streak alive today!",
                "BOT_TIP",
                "/ai-coach"
        );

        return new BotChatResponse(botMsg.getId(), userId, greeting, quickReplies, botMsg.getTimestamp());
    }

    public List<BotMessage> getChatHistory(String userId) {
        List<BotMessage> history = botMessageRepository.findByUserIdOrderByTimestampAsc(userId);
        if (history.isEmpty()) {
            // Provide a welcome message
            String welcome = "👋 Hello! I'm **FitBot**, your personalized AI fitness coach. Ask me anything about workout routines, pacing, heart rate zones, recovery, or nutrition!";
            BotMessage initial = new BotMessage(userId, "BOT", welcome, getDefaultQuickReplies());
            botMessageRepository.save(initial);
            history = List.of(initial);
        }
        return history;
    }

    public void clearHistory(String userId) {
        botMessageRepository.deleteByUserId(userId);
    }

    private List<String> getDefaultQuickReplies() {
        return List.of(
                "Suggest a 30m workout",
                "How do I recover faster?",
                "How to boost my endurance?"
        );
    }
}
