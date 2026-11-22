package Assignment.Assesement_2_hcl_trainig_2300320100032.exception;

import Assignment.Assesement_2.model.Book;

import java.util.ArrayList;
import java.util.List;

public class OtherException extends LibraryException{
    List<Book> ItemList=new ArrayList<>();
    public String itemNotFound(String itemName){
        try {
            if (!ItemList.contains(itemName)) {
                throw new OtherException("Borrowing item does not exist");
            }
        }
        catch (LibraryException e){
            System.out.println(e.getMessage());
        }
    }
    public String borrowLimit(){
        if(borrowLimit()>3){
            return "Exceeded";
        }
        return "can Be Buy";
    }
}
