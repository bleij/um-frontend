import { motion } from "motion/react";
import { Users, DollarSign, Settings, FileCheck, Search, Filter, Download, Eye, CheckCircle, XCircle, Star, Award, GraduationCap, Clock } from "lucide-react";
import { useState } from "react";

interface MentorApplication {
  id: number;
  name: string;
  specialization: string;
  documents: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  photo: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  rating: number;
  sessions: number;
  bio: string;
}

const mentorApplications: MentorApplication[] = [
  {
    id: 1,
    name: "Асель Нурбекова",
    specialization: "Детский психолог",
    documents: "certificate.pdf",
    date: "2026-04-05",
    status: "pending",
    photo: "👩‍🏫",
    email: "asel.nurbekova@example.com",
    phone: "+7 (777) 123-4567",
    experience: "8 лет",
    education: "КазНУ им. аль-Фараби, Психология",
    rating: 4.9,
    sessions: 127,
    bio: "Специализируюсь на работе с подростками и развитии талантов. Помогаю детям раскрыть потенциал и найти свой путь."
  },
  {
    id: 2,
    name: "Дмитрий Иванов",
    specialization: "Карьерный консультант",
    documents: "certificate.pdf",
    date: "2026-04-07",
    status: "pending",
    photo: "👨‍💼",
    email: "dmitry.ivanov@example.com",
    phone: "+7 (701) 234-5678",
    experience: "5 лет",
    education: "МГУ, Психология карьеры",
    rating: 4.7,
    sessions: 89,
    bio: "Помогаю подросткам определиться с выбором профессии и построить карьерный путь."
  },
  {
    id: 3,
    name: "Айгерим Сарсенова",
    specialization: "Педагог-наставник",
    documents: "certificate.pdf",
    date: "2026-04-08",
    status: "pending",
    photo: "👩‍🎓",
    email: "aigerim.sarsenova@example.com",
    phone: "+7 (702) 345-6789",
    experience: "12 лет",
    education: "КБТУ, Педагогика",
    rating: 4.8,
    sessions: 156,
    bio: "Работаю с детьми над развитием аналитических и технических навыков."
  },
  {
    id: 4,
    name: "Максим Петров",
    specialization: "Спортивный психолог",
    documents: "certificate.pdf",
    date: "2026-04-09",
    status: "pending",
    photo: "⚽",
    email: "maxim.petrov@example.com",
    phone: "+7 (703) 456-7890",
    experience: "6 лет",
    education: "КазАСТ, Спортивная психология",
    rating: 4.6,
    sessions: 73,
    bio: "Специализируюсь на развитии лидерских качеств через спорт."
  },
];

