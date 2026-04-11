import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';

export function TeenMentorChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      from: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1610357285982-a5352a783962?w=100&h=100&fit=crop',
      name: 'Анна Сергеевна',
      text: 'Привет, Максим! Как прошло занятие по программированию?',
      time: '10:30',
    },
    {
      id: 2,
      from: 'me',
      text: 'Здравствуйте! Всё отлично, мы изучали циклы в Python',
      time: '10:32',
    },
    {
      id: 3,
      from: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1610357285982-a5352a783962?w=100&h=100&fit=crop',
      name: 'Анна Сергеевна',
      text: 'Отлично! А как продвигается твоя цель стать разработчиком игр?',
      time: '10:33',
    },
    {
      id: 4,
      from: 'me',
      text: 'Хорошо! Я уже начал делать свою первую игру',
      time: '10:35',
    },
    {
      id: 5,
      from: 'mentor',
      avatar: 'https://images.unsplash.com/photo-1610357285982-a5352a783962?w=100&h=100&fit=crop',
      name: 'Анна Сергеевна',
      text: 'Молодец! Покажешь на следующей встрече? Также рекомендую посмотреть кружок по Unity',
      time: '10:36',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/teen')} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1610357285982-a5352a783962?w=100&h=100&fit=crop"
              alt="Ментор"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Анна Сергеевна</h3>
            <p className="text-xs text-green-600">● Онлайн</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.from === 'me' ? 'flex-row-reverse' : ''}`}
          >
            {msg.from === 'mentor' && (
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img src={msg.avatar} alt={msg.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.from === 'me' ? 'items-end' : ''}`}>
              {msg.from === 'mentor' && (
                <p className="text-xs text-gray-500 mb-1">{msg.name}</p>
              )}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.from === 'me'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'bg-white shadow-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1 px-2">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Написать сообщение..."
              className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            className="w-10 h-10 flex items-center justify-center bg-[#6C5CE7] text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
