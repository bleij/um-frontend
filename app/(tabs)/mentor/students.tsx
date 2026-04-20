import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../constants/theme";
import { useMentorStudents } from "../../../hooks/useMentorData";

export default function MentorStudentsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? 40 : 20;

  const { students, loading } = useMentorStudents();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(s => 
    s.student_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStudent = ({ item: student, index }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      style={styles.card}
    >
      {/* Student Info Header */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => router.push(`/(tabs)/mentor/student/${student.id}`)}
        style={styles.cardHeader}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={styles.avatarGradient}>
            <Text style={styles.avatarText}>{student.student_name.charAt(0)}</Text>
          </LinearGradient>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName}>{student.student_name}</Text>
          <Text style={styles.studentAge}>{student.student_age} лет</Text>
          <View style={styles.nextSessionRow}>
             <Feather name="clock" size={14} color={COLORS.mutedForeground} />
             <Text style={styles.nextSessionText}>След. сессия: 15 апр, 14:00</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={COLORS.mutedForeground} />
      </TouchableOpacity>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
         <View style={styles.statBox}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Сессий</Text>
         </View>
         <View style={styles.statBox}>
            <Text style={styles.statValue}>{student.progress}%</Text>
            <Text style={styles.statLabel}>Прогресс</Text>
         </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${student.progress}%` }]} />
      </View>

      {/* Chat Button */}
      <TouchableOpacity 
        style={styles.chatBtn}
        onPress={() => router.push("/(tabs)/chats")}
      >
          <Feather name="message-circle" size={18} color="white" />
          <Text style={styles.chatBtnText}>Перейти в диалог</Text>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F7FF' }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: paddingX, paddingTop: 20, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <View>
                    <Text style={styles.mainTitle}>Мои ученики</Text>
                    <Text style={styles.subtitle}>Сопровождение и прогресс</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <Feather name="filter" size={20} color={COLORS.mutedForeground} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={18} color={COLORS.mutedForeground} />
                <TextInput 
                  placeholder="Поиск ученика..." 
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
            </View>
        </View>

        <FlatList
          data={filteredStudents}
          renderItem={renderStudent}
          contentContainerStyle={{ paddingHorizontal: paddingX, paddingBottom: 100, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
                <MaterialCommunityIcons name="account-search-outline" size={64} color="#E5E7EB" />
                <Text style={{ color: COLORS.mutedForeground, marginTop: 16 }}>Ученики не найдены</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.foreground,
        letterSpacing: -0.5
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.mutedForeground,
        marginTop: 2
    },
    filterBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        ...SHADOWS.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#6C5CE7'
    },
    avatarGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '800',
        color: 'white'
    },
    studentName: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.foreground
    },
    studentAge: {
        fontSize: 14,
        color: COLORS.mutedForeground,
        marginTop: 2
    },
    nextSessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6
    },
    nextSessionText: {
        fontSize: 12,
        color: COLORS.mutedForeground
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16
    },
    statBox: {
        flex: 1,
        backgroundColor: '#F8F7FF',
        borderRadius: 16,
        paddingVertical: 12,
        alignItems: 'center'
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#6C5CE7'
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.mutedForeground,
        marginTop: 2
    },
    progressContainer: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 20
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#6C5CE7',
        borderRadius: 4
    },
    chatBtn: {
        backgroundColor: '#6C5CE7',
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...SHADOWS.sm
    },
    chatBtnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700'
    }
});
