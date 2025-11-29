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

export default function MentorCreateProfile() {
    const router = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.9,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    }

    const fields = [
        {label: "Имя", icon: "user"},
        {label: "Опыт (лет)", icon: "briefcase"},
        {label: "Направление кружка", icon: "tool"},
        {label: "Образование", icon: "book-open"},
        {label: "О себе", icon: "edit-3"},
        {label: "Ссылка на портфолио", icon: "link"},
    ];

    return (
        <LinearGradient
            colors={["#3F3C9F", "#EEEFFF"]}
            style={{flex: 1}}
        >
            <ScrollView contentContainerStyle={{paddingTop: 70, paddingBottom: 80}}>

                {/* ЛОГО */}
                <MotiView
                    from={{opacity: 0, translateY: -20}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 450}}
                    style={{alignItems: "center", marginBottom: 24}}
                >
                    <Image
                        source={require("../../../assets/logo/logo_white.png")}
                        style={{width: 150, height: 60, resizeMode: "contain"}}
                    />
                </MotiView>

                {/* СТЕКЛЯННАЯ КАРТОЧКА */}
                <MotiView
                    from={{opacity: 0, scale: 0.96}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 450}}
                    style={{
                        width: IS_DESKTOP ? "50%" : "92%",
                        alignSelf: "center",
                        backgroundColor: "rgba(255,255,255,0.85)",
                        borderRadius: 36,
                        paddingVertical: 36,
                        paddingHorizontal: 26,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 20,
                        shadowOffset: {width: 0, height: 8},
                    }}
                >

                    {/* ЗАГОЛОВОК */}
                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: "800",
                            color: "#2E2C79",
                            textAlign: "center",
                            marginBottom: 26,
                        }}
                    >
                        Профиль наставника
                    </Text>

                    {/* ФОТО */}
                    <MotiView
                        from={{opacity: 0, scale: 0.85}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 400}}
                        style={{alignItems: "center", marginBottom: 32}}
                    >
                        <TouchableOpacity
                            onPress={pickImage}
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
                                />
                            ) : (
                                <Feather name="camera" size={42} color="white"/>
                            )}
                        </TouchableOpacity>

                        <Text style={{marginTop: 10, color: "#555"}}>
                            Нажмите, чтобы загрузить фото
                        </Text>
                    </MotiView>

                    {/* ПОЛЯ */}
                    {fields.map((f, index) => (
                        <MotiView
                            key={index}
                            from={{opacity: 0, translateY: 16}}
                            animate={{opacity: 1, translateY: 0}}
                            transition={{duration: 350, delay: index * 70}}
                            style={{marginBottom: 16}}
                        >
                            <View
                                style={{
                                    backgroundColor: "#F4F5FF",
                                    borderRadius: 16,
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
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
                                />
                            </View>
                        </MotiView>
                    ))}

                    {/* КНОПКА */}
                    <MotiView
                        from={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 400}}
                        style={{marginTop: 20}}
                    >
                        <TouchableOpacity
                            onPress={() => router.push("/profile/common/done")}
                            style={{
                                backgroundColor: "#3430B5",
                                paddingVertical: 16,
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
            </ScrollView>
        </LinearGradient>
    );
}