
package org.abes.hrms.repositry;

import org.abes.hrms.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

    @Repository
    public interface EmployeeRepo extends JpaRepository<Employee,Long> {

}
