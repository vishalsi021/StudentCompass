// Referenced from javascript_database and javascript_auth_all_persistance blueprints
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users,
  projects,
  progress,
  recommendations,
  comparisons,
  enrollments,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Progress,
  type InsertProgress,
  type Recommendation,
  type InsertRecommendation,
  type Comparison,
  type InsertComparison,
  type Enrollment,
  type InsertEnrollment,
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project methods
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;

  // Progress methods
  getProgressByStudent(studentId: number): Promise<Progress[]>;
  getProgressByProject(projectId: number): Promise<Progress[]>;
  createProgress(progressData: InsertProgress): Promise<Progress>;
  updateProgressStep(stepId: number, isCompleted: boolean, completedDate?: Date): Promise<Progress | undefined>;

  // Recommendation methods
  getRecommendationsByStudent(studentId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  deleteRecommendationsByStudent(studentId: number): Promise<void>;

  // Comparison methods
  createComparison(comparison: InsertComparison): Promise<Comparison>;

  // Enrollment methods
  getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  // Progress methods
  async getProgressByStudent(studentId: number): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .where(eq(progress.studentId, studentId))
      .orderBy(progress.projectId, progress.stepNumber);
  }

  async getProgressByProject(projectId: number): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .where(eq(progress.projectId, projectId))
      .orderBy(progress.stepNumber);
  }

  async createProgress(progressData: InsertProgress): Promise<Progress> {
    const [progressItem] = await db
      .insert(progress)
      .values(progressData)
      .returning();
    return progressItem;
  }

  async updateProgressStep(stepId: number, isCompleted: boolean, completedDate?: Date): Promise<Progress | undefined> {
    const [updated] = await db
      .update(progress)
      .set({
        isCompleted: isCompleted ? 1 : 0,
        completedDate: isCompleted ? (completedDate || new Date()) : null,
      })
      .where(eq(progress.id, stepId))
      .returning();
    return updated || undefined;
  }

  // Recommendation methods
  async getRecommendationsByStudent(studentId: number): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.studentId, studentId))
      .orderBy(desc(recommendations.matchPercentage));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [rec] = await db
      .insert(recommendations)
      .values(recommendation)
      .returning();
    return rec;
  }

  async deleteRecommendationsByStudent(studentId: number): Promise<void> {
    await db
      .delete(recommendations)
      .where(eq(recommendations.studentId, studentId));
  }

  // Comparison methods
  async createComparison(comparison: InsertComparison): Promise<Comparison> {
    const [comp] = await db
      .insert(comparisons)
      .values(comparison)
      .returning();
    return comp;
  }

  // Enrollment methods
  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [enroll] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    return enroll;
  }
}

export const storage = new DatabaseStorage();
