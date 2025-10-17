-- Sample data for WhatToBuild College Edition

-- Insert sample users
INSERT INTO users (email, password, name, branch, role, github_username, created_at) VALUES
('john.doe@college.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqL2m1Lq8e1qQ5VJxQY8QY8QY', 'John Doe', 'Computer Science', 'STUDENT', 'johndoe', CURRENT_TIMESTAMP),
('jane.smith@college.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqL2m1Lq8e1qQ5VJxQY8QY8QY', 'Jane Smith', 'Information Technology', 'STUDENT', 'janesmith', CURRENT_TIMESTAMP),
('admin@college.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqL2m1Lq8e1qQ5VJxQY8QY8QY', 'Admin User', 'Computer Science', 'ADMIN', 'admin', CURRENT_TIMESTAMP);

-- Insert sample user skills
INSERT INTO user_skills (user_id, skill) VALUES
(1, 'Java'),
(1, 'Spring Boot'),
(1, 'MySQL'),
(2, 'JavaScript'),
(2, 'React'),
(2, 'Python');

-- Insert sample projects
INSERT INTO projects (name, repo_url, description, difficulty, status, estimated_hours, resume_points, created_at) VALUES
('E-Commerce Web Application', 'https://github.com/example/ecommerce', 'Build a full-stack e-commerce platform with user authentication, product catalog, and payment integration.', 'INTERMEDIATE', 'AVAILABLE', 40, 'Developed a complete e-commerce solution with modern web technologies', CURRENT_TIMESTAMP),
('Student Management System', 'https://github.com/example/student-mgmt', 'Create a comprehensive system for managing student records, grades, and academic progress.', 'ADVANCED', 'AVAILABLE', 60, 'Built enterprise-level management system with complex business logic', CURRENT_TIMESTAMP),
('Weather Dashboard', 'https://github.com/example/weather-app', 'Design and implement a real-time weather monitoring dashboard with data visualization.', 'BEGINNER', 'AVAILABLE', 20, 'Created interactive dashboard with real-time data integration', CURRENT_TIMESTAMP),
('Chat Application', 'https://github.com/example/chat-app', 'Develop a real-time chat application with WebSocket support and user presence features.', 'INTERMEDIATE', 'AVAILABLE', 35, 'Implemented real-time communication system with WebSocket technology', CURRENT_TIMESTAMP),
('Task Management Tool', 'https://github.com/example/task-manager', 'Build a collaborative task management tool with team features and progress tracking.', 'ADVANCED', 'AVAILABLE', 50, 'Designed scalable task management platform with team collaboration', CURRENT_TIMESTAMP);

-- Insert sample project skills
INSERT INTO project_skills (project_id, skill) VALUES
(1, 'Java'),
(1, 'Spring Boot'),
(1, 'React'),
(1, 'MySQL'),
(2, 'Java'),
(2, 'Spring Boot'),
(2, 'MySQL'),
(2, 'JavaScript'),
(3, 'JavaScript'),
(3, 'React'),
(3, 'CSS'),
(4, 'JavaScript'),
(4, 'React'),
(4, 'WebSocket'),
(5, 'Java'),
(5, 'Spring Boot'),
(5, 'React'),
(5, 'MySQL');

