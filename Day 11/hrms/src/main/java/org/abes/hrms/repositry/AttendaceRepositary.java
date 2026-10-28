
package org.abes.hrms.repositry;

import org.abes.hrms.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendaceRepositary
        extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeIdAndAttendanceDate(
            Long employeeId,
            LocalDate attendanceDate
    );

    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(
            Long employeeId
    );
}
