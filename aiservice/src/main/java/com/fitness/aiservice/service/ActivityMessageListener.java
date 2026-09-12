package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class ActivityMessageListener {
    private static final Logger log = LoggerFactory.getLogger(ActivityMessageListener.class);

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;
    private final NotificationService notificationService;

    public ActivityMessageListener(ActivityAIService aiService,
                                   RecommendationRepository recommendationRepository,
                                   NotificationService notificationService) {
        this.aiService = aiService;
        this.recommendationRepository = recommendationRepository;
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());
        try {
            Recommendation recommendation = aiService.generateRecommendation(activity);
            recommendationRepository.save(recommendation);

            // Create In-App Notification
            String userId = activity.getUserId();
            String title = "Workout Logged: " + activity.getType() + " 🏃";
            String msg = String.format("Completed %s min with %s kcal burned. AI coaching feedback is ready!",
                    activity.getDuration(), activity.getCaloriesBurned());
            String link = "/activities/" + activity.getId();

            notificationService.createNotification(userId, title, msg, "WORKOUT_LOGGED", link);
            log.info("Dispatched in-app notification for workout {}", activity.getId());
        } catch (Exception e) {
            log.error("Error processing activity event: {}", e.getMessage(), e);
        }
    }
}
