import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    Platform,
    Dimensions,
    Image,
    TouchableOpacity,
    Pressable,
    Modal,
    TextInput,
    Animated,
    Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import {LinearGradient} from "expo-linear-gradient";
import {MotiView, AnimatePresence} from "moti";
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * home screen (demo ui) — интерактивные карточки + модалки
 * для бэкенда: все данные (уведомления/активности/бейджи) сведены в структуры ниже,
 * потом их можно заменить на ответы API без переписывания разметки.
 */

type Role = "parent" | "youth" | "mentor" | "org";

type ActivityId =
    | "open_chats"
    | "open_calendar"
    | "open_catalog"
    | "open_profile"
    | "open_progress"
    | "open_requests"
    | "open_reports"
    | "open_attendance"
    | "open_achievements"
    | "open_test"
    | "open_results"
    | "open_students";

type Activity = {
    id: ActivityId;
    title: string;
    subtitle: string;
    icon: keyof typeof Feather.glyphMap;
    tone: "primary" | "soft" | "warn" | "ok";
    badge?: string;
    cta?: string;
};

type KPI = {
    label: string;
    value: string;
    icon: keyof typeof Feather.glyphMap;
};

type HomeContent = {
    greeting: string;
    nameHint?: string;
    heroTitle: string;
    heroSubtitle: string;
    heroTag?: string;
    kpis: KPI[];
    activities: Activity[];
    quickActions: Array<{
        id: ActivityId;
        label: string;
        icon: keyof typeof Feather.glyphMap;
        description: string;
    }>;
};

const THEME = {
    primary: "#3F3C9F",
    primary2: "#8D88D9",
    deep: "#2E2C79",
    bgTop: "#FFFFFF",
    bgBottom: "#F3F2FF",
    card: "#FFFFFF",
    soft: "#EEF0FF",
    text: "#0F172A",
    muted: "#6B7280",
    line: "rgba(15, 23, 42, 0.08)",
};

const getIsDesktop = (w: number) => Platform.OS === "web" && w >= 900;

function useViewport() {
    const [vw, setVw] = useState(Dimensions.get("window").width);
    useEffect(() => {
        const sub = Dimensions.addEventListener("change", ({window}) => setVw(window.width));
        return () => sub?.remove?.();
    }, []);
    const isDesktop = getIsDesktop(vw);
    // на моб.веб часто ломается ширина из-за 100% и внутренних паддингов — поэтому clamp
    const contentMax = isDesktop ? Math.min(860, Math.floor(vw * 0.6)) : vw;
    return {vw, isDesktop, contentMax};
}

function clamp(n: number, min: number, max: number) {
    "worklet";
    return Math.max(min, Math.min(max, n));
}

/* ----------------------- данные по ролям ----------------------- */

