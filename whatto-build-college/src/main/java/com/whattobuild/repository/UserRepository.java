package com.whattobuild.repository;

import com.whattobuild.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByBranch(String branch);
    
    @Query("SELECT u FROM User u WHERE u.role = 'STUDENT' AND :skill MEMBER OF u.skills")
    List<User> findStudentsBySkill(@Param("skill") String skill);
    
    @Query("SELECT u FROM User u WHERE u.role = 'STUDENT' AND u.githubUsername IS NOT NULL")
    List<User> findStudentsWithGithub();
    
    List<User> findByRole(User.Role role);
}

