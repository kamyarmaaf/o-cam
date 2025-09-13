import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Eye,
  BarChart3,
  Filter,
  Star,
  Target,
  BookOpen,
  Clock
} from 'lucide-react';

const DashboardScores: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const scores = [
    {
      id: 1,
      examTitle: 'آزمون ریاضی عمومی',
      subject: 'ریاضی',
      date: '۱۴۰۳/۰۹/۱۵',
      score: 92,
      maxScore: 100,
      rank: 3,
      totalParticipants: 45,
      duration: '۸۵ دقیقه',
      correctAnswers: 23,
      totalQuestions: 25,
      teacher: 'دکتر احمدی',
      passingScore: 60,
      grade: 'A'
    },
    {
      id: 2,
      examTitle: 'آزمون فیزیک کوانتوم',
      subject: 'فیزیک',
      date: '۱۴۰۳/۰۹/۱۰',
      score: 85,
      maxScore: 100,
      rank: 8,
      totalParticipants: 38,
      duration: '۱۱۰ دقیقه',
      correctAnswers: 25,
      totalQuestions: 30,
      teacher: 'دکتر محمدی',
      passingScore: 70,
      grade: 'B+'
    },
    {
      id: 3,
      examTitle: 'آزمون شیمی آلی',
      subject: 'شیمی',
      date: '۱۴۰۳/۰۹/۰۵',
      score: 78,
      maxScore: 100,
      rank: 12,
      totalParticipants: 42,
      duration: '۹۵ دقیقه',
      correctAnswers: 16,
      totalQuestions: 20,
      teacher: 'دکتر رضایی',
      passingScore: 60,
      grade: 'B'
    },
    {
      id: 4,
      examTitle: 'آزمون زیست‌شناسی',
      subject: 'زیست',
      date: '۱۴۰۳/۰۸/۲۸',
      score: 95,
      maxScore: 100,
      rank: 1,
      totalParticipants: 35,
      duration: '۷۰ دقیقه',
      correctAnswers: 19,
      totalQuestions: 20,
      teacher: 'دکتر کریمی',
      passingScore: 65,
      grade: 'A+'
    },
    {
      id: 5,
      examTitle: 'آزمون ادبیات فارسی',
      subject: 'ادبیات',
      date: '۱۴۰۳/۰۸/۲۰',
      score: 88,
      maxScore: 100,
      rank: 5,
      totalParticipants: 40,
      duration: '۱۰۰ دقیقه',
      correctAnswers: 22,
      totalQuestions: 25,
      teacher: 'دکتر نوری',
      passingScore: 60,
      grade: 'A-'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-blue-100 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getRankColor = (rank: number, total: number) => {
    const percentage = (rank / total) * 100;
    if (percentage <= 10) return 'text-green-600';
    if (percentage <= 25) return 'text-blue-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const filteredScores = scores.filter(score => {
    const matchesPeriod = selectedPeriod === 'all' || 
      (selectedPeriod === 'current' && new Date(score.date) > new Date('2024-01-01')) ||
      (selectedPeriod === 'last' && new Date(score.date) < new Date('2024-01-01'));
    
    const matchesSubject = selectedSubject === 'all' || score.subject === selectedSubject;
    
    return matchesPeriod && matchesSubject;
  });

  const averageScore = filteredScores.reduce((sum, score) => sum + score.score, 0) / filteredScores.length;
  const bestScore = Math.max(...filteredScores.map(s => s.score));
  const totalExams = filteredScores.length;
  const passedExams = filteredScores.filter(s => s.score >= s.passingScore).length;

  const subjects = [...new Set(scores.map(s => s.subject))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">نمرات من</h1>
          <p className="text-text-body">مشاهده و تحلیل نمرات آزمون‌های شما</p>
        </div>
        
        <button className="btn-secondary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0">
          <Download className="h-5 w-5" />
          <span>دانلود گزارش</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">میانگین نمرات</p>
              <p className="text-2xl font-bold text-primary">{averageScore.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">بهترین نمره</p>
              <p className="text-2xl font-bold text-green-600">{bestScore}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">تعداد آزمون‌ها</p>
              <p className="text-2xl font-bold text-blue-600">{totalExams}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">نرخ قبولی</p>
              <p className="text-2xl font-bold text-purple-600">{Math.round((passedExams / totalExams) * 100)}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Filter className="h-5 w-5 text-text-body/40" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-accent/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white/90"
            >
              <option value="all">همه دوره‌ها</option>
              <option value="current">دوره جاری</option>
              <option value="last">دوره قبل</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-accent/30 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white/90"
            >
              <option value="all">همه دروس</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scores List */}
      <div className="space-y-4">
        {filteredScores.map((score) => (
          <div key={score.id} className="card hover:shadow-hero transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse flex-1">
                <div className={`w-20 h-20 ${getScoreBackground(score.score)} rounded-2xl flex items-center justify-center border`}>
                  <span className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                    {score.score}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <h3 className="font-bold text-text-heading text-lg group-hover:text-primary transition-colors">
                      {score.examTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(score.grade)}`}>
                      {score.grade}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-body/70">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="h-4 w-4" />
                      <span>{score.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <BookOpen className="h-4 w-4" />
                      <span>{score.subject}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="h-4 w-4" />
                      <span>{score.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <span>{score.teacher}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className={`text-lg font-bold ${getRankColor(score.rank, score.totalParticipants)}`}>
                    رتبه {score.rank}
                  </span>
                  <span className="text-text-body/70">از {score.totalParticipants}</span>
                </div>
                
                <div className="text-sm text-text-body/70">
                  <div>پاسخ صحیح: {score.correctAnswers}/{score.totalQuestions}</div>
                  <div>نمره کل: {score.score}/{score.maxScore}</div>
                </div>
                
                <button className="btn-primary flex items-center space-x-2 space-x-reverse">
                  <Eye className="h-4 w-4" />
                  <span>جزئیات</span>
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-text-body/70 mb-2">
                <span>درصد صحیح</span>
                <span>{((score.correctAnswers / score.totalQuestions) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    score.score >= 90 ? 'bg-green-500' : 
                    score.score >= 80 ? 'bg-blue-500' : 
                    score.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(score.correctAnswers / score.totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-accent/20">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4 space-x-reverse text-text-body/70">
                  <span>نمره قبولی: {score.passingScore}%</span>
                  <span className={score.score >= score.passingScore ? 'text-green-600' : 'text-red-600'}>
                    {score.score >= score.passingScore ? '✅ قبول' : '❌ مردود'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {score.score > averageScore ? (
                    <div className="flex items-center space-x-1 space-x-reverse text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">بالاتر از میانگین</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 space-x-reverse text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm">پایین‌تر از میانگین</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-heading">نمودار عملکرد</h2>
          <select className="border border-accent/30 rounded-xl px-3 py-2">
            <option>۶ ماه اخیر</option>
            <option>سال جاری</option>
            <option>همه دوره‌ها</option>
          </select>
        </div>
        <div className="h-64 bg-gradient-to-r from-soft/30 to-accent/30 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-primary/60 mx-auto mb-4" />
            <p className="text-text-body/70">نمودار عملکرد در نسخه‌های آینده اضافه خواهد شد</p>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="card">
        <h2 className="text-xl font-bold text-text-heading mb-6">عملکرد بر اساس درس</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const subjectScores = filteredScores.filter(s => s.subject === subject);
            const subjectAverage = subjectScores.reduce((sum, s) => sum + s.score, 0) / subjectScores.length;
            const subjectBest = Math.max(...subjectScores.map(s => s.score));
            
            return (
              <div key={subject} className="bg-soft/30 rounded-2xl p-4">
                <h3 className="font-semibold text-text-heading mb-3">{subject}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-body/70">میانگین:</span>
                    <span className={`font-bold ${getScoreColor(subjectAverage)}`}>
                      {subjectAverage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-body/70">بهترین:</span>
                    <span className="font-bold text-green-600">{subjectBest}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-body/70">تعداد آزمون:</span>
                    <span className="font-medium">{subjectScores.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardScores;