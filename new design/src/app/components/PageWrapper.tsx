import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showStatusBar?: boolean;
}

export function PageWrapper({ 
  children, 
  title, 
  subtitle,
  showBack = true,
  showStatusBar = true 
}: PageWrapperProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#6C5CE7] to-[#8B7FE8]">
      {/* Status Bar */}
      {showStatusBar && (
        <div className="w-full flex justify-between items-center px-6 py-4 text-white text-sm">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-3 bg-white/30 rounded-sm" />
            <div className="w-4 h-3 bg-white/60 rounded-sm" />
            <div className="w-4 h-3 bg-white/90 rounded-sm" />
          </div>
        </div>
      )}

      {/* Back Button */}
      {showBack && (
        <div className="px-6 py-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </button>
        </div>
      )}

      {/* Header */}
      {title && (
        <div className="px-6 py-6 text-center">
          <h1 className="text-4xl font-black text-white mb-2">{title}</h1>
          {subtitle && (
            <p className="text-white/80 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 bg-gray-50 rounded-t-[40px] px-6 py-8 min-h-[50vh]">
        {children}
      </div>
    </div>
  );
}
