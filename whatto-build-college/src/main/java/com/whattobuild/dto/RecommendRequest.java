package com.whattobuild.dto;

import java.util.List;

public class RecommendRequest {
    private Long studentId;
    private String branch;
    private List<String> skills;
    
    public RecommendRequest() {}
    
    public RecommendRequest(Long studentId, String branch, List<String> skills) {
        this.studentId = studentId;
        this.branch = branch;
        this.skills = skills;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getBranch() {
        return branch;
    }
    
    public void setBranch(String branch) {
        this.branch = branch;
    }
    
    public List<String> getSkills() {
        return skills;
    }
    
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
