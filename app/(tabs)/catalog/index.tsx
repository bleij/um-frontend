import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    Dimensions,
} from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { courses } from "../../../data/courses";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const { width } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

const categories = ["все", "гум", "мат", "естеств", "спорт", "it", "творчество"];

export default function CatalogScreen() {
    const [activeCategory, setActiveCategory] = useState("все");
    const [search, setSearch] = useState("");
    const router = useRouter();

    const safeCourses = Array.isArray(courses) ? courses : [];

    const filteredItems = useMemo(() => {
        return safeCourses.filter((item) => {
            const byCategory = activeCategory === "все" || item.tag === activeCategory;
            const bySearch = item.title.toLowerCase().includes(search.toLowerCase());
            return byCategory && bySearch;
        });
    }, [activeCategory, search, safeCourses]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                    {/* Header */}
                    <View style={{ paddingTop: 12, paddingHorizontal: 20, marginBottom: 16 }}>
                        <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.foreground, marginBottom: 4 }}>
                            Каталог
                        </Text>
                        <Text style={{ fontSize: 14, color: COLORS.mutedForeground }}>
                            Найди подходящий кружок
                        </Text>
                    </View>

                    <View style={{ width: IS_DESKTOP ? "50%" : "100%", alignSelf: "center" }}>
                        {/* Search */}
                        <View style={{
                            backgroundColor: COLORS.muted,
                            borderRadius: RADIUS.md,
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 16,
                            height: 48,
                            marginHorizontal: 20,
                            marginBottom: 16,
                        }}>
                            <Feather name="search" size={18} color={COLORS.mutedForeground} />
                            <TextInput
                                placeholder="Поиск"
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor={COLORS.mutedForeground}
                                style={{ flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.foreground }}
                            />
                        </View>

                        {/* Filters */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ paddingLeft: 20, marginBottom: 20 }}
                        >
                            {categories.map((cat) => {
                                const active = cat === activeCategory;
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setActiveCategory(cat)}
                                        style={{
                                            paddingVertical: 8,
                                            paddingHorizontal: 18,
                                            borderRadius: RADIUS.full,
                                            marginRight: 8,
                                            backgroundColor: active ? COLORS.primary : COLORS.muted,
                                        }}
                                    >
                                        <Text style={{
                                            color: active ? "white" : COLORS.foreground,
                                            fontWeight: "600",
                                            fontSize: 13,
                                        }}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>

                    {/* Cards Grid */}
                    <View style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                        alignSelf: "center",
                        padding: 20,
                        paddingTop: 0,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}>
                        {filteredItems.map((item, index) => (
                            <MotiView
                                key={item.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 350, delay: index * 40 }}
                                style={{
                                    width: "48%",
                                    marginBottom: 16,
                                    borderRadius: RADIUS.lg,
                                    overflow: "hidden",
                                    backgroundColor: COLORS.card,
                                    borderWidth: 1,
                                    borderColor: COLORS.border,
                                    ...SHADOWS.md,
                                }}
                            >
                                {/* Color header */}
                                <View style={{
                                    height: 100,
                                    backgroundColor: `${COLORS.primary}10`,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <View style={{
                                        width: 44, height: 44, borderRadius: 14,
                                        backgroundColor: `${COLORS.primary}15`,
                                        alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Feather name="book-open" size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={{
                                        position: "absolute", top: 8, right: 8,
                                        backgroundColor: COLORS.card,
                                        paddingHorizontal: 8, paddingVertical: 2,
                                        borderRadius: 10,
                                    }}>
                                        <Text style={{ fontSize: 10, color: COLORS.mutedForeground }}>{item.tag}</Text>
                                    </View>
                                </View>

                                {/* Content */}
                                <View style={{ padding: 12 }}>
                                    <Text
                                        numberOfLines={2}
                                        style={{ fontSize: 14, fontWeight: "600", color: COLORS.foreground, marginBottom: 4, lineHeight: 19 }}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        numberOfLines={2}
                                        style={{ fontSize: 12, color: COLORS.mutedForeground, marginBottom: 10, lineHeight: 16 }}
                                    >
                                        {item.shortDescription}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/modal/course",
                                                params: { id: String(item.id) },
                                            })
                                        }
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            paddingVertical: 8,
                                            paddingHorizontal: 14,
                                            borderRadius: RADIUS.full,
                                            alignSelf: "flex-start",
                                        }}
                                    >
                                        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
                                            подробнее
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </MotiView>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}