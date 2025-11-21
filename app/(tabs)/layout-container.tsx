import {View, TouchableOpacity, Platform} from "react-native";
import {useRouter, useSegments} from "expo-router";
import {Ionicons, Feather, FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect, useState} from "react";

export default function CustomTabBar() {
    const router = useRouter();
    const segments = useSegments();
    const current = segments[segments.length - 1];

    const [role, setRole] = useState<string | null>(null);

    // читаем роль
    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole(v));
    }, []);

    if (!role) return null;

    const go = (route) => router.replace(`/(${"tabs"})/${route}`);

    // базовые табы
    let tabs = [
        {
            key: "home",
            route: "home",
            icon: ({color, size}) => <Ionicons name="home-outline" size={size} color={color}/>,
        },

        // каталог — доступен всем кроме ментора
        ...(role !== "mentor"
            ? [{
                key: "catalog",
                route: "catalog",
                icon: ({color, size}) => (
                    <MaterialCommunityIcons name="view-grid-outline" size={size} color={color}/>
                ),
            }]
            : []),

        {
            key: "chats",
            route: "chats",
            icon: ({color, size}) => (
                <Ionicons name="chatbubble-ellipses-outline" size={size} color={color}/>
            ),
        },
        {
            key: "analytics",
            route: "analytics",
            icon: ({color, size}) => <Feather name="bar-chart-2" size={size} color={color}/>,
        },
        {
            key: "profile",
            route: "profile",
            icon: ({color, size}) => <FontAwesome5 name="user" size={size} color={color}/>,
        },
    ];

    return (
        <View
            style={{
                position: "absolute",
                bottom: Platform.OS === "ios" ? 30 : 20,
                left: 20,
                right: 20,
                height: 75,
                borderRadius: 40,
                backgroundColor: "#DFDDF4",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                elevation: 10,
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
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: active ? "#3430B5" : "transparent",
                        }}
                    >
                        {item.icon({
                            color: active ? "white" : "#8E8AA8",
                            size: 28,
                        })}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}