import React, {useEffect, useMemo, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
    Modal,
    Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons, Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {useRouter} from "expo-router";
import {MotiView} from "moti";

const {width} = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && width >= 900;

type Role = "parent" | "mentor" | "youth" | "org";

type ModalState =
    | null
    | { title: string; text: string; primaryLabel?: string; onPrimary?: () => void };

const THEME = {
    primary: "#3F3C9F",
    deep: "#2E2C79",
    bgTop: "#F4F5FF",
    bgBottom: "#FFFFFF",
    card: "#FFFFFF",
    soft: "#EEF0FF",
    text: "#0F172A",
    muted: "#6B7280",
    line: "rgba(15, 23, 42, 0.08)",
};

function roleLabel(role: Role | null) {
    if (!role) return "профиль";
    if (role === "parent") return "кабинет родителя";
    if (role === "youth") return "профиль ученика";
    if (role === "mentor") return "панель ментора";
    return "панель организации";
}

function planKey(role: Role) {
    return `subscription_plan_${role}`;
}

export default function ProfileScreen() {
    const [role, setRole] = useState<Role | null>(null);
    const [activeModal, setActiveModal] = useState<ModalState>(null);
    const [planTitle, setPlanTitle] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => setRole((v as Role) || "parent"));
    }, []);

    useEffect(() => {
        if (!role) return;
        AsyncStorage.getItem(planKey(role)).then((v) => setPlanTitle(v));
    }, [role]);

    const name = "Халилова Сабина";
    const phone = "87777777777";
    const email = "sab@bk.ru";

    const wrapperWidth = useMemo(() => (IS_DESKTOP ? "50%" : "100%"), []);

    const subscriptionVisible = role !== "mentor";
    const subscriptionName = planTitle ?? (role === "mentor" ? null : "не выбрано");

    const openInfo = (title: string, text: string, primaryLabel?: string, onPrimary?: () => void) => {
        setActiveModal({title, text, primaryLabel, onPrimary});
    };

    const closeModal = () => setActiveModal(null);

    // карточки для всех ролей: всё кликабельно, аналитика -> модалка
    const roleSections = useMemo(() => {
        if (!role) return [];

        if (role === "parent") {
            return [
                {
                    title: "дети",
                    items: [
                        {icon: "people-outline", label: "алия · 8 лет", hint: "прогресс, курсы, тесты"},
                        {icon: "people-outline", label: "асия · 13 лет", hint: "прогресс, курсы, тесты"},
                    ],
                    footer: {icon: "add", label: "добавить ребёнка"},
                },
                {
                    title: "сводка",
                    items: [
                        {icon: "calendar-outline", label: "расписание", hint: "ближайшие занятия"},
                        {icon: "trophy-outline", label: "достижения", hint: "награды за неделю"},
                        {icon: "checkbox-outline", label: "тесты", hint: "диагностика и результаты"},
                    ],
                },
            ];
        }

        if (role === "youth") {
            return [
                {
                    title: "мой прогресс",
                    items: [
                        {icon: "book-outline", label: "курсы", hint: "активные: 3"},
                        {icon: "flame-outline", label: "стрик", hint: "5 дней подряд"},
                        {icon: "star-outline", label: "достижения", hint: "всего: 7"},
                    ],
                },
                {
                    title: "обучение",
                    items: [
                        {icon: "play-circle-outline", label: "продолжить урок", hint: "следующий модуль открыт"},
                        {icon: "clipboard-outline", label: "пройти тест", hint: "быстрая диагностика"},
                    ],
                },
            ];
        }

        if (role === "mentor") {
            return [
                {
                    title: "ученики",
                    items: [
                        {icon: "people-outline", label: "активные ученики", hint: "5 человек"},
                        {icon: "document-text-outline", label: "проверки", hint: "в очереди: 5"},
                        {icon: "chatbubble-ellipses-outline", label: "чаты", hint: "активные: 3"},
                    ],
                },
                {
                    title: "работа",
                    items: [
                        {icon: "calendar-outline", label: "созвоны", hint: "сегодня: 2"},
                        {icon: "folder-open-outline", label: "отчёты", hint: "шаблоны и статусы"},
                    ],
                },
            ];
        }

        // org
        return [
            {
                title: "центр",
                items: [
                    {icon: "business-outline", label: "профиль организации", hint: "данные и настройки"},
                    {icon: "people-outline", label: "ученики", hint: "всего: 248"},
                    {icon: "layers-outline", label: "группы", hint: "активные: 18"},
                ],
            },
            {
                title: "сводка",
                items: [
                    {icon: "person-add-outline", label: "заявки", hint: "новые: 6"},
                    {icon: "pulse-outline", label: "посещаемость", hint: "средняя: 92%"},
                    {icon: "pie-chart-outline", label: "отчёты", hint: "за неделю готовы"},
                ],
            },
        ];
    }, [role]);

    const handleItemPress = (label: string) => {
        // всё кликается: показываем модалки с “статистикой/деталями”
        if (label.includes("расписание")) {
            openInfo("расписание", "ближайшее занятие: завтра 18:00\nследующее: суббота 12:30");
            return;
        }
        if (label.includes("достижения")) {
            openInfo("достижения", "новые за неделю: 2\nвсего: 7\nпоследнее: «стараюсь стабильно»");
            return;
        }
        if (label.includes("тест")) {
            openInfo("тесты", "доступно: 1\nпоследний результат: готов\nследующее обновление: рекомендации");
            return;
        }
        if (label.includes("чаты")) {
            openInfo("чаты", "активные: 3\nнепрочитанные: 1\nсреднее время ответа: 12 мин");
            return;
        }
        if (label.includes("проверки")) {
            openInfo("проверки", "в очереди: 5\nсегодня закрыто: 2\nпросрочено: 0");
            return;
        }
        if (label.includes("посещаемость")) {
            openInfo("посещаемость", "средняя: 92%\nлучший день: среда\nв зоне риска: 2 ученика");
            return;
        }
        if (label.includes("заявки")) {
            openInfo("заявки", "новые: 6\nв обработке: 2\nзакрыто сегодня: 1");
            return;
        }

        openInfo(label, "детали будут добавлены позже.");
    };

    return (
        <LinearGradient colors={[THEME.bgTop, THEME.bgBottom]} style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom: 140}}>
                {/* LOGO */}
                <View style={{alignItems: "center", paddingTop: 40, marginBottom: 18, marginTop: IS_DESKTOP ? 60 : 40}}>
                    <Image
                        source={require("../../../assets/logo/logo_blue.png")}
                        style={{width: 140, height: 60, resizeMode: "contain"}}
                    />
                </View>

                {/* WRAPPER */}
                <View style={{width: wrapperWidth, alignSelf: "center", paddingHorizontal: 20}}>
                    {/* TOP CARD */}
                    <MotiView
                        from={{opacity: 0, translateY: 10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 350}}
                        style={{
                            backgroundColor: THEME.card,
                            borderRadius: 26,
                            padding: 18,
                            borderWidth: 1,
                            borderColor: THEME.line,
                            marginBottom: 16,
                        }}
                    >
                        <View style={{flexDirection: "row", alignItems: "center", gap: 14}}>
                            <View
                                style={{
                                    width: 78,
                                    height: 78,
                                    borderRadius: 999,
                                    backgroundColor: THEME.primary,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons name="person" size={36} color="white"/>
                            </View>

                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 20, fontWeight: "800", color: THEME.text}}>{name}</Text>
                                <Text style={{
                                    marginTop: 6,
                                    color: THEME.muted,
                                    fontWeight: "600"
                                }}>{roleLabel(role)}</Text>

                                <View style={{height: 10}}/>

                                <View style={{flexDirection: "row", flexWrap: "wrap", gap: 10}}>
                                    <Tag text={phone}/>
                                    <Tag text={email}/>
                                </View>
                            </View>
                        </View>

                        <View style={{height: 14}}/>

                        {/* quick row */}
                        <View style={{flexDirection: "row", gap: 10}}>
                            <ActionPill
                                icon="shield-checkmark-outline"
                                label="безопасность"
                                onPress={() => openInfo("безопасность", "смена пароля и контроль сессий добавим позже.")}
                            />
                            <ActionPill
                                icon="help-circle-outline"
                                label="поддержка"
                                onPress={() => openInfo("поддержка", "чат поддержки будет здесь.\nпока: demo экран.")}
                            />
                            <ActionPill
                                icon="log-out-outline"
                                label="выйти"
                                danger
                                onPress={() => openInfo("выход", "в прототипе просто заглушка. позже тут будет logout.", "ок", closeModal)}
                            />
                        </View>
                    </MotiView>

                    {/* ROLE SECTIONS */}
                    {roleSections.map((section, si) => (
                        <View key={`${section.title}_${si}`} style={{marginBottom: 16}}>
                            <SectionTitle title={section.title}/>

                            <View style={{gap: 10}}>
                                {section.items.map((it, idx) => (
                                    <ClickableRow
                                        key={`${it.label}_${idx}`}
                                        icon={it.icon as any}
                                        title={it.label}
                                        subtitle={it.hint}
                                        onPress={() => handleItemPress(it.label)}
                                    />
                                ))}

                                {"footer" in section && (section as any).footer ? (
                                    <TouchableOpacity
                                        onPress={() => openInfo("добавить", "добавление ребёнка подключим позже.")}
                                        style={{
                                            marginTop: 2,
                                            alignSelf: "flex-start",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 10,
                                            paddingVertical: 10,
                                            paddingHorizontal: 12,
                                            borderRadius: 999,
                                            backgroundColor: THEME.soft,
                                            borderWidth: 1,
                                            borderColor: THEME.line,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: 999,
                                                backgroundColor: THEME.primary,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Ionicons name={(section as any).footer.icon} size={18} color="white"/>
                                        </View>
                                        <Text style={{fontWeight: "900", color: THEME.primary}}>
                                            {(section as any).footer.label}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                    ))}

                    {/* SUBSCRIPTION */}
                    {subscriptionVisible && role ? (
                        <View style={{marginTop: 8}}>
                            <SectionTitle title="подписка"/>

                            <View
                                style={{
                                    backgroundColor: THEME.card,
                                    borderRadius: 26,
                                    padding: 18,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                }}
                            >
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}>
                                    <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                        <View
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 16,
                                                backgroundColor: THEME.soft,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Feather name="credit-card" size={20} color={THEME.primary}/>
                                        </View>

                                        <View>
                                            <Text style={{fontSize: 16, fontWeight: "900", color: THEME.text}}>
                                                {subscriptionName}
                                            </Text>
                                            <Text style={{
                                                marginTop: 3,
                                                color: THEME.muted,
                                                fontWeight: "700",
                                                fontSize: 12
                                            }}>
                                                выбранный план
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => router.push("profile/common/subscribe")}
                                        style={{
                                            backgroundColor: THEME.primary,
                                            paddingVertical: 12,
                                            paddingHorizontal: 14,
                                            borderRadius: 16,
                                        }}
                                    >
                                        <Text style={{color: "white", fontWeight: "900"}}>управлять</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{height: 14}}/>

                                <TouchableOpacity
                                    onPress={() => openInfo("оплата", "в прототипе оплата не подключена.\nпозже: kaspi / card / invoice.")}
                                    style={{
                                        backgroundColor: THEME.soft,
                                        borderRadius: 18,
                                        padding: 14,
                                        borderWidth: 1,
                                        borderColor: THEME.line,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text style={{fontWeight: "800", color: THEME.text}}>история оплат</Text>
                                    <Ionicons name="chevron-forward" size={18} color={THEME.primary}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                </View>

                <SimpleModal
                    visible={!!activeModal}
                    title={activeModal?.title ?? ""}
                    text={activeModal?.text ?? ""}
                    primaryLabel={activeModal?.primaryLabel}
                    onClose={closeModal}
                    onPrimary={activeModal?.onPrimary}
                />
            </ScrollView>
        </LinearGradient>
    );
}

function SectionTitle({title}: { title: string }) {
    return (
        <View style={{marginBottom: 10, marginTop: 6}}>
            <Text style={{fontSize: 18, fontWeight: "900", color: THEME.text}}>{title}</Text>
        </View>
    );
}

function Tag({text}: { text: string }) {
    return (
        <View
            style={{
                backgroundColor: THEME.soft,
                borderRadius: 999,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: THEME.line,
            }}
        >
            <Text style={{color: THEME.primary, fontWeight: "800", fontSize: 12}}>{text}</Text>
        </View>
    );
}

function ActionPill({
                        icon,
                        label,
                        onPress,
                        danger,
                    }: {
    icon: any;
    label: string;
    onPress: () => void;
    danger?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flex: 1,
                backgroundColor: danger ? "rgba(220,38,38,0.12)" : THEME.soft,
                borderRadius: 18,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: danger ? "rgba(220,38,38,0.25)" : THEME.line,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
            }}
        >
            <Ionicons name={icon} size={18} color={danger ? "#DC2626" : THEME.primary}/>
            <Text style={{fontWeight: "900", color: danger ? "#DC2626" : THEME.primary}}>{label}</Text>
        </TouchableOpacity>
    );
}

function ClickableRow({
                          icon,
                          title,
                          subtitle,
                          onPress,
                      }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: THEME.card,
                borderRadius: 22,
                padding: 16,
                borderWidth: 1,
                borderColor: THEME.line,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <View style={{flexDirection: "row", alignItems: "center", gap: 12, flex: 1}}>
                <View
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 16,
                        backgroundColor: THEME.soft,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons name={icon} size={20} color={THEME.primary}/>
                </View>

                <View style={{flex: 1}}>
                    <Text style={{fontWeight: "900", color: THEME.text, fontSize: 15}} numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text style={{marginTop: 4, color: THEME.muted, fontWeight: "700", fontSize: 12}}
                              numberOfLines={2}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={THEME.primary}/>
        </TouchableOpacity>
    );
}

