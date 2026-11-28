
package com.example.backend.service;

import com.example.backend.entity.Notification;
import com.example.backend.entity.user;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void notifyAllAdmins(String message) {
        List<user> admins = userRepository.findAll()
                .stream()
                .filter(u -> "ADMIN".equalsIgnoreCase(u.getRole()))
                .toList();

        for (user admin : admins) {
            Notification notification = new Notification();
            notification.setMessage(message);
            notification.setRecipient(admin);
            notificationRepository.save(notification);
        }
    }

    public List<Notification> getNotifications(Long adminId) {
        return notificationRepository
                .findByRecipientIdOrderByCreatedAtDesc(adminId);
    }

    public Notification markAsRead(Long id, Long adminId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        if (notification.getRecipient() == null ||
                !Objects.equals(notification.getRecipient().getId(), adminId)) {
            throw new RuntimeException("Access denied");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
