import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../../constants/theme";

import ParentProfile from "../../profile/parent/index";
import YouthProfile from "../../profile/youth/index";
import MentorProfile from "../../profile/mentor/index";
import OrgProfile from "../../profile/organization/index";

type Role = "parent" | "youth" | "child" | "young-adult" | "mentor" | "org";

export default function ProfileScreenRouter() {
    const [role, setRole] = useState<Role | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => {
            const currentRole = (v as Role) || "parent";
            setRole(currentRole);
        });
    }, []);

    if (!role) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    switch (role) {
        case "parent":
            return <ParentProfile />;
        case "youth":
        case "child":
        case "young-adult":
            return <YouthProfile />;
        case "mentor":
            return <MentorProfile />;
        case "org":
            return <OrgProfile />;
        default:
            return <ParentProfile />;
    }
}