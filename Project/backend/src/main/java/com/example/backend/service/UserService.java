
package com.example.backend.service;

import com.example.backend.entity.user;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    @Value("${app.admin.invitation-code}")
    private String adminInvitationCode;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // REGISTER USER OR ADMIN
    public user registerUser(
            String name,
            String email,
            String password,
            String role,
            String adminCode
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        String selectedRole = role == null
                ? "USER"
                : role.toUpperCase();

        if (!selectedRole.equals("USER") &&
                !selectedRole.equals("ADMIN")) {
            throw new RuntimeException("Invalid role");
        }

        if (selectedRole.equals("ADMIN")) {
            if (adminCode == null ||
                    !adminInvitationCode.equals(adminCode)) {
                throw new RuntimeException(
                        "Invalid admin invitation code"
                );
            }
        }

        user newUser = new user();

        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(selectedRole);

        return userRepository.save(newUser);
    }

    // LOGIN
    public user loginUser(String email, String password) {

        user existingUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                password,
                existingUser.getPassword())) {

            throw new RuntimeException("Invalid password");
        }

        return existingUser;
    }

    // GET ALL USERS
    public List<user> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public user getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    // GET USER BY EMAIL
    public user getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}
