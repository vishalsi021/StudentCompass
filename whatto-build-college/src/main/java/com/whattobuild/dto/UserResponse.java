package com.whattobuild.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.whattobuild.model.User;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String branch;
    private List<String> skills;
    private String githubUsername;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.branch = user.getBranch();
        this.skills = user.getSkills();
        this.githubUsername = user.getGithubUsername();
        this.role = user.getRole().name();
        this.createdAt = user.getCreatedAt();
        this.lastLoginAt = user.getLastLoginAt();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getBranch() {
        return branch;
    }

    public List<String> getSkills() {
        return skills;
    }

    public String getGithubUsername() {
        return githubUsername;
    }

    public String getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }
}
