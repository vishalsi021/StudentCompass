package com.whattobuild.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(name = "project_id", nullable = false)
    private Long projectId;
    
    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;
    
    @Column(name = "step_description", nullable = false)
    private String stepDescription;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, BLOCKED
    }
}

