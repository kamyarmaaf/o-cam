import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-xl opacity-90">
            ما آماده پاسخگویی به سوالات شما هستیم
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">فرم تماس</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  پیام شما با موفقیت ارسال شد. در اسرع وقت با شما تماس خواهیم گرفت.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                      placeholder="نام کامل خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">موضوع را انتخاب کنید</option>
                    <option value="support">پشتیبانی فنی</option>
                    <option value="question">سوال عمومی</option>
                    <option value="bug">گزارش مشکل</option>
                    <option value="suggestion">پیشنهاد</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    پیام *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="input-field resize-none"
                    required
                    placeholder="پیام خود را اینجا بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>در حال ارسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>ارسال پیام</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">اطلاعات تماس</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">ایمیل</h3>
                      <p className="text-gray-600">info@examsite.com</p>
                      <p className="text-gray-600">support@examsite.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">تلفن</h3>
                      <p className="text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
                      <p className="text-gray-600">۰۲۱-۸۷۶۵۴۳۲۱</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">آدرس</h3>
                      <p className="text-gray-600">
                        تهران، خیابان انقلاب، خیابان کارگر شمالی، پلاک ۱۲۳
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">ساعات کاری</h3>
                      <p className="text-gray-600">شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰</p>
                      <p className="text-gray-600">پنج‌شنبه: ۸:۰۰ - ۱۳:۰۰</p>
                      <p className="text-gray-600">جمعه: تعطیل</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Support */}
              <div className="card bg-soft">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">پشتیبانی سریع</h3>
                <p className="text-gray-600 mb-4">
                  برای مشکلات فوری می‌توانید از راه‌های زیر با ما تماس بگیرید:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">چت آنلاین</span>
                    <span className="text-green-600 font-medium">آنلاین</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">تیکت پشتیبانی</span>
                    <span className="text-blue-600 font-medium">۲۴/۷</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">پاسخ ایمیل</span>
                    <span className="text-gray-600">کمتر از ۲۴ ساعت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;