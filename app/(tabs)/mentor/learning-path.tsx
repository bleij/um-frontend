import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, SHADOWS, RADIUS, SPACING, TYPOGRAPHY } from "../../../constants/theme";

const PATH_STEPS = [
    {
        id: 1, phase: "Текущие навыки", status: "completed",
        items: [
            { text: "Креативность: высокий уровень", done: true },
            { text: "Коммуникация: средний уровень", done: true },
        ],
    },
    {
        id: 2, phase: "Цели развития", status: "active",
        items: [
            { text: "Развить навыки публичных выступлений", done: true },
            { text: "Улучшить командную работу", done: false },
        ],
    },
    {
        id: 3, phase: "Рекомендованные кружки", status: "active",
        items: [
            { text: "Театральная студия", done: false },
            { text: "Ораторское искусство", done: false },
        ],
    },
];

export default function MentorLearningPath() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const paddingX = isDesktop ? LAYOUT.dashboardHorizontalPaddingDesktop : SPACING.xl;

  const [pathSteps, setPathSteps] = React.useState(PATH_STEPS);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [activeStepId, setActiveStepId] = React.useState<number | null>(null);
  const [newTaskText, setNewTaskText] = React.useState("");

  const toggleTask = (stepId: number, taskIndex: number) => {
     setPathSteps(prev => prev.map(step => {
        if (step.id === stepId) {
            const newItems = [...step.items];
            newItems[taskIndex] = { ...newItems[taskIndex], done: !newItems[taskIndex].done };
            return { ...step, items: newItems };
        }
        return step;
     }));
  };

  const handleAddTask = () => {
     if (!newTaskText.trim() || activeStepId === null) return;
     setPathSteps(prev => prev.map(step => {
         if (step.id === activeStepId) {
             return { ...step, items: [...step.items, { text: newTaskText.trim(), done: false }] };
         }
         return step;
     }));
     setNewTaskText("");
     setShowAddModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header - Unified Brand Style */}
      <View style={{ backgroundColor: COLORS.primary, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl, overflow: 'hidden' }}>
        <LinearGradient
          colors={COLORS.gradients.header as any}
          style={{ paddingBottom: SPACING.xl }}
        >
          <SafeAreaView edges={["top"]}>
            <MotiView 
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={{ paddingHorizontal: paddingX, paddingTop: SPACING.md }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xl }}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS.md,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SPACING.md,
                  }}
                >
                  <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <View>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.semibold, color: "white" }}>План развития</Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: TYPOGRAPHY.size.sm, fontWeight: TYPOGRAPHY.weight.medium }}>Анна Петрова</Text>
                </View>
              </View>
            </MotiView>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: paddingX,
          paddingTop: SPACING.xl,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Summary Card */}
        <View style={{ ...SHADOWS.strict, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
           <Text style={{ fontSize: 10, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm }}>Общий прогресс</Text>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm }}>
              <View style={{ flex: 1, height: 10, backgroundColor: COLORS.muted, borderRadius: RADIUS.full, overflow: 'hidden' }}>
                 <View style={{ width: '40%', height: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full }} />
              </View>
              <Text style={{ fontSize: TYPOGRAPHY.size.xxl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.primary }}>40%</Text>
           </View>
           <Text style={{ fontSize: TYPOGRAPHY.size.sm, color: COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.medium }}>2 из 5 этапов завершено</Text>
        </View>

        {/* Timeline */}
        <View style={{ position: 'relative' }}>
           {/* Vertical Line */}
           <View style={{ position: 'absolute', left: 21, top: 0, bottom: 0, width: 2, backgroundColor: COLORS.muted }} />

           {pathSteps.map((step, index) => (
             <View key={step.id} style={{ flexDirection: 'row', gap: 20, marginBottom: SPACING.xl }}>
                {/* Dot */}
                <View style={{ zIndex: 10 }}>
                   <View style={{ 
                     width: 44, 
                     height: 44, 
                     borderRadius: RADIUS.full, 
                     alignItems: 'center', 
                     justifyContent: 'center', 
                     backgroundColor: step.status === 'completed' ? COLORS.success : step.status === 'active' ? COLORS.primary : COLORS.muted,
                     borderWidth: 4,
                     borderColor: COLORS.white
                   }}>
                      <Feather name={step.status === 'completed' ? 'check' : 'target'} size={18} color="white" />
                   </View>
                </View>

                {/* Card */}
                <View style={{ ...SHADOWS.strict, flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.xxl, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border }}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl }}>
                      <Text style={{ fontSize: TYPOGRAPHY.size.md, fontWeight: TYPOGRAPHY.weight.semibold, color: COLORS.foreground }}>{step.phase}</Text>
                      <View style={{ 
                        paddingHorizontal: SPACING.md, 
                        paddingVertical: SPACING.xs, 
                        borderRadius: RADIUS.md, 
                        backgroundColor: step.status === 'completed' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(108, 92, 231, 0.1)'
                      }}>
                         <Text style={{ 
                           fontSize: 9, 
                           fontWeight: TYPOGRAPHY.weight.bold, 
                           textTransform: 'uppercase', 
                           color: step.status === 'completed' ? COLORS.success : COLORS.primary 
                         }}>
                            {step.status === 'completed' ? 'ГОТОВО' : 'В ПРОЦЕССЕ'}
                         </Text>
                      </View>
                   </View>
                   
                   <View style={{ gap: SPACING.sm }}>
                      {step.items.map((item, i) => (
                        <TouchableOpacity 
                           key={i} 
                           onPress={() => toggleTask(step.id, i)}
                           style={{ 
                             flexDirection: 'row', 
                             alignItems: 'center', 
                             gap: SPACING.md, 
                             padding: SPACING.md, 
                             borderRadius: RADIUS.lg, 
                             backgroundColor: item.done ? 'rgba(52, 199, 89, 0.05)' : COLORS.background,
                             borderWidth: 1,
                             borderColor: item.done ? 'rgba(52, 199, 89, 0.1)' : COLORS.border
                           }}
                        >
                           <View style={{ 
                             width: 20, 
                             height: 20, 
                             borderRadius: 6, 
                             alignItems: 'center', 
                             justifyContent: 'center', 
                             backgroundColor: item.done ? COLORS.success : COLORS.white,
                             borderWidth: item.done ? 0 : 1,
                             borderColor: COLORS.mutedForeground
                           }}>
                              {item.done && <Feather name="check" size={12} color="white" />}
                           </View>
                           <Text style={{ 
                             flex: 1,
                             fontSize: TYPOGRAPHY.size.sm, 
                             color: item.done ? COLORS.mutedForeground : COLORS.foreground, 
                             fontWeight: item.done ? TYPOGRAPHY.weight.regular : TYPOGRAPHY.weight.medium,
                             textDecorationLine: item.done ? 'line-through' : 'none'
                           }}>{item.text}</Text>
                        </TouchableOpacity>
                      ))}
                   </View>

                   {step.status === 'active' && (
                     <TouchableOpacity 
                        onPress={() => { setActiveStepId(step.id); setShowAddModal(true); }}
                        style={{ 
                           marginTop: SPACING.lg, 
                           height: 48, 
                           borderRadius: RADIUS.md, 
                           borderWidth: 1, 
                           borderStyle: 'dashed', 
                           borderColor: COLORS.border, 
                           alignItems: 'center', 
                           justifyContent: 'center', 
                           flexDirection: 'row', 
                           gap: SPACING.xs 
                        }}
                     >
                        <Feather name="plus-circle" size={14} color={COLORS.mutedForeground} />
                        <Text style={{ fontSize: TYPOGRAPHY.size.xs, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.mutedForeground, textTransform: 'uppercase' }}>Добавить цель</Text>
                     </TouchableOpacity>
                   )}
                </View>
             </View>
           ))}
        </View>

        <TouchableOpacity 
          style={{ ...SHADOWS.md, height: 64, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xl }}
        >
           <Text style={{ color: 'white', fontWeight: TYPOGRAPHY.weight.bold, fontSize: TYPOGRAPHY.size.md }}>Сохранить изменения</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl, padding: SPACING.xl, paddingBottom: 40 }}>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                  <Text style={{ fontSize: TYPOGRAPHY.size.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.foreground }}>Новая цель</Text>
                  <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ padding: SPACING.xs }}>
                     <Feather name="x" size={24} color={COLORS.mutedForeground} />
                  </TouchableOpacity>
               </View>

               <TextInput
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                  placeholder="Опишите новый навык или задачу..."
                  autoFocus
                  style={{ 
                     backgroundColor: COLORS.background, 
                     borderRadius: RADIUS.lg, 
                     padding: SPACING.lg, 
                     fontSize: TYPOGRAPHY.size.md, 
                     borderWidth: 1, 
                     borderColor: COLORS.border,
                     marginBottom: SPACING.xl
                  }}
               />

               <TouchableOpacity 
                  onPress={handleAddTask}
                  disabled={!newTaskText.trim()}
                  style={{ 
                     backgroundColor: newTaskText.trim() ? COLORS.primary : COLORS.muted, 
                     paddingVertical: SPACING.lg, 
                     borderRadius: RADIUS.lg, 
                     alignItems: 'center' 
                  }}
               >
                  <Text style={{ color: newTaskText.trim() ? 'white' : COLORS.mutedForeground, fontWeight: TYPOGRAPHY.weight.bold, fontSize: TYPOGRAPHY.size.md }}>Добавить</Text>
               </TouchableOpacity>
            </View>
         </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
