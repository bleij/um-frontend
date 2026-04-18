import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionPaywall() {
   const router = useRouter();
   const { width } = useWindowDimensions();
   const isDesktop = Platform.OS === "web" && width >= 768;
   const paddingHorizontal = isDesktop ? 60 : 20;

   const [isLoading, setIsLoading] = useState(false);

   const handleSubscribe = () => {
      setIsLoading(true);
      setTimeout(() => {
         setIsLoading(false);
         if (Platform.OS === 'web') {
            window.alert("Оплата успешно прошла! Вы получили статус PRO.");
         } else {
            Alert.alert("Успешно", "Оплата успешно прошла! Вы получили статус PRO.");
         }
         router.push("/home");
      }, 1500);
   };

   return (
      <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
         {/* Background Effects */}
         <View style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, backgroundColor: 'rgba(139, 92, 246, 0.2)', borderRadius: 200, filter: 'blur(100px)' as any }} />
         <View style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: 200, filter: 'blur(100px)' as any }} />

         <SafeAreaView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal, paddingTop: 12, flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
               <Pressable
                  onPress={() => router.back()}
                  style={{
                     width: 40,
                     height: 40,
                     borderRadius: 20,
                     backgroundColor: "rgba(255,255,255,0.1)",
                     alignItems: "center",
                     justifyContent: "center",
                     marginRight: 16,
                     borderWidth: 1,
                     borderColor: "rgba(255,255,255,0.1)",
                  }}
               >
                  <Feather name="x" size={20} color="white" />
               </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
               <View style={{ alignItems: "center", marginBottom: 32, marginTop: 20 }}>
                  <View className="w-16 h-16 bg-purple-500/20 rounded-3xl items-center justify-center mb-6 border border-purple-500/30">
                     <Feather name="zap" size={32} color="#A78BFA" />
                  </View>
                  <Text className="text-white text-3xl font-black text-center mb-4 leading-tight">
                     Раскройте 100% {"\n"}потенциала ребенка
                  </Text>
                  <Text className="text-gray-400 text-center font-medium leading-relaxed max-w-md">
                     Оформите подписку PRO, чтобы получить индивидуальный план развития и доступ ко всем премиум-функциям.
                  </Text>
               </View>

               {/* Feature List */}
               <View className="bg-white/5 rounded-[40px] p-6 mb-8 border border-white/10">
                  {[
                     { icon: "check-circle", title: "Запись в любые кружки", desc: "Без ограничений и скрытых комиссий" },
                     { icon: "star", title: "Личный ментор", desc: "Корректировка трека после каждого занятия" },
                     { icon: "activity", title: "Глубокая аналитика", desc: "Контроль успеваемости и новых навыков" },
                     { icon: "shield", title: "Высокое качество", desc: "Сплит-платежи: мы платим учителям только за результат" }
                  ].map((feature, idx) => (
                     <View key={idx} className="flex-row items-center gap-4 mb-6 last:mb-0">
                        <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 items-center justify-center border border-white/5">
                           <Feather name={feature.icon as any} size={20} color="#A78BFA" />
                        </View>
                        <View className="flex-1">
                           <Text className="text-white font-bold text-base mb-1">{feature.title}</Text>
                           <Text className="text-gray-400 text-xs leading-4">{feature.desc}</Text>
                        </View>
                     </View>
                  ))}
               </View>

               {/* Pricing Card */}
               <View className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[40px] p-8 mb-6 shadow-2xl shadow-purple-500/20 relative overflow-hidden">
                  <LinearGradient colors={['rgba(255,255,255,0.2)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }} />
                  <Text className="text-white/80 font-black text-xs uppercase tracking-widest mb-2">Месячный тариф</Text>
                  <View className="flex-row items-baseline gap-2 mb-6">
                     <Text className="text-white text-4xl font-black">30,000</Text>
                     <Text className="text-white/80 text-lg font-bold">₸ / мес</Text>
                  </View>

                  <Pressable
                     disabled={isLoading}
                     onPress={handleSubscribe}
                     className="bg-white h-14 rounded-2xl items-center justify-center active:bg-gray-100 mb-4"
                  >
                     <Text className="text-purple-700 font-black text-sm uppercase">
                        {isLoading ? "Обработка..." : "Оплатить через Kaspi"}
                     </Text>
                  </Pressable>

                  <View className="flex-row items-center justify-center gap-2 opacity-60">
                     <Feather name="lock" size={12} color="white" />
                     <Text className="text-white text-[10px] font-medium uppercase tracking-widest">Безопасный платеж</Text>
                  </View>
               </View>

               <Pressable onPress={() => router.back()} className="py-4 items-center">
                  <Text className="text-gray-500 font-bold text-sm">Продолжить на бесплатном (Basic)</Text>
               </Pressable>
            </ScrollView>
         </SafeAreaView>
      </View>
   );
}
