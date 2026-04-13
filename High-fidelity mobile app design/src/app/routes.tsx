import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { TalentProfile } from "./components/TalentProfile";
import { Achievements } from "./components/Achievements";
import { Progress } from "./components/Progress";
import { ParentDashboard } from "./components/ParentDashboard";
import { CourseMarketplace } from "./components/CourseMarketplace";
import { SubscriptionPlan } from "./components/SubscriptionPlan";
import { Calendar } from "./components/Calendar";
import { Analytics } from "./components/Analytics";
import { Chat } from "./components/Chat";
import { BookSession } from "./components/BookSession";
import { Splash } from "./components/onboarding/Splash";
import { RoleSelection } from "./components/onboarding/RoleSelection";
import { Login } from "./components/onboarding/Login";
import { Verify } from "./components/onboarding/Verify";
import { ProfileCreation } from "./components/onboarding/ProfileCreation";
import { AdminDashboard } from "./components/AdminDashboard";

function ErrorFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">Please try refreshing the page</p>
        <a href="/" className="px-6 py-3 rounded-full bg-primary text-white inline-block">
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorFallback,
    children: [
      { index: true, Component: Dashboard },
      { path: "profile", Component: TalentProfile },
      { path: "achievements", Component: Achievements },
      { path: "progress", Component: Progress },
    ],
  },
  {
    path: "/onboarding",
    children: [
      { index: true, Component: Splash },
      { path: "role-selection", Component: RoleSelection },
      { path: "login", Component: Login },
      { path: "verify", Component: Verify },
      { path: "profile-creation", Component: ProfileCreation },
    ],
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/parent",
    Component: ParentDashboard,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/courses",
    Component: CourseMarketplace,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/subscription",
    Component: SubscriptionPlan,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/calendar",
    Component: Calendar,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/analytics",
    Component: Analytics,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/chat",
    Component: Chat,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/book-session",
    Component: BookSession,
    ErrorBoundary: ErrorFallback,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
    ErrorBoundary: ErrorFallback,
  },
]);