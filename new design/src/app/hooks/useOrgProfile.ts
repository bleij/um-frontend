import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrganizationProfileByUserId, createOrganizationProfile, OrganizationProfile } from '../lib/users';

/**
 * Хук для получения профиля организации с автоматическим созданием
 * если профиль не найден (для разработки)
 */
export function useOrgProfile() {
  const { user } = useAuth();
  const [orgProfile, setOrgProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔍 useOrgProfile: ищем профиль для user_id:', user.id);

        let profile = await getOrganizationProfileByUserId(user.id);
        console.log('📦 useOrgProfile: результат первого поиска:', profile);

        if (!profile) {
          console.warn('⚠️ useOrgProfile: профиль не найден, создаем временный профиль...');
          
          // Создаем временный профиль для разработки
          profile = await createOrganizationProfile({
            user_id: user.id,
            organization_name: user.first_name || 'Тестовая организация',
            organization_type: 'Образовательный центр',
            contact_person: user.first_name || 'Администратор',
            email: user.email,
            city: 'Алматы',
            description: 'Автоматически созданный профиль организации'
          });
          
          console.log('✅ useOrgProfile: временный профиль создан:', profile);
          
          // Проверяем, что профиль действительно создался в БД
          const verifyProfile = await getOrganizationProfileByUserId(user.id);
          console.log('🔍 useOrgProfile: проверка созданного профиля:', verifyProfile);
          
          if (!verifyProfile) {
            console.error('❌ useOrgProfile: профиль не найден даже после создания!');
            throw new Error('Не удалось создать профиль организации в БД');
          }
          
          profile = verifyProfile;
        }

        console.log('✅ useOrgProfile: финальный профиль:', profile);
        setOrgProfile(profile);
        setError(null);
      } catch (err) {
        console.error('❌ useOrgProfile: ошибка загрузки профиля:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  return { orgProfile, loading, error };
}