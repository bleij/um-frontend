# Руководство по интеграции базы данных Turso

## 🚀 База данных успешно подключена!

Ваше приложение теперь подключено к базе данных **Turso (LibSQL)** и готово для хранения всех данных платформы UM.

### 📦 Что уже сделано:

1. ✅ Установлен пакет `@libsql/client`
2. ✅ Создан клиент БД (`/src/app/lib/db.ts`)
3. ✅ Инициализирована схема базы данных с таблицами для:
   - Пользователей (users)
   - Профилей родителей (parent_profiles)
   - Детских профилей (child_profiles)
   - Профилей детей 6-11 лет (children_own_profiles)
   - Профилей подростков 12-17 лет (teen_profiles)
   - Профилей молодых взрослых 18-20 лет (young_adult_profiles)
   - Профилей организаций (organization_profiles)
   - Профилей менторов (mentor_profiles)
   - Результатов тестирования (test_results)
   - Курсов (courses)
   - Записей на курсы (course_enrollments)
   - Избранных курсов (favorite_courses)

4. ✅ Созданы утилиты для работы с данными:
   - `/src/app/lib/users.ts` - работа с пользователями и профилями
   - `/src/app/lib/tests.ts` - работа с тестированием
   - `/src/app/lib/courses.ts` - работа с курсами
   - `/src/app/lib/auth.ts` - система аутентификации

5. ✅ Создан React контекст аутентификации (`/src/app/contexts/AuthContext.tsx`)
6. ✅ Добавлена инициализация демо-данных (12 курсов)
7. ✅ Интегрирована страница `CreateProfileParent.tsx` с сохранением в БД

---

## 📚 Как использовать базу данных

### 1. Работа с аутентификацией

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, register, logout } = useAuth();
  
  // Регистрация
  const handleRegister = async () => {
    const result = await register('email@example.com', 'password', 'parent');
    if (result.success) {
      console.log('Пользователь зарегистрирован:', result.user);
    }
  };
  
  // Вход
  const handleLogin = async () => {
    const result = await login('email@example.com', 'password');
    if (result.success) {
      console.log('Пользователь вошел:', result.user);
    }
  };
  
  // Выход
  const handleLogout = () => {
    logout();
  };
  
  return <div>...</div>;
}
```

### 2. Создание профилей

#### Профиль родителя
```typescript
import { createParentProfile } from '../lib/users';
import { useAuth } from '../contexts/AuthContext';

const { user } = useAuth();

const parentProfile = await createParentProfile({
  user_id: user.id,
  full_name: 'Иван Иванов',
  phone: '+79991234567',
  children_count: 2,
});

// Сохраните ID профиля для создания детских профилей
localStorage.setItem('parentProfileId', parentProfile.id);
```

#### Детский профиль (создаваемый родителем)
```typescript
import { createChildProfile } from '../lib/users';

const parentProfileId = localStorage.getItem('parentProfileId');

const childProfile = await createChildProfile({
  parent_id: parentProfileId,
  full_name: 'Мария Иванова',
  age: 8,
  age_category: 'child', // 'child' | 'teen' | 'young-adult'
  interests: 'Рисование, музыка',
});

// Сохраните ID для тестирования
localStorage.setItem('currentChildProfileId', childProfile.id);
```

#### Профиль ребенка (собственный аккаунт 6-11 лет)
```typescript
import { createChildOwnProfile } from '../lib/users';
import { useAuth } from '../contexts/AuthContext';

const { user } = useAuth();

const childProfile = await createChildOwnProfile({
  user_id: user.id,
  full_name: 'Петр Петров',
  age: 10,
  interests: 'Роботы, космос',
});
```

#### Профиль подростка (12-17 лет)
```typescript
import { createTeenProfile } from '../lib/users';

const teenProfile = await createTeenProfile({
  user_id: user.id,
  full_name: 'Анна Сидорова',
  age: 15,
  interests: 'Программирование, музыка',
});
```

#### Профиль молодого взрослого (18-20 лет)
```typescript
import { createYoungAdultProfile } from '../lib/users';

const youngAdultProfile = await createYoungAdultProfile({
  user_id: user.id,
  full_name: 'Алексей Алексеев',
  age: 19,
  education_level: 'Студент',
  career_goals: 'Стать разработчиком',
  interests: 'Web-разработка, стартапы',
});
```

### 3. Работа с тестированием

```typescript
import { createTestResult, getTestResultByProfileId, testQuestions } from '../lib/tests';

// Сохранение результатов теста
const answers = [
  { question_id: 1, answer: 'Играть в компьютерные игры' },
  { question_id: 2, answer: 'Математика и информатика' },
  // ... остальные ответы
];

const testResult = await createTestResult(
  childProfile.id,
  'child', // 'child' | 'teen' | 'young-adult' | 'child_profile'
  answers
);

