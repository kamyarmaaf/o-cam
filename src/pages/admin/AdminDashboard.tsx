import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { violationService } from '../../services/violationService';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings,
  TrendingUp,
  Award,
  Clock,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Camera,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const recentViolations = violationService.getAdminNotifications().slice(0, 5);

  const stats = [
    { 
      icon: Users, 
      label: 'کل دانشجویان', 
      value: '1,247', 
      change: '+12%',
      changeType: 'increase',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50' 
    },
    { 
      icon: GraduationCap, 
      label: 'کل مدرسان', 
      value: '89', 
      change: '+5%',
      changeType: 'increase',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50' 
    },
    { 
      icon: BookOpen, 
      label: 'آزمون‌های فعال', 
      value: '156', 
      change: '+8%',
      changeType: 'increase',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50' 
    },
    { 
      icon: BarChart3, 
      label: 'میانگین سیستم', 
      value: '82.5%', 
      change: '+2.1%',
      changeType: 'increase',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50' 
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_register',
      message: 'دانشجوی جدید ثبت نام کرد',
      user: 'سینا داوودی',
      time: '۵ دقیقه پیش',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'exam_created',
      message: 'آزمون جدید ایجاد شد',
      user: 'دکتر احمدی',
      time: '۱۵ دقیقه پیش',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'violation_detected',
      message: 'تخلف در آزمون شناسایی شد',
      user: 'علی رضایی',
      time: '۲۰ دقیقه پیش',
      icon: Camera,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'exam_completed',
      message: 'آزمون ریاضی تکمیل شد',
      user: '۴۵ دانشجو',
      time: '۱ ساعت پیش',
      icon: CheckCircle,
      color: 'text-purple-600'
    }
  ];

  const systemHealth = [
    { name: 'سرور اصلی', status: 'healthy', uptime: '99.9%' },
    { name: 'پایگاه داده', status: 'healthy', uptime: '99.8%' },
    { name: 'سیستم احراز هویت', status: 'warning', uptime: '98.5%' },
    { name: 'سیستم فایل', status: 'healthy', uptime: '99.7%' }
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'سالم';
      case 'warning':
        return 'هشدار';
      case 'error':
        return 'خطا';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card-gradient">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-heading mb-2">
              سلام {user?.name} عزیز! 👋
            </h1>
            <p className="text-text-body text-lg">
              به پنل مدیریت سیستم خوش آمدید
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center text-3xl animate-bounce">
              🛡️
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
                <div className="flex items-center space-x-1 space-x-reverse mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center space-x-2 space-x-reverse">
              <Shield className="h-6 w-6 text-purple-600" />
              <span>عملیات سریع</span>
            </h2>
            <div className="space-y-4">
              <Link
                to="/admin/teachers"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
              >
                <span>مدیریت مدرسان</span>
                <GraduationCap className="h-5 w-5" />
              </Link>
              
              <Link
                to="/admin/students"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
              >
                <span>مدیریت دانشجویان</span>
                <Users className="h-5 w-5" />
              </Link>
              
              <Link
                to="/admin/questions"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300 text-right flex items-center justify-between"
              >
                <span>مدیریت سوالات</span>
                <BookOpen className="h-5 w-5" />
              </Link>
              
              <Link
                to="/admin/settings"
                className="w-full border-2 border-purple-600/20 text-text-body px-6 py-4 rounded-2xl font-semibold hover:bg-purple-50 hover:border-purple-600/40 transition-all duration-300 text-right flex items-center justify-between"
              >
                <span>تنظیمات سیستم</span>
                <Settings className="h-5 w-5" />
              </Link>

              {/* Violation Monitoring */}
              {recentViolations.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    <Camera className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">تخلفات اخیر</span>
                  </div>
                  <div className="space-y-2">
                    {recentViolations.slice(0, 3).map((violation) => (
                      <div key={violation.id} className="text-sm">
                        <p className="font-medium text-red-800">{violation.studentName}</p>
                        <p className="text-red-600 text-xs">{violation.details}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 text-red-600 hover:bg-red-100 py-2 rounded-xl transition-colors text-sm font-medium">
                    مشاهده همه تخلفات
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center space-x-2 space-x-reverse">
              <Clock className="h-6 w-6 text-primary" />
              <span>فعالیت‌های اخیر</span>
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 space-x-reverse p-4 bg-soft/30 rounded-2xl hover:bg-soft/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color === 'text-blue-600' ? 'bg-blue-100' : activity.color === 'text-green-600' ? 'bg-green-100' : activity.color === 'text-red-600' ? 'bg-red-100' : 'bg-purple-100'}`}>
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-text-heading">{activity.message}</p>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-text-body/70">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="card">
        <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center space-x-2 space-x-reverse">
          <Shield className="h-6 w-6 text-green-600" />
          <span>وضعیت سیستم</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemHealth.map((system, index) => (
            <div key={index} className="bg-soft/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-heading">{system.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(system.status)}`}>
                  {getHealthText(system.status)}
                </span>
              </div>
              <div className="text-sm text-text-body/70">
                آپتایم: {system.uptime}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-heading mb-4">آمار امروز</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-body">ورودهای جدید:</span>
              <span className="font-bold text-blue-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">آزمون‌های برگزار شده:</span>
              <span className="font-bold text-green-600">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">کاربران آنلاین:</span>
              <span className="font-bold text-purple-600">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">تخلفات شناسایی شده:</span>
              <span className="font-bold text-red-600">{violationService.getAdminNotifications().filter(n => n.type === 'violation').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">دانشجویان حذف شده:</span>
              <span className="font-bold text-red-600">{violationService.getAdminNotifications().filter(n => n.type === 'ejection').length}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-heading mb-4">عملکرد سیستم</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>استفاده از CPU</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>استفاده از RAM</span>
                <span>68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>فضای دیسک</span>
                <span>32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;