package com.fitness.userservice.repository;

import com.fitness.userservice.model.DailyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyProgressRepository extends JpaRepository<DailyProgress, String> {
    Optional<DailyProgress> findByUserIdAndDate(String userId, LocalDate date);
    List<DailyProgress> findByUserIdOrderByDateDesc(String userId);
    List<DailyProgress> findByUserIdAndDateGreaterThanEqualOrderByDateAsc(String userId, LocalDate startDate);
    long countByUserIdAndIsCompletedTrue(String userId);
}