console.log('Предрасположенность:', testResult.predisposition);
console.log('Рекомендованные курсы:', JSON.parse(testResult.recommended_courses));

// Получение результатов теста
const savedTestResult = await getTestResultByProfileId(childProfile.id);
```

### 4. Работа с курсами

```typescript
import { 
  getAllCourses, 
  getCoursesByCategory, 
  enrollInCourse,
  addToFavorites,
  removeFromFavorites,
  isFavorite 
} from '../lib/courses';

// Получить все курсы
const courses = await getAllCourses();

// Получить курсы по категории
const itCourses = await getCoursesByCategory('Технологии и IT');

// Записаться на курс
const enrollment = await enrollInCourse(
  courseId,
  profileId,
  'child' // тип профиля
);

// Добавить в избранное
await addToFavorites(courseId, profileId, 'child');

// Проверить, в избранном ли
const isInFavorites = await isFavorite(courseId, profileId);

// Удалить из избранного
await removeFromFavorites(courseId, profileId);
```

---

## 🎯 Примеры интеграции в страницы

### Страница создания профиля (пример из CreateProfileParent.tsx)

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { createParentProfile } from '../lib/users';

export function CreateProfileParent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('Пользователь не авторизован');
      return;
    }

    setLoading(true);
    
    try {
      const parentProfile = await createParentProfile({
        user_id: user.id,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
      });
      
      // Сохраняем ID профиля
      localStorage.setItem('parentProfileId', parentProfile.id);
      
      // Переходим на следующий экран
      navigate('/next-page');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы */}
      <button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  );
}
```

### Страница тестирования

```typescript
import { useState } from 'react';
import { createTestResult, testQuestions } from '../lib/tests';

export function TestQuestions() {
  const [answers, setAnswers] = useState<Array<{question_id: number, answer: string}>>([]);
  const profileId = localStorage.getItem('currentChildProfileId');
  
  const handleSubmit = async () => {
    const testResult = await createTestResult(
      profileId,
      'child',
      answers
    );
    
    // Показываем результаты
    navigate(`/test-results?id=${testResult.id}`);
  };
  
  return <div>{/* UI тестирования */}</div>;
}
```

### Страница каталога курсов

```typescript
import { useEffect, useState } from 'react';
import { getAllCourses, Course } from '../lib/courses';

export function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadCourses();
  }, []);
  
  if (loading) return <div>Загрузка...</div>;
  
  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

---

## 🔧 TODO: Страницы, которые нужно интегрировать

Следующие страницы еще нужно интегрировать с БД:

1. ✅ **CreateProfileParent.tsx** - ГОТОВО
2. ❌ **CreateProfileChild.tsx** - использовать `createChildProfile`
3. ❌ **CreateProfileTeen.tsx** - использовать `createChildProfile` или `createTeenProfile`
4. ❌ **CreateProfileYoungAdult.tsx** - использовать `createChildProfile` или `createYoungAdultProfile`
5. ❌ **CreateProfileOrganization.tsx** - использовать `createOrganizationProfile`
6. ❌ **CreateProfileMentor.tsx** - использовать `createMentorProfile`
7. ❌ **TestQuestions.tsx** - использовать `createTestResult`
8. ❌ **TestResults.tsx** - использовать `getTestResultById`
9. ❌ Дашборды для всех ролей - загружать профили и данные курсов

---

## 💡 Полезные советы

1. **Всегда проверяйте авторизацию**: Убедитесь, что `user` существует перед созданием профилей
2. **Используйте try-catch**: Оборачивайте вызовы БД в try-catch для обработки ошибок
3. **Показывайте состояния загрузки**: Используйте `loading` state для лучшего UX
4. **Сохраняйте ID профилей**: Храните ID профилей в localStorage для связи данных
5. **Проверяйте консоль**: База данных логирует все операции в консоль

---

## 🗄️ Структура базы данных

### Таблица users
- id, role, email, password, created_at, updated_at

### Таблица parent_profiles
- id, user_id, full_name, phone, age, children_count

### Таблица child_profiles (создаваемые родителями)
- id, parent_id, full_name, age, age_category, interests, has_completed_test, test_result_id

### Таблица test_results
- id, profile_id, profile_type, answers (JSON), predisposition, recommended_courses (JSON)

### Таблица courses
- id, title, description, category, age_group, provider_id, duration, format, price, image_url

---

## 📞 Поддержка

Если возникли вопросы по интеграции БД, проверьте:
1. Файлы в `/src/app/lib/` - там вся логика работы с БД
2. Пример в `CreateProfileParent.tsx` - рабочий пример интеграции
3. Консоль браузера - там будут логи инициализации БД и ошибки

**База данных Turso:** libsql://um-figma-ndrt.aws-eu-west-1.turso.io