const ROLE_CONTENT: Record<Role, HomeContent> = {
    mentor: {
        greeting: "Добро пожаловать",
        nameHint: "Панель ментора",
        heroTitle: "Сегодня активные чаты и заявки",
        heroSubtitle: "Быстрые действия, чтобы не терять темп.",
        heroTag: "mentor",
        kpis: [
            {label: "Активные чаты", value: "3", icon: "message-square"},
            {label: "Проверок", value: "5", icon: "file-text"},
            {label: "Созвоны", value: "2", icon: "video"},
        ],
        quickActions: [
            {
                id: "open_chats",
                label: "Чаты",
                icon: "message-square",
                description: "Перейти к переписке",
            },
            {
                id: "open_students",
                label: "Ученики",
                icon: "users",
                description: "Список и статусы",
            },
            {
                id: "open_reports",
                label: "Отчёты",
                icon: "file-text",
                description: "Проверка заданий",
            },
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Расписание занятий",
            },
        ],
        activities: [
            {
                id: "open_requests",
                title: "Новый запрос",
                subtitle: "1 новый ученик ожидает ответа",
                icon: "inbox",
                tone: "primary",
                badge: "1",
                cta: "Открыть",
            },
            {
                id: "open_reports",
                title: "Проверка отчёта",
                subtitle: "2 отчёта в очереди",
                icon: "file-text",
                tone: "soft",
                badge: "2",
                cta: "Проверить",
            },
            {
                id: "open_calendar",
                title: "Созвон с учеником",
                subtitle: "Сегодня в 18:30",
                icon: "video",
                tone: "ok",
                cta: "Посмотреть",
            },
        ],
    },
    parent: {
        greeting: "Добро пожаловать",
        nameHint: "Кабинет родителя",
        heroTitle: "Прогресс ребёнка за неделю",
        heroSubtitle: "Рекомендации и события по расписанию.",
        heroTag: "parent",
        kpis: [
            {label: "Занятий", value: "4", icon: "activity"},
            {label: "Достижений", value: "2", icon: "award"},
            {label: "Тестов", value: "1", icon: "check-circle"},
        ],
        quickActions: [
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Секции и занятия",
            },
            {
                id: "open_results",
                label: "Результаты",
                icon: "bar-chart-2",
                description: "Итоги диагностики",
            },
            {
                id: "open_catalog",
                label: "Каталог",
                icon: "grid",
                description: "Кружки и курсы",
            },
            {
                id: "open_profile",
                label: "Профиль",
                icon: "user",
                description: "Дети и данные",
            },
        ],
        activities: [
            {
                id: "open_results",
                title: "Результаты теста",
                subtitle: "Готов краткий отчёт и советы",
                icon: "bar-chart-2",
                tone: "primary",
                cta: "Открыть",
            },
            {
                id: "open_catalog",
                title: "Рекомендация",
                subtitle: "3 направления под интерес ребёнка",
                icon: "compass",
                tone: "soft",
                badge: "3",
                cta: "Посмотреть",
            },
            {
                id: "open_calendar",
                title: "Ближайшее занятие",
                subtitle: "Завтра в 18:00",
                icon: "clock",
                tone: "ok",
                cta: "К расписанию",
            },
        ],
    },
    youth: {
        greeting: "Привет",
        nameHint: "Твой прогресс",
        heroTitle: "Готов продолжить обучение?",
        heroSubtitle: "Открой урок или посмотри календарь.",
        heroTag: "youth",
        kpis: [
            {label: "Курсов", value: "3", icon: "book-open"},
            {label: "Стрик", value: "5 дней", icon: "zap"},
            {label: "Достижений", value: "7", icon: "star"},
        ],
        quickActions: [
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Занятия и дедлайны",
            },
            {
                id: "open_progress",
                label: "Прогресс",
                icon: "trending-up",
                description: "Сводка по курсам",
            },
            {
                id: "open_test",
                label: "Тест",
                icon: "check-circle",
                description: "Быстрая диагностика",
            },
            {
                id: "open_achievements",
                label: "Достижения",
                icon: "award",
                description: "Награды и бейджи",
            },
        ],
        activities: [
            {
                id: "open_progress",
                title: "Новый урок",
                subtitle: "Открыт следующий модуль",
                icon: "book-open",
                tone: "primary",
                cta: "Начать",
            },
            {
                id: "open_test",
                title: "Доступный тест",
                subtitle: "Займёт около 5 минут",
                icon: "check-circle",
                tone: "soft",
                cta: "Пройти",
            },
            {
                id: "open_achievements",
                title: "Новое достижение",
                subtitle: "Поздравляю, +1 бейдж",
                icon: "star",
                tone: "ok",
                badge: "+1",
                cta: "Открыть",
            },
        ],
    },
    org: {
        greeting: "Добро пожаловать",
        nameHint: "Панель организации",
        heroTitle: "Сводная статистика центра",
        heroSubtitle: "Заявки, группы и посещаемость в одном месте.",
        heroTag: "org",
        kpis: [
            {label: "Заявок", value: "6", icon: "user-plus"},
            {label: "Групп", value: "18", icon: "layers"},
            {label: "Посещ.", value: "92%", icon: "activity"},
        ],
        quickActions: [
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Расписание групп",
            },
            {
                id: "open_requests",
                label: "Заявки",
                icon: "user-plus",
                description: "Новые регистрации",
            },
            {
                id: "open_reports",
                label: "Отчёты",
                icon: "pie-chart",
                description: "Сводки по группам",
            },
            {
                id: "open_attendance",
                label: "Посещаемость",
                icon: "activity",
                description: "Статистика занятий",
            },
        ],
        activities: [
            {
                id: "open_requests",
                title: "Новые заявки",
                subtitle: "6 заявок за последние 24 часа",
                icon: "user-plus",
                tone: "primary",
                badge: "6",
                cta: "Открыть",
            },
            {
                id: "open_reports",
                title: "Отчёты групп",
                subtitle: "Сформированы отчёты за неделю",
                icon: "pie-chart",
                tone: "soft",
                cta: "Посмотреть",
            },
            {
                id: "open_attendance",
                title: "Посещаемость",
                subtitle: "Среднее значение: 92%",
                icon: "activity",
                tone: "ok",
                cta: "Аналитика",
            },
        ],
    },
};

