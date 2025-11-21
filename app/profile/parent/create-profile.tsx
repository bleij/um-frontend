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

export default function MentorCreateProfile() {
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
        {label: "Опыт", icon: "briefcase"},
        {label: "Специализация", icon: "tool"},
        {label: "Образование", icon: "book-open"},
        {label: "Опишите себя", icon: "edit-3"},
        {label: "Загрузите резюме", icon: "upload"},
    ];

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
            }}
            contentContainerStyle={{
                paddingTop: 40,
                paddingBottom: 60,
            }}
        >
            <View
                style={{
                    maxWidth: isWeb ? 680 : "100%",
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: isWeb ? 32 : 0,
                    paddingHorizontal: isWeb ? 36 : 24,
                    paddingBottom: 40,
                    shadowColor: isWeb ? "#000" : undefined,
                    shadowOpacity: isWeb ? 0.06 : 0,
                    shadowRadius: isWeb ? 16 : 0,
                    shadowOffset: isWeb ? {width: 0, height: 4} : undefined,
                }}
            >
                <MotiView
                    from={{opacity: 0, translateY: -15}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 400}}
                    style={{alignItems: "center", marginBottom: 20}}
                >
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "700",
                            color: "#3430B5",
                            textAlign: "center",
                        }}
                    >
                        Создайте профиль
                    </Text>
                </MotiView>

                {/* PHOTO PICKER */}
                <MotiView
                    from={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 400, delay: 150}}
                    style={{
                        alignSelf: "center",
                        marginBottom: 30,
                    }}
                >
                    <TouchableOpacity
                        onPress={pickImage}
                        activeOpacity={0.85}
                        style={{
                            width: 140,
                            height: 140,
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
                            <Feather name="camera" size={40} color="#FFFFFF"/>
                        )}
                    </TouchableOpacity>
                </MotiView>

                {/* INPUTS */}
                {fields.map((f, index) => (
                    <MotiView
                        key={index}
                        from={{opacity: 0, translateY: 20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 350, delay: 200 + index * 70}}
                        style={{marginBottom: 18}}
                    >
                        <View
                            style={{
                                borderWidth: 2,
                                borderColor: "#3430B5",
                                borderRadius: 14,
                                paddingVertical: 12,
                                paddingHorizontal: 14,
                                backgroundColor: "white",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <TextInput
                                placeholder={f.label}
                                placeholderTextColor="#555"
                                style={{
                                    flex: 1,
                                    fontSize: 16,
                                }}
                            />

                            <Feather
                                name={f.icon as any}
                                size={22}
                                color="#3430B5"
                                style={{marginLeft: 10}}
                            />
                        </View>
                    </MotiView>
                ))}

                {/* NEXT BUTTON */}
                <MotiView
                    from={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{
                        duration: 350,
                        delay: 200 + fields.length * 70,
                    }}
                    style={{alignItems: "center", marginTop: 10}}
                >
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/profile/common/done")
                        }
                        style={{
                            backgroundColor: "#3430B5",
                            paddingVertical: 14,
                            paddingHorizontal: 48,
                            borderRadius: 999,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            продолжить
                        </Text>
                    </TouchableOpacity>
                </MotiView>
            </View>
        </ScrollView>
    );
}