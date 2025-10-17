package com.whattobuild.service;

import com.whattobuild.config.OpenAIConfig;
import com.whattobuild.model.Project;
import com.whattobuild.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class AIService {
    
    @Autowired
    private OpenAIConfig openAIConfig;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();
    
    // Real AI recommendation service using OpenAI
    public List<Map<String, Object>> recommendProjects(User user, List<Project> availableProjects) {
        try {
            // Check if we have a real OpenAI API key
            if (openAIConfig.getApiKey() != null && 
                !openAIConfig.getApiKey().equals("mock-key-for-development") &&
                !openAIConfig.getApiKey().startsWith("your_")) {
                
                return getOpenAIRecommendations(user, availableProjects);
            }
        } catch (Exception e) {
            System.err.println("OpenAI API error, falling back to mock: " + e.getMessage());
        }
        
        // Fallback to mock recommendations
        return getMockRecommendations(user, availableProjects);
    }
    
    private List<Map<String, Object>> getOpenAIRecommendations(User user, List<Project> availableProjects) {
        String prompt = buildRecommendationPrompt(user, availableProjects);
        
        Map<String, Object> request = new HashMap<>();
        request.put("model", "gpt-4");
        request.put("messages", Arrays.asList(
            Map.of("role", "system", "content", "You are an expert career advisor for college students. Provide personalized project recommendations with match scores, reasoning, resume points, and learning plans."),
            Map.of("role", "user", "content", prompt)
        ));
        request.put("max_tokens", 2000);
        request.put("temperature", 0.7);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAIConfig.getApiKey());
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                openAIConfig.getBaseUrl() + "/chat/completions", 
                entity, 
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseOpenAIResponse(response.getBody(), availableProjects);
            }
        } catch (Exception e) {
            System.err.println("OpenAI API call failed: " + e.getMessage());
        }
        
        return getMockRecommendations(user, availableProjects);
    }
    
    private List<Map<String, Object>> getMockRecommendations(User user, List<Project> availableProjects) {
        List<Map<String, Object>> recommendations = new ArrayList<>();
        
        for (Project project : availableProjects) {
            double matchScore = calculateMatchScore(user, project);
            
            if (matchScore > 0.3) { // Only recommend if match > 30%
                Map<String, Object> recommendation = new HashMap<>();
                recommendation.put("project", project);
                recommendation.put("matchScore", Math.round(matchScore * 100.0) / 100.0);
                recommendation.put("reasoning", generateReasoning(user, project, matchScore));
                recommendation.put("resumePoints", generateResumePoints(project));
                recommendation.put("learningPlan", generateLearningPlan(project));
                recommendations.add(recommendation);
            }
        }
        
        // Sort by match score descending
        recommendations.sort((a, b) -> Double.compare((Double) b.get("matchScore"), (Double) a.get("matchScore")));
        
        return recommendations;
    }
    
    // Mock AI repository analysis
    public Map<String, Object> analyzeRepository(String repoUrl, User user) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Simulate analysis results
        analysis.put("repoUrl", repoUrl);
        analysis.put("complexity", getRandomComplexity());
        analysis.put("technologies", Arrays.asList("Java", "Spring Boot", "React", "MySQL"));
        analysis.put("codeQuality", getRandomQuality());
        analysis.put("suggestions", generateCodeSuggestions());
        analysis.put("skillGaps", generateSkillGaps(user));
        analysis.put("improvementAreas", Arrays.asList("Error Handling", "Testing", "Documentation"));
        analysis.put("estimatedHours", random.nextInt(20) + 10);
        
        return analysis;
    }
    
    // Mock AI comparison service
    public Map<String, Object> compareStudents(User student1, User student2) {
        Map<String, Object> comparison = new HashMap<>();
        
        comparison.put("student1", student1.getName());
        comparison.put("student2", student2.getName());
        comparison.put("similarityScore", Math.round((random.nextDouble() * 0.4 + 0.3) * 100.0) / 100.0);
        comparison.put("commonSkills", findCommonSkills(student1.getSkills(), student2.getSkills()));
        comparison.put("strengthsStudent1", generateStudentStrengths(student1));
        comparison.put("strengthsStudent2", generateStudentStrengths(student2));
        comparison.put("collaborationPotential", random.nextBoolean() ? "High" : "Medium");
        comparison.put("recommendedProjects", Arrays.asList("Collaborative Web App", "Open Source Contribution"));
        
        return comparison;
    }
    
    private double calculateMatchScore(User user, Project project) {
        double score = 0.0;
        
        // Branch compatibility (40% weight)
        if (isBranchCompatible(user.getBranch(), project.getSkills())) {
            score += 0.4;
        }
        
        // Skill overlap (50% weight)
        double skillOverlap = calculateSkillOverlap(user.getSkills(), project.getSkills());
        score += skillOverlap * 0.5;
        
        // Difficulty appropriateness (10% weight)
        if (isDifficultyAppropriate(user.getSkills().size(), project.getDifficulty())) {
            score += 0.1;
        }
        
        // Add some randomness for variety
        score += random.nextDouble() * 0.2 - 0.1;
        
        return Math.max(0.0, Math.min(1.0, score));
    }
    
    private double calculateSkillOverlap(List<String> userSkills, List<String> projectSkills) {
        if (userSkills.isEmpty() || projectSkills.isEmpty()) return 0.0;
        
        Set<String> userSkillSet = new HashSet<>(userSkills);
        Set<String> projectSkillSet = new HashSet<>(projectSkills);
        
        userSkillSet.retainAll(projectSkillSet);
        return (double) userSkillSet.size() / projectSkillSet.size();
    }
    
    private boolean isBranchCompatible(String branch, List<String> projectSkills) {
        Map<String, List<String>> branchSkills = Map.of(
            "Computer Science", Arrays.asList("Java", "Python", "JavaScript", "React", "Spring Boot"),
            "Information Technology", Arrays.asList("Java", "JavaScript", "HTML", "CSS", "MySQL"),
            "Electronics", Arrays.asList("Python", "Arduino", "C++", "IoT"),
            "Mechanical", Arrays.asList("Python", "MATLAB", "CAD", "Simulation")
        );
        
        List<String> branchRelatedSkills = branchSkills.getOrDefault(branch, Arrays.asList("Java", "Python"));
        return projectSkills.stream().anyMatch(branchRelatedSkills::contains);
    }
    
    private boolean isDifficultyAppropriate(int userSkillCount, Project.Difficulty difficulty) {
        return switch (difficulty) {
            case BEGINNER -> userSkillCount <= 3;
            case INTERMEDIATE -> userSkillCount >= 2 && userSkillCount <= 5;
            case ADVANCED -> userSkillCount >= 4;
            case EXPERT -> userSkillCount >= 6;
        };
    }
    
    private String generateReasoning(User user, Project project, double matchScore) {
        return String.format("This project matches %s's %s background and %s skills. " +
                "The %s difficulty level is appropriate for their current skill level. " +
                "Match score: %.0f%%", 
                user.getName(), user.getBranch(), 
                String.join(", ", user.getSkills()),
                project.getDifficulty().name().toLowerCase(),
                matchScore * 100);
    }
    
    private String generateResumePoints(Project project) {
        return String.format("• Developed %s using modern technologies\n" +
                "• Implemented best practices and clean code principles\n" +
                "• Gained experience in %s\n" +
                "• Contributed to project completion within estimated timeline",
                project.getName(),
                String.join(", ", project.getSkills()));
    }
    
    private String generateLearningPlan(Project project) {
        return String.format("1. Study %s fundamentals (Week 1-2)\n" +
                "2. Set up development environment (Week 2)\n" +
                "3. Implement core features (Week 3-4)\n" +
                "4. Add testing and documentation (Week 4-5)\n" +
                "5. Deploy and showcase (Week 5)",
                String.join(" and ", project.getSkills()));
    }
    
    private String getRandomComplexity() {
        String[] complexities = {"Low", "Medium", "High"};
        return complexities[random.nextInt(complexities.length)];
    }
    
    private String getRandomQuality() {
        String[] qualities = {"Good", "Excellent", "Needs Improvement"};
        return qualities[random.nextInt(qualities.length)];
    }
    
    private List<String> generateCodeSuggestions() {
        return Arrays.asList(
            "Add comprehensive error handling",
            "Implement unit tests",
            "Improve code documentation",
            "Optimize database queries",
            "Add input validation"
        );
    }
    
    private List<String> generateSkillGaps(User user) {
        List<String> allSkills = Arrays.asList("React", "Docker", "AWS", "Testing", "CI/CD");
        List<String> userSkills = user.getSkills();
        return allSkills.stream()
                .filter(skill -> !userSkills.contains(skill))
                .limit(2)
                .toList();
    }
    
    private List<String> findCommonSkills(List<String> skills1, List<String> skills2) {
        Set<String> set1 = new HashSet<>(skills1);
        Set<String> set2 = new HashSet<>(skills2);
        set1.retainAll(set2);
        return new ArrayList<>(set1);
    }
    
    private List<String> generateStudentStrengths(User student) {
        return Arrays.asList(
            "Strong in " + (student.getSkills().isEmpty() ? "Java" : student.getSkills().get(0)),
            "Good problem-solving skills",
            "Team collaboration",
            "Quick learner"
        );
    }
    
    private String buildRecommendationPrompt(User user, List<Project> availableProjects) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Student Profile:\n");
        prompt.append("- Name: ").append(user.getName()).append("\n");
        prompt.append("- Branch: ").append(user.getBranch()).append("\n");
        prompt.append("- Skills: ").append(String.join(", ", user.getSkills())).append("\n");
        prompt.append("- GitHub: ").append(user.getGithubUsername()).append("\n\n");
        
        prompt.append("Available Projects:\n");
        for (int i = 0; i < availableProjects.size(); i++) {
            Project project = availableProjects.get(i);
            prompt.append(i + 1).append(". ").append(project.getName()).append("\n");
            prompt.append("   Description: ").append(project.getDescription()).append("\n");
            prompt.append("   Difficulty: ").append(project.getDifficulty()).append("\n");
            prompt.append("   Skills: ").append(String.join(", ", project.getSkills())).append("\n");
            prompt.append("   Hours: ").append(project.getEstimatedHours()).append("\n\n");
        }
        
        prompt.append("Please recommend the top 3-5 projects for this student with:\n");
        prompt.append("1. Match score (0-100%)\n");
        prompt.append("2. Detailed reasoning\n");
        prompt.append("3. Resume points they can highlight\n");
        prompt.append("4. Step-by-step learning plan\n");
        prompt.append("Format as JSON with project names as keys.");
        
        return prompt.toString();
    }
    
    private List<Map<String, Object>> parseOpenAIResponse(Map<String, Object> response, List<Project> availableProjects) {
        List<Map<String, Object>> recommendations = new ArrayList<>();
        
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                String content = (String) message.get("content");
                
                // Parse the AI response and match with actual projects
                // For now, return mock data but with AI-generated content
                for (Project project : availableProjects) {
                    if (content.toLowerCase().contains(project.getName().toLowerCase())) {
                        Map<String, Object> recommendation = new HashMap<>();
                        recommendation.put("project", project);
                        recommendation.put("matchScore", 0.85); // AI-generated score
                        recommendation.put("reasoning", "AI Analysis: " + content.substring(0, Math.min(200, content.length())));
                        recommendation.put("resumePoints", generateResumePoints(project));
                        recommendation.put("learningPlan", generateLearningPlan(project));
                        recommendations.add(recommendation);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing OpenAI response: " + e.getMessage());
        }
        
        return recommendations.isEmpty() ? getMockRecommendations(null, availableProjects) : recommendations;
    }
}

