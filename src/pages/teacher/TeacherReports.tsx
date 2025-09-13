import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Award,
  Calendar,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

const TeacherReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');

  const classPerformance = [
    {
      className: 'کلاس A',
      students: 45,
      averageScore: 85.2,
      passRate: 91,
      trend: 'up',
      lastExam: 'آزمون ریاضی عمومی',
      riskStudents: 4
    },
    {
      className: 'کلاس B',
      students: 38,
      averageScore: 78.5,
      passRate: 84,
      trend: 'down',
      lastExam: 'آزمون فیزیک کوانتوم',
      riskStudents: 6
    },
    {
      className: 'کلاس C',
      students: 42,
      averageScore: 82.1,
      passRate: 88,
      trend: 'up',
      lastExam: 'آزمون شیمی آلی',
      riskStudents: 5
    }
  ];

  const examAnalytics = [
    {
      examTitle: 'آزمون ریاضی عمومی',
      date: '۱۴۰۳/۰۹/۲۰',
      participants: 45,
      averageScore: 85.2,
      highestScore: 98,
      lowestScore: 45,
      passRate: 91,
      difficulty: 'متوسط',
      timeSpent: '۷۸ دقیقه'
    },
    {
      examTitle: 'آزمون فیزیک کوانتوم',
      date: '۱۴۰۳/۰۹/۱۸',
      participants: 38,
      averageScore: 78.5,
      highestScore: 95,
      lowestScore: 32,
      passRate: 84,
      difficulty: 'سخت',
      timeSpent: '۱۰۵ دقیقه'
    },
    {
      examTitle: 'آزمون شیمی آلی',
      date: '۱۴۰۳/۰۹/۱۵',
      participants: 42,
      averageScore: 82.1,
      highestScore: 96,
      lowestScore: 58,
      passRate: 88,
      difficulty: 'متوسط',
      timeSpent: '۸۵ دقیقه'
    }
  ];

  const riskStudents = [
    {
      id: 1,
      name: 'علی رضایی',
      studentId: 'STU-2023-003',
      class: 'کلاس A',
      averageScore: 45.2,
      failedExams: 3,
      lastActivity: '۱۴۰۳/۰۹/۱۵',
      riskLevel: 'high',
      issues: ['نمرات پایین', 'غیبت زیاد', 'عدم شرکت در آزمون']
    },
    {
      id: 2,
      name: 'فاطمه محمدی',
      studentId: 'STU-2023-004',
      class: 'کلاس B',
      averageScore: 58.7,
      failedExams: 2,
      lastActivity: '۱۴۰۳/۰۹/۱۸',
      riskLevel: 'medium',
      issues: ['نمرات نوسانی', 'تاخیر در ارسال تکالیف']
    }
  ];

  const questionAnalytics = [
    {
      questionNumber: 1,
      correctRate: 92,
      difficulty: 'آسان',
      topic: 'مشتق',
      commonMistakes: ['اشتباه در قانون زنجیره‌ای']
    },
    {
      questionNumber: 2,
      correctRate: 68,
      difficulty: 'متوسط',
      topic: 'انتگرال',
      commonMistakes: ['فراموشی ثابت انتگرال', 'اشتباه در محاسبه']
    },
    {
      questionNumber: 3,
      correctRate: 34,
      difficulty: 'سخت',
      topic: 'معادلات دیفرانسیل',
      commonMistakes: ['عدم تشخیص نوع معادله', 'اشتباه در روش حل']
    }
  ];

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'خطر بالا';
      case 'medium':
        return 'خطر متوسط';
      case 'low':
        return 'خطر پایین';
      default:
        return level;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'آسان':
        return 'text-green-600';
      case 'متوسط':
        return 'text-blue-600';
      case 'سخت':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">گزارشات و آنالیز</h1>
          <p className="text-text-body">تحلیل عملکرد دانشجویان و آمار آزمون‌ها</p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse mt-4 lg:mt-0">
          <button className="btn-secondary flex items-center space-x-2 space-x-reverse">
            <Download className="h-5 w-5" />
            <span>دانلود گزارش</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Filter className="h-5 w-5 text-text-body/40" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              <option value="current">ترم جاری</option>
              <option value="last">ترم گذشته</option>
              <option value="year">سال تحصیلی</option>
            </select>
          </div>

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input-field"
            >
              <option value="all">همه کلاس‌ها</option>
              <option value="class-a">کلاس A</option>
              <option value="class-b">کلاس B</option>
              <option value="class-c">کلاس C</option>
            </select>
          </div>

          <div>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="input-field"
            >
              <option value="all">همه آزمون‌ها</option>
              <option value="math">آزمون ریاضی</option>
              <option value="physics">آزمون فیزیک</option>
              <option value="chemistry">آزمون شیمی</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">کل دانشجویان</p>
              <p className="text-2xl font-bold text-primary">125</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">میانگین کلی</p>
              <p className="text-2xl font-bold text-green-600">81.9%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">نرخ قبولی</p>
              <p className="text-2xl font-bold text-blue-600">87.6%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-body mb-1">دانشجویان در خطر</p>
              <p className="text-2xl font-bold text-red-600">15</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Class Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-heading">عملکرد کلاس‌ها</h2>
          <button className="text-primary hover:text-secondary transition-colors">
            مشاهده جزئیات
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-right py-3 px-4 font-semibold text-text-heading">کلاس</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">تعداد دانشجو</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">میانگین نمره</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">نرخ قبولی</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">روند</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">در خطر</th>
                <th className="text-center py-3 px-4 font-semibold text-text-heading">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {classPerformance.map((classData, index) => (
                <tr key={index} className="border-b border-accent/10 hover:bg-soft/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-text-heading">{classData.className}</p>
                      <p className="text-sm text-text-body/70">{classData.lastExam}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-body">{classData.students}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-primary">{classData.averageScore}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-green-600">{classData.passRate}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {classData.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={classData.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {classData.trend === 'up' ? 'صعودی' : 'نزولی'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {classData.riskStudents} نفر
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Analytics */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-heading">آنالیز آزمون‌ها</h2>
        </div>

        <div className="space-y-4">
          {examAnalytics.map((exam, index) => (
            <div key={index} className="border border-accent/20 rounded-2xl p-4 hover:shadow-soft transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-text-heading text-lg">{exam.examTitle}</h3>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-text-body/70 mt-1">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Calendar className="h-4 w-4" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Users className="h-4 w-4" />
                      <span>{exam.participants} شرکت‌کننده</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="h-4 w-4" />
                      <span>میانگین زمان: {exam.timeSpent}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exam.difficulty)}`}>
                  {exam.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-sm text-text-body/70">میانگین نمره</p>
                  <p className="text-xl font-bold text-primary">{exam.averageScore}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-body/70">بالاترین نمره</p>
                  <p className="text-xl font-bold text-green-600">{exam.highestScore}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-body/70">پایین‌ترین نمره</p>
                  <p className="text-xl font-bold text-red-600">{exam.lowestScore}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-text-body/70">نرخ قبولی</p>
                  <p className="text-xl font-bold text-blue-600">{exam.passRate}%</p>
                </div>
                <div className="text-center">
                  <button className="btn-secondary w-full">
                    جزئیات
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Students */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-heading flex items-center space-x-2 space-x-reverse">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <span>دانشجویان در خطر</span>
          </h2>
          <button className="text-primary hover:text-secondary transition-colors">
            مشاهده همه
          </button>
        </div>

        <div className="space-y-4">
          {riskStudents.map((student) => (
            <div key={student.id} className="border border-red-200 bg-red-50/30 rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-heading">{student.name}</p>
                      <p className="text-sm text-text-body/70">{student.studentId} - {student.class}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(student.riskLevel)}`}>
                      {getRiskLevelText(student.riskLevel)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-text-body/70">میانگین نمره</p>
                      <p className="font-bold text-red-600">{student.averageScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-body/70">آزمون‌های مردودی</p>
                      <p className="font-bold text-red-600">{student.failedExams}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-body/70">آخرین فعالیت</p>
                      <p className="font-medium text-text-body">{student.lastActivity}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-text-body/70 mb-2">مشکلات شناسایی شده:</p>
                    <div className="flex flex-wrap gap-2">
                      {student.issues.map((issue, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="btn-secondary">
                    ارسال پیام
                  </button>
                  <button className="btn-primary">
                    مشاهده پروفایل
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question Analytics */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-heading">آنالیز سوالات</h2>
          <select className="border border-accent/30 rounded-xl px-3 py-2">
            <option>آزمون ریاضی عمومی</option>
            <option>آزمون فیزیک کوانتوم</option>
            <option>آزمون شیمی آلی</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accent/20">
                <th className="text-right py-3 px-4 font-semibold text-text-heading">شماره سوال</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">نرخ پاسخ صحیح</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">سطح دشواری</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">موضوع</th>
                <th className="text-right py-3 px-4 font-semibold text-text-heading">اشتباهات رایج</th>
              </tr>
            </thead>
            <tbody>
              {questionAnalytics.map((question, index) => (
                <tr key={index} className="border-b border-accent/10 hover:bg-soft/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {question.questionNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            question.correctRate >= 80 ? 'bg-green-500' :
                            question.correctRate >= 60 ? 'bg-blue-500' :
                            question.correctRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${question.correctRate}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{question.correctRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-body">{question.topic}</td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {question.commonMistakes.map((mistake, idx) => (
                        <span key={idx} className="block text-sm text-red-600">
                          • {mistake}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherReports;