package Assesment2_javacore_Ankitpandey_2300320100032.model;

public class DVD extends LibraryItem {
    private String director;
    private int duration;

    public DVD(String title, int year, boolean avail, String director, int duration) {
        super(title, year, avail);
        this.director = director;
        this.duration = duration;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }
}