/* ----------------------- навигация действий ----------------------- */

function resolveRoute(actionId: ActivityId, role: Role): string | null {
    // под твой проект — тут легко менять, бэкендеру понятно
    switch (actionId) {
        case "open_chats":
            return "/(tabs)/chats";
        case "open_calendar":
            // ты заменил analytics на calendar — пусть ведёт туда
            return "/(tabs)/analytics";
        case "open_catalog":
            return "/(tabs)/catalog";
        case "open_profile":
            return "/(tabs)/profile";
        case "open_progress":
            return "/(tabs)/home"; // пока заглушка
        case "open_requests":
            return "/(tabs)/home"; // заглушка
        case "open_reports":
            return "/(tabs)/home"; // заглушка
        case "open_attendance":
            return "/(tabs)/home"; // заглушка
        case "open_achievements":
            return "/(tabs)/home"; // заглушка
        case "open_test":
            if (role === "parent") return "/profile/parent/testing";
            if (role === "youth") return "/profile/youth/testing";
            if (role === "org") return "/profile/org/testing";
            return null;
        case "open_results":
            if (role === "parent") return "/profile/parent/results";
            if (role === "youth") return "/profile/youth/results";
            if (role === "org") return "/profile/org/results";
            return null;
        case "open_students":
            return "/(tabs)/home"; // заглушка
        default:
            return null;
    }
}

/* ----------------------- ui helpers ----------------------- */

function toneToGrad(tone: Activity["tone"]) {
    switch (tone) {
        case "primary":
            return [THEME.primary, THEME.primary2];
        case "ok":
            return ["#2E2C79", "#8D88D9"];
        case "warn":
            return ["#7C2D12", "#F59E0B"];
        case "soft":
        default:
            return ["#EEF0FF", "#FFFFFF"];
    }
}

function toneToIconBg(tone: Activity["tone"]) {
    switch (tone) {
        case "primary":
            return THEME.primary;
        case "ok":
            return THEME.deep;
        case "warn":
            return "#F59E0B";
        case "soft":
        default:
            return "#EEF0FF";
    }
}

function textOnTone(tone: Activity["tone"]) {
    return tone === "soft" ? THEME.text : "#FFFFFF";
}

/* ----------------------- главный экран ----------------------- */

