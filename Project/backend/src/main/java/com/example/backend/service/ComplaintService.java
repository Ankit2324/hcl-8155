
package com.example.backend.service;

import com.example.backend.entity.Complaint;
import com.example.backend.entity.user;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

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

    // Submit a new complaint
    public Complaint createComplaint(
            Complaint complaint, Long userId) {

        user user = userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        complaint.setUser(user);
        complaint.setStatus("PENDING");

        return complaintRepository.save(complaint);
    }

    // Get all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get complaint by ID
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Complaint not found"));
    }

    // Get complaints of a particular user
    public List<Complaint> getUserComplaints(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    // Update complaint status
    public Complaint updateComplaintStatus(
            Long id, String status) {

        Complaint complaint = getComplaintById(id);

        complaint.setStatus(status);

        return complaintRepository.save(complaint);
    }

    // Delete complaint
    public void deleteComplaint(Long id) {

        Complaint complaint = getComplaintById(id);

        complaintRepository.delete(complaint);
    }
}
