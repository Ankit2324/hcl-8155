package Day3;

 public interface InterfaceExample {
    void show();
}
class Child2 implements InterfaceExample{
    public static void main(String[] args) {
        Child2 ob4=new Child2();
        ob4.show();

    }
     public void show(){
        System.out.println("This method is implemmented by its parent class");
    }


}
