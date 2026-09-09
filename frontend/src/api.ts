export interface SignupData { name:string; major:string; grade:string; examYear:string; targetRank:string; studyHours:string; testExams:string[]; phone?:string; weakSubjects?:string[]; strongSubjects?:string[] }
export interface Task { id:number; title:string; subject:string; minutes:number; task_date:string; completed:boolean }
export interface MVPData { profile: SignupData|null; tasks:Task[]; sessions:Array<{id:number;minutes:number;subject:string;started_at:string}>; exams:Array<{id:number;title:string;score:number|null;rank:number|null;exam_date:string;notes:string}>; stats:{today_minutes:number;today_completed:number;today_tasks:number;total_minutes:number;completed_tasks:number;task_count:number} }

const API_BASE=(import.meta.env.VITE_API_URL as string|undefined)?.replace(/\/$/,"")??"";
function token(){return localStorage.getItem("boom-token")}
async function request<T>(path:string, init:RequestInit={}):Promise<T>{
 const headers:Record<string,string>={"Content-Type":"application/json",...(init.headers as Record<string,string>||{})};
 const t=token(); if(t) headers.Authorization=`Bearer ${t}`;
 const r=await fetch(`${API_BASE}${path}`,{...init,headers});
 if(!r.ok) throw new Error(await r.text()||`API ${r.status}`); return r.json();
}
export function checkBackendHealth(){return request<{status:string;app:string}>("/api/health")}
export function register(username:string,password:string){return request<{access_token:string}>("/api/auth/register",{method:"POST",body:JSON.stringify({username,password})})}
export function login(username:string,password:string){const body=new URLSearchParams({username,password});return request<{access_token:string}>("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body})}
export function getMVP(){return request<MVPData>("/api/mvp/me")}
export function saveProfile(profile:SignupData){return request<SignupData>("/api/mvp/profile",{method:"PUT",body:JSON.stringify(profile)})}
export function createTask(task:{title:string;subject?:string;minutes:number;task_date?:string}){return request<Task>("/api/mvp/tasks",{method:"POST",body:JSON.stringify(task)})}
export function toggleTask(id:number){return request<Task>(`/api/mvp/tasks/${id}/complete`,{method:"PATCH"})}
export function addStudySession(minutes:number,subject=""){return request("/api/mvp/sessions",{method:"POST",body:JSON.stringify({minutes,subject})})}
export function addExam(exam:object){return request("/api/mvp/exams",{method:"POST",body:JSON.stringify(exam)})}
export function sendBoomChat(payload:object){return request<{answer?:string;sources?:unknown[]}>("/api/boom/chat",{method:"POST",body:JSON.stringify(payload)})}
export function generateStudyPlan(payload:object){return request<{plan?:string;sources?:unknown[]}>("/api/boom/study-plan",{method:"POST",body:JSON.stringify(payload)})}
