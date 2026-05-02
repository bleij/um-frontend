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
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";
import { useChats } from "../../../hooks/useChats";

const DEFAULT_TABS = ["все", "непрочитанные", "архив"];

function formatChatTime(isoString: string): string {
    const d = new Date(isoString);
    const now = new Date();
    const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();
    if (isToday) {
        return d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Вчера";
    return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

export default function ChatsScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const IS_DESKTOP = Platform.OS === "web" && width >= 900;
    const TABS = DEFAULT_TABS;
    const [activeTab, setActiveTab] = useState("все");
    const [search, setSearch] = useState("");
    const { chats, loading } = useChats();

    const filteredChats = useMemo(() => {
        return chats.filter((chat) => {
            const byTab =
                activeTab === "все"
                    ? !chat.archived
                    : activeTab === "непрочитанные"
                        ? chat.unread_count > 0 && !chat.archived
                        : chat.archived;
            const bySearch = chat.name.toLowerCase().includes(search.toLowerCase());
            return byTab && bySearch;
        });
    }, [activeTab, search, chats]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={{ backgroundColor: COLORS.primary, overflow: "hidden" }}>
                <LinearGradient
                    colors={COLORS.gradients.header as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ paddingTop: Platform.OS === "ios" ? 0 : 20 }}
                >
                    <SafeAreaView edges={["top"]}>
                        <View style={{ paddingHorizontal: IS_DESKTOP ? LAYOUT.dashboardHorizontalPaddingDesktop : 20, paddingTop: 12, paddingBottom: 20 }}>
                            <Text style={{ fontSize: 24, fontWeight: "700", color: "white", marginBottom: 12 }}>Чаты</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: RADIUS.md, paddingHorizontal: 16, height: 44, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
                                <Feather name="search" size={18} color="rgba(255,255,255,0.6)" />
                                <TextInput
                                    placeholder="Поиск чатов"
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    style={{ flex: 1, marginLeft: 10, fontSize: 15, color: "white" }}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </View>

                <View style={{ flex: 1, width: IS_DESKTOP ? "50%" : "100%", alignSelf: "center" }}>
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
                        {loading ? (
                            <Text style={{ textAlign: "center", marginTop: 40, color: COLORS.mutedForeground }}>
                                Загрузка...
                            </Text>
                        ) : (
                            filteredChats.map((chat, idx) => (
                                <TouchableOpacity
                                    key={chat.id}
                                    activeOpacity={0.7}
                                    style={{ width: "100%" }}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(tabs)/chats/[id]",
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
                                            <Feather name={chat.icon_name as any} size={22} color={COLORS.primary} />
                                        </View>

                                        {/* Text */}
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: "600", color: COLORS.foreground }}>
                                                {chat.name}
                                            </Text>
                                            <Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: 2 }}>
                                                {chat.last_message}
                                            </Text>
                                        </View>

                                        {/* Time + Badge */}
                                        <View style={{ alignItems: "flex-end" }}>
                                            <Text style={{ color: COLORS.mutedForeground, fontSize: 12, marginBottom: 4 }}>
                                                {formatChatTime(chat.last_message_at)}
                                            </Text>
                                            {chat.unread_count > 0 && !chat.archived && (
                                                <View style={{
                                                    width: 20, height: 20, borderRadius: 10,
                                                    backgroundColor: COLORS.primary,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                    <Text style={{ color: "white", fontSize: 10, fontWeight: "600" }}>
                                                        {chat.unread_count}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </MotiView>
                                </TouchableOpacity>
                            ))
                        )}

                        {!loading && filteredChats.length === 0 && (
                            <Text style={{ textAlign: "center", marginTop: 40, color: COLORS.mutedForeground }}>
                                Чатов нет
                            </Text>
                        )}
                    </ScrollView>
                </View>
        </View>
    );
}
