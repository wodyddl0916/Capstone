package Wattmate.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "league_ranking")
public class LeagueRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer rankId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "league_type", nullable = false)
    private HouseholdType leagueType;

    @Column(name = "saved_kwh", nullable = false)
    private Float savedKwh;

    @Column(name = "rank_no", nullable = false)
    private Integer rankNo;

    @Column(name = "calc_date", nullable = false)
    private LocalDate calcDate;

    public LeagueRanking() {}

    public Integer getRankId() { return rankId; }
    public void setRankId(Integer rankId) { this.rankId = rankId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public HouseholdType getLeagueType() { return leagueType; }
    public void setLeagueType(HouseholdType leagueType) { this.leagueType = leagueType; }

    public Float getSavedKwh() { return savedKwh; }
    public void setSavedKwh(Float savedKwh) { this.savedKwh = savedKwh; }

    public Integer getRankNo() { return rankNo; }
    public void setRankNo(Integer rankNo) { this.rankNo = rankNo; }

    public LocalDate getCalcDate() { return calcDate; }
    public void setCalcDate(LocalDate calcDate) { this.calcDate = calcDate; }
}