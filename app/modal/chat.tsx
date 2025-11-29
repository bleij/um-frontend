import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    Dimensions,
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {useMemo, useState} from "react";
import {MotiView} from "moti";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

/* ------------------ ДЕМО-СООБЩЕНИЯ ПО ЧАТАМ ------------------ */
const MESSAGES_BY_CHAT: Record<string, any[]> = {
    "1": [
        {from: "them", text: "Посмотри отчёт, пожалуйста"},
        {from: "me", text: "Хорошо, сегодня проверю"},
        {from: "them", text: "Спасибо, важно до завтра"},
    ],
    "2": [
        {from: "them", text: "Завтра занятие в 18:00"},
        {from: "me", text: "Принял, будем"},
    ],
    "3": [
        {from: "them", text: "Ты поел?"},
        {from: "me", text: "Да, всё хорошо"},
        {from: "them", text: "Ладно, не задерживайся"},
    ],
    "4": [
        {from: "them", text: "Подписка активирована"},
        {from: "me", text: "Спасибо"},
    ],
    "5": [
        {from: "them", text: "Ок"},
    ],
    "6": [
        {from: "them", text: "Сегодня без тренировки"},
        {from: "me", text: "Понял, спасибо"},
    ],
};

export default function ChatModal() {
    const router = useRouter();
    const {id, name} = useLocalSearchParams();
    const [input, setInput] = useState("");

    const messages = useMemo(() => {
        return MESSAGES_BY_CHAT[String(id)] || [];
    }, [id]);

    return (
        <LinearGradient
            colors={["#3F3C9F", "#FFFFFF", "#3F3C9F"]}
            start={{x: 0, y: 0}}   // слева
            end={{x: 1, y: 0}}     // вправо
            style={{flex: 1}}
        >
            <View
                style={{
                    flex: 1,
                    alignSelf: "center",
                    width: IS_DESKTOP ? "50%" : "100%",
                    backgroundColor: "white",
                }}
            >
                {/* HEADER */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        paddingTop: Platform.OS === "ios" ? 54 : 32, // ✅ ВОТ ФИКС
                        borderBottomWidth: 1,
                        borderColor: "#eee",
                        backgroundColor: "white",
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{fontSize: 18}}>←</Text>
                    </TouchableOpacity>

                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            marginLeft: 12,
                        }}
                    >
                        {name}
                    </Text>
                </View>

                {/* MESSAGES */}
                <ScrollView
                    contentContainerStyle={{
                        padding: 16,
                        paddingBottom: 120,
                    }}
                >
                    {messages.map((msg, idx) => {
                        const mine = msg.from === "me";

                        return (
                            <MotiView
                                key={idx}
                                from={{opacity: 0, translateY: 10}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 250}}
                                style={{
                                    alignSelf: mine ? "flex-end" : "flex-start",
                                    backgroundColor: mine
                                        ? "#3F3C9F"
                                        : "#F1F1F1",
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    borderRadius: 18,
                                    marginBottom: 10,
                                    maxWidth: "80%",
                                }}
                            >
                                <Text
                                    style={{
                                        color: mine ? "white" : "black",
                                        fontSize: 15,
                                    }}
                                >
                                    {msg.text}
                                </Text>
                            </MotiView>
                        );
                    })}
                </ScrollView>

                {/* INPUT */}
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 12,
                        borderTopWidth: 1,
                        borderColor: "#eee",
                        backgroundColor: "white",
                    }}
                >
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Введите сообщение..."
                        style={{
                            flex: 1,
                            backgroundColor: "#F1F1F1",
                            borderRadius: 20,
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            marginRight: 10,
                        }}
                    />

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#3F3C9F",
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 20,
                        }}
                    >
                        <Text style={{color: "white", fontWeight: "600"}}>
                            Отпр.
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}