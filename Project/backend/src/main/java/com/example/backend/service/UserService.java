
package com.example.backend.service;

import com.example.backend.entity.user;
import com.example.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register a new user
    public user registerUser(user user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");

        return userRepository.save(user);
    }

    // Get all users
    public List<user> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public user getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));
    }

    // Get user by email
    public user getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));
    }

    // Login user
    public user loginUser(String email, String password) {

        user user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
