package Wattmate.Repository;

import Wattmate.Entity.LeagueRanking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueRankingRepository extends JpaRepository<LeagueRanking, Integer> {
}