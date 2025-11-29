import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Dimensions,
} from "react-native";
import {useRouter} from "expo-router";
import {MotiView} from "moti";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

/* ------------------- */
/* ВОПРОСЫ ДЛЯ МОЛОДЁЖИ */
/* ------------------- */

const YOUTH_QUESTIONS = [
    {
        id: 1,
        question: "Сколько тебе лет?",
        answers: ["12–14", "15–17", "18–21", "22–25"],
    },
    {
        id: 2,
        question: "Что тебе сейчас интереснее всего?",
        answers: ["Программирование", "Дизайн", "Бизнес", "Игры"],
    },
    {
        id: 3,
        question: "Как ты хочешь учиться?",
        answers: ["Самостоятельно", "С наставником", "В группе"],
    },
    {
        id: 4,
        question: "Какая цель у тебя сейчас?",
        answers: [
            "Найти профессию",
            "Зарабатывать",
            "Развиваться",
            "Просто пробовать новое",
        ],
    },
    {
        id: 5,
        question: "Сколько времени в неделю готов уделять обучению?",
        answers: ["1–3 часа", "4–6 часов", "Каждый день"],
    },
];

export default function YouthTesting() {
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);

    const current = YOUTH_QUESTIONS[step];
    const progress = ((step + 1) / YOUTH_QUESTIONS.length) * 100;

    const selectAnswer = (index: number) => {
        const updated = [...answers];
        updated[step] = index;
        setAnswers(updated);
    };

    const next = () => {
        if (step < YOUTH_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            router.push("/profile/youth/results");
        }
    };

    return (
        <LinearGradient
            colors={["#6A63D8", "#C7C4F2"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={{flex: 1}}
        >
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 60,
                    paddingBottom: 120,
                    alignItems: IS_DESKTOP ? "center" : "stretch",
                }}
            >
                <View style={{width: IS_DESKTOP ? "50%" : "100%"}}>
                    {/* TITLE */}
                    <MotiView
                        from={{opacity: 0, translateY: -10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 400}}
                    >
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: "700",
                                color: "white",
                                marginBottom: 16,
                            }}
                        >
                            Тестирование
                        </Text>
                    </MotiView>

                    {/* PROGRESS */}
                    <View
                        style={{
                            backgroundColor: "rgba(255,255,255,0.25)",
                            height: 10,
                            borderRadius: 10,
                            overflow: "hidden",
                            marginBottom: 30,
                        }}
                    >
                        <View
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                backgroundColor: "white",
                            }}
                        />
                    </View>

                    {/* QUESTION CARD */}
                    <MotiView
                        key={current.id}
                        from={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 400}}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 24,
                            padding: 22,
                            marginBottom: 40,
                            shadowColor: "#000",
                            shadowOpacity: 0.08,
                            shadowRadius: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "700",
                                opacity: 0.6,
                                marginBottom: 10,
                            }}
                        >
                            Вопрос {step + 1} из {YOUTH_QUESTIONS.length}
                        </Text>

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "700",
                                marginBottom: 20,
                            }}
                        >
                            {current.question}
                        </Text>

                        {current.answers.map((text, i) => {
                            const active = answers[step] === i;

                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => selectAnswer(i)}
                                    style={{
                                        backgroundColor: active ? "#3F3C9F" : "#EFEFFE",
                                        borderRadius: 30,
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        marginBottom: 14,
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            fontSize: 16,
                                            color: active ? "white" : "#000",
                                            fontWeight: active ? "700" : "500",
                                        }}
                                    >
                                        {text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </MotiView>

                    {/* BUTTON */}
                    <TouchableOpacity
                        disabled={answers[step] === undefined}
                        onPress={next}
                        style={{
                            backgroundColor:
                                answers[step] === undefined ? "#999" : "#2E2C79",
                            paddingVertical: 16,
                            borderRadius: 30,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: 18,
                                fontWeight: "600",
                            }}
                        >
                            {step === YOUTH_QUESTIONS.length - 1
                                ? "Завершить"
                                : "Следующий вопрос"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}