package Day6.Exception_Handling;

public class CustomException extends Exception {
    CustomException(String message) {
        super(message);
    }
}

class Main {
    public static void main(String[] args) {
        int age = 16;

        try {
            if (age < 18) {
                throw new CustomException("Not eligible to vote");
            }
            System.out.println("Eligible to vote");
        } catch (CustomException e) {
            System.out.println(e.getMessage());
        }
    }
}