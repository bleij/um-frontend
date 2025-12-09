import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
    TextInput,
    Dimensions,
} from "react-native";
import {useState, useMemo} from "react";
import {MotiView} from "moti";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

const TABS = ["все", "непрочитанные", "архив"];

const ALL_CHATS = [
    {
        id: 1,
        name: "Ментор Айдар",
        lastMessage: "Посмотри отчёт, пожалуйста",
        time: "09:43",
        unread: true,
        archived: false,
        icon: "person",
        color: "#6C63FF",
    },
    {
        id: 2,
        name: "Кружок робототехники",
        lastMessage: "Завтра занятие в 18:00",
        time: "Вчера",
        unread: false,
        archived: false,
        icon: "settings",
        color: "#00BFA6",
    },
    {
        id: 3,
        name: "Мама",
        lastMessage: "Ты поел?",
        time: "Вчера",
        unread: true,
        archived: false,
        icon: "heart",
        color: "#FF6584",
    },
    {
        id: 4,
        name: "Администратор UM",
        lastMessage: "Подписка активирована",
        time: "Пн",
        unread: false,
        archived: false,
        icon: "shield-checkmark",
        color: "#4CAF50",
    },
    {
        id: 5,
        name: "Старый чат",
        lastMessage: "Ок",
        time: "Март",
        unread: false,
        archived: true,
        icon: "archive",
        color: "#9E9E9E",
    },
    {
        id: 6,
        name: "Тренер по футболу",
        lastMessage: "Сегодня без тренировки",
        time: "Пн",
        unread: false,
        archived: false,
        icon: "football",
        color: "#FF9800",
    },
];

export default function ChatsScreen() {
    const router = useRouter(); // ✅ ВОТ ЭТОГО У ТЕБЯ НЕ ХВАТАЛО
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

            const bySearch = chat.name
                .toLowerCase()
                .includes(search.toLowerCase());

            return byTab && bySearch;
        });
    }, [activeTab, search]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                paddingTop: 40,
            }}
        >
            {/* LOGO */}
            <MotiView
                from={{opacity: 0, translateY: -10}}
                animate={{opacity: 1, translateY: 0}}
                transition={{duration: 400}}
                style={{alignItems: "center", marginBottom: 20, marginTop: IS_DESKTOP ? 60 : 40}}
            >
                <Image
                    source={require("../../../assets/logo/logo_blue.png")}
                    style={{width: 140, height: 60, resizeMode: "contain"}}
                />
            </MotiView>

            {/* ✅ WIDTH WRAPPER */}
            <View
                style={{
                    width: IS_DESKTOP ? "50%" : "100%",
                    alignSelf: "center",
                }}
            >
                {/* SEARCH */}
                <View
                    style={{
                        backgroundColor: "#F1F1F1",
                        borderRadius: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        height: 48,
                        marginHorizontal: 20,
                        marginBottom: 16,
                    }}
                >
                    <TextInput
                        placeholder="Поиск чатов"
                        value={search}
                        onChangeText={setSearch}
                        placeholderTextColor="#888"
                        style={{flex: 1}}
                    />
                    <Ionicons name="search" size={20} color="#555"/>
                </View>

                {/* TABS */}
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: "#F1F1F1",
                        borderRadius: 40,
                        marginHorizontal: 20,
                        padding: 6,
                        marginBottom: 20,
                    }}
                >
                    {TABS.map((tab) => {
                        const active = tab === activeTab;

                        return (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={{
                                    flex: 1,
                                    backgroundColor: active ? "#3F2CCF" : "transparent",
                                    borderRadius: 40,
                                    paddingVertical: 14,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: active ? "white" : "#555",
                                        fontWeight: "600",
                                    }}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* CHAT LIST */}
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingBottom: 160,
                    }}
                >
                    {filteredChats.map((chat, idx) => (
                        <TouchableOpacity
                            key={chat.id}
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push({
                                    pathname: "/modal/chat",
                                    params: {
                                        id: chat.id,
                                        name: chat.name,
                                    },
                                })
                            }
                        >
                            <MotiView
                                from={{opacity: 0, translateY: 20}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 350, delay: idx * 60}}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 28,
                                }}
                            >
                                {/* AVATAR */}
                                <View
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 32,
                                        backgroundColor: chat.color,
                                        marginRight: 18,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={chat.icon}
                                        size={28}
                                        color="white"
                                    />
                                </View>

                                {/* TEXT */}
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 17, fontWeight: "600"}}>
                                        {chat.name}
                                    </Text>
                                    <Text style={{color: "#777"}}>
                                        {chat.lastMessage}
                                    </Text>
                                </View>

                                {/* TIME + COUNTER */}
                                <View style={{alignItems: "flex-end"}}>
                                    <Text style={{color: "#777", marginBottom: 6}}>
                                        {chat.time}
                                    </Text>

                                    {chat.unread && !chat.archived && (
                                        <View
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: 11,
                                                backgroundColor: "#3F2CCF",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text style={{color: "white", fontSize: 12}}>
                                                1
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </MotiView>
                        </TouchableOpacity>
                    ))}

                    {filteredChats.length === 0 && (
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 40,
                                opacity: 0.5,
                            }}
                        >
                            Чатов нет
                        </Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}