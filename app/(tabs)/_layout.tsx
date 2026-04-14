import { Tabs } from "expo-router";
import { useMemo } from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { LAYOUT } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import CustomTabBar, { SideNav } from "./layout-container";

export default function TabsLayout() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const role = useMemo(() => user?.role || "parent", [user?.role]);
  const hideForMentor = role === "mentor" || role === "org";
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;

  const screens = (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="home/index" options={{ href: "/home" }} />

      {/* CHATS - доступно всем */}
      <Tabs.Screen name="chats/index" options={{ href: "/chats" }} />

      {/* ANALYTICS — доступно всем */}
      <Tabs.Screen name="analytics/index" options={{ href: "/analytics" }} />

      {/* PROFILE — доступно всем */}
      <Tabs.Screen name="profile/index" options={{ href: "/profile" }} />

      {/* CATALOG — скрыт у ментора */}
      <Tabs.Screen
        name="catalog/index"
        options={{
          href: hideForMentor ? null : "/catalog",
        }}
      />

      {/* PARENT SCREENS */}
      <Tabs.Screen name="parent/calendar" options={{ href: null }} />
      <Tabs.Screen name="parent/clubs" options={{ href: null }} />
      <Tabs.Screen name="parent/reports" options={{ href: null }} />
      <Tabs.Screen name="parent/club/[id]" options={{ href: null }} />

      {/* YOUTH SCREENS */}
      <Tabs.Screen name="youth/goals" options={{ href: null }} />
      <Tabs.Screen name="youth/tasks" options={{ href: null }} />
      <Tabs.Screen name="youth/achievements" options={{ href: null }} />

      {/* MENTOR SCREENS */}
      <Tabs.Screen name="mentor/groups" options={{ href: null }} />
      <Tabs.Screen name="mentor/learning-path" options={{ href: null }} />
      <Tabs.Screen name="mentor/student/[id]" options={{ href: null }} />

      {/* ORGANIZATION SCREENS */}
      <Tabs.Screen name="organization/courses" options={{ href: null }} />
      <Tabs.Screen name="organization/students" options={{ href: null }} />
      <Tabs.Screen name="organization/applications" options={{ href: null }} />
      <Tabs.Screen name="organization/attendance" options={{ href: null }} />
      <Tabs.Screen name="organization/tasks" options={{ href: null }} />
      <Tabs.Screen name="organization/staff" options={{ href: null }} />
      <Tabs.Screen name="organization/groups" options={{ href: null }} />
    </Tabs>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <SideNav role={role} />
        <View style={{ flex: 1 }}>{screens}</View>
      </View>
    );
  }

  return (
    <>
      {screens}
      <CustomTabBar role={role} />
    </>
  );
}
