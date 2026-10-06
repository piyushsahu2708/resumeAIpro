import React from "react";
import { Sparkles, FileText, History, User as UserIcon, LogOut, CheckCircle2, ChevronDown, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Resume } from "../types";

interface NavbarProps {
  activeTab: "analyze" | "resumes" | "history";
  setActiveTab: (tab: "analyze" | "resumes" | "history") => void;
  resumes: Resume[];
  selectedResumeId: string;
  onSelectResume: (id: string) => void;
  onOpenAuthModal: (mode: "login" | "register") => void;
  onNewResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  resumes = [],
  selectedResumeId,
  onSelectResume,
  onOpenAuthModal,
  onNewResume,
}) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [resumeDropdownOpen, setResumeDropdownOpen] = React.useState(false);

  const safeResumes = resumes || [];
  const selectedResume = safeResumes.find((r) => r.id === selectedResumeId) || safeResumes[0] || null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab("analyze")}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">ResumeAI</span>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-1.5 py-0.5 rounded-md">PRO</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">AI Resume & Job Matching</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-tab-analyze"
              onClick={() => setActiveTab("analyze")}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === "analyze"
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyzer</span>
            </button>

            <button
              id="nav-tab-resumes"
              onClick={() => setActiveTab("resumes")}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === "resumes"
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resumes</span>
              {safeResumes.length > 0 && (
                <span className="ml-1 text-xs bg-slate-200 text-slate-700 rounded-full px-1.5 py-0.2">
                  {safeResumes.length}
                </span>
              )}
            </button>

            <button
              id="nav-tab-history"
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === "history"
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Analysis History</span>
            </button>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Active Resume Selector Dropdown */}
          {safeResumes.length > 0 && (
            <div className="relative">
              <button
                id="active-resume-dropdown-btn"
                onClick={() => setResumeDropdownOpen(!resumeDropdownOpen)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                title="Active Resume for Analysis"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[160px] truncate">{selectedResume?.title || "Select Resume"}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {resumeDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setResumeDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Resume</span>
                    <button
                      id="create-resume-nav-btn"
                      onClick={() => {
                        setResumeDropdownOpen(false);
                        onNewResume();
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" /> New
                    </button>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {safeResumes.map((r) => (
                      <button
                        key={r.id}
                        id={`select-resume-${r.id}`}
                        onClick={() => {
                          onSelectResume(r.id);
                          setResumeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          r.id === selectedResumeId ? "bg-indigo-50/70 text-indigo-900 font-medium" : "text-slate-700"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-medium truncate">{r.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{r.targetRole || "General"}</p>
                        </div>
                        {r.id === selectedResumeId && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Account Controls */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate text-xs">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ JWT Authenticated
                    </span>
                  </div>
                  <button
                    id="switch-demo-profile-btn"
                    onClick={() => {
                      demoLogin();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Switch to Alex Morgan (Demo)</span>
                  </button>
                  <button
                    id="sign-out-btn"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={() => onOpenAuthModal("login")}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Log In
              </button>
              <button
                id="header-register-btn"
                onClick={() => onOpenAuthModal("register")}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-white px-2 py-1.5">
        <button
          onClick={() => setActiveTab("analyze")}
          className={`flex-1 py-1.5 text-xs font-medium text-center rounded-md ${
            activeTab === "analyze" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600"
          }`}
        >
          Analyzer
        </button>
        <button
          onClick={() => setActiveTab("resumes")}
          className={`flex-1 py-1.5 text-xs font-medium text-center rounded-md ${
            activeTab === "resumes" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600"
          }`}
        >
          Resumes ({safeResumes.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-1.5 text-xs font-medium text-center rounded-md ${
            activeTab === "history" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600"
          }`}
        >
          History
        </button>
      </div>
    </header>
  );
};
