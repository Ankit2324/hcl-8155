package day1;

public class method {
    private int a;
    private int b;

    public method(int a, int b) {
        this.a = a;
        this.b = b;
    }

    public int getA() {
        return a;

    }

    public void setA(int a) {
        this.a = a;
    }

    public int getB() {
        return b;
    }

    public void setB(int b) {
        this.b = b;
    }
    public static method getInstance(int a, int b) {
        return new method(a, b);
}
}
