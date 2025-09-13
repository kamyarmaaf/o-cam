export interface Question {
  id: number;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  subject: string;
  topic: string;
  difficulty: 'آسان' | 'متوسط' | 'سخت';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  points: number;
  explanation: string;
  timeEstimate: number; // in minutes
}

export const sampleQuestions: Question[] = [
  // ریاضی - آسان
  {
    id: 1,
    type: 'multiple_choice',
    subject: 'ریاضی',
    topic: 'جبر',
    difficulty: 'آسان',
    question: 'حاصل عبارت ۲x + ۳x چقدر است؟',
    options: ['۵x', '۶x', '۵x²', '۶x²'],
    correctAnswer: 0,
    points: 1,
    explanation: 'در جمع جملات همنام، ضرایب جمع می‌شوند: ۲x + ۳x = ۵x',
    timeEstimate: 1
  },
  {
    id: 2,
    type: 'multiple_choice',
    subject: 'ریاضی',
    topic: 'هندسه',
    difficulty: 'آسان',
    question: 'مساحت مربعی با ضلع ۴ سانتی‌متر چقدر است؟',
    options: ['۸ سانتی‌متر مربع', '۱۲ سانتی‌متر مربع', '۱۶ سانتی‌متر مربع', '۲۰ سانتی‌متر مربع'],
    correctAnswer: 2,
    points: 1,
    explanation: 'مساحت مربع = ضلع × ضلع = ۴ × ۴ = ۱۶ سانتی‌متر مربع',
    timeEstimate: 1
  },

  // ریاضی - متوسط
  {
    id: 3,
    type: 'multiple_choice',
    subject: 'ریاضی',
    topic: 'مشتق',
    difficulty: 'متوسط',
    question: 'مشتق تابع f(x) = x³ + 2x² - 5x + 1 چیست؟',
    options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 4x - 5', '3x² + 4x - 1'],
    correctAnswer: 0,
    points: 2,
    explanation: 'مشتق هر جمله: d/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(1) = 0',
    timeEstimate: 3
  },
  {
    id: 4,
    type: 'true_false',
    subject: 'ریاضی',
    topic: 'انتگرال',
    difficulty: 'متوسط',
    question: 'انتگرال تابع f(x) = 2x برابر با x² + C است.',
    correctAnswer: 0,
    points: 2,
    explanation: 'درست است. ∫2x dx = x² + C',
    timeEstimate: 2
  },

  // ریاضی - سخت
  {
    id: 5,
    type: 'essay',
    subject: 'ریاضی',
    topic: 'معادلات دیفرانسیل',
    difficulty: 'سخت',
    question: 'معادله دیفرانسیل dy/dx = y را حل کنید و نتیجه را توضیح دهید.',
    correctAnswer: 'y = Ce^x که C ثابت انتگرال‌گیری است',
    points: 5,
    explanation: 'این یک معادله دیفرانسیل جداپذیر است. با جداسازی متغیرها: dy/y = dx، سپس انتگرال‌گیری: ln|y| = x + C₁، نهایتاً y = Ce^x',
    timeEstimate: 8
  },

  // فیزیک - آسان
  {
    id: 6,
    type: 'multiple_choice',
    subject: 'فیزیک',
    topic: 'مکانیک',
    difficulty: 'آسان',
    question: 'واحد اندازه‌گیری نیرو در سیستم SI چیست؟',
    options: ['ژول', 'نیوتن', 'وات', 'پاسکال'],
    correctAnswer: 1,
    points: 1,
    explanation: 'نیوتن (N) واحد اندازه‌گیری نیرو در سیستم بین‌المللی یکاها است.',
    timeEstimate: 1
  },
  {
    id: 7,
    type: 'true_false',
    subject: 'فیزیک',
    topic: 'حرکت',
    difficulty: 'آسان',
    question: 'سرعت کمیتی برداری است.',
    correctAnswer: 0,
    points: 1,
    explanation: 'درست است. سرعت دارای اندازه و جهت است، بنابراین کمیت برداری محسوب می‌شود.',
    timeEstimate: 1
  },

  // فیزیک - متوسط
  {
    id: 8,
    type: 'multiple_choice',
    subject: 'فیزیک',
    topic: 'الکتریسیته',
    difficulty: 'متوسط',
    question: 'مقاومت معادل دو مقاومت ۴Ω و ۶Ω که به صورت موازی متصل شده‌اند چقدر است؟',
    options: ['۲.۴Ω', '۱۰Ω', '۵Ω', '۲Ω'],
    correctAnswer: 0,
    points: 2,
    explanation: '1/R = 1/4 + 1/6 = 3/12 + 2/12 = 5/12، پس R = 12/5 = 2.4Ω',
    timeEstimate: 3
  },

  // فیزیک - سخت
  {
    id: 9,
    type: 'essay',
    subject: 'فیزیک',
    topic: 'کوانتوم',
    difficulty: 'سخت',
    question: 'اصل عدم قطعیت هایزنبرگ را بیان کرده و کاربرد آن در فیزیک کوانتوم را توضیح دهید.',
    correctAnswer: 'Δx × Δp ≥ ℏ/2 - نمی‌توان موقعیت و تکانه ذره را همزمان با دقت کامل اندازه‌گیری کرد',
    points: 5,
    explanation: 'اصل عدم قطعیت هایزنبرگ بیان می‌کند که نمی‌توان موقعیت و تکانه یک ذره را همزمان با دقت کامل تعیین کرد. این اصل از طبیعت موجی ماده نشأت می‌گیرد.',
    timeEstimate: 10
  },

  // شیمی - آسان
  {
    id: 10,
    type: 'multiple_choice',
    subject: 'شیمی',
    topic: 'جدول تناوبی',
    difficulty: 'آسان',
    question: 'نماد شیمیایی طلا چیست؟',
    options: ['Go', 'Au', 'Ag', 'Al'],
    correctAnswer: 1,
    points: 1,
    explanation: 'Au نماد شیمیایی طلا است که از کلمه لاتین Aurum گرفته شده.',
    timeEstimate: 1
  },
  {
    id: 11,
    type: 'true_false',
    subject: 'شیمی',
    topic: 'اتم',
    difficulty: 'آسان',
    question: 'پروتون‌ها دارای بار مثبت هستند.',
    correctAnswer: 0,
    points: 1,
    explanation: 'درست است. پروتون‌ها ذرات زیراتمی با بار الکتریکی مثبت هستند.',
    timeEstimate: 1
  },

  // شیمی - متوسط
  {
    id: 12,
    type: 'multiple_choice',
    subject: 'شیمی',
    topic: 'واکنش‌های شیمیایی',
    difficulty: 'متوسط',
    question: 'در واکنش 2H₂ + O₂ → 2H₂O، چند مول آب از ۴ مول هیدروژن تولید می‌شود؟',
    options: ['۲ مول', '۴ مول', '۶ مول', '۸ مول'],
    correctAnswer: 1,
    points: 2,
    explanation: 'طبق ضرایب استوکیومتری، ۲ مول H₂ تولید ۲ مول H₂O می‌کند، پس ۴ مول H₂ تولید ۴ مول H₂O می‌کند.',
    timeEstimate: 3
  },

  // شیمی - سخت
  {
    id: 13,
    type: 'short_answer',
    subject: 'شیمی',
    topic: 'ترمودینامیک',
    difficulty: 'سخت',
    question: 'قانون اول ترمودینامیک را بیان کنید و فرمول آن را بنویسید.',
    correctAnswer: 'ΔU = Q - W یا انرژی داخلی سیستم برابر گرمای جذب شده منهای کار انجام شده توسط سیستم',
    points: 3,
    explanation: 'قانون اول ترمودینامیک بیان‌کننده پایستگی انرژی است: ΔU = Q - W',
    timeEstimate: 5
  },

  // زیست‌شناسی - آسان
  {
    id: 14,
    type: 'multiple_choice',
    subject: 'زیست‌شناسی',
    topic: 'سلول',
    difficulty: 'آسان',
    question: 'کوچکترین واحد زندگی چیست؟',
    options: ['بافت', 'سلول', 'اندام', 'ارگانل'],
    correctAnswer: 1,
    points: 1,
    explanation: 'سلول کوچکترین واحد ساختاری و عملکردی زندگی محسوب می‌شود.',
    timeEstimate: 1
  },

  // زیست‌شناسی - متوسط
  {
    id: 15,
    type: 'true_false',
    subject: 'زیست‌شناسی',
    topic: 'فتوسنتز',
    difficulty: 'متوسط',
    question: 'فتوسنتز فقط در روز انجام می‌شود.',
    correctAnswer: 0,
    points: 2,
    explanation: 'درست است. فتوسنتز نیاز به نور دارد و معمولاً در طول روز انجام می‌شود.',
    timeEstimate: 2
  },

  // زیست‌شناسی - سخت
  {
    id: 16,
    type: 'essay',
    subject: 'زیست‌شناسی',
    topic: 'ژنتیک',
    difficulty: 'سخت',
    question: 'قوانین مندل را شرح دهید و نقش آن‌ها در وراثت را توضیح دهید.',
    correctAnswer: 'قانون جداشدگی، قانون ترکیب مستقل، و قانون غالبیت که اساس وراثت کلاسیک را تشکیل می‌دهند',
    points: 5,
    explanation: 'قوانین مندل شامل سه قانون اصلی است که اساس درک ما از وراثت را تشکیل می‌دهند.',
    timeEstimate: 12
  },

  // تاریخ - آسان
  {
    id: 17,
    type: 'multiple_choice',
    subject: 'تاریخ',
    topic: 'تاریخ ایران',
    difficulty: 'آسان',
    question: 'کوروش کبیر بنیانگذار کدام امپراتوری بود؟',
    options: ['امپراتوری پارت', 'امپراتوری هخامنشی', 'امپراتوری ساسانی', 'امپراتوری صفوی'],
    correctAnswer: 1,
    points: 1,
    explanation: 'کوروش کبیر بنیانگذار امپراتوری هخامنشی در قرن ششم پیش از میلاد بود.',
    timeEstimate: 1
  },

  // ادبیات - آسان
  {
    id: 18,
    type: 'multiple_choice',
    subject: 'ادبیات',
    topic: 'شعر کلاسیک',
    difficulty: 'آسان',
    question: 'شاهنامه اثر کیست؟',
    options: ['حافظ', 'سعدی', 'فردوسی', 'مولوی'],
    correctAnswer: 2,
    points: 1,
    explanation: 'شاهنامه حماسه ملی ایران اثر ابوالقاسم فردوسی است.',
    timeEstimate: 1
  },

  // زبان انگلیسی - آسان
  {
    id: 19,
    type: 'multiple_choice',
    subject: 'زبان انگلیسی',
    topic: 'گرامر',
    difficulty: 'آسان',
    question: 'Which is correct?',
    options: ['I am go to school', 'I go to school', 'I going to school', 'I goes to school'],
    correctAnswer: 1,
    points: 1,
    explanation: 'در زمان حال ساده با ضمیر I از فعل اصلی بدون s استفاده می‌کنیم.',
    timeEstimate: 1
  },

  // زبان انگلیسی - متوسط
  {
    id: 20,
    type: 'short_answer',
    subject: 'زبان انگلیسی',
    topic: 'واژگان',
    difficulty: 'متوسط',
    question: 'What is the past tense of "bring"?',
    correctAnswer: 'brought',
    points: 2,
    explanation: 'فعل bring یک فعل بی‌قاعده است و گذشته آن brought می‌باشد.',
    timeEstimate: 2
  }
];

export const getQuestionsBySubject = (subject: string): Question[] => {
  return sampleQuestions.filter(q => q.subject === subject);
};

export const getQuestionsByDifficulty = (difficulty: string): Question[] => {
  return sampleQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number, subject?: string): Question[] => {
  const questions = subject ? getQuestionsBySubject(subject) : sampleQuestions;
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const subjects = [...new Set(sampleQuestions.map(q => q.subject))];
export const topics = [...new Set(sampleQuestions.map(q => q.topic))];