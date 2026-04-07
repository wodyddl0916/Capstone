package Wattmate.DTO;

public class SignupRequest {

    private String email;
    private String password;
    private String nickname;
    private String kepcoCustNo;
    private String householdType;

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getNickname() { return nickname; }
    public String getKepcoCustNo() { return kepcoCustNo; }
    public String getHouseholdType() { return householdType; }
}