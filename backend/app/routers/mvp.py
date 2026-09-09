import json
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from ..auth.database import get_db, User
from ..auth.security import decode_token
from ..boom_models import StudentProfile, StudyTask, StudySession, ExamResult

router = APIRouter(prefix="/api/mvp", tags=["mvp"])
oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(401, "Invalid or expired token")
    user = db.get(User, int(payload["sub"]))
    if not user:
        raise HTTPException(401, "User not found")
    return user

class ProfileIn(BaseModel):
    name: str = "دانش‌آموز"
    major: str = "ریاضی فیزیک"
    grade: str = "دوازدهم (سال کنکور)"
    examYear: str = ""
    targetRank: str = ""
    studyHours: str = ""
    testExams: list[str] = []
    weakSubjects: list[str] = []
    strongSubjects: list[str] = []

class TaskIn(BaseModel):
    title: str
    subject: str = ""
    minutes: int = Field(default=60, ge=1, le=1440)
    task_date: date = Field(default_factory=date.today)

class SessionIn(BaseModel):
    minutes: int = Field(ge=1, le=1440)
    subject: str = ""

class ExamIn(BaseModel):
    title: str
    score: float | None = None
    rank: int | None = None
    exam_date: date = Field(default_factory=date.today)
    notes: str = ""

@router.get("/me")
def me(user=Depends(current_user), db: Session = Depends(get_db)):
    p = db.query(StudentProfile).filter_by(user_id=user.id).first()
    tasks = db.query(StudyTask).filter_by(user_id=user.id).order_by(StudyTask.task_date, StudyTask.id).all()
    sessions = db.query(StudySession).filter_by(user_id=user.id).order_by(StudySession.started_at.desc()).limit(100).all()
    exams = db.query(ExamResult).filter_by(user_id=user.id).order_by(ExamResult.exam_date.desc()).all()
    return {"profile": profile_out(p) if p else None, "tasks": [task_out(t) for t in tasks], "sessions": [session_out(s) for s in sessions], "exams": [exam_out(e) for e in exams], "stats": stats(tasks, sessions)}

def profile_out(p):
    return {"name":p.name,"major":p.major,"grade":p.grade,"examYear":p.exam_year,"targetRank":p.target_rank,"studyHours":p.study_hours,"testExams":json.loads(p.test_exams or "[]"),"weakSubjects":json.loads(p.weak_subjects or "[]"),"strongSubjects":json.loads(p.strong_subjects or "[]")}
def task_out(t): return {"id":t.id,"title":t.title,"subject":t.subject,"minutes":t.minutes,"task_date":t.task_date.isoformat(),"completed":t.completed}
def session_out(s): return {"id":s.id,"minutes":s.minutes,"subject":s.subject,"started_at":s.started_at.isoformat()}
def exam_out(e): return {"id":e.id,"title":e.title,"score":e.score,"rank":e.rank,"exam_date":e.exam_date.isoformat(),"notes":e.notes}
def stats(tasks,sessions):
    today=date.today(); today_tasks=[t for t in tasks if t.task_date==today]
    return {"today_minutes":sum(s.minutes for s in sessions if s.started_at.date()==today),"today_completed":sum(t.completed for t in today_tasks),"today_tasks":len(today_tasks),"total_minutes":sum(s.minutes for s in sessions),"completed_tasks":sum(t.completed for t in tasks),"task_count":len(tasks)}

@router.put("/profile")
def save_profile(data: ProfileIn, user=Depends(current_user), db: Session=Depends(get_db)):
    p=db.query(StudentProfile).filter_by(user_id=user.id).first()
    if not p: p=StudentProfile(user_id=user.id); db.add(p)
    p.name=data.name; p.major=data.major; p.grade=data.grade; p.exam_year=data.examYear; p.target_rank=data.targetRank; p.study_hours=data.studyHours
    p.test_exams=json.dumps(data.testExams, ensure_ascii=False); p.weak_subjects=json.dumps(data.weakSubjects, ensure_ascii=False); p.strong_subjects=json.dumps(data.strongSubjects, ensure_ascii=False)
    db.commit(); db.refresh(p); return profile_out(p)

@router.post("/tasks")
def create_task(data: TaskIn,user=Depends(current_user),db:Session=Depends(get_db)):
    t=StudyTask(user_id=user.id,title=data.title,subject=data.subject,minutes=data.minutes,task_date=data.task_date); db.add(t); db.commit(); db.refresh(t); return task_out(t)

@router.patch("/tasks/{task_id}/complete")
def complete_task(task_id:int,user=Depends(current_user),db:Session=Depends(get_db)):
    t=db.query(StudyTask).filter_by(id=task_id,user_id=user.id).first()
    if not t: raise HTTPException(404,"Task not found")
    t.completed=not t.completed; db.commit(); return task_out(t)

@router.post("/sessions")
def add_session(data:SessionIn,user=Depends(current_user),db:Session=Depends(get_db)):
    s=StudySession(user_id=user.id,minutes=data.minutes,subject=data.subject); db.add(s); db.commit(); db.refresh(s); return session_out(s)

@router.post("/exams")
def add_exam(data:ExamIn,user=Depends(current_user),db:Session=Depends(get_db)):
    e=ExamResult(user_id=user.id,title=data.title,score=data.score,rank=data.rank,exam_date=data.exam_date,notes=data.notes); db.add(e); db.commit(); db.refresh(e); return exam_out(e)
