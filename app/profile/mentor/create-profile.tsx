import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MotiView, AnimatePresence } from "moti";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, LAYOUT, RADIUS, SHADOWS, TYPOGRAPHY } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";

const STEPS = [
  { id: 1, title: "Личная визитка", sub: "Это то, что родитель увидит в первую очередь" },
  { id: 2, title: "Профессиональный фильтр", sub: "Данные для системы и администратора" },
  { id: 3, title: "Маркетинг и продажи", sub: "Дополнительная информация для профиля" },
];

const CITIES = [
  'Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе',
  'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау',
  'Костанай', 'Кызылорда', 'Уральск', 'Петропавловск', 'Актау'
];

const SPECIALIZATIONS = [
  'Психолог',
  'Профориентолог',
  'Тьютор по Hard Skills',
  'Тренер по Soft Skills',
  'Другая специализация'
];

const PREDEFINED_SKILLS = [
  '#Лидерство', '#ЭмоциональныйИнтеллект', '#IT', '#КритическоеМышление',
  '#Креативность', '#Коммуникация', '#Тайм-менеджмент', '#Командная работа',
  '#Программирование', '#Дизайн', '#Публичные выступления'
];

export default function MentorCreateProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop ? 40 : 24;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    languages: [] as string[],
    specialization: "",
    customSpecialization: "",
    experienceYears: "",
    education: "",
    skills: [] as string[],
    customSkill: "",
    pitch: "",
    bio: "",
    sessionPrice: "",
  });

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCustomSkill = () => {
    if (formData.customSkill.trim() && !formData.skills.includes(formData.customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill.trim()],
        customSkill: ""
      }));
    }
  };

  const canProceedStep1 = formData.fullName.trim() && formData.city && formData.languages.length > 0;
  const canProceedStep2 = formData.specialization && 
    (formData.specialization !== 'Другая специализация' || formData.customSpecialization.trim()) &&
    formData.experienceYears && formData.education.trim();
  const canSubmit = formData.pitch.trim() && formData.bio.trim() && formData.sessionPrice;

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      if (supabase && isSupabaseConfigured) {
        const finalSpec = formData.specialization === 'Другая специализация' ? formData.customSpecialization : formData.specialization;
        
        const { error: insertErr } = await supabase.from("mentor_applications").insert({
          user_id: user?.id ?? null,
          name: formData.fullName,
          specialization: finalSpec,
          city: formData.city,
          languages: JSON.stringify(formData.languages),
          experience: formData.experienceYears,
          education: formData.education,
          skills: JSON.stringify(formData.skills),
          pitch: formData.pitch,
          bio: formData.bio,
          price: parseInt(formData.sessionPrice) || 0,
          status: "pending",
        });

        if (insertErr) {
          setError(insertErr.message);
          return;
        }
      }
      setIsSuccess(true);
    } catch (e: any) {
      setError(e.message || "Ошибка при отправке");
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
      return <SuccessView onHome={() => router.replace("/(tabs)/home")} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: '#6C5CE7' }}
    >
      <StatusBar style="light" />
      <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ flex: 1 }}>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ paddingHorizontal: horizontalPadding, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
             <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep(s => s - 1) : router.back()} style={styles.backBtn}>
                <Feather name="arrow-left" size={24} color="white" />
             </TouchableOpacity>
             <Text style={styles.headerTitle}>Менторство</Text>
             <View style={{ width: 44 }} />
          </View>

          {/* Progress */}
          <View style={{ paddingHorizontal: horizontalPadding, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ color: 'white', fontWeight: '700' }}>Шаг {currentStep} из 3</Text>
                  <Text style={{ color: 'white', opacity: 0.8 }}>{Math.round((currentStep/3)*100)}%</Text>
              </View>
              <View style={styles.progressBar}>
                  <MotiView 
                    animate={{ width: `${(currentStep/3)*100}%` }} 
                    style={styles.progressInner} 
                  />
              </View>
              <Text style={styles.stepTitle}>{STEPS[currentStep-1].title}</Text>
              <Text style={styles.stepSub}>{STEPS[currentStep-1].sub}</Text>
          </View>

          <View style={[styles.formContainer, { marginTop: 24 }]}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingTop: 32, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
               <AnimatePresence exitBeforeEnter>
                  {currentStep === 1 && (
                      <MotiView key="step1" from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -20 }} transition={{ type: 'timing', duration: 400 }}>
                          <View style={{ alignItems: 'center', marginBottom: 32 }}>
                              <View style={styles.photoBox}>
                                  <Feather name="camera" size={32} color={COLORS.mutedForeground} />
                                  <TouchableOpacity style={styles.photoEdit}>
                                      <Feather name="plus" size={18} color="white" />
                                  </TouchableOpacity>
                              </View>
                              <Text style={{ color: COLORS.mutedForeground, marginTop: 12 }}>Загрузите профессиональное фото</Text>
                          </View>

                          <InputField label="ФИО *" value={formData.fullName} onChange={(t: string) => setFormData({...formData, fullName: t})} placeholder="Иванов Иван Иванович" />
                          
                          <Text style={styles.label}>ГОРОД *</Text>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
                              {CITIES.map(c => (
                                  <TouchableOpacity 
                                    key={c} 
                                    onPress={() => setFormData({...formData, city: c})}
                                    style={[styles.chip, formData.city === c && styles.chipActive]}
                                  >
                                      <Text style={[styles.chipText, formData.city === c && styles.chipTextActive]}>{c}</Text>
                                  </TouchableOpacity>
                              ))}
                          </ScrollView>

                          <Text style={styles.label}>ЯЗЫКИ ОБЩЕНИЯ *</Text>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
                              {['Казахский', 'Русский', 'Английский'].map(l => (
                                  <TouchableOpacity 
                                    key={l} 
                                    onPress={() => toggleLanguage(l)}
                                    style={[styles.chip, formData.languages.includes(l) && styles.chipActive]}
                                  >
                                      <Text style={[styles.chipText, formData.languages.includes(l) && styles.chipTextActive]}>{l}</Text>
                                  </TouchableOpacity>
                              ))}
                          </View>
                      </MotiView>
                  )}

                  {currentStep === 2 && (
                      <MotiView key="step2" from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -20 }}>
                          <Text style={styles.label}>СПЕЦИАЛИЗАЦИЯ *</Text>
                          <View style={{ gap: 10, marginBottom: 20 }}>
                               {SPECIALIZATIONS.map(s => (
                                   <TouchableOpacity 
                                      key={s} 
                                      onPress={() => setFormData({...formData, specialization: s})}
                                      style={[styles.listOption, formData.specialization === s && styles.listOptionActive]}
                                   >
                                       <Text style={[styles.listOptionText, formData.specialization === s && styles.listOptionTextActive]}>{s}</Text>
                                       {formData.specialization === s && <Feather name="check" size={18} color="white" />}
                                   </TouchableOpacity>
                               ))}
                          </View>

                          {formData.specialization === 'Другая специализация' && (
                              <InputField label="ВАША СПЕЦИАЛИЗАЦИЯ *" value={formData.customSpecialization} onChange={(t: string) => setFormData({...formData, customSpecialization: t})} placeholder="Введите вашу специализацию" />
                          )}

                          <InputField label="ОПЫТ РАБОТЫ (ЛЕТ) *" value={formData.experienceYears} onChange={(t: string) => setFormData({...formData, experienceYears: t.replace(/\D/g, "")})} placeholder="5" keyboardType="numeric" />
                          <InputField label="УЧЕБНОЕ ЗАВЕДЕНИЕ *" value={formData.education} onChange={(t: string) => setFormData({...formData, education: t})} placeholder="КазНУ им. аль-Фараби" />
                          
                          <Text style={styles.label}>КЛЮЧЕВЫЕ НАВЫКИ (ТЕГИ)</Text>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                              {PREDEFINED_SKILLS.map(s => (
                                  <TouchableOpacity 
                                    key={s} 
                                    onPress={() => toggleSkill(s)}
                                    style={[styles.tag, formData.skills.includes(s) && styles.tagActive]}
                                  >
                                      <Text style={[styles.tagText, formData.skills.includes(s) && styles.tagTextActive]}>{s}</Text>
                                  </TouchableOpacity>
                              ))}
                          </View>

                          {/* Custom Skill Input */}
                          <View style={styles.customSkillRow}>
                            <TextInput 
                                style={styles.customSkillInput}
                                placeholder="Добавить свой навык"
                                value={formData.customSkill}
                                onChangeText={(t) => setFormData({...formData, customSkill: t})}
                            />
                            <TouchableOpacity onPress={addCustomSkill} style={styles.addSkillBtn}>
                                <Feather name="plus" size={20} color="white" />
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity style={styles.uploadBtn}>
                              <Feather name="upload" size={20} color={COLORS.primary} />
                              <Text style={{ color: COLORS.primary, fontWeight: '700', marginLeft: 10 }}>Диплом/сертификат (PDF, JPG)</Text>
                          </TouchableOpacity>
                      </MotiView>
                  )}

                  {currentStep === 3 && (
                      <MotiView key="step3" from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -20 }}>
                          <InputField label="ЧЕМУ ОБУЧИТЕ? *" value={formData.pitch} onChange={(t: string) => setFormData({...formData, pitch: t})} placeholder="Научу вашего ребенка не бояться публичных выступлений" maxLength={60} />
                          <InputField label="О СЕБЕ И МЕТОДЕ *" value={formData.bio} onChange={(t: string) => setFormData({...formData, bio: t})} placeholder="Расскажите про свои методики и результаты учеников..." multiline height={150} />
                          <InputField label="СТОИМОСТЬ СЕССИИ (60 МИН) *" value={formData.sessionPrice} onChange={(t: string) => setFormData({...formData, sessionPrice: t.replace(/\D/g, "")})} placeholder="10 000" keyboardType="numeric" suffix="₸" />
                      </MotiView>
                  )}
               </AnimatePresence>

               {error && <Text style={styles.errorText}>{error}</Text>}

               <TouchableOpacity 
                  onPress={currentStep < 3 ? () => setCurrentStep(s => s + 1) : handleSubmit}
                  disabled={(!canProceedStep1 && currentStep === 1) || (!canProceedStep2 && currentStep === 2) || (!canSubmit && currentStep === 3) || submitting}
                  style={styles.nextBtn}
               >
                   <LinearGradient 
                        colors={((currentStep === 1 && canProceedStep1) || (currentStep === 2 && canProceedStep2) || (currentStep === 3 && canSubmit)) ? ["#6C5CE7", "#8B7FE8"] : ["#E5E7EB", "#E5E7EB"]} 
                        style={styles.nextBtnGradient}
                   >
                       {submitting ? <ActivityIndicator color="white" /> : (
                           <Text style={[styles.nextBtnText, !((currentStep === 1 && canProceedStep1) || (currentStep === 2 && canProceedStep2) || (currentStep === 3 && canSubmit)) && { color: COLORS.mutedForeground }]}>
                               {currentStep === 3 ? "Отправить на модерацию" : "Далее"}
                           </Text>
                       )}
                   </LinearGradient>
               </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function InputField({ label, value, onChange, placeholder, keyboardType = 'default', multiline = false, height, suffix, maxLength }: any) {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={{ position: 'relative', justifyContent: 'center' }}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.mutedForeground}
                    keyboardType={keyboardType as any}
                    multiline={multiline}
                    maxLength={maxLength}
                    style={[
                        styles.input, 
                        multiline && { height: height || 100, textAlignVertical: 'top', paddingTop: 16 },
                        suffix && { paddingRight: 40 }
                    ]}
                />
                {suffix && <Text style={styles.suffix}>{suffix}</Text>}
                {maxLength && <Text style={styles.counter}>{value.length}/{maxLength}</Text>}
            </View>
        </View>
    );
}

