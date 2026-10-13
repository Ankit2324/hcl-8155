
//Inheritance using super
//Note- We cannot inherit static method and this is called method hiding
package Day2;
public class Parent {
     static void show(){
        System.out.println("I am Parent Class");
    }
}
class Child extends Parent{
    static void show(){
         //super.show();
        System.out.println("I am Child class");
    }
    public  static void main(String[] args) {
        Child ob=new Child();
        ob.show();
        Parent ob1=new Parent();
        ob1.show();
        Parent ob2=new Child();
        ob2.show();
    }
}
