import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../constants/theme";
import { useParentData } from "../../contexts/ParentDataContext";
import { Child } from "../../models/types";

function EditChildModal({
  child,
  onSave,
  onClose,
}: {
  child: Child;
  onSave: (patch: Partial<Child>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(String(child.age ?? ""));
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  const handleSave = () => {
    const parsed = parseInt(age, 10);
    const ageCategory: Child["ageCategory"] =
      parsed <= 11 ? "child" : parsed <= 17 ? "teen" : "young-adult";
    onSave({ name: name.trim() || child.name, age: Number.isFinite(parsed) ? parsed : child.age, ageCategory });
    onClose();
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: isDesktop ? 400 : "90%",
            backgroundColor: COLORS.card,
            borderRadius: RADIUS.lg,
            padding: 24,
            ...SHADOWS.lg,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.foreground }}>Редактировать профиль</Text>
            <Pressable onPress={onClose}>
              <Feather name="x" size={22} color={COLORS.mutedForeground} />
            </Pressable>
          </View>

          <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.mutedForeground, marginBottom: 6 }}>Имя</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
              padding: SPACING.md, marginBottom: 16, fontSize: 15, color: COLORS.foreground,
              backgroundColor: COLORS.background,
            }}
            placeholder="Имя ребёнка"
          />

          <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.mutedForeground, marginBottom: 6 }}>Возраст</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={{
              borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
              padding: SPACING.md, marginBottom: 24, fontSize: 15, color: COLORS.foreground,
              backgroundColor: COLORS.background,
            }}
            placeholder="Возраст"
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, padding: 14, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" }}
            >
              <Text style={{ color: COLORS.foreground, fontWeight: "600" }}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={{ flex: 1, padding: 14, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: "center" }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ParentChildren() {
  const router = useRouter();
  const { childrenProfile: children, removeChild, updateChild } = useParentData();
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const confirmRemove = (child: Child) => {
    if (Platform.OS === "web") {
      // eslint-disable-next-line no-alert
      if (window.confirm(`Удалить профиль "${child.name}"? Это действие нельзя отменить.`)) {
        removeChild(child.id);
      }
    } else {
      Alert.alert(
        "Удалить ребёнка?",
        `Профиль "${child.name}" будет удалён. Это действие нельзя отменить.`,
        [
          { text: "Отмена", style: "cancel" },
          { text: "Удалить", style: "destructive", onPress: () => removeChild(child.id) },
        ],
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#4F46E5" }}>
      <LinearGradient
        colors={COLORS.gradients.header as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%" }}
      />

      <SafeAreaView edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>Мои дети</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Add Button */}
        <TouchableOpacity
          onPress={() => router.push("/profile/youth/create-profile-child" as any)}
          style={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10,
          }}
        >
          <Feather name="plus" size={24} color="#6C5CE7" />
          <Text style={{ color: "#6C5CE7", fontWeight: "700", fontSize: 16, marginLeft: 10 }}>
            Добавить ребенка
          </Text>
        </TouchableOpacity>

        {/* Children List */}
        {children.length === 0 ? (
          <View style={{ backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 24, padding: 30, alignItems: "center" }}>
            <Text style={{ color: "#6B7280", fontSize: 16, fontWeight: "500" }}>Дети пока не добавлены</Text>
            <Text style={{ color: "#9CA3AF", fontSize: 13, marginTop: 8, textAlign: "center" }}>
              Нажмите кнопку выше, чтобы создать профиль для вашего ребенка
            </Text>
          </View>
        ) : (
          children.map((child, index) => (
            <View
              key={child.id || index}
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 24,
                marginBottom: 12,
                shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10,
                overflow: "hidden",
              }}
            >
              {/* Main row */}
              <TouchableOpacity
                onPress={() => router.push(`/(tabs)/parent/child/${child.id}` as any)}
                style={{ padding: 20, flexDirection: "row", alignItems: "center" }}
              >
                <View style={{
                  width: 64, height: 64, borderRadius: 32,
                  backgroundColor: "#6C5CE7", alignItems: "center", justifyContent: "center", marginRight: 16,
                }}>
                  <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>
                    {(child.name || "").charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>{child.name}</Text>
                  <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                    {child.ageCategory === "child"
                      ? "Ребенок (6-11 лет)"
                      : child.ageCategory === "teen"
                        ? "Подросток (12-17 лет)"
                        : "Студент (18-20 лет)"}
                    {child.age ? ` • ${child.age} лет` : ""}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#6C5CE7", marginRight: 6 }} />
                    <Text style={{ fontSize: 12, color: "#6C5CE7", fontWeight: "600" }}>Активен</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="#C4B5FD" />
              </TouchableOpacity>

              {/* Action bar */}
              <View style={{
                flexDirection: "row",
                borderTopWidth: 1,
                borderTopColor: "rgba(108,92,231,0.1)",
              }}>
                <TouchableOpacity
                  onPress={() => setEditingChild(child)}
                  style={{
                    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
                    paddingVertical: 12, gap: 6,
                  }}
                >
                  <Feather name="edit-2" size={15} color="#6C5CE7" />
                  <Text style={{ fontSize: 13, color: "#6C5CE7", fontWeight: "600" }}>Изменить</Text>
                </TouchableOpacity>
                <View style={{ width: 1, backgroundColor: "rgba(108,92,231,0.1)" }} />
                <TouchableOpacity
                  onPress={() => confirmRemove(child)}
                  style={{
                    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
                    paddingVertical: 12, gap: 6,
                  }}
                >
                  <Feather name="trash-2" size={15} color={COLORS.destructive} />
                  <Text style={{ fontSize: 13, color: COLORS.destructive, fontWeight: "600" }}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {editingChild && (
        <EditChildModal
          child={editingChild}
          onSave={(patch) => updateChild(editingChild.id, patch)}
          onClose={() => setEditingChild(null)}
        />
      )}
    </View>
  );
}
