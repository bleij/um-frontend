import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LAYOUT } from "../../../constants/theme";
import { useParentData } from "../../../contexts/ParentDataContext";

export default function CreateProfileChild() {
  const router = useRouter();
  const { addChild } = useParentData();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;
  const [formData, setFormData] = useState({
    firstName: "",
    age: "",
    gender: "boy",
    otherInterest: "",
    goals: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const ageNum = parseInt(formData.age) || 8;
      
      await addChild({
        id: `child_${Date.now()}`,
        name: formData.firstName.trim(),
        age: ageNum,
        interests: interests,
        ageCategory: ageNum < 12 ? "child" : "teen",
        parentId: "pending"
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#FDF2F8", "#FAF5FF"]} style={{ flex: 1 }}>
        <LinearGradient
          colors={["#6C5CE7", "#8B7FE8"]}
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
            <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
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

                <View className="flex-row">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Возраст</Text>
                    <TextInput
                      value={formData.age}
                      onChangeText={(text) => setFormData({ ...formData, age: text })}
                      placeholder="8"
                      keyboardType="numeric"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-center"
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Text className="text-sm font-medium text-gray-700 mb-1">Пол</Text>
                    <View className="flex-row rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-[50px]">
                      <TouchableOpacity
                        onPress={() => setFormData({ ...formData, gender: "boy" })}
                        className={`flex-1 justify-center items-center ${formData.gender === "boy" ? "bg-pink-500" : ""}`}
                      >
                        <Text className={formData.gender === "boy" ? "text-white font-medium" : "text-gray-500"}>М</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setFormData({ ...formData, gender: "girl" })}
                        className={`flex-1 justify-center items-center ${formData.gender === "girl" ? "bg-pink-500" : ""}`}
                      >
                        <Text className={formData.gender === "girl" ? "text-white font-medium" : "text-gray-500"}>Д</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-pink-50">
              <View className="flex-row items-center mb-4">
                <Feather name="heart" size={20} color="#8B7FE8" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">Интересы</Text>
              </View>
              <View className="flex-row flex-wrap justify-between">
                {availableInterests.map((interest) => {
                  const isSelected = interests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      onPress={() => toggleInterest(interest)}
                      className={`w-[48%] py-3 px-2 rounded-xl border-2 mb-3 items-center ${isSelected ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-gray-50"}`}
                    >
                      <Text className={`font-medium ${isSelected ? "text-pink-700" : "text-gray-600"}`}>{interest}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity 
                onPress={handleNext} 
                disabled={isSubmitting} 
                className={`w-full py-4 rounded-xl items-center justify-center bg-primary ${isSubmitting ? "opacity-50" : ""}`}
            >
                <Text className="text-white font-bold text-lg">{isSubmitting ? "Сохранение..." : "Продолжить"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
