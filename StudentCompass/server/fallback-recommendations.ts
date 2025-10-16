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

export function generateFallbackRecommendations(
  input: RecommendationInput
): RecommendationOutput[] {
  const { skills, branch, availableProjects } = input;
  const userSkillsSet = new Set(skills.map(s => s.toLowerCase()));

  // Calculate match percentage for each project
  const recommendations = availableProjects.map(project => {
    const projectSkillsSet = new Set(project.skills.map(s => s.toLowerCase()));
    
    // Calculate skill overlap
    const commonSkills = skills.filter(s => 
      projectSkillsSet.has(s.toLowerCase())
    );
    const matchPercentage = Math.min(
      Math.round((commonSkills.length / project.skills.length) * 100),
      95
    );

    // Generate resume points based on project
    const resumePoints = [
      `Built ${project.name} demonstrating proficiency in ${project.skills.slice(0, 3).join(", ")}`,
      `Completed ${project.difficulty.toLowerCase()}-level project requiring ${project.estimatedHours} hours of development`,
      `Applied ${commonSkills.length > 0 ? commonSkills.join(", ") : project.skills[0]} to solve real-world problems`,
    ];

    // Generate reasoning
    let reasoning = `This project matches ${matchPercentage}% of your skills. `;
    if (commonSkills.length > 0) {
      reasoning += `You already have experience with ${commonSkills.join(", ")}, which will help you get started quickly. `;
    }
    reasoning += `The ${project.difficulty.toLowerCase()} difficulty level is ${
      matchPercentage > 70 ? "well-suited" : "challenging but achievable"
    } for your current skill set.`;

    return {
      projectId: project.id,
      matchPercentage,
      resumePoints,
      reasoning,
    };
  });

  // Sort by match percentage and return top recommendations
  return recommendations
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 6);
}
