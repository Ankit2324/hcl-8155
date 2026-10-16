package Assesment2_javacore_Ankitpandey_2300320100032.model;

public class Books extends LibraryItem {
    private String author;
    private String isbn;

    public Books(String title, int year, boolean avail, String author, String isbn) {
        super(title, year, avail);
        this.author = author;
        this.isbn = isbn;
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
}
