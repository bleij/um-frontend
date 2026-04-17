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
import { useParentData } from "../../../contexts/ParentDataContext";
import { courses } from "../../../data/courses";

const CATEGORIES = ["Все", "Технологии", "Искусство", "Спорт", "Мышление"];
const CATEGORY_TO_TAGS: Record<string, string[]> = {
  "Технологии": ["it"],
  "Искусство": ["творчество", "гум"],
  "Спорт": ["спорт"],
  "Мышление": ["мат", "естеств"]
};

export default function ParentClubs() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { childrenProfile, activeChildId } = useParentData();
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : 20;

  const activeChild = childrenProfile.find(c => c.id === activeChildId) || childrenProfile[0];

  const SCORE_TO_TAGS: Record<string, string[]> = {
    creative: ["творчество", "гум"],
    logical: ["it", "мат"],
    social: ["гум", "творчество"],
    physical: ["спорт"],
    linguistic: ["гум"]
  };

  const getRecommendations = () => {
    if (!activeChild?.talentProfile) return [];
    const scores = activeChild.talentProfile.scores as Record<string, number>;
    
    // Find top 2 traits
    const sortedTraits = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2);
    
    let recommendedTags: string[] = [];
    sortedTraits.forEach(([trait]) => {
       recommendedTags = [...recommendedTags, ...(SCORE_TO_TAGS[trait] || [])];
    });

    return courses.filter(club => recommendedTags.includes(club.tag as string)).slice(0, 5);
  };

  const recommendedCourses = getRecommendations();

  const filtered = courses.filter((club) => {
    const matchCat = activeCategory === "Все" || CATEGORY_TO_TAGS[activeCategory]?.includes(club.tag as string);
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

        {/* AI Recommendations */}
        {activeChild?.talentProfile && recommendedCourses.length > 0 && search === "" && (
            <View className="mb-8">
               <View className="flex-row items-center gap-2 mb-4 px-1">
                  <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                     <Feather name="zap" size={16} color="#6C5CE7" />
                  </View>
                  <View>
                     <Text className="text-xl font-black text-gray-900">Идеально для {activeChild.name}</Text>
                     <Text className="text-[11px] font-bold text-purple-600 uppercase">Подобрано ИИ (Карта Талантов)</Text>
                  </View>
               </View>

               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 px-1 overflow-visible pb-2 pt-1">
                  {recommendedCourses.map(club => (
                     <Pressable
                        key={club.id}
                        onPress={() => router.push(`/parent/club/${club.id}` as any)}
                        style={SHADOWS.md}
                        className="mr-4 w-60 bg-white rounded-[28px] p-1 border border-purple-50"
                     >
                        <LinearGradient 
                           colors={(club.gradient as any) || ["#6C5CE7", "#8B7FE8"]}
                           style={{ height: 120, borderRadius: 24, padding: 12, justifyContent: "space-between" }}
                        >
                           <View className="bg-white/30 self-start px-2 py-1 rounded-lg backdrop-blur-md">
                              <Text className="text-white text-[10px] font-black uppercase">Мастхэв</Text>
                           </View>
                           <Feather name={(club.icon as any) || "star"} size={32} color="rgba(255,255,255,0.8)" style={{ alignSelf: "flex-end" }} />
                        </LinearGradient>
                        <View className="p-4">
                           <Text className="font-bold text-base text-gray-900 mb-1" numberOfLines={1}>{club.title}</Text>
                           <Text className="text-xs text-gray-400 font-medium mb-3" numberOfLines={1}>{club.shortDescription}</Text>
                           <View className="flex-row justify-between items-center">
                               <Text className="text-purple-600 font-black text-sm">{club.price?.toString().split(" ")[1] + " ₸"}</Text>
                               <View className="bg-gray-50 p-2 rounded-full">
                                  <Feather name="arrow-right" size={14} color="#6B7280" />
                               </View>
                           </View>
                        </View>
                     </Pressable>
                  ))}
               </ScrollView>
            </View>
        )}

        <Text className="text-xl font-black text-gray-900 mb-4 px-1">{search ? "Результаты поиска" : "Все кружки"}</Text>

        <View className="gap-4">
           {filtered.map(club => (
              <Pressable
                 key={club.id}
                 onPress={() => router.push(`/parent/club/${club.id}` as any)}
                 style={SHADOWS.sm}
                 className="flex-row items-center p-4 bg-white rounded-[32px] border border-gray-50"
              >
                 <View style={{ backgroundColor: (club.gradient?.[0] || "#6C5CE7") + '15' }} className="w-16 h-16 rounded-2xl items-center justify-center mr-4">
                    <Feather name={(club.icon as any) || "book-open"} size={24} color={club.gradient?.[0] || "#6C5CE7"} />
                 </View>

                 <View className="flex-1">
                    <Text className="font-bold text-base text-gray-900" numberOfLines={1}>{club.title}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                       <View className="flex-row items-center gap-1">
                          <Feather name="star" size={10} color="#FBBF24" />
                          <Text className="text-[10px] font-black text-gray-700">4.8</Text>
                       </View>
                       <Text className="text-[10px] text-gray-400 font-bold uppercase">{club.age}</Text>
                    </View>
                 </View>

                 <View className="items-end">
                    <Text className="text-purple-600 font-black text-xs" numberOfLines={1}>{club.price}</Text>
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
