import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - student profiles with authentication
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  branch: text("branch").notNull(), // e.g., "Computer Science", "Electrical Engineering"
  skills: text("skills").array().notNull().default(sql`ARRAY[]::text[]`), // e.g., ["JavaScript", "Python", "React"]
  githubUsername: text("github_username"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table - curated projects with difficulty and skill requirements
export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  repoUrl: text("repo_url"),
  description: text("description").notNull(),
  skills: text("skills").array().notNull().default(sql`ARRAY[]::text[]`), // required skills
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", "Advanced"
  status: text("status").notNull().default("available"), // "available", "in-progress", "completed"
  createdBy: integer("created_by"), // admin who created the project
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Progress table - track student progress on projects
export const progress = pgTable("progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  stepNumber: integer("step_number").notNull(),
  stepDescription: text("step_description").notNull(),
  isCompleted: integer("is_completed").notNull().default(0), // 0 or 1 (boolean)
  completedDate: timestamp("completed_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recommendations table - AI-generated project recommendations
export const recommendations = pgTable("recommendations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  studentId: integer("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  matchPercentage: integer("match_percentage").notNull(), // 0-100
  resumePoints: text("resume_points").array().notNull().default(sql`ARRAY[]::text[]`), // skills to highlight on resume
  learningPlan: jsonb("learning_plan"), // structured learning path
  reasoning: text("reasoning"), // why this project was recommended
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comparisons table - side-by-side student comparisons
export const comparisons = pgTable("comparisons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  student1Id: integer("student1_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  student2Id: integer("student2_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resultsJson: jsonb("results_json").notNull(), // detailed comparison data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User enrollments - track which projects students are working on
export const enrollments = pgTable("enrollments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("active"), // "active", "completed", "paused"
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(progress),
  recommendations: many(recommendations),
  enrollments: many(enrollments),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  progress: many(progress),
  recommendations: many(recommendations),
  enrollments: many(enrollments),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  student: one(users, {
    fields: [progress.studentId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [progress.projectId],
    references: [projects.id],
  }),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  student: one(users, {
    fields: [recommendations.studentId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [recommendations.projectId],
    references: [projects.id],
  }),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [enrollments.projectId],
    references: [projects.id],
  }),
}));

// Insert schemas with validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  branch: z.string().min(1, "Branch is required"),
  name: z.string().min(1, "Name is required"),
}).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects, {
  skills: z.array(z.string()).min(1, "At least one skill tag is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
}).omit({
  id: true,
  createdAt: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
