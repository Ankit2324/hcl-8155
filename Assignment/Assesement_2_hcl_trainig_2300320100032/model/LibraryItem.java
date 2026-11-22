package Assignment.Assesement_2_hcl_trainig_2300320100032.model;

abstract class LibraryItem implements Borrowable{
    static int id=1001;
    private String title;
    private int year;
    private boolean avail;

    public LibraryItem(String title, int year, boolean avail) {
        this.title = title;
        this.year = year;
        this.avail = avail;
        id++;
    }

    public static int getId() {
        return id;
    }

    public static void setId(int id) {
        LibraryItem.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public boolean isAvail() {
        return avail;
    }

    public void setAvail(boolean avail) {
        this.avail = avail;
    }

}
