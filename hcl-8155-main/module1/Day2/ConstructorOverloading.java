package Day2;

public class ConstructorOverloading {
    String name;
    int rollno;
    public ConstructorOverloading(String name, int rollno){
        this.name=name;
        this.rollno=rollno;
    }

    public static void main(String[] args) {
        ConstructorOverloading ob=new ConstructorOverloading("Akash",24);
       // ob.name="Akash";
        System.out.println(ob.name+" "+ob.rollno+" ");
    }
}
