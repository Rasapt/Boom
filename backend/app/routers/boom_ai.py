from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.rag.pipeline import answer_question
from app.rag.embeddings import get_embedding_model
from app.rag.hybrid_search import get_hybrid_search
from app.rag.llm import get_llm_client
from app.config import get_settings
from app.schemas import ChatMessage

router = APIRouter(prefix="/api/boom", tags=["boom-ai"])


class BoomChatRequest(BaseModel):
    question: str
    history: Optional[List[dict]] = None
    top_k: int = 5
    student: Optional[dict] = None


class StudyPlanRequest(BaseModel):
    months: int = Field(default=6, ge=1, le=24)
    daily_hours: float = Field(default=4, ge=0.5, le=16)
    major: str = "ریاضی فیزیک"
    grade: str = "دوازدهم (سال کنکور)"
    target_rank: str = "زیر ۵٬۰۰۰"
    weak_subjects: List[str] = []
    strong_subjects: List[str] = []
    exam_date: Optional[str] = None
    notes: str = ""
    student: Optional[dict] = None


def _student_context(student: Optional[dict]) -> str:
    if not student:
        return "اطلاعات پروفایل دانش‌آموز در دسترس نیست."
    return "\n".join(f"- {k}: {v}" for k, v in student.items())


@router.post("/chat")
def boom_chat(request: BoomChatRequest):
    """Prototype chat endpoint for Boom's current frontend.

    It intentionally uses demo user 1 because Boom's current UI has a local
    demo login rather than a connected authentication flow. Production should
    replace this with get_current_user and the authenticated user's id.
    """
    settings = get_settings()
    history = [ChatMessage(**h) for h in (request.history or [])]
    result = answer_question(
        question=request.question,
        user_id=settings.DEMO_USER_ID,
        history=history,
        top_k=request.top_k,
        student=request.student,
    )
    return result


@router.post("/study-plan")
def generate_study_plan(request: StudyPlanRequest):
    """Generate a multi-month Konkoor plan using RAG + the LLM.

    RAG grounds the plan in the indexed curriculum/resources, while the LLM
    turns the retrieved material and student constraints into a usable plan.
    """
    settings = get_settings()
    student = request.student or {}
    weak = request.weak_subjects or student.get("weakSubjects", []) or student.get("weak_subjects", [])
    strong = request.strong_subjects or student.get("strongSubjects", []) or student.get("strong_subjects", [])
    exam_year = student.get("examYear", "")
    tests = student.get("testExams", [])
    search_text = (
        f"برنامه مطالعاتی کنکور {request.major} {request.grade} سال {exam_year} برای {request.months} ماه، "
        f"هدف {request.target_rank}، روزانه {request.daily_hours} ساعت، "
        f"درس‌های ضعیف: {', '.join(weak) or 'نامشخص'}، درس‌های قوی: {', '.join(strong) or 'نامشخص'}، "
        f"آزمون‌های آزمایشی: {', '.join(tests) if isinstance(tests, list) else tests}"
    )
    embedder = get_embedding_model()
    search = get_hybrid_search()
    q = embedder.embed_query(search_text)
    chunks = search.search(
        query_text=search_text,
        query_embedding=q,
        user_id=settings.DEMO_USER_ID,
        top_k=8,
    )
    context = "\n\n".join(
        f"[منبع {i+1}] {c['document_name']}\n{c['content']}"
        for i, c in enumerate(chunks)
    )
    prompt = f"""تو «بوم» هستی؛ مربی هوشمند کنکور.
یک برنامه مطالعاتی واقع‌بینانه برای دانش‌آموز تولید کن.
برنامه باید از سطح ماهانه شروع شود و برای هر ماه هدف، مباحث، مرور و آزمون مشخص کند.
روزانه بیشتر از زمان اعلام‌شده برنامه‌ریزی نکن.
درس‌های ضعیف را با تکرار و تست بیشتر در اولویت قرار بده.
اگر منابع مرجع کافی نیستند، بر اساس دانش عمومی برنامه‌ریزی نکن و محدودیت را شفاف بگو.
پاسخ فارسی و ساختاریافته باشد.

اطلاعات دانش‌آموز:
{_student_context({**request.model_dump(exclude={"student"}), **student})}

متن‌های مرجع:
{context or 'منبع مرتبطی پیدا نشد.'}

خروجی را با این ساختار بده:
1. خلاصه استراتژی
2. ماه ۱ تا ماه {request.months}: برای هر ماه هدف، مباحث اصلی، تعداد روزهای تست/مرور و خروجی قابل اندازه‌گیری
3. الگوی هفتگی پیشنهادی
4. قوانین جبران عقب‌افتادگی
"""
    answer = get_llm_client().generate([{"role": "user", "content": prompt}], max_tokens=1800)
    if not answer:
        return {"plan": "مدل زبانی پاسخ نداد. اتصال Ollama و نام مدل را بررسی کن.", "sources": chunks, "error": "llm_unavailable"}
    return {"plan": answer, "sources": chunks}
