package Day3;

abstract class AbstractionExample {
    abstract void show();
    void nonAbstarct(){
        System.out.println("This is non abstract method");
    }
}
class Child extends AbstractionExample{
    void show(){
        System.out.println("This method is inherited");
    }
    public static void main(String[] args) {
        Child ob=new Child();
        ob.show();
        ob.nonAbstarct();

        //We cannot create object of abstract class directly.
         //AbstractionExample ob1=new AbstractionExample();
        }
    }


