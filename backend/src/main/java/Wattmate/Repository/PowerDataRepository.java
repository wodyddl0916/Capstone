package Wattmate.Repository;

import Wattmate.Entity.PowerData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PowerDataRepository extends JpaRepository<PowerData, Integer> {
}