package Assignment.Assesement_2_hcl_trainig_2300320100032.exception;

public class LibraryException extends RuntimeException{
    LibraryException(String msg){
        super("Borrowing item not found");
    }
}
