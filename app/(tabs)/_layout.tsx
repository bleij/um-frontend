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
            </Tabs>

            <CustomTabBar role={role}/>
        </>
    );
}