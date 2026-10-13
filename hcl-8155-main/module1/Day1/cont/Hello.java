package Day1.cont;
import Day1.mypc.Akash;
public class Hello {
    void show1(){
        System.out.print("ddd");
    }
    public static void main(String[] args) {
//        Akash ob1 =new Akash();
       Akash.show();
//making new ch
        for(int i=0;i<args.length;i++){
            System.out.println(args[i]);
        }
    }
}
