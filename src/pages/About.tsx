import React from 'react';
import { Target, Users, Star, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">درباره ما</h1>
          <p className="text-xl opacity-90">
            تیمی مجرب در خدمت آموزش و تکنولوژی
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Mission */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">هدف ما</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                هدف ما ایجاد یک پلتفرم آزمون‌گیری آنلاین مدرن، امن و کاربرپسند است که به دانشجویان و مربیان امکان 
                برگزاری و شرکت در آزمون‌های آنلاین را با بالاترین کیفیت و امنیت فراهم کند. ما معتقدیم که تکنولوژی 
                باید در خدمت بهبود فرآیند یادگیری و ارزیابی باشد.
              </p>
            </div>

            {/* About ZCa Group */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900"> Zero Team</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Zero Team یک تیم متخصص در زمینه توسعه نرم‌افزارهای آموزشی و سیستم‌های مدیریت یادگیری است. 
                ما با سال‌ها تجربه در حوزه تکنولوژی آموزش، این پلتفرم را طراحی و توسعه داده‌ایم تا نیازهای 
                مدرن آموزش عالی را پاسخ دهد.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">5+</span>
                  </div>
                  <p className="font-semibold">سال تجربه</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">100+</span>
                  </div>
                  <p className="font-semibold">پروژه موفق</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold">24/7</span>
                  </div>
                  <p className="font-semibold">پشتیبانی</p>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">مخاطبان ما</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-lg mb-2">دانشجویان</h3>
                  <p className="text-gray-600">
                    دانشجویان دانشگاه‌ها و مؤسسات آموزشی که به دنبال تجربه‌ای بهتر از آزمون‌گیری آنلاین هستند.
                  </p>
                </div>
                <div className="border-r-4 border-secondary pr-4">
                  <h3 className="font-semibold text-lg mb-2">مربیان و اساتید</h3>
                  <p className="text-gray-600">
                    اساتید و مربیانی که می‌خواهند آزمون‌های خود را به صورت آنلاین و با امکانات پیشرفته برگزار کنند.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">ارزش‌های ما</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">کیفیت</h3>
                  <p className="text-gray-600">
                    ارائه بالاترین کیفیت در طراحی، توسعه و پشتیبانی سیستم
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">امنیت</h3>
                  <p className="text-gray-600">
                    حفاظت کامل از اطلاعات کاربران و محتوای آزمون‌ها
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">سادگی استفاده</h3>
                  <p className="text-gray-600">
                    طراحی رابط کاربری ساده و قابل فهم برای همه سطوح کاربران
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-primary">نوآوری</h3>
                  <p className="text-gray-600">
                    استفاده از جدیدترین تکنولوژی‌ها و روش‌های آموزشی
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;