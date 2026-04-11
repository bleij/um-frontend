import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ParentDataProvider } from './contexts/ParentDataContext';
import { useEffect } from 'react';
import { initDemoCourses } from './lib/courses';

export default function App() {
  useEffect(() => {
    initDemoCourses().catch(console.error);

    const handleNavigation = () => {
      console.log('📍 Навигация:', window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);
    handleNavigation();

    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  return (
    <AuthProvider>
      <ParentDataProvider>
        <RouterProvider router={router} />
      </ParentDataProvider>
    </AuthProvider>
  );
}