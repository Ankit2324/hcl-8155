//caling parent class using super method
package Day2;

public class SuperCalling {
    public SuperCalling(){
        int v=10;
        System.out.println(v);
    }
    public static class Child extends SuperCalling{
        public Child(){
            super();
        }
    }
    public static void main(String[] args) {
        System.out.println("main method");
        Child n = new Child();

    }
}
