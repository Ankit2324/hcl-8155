
package com.example.backend.controller;

import com.example.backend.entity.user;
import com.example.backend.service.UserService;
import com.example.backend.security.JwtService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // REGISTER
    @PostMapping("/register")
    public Map<String, Object> register(
            @RequestBody Map<String, String> request
    ) {

        user newUser = userService.registerUser(
                request.get("name"),
                request.get("email"),
                request.get("password"),
                request.get("role"),
                request.get("adminCode")
        );

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Registration successful");
        response.put("id", newUser.getId());
        response.put("name", newUser.getName());
        response.put("email", newUser.getEmail());
        response.put("role", newUser.getRole());

        return response;
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> request
    ) {

        user loggedInUser = userService.loginUser(
                request.get("email"),
                request.get("password")
        );

        // Generate JWT token
        String token = jwtService.generateToken(loggedInUser);

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("id", loggedInUser.getId());
        response.put("name", loggedInUser.getName());
        response.put("email", loggedInUser.getEmail());
        response.put("role", loggedInUser.getRole());
        response.put("token", token);

        return response;
    }
}
