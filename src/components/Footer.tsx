import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, BookOpen, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 space-x-reverse mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">سیستم آزمون‌گیری آنلاین</span>
            </div>
            <p className="text-text-body text-sm leading-relaxed mb-6 max-w-md">
              پلتفرمی مدرن و امن برای برگزاری آزمون‌های آنلاین با هدف ارائه بهترین تجربه یادگیری و ارزیابی برای دانشجویان و مربیان.
            </p>
            <div className="flex items-center space-x-6 space-x-reverse text-sm text-text-body/70">
              <div className="flex items-center space-x-2 space-x-reverse hover:text-primary transition-colors cursor-pointer">
                <Mail className="h-4 w-4" />
                <span>info@examsite.com</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse hover:text-primary transition-colors cursor-pointer">
                <Phone className="h-4 w-4" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-text-heading mb-6">لینک‌های مفید</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>درباره ما</span>
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>راهنمای استفاده</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>پشتیبانی</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>حریم خصوصی</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-text-heading mb-6">پشتیبانی</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>تماس با ما</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>سوالات متداول</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>آموزش‌ها</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-text-body hover:text-primary transition-colors flex items-center space-x-2 space-x-reverse">
                  <span>گزارش باگ</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-text-body/70 mb-4 md:mb-0 flex items-center space-x-2 space-x-reverse">
            <span>© ۱۴۰۳ تمامی حقوق محفوظ است. ساخته‌شده با</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>توسط</span>
            <span className="font-semibold gradient-text">ZCa Group</span>
          </div>
          <div className="flex space-x-6 space-x-reverse text-sm">
            <Link to="/privacy" className="text-text-body/70 hover:text-primary transition-colors">
              حریم خصوصی
            </Link>
            <span className="text-text-body/30">|</span>
            <Link to="/terms" className="text-text-body/70 hover:text-primary transition-colors">
              شرایط استفاده
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;