export default function HomeScreen() {
    const router = useRouter();
    const {vw, isDesktop, contentMax} = useViewport();

    const [role, setRole] = useState<Role | null>(null);
    const [name, setName] = useState("Халилова Сабина"); // заглушка под бэкенд
    const [modalOpen, setModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState<Activity | null>(null);

    // мини-тост снизу (без библиотек)
    const toastY = useRef(new Animated.Value(40)).current;
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const [toastText, setToastText] = useState<string | null>(null);

    const showToast = useCallback(
        (text: string) => {
            setToastText(text);
            Animated.parallel([
                Animated.timing(toastOpacity, {
                    toValue: 1,
                    duration: 160,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad),
                }),
                Animated.timing(toastY, {
                    toValue: 0,
                    duration: 160,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad),
                }),
            ]).start(() => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(toastOpacity, {
                            toValue: 0,
                            duration: 180,
                            useNativeDriver: true,
                            easing: Easing.in(Easing.quad),
                        }),
                        Animated.timing(toastY, {
                            toValue: 40,
                            duration: 180,
                            useNativeDriver: true,
                            easing: Easing.in(Easing.quad),
                        }),
                    ]).start(() => setToastText(null));
                }, 1400);
            });
        },
        [toastOpacity, toastY]
    );

    useEffect(() => {
        AsyncStorage.getItem("user_role").then((v) => {
            const r = (v as Role) || "parent";
            setRole(r);
        });
    }, []);

    const data = useMemo(() => {
        const r = role ?? "parent";
        return ROLE_CONTENT[r];
    }, [role]);

    const openDetails = useCallback((item: Activity) => {
        setModalItem(item);
        setModalOpen(true);
    }, []);

    const closeDetails = useCallback(() => {
        setModalOpen(false);
        setTimeout(() => setModalItem(null), 120);
    }, []);

    const onAction = useCallback(
        (actionId: ActivityId) => {
            const r = role ?? "parent";
            const route = resolveRoute(actionId, r);

            if (!route) {
                showToast("пока это заглушка, подключим позже");
                return;
            }

            // для web иногда лучше replace, но тут push ок
            router.push(route as any);
        },
        [router, role, showToast]
    );

    const containerWidth = useMemo(() => {
        if (!isDesktop) return "100%";
        return Math.min(contentMax, 860);
    }, [contentMax, isDesktop]);

    return (
        <LinearGradient colors={[THEME.bgTop, THEME.bgBottom]} style={{flex: 1}}>
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{
                    paddingTop: Platform.OS === "web" ? 28 : 26,
                    paddingBottom: 140,
                    paddingHorizontal: 16,
                    alignItems: isDesktop ? "center" : "stretch",
                }}
            >
                {/* logo */}
                <MotiView
                    from={{opacity: 0, translateY: -10}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 360}}
                    style={{
                        alignItems: "center",
                        marginBottom: 16,
                        marginTop: isDesktop ? 26 : 10,
                        width: containerWidth as any,
                    }}
                >
                    <Image
                        source={require("../../../assets/logo/logo_blue.png")}
                        style={{width: 150, height: 60, resizeMode: "contain"}}
                    />
                </MotiView>

                {/* wrapper */}
                <View style={{width: containerWidth as any, alignSelf: "center"}}>
                    <HeaderBlock
                        greeting={data.greeting}
                        name={name}
                        hint={data.nameHint}
                        onPressProfile={() => onAction("open_profile")}
                        onPressCalendar={() => onAction("open_calendar")}
                        isDesktop={isDesktop}
                    />

                    <HeroCard
                        title={data.heroTitle}
                        subtitle={data.heroSubtitle}
                        tag={data.heroTag}
                        onPress={() => {
                            // открыть модалку как "сводка"
                            openDetails({
                                id: "open_calendar",
                                title: data.heroTitle,
                                subtitle: data.heroSubtitle,
                                icon: "calendar",
                                tone: "primary",
                                cta: "Открыть",
                            });
                        }}
                    />

                    <KPIGrid items={data.kpis} isDesktop={isDesktop}/>

                    <QuickActions
                        items={data.quickActions}
                        isDesktop={isDesktop}
                        onPress={(id) => onAction(id)}
                    />

                    <SectionTitle title="Активности" rightHint="нажми, чтобы открыть"/>

                    <ActivityList
                        items={data.activities}
                        onPress={(item) => openDetails(item)}
                    />

                    {/* подсказка для будущего бэкенда */}
                    <BackendHintCard/>

                    {/* модалка */}
                    <ActionModal
                        visible={modalOpen}
                        item={modalItem}
                        onClose={closeDetails}
                        onPrimary={() => {
                            if (!modalItem) return;
                            closeDetails();
                            setTimeout(() => onAction(modalItem.id), 140);
                        }}
                        onSecondary={() => {
                            closeDetails();
                            showToast("добавлено в избранное (заглушка)");
                        }}
                        onTertiary={() => {
                            closeDetails();
                            showToast("помечено как выполнено (заглушка)");
                        }}
                    />
                </View>

                {/* toast */}
                <AnimatePresence>
                    {toastText ? (
                        <Animated.View
                            style={{
                                position: "absolute",
                                left: 16,
                                right: 16,
                                bottom: Platform.OS === "web" ? 18 : 22,
                                opacity: toastOpacity,
                                transform: [{translateY: toastY}],
                                alignSelf: "center",
                                maxWidth: 680,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "rgba(15, 23, 42, 0.92)",
                                    borderRadius: 16,
                                    paddingVertical: 12,
                                    paddingHorizontal: 14,
                                }}
                            >
                                <Text style={{color: "white", textAlign: "center", fontWeight: "600"}}>
                                    {toastText}
                                </Text>
                            </View>
                        </Animated.View>
                    ) : null}
                </AnimatePresence>
            </ScrollView>
        </LinearGradient>
    );
}

/* ----------------------- компоненты ----------------------- */

