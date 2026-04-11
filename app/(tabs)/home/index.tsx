import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ParentHome from "../../../components/home/ParentHome";
import YouthHome from "../../../components/home/YouthHome";
import MentorHome from "../../../components/home/MentorHome";
import OrgHome from "../../../components/home/OrgHome";

type Role = "parent" | "youth" | "child" | "young-adult" | "mentor" | "org";

export default function HomeScreenRouter() {
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        // Загружаем сохраненную роль из памяти асинхронно
        AsyncStorage.getItem("user_role").then((v) => {
            const currentRole = (v as Role) || "parent";
            setRole(currentRole);
        });
    }, []);

    // Показываем индикатор загрузки, пока мы достаем роль
    if (!role) {
        return (
            <View style={{ flex: 1, backgroundColor: "#6C5CE7", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    // Возвращаем изолированный экран на основе текущей роли
    switch (role) {
        case "parent":
            return <ParentHome />;
        case "youth":
        case "child":
        case "young-adult":
            return <YouthHome />;
        case "mentor":
            return <MentorHome />;
        case "org":
            return <OrgHome />;
        default:
            return <ParentHome />;
    }
}