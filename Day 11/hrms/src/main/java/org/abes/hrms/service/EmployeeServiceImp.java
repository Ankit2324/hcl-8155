
package org.abes.hrms.service;

import org.abes.hrms.model.Employee;
import org.abes.hrms.repositry.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImp {

    @Autowired
    private EmployeeRepo employeeRepo;

    public Employee addEmp(Employee emp) {
        return employeeRepo.save(emp);
    }

    public List<Employee> getEmp() {
        return employeeRepo.findAll();
    }

    public Employee getEmpById(long emp_id) {
        return employeeRepo.findById(emp_id).orElse(null);
    }

    public String deleteEmpById(long emp_id) {
        employeeRepo.deleteById(emp_id);
        return "Employee deleted successfully";
    }

    public String updateEmpById(long emp_id, Employee updatedEmp) {
        if (employeeRepo.existsById(emp_id)) {
            updatedEmp.setEmp_id(emp_id);
            employeeRepo.save(updatedEmp);
            return "Employee updated successfully";
        }
        return "Employee not found";
    }

}
