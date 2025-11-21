import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";

export default function ChatsScreen() {
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                paddingTop: Platform.OS === "ios" ? 60 : 40,
            }}
        >
            {/* HEADER */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {/* BACK */}
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{fontSize: 18, fontWeight: "600"}}>‹ Назад</Text>
                </TouchableOpacity>

                {/* RIGHT ICONS */}
                <View style={{flexDirection: "row", gap: 18}}>
                    <View
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            borderWidth: 2,
                            borderColor: "#000",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{fontSize: 18}}>👤</Text>
                    </View>

                    <View
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            borderWidth: 2,
                            borderColor: "#000",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{fontSize: 18}}>⋮</Text>
                    </View>
                </View>
            </View>

            {/* CATEGORY TABS */}
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
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "#3F2CCF",
                        borderRadius: 40,
                        paddingVertical: 14,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{color: "white", fontWeight: "600"}}>все чаты</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 1,
                        borderRadius: 40,
                        paddingVertical: 14,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{color: "#555", fontWeight: "600"}}>непрочитанное</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 1,
                        borderRadius: 40,
                        paddingVertical: 14,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{color: "#555", fontWeight: "600"}}>архив</Text>
                </TouchableOpacity>
            </View>

            {/* CHAT LIST */}
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 160, // отступ под нижний таббар
                }}
            >
                {[1, 2, 3, 4].map((item, idx) => (
                    <View
                        key={idx}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 28,
                        }}
                    >
                        {/* AVATAR */}
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                backgroundColor: "#342CCF",
                                marginRight: 20,
                            }}
                        />

                        {/* TEXT BLOCK */}
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 18, fontWeight: "600"}}>
                                Капин Джангир
                            </Text>
                            <Text style={{color: "#777"}}>Хорошо, позже обсудим</Text>
                        </View>

                        {/* TIME + COUNTER */}
                        <View style={{alignItems: "flex-end"}}>
                            <Text style={{color: "#777", marginBottom: 6}}>09:43</Text>

                            {idx === 0 && (
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
                                    <Text style={{color: "white", fontSize: 12}}>1</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}