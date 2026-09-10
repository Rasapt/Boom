import { useState } from "react";
import { NavFn } from "../types";
import { PAST_RECORDS } from "../data";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 rounded-xl bg-[#F0EBE3] flex items-center justify-center text-[#7A6858] hover:bg-[#E5DDD4] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
  );
}

const UPCOMING_EXAMS = [
  { label: "قلم‌چی — آزمون شماره ۴", date: "۱۵ شهریور ۱۴۰۵", daysAway: 10, color: "#5C8BA8" },
  { label: "آزمون ماهانه گاج", date: "۲۲ شهریور ۱۴۰۵", daysAway: 17, color: "#9B7AAD" },
  { label: "امتحان میان‌ترم مدرسه", date: "۳۰ شهریور ۱۴۰۵", daysAway: 25, color: "#C4714A" },
];

const GOALS = [
  { horizon: "بلند‌مدت", icon: "🎯", title: "رتبه‌ی زیر ۵٬۰۰۰ کشوری", sub: "روز کنکور · خرداد ۱۴۰۶", progress: 28, color: "#C4714A" },
  { horizon: "میان‌مدت", icon: "📈", title: "رساندن فیزیک به ۷۵٪", sub: "هدف · مهر ۱۴۰۵", progress: 61, color: "#5C8BA8" },
  { horizon: "این هفته", icon: "✅", title: "تکمیل ۳۵ تکلیف", sub: "۲۴ از ۳۵ انجام شده", progress: 69, color: "#6B9E7A" },
];

