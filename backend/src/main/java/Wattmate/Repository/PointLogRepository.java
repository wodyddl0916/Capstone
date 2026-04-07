package Wattmate.Repository;

import Wattmate.Entity.PointLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointLogRepository extends JpaRepository<PointLog, Integer> {
}