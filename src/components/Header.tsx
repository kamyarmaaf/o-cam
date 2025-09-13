import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', label: 'خانه' },
    { path: '/about', label: 'درباره ما' },
    { path: '/guide', label: 'راهنما' },
    { path: '/contact', label: 'تماس' },
    { path: '/support', label: 'پشتیبانی' }
  ];

  return (
    <>
      <header 
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg' 
            : 'bg-white/90 backdrop-blur-lg shadow-soft'
        }`}
        style={{
          borderRadius: '50px',
          height: '70px'
        }}
      >
        <div className="container mx-auto px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo - Right Side */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 space-x-reverse group transition-transform duration-300 hover:scale-105"
              onClick={closeMenu}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  سیستم آزمون‌گیری
                </span>
                <div className="text-xs text-text-body/60 font-medium">آنلاین و هوشمند</div>
              </div>
            </Link>
            
            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-6 space-x-reverse">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 font-medium transition-all duration-300 group ${
                    isActivePath(item.path)
                      ? 'text-primary'
                      : 'text-text-body hover:text-primary'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className={`absolute inset-0 bg-primary/10 rounded-2xl transition-all duration-300 ${
                    isActivePath(item.path) 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                  }`}></div>
                  {isActivePath(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gradient-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons - Left Side */}
            <div className="hidden lg:flex items-center space-x-3 space-x-reverse">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-soft/50 hover:bg-soft/80 rounded-2xl transition-all duration-300 group"
                  >
                    <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-text-heading text-sm">{user?.name}</div>
                      <div className="text-xs text-text-body/60">
                        {user?.role === 'teacher' ? 'مدرس' : 'دانشجو'}
                      </div>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-text-body hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-sm">خروج</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 space-x-reverse bg-gradient-primary text-white px-4 py-2 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
                  >
                    <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>ورود</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-2xl hover:bg-soft/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-text-body" />
              ) : (
                <Menu className="h-5 w-5 text-text-body" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 mt-2 transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mx-4 bg-white/95 backdrop-blur-xl border border-accent/20 rounded-3xl shadow-lg">
            <div className="p-4">
              {/* Mobile Navigation */}
              <nav className="space-y-2 mb-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`block px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      isActivePath(item.path)
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-text-body hover:bg-soft/50 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="space-y-2 pt-3 border-t border-accent/20">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center space-x-3 space-x-reverse p-3 bg-soft/50 rounded-2xl"
                    >
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-text-heading">{user?.name}</div>
                        <div className="text-sm text-text-body/60">
                          {user?.role === 'teacher' ? 'مدرس' : 'دانشجو'}
                        </div>
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 space-x-reverse p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">خروج از سیستم</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center space-x-2 space-x-reverse bg-gradient-primary text-white p-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>ورود به سیستم</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-24"></div>
    </>
  );
};

export default Header;