package com.whattobuild.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comparisons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comparison {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student1_id", nullable = false)
    private Long student1;
    
    @Column(name = "student2_id", nullable = false)
    private Long student2;
    
    @Column(name = "results_json", columnDefinition = "TEXT")
    private String resultsJson;
    
    @Column(name = "similarity_score")
    private Double similarityScore;
    
    @Column(name = "strengths_student1", columnDefinition = "TEXT")
    private String strengthsStudent1;
    
    @Column(name = "strengths_student2", columnDefinition = "TEXT")
    private String strengthsStudent2;
    
    @Column(name = "collaboration_suggestions", columnDefinition = "TEXT")
    private String collaborationSuggestions;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

