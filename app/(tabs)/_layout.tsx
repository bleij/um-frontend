import {useEffect, useState} from "react";
import {Tabs} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTabBar from "./layout-container";

export default function TabsLayout() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole(v));
    }, []);

    // пока роль грузится — можно вернуть null (иначе моргнёт лишнее)
    if (!role) return null;

    const hideForMentor = role === "mentor" || role === "org";

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {display: "none"}, // скрываем системный таббар
                }}
            >
                <Tabs.Screen name="home/index" options={{href: "/home"}}/>

                {/* CHATS - доступно всем */}
                <Tabs.Screen name="chats/index" options={{href: "/chats"}}/>

                {/* ANALYTICS — доступно всем */}
                <Tabs.Screen name="analytics/index" options={{href: "/analytics"}}/>

                {/* PROFILE — доступно всем */}
                <Tabs.Screen name="profile/index" options={{href: "/profile"}}/>

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
                <Tabs.Screen name="mentor/learning-path" options={{ href: null }} />
                <Tabs.Screen name="mentor/student/[id]" options={{ href: null }} />

                {/* ORGANIZATION SCREENS */}
                <Tabs.Screen name="organization/clubs" options={{ href: null }} />
                <Tabs.Screen name="organization/students" options={{ href: null }} />
                <Tabs.Screen name="organization/applications" options={{ href: null }} />
                <Tabs.Screen name="organization/attendance" options={{ href: null }} />
                <Tabs.Screen name="organization/tasks" options={{ href: null }} />
            </Tabs>

            <CustomTabBar role={role}/>
        </>
    );
}