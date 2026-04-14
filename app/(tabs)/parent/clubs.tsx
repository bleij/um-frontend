import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS } from "../../../constants/theme";

const MOCK_CLUBS = [
  { id: "1", title: "Лего-конструирование", category: "Технологии", age: "6-11", rating: 4.9, price: "8,000", enrolled: true, color: "#3B82F6" },
  { id: "2", title: "Рисование акварелью", category: "Искусство", age: "6-17", rating: 4.7, price: "6,000", enrolled: false, color: "#A78BFA" },
  { id: "3", title: "Программирование Python", category: "Технологии", age: "12-17", rating: 4.8, price: "10,000", enrolled: false, color: "#6C5CE7" },
  { id: "4", title: "Футбол", category: "Спорт", age: "6-17", rating: 4.6, price: "5,000", enrolled: false, color: "#10B981" },
];

const CATEGORIES = ["Все", "Технологии", "Искусство", "Спорт", "Мышление"];

export default function ParentClubs() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const filtered = MOCK_CLUBS.filter((club) => {
    const matchCat = activeCategory === "Все" || club.category === activeCategory;
    const matchSearch = club.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <LinearGradient
        colors={['#6C5CE7', '#8B7FE8']}
        style={{ paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={{ paddingHorizontal: horizontalPadding, paddingTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <Pressable
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Feather name="arrow-left" size={20} color="white" />
              </Pressable>
              <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>Каталог кружков</Text>
            </View>

            <View className="flex-row items-center bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20">
               <Feather name="search" size={18} color="white" style={{ opacity: 0.6, marginRight: 10 }} />
               <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Найти кружок..."
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  style={{ flex: 1, color: 'white', fontWeight: '500' }}
               />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-1 px-1 overflow-visible">
           {CATEGORIES.map(cat => (
              <Pressable 
                 key={cat}
                 onPress={() => setActiveCategory(cat)}
                 className={`mr-3 px-6 py-2.5 rounded-full border ${activeCategory === cat ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-100'}`}
              >
                 <Text className={`font-bold text-sm ${activeCategory === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
              </Pressable>
           ))}
        </ScrollView>

        <Text className="text-xl font-black text-gray-900 mb-4 px-1">Доступные кружки</Text>

        <View className="gap-4">
           {filtered.map(club => (
              <Pressable
                 key={club.id}
                 onPress={() => router.push(`/parent/club/${club.id}` as any)}
                 style={SHADOWS.sm}
                 className="flex-row items-center p-4 bg-white rounded-[32px] border border-gray-50"
              >
                 <View style={{ backgroundColor: club.color + '15' }} className="w-16 h-16 rounded-2xl items-center justify-center mr-4">
                    <Feather name="book-open" size={24} color={club.color} />
                 </View>

                 <View className="flex-1">
                    <Text className="font-bold text-base text-gray-900" numberOfLines={1}>{club.title}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                       <View className="flex-row items-center gap-1">
                          <Feather name="star" size={10} color="#FBBF24" />
                          <Text className="text-[10px] font-black text-gray-700">{club.rating}</Text>
                       </View>
                       <Text className="text-[10px] text-gray-400 font-bold uppercase">{club.age} ЛЕТ</Text>
                    </View>
                 </View>

                 <View className="items-end">
                    <Text className="text-purple-600 font-black text-sm">{club.price}₸</Text>
                    <Text className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">В МЕСЯЦ</Text>
                 </View>
              </Pressable>
           ))}
        </View>

        {filtered.length === 0 && (
           <View className="items-center justify-center py-20">
              <Feather name="search" size={48} color="#E5E7EB" />
              <Text className="mt-4 text-gray-400 font-bold text-center">Ничего не найдено</Text>
           </View>
        )}
      </ScrollView>
    </View>
  );
}
