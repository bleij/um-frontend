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
import { useChats } from "../../../hooks/useChats";
import { useAuth } from "../../../contexts/AuthContext";

const DEFAULT_TABS = ["все", "непрочитанные", "архив"];
const MENTOR_TABS = ["родители", "подростки", "уведомления"];

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

// Mock teacher notifications for mentors
const TEACHER_NOTIFICATIONS = [
    { id: 'n1', teacher: 'Игорь Соколов', subject: 'Робототехника', message: 'Алихан отлично справился с проектом по Arduino', time: '2 часа назад', type: 'feedback' },
    { id: 'n2', teacher: 'Мария Иванова', subject: 'Рисование', message: 'София пропустила 2 занятия подряд', time: 'Вчера', type: 'alert' },
    { id: 'n3', teacher: 'Александр Петров', subject: 'Шахматы', message: 'Тимур показывает отличный прогресс', time: '3 дня назад', type: 'feedback' },
];

export default function ChatsScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { user } = useAuth();
    const IS_DESKTOP = Platform.OS === "web" && width >= 900;
    const isMentor = user?.role === "mentor";
    const TABS = isMentor ? MENTOR_TABS : DEFAULT_TABS;
    const [activeTab, setActiveTab] = useState(isMentor ? "родители" : "все");
    const [search, setSearch] = useState("");
    const { chats, loading } = useChats();

    const filteredChats = useMemo(() => {
        if (isMentor) {
            // For mentors, filter by chat category
            return chats.filter((chat) => {
                // Mock categorization based on chat name/icon
                const isParentChat = chat.name.toLowerCase().includes('мама') || 
                                     chat.name.toLowerCase().includes('папа') ||
                                     chat.name.toLowerCase().includes('родитель') ||
                                     chat.icon_name === 'heart';
                const isTeenChat = !isParentChat && chat.icon_name !== 'bell';
                
                if (activeTab === "родители") return isParentChat && !chat.archived;
                if (activeTab === "подростки") return isTeenChat && !chat.archived;
                // "уведомления" tab uses separate data (TEACHER_NOTIFICATIONS)
                return false;
            }).filter(chat => chat.name.toLowerCase().includes(search.toLowerCase()));
        }
        
        // Default behavior for non-mentors
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
    }, [activeTab, search, chats, isMentor]);

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

                    {/* Chat List / Notifications Feed */}
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
                        {/* Mentor Notifications Feed */}
                        {isMentor && activeTab === "уведомления" ? (
                            <>
                                <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.mutedForeground, marginBottom: 16 }}>
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
                                            borderRadius: RADIUS.lg,
                                            padding: 16,
                                            marginBottom: 12,
                                            borderLeftWidth: 4,
                                            borderLeftColor: notif.type === 'alert' ? '#F59E0B' : '#10B981',
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
                                                <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.foreground }}>
                                                    {notif.teacher}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: COLORS.mutedForeground }}>
                                                    {notif.subject}
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 11, color: COLORS.mutedForeground }}>
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

                        {!loading && filteredChats.length === 0 && activeTab !== "уведомления" && (
                            <Text style={{ textAlign: "center", marginTop: 40, color: COLORS.mutedForeground }}>
                                {isMentor ? (activeTab === "родители" ? "Нет чатов с родителями" : "Нет чатов с подростками") : "Чатов нет"}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}