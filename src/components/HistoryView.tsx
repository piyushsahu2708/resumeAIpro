import React, { useState } from "react";
import { History, Search, Sparkles, Trash2, ArrowRight, Calendar, AlertTriangle, Building, Briefcase, FileText } from "lucide-react";
import { AnalysisHistoryItem } from "../types";

interface HistoryViewProps {
  history: AnalysisHistoryItem[];
  onSelectAnalysis: (id: string) => void;
  onDeleteAnalysis: (id: string) => Promise<void>;
  onNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history = [],
  onSelectAnalysis,
  onDeleteAnalysis,
  onNewAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const safeHistory = history || [];

  const filteredHistory = safeHistory.filter((item) => {
    const matchesSearch =
      (item.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.resumeTitle || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (scoreFilter === "high") return item.matchScore >= 80;
    if (scoreFilter === "medium") return item.matchScore >= 65 && item.matchScore < 80;
    if (scoreFilter === "low") return item.matchScore < 65;

    return true;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 65) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analysis History</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past evaluation records, match scores, and track your resume optimization progress.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" /> New Job Analysis
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, or resume..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs font-medium">
          <span className="text-slate-400 text-xs mr-1 hidden md:inline">Filter:</span>
          <button
            onClick={() => setScoreFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              scoreFilter === "all" ? "bg-indigo-600 text-white font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setScoreFilter("high")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              scoreFilter === "high" ? "bg-emerald-600 text-white font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Strong Fit (≥80%)
          </button>
          <button
            onClick={() => setScoreFilter("medium")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              scoreFilter === "medium" ? "bg-amber-600 text-white font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Moderate (65-79%)
          </button>
          <button
            onClick={() => setScoreFilter("low")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              scoreFilter === "low" ? "bg-rose-600 text-white font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            High Gaps (&lt;65%)
          </button>
        </div>
      </div>

      {/* History Items Grid / List */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Header with Score & Date */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className={`text-sm font-extrabold px-2.5 py-1 rounded-xl border ${getScoreBadge(
                      item.matchScore
                    )} shadow-2xs`}
                  >
                    {item.matchScore}% Match
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Job Info */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {item.jobTitle}
                </h3>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3 text-slate-400" /> {item.companyName || "Target Company"}
                </p>

                {/* Resume Source */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Evaluated Resume
                  </span>
                  <p className="font-medium text-slate-800 truncate">{item.resumeTitle}</p>
                </div>

                {/* Key Missing Skills Tags */}
                {item.keyMissingSkills && item.keyMissingSkills.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Missing Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.keyMissingSkills.map((sk, i) => (
                        <span key={i} className="text-[10px] bg-rose-50 text-rose-700 font-medium px-1.5 py-0.5 rounded-md border border-rose-100">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this analysis from your history?")) {
                      onDeleteAnalysis(item.id);
                    }
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md text-xs transition-colors"
                  title="Delete from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectAnalysis(item.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No History Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || scoreFilter !== "all"
              ? "No analyses match your current filters. Try resetting your search."
              : "Perform your first Resume-to-JD analysis to see historical trends and match reports here."}
          </p>
          <button
            onClick={onNewAnalysis}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-md"
          >
            Start First Analysis
          </button>
        </div>
      )}
    </div>
  );
};
