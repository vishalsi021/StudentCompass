package com.whattobuild.controller;

import com.whattobuild.model.Project;
import com.whattobuild.repository.ProjectRepository;
import com.whattobuild.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public String adminDashboard(Model model) {
        model.addAttribute("totalProjects", projectRepository.count());
        model.addAttribute("totalUsers", userRepository.count());
        model.addAttribute("availableProjects", projectRepository.findByStatus(Project.Status.AVAILABLE).size());
        return "admin/dashboard";
    }
    
    @GetMapping("/projects")
    public String manageProjects(Model model) {
        List<Project> projects = projectRepository.findAll();
        model.addAttribute("projects", projects);
        return "admin/projects";
    }
    
    @GetMapping("/projects/new")
    public String newProjectForm(Model model) {
        model.addAttribute("project", new Project());
        return "admin/project-form";
    }
    
    @PostMapping("/projects")
    public String saveProject(@ModelAttribute Project project) {
        project.setCreatedAt(LocalDateTime.now());
        project.setStatus(Project.Status.AVAILABLE);
        projectRepository.save(project);
        return "redirect:/admin/projects";
    }
    
    @GetMapping("/projects/edit/{id}")
    public String editProjectForm(@PathVariable Long id, Model model) {
        Project project = projectRepository.findById(id).orElse(new Project());
        model.addAttribute("project", project);
        return "admin/project-form";
    }
    
    @PostMapping("/projects/{id}/delete")
    public String deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return "redirect:/admin/projects";
    }
    
    @GetMapping("/users")
    public String manageUsers(Model model) {
        model.addAttribute("users", userRepository.findAll());
        return "admin/users";
    }
}

