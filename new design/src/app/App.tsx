import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ParentDataProvider } from './contexts/ParentDataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RoleSelection } from './pages/RoleSelection';
import { CreateProfileParent } from './pages/CreateProfileParent';
import { CreateProfileChild } from './pages/CreateProfileChild';
import { CreateProfileTeen } from './pages/CreateProfileTeen';
import { CreateProfileYoungAdult } from './pages/CreateProfileYoungAdult';
import { CreateProfileOrganization } from './pages/CreateProfileOrganization';
import { CreateProfileMentor } from './pages/CreateProfileMentor';
import { ParentHome } from './pages/parent/ParentHome';
import { ParentChildren } from './pages/parent/ParentChildren';
import { ParentChildProfile } from './pages/parent/ParentChildProfile';
import { ParentClubs } from './pages/parent/ParentClubs';
import { ParentClubDetail } from './pages/parent/ParentClubDetail';
import { ParentCalendar } from './pages/parent/ParentCalendar';
import { ParentReports } from './pages/parent/ParentReports';
import { ParentProfile } from './pages/parent/ParentProfile';
import { ParentTesting } from './pages/parent/ParentTesting';
import { ChildHome } from './pages/child/ChildHome';
import { ChildAchievements } from './pages/child/ChildAchievements';
import { ChildTasks } from './pages/child/ChildTasks';
import { TeenHome } from './pages/teen/TeenHome';
import { TeenGoals } from './pages/teen/TeenGoals';
import { TeenMentorChat } from './pages/teen/TeenMentorChat';
import { YoungAdultHome } from './pages/young-adult/YoungAdultHome';
import { OrgDashboard } from './pages/organization/OrgDashboard';
import { OrgApplications } from './pages/organization/OrgApplications';
import { OrgAttendance } from './pages/organization/OrgAttendance';
import { OrgTasks } from './pages/organization/OrgTasks';
import { OrgCourses } from './pages/organization/OrgCourses';
import { OrgStaff } from './pages/organization/OrgStaff';
import { OrgStaffAdd } from './pages/organization/OrgStaffAdd';
import { OrgStaffDetail } from './pages/organization/OrgStaffDetail';
import { OrgStudents } from './pages/organization/OrgStudents';
import { OrgStudentDetail } from './pages/organization/OrgStudentDetail';
import { OrgProfile } from './pages/organization/OrgProfile';
import { OrgCourseCreate } from './pages/organization/OrgCourseCreate';
import { OrgCourseDetail } from './pages/organization/OrgCourseDetail';
import { OrgCourseEdit } from './pages/organization/OrgCourseEdit';
import { OrgGroups } from './pages/organization/OrgGroups';
import { OrgGroupCreate } from './pages/organization/OrgGroupCreate';
import { OrgGroupDetail } from './pages/organization/OrgGroupDetail';
import { MentorHome } from './pages/mentor/MentorHome';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorChildProfile } from './pages/mentor/MentorChildProfile';
import { MentorLearningPath } from './pages/mentor/MentorLearningPath';
import { TestWelcome } from './pages/testing/TestWelcome';
import { TestQuestions } from './pages/testing/TestQuestions';
import { TestResults } from './pages/testing/TestResults';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ParentChildCategorySelect } from './pages/ParentChildCategorySelect';
import { MentorPendingSuccess } from './pages/MentorPendingSuccess';
import { RedirectToStudentProfile } from './components/RedirectToStudentProfile';
import { TeacherHome } from './pages/teacher/TeacherHome';
import { TeacherGroups } from './pages/teacher/TeacherGroups';
import { TeacherGroupDetail } from './pages/teacher/TeacherGroupDetail';
import { TeacherProfile } from './pages/teacher/TeacherProfile';

// Явный маркер для проверки загрузки новой версии
console.log('🚀 App.tsx загружен - версия с Teacher Interface');
console.log('📅 Timestamp:', new Date().toISOString());
console.log('✨ Новое: Интерфейс Учителя с 3 вкладками (Расписание, Группы, Профиль)');

