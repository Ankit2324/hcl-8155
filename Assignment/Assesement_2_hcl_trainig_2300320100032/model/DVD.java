package Assignment.Assesement_2_hcl_trainig_2300320100032.model;

public class DVD extends LibraryItem {
    private static final double latefee = 5.0;

    private int durationMinutes;

    public DVD(String title, int year, int durationMinutes) {
        super(title, year);
        if (durationMinutes <= 0) {
            throw new IllegalArgumentException("Duration must be positive.");
        }
        this.durationMinutes = durationMinutes;
    }

    @Override
    public double lateFee(int daysLate) {
        if (daysLate <= 0) {
            return 0.0;
        }
        return daysLate * latefee;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    @Override
    public String toString() {
        return "DVD[" + super.toString() + ", " + durationMinutes + " mins]";
    }
}
