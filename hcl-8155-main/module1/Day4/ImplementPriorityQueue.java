package Day4;

//import java.util.PriorityQueue;
import java.util.*;
public class ImplementPriorityQueue {
    public static void main(String[] args) {
        PriorityQueue<Integer>pq=new PriorityQueue<>();
        pq.offer(3);
        pq.offer(2);
        pq.offer(6);
        pq.offer(4);
        System.out.println(pq);
        PriorityQueue<Integer>pq2=new PriorityQueue<>(Collections.reverseOrder());
        pq2.offer(3);
        pq2.offer(2);
        pq2.offer(6);
        pq2.offer(4);
        System.out.println(pq2);
    }
}
