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
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: "600",
                                                marginBottom: 6,
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
                                            numberOfLines={2}
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