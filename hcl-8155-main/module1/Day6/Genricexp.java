package Day6;

import java.security.Key;

public class Genricexp<K,V>{
    private K key;
    private V value;
    public Genricexp(K key,V value){
        this.key=key;
        this.value=value;
    }
    public void getPair(K key,V value){
        System.out.println("Key:"+ key+"Value:"+value);
    }

    static void main(String[] args) {
        Genricexp<Integer,String> e1= new Genricexp<>(1,"one");
        e1.getPair(1,"one");

    }


}