function HeaderBlock({
                         greeting,
                         name,
                         hint,
                         onPressProfile,
                         onPressCalendar,
                         isDesktop,
                     }: {
    greeting: string;
    name: string;
    hint?: string;
    onPressProfile: () => void;
    onPressCalendar: () => void;
    isDesktop: boolean;
}) {
    return (
        <MotiView
            from={{opacity: 0, translateY: 12}}
            animate={{opacity: 1, translateY: 0}}
            transition={{duration: 420}}
            style={{marginBottom: 14}}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <View style={{flex: 1}}>
                    <Text
                        style={{
                            fontSize: isDesktop ? 28 : 24,
                            fontWeight: "800",
                            color: THEME.text,
                        }}
                    >
                        {greeting}
                    </Text>
                    <Text style={{marginTop: 4, color: THEME.muted, fontWeight: "600"}}>
                        {hint ? `${hint} · ${name}` : name}
                    </Text>
                </View>

                <View style={{flexDirection: "row", gap: 10}}>
                    <Pressable
                        onPress={onPressCalendar}
                        style={({pressed}) => ({
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            backgroundColor: THEME.soft,
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: pressed ? 0.85 : 1,
                        })}
                    >
                        <Feather name="calendar" size={20} color={THEME.primary}/>
                    </Pressable>

                    <Pressable
                        onPress={onPressProfile}
                        style={({pressed}) => ({
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            backgroundColor: THEME.soft,
                            justifyContent: "center",
                            alignItems: "center",
                            opacity: pressed ? 0.85 : 1,
                        })}
                    >
                        <Feather name="user" size={20} color={THEME.primary}/>
                    </Pressable>
                </View>
            </View>
        </MotiView>
    );
}

function HeroCard({
                      title,
                      subtitle,
                      tag,
                      onPress,
                  }: {
    title: string;
    subtitle: string;
    tag?: string;
    onPress: () => void;
}) {
    return (
        <MotiView
            from={{opacity: 0, scale: 0.96}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 420}}
            style={{borderRadius: 26, overflow: "hidden", marginBottom: 16}}
        >
            <Pressable onPress={onPress} style={({pressed}) => ({opacity: pressed ? 0.96 : 1})}>
                <LinearGradient
                    colors={[THEME.primary, THEME.primary2]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                        padding: 18,
                        minHeight: 160,
                        justifyContent: "space-between",
                    }}
                >
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <View
                            style={{
                                backgroundColor: "rgba(255,255,255,0.18)",
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 999,
                            }}
                        >
                            <Text style={{color: "white", fontWeight: "700", fontSize: 12}}>
                                {tag ? tag : "umo"}
                            </Text>
                        </View>

                        <View style={{flexDirection: "row", gap: 8}}>
                            <View
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.18)",
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderRadius: 999,
                                }}
                            >
                                <Text style={{color: "white", fontWeight: "700", fontSize: 12}}>
                                    обновлено
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={{color: "white", fontSize: 20, fontWeight: "800", lineHeight: 26}}>
                            {title}
                        </Text>
                        <Text style={{color: "rgba(255,255,255,0.86)", marginTop: 8, fontWeight: "600"}}>
                            {subtitle}
                        </Text>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={{color: "rgba(255,255,255,0.86)", fontWeight: "700", fontSize: 12}}>
                            нажми, чтобы открыть
                        </Text>
                        <View
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 14,
                                backgroundColor: "rgba(255,255,255,0.18)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Feather name="arrow-right" size={18} color="white"/>
                        </View>
                    </View>
                </LinearGradient>
            </Pressable>
        </MotiView>
    );
}

function KPIGrid({items, isDesktop}: { items: KPI[]; isDesktop: boolean }) {
    const cols = isDesktop ? 3 : 3;

    return (
        <View style={{flexDirection: "row", gap: 10, marginBottom: 16}}>
            {items.slice(0, cols).map((k, idx) => (
                <MotiView
                    key={k.label}
                    from={{opacity: 0, translateY: 10}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 360, delay: 120 + idx * 70}}
                    style={{
                        flex: 1,
                        backgroundColor: THEME.card,
                        borderRadius: 20,
                        padding: 14,
                        borderWidth: 1,
                        borderColor: THEME.line,
                    }}
                >
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 14,
                                backgroundColor: THEME.soft,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Feather name={k.icon} size={18} color={THEME.primary}/>
                        </View>
                        <Text style={{fontWeight: "900", fontSize: 18, color: THEME.text}}>{k.value}</Text>
                    </View>
                    <Text style={{marginTop: 10, color: THEME.muted, fontWeight: "700", fontSize: 12}}>
                        {k.label}
                    </Text>
                </MotiView>
            ))}
        </View>
    );
}

