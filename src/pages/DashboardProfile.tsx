import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Globe,
  BookOpen,
  Award,
  Clock,
  Settings
} from 'lucide-react';

const DashboardProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    address: 'تهران، خیابان انقلاب',
    birthDate: '۱۳۷۵/۰۵/۱۵',
    studentId: user?.role === 'student' ? 'STU-2023-001' : '',
    teacherId: user?.role === 'teacher' ? 'TCH-2020-005' : '',
    department: user?.role === 'student' ? 'مهندسی کامپیوتر' : 'دانشکده ریاضی',
    bio: 'علاقه‌مند به یادگیری و پیشرفت در زمینه تحصیلی',
    academicYear: user?.role === 'student' ? 'سال سوم' : '',
    experience: user?.role === 'teacher' ? '۵ سال' : '',
    specialization: user?.role === 'teacher' ? 'ریاضی کاربردی' : ''
  });

  const [notifications, setNotifications] = useState({
    examReminders: true,
    scoreUpdates: true,
    systemUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true
  });

  const [preferences, setPreferences] = useState({
    language: 'fa',
    timezone: 'Asia/Tehran',
    theme: 'light',
    dateFormat: 'persian',
    autoSave: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to API
    setIsEditing(false);
    // Show success message
  };

  const tabs = [
    { id: 'profile', label: 'اطلاعات شخصی', icon: User },
    { id: 'academic', label: 'اطلاعات تحصیلی', icon: BookOpen },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'preferences', label: 'تنظیمات', icon: Settings }
  ];

  const academicStats = user?.role === 'student' ? [
    { label: 'میانگین کل', value: '17.85', icon: Award, color: 'text-green-600' },
    { label: 'واحدهای گذرانده', value: '85', icon: BookOpen, color: 'text-blue-600' },
    { label: 'رتبه کلاس', value: '3', icon: Award, color: 'text-purple-600' },
    { label: 'حضور و غیاب', value: '92%', icon: Clock, color: 'text-primary' }
  ] : [
    { label: 'تعداد دانشجو', value: '125', icon: User, color: 'text-green-600' },
    { label: 'آزمون‌های برگزار شده', value: '28', icon: BookOpen, color: 'text-blue-600' },
    { label: 'میانگین کلاس', value: '16.2', icon: Award, color: 'text-purple-600' },
    { label: 'سابقه تدریس', value: '5 سال', icon: Clock, color: 'text-primary' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">پروفایل کاربری</h1>
          <p className="text-text-body">مدیریت اطلاعات شخصی و تنظیمات حساب</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-bold text-text-heading text-lg">{user?.name}</h3>
              <p className="text-text-body/70 mb-2">
                {user?.role === 'teacher' ? '🎓 مدرس' : '👨‍🎓 دانشجو'}
              </p>
              <p className="text-sm text-text-body/70">
                {user?.role === 'student' ? profileData.studentId : profileData.teacherId}
              </p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-2xl transition-all duration-300 text-right ${
                    activeTab === tab.id
                      ? 'bg-gradient-primary text-white shadow-card'
                      : 'text-text-body hover:bg-soft/50 hover:text-primary'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text-heading">اطلاعات شخصی</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary flex items-center space-x-2 space-x-reverse"
                    >
                      <Edit className="h-4 w-4" />
                      <span>ویرایش</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={handleSave}
                        className="btn-primary flex items-center space-x-2 space-x-reverse"
                      >
                        <Save className="h-4 w-4" />
                        <span>ذخیره</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn-secondary flex items-center space-x-2 space-x-reverse"
                      >
                        <X className="h-4 w-4" />
                        <span>انصراف</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      نام و نام خانوادگی
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                        <User className="h-5 w-5 text-text-body/40" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      ایمیل
                    </label>
                    <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                      <Mail className="h-5 w-5 text-text-body/40" />
                      <span>{profileData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      شماره تلفن
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                        <Phone className="h-5 w-5 text-text-body/40" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      تاریخ تولد
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="birthDate"
                        value={profileData.birthDate}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                        <Calendar className="h-5 w-5 text-text-body/40" />
                        <span>{profileData.birthDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      آدرس
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                        <MapPin className="h-5 w-5 text-text-body/40" />
                        <span>{profileData.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      درباره من
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-field resize-none"
                      />
                    ) : (
                      <div className="p-3 bg-soft/30 rounded-2xl">
                        <span>{profileData.bio}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && (
              <div>
                <h2 className="text-xl font-bold text-text-heading mb-6">اطلاعات تحصیلی</h2>
                
                {/* Academic Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {academicStats.map((stat, index) => (
                    <div key={index} className="bg-soft/30 rounded-2xl p-4 text-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                        stat.color === 'text-green-600' ? 'bg-green-100' :
                        stat.color === 'text-blue-600' ? 'bg-blue-100' :
                        stat.color === 'text-purple-600' ? 'bg-purple-100' : 'bg-primary/10'
                      }`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <p className="text-sm text-text-body/70 mb-1">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user?.role === 'student' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          شماره دانشجویی
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.studentId}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          رشته تحصیلی
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.department}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          سال تحصیلی
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.academicYear}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          کد مدرس
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.teacherId}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          دانشکده
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.department}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          سابقه تدریس
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.experience}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          تخصص
                        </label>
                        <div className="flex items-center space-x-2 space-x-reverse p-3 bg-soft/30 rounded-2xl">
                          <span>{profileData.specialization}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-text-heading mb-6">تنظیمات امنیتی</h2>
                
                <div className="space-y-6">
                  <div className="bg-soft/30 rounded-2xl p-6">
                    <h3 className="font-semibold text-text-heading mb-4">تغییر رمز عبور</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          رمز عبور فعلی
                        </label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          رمز عبور جدید
                        </label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          تکرار رمز عبور جدید
                        </label>
                        <input type="password" className="input-field" />
                      </div>
                      <button className="btn-primary">تغییر رمز عبور</button>
                    </div>
                  </div>

                  <div className="bg-soft/30 rounded-2xl p-6">
                    <h3 className="font-semibold text-text-heading mb-4">احراز هویت دو مرحله‌ای</h3>
                    <p className="text-text-body mb-4">
                      برای افزایش امنیت حساب خود، احراز هویت دو مرحله‌ای را فعال کنید.
                    </p>
                    <button className="btn-secondary">فعال‌سازی</button>
                  </div>

                  <div className="bg-soft/30 rounded-2xl p-6">
                    <h3 className="font-semibold text-text-heading mb-4">جلسات فعال</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div>
                          <p className="font-medium">مرورگر فعلی</p>
                          <p className="text-sm text-text-body/70">Chrome - Windows</p>
                        </div>
                        <span className="text-green-600 text-sm">فعال</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-text-heading mb-6">تنظیمات اعلان‌ها</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-soft/30 rounded-2xl">
                      <div>
                        <h3 className="font-medium text-text-heading">
                          {key === 'examReminders' && 'یادآوری آزمون‌ها'}
                          {key === 'scoreUpdates' && 'به‌روزرسانی نمرات'}
                          {key === 'systemUpdates' && 'به‌روزرسانی سیستم'}
                          {key === 'emailNotifications' && 'اعلان‌های ایمیل'}
                          {key === 'smsNotifications' && 'اعلان‌های پیامکی'}
                          {key === 'weeklyReports' && 'گزارش هفتگی'}
                        </h3>
                        <p className="text-sm text-text-body/70">
                          {key === 'examReminders' && 'دریافت یادآوری قبل از شروع آزمون‌ها'}
                          {key === 'scoreUpdates' && 'اطلاع از انتشار نمرات جدید'}
                          {key === 'systemUpdates' && 'اطلاع از به‌روزرسانی‌های سیستم'}
                          {key === 'emailNotifications' && 'دریافت اعلان‌ها از طریق ایمیل'}
                          {key === 'smsNotifications' && 'دریافت اعلان‌ها از طریق پیامک'}
                          {key === 'weeklyReports' && 'دریافت گزارش هفتگی عملکرد'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleNotificationChange(key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-xl font-bold text-text-heading mb-6">تنظیمات عمومی</h2>
                
                <div className="space-y-6">
                  <div className="bg-soft/30 rounded-2xl p-6">
                    <h3 className="font-semibold text-text-heading mb-4">زبان و منطقه</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          زبان رابط کاربری
                        </label>
                        <select 
                          value={preferences.language}
                          onChange={(e) => handlePreferenceChange('language', e.target.value)}
                          className="input-field"
                        >
                          <option value="fa">فارسی</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-heading mb-2">
                          منطقه زمانی
                        </label>
                        <select 
                          value={preferences.timezone}
                          onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                          className="input-field"
                        >
                          <option value="Asia/Tehran">تهران (GMT+3:30)</option>
                          <option value="UTC">UTC (GMT+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-soft/30 rounded-2xl p-6">
                    <h3 className="font-semibold text-text-heading mb-4">تنظیمات نمایش</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>حالت تاریک</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.theme === 'dark'}
                            onChange={(e) => handlePreferenceChange('theme', e.target.checked ? 'dark' : 'light')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>ذخیره خودکار</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.autoSave}
                            onChange={(e) => handlePreferenceChange('autoSave', e.target.checked.toString())}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;