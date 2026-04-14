import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

export function RedirectToStudentProfile() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (studentId) {
      console.log('🔄 Redirecting from /progress to student profile:', studentId);
      navigate(`/organization/students/${studentId}`, { replace: true });
    }
  }, [studentId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C5CE7] mx-auto mb-4"></div>
        <p className="text-gray-600">Перенаправление...</p>
      </div>
    </div>
  );
}
