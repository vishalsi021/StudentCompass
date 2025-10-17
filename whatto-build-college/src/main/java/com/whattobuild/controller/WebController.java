package com.whattobuild.controller;

import com.whattobuild.model.Project;
import com.whattobuild.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class WebController {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @GetMapping("/")
    public String index(Model model) {
        List<Project> featuredProjects = projectRepository.findAvailableProjectsOrderByDate();
        model.addAttribute("featuredProjects", featuredProjects.subList(0, Math.min(3, featuredProjects.size())));
        return "index";
    }
    
    @GetMapping("/recommend")
    public String recommend() {
        return "recommend";
    }
    
    @GetMapping("/analyze")
    public String analyze() {
        return "analyze";
    }
    
    @GetMapping("/progress")
    public String progress() {
        return "progress";
    }
    
    @GetMapping("/compare")
    public String compare() {
        return "compare";
    }
    
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }
    
    @GetMapping("/projects")
    public String projects(@RequestParam(required = false) String difficulty, Model model) {
        List<Project> projects;
        if (difficulty != null && !difficulty.isEmpty()) {
            try {
                Project.Difficulty diff = Project.Difficulty.valueOf(difficulty.toUpperCase());
                projects = projectRepository.findByDifficulty(diff);
            } catch (IllegalArgumentException e) {
                projects = projectRepository.findAll();
            }
        } else {
            projects = projectRepository.findAll();
        }
        
        model.addAttribute("projects", projects);
        model.addAttribute("selectedDifficulty", difficulty);
        return "projects";
    }
}

