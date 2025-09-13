import React, { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Shield, 
  Database,
  Mail,
  Bell,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Server,
  Users,
  Lock
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'سیستم آزمون‌گیری آنلاین',
    siteDescription: 'پلتفرمی مدرن برای آزمون‌گیری آنلاین',
    allowedLoginHours: {
      start: '08:00',
      end: '15:00'
    },
    maintenanceMode: false,
    registrationEnabled: true,
    maxFileSize: 10, // MB
    sessionTimeout: 30 // minutes
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 6,
    requireSpecialChars: false,
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    twoFactorAuth: false,
    ipWhitelist: '',
    sessionSecurity: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@examsite.com',
    fromName: 'سیستم آزمون‌گیری',
    enableNotifications: true
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    host: 'localhost',
    port: 3306,
    database: 'exam_system',
    username: 'root',
    password: '',
    connectionPool: 10,
    backupEnabled: true,
    backupFrequency: 'daily'
  });

  const tabs = [
    { id: 'general', label: 'تنظیمات عمومی', icon: Settings },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'email', label: 'ایمیل', icon: Mail },
    { id: 'database', label: 'پایگاه داده', icon: Database },
    { id: 'system', label: 'سیستم', icon: Server }
  ];

  const handleSaveSettings = () => {
    console.log('Saving settings:', {
      general: generalSettings,
      security: securitySettings,
      email: emailSettings,
      database: databaseSettings
    });
    alert('تنظیمات با موفقیت ذخیره شد!');
  };

  const handleTestConnection = () => {
    console.log('Testing database connection...');
    alert('اتصال به پایگاه داده موفق بود!');
  };

  const handleTestEmail = () => {
    console.log('Testing email configuration...');
    alert('تست ایمیل موفق بود!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading mb-2">تنظیمات سیستم</h1>
          <p className="text-text-body">مدیریت تنظیمات کلی و پیکربندی سیستم</p>
        </div>
        
        <button 
          onClick={handleSaveSettings}
          className="btn-primary flex items-center space-x-2 space-x-reverse mt-4 lg:mt-0"
        >
          <Save className="h-5 w-5" />
          <span>ذخیره تنظیمات</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 space-x-reverse mb-6 bg-soft/50 p-1 rounded-2xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 space-x-reverse py-3 px-4 rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-soft'
                  : 'text-text-body hover:text-primary'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  نام سایت
                </label>
                <input
                  type="text"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  حداکثر حجم فایل (MB)
                </label>
                <input
                  type="number"
                  value={generalSettings.maxFileSize}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                  className="input-field"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-heading mb-2">
                توضیحات سایت
              </label>
              <textarea
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div className="bg-soft/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-heading mb-4">ساعات مجاز ورود</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    ساعت شروع
                  </label>
                  <input
                    type="time"
                    value={generalSettings.allowedLoginHours.start}
                    onChange={(e) => setGeneralSettings(prev => ({ 
                      ...prev, 
                      allowedLoginHours: { ...prev.allowedLoginHours, start: e.target.value }
                    }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    ساعت پایان
                  </label>
                  <input
                    type="time"
                    value={generalSettings.allowedLoginHours.end}
                    onChange={(e) => setGeneralSettings(prev => ({ 
                      ...prev, 
                      allowedLoginHours: { ...prev.allowedLoginHours, end: e.target.value }
                    }))}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={generalSettings.maintenanceMode}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                  className="rounded border-accent/30 text-primary focus:ring-primary"
                />
                <span className="text-text-body">حالت تعمیر و نگهداری</span>
              </label>

              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={generalSettings.registrationEnabled}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                  className="rounded border-accent/30 text-primary focus:ring-primary"
                />
                <span className="text-text-body">امکان ثبت نام کاربران جدید</span>
              </label>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  حداقل طول رمز عبور
                </label>
                <input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                  className="input-field"
                  min="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  حداکثر تلاش ورود
                </label>
                <input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  مدت قفل حساب (دقیقه)
                </label>
                <input
                  type="number"
                  value={securitySettings.lockoutDuration}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  لیست سفید IP (اختیاری)
                </label>
                <textarea
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="192.168.1.1&#10;10.0.0.1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={securitySettings.requireSpecialChars}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, requireSpecialChars: e.target.checked }))}
                  className="rounded border-accent/30 text-primary focus:ring-primary"
                />
                <span className="text-text-body">الزام استفاده از کاراکترهای خاص در رمز عبور</span>
              </label>

              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                  className="rounded border-accent/30 text-primary focus:ring-primary"
                />
                <span className="text-text-body">فعال‌سازی احراز هویت دو مرحله‌ای</span>
              </label>

              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={securitySettings.sessionSecurity}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionSecurity: e.target.checked }))}
                  className="rounded border-accent/30 text-primary focus:ring-primary"
                />
                <span className="text-text-body">امنیت پیشرفته جلسات</span>
              </label>
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  سرور SMTP
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  پورت SMTP
                </label>
                <input
                  type="number"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  نام کاربری SMTP
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  رمز عبور SMTP
                </label>
                <input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  ایمیل فرستنده
                </label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  نام فرستنده
                </label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  checked={emailSettings.enableNotifications}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, enableNotifications: e.target.checked }))}
                  className="rounded border-accent/30 text-primary focus:ring-primary"
                />
                <span className="text-text-body">فعال‌سازی اطلاع‌رسانی ایمیل</span>
              </label>

              <button 
                onClick={handleTestEmail}
                className="btn-secondary flex items-center space-x-2 space-x-reverse"
              >
                <Mail className="h-5 w-5" />
                <span>تست ایمیل</span>
              </button>
            </div>
          </div>
        )}

        {/* Database Settings */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 space-x-reverse text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">هشدار:</span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                تغییر تنظیمات پایگاه داده ممکن است منجر به قطع اتصال سیستم شود. لطفاً با احتیاط عمل کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  آدرس سرور
                </label>
                <input
                  type="text"
                  value={databaseSettings.host}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, host: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  پورت
                </label>
                <input
                  type="number"
                  value={databaseSettings.port}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  نام پایگاه داده
                </label>
                <input
                  type="text"
                  value={databaseSettings.database}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, database: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  نام کاربری
                </label>
                <input
                  type="text"
                  value={databaseSettings.username}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  رمز عبور
                </label>
                <input
                  type="password"
                  value={databaseSettings.password}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  تعداد اتصالات همزمان
                </label>
                <input
                  type="number"
                  value={databaseSettings.connectionPool}
                  onChange={(e) => setDatabaseSettings(prev => ({ ...prev, connectionPool: parseInt(e.target.value) }))}
                  className="input-field"
                  min="1"
                />
              </div>
            </div>

            <div className="bg-soft/30 rounded-2xl p-6">
              <h3 className="font-semibold text-text-heading mb-4">تنظیمات پشتیبان‌گیری</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={databaseSettings.backupEnabled}
                    onChange={(e) => setDatabaseSettings(prev => ({ ...prev, backupEnabled: e.target.checked }))}
                    className="rounded border-accent/30 text-primary focus:ring-primary"
                  />
                  <span className="text-text-body">فعال‌سازی پشتیبان‌گیری خودکار</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">
                    دوره پشتیبان‌گیری
                  </label>
                  <select
                    value={databaseSettings.backupFrequency}
                    onChange={(e) => setDatabaseSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                    className="input-field"
                  >
                    <option value="hourly">هر ساعت</option>
                    <option value="daily">روزانه</option>
                    <option value="weekly">هفتگی</option>
                    <option value="monthly">ماهانه</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <button 
                onClick={handleTestConnection}
                className="btn-secondary flex items-center space-x-2 space-x-reverse"
              >
                <Database className="h-5 w-5" />
                <span>تست اتصال</span>
              </button>
              <button className="btn-primary flex items-center space-x-2 space-x-reverse">
                <RefreshCw className="h-5 w-5" />
                <span>بازنشانی اتصال</span>
              </button>
            </div>
          </div>
        )}

        {/* System Info */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-soft/30">
                <h3 className="font-semibold text-text-heading mb-4">اطلاعات سیستم</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>نسخه سیستم:</span>
                    <span className="font-medium">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>آخرین به‌روزرسانی:</span>
                    <span className="font-medium">۱۴۰۳/۰۹/۱۵</span>
                  </div>
                  <div className="flex justify-between">
                    <span>زمان راه‌اندازی:</span>
                    <span className="font-medium">۷ روز، ۱۲ ساعت</span>
                  </div>
                  <div className="flex justify-between">
                    <span>محیط:</span>
                    <span className="font-medium text-green-600">Production</span>
                  </div>
                </div>
              </div>

              <div className="card bg-soft/30">
                <h3 className="font-semibold text-text-heading mb-4">منابع سیستم</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>استفاده از CPU</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>استفاده از RAM</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
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

            <div className="card bg-soft/30">
              <h3 className="font-semibold text-text-heading mb-4">عملیات سیستم</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse">
                  <RefreshCw className="h-5 w-5" />
                  <span>راه‌اندازی مجدد</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse">
                  <Database className="h-5 w-5" />
                  <span>پشتیبان‌گیری</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse">
                  <CheckCircle className="h-5 w-5" />
                  <span>بررسی سلامت</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;