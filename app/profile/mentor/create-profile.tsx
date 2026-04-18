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
import { useAuth } from "../../../contexts/AuthContext";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";

export default function MentorCreateProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    education: "",
    specialization: "",
    experience: "",
    expertise: "",
    description: "",
    workload: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMockSubmit = async () => {
    setError(null);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    if (!fullName) { setError("Укажите имя и фамилию."); return; }
    if (!formData.specialization.trim()) { setError("Укажите специализацию."); return; }

    setSubmitting(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const { error: insertErr } = await supabase.from("mentor_applications").insert({
          user_id: user?.id ?? null,
          name: fullName,
          specialization: formData.specialization.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || user?.phone || null,
          experience: formData.experience.trim() || null,
          education: formData.education.trim() || null,
          bio: formData.description.trim() || null,
          expertise: formData.expertise.trim() || null,
          workload: formData.workload.trim() || null,
          status: "pending",
        });
        if (insertErr) {
          setError(insertErr.message);
          setSubmitting(false);
          return;
        }
      }
      router.push("/profile/common/done");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#F8F7FF", "#EDE9FE"]} style={{ flex: 1 }}>
        {/* Header */}
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
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 mr-2"
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">
              Создать профиль ментора
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
          <View
            style={{
              width: "100%",
              maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined,
            }}
          >
            {/* Personal Info */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <Feather name="user" size={20} color="#6C5CE7" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Личная информация
                </Text>
              </View>

              <View className="flex-row justify-between mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </Text>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, firstName: text })
                    }
                    placeholder="Имя"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Фамилия
                  </Text>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, lastName: text })
                    }
                    placeholder="Фамилия"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
              </View>
            </View>

            {/* Contact Info */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <Feather name="mail" size={20} color="#6C5CE7" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Контакты
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Email
                  </Text>
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    placeholder="mentor@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </Text>
                  <TextInput
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData({ ...formData, phone: text })
                    }
                    placeholder="+7 (___) ___-__-__"
                    keyboardType="phone-pad"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
              </View>
            </View>

            {/* Professional Info */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <Feather name="briefcase" size={20} color="#6C5CE7" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Профессиональная информация
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Специализация
                  </Text>
                  <TextInput
                    value={formData.specialization}
                    onChangeText={(text) =>
                      setFormData({ ...formData, specialization: text })
                    }
                    placeholder="Например: Программирование"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Опыт работы (лет)
                  </Text>
                  <TextInput
                    value={formData.experience}
                    onChangeText={(text) =>
                      setFormData({ ...formData, experience: text })
                    }
                    placeholder="Например: 5"
                    keyboardType="numeric"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    О себе
                  </Text>
                  <TextInput
                    value={formData.description}
                    onChangeText={(text) =>
                      setFormData({ ...formData, description: text })
                    }
                    placeholder="Коротко о себе и опыте"
                    multiline
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 h-24"
                    textAlignVertical="top"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Рабочая нагрузка
                  </Text>
                  <TextInput
                    value={formData.workload}
                    onChangeText={(text) =>
                      setFormData({ ...formData, workload: text })
                    }
                    placeholder="Например: Готов брать до 5 детей в месяц, свободен по будням вечером"
                    multiline
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 h-20"
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>

            {error && (
              <Text className="text-red-600 text-sm mb-3 text-center">{error}</Text>
            )}
            <TouchableOpacity
              onPress={handleMockSubmit}
              disabled={submitting}
              className="w-full rounded-xl overflow-hidden shadow-md mt-2"
              style={{ opacity: submitting ? 0.6 : 1 }}
            >
              <LinearGradient
                colors={["#6C5CE7", "#8B7FE8"]}
                className="w-full py-4 items-center justify-center"
              >
                <Text className="text-white font-bold text-lg">
                  {submitting ? "Отправка..." : "Отправить заявку"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
