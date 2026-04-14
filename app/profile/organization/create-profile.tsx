import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function CreateProfileOrganization() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    description: "",
    capacity: "",
  });

  const handleMockSubmit = () => {
    router.push("/profile/common/done");
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
              Создать профиль организации
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
            {/* Organization Info */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-purple-50">
              <View className="flex-row items-center mb-4">
                <MaterialCommunityIcons
                  name="office-building"
                  size={20}
                  color="#6C5CE7"
                />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Информация об организации
                </Text>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Название организации
                  </Text>
                  <TextInput
                    value={formData.orgName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, orgName: text })
                    }
                    placeholder="Введите название"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Тип организации
                  </Text>
                  <TextInput
                    value={formData.orgType}
                    onChangeText={(text) =>
                      setFormData({ ...formData, orgType: text })
                    }
                    placeholder="Школа, клуб, студия..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Вместимость учеников
                  </Text>
                  <TextInput
                    value={formData.capacity}
                    onChangeText={(text) =>
                      setFormData({ ...formData, capacity: text })
                    }
                    placeholder="Количество мест"
                    keyboardType="numeric"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
              </View>
            </View>

            {/* Contact Person */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-purple-50">
              <View className="flex-row items-center mb-4">
                <Feather name="user" size={20} color="#6C5CE7" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Контактное лицо
                </Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  ФИО представителя
                </Text>
                <TextInput
                  value={formData.contactPerson}
                  onChangeText={(text) =>
                    setFormData({ ...formData, contactPerson: text })
                  }
                  placeholder="Полное имя"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                />
              </View>
            </View>

            {/* Address */}
            <View className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-purple-50">
              <View className="flex-row items-center mb-4">
                <Feather name="map-pin" size={20} color="#6C5CE7" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Локация
                </Text>
              </View>
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Город
                  </Text>
                  <TextInput
                    value={formData.city}
                    onChangeText={(text) =>
                      setFormData({ ...formData, city: text })
                    }
                    placeholder="Алматы"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Адрес
                  </Text>
                  <TextInput
                    value={formData.address}
                    onChangeText={(text) =>
                      setFormData({ ...formData, address: text })
                    }
                    placeholder="Улица, дом, офис"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleMockSubmit}
              className="w-full rounded-xl overflow-hidden shadow-md mt-2"
            >
              <LinearGradient
                colors={["#6C5CE7", "#8B7FE8"]}
                className="w-full py-4 items-center justify-center"
              >
                <Text className="text-white font-bold text-lg">
                  Создать профиль
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
