package Day5;
import java.util.*;
public class Emplyee {




        private int id;
        private String name;
        private double salary;

        // Constructor
        public Emplyee(int id, String name, double salary) {
            this.id = id;
            this.name = name;
            this.salary = salary;
        }

        // Getters
        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public double getSalary() {
            return salary;
        }

        // Setters
        public void setName(String name) {
            this.name = name;
        }

        public void setSalary(double salary) {
            this.salary = salary;
        }

        // Display employee details
        @Override
        public String toString() {
            return id + " " + name + " " + salary;
        }
    }

    class details {
        public static void main(String[] args) {

            ArrayList<Emplyee> employees = new ArrayList<>();

            // 1. CREATE: Add employees
            employees.add(new Emplyee(103, "Aman", 45000));
            employees.add(new Emplyee(101, "Rahul", 35000));
            employees.add(new Emplyee(104, "Priya", 55000));
            employees.add(new Emplyee(102, "Rohit", 40000));

            // 2. READ: Using Iterator
            System.out.println("Employees using Iterator:");

            Iterator<Emplyee> itr = employees.iterator();

            while (itr.hasNext()) {
                Emplyee e = itr.next();
                System.out.println(e);
            }

            // 3. UPDATE: Update salary of employee ID 101
            for (Emplyee e : employees) {
                if (e.getId() == 101) {
                    e.setSalary(50000);
                    e.setName("Rahul Sharma");
                    break;
                }
            }

            // 4. DELETE: Remove employee ID 104
            Iterator<Emplyee> deleteItr = employees.iterator();

            while (deleteItr.hasNext()) {
                Emplyee e = deleteItr.next();

                if (e.getId() == 104) {
                    deleteItr.remove();
                }
            }

            // 5. SORT: Increasing order of ID
            employees.sort(
                    Comparator.comparingInt(Emplyee::getId)
            );

            System.out.println("\nIncreasing Order:");

            ListIterator<Emplyee> listItr = employees.listIterator();

            while (listItr.hasNext()) {
                System.out.println(listItr.next());
            }

            // 6. DECREASING ORDER using ListIterator
            System.out.println("\nDecreasing Order:");

            while (listItr.hasPrevious()) {
                System.out.println(listItr.previous());
            }

            // 7. READ: Updated employee list
            System.out.println("\nFinal Employee List:");

            for (Emplyee e : employees) {
                System.out.println(e);
            }
        }

}
