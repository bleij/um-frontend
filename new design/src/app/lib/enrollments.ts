import { db } from './db';

export interface Enrollment {
  id: string;
  course_id: string;
  student_profile_id: string;
  student_profile_type: 'child' | 'teen' | 'young-adult';
  enrolled_at: string;
  status: string;
}

export async function enrollInCourse(
  courseId: string,
  studentProfileId: string,
  profileType: 'child' | 'teen' | 'young-adult'
): Promise<Enrollment> {
  const enrollmentId = `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  await db.execute({
    sql: `INSERT INTO course_enrollments (id, course_id, student_profile_id, student_profile_type, status) 
          VALUES (?, ?, ?, ?, 'active')`,
    args: [enrollmentId, courseId, studentProfileId, profileType]
  });

  const result = await db.execute({
    sql: 'SELECT * FROM course_enrollments WHERE id = ?',
    args: [enrollmentId]
  });

  return result.rows[0] as any;
}

export async function getEnrollmentsByChild(childId: string): Promise<Enrollment[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM course_enrollments WHERE student_profile_id = ? AND status = ?',
    args: [childId, 'active']
  });

  return result.rows as any[];
}

export async function isEnrolled(courseId: string, childId: string): Promise<boolean> {
  const result = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM course_enrollments WHERE course_id = ? AND student_profile_id = ? AND status = ?',
    args: [courseId, childId, 'active']
  });

  return (result.rows[0] as any).count > 0;
}

export async function unenrollFromCourse(courseId: string, childId: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE course_enrollments SET status = ? WHERE course_id = ? AND student_profile_id = ? AND status = ?',
    args: ['cancelled', courseId, childId, 'active']
  });
}

export async function getEnrollmentId(courseId: string, childId: string): Promise<string | null> {
  const result = await db.execute({
    sql: 'SELECT id FROM course_enrollments WHERE course_id = ? AND student_profile_id = ? AND status = ?',
    args: [courseId, childId, 'active']
  });
  
  if (result.rows.length === 0) return null;
  return (result.rows[0] as any).id;
}