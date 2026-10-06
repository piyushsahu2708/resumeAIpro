import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { JobDescriptionInput } from "./components/JobDescriptionInput";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { ResumeManager } from "./components/ResumeManager";
import { HistoryView } from "./components/HistoryView";
import { AuthModal } from "./components/AuthModal";
import { ResumeEditorModal } from "./components/ResumeEditorModal";
import { OptimizedResumeStudio } from "./components/OptimizedResumeStudio";
import { ResumeUploadModal } from "./components/ResumeUploadModal";
import { Resume, AnalysisResult, AnalysisHistoryItem, OptimizedResumeResponse } from "./types";
import { api } from "./lib/api";
import { Sparkles, FileText, CheckCircle2, RefreshCw, AlertCircle, Upload } from "lucide-react";

function MainApp() {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState<"analyze" | "resumes" | "history">("analyze");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // Resumes state
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [isResumeEditorOpen, setIsResumeEditorOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(false);

  // Analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(1);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Single-Page Optimized Resume State
  const [optimizedResumeData, setOptimizedResumeData] = useState<OptimizedResumeResponse | null>(null);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  // History state
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch initial user data
  useEffect(() => {
    if (token) {
      loadResumes();
      loadHistory();
    }
  }, [token]);

  const loadResumes = async () => {
    setResumesLoading(true);
    try {
      const data = await api.getResumes();
      setResumes(data || []);
      if (data && data.length > 0 && !selectedResumeId) {
        setSelectedResumeId(data[0].id);
      }
    } catch (err: any) {
      console.error("Failed to load resumes:", err);
    } finally {
      setResumesLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data || []);
    } catch (err: any) {
      console.error("Failed to load history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleCreateResume = async (payload: Partial<Resume>) => {
    try {
      const newResume = await api.createResume(payload);
      setResumes([newResume, ...(resumes || [])]);
      setSelectedResumeId(newResume.id);
    } catch (err: any) {
      alert("Failed to create resume: " + err.message);
    }
  };

  const handleUpdateResume = async (id: string, payload: Partial<Resume>) => {
    try {
      const updated = await api.updateResume(id, payload);
      setResumes((resumes || []).map((r) => (r.id === id ? updated : r)));
    } catch (err: any) {
      alert("Failed to update resume: " + err.message);
    }
  };

  const handleDeleteResume = async (id: string) => {
    try {
      await api.deleteResume(id);
      const remaining = (resumes || []).filter((r) => r.id !== id);
      setResumes(remaining);
      if (selectedResumeId === id && remaining.length > 0) {
        setSelectedResumeId(remaining[0].id);
      }
    } catch (err: any) {
      alert("Failed to delete resume: " + err.message);
    }
  };

  const handleRunAnalysis = async (payload: {
    resumeId: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  }) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStep(1);

    // Multi-step progress animation simulation while waiting for Gemini AI
    const timer1 = setTimeout(() => setAnalysisStep(2), 1200);
    const timer2 = setTimeout(() => setAnalysisStep(3), 2800);
    const timer3 = setTimeout(() => setAnalysisStep(4), 4200);

    try {
      const result = await api.analyzeResume(payload);
      setCurrentAnalysis(result);
      // Reload history
      loadHistory();
      setActiveTab("analyze");
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsAnalyzing(false);
    }
  };

  const handleGenerateOptimizedResume = async (analysis: AnalysisResult) => {
    setIsGeneratingResume(true);
    setAnalysisError(null);

    try {
      const result = await api.generateOptimizedResume({
        resumeId: analysis.resumeId,
        jobTitle: analysis.jobTitle,
        companyName: analysis.companyName,
        jobDescription: analysis.jobDescription,
        analysisId: analysis.id,
      });

      setOptimizedResumeData(result);
    } catch (err: any) {
      alert("Failed to generate optimized resume: " + err.message);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const handleRegenerateWithStyle = async (templateStyle: string) => {
    if (!currentAnalysis) return;
    try {
      const result = await api.generateOptimizedResume({
        resumeId: currentAnalysis.resumeId,
        jobTitle: currentAnalysis.jobTitle,
        companyName: currentAnalysis.companyName,
        jobDescription: currentAnalysis.jobDescription,
        analysisId: currentAnalysis.id,
        templateStyle,
      });
      setOptimizedResumeData(result);
    } catch (err: any) {
      alert("Failed to regenerate: " + err.message);
    }
  };

  const handleSaveOptimizedToLibrary = async (newResume: Resume) => {
    await handleCreateResume(newResume);
  };

  const handleSelectHistoryAnalysis = async (id: string) => {
    try {
      const result = await api.getAnalysis(id);
      setCurrentAnalysis(result);
      setActiveTab("analyze");
    } catch (err: any) {
      alert("Failed to load past analysis: " + err.message);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory((history || []).filter((h) => h.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    } catch (err: any) {
      alert("Failed to delete history item: " + err.message);
    }
  };

  const activeResume = (resumes || []).find((r) => r.id === selectedResumeId) || resumes?.[0] || null;

  // Render Full Screen Studio if an optimized resume is active
  if (optimizedResumeData) {
    return (
      <OptimizedResumeStudio
        optimizedData={optimizedResumeData}
        onSaveToLibrary={handleSaveOptimizedToLibrary}
        onClose={() => setOptimizedResumeData(null)}
        onRegenerate={handleRegenerateWithStyle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resumes={resumes}
        selectedResumeId={selectedResumeId}
        onSelectResume={(id) => setSelectedResumeId(id)}
        onOpenAuthModal={handleOpenAuth}
        onNewResume={() => {
          setIsResumeEditorOpen(true);
        }}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* Loading / Generating 1-Page Resume Overlay */}
        {isGeneratingResume && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/50 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Crafting Your ATS-Optimized 1-Page Resume
            </h2>
            <p className="text-sm text-slate-400 max-w-md">
              Injecting high-impact keywords, rewriting experience bullets with quantified metrics, and locking strictly to a single printable page...
            </p>
          </div>
        )}

        {/* Loading / Analyzing Overlay screen */}
        {isAnalyzing && (
          <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/30 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Evaluating Resume & Job Description</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Our Gemini 3.7 Flash intelligence engine is cross-examining your competencies against target JD requirements.
              </p>
            </div>

            {/* Step Progress Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md mx-auto text-left shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    analysisStep >= 1 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {analysisStep > 1 ? "✓" : "1"}
                </div>
                <span className={`text-xs ${analysisStep >= 1 ? "font-bold text-slate-900" : "text-slate-400"}`}>
                  Extracting candidate technical profile & work experience...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    analysisStep >= 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {analysisStep > 2 ? "✓" : "2"}
                </div>
                <span className={`text-xs ${analysisStep >= 2 ? "font-bold text-slate-900" : "text-slate-400"}`}>
                  Parsing required skills, qualifications, and core JD keywords...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    analysisStep >= 3 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {analysisStep > 3 ? "✓" : "3"}
                </div>
                <span className={`text-xs ${analysisStep >= 3 ? "font-bold text-slate-900" : "text-slate-400"}`}>
                  Calculating ATS parseability & semantic gap matrix...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    analysisStep >= 4 ? "bg-indigo-600 text-white animate-pulse" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  4
                </div>
                <span className={`text-xs ${analysisStep >= 4 ? "font-bold text-indigo-700" : "text-slate-400"}`}>
                  Synthesizing quantifiable bullet rewrites & cover pitch...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Match & Analysis */}
        {!isAnalyzing && activeTab === "analyze" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {analysisError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{analysisError}</span>
                </div>
                <button
                  onClick={() => setAnalysisError(null)}
                  className="text-xs text-rose-700 hover:text-rose-900 font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {currentAnalysis ? (
              <AnalysisDashboard
                analysis={currentAnalysis}
                onReAnalyze={() => {
                  if (activeResume) {
                    handleRunAnalysis({
                      resumeId: activeResume.id,
                      jobTitle: currentAnalysis.jobTitle,
                      companyName: currentAnalysis.companyName,
                      jobDescription: currentAnalysis.jobDescription,
                    });
                  }
                }}
                onNewAnalysis={() => setCurrentAnalysis(null)}
                onGenerateOptimizedResume={handleGenerateOptimizedResume}
              />
            ) : (
              <div className="space-y-8">
                {/* Hero Feature Intro */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-900/40">
                  <div className="max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> Next-Gen ATS Optimization Engine
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Compare Your Resume Against Any Job Description in Seconds.
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                      Uncover missing keywords, benchmark against senior recruiter benchmarks, and generate tailored ATS-compliant 1-page resumes without modifying your original design.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <span>Upload Resume (PDF / DOCX)</span>
                      </button>
                      <button
                        onClick={() => setIsResumeEditorOpen(true)}
                        className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Create / Edit Resume
                      </button>
                    </div>
                  </div>
                </div>

                {/* Job Description Input Component */}
                <JobDescriptionInput
                  activeResume={activeResume}
                  onAnalyze={handleRunAnalysis}
                  isAnalyzing={isAnalyzing}
                  onOpenResumeEditor={() => setIsResumeEditorOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Resume Manager */}
        {!isAnalyzing && activeTab === "resumes" && (
          <ResumeManager
            resumes={resumes}
            selectedResumeId={selectedResumeId}
            onSelectResume={(id) => setSelectedResumeId(id)}
            onCreateResume={handleCreateResume}
            onUpdateResume={handleUpdateResume}
            onDeleteResume={handleDeleteResume}
            onGoToAnalyze={() => {
              setCurrentAnalysis(null);
              setActiveTab("analyze");
            }}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        )}

        {/* Tab 3: History View */}
        {!isAnalyzing && activeTab === "history" && (
          <HistoryView
            history={history}
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onDeleteAnalysis={handleDeleteHistoryItem}
            onNewAnalysis={() => {
              setCurrentAnalysis(null);
              setActiveTab("analyze");
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 ResumeAI Pro • Intelligent Job Matching & ATS Optimizer</p>
          <p className="text-[11px] text-slate-400">
            Powered by Google Gemini 3.7 Flash LLM architecture
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Standalone Resume Editor Modal */}
      {isResumeEditorOpen && (
        <ResumeEditorModal
          isOpen={isResumeEditorOpen}
          onClose={() => setIsResumeEditorOpen(false)}
          onSave={async (payload) => {
            if (activeResume) {
              await handleUpdateResume(activeResume.id, payload);
            } else {
              await handleCreateResume(payload);
            }
          }}
          initialResume={activeResume}
        />
      )}

      {/* Resume File Upload Modal */}
      {isUploadModalOpen && (
        <ResumeUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={(newResume) => {
            setResumes([newResume, ...(resumes || [])]);
            setSelectedResumeId(newResume.id);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
