export interface BoomChatRequest {
  question: string;
  history?: Array<{ role: string; content: string }>;
  top_k?: number;
  student?: Record<string, unknown>;
}

export interface StudyPlanRequest {
  months?: number;
  daily_hours?: number;
  major?: string;
  grade?: string;
  target_rank?: string;
  weak_subjects?: string[];
  strong_subjects?: string[];
  exam_date?: string;
  notes?: string;
  student?: Record<string, unknown>;
}

export interface BoomHealthResponse {
  status: string;
  app: string;
}

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Boom API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function checkBackendHealth() {
  return request<BoomHealthResponse>("/api/health");
}

export function sendBoomChat(payload: BoomChatRequest) {
  return request<{ answer?: string; sources?: unknown[] }>("/api/boom/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function generateStudyPlan(payload: StudyPlanRequest) {
  return request<{ plan?: string; sources?: unknown[] }>("/api/boom/study-plan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
