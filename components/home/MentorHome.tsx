import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS, TYPOGRAPHY, SPACING, RADIUS } from "../../constants/theme";

const MOCK_STUDENTS = [
  {
    id: "1",
    name: "Анна Петрова",
    age: 8,
    level: 5,
    xp: 1250,
    progress: 85,
    skills: { com: 85, lead: 65, cre: 90, log: 75, dis: 70 },
  },
  {
    id: "2",
    name: "Максим Иванов",
    age: 12,
    level: 8,
    xp: 2450,
    progress: 78,
    skills: { com: 78, lead: 65, cre: 85, log: 80, dis: 72 },
  },
];

const SKILL_LABELS = ["Ком.", "Лид.", "Кре.", "Лог.", "Дис."];

export default function MentorHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* Header - Restored Violet Aesthetic */}
        <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
          <LinearGradient 
            colors={COLORS.gradients.header as any}
            style={{ paddingTop: Platform.OS === 'ios' ? 0 : 20 }}
          >
            <SafeAreaView edges={["top"]}>
              <MotiView 
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md, paddingBottom: SPACING.xl, marginBottom: SPACING.xl }}
              >
                <View className="flex-row items-center justify-between mb-2">
                   <View>
                      <Text style={{ 
                        fontSize: TYPOGRAPHY.size.xxl, 
                        fontWeight: TYPOGRAPHY.weight.light, 
                        color: COLORS.white, 
                        letterSpacing: TYPOGRAPHY.letterSpacing.tight 
                      }}>Привет,</Text>
                      <Text style={{ 
                        fontSize: TYPOGRAPHY.size.xxxl, 
                        fontWeight: TYPOGRAPHY.weight.semibold, 
                        color: COLORS.white, 
                        letterSpacing: TYPOGRAPHY.letterSpacing.tight,
                        marginTop: -SPACING.xs 
                      }}>Анна Сергеевна! 👋</Text>
                   </View>
                   <TouchableOpacity 
                     style={{ 
                        width: 52, 
                        height: 52, 
                        borderRadius: RADIUS.lg, 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.3)'
                     }}
                   >
                      <Feather name="bell" size={22} color={COLORS.white} />
                      <View 
                        style={{ 
                          position: "absolute", 
                          top: 14, 
                          right: 14, 
                          width: 10, 
                          height: 10, 
                          backgroundColor: COLORS.destructive, 
                          borderRadius: 5,
                          borderWidth: 1.5,
                          borderColor: 'rgba(255,255,255,0.4)'
                        }} 
                      />
                   </TouchableOpacity>
                </View>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: TYPOGRAPHY.size.sm, 
                  fontWeight: TYPOGRAPHY.weight.medium,
                  marginTop: SPACING.xs 
                }}>Ожидается 4 занятия • Среда, 16 апр</Text>
              </MotiView>
            </SafeAreaView>
          </LinearGradient>
        </View>

        <View style={{ height: SPACING.xl }} />

        {/* Next Lesson Card - Squircle Aesthetic */}
        <View style={{ paddingHorizontal: paddingX }} className="mb-8">
           <View className="flex-row justify-between items-end mb-4 px-1">
              <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Ближайшее занятие</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/mentor/schedule" as any)}>
                 <Text style={{ color: COLORS.info, fontWeight: TYPOGRAPHY.weight.semibold, fontSize: TYPOGRAPHY.size.sm }}>См. всё</Text>
              </TouchableOpacity>
           </View>
           
           <MotiView
              from={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 500, delay: 100 }}
              style={{ 
                ...SHADOWS.strict,
                borderRadius: RADIUS.xxl,
                overflow: 'hidden',
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.03)'
              }}
           >
              <LinearGradient 
                colors={COLORS.gradients.primary as any} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 1}} 
                style={{ padding: SPACING.xl }}
              >
                 <View className="flex-row justify-between items-start mb-8">
                    <View className="bg-white/20 px-4 py-2 rounded-full border border-white/30 backdrop-blur-md">
                       <Text className="text-white text-[10px] font-extrabold tracking-widest uppercase">Live • через 15 мин</Text>
                    </View>
                    <View className="bg-white/20 p-3 rounded-full border border-white/30">
                        <Feather name="zap" size={20} color="white" />
                    </View>
                 </View>
                 <Text style={{ 
                   fontSize: TYPOGRAPHY.size.huge, 
                   fontWeight: TYPOGRAPHY.weight.bold, 
                   color: COLORS.white, 
                   marginBottom: SPACING.xs, 
                   letterSpacing: TYPOGRAPHY.letterSpacing.tight 
                 }}>Робототехника</Text>
                 <View className="flex-row items-center mb-8 opacity-90">
                    <Feather name="map-pin" size={14} color="white" />
                    <Text className="text-white text-md font-medium ml-2">Старшая группа A • Каб. 204</Text>
                 </View>
                 
                 <TouchableOpacity 
                    activeOpacity={0.9}
                    style={{
                        backgroundColor: COLORS.white,
                        height: 60,
                        borderRadius: RADIUS.full,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...SHADOWS.md
                    }}
                    onPress={() => router.push("/mentor/group/1" as any)}
                 >
                    <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.bold, fontSize: TYPOGRAPHY.size.lg }}>Начать занятие</Text>
                 </TouchableOpacity>
              </LinearGradient>
           </MotiView>
        </View>

        {/* My Students - High Fidelity Cards */}
        <View style={{ paddingHorizontal: paddingX }} className="mb-8">
            <View className="flex-row justify-between items-center mb-5 px-1">
                <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Мои ученики</Text>
                <TouchableOpacity className="w-11 h-11 items-center justify-center bg-muted rounded-full">
                    <Feather name="filter" size={18} color={COLORS.mutedForeground} />
                </TouchableOpacity>
            </View>

            <View className="gap-5">
                {MOCK_STUDENTS.map((student, idx) => (
                    <MotiView 
                        key={student.id}
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 500, delay: 200 + idx * 100 }}
                        style={{ 
                            ...SHADOWS.strict,
                            borderRadius: RADIUS.xxl,
                            backgroundColor: COLORS.surface,
                            padding: SPACING.xl,
                            borderWidth: 1,
                            borderColor: COLORS.border,
                            overflow: 'hidden'
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push(`/(tabs)/mentor/student/${student.id}` as any)}
                        >
                            <View className="flex-row items-center gap-5 mb-6">
                                <View style={{ width: 68, height: 68, borderRadius: RADIUS.xl, overflow: 'hidden' }}>
                                   <LinearGradient colors={COLORS.gradients.surface as any} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                      <Text style={{ fontSize: 28, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{student.name.charAt(0)}</Text>
                                   </LinearGradient>
                                </View>
                                <View className="flex-1">
                                    <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, letterSpacing: TYPOGRAPHY.letterSpacing.tight }}>{student.name}</Text>
                                    <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, marginTop: 4 }}>{student.age} лет • Уровень {student.level}</Text>
                                </View>
                                <View style={{ backgroundColor: COLORS.primary + '10', paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full }}>
                                    <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{student.progress}%</Text>
                                </View>
                            </View>

                            {/* Indicators */}
                            <View className="flex-row gap-3 mb-6">
                                {Object.values(student.skills).map((val, i) => (
                                    <View key={i} className="flex-1">
                                        <View style={{ height: 60, backgroundColor: COLORS.muted, borderRadius: RADIUS.md, justifyContent: 'flex-end', overflow: 'hidden' }}>
                                            <LinearGradient
                                                colors={COLORS.gradients.primary as any}
                                                style={{ height: `${val}%` }}
                                            />
                                        </View>
                                        <Text style={{ fontSize: 9, color: COLORS.mutedForeground, fontWeight: '700', textAlign: 'center', marginTop: 8, textTransform: 'uppercase' }}>{SKILL_LABELS[i]}</Text>
                                    </View>
                                ))}
                            </View>

                            <View className="flex-row gap-4">
                                <TouchableOpacity 
                                    onPress={() => router.push("/(tabs)/mentor/learning-path" as any)}
                                    style={{ 
                                        flex: 1, 
                                        height: 52, 
                                        backgroundColor: COLORS.muted, 
                                        borderRadius: RADIUS.full, 
                                        flexDirection: 'row', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        gap: 8
                                    }}
                                >
                                    <Feather name="zap" size={16} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.primary, fontWeight: TYPOGRAPHY.weight.semibold, fontSize: TYPOGRAPHY.size.sm }}>Анализ роста</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => router.push("/(tabs)/chats" as any)}
                                    style={{ 
                                        width: 52, 
                                        height: 52, 
                                        backgroundColor: COLORS.muted, 
                                        borderRadius: RADIUS.full, 
                                        alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}
                                >
                                    <Feather name="message-square" size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </MotiView>
                ))}
            </View>
        </View>

        {/* Quick Tools */}
        <View style={{ paddingHorizontal: paddingX }}>
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: SPACING.xl }}>Инструменты</Text>
           <View className="flex-row flex-wrap gap-4">
              {[
                 { icon: 'users', label: 'Группы', color: COLORS.primary, route: '/(tabs)/mentor/groups' },
                 { icon: 'calendar', label: 'График', color: COLORS.success, route: '/(tabs)/mentor/attendance' },
                 { icon: 'target', label: 'Цели', color: COLORS.warning, route: '/(tabs)/mentor/awards' },
                 { icon: 'book', label: 'База', color: COLORS.info, route: '/(tabs)/mentor/library' },
              ].map((action, idx) => (
                 <MotiView
                    key={idx}
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 400, delay: 400 + idx * 50 }}
                    style={{ 
                        width: (width - paddingX*2 - SPACING.lg) / 2,
                        ...SHADOWS.strict,
                        borderRadius: RADIUS.xxl,
                        backgroundColor: COLORS.surface,
                        padding: SPACING.xl,
                        borderWidth: 1,
                        borderColor: COLORS.border
                    }}
                 >
                    <TouchableOpacity 
                        onPress={() => router.push(action.route as any)}
                        className="items-center justify-center flex-1"
                    >
                        <View style={{ backgroundColor: action.color + '10', width: 56, height: 56, borderRadius: RADIUS.full, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                           <Feather name={action.icon as any} size={24} color={action.color} />
                        </View>
                        <Text style={{ fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{action.label}</Text>
                    </TouchableOpacity>
                 </MotiView>
              ))}
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
