import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import ScreenHeader from "../../../components/ui/ScreenHeader";
import { COLORS, LAYOUT, RADIUS, SHADOWS } from "../../../constants/theme";

const MOCK_CLUBS = [
  {
    id: "1",
    title: "Лего-конструирование",
    category: "Технологии",
    age: "6-11",
    rating: 4.9,
    price: 8000,
    enrolled: true,
  },
  {
    id: "2",
    title: "Рисование акварелью",
    category: "Искусство",
    age: "6-17",
    rating: 4.7,
    price: 6000,
    enrolled: false,
  },
  {
    id: "3",
    title: "Программирование Python",
    category: "Технологии",
    age: "12-17",
    rating: 4.8,
    price: 10000,
    enrolled: false,
  },
  {
    id: "4",
    title: "Футбол",
    category: "Спорт",
    age: "6-17",
    rating: 4.6,
    price: 5000,
    enrolled: false,
  },
  {
    id: "5",
    title: "Музыка и ритм",
    category: "Искусство",
    age: "6-12",
    rating: 4.7,
    price: 7000,
    enrolled: false,
  },
  {
    id: "6",
    title: "Шахматы",
    category: "Мышление",
    age: "8-17",
    rating: 4.9,
    price: 4500,
    enrolled: false,
  },
];

const CATEGORIES = ["Все", "Технологии", "Искусство", "Спорт", "Мышление"];

export default function ParentClubs() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.dashboardHorizontalPaddingDesktop
    : LAYOUT.dashboardHorizontalPaddingMobile;
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");

  const filtered = MOCK_CLUBS.filter((club) => {
    const matchCat =
      activeCategory === "Все" || club.category === activeCategory;
    const matchSearch = club.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const enrolled = filtered.filter((c) => c.enrolled);
  const available = filtered.filter((c) => !c.enrolled);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {!isDesktop && (
        <ScreenHeader
          title="Каталог кружков"
          onBack={() => router.back()}
          horizontalPadding={horizontalPadding}
          variant="surface"
        />
      )}

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 40,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: isDesktop ? LAYOUT.dashboardMaxWidth : undefined,
            paddingHorizontal: horizontalPadding,
          }}
        >
          {/* Search */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.muted,
              borderRadius: RADIUS.md,
              paddingHorizontal: 14,
              paddingVertical: 12,
              marginBottom: 12,
            }}
          >
            <Feather
              name="search"
              size={18}
              color={COLORS.mutedForeground}
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Найти кружок..."
              placeholderTextColor={COLORS.mutedForeground}
              style={{ flex: 1, fontSize: 15, color: COLORS.foreground }}
            />
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: RADIUS.full,
                  marginRight: 8,
                  backgroundColor:
                    activeCategory === cat ? COLORS.primary : COLORS.muted,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 14,
                    color:
                      activeCategory === cat ? "white" : COLORS.mutedForeground,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Enrolled */}
          {enrolled.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: COLORS.foreground,
                  marginBottom: 12,
                }}
              >
                Мои кружки
              </Text>
              {enrolled.map((club) => (
                <TouchableOpacity
                  key={club.id}
                  onPress={() =>
                    router.push(`/(tabs)/parent/club/${club.id}` as any)
                  }
                  style={{
                    backgroundColor: COLORS.card,
                    borderRadius: RADIUS.sm,
                    padding: 16,
                    marginBottom: 10,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.primary,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    ...SHADOWS.sm,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: `${COLORS.primary}10`,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <Feather
                      name="check-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "700",
                        color: COLORS.foreground,
                        fontSize: 15,
                      }}
                    >
                      {club.title}
                    </Text>
                    <Text
                      style={{
                        color: COLORS.mutedForeground,
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {club.age} лет · {club.price}₸/мес
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={COLORS.mutedForeground}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Available */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: COLORS.foreground,
              marginBottom: 12,
            }}
          >
            Доступные кружки
          </Text>
          {available.map((club) => (
            <TouchableOpacity
              key={club.id}
              onPress={() =>
                router.push(`/(tabs)/parent/club/${club.id}` as any)
              }
              style={{
                backgroundColor: COLORS.card,
                borderRadius: RADIUS.sm,
                padding: 16,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.border,
                ...SHADOWS.sm,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: `${COLORS.primary}10`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Feather name="book-open" size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "700",
                    color: COLORS.foreground,
                    fontSize: 15,
                  }}
                >
                  {club.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <Feather name="star" size={12} color={COLORS.accent} />
                  <Text
                    style={{
                      color: COLORS.mutedForeground,
                      fontSize: 12,
                      marginLeft: 4,
                    }}
                  >
                    {club.rating} · {club.age} лет · {club.price}₸/мес
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: `${COLORS.primary}10`,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "600",
                    fontSize: 12,
                  }}
                >
                  {club.category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
