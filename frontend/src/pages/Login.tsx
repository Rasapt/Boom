import { useState, useRef, useEffect } from "react";
import { NavFn } from "../types";

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-10 h-10 rounded-2xl bg-[#F0EBE3] flex items-center justify-center text-[#7A6858] hover:bg-[#E5DDD4] transition-colors">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(-1)" }}>
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

function PhoneStep({ nav, onNext, phone, setPhone }: {
  nav: NavFn; onNext: () => void; phone: string; setPhone: (v: string) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] px-6 pt-14 pb-10">
      <BackBtn onClick={() => nav("landing")} />

      <div className="mt-10">
        <p className="text-xs font-bold tracking-[0.2em] text-[#C4714A] mb-1">خوش برگشتی</p>
        <h1 className="font-display text-4xl text-[#1A1108] leading-snug">
          شماره موبایلت<br />چنده؟
        </h1>
        <p className="text-[13px] text-[#7A6858] mt-2">یه کد تأیید برات می‌فرستیم.</p>
      </div>

      <div className="mt-10">
        {/* Phone input: LTR internally so +98 appears on left, digits flow left-to-right */}
        <div className="flex items-center bg-white border-2 border-[#E5DDD4] focus-within:border-[#C4714A] rounded-2xl overflow-hidden transition-colors" dir="ltr">
          <div className="flex items-center px-4 py-4 bg-[#F5F0EA] border-l border-[#E5DDD4] flex-shrink-0 gap-1">
            <span className="text-[15px] font-bold text-[#5A4030]">+98</span>
          </div>
          <input
            autoFocus
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="912 345 6789"
            className="flex-1 bg-transparent outline-none text-[17px] font-bold text-[#1A1108] placeholder:text-[#C4B8A8] tracking-widest py-4 px-4 text-left"
          />
        </div>
        <p className="text-[12px] text-[#A89888] mt-2">شماره موبایل ایرانی بدون صفر اول</p>
      </div>

      <div className="mt-8">
        <button
          disabled={phone.length < 10}
          onClick={onNext}
          className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-95 ${
            phone.length >= 10
              ? "bg-[#C4714A] text-[#F8F6F2] hover:bg-[#A85C38] shadow-sm"
              : "bg-[#E5DDD4] text-[#B0A898] cursor-not-allowed"
          }`}
        >
          ارسال کد تأیید
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5DDD4]" />
        <span className="text-[12px] text-[#A89888]">یا</span>
        <div className="flex-1 h-px bg-[#E5DDD4]" />
      </div>

      <p className="mt-5 text-center text-[13px] text-[#7A6858]">
        هنوز ثبت‌نام نکردی؟{" "}
        <button onClick={() => nav("signup")} className="text-[#C4714A] font-bold underline underline-offset-2">
          ثبت‌نام
        </button>
      </p>
    </div>
  );
}

function OTPStep({ phone, onBack, onVerify }: {
  phone: string; onBack: () => void; onVerify: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
    const id = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  function handleInput(i: number, val: string) {
    const ch = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d) && ch && next.join("") === "123456") {
      setTimeout(onVerify, 300);
    }
  }

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  // Format phone number LTR so it displays correctly
  const formattedPhone = `+98 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F2] px-6 pt-14 pb-10">
      <BackBtn onClick={onBack} />

      <div className="mt-10">
        <p className="text-xs font-bold tracking-[0.2em] text-[#C4714A] mb-1">تأیید هویت</p>
        <h1 className="font-display text-4xl text-[#1A1108] leading-snug">کد را وارد کن</h1>
        <p className="text-[13px] text-[#7A6858] mt-2">
          ارسال شده به{" "}
          <span className="font-bold text-[#1A1108]" dir="ltr">{formattedPhone}</span>
        </p>
        <p className="text-[12px] text-[#A89888] mt-1">
          نکته: کد <span dir="ltr" className="font-bold">123456</span> را وارد کن
        </p>
      </div>

      {/* OTP boxes: LTR so digits fill left-to-right naturally */}
      <div className="mt-10 flex gap-2.5 justify-center" dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type="tel"
            maxLength={1}
            value={d}
            onChange={e => handleInput(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            className={`w-11 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all bg-white text-[#1A1108] ${
              d ? "border-[#C4714A] bg-[#FFF5F0]" : "border-[#E5DDD4] focus:border-[#C4714A]"
            }`}
          />
        ))}
      </div>

      <div className="mt-8">
        <button
          disabled={!digits.every(d => d)}
          onClick={onVerify}
          className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-95 ${
            digits.every(d => d)
              ? "bg-[#C4714A] text-[#F8F6F2] hover:bg-[#A85C38] shadow-sm"
              : "bg-[#E5DDD4] text-[#B0A898] cursor-not-allowed"
          }`}
        >
          تأیید و ورود
        </button>
      </div>

      <div className="mt-6 text-center">
        {timer > 0 ? (
          <p className="text-[13px] text-[#7A6858]">
            ارسال مجدد کد در{" "}
            <span className="font-bold text-[#C4714A]" dir="ltr">0:{timer.toString().padStart(2, "0")}</span>
          </p>
        ) : (
          <button onClick={() => { setTimer(59); setDigits(["","","","","",""]); refs.current[0]?.focus(); }}
            className="text-[13px] font-bold text-[#C4714A] underline underline-offset-2">
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  );
}

export default function Login({ nav, onLogin }: { nav: NavFn; onLogin: () => void }) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");

  if (step === "otp") {
    return <OTPStep phone={phone} onBack={() => setStep("phone")} onVerify={onLogin} />;
  }
  return <PhoneStep nav={nav} phone={phone} setPhone={setPhone} onNext={() => setStep("otp")} />;
}
