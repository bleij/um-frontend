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
import { StatusBar } from "expo-status-bar";
import { COLORS, RADIUS, SHADOWS } from "../../../constants/theme";
import { useChats } from "../../../hooks/useChats";
import { useAuth } from "../../../contexts/AuthContext";

const DEFAULT_TABS = ["все", "непрочитанные", "уведомления"];

// Mock teacher notifications for demo
const TEACHER_NOTIFICATIONS = [
    {
        id: '1',
        teacher: 'Марат Калжанов',
        subject: 'Робототехника',
        message: 'Алихан сегодня собрал свой первый автономный манипулятор! Очень хороший прогресс в логике программирования.',
        time: '12:45',
        type: 'update'
    },
    {
        id: '2',
        teacher: 'Елена Белова',
        subject: 'Шахматы',
        message: 'Завтра в 15:00 будет дополнительная подготовка к турниру. Просьба подтвердить участие.',
        time: '10:30',
        type: 'alert'
    },
    {
        id: '3',
        teacher: 'Арман Сериков',
        subject: 'Программирование Python',
        message: 'Дана успешно прошла тест по циклам и функциям. Переходим к изучению объектов.',
        time: 'Вчера',
        type: 'update'
    }
];

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
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const IS_DESKTOP = Platform.OS === "web" && width >= 900;
    const isMentor = user?.role === 'mentor';
    
    // For parents, we show "updates" instead of generic tabs sometimes, 
    // but let's stick to the requested 3 tabs.
    const TABS = isMentor ? ["все", "родители", "уведомления"] : DEFAULT_TABS;
    
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
            <StatusBar style="light" />
            
            {/* Header with Gradient */}
            <LinearGradient
                colors={COLORS.gradients.header as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
            >
                <SafeAreaView edges={["top"]}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                        <Text style={{ fontSize: 32, fontWeight: "900", color: "white", letterSpacing: -1 }}>Чаты</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <View style={{ width: IS_DESKTOP ? "50%" : "100%", alignSelf: "center", flex: 1, marginTop: 24 }}>
                {/* Search */}
                <View style={{
                    backgroundColor: "white",
                    borderRadius: RADIUS.xl,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    height: 52,
                    marginHorizontal: 20,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#F3F4F6",
                    ...SHADOWS.sm,
                }}>
                    <Feather name="search" size={20} color={COLORS.mutedForeground} />
                    <TextInput
                        placeholder="Поиск чатов"
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor={COLORS.mutedForeground}
                        style={{ flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.foreground }}
                    />
                </View>

                {/* Tabs */}
                <View style={{
                    flexDirection: "row",
                    backgroundColor: COLORS.muted,
                    borderRadius: RADIUS.full,
                    marginHorizontal: 20,
                    padding: 6,
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
                                    backgroundColor: active ? "white" : "transparent",
                                    borderRadius: RADIUS.full,
                                    paddingVertical: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    ...(active ? SHADOWS.sm : {}),
                                }}
                            >
                                <Text style={{
                                    color: active ? COLORS.primary : COLORS.mutedForeground,
                                    fontWeight: active ? "700" : "600",
                                    fontSize: 13,
                                }}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Content List */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                    {activeTab === "уведомления" ? (
                        <>
                            <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.foreground, marginBottom: 16, marginLeft: 4 }}>
                                Обновления от учителей
                            </Text>
                            {TEACHER_NOTIFICATIONS.map((notif, idx) => (
                                <MotiView
                                    key={notif.id}
                                    from={{ opacity: 0, translateY: 15 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    transition={{ duration: 300, delay: idx * 50 }}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: 24,
                                        padding: 16,
                                        marginBottom: 12,
                                        borderLeftWidth: 4,
                                        borderLeftColor: notif.type === 'alert' ? '#FBBF24' : '#34D399',
                                        borderWidth: 1,
                                        borderColor: "#F3F4F6",
                                        ...SHADOWS.sm,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                        <View style={{
                                            width: 36, height: 36, borderRadius: 18,
                                            backgroundColor: notif.type === 'alert' ? '#FEF3C7' : '#D1FAE5',
                                            alignItems: "center", justifyContent: "center", marginRight: 12,
                                        }}>
                                            <Feather
                                                name={notif.type === 'alert' ? 'alert-circle' : 'message-circle'}
                                                size={18}
                                                color={notif.type === 'alert' ? '#D97706' : '#059669'}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.foreground }}>
                                                {notif.teacher}
                                            </Text>
                                            <Text style={{ fontSize: 13, color: COLORS.mutedForeground }}>
                                                {notif.subject}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: COLORS.mutedForeground }}>
                                            {notif.time}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 14, color: COLORS.foreground, lineHeight: 20 }}>
                                        {notif.message}
                                    </Text>
                                </MotiView>
                            ))}
                            {TEACHER_NOTIFICATIONS.length === 0 && (
                                <Text style={{ textAlign: "center", marginTop: 40, color: COLORS.mutedForeground }}>
                                    Нет уведомлений
                                </Text>
                            )}
                        </>
                    ) : loading ? (
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
                                        marginBottom: 12,
                                        padding: 16,
                                        backgroundColor: "white",
                                        borderRadius: 24,
                                        borderWidth: 1,
                                        borderColor: "#F3F4F6",
                                        ...SHADOWS.sm,
                                    }}
                                >
                                    {/* Avatar */}
                                    <View style={{
                                        width: 52, height: 52, borderRadius: 26,
                                        backgroundColor: `${COLORS.primary}12`,
                                        marginRight: 14,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Feather name={chat.icon_name as any} size={22} color={COLORS.primary} />
                                    </View>

                                    {/* Text */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.foreground }}>
                                            {chat.name}
                                        </Text>
                                        <Text style={{ color: COLORS.mutedForeground, fontSize: 13, marginTop: 4 }} numberOfLines={1}>
                                            {chat.last_message}
                                        </Text>
                                    </View>

                                    {/* Time + Badge */}
                                    <View style={{ alignItems: "flex-end" }}>
                                        <Text style={{ color: COLORS.mutedForeground, fontSize: 12, marginBottom: 6 }}>
                                            {formatChatTime(chat.last_message_at)}
                                        </Text>
                                        {chat.unread_count > 0 && !chat.archived && (
                                            <View style={{
                                                width: 24, height: 24, borderRadius: 12,
                                                backgroundColor: COLORS.primary,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <Text style={{ color: "white", fontSize: 11, fontWeight: "800" }}>
                                                    {chat.unread_count}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </MotiView>
                            </TouchableOpacity>
                        ))
                    )}

                    {!loading && filteredChats.length === 0 && activeTab !== "уведомления" && (
                        <Text style={{ textAlign: "center", marginTop: 40, color: COLORS.mutedForeground }}>
                            Чатов нет
                        </Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
