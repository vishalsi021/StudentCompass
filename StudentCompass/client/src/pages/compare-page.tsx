import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, Award, BookOpen, ArrowRight } from "lucide-react";

type ComparisonResult = {
  student1: {
    name: string;
    branch: string;
    skills: string[];
    completedProjects: number;
    inProgressProjects: number;
    totalSkills: number;
    resumePoints: number;
  };
  student2: {
    name: string;
    branch: string;
    skills: string[];
    completedProjects: number;
    inProgressProjects: number;
    totalSkills: number;
    resumePoints: number;
  };
  sharedSkills: string[];
  uniqueToStudent1: string[];
  uniqueToStudent2: string[];
};

export default function ComparePage() {
  const [student1Username, setStudent1Username] = useState("");
  const [student2Username, setStudent2Username] = useState("");
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  const compareMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/compare", {
        student1Username,
        student2Username,
      });
      return await res.json();
    },
    onSuccess: (data: ComparisonResult) => {
      setComparisonResult(data);
    },
  });

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (student1Username.trim() && student2Username.trim()) {
      compareMutation.mutate();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Compare Students</h1>
        <p className="text-muted-foreground">
          Side-by-side comparison of learning progress and achievements
        </p>
      </div>

      {/* Comparison Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Select Students to Compare
          </CardTitle>
          <CardDescription>
            Enter the usernames of two students to compare their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompare} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="student1">Student 1 Username</Label>
                <Input
                  id="student1"
                  data-testid="input-student1-username"
                  placeholder="Enter username"
                  value={student1Username}
                  onChange={(e) => setStudent1Username(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student2">Student 2 Username</Label>
                <Input
                  id="student2"
                  data-testid="input-student2-username"
                  placeholder="Enter username"
                  value={student2Username}
                  onChange={(e) => setStudent2Username(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={compareMutation.isPending}
              data-testid="button-compare"
            >
              {compareMutation.isPending ? "Comparing..." : "Compare Students"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Stats Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student 1 */}
            <Card>
              <CardHeader>
                <CardTitle>{comparisonResult.student1.name}</CardTitle>
                <CardDescription>{comparisonResult.student1.branch}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-chart-3/10">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-chart-3" />
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <p className="text-2xl font-bold text-chart-3">
                      {comparisonResult.student1.completedProjects}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-chart-4/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-chart-4" />
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <p className="text-2xl font-bold text-chart-4">
                      {comparisonResult.student1.inProgressProjects}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Total Skills</p>
                    <p className="text-sm font-bold">{comparisonResult.student1.totalSkills}</p>
                  </div>
                  <Progress
                    value={(comparisonResult.student1.totalSkills / Math.max(comparisonResult.student1.totalSkills, comparisonResult.student2.totalSkills)) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Resume Points
                    </p>
                    <p className="text-sm font-bold">{comparisonResult.student1.resumePoints}</p>
                  </div>
                  <Progress
                    value={(comparisonResult.student1.resumePoints / Math.max(comparisonResult.student1.resumePoints, comparisonResult.student2.resumePoints)) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonResult.student1.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className={
                          comparisonResult.sharedSkills.includes(skill)
                            ? "bg-primary/10 text-primary border-primary/20"
                            : ""
                        }
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student 2 */}
            <Card>
              <CardHeader>
                <CardTitle>{comparisonResult.student2.name}</CardTitle>
                <CardDescription>{comparisonResult.student2.branch}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-chart-3/10">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-chart-3" />
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <p className="text-2xl font-bold text-chart-3">
                      {comparisonResult.student2.completedProjects}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-chart-4/10">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-chart-4" />
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <p className="text-2xl font-bold text-chart-4">
                      {comparisonResult.student2.inProgressProjects}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Total Skills</p>
                    <p className="text-sm font-bold">{comparisonResult.student2.totalSkills}</p>
                  </div>
                  <Progress
                    value={(comparisonResult.student2.totalSkills / Math.max(comparisonResult.student1.totalSkills, comparisonResult.student2.totalSkills)) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Resume Points
                    </p>
                    <p className="text-sm font-bold">{comparisonResult.student2.resumePoints}</p>
                  </div>
                  <Progress
                    value={(comparisonResult.student2.resumePoints / Math.max(comparisonResult.student1.resumePoints, comparisonResult.student2.resumePoints)) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonResult.student2.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className={
                          comparisonResult.sharedSkills.includes(skill)
                            ? "bg-primary/10 text-primary border-primary/20"
                            : ""
                        }
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shared & Unique Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shared Skills</CardTitle>
                <CardDescription>Skills both students have</CardDescription>
              </CardHeader>
              <CardContent>
                {comparisonResult.sharedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonResult.sharedSkills.map((skill) => (
                      <Badge key={skill} className="bg-primary/10 text-primary border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No shared skills</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Unique to {comparisonResult.student1.name}</CardTitle>
                <CardDescription>Skills only Student 1 has</CardDescription>
              </CardHeader>
              <CardContent>
                {comparisonResult.uniqueToStudent1.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonResult.uniqueToStudent1.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No unique skills</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Unique to {comparisonResult.student2.name}</CardTitle>
                <CardDescription>Skills only Student 2 has</CardDescription>
              </CardHeader>
              <CardContent>
                {comparisonResult.uniqueToStudent2.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {comparisonResult.uniqueToStudent2.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No unique skills</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
