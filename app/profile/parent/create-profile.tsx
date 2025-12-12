import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
    Dimensions,
} from "react-native";
import {useRouter} from "expo-router";
import {Feather} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useMemo, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

type AgeGroup = "6-9" | "9-12" | "12-20";

type Child = {
    id: string;
    name: string;
    ageGroup: AgeGroup | null;
};

const AGE_OPTIONS: { label: string; value: AgeGroup }[] = [
    {label: "6–9", value: "6-9"},
    {label: "9–12", value: "9-12"},
    {label: "12–20", value: "12-20"},
];

function makeId() {
    // стабильный простой id без зависимостей
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ParentCreateProfile() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);

    const [parentName, setParentName] = useState("");
    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");

    const [children, setChildren] = useState<Child[]>([
        {id: makeId(), name: "", ageGroup: null},
    ]);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.9,
        });

        if (!result.canceled) setPhoto(result.assets[0].uri);
    }

    const canContinue = useMemo(() => {
        // минимальная проверка: родитель/город/телефон + хотя бы 1 ребенок с именем и возрастной группой
        const hasParent = parentName.trim().length > 0;
        const hasCity = city.trim().length > 0;
        const hasPhone = phone.trim().length > 0;

        const hasValidChild = children.some(
            (c) => c.name.trim().length > 0 && !!c.ageGroup
        );

        return hasParent && hasCity && hasPhone && hasValidChild;
    }, [parentName, city, phone, children]);

    function addChild() {
        setChildren((prev) => [...prev, {id: makeId(), name: "", ageGroup: null}]);
    }

    function removeChild(id: string) {
        setChildren((prev) => {
            const next = prev.filter((c) => c.id !== id);
            return next.length === 0 ? [{id: makeId(), name: "", ageGroup: null}] : next;
        });
    }

    function updateChild(id: string, patch: Partial<Child>) {
        setChildren((prev) => prev.map((c) => (c.id === id ? {...c, ...patch} : c)));
    }

    return (
        <LinearGradient colors={["#3F3C9F", "#EDEBFF"]} style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingTop: 40, paddingBottom: 80}}>
                <View
                    style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                        alignSelf: "center",
                        paddingHorizontal: 24,
                    }}
                >
                    {/* LOGO */}
                    <Image
                        source={require("../../../assets/logo/logo_white.png")}
                        style={{
                            width: 140,
                            height: 60,
                            resizeMode: "contain",
                            alignSelf: "center",
                            marginBottom: 20,
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: "800",
                            color: "white",
                            textAlign: "center",
                            marginBottom: 30,
                        }}
                    >
                        Профиль родителя
                    </Text>

                    {/* PHOTO */}
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: 999,
                            backgroundColor: "rgba(255,255,255,0.25)",
                            alignSelf: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 30,
                            overflow: "hidden",
                        }}
                    >
                        {photo ? (
                            <Image
                                source={{uri: photo}}
                                style={{width: "100%", height: "100%"}}
                                resizeMode="cover"
                            />
                        ) : (
                            <Feather name="camera" size={40} color="white"/>
                        )}
                    </TouchableOpacity>

                    {/* BASE INPUTS */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: 18,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            marginBottom: 16,
                        }}
                    >
                        <TextInput
                            value={parentName}
                            onChangeText={setParentName}
                            placeholder="Ваше имя"
                            placeholderTextColor="#666"
                            style={{flex: 1, fontSize: 16}}
                        />
                        <Feather name="user" size={20} color="#3F3C9F"/>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: 18,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            marginBottom: 16,
                        }}
                    >
                        <TextInput
                            value={city}
                            onChangeText={setCity}
                            placeholder="Город"
                            placeholderTextColor="#666"
                            style={{flex: 1, fontSize: 16}}
                        />
                        <Feather name="map-pin" size={20} color="#3F3C9F"/>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: 18,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            marginBottom: 18,
                        }}
                    >
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Контактный телефон"
                            placeholderTextColor="#666"
                            style={{flex: 1, fontSize: 16}}
                            keyboardType="phone-pad"
                        />
                        <Feather name="phone" size={20} color="#3F3C9F"/>
                    </View>

                    {/* CHILDREN HEADER + ADD */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 10,
                            marginTop: 6,
                        }}
                    >
                        <Text style={{color: "white", fontSize: 16, fontWeight: "800"}}>
                            Дети
                        </Text>

                        <TouchableOpacity
                            onPress={addChild}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "rgba(255,255,255,0.25)",
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                borderRadius: 999,
                            }}
                        >
                            <Feather name="plus" size={18} color="white"/>
                            <Text style={{color: "white", marginLeft: 8, fontWeight: "700"}}>
                                добавить
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* CHILD CARDS */}
                    {children.map((child, idx) => (
                        <View
                            key={child.id}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                borderRadius: 18,
                                padding: 14,
                                marginBottom: 14,
                            }}
                        >
                            {/* child header */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 10,
                                }}
                            >
                                <Text style={{fontSize: 14, fontWeight: "800", color: "#2E2C79"}}>
                                    Ребёнок {idx + 1}
                                </Text>

                                {children.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => removeChild(child.id)}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingHorizontal: 10,
                                            paddingVertical: 6,
                                            borderRadius: 999,
                                            backgroundColor: "rgba(63,60,159,0.10)",
                                        }}
                                    >
                                        <Feather name="trash-2" size={16} color="#3F3C9F"/>
                                        <Text
                                            style={{
                                                marginLeft: 8,
                                                color: "#3F3C9F",
                                                fontWeight: "700",
                                                fontSize: 12,
                                            }}
                                        >
                                            удалить
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* name input */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "rgba(255,255,255,1)",
                                    borderRadius: 14,
                                    paddingHorizontal: 14,
                                    paddingVertical: 12,
                                    borderWidth: 1,
                                    borderColor: "rgba(46,44,121,0.10)",
                                    marginBottom: 10,
                                }}
                            >
                                <TextInput
                                    value={child.name}
                                    onChangeText={(t) => updateChild(child.id, {name: t})}
                                    placeholder="Имя ребёнка"
                                    placeholderTextColor="#666"
                                    style={{flex: 1, fontSize: 15}}
                                />
                                <Feather name="smile" size={18} color="#3F3C9F"/>
                            </View>

                            {/* age group segmented */}
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: "#2E2C79",
                                    fontWeight: "700",
                                    marginBottom: 8,
                                }}
                            >
                                Возрастная категория
                            </Text>

                            <View style={{flexDirection: "row", gap: 10}}>
                                {AGE_OPTIONS.map((opt) => {
                                    const active = child.ageGroup === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.value}
                                            onPress={() => updateChild(child.id, {ageGroup: opt.value})}
                                            style={{
                                                flex: 1,
                                                paddingVertical: 12,
                                                borderRadius: 999,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: active ? "#3F3C9F" : "rgba(63,60,159,0.10)",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: "800",
                                                    color: active ? "white" : "#3F3C9F",
                                                }}
                                            >
                                                {opt.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}

                    {/* BUTTON */}
                    <TouchableOpacity
                        onPress={() => router.push("/profile/common/done")}
                        disabled={!canContinue}
                        style={{
                            marginTop: 14,
                            backgroundColor: canContinue ? "#2E2C79" : "rgba(46,44,121,0.35)",
                            paddingVertical: 18,
                            borderRadius: 999,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 18,
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            продолжить
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}