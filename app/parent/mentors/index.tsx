import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

interface Mentor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  students: number;
  avatar: string;
  tags: string[];
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: "1",
    name: "Алексей Смирнов",
    specialization: "IT Разработчик, Математика",
    rating: 4.9,
    students: 12,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    tags: ["программирование", "робототехника", "логика"],
  },
  {
    id: "2",
    name: "Елена Чернова",
    specialization: "Арт-директор, Психолог",
    rating: 4.8,
    students: 15,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    tags: ["живопись", "эмоциональный интеллект", "социум"],
  },
  {
    id: "3",
    name: "Тимур Аскаров",
    specialization: "Инженер, Шахматист",
    rating: 5.0,
    students: 8,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    tags: ["стратегия", "математика", "изобретения"],
  },
];

export default function ParentMentorsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [mentors] = useState<Mentor[]>(MOCK_MENTORS);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md }}>
               <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                  <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                    <Feather name="arrow-left" size={20} color="white" />
                  </TouchableOpacity>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white" }}>Выбор Ментора</Text>
               </View>
               <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 20 }}>
                  Выберите наставника-сопровождающего, который поможет раскрыть потенциал вашего ребенка и будет отслеживать его прогресс.
               </Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: SPACING.xl,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
         <View style={{ gap: SPACING.lg }}>
            {mentors.map((mentor, idx) => (
              <MotiView
                key={mentor.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: idx * 100 }}
              >
                 <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: 32, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
                       <Image source={{ uri: mentor.avatar }} style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: COLORS.muted }} />
                       <View style={{ flex: 1, justifyContent: 'center' }}>
                          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.foreground, marginBottom: 4 }}>{mentor.name}</Text>
                          <Text style={{ fontSize: 12, color: COLORS.mutedForeground, fontWeight: '600', marginBottom: 8 }}>{mentor.specialization}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Feather name="star" size={12} color="#F59E0B" />
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.foreground }}>{mentor.rating}</Text>
                             </View>
                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <Feather name="users" size={12} color={COLORS.mutedForeground} />
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: COLORS.foreground }}>{mentor.students} учеников</Text>
                             </View>
                          </View>
                       </View>
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                       {mentor.tags.map(tag => (
                          <View key={tag} style={{ backgroundColor: 'rgba(108, 92, 231, 0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                             <Text style={{ color: COLORS.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>#{tag}</Text>
                          </View>
                       ))}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                       <TouchableOpacity style={{ flex: 1, height: 48, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border }}>
                          <Text style={{ color: COLORS.foreground, fontWeight: TYPOGRAPHY.weight.bold, fontSize: 13 }}>ПРОФИЛЬ</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{ flex: 1.5, height: 48, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md }}>
                          <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 13 }}>ВЫБРАТЬ</Text>
                       </TouchableOpacity>
                    </View>
                 </View>
              </MotiView>
            ))}
         </View>
      </ScrollView>
    </View>
  );
}
