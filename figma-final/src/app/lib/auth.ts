import { createUser, getUserByEmail, User } from './users';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
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
    // Проверяем, существует ли пользователь
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }
    
    // Создаем нового пользователя
    const user = await createUser(email, password, role, firstName, lastName);
    
    // Сохраняем в localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'Ошибка при регистрации' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
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
}

export function getCurrentUser(): User | null {
  const userJson = localStorage.getItem('currentUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}