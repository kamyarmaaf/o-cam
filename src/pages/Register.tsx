import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند');
      return;
    }

    const success = await register(formData.name, formData.email, formData.password, formData.role);
    if (success) {
      navigate('/');
    } else {
      setError('خطا در ثبت نام. لطفاً دوباره تلاش کنید');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'ضعیف';
    if (passwordStrength <= 2) return 'متوسط';
    if (passwordStrength <= 3) return 'خوب';
    return 'عالی';
  };

  return (
    <div className="min-h-screen educational-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Educational Elements */}
        <div className="educational-element pencil top-16 right-24 animate-sway" style={{ animationDelay: '0.5s' }}>✏️</div>
        <div className="educational-element book top-28 left-20 animate-float" style={{ animationDelay: '1.2s' }}>📚</div>
        <div className="educational-element calculator top-52 right-28 animate-bounce-slow" style={{ animationDelay: '2.1s' }}>🧮</div>
        <div className="educational-element pencil bottom-44 left-16 animate-sway" style={{ animationDelay: '3.3s' }}>🖊️</div>
        <div className="educational-element book bottom-16 right-20 animate-float" style={{ animationDelay: '4.2s' }}>📖</div>
        <div className="educational-element top-12 left-1/2 animate-rotate" style={{ animationDelay: '0.8s' }}>📐</div>
        <div className="educational-element bottom-56 left-1/3 animate-bounce-slow" style={{ animationDelay: '2.7s' }}>✂️</div>
        <div className="educational-element top-1/3 right-12 animate-sway" style={{ animationDelay: '1.8s' }}>📏</div>
        <div className="educational-element bottom-1/3 right-1/4 animate-float" style={{ animationDelay: '3.8s' }}>🖍️</div>
        <div className="educational-element top-2/3 left-12 animate-bounce-slow" style={{ animationDelay: '0.3s' }}>📝</div>
        <div className="educational-element top-1/4 left-1/4 animate-sway" style={{ animationDelay: '4.8s' }}>🎒</div>
        <div className="educational-element bottom-1/4 left-1/2 animate-float" style={{ animationDelay: '3.1s' }}>📊</div>
        <div className="educational-element top-3/4 right-1/3 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>🖇️</div>
        <div className="educational-element bottom-2/3 left-2/3 animate-sway" style={{ animationDelay: '2.3s' }}>📌</div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-1/3 w-14 h-14 border-2 border-white/10 rounded-full animate-rotate" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-28 left-1/4 w-10 h-10 border-2 border-white/10 rotate-45 animate-bounce-slow" style={{ animationDelay: '2.9s' }}></div>
        <div className="absolute top-1/2 right-16 w-18 h-18 border-2 border-white/10 rounded-lg animate-sway" style={{ animationDelay: '1.9s' }}></div>
        <div className="absolute top-1/4 left-1/3 w-8 h-8 border-2 border-white/10 rounded-full animate-float" style={{ animationDelay: '3.4s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">عضویت در سیستم</h1>
            <p className="text-white/80">حساب کاربری جدید ایجاد کنید</p>
          </div>

          {/* Glass Card */}
          <div className="glass-effect rounded-3xl p-8 shadow-hero">
            
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
                <div className="flex items-center text-red-100">
                  <AlertCircle className="h-5 w-5 ml-2" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 backdrop-blur-sm"
                  placeholder="نام و نام خانوادگی"
                  required
                />
              </div>

              {/* Email Field */}
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
                  placeholder="ایمیل"
                  required
                />
              </div>

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

              {/* Password Field */}
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
                  placeholder="رمز عبور"
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
                
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-white/70">قدرت رمز عبور:</span>
                      <span className={`font-medium ${
                        passwordStrength <= 1 ? 'text-red-300' :
                        passwordStrength <= 2 ? 'text-yellow-300' :
                        passwordStrength <= 3 ? 'text-blue-300' : 'text-green-300'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-12 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 backdrop-blur-sm"
                  placeholder="تکرار رمز عبور"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-4 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                  )}
                </button>
                
                {formData.confirmPassword && (
                  <div className="mt-3 flex items-center">
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center text-green-300">
                        <CheckCircle className="h-4 w-4 ml-1" />
                        <span className="text-xs">رمز عبور مطابقت دارد</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-300">
                        <AlertCircle className="h-4 w-4 ml-1" />
                        <span className="text-xs">رمز عبور مطابقت ندارد</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="rounded border-white/30 bg-white/10 text-white focus:ring-white/30 focus:ring-offset-0 ml-2" 
                  required
                />
                <label htmlFor="terms" className="text-white/80 text-sm">
                  با{' '}
                  <Link to="/privacy" className="text-white font-semibold hover:text-white/80 transition-colors underline">
                    قوانین و مقررات
                  </Link>
                  {' '}موافقم
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-primary font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-hero"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>در حال ثبت نام...</span>
                  </div>
                ) : (
                  'ایجاد حساب کاربری'
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                قبلاً ثبت نام کرده‌اید؟{' '}
                <Link to="/login" className="text-white font-semibold hover:text-white/80 transition-colors">
                  وارد شوید
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;