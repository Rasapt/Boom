import { useState, useRef, useEffect } from "react";
import { NavFn, SignupData } from "../types";

interface Msg { role: "user" | "ai"; text: string; }

const CHIPS = [
  "پیشرفتم امروز چطوره؟",
  "برنامه‌ی فردا رو سبک‌تر کن",
  "توی فیزیک کمکم کن",
  "روی چی تمرکز کنم؟",
  "خسته‌ام و انگیزه ندارم",
  "برنامه‌ی این هفته رو تنظیم کن",
];

function getReply(msg: string, name: string): string {
  const m = msg;
  if (m.includes("پیشرفت") || m.includes("امروز")) return `${name}، امروز ۱ از ۵ تکلیف انجام دادی — ۲۰٪ پیشرفت. میانگین هفتگی‌ات ۷۸٪ هست که نسبت به هفته‌ی قبل ۱۶٪ بهتر شده. این روند رو حفظ کن!`;
  if (m.includes("سبک") || m.includes("خسته") || m.includes("انگیزه")) return `فهمیدم. آزمون شبیه‌سازی فردا رو به پس‌فردا انتقال دادم و جاش یه جلسه‌ی مرور ۳۰ دقیقه‌ای گذاشتم. استراحت هم بخشی از برنامه‌ست.`;
  if (m.includes("فیزیک")) return `فیزیک بیشترین فرصت رشد رو داره. مدارهای الکتریکی جایی‌ه که بیشترین سفید گذاشتی. می‌خوای فردا صبح یه جلسه‌ی ۴۵ دقیقه‌ای اختصاصی بذارم؟`;
  if (m.includes("برنامه") || m.includes("تنظیم")) return `نگاه کردم به داده‌هات. جلسه‌ی سنگین حسابان جمعه رو به چهارشنبه منتقل می‌کنم که معمولاً انرژی‌ات بیشتره. یه مرور عربی ۲۰ دقیقه‌ای هم شنبه اضافه می‌کنم.`;
  if (m.includes("تمرکز")) return `بر اساس نتایج آزمونت، عربی با ۵۵٪ بیشترین اثر رو داره — فقط ۵٪ بهتر شدن توی عربی رتبه‌ات رو حدود ۸۰۰ نفر بالا می‌بره. این هفته بیشتر رویش وقت بذار.`;
  return `فهمیدم، ${name}. داده‌های مطالعه‌ات رو بررسی می‌کنم و برنامه‌ات رو آپدیت می‌کنم. یه محدودیت زمانی یا درس خاصی داری که در نظر بگیرم؟`;
}

function BoomAvatar({ size = 28 }: { size?: number }) {
  return (
    <div className="rounded-xl bg-[#1A1108] flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}>
      <span className="font-display text-[#F8F6F2] leading-none" style={{ fontSize: size * 0.45 }}>ب</span>
    </div>
  );
}

export default function Chat({ nav, userData }: { nav: NavFn; userData: SignupData | null }) {
  const name = userData?.name ?? "دانش‌آموز";
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `سلام ${name}! من بوم هستم، دستیار هوشمند کنکورت. می‌تونم برنامه‌ات رو تنظیم کنم، عملکردت رو تحلیل کنم، یا توی هر درسی کمکت کنم. چی داری؟` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t) return;
    setMsgs(m => [...m, { role: "user", text: t }]);
    setInput("");
    setChipsVisible(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "ai", text: getReply(t, name) }]);
      setChipsVisible(true);
    }, 900 + Math.random() * 500);
  }

  const showChips = chipsVisible && !typing && msgs.length <= 3;

  return (
    <div className="h-screen flex flex-col bg-[#F8F6F2]">

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-[#F0EBE3]">
        <div className="flex items-center gap-3 px-5 pt-12 pb-4">
          <button onClick={() => nav("home")}
            className="w-9 h-9 rounded-xl bg-[#F0EBE3] flex items-center justify-center text-[#7A6858] hover:bg-[#E5DDD4] transition-colors flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 text-right">
              <p className="text-[15px] font-bold text-[#1A1108]">
                بوم <span className="text-[#C4714A]">AI</span>
              </p>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[11px] text-[#6B9E7A] font-medium">آنلاین</span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B9E7A]" />
              </div>
            </div>
            <BoomAvatar size={36} />
          </div>
        </div>

      </div>

      {/* Messages — use dir=ltr container so justify-end=right, justify-start=left consistently */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-3" dir="ltr">
          {msgs.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-[1.65] font-medium text-right`}
                dir="rtl"
                style={{
                  background: m.role === "user" ? "#C4714A" : "white",
                  color: m.role === "user" ? "#F8F6F2" : "#1A1108",
                  border: m.role === "ai" ? "1px solid #F0EBE3" : "none",
                  borderRadius: m.role === "user" ? "1rem 0.25rem 1rem 1rem" : "0.25rem 1rem 1rem 1rem",
                  boxShadow: m.role === "ai" ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                }}>
                {m.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-end gap-2 justify-start">
              <div className="bg-white border border-[#F0EBE3] px-4 py-3.5 shadow-sm flex gap-1.5 items-center"
                style={{ borderRadius: "0.25rem 1rem 1rem 1rem" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#C4B8A8] animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick chips — rtl so Persian text reads naturally */}
          {showChips && (
            <div className="flex flex-wrap gap-2 pt-1 justify-end" dir="rtl">
              {CHIPS.map(chip => (
                <button key={chip} onClick={() => send(chip)}
                  className="py-2 px-3.5 rounded-xl bg-white border border-[#E5DDD4] text-[12px] font-semibold text-[#5A4030] hover:border-[#C4714A] hover:bg-[#FFF5F0] hover:text-[#C4714A] transition-all">
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 pb-8 pt-3 bg-white border-t border-[#F0EBE3]">
        <div className="flex items-end gap-2.5 bg-[#F8F6F2] rounded-2xl border-2 border-[#E5DDD4] focus-within:border-[#C4714A] px-4 py-3 transition-colors">
          <button onClick={() => send()} disabled={!input.trim() || typing}
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all ${input.trim() && !typing
              ? "bg-[#C4714A] text-[#F8F6F2] hover:bg-[#A85C38] active:scale-90"
              : "bg-[#E5DDD4] text-[#A89888] cursor-not-allowed"
              }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="هر چیزی درباره‌ی برنامه‌ات بپرس..."
            rows={1}
            className="flex-1 bg-transparent outline-none text-[13px] text-[#1A1108] placeholder:text-[#C4B8A8] resize-none font-medium leading-relaxed text-right"
          />
        </div>
      </div>
    </div>
  );
}
