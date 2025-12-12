import React from "react";
import {View, TouchableOpacity, Platform, Dimensions} from "react-native";
import {useRouter, useSegments} from "expo-router";
import {
    Ionicons,
    Feather,
    FontAwesome5,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export type Role = "parent" | "youth" | "mentor" | "org";

type Props = {
    role: Role;
};

export default function CustomTabBar({role}: Props) {
    const router = useRouter();
    const segments = useSegments();
    const current = segments[segments.length - 1];

    const go = (route: string) => router.replace(`/(${"tabs"})/${route}`);

    const hideCatalog = role === "mentor" || role === "org";

    const tabs = [
        {
            key: "home",
            route: "home",
            icon: ({color, size}: any) => (
                <Ionicons name="home-outline" size={size} color={color}/>
            ),
        },

        ...(!hideCatalog
            ? [
                {
                    key: "catalog",
                    route: "catalog",
                    icon: ({color, size}: any) => (
                        <MaterialCommunityIcons
                            name="view-grid-outline"
                            size={size}
                            color={color}
                        />
                    ),
                },
            ]
            : []),

        {
            key: "chats",
            route: "chats",
            icon: ({color, size}: any) => (
                <Ionicons name="chatbubble-ellipses-outline" size={size} color={color}/>
            ),
        },
        {
            key: "analytics",
            route: "analytics",
            icon: ({color, size}: any) => (
                <Feather name="bar-chart-2" size={size} color={color}/>
            ),
        },
        {
            key: "profile",
            route: "profile",
            icon: ({color, size}: any) => (
                <FontAwesome5 name="user" size={size} color={color}/>
            ),
        },
    ];

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
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 10,
            }}
        >
            {tabs.map((item) => {
                const active = current === item.route;

                return (
                    <TouchableOpacity
                        key={item.key}
                        onPress={() => go(item.route)}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: active ? "#3430B5" : "transparent",
                        }}
                    >
                        {item.icon({
                            color: active ? "white" : "#8E8AA8",
                            size: 24,
                        })}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}