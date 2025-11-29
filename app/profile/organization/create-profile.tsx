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

export default function OrganizationCreateProfile() {
    const router = useRouter();
    const [logo, setLogo] = useState<string | null>(null);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.9,
        });

        if (!result.canceled) {
            setLogo(result.assets[0].uri);
        }
    }

    const fields = [
        {label: "Название организации", icon: "home"},
        {label: "Направление (робототехника, спорт…)", icon: "grid"},
        {label: "Город", icon: "map-pin"},
        {label: "Адрес", icon: "navigation"},
        {label: "Телефон", icon: "phone"},
        {label: "Описание кружка", icon: "edit-3"},
    ];

    return (
        <LinearGradient colors={["#3F3C9F", "#EDEBFF"]} style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingTop: 40, paddingBottom: 80}}>

                {/* ✅ КОНТЕЙНЕР */}
                <View
                    style={{
                        width: IS_DESKTOP ? "50%" : "100%",
                        alignSelf: "center",
                        paddingHorizontal: IS_DESKTOP ? 36 : 24,
                    }}
                >

                    {/* ✅ ЛОГО */}
                    <MotiView
                        from={{opacity: 0, translateY: -20}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                        style={{alignItems: "center", marginBottom: 24}}
                    >
                        <Image
                            source={require("../../../assets/logo/logo_white.png")}
                            style={{width: 160, height: 60, resizeMode: "contain"}}
                        />
                    </MotiView>

                    {/* ✅ ЗАГОЛОВОК */}
                    <MotiView
                        from={{opacity: 0, translateY: -10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                        style={{marginBottom: 20}}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: "800",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            Профиль организации
                        </Text>
                        <Text
                            style={{
                                textAlign: "center",
                                color: "rgba(255,255,255,0.8)",
                                marginTop: 6,
                            }}
                        >
                            Заполните данные о вашем кружке
                        </Text>
                    </MotiView>

                    {/* ✅ КАРТОЧКА */}
                    <MotiView
                        from={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 400}}
                        style={{
                            backgroundColor: "rgba(255,255,255,0.96)",
                            borderRadius: 32,
                            padding: 26,
                            shadowColor: "#000",
                            shadowOpacity: 0.12,
                            shadowRadius: 16,
                            shadowOffset: {width: 0, height: 8},
                        }}
                    >

                        {/* ✅ ЗАГРУЗКА ЛОГО */}
                        <MotiView
                            from={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 400}}
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
                                {logo ? (
                                    <Image
                                        source={{uri: logo}}
                                        style={{width: "100%", height: "100%"}}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Feather name="image" size={36} color="#FFFFFF"/>
                                )}
                            </TouchableOpacity>

                            <Text
                                style={{
                                    textAlign: "center",
                                    marginTop: 10,
                                    color: "#555",
                                }}
                            >
                                логотип организации
                            </Text>
                        </MotiView>

                        {/* ✅ ПОЛЯ */}
                        {fields.map((f, index) => (
                            <MotiView
                                key={index}
                                from={{opacity: 0, translateY: 18}}
                                animate={{opacity: 1, translateY: 0}}
                                transition={{duration: 350, delay: 120 + index * 60}}
                                style={{marginBottom: 16}}
                            >
                                <View
                                    style={{
                                        borderWidth: 1.5,
                                        borderColor: "#3F3C9F",
                                        borderRadius: 16,
                                        paddingVertical: 12,
                                        paddingHorizontal: 16,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: "#F7F8FF",
                                    }}
                                >
                                    <TextInput
                                        placeholder={f.label}
                                        placeholderTextColor="#777"
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

                        {/* ✅ КНОПКА */}
                        <MotiView
                            from={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 350, delay: 450}}
                            style={{alignItems: "center", marginTop: 24}}
                        >
                            <TouchableOpacity
                                onPress={() => router.push("/profile/common/done")}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#2E2C79",
                                    paddingVertical: 16,
                                    borderRadius: 999,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 16,
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