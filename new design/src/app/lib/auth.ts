import { createUser, getUserByEmail, User } from './users';
import { getTeacherByPhone } from './teacher';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  teacherId?: string; // Для учителей
}

// Простая аутентификация (для демо)
export async function signUp(
  email: string,
  password: string,
  role: User['role'],
  firstName?: string,
  lastName?: string
): Promise<AuthResponse> {
  try {
    console.log('🔄 signUp вызван с параметрами:', { email, role, firstName, lastName });

    // Проверяем, существует ли пользователь
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('⚠️ Пользователь уже существует:', existingUser);
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // Создаем нового пользователя
    console.log('🔄 Создание нового пользователя...');
    const user = await createUser(email, password, role, firstName, lastName);
    console.log('✅ Пользователь создан:', user);

    // Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('✅ Пользователь сохранен в localStorage');
    console.log('✅ Проверка localStorage:', localStorage.getItem('currentUser'));

    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Sign up error:', error);
    // Обрабатываем ошибку уникальности из базы данных
    if (error?.message?.includes('UNIQUE constraint') || error?.message?.includes('уже существует')) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }
    return { success: false, error: 'Ошибка при регистрации' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    // Сначала проверяем учителя по телефону (если email в формате номера телефона)
    const phoneMatch = email.match(/^(\d+)@um\.app$/);
    
    if (phoneMatch) {
      const phone = phoneMatch[1];
      console.log('🔍 Проверка учителя по номеру телефона:', phone);
      
      let teacher = await getTeacherByPhone(phone);
      
      // Если учитель не найден, создаем демо-учителя
      if (!teacher) {
        console.log('⚠️ Учитель не найден, создаем демо-учителя...');
        teacher = await createDemoTeacher(phone);
      }
      
      if (teacher) {
        console.log('✅ Учитель найден:', teacher);
        
        // Создаем временного пользователя для учителя
        const teacherUser: User = {
          id: teacher.id,
          role: 'organization', // Временно используем organization роль
          email: email,
          password: password,
          phone: teacher.phone,
          first_name: teacher.full_name.split(' ')[0],
          last_name: teacher.full_name.split(' ')[1] || '',
          created_at: teacher.created_at,
          updated_at: teacher.updated_at
        };
        
        // Сохраняем teacher_id отдельно
        localStorage.setItem('teacher_id', teacher.id);
        localStorage.setItem('currentUser', JSON.stringify(teacherUser));
        
        return { success: true, user: teacherUser, teacherId: teacher.id };
      }
    }
    
    // Если не учитель, проверяем обычного пользователя
    const user = await getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Неверный пароль' };
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Ошибка при входе' };
  }
}

export function signOut(): void {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('teacher_id');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) {
    console.log('🔍 getCurrentUser: пользователь не найден в localStorage');
    return null;
  }
  
  const user = JSON.parse(userStr);
  console.log('👤 getCurrentUser: пользователь найден:', user);
  return user;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Создать демо-учителя для тестирования
async function createDemoTeacher(phone: string) {
  try {
    const { db } = await import('./db');
    
    // Сначала создаем демо-организацию, если её нет
    let orgId = 'demo-org-001';
    
    const orgCheck = await db.execute({
      sql: 'SELECT id FROM organization_profiles WHERE id = ?',
      args: [orgId]
    });
    
    if (orgCheck.rows.length === 0) {
      await db.execute({
        sql: `
          INSERT INTO organization_profiles (
            id, user_id, organization_name, organization_type, 
            inn, logo_url, description, address, website, 
            contact_phone, contact_email, working_hours, 
            rating, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          orgId,
          'demo-user-001',
          'Демо Образовательный Центр',
          'Образовательный центр',
          '1234567890',
          null,
          'Демо организация для тестирования',
          'г. Москва, ул. Демо, д. 1',
          null,
          phone,
          `demo@um.app`,
          '9:00-18:00',
          5.0,
          new Date().toISOString(),
          new Date().toISOString()
        ]
      });
    }
    
    // Создаем демо-учителя
    const teacherId = `teacher-${Date.now()}`;
    await db.execute({
      sql: `
        INSERT INTO org_teachers (
          id, organization_id, full_name, phone, email, 
          specialization, photo_url, rating, status, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        teacherId,
        orgId,
        'Демо Учитель',
        phone,
        `${phone}@um.app`,
        'Общее образование',
        null,
        5.0,
        'active',
        new Date().toISOString(),
        new Date().toISOString()
      ]
    });
    
    console.log('✅ Демо-учитель создан:', teacherId);
    
    // Возвращаем созданного учителя
    return await getTeacherByPhone(phone);
  } catch (error) {
    console.error('Ошибка создания демо-учителя:', error);
    return null;
  }
}