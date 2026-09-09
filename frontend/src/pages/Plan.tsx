import { useState } from "react";
import { NavFn } from "../types";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 rounded-xl bg-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border-strong)] transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
  );
}

const UPCOMING_EXAMS = [
  { label: "قلم‌چی — آزمون شماره ۴", date: "۱۵ شهریور ۱۴۰۵", daysAway: 10, color: "#5C8BA8" },
  { label: "آزمون ماهانه گاج", date: "۲۲ شهریور ۱۴۰۵", daysAway: 17, color: "#9B7AAD" },
  { label: "امتحان میان‌ترم مدرسه", date: "۳۰ شهریور ۱۴۰۵", daysAway: 25, color: "var(--accent)" },
];

const GOALS = [
  { horizon: "بلند‌مدت", icon: "🎯", title: "رتبه‌ی زیر ۵٬۰۰۰ کشوری", sub: "روز کنکور · خرداد ۱۴۰۶", progress: 28, color: "var(--accent)" },
  { horizon: "میان‌مدت", icon: "📈", title: "رساندن فیزیک به ۷۵٪", sub: "هدف · مهر ۱۴۰۵", progress: 61, color: "#5C8BA8" },
  { horizon: "این هفته", icon: "✅", title: "تکمیل ۳۵ تکلیف", sub: "۲۴ از ۳۵ انجام شده", progress: 69, color: "var(--success)" },
];

// Shamsi day names (abbreviated)
const DAY_LETTERS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export default function Plan({ nav }: { nav: NavFn }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear] = useState(today.getFullYear());

  const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  // approximate Shamsi month for display purposes
  const shamsiMonth = monthNames[(viewMonth + 3) % 12];
  const shamsiYear = viewMonth >= 9 ? "۱۴۰۵" : "۱۴۰۴";

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const examDays = new Set([5, 12, 20]);
  const taskDays = new Set([1,2,3,4,6,7,8,9,10,11,13,14,15,16,17,18,19,21,22,23,24,25,26]);

  return (
    <div className="min-h-screen bg-[var(--surface)] pb-10">
      <div className="px-5 pt-12 pb-4 flex items-center gap-4">
        <BackButton onClick={() => nav("home")} />
        <div className="text-right">
          <h1 className="font-display text-xl text-[var(--text)]">برنامه‌ی شما</h1>
          <p className="text-[12px] text-[var(--muted-2)] font-medium">اهداف، تقویم و آزمون‌های پیش رو</p>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Goals */}
        <div className="space-y-2.5">
          {GOALS.map(g => (
            <div key={g.horizon} className="bg-white rounded-2xl border border-[var(--border)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden mt-3">
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
                      <p className="text-[14px] font-semibold text-[var(--text)]">{g.title}</p>
                      <p className="text-[11px] text-[var(--muted-2)] font-medium mt-0.5">{g.sub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              <button onClick={() => setViewMonth(m => m + 1)}
                className="w-7 h-7 rounded-lg bg-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border-strong)] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button onClick={() => setViewMonth(m => m - 1)}
                className="w-7 h-7 rounded-lg bg-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border-strong)] transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
            <p className="text-[14px] font-bold text-[var(--text)]">{shamsiMonth} {shamsiYear}</p>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAY_LETTERS.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-[var(--muted-2)] py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && viewMonth === today.getMonth();
              const isExam = examDays.has(day);
              const hasTask = taskDays.has(day);
              return (
                <div key={day} className="flex flex-col items-center py-0.5">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-[12px] font-semibold ${
                    isToday ? "bg-[var(--accent)] text-white" : "text-[var(--text)]"
                  }`}>{day}</div>
                  <div className="flex gap-0.5 h-1.5 mt-0.5">
                    {hasTask && <div className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-60" />}
                    {isExam && <div className="w-1 h-1 rounded-full bg-[#5C8BA8]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-3 pt-3 border-t border-[var(--border)] justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[var(--muted-2)] font-medium">روز مطالعه</span>
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-70" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[var(--muted-2)] font-medium">آزمون</span>
              <div className="w-2 h-2 rounded-full bg-[#5C8BA8]" />
            </div>
          </div>
        </div>

        {/* Upcoming exams */}
        <div>
          <p className="text-[12px] font-bold text-[var(--muted-2)] mb-2 text-right">آزمون‌های پیش رو</p>
          <div className="space-y-2">
            {UPCOMING_EXAMS.map(e => (
              <div key={e.label} className="bg-white rounded-2xl border border-[var(--border)] px-4 py-3 flex items-center gap-3">
                <div className="text-right flex-1">
                  <p className="text-[13px] font-semibold text-[var(--text)]">{e.label}</p>
                  <p className="text-[11px] text-[var(--muted-2)] font-medium">{e.date}</p>
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
