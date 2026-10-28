
package org.abes.hrms.Controller;

import org.abes.hrms.model.Attendance;
import org.abes.hrms.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestBody
                                     Map<String, Object> request) {
        try {
            Long employeeId = Long.valueOf(
                    request.get("employeeId").toString()
            );

            String employeeName = request.get("employeeName").toString();
            String note = request.get("note") == null
                    ? ""
                    : request.get("note").toString();

            return ResponseEntity.ok(
                    attendanceService.checkIn(
                            employeeId, employeeName, note
                    )
            );
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        } catch (NullPointerException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Required fields are missing"));
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(
            @RequestParam Long employeeId) {
        try {
            return ResponseEntity.ok(
                    attendanceService.checkOut(employeeId)
            );
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/today")
    public ResponseEntity<?> getToday(
            @RequestParam Long employeeId) {
        try {
            return ResponseEntity.ok(
                    attendanceService.getTodayAttendance(employeeId)
            );
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/history")
    public List<Attendance> getHistory(
            @RequestParam Long employeeId) {
        return attendanceService.getAttendanceHistory(employeeId);
    }
}
