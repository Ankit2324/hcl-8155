package Assignment.Assesement_1;

abstract class Employee implements Comparable<Employee> {
    int emp_id;
    String name;
    double basic;
    double hra;
    double ta;
    double spall;

    public Employee(int emp_id, String name, double basic, double hra, double spall, double ta) {
        this.emp_id = emp_id;
        this.name = name;
        this.basic = basic;
        this.hra = hra;
        this.spall = spall;
        this.ta = ta;
    }
    Employee() {
    }
    public int getEmp_id() {
        return emp_id;
    }
    public void setEmp_id(int emp_id) {
        this.emp_id = emp_id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public double getBasic() {
        return basic;
    }
    public void setBasic(double basic) {
        this.basic = basic;
    }
    public double getHra() {
        return hra;
    }
    public void setHra(double hra) {
        this.hra = hra;
    }
    public double getTa() {
        return ta;
    }
    public void setTa(double ta) {
        this.ta = ta;
    }
    public double getSpall() {
        return spall;
    }
    public void setSpall(double spall) {
        this.spall = spall;
    }
    abstract int getRate();

    public double calculateBonus(double basic,double hra,int bonusRate){
        return (basic + hra) * (1.0 * bonusRate) / 100;
    }
    public String toString(){
        return "Employee id: "+emp_id+"\n"+ "Name: "+name +"\n"+"Bonus: "+calculateBonus(this.basic, this.hra,this.getRate());
    }
    @Override
    public int compareTo(Employee o) {
        return (int) (this.calculateBonus(this.basic,this.hra,this.getRate())-o.calculateBonus(o.basic,o.hra,o.getRate()));
    }
}
class Manager extends Employee{

    public Manager(int emp_id, String name, double basic, double hra, double spall, double ta) {
        super(emp_id, name, basic, hra, spall, ta);
    }

    @Override
    public int getRate(){
        return 12;
    }
}
class Engineer extends Employee{

    public Engineer(int emp_id, String name, double basic, double hra, double spall, double ta) {
        super(emp_id, name, basic, hra, spall, ta);
    }

    @Override
    public int getRate(){
        return 12;
    }
}
class Admin extends Employee{

    public Admin(int emp_id, String name, double basic, double hra, double spall, double ta) {
        super(emp_id, name, basic, hra, spall, ta);
    }

    @Override
    public int getRate(){
        return 10;
    }
}
class Accountant extends Employee{

    public Accountant(int emp_id, String name, double basic, double hra, double spall, double ta) {
        super(emp_id, name, basic, hra, spall, ta);
    }

    @Override
    public int getRate(){
        return 12;
    }
}


