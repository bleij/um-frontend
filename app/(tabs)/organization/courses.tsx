import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

const COURSES = [
  { id: "1", name: "Робототехника", students: 18, age: "6-11", price: 25000, status: "active", icon: "cpu" },
  { id: "2", name: "Программирование", students: 15, age: "12-17", price: 30000, status: "active", icon: "code" },
  { id: "3", name: "Шахматы", students: 20, age: "6-14", price: 15000, status: "active", icon: "target" },
  { id: "4", name: "Арт-студия", students: 12, age: "9-16", price: 20000, status: "paused", icon: "edit-3" },
];

export default function OrgCourses() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;
  
  const [search, setSearch] = useState("");
  const filtered = COURSES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Unified Brand Style */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <View style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xl }}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.md,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SPACING.md,
                  }}
                >
                  <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white", flex: 1 }}>Курсы</Text>
                <TouchableOpacity
                  onPress={() => router.push("/organization/course/create" as any)}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    paddingHorizontal: SPACING.lg,
                    height: 44,
                    borderRadius: RADIUS.md,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: TYPOGRAPHY.weight.bold, fontSize: 13 }}>+ Добавить</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: RADIUS.lg, paddingHorizontal: SPACING.lg, height: 52, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                 <Feather name="search" size={18} color="rgba(255,255,255,0.6)" style={{ marginRight: SPACING.sm }} />
                 <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Поиск курса..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={{ color: "white", flex: 1, fontSize: 16, fontWeight: TYPOGRAPHY.weight.medium }}
                 />
              </View>
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
         {/* Summary Row */}
         <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xxl }}>
            <View style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.white, padding: SPACING.xl, borderRadius: RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border }}>
               <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{COURSES.length}</Text>
               <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Курсов</Text>
            </View>
            <View style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.white, padding: SPACING.xl, borderRadius: RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border }}>
               <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>{COURSES.reduce((s,c)=>s+c.students, 0)}</Text>
               <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Учеников</Text>
            </View>
         </View>

         {/* Courses List */}
         <View style={{ gap: SPACING.lg }}>
            {filtered.map((course, idx) => (
               <MotiView
                  key={course.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: idx * 100 }}
               >
                  <TouchableOpacity
                     onPress={() => router.push(`/organization/course/${course.id}` as any)}
                     style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: 40, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' }}
                  >
                     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.lg }}>
                           <View style={{ width: 56, height: 56, borderRadius: RADIUS.xl, backgroundColor: 'rgba(108, 92, 231, 0.05)', alignItems: 'center', justifyContent: 'center' }}>
                              <Feather name={course.icon as any} size={28} color={COLORS.primary} />
                           </View>
                           <View>
                              <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{course.name}</Text>
                              <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.medium }}>{course.age} лет</Text>
                           </View>
                        </View>
                        <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.lg, backgroundColor: course.status === 'active' ? 'rgba(52, 199, 89, 0.1)' : COLORS.background }}>
                           <Text style={{ fontSize: 10, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, color: course.status === 'active' ? COLORS.success : COLORS.mutedForeground }}>
                              {course.status === 'active' ? 'Активен' : 'Пауза'}
                           </Text>
                        </View>
                     </View>

                     <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <View>
                           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <Feather name="users" size={14} color={COLORS.mutedForeground} />
                              <Text style={{ fontSize: TYPOGRAPHY.size.xs, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.mutedForeground }}>{course.students} учеников</Text>
                           </View>
                           <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>{course.price.toLocaleString()} ₸/МЕС</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                           <TouchableOpacity style={{ width: 44, height: 44, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center' }}>
                              <Feather name="edit-2" size={16} color={COLORS.mutedForeground} />
                           </TouchableOpacity>
                           <View style={{ width: 44, height: 44, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', ...SHADOWS.md }}>
                              <Feather name="chevron-right" size={20} color="white" />
                           </View>
                        </View>
                     </View>
                  </TouchableOpacity>
               </MotiView>
            ))}
         </View>
      </ScrollView>
    </View>
  );
}
