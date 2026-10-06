import React, { useState } from "react";
import { X, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { api } from "../lib/api";

interface BulletOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBullet?: string;
  suggestedKeywords?: string[];
  roleContext?: string;
}

export const BulletOptimizerModal: React.FC<BulletOptimizerModalProps> = ({
  isOpen,
  onClose,
  initialBullet = "",
  suggestedKeywords = [],
  roleContext = "Software Engineer",
}) => {
  const [bulletText, setBulletText] = useState(
    initialBullet || "Architected and deployed microservices-based SaaS platform using React, Node.js, and MongoDB."
  );
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(
    suggestedKeywords.slice(0, 3)
  );
  const [customKeyword, setCustomKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleKeyword = (kw: string) => {
    if (selectedKeywords.includes(kw)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== kw));
    } else {
      setSelectedKeywords([...selectedKeywords, kw]);
    }
  };

  const handleAddCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim())) {
      setSelectedKeywords([...selectedKeywords, customKeyword.trim()]);
      setCustomKeyword("");
    }
  };

  const handleGenerateVariations = async () => {
    if (!bulletText.trim()) {
      setError("Please provide a bullet point to rewrite.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.rewriteBullet(bulletText, selectedKeywords, roleContext);
      setVariations(res.variations || []);
    } catch (err: any) {
      setError(err.message || "Failed to generate optimized bullet points.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="bullet-optimizer-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Bullet Point & Keyword Optimizer</h2>
              <p className="text-xs text-slate-500">
                Rewrites resume bullet points using the Google XYZ formula and seamlessly embeds target keywords.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Current Bullet Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Original Resume Bullet Point
            </label>
            <textarea
              rows={3}
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Developed user features and improved application speed..."
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
            />
          </div>

          {/* Keywords to Inject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Target Keywords to Integrate
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestedKeywords.map((kw, i) => {
                const isSelected = selectedKeywords.includes(kw);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleKeyword(kw)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? `✓ ${kw}` : `+ ${kw}`}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                placeholder="Add custom keyword (e.g. Kubernetes, CI/CD)..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomKeyword();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomKeyword}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleGenerateVariations}
            disabled={loading || !bulletText.trim()}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Crafting High-Impact Variations with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 3 Optimized Bullet Variations</span>
              </>
            )}
          </button>

          {/* Generated Variations List */}
          {variations.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Optimized Bullet Options
              </h3>

              {variations.map((v, index) => {
                const labels = [
                  "1. Metric & Quantified Impact",
                  "2. Architectural Leadership & Stack Depth",
                  "3. Workflow & Operational Efficiency"
                ];

                return (
                  <div
                    key={index}
                    className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-900">{labels[index] || `Option #${index + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(v, index)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-indigo-200"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-sans font-normal">{v}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
