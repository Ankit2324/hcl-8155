package Day6.StreamImplement;

import java.util.ArrayList;

public class StreamImplementation {
    public static void main(String[] args) {
        ArrayList<Integer> intlist = new ArrayList<>();
        ArrayList<String> strlist = new ArrayList<>();

        intlist.add(5);
        strlist.add("Hello");
//        intlist.stream().distinct().forEach(System.out::println);
//        strlist.stream().distinct().forEach(System.out::println);
        strlist.add("Hello");
        strlist.add("rahul");
        strlist.add("ravi");
        strlist.add("rajul");
        strlist.stream().filter(s -> s.startsWith("r")&&s.endsWith("l")).forEach(System.out::println);

    }
}


