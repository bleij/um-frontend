import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useParentData } from "../../contexts/ParentDataContext";

export default function ParentChildren() {
  const router = useRouter();
  const { childrenProfile: children } = useParentData();

  return (
    <View style={{ flex: 1, backgroundColor: "#6C5CE7" }}>
      <LinearGradient
        colors={["#6C5CE7", "#8B7FE8"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
        }}
      />

      <SafeAreaView edges={["top"]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginRight: 8 }}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
            Мои дети
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Add Button */}
        <TouchableOpacity
          onPress={() =>
            router.push("/profile/youth/create-profile-child" as any)
          }
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 24,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 10,
          }}
        >
          <Feather name="plus" size={24} color="#6C5CE7" />
          <Text
            style={{
              color: "#6C5CE7",
              fontWeight: "700",
              fontSize: 16,
              marginLeft: 10,
            }}
          >
            Добавить ребенка
          </Text>
        </TouchableOpacity>

        {/* Children List */}
        {children.length === 0 ? (
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 24,
              padding: 30,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: 16, fontWeight: "500" }}>
              Дети пока не добавлены
            </Text>
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Нажмите кнопку выше, чтобы создать профиль для вашего ребенка
            </Text>
          </View>
        ) : (
          children.map((child, index) => (
            <TouchableOpacity
              key={child.id || index}
              onPress={() => router.push(`/parent/child/${child.id}` as any)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 24,
                padding: 20,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "#6C5CE7",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 24, fontWeight: "800" }}
                >
                  {(child.name || "").charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}
                >
                  {child.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                  {child.ageCategory === "child"
                    ? "Ребенок (6-11 лет)"
                    : child.ageCategory === "teen"
                      ? "Подросток (12-17 лет)"
                      : "Студент (18-20 лет)"}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#6C5CE7",
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#6C5CE7",
                      fontWeight: "600",
                    }}
                  >
                    Активен
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={24} color="#6C5CE7" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
