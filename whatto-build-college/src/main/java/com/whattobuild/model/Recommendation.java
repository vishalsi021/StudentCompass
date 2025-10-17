package com.whattobuild.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_id", nullable = false)
    private Long projectId;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(name = "resume_points", columnDefinition = "TEXT")
    private String resumePoints;
    
    @Column(name = "learning_plan", columnDefinition = "TEXT")
    private String learningPlan;
    
    @Column(name = "match_score")
    private Double matchScore;
    
    @Column(name = "reasoning", columnDefinition = "TEXT")
    private String reasoning;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum Status {
        ACTIVE, ACCEPTED, REJECTED, EXPIRED
    }
}

