
package org.abes.hrms.Controller;

import org.abes.hrms.model.Employee;
import org.abes.hrms.service.EmployeeServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    @Autowired
    private EmployeeServiceImp employeeService;

    @GetMapping("/")
    public String index() {
        return "Welcome to Hclhrms";
    }

    // Get all employees
    @GetMapping("/getemp")
    public List<Employee> getEmp() {
        return employeeService.getEmp();
    }

    // Add a new employee
    @PostMapping("/addemp")
    public Employee addEmp(@RequestBody Employee employee) {
        return employeeService.addEmp(employee);
    }

    // Get employee by ID
    @GetMapping("/getempbyid")
    public Object getEmpById(@RequestParam long emp_id) {
        Employee emp = employeeService.getEmpById(emp_id);

        if (emp == null) {
            return "Employee not found";
        }

        return emp;
    }

    // Delete employee by ID
    @DeleteMapping("/deleteempbyid")
    public String deleteEmpById(@RequestParam long emp_id) {
        return employeeService.deleteEmpById(emp_id);
    }

    // Update employee by ID
    @PatchMapping("/updateempbyid")
    public String updateEmpById(
            @RequestParam long emp_id,
            @RequestBody Employee employee) {

        return employeeService.updateEmpById(emp_id, employee);
    }
}
