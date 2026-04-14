# Teacher API Guide

Руководство по использованию функций библиотеки `teacher.ts` для работы с данными учителей.

## 📦 Импорт

```typescript
import {
  getTeacherProfile,
  getTeacherByPhone,
  getTeacherGroups,
  getTodayLessons,
  getGroupStudents,
  saveAttendance,
  getAttendance,
  updateStudentProgress,
  getTeacherOrganization
} from './lib/teacher';
```

## 🔐 Аутентификация

### getTeacherByPhone()
Получить профиль учителя по номеру телефона (используется при входе).

```typescript
const teacher = await getTeacherByPhone('79991234567');
if (teacher) {
  console.log('Учитель найден:', teacher.full_name);
  localStorage.setItem('teacher_id', teacher.id);
}
```

**Возвращает**: `Teacher | null`

---

## 👤 Профиль учителя

### getTeacherProfile()
Получить полный профиль учителя по ID.

```typescript
const teacherId = localStorage.getItem('teacher_id');
const profile = await getTeacherProfile(teacherId);

console.log('Имя:', profile.full_name);
console.log('Специализация:', profile.specialization);
console.log('Рейтинг:', profile.rating);
```

**Параметры**:
- `userId: string` - ID учителя

**Возвращает**: `Teacher | null`

**Типы**:
```typescript
interface Teacher {
  id: string;
  organization_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  specialization: string | null;
  photo_url: string | null;
  rating: number;
  status: string;
  created_at: string;
  updated_at: string;
}
```

---

## 👥 Группы

### getTeacherGroups()
Получить список всех групп учителя.

```typescript
const groups = await getTeacherGroups(teacherId);

groups.forEach(group => {
  console.log(`${group.group_name}: ${group.current_students}/${group.max_students} учеников`);
});
```

**Параметры**:
- `teacherId: string` - ID учителя

**Возвращает**: `TeacherGroup[]`

**Типы**:
```typescript
interface TeacherGroup {
  id: string;
  group_name: string;
  course_id: string;
  course_title: string;
  schedule: string | null;
  max_students: number;
  current_students: number;
  status: string;
}
```

---

## 📅 Расписание

### getTodayLessons()
Получить уроки учителя на сегодня.

```typescript
const lessons = await getTodayLessons(teacherId);

lessons.forEach(lesson => {
  console.log(`${lesson.time} - ${lesson.course_title}`);
  console.log(`Группа: ${lesson.group_name}`);
  console.log(`Место: ${lesson.location}`);
});
```

**Параметры**:
- `teacherId: string` - ID учителя

**Возвращает**: `TeacherLesson[]`

**Типы**:
```typescript
interface TeacherLesson {
  id: string;
  group_id: string;
  group_name: string;
  course_title: string;
  time: string;
  location: string | null;
  status: string;
}
```

**Примечание**: Пока функция генерирует уроки на основе групп. В будущем нужна таблица расписания.

---

## 🎓 Ученики

### getGroupStudents()
Получить список учеников в группе.

```typescript
const students = await getGroupStudents(groupId);

students.forEach(student => {
  console.log(`${student.full_name}, ${student.age} лет`);
  console.log(`Телефон родителя: ${student.parent_phone}`);
});
```

**Параметры**:
- `groupId: string` - ID группы

**Возвращает**: `GroupStudent[]`

**Типы**:
```typescript
interface GroupStudent {
  id: string;
  student_id: string;
  child_profile_id: string;
  full_name: string;
  age: number;
  photo_url?: string;
  parent_phone?: string;
}
```

---

## ✅ Посещаемость

### saveAttendance()
Сохранить посещаемость учеников за конкретную дату.

```typescript
const today = new Date().toISOString().split('T')[0];

const attendance = [
  { studentId: 'student-001', status: 'present' },
  { studentId: 'student-002', status: 'late', notes: 'Опоздал на 10 минут' },
  { studentId: 'student-003', status: 'absent', notes: 'Болен' }
];

const success = await saveAttendance(groupId, today, attendance);
if (success) {
  console.log('Посещаемость сохранена');
}
```

**Параметры**:
- `groupId: string` - ID группы
- `date: string` - Дата в формате YYYY-MM-DD
- `attendance: Array<{studentId: string, status: 'present'|'absent'|'late', notes?: string}>`

**Возвращает**: `boolean`

---

### getAttendance()
Получить посещаемость группы за конкретную дату.

