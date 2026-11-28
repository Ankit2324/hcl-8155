
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
    private final NotificationService notificationService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    private user getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Complaint createComplaint(Complaint complaint, String email) {
        user loggedInUser = getUserByEmail(email);
        complaint.setUser(loggedInUser);
        complaint.setStatus("PENDING");

        Complaint savedComplaint = complaintRepository.save(complaint);

        notificationService.notifyAllAdmins(
                "New complaint submitted: " + savedComplaint.getTitle()
                        + " (Complaint ID: " + savedComplaint.getId() + ")"
        );

        return savedComplaint;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public List<Complaint> getUserComplaintsByEmail(String email) {
        user loggedInUser = getUserByEmail(email);
        return complaintRepository.findByUserId(loggedInUser.getId());
    }

    public Complaint getComplaintByIdForUser(Long id, String email) {
        Complaint complaint = getComplaintById(id);

        if (complaint.getUser() == null ||
                !Objects.equals(complaint.getUser().getEmail(), email)) {
            throw new RuntimeException("Access denied");
        }

        return complaint;
    }

    public Complaint updateComplaintStatus(Long id, String status) {
        Complaint complaint = getComplaintById(id);
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }

    public void deleteComplaintForUser(Long id, String email) {
        Complaint complaint = getComplaintByIdForUser(id, email);
        complaintRepository.delete(complaint);
    }
}
