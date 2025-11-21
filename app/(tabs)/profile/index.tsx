import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image
} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {MotiView} from "moti";

export default function ProfileScreen() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole(v));
    }, []);

    const name = "Халилова Сабина"; // временно
    const phone = "87777777777";
    const email = "sab@bk.ru";

    return (
        <ScrollView
            style={{flex: 1, backgroundColor: "#FFFFFF"}}
            contentContainerStyle={{padding: 24, paddingBottom: 120}}
        >
            {/* HEADER */}
            <View style={{flexDirection: "row", justifyContent: "flex-end", marginBottom: 10}}>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#000",
                        paddingVertical: 4,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        marginRight: 12,
                    }}
                >
                    <Text>RU</Text>
                </View>

                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#000",
                        padding: 8,
                        borderRadius: 10,
                    }}
                >
                    <Text>⚙️</Text>
                </View>
            </View>

            {/* AVATAR + NAME */}
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 30}}>
                <View
                    style={{
                        width: 110,
                        height: 110,
                        borderRadius: 999,
                        backgroundColor: "#2E2C79",
                        marginRight: 18,
                    }}
                />

                <View style={{flex: 1}}>
                    <Text style={{fontSize: 20, fontWeight: "600"}}>{name}</Text>
                    <Text style={{marginTop: 4}}>телефон: {phone}</Text>
                    <Text>email: {email}</Text>
                </View>

                <TouchableOpacity>
                    <Text style={{fontSize: 20}}>📋</Text>
                </TouchableOpacity>
            </View>

            {/* ROLE-BASED SECTIONS */}
            {role === "parent" && <ParentChildrenBlock/>}
            {role === "mentor" && <MentorBlock/>}
            {role === "youth" && <YouthBlock/>}
            {role === "org" && <OrgBlock/>}

            {/* SUBSCRIPTION */}
            <View style={{marginTop: 40}}>
                <Text style={{textAlign: "center", fontSize: 20, fontWeight: "700", marginBottom: 18}}>
                    Тариф
                </Text>

                <View
                    style={{
                        borderRadius: 25,
                        borderWidth: 2,
                        borderColor: "#2E2C79",
                        padding: 22,
                        backgroundColor: "#F4F1FF",
                    }}
                >
                    <Text style={{fontSize: 20, textAlign: "center", marginBottom: 20}}>
                        Premium
                    </Text>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "black",
                            paddingVertical: 12,
                            borderRadius: 16,
                            alignSelf: "center",
                            paddingHorizontal: 26,
                        }}
                    >
                        <Text style={{color: "white", fontWeight: "500"}}>
                            управлять подпиской
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

/* ----------------------  ROLE BLOCKS ---------------------- */

function ParentChildrenBlock() {
    return (
        <View>
            <Text style={{fontSize: 26, fontWeight: "700", marginBottom: 16}}>
                Мои дети
            </Text>

            {/* Child 1 */}
            <ChildCard name="Алия" age="8"/>
            <ChildCard name="Асия" age="13"/>

            {/* Add new child */}
            <TouchableOpacity
                style={{
                    marginTop: 10,
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: "#2E2C79",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={{fontSize: 26, color: "#2E2C79"}}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

function ChildCard({name, age}) {
    return (
        <View
            style={{
                backgroundColor: "#2E2C79",
                borderRadius: 20,
                padding: 18,
                marginBottom: 20,
                height: 240,
                justifyContent: "flex-end",
            }}
        >
            <View
                style={{
                    backgroundColor: "white",
                    padding: 14,
                    borderRadius: 16,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={{fontSize: 16, fontWeight: "600"}}>
                    {name}{"\n"}{age} лет
                </Text>
                <Text style={{fontSize: 20}}>→</Text>
            </View>
        </View>
    );
}

function MentorBlock() {
    return (
        <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 26, fontWeight: "700", marginBottom: 16}}>
                Статус
            </Text>

            <View
                style={{
                    backgroundColor: "#E5E4F6",
                    borderRadius: 20,
                    padding: 18,
                }}
            >
                <Text style={{fontSize: 16}}>
                    Вы — ментор платформы.
                    Скоро здесь появится аналитика по вашим ученикам.
                </Text>
            </View>
        </View>
    );
}

function YouthBlock() {
    return (
        <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 26, fontWeight: "700", marginBottom: 16}}>
                Мой прогресс
            </Text>

            <View
                style={{
                    backgroundColor: "#EAE8FB",
                    borderRadius: 20,
                    padding: 18,
                }}
            >
                <Text style={{fontSize: 16}}>
                    Здесь будет отображаться прогресс обучения и достижения.
                </Text>
            </View>
        </View>
    );
}

function OrgBlock() {
    return (
        <View style={{marginBottom: 20}}>
            <Text style={{fontSize: 26, fontWeight: "700", marginBottom: 16}}>
                Организация
            </Text>

            <View
                style={{
                    backgroundColor: "#EFEFFF",
                    borderRadius: 20,
                    padding: 18,
                }}
            >
                <Text style={{fontSize: 16}}>
                    Раздел для организаций: команда, ученики, отчётность.
                </Text>
            </View>
        </View>
    );
}