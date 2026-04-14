import { db } from './db';

export interface Teacher {
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

export interface TeacherGroup {
  id: string;
  group_name: string;
  course_id: string;
  course_title: string;
  schedule: string | null;
  max_students: number;
  current_students: number;
  status: string;
}

export interface TeacherLesson {
  id: string;
  group_id: string;
  group_name: string;
  course_title: string;
  time: string;
  location: string | null;
  status: string;
}

export interface GroupStudent {
  id: string;
  student_id: string;
  child_profile_id: string;
  full_name: string;
  age: number;
  photo_url?: string;
  parent_phone?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  group_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface ProgressUpdate {
  id: string;
  student_id: string;
  skill: string;
  value: number;
  notes: string;
  date: string;
}

// Получить профиль учителя по user_id
export async function getTeacherProfile(userId: string): Promise<Teacher | null> {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM org_teachers WHERE id = ?`,
      args: [userId]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0] as any as Teacher;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    return null;
  }
}

// Получить профиль учителя по phone (для входа)
export async function getTeacherByPhone(phone: string): Promise<Teacher | null> {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM org_teachers WHERE phone = ?`,
      args: [phone]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0] as any as Teacher;
  } catch (error) {
    console.error('Error fetching teacher by phone:', error);
    return null;
  }
}

// Получить все группы учителя
export async function getTeacherGroups(teacherId: string): Promise<TeacherGroup[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          g.id,
          g.group_name,
          g.course_id,
          c.title as course_title,
          g.schedule,
          g.max_students,
          g.current_students,
          g.status
        FROM org_course_groups g
        JOIN org_courses c ON g.course_id = c.id
        WHERE g.teacher_id = ?
        ORDER BY g.group_name
      `,
      args: [teacherId]
    });
    
    return result.rows as any as TeacherGroup[];
  } catch (error) {
    console.error('Error fetching teacher groups:', error);
    return [];
  }
}

// Получить расписание на сегодня
export async function getTodayLessons(teacherId: string): Promise<TeacherLesson[]> {
  try {
    // Пока возвращаем mock данные, т.к. нужна отдельная таблица расписания
    const groups = await getTeacherGroups(teacherId);
    
    // Преобразуем группы в уроки на сегодня
    const lessons: TeacherLesson[] = groups.map((group, index) => ({
      id: `lesson-${group.id}`,
      group_id: group.id,
      group_name: group.group_name,
      course_title: group.course_title,
      time: group.schedule || `${10 + index * 2}:00`,
      location: 'Кабинет 101',
      status: 'upcoming'
    }));
    
    return lessons;
  } catch (error) {
    console.error('Error fetching today lessons:', error);
    return [];
  }
}

// Получить учеников группы
export async function getGroupStudents(groupId: string): Promise<GroupStudent[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          s.id,
          s.id as student_id,
          s.child_profile_id,
          c.full_name,
          c.age,
          p.phone as parent_phone
        FROM org_students s
        JOIN child_profiles c ON s.child_profile_id = c.id
        LEFT JOIN parent_profiles p ON c.parent_id = p.id
        WHERE s.group_id = ? AND s.status = 'active'
        ORDER BY c.full_name
      `,
      args: [groupId]
    });
    
    return result.rows as any as GroupStudent[];
  } catch (error) {
    console.error('Error fetching group students:', error);
    return [];
  }
}

// Сохранить посещаемость
export async function saveAttendance(
  groupId: string,
  date: string,
  attendance: { studentId: string; status: 'present' | 'absent' | 'late'; notes?: string }[]
): Promise<boolean> {
  try {
    // Удаляем старые записи за эту дату для этой группы
    await db.execute({
      sql: `DELETE FROM org_attendance WHERE group_id = ? AND date = ?`,
      args: [groupId, date]
    });
    
    // Добавляем новые записи
    for (const record of attendance) {
      await db.execute({
        sql: `
          INSERT INTO org_attendance (id, student_id, group_id, date, status, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          record.studentId,
          groupId,
          date,
          record.status,
          record.notes || null
        ]
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving attendance:', error);
    return false;
  }
}

// Получить посещаемость за дату
export async function getAttendance(groupId: string, date: string): Promise<AttendanceRecord[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM org_attendance
        WHERE group_id = ? AND date = ?
      `,
      args: [groupId, date]
    });
    
    return result.rows as any as AttendanceRecord[];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

// Обновить прогресс ученика (навык)
export async function updateStudentProgress(
  studentId: string,
  skill: string,
  value: number,
  notes: string
): Promise<boolean> {
  try {
    // Создаём таблицу student_progress если её нет
    await db.execute(`
      CREATE TABLE IF NOT EXISTS student_progress (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        skill TEXT NOT NULL,
        value INTEGER NOT NULL,
        notes TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES org_students(id)
      )
    `);
    
    const today = new Date().toISOString().split('T')[0];
    
    await db.execute({
      sql: `
        INSERT INTO student_progress (id, student_id, skill, value, notes, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        `prog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        studentId,
        skill,
        value,
        notes,
        today
      ]
    });
    
    return true;
  } catch (error) {
    console.error('Error updating student progress:', error);
    return false;
  }
}

// Получить организацию учителя
export async function getTeacherOrganization(teacherId: string) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          o.id,
          o.organization_name,
          o.logo_url,
          o.organization_type
        FROM org_teachers t
        JOIN organization_profiles o ON t.organization_id = o.id
        WHERE t.id = ?
      `,
      args: [teacherId]
    });
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching teacher organization:', error);
    return null;
  }
}
