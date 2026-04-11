import { db } from './db';

// Типы данных
export interface User {
  id: string;
  role: 'parent' | 'child' | 'teen' | 'young-adult' | 'organization' | 'mentor';
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ParentProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  age?: number;
  children_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ChildProfile {
  id: string;
  parent_id: string;
  full_name: string;
  age?: number;
  age_category: string; // '6-12' | '13-17'
  interests?: string; // JSON string of array
  has_completed_test?: boolean;
  test_result_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChildOwnProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  interests?: string;
  has_completed_test?: boolean;
  test_result_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeenProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  interests?: string;
  has_completed_test?: boolean;
  test_result_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface YoungAdultProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  education_level?: string;
  career_goals?: string;
  interests?: string;
  has_completed_test?: boolean;
  test_result_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrganizationProfile {
  id: string;
  user_id: string;
  organization_name: string;
  organization_type?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MentorProfile {
  id: string;
  user_id: string;
  full_name: string;
  expertise?: string;
  experience_years?: number;
  phone?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

// Генерация уникального ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ===== ПОЛЬЗОВАТЕЛИ =====

export async function createUser(
  email: string, 
  password: string, 
  role: User['role'],
  firstName?: string,
  lastName?: string
): Promise<User> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO users (id, email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, email, password, role, firstName || null, lastName || null],
  });
  return { id, email, password, role, first_name: firstName, last_name: lastName };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as User;
}

// ===== ПРОФИЛИ РОДИТЕЛЕЙ =====

export async function createParentProfile(data: Omit<ParentProfile, 'id' | 'created_at' | 'updated_at'>): Promise<ParentProfile> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO parent_profiles (id, user_id, full_name, phone, age, children_count) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, data.user_id, data.full_name, data.phone || null, data.age || null, data.children_count || 0],
  });
  return { id, ...data };
}

export async function getParentProfileByUserId(userId: string): Promise<ParentProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM parent_profiles WHERE user_id = ?',
    args: [userId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as ParentProfile;
}

export async function updateParentProfile(id: string, data: Partial<ParentProfile>): Promise<void> {
  const updates: string[] = [];
  const args: any[] = [];
  
  if (data.full_name) {
    updates.push('full_name = ?');
    args.push(data.full_name);
  }
  if (data.phone !== undefined) {
    updates.push('phone = ?');
    args.push(data.phone);
  }
  if (data.age !== undefined) {
    updates.push('age = ?');
    args.push(data.age);
  }
  if (data.children_count !== undefined) {
    updates.push('children_count = ?');
    args.push(data.children_count);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  args.push(id);
  
  await db.execute({
    sql: `UPDATE parent_profiles SET ${updates.join(', ')} WHERE id = ?`,
    args,
  });
}

// ===== ДЕТСКИЕ ПРОФИЛИ (создаваемые родителями) =====

export async function createChildProfile(data: Omit<ChildProfile, 'id' | 'created_at' | 'updated_at'>): Promise<ChildProfile> {
  const id = generateId();

  // Определяем возраст: если age_category - это число, используем его как возраст
  let age = data.age;
  if (!age) {
    // Преобразуем возрастную категорию в число (например, "6" -> 6)
    const ageFromCategory = parseInt(data.age_category);
    age = !isNaN(ageFromCategory) ? ageFromCategory : 10; // Дефолтное значение, если не число
  }

  await db.execute({
    sql: 'INSERT INTO child_profiles (id, parent_id, full_name, age, age_category, interests, has_completed_test, test_result_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.parent_id, data.full_name, age, data.age_category, data.interests || null, data.has_completed_test || false, data.test_result_id || null],
  });
  return { id, ...data, age };
}

export async function getChildProfilesByParentId(parentId: string): Promise<ChildProfile[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM child_profiles WHERE parent_id = ? ORDER BY created_at DESC',
    args: [parentId],
  });
  return result.rows as unknown as ChildProfile[];
}

// Алиас для совместимости
export const getChildrenByParentId = getChildProfilesByParentId;