// Shamsi day names (abbreviated)
const DAY_LETTERS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export default function Plan({ nav }: { nav: NavFn }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  // approximate Shamsi month for display purposes
  const shamsiMonth = monthNames[(viewMonth + 3) % 12];
  const shamsiYear = viewMonth >= 9 ? "۱۴۰۵" : "۱۴۰۴";

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const examDays = new Set([5, 12, 20]);
  const taskDays = new Set([1,2,3,4,6,7,8,9,10,11,13,14,15,16,17,18,19,21,22,23,24,25,26]);
  const recordsByDate = new Map(PAST_RECORDS.map(record => [record.date, record]));
  const selectedRecord = selectedDate ? recordsByDate.get(selectedDate) : undefined;
  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("fa-IR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${selectedDate}T12:00:00`))
    : "";

  return (
    <div className="min-h-screen bg-[#F8F6F2] pb-10">
      <div className="px-5 pt-12 pb-4 flex items-center gap-4">
        <BackButton onClick={() => nav("home")} />
        <div className="text-right">
          <h1 className="font-display text-xl text-[#1A1108]">برنامه‌ی شما</h1>
          <p className="text-[12px] text-[#A89888] font-medium">اهداف، تقویم و آزمون‌های پیش رو</p>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Goals */}
        <div className="space-y-2.5">
          {GOALS.map(g => (
            <div key={g.horizon} className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="h-1.5 w-full bg-[#F0EBE3] rounded-full overflow-hidden mt-3">
                      <div className="h-full rounded-full" style={{ width: `${g.progress}%`, background: g.color }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] font-bold" style={{ color: g.color }}>{g.progress}%</span>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end mb-0.5">
                        <span className="text-[10px] font-bold" style={{ color: g.color }}>{g.horizon}</span>
                        <span className="text-lg">{g.icon}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-[#1A1108]">{g.title}</p>
                      <p className="text-[11px] text-[#A89888] font-medium mt-0.5">{g.sub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl border border-[#F0EBE3] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              <button onClick={() => setViewMonth(m => m + 1)}
                className="w-7 h-7 rounded-lg bg-[#F0EBE3] flex items-center justify-center text-[#7A6858] hover:bg-[#E5DDD4] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button onClick={() => setViewMonth(m => m - 1)}
                className="w-7 h-7 rounded-lg bg-[#F0EBE3] flex items-center justify-center text-[#7A6858] hover:bg-[#E5DDD4] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            <p className="text-[14px] font-bold text-[#1A1108]">{shamsiMonth} {shamsiYear}</p>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAY_LETTERS.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-[#A89888] py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && viewMonth === today.getMonth();
              const isExam = examDays.has(day);
              const hasTask = taskDays.has(day);
              const dayDate = new Date(viewYear, viewMonth, day);
              const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const record = recordsByDate.get(dateKey);
              const isSelected = selectedDate === dateKey;
              return (
                <button key={day} type="button" disabled={!isPast} onClick={() => setSelectedDate(dateKey)}
                  className={`flex flex-col items-center py-0.5 rounded-xl transition-colors ${isPast ? "cursor-pointer hover:bg-[#FFF5F0]" : "cursor-default"}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[12px] font-semibold ${
                    isToday ? "bg-[#C4714A] text-white" : isSelected ? "bg-[#FAD8C7] text-[#A85C38]" : "text-[#1A1108]"
                  }`}>{day}</div>
                  <div className="flex gap-0.5 h-1.5 mt-0.5">
                    {(hasTask || record) && <div className="w-1 h-1 rounded-full bg-[#C4714A] opacity-60" />}
                    {isExam && <div className="w-1 h-1 rounded-full bg-[#5C8BA8]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-3 pt-3 border-t border-[#F0EBE3] justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#A89888] font-medium">روز مطالعه</span>
              <div className="w-2 h-2 rounded-full bg-[#C4714A] opacity-70" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#A89888] font-medium">آزمون</span>
              <div className="w-2 h-2 rounded-full bg-[#5C8BA8]" />
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="bg-white rounded-3xl border border-[#F0EBE3] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="text-right">
                <p className="text-[11px] font-bold text-[#A89888]">گزارش روز انتخاب‌شده</p>
                <h2 className="text-[16px] font-bold text-[#1A1108] mt-1">{selectedDateLabel}</h2>
              </div>
              <button type="button" onClick={() => setSelectedDate(null)}
                className="w-7 h-7 rounded-lg bg-[#F0EBE3] text-[#7A6858] text-sm hover:bg-[#E5DDD4]">×</button>
            </div>
            {selectedRecord ? (
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="rounded-2xl bg-[#FFF5F0] p-3 text-center">
                  <p className="text-lg font-bold text-[#C4714A]">{selectedRecord.tasksDone}/{selectedRecord.tasksTotal}</p>
                  <p className="text-[10px] text-[#7A6858] mt-0.5">تکلیف انجام‌شده</p>
                </div>
                <div className="rounded-2xl bg-[#F2F7FA] p-3 text-center">
                  <p className="text-lg font-bold text-[#5C8BA8]">{selectedRecord.xp}</p>
                  <p className="text-[10px] text-[#7A6858] mt-0.5">امتیاز تجربه</p>
                </div>
                <div className="rounded-2xl bg-[#F3F8F3] p-3 text-center">
                  <p className="text-lg font-bold text-[#6B9E7A]">{Math.round((selectedRecord.tasksDone / selectedRecord.tasksTotal) * 100)}٪</p>
                  <p className="text-[10px] text-[#7A6858] mt-0.5">نرخ پیشرفت</p>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-[#A89888] mt-4">برای این روز هنوز گزارشی ثبت نشده است.</p>
            )}
          </div>
        )}

        {/* Upcoming exams */}
        <div>
          <p className="text-[12px] font-bold text-[#A89888] mb-2 text-right">آزمون‌های پیش رو</p>
          <div className="space-y-2">
            {UPCOMING_EXAMS.map(e => (
              <div key={e.label} className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-3 flex items-center gap-3">
                <div className="text-right flex-1">
                  <p className="text-[13px] font-semibold text-[#1A1108]">{e.label}</p>
                  <p className="text-[11px] text-[#A89888] font-medium">{e.date}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                  style={{ background: e.color }}>
                  {e.daysAway}r
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
