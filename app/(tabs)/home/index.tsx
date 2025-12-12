import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    View,
    Text,
    ScrollView,
    Platform,
    Dimensions,
    Image,
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
import {Feather, MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * home screen (demo ui) — интерактивные карточки + модалки
 * данные сведены в структуры ниже: позже можно заменить на API
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

type ModalContent = {
    title: string;
    text: string;
    ctaLabel?: string;
};

type KPI = {
    label: string;
    value: string;
    icon: keyof typeof Feather.glyphMap;
    modal?: ModalContent;
};

type QuickAction = {
    id: ActivityId;
    label: string;
    icon: keyof typeof Feather.glyphMap;
    description: string;
    modal?: ModalContent;
};

type HomeContent = {
    greeting: string;
    nameHint?: string;
    heroTitle: string;
    heroSubtitle: string;
    heroTag?: string;
    kpis: KPI[];
    activities: Activity[];
    quickActions: QuickAction[];
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
    good: "#16A34A",
    warn: "#F59E0B",
    bad: "#DC2626",
};

const getIsDesktop = (w: number) => Platform.OS === "web" && w >= 900;

function useViewport() {
    const [vw, setVw] = useState(Dimensions.get("window").width);
    useEffect(() => {
        const sub = Dimensions.addEventListener("change", ({window}) => setVw(window.width));
        return () => sub?.remove?.();
    }, []);
    const isDesktop = getIsDesktop(vw);
    const contentMax = isDesktop ? Math.min(860, Math.floor(vw * 0.6)) : vw;
    return {vw, isDesktop, contentMax};
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
            {
                label: "Активные чаты",
                value: "3",
                icon: "message-square",
                modal: {
                    title: "Активные чаты",
                    text: "Показывает количество диалогов с непрочитанными сообщениями и активностью за последние 24 часа. В следующей версии: фильтр по ученикам, приоритеты и теги.",
                },
            },
            {
                label: "Проверок",
                value: "5",
                icon: "file-text",
                modal: {
                    title: "Проверки",
                    text: "Количество заданий/отчётов, ожидающих проверки. В следующей версии: очередь, дедлайны, шаблоны фидбэка и история правок.",
                },
            },
            {
                label: "Созвоны",
                value: "2",
                icon: "video",
                modal: {
                    title: "Созвоны",
                    text: "Запланированные встречи на сегодня. В следующей версии: интеграция календаря, напоминания и быстрые ссылки на материалы занятия.",
                },
            },
        ],
        quickActions: [
            {
                id: "open_chats",
                label: "Чаты",
                icon: "message-square",
                description: "Перейти к переписке",
                modal: {
                    title: "Чаты",
                    text: "Быстрый переход к переписке. Внутри: непрочитанные, важные, фильтр по ученикам.",
                },
            },
            {
                id: "open_students",
                label: "Ученики",
                icon: "users",
                description: "Список и статусы",
                modal: {
                    title: "Ученики",
                    text: "Список учеников и статусы по группе. Внутри: прогресс, задачи, заметки и посещаемость.",
                },
            },
            {
                id: "open_reports",
                label: "Отчёты",
                icon: "file-text",
                description: "Проверка заданий",
                modal: {
                    title: "Отчёты",
                    text: "Окно проверки работ. Внутри: очередь, дедлайны, быстрые шаблоны комментариев.",
                },
            },
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Расписание занятий",
                modal: {
                    title: "Календарь",
                    text: "Расписание занятий и созвонов. Внутри: время, тема, ссылки и заметки.",
                },
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
            {
                label: "Занятий",
                value: "4",
                icon: "activity",
                modal: {title: "Занятия", text: "Количество занятий за неделю. Внутри: посещаемость, темы и комментарии наставника."},
            },
            {
                label: "Достижений",
                value: "2",
                icon: "award",
                modal: {title: "Достижения", text: "Новые достижения ребёнка. Внутри: бейджи, прогресс навыков и рекомендации."},
            },
            {
                label: "Тестов",
                value: "1",
                icon: "check-circle",
                modal: {title: "Тесты", text: "Пройденные диагностики. Внутри: результаты, динамика интересов и советы."},
            },
        ],
        quickActions: [
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Секции и занятия",
                modal: {title: "Календарь", text: "Запись и расписание занятий. Внутри: напоминания, переносы, контакты."},
            },
            {
                id: "open_results",
                label: "Результаты",
                icon: "bar-chart-2",
                description: "Итоги диагностики",
                modal: {title: "Результаты", text: "Краткий отчёт по диагностике. Внутри: рекомендации, объяснения и сравнение периодов."},
            },
            {
                id: "open_catalog",
                label: "Каталог",
                icon: "grid",
                description: "Кружки и курсы",
                modal: {title: "Каталог", text: "Подбор кружков по интересам. Внутри: фильтры, возраст, формат и отзывы."},
            },
            {
                id: "open_profile",
                label: "Профиль",
                icon: "user",
                description: "Дети и данные",
                modal: {title: "Профиль", text: "Профили детей и контакты. Внутри: настройки, фото, документы и уведомления."},
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
        heroSubtitle: "Сегодня можно закрыть 1 маленькую цель.",
        heroTag: "youth",
        kpis: [
            {
                label: "Курсов",
                value: "3",
                icon: "book-open",
                modal: {title: "Курсы", text: "Активные курсы. Внутри: прогресс по модулям, дедлайны и подсказки."},
            },
            {
                label: "Стрик",
                value: "5 дней",
                icon: "zap",
                modal: {title: "Стрик", text: "Серия активности. Внутри: бонусы, восстановление стрика и ежедневные цели."},
            },
            {
                label: "Достижений",
                value: "7",
                icon: "star",
                modal: {title: "Достижения", text: "Награды и бейджи. Внутри: условия, редкость и прогресс до следующего уровня."},
            },
        ],
        quickActions: [
            {
                id: "open_calendar",
                label: "Календарь",
                icon: "calendar",
                description: "Занятия и дедлайны",
                modal: {title: "Календарь", text: "Расписание и дедлайны. Внутри: цели недели и напоминания."},
            },
            {
                id: "open_progress",
                label: "Прогресс",
                icon: "trending-up",
                description: "Сводка по курсам",
                modal: {title: "Прогресс", text: "Сводка по курсам и темам. Внутри: графики, сильные стороны и советы."},
            },
            {
                id: "open_test",
                label: "Тест",
                icon: "check-circle",
                description: "Быстрая диагностика",
                modal: {title: "Тест", text: "Короткая диагностика. Внутри: отчёт, интересы, рекомендации курсов."},
            },
            {
                id: "open_achievements",
                label: "Достижения",
                icon: "award",
                description: "Награды и бейджи",
                modal: {title: "Достижения", text: "Список наград. Внутри: условия, очки, редкость и прогресс."},
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
            {label: "Заявок", value: "6", icon: "user-plus", modal: {title: "Заявки", text: "Новые заявки. Внутри: статусы, ответственные и источники."}},
            {label: "Групп", value: "18", icon: "layers", modal: {title: "Группы", text: "Активные группы центра. Внутри: заполненность, расписание, преподаватели."}},
            {label: "Посещ.", value: "92%", icon: "activity", modal: {title: "Посещаемость", text: "Средняя посещаемость. Внутри: причины пропусков, динамика, рекомендации."}},
        ],
        quickActions: [
            {id: "open_calendar", label: "Календарь", icon: "calendar", description: "Расписание групп", modal: {title: "Календарь", text: "Управление расписанием. Внутри: замены, переносы, уведомления."}},
            {id: "open_requests", label: "Заявки", icon: "user-plus", description: "Новые регистрации", modal: {title: "Заявки", text: "Обработка регистраций. Внутри: статусы, распределение по группам."}},
            {id: "open_reports", label: "Отчёты", icon: "pie-chart", description: "Сводки по группам", modal: {title: "Отчёты", text: "Сводные отчёты. Внутри: экспорт, диаграммы и фильтры."}},
            {id: "open_attendance", label: "Посещаемость", icon: "activity", description: "Статистика занятий", modal: {title: "Посещаемость", text: "Аналитика посещений. Внутри: причины, удержание и напоминания."}},
        ],
        activities: [
            {id: "open_requests", title: "Новые заявки", subtitle: "6 заявок за последние 24 часа", icon: "user-plus", tone: "primary", badge: "6", cta: "Открыть"},
            {id: "open_reports", title: "Отчёты групп", subtitle: "Сформированы отчёты за неделю", icon: "pie-chart", tone: "soft", cta: "Посмотреть"},
            {id: "open_attendance", title: "Посещаемость", subtitle: "Среднее значение: 92%", icon: "activity", tone: "ok", cta: "Аналитика"},
        ],
    },
};

/* ----------------------- навигация действий ----------------------- */

function resolveRoute(actionId: ActivityId, role: Role): string | null {
    switch (actionId) {
        case "open_chats":
            return "/(tabs)/chats";
        case "open_calendar":
            return "/(tabs)/analytics";
        case "open_catalog":
            return "/(tabs)/catalog";
        case "open_profile":
            return "/(tabs)/profile";
        case "open_progress":
            return "/(tabs)/home";
        case "open_requests":
            return "/(tabs)/home";
        case "open_reports":
            return "/(tabs)/home";
        case "open_attendance":
            return "/(tabs)/home";
        case "open_achievements":
            return "/(tabs)/home";
        case "open_test":
            if (role === "parent") return "/profile/parent/testing";
            if (role === "youth") return "/profile/youth/testing";
            if (role === "org") return "/profile/organization/testing";
            return null;
        case "open_results":
            if (role === "parent") return "/profile/parent/results";
            if (role === "youth") return "/profile/youth/results";
            if (role === "org") return "/profile/organization/results";
            return null;
        case "open_students":
            return "/(tabs)/home";
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

function textOnTone(tone: Activity["tone"]) {
    return tone === "soft" ? THEME.text : "#FFFFFF";
}

function roleLabel(role: Role) {
    if (role === "parent") return "родитель";
    if (role === "youth") return "ученик";
    if (role === "mentor") return "ментор";
    return "организация";
}

function roleGoal(role: Role) {
    if (role === "parent") return "контроль прогресса и подбор занятий";
    if (role === "youth") return "понятный план и мотивация";
    if (role === "mentor") return "ведение группы и фидбэк";
    return "аналитика и управление потоками";
}

function formatNowHint(role: Role) {
    if (role === "youth") return "последнее действие: 2 мин назад";
    if (role === "parent") return "обновлено: сегодня 19:40";
    if (role === "mentor") return "обновлено: по группе №2";
    return "обновлено: по центру";
}

type StubRow = {title: string; subtitle?: string; right?: string; tone?: "ok" | "warn" | "muted" | "primary"};

function buildInfoStub(role: Role, title: string) {
    const lower = title.toLowerCase();

    const focus =
        lower.includes("прогресс") || lower.includes("результ")
            ? "сводка прогресса по занятиям, тестам и попыткам"
            : lower.includes("календар")
                ? "расписание, дедлайны и события"
                : lower.includes("чат")
                    ? "сообщения, поддержка и договорённости"
                    : lower.includes("каталог") || lower.includes("курс")
                        ? "подбор курсов по уровню и интересам"
                        : lower.includes("достиж") || lower.includes("бейдж") || lower.includes("award")
                            ? "награды, стрики и мотивация"
                            : lower.includes("профил")
                                ? "данные, настройки и уведомления"
                                : "короткая сводка по разделу";

    const bullets =
        role === "parent"
            ? ["прогресс ребёнка за 7 дней", "рекомендации по занятиям", "посещаемость и заметки"]
            : role === "youth"
                ? ["следующий шаг и цель дня", "награды и стрик", "персональные подсказки"]
                : role === "mentor"
                    ? ["список учеников и статусы", "очередь проверок", "заметки по созвонам"]
                    : ["воронка заявок", "группы и заполненность", "посещаемость и удержание"];

    const kpi =
        role === "parent"
            ? [{k: "занятий", v: "4"}, {k: "прогресс", v: "+12%"}, {k: "заметки", v: "1"}]
            : role === "youth"
                ? [{k: "шагов", v: "2/5"}, {k: "стрик", v: "5 дней"}, {k: "очки", v: "120"}]
                : role === "mentor"
                    ? [{k: "чаты", v: "3"}, {k: "проверки", v: "5"}, {k: "созвоны", v: "2"}]
                    : [{k: "заявки", v: "6"}, {k: "группы", v: "18"}, {k: "посещ.", v: "92%"}];

    return {focus, bullets, kpi};
}

function buildActivityStub(role: Role, item: Activity | null) {
    const id = item?.id ?? "open_progress";

    const status =
        role === "youth" ? "в процессе" : role === "parent" ? "под контролем" : role === "mentor" ? "в работе" : "на мониторинге";

    const deadline =
        id === "open_calendar"
            ? role === "youth"
                ? "сегодня 18:00"
                : role === "parent"
                    ? "эта неделя"
                    : role === "mentor"
                        ? "до пятницы"
                        : "к отчёту"
            : role === "youth"
                ? "до воскресенья"
                : role === "parent"
                    ? "на этой неделе"
                    : role === "mentor"
                        ? "до конца месяца"
                        : "к следующему отчёту";

    const progress =
        id === "open_chats"
            ? role === "youth"
                ? "3 новых сообщения"
                : role === "parent"
                    ? "1 диалог активен"
                    : role === "mentor"
                        ? "5 чатов по группе"
                        : "поддержка: 12 тикетов"
            : id === "open_reports"
                ? role === "mentor"
                    ? "2 отчёта в очереди"
                    : role === "org"
                        ? "отчёт за неделю готов"
                        : role === "parent"
                            ? "1 отчёт от наставника"
                            : "1 модуль закрыт"
                : id === "open_requests"
                    ? role === "org"
                        ? "6 заявок за 24 часа"
                        : "1 новый запрос"
                    : id === "open_test"
                        ? role === "youth"
                            ? "тест: 5 минут"
                            : "1 диагностика доступна"
                        : id === "open_results"
                            ? role === "parent"
                                ? "отчёт готов"
                                : "результаты обновлены"
                            : role === "youth"
                                ? "2/5 шагов"
                                : role === "parent"
                                    ? "3 занятия выполнено"
                                    : role === "mentor"
                                        ? "8 учеников активны"
                                        : "конверсия 12%";

    const hint =
        role === "youth"
            ? "сделай следующий шаг и получишь бейдж"
            : role === "parent"
                ? "посмотри динамику и выбери следующее занятие"
                : role === "mentor"
                    ? "проверь список и отметь завершённых"
                    : "сверь результаты и выгрузи отчёт";

    const list: StubRow[] =
        id === "open_chats"
            ? role === "mentor"
                ? [
                    {title: "Алия • проект", subtitle: "нужен фидбэк по заданию", right: "новое", tone: "primary"},
                    {title: "Дамир • группа №2", subtitle: "вопрос по дедлайну", right: "2м", tone: "muted"},
                    {title: "Куратор", subtitle: "план созвона на завтра", right: "вчера", tone: "muted"},
                ]
                : role === "parent"
                    ? [
                        {title: "Наставник", subtitle: "комментарий по занятию", right: "сегодня", tone: "primary"},
                        {title: "Поддержка", subtitle: "вопрос по оплате", right: "вчера", tone: "muted"},
                        {title: "Уведомления", subtitle: "напоминание о занятии", right: "2д", tone: "muted"},
                    ]
                    : role === "org"
                        ? [
                            {title: "Лид-менеджер", subtitle: "обработка заявок", right: "новое", tone: "primary"},
                            {title: "Администратор", subtitle: "замена преподавателя", right: "сегодня", tone: "muted"},
                            {title: "Поддержка", subtitle: "тикет #142", right: "1ч", tone: "warn"},
                        ]
                        : [
                            {title: "Ментор", subtitle: "ответил на вопрос", right: "1м", tone: "primary"},
                            {title: "Группа", subtitle: "обсуждение темы", right: "10м", tone: "muted"},
                            {title: "Поддержка", subtitle: "напоминание", right: "вчера", tone: "muted"},
                        ]
            : id === "open_calendar"
                ? role === "youth"
                    ? [
                        {title: "Урок: модуль 2", subtitle: "сегодня 18:00", right: "сегодня", tone: "primary"},
                        {title: "Мини-цель", subtitle: "закрыть 1 тест", right: "до 20:00", tone: "warn"},
                        {title: "Повторение", subtitle: "10 минут практики", right: "вечер", tone: "muted"},
                    ]
                    : role === "parent"
                        ? [
                            {title: "Кружок: робототехника", subtitle: "завтра 18:00", right: "завтра", tone: "primary"},
                            {title: "Домашнее задание", subtitle: "проверить отчёт", right: "до пятницы", tone: "warn"},
                            {title: "Созвон с ментором", subtitle: "15 минут", right: "суббота", tone: "muted"},
                        ]
                        : role === "mentor"
                            ? [
                                {title: "Созвон: Дамир", subtitle: "сегодня 18:30", right: "сегодня", tone: "primary"},
                                {title: "Группа №2", subtitle: "практика: тема 4", right: "завтра", tone: "muted"},
                                {title: "Окно проверки", subtitle: "2 отчёта", right: "до пятницы", tone: "warn"},
                            ]
                            : [
                                {title: "Группа A", subtitle: "замена аудитории", right: "сегодня", tone: "warn"},
                                {title: "Группа B", subtitle: "занятие по расписанию", right: "завтра", tone: "muted"},
                                {title: "Сводка недели", subtitle: "расписание подтверждено", right: "неделя", tone: "primary"},
                            ]
                : id === "open_reports"
                    ? role === "mentor"
                        ? [
                            {title: "Отчёт #12", subtitle: "нужен комментарий", right: "срок сегодня", tone: "warn"},
                            {title: "Отчёт #11", subtitle: "проверить код", right: "завтра", tone: "muted"},
                            {title: "Отчёт #10", subtitle: "принято", right: "готово", tone: "ok"},
                        ]
                        : role === "org"
                            ? [
                                {title: "Отчёт по группам", subtitle: "сформирован за неделю", right: "готово", tone: "ok"},
                                {title: "Посещаемость", subtitle: "срез по дням", right: "сегодня", tone: "primary"},
                                {title: "Заявки", subtitle: "источники трафика", right: "сегодня", tone: "muted"},
                            ]
                            : [
                                {title: "Сводка", subtitle: "короткий отчёт", right: "готово", tone: "ok"},
                                {title: "Рекомендации", subtitle: "следующий шаг", right: "сегодня", tone: "primary"},
                                {title: "История", subtitle: "предыдущие недели", right: "архив", tone: "muted"},
                            ]
                    : id === "open_test"
                        ? [
                            {title: "Диагностика интересов", subtitle: "5 минут", right: "доступно", tone: "primary"},
                            {title: "Мини-тест навыков", subtitle: "3 минуты", right: "доступно", tone: "muted"},
                            {title: "Результат", subtitle: "после прохождения", right: "сразу", tone: "ok"},
                        ]
                        : id === "open_results"
                            ? [
                                {title: "Краткий отчёт", subtitle: "итоги и советы", right: "готово", tone: "ok"},
                                {title: "Сильные стороны", subtitle: "что получается лучше", right: "сегодня", tone: "primary"},
                                {title: "Рекомендации", subtitle: "куда двигаться дальше", right: "сегодня", tone: "muted"},
                            ]
                            : id === "open_catalog"
                                ? [
                                    {title: "Робототехника", subtitle: "8–12 лет • офлайн", right: "топ", tone: "primary"},
                                    {title: "Программирование", subtitle: "12–16 лет • онлайн", right: "новое", tone: "muted"},
                                    {title: "Дизайн", subtitle: "10–14 лет • офлайн", right: "популярно", tone: "ok"},
                                ]
                                : id === "open_achievements"
                                    ? [
                                        {title: "Бейдж: 5 дней подряд", subtitle: "стрик", right: "+1", tone: "ok"},
                                        {title: "Бейдж: быстрый старт", subtitle: "первый модуль", right: "получено", tone: "primary"},
                                        {title: "Следующий бейдж", subtitle: "ещё 2 шага", right: "2/5", tone: "muted"},
                                    ]
                                    : id === "open_requests"
                                        ? [
                                            {title: "Новая заявка", subtitle: "контакт оставлен", right: "новое", tone: "primary"},
                                            {title: "Уточнение", subtitle: "нужен звонок", right: "сегодня", tone: "warn"},
                                            {title: "В обработке", subtitle: "назначить группу", right: "позже", tone: "muted"},
                                        ]
                                        : id === "open_students"
                                            ? [
                                                {title: "Группа №2", subtitle: "8 учеников активны", right: "активно", tone: "primary"},
                                                {title: "Нужен фидбэк", subtitle: "2 ученика ждут", right: "2", tone: "warn"},
                                                {title: "Посещаемость", subtitle: "за неделю", right: "92%", tone: "ok"},
                                            ]
                                            : [
                                                {title: "Задача", subtitle: "шаг 1", right: "в процессе", tone: "muted"},
                                                {title: "Задача", subtitle: "шаг 2", right: "в процессе", tone: "muted"},
                                                {title: "Задача", subtitle: "шаг 3", right: "готово", tone: "ok"},
                                            ];

    return {status, deadline, progress, hint, list};
}

/* ----------------------- главный экран ----------------------- */

type InfoModalState =
    | { kind: "kpi"; title: string; text: string; value?: string; ctaLabel?: string }
    | { kind: "qa"; title: string; text: string; ctaLabel?: string; actionId?: ActivityId }
    | null;

const FALLBACK_INFO = "детали будут добавлены позже.";

export default function HomeScreen() {
    const router = useRouter();
    const {isDesktop, contentMax} = useViewport();

    const [role, setRole] = useState<Role | null>(null);
    const [name] = useState("Халилова Сабина");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalItem, setModalItem] = useState<Activity | null>(null);

    const [infoModal, setInfoModal] = useState<InfoModalState>(null);

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

            router.push(route as any);
        },
        [router, role, showToast]
    );

    const containerWidth = useMemo(() => {
        if (!isDesktop) return "100%";
        return Math.min(contentMax, 860);
    }, [contentMax, isDesktop]);

    const openKpiModal = useCallback((k: KPI) => {
        setInfoModal({
            kind: "kpi",
            title: k.modal?.title ?? k.label,
            text: k.modal?.text ?? FALLBACK_INFO,
            value: k.value,
            ctaLabel: k.modal?.ctaLabel ?? "закрыть",
        });
    }, []);

    const openQuickActionModal = useCallback((a: QuickAction) => {
        setInfoModal({
            kind: "qa",
            title: a.modal?.title ?? a.label,
            text: a.modal?.text ?? a.description ?? FALLBACK_INFO,
            ctaLabel: a.modal?.ctaLabel ?? "перейти",
            actionId: a.id,
        });
    }, []);

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
                            setModalItem({
                                id: "open_calendar",
                                title: data.heroTitle,
                                subtitle: data.heroSubtitle,
                                icon: "calendar",
                                tone: "primary",
                                cta: "Открыть",
                            });
                            setModalOpen(true);
                        }}
                    />

                    <KPIGrid items={data.kpis} isDesktop={isDesktop} onPressItem={openKpiModal}/>

                    <QuickActions
                        items={data.quickActions}
                        isDesktop={isDesktop}
                        onPress={(id) => onAction(id)}
                        onPressItem={openQuickActionModal}
                    />

                    <SectionTitle title="Активности"/>

                    <ActivityList
                        items={data.activities}
                        onPress={(item) => {
                            setModalItem(item);
                            setModalOpen(true);
                        }}
                    />

                    <BackendHintCard/>

                    <ActionModal
                        role={role ?? "parent"}
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

                <InfoModal
                    role={role ?? "parent"}
                    state={infoModal}
                    onClose={() => setInfoModal(null)}
                    onGo={(actionId) => {
                        setInfoModal(null);
                        if (!actionId) return;
                        setTimeout(() => onAction(actionId), 120);
                    }}
                />

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
            <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: isDesktop ? 28 : 24, fontWeight: "800", color: THEME.text}}>
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
                    style={{padding: 18, minHeight: 160, justifyContent: "space-between"}}
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
                            <Text style={{color: "white", fontWeight: "700", fontSize: 12}}>{tag ? tag : "umo"}</Text>
                        </View>

                        <View
                            style={{
                                backgroundColor: "rgba(255,255,255,0.18)",
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 999,
                            }}
                        >
                            <Text style={{color: "white", fontWeight: "700", fontSize: 12}}>сегодня</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={{color: "white", fontSize: 20, fontWeight: "800", lineHeight: 26}}>{title}</Text>
                        <Text style={{color: "rgba(255,255,255,0.86)", marginTop: 8, fontWeight: "600"}}>{subtitle}</Text>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
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

