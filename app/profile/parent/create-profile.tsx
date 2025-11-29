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
import {MotiView} from "moti";
import {Feather} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useState} from "react";
import {LinearGradient} from "expo-linear-gradient";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function ParentCreateProfile() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.9,
        });

        if (!result.canceled) setPhoto(result.assets[0].uri);
    }

    const fields = [
        {label: "Ваше имя", icon: "user"},
        {label: "Город", icon: "map-pin"},
        {label: "Имя ребёнка", icon: "smile"},
        {label: "Возраст ребёнка", icon: "calendar"},
        {label: "Контактный телефон", icon: "phone"},
    ];

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

                    {/* INPUTS */}
                    {fields.map((f, i) => (
                        <View
                            key={i}
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
                                placeholder={f.label}
                                placeholderTextColor="#666"
                                style={{flex: 1, fontSize: 16}}
                            />
                            <Feather name={f.icon as any} size={20} color="#3F3C9F"/>
                        </View>
                    ))}

                    {/* BUTTON */}
                    <TouchableOpacity
                        onPress={() => router.push("/profile/common/done")}
                        style={{
                            marginTop: 20,
                            backgroundColor: "#2E2C79",
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