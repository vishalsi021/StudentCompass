package com.whattobuild.service;

import com.whattobuild.model.Project;
import com.whattobuild.model.Recommendation;
import com.whattobuild.model.User;
import com.whattobuild.repository.ProjectRepository;
import com.whattobuild.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class RecommendService {
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private RecommendationRepository recommendationRepository;
    
    public List<Map<String, Object>> generateRecommendations(Long studentId, String branch, List<String> skills) {
        // Get available projects
        List<Project> availableProjects = projectRepository.findByStatus(Project.Status.AVAILABLE);
        
        // Create temporary user object for AI analysis
        User tempUser = new User();
        tempUser.setId(studentId);
        tempUser.setBranch(branch);
        tempUser.setSkills(skills);
        
        // Get AI recommendations
        List<Map<String, Object>> aiRecommendations = aiService.recommendProjects(tempUser, availableProjects);
        
        // Save recommendations to database
        for (Map<String, Object> rec : aiRecommendations) {
            Project project = (Project) rec.get("project");
            Double matchScore = (Double) rec.get("matchScore");
            String resumePoints = (String) rec.get("resumePoints");
            String learningPlan = (String) rec.get("learningPlan");
            
            Recommendation recommendation = new Recommendation();
            recommendation.setProjectId(project.getId());
            recommendation.setStudentId(studentId);
            recommendation.setMatchScore(matchScore);
            recommendation.setResumePoints(resumePoints);
            recommendation.setLearningPlan(learningPlan);
            recommendation.setReasoning((String) rec.get("reasoning"));
            recommendation.setStatus(Recommendation.Status.ACTIVE);
            recommendation.setCreatedAt(LocalDateTime.now());
            
            recommendationRepository.save(recommendation);
        }
        
        return aiRecommendations;
    }
    
    public List<Recommendation> getStudentRecommendations(Long studentId) {
        return recommendationRepository.findActiveRecommendationsByStudentOrderByScore(studentId);
    }
    
    public void acceptRecommendation(Long recommendationId) {
        recommendationRepository.findById(recommendationId).ifPresent(rec -> {
            rec.setStatus(Recommendation.Status.ACCEPTED);
            recommendationRepository.save(rec);
        });
    }
    
    public void rejectRecommendation(Long recommendationId) {
        recommendationRepository.findById(recommendationId).ifPresent(rec -> {
            rec.setStatus(Recommendation.Status.REJECTED);
            recommendationRepository.save(rec);
        });
    }
    
    public Map<String, Object> analyzeRepository(String repoUrl, Long studentId) {
        // Get student info
        User student = new User(); // In real app, get from UserRepository
        student.setId(studentId);
        student.setSkills(Arrays.asList("Java", "Spring Boot")); // Mock skills
        
        return aiService.analyzeRepository(repoUrl, student);
    }
}