export function AdminDashboard() {
  const [selectedMentor, setSelectedMentor] = useState<MentorApplication>(mentorApplications[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const stats = [
    { label: "Ожидают проверки", value: "4", icon: FileCheck, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Всего менторов", value: "127", icon: Users, color: "text-primary", bg: "bg-primary/5" },
    { label: "Активных сессий", value: "89", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
    { label: "Доход за месяц", value: "₸2.4М", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const navItems = [
    { id: "pending", label: "Ожидают проверки", icon: FileCheck, badge: 4 },
    { id: "users", label: "Пользователи", icon: Users },
    { id: "financials", label: "Финансы", icon: DollarSign },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">UM</span>
              </div>
              <div>
                <h1 className="font-bold text-foreground">UM Admin</h1>
                <p className="text-xs text-muted-foreground">Панель управления</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all
                    ${isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${isActive ? 'bg-white/20 text-white' : 'bg-primary text-white'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-[16px] bg-muted">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">Администратор</p>
                <p className="text-xs text-muted-foreground">admin@um.kz</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Applications Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-border px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Заявки менторов</h2>
                  <p className="text-muted-foreground">Проверка и одобрение новых менторов</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-[16px] bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-lg">
                  <Download className="w-4 h-4" />
                  Экспорт
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-[20px] p-4 border border-border shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-[12px] ${stat.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по имени или специализации..."
                    className="w-full pl-12 pr-4 py-3 rounded-[16px] border border-border focus:border-primary focus:outline-none bg-white"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 rounded-[16px] border border-border hover:bg-muted transition-colors">
                  <Filter className="w-4 h-4" />
                  Фильтр
                </button>
              </div>
            </header>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-8 py-4 text-sm font-semibold text-muted-foreground">Имя</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Специализация</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Документы</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Дата подачи</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Статус</th>
                    <th className="text-left px-8 py-4 text-sm font-semibold text-muted-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {mentorApplications.map((mentor, index) => (
                    <motion.tr
                      key={mentor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedMentor(mentor)}
                      className={`
                        border-b border-border cursor-pointer transition-colors
                        ${selectedMentor.id === mentor.id ? 'bg-primary/5' : 'hover:bg-gray-50'}
                      `}
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
                            {mentor.photo}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{mentor.name}</p>
                            <p className="text-sm text-muted-foreground">{mentor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground">{mentor.specialization}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:underline flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {mentor.documents}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-muted-foreground">
                          {new Date(mentor.date).toLocaleDateString('ru-RU', { 
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-3 py-1.5 rounded-full text-xs font-semibold inline-block
                          ${mentor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${mentor.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                          ${mentor.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {mentor.status === 'pending' ? 'Ожидает' : ''}
                          {mentor.status === 'approved' ? 'Одобрено' : ''}
                          {mentor.status === 'rejected' ? 'Отклонено' : ''}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMentor(mentor);
                          }}
                          className="text-primary hover:underline font-medium"
                        >
                          Просмотр
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel - Mentor Details */}
          <aside className="w-[400px] bg-white border-l border-border overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h3 className="font-bold text-foreground mb-1">Детали заявки</h3>
                <p className="text-sm text-muted-foreground">Проверьте информацию перед одобрением</p>
              </div>

              {/* Mentor Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[24px] p-6 mb-6 border border-primary/10"
              >
                <div className="text-center mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl mb-3 shadow-xl">
                    {selectedMentor.photo}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{selectedMentor.name}</h3>
                  <p className="text-muted-foreground mb-3">{selectedMentor.specialization}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground">{selectedMentor.rating}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <div className="text-sm text-muted-foreground">{selectedMentor.sessions} сессий</div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedMentor.bio}</p>
              </motion.div>

              {/* Contact Info */}
              <div className="mb-6 space-y-3">
                <h4 className="font-semibold text-foreground mb-3">Контактная информация</h4>
                
                <div className="flex items-start gap-3 p-3 rounded-[16px] bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    📧
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="text-sm text-foreground truncate">{selectedMentor.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-[16px] bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    📱
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Телефон</p>
                    <p className="text-sm text-foreground">{selectedMentor.phone}</p>
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="mb-6 space-y-3">
                <h4 className="font-semibold text-foreground mb-3">Квалификация</h4>
                
                <div className="flex items-start gap-3 p-3 rounded-[16px] bg-muted">
                  <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Образование</p>
                    <p className="text-sm text-foreground">{selectedMentor.education}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-[16px] bg-muted">
                  <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Опыт работы</p>
                    <p className="text-sm text-foreground">{selectedMentor.experience}</p>
                  </div>
                </div>
              </div>

              {/* Certificate Preview */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Сертификат</h4>
                <div className="rounded-[20px] border-2 border-dashed border-border p-8 text-center bg-muted/30">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-[16px] bg-primary/10 flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{selectedMentor.documents}</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, 2.4 MB</p>
                  <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1 mx-auto">
                    <Eye className="w-4 h-4" />
                    Открыть документ
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-4 rounded-[20px] bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl">
                  <CheckCircle className="w-5 h-5" />
                  Одобрить заявку
                </button>
                
                <button className="w-full py-4 rounded-[20px] bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl">
                  <XCircle className="w-5 h-5" />
                  Отклонить заявку
                </button>
              </div>

              {/* Notes */}
              <div className="mt-6 p-4 rounded-[16px] bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-900">
                  <strong>Напоминание:</strong> Убедитесь, что все документы проверены перед одобрением заявки.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}