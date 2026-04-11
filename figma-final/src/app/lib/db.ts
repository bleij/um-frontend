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

// Автоматическая инициализация при импорте
initDatabase();