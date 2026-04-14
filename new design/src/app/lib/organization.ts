import { db, ensureDbInitialized } from './db';

// Создание курса организации
export async function createOrgCourse(data: {
  organization_id: string;
  title: string;
  description?: string;
  level?: string;
  price?: number;
  skills?: string; // JSON строка с навыками
}) {
  await ensureDbInitialized();
  
  const id = crypto.randomUUID();
  
  console.log('📝 Создание курса организации:', { id, ...data });
  
  await db.execute({
    sql: `INSERT INTO org_courses (id, organization_id, title, description, level, price, skills)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [id, data.organization_id, data.title, data.description || '', data.level || '', data.price || 0, data.skills || '[]']
  });
  
  console.log('✅ Курс создан с ID:', id);
  
  return { id, ...data };
}

// Получение курсов организации
export async function getOrgCourses(organizationId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT * FROM org_courses WHERE organization_id = ? ORDER BY created_at DESC`,
    args: [organizationId]
  });
  
  return result.rows;
}

// Получение курса по ID
export async function getCourseById(courseId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT * FROM org_courses WHERE id = ?`,
    args: [courseId]
  });
  
  return result.rows[0];
}

// Обновление курса
export async function updateCourse(courseId: string, data: {
  title?: string;
  description?: string;
  level?: string;
  price?: number;
  skills?: string;
  status?: string;
}) {
  await ensureDbInitialized();
  
  const updates: string[] = [];
  const args: any[] = [];
  
  if (data.title !== undefined) {
    updates.push('title = ?');
    args.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    args.push(data.description);
  }
  if (data.level !== undefined) {
    updates.push('level = ?');
    args.push(data.level);
  }
  if (data.price !== undefined) {
    updates.push('price = ?');
    args.push(data.price);
  }
  if (data.skills !== undefined) {
    updates.push('skills = ?');
    args.push(data.skills);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    args.push(data.status);
  }
  
  if (updates.length === 0) {
    return { success: false, message: 'Нет данных для обновления' };
  }
  
  args.push(courseId);
  
  await db.execute({
    sql: `UPDATE org_courses SET ${updates.join(', ')} WHERE id = ?`,
    args
  });
  
  return { success: true };
}

// Получение групп курса
export async function getCourseGroups(courseId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            og.*,
            ot.full_name as teacher_name
          FROM org_course_groups og
          LEFT JOIN org_teachers ot ON og.teacher_id = ot.id
          WHERE og.course_id = ?
          ORDER BY og.created_at DESC`,
    args: [courseId]
  });
  
  return result.rows;
}

// Создание группы курса
export async function createCourseGroup(data: {
  course_id: string;
  group_name: string;
  schedule?: string;
  max_students?: number;
  teacher_id?: string;
}) {
  await ensureDbInitialized();
  
  const id = crypto.randomUUID();
  
  await db.execute({
    sql: `INSERT INTO org_course_groups (id, course_id, group_name, schedule, max_students, teacher_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, data.course_id, data.group_name, data.schedule || '', data.max_students || 10, data.teacher_id || null]
  });
  
  return { id, ...data };
}

// Получение всех групп организации
export async function getAllOrgGroups(organizationId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            og.*,
            oc.title as course_title,
            ot.full_name as teacher_name
          FROM org_course_groups og
          JOIN org_courses oc ON og.course_id = oc.id
          LEFT JOIN org_teachers ot ON og.teacher_id = ot.id
          WHERE oc.organization_id = ?
          ORDER BY og.created_at DESC`,
    args: [organizationId]
  });
  
  return result.rows;
}

// Получение группы по ID
export async function getGroupById(groupId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            og.*,
            oc.title as course_title
          FROM org_course_groups og
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE og.id = ?`,
    args: [groupId]
  });
  
  return result.rows[0];
}

// Получение учеников группы
export async function getGroupStudents(groupId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            os.*,
            cp.full_name,
            cp.age
          FROM org_students os
          JOIN child_profiles cp ON os.child_profile_id = cp.id
          WHERE os.group_id = ? AND os.status = 'active'
          ORDER BY cp.full_name`,
    args: [groupId]
  });
  
  return result.rows;
}

