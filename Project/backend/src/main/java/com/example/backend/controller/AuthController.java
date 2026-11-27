
package com.example.backend.controller;

import com.example.backend.entity.user;
import com.example.backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody user user) {

        user savedUser = userService.registerUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());

        return ResponseEntity.ok(response);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        user user = userService.loginUser(
                request.get("email"),
                request.get("password")
        );

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}