function QuickActions({
                          items,
                          isDesktop,
                          onPress,
                      }: {
    items: HomeContent["quickActions"];
    isDesktop: boolean;
    onPress: (id: ActivityId) => void;
}) {
    const columns = isDesktop ? 4 : 2;
    const gap = 10;

    return (
        <View style={{marginBottom: 18}}>
            <SectionTitle title="Быстрые действия" rightHint="2 клика вместо 6"/>
            <View style={{flexDirection: "row", flexWrap: "wrap", gap}}>
                {items.map((a, idx) => (
                    <MotiView
                        key={a.id}
                        from={{opacity: 0, translateY: 10}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 360, delay: 120 + idx * 70}}
                        style={{
                            width: `calc(${100 / columns}% - ${gap - gap / columns}px)` as any,
                            minWidth: columns === 2 ? "48%" : 180,
                            flexGrow: 1,
                        }}
                    >
                        <Pressable
                            onPress={() => onPress(a.id)}
                            style={({pressed}) => ({
                                backgroundColor: THEME.card,
                                borderRadius: 22,
                                padding: 14,
                                borderWidth: 1,
                                borderColor: THEME.line,
                                opacity: pressed ? 0.94 : 1,
                            })}
                        >
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
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
                                    <Feather name={a.icon} size={20} color={THEME.primary}/>
                                </View>
                                <Feather name="chevron-right" size={18} color={THEME.muted}/>
                            </View>

                            <Text style={{marginTop: 12, fontSize: 16, fontWeight: "800", color: THEME.text}}>
                                {a.label}
                            </Text>
                            <Text style={{marginTop: 6, fontSize: 12, fontWeight: "600", color: THEME.muted}}>
                                {a.description}
                            </Text>
                        </Pressable>
                    </MotiView>
                ))}
            </View>
        </View>
    );
}

function SectionTitle({title, rightHint}: { title: string; rightHint?: string }) {
    return (
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10}}>
            <Text style={{fontSize: 18, fontWeight: "900", color: THEME.text}}>{title}</Text>
            {rightHint ? <Text style={{color: THEME.muted, fontWeight: "700", fontSize: 12}}>{rightHint}</Text> : null}
        </View>
    );
}

function ActivityList({
                          items,
                          onPress,
                      }: {
    items: Activity[];
    onPress: (item: Activity) => void;
}) {
    return (
        <View style={{marginBottom: 16}}>
            {items.map((item, index) => {
                const grad = toneToGrad(item.tone);
                const onTone = textOnTone(item.tone);
                const iconBg = toneToIconBg(item.tone);

                return (
                    <MotiView
                        key={item.id}
                        from={{opacity: 0, translateY: 14}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 380, delay: 120 + index * 90}}
                        style={{marginBottom: 12}}
                    >
                        <Pressable
                            onPress={() => onPress(item)}
                            style={({pressed}) => ({
                                opacity: pressed ? 0.96 : 1,
                            })}
                        >
                            <LinearGradient
                                colors={grad as any}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{
                                    borderRadius: 22,
                                    padding: 14,
                                    overflow: "hidden",
                                }}
                            >
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <View
                                        style={{
                                            width: 54,
                                            height: 54,
                                            borderRadius: 18,
                                            backgroundColor: item.tone === "soft" ? THEME.primary : "rgba(255,255,255,0.18)",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: 12,
                                        }}
                                    >
                                        <Feather
                                            name={item.icon}
                                            size={22}
                                            color={item.tone === "soft" ? "white" : "white"}
                                        />
                                    </View>

                                    <View style={{flex: 1}}>
                                        <Text style={{fontSize: 16, fontWeight: "900", color: onTone}}>
                                            {item.title}
                                        </Text>
                                        <Text style={{
                                            marginTop: 4,
                                            fontWeight: "600",
                                            color: item.tone === "soft" ? THEME.muted : "rgba(255,255,255,0.86)"
                                        }}>
                                            {item.subtitle}
                                        </Text>
                                    </View>

                                    <View style={{alignItems: "flex-end", gap: 8}}>
                                        {item.badge ? (
                                            <View
                                                style={{
                                                    backgroundColor: item.tone === "soft" ? THEME.primary : "rgba(255,255,255,0.18)",
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 4,
                                                    borderRadius: 999,
                                                }}
                                            >
                                                <Text style={{color: "white", fontWeight: "900", fontSize: 12}}>
                                                    {item.badge}
                                                </Text>
                                            </View>
                                        ) : null}

                                        <View style={{flexDirection: "row", alignItems: "center", gap: 6}}>
                                            <Text
                                                style={{
                                                    color: item.tone === "soft" ? THEME.primary : "rgba(255,255,255,0.9)",
                                                    fontWeight: "900",
                                                    fontSize: 12,
                                                }}
                                            >
                                                {item.cta ?? "Открыть"}
                                            </Text>
                                            <Feather
                                                name="arrow-right"
                                                size={16}
                                                color={item.tone === "soft" ? THEME.primary : "white"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    </MotiView>
                );
            })}
        </View>
    );
}

