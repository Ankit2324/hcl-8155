package Day5.lambdafunction;
@FunctionalInterface
interface MyInterf{
    void show();
}

@FunctionalInterface
interface Arithmetic{
    int result(int x,int y);
}
@FunctionalInterface
interface evenodd{
    boolean check(int x);
}
public class lambdafunctionimplement {
    static void main(){
        MyInterf m1=()->{
            System.out.println("anshu ");
            System.out.println("lambda");
        };
        m1.show();

        Arithmetic addition= (int c,int d)-> c+d;
        Arithmetic subtraction= (int c,int d)-> c-d;
        Arithmetic multiplication= (int c,int d)-> c*d;
        Arithmetic divide= (int c,int d)-> c/d;

            System.out.println("addition:" + addition.result(4, 5));
            System.out.println("subtraction:" + subtraction.result(10, 5));
            System.out.println("multiplication:" + multiplication.result(4, 5));
            System.out.println("divide:" + divide.result(20, 5));

            evenodd checkeven=(int x)->{
                if(x%2==0) return true;
               else return false;
            };
            evenodd checkodd=(int x)->{
                if(x%2!=0) return true;
                else return false;

        };
        System.out.println("even:" + checkeven.check(6));
        System.out.println("even:" + checkeven.check(10));
        System.out.println("even:" + checkodd.check(6 ));
    }
}
