package com.whattobuild.repository;

import com.whattobuild.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    
    List<Recommendation> findByStudentId(Long studentId);
    
    List<Recommendation> findByProjectId(Long projectId);
    
    List<Recommendation> findByStatus(Recommendation.Status status);
    
    @Query("SELECT r FROM Recommendation r WHERE r.studentId = :studentId AND r.status = 'ACTIVE' ORDER BY r.matchScore DESC")
    List<Recommendation> findActiveRecommendationsByStudentOrderByScore(@Param("studentId") Long studentId);
    
    @Query("SELECT r FROM Recommendation r WHERE r.matchScore >= :minScore ORDER BY r.matchScore DESC")
    List<Recommendation> findByMatchScoreGreaterThanEqual(@Param("minScore") Double minScore);
    
    @Query("SELECT r FROM Recommendation r WHERE r.createdAt >= :since")
    List<Recommendation> findCreatedSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(r) FROM Recommendation r WHERE r.studentId = :studentId AND r.status = 'ACCEPTED'")
    Long countAcceptedRecommendationsByStudent(@Param("studentId") Long studentId);
}

