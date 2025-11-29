import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {Feather} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {useState} from "react";
import {LinearGradient} from "expo-linear-gradient";

export default function YouthCreateProfile() {
    const router = useRouter();
    const isWeb = Platform.OS === "web";
    const [photo, setPhoto] = useState<string | null>(null);

    async function pickImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.9,
            });

            if (!result.canceled) {
                setPhoto(result.assets[0].uri);
            }
        } catch {
        }
    }

    const fields = [
        {label: "Имя", icon: "user"},
        {label: "Возраст", icon: "calendar"},
        {label: "Город", icon: "map-pin"},
        {label: "Интересы", icon: "heart"},
        {label: "О себе", icon: "edit-3"},
    ];

    return (
        <LinearGradient colors={["#3F3C9F", "#EDEBFF"]} style={{flex: 1}}>
            <ScrollView
                contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 80,
                }}
            >
                <View
                    style={{
                        maxWidth: isWeb ? 680 : "100%",
                        width: "100%",
                        alignSelf: "center",
                        paddingHorizontal: isWeb ? 36 : 24,
                    }}
                >
                    {/* LOGO */}
                    <MotiView
                        from={{opacity: 0, translateY: -20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 450}}
                        style={{alignItems: "center", marginBottom: 4}}
                    >
                        <Image
                            source={require("../../../assets/logo/logo_white.png")}
                            style={{width: 160, height: 120, resizeMode: "contain"}}
                        />
                    </MotiView>

                    {/* TITLE */}
                    <MotiView
                        from={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 450}}
                        style={{marginBottom: 28}}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: "800",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            Профиль молодёжи
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: "rgba(255,255,255,0.8)",
                                textAlign: "center",
                                marginTop: 6,
                            }}
                        >
                            Расскажи немного о себе
                        </Text>
                    </MotiView>

                    {/* CARD */}
                    <MotiView
                        from={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 500}}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 32,
                            paddingVertical: 34,
                            paddingHorizontal: 26,
                            shadowColor: "#000",
                            shadowOpacity: 0.12,
                            shadowRadius: 20,
                            shadowOffset: {width: 0, height: 10},
                        }}
                    >
                        {/* PHOTO */}
                        <MotiView
                            from={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 450}}
                            style={{alignItems: "center", marginBottom: 28}}
                        >
                            <TouchableOpacity
                                onPress={pickImage}
                                activeOpacity={0.85}
                                style={{
                                    width: 132,
                                    height: 132,
                                    borderRadius: 999,
                                    backgroundColor: "#3F3C9F",
                                    justifyContent: "center",
                                    alignItems: "center",
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
                                    <Feather name="camera" size={38} color="white"/>
                                )}
                            </TouchableOpacity>
                        </MotiView>

                        {/* INPUTS */}
                        {fields.map((f, index) => (
                            <MotiView
                                key={index}
                                from={{opacity: 0, translateY: 20}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 350, delay: 120 + index * 70}}
                                style={{marginBottom: 16}}
                            >
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderColor: "#3F3C9F",
                                        borderRadius: 16,
                                        paddingVertical: 12,
                                        paddingHorizontal: 14,
                                        backgroundColor: "#F7F7FF",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <TextInput
                                        placeholder={f.label}
                                        placeholderTextColor="#666"
                                        style={{
                                            flex: 1,
                                            fontSize: 16,
                                        }}
                                    />

                                    <Feather
                                        name={f.icon as any}
                                        size={20}
                                        color="#3F3C9F"
                                        style={{marginLeft: 10}}
                                    />
                                </View>
                            </MotiView>
                        ))}

                        {/* BUTTON */}
                        <MotiView
                            from={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 400, delay: 150 + fields.length * 70}}
                            style={{marginTop: 10}}
                        >
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
                        </MotiView>
                    </MotiView>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}