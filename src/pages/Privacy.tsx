import React from 'react';
import { Shield, Eye, Lock, Database, FileText, AlertTriangle } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">حریم خصوصی</h1>
          <p className="text-xl opacity-90">
            محافظت از اطلاعات شخصی شما برای ما اولویت است
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">مقدمه</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                سیستم آزمون‌گیری آنلاین متعلق به Zero Team متعهد به حفاظت از حریم خصوصی و اطلاعات شخصی کاربران خود است. 
                این سند شامل تمام اطلاعات مربوط به نحوه جمع‌آوری، استفاده، ذخیره‌سازی و محافظت از داده‌های شما می‌باشد.
              </p>
            </div>

            {/* Data Collection */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">جمع‌آوری اطلاعات</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border-r-4 border-primary pr-4">
                  <h3 className="font-semibold text-lg mb-2">اطلاعات شخصی</h3>
                  <p className="text-gray-600 mb-3">
                    ما اطلاعات زیر را از شما جمع‌آوری می‌کنیم:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>نام و نام خانوادگی</li>
                    <li>آدرس ایمیل</li>
                    <li>شماره تلفن (اختیاری)</li>
                    <li>اطلاعات تحصیلی</li>
                    <li>عکس پروفایل (اختیاری)</li>
                  </ul>
                </div>

                <div className="border-r-4 border-secondary pr-4">
                  <h3 className="font-semibold text-lg mb-2">اطلاعات آزمون</h3>
                  <p className="text-gray-600 mb-3">
                    در زمان شرکت در آزمون، اطلاعات زیر ثبت می‌شود:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>پاسخ‌های ارائه شده</li>
                    <li>زمان شروع و پایان آزمون</li>
                    <li>مدت زمان صرف شده برای هر سوال</li>
                    <li>نتایج و نمرات</li>
                    <li>تاریخ و زمان شرکت</li>
                  </ul>
                </div>

                <div className="border-r-4 border-accent pr-4">
                  <h3 className="font-semibold text-lg mb-2">اطلاعات فنی</h3>
                  <p className="text-gray-600 mb-3">
                    برای بهبود خدمات، اطلاعات فنی زیر جمع‌آوری می‌شود:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>آدرس IP</li>
                    <li>نوع مرورگر و سیستم عامل</li>
                    <li>تاریخ و زمان بازدید</li>
                    <li>صفحات بازدید شده</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Usage */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">استفاده از اطلاعات</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">اهداف اصلی استفاده:</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• ارائه خدمات آزمون‌گیری آنلاین</li>
                    <li>• محاسبه و ارائه نتایج آزمون‌ها</li>
                    <li>• ایجاد و مدیریت حساب کاربری</li>
                    <li>• ارتباط با کاربران (اطلاع‌رسانی، پشتیبانی)</li>
                    <li>• بهبود کیفیت خدمات</li>
                    <li>• رعایت قوانین و مقررات</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-red-800">⚠️ موارد عدم استفاده:</h3>
                  <ul className="text-red-700 space-y-1">
                    <li>• فروش اطلاعات به شرکت‌های سوم</li>
                    <li>• ارسال ایمیل‌های تبلیغاتی بدون اجازه</li>
                    <li>• استفاده برای اهداف غیرمرتبط با آموزش</li>
                    <li>• اشتراک‌گذاری با نهادهای غیرمجاز</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">امنیت اطلاعات</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-green-800">تدابیر فنی:</h3>
                    <ul className="text-green-700 space-y-1">
                      <li>• رمزگذاری SSL/TLS</li>
                      <li>• رمزگذاری پایگاه داده</li>
                      <li>• فایروال پیشرفته</li>
                      <li>• پشتیبان‌گیری منظم</li>
                      <li>• سیستم تشخیص نفوذ</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-blue-800">تدابیر اداری:</h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• محدودیت دسترسی کارمندان</li>
                      <li>• آموزش امنیت سایبری</li>
                      <li>• ممیزی منظم سیستم‌ها</li>
                      <li>• قوانین سخت‌گیرانه</li>
                      <li>• نظارت مستمر</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-yellow-800">نکات مهم:</h3>
                  <p className="text-yellow-700">
                    علی‌رغم تمام تدابیر امنیتی، هیچ سیستمی ۱۰۰٪ امن نیست. در صورت بروز هرگونه نقض امنیت، 
                    فوراً کاربران را مطلع خواهیم کرد.
                  </p>
                </div>
              </div>
            </div>

            {/* User Rights */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">حقوق کاربران</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">حق دسترسی:</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• مشاهده اطلاعات شخصی ذخیره شده</li>
                      <li>• درخواست کپی از داده‌های خود</li>
                      <li>• اطلاع از نحوه استفاده از اطلاعات</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">حق تصحیح:</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• اصلاح اطلاعات نادرست</li>
                      <li>• به‌روزرسانی اطلاعات</li>
                      <li>• تکمیل اطلاعات ناقص</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">حق حذف:</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• درخواست حذف اطلاعات شخصی</li>
                      <li>• حذف حساب کاربری</li>
                      <li>• انصراف از خدمات</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">حق اعتراض:</h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• اعتراض به پردازش اطلاعات</li>
                      <li>• درخواست محدودیت استفاده</li>
                      <li>• شکایت به مراجع قانونی</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="card mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">کوکی‌ها و ردیابی</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ما از کوکی‌ها و فناوری‌های مشابه برای بهبود تجربه کاربری استفاده می‌کنیم. انواع کوکی‌های مورد استفاده:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">کوکی‌های ضروری</h3>
                    <p className="text-sm text-gray-600">
                      برای عملکرد اصلی سایت و امنیت ضروری هستند.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">کوکی‌های عملکردی</h3>
                    <p className="text-sm text-gray-600">
                      برای به‌خاطرسپاری تنظیمات و ترجیحات شما.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">کوکی‌های تحلیلی</h3>
                    <p className="text-sm text-gray-600">
                      برای تجزیه و تحلیل استفاده از سایت و بهبود خدمات.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact for Privacy */}
            <div className="card bg-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تماس برای موضوعات حریم خصوصی</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">مسئول حفاظت از داده‌ها:</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>ایمیل: privacy@examsite.com</p>
                    <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                    <p>آدرس: تهران، خیابان انقلاب، پلاک ۱۲۳</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">زمان پاسخ‌دهی:</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>درخواست‌های عادی: ۷ روز کاری</p>
                    <p>موارد اضطراری: ۲۴ ساعت</p>
                    <p>شکایات: ۳۰ روز کاری</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">
                  <strong>آخرین به‌روزرسانی:</strong> ۱۵ آذر ۱۴۰۳
                  <br />
                  <strong>نسخه:</strong> ۱.۲
                  <br />
                  ما حق تغییر این سیاست حریم خصوصی را محفوظ می‌داریم. تغییرات مهم از طریق ایمیل اطلاع‌رسانی خواهد شد.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;