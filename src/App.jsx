import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import StudentsPage from "@/pages/StudentsPage";
import StartupsPage from "@/pages/StartupsPage";
import TeamsPage from "@/pages/TeamsPage";
import TeamDetailsPage from "@/pages/TeamDetailsPage";
import InstructorsPage from "@/pages/InstructorsPage";
import FundsPage from "@/pages/FundsPage";
import ExhibitionsPage from "@/pages/ExhibitionsPage";
import EvaluationsPage from "@/pages/EvaluationsPage";
import AssignmentsPage from "@/pages/AssignmentsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute(props) {
  const { children } = props;
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/startups" element={<StartupsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailsPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/funds" element={<FundsPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
        <Route path="/evaluations" element={<EvaluationsPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;