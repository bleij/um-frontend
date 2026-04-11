import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// Этот компонент больше не используется
// Перенаправляет на страницу создания профиля родителя
export function ParentChildCategorySelect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/create-profile-parent', { replace: true });
  }, [navigate]);

  return null;
}
