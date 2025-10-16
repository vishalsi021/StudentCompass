import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Target, TrendingUp, ExternalLink, ChevronRight } from "lucide-react";
import type { Project, Recommendation } from "@shared/schema";

type RecommendationWithProject = Recommendation & {
  project: Project;
};

export default function RecommendPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customSkills, setCustomSkills] = useState("");

  const { data: recommendations, isLoading } = useQuery<RecommendationWithProject[]>({
    queryKey: ["/api/recommendations"],
  });

  const recommendMutation = useMutation({
    mutationFn: async (skills?: string[]) => {
      const res = await apiRequest("POST", "/api/recommend", { 
        skills: skills || user?.skills 
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Recommendations Generated",
        description: "AI has analyzed your skills and found matching projects",
      });
    },
    onError: (error: Error) => {
      console.error("Recommendation error:", error);
      toast({
        title: "Failed to generate recommendations",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleGenerateRecommendations = () => {
    if (customSkills.trim()) {
      const skillsArray = customSkills.split(",").map(s => s.trim()).filter(Boolean);
      recommendMutation.mutate(skillsArray);
    } else {
      recommendMutation.mutate();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "Intermediate":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "Advanced":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI-Powered Recommendations</h1>
        <p className="text-muted-foreground">
          Discover projects perfectly matched to your skills and learning goals
        </p>
      </div>

      {/* Recommendation Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate New Recommendations
          </CardTitle>
          <CardDescription>
            Get AI-powered project suggestions based on your current skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="custom-skills">
                Custom Skills (optional, comma-separated)
              </Label>
              <Input
                id="custom-skills"
                data-testid="input-custom-skills"
                placeholder="e.g., React, Python, Machine Learning"
                value={customSkills}
                onChange={(e) => setCustomSkills(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use your profile skills: {user?.skills.join(", ")}
              </p>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateRecommendations}
                disabled={recommendMutation.isPending}
                className="w-full"
                data-testid="button-generate-recommendations"
              >
                {recommendMutation.isPending ? (
                  "Analyzing..."
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Recommended Projects</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="hover-elevate flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {rec.project.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {rec.project.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(rec.project.difficulty)}
                    >
                      {rec.project.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  {/* Match Percentage */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        Match Score
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {rec.matchPercentage}%
                      </span>
                    </div>
                    <Progress value={rec.matchPercentage} className="h-2" />
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="text-sm font-medium mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Resume Points */}
                  {rec.resumePoints && rec.resumePoints.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Resume Highlights
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {rec.resumePoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reasoning */}
                  {rec.reasoning && (
                    <div className="mt-auto pt-4 border-t">
                      <p className="text-sm text-muted-foreground italic">
                        "{rec.reasoning}"
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {rec.project.repoUrl && (
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      asChild
                      data-testid={`button-view-project-${rec.project.id}`}
                    >
                      <a
                        href={rec.project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Generate" above to get AI-powered project recommendations based on your skills
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
