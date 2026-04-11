import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { createTestResult, TestAnswer } from '../../lib/tests';

export function TestQuestions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role'); // child, teen, young-adult
  const parentMode = searchParams.get('parentMode') === 'true'; // режим родителя
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  const questions = [
    {
      id: 0,
      question: 'Что тебе больше всего нравится делать в свободное время?',
      options: [
        { id: 'art', text: 'Рисовать и заниматься творчеством', emoji: '🎨' },
        { id: 'sport', text: 'Заниматься спортом и быть активным', emoji: '⚽' },
        { id: 'tech', text: 'Изучать компьютеры и технологии', emoji: '💻' },
        { id: 'music', text: 'Слушать или создавать музыку', emoji: '🎵' },
      ],
    },
    {
      id: 1,
      question: 'Как ты предпочитаешь учиться?',
      options: [
        { id: 'visual', text: 'Смотреть видео и картинки', emoji: '📺' },
        { id: 'practice', text: 'Делать что-то своими руками', emoji: '✋' },
        { id: 'reading', text: 'Читать книги и статьи', emoji: '📚' },
        { id: 'group', text: 'Работать в группе с другими', emoji: '👥' },
      ],
    },
    {
      id: 2,
      question: 'Что тебя больше всего вдохновляет?',
      options: [
        { id: 'nature', text: 'Природа и окружающий мир', emoji: '🌿' },
        { id: 'people', text: 'Общение с интересными людьми', emoji: '🤝' },
        { id: 'challenges', text: 'Решение сложных задач', emoji: '🧩' },
        { id: 'creation', text: 'Создание чего-то нового', emoji: '✨' },
      ],
    },
    {
      id: 3,
      question: 'Какой предмет в школе тебе нравится больше всего?',
      options: [
        { id: 'math', text: 'Математика и логика', emoji: '🔢' },
        { id: 'language', text: 'Языки и литература', emoji: '📝' },
        { id: 'science', text: 'Естественные науки', emoji: '🔬' },
        { id: 'pe', text: 'Физкультура', emoji: '🏃' },
      ],
    },
    {
      id: 4,
      question: 'Чем бы ты хотел заниматься в будущем?',
      options: [
        { id: 'design', text: 'Дизайн и искусство', emoji: '🎨' },
        { id: 'engineering', text: 'Инженерия и создание', emoji: '⚙️' },
        { id: 'business', text: 'Бизнес и предпринимательство', emoji: '💼' },
        { id: 'help', text: 'Помогать людям', emoji: '❤️' },
      ],
    },
    {
      id: 5,
      question: 'Как ты проводишь выходные?',
      options: [
        { id: 'outdoor', text: 'На улице, активно', emoji: '🌳' },
        { id: 'indoor', text: 'Дома, за любимым занятием', emoji: '🏠' },
        { id: 'friends', text: 'С друзьями', emoji: '👫' },
        { id: 'learning', text: 'Изучаю что-то новое', emoji: '📖' },
      ],
    },
    {
      id: 6,
      question: 'Что для тебя важнее всего?',
      options: [
        { id: 'creativity', text: 'Творческая свобода', emoji: '🎭' },
        { id: 'achievement', text: 'Достижение целей', emoji: '🏆' },
        { id: 'teamwork', text: 'Работа в команде', emoji: '🤜🤛' },
        { id: 'knowledge', text: 'Получение знаний', emoji: '🧠' },
      ],
    },
    {
      id: 7,
      question: 'Какой тип заданий тебе нравится?',
      options: [
        { id: 'creative', text: 'Творческие проекты', emoji: '🖌️' },
        { id: 'logic', text: 'Логические задачи', emoji: '🧮' },
        { id: 'physical', text: 'Физическая активность', emoji: '🤸' },
        { id: 'research', text: 'Исследования', emoji: '🔍' },
      ],
    },
    {
      id: 8,
      question: 'Как ты относишься к новым вызовам?',
      options: [
        { id: 'excited', text: 'С восторгом и энтузиазмом', emoji: '🚀' },
        { id: 'careful', text: 'Осторожно, но с интересом', emoji: '🤔' },
        { id: 'prepared', text: 'Готовлюсь заранее', emoji: '📋' },
        { id: 'team', text: 'Ищу поддержку команды', emoji: '👨‍👩‍👧‍👦' },
      ],
    },
    {
      id: 9,
      question: 'Что тебя мотивирует учиться?',
      options: [
        { id: 'curiosity', text: 'Любопытство и интерес', emoji: '🌟' },
        { id: 'goals', text: 'Достижение целей', emoji: '🎯' },
        { id: 'recognition', text: 'Признание успехов', emoji: '🏅' },
        { id: 'passion', text: 'Страсть к теме', emoji: '❤️‍🔥' },
      ],
    },
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion]: optionId });
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSaving(true);
      
      try {
        // Преобразуем ответы в формат для БД
        const testAnswers: TestAnswer[] = Object.entries(answers).map(([questionId, answerId]) => ({
          question_id: parseInt(questionId),
          answer: questions[parseInt(questionId)].options.find(opt => opt.id === answerId)?.text || answerId,
        }));
        
        // Получаем текущий профиль (для демо используем localStorage)
        const currentProfileId = localStorage.getItem('currentChildProfileId') || 
                                  localStorage.getItem('parentProfileId') || 
                                  'demo-profile-id';
        
        // Определяем тип профиля на основе роли
        const profileType = role === 'child' ? 'child' : 
                           role === 'teen' ? 'teen' : 
                           role === 'young-adult' ? 'young-adult' : 
                           'child_profile';
        
        // Сохраняем результаты теста
        const testResult = await createTestResult(currentProfileId, profileType as any, testAnswers);
        
        console.log('Результаты теста сохранены:', testResult);
        
        // Переходим к результатам с ID теста
        // Если parentMode, передаем этот параметр дальше
        let params = `?testId=${testResult.id}`;
        if (parentMode) {
          params += '&parentMode=true';
        } else if (role) {
          params += `&role=${role}`;
        }
        navigate(`/testing/results${params}`);
      } catch (error) {
        console.error('Ошибка сохранения результатов теста:', error);
        // Все равно переходим к результатам
        let params = '';
        if (parentMode) {
          params = '?parentMode=true';
        } else if (role) {
          params = `?role=${role}`;
        }
        navigate(`/testing/results${params}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

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

      {/* Header with Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
          <span className="text-sm font-semibold text-white">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="px-6 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-[40px] p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center leading-tight">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-4">
            {currentQuestionData.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-5 rounded-2xl border-2 transition-all transform hover:scale-102 text-left ${
                  selectedAnswer === option.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {option.emoji}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      selectedAnswer === option.id ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {option.text}
                    </p>
                  </div>
                  {selectedAnswer === option.id && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevious}
              className="flex-1 bg-white text-gray-700 py-4 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              Назад
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`flex-1 py-4 rounded-2xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
              selectedAnswer
                ? 'bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 text-white hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}