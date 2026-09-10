import { useState } from "react";
import { Screen, SignupData, Task } from "./types";
import { DEMO_TASKS } from "./data";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Streak from "./pages/Streak";
import Recovery from "./pages/Recovery";
import Exams from "./pages/Exams";
import Plan from "./pages/Plan";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

const DEMO_LOGIN_USER: SignupData = {
  name: "دانش‌آموز",
  major: "ریاضی فیزیک",
  grade: "دوازدهم (سال کنکور)",
  examYear: "۱۴۰۶",
  targetRank: "زیر ۵٬۰۰۰",
  studyHours: "۳ تا ۴ ساعت",
  testExams: ["قلم‌چی", "گاج"],
  phone: "09123456789",
};

const NAV_ITEMS: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  {
    screen: "home", label: "خانه",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    screen: "streak", label: "استریک",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9 7 6 8 7 13c.7 3 3 5 5 5s4.3-2 5-5c1-5-2-6-5-11z"/></svg>,
  },
  {
    screen: "recovery", label: "ریکاوری",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  },
  {
    screen: "exams", label: "آزمون‌ها",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    screen: "plan", label: "برنامه",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    screen: "profile", label: "پروفایل",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
];

function DesktopSidebar({ screen, nav }: { screen: Screen; nav: (s: Screen) => void }) {
  const pastConversations = [
    { title: "برنامه‌ی این هفته رو تنظیم کن", date: "امروز", active: true },
    { title: "تحلیل عملکرد آزمون فیزیک", date: "دیروز" },
    { title: "چطور انگیزه‌ام رو حفظ کنم؟", date: "۵ شهریور" },
    { title: "برنامه‌ی مرور قبل از آزمون", date: "۲ شهریور" },
    { title: "کمک برای مدارهای الکتریکی", date: "۲۹ مرداد" },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed top-0 right-0 bottom-0 w-[220px] bg-white border-r border-[#EDE6DC] z-30">
      {/* Logo / Name */}
      <div className="px-5 pt-7 pb-5 border-b border-[#F0EBE3]">
        <div className="flex items-center gap-3">
          {/* Logo placeholder */}
          <div className="w-10 h-10 rounded-2xl bg-[#C4714A] flex items-center justify-center flex-shrink-0">
            <span className="text-[#F8F6F2] font-display text-lg leading-none">ب</span>
          </div>
          <div>
            <p className="font-display text-2xl text-[#1A1108] leading-none">بوم</p>
            <p className="text-[10px] text-[#A89888] font-medium mt-0.5">برنامه‌ریز کنکور</p>
          </div>
        </div>
      </div>

      {screen === "chat" ? (
        <>
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-bold text-[#1A1108]">گفتگوهای قبلی</p>
              <button onClick={() => nav("home")}
                className="w-7 h-7 rounded-lg bg-[#F0EBE3] text-[#7A6858] flex items-center justify-center hover:bg-[#E5DDD4] transition-colors"
                aria-label="بازگشت به داشبورد">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </button>
            </div>
            <button onClick={() => nav("chat")}
              className="w-full py-2.5 rounded-xl bg-[#C4714A] text-[#F8F6F2] font-bold text-[12px] hover:bg-[#A85C38] transition-colors">
              + گفتگوی جدید
            </button>
          </div>
          <nav className="flex-1 px-3 pb-3 space-y-1 overflow-y-auto">
            {pastConversations.map(conversation => (
              <button key={conversation.title} onClick={() => nav("chat")}
                className={`w-full px-3 py-3 rounded-2xl text-right transition-all ${
                  conversation.active
                    ? "bg-[#FFF5F0] border border-[#FAD8C7]"
                    : "hover:bg-[#F5F0EA]"
                }`}
              >
                <p className={`text-[12px] font-semibold truncate ${conversation.active ? "text-[#C4714A]" : "text-[#3A2A1A]"}`}>
                  {conversation.title}
                </p>
                <p className="text-[10px] text-[#A89888] mt-1">{conversation.date}</p>
              </button>
            ))}
          </nav>
        </>
      ) : (
        <>
          {/* Nav items */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const active = screen === item.screen;
              return (
                <button key={item.screen} onClick={() => nav(item.screen)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-right transition-all ${
                    active
                      ? "bg-[#FFF5F0] text-[#C4714A]"
                      : "text-[#7A6858] hover:bg-[#F5F0EA] hover:text-[#3A2A1A]"
                  }`}
                >
                  <span className={active ? "text-[#C4714A]" : "text-[#A89888]"}>{item.icon}</span>
                  <span className="font-semibold text-[14px]">{item.label}</span>
                  {active && <span className="me-auto w-1.5 h-1.5 rounded-full bg-[#C4714A]" />}
                </button>
              );
            })}
          </nav>

          {/* Chat CTA */}
          <div className="p-4 border-t border-[#F0EBE3]">
            <button onClick={() => nav("chat")}
              className="w-full py-3.5 rounded-2xl bg-[#1A1108] text-[#F8F6F2] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#2C2010] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              گفتگو با بوم AI
            </button>
          </div>
        </>
      )}
    </aside>
  );
}

function Shell({ children, screen, nav }: { children: React.ReactNode; screen: Screen; nav: (s: Screen) => void }) {
  const hideSidebar = ["landing", "login", "signup"].includes(screen);
  return (
    <div dir="rtl" className="min-h-screen bg-[#E8E0D5]">
      {!hideSidebar && <DesktopSidebar screen={screen} nav={nav} />}
      <div className={`min-h-screen ${!hideSidebar ? "md:mr-[220px]" : ""}`}>
        <div className="w-full max-w-[430px] mx-auto md:max-w-none min-h-screen bg-[#F8F6F2] md:shadow-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [userData, setUserData] = useState<SignupData | null>(null);
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [interactions, setInteractions] = useState(0);
  const [showGate, setShowGate] = useState(false);

  function nav(s: Screen) {
    setScreen(s);
    window.scrollTo(0, 0);
  }

  function onInteract() {
    setInteractions(n => {
      const next = n + 1;
      if (next === 5 && !showGate && userData) setShowGate(true);
      return next;
    });
  }

  function handleLogin() {
    setUserData(DEMO_LOGIN_USER);
    nav("home");
  }

  const p = { nav };

  return (
    <Shell screen={screen} nav={nav}>
      {screen === "landing" && <Landing {...p} />}
      {screen === "login" && <Login {...p} onLogin={handleLogin} />}
      {screen === "signup" && (
        <Signup {...p} onComplete={data => { setUserData(data); nav("home"); }} />
      )}
      {screen === "home" && userData && (
        <Home {...p} userData={userData} tasks={tasks} setTasks={setTasks}
          onInteract={onInteract} showGate={showGate}
          onGateAccept={() => { setShowGate(false); nav("profile"); }}
          onGateDismiss={() => setShowGate(false)}
        />
      )}
      {screen === "streak" && <Streak {...p} />}
      {screen === "recovery" && <Recovery {...p} />}
      {screen === "exams" && <Exams {...p} />}
      {screen === "plan" && <Plan {...p} />}
      {screen === "chat" && <Chat {...p} userData={userData} />}
      {screen === "profile" && <Profile {...p} userData={userData} />}
      {screen === "home" && !userData && <Landing {...p} />}
    </Shell>
  );
}
