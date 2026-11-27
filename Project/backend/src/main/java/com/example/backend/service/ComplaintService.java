
package com.example.backend.service;

import com.example.backend.entity.Complaint;
import com.example.backend.entity.user;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository) {

        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    // Find logged-in user using JWT email
    private user getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));
    }

    // Submit complaint for logged-in user
    public Complaint createComplaint(
            Complaint complaint, String email) {

        user loggedInUser = getUserByEmail(email);

        complaint.setUser(loggedInUser);
        complaint.setStatus("PENDING");

        return complaintRepository.save(complaint);
    }

    // Get all complaints (Admin)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get complaint by ID
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Complaint not found"));
    }

    // Get only logged-in user's complaints
    public List<Complaint> getUserComplaintsByEmail(String email) {
        user loggedInUser = getUserByEmail(email);

        return complaintRepository.findByUserId(loggedInUser.getId());
    }

    // Get a complaint only if it belongs to logged-in user
    public Complaint getComplaintByIdForUser(
            Long id, String email) {

        Complaint complaint = getComplaintById(id);

        if (complaint.getUser() == null ||
                !Objects.equals(
                    complaint.getUser().getEmail(), email)) {
            throw new RuntimeException("Access denied");
        }

        return complaint;
    }

    // Update complaint status (Admin)
    public Complaint updateComplaintStatus(
            Long id, String status) {

        Complaint complaint = getComplaintById(id);

        complaint.setStatus(status);

        return complaintRepository.save(complaint);
    }

    // Delete only logged-in user's complaint
    public void deleteComplaintForUser(
            Long id, String email) {

        Complaint complaint = getComplaintByIdForUser(id, email);

        complaintRepository.delete(complaint);
    }
}
