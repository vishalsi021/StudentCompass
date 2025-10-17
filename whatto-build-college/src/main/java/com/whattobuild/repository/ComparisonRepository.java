package com.whattobuild.repository;

import com.whattobuild.model.Comparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComparisonRepository extends JpaRepository<Comparison, Long> {
    
    @Query("SELECT c FROM Comparison c WHERE (c.student1 = :studentId OR c.student2 = :studentId)")
    List<Comparison> findByStudentInvolved(@Param("studentId") Long studentId);
    
    Optional<Comparison> findByStudent1AndStudent2(Long student1, Long student2);
    
    @Query("SELECT c FROM Comparison c WHERE c.similarityScore >= :minScore ORDER BY c.similarityScore DESC")
    List<Comparison> findBySimilarityScoreGreaterThanEqual(@Param("minScore") Double minScore);
    
    @Query("SELECT c FROM Comparison c WHERE c.createdAt >= :since")
    List<Comparison> findCreatedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT c FROM Comparison c ORDER BY c.createdAt DESC")
    List<Comparison> findAllOrderByCreatedDate();
    
    @Query("SELECT COUNT(c) FROM Comparison c WHERE c.student1 = :studentId OR c.student2 = :studentId")
    Long countComparisonsInvolvingStudent(@Param("studentId") Long studentId);
}