function SimpleModal({
                         visible,
                         title,
                         text,
                         primaryLabel,
                         onClose,
                         onPrimary,
                     }: {
    visible: boolean;
    title: string;
    text: string;
    primaryLabel?: string;
    onClose: () => void;
    onPrimary?: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(15,23,42,0.55)",
                    justifyContent: "center",
                    paddingHorizontal: 18,
                }}
            >
                <Pressable onPress={() => {
                }} style={{width: "100%"}}>
                    <MotiView
                        from={{opacity: 0, translateY: 18, scale: 0.98}}
                        animate={{opacity: 1, translateY: 0, scale: 1}}
                        transition={{duration: 220}}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 24,
                            padding: 18,
                            borderWidth: 1,
                            borderColor: THEME.line,
                        }}
                    >
                        <Pressable onPress={onClose} style={{position: "absolute", right: 10, top: 10, padding: 8}}>
                            <Feather name="x" size={20} color={THEME.text}/>
                        </Pressable>

                        <Text style={{fontSize: 18, fontWeight: "900", color: THEME.text, marginBottom: 10}}>
                            {title}
                        </Text>

                        <Text style={{color: THEME.muted, fontWeight: "700", lineHeight: 20}}>
                            {text}
                        </Text>

                        <View style={{height: 14}}/>

                        <View style={{flexDirection: "row", gap: 10}}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 18,
                                    backgroundColor: THEME.soft,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{fontWeight: "900", color: THEME.primary}}>закрыть</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    if (onPrimary) onPrimary();
                                    else onClose();
                                }}
                                style={{
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 18,
                                    backgroundColor: THEME.primary,
                                    alignItems: "center",
                                }}
                            >
                                <Text style={{fontWeight: "900", color: "white"}}>{primaryLabel ?? "ок"}</Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}