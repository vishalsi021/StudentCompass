import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { MainLayout } from "@/components/main-layout";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import RecommendPage from "@/pages/recommend-page";
import ProgressPage from "@/pages/progress-page";
import ComparePage from "@/pages/compare-page";
import AnalyzePage from "@/pages/analyze-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={() => (
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      )} />
      <ProtectedRoute path="/recommend" component={() => (
        <MainLayout>
          <RecommendPage />
        </MainLayout>
      )} />
      <ProtectedRoute path="/progress" component={() => (
        <MainLayout>
          <ProgressPage />
        </MainLayout>
      )} />
      <ProtectedRoute path="/compare" component={() => (
        <MainLayout>
          <ComparePage />
        </MainLayout>
      )} />
      <ProtectedRoute path="/analyze" component={() => (
        <MainLayout>
          <AnalyzePage />
        </MainLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