function KPIGrid({
                     items,
                     isDesktop,
                     onPressItem,
                 }: {
    items: KPI[];
    isDesktop: boolean;
    onPressItem?: (item: KPI) => void;
}) {
    const cols = isDesktop ? 3 : 3;

    return (
        <View style={{flexDirection: "row", gap: 10, marginBottom: 16}}>
            {items.slice(0, cols).map((k, idx) => (
                <MotiView
                    key={`${k.label}_${idx}`}
                    from={{opacity: 0, translateY: 10}}
                    animate={{opacity: 1, translateY: 0}}
                    transition={{duration: 360, delay: 120 + idx * 70}}
                    style={{flex: 1}}
                >
                    <Pressable
                        onPress={() => onPressItem?.(k)}
                        style={({pressed}) => ({
                            backgroundColor: THEME.card,
                            borderRadius: 20,
                            padding: 14,
                            borderWidth: 1,
                            borderColor: THEME.line,
                            opacity: pressed ? 0.95 : 1,
                        })}
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
                    </Pressable>
                </MotiView>
            ))}
        </View>
    );
}

function QuickActions({
                          items,
                          isDesktop,
                          onPress,
                          onPressItem,
                      }: {
    items: HomeContent["quickActions"];
    isDesktop: boolean;
    onPress: (id: ActivityId) => void;
    onPressItem?: (item: QuickAction) => void;
}) {
    const columns = isDesktop ? 4 : 2;
    const gap = 10;

    return (
        <View style={{marginBottom: 18}}>
            <SectionTitle title="Быстрые действия" rightHint="mvp"/>
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
                            onPress={() => onPressItem?.(a)}
                            onLongPress={() => onPress(a.id)}
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

function ActivityList({items, onPress}: { items: Activity[]; onPress: (item: Activity) => void }) {
    return (
        <View style={{marginBottom: 16}}>
            {items.map((item, index) => {
                const grad = toneToGrad(item.tone);
                const onTone = textOnTone(item.tone);

                return (
                    <MotiView
                        key={`${item.id}_${index}`}
                        from={{opacity: 0, translateY: 14}}
                        animate={{opacity: 1, translateY: 0}}
                        transition={{duration: 380, delay: 120 + index * 90}}
                        style={{marginBottom: 12}}
                    >
                        <Pressable onPress={() => onPress(item)} style={({pressed}) => ({opacity: pressed ? 0.96 : 1})}>
                            <LinearGradient
                                colors={grad as any}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                                style={{borderRadius: 22, padding: 14, overflow: "hidden"}}
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
                                        <Feather name={item.icon} size={22} color="white"/>
                                    </View>

                                    <View style={{flex: 1}}>
                                        <Text style={{fontSize: 16, fontWeight: "900", color: onTone}}>
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={{
                                                marginTop: 4,
                                                fontWeight: "600",
                                                color: item.tone === "soft" ? THEME.muted : "rgba(255,255,255,0.86)",
                                            }}
                                        >
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
                                    <Text style={{fontWeight: "800", color: THEME.text, marginBottom: 6}}>endpoint</Text>
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
                                    <Text style={{fontWeight: "800", color: THEME.text, marginBottom: 6}}>комментарий</Text>
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

/* ----------------------- info modal (kpi / quick actions) ----------------------- */

function InfoModal({
                       role,
                       state,
                       onClose,
                       onGo,
                   }: {
    role: Role;
    state: InfoModalState;
    onClose: () => void;
    onGo: (id?: ActivityId) => void;
}) {
    const visible = !!state;
    const title = state?.title ?? "Детали";

    const actionId =
        ("actionId" in (state ?? {}) ? (state as any).actionId : undefined) as ActivityId | undefined;

    const stub = buildInfoStub(role, title);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(15, 23, 42, 0.55)",
                    justifyContent: "center",
                    paddingHorizontal: 18,
                }}
            >
                <Pressable onPress={() => {}} style={{width: "100%"}}>
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

                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10}}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 18, fontWeight: "900", color: THEME.text}}>
                                    {title}
                                </Text>

                                <View style={{flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10}}>
                                    <Chip text={`роль: ${roleLabel(role)}`} variant="primary"/>
                                    <Chip text={formatNowHint(role)} variant="muted"/>
                                </View>
                            </View>

                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 16,
                                    backgroundColor: THEME.soft,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Feather name="info" size={20} color={THEME.primary}/>
                            </View>
                        </View>

                        <View style={{height: 14}}/>

                        {"value" in (state ?? {}) && state?.value ? (
                            <View style={{flexDirection: "row", alignItems: "flex-end", gap: 10, marginBottom: 10}}>
                                <Text style={{fontSize: 34, fontWeight: "900", color: THEME.text}}>
                                    {state.value}
                                </Text>
                                <Text style={{fontWeight: "800", color: THEME.muted}}>
                                    {stub.focus}
                                </Text>
                            </View>
                        ) : null}

                        <View
                            style={{
                                backgroundColor: "#F8FAFF",
                                borderRadius: 20,
                                padding: 14,
                                borderWidth: 1,
                                borderColor: THEME.line,
                            }}
                        >
                            <Text style={{fontWeight: "900", color: THEME.text, marginBottom: 6}}>
                                описание
                            </Text>
                            <Text style={{fontWeight: "700", color: THEME.muted, lineHeight: 18}}>
                                {state?.text}
                            </Text>

                            <View style={{height: 12}}/>

                            <Text style={{fontWeight: "900", color: THEME.text, marginBottom: 6}}>
                                что внутри (mvp)
                            </Text>
                            {stub.bullets.map((t, i) => (
                                <Text key={`b_${i}`} style={{fontWeight: "700", color: THEME.muted, lineHeight: 18}}>
                                    • {t}
                                </Text>
                            ))}

                            <View style={{height: 12}}/>

                            <Text style={{fontWeight: "900", color: THEME.text, marginBottom: 6}}>
                                краткая сводка
                            </Text>

                            <View style={{flexDirection: "row", gap: 10}}>
                                {stub.kpi.map((x, i) => (
                                    <View
                                        key={`k_${i}`}
                                        style={{
                                            flex: 1,
                                            borderRadius: 16,
                                            backgroundColor: "white",
                                            borderWidth: 1,
                                            borderColor: THEME.line,
                                            padding: 10,
                                        }}
                                    >
                                        <Text style={{fontWeight: "900", color: THEME.text}}>{x.v}</Text>
                                        <Text style={{marginTop: 4, fontWeight: "700", color: THEME.muted, fontSize: 12}}>
                                            {x.k}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={{height: 14}}/>

                        <View style={{flexDirection: "row", gap: 10}}>
                            <Pressable
                                onPress={onClose}
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
                                <Text style={{fontWeight: "900", color: THEME.primary}}>закрыть</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => onGo(actionId)}
                                style={({pressed}) => ({
                                    flex: 1,
                                    paddingVertical: 14,
                                    borderRadius: 18,
                                    backgroundColor: THEME.primary,
                                    alignItems: "center",
                                    opacity: pressed ? 0.92 : 1,
                                })}
                            >
                                <Text style={{fontWeight: "900", color: "white"}}>
                                    {state?.ctaLabel ?? (actionId ? "перейти" : "ок")}
                                </Text>
                            </Pressable>
                        </View>
                    </MotiView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

/* ----------------------- модалка activities ----------------------- */

function ActionModal({
                         role,
                         visible,
                         item,
                         onClose,
                         onPrimary,
                         onSecondary,
                         onTertiary,
                     }: {
    role: Role;
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

    const stub = buildActivityStub(role, item);

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={{flex: 1}}>
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
                        style={{borderRadius: 26, overflow: "hidden", backgroundColor: "white"}}
                    >
                        <LinearGradient colors={grad as any} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{padding: 16}}>
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
                                        <Text
                                            style={{
                                                color: tone === "soft" ? THEME.muted : "rgba(255,255,255,0.86)",
                                                fontWeight: "700",
                                                marginTop: 4,
                                            }}
                                        >
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

                            <View style={{marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8}}>
                                <View style={{backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999}}>
                                    <Text style={{color: "white", fontWeight: "900", fontSize: 12}}>
                                        {roleLabel(role)}
                                    </Text>
                                </View>
                                <View style={{backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999}}>
                                    <Text style={{color: "white", fontWeight: "900", fontSize: 12}}>
                                        статус: {stub.status}
                                    </Text>
                                </View>
                                <View style={{backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999}}>
                                    <Text style={{color: "white", fontWeight: "900", fontSize: 12}}>
                                        срок: {stub.deadline}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>

                        <View style={{padding: 16}}>
                            <View
                                style={{
                                    backgroundColor: "#F8FAFF",
                                    borderRadius: 18,
                                    padding: 14,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                }}
                            >
                                <Text style={{fontWeight: "900", color: THEME.text, marginBottom: 6}}>
                                    детали
                                </Text>
                                <Text style={{fontWeight: "700", color: THEME.muted, lineHeight: 18}}>
                                    прогресс: {stub.progress}. цель: {roleGoal(role)}.
                                </Text>
                                <Text style={{marginTop: 8, fontWeight: "700", color: THEME.muted, lineHeight: 18}}>
                                    {stub.hint}.
                                </Text>
                            </View>

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
                                <RowLine icon="clock" label="Статус" value={stub.status}/>
                                <RowLine icon="calendar" label="Срок" value={stub.deadline}/>
                                <RowLine icon="activity" label="Прогресс" value={stub.progress}/>
                                <RowLine icon="shield" label="Роль" value={roleLabel(role)}/>
                            </View>

                            <View style={{height: 12}}/>

                            <View
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 18,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: THEME.line,
                                }}
                            >
                                <Text style={{fontWeight: "900", color: THEME.text, marginBottom: 10}}>
                                    список (mvp)
                                </Text>

                                {stub.list.map((r, idx) => (
                                    <View
                                        key={`row_${idx}`}
                                        style={{
                                            paddingVertical: 10,
                                            borderTopWidth: idx === 0 ? 0 : 1,
                                            borderTopColor: THEME.line,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 10,
                                        }}
                                    >
                                        <View style={{flex: 1}}>
                                            <Text style={{fontWeight: "900", color: THEME.text}}>
                                                {r.title}
                                            </Text>
                                            {r.subtitle ? (
                                                <Text style={{marginTop: 3, fontWeight: "700", color: THEME.muted}}>
                                                    {r.subtitle}
                                                </Text>
                                            ) : null}
                                        </View>

                                        {r.right ? (
                                            <View
                                                style={{
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 6,
                                                    borderRadius: 999,
                                                    backgroundColor:
                                                        r.tone === "ok"
                                                            ? "rgba(22,163,74,0.12)"
                                                            : r.tone === "warn"
                                                                ? "rgba(245,158,11,0.16)"
                                                                : r.tone === "primary"
                                                                    ? "rgba(63,60,159,0.12)"
                                                                    : "rgba(107,114,128,0.10)",
                                                    borderWidth: 1,
                                                    borderColor: THEME.line,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: "900",
                                                        color:
                                                            r.tone === "ok"
                                                                ? THEME.good
                                                                : r.tone === "warn"
                                                                    ? "#B45309"
                                                                    : r.tone === "primary"
                                                                        ? THEME.primary
                                                                        : THEME.muted,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {r.right}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </View>
                                ))}
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
                                    <Text style={{fontWeight: "900", color: THEME.primary}}>в избранное</Text>
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
                                    <Text style={{fontWeight: "900", color: THEME.primary}}>выполнено</Text>
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
                                <Text style={{color: "white", fontWeight: "900"}}>{item?.cta ?? "Открыть"}</Text>
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

function Chip({text, variant}: {text: string; variant: "primary" | "muted"}) {
    return (
        <View
            style={{
                backgroundColor: variant === "primary" ? THEME.soft : "#F8FAFF",
                borderWidth: 1,
                borderColor: THEME.line,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
            }}
        >
            <Text style={{fontWeight: "800", color: variant === "primary" ? THEME.primary : THEME.muted, fontSize: 12}}>
                {text}
            </Text>
        </View>
    );
}