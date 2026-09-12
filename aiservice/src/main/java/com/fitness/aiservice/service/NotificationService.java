package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Notification;
import com.fitness.aiservice.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(String userId, String title, String message, String type, String link) {
        Notification notification = new Notification(userId, title, message, type, link);
        Notification saved = notificationRepository.save(notification);
        log.info("Created notification for user {}: {}", userId, title);
        return saved;
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Optional<Notification> markAsRead(String notificationId) {
        Optional<Notification> opt = notificationRepository.findById(notificationId);
        opt.ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return opt;
    }

    public void markAllAsRead(String userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            if (!Boolean.TRUE.equals(n.getRead())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        }
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
