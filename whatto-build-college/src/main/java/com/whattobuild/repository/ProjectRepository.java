package com.whattobuild.repository;

import com.whattobuild.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    List<Project> findByDifficulty(Project.Difficulty difficulty);
    
    List<Project> findByStatus(Project.Status status);
    
    @Query("SELECT p FROM Project p WHERE :skill MEMBER OF p.skills")
    List<Project> findByRequiredSkill(@Param("skill") String skill);
    
    @Query("SELECT p FROM Project p WHERE p.difficulty = :difficulty AND :skill MEMBER OF p.skills")
    List<Project> findByDifficultyAndSkill(@Param("difficulty") Project.Difficulty difficulty, 
                                          @Param("skill") String skill);
    
    List<Project> findByStudentId(Long studentId);
    
    @Query("SELECT p FROM Project p WHERE p.status = 'AVAILABLE' ORDER BY p.createdAt DESC")
    List<Project> findAvailableProjectsOrderByDate();
    
    @Query("SELECT p FROM Project p WHERE p.estimatedHours BETWEEN :minHours AND :maxHours")
    List<Project> findByEstimatedHoursRange(@Param("minHours") Integer minHours, 
                                           @Param("maxHours") Integer maxHours);
}

