package Day3;

import java.util.HashSet;
import java.util.Set;

public class SetExample {
    public static void main(String[] args) {
      Set<Integer> set=new HashSet<>();
      set.add(1);
      set.add(1);
      set.add(2);

        System.out.println("Elemet of the set  is:"+set);
        System.out.println("size of the set is"+set.size());
        set.remove(1);
        System.out.println("Set After removing 1"+ set);
        System.out.println("Set contains 3 or not"+set.contains(3));
    }
}