function BackendHintCard() {
    const [open, setOpen] = useState(false);
    const [endpoint, setEndpoint] = useState("/api/home");
    const [note, setNote] = useState("В будущем заменим демо-данные на API.");

    return (
        <View style={{marginTop: 6}}>
            <Pressable
                onPress={() => setOpen((v) => !v)}
                style={({pressed}) => ({
                    backgroundColor: THEME.card,
                    borderRadius: 22,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: THEME.line,
                    opacity: pressed ? 0.96 : 1,
                })}
            >
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 16,
                                backgroundColor: THEME.soft,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <MaterialCommunityIcons name="api" size={20} color={THEME.primary}/>
                        </View>
                        <View>
                            <Text style={{fontWeight: "900", color: THEME.text}}>Заметка для интеграции</Text>
                            <Text style={{marginTop: 3, fontWeight: "600", color: THEME.muted}}>
                                структура данных уже выделена
                            </Text>
                        </View>
                    </View>

                    <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color={THEME.muted}/>
                </View>

                <AnimatePresence>
                    {open ? (
                        <MotiView
                            from={{opacity: 0, translateY: 8}}
                            animate={{opacity: 1, translateY: 0}}
                            exit={{opacity: 0, translateY: 8}}
                            transition={{duration: 220}}
                            style={{marginTop: 12}}
                        >
                            <Text style={{color: THEME.muted, fontWeight: "700", fontSize: 12, marginBottom: 10}}>
                                можно заменить AsyncStorage на secure store и данные подтягивать по endpoint
                            </Text>

                            <View
                                style={{
                                    backgroundColor: "#F8FAFF",
                                    borderRadius: 16,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                    gap: 10,
                                }}
                            >
                                <View>
                                    <Text
                                        style={{fontWeight: "800", color: THEME.text, marginBottom: 6}}>endpoint</Text>
                                    <TextInput
                                        value={endpoint}
                                        onChangeText={setEndpoint}
                                        placeholder="/api/home"
                                        placeholderTextColor={THEME.muted}
                                        style={{
                                            backgroundColor: "white",
                                            borderRadius: 14,
                                            paddingHorizontal: 12,
                                            paddingVertical: 10,
                                            borderWidth: 1,
                                            borderColor: THEME.line,
                                            fontWeight: "700",
                                        }}
                                    />
                                </View>

                                <View>
                                    <Text style={{
                                        fontWeight: "800",
                                        color: THEME.text,
                                        marginBottom: 6
                                    }}>комментарий</Text>
                                    <TextInput
                                        value={note}
                                        onChangeText={setNote}
                                        placeholder="..."
                                        placeholderTextColor={THEME.muted}
                                        style={{
                                            backgroundColor: "white",
                                            borderRadius: 14,
                                            paddingHorizontal: 12,
                                            paddingVertical: 10,
                                            borderWidth: 1,
                                            borderColor: THEME.line,
                                            fontWeight: "700",
                                        }}
                                    />
                                </View>
                            </View>
                        </MotiView>
                    ) : null}
                </AnimatePresence>
            </Pressable>
        </View>
    );
}

/* ----------------------- модалка ----------------------- */

