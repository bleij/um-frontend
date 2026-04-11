import { createBrowserRouter } from "react-router";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { RoleSelection } from "./pages/RoleSelection";
import { CreateProfileParent } from "./pages/CreateProfileParent";
import { CreateProfileChild } from "./pages/CreateProfileChild";
import { CreateProfileTeen } from "./pages/CreateProfileTeen";
import { CreateProfileYoungAdult } from "./pages/CreateProfileYoungAdult";
import { CreateProfileOrganization } from "./pages/CreateProfileOrganization";
import { CreateProfileMentor } from "./pages/CreateProfileMentor";
import { ParentHome } from "./pages/parent/ParentHome";
import { ParentChildren } from "./pages/parent/ParentChildren";
import { ParentChildProfile } from "./pages/parent/ParentChildProfile";
import { ParentClubs } from "./pages/parent/ParentClubs";
import { ParentClubDetail } from "./pages/parent/ParentClubDetail";
import { ParentCalendar } from "./pages/parent/ParentCalendar";
import { ParentReports } from "./pages/parent/ParentReports";
import { ParentProfile } from "./pages/parent/ParentProfile";
import { ParentTesting } from "./pages/parent/ParentTesting";
import { ChildHome } from "./pages/child/ChildHome";
import { ChildAchievements } from "./pages/child/ChildAchievements";
import { ChildTasks } from "./pages/child/ChildTasks";
import { TeenHome } from "./pages/teen/TeenHome";
import { TeenGoals } from "./pages/teen/TeenGoals";
import { TeenMentorChat } from "./pages/teen/TeenMentorChat";
import { YoungAdultHome } from "./pages/young-adult/YoungAdultHome";
import { OrgDashboard } from "./pages/organization/OrgDashboard";
import { OrgApplications } from "./pages/organization/OrgApplications";
import { OrgAttendance } from "./pages/organization/OrgAttendance";
import { OrgTasks } from "./pages/organization/OrgTasks";
import { MentorHome } from "./pages/mentor/MentorHome";
import { MentorChildProfile } from "./pages/mentor/MentorChildProfile";
import { MentorLearningPath } from "./pages/mentor/MentorLearningPath";
import { TestWelcome } from "./pages/testing/TestWelcome";
import { TestQuestions } from "./pages/testing/TestQuestions";
import { TestResults } from "./pages/testing/TestResults";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ParentChildCategorySelect } from "./pages/ParentChildCategorySelect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/role-select",
    element: <RoleSelection />,
  },
  {
    path: "/create-profile-parent",
    element: <CreateProfileParent />,
  },
  {
    path: "/create-profile-child",
    element: <CreateProfileChild />,
  },
  {
    path: "/create-profile-teen",
    element: <CreateProfileTeen />,
  },
  {
    path: "/create-profile-young-adult",
    element: <CreateProfileYoungAdult />,
  },
  {
    path: "/create-profile-organization",
    element: <CreateProfileOrganization />,
  },
  {
    path: "/create-profile-mentor",
    element: <CreateProfileMentor />,
  },
  {
    path: "/parent",
    element: <ProtectedRoute requiredRole="parent"><ParentHome /></ProtectedRoute>,
  },
  {
    path: "/parent/children",
    element: <ProtectedRoute requiredRole="parent"><ParentChildren /></ProtectedRoute>,
  },
  {
    path: "/parent/children/:childId",
    element: <ProtectedRoute requiredRole="parent"><ParentChildProfile /></ProtectedRoute>,
  },
  {
    path: "/parent/clubs",
    element: <ProtectedRoute requiredRole="parent"><ParentClubs /></ProtectedRoute>,
  },
  {
    path: "/parent/clubs/:clubId",
    element: <ProtectedRoute requiredRole="parent"><ParentClubDetail /></ProtectedRoute>,
  },
  {
    path: "/parent/calendar",
    element: <ProtectedRoute requiredRole="parent"><ParentCalendar /></ProtectedRoute>,
  },
  {
    path: "/parent/reports",
    element: <ProtectedRoute requiredRole="parent"><ParentReports /></ProtectedRoute>,
  },
  {
    path: "/parent/profile",
    element: <ProtectedRoute requiredRole="parent"><ParentProfile /></ProtectedRoute>,
  },
  {
    path: "/parent/testing",
    element: <ProtectedRoute requiredRole="parent"><ParentTesting /></ProtectedRoute>,
  },
  {
    path: "/child",
    element: <ChildHome />,
  },
  {
    path: "/child/achievements",
    element: <ChildAchievements />,
  },
  {
    path: "/child/tasks",
    element: <ChildTasks />,
  },
  {
    path: "/teen",
    element: <TeenHome />,
  },
  {
    path: "/teen/goals",
    element: <TeenGoals />,
  },
  {
    path: "/teen/mentor-chat",
    element: <TeenMentorChat />,
  },
  {
    path: "/young-adult",
    element: <YoungAdultHome />,
  },
  {
    path: "/organization",
    element: <OrgDashboard />,
  },
  {
    path: "/organization/applications",
    element: <OrgApplications />,
  },
  {
    path: "/organization/attendance",
    element: <OrgAttendance />,
  },
  {
    path: "/organization/tasks",
    element: <OrgTasks />,
  },
  {
    path: "/mentor",
    element: <MentorHome />,
  },
  {
    path: "/mentor/child-profile/:childId",
    element: <MentorChildProfile />,
  },
  {
    path: "/mentor/learning-path/:childId",
    element: <MentorLearningPath />,
  },
  {
    path: "/testing/welcome",
    element: <TestWelcome />,
  },
  {
    path: "/testing/questions",
    element: <TestQuestions />,
  },
  {
    path: "/testing/results",
    element: <TestResults />,
  },
  {
    path: "/parent/child-category-select",
    element: <ParentChildCategorySelect />,
  },
]);