package Day4;

import java.util.HashMap;
import java.util.Map;

public class MapImplementation {
    public static void main(String[] args) {

        Map<Integer, String> map = new HashMap<>();
        // inserting value in the map
        map.put(1, "Akash");
        map.put(2, "Vikaa");
        map.put(3, "Vikaas");
        map.put(4, "Vikaas");
        map.put(5, "Vikaa");
        //Traversing map using loop
        for(Map.Entry<Integer,String>e: map.entrySet()){
            System.out.println(e.getKey()+" "+e.getValue());
        }
        System.out.println("key 3 is Present or not"+map.containsKey(3));
    }
}
