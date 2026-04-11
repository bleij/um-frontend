import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_CLUBS = [
    { id: "1", title: "Лего-конструирование", category: "Технологии", age: "6-11", rating: 4.9, price: 8000, enrolled: true },
    { id: "2", title: "Рисование акварелью", category: "Искусство", age: "6-17", rating: 4.7, price: 6000, enrolled: false },
    { id: "3", title: "Программирование Python", category: "Технологии", age: "12-17", rating: 4.8, price: 10000, enrolled: false },
    { id: "4", title: "Футбол", category: "Спорт", age: "6-17", rating: 4.6, price: 5000, enrolled: false },
    { id: "5", title: "Музыка и ритм", category: "Искусство", age: "6-12", rating: 4.7, price: 7000, enrolled: false },
    { id: "6", title: "Шахматы", category: "Мышление", age: "8-17", rating: 4.9, price: 4500, enrolled: false },
];

const CATEGORIES = ["Все", "Технологии", "Искусство", "Спорт", "Мышление"];
const CATEGORY_COLORS: Record<string, string> = {
    "Технологии": "#6C5CE7", "Искусство": "#EC4899", "Спорт": "#22C55E", "Мышление": "#F59E0B"
};

export default function ParentClubs() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("Все");
    const [search, setSearch] = useState("");

    const filtered = MOCK_CLUBS.filter(club => {
        const matchCat = activeCategory === "Все" || club.category === activeCategory;
        const matchSearch = club.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const enrolled = filtered.filter(c => c.enrolled);
    const available = filtered.filter(c => !c.enrolled);

    return (
        <View style={{ flex: 1, backgroundColor: "#F8F7FF" }}>
            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
                <SafeAreaView edges={["top"]}>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Каталог кружков</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* Search */}
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 }}>
                    <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Найти кружок..."
                        placeholderTextColor="#9CA3AF"
                        style={{ flex: 1, fontSize: 15 }}
                    />
                </View>

                {/* Category Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            style={{
                                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8,
                                backgroundColor: activeCategory === cat ? "#6C5CE7" : "white",
                                shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4
                            }}
                        >
                            <Text style={{ fontWeight: "600", fontSize: 14, color: activeCategory === cat ? "white" : "#6B7280" }}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Enrolled */}
                {enrolled.length > 0 && (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F1F2E", marginBottom: 12 }}>📚 Мои кружки</Text>
                        {enrolled.map(club => (
                            <TouchableOpacity
                                key={club.id}
                                onPress={() => router.push(`/(tabs)/parent/clubs/${club.id}` as any)}
                                style={{ backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: "#6C5CE7", flexDirection: "row", alignItems: "center", shadowColor: "#6C5CE7", shadowOpacity: 0.08, shadowRadius: 8 }}
                            >
                                <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                                    <Feather name="check-circle" size={24} color="#6C5CE7" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: "700", color: "#1F1F2E", fontSize: 15 }}>{club.title}</Text>
                                    <Text style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>👥 {club.age} лет · {club.price}₸/мес</Text>
                                </View>
                                <Text style={{ color: "#6C5CE7", fontWeight: "600" }}>→</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Available */}
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F1F2E", marginBottom: 12 }}>🔍 Доступные кружки</Text>
                {available.map(club => {
                    const color = CATEGORY_COLORS[club.category] || "#6C5CE7";
                    return (
                        <TouchableOpacity
                            key={club.id}
                            onPress={() => router.push(`/(tabs)/parent/clubs/${club.id}` as any)}
                            style={{ backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, flexDirection: "row", alignItems: "center" }}
                        >
                            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: color + "20", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
                                <Feather name="book-open" size={22} color={color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "700", color: "#1F1F2E", fontSize: 15 }}>{club.title}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                    <Feather name="star" size={12} color="#EAB308" />
                                    <Text style={{ color: "#6B7280", fontSize: 12, marginLeft: 4 }}>{club.rating} · {club.age} лет · {club.price}₸/мес</Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: color + "20", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                                <Text style={{ color, fontWeight: "600", fontSize: 12 }}>{club.category}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
