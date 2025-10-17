package com.whattobuild.repository;

import com.whattobuild.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    
    List<Progress> findByStudentId(Long studentId);
    
    List<Progress> findByProjectId(Long projectId);
    
    List<Progress> findByStudentIdAndProjectId(Long studentId, Long projectId);
    
    List<Progress> findByStatus(Progress.Status status);
    
    @Query("SELECT p FROM Progress p WHERE p.studentId = :studentId AND p.status = 'COMPLETED'")
    List<Progress> findCompletedProgressByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT p FROM Progress p WHERE p.projectId = :projectId AND p.status = 'COMPLETED'")
    List<Progress> findCompletedProgressByProject(@Param("projectId") Long projectId);
    
    @Query("SELECT p FROM Progress p WHERE p.completedDate BETWEEN :startDate AND :endDate")
    List<Progress> findByCompletedDateBetween(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Progress p WHERE p.studentId = :studentId AND p.status = 'COMPLETED'")
    Long countCompletedStepsByStudent(@Param("studentId") Long studentId);
}

