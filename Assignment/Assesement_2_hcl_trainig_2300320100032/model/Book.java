package Assignment.Assesement_2_hcl_trainig_2300320100032.model;

public class Book extends LibraryItem{
    String author;
    String isbn;

    public Book(String title, int year, boolean avail, String author, String isbn) {
        super(title, year, avail);
        this.author = author;
        this.isbn = isbn;
    }
    Book(){
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }
    public int latefee(){
        return 2;
    }

    @Override
    public void borrow() {
        System.out.println("Borrow Successful");
    }

    @Override
    public void giveBack() {

    }
}
