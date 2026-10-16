package Assesment2_javacore_Ankitpandey_2300320100032.model;

public class Magzine extends LibraryItem {
    private String publisher;
    private int issueNumber;

    public Magzine(String title, int year, boolean avail, String publisher, int issueNumber) {
        super(title, year, avail);
        this.publisher = publisher;
        this.issueNumber = issueNumber;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public int getIssueNumber() {
        return issueNumber;
    }

    public void setIssueNumber(int issueNumber) {
        this.issueNumber = issueNumber;
    }
}
