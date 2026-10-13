package Day3;
import java.util.*;

public class ListExample {
    public static void main(String[] args) {
        List<Integer>list=new ArrayList<>(Arrays.asList(1,2,3,4));
        //Implementing add method
        list.add(5);
        List<Integer>list2=new ArrayList<>(Arrays.asList(8,9,0));
        list.addAll(1,list2);

        System.out.println("size of the lsit"+list.size());
        //Implemeting remove method
        list.remove(0);
        list.removeAll(list2);

        //Implementing set() method
        list.set(0,99);
        list.contains(99);
        list.equals(2);
        System.out.println(list.equals(list2));

        //retain all the elements in list
        list.retainAll(list2);
        //finding the index of an element using indexOf() method
        list.indexOf(2);

       // Adding element at a specified index withou replacing the existing elemmnt at those index
        list2.add(1,23);
        System.out.println(list2);
    }
}
