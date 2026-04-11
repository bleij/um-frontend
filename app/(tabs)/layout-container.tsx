import React from "react";
import { View, TouchableOpacity, Text, Platform, Dimensions } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export type Role = "parent" | "youth" | "child" | "young-adult" | "mentor" | "org";

type TabItem = {
    key: string;
    label: string;
    route: string;
    icon: (props: { color: string; size: number }) => React.ReactNode;
};

type Props = { role: Role | string | null };

const COMMON_HOME: TabItem = {
    key: "home",
    label: "Главная",
    route: "home",
    icon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
};

const TABS_BY_ROLE: Record<string, TabItem[]> = {
    parent: [
        COMMON_HOME,
        {
            key: "parent/calendar",
            label: "Календарь",
            route: "parent/calendar",
            icon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        },
        {
            key: "parent/clubs",
            label: "Кружки",
            route: "parent/clubs",
            icon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        },
        {
            key: "parent/reports",
            label: "Отчёты",
            route: "parent/reports",
            icon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        },
        {
            key: "profile",
            label: "Профиль",
            route: "profile",
            icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        },
    ],

    mentor: [
        COMMON_HOME,
        {
            key: "chats",
            label: "Чат",
            route: "chats",
            icon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
        },
        {
            key: "mentor/learning-path",
            label: "Треки",
            route: "mentor/learning-path",
            icon: ({ color, size }) => <Feather name="map" size={size} color={color} />,
        },
        {
            key: "profile",
            label: "Профиль",
            route: "profile",
            icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        },
    ],

    org: [
        COMMON_HOME,
        {
            key: "organization/clubs",
            label: "Кружки",
            route: "organization/clubs",
            icon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        },
        {
            key: "organization/students",
            label: "Ученики",
            route: "organization/students",
            icon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        },
        {
            key: "profile",
            label: "Профиль",
            route: "profile",
            icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        },
    ],

    // Youth roles share the same tabs
    youth: [
        COMMON_HOME,
        {
            key: "chats",
            label: "Чат",
            route: "chats",
            icon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
        },
        {
            key: "youth/goals",
            label: "Цели",
            route: "youth/goals",
            icon: ({ color, size }) => <Feather name="target" size={size} color={color} />,
        },
        {
            key: "analytics",
            label: "Прогресс",
            route: "analytics",
            icon: ({ color, size }) => <Feather name="trending-up" size={size} color={color} />,
        },
        {
            key: "profile",
            label: "Профиль",
            route: "profile",
            icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        },
    ],

    child: [
        COMMON_HOME,
        {
            key: "chats",
            label: "Чат",
            route: "chats",
            icon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
        },
        {
            key: "analytics",
            label: "Успехи",
            route: "analytics",
            icon: ({ color, size }) => <Feather name="star" size={size} color={color} />,
        },
        {
            key: "profile",
            label: "Профиль",
            route: "profile",
            icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        },
    ],

    "young-adult": [
        COMMON_HOME,
        {
            key: "youth/goals",
            label: "Цели",
            route: "youth/goals",
            icon: ({ color, size }) => <Feather name="target" size={size} color={color} />,
        },
        {
            key: "chats",
            label: "Ментор",
            route: "chats",
            icon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
        },
        {
            key: "analytics",
            label: "Прогресс",
            route: "analytics",
            icon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
        },
        {
            key: "profile",
            label: "Профиль",
            route: "profile",
            icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
        },
    ],
};

// Fallback for any unknown role
const DEFAULT_TABS: TabItem[] = [
    COMMON_HOME,
    {
        key: "chats",
        label: "Чат",
        route: "chats",
        icon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
    },
    {
        key: "analytics",
        label: "Аналитика",
        route: "analytics",
        icon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
    },
    {
        key: "profile",
        label: "Профиль",
        route: "profile",
        icon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />,
    },
];

export default function CustomTabBar({ role }: Props) {
    const router = useRouter();
    const segments = useSegments();
    // Detect current route segment (last path segment)
    const currentSegment = segments[segments.length - 1];
    // Also check second-to-last for nested routes like parent/calendar
    const currentPath = segments.slice(1).join("/");

    const tabs = (role && TABS_BY_ROLE[role]) ?? DEFAULT_TABS;

    const go = (route: string) => {
        if (route.includes("/")) {
            // Nested: e.g. parent/calendar → /(tabs)/parent/calendar
            router.push(`/(tabs)/${route}` as any);
        } else {
            router.replace(`/(tabs)/${route}` as any);
        }
    };

    const isActive = (route: string) => {
        // Match either last segment or full nested path
        if (route.includes("/")) {
            return currentPath.endsWith(route) || currentPath === route;
        }
        return currentSegment === route;
    };

    return (
        <View
            style={{
                position: "absolute",
                bottom: Platform.OS === "ios" ? 30 : 16,
                alignSelf: "center",
                width: IS_DESKTOP ? 480 : width - 32,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#DFDDF4",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                paddingHorizontal: 8,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
            }}
        >
            {tabs.map((item) => {
                const active = isActive(item.route);
                return (
                    <TouchableOpacity
                        key={item.key}
                        onPress={() => go(item.route)}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 6,
                            borderRadius: 26,
                            backgroundColor: active ? "#3430B5" : "transparent",
                            marginHorizontal: 3,
                            height: 52,
                        }}
                    >
                        {item.icon({ color: active ? "white" : "#8E8AA8", size: 22 })}
                        {!active && (
                            <Text style={{ fontSize: 9, color: "#8E8AA8", marginTop: 2, fontWeight: "500" }}>
                                {item.label}
                            </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}