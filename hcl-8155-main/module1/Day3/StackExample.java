package Day3;
import java.util.*;
public class StackExample {
    public static void main(String[] args) {
        Stack<Integer>st=new Stack<>();
        //push elemnts in stack
        st.push(1);
        st.push(2);
        //print peek element
        System.out.println(st.peek());

        //popping the top element;
        System.out.println(st.pop());
        System.out.println(st.size());
        st.pop();
        System.out.println(st.size());

    }
}
