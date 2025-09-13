import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, Bug } from 'lucide-react';

const Support: React.FC = () => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "چگونه می‌توانم رمز عبور خود را بازیابی کنم؟",
      answer: "برای بازیابی رمز عبور، در صفحه ورود روی گزینه 'فراموشی رمز عبور' کلیک کنید. سپس ایمیل خود را وارد کرده و لینک بازیابی را دریافت کنید."
    },
    {
      question: "چرا نمی‌توانم وارد آزمون شوم؟",
      answer: "دلایل مختلفی ممکن است وجود داشته باشد: زمان آزمون هنوز شروع نشده، آزمون به پایان رسیده، یا اینکه شما برای این آزمون ثبت نام نکرده‌اید. لطفاً با پشتیبانی تماس بگیرید."
    },
    {
      question: "آیا می‌توانم پس از ارسال پاسخ، آن را تغییر دهم؟",
      answer: "بله، تا زمانی که آزمون به پایان نرسیده، می‌توانید پاسخ‌های خود را تغییر دهید. فقط کافی است روی سوال مورد نظر کلیک کرده و پاسخ جدید را انتخاب کنید."
    },
    {
      question: "اگر اتصال اینترنت من قطع شود چه می‌شود؟",
      answer: "نگران نباشید. پاسخ‌های شما به طور خودکار ذخیره می‌شوند. پس از اتصال مجدد، سریعاً وارد سیستم شده و آزمون را ادامه دهید."
    },
    {
      question: "چگونه می‌توانم نتایج آزمون‌هایم را مشاهده کنم؟",
      answer: "پس از ورود به سیستم، به بخش 'نتایج آزمون‌ها' مراجعه کنید. در آنجا تمام نتایج آزمون‌های شما به همراه جزئیات نمایش داده می‌شود."
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "چت آنلاین",
      description: "پشتیبانی فوری از طریق چت",
      status: "آنلاین",
      statusColor: "text-green-600",
      action: "شروع چت"
    },
    {
      icon: Phone,
      title: "تماس تلفنی",
      description: "پشتیبانی از طریق تماس مستقیم",
      status: "۰۲۱-۱۲۳۴۵۶۷۸",
      statusColor: "text-blue-600",
      action: "تماس بگیرید"
    },
    {
      icon: Mail,
      title: "پشتیبانی ایمیل",
      description: "ارسال تیکت پشتیبانی",
      status: "پاسخ در کمتر از ۲۴ ساعت",
      statusColor: "text-purple-600",
      action: "ارسال ایمیل"
    }
  ];

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">پشتیبانی</h1>
          <p className="text-xl opacity-90">
            ما اینجا هستیم تا به شما کمک کنیم
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Support Channels */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">راه‌های تماس با پشتیبانی</h2>
              <p className="text-lg text-gray-600">
                برای دریافت کمک، یکی از راه‌های زیر را انتخاب کنید
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportChannels.map((channel, index) => (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <channel.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{channel.title}</h3>
                  <p className="text-gray-600 mb-4">{channel.description}</p>
                  <div className={`${channel.statusColor} font-medium mb-4`}>
                    {channel.status}
                  </div>
                  <button className="btn-primary w-full">
                    {channel.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Support Hours */}
          <div className="card bg-soft mb-16">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center ml-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ساعات پشتیبانی</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">پشتیبانی تلفنی</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>شنبه تا چهارشنبه:</span>
                    <span className="font-medium">۸:۰۰ - ۱۷:۰۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span>پنج‌شنبه:</span>
                    <span className="font-medium">۸:۰۰ - ۱۳:۰۰</span>
                  </div>
                  <div className="flex justify-between">
                    <span>جمعه:</span>
                    <span className="font-medium text-red-600">تعطیل</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">پشتیبانی آنلاین</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>چت آنلاین:</span>
                    <span className="font-medium text-green-600">۲۴/۷</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ایمیل:</span>
                    <span className="font-medium">۲۴/۷</span>
                  </div>
                  <div className="flex justify-between">
                    <span>زمان پاسخ:</span>
                    <span className="font-medium">کمتر از ۲۴ ساعت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">سوالات متداول</h2>
              <p className="text-lg text-gray-600">
                پاسخ سوال شما ممکن است در اینجا باشد
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card">
                  <button
                    className="w-full text-right flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <HelpCircle className={`h-5 w-5 text-primary transition-transform ${selectedFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {selectedFaq === index && (
                    <div className="px-4 pb-4">
                      <div className="border-t pt-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">ارسال تیکت پشتیبانی</h3>
              </div>
              <p className="text-gray-600 mb-4">
                برای مشکلات پیچیده، یک تیکت پشتیبانی ارسال کنید تا متخصصان ما به شما کمک کنند.
              </p>
              <button className="btn-secondary">
                ارسال تیکت
              </button>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center ml-3">
                  <Bug className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">گزارش مشکل فنی</h3>
              </div>
              <p className="text-gray-600 mb-4">
                اگر مشکل فنی در سیستم مشاهده کردید، لطفاً آن را گزارش دهید تا سریعاً برطرف شود.
              </p>
              <button className="btn-secondary">
                گزارش مشکل
              </button>
            </div>
          </div>

          {/* Emergency Support */}
          <div className="mt-16 card bg-red-50 border-red-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-800 mb-4">پشتیبانی اضطراری</h3>
              <p className="text-red-700 mb-4">
                در صورت بروز مشکل فوری حین آزمون، فوراً با شماره زیر تماس بگیرید:
              </p>
              <div className="text-2xl font-bold text-red-800 mb-4">
                ۰۲۱-۱۲۳۴۵۶۷۸
              </div>
              <p className="text-sm text-red-600">
                این خط تلفن تنها برای موارد اضطراری حین آزمون فعال است
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;