// Получение всех детей (для добавления в группы)
export async function getAllChildren() {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT id, full_name, age FROM child_profiles ORDER BY full_name`
  });
  
  return result.rows;
}

// Удаление ученика из группы
export async function removeStudentFromGroup(studentId: string) {
  await ensureDbInitialized();
  
  // Получаем group_id перед удалением
  const studentResult = await db.execute({
    sql: `SELECT group_id FROM org_students WHERE id = ?`,
    args: [studentId]
  });
  
  if (studentResult.rows.length === 0) {
    throw new Error('Ученик не найден');
  }
  
  const groupId = studentResult.rows[0].group_id;
  
  // Удаляем ученика
  await db.execute({
    sql: `DELETE FROM org_students WHERE id = ?`,
    args: [studentId]
  });
  
  // Обновляем количество учеников в группе
  await db.execute({
    sql: `UPDATE org_course_groups 
          SET current_students = current_students - 1 
          WHERE id = ?`,
    args: [groupId]
  });
  
  return { success: true };
}

// Добавление преподавателя
export async function addOrgTeacher(data: {
  organization_id: string;
  full_name: string;
  phone: string;
  email?: string;
  specialization?: string;
}) {
  await ensureDbInitialized();
  
  const id = crypto.randomUUID();
  
  await db.execute({
    sql: `INSERT INTO org_teachers (id, organization_id, full_name, phone, email, specialization, status)
          VALUES (?, ?, ?, ?, ?, ?, 'invited')`,
    args: [id, data.organization_id, data.full_name, data.phone, data.email || '', data.specialization || '']
  });
  
  return { id, ...data };
}

// Получение преподавателей организации
export async function getOrgTeachers(organizationId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT * FROM org_teachers WHERE organization_id = ? ORDER BY created_at DESC`,
    args: [organizationId]
  });
  
  return result.rows;
}

// Получение преподавателя по ID
export async function getTeacherById(teacherId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT * FROM org_teachers WHERE id = ?`,
    args: [teacherId]
  });
  
  return result.rows[0];
}

// Получение групп преподавателя
export async function getTeacherGroups(teacherId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            og.*,
            oc.title as course_title,
            oc.level as course_level
          FROM org_course_groups og
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE og.teacher_id = ?
          ORDER BY og.created_at DESC`,
    args: [teacherId]
  });
  
  return result.rows;
}

// Получение всех учеников преподавателя
export async function getTeacherStudents(teacherId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT DISTINCT
            os.*,
            cp.full_name,
            cp.age,
            og.group_name,
            oc.title as course_title
          FROM org_students os
          JOIN child_profiles cp ON os.child_profile_id = cp.id
          JOIN org_course_groups og ON os.group_id = og.id
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE og.teacher_id = ? AND os.status = 'active'
          ORDER BY cp.full_name`,
    args: [teacherId]
  });
  
  return result.rows;
}

// Получение учеников организации
export async function getOrgStudents(organizationId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            os.*,
            cp.full_name,
            cp.age,
            og.group_name,
            oc.title as course_title
          FROM org_students os
          JOIN child_profiles cp ON os.child_profile_id = cp.id
          JOIN org_course_groups og ON os.group_id = og.id
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE os.organization_id = ?
          ORDER BY cp.full_name`,
    args: [organizationId]
  });
  
  return result.rows;
}

// Добавление ученика в группу
export async function enrollStudentToGroup(data: {
  organization_id: string;
  child_profile_id: string;
  group_id: string;
}) {
  await ensureDbInitialized();
  
  const id = crypto.randomUUID();
  
  await db.execute({
    sql: `INSERT INTO org_students (id, organization_id, child_profile_id, group_id, status)
          VALUES (?, ?, ?, ?, 'active')`,
    args: [id, data.organization_id, data.child_profile_id, data.group_id]
  });
  
  // Обновляем количество учеников в группе
  await db.execute({
    sql: `UPDATE org_course_groups 
          SET current_students = current_students + 1 
          WHERE id = ?`,
    args: [data.group_id]
  });
  
  return { id, ...data };
}

// Отметка посещаемости
export async function markAttendance(data: {
  student_id: string;
  group_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}) {
  await ensureDbInitialized();
  
  const id = crypto.randomUUID();
  
  await db.execute({
    sql: `INSERT INTO org_attendance (id, student_id, group_id, date, status, notes)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, data.student_id, data.group_id, data.date, data.status, data.notes || '']
  });
  
  return { id, ...data };
}

// Получение посещаемости группы
export async function getGroupAttendance(groupId: string, startDate?: string, endDate?: string) {
  await ensureDbInitialized();
  
  let sql = `SELECT 
              oa.*,
              os.child_profile_id,
              cp.full_name
            FROM org_attendance oa
            JOIN org_students os ON oa.student_id = os.id
            JOIN child_profiles cp ON os.child_profile_id = cp.id
            WHERE oa.group_id = ?`;
  
  const args: any[] = [groupId];
  
  if (startDate && endDate) {
    sql += ` AND oa.date BETWEEN ? AND ?`;
    args.push(startDate, endDate);
  }
  
  sql += ` ORDER BY oa.date DESC, cp.full_name`;
  
  const result = await db.execute({
    sql,
    args
  });
  
  return result.rows;
}

// Получение статистики организации
export async function getOrgStats(organizationId: string) {
  await ensureDbInitialized();
  
  // Количество курсов
  const coursesResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM org_courses WHERE organization_id = ?`,
    args: [organizationId]
  });
  
  // Количество учеников
  const studentsResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM org_students WHERE organization_id = ? AND status = 'active'`,
    args: [organizationId]
  });
  
  // Количество преподавателей
  const teachersResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM org_teachers WHERE organization_id = ?`,
    args: [organizationId]
  });
  
  // Количество групп
  const groupsResult = await db.execute({
    sql: `SELECT COUNT(*) as count FROM org_course_groups og
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE oc.organization_id = ?`,
    args: [organizationId]
  });
  
  return {
    courses: Number(coursesResult.rows[0]?.count || 0),
    students: Number(studentsResult.rows[0]?.count || 0),
    teachers: Number(teachersResult.rows[0]?.count || 0),
    groups: Number(groupsResult.rows[0]?.count || 0),
  };
}

