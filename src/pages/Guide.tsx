import React from 'react';
import { BookOpen, User, Play, Award, Settings, Shield } from 'lucide-react';

const Guide: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">راهنمای استفاده</h1>
          <p className="text-xl opacity-90">
            آموزش گام به گام استفاده از سیستم آزمون‌گیری
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Getting Started */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">شروع کار</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-lg mb-2">۱. ثبت نام در سیستم</h3>
                  <p className="text-gray-600 mb-3">
                    برای شروع کار، ابتدا باید در سیستم ثبت نام کرده و حساب کاربری خود را فعال کنید.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>روی دکمه "ثبت نام" کلیک کنید</li>
                    <li>اطلاعات شخصی خود را وارد کنید</li>
                    <li>ایمیل فعال‌سازی را بررسی کرده و روی لینک کلیک کنید</li>
                    <li>با نام کاربری و رمز عبور وارد سیستم شوید</li>
                  </ul>
                </div>

                <div className="border-r-4 border-secondary pr-4">
                  <h3 className="font-semibold text-lg mb-2">۲. تکمیل پروفایل</h3>
                  <p className="text-gray-600 mb-3">
                    پس از ورود به سیستم، پروفایل خود را تکمیل کنید تا بتوانید از تمام امکانات استفاده کنید.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>عکس پروفایل خود را آپلود کنید</li>
                    <li>اطلاعات تحصیلی را وارد کنید</li>
                    <li>شماره تماس و آدرس را اضافه کنید</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* For Students */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">راهنمای دانشجویان</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-lg mb-2">شرکت در آزمون</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">قبل از آزمون:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• اتصال اینترنت پایدار داشته باشید</li>
                        <li>• مرورگر خود را به‌روزرسانی کنید</li>
                        <li>• محیط آرام برای آزمون آماده کنید</li>
                        <li>• کارت دانشجویی یا مدارک شناسایی آماده کنید</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">حین آزمون:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• سوالات را با دقت بخوانید</li>
                        <li>• از تایمر آزمون آگاه باشید</li>
                        <li>• پاسخ‌ها را ذخیره کنید</li>
                        <li>• از بستن مرورگر خودداری کنید</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-r-4 border-secondary pr-4">
                  <h3 className="font-semibold text-lg mb-2">مشاهده نتایج</h3>
                  <p className="text-gray-600 mb-3">
                    پس از اتمام آزمون، می‌توانید نتایج خود را مشاهده کنید:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>به بخش "نتایج آزمون‌ها" مراجعه کنید</li>
                    <li>نمره کل و جزئیات هر بخش را ببینید</li>
                    <li>پاسخ‌نامه و پاسخ‌های صحیح را بررسی کنید</li>
                    <li>در صورت نیاز، فایل PDF نتیجه را دانلود کنید</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Tips */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">نکات فنی</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-primary">مرورگرهای پشتیبانی شده:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Google Chrome (نسخه ۸۰ به بالا)</li>
                    <li>• Mozilla Firefox (نسخه ۷۵ به بالا)</li>
                    <li>• Safari (نسخه ۱۳ به بالا)</li>
                    <li>• Microsoft Edge (نسخه ۸۰ به بالا)</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-primary">حداقل سیستم مورد نیاز:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• سرعت اینترنت: ۱ مگابیت بر ثانیه</li>
                    <li>• رم: ۲ گیگابایت</li>
                    <li>• فضای خالی: ۱۰۰ مگابایت</li>
                    <li>• دوربین وب (در صورت نیاز)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Guidelines */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">اصول امنیتی</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 text-yellow-800">⚠️ نکات مهم امنیتی</h3>
                  <ul className="text-yellow-700 space-y-2">
                    <li>• هرگز رمز عبور خود را با دیگران به اشتراک نگذارید</li>
                    <li>• از کامپیوترهای عمومی برای ورود به سیستم استفاده نکنید</li>
                    <li>• پس از استفاده، حتماً از سیستم خارج شوید</li>
                    <li>• در صورت مشکوک بودن فعالیت، بلافاصله اطلاع دهید</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 text-green-800">✅ قوانین آزمون</h3>
                  <ul className="text-green-700 space-y-2">
                    <li>• تقلب در آزمون ممنوع است و منجر به لغو نتیجه می‌شود</li>
                    <li>• استفاده از منابع خارجی بدون اجازه مجاز نیست</li>
                    <li>• زمان آزمون محدود است و قابل تمدید نیست</li>
                    <li>• در صورت قطع اتصال، سریعاً مجدداً وارد شوید</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">رفع مشکلات رایج</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold mb-2">نمی‌توانم وارد سیستم شوم</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• بررسی کنید که نام کاربری و رمز عبور را صحیح وارد کرده‌اید</li>
                    <li>• از فعال بودن Caps Lock اطمینان حاصل کنید</li>
                    <li>• در صورت فراموشی رمز عبور، از گزینه "فراموشی رمز عبور" استفاده کنید</li>
                  </ul>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold mb-2">آزمون قطع شد</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• سریعاً صفحه را رفرش کرده و مجدداً وارد شوید</li>
                    <li>• پاسخ‌های قبلی به طور خودکار ذخیره شده‌اند</li>
                    <li>• در صورت ادامه مشکل، با پشتیبانی تماس بگیرید</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">مشکل در نمایش صفحه</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• کش مرورگر خود را پاک کنید</li>
                    <li>• از مرورگر جدیدتری استفاده کنید</li>
                    <li>• JavaScript را در مرورگر فعال کنید</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;