import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Course } from "../../../../models/types";
import { courses } from "../../../../data/courses";

const { width } = Dimensions.get("window");

export default function ParentClubDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [enrolled, setEnrolled] = useState(false);

    // Find the actual course from data/courses.ts
    const club = (courses as Course[]).find((c: Course) => String(c.id) === id);

    if (!club) {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>Курс не найден</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 p-4 bg-purple-600 rounded-xl">
                    <Text className="text-white font-bold">Вернуться</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const displayTag = {
        it: "Технологии",
        гум: "Искусство",
        спорт: "Спорт",
        мат: "Математика",
        естеств: "Наука",
        творчество: "Творчество"
    }[club.tag as string] || club.tag;

    const REVIEWS = [
        { id: 1, author: "Елена К.", rating: 5, text: "Отличная студия! Дочка с удовольствием ходит на занятия." },
        { id: 2, author: "Андрей М.", rating: 5, text: "Профессиональный подход, видны результаты." },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header with Gradient/Icon instead of placeholder image if needed */}
                <View style={{ position: "relative" }}>
                    <LinearGradient 
                        colors={(club.gradient as any) || ["#6C5CE7", "#8B7FE8"]}
                        style={{ width: "100%", height: 300, alignItems: "center", justifyContent: "center" }}
                    >
                        <Feather name={(club.icon as any) || "book-open"} size={80} color="white" />
                    </LinearGradient>
                    
                    <SafeAreaView style={{ position: "absolute", top: 10, left: 16 }}>
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}
                        >
                            <Feather name="arrow-left" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <View style={{ padding: 20, marginTop: -40, backgroundColor: "#F9FAFB", borderTopLeftRadius: 40, borderTopRightRadius: 40, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20 }}>
                    {/* Title and Rating */}
                    <View style={{ marginBottom: 24 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <Text style={{ fontSize: 13, color: "#6C5CE7", fontWeight: "700", textTransform: "uppercase" }}>{displayTag}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                <Feather name="star" size={14} color="#F59E0B" fill="#F59E0B" />
                                <Text style={{ fontSize: 13, fontWeight: "700", color: "#B45309", marginLeft: 4 }}>4.8</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827" }}>{club.title}</Text>
                        <Text style={{ fontSize: 15, color: "#6B7280", marginTop: 4 }}>{club.shortDescription}</Text>
                    </View>

                    {/* Quick Stats */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
                        <View style={{ alignItems: "center", flex: 1 }}>
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                <Feather name="users" size={20} color="#6C5CE7" />
                            </View>
                            <Text style={{ fontSize: 11, color: "#6B7280" }}>Возраст</Text>
                            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1F2937", marginTop: 2 }}>{club.age}</Text>
                        </View>
                        <View style={{ alignItems: "center", flex: 1 }}>
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                <Feather name="clock" size={20} color="#6C5CE7" />
                            </View>
                            <Text style={{ fontSize: 11, color: "#6B7280" }}>Длит.</Text>
                            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1F2937", marginTop: 2 }}>{club.duration}</Text>
                        </View>
                        <View style={{ alignItems: "center", flex: 1 }}>
                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                                <Feather name="map-pin" size={20} color="#6C5CE7" />
                            </View>
                            <Text style={{ fontSize: 11, color: "#6B7280" }}>Формат</Text>
                            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1F2937", marginTop: 2 }}>{club.format}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={{ marginBottom: 30 }}>
                        <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F2937", marginBottom: 12 }}>О кружке</Text>
                        <Text style={{ fontSize: 15, color: "#4B5563", lineHeight: 24 }}>{club.description}</Text>
                    </View>

                    {/* Reviews Preview (Mocked) */}
                    <View style={{ marginBottom: 30 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F2937" }}>Отзывы (12)</Text>
                            <TouchableOpacity>
                                <Text style={{ color: "#6C5CE7", fontWeight: "700" }}>Все</Text>
                            </TouchableOpacity>
                        </View>
                        {REVIEWS.map(item => (
                            <View key={item.id} style={{ backgroundColor: "white", borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 10 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <Text style={{ fontWeight: "700", color: "#1F2937" }}>{item.author}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        {[1,2,3,4,5].map(s => (
                                            <Feather key={s} name="star" size={12} color={s <= item.rating ? "#F59E0B" : "#D1D5DB"} fill={s <= item.rating ? "#F59E0B" : "transparent"} />
                                        ))}
                                    </View>
                                </View>
                                <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>{item.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Bar with Price and Button */}
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "white", padding: 20, borderTopLeftRadius: 32, borderTopRightRadius: 32, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Стоимость</Text>
                    <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F2937" }} numberOfLines={1}>{club.price}</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => setEnrolled(!enrolled)}
                    style={{ 
                        backgroundColor: enrolled ? "#22C55E" : "#6C5CE7", 
                        paddingHorizontal: 28, 
                        paddingVertical: 16, 
                        borderRadius: 20,
                        alignItems: "center",
                        marginLeft: 16
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>
                        {enrolled ? "Вы записаны" : "Записаться"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
