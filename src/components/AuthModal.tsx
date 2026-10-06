import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (!name.trim()) {
          setError("Please provide your name.");
          setLoading(false);
          return;
        }
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log in as demo user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "login" ? "Welcome back to ResumeAI Pro" : "Create your ResumeAI Account"}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {mode === "login"
              ? "Sign in to access your resumes, match scores, and analysis history."
              : "Register to unlock unlimited resume-to-JD comparisons and AI recommendations."}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                />
              </div>
              {mode === "register" && (
                <p className="text-[11px] text-slate-400 mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === "login" ? (
                <span>Sign In with Email</span>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Quick Demo Option */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              id="auth-quick-demo-btn"
              type="button"
              onClick={handleDemo}
              disabled={loading}
              className="w-full py-2 px-3 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Test Drive as Alex Morgan (Senior Fullstack Demo)</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="mt-4 text-center">
            {mode === "login" ? (
              <p className="text-xs text-slate-500">
                Don't have an account?{" "}
                <button
                  id="switch-to-register-btn"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode("register");
                  }}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already registered?{" "}
                <button
                  id="switch-to-login-btn"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode("login");
                  }}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
