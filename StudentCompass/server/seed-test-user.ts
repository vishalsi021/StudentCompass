import { db } from "./db";
import { users, progress } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedTestUser() {
  try {
    console.log("Creating test user...");
    
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, "testuser"));

    if (existingUser) {
      console.log("Test user already exists:", existingUser.username);
      return existingUser;
    }

    // Create test user
    const [user] = await db
      .insert(users)
      .values({
        username: "testuser",
        password: await hashPassword("password123"),
        name: "Test Student",
        email: "test@college.edu",
        branch: "Computer Science",
        skills: ["React", "Node.js", "Python", "JavaScript", "MongoDB"],
        githubUsername: "testuser",
      })
      .returning();

    console.log("Test user created:", user.username);

    // Create some sample progress for the user
    console.log("Creating sample progress...");
    
    const progressEntries = [
      {
        projectId: 1,
        studentId: user.id,
        stepNumber: 1,
        stepDescription: "Set up project structure and initialize repository",
        isCompleted: 1,
        completedDate: new Date("2025-01-10"),
        notes: "Completed with boilerplate setup",
      },
      {
        projectId: 1,
        studentId: user.id,
        stepNumber: 2,
        stepDescription: "Implement user authentication system",
        isCompleted: 1,
        completedDate: new Date("2025-01-12"),
        notes: "Used JWT for authentication",
      },
      {
        projectId: 1,
        studentId: user.id,
        stepNumber: 3,
        stepDescription: "Build task CRUD operations",
        isCompleted: 0,
        completedDate: null,
        notes: null,
      },
      {
        projectId: 3,
        studentId: user.id,
        stepNumber: 1,
        stepDescription: "Design product page layout",
        isCompleted: 1,
        completedDate: new Date("2025-01-15"),
        notes: "Used Figma for mockups",
      },
      {
        projectId: 3,
        studentId: user.id,
        stepNumber: 2,
        stepDescription: "Implement responsive design",
        isCompleted: 0,
        completedDate: null,
        notes: null,
      },
    ];

    for (const entry of progressEntries) {
      await db.insert(progress).values(entry).onConflictDoNothing();
    }

    console.log(`Created ${progressEntries.length} progress entries`);

    return user;
  } catch (error) {
    console.error("Error seeding test user:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestUser()
    .then(() => {
      console.log("Test user setup complete");
      console.log("\nLogin credentials:");
      console.log("Username: testuser");
      console.log("Password: password123");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Setup failed:", error);
      process.exit(1);
    });
}
