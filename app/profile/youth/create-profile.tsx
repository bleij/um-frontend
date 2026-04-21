import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

export default function CreateProfileTeen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "male",
    otherInterest: "",
    goals: "",
  });

  const [interests, setInterests] = useState<string[]>([]);

  const availableInterests = [
    "Рисование",
    "Музыка",
    "Спорт",
    "Программирование",
    "Фото/Видео",
    "Чтение",
    "Танцы",
    "Дизайн",
  ];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addOtherInterest = () => {
    if (formData.otherInterest.trim() !== "") {
      setInterests([...interests, formData.otherInterest.trim()]);
      setFormData({ ...formData, otherInterest: "" });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Background Blobs */}
      <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
        <View style={{ 
          position: 'absolute', 
          top: -100, 
          right: -100, 
          width: 400, 
          height: 400, 
          borderRadius: 200, 
          backgroundColor: `${COLORS.primary}08`,
        }} />
        <View style={{ 
          position: 'absolute', 
          top: '40%', 
          left: -150, 
          width: 350, 
          height: 350, 
          borderRadius: 175, 
          backgroundColor: `${COLORS.secondary}05`,
        }} />
        <View style={{ 
          position: 'absolute', 
          bottom: -50, 
          right: -50, 
          width: 300, 
          height: 300, 
          borderRadius: 150, 
          backgroundColor: `${COLORS.accent}05`,
        }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={["top"]} style={{ zIndex: 20 }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: horizontalPadding,
            paddingVertical: 12,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                ...SHADOWS.sm,
              }}
            >
              <Feather name="arrow-left" size={20} color={COLORS.foreground} />
            </TouchableOpacity>
            <Text style={{ 
              fontSize: 22, 
              fontWeight: '900', 
              color: COLORS.foreground,
              letterSpacing: -0.5
            }}>
              Мой профиль
            </Text>
          </View>
        </SafeAreaView>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 8,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", maxWidth: 600, alignSelf: 'center' }}>
            
            {/* Header Text */}
            <View style={{ marginBottom: 32 }}>
               <Text style={{ fontSize: 32, fontWeight: '900', color: COLORS.foreground, letterSpacing: -1 }}>
                 Привет! 👋
               </Text>
               <Text style={{ fontSize: 16, color: COLORS.mutedForeground, marginTop: 4 }}>
                 Давай познакомимся поближе
               </Text>
            </View>

            {/* Personal Info Card */}
            <MotiView
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.primary}10` }]}>
                  <Feather name="user" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.cardTitle}>Личные данные</Text>
              </View>

              <View style={{ gap: 20 }}>
                <View>
                  <Text style={styles.inputLabel}>Имя</Text>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                    placeholder="Твое имя"
                    placeholderTextColor={COLORS.tertiary}
                    style={styles.input}
                  />
                </View>
                
                <View>
                  <Text style={styles.inputLabel}>Фамилия</Text>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                    placeholder="Твоя фамилия"
                    placeholderTextColor={COLORS.tertiary}
                    style={styles.input}
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1.2 }}>
                    <Text style={styles.inputLabel}>Возраст</Text>
                    <TextInput
                      value={formData.age}
                      onChangeText={(text) => setFormData({ ...formData, age: text })}
                      placeholder="16"
                      placeholderTextColor={COLORS.tertiary}
                      keyboardType="numeric"
                      style={[styles.input, { textAlign: 'center' }]}
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.inputLabel}>Пол</Text>
                    <View style={styles.genderContainer}>
                      <TouchableOpacity
                        onPress={() => setFormData({ ...formData, gender: "male" })}
                        style={[
                          styles.genderOption, 
                          formData.gender === "male" && { backgroundColor: COLORS.info }
                        ]}
                      >
                        <Text style={[
                          styles.genderText, 
                          formData.gender === "male" && { color: 'white' }
                        ]}>М</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setFormData({ ...formData, gender: "female" })}
                        style={[
                          styles.genderOption, 
                          formData.gender === "female" && { backgroundColor: '#FF2D55' }
                        ]}
                      >
                        <Text style={[
                          styles.genderText, 
                          formData.gender === "female" && { color: 'white' }
                        ]}>Ж</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </MotiView>

            {/* Interests Card */}
            <MotiView
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ delay: 100 }}
               style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.secondary}10` }]}>
                  <MaterialCommunityIcons name="star-four-points-outline" size={18} color={COLORS.secondary} />
                </View>
                <Text style={styles.cardTitle}>Интересы</Text>
              </View>

              <Text style={{ fontSize: 13, color: COLORS.mutedForeground, marginBottom: 16 }}>
                Выбери сферы, которые тебе наиболее интересны:
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {availableInterests.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      onPress={() => toggleInterest(interest)}
                      activeOpacity={0.7}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                      ]}
                    >
                      <Text style={[
                        styles.chipText,
                        isSelected && { color: 'white' }
                      ]}>{interest}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ marginTop: 24 }}>
                <Text style={styles.inputLabel}>Свой вариант</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TextInput
                    value={formData.otherInterest}
                    onChangeText={(text) => setFormData({ ...formData, otherInterest: text })}
                    placeholder="Напр. Бионика"
                    placeholderTextColor={COLORS.tertiary}
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity
                    onPress={addOtherInterest}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      backgroundColor: COLORS.foreground,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="plus" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Custom Tags */}
              {interests.filter(i => !availableInterests.includes(i)).length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                  {interests
                    .filter((i) => !availableInterests.includes(i))
                    .map((interest) => (
                      <View key={interest} style={styles.tag}>
                        <Text style={styles.tagText}>{interest}</Text>
                        <TouchableOpacity onPress={() => toggleInterest(interest)}>
                          <Feather name="x" size={14} color={COLORS.primary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              )}
            </MotiView>

            {/* Goals Card */}
            <MotiView
               from={{ opacity: 0, translateY: 20 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ delay: 200 }}
               style={styles.card}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${COLORS.accent}15` }]}>
                  <Feather name="target" size={18} color="#FF9500" />
                </View>
                <Text style={styles.cardTitle}>Твои цели</Text>
              </View>
              
              <TextInput
                value={formData.goals}
                onChangeText={(text) => setFormData({ ...formData, goals: text })}
                placeholder="Расскажи, чего ты хочешь достичь в обучении или карьере..."
                placeholderTextColor={COLORS.tertiary}
                multiline
                numberOfLines={4}
                style={[styles.input, { height: 120, textAlignVertical: 'top', paddingTop: 16 }]}
              />
            </MotiView>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => router.push("/profile/youth/testing")}
              activeOpacity={0.8}
              style={{ marginTop: 12 }}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Перейти к тестам</Text>
                <Feather name="arrow-right" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: RADIUS.xxl,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.foreground,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.mutedForeground,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.muted,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  genderContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.muted,
    borderRadius: 18,
    padding: 6,
    height: 56,
  },
  genderOption: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.mutedForeground,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: COLORS.muted,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mutedForeground,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}08`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${COLORS.primary}20`,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 6,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...SHADOWS.md,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  }
});
