
package com.example.backend.controller;

import com.example.backend.entity.Complaint;
import com.example.backend.service.ComplaintService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Submit a new complaint
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @RequestBody Complaint complaint,
            @RequestParam Long userId) {

        Complaint savedComplaint =
                complaintService.createComplaint(complaint, userId);

        return ResponseEntity.ok(savedComplaint);
    }

    // Get all complaints
    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }

    // Get complaint by ID
    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                complaintService.getComplaintById(id)
        );
    }

    // Get complaints of a particular user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getUserComplaints(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                complaintService.getUserComplaints(userId)
        );
    }

    // Update complaint status
    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(id, status)
        );
    }

    // Delete complaint
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComplaint(
            @PathVariable Long id) {

        complaintService.deleteComplaint(id);

        return ResponseEntity.ok("Complaint deleted successfully");
    }
}
