package com.whattobuild.dto;

import com.whattobuild.model.Project;
import java.util.List;
import java.util.Map;

public class RecommendResponse {
    private boolean success;
    private List<Map<String, Object>> recommendations;
    private int count;
    private String error;
    
    public RecommendResponse() {}
    
    public RecommendResponse(boolean success, List<Map<String, Object>> recommendations, int count) {
        this.success = success;
        this.recommendations = recommendations;
        this.count = count;
    }
    
    public RecommendResponse(boolean success, String error) {
        this.success = success;
        this.error = error;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public List<Map<String, Object>> getRecommendations() {
        return recommendations;
    }
    
    public void setRecommendations(List<Map<String, Object>> recommendations) {
        this.recommendations = recommendations;
    }
    
    public int getCount() {
        return count;
    }
    
    public void setCount(int count) {
        this.count = count;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}
