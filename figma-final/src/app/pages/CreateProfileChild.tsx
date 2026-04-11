import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  User,
  Heart,
  Target,
  Check,
  Plus,
  Baby,
  Zap,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  createChildProfile,
  createChildOwnProfile,
} from "../lib/users";

export function CreateProfileChild() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentMode = searchParams.get("parentMode") === "true";
  const [profileSaved, setProfileSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    ageCategory: "", // '6-12' или '13-17'
    gender: "",
    interests: [] as string[],
    otherInterest: "",
    goal: "",
  });

  const availableInterests = [
    "Рисование",
    "Музыка",
    "Математика",
    "Спорт",
    "Чтение",
    "Программирование",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (parentMode) {
        // Родитель создает профиль ребенка
        let parentProfileId = localStorage.getItem(
          "parentProfileId",
        );

        // Если ID профиля родителя нет, пытаемся найти его по user_id
        if (!parentProfileId && user) {
          console.log(
            "⚠️ parentProfileId не найден в localStorage, ищем профиль родителя по user_id:",
            user.id,
          );
          try {
            const {
              getParentProfileByUserId,
              createParentProfile,
            } = await import("../lib/users");
            let parentProfile = await getParentProfileByUserId(
              user.id,
            );

            // Если профиль не найден, создаем его
            if (!parentProfile) {
              console.log("📝 Создаем профиль родителя...");
              parentProfile = await createParentProfile({
                user_id: user.id,
                full_name: user.firstName || "Родитель",
                phone: user.lastName || "",
                children_count: 1,
              });
            }

            parentProfileId = parentProfile.id;
            localStorage.setItem(
              "parentProfileId",
              parentProfileId,
            );
            console.log(
              "✅ parentProfileId сохранен:",
              parentProfileId,
            );
          } catch (error) {
            console.error(
              "❌ Ошибка получения/создания профиля родителя:",
              error,
            );
          }
        }

        if (!parentProfileId) {
          alert(
            "Ошибка: не удалось определить профиль родителя. Пожалуйста, попробуйте снова.",
          );
          setLoading(false);
          return;
        }

        const childProfile = await createChildProfile({
          parent_id: parentProfileId,
          full_name: formData.name,
          age_category: formData.ageCategory,
          interests: JSON.stringify(formData.interests), // Сохраняем массив как JSON строку
        });

        console.log(
          "Профиль ребенка создан родителем:",
          childProfile,
        );

        // Сохраняем информацию о созданном профиле
        const createdProfiles = JSON.parse(
          localStorage.getItem("createdChildProfiles") || "[]",
        );
        if (!createdProfiles.includes("child")) {
          createdProfiles.push("child");
          localStorage.setItem(
            "createdChildProfiles",
            JSON.stringify(createdProfiles),
          );
        }

        // Сохраняем ID профиля для тестирования
        localStorage.setItem(
          "currentChildProfileId",
          childProfile.id,
        );

        setProfileSaved(true);
      } else {
        // Ребенок создает собственный профиль
        if (!user) {
          alert(
            "Ошибка: пользователь не авторизован. Пожалуйста, вернитесь к выбору роли.",
          );
          setLoading(false);
          return;
        }

        const childProfile = await createChildOwnProfile({
          user_id: user.id,
          full_name: formData.name,
          age: 8, // Дефолтный возраст
          interests: JSON.stringify(formData.interests), // Сохраняем массив как JSON строку
        });

        console.log(
          "Собственный профиль ребенка создан:",
          childProfile,
        );

        // Сохраняем ID профиля
        localStorage.setItem(
          "currentChildProfileId",
          childProfile.id,
        );

        // Переходим к тестированию
        navigate("/testing/welcome?role=child");
      }
    } catch (error) {
      console.error("Ошибка создания профиля ребенка:", error);
      alert(
        "Ошибка при сохранении профиля. Попробуйте еще раз.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInterestChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (e.target.checked) {
      setFormData({
        ...formData,
        interests: [...formData.interests, value],
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(
          (interest) => interest !== value,
        ),
      });
    }
  };

  const handleOtherInterestChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      otherInterest: e.target.value,
    });
  };

  const handleAddOtherInterest = () => {
    if (formData.otherInterest.trim()) {
      setFormData({
        ...formData,
        interests: [
          ...formData.interests,
          formData.otherInterest,
        ],
        otherInterest: "",
      });
    }
  };

  const childCategories = [
    {
      title: "Ребенок",
      ageRange: "6-11 лет",
      icon: Baby,
      path: "/create-profile-child?parentMode=true",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
    },
    {
      title: "Подросток",
      ageRange: "12-17 лет",
      icon: Zap,
      path: "/create-profile-teen?parentMode=true",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Молодой взрослый",
      ageRange: "18-20 лет",
      icon: GraduationCap,
      path: "/create-profile-young-adult?parentMode=true",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
  ];

  // Если профиль ребенка сохранен в режиме родителя, показываем экран успеха
  if (profileSaved && parentMode) {
    // Получаем список уже созданных профилей
    const createdProfiles = JSON.parse(
      localStorage.getItem("createdChildProfiles") || "[]",
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8]">
        {/* Status Bar */}
        <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-3 bg-white/30 rounded-sm" />
            <div className="w-4 h-3 bg-white/60 rounded-sm" />
            <div className="w-4 h-3 bg-white/90 rounded-sm" />
          </div>
        </div>

        {/* Success Header */}
        <div className="px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-10 h-10 text-[#6C5CE7]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            Отлично!
          </h1>
          <p className="text-white/90 text-lg">
            Профиль ребенка сохранен
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 min-h-[50vh]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Добавить еще ребенка?
          </h2>
          <div className="space-y-4">
            {childCategories.map((category, index) => {
              const Icon = category.icon;
              const categoryKey =
                category.title === "Ребенок"
                  ? "child"
                  : category.title === "Подросток"
                    ? "teen"
                    : "young-adult";
              const isCreated =
                createdProfiles.includes(categoryKey);

              return (
                <button
                  key={index}
                  onClick={() => navigate(category.path)}
                  className="w-full p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] relative"
                >
                  {isCreated && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium mt-0.5">
                        {category.ageRange}
                      </p>
                    </div>
                    {!isCreated && (
                      <Plus className="w-6 h-6 text-[#6C5CE7]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              navigate("/testing/welcome?parentMode=true")
            }
            className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#8B7FE8] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Продолжить к тестированию
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white sticky top-0 z-10 shadow-lg px-[16px] py-[18px]">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          ></button>
          <h1 className="font-bold text-[24px]">
            {parentMode
              ? "Создать профиль ребенка"
              : "Создать профиль"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-pink-600" />О
              ребенке
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Как зовут ребенка?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Возраст ребенка
                </label>
                <select
                  name="ageCategory"
                  value={formData.ageCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                >
                  <option value="">
                    Выберите возраст
                  </option>
                  <option value="6">6 лет</option>
                  <option value="7">7 лет</option>
                  <option value="8">8 лет</option>
                  <option value="9">9 лет</option>
                  <option value="10">10 лет</option>
                  <option value="11">11 лет</option>
                  <option value="12">12 лет</option>
                  <option value="13">13 лет</option>
                  <option value="14">14 лет</option>
                  <option value="15">15 лет</option>
                  <option value="16">16 лет</option>
                  <option value="17">17 лет</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пол
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="boy"
                      checked={formData.gender === "boy"}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center rounded-xl border-2 border-gray-300 peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all">
                      Мальчик
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="girl"
                      checked={formData.gender === "girl"}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center rounded-xl border-2 border-gray-300 peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all">
                      Девочка
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Интересы
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Что нравится вашему ребенку?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableInterests.map((interest) => (
                  <label
                    key={interest}
                    className="cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={interest}
                      checked={formData.interests.includes(
                        interest,
                      )}
                      onChange={handleInterestChange}
                      className="peer sr-only"
                    />
                    <div className="p-3 text-center text-sm rounded-xl border-2 border-gray-300 peer-checked:border-pink-500 peer-checked:bg-pink-50 transition-all">
                      {interest}
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Другие интересы:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.otherInterest}
                    onChange={handleOtherInterestChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Введите интерес ребенка"
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherInterest}
                    className="px-4 py-3 bg-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {formData.interests.filter(
                  (i) => !availableInterests.includes(i),
                ).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.interests
                      .filter(
                        (i) => !availableInterests.includes(i),
                      )
                      .map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                interests:
                                  formData.interests.filter(
                                    (i) => i !== interest,
                                  ),
                              })
                            }
                            className="hover:text-pink-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Goal Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-600" />
              Твоя цель
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Чему ваш ребенок хочет научиться?
              </label>
              <textarea
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                placeholder="Например: научиться программировать, стать лучше в математике..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {loading ? "Сохранение..." : "Создать профиль"}
          </button>
        </form>
      </div>
    </div>
  );
}