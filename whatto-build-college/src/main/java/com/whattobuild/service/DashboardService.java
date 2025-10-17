package com.whattobuild.service;

import com.whattobuild.model.Project;
import com.whattobuild.model.Progress;
import com.whattobuild.model.Recommendation;
import com.whattobuild.model.User;
import com.whattobuild.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ProgressRepository progressRepository;
    
    @Autowired
    private RecommendationRepository recommendationRepository;
    
    @Autowired
    private ComparisonRepository comparisonRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        stats.put("totalStudents", userRepository.findByRole(User.Role.STUDENT).size());
        stats.put("totalAdmins", userRepository.findByRole(User.Role.ADMIN).size());
        
        // Project statistics
        stats.put("totalProjects", projectRepository.count());
        stats.put("availableProjects", projectRepository.findByStatus(Project.Status.AVAILABLE).size());
        stats.put("inProgressProjects", projectRepository.findByStatus(Project.Status.IN_PROGRESS).size());
        stats.put("completedProjects", projectRepository.findByStatus(Project.Status.COMPLETED).size());
        
        // Progress statistics
        stats.put("totalProgressEntries", progressRepository.count());
        stats.put("completedSteps", progressRepository.findByStatus(Progress.Status.COMPLETED).size());
        
        // Recommendation statistics
        stats.put("totalRecommendations", recommendationRepository.count());
        stats.put("activeRecommendations", recommendationRepository.findByStatus(Recommendation.Status.ACTIVE).size());
        stats.put("acceptedRecommendations", recommendationRepository.findByStatus(Recommendation.Status.ACCEPTED).size());
        
        // Comparison statistics
        stats.put("totalComparisons", comparisonRepository.count());
        
        // Recent activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        stats.put("recentRecommendations", recommendationRepository.findCreatedSince(weekAgo).size());
        stats.put("recentProgress", progressRepository.findByCompletedDateBetween(weekAgo, LocalDateTime.now()).size());
        stats.put("recentComparisons", comparisonRepository.findCreatedSince(weekAgo).size());
        
        return stats;
    }
    
    public Map<String, Object> getStudentDashboard(Long studentId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Student-specific statistics
        dashboard.put("studentId", studentId);
        dashboard.put("completedSteps", progressRepository.countCompletedStepsByStudent(studentId));
        dashboard.put("activeRecommendations", recommendationRepository.findByStudentId(studentId).stream()
                .filter(r -> r.getStatus() == Recommendation.Status.ACTIVE)
                .count());
        dashboard.put("acceptedRecommendations", recommendationRepository.countAcceptedRecommendationsByStudent(studentId));
        dashboard.put("comparisonsInvolved", comparisonRepository.countComparisonsInvolvingStudent(studentId));
        
        // Recent activity
        LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        dashboard.put("recentProgress", progressRepository.findByCompletedDateBetween(weekAgo, LocalDateTime.now()).stream()
                .filter(p -> p.getStudentId().equals(studentId))
                .count());
        
        // Learning streak (mock calculation)
        dashboard.put("currentStreak", calculateLearningStreak(studentId));
        dashboard.put("longestStreak", calculateLongestStreak(studentId));
        
        return dashboard;
    }
    
    public Map<String, Object> getSkillDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        // Mock skill distribution data
        Map<String, Integer> skillCounts = new HashMap<>();
        skillCounts.put("Java", 45);
        skillCounts.put("Python", 38);
        skillCounts.put("JavaScript", 52);
        skillCounts.put("React", 28);
        skillCounts.put("Spring Boot", 35);
        skillCounts.put("MySQL", 42);
        skillCounts.put("Docker", 18);
        skillCounts.put("AWS", 12);
        
        distribution.put("skillDistribution", skillCounts);
        distribution.put("totalStudents", skillCounts.values().stream().mapToInt(Integer::intValue).sum());
        
        return distribution;
    }
    
    public Map<String, Object> getProjectDifficultyDistribution() {
        Map<String, Object> distribution = new HashMap<>();
        
        Map<String, Integer> difficultyCounts = new HashMap<>();
        difficultyCounts.put("BEGINNER", projectRepository.findByDifficulty(Project.Difficulty.BEGINNER).size());
        difficultyCounts.put("INTERMEDIATE", projectRepository.findByDifficulty(Project.Difficulty.INTERMEDIATE).size());
        difficultyCounts.put("ADVANCED", projectRepository.findByDifficulty(Project.Difficulty.ADVANCED).size());
        difficultyCounts.put("EXPERT", projectRepository.findByDifficulty(Project.Difficulty.EXPERT).size());
        
        distribution.put("difficultyDistribution", difficultyCounts);
        distribution.put("totalProjects", projectRepository.count());
        
        return distribution;
    }
    
    private int calculateLearningStreak(Long studentId) {
        // Mock implementation - in real app, calculate based on progress entries
        return 7; // 7 days streak
    }
    
    private int calculateLongestStreak(Long studentId) {
        // Mock implementation
        return 15; // 15 days longest streak
    }
}

