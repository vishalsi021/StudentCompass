import { db } from "./db";
import { projects } from "@shared/schema";

const sampleProjects = [
  {
    name: "Task Management Web App",
    description: "Build a full-stack task management application with user authentication, CRUD operations, and real-time updates",
    difficulty: "Intermediate",
    skills: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    estimatedHours: 40,
    repoUrl: "https://github.com/example/task-manager",
  },
  {
    name: "Machine Learning Image Classifier",
    description: "Create an image classification model using CNN to categorize images into different classes",
    difficulty: "Advanced",
    skills: ["Python", "TensorFlow", "Keras", "NumPy", "Machine Learning"],
    estimatedHours: 60,
    repoUrl: "https://github.com/example/ml-classifier",
  },
  {
    name: "E-commerce Product Page",
    description: "Design and develop a responsive e-commerce product listing page with cart functionality",
    difficulty: "Beginner",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    estimatedHours: 20,
    repoUrl: "https://github.com/example/ecommerce-page",
  },
  {
    name: "RESTful API with Authentication",
    description: "Build a secure RESTful API with user authentication, authorization, and CRUD operations",
    difficulty: "Intermediate",
    skills: ["Node.js", "Express", "MongoDB", "JWT", "REST API"],
    estimatedHours: 35,
    repoUrl: "https://github.com/example/rest-api",
  },
  {
    name: "Data Visualization Dashboard",
    description: "Create an interactive dashboard to visualize datasets using charts and graphs",
    difficulty: "Intermediate",
    skills: ["React", "D3.js", "Python", "Pandas", "Data Analysis"],
    estimatedHours: 45,
    repoUrl: "https://github.com/example/data-viz",
  },
  {
    name: "Mobile-First Landing Page",
    description: "Design a modern, mobile-first landing page with animations and responsive design",
    difficulty: "Beginner",
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    estimatedHours: 15,
    repoUrl: "https://github.com/example/landing-page",
  },
  {
    name: "Real-time Chat Application",
    description: "Build a real-time chat app with WebSocket support, message history, and user presence",
    difficulty: "Advanced",
    skills: ["React", "Node.js", "Socket.io", "MongoDB", "WebSockets"],
    estimatedHours: 50,
    repoUrl: "https://github.com/example/chat-app",
  },
  {
    name: "Portfolio Website",
    description: "Create a professional portfolio website to showcase your projects and skills",
    difficulty: "Beginner",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    estimatedHours: 25,
    repoUrl: "https://github.com/example/portfolio",
  },
  {
    name: "Weather Forecast App",
    description: "Develop a weather app that fetches data from external APIs and displays forecasts",
    difficulty: "Beginner",
    skills: ["JavaScript", "React", "API Integration", "CSS"],
    estimatedHours: 20,
    repoUrl: "https://github.com/example/weather-app",
  },
  {
    name: "Blockchain Voting System",
    description: "Implement a decentralized voting system using blockchain technology",
    difficulty: "Advanced",
    skills: ["Solidity", "Ethereum", "Web3.js", "React", "Blockchain"],
    estimatedHours: 70,
    repoUrl: "https://github.com/example/blockchain-voting",
  },
  {
    name: "URL Shortener Service",
    description: "Build a URL shortening service with analytics and custom short URLs",
    difficulty: "Intermediate",
    skills: ["Node.js", "Express", "MongoDB", "React"],
    estimatedHours: 30,
    repoUrl: "https://github.com/example/url-shortener",
  },
  {
    name: "Sentiment Analysis Tool",
    description: "Create a tool that analyzes sentiment in text using NLP techniques",
    difficulty: "Advanced",
    skills: ["Python", "NLTK", "Machine Learning", "Flask", "NLP"],
    estimatedHours: 55,
    repoUrl: "https://github.com/example/sentiment-analysis",
  },
];

export async function seedProjects() {
  try {
    console.log("Seeding projects...");
    
    for (const project of sampleProjects) {
      await db.insert(projects).values(project).onConflictDoNothing();
    }
    
    console.log(`Successfully seeded ${sampleProjects.length} projects`);
  } catch (error) {
    console.error("Error seeding projects:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProjects()
    .then(() => {
      console.log("Seeding complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
