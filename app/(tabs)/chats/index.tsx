import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    useWindowDimensions,
} from "react-native";
import { useState, useMemo } from "react";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";

const TABS = ["все", "непрочитанные", "архив"];

const ALL_CHATS = [
    { id: 1, name: "Ментор Айдар", lastMessage: "Посмотри отчёт, пожалуйста", time: "09:43", unread: true, archived: false, icon: "user" as const },
    { id: 2, name: "Кружок робототехники", lastMessage: "Завтра занятие в 18:00", time: "Вчера", unread: false, archived: false, icon: "cpu" as const },
    { id: 3, name: "Мама", lastMessage: "Ты поел?", time: "Вчера", unread: true, archived: false, icon: "heart" as const },
    { id: 4, name: "Администратор UM", lastMessage: "Подписка активирована", time: "Пн", unread: false, archived: false, icon: "shield" as const },
    { id: 5, name: "Старый чат", lastMessage: "Ок", time: "Март", unread: false, archived: true, icon: "archive" as const },
    { id: 6, name: "Тренер по футболу", lastMessage: "Сегодня без тренировки", time: "Пн", unread: false, archived: false, icon: "activity" as const },
];

export default function ChatsScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const IS_DESKTOP = Platform.OS === "web" && width >= 900;
    const [activeTab, setActiveTab] = useState("все");
    const [search, setSearch] = useState("");

    const filteredChats = useMemo(() => {
        return ALL_CHATS.filter((chat) => {
            const byTab =
                activeTab === "все"
                    ? !chat.archived
                    : activeTab === "непрочитанные"
                        ? chat.unread && !chat.archived
                        : chat.archived;
            const bySearch = chat.name.toLowerCase().includes(search.toLowerCase());
            return byTab && bySearch;
        });
    }, [activeTab, search]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
                    <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.foreground }}>Чаты</Text>
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
                            placeholder="Поиск чатов"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor={COLORS.mutedForeground}
                            style={{ flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.foreground }}
                        />
                    </View>

                    {/* Tabs */}
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: COLORS.muted,
                        borderRadius: RADIUS.full,
                        marginHorizontal: 20,
                        padding: 4,
                        marginBottom: 20,
                    }}>
                        {TABS.map((tab) => {
                            const active = tab === activeTab;
                            return (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: active ? COLORS.primary : "transparent",
                                        borderRadius: RADIUS.full,
                                        paddingVertical: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{
                                        color: active ? "white" : COLORS.mutedForeground,
                                        fontWeight: "600",
                                        fontSize: 13,
                                    }}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Chat List */}
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                        {filteredChats.map((chat, idx) => (
                            <TouchableOpacity
                                key={chat.id}
                                activeOpacity={0.7}
                                style={{ width: "100%" }}
                                onPress={() =>
                                    router.push({
                                        pathname: "/modal/chat",
                                        params: { id: chat.id, name: chat.name },
                                    })
                                }
                            >
                                <MotiView
                                    from={{ opacity: 0, translateY: 15 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ duration: 300, delay: idx * 50 }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        width: "100%",
                                        marginBottom: 4,
                                        padding: 12,
                                        borderRadius: RADIUS.sm,
                                    }}
                                >
                                    {/* Avatar */}
                                    <View style={{
                                        width: 52, height: 52, borderRadius: 26,
                                        backgroundColor: `${COLORS.primary}10`,
                                        marginRight: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Feather name={chat.icon} size={22} color={COLORS.primary} />
                                    </View>

                                    {/* Text */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: "600", color: COLORS.foreground }}>
                                            {chat.name}
                                        </Text>
                                        <Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: 2 }}>
                                            {chat.lastMessage}
                                        </Text>
                                    </View>

                                    {/* Time + Badge */}
                                    <View style={{ alignItems: "flex-end" }}>
                                        <Text style={{ color: COLORS.mutedForeground, fontSize: 12, marginBottom: 4 }}>
                                            {chat.time}
                                        </Text>
                                        {chat.unread && !chat.archived && (
                                            <View style={{
                                                width: 20, height: 20, borderRadius: 10,
                                                backgroundColor: COLORS.primary,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>1</Text>
                                            </View>
                                        )}
                                    </View>
                                </MotiView>
                            </TouchableOpacity>
                        ))}

                        {filteredChats.length === 0 && (
                            <Text style={{ textAlign: "center", marginTop: 40, color: COLORS.mutedForeground }}>
                                Чатов нет
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}