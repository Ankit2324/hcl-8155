package day1;

public class callmethod {
    public static void main(String[] args) {
        method m1=method.getInstance(10,4);
        method m2=method.getInstance(20,5);
        System.out.println(m1.getA());
        System.out.println(m1.getB());
        System.out.println(m2.getA());
        System.out.println(m2.getB());

    }
}
