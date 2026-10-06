import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Tag,
  Lightbulb,
  Copy,
  Check,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Layers,
  FileCheck,
  Award,
  ArrowRight,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { AnalysisResult } from "../types";
import { BulletOptimizerModal } from "./BulletOptimizerModal";

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  onReAnalyze: () => void;
  onNewAnalysis: () => void;
  onGenerateOptimizedResume?: (analysis: AnalysisResult) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onReAnalyze,
  onNewAnalysis,
  onGenerateOptimizedResume,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeKeywordFilter, setActiveKeywordFilter] = useState<string>("all");
  const [activeSkillFilter, setActiveSkillFilter] = useState<"all" | "matching" | "missing">("all");
  const [expandedRecId, setExpandedRecId] = useState<string | null>(analysis.recommendations?.[0]?.id || null);

  // Bullet optimizer modal state
  const [optimizerModalOpen, setOptimizerModalOpen] = useState(false);
  const [optimizerInitialBullet, setOptimizerInitialBullet] = useState("");

  // Trigger celebration confetti if score is strong (>= 80)
  useEffect(() => {
    if (analysis.matchScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [analysis.id, analysis.matchScore]);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleOpenOptimizer = (bullet: string) => {
    setOptimizerInitialBullet(bullet);
    setOptimizerModalOpen(true);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ResumeAI_Analysis_${analysis.jobTitle.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter missing keywords
  const filteredKeywords = (analysis.missingKeywords || []).filter((kw) => {
    if (activeKeywordFilter === "all") return true;
    return kw.category === activeKeywordFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 65) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-600 text-white shadow-emerald-500/25";
    if (score >= 65) return "from-amber-500 to-orange-500 text-white shadow-amber-500/25";
    return "from-rose-500 to-red-600 text-white shadow-rose-500/25";
  };

  return (
    <div id="analysis-results-view" className="space-y-8 animate-in fade-in duration-300">
      {/* 🚀 HIGHLIGHT CTA: GENERATE ATS-OPTIMIZED SINGLE-PAGE RESUME */}
      {onGenerateOptimizedResume && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Auto Resume Customizer
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Generate ATS-Optimized Single-Page Resume
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instantly rewrite and align your resume for <strong>{analysis.jobTitle}</strong>. Injects missing keywords, refines experience bullets with metrics, preserves your original structure, and locks strictly into a <strong>1-page printable layout</strong>.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <button
              id="generate-ats-resume-cta-btn"
              onClick={() => onGenerateOptimizedResume(analysis)}
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-600/40 transition-all flex items-center justify-center gap-2.5 group"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Generate 1-Page Resume</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Background subtle glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Top Banner with Title, Actions & Match Score */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                Evaluation Report
              </span>
              <span className="text-xs text-slate-400">
                Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {analysis.jobTitle} {analysis.companyName ? `at ${analysis.companyName}` : ""}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
              <span className="font-medium text-slate-700">Resume:</span> {analysis.resumeTitle}
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onGenerateOptimizedResume && (
              <button
                onClick={() => onGenerateOptimizedResume(analysis)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Generate 1-Page Resume
              </button>
            )}

            <button
              id="export-pdf-print-btn"
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>

            <button
              id="download-json-report-btn"
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>

            <button
              id="re-analyze-btn"
              onClick={onReAnalyze}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate
            </button>
          </div>
        </div>

        {/* Core Scorecard Matrix */}
        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Overall Match Score Dial */}
          <div className="md:col-span-4 bg-slate-50/80 rounded-2xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Overall Resume-JD Match
            </span>

            <div className="relative flex items-center justify-center my-2">
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-tr ${getScoreBadgeColor(
                  analysis.matchScore
                )} flex flex-col items-center justify-center shadow-lg transform transition-transform hover:scale-105`}
              >
                <span className="text-4xl font-extrabold tracking-tight">{analysis.matchScore}%</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                  {analysis.matchScore >= 80 ? "Strong Fit" : analysis.matchScore >= 65 ? "Moderate Fit" : "High Gap"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2 max-w-[220px]">
              {analysis.matchScore >= 80
                ? "Excellent profile alignment. Minor optimizations will secure top ATS rank."
                : analysis.matchScore >= 65
                ? "Good foundation with a few critical missing keywords and skill gaps."
                : "Significant skill and keyword gaps identified. Follow AI recommendations below."}
            </p>
          </div>

          {/* 5 Pillar Category Scores */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Technical Skills */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" /> Technical Skills
                </span>
                <span className="text-xs font-bold text-slate-900">{analysis.categoryScores?.technicalSkills || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.categoryScores?.technicalSkills || 0}%` }}
                />
              </div>
            </div>

            {/* Experience Alignment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Experience Alignment
                </span>
                <span className="text-xs font-bold text-slate-900">{analysis.categoryScores?.experienceAlignment || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.categoryScores?.experienceAlignment || 0}%` }}
                />
              </div>
            </div>

            {/* Keyword Density */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" /> Keyword Density
                </span>
                <span className="text-xs font-bold text-slate-900">{analysis.categoryScores?.keywordDensity || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.categoryScores?.keywordDensity || 0}%` }}
                />
              </div>
            </div>

            {/* Responsibilities Match */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-amber-600" /> Responsibilities Overlap
                </span>
                <span className="text-xs font-bold text-slate-900">{analysis.categoryScores?.responsibilitiesMatch || 0}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.categoryScores?.responsibilitiesMatch || 0}%` }}
                />
              </div>
            </div>

            {/* ATS Readiness */}
            <div className="sm:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> ATS Parseability & Scanner Index
                </span>
                <span className="text-xs font-bold text-indigo-700">{analysis.categoryScores?.atsReadiness || 0}%</span>
              </div>
              <div className="w-full bg-indigo-200/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.categoryScores?.atsReadiness || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Skill Matching & Missing Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Skills Matrix (Matching vs Missing) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Skills Alignment Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Skills identified in both JD and candidate profile vs unfulfilled requirements.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveSkillFilter("all")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeSkillFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600"
                }`}
              >
                All ({(analysis.matchingSkills?.length || 0) + (analysis.missingSkills?.length || 0)})
              </button>
              <button
                onClick={() => setActiveSkillFilter("matching")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeSkillFilter === "matching" ? "bg-white text-emerald-700 shadow-2xs font-semibold" : "text-slate-600"
                }`}
              >
                Matching ({analysis.matchingSkills?.length || 0})
              </button>
              <button
                onClick={() => setActiveSkillFilter("missing")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeSkillFilter === "missing" ? "bg-white text-rose-700 shadow-2xs font-semibold" : "text-slate-600"
                }`}
              >
                Missing ({analysis.missingSkills?.length || 0})
              </button>
            </div>
          </div>

          {/* Matching Skills Section */}
          {(activeSkillFilter === "all" || activeSkillFilter === "matching") && (
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Matching Skills (
                {analysis.matchingSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-2">
                {(analysis.matchingSkills || []).map((skill, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{skill.name}</span>
                    {skill.category && (
                      <span className="text-[10px] bg-emerald-100/70 text-emerald-700 font-normal px-1.5 py-0.2 rounded-md">
                        {skill.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills Section */}
          {(activeSkillFilter === "all" || activeSkillFilter === "missing") && (
            <div className="pt-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Missing / Unrepresented Skills (
                {analysis.missingSkills?.length || 0})
              </span>
              <div className="space-y-2">
                {(analysis.missingSkills || []).map((skill, i) => (
                  <div
                    key={i}
                    className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-900">{skill.name}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            skill.importance === "critical"
                              ? "bg-rose-200 text-rose-900 font-bold"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {skill.importance}
                        </span>
                      </div>
                      <p className="text-xs text-rose-800/80 mt-1 leading-relaxed">{skill.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Missing Keywords & ATS Impact */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> High-Impact Missing Keywords
              </h2>
              <p className="text-xs text-slate-500">
                Click any keyword to copy or see where to naturally inject it into your resume.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {["all", "technologies", "methodologies", "domain"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveKeywordFilter(cat)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                  activeKeywordFilter === cat
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Keywords Tag Grid */}
          <div className="space-y-3">
            {filteredKeywords.map((kw, i) => (
              <div
                key={i}
                className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">{kw.keyword}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                        kw.atsImpact === "high"
                          ? "bg-rose-100 text-rose-800"
                          : kw.atsImpact === "medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {kw.atsImpact} ATS Impact
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{kw.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{kw.suggestedContext}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(kw.keyword, `kw-${i}`)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 bg-white rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 text-xs font-medium flex items-center gap-1"
                    title="Copy keyword"
                  >
                    {copiedSection === `kw-${i}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {filteredKeywords.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-6">No keywords in this category.</p>
            )}
          </div>
        </div>
      </div>

      {/* Skill Gaps Breakdown */}
      {(analysis.skillGaps || []).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Skill Gap Diagnosis</h2>
          </div>
          <p className="text-xs text-slate-500">
            Key areas where the candidate profile diverges from the required scope of responsibilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {(analysis.skillGaps || []).map((gap, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{gap.area}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      gap.severity === "high"
                        ? "bg-rose-100 text-rose-800"
                        : gap.severity === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {gap.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{gap.description}</p>
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-indigo-700 block mb-0.5">Recommended Action:</span>
                  <p className="text-xs text-slate-600">{gap.learningRecommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Resume Recommendations & Before-After Rewrites */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Actionable AI Resume Recommendations</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted rewrites engineered with quantifiable metrics and natural keyword placement.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {(analysis.recommendations || []).map((rec, i) => {
            const isExpanded = expandedRecId === rec.id || (!expandedRecId && i === 0);

            return (
              <div
                key={rec.id || i}
                className={`rounded-xl border transition-all ${
                  isExpanded ? "border-indigo-300 bg-indigo-50/30 shadow-xs" : "border-slate-200 bg-white"
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                  className="w-full text-left p-4.5 flex items-center justify-between gap-3 focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        rec.priority === "must_fix"
                          ? "bg-rose-100 text-rose-800"
                          : rec.priority === "recommended"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900">{rec.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{rec.explanation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        rec.priority === "must_fix"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {rec.priority.replace("_", " ")}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Accordion Body: Side-by-Side Diff */}
                {isExpanded && (
                  <div className="px-4.5 pb-4.5 pt-1 space-y-3 border-t border-slate-100">
                    {rec.originalSnippet && (
                      <div className="bg-slate-100/80 p-3 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Current / Original Content
                        </span>
                        <p className="text-xs text-slate-700 font-normal leading-relaxed">{rec.originalSnippet}</p>
                      </div>
                    )}

                    {rec.suggestedRevision && (
                      <div className="bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI Optimized Rewrite
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(rec.suggestedRevision!, `rec-${i}`)}
                              className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300 transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              {copiedSection === `rec-${i}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Bullet</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenOptimizer(rec.suggestedRevision!)}
                              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <Sparkles className="w-3 h-3" /> Customize in Optimizer
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm font-medium text-emerald-950 leading-relaxed">
                          {rec.suggestedRevision}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience & Seniority Verdict + ATS Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Experience Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Experience & Seniority Evaluation</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Target JD Requirement</span>
              <p className="text-xs font-bold text-slate-800">{analysis.experienceComparison?.requiredYears || "3+ years"}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Candidate Demonstrated</span>
              <p className="text-xs font-bold text-indigo-700">{analysis.experienceComparison?.candidateYears || "5+ years"}</p>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-indigo-900 block mb-1">Recruiter Verdict:</span>
            {analysis.experienceComparison?.verdict || "Candidate demonstrates strong seniority and relevant leadership."}
          </div>
        </div>

        {/* Tailored Cover Letter Starter */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Tailored Pitch / Cover Letter Starter</h2>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(analysis.tailoredCoverLetterStarter, "cover-letter")}
              className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-md border border-indigo-200 flex items-center gap-1"
            >
              {copiedSection === "cover-letter" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Pitch</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-serif italic max-h-48 overflow-y-auto">
            {analysis.tailoredCoverLetterStarter}
          </div>
        </div>
      </div>

      {/* Bottom CTA to start another match */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold">Ready to analyze another position?</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Test against another role or update your resume bullets to verify your improved match score.
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Compare Another JD
        </button>
      </div>

      {/* Bullet Optimizer Modal */}
      {optimizerModalOpen && (
        <BulletOptimizerModal
          isOpen={optimizerModalOpen}
          onClose={() => setOptimizerModalOpen(false)}
          initialBullet={optimizerInitialBullet}
          suggestedKeywords={(analysis.missingKeywords || []).map((k) => k.keyword)}
          roleContext={analysis.jobTitle}
        />
      )}
    </div>
  );
};
