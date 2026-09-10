import { useState } from "react";
import { NavFn, SignupData } from "../types";
import { MAJORS, GRADES, EXAM_YEARS, TARGET_RANKS, STUDY_HOURS_OPTIONS, TEST_EXAM_OPTIONS } from "../data";

interface Props { nav: NavFn; onComplete: (data: SignupData) => void; }

export default function Signup({ nav, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [grade, setGrade] = useState("");
  const [examYear, setExamYear] = useState("");
  const [targetRank, setTargetRank] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [testExams, setTestExams] = useState<string[]>([]);
  const [customExam, setCustomExam] = useState("");
  const [phone, setPhone] = useState("");

  const TOTAL = 8;
  // Start at ~15% so Q1 already has visible fill; reach 100% at Q8
  const progress = Math.max(15, ((step + 1) / TOTAL) * 100);

  function advance() {
    if (step < TOTAL - 1) setStep(s => s + 1);
    else onComplete({ name, major, grade, examYear, targetRank, studyHours, testExams, phone });
  }

  function toggleExam(e: string) {
    setTestExams(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  }

  function addCustom() {
    const t = customExam.trim();
    if (t && !testExams.includes(t)) setTestExams(prev => [...prev, t]);
    setCustomExam("");
  }

  // Auto-advance for single-choice questions (steps 1–5)
  function pick<T>(setter: (v: T) => void, value: T, autoAdvance = true) {
    setter(value);
    if (autoAdvance) setTimeout(advance, 180);
  }

  const canContinue = [
    name.trim().length > 0,
    major.length > 0,
    grade.length > 0,
    examYear.length > 0,
    targetRank.length > 0,
    studyHours.length > 0,
    testExams.length > 0,
    phone.trim().length > 0,
  ][step] ?? false;

  const steps = [
    {
      q: "اسمت چیه؟",
      sub: "اینطوری صدات میزنیم.",
      content: (
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          placeholder="مثلاً پریسا" onKeyDown={e => e.key === "Enter" && canContinue && advance()}
          className="w-full bg-white border-2 border-[#E5DDD4] focus:border-[#C4714A] outline-none rounded-2xl px-5 py-4 text-lg font-semibold text-[#1A1108] placeholder:text-[#C4B8A8] transition-colors"
        />
      ),
    },
    {
      q: "رشته‌ات چیه؟",
      sub: "برنامه‌ی درسی‌ات رو بر اساسش تنظیم می‌کنیم.",
      content: (
        <div className="flex flex-col gap-2">
          {MAJORS.map(m => (
            <button key={m} onClick={() => pick(setMajor, m)}
              className={`py-3.5 px-5 rounded-2xl text-right font-semibold text-[14px] transition-all ${major === m ? "bg-[#C4714A] text-[#F8F6F2]" : "bg-white border border-[#E5DDD4] text-[#3A2A1A] hover:border-[#C4714A]"
                }`}
            >{m}</button>
          ))}
        </div>
      ),
    },
    {
      q: "چه پایه‌ای هستی؟",
      sub: "بر اساسش زمان‌بندی‌ات رو تنظیم می‌کنیم.",
      content: (
        <div className="flex flex-col gap-2">
          {GRADES.map(g => (
            <button key={g} onClick={() => pick(setGrade, g)}
              className={`py-3.5 px-5 rounded-2xl text-right font-semibold text-[14px] transition-all ${grade === g ? "bg-[#C4714A] text-[#F8F6F2]" : "bg-white border border-[#E5DDD4] text-[#3A2A1A] hover:border-[#C4714A]"
                }`}
            >{g}</button>
          ))}
        </div>
      ),
    },
    {
      q: "کدوم سال می‌خوای کنکور بدی؟",
      sub: "افق برنامه‌ریزی‌ات رو مشخص می‌کنه.",
      content: (
        <div className="grid grid-cols-2 gap-2">
          {EXAM_YEARS.map(y => (
            <button key={y} onClick={() => pick(setExamYear, y)}
              className={`py-4 rounded-2xl font-bold text-xl text-center transition-all ${examYear === y ? "bg-[#C4714A] text-[#F8F6F2]" : "bg-white border border-[#E5DDD4] text-[#3A2A1A] hover:border-[#C4714A]"
                }`}
            >{y}</button>
          ))}
        </div>
      ),
    },
    {
      q: "رتبه‌ی هدفت چنده؟",
      sub: "صادقانه بگو — سطح و سرعت برنامه‌ات رو تعیین می‌کنه.",
      content: (
        <div className="flex flex-col gap-2">
          {TARGET_RANKS.map(r => (
            <button key={r} onClick={() => pick(setTargetRank, r)}
              className={`py-3.5 px-5 rounded-2xl text-right font-semibold text-[14px] transition-all ${targetRank === r ? "bg-[#C4714A] text-[#F8F6F2]" : "bg-white border border-[#E5DDD4] text-[#3A2A1A] hover:border-[#C4714A]"
                }`}
            >{r}</button>
          ))}
        </div>
      ),
    },
    {
      q: "روزانه چند ساعت می‌تونی درس بخونی؟",
      sub: "یه روز معمولی — نه بهترین و نه بدترین روزت.",
      content: (
        <div className="flex flex-col gap-2">
          {STUDY_HOURS_OPTIONS.map(h => (
            <button key={h} onClick={() => pick(setStudyHours, h)}
              className={`py-3.5 px-5 rounded-2xl text-right font-semibold text-[14px] transition-all ${studyHours === h ? "bg-[#C4714A] text-[#F8F6F2]" : "bg-white border border-[#E5DDD4] text-[#3A2A1A] hover:border-[#C4714A]"
                }`}
            >{h}</button>
          ))}
        </div>
      ),
    },
    {
      q: "تو کدوم آزمون‌ها شرکت می‌کنی؟",
      sub: "همه رو انتخاب کن. نتایجت رو باهاشون هماهنگ می‌کنیم.",
      content: (
        <div className="flex flex-col gap-2">
          {/* Predefined options */}
          {TEST_EXAM_OPTIONS.map(e => (
            <button key={e} onClick={() => toggleExam(e)}
              className={`py-3 px-5 rounded-2xl text-right font-semibold text-[14px] transition-all flex items-center gap-3 ${testExams.includes(e) ? "bg-[#C4714A] text-[#F8F6F2]" : "bg-white border border-[#E5DDD4] text-[#3A2A1A] hover:border-[#C4714A]"
                }`}
            >
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${testExams.includes(e) ? "border-white/50 bg-white/20" : "border-[#C4B8A8]"
                }`}>
                {testExams.includes(e) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="flex-1 text-right">{e}</span>
            </button>
          ))}

          {/* Custom exams — displayed exactly like predefined options */}
          {testExams.filter(e => !TEST_EXAM_OPTIONS.includes(e)).map(e => (
            <button key={e} onClick={() => toggleExam(e)}
              className="py-3 px-5 rounded-2xl text-right font-semibold text-[14px] bg-[#C4714A] text-[#F8F6F2] flex items-center gap-3 transition-all"
            >
              <div className="w-5 h-5 rounded-lg border-2 border-white/50 bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="flex-1 text-right">{e}</span>
            </button>
          ))}

          {/* Add custom */}
          <div className="flex gap-2 mt-1">
            <button onClick={addCustom} disabled={!customExam.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#F0EBE3] text-[#7A6858] font-bold text-[13px] hover:bg-[#E5DDD4] disabled:opacity-40 transition-colors flex-shrink-0">
              افزودن
            </button>
            <input value={customExam} onChange={e => setCustomExam(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustom()}
              placeholder="آزمون دیگه‌ای داری؟"
              className="flex-1 bg-white border border-[#E5DDD4] focus:border-[#C4714A] outline-none rounded-xl px-4 py-2.5 text-[13px] font-semibold text-[#1A1108] placeholder:text-[#C4B8A8] transition-colors text-right"
            />
          </div>
        </div>
      ),
    },
    {
      q: "شماره موبایلت چیه؟",
      sub: "اینحوری میتونی دوباره وارد حسابت بشی.",
      content: (
        <input autoFocus value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="tel" dir="ltr"
          onKeyDown={e => e.key === "Enter" && canContinue && advance()}
          className="w-full bg-white border-2 border-[#E5DDD4] focus:border-[#C4714A] outline-none rounded-2xl px-5 py-4 text-lg font-semibold text-[#1A1108] placeholder:text-[#C4B8A8] transition-colors text-left"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2]">
      {/* Progress bar — detached, wide, rounded, sticky */}
      <div className="sticky top-0 z-10 bg-[#F8F6F2] px-5 pt-5 pb-3">
        <div className="h-3 bg-[#EDE6DC] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, background: "linear-gradient(to left, #E8A070, #C4714A)" }}
          />
        </div>
      </div>

      {/* Header row: question number LEFT, back button RIGHT */}
      <div className="flex items-center justify-between px-5 pb-2">
        <span className="text-[12px] font-bold text-[#A89888]">{step + 1} از {TOTAL}</span>
        <button
          onClick={() => step === 0 ? nav("landing") : setStep(s => s - 1)}
          className="w-9 h-9 rounded-xl bg-[#F0EBE3] flex items-center justify-center text-[#7A6858] hover:bg-[#E5DDD4] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col px-6 pt-3 pb-8 overflow-y-auto">
        <div className="mb-6">
          <h2 className="font-display text-3xl text-[#1A1108] leading-snug">{steps[step].q}</h2>
          <p className="text-[13px] text-[#7A6858] mt-1">{steps[step].sub}</p>
        </div>
        {steps[step].content}
      </div>

      {/* Continue button — shown for text-entry and multi-select questions */}
      {(step === 0 || step === 6 || step === 7) && (
        <div className="px-6 pb-10 pt-3 bg-[#F8F6F2]">
          <button disabled={!canContinue} onClick={advance}
            className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-95 ${canContinue
              ? "bg-[#C4714A] text-[#F8F6F2] hover:bg-[#A85C38] shadow-sm"
              : "bg-[#E5DDD4] text-[#B0A898] cursor-not-allowed"
              }`}
          >
            {step === 7 ? "رفتن به داشبورد ←" : "ادامه"}
          </button>
        </div>
      )}
    </div>
  );
}
