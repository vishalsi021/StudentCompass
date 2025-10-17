package com.whattobuild.controller;

import com.whattobuild.model.Comparison;
import com.whattobuild.model.Progress;
import com.whattobuild.model.Project;
import com.whattobuild.model.Recommendation;
import com.whattobuild.repository.ProjectRepository;
import com.whattobuild.repository.UserRepository;
import com.whattobuild.service.DashboardService;
import com.whattobuild.service.RecommendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {
    
    @Autowired
    private RecommendService recommendService;
    
    @Autowired
    private DashboardService dashboardService;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/recommend")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestBody Map<String, Object> request) {
        try {
            Long studentId = Long.valueOf(request.get("studentId").toString());
            String branch = request.get("branch").toString();
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) request.get("skills");
            
            List<Map<String, Object>> recommendations = recommendService.generateRecommendations(studentId, branch, skills);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("recommendations", recommendations);
            response.put("count", recommendations.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeRepository(@RequestBody Map<String, Object> request) {
        try {
            String repoUrl = request.get("repoUrl").toString();
            Long studentId = Long.valueOf(request.get("studentId").toString());
            
            Map<String, Object> analysis = recommendService.analyzeRepository(repoUrl, studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("analysis", analysis);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/progress")
    public ResponseEntity<Map<String, Object>> getProgress(@RequestParam Long studentId) {
        try {
            List<Progress> progressList = projectRepository.findByStudentId(studentId)
                    .stream()
                    .map(project -> {
                        Progress progress = new Progress();
                        progress.setStudentId(studentId);
                        progress.setProjectId(project.getId());
                        progress.setStepDescription("Step for " + project.getName());
                        progress.setStatus(Progress.Status.COMPLETED);
                        return progress;
                    })
                    .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progressList);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareStudents(@RequestBody Map<String, Object> request) {
        try {
            Long student1Id = Long.valueOf(request.get("student1Id").toString());
            Long student2Id = Long.valueOf(request.get("student2Id").toString());
            
            // Mock comparison - in real app, get from UserRepository
            Map<String, Object> comparison = new HashMap<>();
            comparison.put("student1", "Student " + student1Id);
            comparison.put("student2", "Student " + student2Id);
            comparison.put("similarityScore", 0.75);
            comparison.put("commonSkills", List.of("Java", "Spring Boot"));
            comparison.put("collaborationPotential", "High");
            
            // Save comparison to database
            Comparison comparisonEntity = new Comparison();
            comparisonEntity.setStudent1(student1Id);
            comparisonEntity.setStudent2(student2Id);
            comparisonEntity.setResultsJson(comparison.toString());
            comparisonEntity.setSimilarityScore(0.75);
            comparisonEntity.setCreatedAt(LocalDateTime.now());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("comparison", comparison);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        try {
            Map<String, Object> stats = dashboardService.getDashboardStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/projects")
    public ResponseEntity<Map<String, Object>> getAllProjects() {
        try {
            List<Project> projects = projectRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("projects", projects);
            response.put("count", projects.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/projects/{difficulty}")
    public ResponseEntity<Map<String, Object>> getProjectsByDifficulty(@PathVariable String difficulty) {
        try {
            Project.Difficulty diff = Project.Difficulty.valueOf(difficulty.toUpperCase());
            List<Project> projects = projectRepository.findByDifficulty(diff);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("projects", projects);
            response.put("count", projects.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}

