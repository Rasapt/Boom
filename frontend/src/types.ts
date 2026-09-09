export type Screen =
  | "landing" | "login" | "signup" | "home"
  | "streak" | "recovery" | "exams" | "plan" | "chat" | "profile";

export interface SignupData {
  name: string;
  major: string;
  grade: string;
  examYear: string;
  targetRank: string;
  studyHours: string;
  testExams: string[];
  phone?: string;
}

export interface Task {
  id: number;
  type: "study" | "test" | "quiz" | "review" | "practice";
  title: string;
  description: string;
  subject: string;
  duration: string;
  scheduledTime: string;
  done: boolean;
}

export interface DayRecord {
  date: string;
  tasksTotal: number;
  tasksDone: number;
  xp: number;
}

export type NavFn = (screen: Screen) => void;
