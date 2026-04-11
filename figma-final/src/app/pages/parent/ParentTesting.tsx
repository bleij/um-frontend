import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export function ParentTesting() {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const tests = [
    {
      id: 1,
      name: 'Тест на креативность',
      description: 'Оценка творческого мышления и воображения',
      questions: 15,
      duration: '10-15 мин',
      completed: true,
      score: 92,
    },
    {
      id: 2,
      name: 'Логическое мышление',
      description: 'Проверка аналитических способностей',
      questions: 20,
      duration: '15-20 мин',
      completed: true,
      score: 78,
    },
    {
      id: 3,
      name: 'Эмоциональный интеллект',
      description: 'Понимание и управление эмоциями',
      questions: 18,
      duration: '12-15 мин',
      completed: false,
    },
    {
      id: 4,
      name: 'Коммуникативные навыки',
      description: 'Оценка способности к общению',
      questions: 16,
      duration: '10-12 мин',
      completed: false,
    },
  ];

  const testQuestions = [
    {
      question: 'Как ваш ребенок реагирует на новые ситуации?',
      options: ['С энтузиазмом', 'С осторожностью', 'С тревогой', 'Безразлично'],
      illustration: '🤔',
    },
    {
      question: 'Как часто ребенок проявляет инициативу?',
      options: ['Очень часто', 'Иногда', 'Редко', 'Почти никогда'],
      illustration: '💡',
    },
    {
      question: 'Как ваш ребенок справляется с трудностями?',
      options: ['Ищет решения сам', 'Просит помощи', 'Расстраивается', 'Избегает проблем'],
      illustration: '💪',
    },
  ];

  const handleStartTest = (testId: number) => {
    setSelectedTest(testId);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed
      setTimeout(() => {
        setSelectedTest(null);
        navigate('/parent/children/1');
      }, 1000);
    }
  };

  if (selectedTest) {
    const progress = ((currentQuestion + 1) / testQuestions.length) * 100;
    const question = testQuestions[currentQuestion];

    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Тестирование" showBack={true} dark={true} backPath="/parent/children" />

        <div className="p-4 space-y-6">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Вопрос {currentQuestion + 1} из {testQuestions.length}
              </span>
              <span className="text-sm font-semibold text-[#6C5CE7]">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C5CE7] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-6xl text-center mb-6">{question.illustration}</div>
            <h2 className="text-xl font-semibold text-center mb-6">{question.question}</h2>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 bg-gray-50 hover:bg-purple-50 border-2 border-transparent hover:border-[#6C5CE7] rounded-xl text-left font-medium transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Тестирование" showBack={true} />

      <div className="p-4 space-y-4">
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
          <p className="text-sm text-gray-700">
            💡 Тесты помогают AI лучше понять способности вашего ребенка и дать персонализированные рекомендации по кружкам
          </p>
        </div>

        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="bg-white p-5 rounded-2xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  test.completed ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {test.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <span className="text-2xl">📝</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{test.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>📊 {test.questions} вопросов</span>
                    <span>⏱️ {test.duration}</span>
                  </div>
                  {test.completed && (
                    <div className="mt-2">
                      <span className="text-sm font-semibold text-green-600">
                        Результат: {test.score}%
                      </span>
                    </div>
                  )}
                </div>
                {!test.completed && (
                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="px-4 py-2 bg-[#6C5CE7] text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Начать
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}