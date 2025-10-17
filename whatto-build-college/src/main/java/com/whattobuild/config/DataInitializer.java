package com.whattobuild.config;

import com.whattobuild.model.Project;
import com.whattobuild.model.User;
import com.whattobuild.repository.ProjectRepository;
import com.whattobuild.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no data exists
        if (userRepository.count() == 0) {
            initializeUsers();
        }
        
        if (projectRepository.count() == 0) {
            initializeProjects();
        }
    }
    
    private void initializeUsers() {
        // Create sample users
        User user1 = new User();
        user1.setEmail("john.doe@college.edu");
        user1.setPassword(passwordEncoder.encode("password123"));
        user1.setName("John Doe");
        user1.setBranch("Computer Science");
        user1.setSkills(Arrays.asList("Java", "Spring Boot", "MySQL"));
        user1.setRole(User.Role.STUDENT);
        user1.setGithubUsername("johndoe");
        user1.setCreatedAt(LocalDateTime.now());
        userRepository.save(user1);
        
        User user2 = new User();
        user2.setEmail("jane.smith@college.edu");
        user2.setPassword(passwordEncoder.encode("password123"));
        user2.setName("Jane Smith");
        user2.setBranch("Information Technology");
        user2.setSkills(Arrays.asList("JavaScript", "React", "Python"));
        user2.setRole(User.Role.STUDENT);
        user2.setGithubUsername("janesmith");
        user2.setCreatedAt(LocalDateTime.now());
        userRepository.save(user2);
        
        User admin = new User();
        admin.setEmail("admin@college.edu");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setName("Admin User");
        admin.setBranch("Computer Science");
        admin.setSkills(Arrays.asList("Java", "Spring Boot", "Administration"));
        admin.setRole(User.Role.ADMIN);
        admin.setGithubUsername("admin");
        admin.setCreatedAt(LocalDateTime.now());
        userRepository.save(admin);
        
        System.out.println("Initialized " + userRepository.count() + " users");
    }
    
    private void initializeProjects() {
        // Create sample projects
        Project project1 = new Project();
        project1.setName("E-Commerce Web Application");
        project1.setRepoUrl("https://github.com/example/ecommerce");
        project1.setDescription("Build a full-stack e-commerce platform with user authentication, product catalog, and payment integration.");
        project1.setSkills(Arrays.asList("Java", "Spring Boot", "React", "MySQL"));
        project1.setDifficulty(Project.Difficulty.INTERMEDIATE);
        project1.setStatus(Project.Status.AVAILABLE);
        project1.setEstimatedHours(40);
        project1.setResumePoints("Developed a complete e-commerce solution with modern web technologies");
        project1.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project1);
        
        Project project2 = new Project();
        project2.setName("Student Management System");
        project2.setRepoUrl("https://github.com/example/student-mgmt");
        project2.setDescription("Create a comprehensive system for managing student records, grades, and academic progress.");
        project2.setSkills(Arrays.asList("Java", "Spring Boot", "MySQL", "JavaScript"));
        project2.setDifficulty(Project.Difficulty.ADVANCED);
        project2.setStatus(Project.Status.AVAILABLE);
        project2.setEstimatedHours(60);
        project2.setResumePoints("Built enterprise-level management system with complex business logic");
        project2.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project2);
        
        Project project3 = new Project();
        project3.setName("Weather Dashboard");
        project3.setRepoUrl("https://github.com/example/weather-app");
        project3.setDescription("Design and implement a real-time weather monitoring dashboard with data visualization.");
        project3.setSkills(Arrays.asList("JavaScript", "React", "CSS"));
        project3.setDifficulty(Project.Difficulty.BEGINNER);
        project3.setStatus(Project.Status.AVAILABLE);
        project3.setEstimatedHours(20);
        project3.setResumePoints("Created interactive dashboard with real-time data integration");
        project3.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project3);
        
        Project project4 = new Project();
        project4.setName("Chat Application");
        project4.setRepoUrl("https://github.com/example/chat-app");
        project4.setDescription("Develop a real-time chat application with WebSocket support and user presence features.");
        project4.setSkills(Arrays.asList("JavaScript", "React", "WebSocket"));
        project4.setDifficulty(Project.Difficulty.INTERMEDIATE);
        project4.setStatus(Project.Status.AVAILABLE);
        project4.setEstimatedHours(35);
        project4.setResumePoints("Implemented real-time communication system with WebSocket technology");
        project4.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project4);
        
        Project project5 = new Project();
        project5.setName("Task Management Tool");
        project5.setRepoUrl("https://github.com/example/task-manager");
        project5.setDescription("Build a collaborative task management tool with team features and progress tracking.");
        project5.setSkills(Arrays.asList("Java", "Spring Boot", "React", "MySQL"));
        project5.setDifficulty(Project.Difficulty.ADVANCED);
        project5.setStatus(Project.Status.AVAILABLE);
        project5.setEstimatedHours(50);
        project5.setResumePoints("Designed scalable task management platform with team collaboration");
        project5.setCreatedAt(LocalDateTime.now());
        projectRepository.save(project5);
        
        System.out.println("Initialized " + projectRepository.count() + " projects");
    }
}
