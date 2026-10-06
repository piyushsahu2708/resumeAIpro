import { AnalysisHistoryItem, AnalysisResult, OptimizedResumeResponse, Resume, User } from "../types";

const TOKEN_KEY = "resumeai_pro_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.error) errorMsg = data.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  demoLogin: () =>
    request<{ token: string; user: User }>("/api/auth/demo", {
      method: "POST",
    }),

  getMe: () => request<{ user: User }>("/api/auth/me"),

  // Resumes
  getResumes: () => request<Resume[]>("/api/resumes"),

  getResume: (id: string) => request<Resume>(`/api/resumes/${id}`),

  createResume: (resume: Partial<Resume>) =>
    request<Resume>("/api/resumes", {
      method: "POST",
      body: JSON.stringify(resume),
    }),

  updateResume: (id: string, resume: Partial<Resume>) =>
    request<Resume>(`/api/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(resume),
    }),

  deleteResume: (id: string) =>
    request<{ success: boolean }>(`/api/resumes/${id}`, {
      method: "DELETE",
    }),

  parseResumeText: (rawText: string) =>
    request<Partial<Resume>>("/api/resumes/parse-text", {
      method: "POST",
      body: JSON.stringify({ rawText }),
    }),

  uploadResumeFile: (payload: { filename: string; fileContent?: string; rawText?: string }) =>
    request<Partial<Resume>>("/api/resume/upload", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Generate ATS-Optimized Single-Page Resume
  generateOptimizedResume: (payload: {
    resumeId?: string;
    resumeData?: Partial<Resume>;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    analysisId?: string;
    templateStyle?: string;
    fontScale?: string;
  }) =>
    request<OptimizedResumeResponse>("/api/resume/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Analysis
  analyze: (payload: {
    resumeId?: string;
    resumeData?: Partial<Resume>;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  }) =>
    request<AnalysisResult>("/api/analysis", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  analyzeResume: (payload: {
    resumeId?: string;
    resumeData?: Partial<Resume>;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  }) =>
    request<AnalysisResult>("/api/analysis", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  analyzeJd: (payload: { jobDescription: string; jobTitle?: string; companyName?: string }) =>
    request<{
      jobTitle: string;
      companyName: string;
      requiredSkills: string[];
      preferredSkills: string[];
      technologies: string[];
      responsibilities: string[];
      keywords: string[];
      experienceRequired: string;
    }>("/api/jd/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAnalysis: (id: string) => request<AnalysisResult>(`/api/analysis/${id}`),

  getHistory: () => request<AnalysisHistoryItem[]>("/api/analysis/history"),

  deleteAnalysis: (id: string) =>
    request<{ success: boolean }>(`/api/analysis/${id}`, {
      method: "DELETE",
    }),

  deleteHistoryItem: (id: string) =>
    request<{ success: boolean }>(`/api/analysis/${id}`, {
      method: "DELETE",
    }),

  rewriteBullet: (originalBullet: string, targetKeywords: string[], roleContext?: string) =>
    request<{ variations: string[] }>("/api/analysis/rewrite-bullet", {
      method: "POST",
      body: JSON.stringify({ originalBullet, targetKeywords, roleContext }),
    }),

  getSamples: () =>
    request<{
      sampleJDs: { id: string; title: string; company: string; description: string }[];
    }>("/api/samples"),
};
