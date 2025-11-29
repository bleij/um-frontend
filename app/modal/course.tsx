import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Dimensions,
} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {courses} from "../../data/courses";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

export default function CourseModal() {
    const router = useRouter();
    const {id} = useLocalSearchParams();

    const course = courses.find((c) => c.id === Number(id));

    if (!course) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>курс не найден</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={course.gradient} style={{flex: 1}}>
            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: 80,
                    alignItems: IS_DESKTOP ? "center" : "stretch",
                }}
            >
                <View style={{width: IS_DESKTOP ? "50%" : "100%"}}>
                    {/* CLOSE */}
                    <TouchableOpacity onPress={() => router.back()} style={{marginBottom: 20}}>
                        <Text style={{fontSize: 18, color: "white"}}>← закрыть</Text>
                    </TouchableOpacity>

                    {/* CARD */}
                    <View
                        style={{
                            backgroundColor: "white",
                            borderRadius: 30,
                            padding: 24,
                        }}
                    >
                        <Text style={{fontSize: 26, fontWeight: "800", marginBottom: 6}}>
                            {course.title}
                        </Text>

                        <Text style={{opacity: 0.6, marginBottom: 16}}>
                            категория: {course.tag}
                        </Text>

                        <Text style={{fontSize: 16, lineHeight: 22, marginBottom: 20}}>
                            {course.description}
                        </Text>

                        <View style={{gap: 8, marginBottom: 24}}>
                            <Text>возраст: {course.age}</Text>
                            <Text>расписание: {course.schedule}</Text>
                            <Text>стоимость: {course.price}</Text>
                        </View>

                        <TouchableOpacity
                            style={{
                                backgroundColor: "black",
                                paddingVertical: 14,
                                borderRadius: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    textAlign: "center",
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                записаться
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}