export async function updateChildProfile(id: string, data: Partial<ChildProfile>): Promise<void> {
  const updates: string[] = [];
  const args: any[] = [];
  
  if (data.full_name) {
    updates.push('full_name = ?');
    args.push(data.full_name);
  }
  if (data.age !== undefined) {
    updates.push('age = ?');
    args.push(data.age);
  }
  if (data.age_category) {
    updates.push('age_category = ?');
    args.push(data.age_category);
  }
  if (data.interests !== undefined) {
    updates.push('interests = ?');
    args.push(data.interests);
  }
  if (data.has_completed_test !== undefined) {
    updates.push('has_completed_test = ?');
    args.push(data.has_completed_test);
  }
  if (data.test_result_id !== undefined) {
    updates.push('test_result_id = ?');
    args.push(data.test_result_id);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  args.push(id);
  
  await db.execute({
    sql: `UPDATE child_profiles SET ${updates.join(', ')} WHERE id = ?`,
    args,
  });
}

// ===== ПРОФИЛИ ДЕТЕЙ (собственные аккаунты) =====

export async function createChildOwnProfile(data: Omit<ChildOwnProfile, 'id' | 'created_at' | 'updated_at'>): Promise<ChildOwnProfile> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO children_own_profiles (id, user_id, full_name, age, interests, has_completed_test, test_result_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.user_id, data.full_name, data.age, data.interests || null, data.has_completed_test || false, data.test_result_id || null],
  });
  return { id, ...data };
}

export async function getChildOwnProfileByUserId(userId: string): Promise<ChildOwnProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM children_own_profiles WHERE user_id = ?',
    args: [userId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as ChildOwnProfile;
}

// ===== ПРОФИЛИ ПОДРОСТКОВ =====

export async function createTeenProfile(data: Omit<TeenProfile, 'id' | 'created_at' | 'updated_at'>): Promise<TeenProfile> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO teen_profiles (id, user_id, full_name, age, interests, has_completed_test, test_result_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.user_id, data.full_name, data.age, data.interests || null, data.has_completed_test || false, data.test_result_id || null],
  });
  return { id, ...data };
}

export async function getTeenProfileByUserId(userId: string): Promise<TeenProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM teen_profiles WHERE user_id = ?',
    args: [userId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as TeenProfile;
}

// ===== ПРОФИЛИ МОЛОДЫХ ВЗРОСЛЫХ =====

export async function createYoungAdultProfile(data: Omit<YoungAdultProfile, 'id' | 'created_at' | 'updated_at'>): Promise<YoungAdultProfile> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO young_adult_profiles (id, user_id, full_name, age, education_level, career_goals, interests, has_completed_test, test_result_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.user_id, data.full_name, data.age, data.education_level || null, data.career_goals || null, data.interests || null, data.has_completed_test || false, data.test_result_id || null],
  });
  return { id, ...data };
}

export async function getYoungAdultProfileByUserId(userId: string): Promise<YoungAdultProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM young_adult_profiles WHERE user_id = ?',
    args: [userId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as YoungAdultProfile;
}

// ===== ПРОФИЛИ ОРГАНИЗАЦИЙ =====

export async function createOrganizationProfile(data: Omit<OrganizationProfile, 'id' | 'created_at' | 'updated_at'>): Promise<OrganizationProfile> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO organization_profiles (id, user_id, organization_name, organization_type, contact_person, phone, email, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.user_id, data.organization_name, data.organization_type || null, data.contact_person || null, data.phone || null, data.email || null, data.description || null],
  });
  return { id, ...data };
}

export async function getOrganizationProfileByUserId(userId: string): Promise<OrganizationProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM organization_profiles WHERE user_id = ?',
    args: [userId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as OrganizationProfile;
}

// ===== ПРОФИЛИ МЕНТОРОВ =====

export async function createMentorProfile(data: Omit<MentorProfile, 'id' | 'created_at' | 'updated_at'>): Promise<MentorProfile> {
  const id = generateId();
  await db.execute({
    sql: 'INSERT INTO mentor_profiles (id, user_id, full_name, expertise, experience_years, phone, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.user_id, data.full_name, data.expertise || null, data.experience_years || null, data.phone || null, data.bio || null],
  });
  return { id, ...data };
}

export async function getMentorProfileByUserId(userId: string): Promise<MentorProfile | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM mentor_profiles WHERE user_id = ?',
    args: [userId],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as MentorProfile;
}