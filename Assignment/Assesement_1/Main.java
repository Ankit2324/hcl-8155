package Assignment.Assesement_1;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Main {
    public static void main(String[] args) {
       List<Employee> emp=new ArrayList<>();
       emp.add(new Manager(1,"Akshat",4720,4510,1210,2310));
        emp.add(new Admin(2,"rohit",4300,4300,1200,2300));
        emp.add(new Engineer(3,"mannu",4900,4100,1100,2800));
        emp.add(new Accountant(4,"aditya",4000,4000,1200,2300));
        emp.add(new Manager(5,"vikram",4900,4700,1700,2365));
        emp.add(new Admin(5,"tushar",4500,4500,1205,2305));
        emp.add(new Engineer(6,"modi",4600,4900,1400,2700));
        emp.add(new Accountant(7,"rahul",4000,4500,1200,2700));
        emp.add(new Manager(8,"sohan",4750,4550,1250,2100));
        emp.add(new Accountant(9,"gungun",4700,4600,1200,2300));
        emp.add(new Admin(10,"timtim",4600,4400,1000,2500));

        Collections.sort(emp);

        for(Employee e:emp){
            System.out.println(e.toString());
            System.out.println();
        }


    }
}