function ActionModal({
                         visible,
                         item,
                         onClose,
                         onPrimary,
                         onSecondary,
                         onTertiary,
                     }: {
    visible: boolean;
    item: Activity | null;
    onClose: () => void;
    onPrimary: () => void;
    onSecondary: () => void;
    onTertiary: () => void;
}) {
    const [internal, setInternal] = useState(false);

    useEffect(() => {
        if (visible) setInternal(true);
        if (!visible) {
            const t = setTimeout(() => setInternal(false), 160);
            return () => clearTimeout(t);
        }
    }, [visible]);

    if (!internal && !visible) return null;

    const tone = item?.tone ?? "soft";
    const grad = toneToGrad(tone);
    const headerText = textOnTone(tone);

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={{flex: 1}}>
                {/* overlay */}
                <Pressable
                    onPress={onClose}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: "rgba(15, 23, 42, 0.55)",
                    }}
                />

                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        paddingHorizontal: 12,
                        paddingBottom: Platform.OS === "ios" ? 22 : 16,
                    }}
                >
                    <MotiView
                        from={{translateY: 28, opacity: 0}}
                        animate={{translateY: 0, opacity: 1}}
                        exit={{translateY: 28, opacity: 0}}
                        transition={{duration: 220}}
                        style={{
                            borderRadius: 26,
                            overflow: "hidden",
                            backgroundColor: "white",
                        }}
                    >
                        <LinearGradient
                            colors={grad as any}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={{padding: 16}}
                        >
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
                                    <View
                                        style={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: 16,
                                            backgroundColor: "rgba(255,255,255,0.18)",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Feather name={(item?.icon ?? "info") as any} size={20} color="white"/>
                                    </View>
                                    <View style={{maxWidth: "78%"}}>
                                        <Text style={{color: headerText, fontWeight: "900", fontSize: 16}}>
                                            {item?.title ?? "Детали"}
                                        </Text>
                                        <Text style={{
                                            color: tone === "soft" ? THEME.muted : "rgba(255,255,255,0.86)",
                                            fontWeight: "700",
                                            marginTop: 4
                                        }}>
                                            {item?.subtitle ?? "—"}
                                        </Text>
                                    </View>
                                </View>

                                <Pressable
                                    onPress={onClose}
                                    style={({pressed}) => ({
                                        width: 42,
                                        height: 42,
                                        borderRadius: 16,
                                        backgroundColor: "rgba(255,255,255,0.18)",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: pressed ? 0.85 : 1,
                                    })}
                                >
                                    <Feather name="x" size={18} color="white"/>
                                </Pressable>
                            </View>
                        </LinearGradient>

                        <View style={{padding: 16}}>
                            <Text style={{color: THEME.muted, fontWeight: "700", lineHeight: 18}}>
                                это прототип поведения: бэкендер заменит заглушки на реальные статусы,
                                дедлайны и данные пользователей. кнопки ниже — точки интеграции.
                            </Text>

                            <View style={{height: 12}}/>

                            <View
                                style={{
                                    backgroundColor: "#F8FAFF",
                                    borderRadius: 18,
                                    padding: 14,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                    gap: 10,
                                }}
                            >
                                <RowLine icon="clock" label="Статус" value="обновлено недавно"/>
                                <RowLine icon="database" label="Источник" value="demo (позже API)"/>
                                <RowLine icon="shield" label="Права" value="роль-зависимая логика"/>
                            </View>

                            <View style={{height: 14}}/>

                            <View style={{flexDirection: "row", gap: 10}}>
                                <Pressable
                                    onPress={onSecondary}
                                    style={({pressed}) => ({
                                        flex: 1,
                                        paddingVertical: 14,
                                        borderRadius: 18,
                                        backgroundColor: THEME.soft,
                                        borderWidth: 1,
                                        borderColor: THEME.line,
                                        alignItems: "center",
                                        opacity: pressed ? 0.9 : 1,
                                    })}
                                >
                                    <Text style={{fontWeight: "900", color: THEME.primary}}>В избранное</Text>
                                </Pressable>

                                <Pressable
                                    onPress={onTertiary}
                                    style={({pressed}) => ({
                                        flex: 1,
                                        paddingVertical: 14,
                                        borderRadius: 18,
                                        backgroundColor: THEME.soft,
                                        borderWidth: 1,
                                        borderColor: THEME.line,
                                        alignItems: "center",
                                        opacity: pressed ? 0.9 : 1,
                                    })}
                                >
                                    <Text style={{fontWeight: "900", color: THEME.primary}}>Выполнено</Text>
                                </Pressable>
                            </View>

                            <View style={{height: 10}}/>

                            <Pressable
                                onPress={onPrimary}
                                style={({pressed}) => ({
                                    paddingVertical: 16,
                                    borderRadius: 20,
                                    backgroundColor: THEME.primary,
                                    alignItems: "center",
                                    opacity: pressed ? 0.92 : 1,
                                })}
                            >
                                <Text style={{color: "white", fontWeight: "900"}}>
                                    {item?.cta ?? "Открыть"}
                                </Text>
                            </Pressable>
                        </View>
                    </MotiView>
                </View>
            </View>
        </Modal>
    );
}

function RowLine({
                     icon,
                     label,
                     value,
                 }: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
}) {
    return (
        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
            <View
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 14,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: THEME.line,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Feather name={icon} size={16} color={THEME.primary}/>
            </View>

            <View style={{flex: 1}}>
                <Text style={{fontWeight: "900", color: THEME.text, fontSize: 12}}>{label}</Text>
                <Text style={{fontWeight: "700", color: THEME.muted, marginTop: 2}}>{value}</Text>
            </View>
        </View>
    );
}