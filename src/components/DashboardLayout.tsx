import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Award, 
  User, 
  Menu, 
  X, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Users,
  FileText,
  MessageSquare,
  FolderOpen,
  GraduationCap,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288); // 72 * 4 = 288px (w-72)
  const { user, logout } = useAuth();
  const location = useLocation();

  const studentNavItems = [
    { path: '/', icon: ArrowRight, label: 'بازگشت به خانه', exact: true, isExternal: true },
    { path: '/dashboard', icon: Home, label: 'داشبورد من', exact: true },
    { path: '/dashboard/exams', icon: BookOpen, label: 'آزمون‌های فعال' },
    { path: '/dashboard/scores', icon: Award, label: 'نمرات من' },
    { path: '/dashboard/profile', icon: User, label: 'پروفایل کاربری' }
  ];

  const teacherNavItems = [
    { path: '/', icon: ArrowRight, label: 'بازگشت به خانه', exact: true, isExternal: true },
    { path: '/dashboard', icon: Home, label: 'داشبورد من', exact: true },
    { 
      path: '/dashboard/exams', 
      icon: BookOpen, 
      label: 'مدیریت آزمون‌ها',
      submenu: [
        { path: '/dashboard/exams', label: 'لیست آزمون‌ها' },
        { path: '/dashboard/exam/create', label: 'ایجاد آزمون جدید', icon: Plus }
      ]
    },
    { path: '/dashboard/students', icon: Users, label: 'مدیریت دانشجویان' },
    { path: '/dashboard/grading', icon: FileText, label: 'تصحیح و نمره‌دهی' },
    { path: '/dashboard/reports', icon: BarChart3, label: 'گزارشات و آنالیز' },
    { path: '/dashboard/resources', icon: FolderOpen, label: 'منابع آموزشی' },
    { path: '/dashboard/messages', icon: MessageSquare, label: 'پیام‌ها و اطلاع‌رسانی' },
    { path: '/dashboard/profile', icon: Settings, label: 'پروفایل کاربری' }
  ];

  const navItems = user?.role === 'teacher' ? teacherNavItems : studentNavItems;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft via-white to-soft flex">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 bg-white/80 backdrop-blur-lg shadow-card transform ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-l border-white/20 resizable-sidebar`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Resize Handle */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 hover:bg-primary/40 cursor-col-resize transition-colors hidden lg:block"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = sidebarWidth;
            
            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth - (e.clientX - startX);
              if (newWidth >= 200 && newWidth <= 400) {
                setSidebarWidth(newWidth);
              }
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/20">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
              {user?.role === 'teacher' ? (
                <GraduationCap className="h-6 w-6 text-white" />
              ) : (
                <BookOpen className="h-6 w-6 text-white" />
              )}
            </div>
            <span className="text-lg font-bold gradient-text">
              {user?.role === 'teacher' ? 'پنل مدرس' : 'پنل دانشجو'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-text-body hover:text-primary hover:bg-soft/50 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="card-gradient">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-text-heading">{user?.name}</p>
                <p className="text-sm text-text-body/70">
                  {user?.role === 'teacher' ? '🎓 مدرس' : '👨‍🎓 دانشجو'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.isExternal ? (
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-4 space-x-reverse px-4 py-4 rounded-2xl transition-all duration-300 group text-text-body hover:bg-soft/50 hover:text-primary border-b border-accent/20 mb-2"
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-4 space-x-reverse px-4 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive(item.path, item.exact)
                      ? 'bg-gradient-primary text-white shadow-card'
                      : 'text-text-body hover:bg-soft/50 hover:text-primary'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive(item.path, item.exact) ? 'text-white' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )}
              
              {/* Submenu for teacher exam management */}
              {item.submenu && user?.role === 'teacher' && isActive('/dashboard/exam') && (
                <div className="mr-8 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 space-x-reverse px-4 py-2 rounded-xl transition-all duration-300 text-sm ${
                        location.pathname === subItem.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-text-body/70 hover:bg-soft/30 hover:text-primary'
                      }`}
                    >
                      {subItem.icon && <subItem.icon className="h-4 w-4" />}
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 space-x-reverse w-full px-4 py-4 text-text-body hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all duration-300 group"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">خروج از سیستم</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300" style={{ center: `${sidebarWidth}px` }}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-lg shadow-soft border-b border-white/20 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-text-body hover:text-primary hover:bg-soft/50 transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
                {user?.role === 'teacher' ? (
                  <GraduationCap className="h-5 w-5 text-white" />
                ) : (
                  <BookOpen className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="font-bold gradient-text">
                {user?.role === 'teacher' ? 'پنل مدرس' : 'پنل دانشجو'}
              </span>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;