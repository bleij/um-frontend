import { db } from './db';

export interface Course {
  id: string;
  title: string;
  description?: string;
  category?: string;
  age_group?: string;
  provider_id?: string;
  provider_type?: string;
  duration?: string;
  format?: string;
  price?: number;
  rating?: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  student_profile_id: string;
  student_profile_type: string;
  enrolled_at?: string;
  status?: string;
}

export interface FavoriteCourse {
  id: string;
  course_id: string;
  profile_id: string;
  profile_type: string;
  created_at?: string;
}

// Генерация уникального ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ===== КУРСЫ =====

export async function createCourse(data: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO courses (id, title, description, category, age_group, provider_id, provider_type, duration, format, price, rating, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [
      id,
      data.title,
      data.description || null,
      data.category || null,
      data.age_group || null,
      data.provider_id || null,
      data.provider_type || null,
      data.duration || null,
      data.format || null,
      data.price || null,
      data.rating || null,
      data.image_url || null,
    ],
  });
  return { id, ...data };
}

export async function getAllCourses(): Promise<Course[]> {
  const result = await db.execute('SELECT * FROM courses ORDER BY created_at DESC');
  return result.rows as unknown as Course[];
}

export async function getCourseById(id: string): Promise<Course | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM courses WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as Course;
}

export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM courses WHERE category = ? ORDER BY created_at DESC',
    args: [category],
  });
  return result.rows as unknown as Course[];
}

export async function getCoursesByAgeGroup(ageGroup: string): Promise<Course[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM courses WHERE age_group = ? ORDER BY created_at DESC',
    args: [ageGroup],
  });
  return result.rows as unknown as Course[];
}

export async function getCoursesByProviderId(providerId: string): Promise<Course[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM courses WHERE provider_id = ? ORDER BY created_at DESC',
    args: [providerId],
  });
  return result.rows as unknown as Course[];
}

export async function searchCourses(query: string): Promise<Course[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM courses WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC',
    args: [`%${query}%`, `%${query}%`],
  });
  return result.rows as unknown as Course[];
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<void> {
  const updates: string[] = [];
  const args: any[] = [];
  
  if (data.title) {
    updates.push('title = ?');
    args.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    args.push(data.description);
  }
  if (data.category !== undefined) {
    updates.push('category = ?');
    args.push(data.category);
  }
  if (data.age_group !== undefined) {
    updates.push('age_group = ?');
    args.push(data.age_group);
  }
  if (data.duration !== undefined) {
    updates.push('duration = ?');
    args.push(data.duration);
  }
  if (data.format !== undefined) {
    updates.push('format = ?');
    args.push(data.format);
  }
  if (data.price !== undefined) {
    updates.push('price = ?');
    args.push(data.price);
  }
  if (data.rating !== undefined) {
    updates.push('rating = ?');
    args.push(data.rating);
  }
  if (data.image_url !== undefined) {
    updates.push('image_url = ?');
    args.push(data.image_url);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  args.push(id);
  
  await db.execute({
    sql: `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`,
    args,
  });
}

export async function deleteCourse(id: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM courses WHERE id = ?',
    args: [id],
  });
}

// ===== ЗАПИСИ НА КУРСЫ =====

export async function enrollInCourse(
  courseId: string,
  studentProfileId: string,
  studentProfileType: string
): Promise<CourseEnrollment> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO course_enrollments (id, course_id, student_profile_id, student_profile_type) VALUES (?, ?, ?, ?)',
    args: [id, courseId, studentProfileId, studentProfileType],
  });
  return { id, course_id: courseId, student_profile_id: studentProfileId, student_profile_type: studentProfileType };
}

export async function getEnrollmentsByProfileId(profileId: string): Promise<CourseEnrollment[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM course_enrollments WHERE student_profile_id = ? ORDER BY enrolled_at DESC',
    args: [profileId],
  });
  return result.rows as unknown as CourseEnrollment[];
}

export async function getEnrollmentsByCourseId(courseId: string): Promise<CourseEnrollment[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM course_enrollments WHERE course_id = ? ORDER BY enrolled_at DESC',
    args: [courseId],
  });
  return result.rows as unknown as CourseEnrollment[];
}

export async function cancelEnrollment(id: string): Promise<void> {
  await db.execute({
    sql: 'UPDATE course_enrollments SET status = ? WHERE id = ?',
    args: ['cancelled', id],
  });
}

// ===== ИЗБРАННЫЕ КУРСЫ =====

