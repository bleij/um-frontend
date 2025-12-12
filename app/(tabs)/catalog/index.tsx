import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Platform,
    Dimensions,
} from "react-native";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";
import {useMemo, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {courses} from "../../../data/courses"; // ✅ ВАЖНО: ПРОВЕРЬ ПУТЬ

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

const categories = [
    "все",
    "гум",
    "мат",
    "естеств",
    "спорт",
    "it",
    "творчество",
];

export default function CatalogScreen() {
    const [activeCategory, setActiveCategory] = useState("все");
    const [search, setSearch] = useState("");
    const [titleIsTwoLines, setTitleIsTwoLines] = useState<Record<number, boolean>>({});
    const router = useRouter();

    // ✅ ЗАЩИТА ОТ undefined
    const safeCourses = Array.isArray(courses) ? courses : [];

    const filteredItems = useMemo(() => {
        return safeCourses.filter((item) => {
            const byCategory =
                activeCategory === "все" || item.tag === activeCategory;

            const bySearch = item.title
                .toLowerCase()
                .includes(search.toLowerCase());

            return byCategory && bySearch;
        });
    }, [activeCategory, search, safeCourses]);

    // Высота строки для заголовка (используется для вычисления количества строк)
    const TITLE_LINE_HEIGHT = 19;

    return (
        <LinearGradient colors={["#3430B5", "#FFFDFD"]} style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom: 120}}>
                {/* HEADER */}
                <View
                    style={{
                        paddingTop: 60,
                        paddingHorizontal: 20,
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={require("../../../assets/logo/logo_white.png")}
                        style={{
                            width: 140,
                            height: 60,
                            resizeMode: "contain",
                            marginBottom: 20,
                        }}
                    />

                    {/* ШИРИНА */}
                    <View style={{width: IS_DESKTOP ? "50%" : "100%"}}>
                        {/* SEARCH */}
                        <View
                            style={{
                                backgroundColor: "white",
                                borderRadius: 30,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                height: 48,
                                marginBottom: 16,
                            }}
                        >
                            <TextInput
                                placeholder="Поиск"
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor="#888"
                                style={{flex: 1}}
                            />
                        </View>

                        {/* FILTERS */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categories.map((cat) => {
                                const active = cat === activeCategory;

                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setActiveCategory(cat)}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 22,
                                            borderRadius: 30,
                                            marginRight: 12,
                                            backgroundColor: active ? "black" : "white",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: active ? "white" : "black",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>

                {/* КОНТЕНТ */}
                <View
                    style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                        alignSelf: "center",
                    }}
                >
                    <View
                        style={{
                            padding: 20,
                            paddingTop: 30,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {filteredItems.map((item, index) => (
                            <MotiView
                                key={item.id}
                                from={{opacity: 0, translateY: 20}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 350, delay: index * 40}}
                                style={{
                                    width: "48%",
                                    marginBottom: 20,
                                    borderRadius: 24,
                                    overflow: "hidden",
                                }}
                            >
                                <LinearGradient
                                    colors={item.gradient}
                                    style={{
                                        height: 180,
                                        justifyContent: "flex-end",
                                        padding: 12,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: "white",
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderRadius: 18,
                                        }}
                                    >
                                        <View style={{flexDirection: "row", alignItems: "center", marginBottom: 8}}>
                                            <View
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 12,
                                                    backgroundColor: "rgba(0,0,0,0.06)",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: 10,
                                                }}
                                            >
                                                <Ionicons name={(item as any).icon} size={18} color="black" />
                                            </View>

                                            <Text style={{fontSize: 12, opacity: 0.6}}>
                                                {item.tag}
                                            </Text>
                                        </View>
                                        <Text
                                            numberOfLines={2}
                                            onLayout={(e) => {
                                                const h = e.nativeEvent.layout.height;
                                                const lines = Math.round(h / TITLE_LINE_HEIGHT);
                                                const isTwo = lines >= 2;
                                                setTitleIsTwoLines((prev) => {
                                                    const prevVal = prev[item.id];
                                                    if (prevVal === isTwo) return prev;
                                                    return {...prev, [item.id]: isTwo};
                                                });
                                            }}
                                            style={{
                                                fontSize: 15,
                                                lineHeight: TITLE_LINE_HEIGHT,
                                                fontWeight: "600",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {item.title}
                                        </Text>

                                        <Text
                                            style={{
                                                fontSize: 12,
                                                opacity: 0.6,
                                                marginBottom: 10,
                                            }}
                                            numberOfLines={titleIsTwoLines[item.id] ? 1 : 2}
                                        >
                                            {item.shortDescription}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/modal/course",
                                                    params: {
                                                        id: String(item.id),
                                                    },
                                                })
                                            }
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
                                                    fontSize: 13,
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
                </View>
            </ScrollView>
        </LinearGradient>
    );
}