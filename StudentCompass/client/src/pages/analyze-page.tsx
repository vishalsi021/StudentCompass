import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, Code2, TrendingUp, Sparkles, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AnalysisResult = {
  repoUrl: string;
  skills: string[];
  complexity: "Low" | "Medium" | "High";
  recommendations: string[];
  insights: {
    codeQuality: string;
    learningValue: string;
    portfolioImpact: string;
  };
};

export default function AnalyzePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/analyze", { repoUrl });
      return await res.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
    },
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      analyzeMutation.mutate();
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "Medium":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "High":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Repository Analyzer</h1>
        <p className="text-muted-foreground">
          AI-powered analysis of GitHub repositories to extract skills and insights
        </p>
      </div>

      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Analyze a Repository
          </CardTitle>
          <CardDescription>
            Enter a GitHub repository URL to get AI-powered insights and skill extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repo-url">GitHub Repository URL</Label>
              <div className="flex gap-2">
                <Input
                  id="repo-url"
                  data-testid="input-repo-url"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={analyzeMutation.isPending}
                  data-testid="button-analyze"
                >
                  {analyzeMutation.isPending ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The analyzer will examine the repository structure, code patterns, and technologies to provide detailed insights.
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle>Analysis Complete</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={analysisResult.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {analysisResult.repoUrl}
                    </a>
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={getComplexityColor(analysisResult.complexity)}
                >
                  {analysisResult.complexity} Complexity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Detected Technologies & Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Insights</CardTitle>
              <CardDescription>AI-generated analysis of the repository</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="quality" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="quality">Code Quality</TabsTrigger>
                  <TabsTrigger value="learning">Learning Value</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio Impact</TabsTrigger>
                </TabsList>

                <TabsContent value="quality" className="space-y-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm leading-relaxed">{analysisResult.insights.codeQuality}</p>
                  </div>
                </TabsContent>

                <TabsContent value="learning" className="space-y-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm leading-relaxed">{analysisResult.insights.learningValue}</p>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm leading-relaxed">{analysisResult.insights.portfolioImpact}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable suggestions to improve this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm flex-1">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysisResult && !analyzeMutation.isPending && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
              <p className="text-muted-foreground mb-4">
                Enter a GitHub repository URL above to get started with AI-powered analysis
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
