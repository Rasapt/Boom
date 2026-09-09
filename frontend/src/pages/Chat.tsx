import { useState, useRef, useEffect } from "react";
import { NavFn, SignupData } from "../types";
import { checkBackendHealth, generateStudyPlan, sendBoomChat } from "../api";

interface Msg { role: "user" | "ai"; text: string; }
const CHIPS = [
  "پیشرفتم امروز چطوره؟",
  "برای ۶ ماه آینده برنامه کنکور بده",
  "توی فیزیک کمکم کن",
  "روی چی تمرکز کنم؟",
  "برنامه‌ی این هفته رو تنظیم کن",
];

function BoomAvatar({ size = 28 }: { size?: number }) {
  return <div className="rounded-xl bg-[var(--text)] flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}><span className="font-display text-[var(--surface)] leading-none" style={{ fontSize: size * 0.45 }}>ب</span></div>;
}

function isPlanRequest(text: string) {
  return /(برنامه|پلن).*(ماه|ماهه|هفته|کنکور)|\d+\s*ماه/.test(text);
}

export default function Chat({ nav, userData }: { nav: NavFn; userData: SignupData | null }) {
  const name = userData?.name ?? "دانش‌آموز";
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: `سلام ${name}! من بوم هستم. به منابع آموزشی متصل‌ام و می‌تونم هم به سوالاتت جواب بدم و هم برای چند ماه برنامه‌ی مطالعه بسازم. چی داری؟` }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  async function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t || typing) return;
    const history = msgs.slice(-8).map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
    setMsgs(m => [...m, { role: "user", text: t }]);
    setInput(""); setChipsVisible(false); setTyping(true);
    try {
      const data = isPlanRequest(t)
        ? await generateStudyPlan({
            months: Number(t.match(/(\d+)\s*ماه/)?.[1] || 6),
            daily_hours: Number((userData?.studyHours || "4").match(/[0-9]+/)?.[0] || 4),
            major: userData?.major || "ریاضی فیزیک",
            grade: userData?.grade || "دوازدهم (سال کنکور)",
            target_rank: userData?.targetRank || "زیر ۵٬۰۰۰",
            student: userData || {},
            weak_subjects: [],
            strong_subjects: [],
            notes: t,
          })
        : await sendBoomChat({ question: t, history, student: userData || {} });
      setBackendOnline(true);
      const answer = ("plan" in data ? data.plan : data.answer) || "پاسخی دریافت نشد.";
      setMsgs(m => [...m, { role: "ai", text: answer }]);
    } catch (err) {
      console.error(err);
      setBackendOnline(false);
      setMsgs(m => [...m, { role: "ai", text: "ارتباط با سرور بوم برقرار نشد. Backend را روی پورت ۸۰۰۰ اجرا کن و دوباره تلاش کن." }]);
    } finally { setTyping(false); setChipsVisible(true); }
  }

  const showChips = chipsVisible && !typing && msgs.length <= 3;
  return <div className="h-screen flex flex-col bg-[var(--surface)]">
    <div className="flex-shrink-0 bg-white border-b border-[var(--border)]">
      <div className="flex items-center gap-3 px-5 pt-12 pb-4"><button onClick={() => nav("home")} className="w-9 h-9 rounded-xl bg-[var(--border)] flex items-center justify-center text-[var(--muted)]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}><path d="M19 12H5M12 5l-7 7 7 7"/></svg></button><div className="flex-1 flex items-center gap-3"><div className="flex-1 text-right"><p className="text-[15px] font-bold text-[var(--text)]">بوم <span className="text-[var(--accent)]">AI</span></p><div className="flex items-center gap-1.5 justify-end"><span className={`text-[11px] font-medium ${backendOnline === false ? "text-[var(--muted)]" : "text-[var(--success)]"}`}>{backendOnline === false ? "سرور قطع" : "Backend متصل"}</span><div className={`w-1.5 h-1.5 rounded-full ${backendOnline === false ? "bg-[var(--muted)]" : "bg-[var(--success)]"}`} /></div></div><BoomAvatar size={36}/></div></div>
      <div className="px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>{[{label:"رشته",value:userData?.major?.split(" ")[0]??"ریاضی"},{label:"هدف",value:userData?.targetRank??"زیر ۵٬۰۰۰"},{label:"زمان",value:userData?.studyHours??"۳ تا ۴ ساعت"}].map(x=><div key={x.label} className="flex items-center gap-1.5 bg-[var(--surface-2)] rounded-xl px-3 py-1.5 flex-shrink-0"><span className="text-[10px] font-bold text-[var(--muted-2)]">{x.label}:</span><span className="text-[11px] font-bold text-[var(--brown-text)]">{x.value}</span></div>)}</div>
    </div>
    <div className="flex-1 overflow-y-auto px-4 py-4"><div className="flex flex-col gap-3">{msgs.map((m,i)=><div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-start" : "justify-end"}`}>{m.role === "ai" && <BoomAvatar size={26}/>}<div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-[1.65] font-medium whitespace-pre-wrap ${m.role === "user" ? "bg-[var(--accent)] text-[var(--surface)] rounded-tl-sm" : "bg-white text-[var(--text)] border border-[var(--border)] rounded-tr-sm shadow-sm"}`}>{m.text}</div></div>)}
      {typing && <div className="flex items-end gap-2 justify-end"><BoomAvatar size={26}/><div className="bg-white border border-[var(--border)] px-4 py-3.5 rounded-2xl rounded-tr-sm shadow-sm flex gap-1.5 items-center">{[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-[var(--placeholder)] animate-bounce" style={{animationDelay:`${i*.18}s`}}/>)}</div></div>}
      {showChips && <div className="flex flex-wrap gap-2 pt-1 justify-end">{CHIPS.map(c=><button key={c} onClick={()=>send(c)} className="py-2 px-3.5 rounded-xl bg-white border border-[var(--border-strong)] text-[12px] font-semibold text-[var(--brown-text)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]">{c}</button>)}</div>}<div ref={bottomRef}/></div></div>
    <div className="flex-shrink-0 px-4 pb-8 pt-3 bg-white border-t border-[var(--border)]"><div className="flex items-end gap-2.5 bg-[var(--surface)] rounded-2xl border-2 border-[var(--border-strong)] focus-within:border-[var(--accent)] px-4 py-3"><button onClick={()=>send()} disabled={!input.trim()||typing} className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 ${input.trim()&&!typing?"bg-[var(--accent)] text-[var(--surface)]":"bg-[var(--border-strong)] text-[var(--muted-2)]"}`}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform:"scaleX(-1)"}}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="هر چیزی درباره‌ی کنکور و برنامه‌ات بپرس..." rows={1} className="flex-1 bg-transparent outline-none text-[13px] text-[var(--text)] placeholder:text-[var(--placeholder)] resize-none font-medium leading-relaxed text-right"/></div><p className="text-center text-[10px] text-[var(--placeholder)] mt-2">پاسخ‌های درسی با منابع RAG بوم تولید می‌شوند</p></div>
  </div>;
}
