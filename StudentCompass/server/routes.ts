import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateProjectRecommendations, analyzeRepository } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // GET /api/projects - Get all projects
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const allProjects = await storage.getAllProjects();
      res.json(allProjects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/recommend - Generate AI recommendations
  app.post("/api/recommend", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const { skills } = req.body;
      const userSkills = skills || user.skills;

      // Get all available projects
      const allProjects = await storage.getAllProjects();

      if (allProjects.length === 0) {
        return res.json([]);
      }

      let aiRecommendations;
      
      try {
        // Try AI-powered recommendations first
        aiRecommendations = await generateProjectRecommendations({
          skills: userSkills,
          branch: user.branch,
          availableProjects: allProjects,
        });
      } catch (aiError: any) {
        // Fallback to rule-based recommendations if AI fails
        console.warn("AI recommendation failed, using fallback:", aiError.message);
        const { generateFallbackRecommendations } = await import("./fallback-recommendations");
        aiRecommendations = generateFallbackRecommendations({
          skills: userSkills,
          branch: user.branch,
          availableProjects: allProjects,
        });
      }

      // Delete old recommendations for this user
      await storage.deleteRecommendationsByStudent(user.id);

      // Save new recommendations
      const savedRecommendations = await Promise.all(
        aiRecommendations.map((rec) =>
          storage.createRecommendation({
            projectId: rec.projectId,
            studentId: user.id,
            matchPercentage: rec.matchPercentage,
            resumePoints: rec.resumePoints,
            learningPlan: null,
            reasoning: rec.reasoning,
          })
        )
      );

      res.json(savedRecommendations);
    } catch (error: any) {
      console.error("Recommendation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/recommendations - Get user's recommendations
  app.get("/api/recommendations", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const recs = await storage.getRecommendationsByStudent(user.id);
      
      // Fetch project details for each recommendation
      const recsWithProjects = await Promise.all(
        recs.map(async (rec) => {
          const project = await storage.getProject(rec.projectId);
          return {
            ...rec,
            project,
          };
        })
      );

      res.json(recsWithProjects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/analyze - Analyze a GitHub repository
  app.post("/api/analyze", requireAuth, async (req, res) => {
    try {
      const { repoUrl } = req.body;

      if (!repoUrl) {
        return res.status(400).json({ error: "Repository URL is required" });
      }

      let analysis;
      try {
        analysis = await analyzeRepository({ repoUrl });
      } catch (aiError: any) {
        // Provide fallback analysis if AI fails
        console.warn("AI analysis failed, using fallback:", aiError.message);
        analysis = {
          skills: ["JavaScript", "Git", "Web Development"],
          complexity: "Medium" as const,
          recommendations: [
            "Add comprehensive README documentation",
            "Implement unit tests for better code reliability",
            "Consider adding CI/CD pipeline for automated testing",
          ],
          insights: {
            codeQuality: "Repository analysis is temporarily unavailable. Please try again later.",
            learningValue: "This project demonstrates fundamental software development practices.",
            portfolioImpact: "A well-documented project can significantly enhance your portfolio.",
          },
        };
      }
      
      res.json({ ...analysis, repoUrl });
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/progress - Get user's progress
  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      const progressItems = await storage.getProgressByStudent(user.id);
      
      // Fetch project details for each progress item
      const progressWithProjects = await Promise.all(
        progressItems.map(async (item) => {
          const project = await storage.getProject(item.projectId);
          return {
            ...item,
            project,
          };
        })
      );

      res.json(progressWithProjects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/progress/toggle - Toggle step completion
  app.post("/api/progress/toggle", requireAuth, async (req, res) => {
    try {
      const { stepId, completed } = req.body;
      const updated = await storage.updateProgressStep(
        stepId,
        completed,
        completed ? new Date() : undefined
      );
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/compare - Compare two students
  app.post("/api/compare", requireAuth, async (req, res) => {
    try {
      const { student1Username, student2Username } = req.body;

      const student1 = await storage.getUserByUsername(student1Username);
      const student2 = await storage.getUserByUsername(student2Username);

      if (!student1 || !student2) {
        return res.status(404).json({ error: "One or both students not found" });
      }

      // Get progress data for both students
      const progress1 = await storage.getProgressByStudent(student1.id);
      const progress2 = await storage.getProgressByStudent(student2.id);

      const completedProjects1 = new Set(
        progress1
          .filter((p) => p.isCompleted)
          .map((p) => p.projectId)
      ).size;
      const completedProjects2 = new Set(
        progress2
          .filter((p) => p.isCompleted)
          .map((p) => p.projectId)
      ).size;

      const inProgressProjects1 = new Set(
        progress1
          .filter((p) => !p.isCompleted)
          .map((p) => p.projectId)
      ).size;
      const inProgressProjects2 = new Set(
        progress2
          .filter((p) => !p.isCompleted)
          .map((p) => p.projectId)
      ).size;

      const recommendations1 = await storage.getRecommendationsByStudent(student1.id);
      const recommendations2 = await storage.getRecommendationsByStudent(student2.id);

      const resumePoints1 = recommendations1.reduce(
        (sum, rec) => sum + rec.resumePoints.length,
        0
      );
      const resumePoints2 = recommendations2.reduce(
        (sum, rec) => sum + rec.resumePoints.length,
        0
      );

      // Calculate shared and unique skills
      const skills1Set = new Set(student1.skills);
      const skills2Set = new Set(student2.skills);
      const sharedSkills = student1.skills.filter((s) => skills2Set.has(s));
      const uniqueToStudent1 = student1.skills.filter((s) => !skills2Set.has(s));
      const uniqueToStudent2 = student2.skills.filter((s) => !skills1Set.has(s));

      const comparisonResult = {
        student1: {
          name: student1.name,
          branch: student1.branch,
          skills: student1.skills,
          completedProjects: completedProjects1,
          inProgressProjects: inProgressProjects1,
          totalSkills: student1.skills.length,
          resumePoints: resumePoints1,
        },
        student2: {
          name: student2.name,
          branch: student2.branch,
          skills: student2.skills,
          completedProjects: completedProjects2,
          inProgressProjects: inProgressProjects2,
          totalSkills: student2.skills.length,
          resumePoints: resumePoints2,
        },
        sharedSkills,
        uniqueToStudent1,
        uniqueToStudent2,
      };

      // Save comparison
      await storage.createComparison({
        student1Id: student1.id,
        student2Id: student2.id,
        resultsJson: comparisonResult as any,
      });

      res.json(comparisonResult);
    } catch (error: any) {
      console.error("Comparison error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/dashboard - Get dashboard statistics
  app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
      const user = req.user!;
      
      const progressItems = await storage.getProgressByStudent(user.id);
      const recommendations = await storage.getRecommendationsByStudent(user.id);

      const uniqueProjects = new Set(progressItems.map((p) => p.projectId));
      const completedProjects = new Set(
        progressItems
          .filter((p) => p.isCompleted)
          .map((p) => p.projectId)
      );
      const inProgressProjects = uniqueProjects.size - completedProjects.size;

      const resumePoints = recommendations.reduce(
        (sum, rec) => sum + rec.resumePoints.length,
        0
      );

      // Calculate learning streak (simplified)
      const recentActivity = progressItems
        .filter((p) => p.completedDate)
        .sort((a, b) => {
          const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
          const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          type: "progress",
          message: `Completed step ${p.stepNumber}: ${p.stepDescription}`,
          timestamp: p.completedDate
            ? new Date(p.completedDate).toLocaleDateString()
            : "Unknown",
        }));

      // Extract all skills from completed projects
      const completedProgressItems = progressItems.filter((p) => p.isCompleted);
      const projectsCompleted = await Promise.all(
        Array.from(completedProjects).map((id) => storage.getProject(id))
      );
      const skillsAcquired = Array.from(
        new Set(
          projectsCompleted
            .filter((p) => p !== undefined)
            .flatMap((p) => p!.skills)
        )
      );

      res.json({
        totalProjects: uniqueProjects.size,
        completedProjects: completedProjects.size,
        inProgressProjects,
        totalSkills: user.skills.length,
        resumePoints,
        learningStreak: Math.min(recentActivity.length, 7), // Simplified streak calculation
        recentActivity,
        skillsAcquired,
      });
    } catch (error: any) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
