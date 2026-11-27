
package com.example.backend.controller;

import com.example.backend.entity.Complaint;
import com.example.backend.service.ComplaintService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    // Submit complaint using logged-in user's JWT identity
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @RequestBody Complaint complaint,
            Authentication authentication) {

        Complaint savedComplaint =
                complaintService.createComplaint(
                    complaint,
                    authentication.getName()
                );

        return ResponseEntity.ok(savedComplaint);
    }

    // Get all complaints (Admin only through SecurityConfig)
    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }

    // Get a complaint only if it belongs to logged-in user
    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.getComplaintByIdForUser(
                    id,
                    authentication.getName()
                )
        );
    }

    // Get logged-in user's complaints.
    // userId path variable is retained for frontend compatibility,
    // but it is NOT used for identifying the user.
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getUserComplaints(
            @PathVariable Long userId,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.getUserComplaintsByEmail(
                    authentication.getName()
                )
        );
    }

    // Update complaint status (Admin only through SecurityConfig)
    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                complaintService.updateComplaintStatus(id, status)
        );
    }

    // Delete only the logged-in user's complaint
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComplaint(
            @PathVariable Long id,
            Authentication authentication) {

        complaintService.deleteComplaintForUser(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Complaint deleted successfully"
        );
    }
}
