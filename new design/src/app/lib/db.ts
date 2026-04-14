import { createClient } from '@libsql/client';

// Инициализация клиента Turso
export const db = createClient({
  url: 'libsql://um-figma-ndrt.aws-eu-west-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NzkwNzc1MzIsImlhdCI6MTc3Mzg5MzUzMiwiaWQiOiIwMTlkMDQ0YS1lZjAxLTc3YjktODQ5OS1jZjc2ZmE3ODVmOTciLCJyaWQiOiI5NDA4NDNlMC03MGE4LTQ3ZjAtOTAwNC03NmUyYmFhMTAyYzAifQ.cfPUidNn3u7525zE6AEbcRRCfCXhMnkUEKjphscKAAiTKYQ4ZeE8tb7BLLqZjZyBLHyIHjM4fz0PUfyHY9JKDg',
});

// Инициализация схемы базы данных
export async function initDatabase() {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Таблица профилей пользователей (все 6 ролей)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Миграция: добавляем колонки first_name и last_name если их нет
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN first_name TEXT`);
      console.log('✅ Added first_name column to users table');
    } catch (e: any) {
      // Колонка уже существует или другая ошибка - проверяем
      if (e.message && !e.message.includes('duplicate column name')) {
        console.log('ℹ️ first_name column migration skipped:', e.message);
      }
    }
    
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN last_name TEXT`);
      console.log('✅ Added last_name column to users table');
    } catch (e: any) {
      // Колонка уже существует или другая ошибка - проверяем
      if (e.message && !e.message.includes('duplicate column name')) {
        console.log('ℹ️ last_name column migration skipped:', e.message);
      }
    }

    // Миграция: добавляем колонку phone если её нет (на будущее)
    try {
      await db.execute(`ALTER TABLE users ADD COLUMN phone TEXT`);
      console.log('✅ Added phone column to users table');
    } catch (e: any) {
      // Колонка уже существует или другая ошибка - игнорируем
      if (e.message && !e.message.includes('duplicate column name')) {
        console.log('ℹ️ phone column migration skipped:', e.message);
      }
    }

    // Таблица профилей родителей
    await db.execute(`
      CREATE TABLE IF NOT EXISTS parent_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        age INTEGER,
        children_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Таблица детских профилей
    await db.execute(`
      CREATE TABLE IF NOT EXISTS child_profiles (
        id TEXT PRIMARY KEY,
        parent_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        age_category TEXT NOT NULL,
        interests TEXT,
        has_completed_test BOOLEAN DEFAULT FALSE,
        test_result_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES parent_profiles(id)
      )
    `);

    // Миграция: добавляем колонку phone в child_profiles если её нет
    try {
      await db.execute(`ALTER TABLE child_profiles ADD COLUMN phone TEXT`);
      console.log('✅ Added phone column to child_profiles table');
    } catch (e: any) {
      if (e.message && !e.message.includes('duplicate column name')) {
        console.log('ℹ️ phone column migration skipped:', e.message);
      }
    }

    // Миграция: добавляем колонку user_id в child_profiles если её нет
    try {
      await db.execute(`ALTER TABLE child_profiles ADD COLUMN user_id TEXT`);
      console.log('✅ Added user_id column to child_profiles table');
    } catch (e: any) {
      if (e.message && !e.message.includes('duplicate column name')) {
        console.log('ℹ️ user_id column migration skipped:', e.message);
      }
    }

    // Таблица профилей детей (6-11 лет)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS children_own_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        interests TEXT,
        has_completed_test BOOLEAN DEFAULT FALSE,
        test_result_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Таблица профилей подростков (12-17 лет)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS teen_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        interests TEXT,
        has_completed_test BOOLEAN DEFAULT FALSE,
        test_result_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Таблица профилей молодых взрослых (18-20 лет)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS young_adult_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        education_level TEXT,
        career_goals TEXT,
        interests TEXT,
        has_completed_test BOOLEAN DEFAULT FALSE,
        test_result_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Таблица профилей организаций
    await db.execute(`
      CREATE TABLE IF NOT EXISTS organization_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        organization_name TEXT NOT NULL,
        organization_type TEXT,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Миграции для organization_profiles: добавляем новые колонки
    const orgColumns = [
      'bin TEXT',
      'city TEXT',
      'address TEXT',
      'license_url TEXT',
      'registration_url TEXT',
      'logo_url TEXT',
    ];

    for (const column of orgColumns) {
      try {
        await db.execute(`ALTER TABLE organization_profiles ADD COLUMN ${column}`);
        console.log(`✅ Added ${column.split(' ')[0]} column to organization_profiles table`);
      } catch (e: any) {
        if (e.message && !e.message.includes('duplicate column name')) {
          console.log(`ℹ️ ${column.split(' ')[0]} column migration skipped:`, e.message);
        }
      }
    }

    // Таблица курсов организации
    await db.execute(`
      CREATE TABLE IF NOT EXISTS org_courses (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        level TEXT,
        price REAL DEFAULT 0,
        skills TEXT,
        image_url TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organization_profiles(id)
      )
    `);

    // Таблица групп курсов
    await db.execute(`
      CREATE TABLE IF NOT EXISTS org_course_groups (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        group_name TEXT NOT NULL,
        schedule TEXT,
        max_students INTEGER DEFAULT 10,
        current_students INTEGER DEFAULT 0,
        teacher_id TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES org_courses(id)
      )
    `);

    // Таблица учителей организации
    await db.execute(`
      CREATE TABLE IF NOT EXISTS org_teachers (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        specialization TEXT,
        photo_url TEXT,
        rating REAL DEFAULT 0,
        status TEXT DEFAULT 'invited',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organization_profiles(id)
      )
    `);

    // Таблица учеников организации
    await db.execute(`
      CREATE TABLE IF NOT EXISTS org_students (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        child_profile_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organization_profiles(id),
        FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id),
        FOREIGN KEY (group_id) REFERENCES org_course_groups(id)
      )
    `);

    // Таблица посещаемости
    await db.execute(`
      CREATE TABLE IF NOT EXISTS org_attendance (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES org_students(id),
        FOREIGN KEY (group_id) REFERENCES org_course_groups(id)
      )
    `);

    // Таблица активаций курсов (подтверждение через QR-код)
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS org_course_activations (
          id TEXT PRIMARY KEY,
          student_id TEXT NOT NULL,
          group_id TEXT NOT NULL,
          activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES org_students(id),
          FOREIGN KEY (group_id) REFERENCES org_course_groups(id)
        )
      `);
      console.log('✅ org_course_activations table created/verified');
    } catch (e: any) {
      console.log('ℹ️ org_course_activations table migration skipped:', e.message);
    }

    // Таблица профилей менторов
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mentor_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        expertise TEXT,
        experience_years INTEGER,
        phone TEXT,
        bio TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Миграции для mentor_profiles: добавляем новые колонки
    const mentorColumns = [
      'photo_url TEXT',
      'city TEXT',
      'languages TEXT',
      'specialization TEXT',
      'education TEXT',
      'certificate_url TEXT',
      'skills TEXT',
      'pitch TEXT',
      'session_price INTEGER',
    ];

    for (const column of mentorColumns) {
      try {
        await db.execute(`ALTER TABLE mentor_profiles ADD COLUMN ${column}`);
        console.log(`✅ Added ${column.split(' ')[0]} column to mentor_profiles table`);
      } catch (e: any) {
        if (e.message && !e.message.includes('duplicate column name')) {
          console.log(`ℹ️ ${column.split(' ')[0]} column migration skipped:`, e.message);
        }
      }
    }

    // Таблица ожидающих модерации менторов
    await db.execute(`
      CREATE TABLE IF NOT EXISTS mentors_pending (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        photo_url TEXT,
        city TEXT,
        languages TEXT,
        specialization TEXT,
        experience_years INTEGER,
        education TEXT,
        certificate_url TEXT,
        skills TEXT,
        pitch TEXT,
        bio TEXT,
        session_price INTEGER,
        phone TEXT,
        status TEXT DEFAULT 'pending',
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Таблица результатов тестирования
    await db.execute(`
      CREATE TABLE IF NOT EXISTS test_results (
        id TEXT PRIMARY KEY,
        profile_id TEXT NOT NULL,
        profile_type TEXT NOT NULL,
        answers TEXT NOT NULL,
        predisposition TEXT,
        recommended_courses TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица курсов
    await db.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        age_group TEXT,
        provider_id TEXT,
        provider_type TEXT,
        duration TEXT,
        format TEXT,
        price REAL,
        rating REAL DEFAULT 0,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Миграция: добавляем колонку rating если её нет
    try {
      await db.execute(`ALTER TABLE courses ADD COLUMN rating REAL DEFAULT 0`);
      console.log('✅ Added rating column to courses table');
    } catch (e: any) {
      // Колонка уже существует или другая ошибка
      if (e.message && !e.message.includes('duplicate column name')) {
        console.log('ℹ️ rating column migration skipped:', e.message);
      }
    }

    // Таблица записей на курсы
    await db.execute(`
      CREATE TABLE IF NOT EXISTS course_enrollments (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        student_profile_id TEXT NOT NULL,
        student_profile_type TEXT NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    // Таблица избранных курсов
    await db.execute(`
      CREATE TABLE IF NOT EXISTS favorite_courses (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        profile_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    console.log('✅ Database schema initialized successfully');
  } catch (error: any) {
    console.error('❌ Error initializing database:', error);
    console.error('❌ Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    // Не бросаем ошибку дальше, чтобы приложение могло запуститься
    // throw error;
  }
}

// Отложенная инициализация при первом обращении к БД
let dbInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureDbInitialized() {
  if (dbInitialized) return;
  if (initPromise) return initPromise;
  
  initPromise = initDatabase().then(() => {
    dbInitialized = true;
  }).catch(err => {
    console.error('Failed to initialize database:', err);
    initPromise = null; // Сбрасываем, чтобы можно было попробовать снова
  });
  
  return initPromise;
}