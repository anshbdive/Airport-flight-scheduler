package com.airport.flightscheduler.service;

import com.airport.flightscheduler.model.Notification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {
    private final LinkedList<Notification> notifications = new LinkedList<>();
    private static final int MAX_NOTIFICATIONS = 50;

    public void addNotification(String flightId, String message, String type) {
        Notification notification = new Notification(
            UUID.randomUUID().toString().substring(0, 8),
            flightId,
            message,
            type,
            LocalDateTime.now()
        );
        
        notifications.addFirst(notification);
        if (notifications.size() > MAX_NOTIFICATIONS) {
            notifications.removeLast();
        }
    }

    public List<Notification> getRecentNotifications() {
        return notifications;
    }
    
    public void clearAll() {
        notifications.clear();
    }
}