export async function addToFavorites(
  courseId: string,
  profileId: string,
  profileType: string
): Promise<FavoriteCourse> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO favorite_courses (id, course_id, profile_id, profile_type) VALUES (?, ?, ?, ?)',
    args: [id, courseId, profileId, profileType],
  });
  return { id, course_id: courseId, profile_id: profileId, profile_type: profileType };
}

export async function removeFromFavorites(courseId: string, profileId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM favorite_courses WHERE course_id = ? AND profile_id = ?',
    args: [courseId, profileId],
  });
}

export async function getFavoritesByProfileId(profileId: string): Promise<FavoriteCourse[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM favorite_courses WHERE profile_id = ? ORDER BY created_at DESC',
    args: [profileId],
  });
  return result.rows as unknown as FavoriteCourse[];
}

export async function isFavorite(courseId: string, profileId: string): Promise<boolean> {
  const result = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM favorite_courses WHERE course_id = ? AND profile_id = ?',
    args: [courseId, profileId],
  });
  const count = (result.rows[0] as any).count;
  return count > 0;
}

// ===== ИНИЦИАЛИЗАЦИЯ ДЕМО-ДАННЫХ =====

export async function initDemoCourses(): Promise<void> {
  const courses = await getAllCourses();
  if (courses.length > 0) return; // Уже есть курсы
  
  const demoCourses = [
    {
      title: 'Программирование для начинающих',
      description: 'Изучи основы программирования на Python в игровой форме',
      category: 'Технологии и IT',
      age_group: '6-11',
      duration: '3 месяца',
      format: 'Онлайн',
      price: 5000,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    },
    {
      title: 'Робототехника',
      description: 'Создавай и программируй своих роботов',
      category: 'Технологии и IT',
      age_group: '6-11',
      duration: '4 месяца',
      format: 'Офлайн',
      price: 7000,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    },
    {
      title: 'Рисование и живопись',
      description: 'Развивай творческие способности через искусство',
      category: 'Искусство и творчество',
      age_group: '6-11',
      duration: '2 месяца',
      format: 'Офлайн',
      price: 4000,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    },
    {
      title: 'Музыкальная студия',
      description: 'Научись играть на музыкальных инструментах',
      category: 'Искусство и творчество',
      age_group: '6-11',
      duration: '6 месяцев',
      format: 'Офлайн',
      price: 6000,
      rating: 4.6,
      image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    },
    {
      title: 'Детская йога',
      description: 'Укрепляй здоровье и развивай гибкость',
      category: 'Спорт и физическая активность',
      age_group: '6-11',
      duration: '2 месяца',
      format: 'Офлайн',
      price: 3500,
      rating: 4.5,
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    },
    {
      title: 'Театральное мастерство',
      description: 'Развивай актерские навыки и уверенность в себе',
      category: 'Искусство и творчество',
      age_group: '12-17',
      duration: '3 месяца',
      format: 'Офлайн',
      price: 5500,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400',
    },
    {
      title: 'Web-разработка',
      description: 'Создавай сайты и веб-приложения',
      category: 'Технологии и IT',
      age_group: '12-17',
      duration: '5 месяцев',
      format: 'Онлайн',
      price: 8000,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    },
    {
      title: 'Дизайн и графика',
      description: 'Освой программы Adobe и создавай крутые дизайны',
      category: 'Искусство и творчество',
      age_group: '12-17',
      duration: '4 месяца',
      format: 'Онлайн',
      price: 6500,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    },
    {
      title: 'Ораторское мастерство',
      description: 'Научись уверенно выступать публично',
      category: 'Социальные навыки и коммуникация',
      age_group: '12-17',
      duration: '2 месяца',
      format: 'Офлайн',
      price: 5000,
      rating: 4.6,
      image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
    },
    {
      title: 'Финансовая грамотность',
      description: 'Учись управлять деньгами и планировать бюджет',
      category: 'Аналитическое мышление',
      age_group: '18-20',
      duration: '3 месяца',
      format: 'Онлайн',
      price: 7000,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
    },
    {
      title: 'Основы AI и машинного обучения',
      description: 'Погрузись в мир искусственного интеллекта',
      category: 'Технологии и IT',
      age_group: '18-20',
      duration: '6 месяцев',
      format: 'Онлайн',
      price: 12000,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    },
    {
      title: 'Лидерство и командная работа',
      description: 'Развивай навыки лидера и работы в команде',
      category: 'Социальные навыки и коммуникация',
      age_group: '18-20',
      duration: '2 месяца',
      format: 'Офлайн',
      price: 6000,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    },
  ];
  
  for (const course of demoCourses) {
    await createCourse(course);
  }
  
  console.log('✅ Demo courses initialized');
}