
package org.abes.hrms.service;

import org.abes.hrms.model.Attendance;
import org.abes.hrms.repositry.AttendaceRepositary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceServiceImp implements AttendanceService {

    private final AttendaceRepositary repositry;

    public AttendanceServiceImp(AttendaceRepositary repositry) {
        this.repositry = repositry;
    }

    @Override
    @Transactional
    public Attendance checkIn(
            Long employeeId,
            String employeeName,
            String note) {

        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Invalid employee ID");
        }

        if (employeeName == null || employeeName.isBlank()) {
            throw new IllegalArgumentException("Employee name is required");
        }

        LocalDate today = LocalDate.now();

        Attendance attendance = repositry
                .findByEmployeeIdAndAttendanceDate(employeeId, today)
                .orElse(null);

        if (attendance != null) {
            throw new IllegalStateException(
                    "Attendance already marked for today"
            );
        }

        attendance = new Attendance();
        attendance.setEmployeeId(employeeId);
        attendance.setEmployeeName(employeeName);
        attendance.setAttendanceDate(today);
        attendance.setCheckIn(LocalTime.now().withNano(0));
        attendance.setNote(note);
        attendance.setStatus("IN_PROGRESS");

        return repositry.save(attendance);
    }

    @Override
    @Transactional
    public Attendance checkOut(Long employeeId) {

        Attendance attendance = getTodayAttendance(employeeId);

        if (attendance.getCheckIn() == null) {
            throw new IllegalStateException("Check-in not recorded");
        }

        if (attendance.getCheckOut() != null) {
            throw new IllegalStateException(
                    "Already checked out for today"
            );
        }

        attendance.setCheckOut(LocalTime.now().withNano(0));
        attendance.setStatus("COMPLETED");

        return repositry.save(attendance);
    }

    @Override
    public Attendance getTodayAttendance(Long employeeId) {
        return repositry
                .findByEmployeeIdAndAttendanceDate(
                        employeeId, LocalDate.now()
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No attendance found for today"
                        )
                );
    }

    @Override
    public List<Attendance> getAttendanceHistory(Long employeeId) {
        return repositry
                .findByEmployeeIdOrderByAttendanceDateDesc(employeeId);
    }
}
