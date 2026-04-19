import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { MotiView } from "moti";
import { useDevSettings } from "../../contexts/DevSettingsContext";
import { useOrgProfile, useOrgStats, useOrgSchedule } from "../../hooks/useOrgData";

const QUICK_ACTIONS = [
  { label: "Заявки", icon: "clipboard", route: "/organization/applications", color: '#F59E0B' },
  { label: "Курсы", icon: "book", route: "/organization/courses", color: COLORS.primary },
  { label: "Учителя", icon: "users", route: "/organization/staff", color: '#6366F1' },
  { label: "Группы", icon: "layers", route: "/organization/groups", color: '#10B981' },
];

export default function OrgHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;
  const { orgVerified: isVerified } = useDevSettings();
  const { orgName } = useOrgProfile();
  const { stats } = useOrgStats();
  const todayDow = (new Date().getDay() + 6) % 7; // Mon=0
  const { items: todaySchedule } = useOrgSchedule(todayDow);
  const firstClass = todaySchedule[0] ?? null;

  const STATS_TILES = [
    { label: "Кружков",   value: String(stats.groupCount),   icon: "book-open" as const, color: COLORS.primary },
    { label: "Учеников",  value: String(stats.studentCount), icon: "users" as const,     color: '#10B981' },
    { label: "Заявок",    value: String(stats.pendingCount), icon: "clipboard" as const, color: '#F59E0B' },
    { label: "Учителей",  value: String(stats.staffCount),   icon: "user-check" as const,color: '#6366F1' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* Header - Premium Atmos Aesthetic */}
        <View style={{ backgroundColor: COLORS.primary, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6']}
            style={{ paddingTop: Platform.OS === 'ios' ? 0 : 20 }}
          >
            <SafeAreaView edges={["top"]}>
              <MotiView 
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={{ paddingHorizontal: horizontalPadding, paddingTop: 12, paddingBottom: 32 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <View>
                    <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.light, color: "white", opacity: 0.8 }}>Управление</Text>
                    <Text style={{ fontSize: TYPOGRAPHY.size.xxxl, fontWeight: TYPOGRAPHY.weight.bold, color: "white", letterSpacing: -0.5 }}>{orgName || "Моя организация"}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: RADIUS.lg,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Feather name="settings" size={22} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Sub-header Context Chips */}
                <View className="flex-row items-center justify-between mt-4">
                   <View className="bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
                      <Text className="text-white text-[10px] font-extrabold tracking-widest uppercase">Сеть: 3 филиала</Text>
                   </View>
                   <TouchableOpacity className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center gap-2">
                       <Feather name="trending-up" size={14} color="white" />
                       <Text className="text-white font-bold text-xs">92% посещаемость</Text>
                   </TouchableOpacity>
                </View>
              </MotiView>
            </SafeAreaView>
          </LinearGradient>
        </View>
        {/* Pending verification banner */}
        {!isVerified && (
          <MotiView
            from={{ opacity: 0, translateY: -8 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={{ paddingHorizontal: horizontalPadding, marginTop: 24, marginBottom: 8 }}
          >
            <View style={{
              backgroundColor: '#FEF9C3',
              borderRadius: RADIUS.lg,
              padding: 16,
              borderWidth: 1,
              borderColor: '#FDE047',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <View style={{ width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: '#FDE04730', alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="clock" size={20} color="#854D0E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1C1C1E' }}>Организация на проверке</Text>
                <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Ваша заявка рассматривается администратором. Полный доступ откроется после верификации.</Text>
              </View>
            </View>
          </MotiView>
        )}

        {/* Stats Grid - Horizon Premium style */}
        <View style={{ paddingHorizontal: horizontalPadding, marginTop: 32, opacity: isVerified ? 1 : 0.5 }}>
          <View className="flex-row gap-4 mb-4">
            {STATS_TILES.slice(0, 2).map((stat, idx) => (
              <MotiView
                key={stat.label}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 100 }}
                style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border, padding: 20 }}
              >
                  <View style={{ backgroundColor: stat.color + '10', width: 40, height: 40, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Feather name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.foreground }}>{stat.value}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.mutedForeground, textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</Text>
              </MotiView>
            ))}
          </View>
          <View className="flex-row gap-4 mb-8">
            {STATS_TILES.slice(2, 4).map((stat, idx) => (
              <MotiView
                key={stat.label}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 200 + idx * 100 }}
                style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border, padding: 20 }}
              >
                  <View style={{ backgroundColor: stat.color + '10', width: 40, height: 40, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Feather name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '900', color: COLORS.foreground }}>{stat.value}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.mutedForeground, textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</Text>
              </MotiView>
            ))}
          </View>
        </View>

        {/* Quick Actions - High Fidelity Cards */}
        <View style={{ paddingHorizontal: horizontalPadding, opacity: isVerified ? 1 : 0.5 }}>
          <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 16, paddingLeft: 4 }}>Управление</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            {QUICK_ACTIONS.map((item, idx) => {
              const badge = item.label === "Заявки" ? stats.pendingCount : 0;
              return (
                <MotiView
                  key={item.label}
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 300 + idx * 50 }}
                  style={{
                    ...SHADOWS.strict,
                    flexBasis: isDesktop ? '22%' : '47%',
                    flexGrow: 1,
                    backgroundColor: COLORS.surface,
                    padding: 24,
                    borderRadius: RADIUS.xxl,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Pressable onPress={() => router.push(item.route as any)}>
                    <View style={{ backgroundColor: item.color + '10', width: 48, height: 48, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Feather name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.foreground }}>{item.label}</Text>
                    {badge > 0 && (
                      <View style={{ position: 'absolute', top: -8, right: -8, backgroundColor: COLORS.destructive, borderRadius: 12, minWidth: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', ...SHADOWS.sm }}>
                        <Text className="text-[10px] font-black text-white">{badge}</Text>
                      </View>
                    )}
                  </Pressable>
                </MotiView>
              );
            })}
          </View>

          {/* Schedule Preview Elegant */}
          <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 16, paddingLeft: 4 }}>График на сегодня</Text>
          <View
            style={{ ...SHADOWS.strict, backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: 20, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}
          >
            <View style={{ width: 56, height: 56, backgroundColor: COLORS.muted, borderRadius: RADIUS.xl, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <Feather name="calendar" size={24} color={COLORS.primary} />
            </View>
            {firstClass ? (
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.foreground }}>{firstClass.subject}</Text>
                <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginTop: 2 }}>
                  {firstClass.group_name}{firstClass.room ? ` · ${firstClass.time_label} (${firstClass.room})` : ` · ${firstClass.time_label}`}
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.foreground }}>Нет занятий сегодня</Text>
                <Text style={{ fontSize: 12, color: COLORS.mutedForeground, marginTop: 2 }}>Посмотрите расписание на другой день</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => router.push('/organization/schedule')}>
               <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Finance - Premium System Widget */}
        <View style={{ paddingHorizontal: horizontalPadding }} className="mb-8">
           <View className="flex-row justify-between items-center mb-4 px-1">
              <View className="flex-row items-center gap-2">
                 <Feather name="dollar-sign" size={20} color={'#10B981'} />
                 <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>Финансы и Оплата</Text>
              </View>
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                 <Text className="text-green-600 text-[10px] font-black uppercase">Split payment activo</Text>
              </View>
           </View>

           <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={{ ...SHADOWS.strict, backgroundColor: COLORS.surface, borderRadius: RADIUS.xxl, padding: 24, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 6, borderLeftColor: '#10B981' }}
           >
              <View className="flex-row justify-between items-start mb-6">
                 <View>
                    <Text style={{ fontSize: TYPOGRAPHY.size.huge, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground, letterSpacing: -1 }}>450 000 ₸</Text>
                    <Text style={{ fontSize: 12, color: COLORS.mutedForeground, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 }}>Баланс текущего месяца</Text>
                 </View>
                 <TouchableOpacity className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                    <Feather name="external-link" size={18} color={COLORS.mutedForeground} />
                 </TouchableOpacity>
              </View>

              <View className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 mb-6">
                 <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center gap-2">
                       <View className="w-2 h-2 rounded-full bg-green-500" />
                       <Text className="text-sm font-bold text-gray-700">Ваша доля (90%)</Text>
                    </View>
                    <Text className="text-sm font-black text-gray-900">405 000 ₸</Text>
                 </View>
                 <View className="flex-row justify-between items-center opacity-40">
                    <View className="flex-row items-center gap-2">
                       <View className="w-2 h-2 rounded-full bg-gray-400" />
                       <Text className="text-sm font-medium text-gray-700">Комиссия (10%)</Text>
                    </View>
                    <Text className="text-sm font-bold text-gray-900">-45 000 ₸</Text>
                 </View>
              </View>
              
              <TouchableOpacity className="bg-gray-900 py-4 rounded-2xl items-center shadow-sm">
                 <Text className="text-white font-bold uppercase tracking-widest text-xs">Вывод средств</Text>
              </TouchableOpacity>
           </MotiView>
        </View>

        {/* Creation Center Premium */}
        <View style={{ paddingHorizontal: horizontalPadding }} className="mb-2">
           <Text style={{ fontSize: TYPOGRAPHY.size.lg, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground, marginBottom: 16, paddingLeft: 4 }}>Центр создания</Text>
           <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => router.push('/organization/course/create' as any)}
                activeOpacity={0.9}
                style={{ ...SHADOWS.md, flex: 1, height: 160, backgroundColor: COLORS.primary, borderRadius: RADIUS.xxl, padding: 24, overflow: 'hidden' }}
              >
                 <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                 <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mb-auto border border-white/20">
                    <Feather name="plus-circle" size={24} color="white" />
                 </View>
                 <Text className="text-white font-black text-xl leading-6">Новый курс</Text>
                 <Text className="text-white/60 text-[10px] font-bold uppercase mt-1 tracking-wider">Программа</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/organization/staff/add' as any)}
                activeOpacity={0.9}
                style={{ ...SHADOWS.md, flex: 1, height: 160, backgroundColor: '#8B5CF6', borderRadius: RADIUS.xxl, padding: 24, overflow: 'hidden' }}
              >
                 <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                 <View className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center mb-auto border border-white/20">
                    <Feather name="user-plus" size={24} color="white" />
                 </View>
                 <Text className="text-white font-black text-xl leading-6">Учитель</Text>
                 <Text className="text-white/60 text-[10px] font-bold uppercase mt-1 tracking-wider">Доступ</Text>
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
