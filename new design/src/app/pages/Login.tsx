import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+7 ');
  const [smsCode, setSmsCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'parent' ? '/parent' : `/${user.role}`);
    }
  }, [user, navigate]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) {
      return '+7 ';
    }

    const russianDigits = digits.startsWith('7') ? digits.slice(1) : digits;
    const limitedDigits = russianDigits.slice(0, 10);

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
    console.log('📝 handlePhoneChange вызван, value:', e.target.value);
    const formatted = formatPhoneNumber(e.target.value);
    console.log('📝 formatted результат:', formatted);
    setPhoneNumber(formatted);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const digits = phoneNumber.replace(/\D/g, '').slice(1);

    if (digits.length === 0) {
      setError('Введите номер телефона');
      return;
    } else if (digits.length < 10) {
      setError('Номер телефона должен содержать 10 цифр');
      return;
    }

    console.log('📱 Отправка СМС на номер:', phoneNumber);
    setCodeSent(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!smsCode.trim()) {
      setError('Введите код из СМС');
      return;
    } else if (!/^\d{4,6}$/.test(smsCode)) {
      setError('Код должен содержать 4-6 цифр');
      return;
    }

    setLoading(true);

    try {
      // Генерируем email и пароль на основе номера телефона
      const email = `${phoneNumber.replace(/\D/g, '')}@um.app`;
      const autoPassword = `${phoneNumber.replace(/\D/g, '')}um2026`;

      console.log('🔄 Попытка входа:', { email, phoneNumber });

      const result = await login(email, autoPassword);

      if (!result.success || !result.user) {
        setError('Пользователь с таким номером телефона не найден. Пожалуйста, зарегистрируйтесь.');
        setLoading(false);
        return;
      }

      console.log('✅ Пользователь авторизован:', result.user);

      // Проверяем, является ли пользователь учителем
      if (result.teacherId) {
        navigate('/teacher');
        return;
      }

      // Перенаправляем в зависимости от роли
      switch (result.user.role) {
        case 'parent':
          navigate('/parent');
          break;
        case 'child':
          navigate('/child');
          break;
        case 'teen':
          navigate('/teen');
          break;
        case 'young-adult':
          navigate('/young-adult');
          break;
        case 'organization':
          navigate('/organization');
          break;
        case 'mentor':
          navigate('/mentor');
          break;
        default:
          navigate('/role-select');
      }
    } catch (err) {
      console.error('❌ Ошибка авторизации:', err);
      setError('Ошибка при входе. Проверьте данные и попробуйте снова.');
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold text-white mb-2">Войти в аккаунт</h2>
        <p className="text-white/80 text-sm">
          {!codeSent
            ? 'Введите номер телефона для входа'
            : 'Введите код из СМС'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8">
        <form onSubmit={codeSent ? handleLogin : handleSendSms} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Phone Number */}
          <div>
            <div className="relative">
              <Phone className="absolute left-4 top-4 w-5 h-5 text-[#6C5CE7] pointer-events-none" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="+7 (999) 123-45-67"
                value={phoneNumber}
                onChange={handlePhoneChange}
                onFocus={() => console.log('🎯 Поле телефона в фокусе')}
                onKeyDown={(e) => console.log('⌨️ Нажата клавиша:', e.key)}
                disabled={codeSent}
                autoFocus
                className={`w-full pl-12 pr-4 py-4 bg-white border-2 border-[#6C5CE7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] focus:ring-offset-2 transition-all ${
                  codeSent ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {/* SMS Code */}
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

              {/* Resend code */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setSmsCode('');
                    setError('');
                  }}
                  className="text-[#6C5CE7] text-sm font-semibold hover:underline"
                >
                  Отправить код повторно
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={phoneNumber.replace(/\D/g, '').length < 11 || (codeSent && !smsCode) || loading}
            className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all mt-6 ${
              phoneNumber.replace(/\D/g, '').length < 11 || (codeSent && !smsCode) || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#6C5CE7] text-white hover:bg-[#5548C8] hover:scale-105'
            }`}
          >
            {loading ? 'Вход...' : codeSent ? 'Войти' : 'Получить СМС-код'}
          </button>

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

          {/* Register Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[#6C5CE7] font-semibold hover:underline"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}