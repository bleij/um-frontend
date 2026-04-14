import { db } from './db';

export interface TestResult {
  id: string;
  profile_id: string;
  profile_type: 'child' | 'teen' | 'young-adult' | 'child_profile';
  answers: string; // JSON string
  predisposition?: string;
  recommended_courses?: string; // JSON string
  created_at?: string;
}

export interface TestAnswer {
  question_id: number;
  answer: string;
}

// Генерация уникального ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Создать результат теста
export async function createTestResult(
  profileId: string,
  profileType: TestResult['profile_type'],
  answers: TestAnswer[]
): Promise<TestResult> {
  const id = generateId();
  const answersJson = JSON.stringify(answers);
  
  // Анализ ответов для определения предрасположенности
  const predisposition = analyzeTestAnswers(answers);
  const recommendedCourses = JSON.stringify(getRecommendedCourses(predisposition));
  
  await db.execute({
    sql: 'INSERT INTO test_results (id, profile_id, profile_type, answers, predisposition, recommended_courses) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, profileId, profileType, answersJson, predisposition, recommendedCourses],
  });
  
  return {
    id,
    profile_id: profileId,
    profile_type: profileType,
    answers: answersJson,
    predisposition,
    recommended_courses: recommendedCourses,
  };
}

// Получить результат теста по ID профиля
export async function getTestResultByProfileId(profileId: string): Promise<TestResult | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM test_results WHERE profile_id = ? ORDER BY created_at DESC LIMIT 1',
    args: [profileId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as TestResult;
}

// Получить результат теста по ID
export async function getTestResultById(id: string): Promise<TestResult | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM test_results WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as TestResult;
}

// Анализ ответов теста для определения предрасположенности
function analyzeTestAnswers(answers: TestAnswer[]): string {
  // Подсчет категорий интересов
  const categories: Record<string, number> = {
    technology: 0,
    arts: 0,
    sports: 0,
    science: 0,
    social: 0,
    creative: 0,
    analytical: 0,
    practical: 0,
  };
  
  // Простая логика анализа на основе ответов
  answers.forEach((answer) => {
    const ans = answer.answer.toLowerCase();
    
    if (ans.includes('компьютер') || ans.includes('программ') || ans.includes('технолог')) {
      categories.technology += 2;
      categories.analytical += 1;
    }
    if (ans.includes('рисова') || ans.includes('музык') || ans.includes('танц') || ans.includes('креатив')) {
      categories.arts += 2;
      categories.creative += 2;
    }
    if (ans.includes('спорт') || ans.includes('движен') || ans.includes('активн')) {
      categories.sports += 2;
      categories.practical += 1;
    }
    if (ans.includes('наук') || ans.includes('исследова') || ans.includes('эксперимент')) {
      categories.science += 2;
      categories.analytical += 2;
    }
    if (ans.includes('друзья') || ans.includes('общен') || ans.includes('команд')) {
      categories.social += 2;
    }
    if (ans.includes('констру') || ans.includes('созда') || ans.includes('делать')) {
      categories.creative += 1;
      categories.practical += 1;
    }
  });
  
  // Определение главной предрасположенности
  let maxCategory = '';
  let maxScore = 0;
  
  for (const [category, score] of Object.entries(categories)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }
  
  // Возвращаем предрасположенность с описанием
  const predispositions: Record<string, string> = {
    technology: 'Технологии и IT',
    arts: 'Искусство и творчество',
    sports: 'Спорт и физическая активность',
    science: 'Наука и исследования',
    social: 'Социальные навыки и коммуникация',
    creative: 'Креативное мышление',
    analytical: 'Аналитическое мышление',
    practical: 'Практические навыки',
  };
  
  return predispositions[maxCategory] || 'Универсальное развитие';
}

// Получить рекомендованные курсы на основе предрасположенности
function getRecommendedCourses(predisposition: string): string[] {
  const recommendations: Record<string, string[]> = {
    'Технологии и IT': [
      'Программирование для начинающих',
      'Робототехника',
      'Создание игр',
      'Web-разработка',
      'Основы AI и машинного обучения',
    ],
    'Искусство и творчество': [
      'Рисование и живопись',
      'Музыкальная студия',
      'Театральное мастерство',
      'Дизайн и графика',
      'Креативное письмо',
    ],
    'Спорт и физическая активность': [
      'Детская йога',
      'Спортивные игры',
      'Танцевальная студия',
      'Боевые искусства',
      'Плавание',
    ],
    'Наука и исследования': [
      'Занимательная физика',
      'Химические эксперименты',
      'Биология и природа',
      'Астрономия',
      'Юный изобретатель',
    ],
    'Социальные навыки и коммуникация': [
      'Ораторское мастерство',
      'Лидерство и командная работа',
      'Эмоциональный интеллект',
      'Журналистика',
      'Проектная деятельность',
    ],
    'Креативное мышление': [
      'ТРИЗ для детей',
      'Дизайн-мышление',
      'Креативное решение задач',
      'Изобретательство',
      'Арт-терапия',
    ],
    'Аналитическое мышление': [
      'Шахматы',
      'Логика и математика',
      'Программирование',
      'Финансовая грамотность',
      'Критическое мышление',
    ],
    'Практические навыки': [
      'Кулинарная студия',
      'Рукоделие и hand-made',
      'Столярное дело',
      'Садоводство',
      'Основы ремонта',
    ],
  };
  
  return recommendations[predisposition] || [
    'Общее развитие',
    'Soft skills',
    'Комплексная программа',
  ];
}

// Вопросы для тестирования
export const testQuestions = [
  {
    id: 1,
    question: 'Чем ты любишь заниматься в свободное время?',
    type: 'text',
  },
  {
    id: 2,
    question: 'Какие предметы тебе нравятся больше всего?',
    type: 'text',
  },
  {
    id: 3,
    question: 'Что бы ты хотел научиться делать?',
    type: 'text',
  },
  {
    id: 4,
    question: 'Как ты предпочитаешь работать: один или в команде?',
    type: 'choice',
    options: ['Один', 'В команде', 'По-разному'],
  },
  {
    id: 5,
    question: 'Тебе нравится создавать что-то новое?',
    type: 'choice',
    options: ['Да, очень', 'Иногда', 'Не очень'],
  },
  {
    id: 6,
    question: 'Ты любишь решать сложные задачи и головоломки?',
    type: 'choice',
    options: ['Да, это интересно', 'Иногда', 'Нет, не люблю'],
  },
  {
    id: 7,
    question: 'Тебе нравится выступать перед людьми?',
    type: 'choice',
    options: ['Да, нравится', 'Немного волнуюсь', 'Нет, не нравится'],
  },
  {
    id: 8,
    question: 'Что тебе интереснее: как устроены вещи или как красиво их оформить?',
    type: 'choice',
    options: ['Как устроены', 'Как оформить', 'И то, и то'],
  },
  {
    id: 9,
    question: 'Ты любишь активные игры или спокойные занятия?',
    type: 'choice',
    options: ['Активные игры', 'Спокойные занятия', 'Разные'],
  },
  {
    id: 10,
    question: 'О чем ты мечтаешь? Кем хочешь стать?',
    type: 'text',
  },
];