// Получение ученика по ID
export async function getStudentById(studentId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            os.*,
            cp.full_name,
            cp.age,
            cp.parent_id,
            og.group_name,
            oc.title as course_title,
            oc.level as course_level,
            ot.full_name as teacher_name
          FROM org_students os
          JOIN child_profiles cp ON os.child_profile_id = cp.id
          JOIN org_course_groups og ON os.group_id = og.id
          JOIN org_courses oc ON og.course_id = oc.id
          LEFT JOIN org_teachers ot ON og.teacher_id = ot.id
          WHERE os.id = ?`,
    args: [studentId]
  });
  
  return result.rows[0];
}

// Получение статистики ученика
export async function getStudentStats(studentId: string) {
  await ensureDbInitialized();
  
  // Получаем посещаемость
  const attendanceResult = await db.execute({
    sql: `SELECT 
            COUNT(*) as total_classes,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count,
            SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_count
          FROM org_attendance 
          WHERE student_id = ?`,
    args: [studentId]
  });
  
  const stats = attendanceResult.rows[0];
  const totalClasses = Number(stats?.total_classes || 0);
  const presentCount = Number(stats?.present_count || 0);
  const absentCount = Number(stats?.absent_count || 0);
  const lateCount = Number(stats?.late_count || 0);
  
  const attendanceRate = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
  
  // Получаем последние посещения
  const recentAttendance = await db.execute({
    sql: `SELECT date, status, notes
          FROM org_attendance 
          WHERE student_id = ?
          ORDER BY date DESC
          LIMIT 10`,
    args: [studentId]
  });
  
  return {
    totalClasses,
    presentCount,
    absentCount,
    lateCount,
    attendanceRate,
    recentAttendance: recentAttendance.rows
  };
}

// Получение родителя ученика
export async function getStudentParent(parentId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT p.phone, p.full_name
          FROM parent_profiles p
          WHERE p.id = ?`,
    args: [parentId]
  });
  
  return result.rows[0];
}

// Активация курса для ученика (подтверждение через QR-код)
export async function activateCourseEnrollment(studentId: string) {
  await ensureDbInitialized();
  
  // Проверяем, существует ли ученик
  const studentResult = await db.execute({
    sql: `SELECT os.*, cp.full_name, og.group_name, oc.title as course_title
          FROM org_students os
          JOIN child_profiles cp ON os.child_profile_id = cp.id
          JOIN org_course_groups og ON os.group_id = og.id
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE os.id = ?`,
    args: [studentId]
  });
  
  if (studentResult.rows.length === 0) {
    throw new Error('Ученик не найден');
  }
  
  const student = studentResult.rows[0];
  
  // Проверяем, не активирован ли уже курс
  const activationCheck = await db.execute({
    sql: `SELECT * FROM org_course_activations WHERE student_id = ?`,
    args: [studentId]
  });
  
  if (activationCheck.rows.length > 0) {
    return {
      success: false,
      alreadyActivated: true,
      activationDate: activationCheck.rows[0].activated_at,
      student
    };
  }
  
  // Создаем запись об активации
  const activationId = crypto.randomUUID();
  const activatedAt = new Date().toISOString();
  
  await db.execute({
    sql: `INSERT INTO org_course_activations (id, student_id, group_id, activated_at)
          VALUES (?, ?, ?, ?)`,
    args: [activationId, studentId, student.group_id, activatedAt]
  });
  
  console.log('✅ Курс активирован для ученика:', {
    studentId,
    studentName: student.full_name,
    course: student.course_title,
    group: student.group_name,
    activatedAt
  });
  
  return {
    success: true,
    alreadyActivated: false,
    activationDate: activatedAt,
    student
  };
}

// Получение информации об активации по ID ученика
export async function getActivationByStudentId(studentId: string) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT * FROM org_course_activations WHERE student_id = ?`,
    args: [studentId]
  });
  
  return result.rows[0];
}

// Получение всех активаций организации
export async function getOrgActivations(organizationId: string, limit = 50) {
  await ensureDbInitialized();
  
  const result = await db.execute({
    sql: `SELECT 
            oca.*,
            cp.full_name as student_name,
            og.group_name,
            oc.title as course_title
          FROM org_course_activations oca
          JOIN org_students os ON oca.student_id = os.id
          JOIN child_profiles cp ON os.child_profile_id = cp.id
          JOIN org_course_groups og ON oca.group_id = og.id
          JOIN org_courses oc ON og.course_id = oc.id
          WHERE os.organization_id = ?
          ORDER BY oca.activated_at DESC
          LIMIT ?`,
    args: [organizationId, limit]
  });
  
  return result.rows;
}