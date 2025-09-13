import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, User, Clock, GraduationCap, MessageCircle, Send, X, ChevronUp, Phone, Shield, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as 'student' | 'teacher'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'سلام! چطور می‌تونم کمکتون کنم؟', sender: 'bot', time: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [adminError, setAdminError] = useState('');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const { login, adminLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const currentHour = new Date().getHours();
  const isAllowedTime = currentHour >= 8 && currentHour <= 15;

  const chatbotResponses = [
    'چطور می‌تونم در سیستم ثبت نام کنم؟',
    'آیا امکان تغییر رمز عبور وجود دارد؟',
    'چگونه می‌توانم آزمون‌های خود را مشاهده کنم؟',
    'پشتیبانی فنی چطور در دسترس است؟',
    'آیا آموزش استفاده از سیستم وجود دارد؟'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    const success = await login(formData.email, formData.password, formData.role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      text: newMessage,
      sender: 'user' as const,
      time: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        text: 'ممنون از سوالتون! برای پاسخ دقیق‌تر، لطفاً با بخش پشتیبانی تماس بگیرید یا از راهنمای سایت استفاده کنید.',
        sender: 'bot' as const,
        time: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);

    setNewMessage('');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminCredentials.email || !adminCredentials.password) {
      setAdminError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    const success = await adminLogin(adminCredentials.email, adminCredentials.password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setAdminError('ایمیل یا رمز عبور ادمین اشتباه است');
    }
  };

  return (
    <>
      <div className="min-h-screen educational-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Educational Elements */}
        <div className="educational-element pencil top-20 right-20 animate-sway" style={{ animationDelay: '0s' }}>✏️</div>
        <div className="educational-element book top-32 left-24 animate-float" style={{ animationDelay: '1s' }}>📚</div>
        <div className="educational-element calculator top-60 right-32 animate-bounce-slow" style={{ animationDelay: '2s' }}>🧮</div>
        <div className="educational-element pencil bottom-40 left-20 animate-sway" style={{ animationDelay: '3s' }}>🖊️</div>
        <div className="educational-element book bottom-20 right-16 animate-float" style={{ animationDelay: '4s' }}>📖</div>
        <div className="educational-element top-16 left-1/2 animate-rotate" style={{ animationDelay: '1s' }}>📐</div>
        <div className="educational-element bottom-60 left-1/3 animate-bounce-slow" style={{ animationDelay: '2.5s' }}>✂️</div>
        <div className="educational-element top-1/3 right-16 animate-sway" style={{ animationDelay: '1.5s' }}>📏</div>
        <div className="educational-element bottom-1/3 right-1/4 animate-float" style={{ animationDelay: '3.5s' }}>🖍️</div>
        <div className="educational-element top-2/3 left-16 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>📝</div>
        <div className="educational-element top-1/4 left-1/4 animate-sway" style={{ animationDelay: '4.5s' }}>🎒</div>
        <div className="educational-element bottom-1/4 left-1/2 animate-float" style={{ animationDelay: '2.8s' }}>📊</div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-24 right-1/3 w-16 h-16 border-2 border-white/10 rounded-full animate-rotate" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-white/10 rotate-45 animate-bounce-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 border-2 border-white/10 rounded-lg animate-sway" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Link 
                to="/"
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-2xl hover:bg-white hover:text-primary transition-all duration-300"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">بازگشت به خانه</span>
              </Link>
            </div>
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ورود به سیستم</h1>
            <p className="text-white/80">به سیستم آزمون‌گیری آنلاین خوش آمدید</p>
          </div>

          {/* Glass Card */}
          <div className="glass-effect rounded-3xl p-8 shadow-hero">
            
            {/* Time Warning */}
            {!isAllowedTime && (
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                <div className="flex items-center text-yellow-200">
                  <Clock className="h-5 w-5 ml-2" />
                  <span className="text-sm font-medium">
                    زمان مجاز ورود: ساعت ۸:۰۰ تا ۱۵:۰۰
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                <div className="flex items-center text-red-100">
                  <AlertCircle className="h-5 w-5 ml-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection with Buttons */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  نوع کاربری
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                    className={`flex items-center justify-center space-x-2 space-x-reverse p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      formData.role === 'student'
                        ? 'border-white bg-white/20 text-white'
                        : 'border-white/30 hover:border-white/50 text-white/70'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">دانشجو</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                    className={`flex items-center justify-center space-x-2 space-x-reverse p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
                      formData.role === 'teacher'
                        ? 'border-white bg-white/20 text-white'
                        : 'border-white/30 hover:border-white/50 text-white/70'
                    }`}
                  >
                    <GraduationCap className="h-5 w-5" />
                    <span className="font-medium">مدرس</span>
                  </button>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  ایمیل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 backdrop-blur-sm"
                    placeholder="ایمیل خود را وارد کنید"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 backdrop-blur-sm"
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white/80">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/30 bg-white/10 text-white focus:ring-white/30 focus:ring-offset-0 ml-2" 
                  />
                  مرا به خاطر بسپار
                </label>
                <Link to="/forgot-password" className="text-white font-semibold hover:text-white/80 transition-colors underline">
                  فراموشی رمز عبور؟
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !isAllowedTime}
                className="w-full bg-white text-primary font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-hero"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>در حال ورود...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <LogIn className="h-5 w-5" />
                    <span>ورود به سیستم</span>
                  </div>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                برای دریافت حساب کاربری با مدیر سیستم تماس بگیرید
              </p>
            </div>

            {/* Test Credentials */}
            <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-white mb-2 text-sm">اطلاعات تست:</h3>
              <div className="text-xs text-white/70 space-y-1">
                <p><strong>دانشجو:</strong> student@test.com / 123456</p>
                <p><strong>مدرس:</strong> teacher@test.com / 123456</p>
                <p><strong>ادمین:</strong> admin@test.com / 123456</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="fixed bottom-6 left-6 z-50">
          {!showAdminMenu ? (
            <div className="relative group">
              <button
                onClick={() => setShowAdminMenu(true)}
                className="w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full shadow-hero flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
              >
                <Shield className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-hero border border-white/30 overflow-hidden">
              <div className="p-3">
                {!showAdminLogin ? (
                  <div className="space-y-2">
                    <div className="flex justify-end mb-3 pb-2 border-b border-gray-200">
                      <button
                        onClick={() => {
                          setShowAdminMenu(false);
                          setShowAdminLogin(false);
                          setAdminError('');
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <Link
                      to="/contact"
                      className="flex items-center justify-center p-2 hover:bg-soft/50 rounded-xl transition-colors group"
                      onClick={() => setShowAdminMenu(false)}
                    >
                     <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                       <Phone className="h-5 w-5 text-white" />
                     </div>
                    </Link>

                    <button
                      onClick={() => setShowChatbot(true)}
                      className="w-full flex items-center justify-center p-2 hover:bg-soft/50 rounded-xl transition-colors group"
                    >
                     <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                       <MessageCircle className="h-5 w-5 text-white" />
                     </div>
                    </button>

                    <button
                      onClick={() => setShowAdminLogin(true)}
                      className="w-full flex items-center justify-center p-2 hover:bg-soft/50 rounded-xl transition-colors group"
                    >
                     <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                       <Shield className="h-5 w-5 text-white" />
                     </div>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center mb-3">
                      <h4 className="font-medium text-text-heading text-sm">ورود ادمین</h4>
                    </div>

                    {adminError && (
                      <div className="bg-red-100 border border-red-300 text-red-700 px-2 py-1 rounded-lg text-xs">
                        {adminError}
                      </div>
                    )}

                    <form onSubmit={handleAdminLogin} className="space-y-3">
                      <div>
                        <input
                          type="email"
                          placeholder="ایمیل ادمین"
                          value={adminCredentials.email}
                          onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <input
                          type="password"
                          placeholder="رمز عبور ادمین"
                          value={adminCredentials.password}
                          onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 border border-accent/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-sm"
                          required
                        />
                      </div>

                      <div className="flex space-x-1 space-x-reverse">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 text-sm"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center space-x-1 space-x-reverse">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>ورود...</span>
                            </div>
                          ) : (
                            'ورود'
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAdminLogin(false)}
                          className="px-3 py-2 border border-accent/30 text-text-body rounded-xl hover:bg-soft/50 transition-colors text-sm"
                        >
                          انصراف
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chatbot */}
        {showChatbot && (
          <div className="fixed bottom-6 left-6 z-50">
            <div className="bg-white rounded-3xl shadow-hero w-80 h-[400px] flex flex-col overflow-hidden border border-white/20">
              
              {/* Header */}
              <div className="bg-gradient-primary p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">دستیار هوشمند</h3>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-white/80 text-sm">آنلاین</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[200px] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-3 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-800 shadow-soft border border-gray-100'
                        }`}
                      >
                        <p className="text-xs">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-left' : 'text-right'
                      }`}>
                        {formatTime(message.time)}
                      </p>
                    </div>
                    
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'order-1 ml-2 bg-primary' : 'order-2 mr-2 bg-gray-200'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-3 w-3 text-white" />
                      ) : (
                        <MessageCircle className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Replies */}
              <div className="p-2 border-t border-gray-200 bg-white">
                <div className="flex flex-wrap gap-2 mb-3">
                  {chatbotResponses.slice(0, 3).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage()}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-1 space-x-reverse">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary text-white p-2 rounded-2xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-3 py-1 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Clock className="h-2 w-2" />
                    <span>پاسخ‌گویی ۲۴/۷</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button className="hover:text-primary transition-colors">
                      <Phone className="h-2 w-2" />
                    </button>
                    <button className="hover:text-primary transition-colors">
                      <Mail className="h-2 w-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Login;