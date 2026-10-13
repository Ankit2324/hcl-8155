package Day4;

import java.util.Deque;
import java.util.LinkedList;
import java.util.Queue;

public class ImplementQueue {
    public static void main(String[] args) {
        //Implemeneting queue using LinkedList
        Queue<Integer>que =new LinkedList<>();
        int i=0;
        while(i<5){
            que.offer(i);
            i++;
            System.out.println(que.poll());
        }
        //Implementing Deque using LinkedList

        //1- addFirst and addlast in the Dequeue
        Deque<Integer>de=new LinkedList<>();
        de.addFirst(10);
        de.addFirst(21);
        de.addLast(32);
        System.out.println(de);
        //2-removeFirst and removeLast to remove element from first and last
        de.removeFirst();
        de.removeLast();
        System.out.println(de);

    }
}
