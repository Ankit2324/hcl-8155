package Assignment.Assesement_2_hcl_trainig_2300320100032.model;

public class Magazine {
    int issueNumber;

    public Magazine(int issueNumber) {
        this.issueNumber = issueNumber;
    }

    public int getIssueNumber() {
        return issueNumber;
    }

    public void setIssueNumber(int issueNumber) {
        this.issueNumber = issueNumber;
    }
    public int lateFee(){
        return 5;
    }
}
