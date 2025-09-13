import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize,
  Maximize,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  BookOpen,
  Settings,
  Star
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick_reply' | 'options';
  options?: string[];
}

interface ChatbotProps {
  className?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'سلام! من دستیار هوشمند سیستم آزمون‌گیری آنلاین هستم. چطور می‌تونم کمکتون کنم؟ 😊',
      sender: 'bot',
      timestamp: new Date(),
      type: 'options',
      options: [
        'راهنمای ثبت نام',
        'نحوه شرکت در آزمون',
        'مشکلات فنی',
        'تماس با پشتیبانی'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    'چطور ثبت نام کنم؟',
    'رمز عبورم را فراموش کردم',
    'مشکل در ورود به آزمون',
    'نحوه مشاهده نتایج',
    'ساعات پشتیبانی',
    'تماس با ما'
  ];

  const botResponses: { [key: string]: string } = {
    'راهنمای ثبت نام': 'برای ثبت نام در سیستم:\n\n1️⃣ روی دکمه "ثبت نام" کلیک کنید\n2️⃣ اطلاعات شخصی خود را وارد کنید\n3️⃣ ایمیل فعال‌سازی را بررسی کنید\n4️⃣ با نام کاربری و رمز عبور وارد شوید\n\nآیا سوال دیگری دارید؟',
    'نحوه شرکت در آزمون': 'برای شرکت در آزمون:\n\n📝 ابتدا وارد حساب کاربری خود شوید\n🕐 در زمان مقرر آزمون، به بخش "آزمون‌های فعال" بروید\n▶️ روی "شرکت در آزمون" کلیک کنید\n⚠️ اتصال اینترنت پایدار داشته باشید\n\nموفق باشید! 🌟',
    'مشکلات فنی': 'برای حل مشکلات فنی:\n\n🔧 مرورگر خود را به‌روزرسانی کنید\n🗑️ کش مرورگر را پاک کنید\n🌐 اتصال اینترنت را بررسی کنید\n📞 در صورت ادامه مشکل: ۰۲۱-۱۲۳۴۵۶۷۸\n\nتیم پشتیبانی ما آماده کمک است!',
    'تماس با پشتیبانی': 'راه‌های تماس با پشتیبانی:\n\n📞 تلفن: ۰۲۱-۱۲۳۴۵۶۷۸\n📧 ایمیل: support@examsite.com\n💬 چت آنلاین: همین جا!\n🕐 ساعات کاری: ۸:۰۰ تا ۱۷:۰۰\n\nما همیشه در خدمت شما هستیم! 🤝',
    'چطور ثبت نام کنم؟': 'ثبت نام خیلی ساده است! فقط روی دکمه "ثبت نام" در بالای صفحه کلیک کنید و مراحل را دنبال کنید. نیاز به ایمیل معتبر دارید.',
    'رمز عبورم را فراموش کردم': 'نگران نباشید! در صفحه ورود روی "فراموشی رمز عبور" کلیک کنید. لینک بازیابی به ایمیلتان ارسال می‌شود.',
    'مشکل در ورود به آزمون': 'لطفاً موارد زیر را بررسی کنید:\n• زمان آزمون شروع شده باشد\n• اتصال اینترنت پایدار باشد\n• مرورگر به‌روز باشد\n\nاگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید.',
    'نحوه مشاهده نتایج': 'پس از اتمام آزمون، به بخش "نمرات من" در پنل کاربری بروید. نتایج معمولاً ظرف ۲۴ ساعت اعلام می‌شود.',
    'ساعات پشتیبانی': 'ساعات کاری پشتیبانی:\n🕐 شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰\n🕐 پنج‌شنبه: ۸:۰۰ - ۱۳:۰۰\n❌ جمعه: تعطیل\n\nچت آنلاین ۲۴ ساعته فعال است!',
    'تماس با ما': 'راه‌های ارتباط:\n📞 ۰۲۱-۱۲۳۴۵۶۷۸\n📧 info@examsite.com\n🏢 تهران، خیابان انقلاب، پلاک ۱۲۳'
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'text' | 'options' = 'text', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      type,
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addMessage(inputMessage, 'user');
    const userMessage = inputMessage.toLowerCase();
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // پیدا کردن بهترین پاسخ
      let response = 'متشکرم از پیام شما! برای پاسخ دقیق‌تر، لطفاً از گزینه‌های زیر استفاده کنید یا با پشتیبانی تماس بگیرید.';
      
      for (const [key, value] of Object.entries(botResponses)) {
        if (userMessage.includes(key.toLowerCase()) || 
            key.toLowerCase().includes(userMessage) ||
            userMessage.includes('ثبت نام') && key.includes('ثبت نام') ||
            userMessage.includes('آزمون') && key.includes('آزمون') ||
            userMessage.includes('مشکل') && key.includes('مشکل') ||
            userMessage.includes('پشتیبانی') && key.includes('پشتیبانی') ||
            userMessage.includes('رمز') && key.includes('رمز') ||
            userMessage.includes('نتیجه') && key.includes('نتایج') ||
            userMessage.includes('ساعت') && key.includes('ساعات') ||
            userMessage.includes('تماس') && key.includes('تماس')) {
          response = value;
          break;
        }
      }

      addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    addMessage(reply, 'user');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = botResponses[reply] || 'ممنون از سوالتون! تیم پشتیبانی ما در اسرع وقت پاسخ خواهد داد.';
      addMessage(response, 'bot');
    }, 800);
  };

  const handleOptionClick = (option: string) => {
    handleQuickReply(option);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-primary rounded-full shadow-hero flex items-center justify-center text-white hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-8 w-8" />
          
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">1</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            چت با پشتیبانی
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
      <div className={`bg-white rounded-3xl shadow-hero transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } flex flex-col overflow-hidden border border-white/20`}>
        
        {/* Header */}
        <div className="bg-gradient-primary p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">دستیار هوشمند</h3>
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-white/80 text-sm">آنلاین</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-800 shadow-soft border border-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      
                      {message.type === 'options' && message.options && (
                        <div className="mt-3 space-y-2">
                          {message.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className="block w-full text-right px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'user' ? 'text-left' : 'text-right'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'order-1 ml-2 bg-primary' : 'order-2 mr-2 bg-gray-200'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl shadow-soft border border-gray-100">
                      <div className="flex space-x-1 space-x-reverse">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2 space-x-reverse">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-primary text-white p-3 rounded-2xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Clock className="h-3 w-3" />
                  <span>پاسخ‌گویی ۲۴/۷</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="hover:text-primary transition-colors">
                    <Phone className="h-3 w-3" />
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <Mail className="h-3 w-3" />
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <Star className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;