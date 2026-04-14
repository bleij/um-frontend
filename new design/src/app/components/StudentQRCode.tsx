import { QRCodeSVG } from 'qrcode.react';
import { X, Download } from 'lucide-react';

interface StudentQRCodeProps {
  studentId: string;
  studentName: string;
  courseName: string;
  onClose: () => void;
}

export function StudentQRCode({ studentId, studentName, courseName, onClose }: StudentQRCodeProps) {
  const handleDownload = () => {
    const svg = document.getElementById('student-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${studentName.replace(/\s/g, '-')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">QR-код ученика</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Student Info */}
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold mb-1">{studentName}</h3>
            <p className="text-sm text-gray-600">{courseName}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6 p-6 bg-gray-50 rounded-2xl">
            <QRCodeSVG
              id="student-qr-code"
              value={studentId}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Инструкция:</strong> Покажите этот QR-код организации при первом 
              посещении для подтверждения активации курса.
            </p>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Скачать QR-код
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            ID ученика: {studentId}
          </p>
        </div>
      </div>
    </div>
  );
}