export default function App() {
  useEffect(() => {
    const handleNavigation = () => {
      console.log('📍 Навигация:', window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);
    handleNavigation();

    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <BrowserRouter>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/role-select" element={<RoleSelection />} />
            <Route path="/create-profile-parent" element={<CreateProfileParent />} />
            <Route path="/create-profile-child" element={<CreateProfileChild />} />
            <Route path="/create-profile-teen" element={<CreateProfileTeen />} />
            <Route path="/create-profile-young-adult" element={<CreateProfileYoungAdult />} />
            <Route path="/create-profile-organization" element={<CreateProfileOrganization />} />
            <Route path="/create-profile-mentor" element={<CreateProfileMentor />} />
            <Route path="/mentor-pending-success" element={<MentorPendingSuccess />} />

            {/* Родительские маршруты */}
            <Route path="/parent/*" element={
              <ParentDataProvider>
                <Routes>
                  <Route index element={<ProtectedRoute requiredRole="parent"><ParentHome /></ProtectedRoute>} />
                  <Route path="children" element={<ProtectedRoute requiredRole="parent"><ParentChildren /></ProtectedRoute>} />
                  <Route path="children/:childId" element={<ProtectedRoute requiredRole="parent"><ParentChildProfile /></ProtectedRoute>} />
                  <Route path="clubs" element={<ProtectedRoute requiredRole="parent"><ParentClubs /></ProtectedRoute>} />
                  <Route path="clubs/:clubId" element={<ProtectedRoute requiredRole="parent"><ParentClubDetail /></ProtectedRoute>} />
                  <Route path="calendar" element={<ProtectedRoute requiredRole="parent"><ParentCalendar /></ProtectedRoute>} />
                  <Route path="reports" element={<ProtectedRoute requiredRole="parent"><ParentReports /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute requiredRole="parent"><ParentProfile /></ProtectedRoute>} />
                  <Route path="testing" element={<ProtectedRoute requiredRole="parent"><ParentTesting /></ProtectedRoute>} />
                  <Route path="child-category-select" element={<ParentChildCategorySelect />} />
                </Routes>
              </ParentDataProvider>
            } />

            {/* Детские маршруты */}
            <Route path="/child" element={<ChildHome />} />
            <Route path="/child/achievements" element={<ChildAchievements />} />
            <Route path="/child/tasks" element={<ChildTasks />} />

            {/* Подростковые маршруты */}
            <Route path="/teen" element={<TeenHome />} />
            <Route path="/teen/goals" element={<TeenGoals />} />
            <Route path="/teen/mentor-chat" element={<TeenMentorChat />} />

            {/* Молодые взрослые */}
            <Route path="/young-adult" element={<YoungAdultHome />} />

            {/* Организация */}
            <Route path="/organization" element={<OrgDashboard />} />
            <Route path="/organization/applications" element={<OrgApplications />} />
            <Route path="/organization/attendance" element={<OrgAttendance />} />
            <Route path="/organization/tasks" element={<OrgTasks />} />
            <Route path="/organization/courses" element={<OrgCourses />} />
            <Route path="/organization/courses/create" element={<OrgCourseCreate />} />
            <Route path="/organization/courses/:courseId" element={<OrgCourseDetail />} />
            <Route path="/organization/courses/:courseId/edit" element={<OrgCourseEdit />} />
            <Route path="/organization/staff" element={<OrgStaff />} />
            <Route path="/organization/staff/add" element={<OrgStaffAdd />} />
            <Route path="/organization/staff/:staffId" element={<OrgStaffDetail />} />
            <Route path="/organization/students" element={<OrgStudents />} />
            <Route path="/organization/students/:studentId" element={<OrgStudentDetail />} />
            <Route path="/organization/profile" element={<OrgProfile />} />
            <Route path="/organization/groups" element={<OrgGroups />} />
            <Route path="/organization/groups/create" element={<OrgGroupCreate />} />
            <Route path="/organization/groups/:groupId" element={<OrgGroupDetail />} />

            {/* Менторы */}
            <Route path="/mentor" element={<MentorDashboard />} />
            <Route path="/mentor/old" element={<MentorHome />} />
            <Route path="/mentor/child-profile/:childId" element={<MentorChildProfile />} />
            <Route path="/mentor/learning-path/:childId" element={<MentorLearningPath />} />

            {/* Учителя */}
            <Route path="/teacher" element={<TeacherHome />} />
            <Route path="/teacher/groups" element={<TeacherGroups />} />
            <Route path="/teacher/groups/:groupId" element={<TeacherGroupDetail />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />

            {/* Тестирование */}
            <Route path="/testing/welcome" element={<TestWelcome />} />
            <Route path="/testing/questions" element={<TestQuestions />} />
            <Route path="/testing/results" element={<TestResults />} />

            {/* Redirect for old/incorrect routes */}
            <Route path="/organization/students/:studentId/progress" element={<RedirectToStudentProfile />} />

            {/* 404 - Not Found */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Страница не найдена</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 bg-[#6C5CE7] text-white rounded-xl font-medium hover:bg-[#5548C8] transition-colors"
                  >
                    На главную
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}