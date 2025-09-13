import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, Shield, ArrowLeft, Play, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Chatbot from '../components/Chatbot';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'بانک سوال جامع',
      description: 'هزاران سوال در رشته‌های مختلف',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'مدیریت هوشمند',
      description: 'سیستم مدیریت کاربران پیشرفته',
      color: 'from-primary to-secondary'
    },
    {
      icon: Award,
      title: 'ارزیابی دقیق',
      description: 'سیستم نمره‌دهی و گزارش‌گیری',
      color: 'from-secondary to-accent'
    },
    {
      icon: Shield,
      title: 'امنیت بالا',
      description: 'حفاظت کامل از اطلاعات',
      color: 'from-blue-600 to-blue-700'
    }
  ];

  const stats = [
    { number: '10K+', label: 'دانشجو فعال' },
    { number: '500+', label: 'مدرس' },
    { number: '50K+', label: 'آزمون برگزار شده' },
    { number: '98%', label: 'رضایت کاربران' }
  ];

  const testimonials = [
    {
      name: 'دکتر احمد محمدی',
      role: 'استاد دانشگاه',
      text: 'سیستمی عالی برای برگزاری آزمون‌های آنلاین',
      avatar: '👨‍🏫'
    },
    {
      name: 'سارا احمدی',
      role: 'دانشجوی کارشناسی',
      text: 'رابط کاربری بسیار ساده و کاربردی',
      avatar: '👩‍🎓'
    },
    {
      name: 'علی رضایی',
      role: 'دانشجوی ارشد',
      text: 'امکانات فوق‌العاده برای یادگیری',
      avatar: '👨‍🎓'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center justify-center relative">
        {/* Floating Elements */}
        <div className="floating-element top-20 right-20 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="floating-element top-40 left-32 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="floating-element bottom-32 right-40 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Content */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              مهارت‌های خود را توسعه دهید
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed text-white">
              پلتفرمی مدرن و جامع برای آزمون‌گیری آنلاین و یادگیری مؤثر
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary inline-flex items-center justify-center space-x-2 space-x-reverse">
                  <span>ورود به پنل کاربری</span>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              ) : (
                <Link to="/login" className="btn-primary inline-flex items-center justify-center space-x-2 space-x-reverse">
                  <span>ورود به سیستم</span>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              )}
              <Link to="/guide" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-primary transition-all duration-300 inline-flex items-center justify-center space-x-2 space-x-reverse">
                <Play className="h-5 w-5" />
                <span>مشاهده دمو</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-white">{stat.number}</div>
                  <div className="text-sm md:text-base opacity-80 text-white">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-heading mb-6">
              چرا ما را انتخاب کنید؟
            </h2>
            <p className="text-xl text-text-body max-w-2xl mx-auto">
              ویژگی‌های منحصر به فرد که تجربه یادگیری شما را متحول می‌کند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="card hover:shadow-hero transition-all duration-500 transform group-hover:scale-105 h-64 flex flex-col">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-text-heading mb-4 text-center">{feature.title}</h3>
                    <p className="text-text-body text-center leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-heading mb-6">
              نظرات کاربران
            </h2>
            <p className="text-xl text-text-body max-w-2xl mx-auto">
              تجربه کاربران ما از سیستم آزمون‌گیری
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="text-6xl mb-4">{testimonial.avatar}</div>
                <p className="text-text-body mb-6 italic">"{testimonial.text}"</p>
                <h4 className="font-bold text-text-heading">{testimonial.name}</h4>
                <p className="text-sm text-text-body/70">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            آماده شروع هستید؟
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            همین حالا عضو جامعه بزرگ یادگیرندگان ما شوید و تجربه‌ای نو از آزمون‌گیری آنلاین داشته باشید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300">
                ورود به پنل کاربری
              </Link>
            ) : (
              <Link to="/login" className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold hover:shadow-card transform hover:scale-105 transition-all duration-300">
                ورود به سیستم
              </Link>
            )}
            <Link to="/contact" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-primary transition-all duration-300">
              تماس با ما
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Home;