import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType } from '../lib/users';

export function Register() {
  const navigate = useNavigate();
  const { user, register } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedRole, setSelectedRole] = useState<UserType['role'] | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+7 ');
  const [smsCode, setSmsCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Получаем выбранную роль из sessionStorage
    const role = sessionStorage.getItem('selectedRole') as UserType['role'] | null;
    if (!role) {
      // Если роли нет, перенаправляем обратно к выбору роли
      navigate('/role-select');
      return;
    }
    setSelectedRole(role);
  }, [navigate]);

  const getProfilePath = (role: UserType['role']) => {
    const paths: Record<UserType['role'], string> = {
      parent: '/create-profile-child?parentMode=true', // Родитель сразу создает профиль ребенка
      child: '/create-profile-child',
      teen: '/create-profile-teen',
      'young-adult': '/create-profile-young-adult',
      organization: '/create-profile-organization',
      mentor: '/create-profile-mentor',
    };
    return paths[role];
  };

  const formatPhoneNumber = (value: string) => {
    // Удаляем все символы кроме цифр
    const digits = value.replace(/\D/g, '');
    
    // Если пользователь удалил все, возвращаем +7 
    if (digits.length === 0) {
      return '+7 ';
    }
    
    // Если первая цифра не 7, добавляем 7
    const russianDigits = digits.startsWith('7') ? digits.slice(1) : digits;
    
    // Ограничиваем до 10 цифр после +7
    const limitedDigits = russianDigits.slice(0, 10);
    
    // Форматируем номер
    let formatted = '+7 ';
    if (limitedDigits.length > 0) {
      formatted += '(' + limitedDigits.slice(0, 3);
    }
    if (limitedDigits.length > 3) {
      formatted += ') ' + limitedDigits.slice(3, 6);
    }
    if (limitedDigits.length > 6) {
      formatted += '-' + limitedDigits.slice(6, 8);
    }
    if (limitedDigits.length > 8) {
      formatted += '-' + limitedDigits.slice(8, 10);
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация номера телефона
    const newErrors: Record<string, string> = {};
    const digits = phoneNumber.replace(/\D/g, '').slice(1); // Удаляем +7 и считаем оставшиеся цифры
    
    if (digits.length === 0) {
      newErrors.phoneNumber = 'Введите номер телефона';
    } else if (digits.length < 10) {
      newErrors.phoneNumber = 'Номер телефона должен содержать 10 цифр';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Имитация отправки СМС
    console.log('📱 Отправка СМС на номер:', phoneNumber);
    setCodeSent(true);
    setErrors({});
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация кода
    const newErrors: Record<string, string> = {};
    if (!smsCode.trim()) {
      newErrors.smsCode = 'Введите код из СМС';
    } else if (!/^\d{4,6}$/.test(smsCode)) {
      newErrors.smsCode = 'Код должен содержать 4-6 цифр';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Имитация проверки кода
    console.log('✅ Код подтвержден:', smsCode);
    setCodeVerified(true);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      alert('Роль не выбрана. Пожалуйста, начните заново.');
      navigate('/role-select');
      return;
    }

    // Валидация имени для родителей
    if (selectedRole === 'parent' && !firstName.trim()) {
      setErrors({ firstName: 'Введите ваше имя' });
      return;
    }

    try {
      // Генерируем автоматический пароль на основе номера телефона
      const autoPassword = `${phoneNumber.replace(/\D/g, '')}um2026`;

      // Используем имя или номер телефона, если имя не введено
      const userName = firstName.trim() || phoneNumber;

      console.log('🔄 Register: начало регистрации', {
        email: `${phoneNumber.replace(/\D/g, '')}@um.app`,
        role: selectedRole,
        userName,
        phoneNumber
      });

      // Регистрируем пользователя с номером телефона как логином
      const result = await register(
        `${phoneNumber.replace(/\D/g, '')}@um.app`,  // Email на основе номера телефона
        autoPassword,  // Автоматически сгенерированный пароль
        selectedRole,
        userName,  // Имя или номер телефона
        phoneNumber  // Номер телефона как фамилия (можно позже обновить)
      );

      console.log('📥 Register: результат регистрации:', result);

      if (result.success) {
        console.log('✅ Пользователь зарегистрирован:', result.user);
        console.log('✅ Проверка localStorage currentUser:', localStorage.getItem('currentUser'));

        // Если роль - родитель, создаем базовый профиль родителя
        if (selectedRole === 'parent' && result.user) {
          try {
            const { createParentProfile } = await import('../lib/users');
            const parentProfile = await createParentProfile({
              user_id: result.user.id,
              full_name: userName,
              phone: phoneNumber,
              children_count: 1,
            });
            // Сохраняем ID профиля родителя для дальнейшего использования
            localStorage.setItem('parentProfileId', parentProfile.id);
            console.log('✅ Базовый профиль родителя создан:', parentProfile);
          } catch (error) {
            console.error('❌ Ошибка создания профиля родителя:', error);
          }
        }

        // Очищаем sessionStorage после успешной регистрации
        sessionStorage.removeItem('selectedRole');

        // Небольшая задержка для гарантии, что состояние обновилось
        await new Promise(resolve => setTimeout(resolve, 100));

        // Переходим к созданию профиля
        navigate(getProfilePath(selectedRole));
      } else {
        console.error('❌ Ошибка регистрации:', result.error);
        // Если пользователь уже существует, предлагаем войти
        if (result.error?.includes('уже существует')) {
          setErrors({
            submit: 'Этот номер телефона уже зарегистрирован.'
          });
          // Сбрасываем форму
          setCodeSent(false);
          setCodeVerified(false);
          setSmsCode('');
          setFirstName('');
        } else {
          setErrors({ submit: result.error || 'Ошибка при создании пользователя' });
        }
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      setErrors({ submit: 'Ошибка при создании пользователя' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8] flex flex-col">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-3 bg-white/30 rounded-sm" />
          <div className="w-4 h-3 bg-white/60 rounded-sm" />
          <div className="w-4 h-3 bg-white/90 rounded-sm" />
        </div>
      </div>

      {/* Back Button */}
      <div className="px-6 py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-8 text-center">
        <h1 className="text-6xl font-black text-white mb-4">UM</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Создайте свой аккаунт</h2>
        <p className="text-white/80 text-sm">
          {!codeSent
            ? 'Введите номер телефона для регистрации'
            : !codeVerified
              ? 'Введите код из СМС'
              : selectedRole === 'mentor' || selectedRole === 'teen' || selectedRole === 'organization'
                ? 'Готово к продолжению'
                : selectedRole === 'parent'
                  ? 'Введите ваше имя'
                  : 'Введите ваше имя (необязательно)'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
        <form onSubmit={codeSent ? (codeVerified ? handleSubmit : handleVerifyCode) : handleSendSms} className="space-y-4">
          {/* Phone Number */}
          <div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 w-5 h-5 text-[#6C5CE7] pointer-events-none" />
              <input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={codeSent}
                className={`w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all ${
                  codeSent ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* SMS Code (appears after sending SMS) */}
          {codeSent && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Введите код из СМС"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="w-full px-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all text-center text-base tracking-widest font-semibold"
                />
              </div>
              {errors.smsCode && <p className="text-red-500 text-sm mt-1">{errors.smsCode}</p>}
              
              {/* Resend code */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setSmsCode('');
                    setErrors({});
                  }}
                  className="text-[#6C5CE7] text-sm font-semibold hover:underline"
                >
                  Отправить код повторно
                </button>
              </div>
            </div>
          )}

          {/* First Name (appears after verifying code, hidden for mentor, teen and organization) */}
          {codeVerified && selectedRole !== 'mentor' && selectedRole !== 'teen' && selectedRole !== 'organization' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-[#6C5CE7] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Введите ваше имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all"
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              phoneNumber.replace(/\D/g, '').length < 11 ||
              (codeSent && !smsCode) ||
              (codeVerified && selectedRole === 'parent' && !firstName.trim())
            }
            className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all mt-6 ${
              phoneNumber.replace(/\D/g, '').length < 11 ||
              (codeSent && !smsCode) ||
              (codeVerified && selectedRole === 'parent' && !firstName.trim())
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] hover:scale-105'
            }`}
          >
            {codeSent ? (codeVerified ? 'Продолжить' : 'Подтвердить код') : 'Получить СМС-код'}
          </button>

          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-700 text-sm text-center font-medium">{errors.submit}</p>
              {errors.submit.includes('уже зарегистрирован') && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full mt-3 py-3 bg-[#6C5CE7] text-white rounded-xl font-semibold hover:bg-[#5548C8] transition-colors"
                >
                  Перейти к входу
                </button>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 py-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-400 text-sm">или войти через</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-6 py-2">
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#000" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#6C5CE7] font-semibold hover:underline"
              >
                Войти
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}