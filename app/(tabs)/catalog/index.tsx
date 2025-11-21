import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Platform
} from "react-native";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";

export default function CatalogScreen() {
    const isWeb = Platform.OS === "web";

    const categories = ["все", "гум", "мат", "естеств", "спорт"];

    const items = [
        {id: 1, title: "Робототехника", gradient: ["#5374ff", "#87e2ff"]},
        {id: 2, title: "Критическое мышление", gradient: ["#7f5cff", "#c1a0ff"]},
        {id: 3, title: "Робототехника", gradient: ["#ff6bc3", "#ffbb99"]},
        {id: 4, title: "Критическое мышление", gradient: ["#4373ff", "#b0e1ff"]},
        {id: 5, title: "Робототехника", gradient: ["#6b73ff", "#c2ffe7"]},
        {id: 6, title: "Критическое мышление", gradient: ["#5f3dff", "#cda8ff"]},
    ];

    return (
        <ScrollView
            style={{flex: 1, backgroundColor: "#FFFFFF"}}
            contentContainerStyle={{paddingBottom: 120}}
        >
            {/* HEADER GRADIENT */}
            <LinearGradient
                colors={["#5A4FF3", "#A8B4FF"]}
                style={{
                    paddingTop: 70,
                    paddingBottom: 40,
                    paddingHorizontal: 20,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                }}
            >
                <Text
                    style={{
                        fontSize: 72,
                        color: "white",
                        alignSelf: "center",
                        fontWeight: "800",
                        marginBottom: 20,
                    }}
                >
                    UM
                </Text>

                {/* SEARCH */}
                <View
                    style={{
                        backgroundColor: "white",
                        borderRadius: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        height: 48,
                        marginBottom: 18,
                    }}
                >
                    <TextInput
                        placeholder="Поиск"
                        placeholderTextColor="#888"
                        style={{
                            flex: 1,
                            fontSize: 16,
                        }}
                    />

                    <Text style={{fontSize: 20}}>🔍</Text>
                </View>

                {/* FILTER TABS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat, i) => {
                        const active = i === 0;

                        return (
                            <TouchableOpacity
                                key={i}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 26,
                                    borderRadius: 30,
                                    marginRight: 12,
                                    backgroundColor: active ? "#2E2C79" : "white",
                                    borderWidth: active ? 0 : 1,
                                    borderColor: "#2E2C79",
                                }}
                            >
                                <Text
                                    style={{
                                        color: active ? "white" : "#2E2C79",
                                        fontWeight: "600",
                                    }}
                                >
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </LinearGradient>

            {/* LIST */}
            <View style={{padding: 20, paddingTop: 30}}>

                {items.map((item) => (
                    <MotiView
                        key={item.id}
                        from={{opacity: 0, translateY: 20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 350}}
                        style={{
                            marginBottom: 22,
                            borderRadius: 24,
                            overflow: "hidden",
                        }}
                    >
                        <LinearGradient
                            colors={item.gradient}
                            style={{
                                height: 200,
                                borderRadius: 24,
                                justifyContent: "flex-end",
                                padding: 14,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "white",
                                    paddingVertical: 10,
                                    paddingHorizontal: 14,
                                    borderRadius: 18,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "600",
                                        color: "#111",
                                        marginBottom: 8,
                                    }}
                                >
                                    {item.title}
                                </Text>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "black",
                                        paddingVertical: 8,
                                        paddingHorizontal: 16,
                                        borderRadius: 20,
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontSize: 14,
                                            fontWeight: "600",
                                        }}
                                    >
                                        подробнее
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </MotiView>
                ))}

            </View>
        </ScrollView>
    );
}