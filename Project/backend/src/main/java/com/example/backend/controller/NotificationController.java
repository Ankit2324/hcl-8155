
package com.example.backend.controller;

import com.example.backend.entity.Notification;
import com.example.backend.entity.user;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private user getLoggedInAdmin(Authentication authentication) {
        user admin = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(admin.getRole())) {
            throw new RuntimeException("Admin access required");
        }

        return admin;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            Authentication authentication) {
        user admin = getLoggedInAdmin(authentication);
        return ResponseEntity.ok(
                notificationService.getNotifications(admin.getId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        user admin = getLoggedInAdmin(authentication);
        return ResponseEntity.ok(
                notificationService.markAsRead(id, admin.getId()));
    }
}
