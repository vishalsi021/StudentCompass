import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Trophy, Target } from "lucide-react";
import type { Progress, Project } from "@shared/schema";

type ProgressWithProject = Progress & {
  project: Project;
};

type GroupedProgress = {
  [projectId: number]: {
    project: Project;
    steps: Progress[];
    completedSteps: number;
    totalSteps: number;
  };
};

export default function ProgressPage() {
  const { data: progressData, isLoading } = useQuery<ProgressWithProject[]>({
    queryKey: ["/api/progress"],
  });

  const toggleStepMutation = useMutation({
    mutationFn: async ({ stepId, completed }: { stepId: number; completed: boolean }) => {
      const res = await apiRequest("POST", "/api/progress/toggle", {
        stepId,
        completed,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Group progress by project
  const groupedProgress: GroupedProgress = {};
  progressData?.forEach((item) => {
    if (!groupedProgress[item.projectId]) {
      groupedProgress[item.projectId] = {
        project: item.project,
        steps: [],
        completedSteps: 0,
        totalSteps: 0,
      };
    }
    groupedProgress[item.projectId].steps.push(item);
    groupedProgress[item.projectId].totalSteps++;
    if (item.isCompleted) {
      groupedProgress[item.projectId].completedSteps++;
    }
  });

  const projectEntries = Object.entries(groupedProgress);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
        <p className="text-muted-foreground">
          Track your journey through each project milestone
        </p>
      </div>

      {/* Overall Stats */}
      {projectEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projectEntries.length}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-chart-3/10">
                  <CheckCircle2 className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Object.values(groupedProgress).reduce((acc, p) => acc + p.completedSteps, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Steps Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-chart-4/10">
                  <Trophy className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Object.values(groupedProgress).filter(p => p.completedSteps === p.totalSteps).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Projects Finished</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress by Project */}
      {projectEntries.length > 0 ? (
        <div className="space-y-6">
          {projectEntries.map(([projectId, data]) => {
            const completionPercentage = Math.round(
              (data.completedSteps / data.totalSteps) * 100
            );
            const isCompleted = data.completedSteps === data.totalSteps;

            return (
              <Card key={projectId}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {data.project.name}
                        {isCompleted && (
                          <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                            Completed
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{data.project.description}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {data.completedSteps} of {data.totalSteps} steps completed
                      </span>
                      <span className="text-sm font-bold">{completionPercentage}%</span>
                    </div>
                    <ProgressBar value={completionPercentage} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.steps
                      .sort((a, b) => a.stepNumber - b.stepNumber)
                      .map((step) => (
                        <div
                          key={step.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover-elevate border"
                          data-testid={`step-${step.id}`}
                        >
                          <Checkbox
                            checked={!!step.isCompleted}
                            onCheckedChange={(checked) => {
                              toggleStepMutation.mutate({
                                stepId: step.id,
                                completed: !!checked,
                              });
                            }}
                            data-testid={`checkbox-step-${step.id}`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                              <Badge variant="outline" className="text-xs">
                                Step {step.stepNumber}
                              </Badge>
                              <p
                                className={`text-sm font-medium flex-1 ${
                                  step.isCompleted ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {step.stepDescription}
                              </p>
                            </div>
                            {step.completedDate && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed on {new Date(step.completedDate).toLocaleDateString()}
                              </p>
                            )}
                            {step.notes && (
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                Note: {step.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Progress to Track Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start working on projects to see your progress here
              </p>
              <Button data-testid="button-browse-projects">Browse Projects</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
