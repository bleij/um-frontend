import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SideNav } from "@/app/(tabs)/layout-container";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { useParentData } from "../../../contexts/ParentDataContext";
import { formatPhone } from "../../../lib/formatPhone";

// Age options from 6 to 20
const AGE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 6);

export default function CreateProfileChild() {
  const router = useRouter();
  const { addChild } = useParentData();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;
  const [formData, setFormData] = useState({
    firstName: "",
    age: 0,
    gender: "boy",
    phone: "",
    otherInterest: "",
    goals: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);

  const availableInterests = [
    "Рисование",
    "Музыка",
    "Математика",
    "Спорт",
    "Чтение",
    "Конструкторы",
    "Игры",
    "Языки",
  ];

  const handleNext = async () => {
    if (!formData.firstName.trim()) {
      alert("Пожалуйста, введите имя ребенка");
      return;
    }

    setIsSubmitting(true);
    try {
      const ageNum = formData.age || 8;

      await addChild({
        id: `child_${Date.now()}`,
        name: formData.firstName.trim(),
        age: ageNum,
        phone: formData.phone.trim() || undefined,
        interests: interests,
        ageCategory: ageNum < 12 ? "child" : "teen",
        parentId: "pending",
        goals: formData.goals.trim() || undefined,
      });

      router.push("/profile/youth/umo-intro");
    } catch (error) {
      console.error("Error adding child:", error);
      alert("Произошла ошибка при сохранении профиля");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/register");
  };

  const pageContent = (
    <LinearGradient colors={["#FDF2F8", "#FAF5FF"]} style={{ flex: 1 }}>
      <LinearGradient
        colors={COLORS.gradients.header as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-4 shadow-sm z-10 rounded-b-3xl"
      >
        <SafeAreaView
          edges={["top"]}
          style={{
            width: "100%",
            maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: horizontalPadding,
          }}
        >
          <TouchableOpacity onPress={handleBack} className="p-2 mr-2">
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">
            Создать профиль ребенка
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: 60,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined }}>
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-pink-50">
            <View className="flex-row items-center mb-4">
              <Feather name="user" size={20} color="#8B7FE8" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">О ребенке</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Имя</Text>
                <TextInput
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  placeholder="Как зовут ребенка?"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Телефон (необязательно)</Text>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: formatPhone(text) })}
                  placeholder="+7 777 777 7777"
                  keyboardType="phone-pad"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                />
                <Text className="text-[10px] text-gray-400 mt-1 ml-1">Если нет номера, ребенок сможет зайти по QR коду</Text>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Возраст ребенка</Text>
                <TouchableOpacity
                  onPress={() => setShowAgePicker(true)}
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: formData.age ? COLORS.foreground : '#9CA3AF', fontSize: 15 }}>
                    {formData.age ? `${formData.age} лет` : 'Выберите возраст'}
                  </Text>
                  <Feather name="chevron-down" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">Пол</Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, gender: "boy" })}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: formData.gender === "boy" ? '#6C5CE7' : '#E5E7EB',
                      backgroundColor: formData.gender === "boy" ? '#F3F0FF' : '#F9FAFB',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: formData.gender === "boy" ? '#6C5CE7' : '#6B7280', fontWeight: '600' }}>Мальчик</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, gender: "girl" })}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: formData.gender === "girl" ? '#6C5CE7' : '#E5E7EB',
                      backgroundColor: formData.gender === "girl" ? '#F3F0FF' : '#F9FAFB',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: formData.gender === "girl" ? '#6C5CE7' : '#6B7280', fontWeight: '600' }}>Девочка</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-pink-50">
            <View className="flex-row items-center mb-2">
              <Feather name="heart" size={20} color="#8B7FE8" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">Интересы</Text>
            </View>
            <Text className="text-xs text-gray-400 mb-4">Что нравится вашему ребенку?</Text>
            <View className="flex-row flex-wrap justify-between">
              {availableInterests.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={{
                      width: '48%',
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? '#6C5CE7' : '#E5E7EB',
                      backgroundColor: isSelected ? '#F3F0FF' : '#F9FAFB',
                      marginBottom: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontWeight: '500', color: isSelected ? '#6C5CE7' : '#6B7280' }}>{interest}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom interest input */}
            <Text className="text-xs text-gray-500 mt-2 mb-2">Другие интересы:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                value={formData.otherInterest}
                onChangeText={(text) => setFormData({ ...formData, otherInterest: text })}
                placeholder="Введите интерес ребенка"
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  padding: 12,
                  fontSize: 14,
                }}
              />
              <TouchableOpacity
                onPress={addOtherInterest}
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#6C5CE7',
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Goals Section */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-pink-50">
            <View className="flex-row items-center mb-2">
              <Feather name="target" size={20} color="#8B7FE8" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">Твоя цель</Text>
            </View>
            <Text className="text-xs text-gray-400 mb-3">Чему ваш ребенок хочет научиться?</Text>
            <TextInput
              value={formData.goals}
              onChangeText={(text) => setFormData({ ...formData, goals: text })}
              placeholder="Например: научиться программировать, стать лучше в математике..."
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                padding: 14,
                fontSize: 14,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
          </View>

        </View>

        {/* Age Picker Modal */}
        <Modal visible={showAgePicker} transparent animationType="slide">
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
            onPress={() => setShowAgePicker(false)}
          >
            <Pressable
              style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '50%' }}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.foreground }}>Выберите возраст</Text>
                <TouchableOpacity onPress={() => setShowAgePicker(false)}>
                  <Feather name="x" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {AGE_OPTIONS.map((age) => (
                  <TouchableOpacity
                    key={age}
                    onPress={() => {
                      setFormData({ ...formData, age });
                      setShowAgePicker(false);
                    }}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: formData.age === age ? '#F3F0FF' : 'transparent',
                      marginBottom: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      fontWeight: formData.age === age ? '700' : '400',
                      color: formData.age === age ? '#6C5CE7' : COLORS.foreground
                    }}>
                      {age} лет
                    </Text>
                    {formData.age === age && (
                      <Feather name="check" size={20} color="#6C5CE7" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>

      {/* Fixed Footer for Button */}
      <View
        className="p-6 bg-white border-t border-gray-100 shadow-lg"
        style={{ width: "100%", maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined, alignSelf: "center", borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
      >
        <TouchableOpacity
            onPress={handleNext}
            disabled={isSubmitting}
            activeOpacity={0.8}
            style={{ overflow: 'hidden', borderRadius: 20 }}
        >
          <LinearGradient
            colors={COLORS.gradients.header as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 18, alignItems: "center", justifyContent: "center" }}
          >
            <Text className="text-white font-black text-lg uppercase tracking-wider">
              {isSubmitting ? "Сохранение..." : "Добавить ребенка"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <SideNav role={(user?.role as any) || "parent"} />
        <View style={{ flex: 1 }}>{pageContent}</View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {pageContent}
    </KeyboardAvoidingView>
  );
}
