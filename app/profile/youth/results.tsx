import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";
import { useParentData } from "../../../contexts/ParentDataContext";

export default function YouthResults() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { childrenProfile, activeChildId } = useParentData();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;

  const child = childrenProfile.find(c => c.id === activeChildId) || childrenProfile[0];
  const diagnostic = child?.talentProfile;

  if (!child || !diagnostic) {
      return (
          <View style={{flex: 1, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", padding: 40}}>
              <Text style={{color: "white", fontSize: 20, textAlign: "center", fontWeight: "bold"}}>
                  Анализ почти завершен! Пожалуйста, подождите...
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(tabs)/home" as any)} style={{marginTop: 20, backgroundColor: "white", padding: 15, borderRadius: 20}}>
                  <Text style={{color: COLORS.primary, fontWeight: "bold"}}>Вернуться на главную</Text>
              </TouchableOpacity>
          </View>
      )
  }

  const scores = [
    { label: "Логика", value: diagnostic.scores.logical, color: "#10B981" },
    { label: "Креатив", value: diagnostic.scores.creative, color: "#8B5CF6" },
    { label: "Социум", value: diagnostic.scores.social, color: "#3B82F6" },
    { label: "Физика", value: diagnostic.scores.physical, color: "#F59E0B" },
    { label: "Лингвист.", value: diagnostic.scores.linguistic, color: "#EC4899" },
  ];

  return (
    <LinearGradient colors={["#6C5CE7", "#EDE9FE"]} style={{ flex: 1 }}>
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
          {/* TITLE */}
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 400 }}
            style={{ marginBottom: 30 }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "800",
                color: "white",
                textAlign: "center",
              }}
            >
              Твои результаты
            </Text>
          </MotiView>

          {/* EMOJI */}
          <MotiView
            from={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 500 }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="zap" size={40} color="white" />
            </View>
          </MotiView>

          {/* TYPE CARD */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 400 }}
            style={{
              backgroundColor: "white",
              borderRadius: 32,
              padding: 24,
              marginBottom: 26,
              ...SHADOWS.md
            }}
          >
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 12}}>
               <View style={{width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center", marginRight: 12}}>
                  <Feather name="award" size={20} color={COLORS.primary} />
               </View>
               <Text
                 style={{
                   fontSize: 22,
                   fontWeight: "900",
                   color: COLORS.foreground,
                 }}
               >
                 {diagnostic.recommendedConstellation}
               </Text>
            </View>

            <Text
              style={{
                fontSize: 15,
                color: COLORS.mutedForeground,
                lineHeight: 22,
                fontWeight: "500"
              }}
            >
              {diagnostic.summary}
            </Text>
          </MotiView>

          {/* TALENT MAP (Visual bars instead of simple graph) */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 500, delay: 200 }}
            style={{
              backgroundColor: "white",
              borderRadius: 32,
              padding: 24,
              marginBottom: 26,
              ...SHADOWS.sm
            }}
          >
            <Text style={{fontSize: 18, fontWeight: "800", marginBottom: 20, color: COLORS.foreground}}>Карта талантов</Text>
            
            <View style={{gap: 16}}>
               {scores.map((score, idx) => (
                  <View key={idx}>
                     <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 8}}>
                        <Text style={{fontSize: 14, fontWeight: "700", color: COLORS.mutedForeground}}>{score.label}</Text>
                        <Text style={{fontSize: 14, fontWeight: "900", color: COLORS.primary}}>{score.value}%</Text>
                     </View>
                     <View style={{height: 8, backgroundColor: "#F3F4F6", borderRadius: 4, overflow: "hidden"}}>
                        <MotiView 
                           from={{width: 0}}
                           animate={{width: `${score.value}%`}}
                           transition={{duration: 1000, delay: 500 + (idx * 100)}}
                           style={{height: "100%", backgroundColor: score.color, borderRadius: 4}} 
                        />
                     </View>
                  </View>
               ))}
            </View>
          </MotiView>

          {/* PRO PROMPT */}
          <View style={{
              backgroundColor: COLORS.foreground,
              borderRadius: 32,
              padding: 24,
              marginBottom: 30,
              overflow: "hidden"
          }}>
             <LinearGradient 
                colors={[COLORS.primary, "transparent"]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3}}
             />
             <View style={{flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12}}>
                <Feather name="zap" size={24} color="#A78BFA" />
                <Text style={{color: "white", fontSize: 18, fontWeight: "900"}}>PRO Аналитика</Text>
             </View>
             <Text style={{color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 20, marginBottom: 20}}>
                Подпишитесь на PRO, чтобы ИИ составил список подходящих секций в вашем городе и открыл прямой чат с ментором.
             </Text>
             <TouchableOpacity 
                onPress={() => router.push("/parent/subscription" as any)}
                style={{backgroundColor: "white", paddingVertical: 14, borderRadius: 16, alignItems: "center"}}
             >
                <Text style={{color: COLORS.foreground, fontWeight: "900", fontSize: 15}}>ОТКРЫТЬ ВСЕ ВОЗМОЖНОСТИ</Text>
             </TouchableOpacity>
          </View>

          {/* RECOMMENDATION */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: 20,
              borderRadius: 20,
              marginBottom: 40,
            }}
          >
            <Text style={{ fontSize: 15, lineHeight: 20 }}>
              Тебе отлично подойдут направления: программирование, UI/UX,
              робототехника и геймдизайн.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home" as any)}
            style={{
              borderWidth: 2,
              borderColor: "white",
              paddingVertical: 18,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: 1
              }}
            >
              На главную
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
