import { Task, DayRecord } from "./types";

export const MAJORS = [
  "ریاضی فیزیک",
  "علوم تجربی",
  "علوم انسانی",
  "هنر",
  "زبان‌های خارجی",
];

export const GRADES = ["دهم", "یازدهم", "دوازدهم (سال کنکور)"];
export const EXAM_YEARS = ["۱۴۰۴", "۱۴۰۵", "۱۴۰۶", "۱۴۰۷"];
export const TARGET_RANKS = [
  "زیر ۱۰۰", "زیر ۵۰۰", "زیر ۱٬۰۰۰",
  "زیر ۵٬۰۰۰", "زیر ۱۰٬۰۰۰", "زیر ۲۵٬۰۰۰", "زیر ۵۰٬۰۰۰ و بیشتر",
];
export const STUDY_HOURS_OPTIONS = [
  "۱ تا ۲ ساعت", "۲ تا ۳ ساعت", "۳ تا ۴ ساعت", "۴ تا ۶ ساعت", "۶ تا ۸ ساعت", "بیش از ۸ ساعت",
];
export const TEST_EXAM_OPTIONS = [
  "قلم‌چی", "گاج", "کانون", "پردازش", "سنجش", "نوین", "سه‌گان",
];

export const SUBJECTS_BY_MAJOR: Record<string, string[]> = {
  "ریاضی فیزیک": [
    "حسابان", "جبر و گسسته", "هندسه", "فیزیک", "شیمی",
    "ادبیات فارسی", "عربی", "دین و زندگی", "زبان انگلیسی",
  ],
  "علوم تجربی": [
    "ریاضی", "فیزیک", "شیمی", "زیست‌شناسی",
    "ادبیات فارسی", "عربی", "دین و زندگی", "زبان انگلیسی",
  ],
  "علوم انسانی": [
    "ادبیات فارسی", "عربی", "تاریخ", "جغرافیا", "اقتصاد",
    "منطق و فلسفه", "دین و زندگی", "علوم اجتماعی", "ریاضی و آمار",
  ],
  "هنر": [
    "نقاشی و هنرهای تجسمی", "ترکیب‌بندی", "تاریخ هنر",
    "ادبیات فارسی", "زبان انگلیسی", "ریاضی",
  ],
  "زبان‌های خارجی": [
    "زبان انگلیسی", "زبان دوم", "ادبیات فارسی", "ریاضی", "تاریخ",
  ],
};

export const DEMO_TASKS: Task[] = [
  {
    id: 1, type: "study",
    title: "حسابان — مشتق‌گیری",
    description: "فصل ۵، مسائل ۱ تا ۲۰. تمرکز روی قانون زنجیر و مشتق‌گیری ضمنی.",
    subject: "حسابان", duration: "۱.۵ ساعت", scheduledTime: "۰۹:۰۰", done: false,
  },
  {
    id: 2, type: "quiz",
    title: "آزمون فیزیک",
    description: "مدارهای الکتریکی — ۳۰ سؤال چندگزینه‌ای به سبک کنکور.",
    subject: "فیزیک", duration: "۴۵ دقیقه", scheduledTime: "۱۱:۰۰", done: false,
  },
  {
    id: 3, type: "review",
    title: "مرور واژگان عربی",
    description: "فصل ۳، کلمات بنیادی — ۴۰ کارت فلش، دو دور کامل.",
    subject: "عربی", duration: "۳۰ دقیقه", scheduledTime: "۱۴:۰۰", done: true,
  },
  {
    id: 4, type: "practice",
    title: "تمرین درک مطلب انگلیسی",
    description: "۲ متن کامل با سؤالات از کنکورهای سال‌های قبل.",
    subject: "زبان انگلیسی", duration: "۴۰ دقیقه", scheduledTime: "۱۶:۰۰", done: false,
  },
  {
    id: 5, type: "test",
    title: "آزمون شبیه‌سازی شیمی",
    description: "فصل‌های ۱ تا ۳. شرایط واقعی کنکور، تایمر ۵۰ دقیقه.",
    subject: "شیمی", duration: "۵۰ دقیقه", scheduledTime: "۱۸:۰۰", done: false,
  },
];

export const PAST_RECORDS: DayRecord[] = [
  { date: "2026-08-20", tasksTotal: 5, tasksDone: 4, xp: 180 },
  { date: "2026-08-21", tasksTotal: 4, tasksDone: 4, xp: 200 },
  { date: "2026-08-22", tasksTotal: 6, tasksDone: 3, xp: 120 },
  { date: "2026-08-23", tasksTotal: 5, tasksDone: 5, xp: 250 },
  { date: "2026-08-24", tasksTotal: 4, tasksDone: 2, xp: 80 },
  { date: "2026-08-25", tasksTotal: 5, tasksDone: 4, xp: 180 },
  { date: "2026-08-26", tasksTotal: 5, tasksDone: 1, xp: 40 },
];

export const SUBJECT_COLORS: Record<string, string> = {
  "حسابان": "#5C8BA8",
  "ریاضی": "#5C8BA8",
  "جبر": "#5C8BA8",
  "هندسه": "#7A9BB8",
  "فیزیک": "#6B9E7A",
  "شیمی": "#9B7AAD",
  "زیست": "#5C9E6A",
  "ادبیات": "#C4A020",
  "عربی": "#C4714A",
  "انگلیسی": "#7A8AAD",
  "زبان انگلیسی": "#7A8AAD",
  "دین": "#A08060",
  "تاریخ": "#9A7060",
  "جغرافیا": "#6A9A80",
  "اقتصاد": "#8AAA60",
  "منطق": "#9A8AAD",
  "اجتماعی": "#7A9AAD",
  "default": "#8A7A6A",
};
