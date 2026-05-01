import { Redirect } from "expo-router";
import { useAuth, type UserRole } from "../contexts/AuthContext";

const PROFILE_SETUP_ROUTES: Partial<Record<UserRole, string>> = {
  parent: "/profile/parent/create-profile",
  youth: "/profile/youth/create-profile",
  child: "/profile/youth/create-profile",
  "young-adult": "/profile/youth/create-profile",
  mentor: "/profile/mentor/create-profile",
  org: "/profile/organization/create-profile",
};

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    if (!user.profileComplete) {
      return <Redirect href={(PROFILE_SETUP_ROUTES[user.role] ?? "/(tabs)/home") as any} />;
    }
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/intro" />;
}
