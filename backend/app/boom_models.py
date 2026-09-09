from datetime import datetime, date
from typing import Optional
from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .auth.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    name: Mapped[str] = mapped_column(String, default="دانش‌آموز")
    major: Mapped[str] = mapped_column(String, default="ریاضی فیزیک")
    grade: Mapped[str] = mapped_column(String, default="دوازدهم (سال کنکور)")
    exam_year: Mapped[str] = mapped_column(String, default="")
    target_rank: Mapped[str] = mapped_column(String, default="")
    study_hours: Mapped[str] = mapped_column(String, default="")
    test_exams: Mapped[str] = mapped_column(Text, default="[]")
    weak_subjects: Mapped[str] = mapped_column(Text, default="[]")
    strong_subjects: Mapped[str] = mapped_column(Text, default="[]")

class StudyTask(Base):
    __tablename__ = "study_tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String)
    subject: Mapped[str] = mapped_column(String, default="")
    minutes: Mapped[int] = mapped_column(Integer, default=60)
    task_date: Mapped[date] = mapped_column(Date, default=date.today)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

class StudySession(Base):
    __tablename__ = "study_sessions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    minutes: Mapped[int] = mapped_column(Integer, default=0)
    subject: Mapped[str] = mapped_column(String, default="")

class ExamResult(Base):
    __tablename__ = "exam_results"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String)
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    exam_date: Mapped[date] = mapped_column(Date, default=date.today)
    notes: Mapped[str] = mapped_column(Text, default="")
