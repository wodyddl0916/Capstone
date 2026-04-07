package Wattmate.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "title_master")
public class TitleMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "title_id")
    private Integer titleId;

    @Column(name = "title_name", nullable = false, length = 20)
    private String titleName;

    @Column(name = "min_rank", nullable = false)
    private Integer minRank;

    @Column(name = "max_rank", nullable = false)
    private Integer maxRank;

    @Column(name = "color_code", length = 7)
    private String colorCode;

    public TitleMaster() {}

    public Integer getTitleId() {
        return titleId;
    }

    public void setTitleId(Integer titleId) {
        this.titleId = titleId;
    }

    public String getTitleName() {
        return titleName;
    }

    public void setTitleName(String titleName) {
        this.titleName = titleName;
    }

    public Integer getMinRank() {
        return minRank;
    }

    public void setMinRank(Integer minRank) {
        this.minRank = minRank;
    }

    public Integer getMaxRank() {
        return maxRank;
    }

    public void setMaxRank(Integer maxRank) {
        this.maxRank = maxRank;
    }

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }
}