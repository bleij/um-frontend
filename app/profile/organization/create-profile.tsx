import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
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
import { LAYOUT, RADIUS } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase";

export default function CreateProfileOrganization() {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= LAYOUT.desktopBreakpoint;
  const horizontalPadding = isDesktop
    ? LAYOUT.profileHorizontalPaddingDesktop
    : LAYOUT.profileHorizontalPaddingMobile;
    
  const [formData, setFormData] = useState({
    orgName: "",
    orgType: "",
    bin: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    description: "",
    capacity: "",
  });

  const [files, setFiles] = useState({
    license: null as any,
    registration: null as any,
    logo: null as any,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleMockSubmit = async () => {
    setError(null);
    if (!formData.orgName.trim()) { setError("Укажите название организации."); return; }
    if (!formData.bin.trim()) { setError("Укажите БИН."); return; }

    setSubmitting(true);
    try {
      if (supabase && isSupabaseConfigured) {
        const capacityNum = parseInt(formData.capacity, 10);
        const { error: insertErr } = await supabase.from("organizations").insert({
          owner_user_id: user?.id ?? null,
          name: formData.orgName.trim(),
          org_type: formData.orgType.trim() || null,
          bin: formData.bin.trim(),
          contact_person: formData.contactPerson.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || user?.phone || null,
          city: formData.city.trim() || null,
          address: formData.address.trim() || null,
          description: formData.description.trim() || null,
          capacity: Number.isFinite(capacityNum) ? capacityNum : null,
          license_url: files.license ? 'uploaded_license.pdf' : null,
          registration_url: files.registration ? 'uploaded_registration.pdf' : null,
          logo_url: files.logo ? 'uploaded_logo.jpg' : null,
          status: "pending",
        });
        if (insertErr) {
          setError(insertErr.message);
          setSubmitting(false);
          return;
        }
      }
      setIsSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessView onHome={() => router.replace("/(tabs)/home")} />;
  }

  const renderInput = (label: string, value: string, onChange: (text: string) => void, placeholder: string, keyboardType: any = "default", multiline: boolean = false) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={[
            { width: '100%', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F9FAFB', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB' },
            multiline && { height: 120, textAlignVertical: 'top' }
        ]}
      />
    </View>
  );

  const renderUploadBox = (label: string, field: 'license' | 'registration' | 'logo', icon: any) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>{label}</Text>
      <TouchableOpacity 
        style={{ borderStyle: 'dashed', borderWidth: 2, borderColor: '#DDD6FE', borderRadius: 16, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F3FF' }}
        onPress={() => {/* File picker logic here */}}
      >
        <Feather name={icon} size={28} color="#6C5CE7" style={{ opacity: 0.5 }} />
        <Text style={{ fontSize: 12, color: '#7C3AED', fontWeight: '600', marginTop: 8 }}>
          {files[field] ? "Файл выбран" : "Нажмите для загрузки"}
        </Text>
        <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>PDF, JPG, PNG до 10MB</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#F8F7FF", "#EDE9FE"]} style={{ flex: 1 }}>
        {/* Header */}
        <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingTop: 60, paddingBottom: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          <SafeAreaView edges={["top"]} style={{ width: "100%", maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined, alignSelf: "center", flexDirection: "row", alignItems: "center", paddingHorizontal: horizontalPadding }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <View>
                <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>Регистрация организации</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Заполните данные для проверки</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingTop: 24, paddingBottom: 60, alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", maxWidth: isDesktop ? LAYOUT.profileFormMaxWidth : undefined }}>
            
            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <MaterialCommunityIcons name="office-building" size={20} color="#6C5CE7" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 }}>Общая информация</Text>
              </View>
              {renderInput("Название организации *", formData.orgName, (t) => setFormData({...formData, orgName: t}), "Например: RoboTech Academy")}
              {renderInput("БИН (12 цифр) *", formData.bin, (t) => setFormData({...formData, bin: t}), "123456789012", "numeric")}
              {renderInput("Тип организации *", formData.orgType, (t) => setFormData({...formData, orgType: t}), "Школа, академия, клуб...")}
              {renderInput("Вместимость учеников", formData.capacity, (t) => setFormData({...formData, capacity: t}), "Количество мест", "numeric")}
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Feather name="upload" size={20} color="#6C5CE7" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 }}>Документы</Text>
              </View>
              {renderUploadBox("Лицензия на обучение", "license", "file-text")}
              {renderUploadBox("Свидетельство о регистрации", "registration", "award")}
              {renderUploadBox("Логотип организации", "logo", "image")}
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Feather name="user" size={20} color="#6C5CE7" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 }}>Контактное лицо</Text>
              </View>
              {renderInput("ФИО представителя *", formData.contactPerson, (t) => setFormData({...formData, contactPerson: t}), "Директор / Менеджер")}
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Feather name="mail" size={20} color="#6C5CE7" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 }}>Контакты</Text>
              </View>
              {renderInput("Email *", formData.email, (t) => setFormData({...formData, email: t}), "org@email.com", "email-address")}
              {renderInput("Телефон *", formData.phone, (t) => setFormData({...formData, phone: t}), "+7 (___) ___", "phone-pad")}
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <Feather name="map-pin" size={20} color="#6C5CE7" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 }}>Адрес</Text>
              </View>
              {renderInput("Город *", formData.city, (t) => setFormData({...formData, city: t}), "Алматы")}
              {renderInput("Адрес *", formData.address, (t) => setFormData({...formData, address: t}), "Улица, дом")}
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 24, ...SHADOWS.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <MaterialCommunityIcons name="text-box-outline" size={20} color="#6C5CE7" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginLeft: 10 }}>Описание</Text>
              </View>
              {renderInput("О вашей организации", formData.description, (t) => setFormData({...formData, description: t}), "Опишите деятельность...", "default", true)}
            </View>

            {error && <Text style={{ color: '#EF4444', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>{error}</Text>}
            <TouchableOpacity onPress={handleMockSubmit} disabled={submitting} style={{ opacity: submitting ? 0.6 : 1, borderRadius: 20, overflow: 'hidden', ...SHADOWS.md }}>
              <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingVertical: 18, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>{submitting ? "Отправка..." : "Создать профиль"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
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
                        style={{ backgroundColor: 'white', borderRadius: 40, padding: 32, alignItems: 'center', ...SHADOWS.lg }}
                    >
                        <View style={{ position: 'relative', marginBottom: 32 }}>
                            <MaterialCommunityIcons name="office-building-marker" size={96} color="#10B981" />
                            <MotiView 
                                from={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 500 }}
                                style={{ position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: '#6C5CE7', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'white' }}
                            >
                                <Feather name="clock" size={18} color="white" />
                            </MotiView>
                        </View>
                        
                        <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 }}>Заявка организации отправлена!</Text>
                        <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 24 }}>Мы проверяем ваши юридические данные и БИН для активации доступа.</Text>
                        
                        <View style={{ backgroundColor: '#F5F3FF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, marginBottom: 32 }}>
                            <Text style={{ color: '#6C5CE7', fontWeight: '800', fontSize: 14 }}>⏱ Обычно проверка занимает до 48 часов</Text>
                        </View>
                        
                        <View style={{ width: '100%', gap: 16, marginBottom: 40 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C5CE7', marginTop: 8 }} />
                                <Text style={{ flex: 1, fontSize: 15, color: '#6B7280', lineHeight: 22 }}>Уведомление об активации придет на почту администратора</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C5CE7', marginTop: 8 }} />
                                <Text style={{ flex: 1, fontSize: 15, color: '#6B7280', lineHeight: 22 }}>После одобрения вы сможете создавать группы и добавлять учителей</Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity onPress={onHome} style={{ width: '100%' }} activeOpacity={0.8}>
                            <LinearGradient colors={["#6C5CE7", "#8B7FE8"]} style={{ paddingVertical: 20, borderRadius: 22, alignItems: 'center', ...SHADOWS.md }}>
                                <Text style={{ color: 'white', fontWeight: '900', fontSize: 17 }}>Вернуться на главную</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  md: {
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  }
};
