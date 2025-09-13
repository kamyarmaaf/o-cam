import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, Calendar, TrendingUp, Clock, Star, Target, Play } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentStats = [
    { icon: BookOpen, label: 'آزمون‌های شرکت کرده', value: '12', color: 'from-primary to-secondary', bgColor: 'bg-blue-50' },
    { icon: Award, label: 'میانگین نمره', value: '85%', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { icon: TrendingUp, label: 'بهترین نمره', value: '95%', color: 'from-secondary to-accent', bgColor: 'bg-blue-50' },
    { icon: Clock, label: 'آزمون‌های آینده', value: '3', color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50' }
  ];

  const teacherStats = [
    { icon: BookOpen, label: 'آزمون‌های ایجاد شده', value: '8', color: 'from-primary to-secondary', bgColor: 'bg-blue-50' },
    { icon: Users, label: 'دانشجویان فعال', value: '45', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { icon: Award, label: 'میانگین کلاس', value: '78%', color: 'from-secondary to-accent', bgColor: 'bg-blue-50' },
    { icon: Calendar, label: 'آزمون‌های این ماه', value: '5', color: 'from-blue-600 to-blue-700', bgColor: 'bg-blue-50' }
  ];

  const recentExams = [
    { id: 1, name: 'آزمون ریاضی عمومی', date: '۱۴۰۳/۰۹/۱۵', score: '92%', status: 'completed', emoji: '📐' },
    { id: 2, name: 'آزمون فیزیک کوانتوم', date: '۱۴۰۳/۰۹/۱۰', score: '85%', status: 'completed', emoji: '⚛️' },
    { id: 3, name: 'آزمون شیمی آلی', date: '۱۴۰۳/۰۹/۲۰', score: '-', status: 'upcoming', emoji: '🧪' }
  ];

  const stats = user?.role === 'teacher' ? teacherStats : studentStats;

  const handleStartExam = (examId: number) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-gradient">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-heading mb-2">
              سلام {user?.name} عزیز! 👋
            </h1>
            <p className="text-text-body text-lg">
              {user?.role === 'teacher' ? 'به پنل مدیریت مدرس خوش آمدید' : 'به پنل دانشجویی خوش آمدید'}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center text-3xl animate-bounce">
              {user?.role === 'teacher' ? '🎓' : '👨‍🎓'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card group hover:shadow-hero transition-all duration-500 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-body mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-text-heading">{stat.value}</p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-heading flex items-center space-x-2 space-x-reverse">
              <Star className="h-6 w-6 text-primary" />
              <span>{user?.role === 'teacher' ? 'آزمون‌های اخیر' : 'آزمون‌های من'}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {recentExams.map((exam, index) => (
              <div key={index} className="bg-soft/50 rounded-2xl p-4 hover:bg-soft transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="text-2xl">{exam.emoji}</div>
                    <div>
                      <h3 className="font-bold text-text-heading group-hover:text-primary transition-colors">{exam.name}</h3>
                      <p className="text-sm text-text-body">{exam.date}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      exam.status === 'completed' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {exam.status === 'completed' ? '✅ تکمیل شده' : '⏰ آینده'}
                    </div>
                    {exam.score !== '-' ? (
                      <p className="text-lg font-bold text-text-heading mt-2">{exam.score}</p>
                    ) : (
                      <button 
                        onClick={() => handleStartExam(exam.id)}
                        className="mt-2 px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-secondary transition-colors flex items-center space-x-1 space-x-reverse"
                      >
                        <Play className="h-3 w-3" />
                        <span>شروع</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-heading flex items-center space-x-2 space-x-reverse">
              <Target className="h-6 w-6 text-primary" />
              <span>عملیات سریع</span>
            </h2>
          </div>
          <div className="space-y-4">
            {user?.role === 'teacher' ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard/exam/create')}
                  className="w-full bg-gradient-primary text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
                >
                  <span>ایجاد آزمون جدید</span>
                  <span>➕</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard/students')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
                >
                  <span>مدیریت دانشجویان</span>
                  <span>👥</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard/reports')}
                  className="w-full border-2 border-primary/20 text-text-body px-6 py-4 rounded-2xl font-semibold hover:bg-soft/50 hover:border-primary/40 transition-all duration-300 text-right flex items-center justify-between"
                >
                  <span>مشاهده گزارشات</span>
                  <span>📊</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/dashboard/exams')}
                  className="w-full bg-gradient-primary text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
                >
                  <span>شرکت در آزمون</span>
                  <span>🚀</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard/scores')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
                >
                  <span>مشاهده نمرات</span>
                  <span>🏆</span>
                </button>
                <button 
                  onClick={() => navigate('/dashboard/scores')}
                  className="w-full border-2 border-primary/20 text-text-body px-6 py-4 rounded-2xl font-semibold hover:bg-soft/50 hover:border-primary/40 transition-all duration-300 text-right flex items-center justify-between"
                >
                  <span>تاریخچه آزمون‌ها</span>
                  <span>📚</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <h2 className="text-2xl font-bold text-text-heading mb-6 flex items-center space-x-2 space-x-reverse">
          <Calendar className="h-6 w-6 text-primary" />
          <span>رویدادهای آینده</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-blue-200 rounded-2xl p-6 hover:shadow-card transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="text-2xl ml-3">📐</div>
              <div>
                <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">آزمون ریاضی</h3>
                <p className="text-sm text-primary/70">۱۴۰۳/۰۹/۲۵ - ساعت ۱۰:۰۰</p>
              </div>
            </div>
            {user?.role === 'student' && (
              <button 
                onClick={() => handleStartExam(1)}
                className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-xl text-sm hover:bg-secondary transition-colors flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Play className="h-4 w-4" />
                <span>شرکت در آزمون</span>
              </button>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200 rounded-2xl p-6 hover:shadow-card transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="text-2xl ml-3">⚛️</div>
              <div>
                <h3 className="font-bold text-blue-600 group-hover:text-blue-700 transition-colors">آزمون فیزیک</h3>
                <p className="text-sm text-blue-500">۱۴۰۳/۰۹/۲۸ - ساعت ۱۴:۰۰</p>
              </div>
            </div>
            {user?.role === 'student' && (
              <button 
                onClick={() => handleStartExam(2)}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Play className="h-4 w-4" />
                <span>شرکت در آزمون</span>
              </button>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-secondary/10 to-accent/10 border border-blue-200 rounded-2xl p-6 hover:shadow-card transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <div className="text-2xl ml-3">🧪</div>
              <div>
                <h3 className="font-bold text-secondary group-hover:text-accent transition-colors">آزمون شیمی</h3>
                <p className="text-sm text-secondary/70">۱۴۰۳/۱۰/۰۲ - ساعت ۰۹:۰۰</p>
              </div>
            </div>
            {user?.role === 'student' && (
              <button 
                onClick={() => handleStartExam(3)}
                className="w-full mt-2 px-4 py-2 bg-secondary text-white rounded-xl text-sm hover:bg-accent transition-colors flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Play className="h-4 w-4" />
                <span>شرکت در آزمون</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;