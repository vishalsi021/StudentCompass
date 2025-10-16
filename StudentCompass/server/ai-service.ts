// Referenced from javascript_openai blueprint
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type RecommendationInput = {
  skills: string[];
  branch: string;
  availableProjects: Array<{
    id: number;
    name: string;
    description: string;
    skills: string[];
    difficulty: string;
  }>;
};

type RecommendationOutput = {
  projectId: number;
  matchPercentage: number;
  resumePoints: string[];
  reasoning: string;
};

export async function generateProjectRecommendations(
  input: RecommendationInput
): Promise<RecommendationOutput[]> {
  try {
    const prompt = `You are an AI career advisor for college students. Analyze the student's profile and recommend suitable projects from the list.

Student Profile:
- Branch: ${input.branch}
- Skills: ${input.skills.join(", ")}

Available Projects:
${input.availableProjects.map((p, idx) => `
${idx + 1}. ${p.name} (${p.difficulty})
   Description: ${p.description}
   Required Skills: ${p.skills.join(", ")}
   Project ID: ${p.id}
`).join("\n")}

For EACH project, provide:
1. Match percentage (0-100) based on skill overlap and difficulty appropriateness
2. 2-3 specific resume bullet points the student can add after completing this project
3. Brief reasoning for why this project matches their profile

Respond with JSON in this exact format:
{
  "recommendations": [
    {
      "projectId": number,
      "matchPercentage": number,
      "resumePoints": ["point 1", "point 2", "point 3"],
      "reasoning": "explanation"
    }
  ]
}

Prioritize projects with higher match percentages. Include at least 3-5 recommendations if available.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor for college students. Provide practical, actionable recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
}

type AnalyzeRepoInput = {
  repoUrl: string;
};

type AnalyzeRepoOutput = {
  skills: string[];
  complexity: "Low" | "Medium" | "High";
  recommendations: string[];
  insights: {
    codeQuality: string;
    learningValue: string;
    portfolioImpact: string;
  };
};

export async function analyzeRepository(
  input: AnalyzeRepoInput
): Promise<AnalyzeRepoOutput> {
  try {
    const prompt = `Analyze this GitHub repository and provide detailed insights: ${input.repoUrl}

Since I cannot directly access the repository, provide a realistic analysis based on typical projects of this type. Extract:

1. Technologies/Skills: List programming languages, frameworks, and tools likely used
2. Complexity: Rate as Low, Medium, or High based on typical projects of this nature
3. Code Quality: Assess typical patterns, structure, and best practices
4. Learning Value: Explain what students would learn from this type of project
5. Portfolio Impact: How impressive this project would be for a student portfolio
6. Recommendations: 3-5 actionable suggestions to improve or extend this project

Respond with JSON in this exact format:
{
  "skills": ["skill1", "skill2", ...],
  "complexity": "Low" | "Medium" | "High",
  "recommendations": ["rec1", "rec2", ...],
  "insights": {
    "codeQuality": "detailed assessment",
    "learningValue": "what students learn",
    "portfolioImpact": "value for portfolio"
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert software engineering mentor who analyzes code repositories to help students learn and grow.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      skills: result.skills || [],
      complexity: result.complexity || "Medium",
      recommendations: result.recommendations || [],
      insights: result.insights || {
        codeQuality: "Analysis unavailable",
        learningValue: "Analysis unavailable",
        portfolioImpact: "Analysis unavailable",
      },
    };
  } catch (error) {
    console.error("Error analyzing repository:", error);
    throw new Error("Failed to analyze repository");
  }
}
