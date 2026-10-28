
package org.abes.hrms.service;

import org.abes.hrms.model.Attendance;
import java.util.List;

public interface AttendanceService {

    Attendance checkIn(
            Long employeeId,
            String employeeName,
            String note
    );

    Attendance checkOut(Long employeeId);

    Attendance getTodayAttendance(Long employeeId);

    List<Attendance> getAttendanceHistory(Long employeeId);
}
