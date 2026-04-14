import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Scan } from 'lucide-react';
import { activateCourseEnrollment } from '../lib/organization';

interface QRScannerProps {
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

export function QRScanner({ onClose, onSuccess }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleScan = async (studentId: string) => {
    if (!studentId.trim()) {
      setError('Введите ID ученика');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('📸 Активация курса для ученика:', studentId);
      const activationResult = await activateCourseEnrollment(studentId.trim());

      console.log('✅ Результат активации:', activationResult);
      setResult(activationResult);

      if (activationResult.success && onSuccess) {
        setTimeout(() => {
          onSuccess(activationResult);
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error('❌ Ошибка активации:', err);
      setError(err?.message || 'Ошибка при активации курса');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualInput);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">Активация курса</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              {/* QR Scanner Placeholder */}
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 mb-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-32 h-32 border-4 border-orange-600 rounded-2xl flex items-center justify-center mb-4">
                    <Scan className="w-16 h-16 text-orange-600" />
                  </div>
                  <p className="text-center text-gray-600 mb-2">
                    Отсканируйте QR-код ученика
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    или введите ID вручную ниже
                  </p>
                </div>
              </div>

              {/* Manual Input */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID ученика
                  </label>
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Введите ID ученика"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !manualInput.trim()}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Активация...' : 'Активировать курс'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Важно:</strong> Активация курса подтверждает, что ученик пришел 
                  на первое занятие и услуга начала оказываться. Это необходимо для отчетности.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success/Already Activated Result */}
              {result.success ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Курс активирован!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Услуга начала оказываться
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left">
                    <div>
                      <p className="text-sm text-gray-500">Ученик</p>
                      <p className="font-semibold">{result.student.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Курс</p>
                      <p className="font-semibold">{result.student.course_title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Группа</p>
                      <p className="font-semibold">{result.student.group_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Дата активации</p>
                      <p className="font-semibold">{formatDate(result.activationDate)}</p>
                    </div>
                  </div>
                </div>
              ) : result.alreadyActivated ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-12 h-12 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Курс уже активирован
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Этот курс был активирован ранее
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left">
                    <div>
                      <p className="text-sm text-gray-500">Ученик</p>
                      <p className="font-semibold">{result.student.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Курс</p>
                      <p className="font-semibold">{result.student.course_title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Группа</p>
                      <p className="font-semibold">{result.student.group_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Дата активации</p>
                      <p className="font-semibold">{formatDate(result.activationDate)}</p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-6 w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}