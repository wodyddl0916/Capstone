package Wattmate.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "`user`")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(name = "kepco_cust_no", nullable = false, length = 20)
    private String kepcoCustNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "household_type", nullable = false)
    private HouseholdType householdType;

    @Column(name = "energy_temp", nullable = false)
    private Float energyTemp;

    @Column(name = "current_point", nullable = false)
    private Integer currentPoint;

    @Column(name = "total_point", nullable = false)
    private Integer totalPoint;

    @ManyToOne
    @JoinColumn(name = "title_id")
    private TitleMaster title;

    public User() {}

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getKepcoCustNo() { return kepcoCustNo; }
    public void setKepcoCustNo(String kepcoCustNo) { this.kepcoCustNo = kepcoCustNo; }

    public HouseholdType getHouseholdType() { return householdType; }
    public void setHouseholdType(HouseholdType householdType) { this.householdType = householdType; }

    public Float getEnergyTemp() { return energyTemp; }
    public void setEnergyTemp(Float energyTemp) { this.energyTemp = energyTemp; }

    public Integer getCurrentPoint() { return currentPoint; }
    public void setCurrentPoint(Integer currentPoint) { this.currentPoint = currentPoint; }

    public Integer getTotalPoint() { return totalPoint; }
    public void setTotalPoint(Integer totalPoint) { this.totalPoint = totalPoint; }

    public TitleMaster getTitle() { return title; }
    public void setTitle(TitleMaster title) { this.title = title; }
}