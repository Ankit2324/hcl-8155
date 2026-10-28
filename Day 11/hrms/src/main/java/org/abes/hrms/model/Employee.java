
package org.abes.hrms.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Employee {

    @Id
    private Long emp_id;
    private String emp_name;
    private String designation;
    private String progStack;
    private String email;

    public Employee() {
    }

    public Employee(long emp_id, String emp_name,
                    String designation, String progStack,
                    String email) {
        this.emp_id = emp_id;
        this.emp_name = emp_name;
        this.designation = designation;
        this.progStack = progStack;
        this.email = email;
    }

    public void setEmp_id(Long emp_id) {
        this.emp_id = emp_id;
    }

    public Long getEmp_id() {
        return emp_id;
    }

    public void setEmp_id(long emp_id) {
        this.emp_id = emp_id;
    }

    public String getEmp_name() {
        return emp_name;
    }

    public void setEmp_name(String emp_name) {
        this.emp_name = emp_name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getProgStack() {
        return progStack;
    }

    public void setProgStack(String progStack) {
        this.progStack = progStack;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "emp_id=" + emp_id +
                ", emp_name='" + emp_name + '\'' +
                ", designation='" + designation + '\'' +
                ", progStack='" + progStack + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
