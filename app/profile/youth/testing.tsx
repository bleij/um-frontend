import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState, useMemo } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from "react-native";
import { LAYOUT } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useParentData } from "../../../contexts/ParentDataContext";
import { Diagnostic } from "../../../models/types";

/* ------------------- */
/* ВОПРОСЫ ПО ВОЗРАСТАМ */
/* ------------------- */

const CHILD_QUESTIONS = [
  {
    id: 1,
    question: "Какая твоя любимая игра?",
    answers: ["Собери конструктор", "Рисование", "Догонялки", "Головоломки"],
  },
  {
    id: 2,
    question: "Что тебе нравится делать в свободное время?",
    answers: ["Смотреть мультики", "Гулять с друзьями", "Читать сказки", "Строить базы"],
  },
  {
    id: 3,
    question: "Представь, что у тебя есть суперсила. Какая она?",
    answers: ["Летать", "Читать мысли", "Создавать предметы", "Становиться невидимым"],
  },
];

const YOUTH_QUESTIONS = [
  {
    id: 1,
    question: "Что тебе сейчас интереснее всего изучать?",
    answers: ["Программирование", "Дизайн", "Бизнес/Управление", "Наука/Исследования"],
  },
  {
    id: 2,
    question: "Как ты предпочитаешь работать над проектами?",
    answers: ["Полностью самостоятельно", "С наставником 1 на 1", "В небольшой команде", "В большой группе"],
  },
  {
    id: 3,
    question: "Кем ты видишь себя через 5 лет?",
    answers: ["Специалистом (IT/Дизайн)", "Предпринимателем", "Лидером команды", "Свободным фрилансером"],
  },
  {
    id: 4,
    question: "Где ты черпаешь вдохновение или информацию?",
    answers: ["YouTube/Курсы", "Книги/Статьи", "Общение с людьми", "Практика методом ошибок"],
  },
];

export default function YouthTesting() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;

  const { user } = useAuth();
  const { childrenProfile, activeChildId, updateChildDiagnostic } = useParentData();

  // Determine which questions to show based on age
  const activeChild = childrenProfile.find((c) => c.id === activeChildId);
  const isChild = activeChild ? activeChild.age < 12 : false;
  
  const QUESTIONS = isChild ? CHILD_QUESTIONS : YOUTH_QUESTIONS;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const current = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const selectAnswer = (index: number) => {
    const updated = [...answers];
    updated[step] = index;
    setAnswers(updated);
  };

  const processWithAI = async (selectedAnswers: number[], isSkip: boolean = false) => {
    setIsProcessing(true);
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is missing");
      }

      let prompt = `You are an expert child psychologist and talent scout. Analyze this profile. Category: ${isChild ? "Child (6-11)" : "Teenager (12-17)"}.\n`;
      
      if (!isSkip) {
        prompt += `The user answered the following questions:\n`;
        selectedAnswers.forEach((ansIndex, i) => {
          if (ansIndex !== undefined) {
            prompt += `Q: ${QUESTIONS[i].question}\nA: ${QUESTIONS[i].answers[ansIndex]}\n`;
          }
        });
      } else {
         prompt += `The user skipped the test. Assign generic but encouraging balanced scores and summary.\n`;
      }

      prompt += `
Based on these answers, generate a JSON object matching this Diagnostic interface exactly. DO NOT include markdown blocks like \`\`\`json, just return raw JSON:
{
  "scores": {
    "logical": number (0-100),
    "creative": number (0-100),
    "social": number (0-100),
    "physical": number (0-100),
    "linguistic": number (0-100)
  },
  "summary": "string (A short, encouraging paragraph in Russian about their potential)",
  "recommendedConstellation": "string (A creative 1-2 word title for their talent type in Russian, e.g. 'Техно-энтузиаст' or 'Творческий лидер')"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
             temperature: 0.7,
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch from Gemini");

      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanedJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const diagnosticData = JSON.parse(cleanedJson);
      
      const targetDiagnostic: Diagnostic = {
        childId: activeChildId || user?.id || "unknown",
        scores: diagnosticData.scores || { logical: 50, creative: 50, social: 50, physical: 50, linguistic: 50 },
        summary: diagnosticData.summary || "Очень способный ученик!",
        recommendedConstellation: diagnosticData.recommendedConstellation || "Универсал",
        timestamp: new Date().toISOString(),
      };

      if (activeChildId) {
        await updateChildDiagnostic(activeChildId, targetDiagnostic);
      }

      router.push("/profile/youth/results");
    } catch (e) {
      console.error("AI processing error:", e);
      alert("Произошла ошибка при анализе. Мы используем запасные результаты.");
      // Fallback
      if (activeChildId) {
        await updateChildDiagnostic(activeChildId, {
          childId: activeChildId,
          scores: { logical: 70, creative: 80, social: 60, physical: 50, linguistic: 65 },
          summary: "У тебя отличный потенциал! Мы видим сильную творческую жилку.",
          recommendedConstellation: "Творческий новатор",
          timestamp: new Date().toISOString()
        });
      }
      router.push("/profile/youth/results");
    } finally {
      setIsProcessing(false);
    }
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      processWithAI(answers);
    }
  };

  const handleSkip = () => {
    processWithAI([], true);
  };

  if (isProcessing) {
    return (
       <LinearGradient colors={["#6A63D8", "#C7C4F2"]} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: "white", marginTop: 20, fontSize: 18, fontWeight: "600" }}>
            ИИ анализирует ответы...
          </Text>
       </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#6A63D8", "#C7C4F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: isDesktop ? 72 : 60,
          paddingBottom: 120,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined,
          }}
        >
          {/* HEADER ROW WITH SKIP */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
             <MotiView
               from={{ opacity: 0, translateY: -10 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ duration: 400 }}
             >
               <Text
                 style={{
                   fontSize: 28,
                   fontWeight: "700",
                   color: "white",
                 }}
               >
                 Тестирование
               </Text>
             </MotiView>
             <TouchableOpacity onPress={handleSkip}>
                 <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: "600" }}>Пропустить</Text>
             </TouchableOpacity>
          </View>

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
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 400 }}
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
              Вопрос {step + 1} из {QUESTIONS.length}
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
                    backgroundColor: active ? "#6C5CE7" : "#EFEFFE",
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
              backgroundColor: answers[step] === undefined ? "#999" : "#6C5CE7",
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
              {step === QUESTIONS.length - 1
                ? "Завершить и анализировать"
                : "Следующий вопрос"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

