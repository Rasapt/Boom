from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import chat, documents
from .auth.database import Base, engine
from .auth.router import router as auth_router
from app.routers.boom_ai import router as boom_ai_router
from app.routers.mvp import router as mvp_router

settings = get_settings()
Base.metadata.create_all(bind=engine)
app = FastAPI(title="Boom", description="Boom Konkoor AI", version="1.0.0")
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")] if settings.CORS_ORIGINS != "*" else ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(chat.router)
app.include_router(documents.router)
app.include_router(auth_router)
app.include_router(boom_ai_router)
app.include_router(mvp_router)

@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": "Boom"}
