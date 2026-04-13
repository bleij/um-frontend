import React from "react";
import { View, TouchableOpacity, Text, Platform, Dimensions } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

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
    icon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        },
    ],

    mentor: [
        COMMON_HOME,
        {
            key: "chats",
            label: "Чат",
            route: "chats",
            icon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        },
    ],

    youth: [
        COMMON_HOME,
        {
            key: "chats",
            label: "Чат",
            route: "chats",
            icon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        },
    ],

    child: [
        COMMON_HOME,
        {
            key: "chats",
            label: "Чат",
            route: "chats",
            icon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
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
            icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        },
    ],
};

const DEFAULT_TABS: TabItem[] = [
    COMMON_HOME,
    {
        key: "chats",
        label: "Чат",
        route: "chats",
        icon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
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
        icon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
    },
];

export default function CustomTabBar({ role }: Props) {
    const router = useRouter();
    const segments = useSegments();
    const currentSegment = segments[segments.length - 1];
    const currentPath = segments.slice(1).join("/");

    const tabs = (role && TABS_BY_ROLE[role]) ?? DEFAULT_TABS;

    const go = (route: string) => {
        if (route.includes("/")) {
            router.push(`/(tabs)/${route}` as any);
        } else {
            router.replace(`/(tabs)/${route}` as any);
        }
    };

    const isActive = (route: string) => {
        if (route.includes("/")) {
            return currentPath.endsWith(route) || currentPath === route;
        }
        return currentSegment === route;
    };

    return (
        <View
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: IS_DESKTOP ? 428 : "100%",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    paddingTop: 8,
                    paddingBottom: Platform.OS === "ios" ? 28 : 12,
                    paddingHorizontal: 8,
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
                                paddingVertical: 4,
                            }}
                        >
                            {item.icon({
                                color: active ? COLORS.primary : COLORS.mutedForeground,
                                size: 22,
                            })}
                            <Text
                                style={{
                                    fontSize: 10,
                                    color: active ? COLORS.primary : COLORS.mutedForeground,
                                    marginTop: 4,
                                    fontWeight: active ? "600" : "400",
                                }}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}