function SuccessView({ onHome }: { onHome: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#6C5CE7' }}>
            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
                    <MotiView 
                        from={{ opacity: 0, scale: 0.9, translateY: 20 }} 
                        animate={{ opacity: 1, scale: 1, translateY: 0 }} 
                        style={styles.successCard}
                    >
                        <View style={styles.successIconWrapper}>
                            <MaterialCommunityIcons name="check-circle" size={96} color="#10B981" />
                            <MotiView 
                                from={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 500 }}
                                style={styles.clockOverlay}
                            >
                                <Feather name="clock" size={18} color="white" />
                            </MotiView>
                        </View>
                        
                        <Text style={styles.successTitle}>Данные успешно отправлены!</Text>
                        <Text style={styles.successDesc}>Мы проверяем ваш диплом и другие документы.</Text>
                        
                        <View style={styles.successHighlight}>
                            <Text style={styles.successHighlightText}>⏱ Обычно это занимает до 24 часов</Text>
                        </View>
                        
                        <View style={styles.successBullets}>
                            <View style={styles.bulletRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.bulletText}>Мы отправим уведомление на вашу почту, как только проверка будет завершена</Text>
                            </View>
                            <View style={styles.bulletRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.bulletText}>После одобрения вы получите доступ к платформе и сможете начать работу</Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity onPress={onHome} style={styles.homeBtn} activeOpacity={0.8}>
                            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={styles.homeBtnGradient}>
                                <Text style={styles.homeBtnText}>Вернуться на главную</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: { flex: 1, backgroundColor: '#F9FAFB', borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden' },
    headerTitle: { fontSize: 20, fontWeight: '800', color: 'white' },
    backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
    progressInner: { height: '100%', backgroundColor: 'white' },
    stepTitle: { fontSize: 28, fontWeight: '900', color: 'white', marginTop: 24, letterSpacing: -0.5 },
    stepSub: { fontSize: 15, color: 'white', opacity: 0.8, marginTop: 4 },
    label: { fontSize: 13, fontWeight: '700', color: COLORS.foreground, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    input: { backgroundColor: 'white', borderWidth: 2, borderColor: '#6C5CE7', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, fontSize: 16, fontWeight: '500', ...SHADOWS.sm },
    suffix: { position: 'absolute', right: 20, fontSize: 18, fontWeight: '700', color: COLORS.mutedForeground },
    counter: { position: 'absolute', right: 10, bottom: -18, fontSize: 10, color: COLORS.mutedForeground },
    chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', marginRight: 10 },
    chipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
    chipText: { fontSize: 15, fontWeight: '600', color: COLORS.foreground },
    chipTextActive: { color: 'white' },
    listOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB', backgroundColor: 'white' },
    listOptionActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7' },
    listOptionText: { fontSize: 16, fontWeight: '600', color: COLORS.foreground },
    listOptionTextActive: { color: 'white' },
    tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB' },
    tagActive: { backgroundColor: '#EDE9FE', borderColor: '#6C5CE7' },
    tagText: { fontSize: 14, color: COLORS.foreground, fontWeight: '500' },
    tagTextActive: { color: '#6C5CE7', fontWeight: '700' },
    customSkillRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    customSkillInput: { flex: 1, height: 52, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, fontSize: 15, ...SHADOWS.sm },
    addSkillBtn: { width: 52, height: 52, backgroundColor: '#6C5CE7', borderRadius: 16, alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
    uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderStyle: 'dashed', borderWidth: 2, borderColor: '#6C5CE7', borderRadius: 20, backgroundColor: '#FAF9FF' },
    photoBox: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', borderWidth: 4, borderColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center', ...SHADOWS.md },
    photoEdit: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' },
    nextBtn: { marginTop: 24 },
    nextBtnGradient: { paddingVertical: 20, borderRadius: 20, alignItems: 'center', ...SHADOWS.md },
    nextBtnText: { fontSize: 18, fontWeight: '800', color: 'white' },
    errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 10, fontWeight: '600' },
    // Success View Styles
    successCard: { backgroundColor: 'white', borderRadius: 40, padding: 32, alignItems: 'center', ...SHADOWS.lg },
    successIconWrapper: { position: 'relative', marginBottom: 32 },
    clockOverlay: { position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' },
    successTitle: { fontSize: 26, fontWeight: '900', color: COLORS.foreground, textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 },
    successDesc: { fontSize: 16, color: COLORS.mutedForeground, textAlign: 'center', lineHeight: 24, marginBottom: 24 },
    successHighlight: { backgroundColor: '#F5F3FF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, marginBottom: 32 },
    successHighlightText: { color: '#6C5CE7', fontWeight: '800', fontSize: 14 },
    successBullets: { width: '100%', gap: 16, marginBottom: 40 },
    bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C5CE7', marginTop: 8 },
    bulletText: { flex: 1, fontSize: 15, color: COLORS.mutedForeground, lineHeight: 22 },
    homeBtn: { width: '100%' },
    homeBtnGradient: { paddingVertical: 20, borderRadius: 22, alignItems: 'center', ...SHADOWS.md },
    homeBtnText: { color: 'white', fontWeight: '900', fontSize: 17 }
});