```typescript
const today = new Date().toISOString().split('T')[0];
const attendance = await getAttendance(groupId, today);

attendance.forEach(record => {
  console.log(`${record.student_id}: ${record.status}`);
  if (record.notes) {
    console.log(`  Примечание: ${record.notes}`);
  }
});
```

**Параметры**:
- `groupId: string` - ID группы
- `date: string` - Дата в формате YYYY-MM-DD

**Возвращает**: `AttendanceRecord[]`

**Типы**:
```typescript
interface AttendanceRecord {
  id: string;
  student_id: string;
  group_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}
```

---

## 📈 Прогресс ученика

### updateStudentProgress()
Обновить прогресс ученика по конкретному навыку.

```typescript
const success = await updateStudentProgress(
  studentId,
  'leadership',  // Навык
  1,             // Значение (обычно +1)
  'Отлично проявил себя как лидер группы'  // Комментарий
);

if (success) {
  console.log('Прогресс обновлен');
}
```

**Параметры**:
- `studentId: string` - ID ученика
- `skill: string` - Название навыка
- `value: number` - Значение (обычно 1)
- `notes: string` - Комментарий учителя

**Возвращает**: `boolean`

**Доступные навыки**:
- `leadership` - Лидерство
- `logic` - Логика
- `creativity` - Креативность
- `communication` - Коммуникация
- `teamwork` - Командная работа
- `problem_solving` - Решение задач

**База данных**:
Функция автоматически создаёт таблицу `student_progress` при первом вызове:
```sql
CREATE TABLE IF NOT EXISTS student_progress (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  value INTEGER NOT NULL,
  notes TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🏢 Организация

### getTeacherOrganization()
Получить информацию об организации учителя.

```typescript
const org = await getTeacherOrganization(teacherId);

if (org) {
  console.log('Название:', org.organization_name);
  console.log('Тип:', org.organization_type);
  console.log('Логотип:', org.logo_url);
}
```

**Параметры**:
- `teacherId: string` - ID учителя

**Возвращает**: `Object | null`
```typescript
{
  id: string;
  organization_name: string;
  logo_url: string | null;
  organization_type: string | null;
}
```

---

## 💡 Примеры использования

### Пример 1: Загрузка данных для главной страницы

```typescript
async function loadTeacherHome() {
  const teacherId = localStorage.getItem('teacher_id');
  
  // Загружаем профиль
  const profile = await getTeacherProfile(teacherId);
  
  // Загружаем уроки на сегодня
  const lessons = await getTodayLessons(teacherId);
  
  // Загружаем все группы
  const groups = await getTeacherGroups(teacherId);
  
  return { profile, lessons, groups };
}
```

### Пример 2: Отметка посещаемости

```typescript
async function markAttendance(groupId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // Получаем учеников
  const students = await getGroupStudents(groupId);
  
  // Отмечаем всех как присутствующих
  const attendance = students.map(student => ({
    studentId: student.student_id,
    status: 'present' as const
  }));
  
  // Сохраняем
  await saveAttendance(groupId, today, attendance);
}
```

### Пример 3: Оценка прогресса

```typescript
async function rateStudentProgress(studentId: string) {
  const skills = [
    { name: 'leadership', label: 'Лидерство' },
    { name: 'logic', label: 'Логика' },
    { name: 'creativity', label: 'Креативность' }
  ];
  
  // Обновляем несколько навыков
  for (const skill of skills) {
    await updateStudentProgress(
      studentId,
      skill.name,
      1,
      `Успешно развивает навык: ${skill.label}`
    );
  }
}
```

---

## 🔄 Обработка ошибок

Все функции обрабатывают ошибки внутри и возвращают безопасные значения:
- `null` для функций, возвращающих объект
- `[]` (пустой массив) для функций, возвращающих массив
- `false` для функций, возвращающих boolean

```typescript
try {
  const teacher = await getTeacherProfile(teacherId);
  if (!teacher) {
    console.error('Учитель не найден');
    return;
  }
  // Работаем с данными
} catch (error) {
  console.error('Неожиданная ошибка:', error);
}
```

---

## 📚 Связанные файлы

- `/src/app/lib/teacher.ts` - Исходный код функций
- `/src/app/pages/teacher/` - Компоненты интерфейса
- `/TEACHER_INTERFACE_README.md` - Общая документация
- `/teacher_demo_data.sql` - SQL для создания тестовых данных

---

**Дата обновления**: 13 апреля 2026  
**Версия API**: 1.0.0
