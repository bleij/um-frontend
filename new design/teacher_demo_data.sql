-- SQL скрипт для создания демо-данных для тестирования интерфейса учителя
-- Дата: 13 апреля 2026

-- Внимание: Замените 'org-id-here' на реальный ID организации из вашей БД!

-- 1. Создаём тестового учителя
INSERT INTO org_teachers (id, organization_id, full_name, phone, email, specialization, photo_url, rating, status, created_at, updated_at)
VALUES (
  'teacher-demo-001',
  'org-id-here', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID ОРГАНИЗАЦИИ
  'Анна Петровна Смирнова',
  '79991234567',
  'anna.smirnova@example.com',
  'Математика и Программирование',
  NULL,
  4.8,
  'active',
  datetime('now'),
  datetime('now')
);

-- 2. Создаём тестовый курс (если его нет)
INSERT INTO org_courses (id, organization_id, title, description, level, price, skills, status, created_at, updated_at)
VALUES (
  'course-demo-001',
  'org-id-here', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID ОРГАНИЗАЦИИ
  'Основы программирования Python',
  'Изучаем основы Python: переменные, циклы, функции и ООП',
  'Начинающий',
  5000,
  'Программирование,Логика,Решение задач',
  'active',
  datetime('now'),
  datetime('now')
);

-- 3. Создаём несколько групп для учителя
INSERT INTO org_course_groups (id, course_id, group_name, schedule, max_students, current_students, teacher_id, status, created_at, updated_at)
VALUES 
(
  'group-demo-001',
  'course-demo-001',
  'Группа А - Утренняя',
  'Пн, Ср, Пт 10:00-11:30',
  15,
  8,
  'teacher-demo-001',
  'active',
  datetime('now'),
  datetime('now')
),
(
  'group-demo-002',
  'course-demo-001',
  'Группа Б - Вечерняя',
  'Вт, Чт 18:00-19:30',
  12,
  10,
  'teacher-demo-001',
  'active',
  datetime('now'),
  datetime('now')
);

-- 4. Создаём тестовых родителей (если их нет)
-- Родитель 1
INSERT OR IGNORE INTO users (id, role, email, password, phone, first_name, last_name, created_at, updated_at)
VALUES (
  'user-parent-demo-001',
  'parent',
  '79991111111@um.app',
  '79991111111um2026',
  '79991111111',
  'Мария',
  'Иванова',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO parent_profiles (id, user_id, full_name, phone, age, children_count, created_at, updated_at)
VALUES (
  'parent-demo-001',
  'user-parent-demo-001',
  'Мария Иванова',
  '79991111111',
  35,
  1,
  datetime('now'),
  datetime('now')
);

-- Родитель 2
INSERT OR IGNORE INTO users (id, role, email, password, phone, first_name, last_name, created_at, updated_at)
VALUES (
  'user-parent-demo-002',
  'parent',
  '79992222222@um.app',
  '79992222222um2026',
  '79992222222',
  'Алексей',
  'Сидоров',
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO parent_profiles (id, user_id, full_name, phone, age, children_count, created_at, updated_at)
VALUES (
  'parent-demo-002',
  'user-parent-demo-002',
  'Алексей Сидоров',
  '79992222222',
  40,
  2,
  datetime('now'),
  datetime('now')
);

-- 5. Создаём тестовых детей
INSERT OR IGNORE INTO child_profiles (id, parent_id, full_name, age, age_category, interests, has_completed_test, created_at, updated_at)
VALUES 
(
  'child-demo-001',
  'parent-demo-001',
  'Иван Иванов',
  10,
  'child',
  'Программирование, Математика',
  0,
  datetime('now'),
  datetime('now')
),
(
  'child-demo-002',
  'parent-demo-001',
  'София Иванова',
  12,
  'teen',
  'Робототехника, Логика',
  0,
  datetime('now'),
  datetime('now')
),
(
  'child-demo-003',
  'parent-demo-002',
  'Максим Сидоров',
  11,
  'child',
  'Игры, Программирование',
  0,
  datetime('now'),
  datetime('now')
),
(
  'child-demo-004',
  'parent-demo-002',
  'Анна Сидорова',
  9,
  'child',
  'Рисование, Математика',
  0,
  datetime('now'),
  datetime('now')
);

-- 6. Записываем детей в группы
INSERT INTO org_students (id, organization_id, child_profile_id, group_id, status, enrolled_at)
VALUES 
(
  'student-demo-001',
  'org-id-here', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID ОРГАНИЗАЦИИ
  'child-demo-001',
  'group-demo-001',
  'active',
  datetime('now')
),
(
  'student-demo-002',
  'org-id-here', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID ОРГАНИЗАЦИИ
  'child-demo-002',
  'group-demo-001',
  'active',
  datetime('now')
),
(
  'student-demo-003',
  'org-id-here', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID ОРГАНИЗАЦИИ
  'child-demo-003',
  'group-demo-002',
  'active',
  datetime('now')
),
(
  'student-demo-004',
  'org-id-here', -- ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ID ОРГАНИЗАЦИИ
  'child-demo-004',
  'group-demo-002',
  'active',
  datetime('now')
);

-- 7. (Опционально) Добавляем записи посещаемости за прошлые дни
INSERT INTO org_attendance (id, student_id, group_id, date, status, notes, created_at)
VALUES 
(
  'att-demo-001',
  'student-demo-001',
  'group-demo-001',
  date('now', '-7 days'),
  'present',
  NULL,
  datetime('now', '-7 days')
),
(
  'att-demo-002',
  'student-demo-002',
  'group-demo-001',
  date('now', '-7 days'),
  'late',
  'Опоздал на 10 минут',
  datetime('now', '-7 days')
),
(
  'att-demo-003',
  'student-demo-003',
  'group-demo-002',
  date('now', '-5 days'),
  'absent',
  'Болел',
  datetime('now', '-5 days')
);

-- Готово! Теперь можно войти как учитель с номером: +7 (999) 123-45-67
-- После входа вы увидите:
-- - 2 группы в списке
-- - Уроки на сегодня в расписании
-- - 4 ученика (2 в группе А, 2 в группе Б)
-- - Историю посещаемости

-- Для проверки данных выполните:
-- SELECT * FROM org_teachers WHERE id = 'teacher-demo-001';
-- SELECT * FROM org_course_groups WHERE teacher_id = 'teacher-demo-001';
-- SELECT * FROM org_students WHERE group_id IN ('group-demo-001', 'group-demo-002');
