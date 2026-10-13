package Day4;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Student implements Comparable<Student>{
    String name;
    int rno;
    int age;
    int marks;
    public Student(String name, int rno,int age,int marks){
        this.name=name;
        this.rno=rno;
        this.age=age;
        this.marks=marks;
    }
    @Override
    public String toString(){
        return name+" "+rno+" "+age+" "+marks;
    }

    @Override
    public int compareTo(Student o){
        return this.marks-o.marks;
    }
}
public class SortUsingComparable {
    public static void main(String[] args) {
        List<Student> list=new ArrayList<>();
        Student s1=new Student("Akash",1,20,80);
        list.add(s1);
        Student s2=new Student("Aryan",2,21,89);
        Student s3=new Student("Bhawan",3,20,81);
        Student s4=new Student("Modi",4,23,83);
        Student s5=new Student("Rahul",5,19,85);
        Student s6=new Student("divy",6,24,86);
        Student s7=new Student("shera",7,25,89);
        Student s8=new Student("Salman",8,22,87);
        Student s9=new Student("Ravi",9,23,80);
        Student s10=new Student("Bishnoi",10,22,83);
        list.add(s2);
        list.add(s3);
        list.add(s4);
        list.add(s5);
        list.add(s6);
        list.add(s7);
        list.add(s8);
        list.add(s9);
        list.add(s10);

        Collections.sort(list);
        for(int i=0;i<10;i++)
        System.out.println(list.get(i));
    }
}
