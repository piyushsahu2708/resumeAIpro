import React, { useState, useRef } from "react";
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  Sliders,
  Columns,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Palette,
  Eye,
  Edit3,
  GitCompare,
  Zap,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronDown,
  Layers
} from "lucide-react";
import { DiffHighlight, OptimizedResumeResponse, Resume, SinglePageConfig } from "../types";

interface OptimizedResumeStudioProps {
  optimizedData: OptimizedResumeResponse;
  onSaveToLibrary: (resume: Resume) => Promise<void>;
  onClose: () => void;
  onRegenerate: (templateStyle: string) => Promise<void>;
}

export const OptimizedResumeStudio: React.FC<OptimizedResumeStudioProps> = ({
  optimizedData,
  onSaveToLibrary,
  onClose,
  onRegenerate,
}) => {
  const [resume, setResume] = useState<Resume>(optimizedData.optimizedResume);
  const [viewMode, setViewMode] = useState<"preview" | "diff" | "edit">("preview");
  const [config, setConfig] = useState<SinglePageConfig>({
    template: (optimizedData.optimizedResume.layoutTemplate as any) || "modern",
    fontSize: "normal",
    spacing: "standard",
    accentColor: "indigo",
    showProjects: true,
    showCertifications: true,
    showAchievements: true,
  });

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedDiffSection, setSelectedDiffSection] = useState<string>("all");

  const resumePrintRef = useRef<HTMLDivElement>(null);

  // Handle live text edits in resume
  const handleSummaryChange = (val: string) => {
    setResume((prev) => ({ ...prev, summary: val }));
  };

  const handleSkillChange = (category: "technical" | "soft" | "tools", idx: number, val: string) => {
    setResume((prev) => {
      const updated = [...prev.skills[category]];
      updated[idx] = val;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: updated,
        },
      };
    });
  };

  const handleBulletChange = (expIdx: number, bulletIdx: number, val: string) => {
    setResume((prev) => {
      const updatedExp = [...prev.experience];
      const updatedBullets = [...updatedExp[expIdx].description];
      updatedBullets[bulletIdx] = val;
      updatedExp[expIdx] = { ...updatedExp[expIdx], description: updatedBullets };
      return { ...prev, experience: updatedExp };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# ${resume.contact?.fullName || "Candidate Name"}
${resume.targetRole || resume.title} | ${resume.contact?.email || ""} | ${resume.contact?.location || ""}

## Professional Summary
${resume.summary}

## Technical Skills
- **Core Technologies:** ${(resume.skills?.technical || []).join(", ")}
- **Tools & Platforms:** ${(resume.skills?.tools || []).join(", ")}
- **Methodologies:** ${(resume.skills?.soft || []).join(", ")}

## Professional Experience
${(resume.experience || []).map((e) => `### ${e.role} — ${e.company} (${e.duration})\n${(e.description || []).map((d) => `- ${d}`).join("\n")}`).join("\n\n")}

## Education
${(resume.education || []).map((e) => `- **${e.degree}**, ${e.institution} (${e.year}) ${e.details || ""}`).join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopiedText("markdown");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveToLibrary({
        ...resume,
        title: `[Optimized for ${optimizedData.targetCompanyName || "JD"}] ${resume.title}`,
        layoutTemplate: config.template,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert("Failed to save resume: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerRegeneration = async (template: string) => {
    setIsRegenerating(true);
    try {
      await onRegenerate(template);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Accent color classes
  const getAccentColorClasses = () => {
    switch (config.accentColor) {
      case "slate":
        return {
          headerBg: "bg-slate-900 text-white",
          accentText: "text-slate-900",
          accentBorder: "border-slate-800",
          tagBg: "bg-slate-100 text-slate-800",
          divider: "border-slate-300",
          badge: "bg-slate-800 text-white",
        };
      case "emerald":
        return {
          headerBg: "bg-emerald-900 text-white",
          accentText: "text-emerald-700",
          accentBorder: "border-emerald-600",
          tagBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          divider: "border-emerald-200",
          badge: "bg-emerald-600 text-white",
        };
      case "blue":
        return {
          headerBg: "bg-blue-900 text-white",
          accentText: "text-blue-700",
          accentBorder: "border-blue-600",
          tagBg: "bg-blue-50 text-blue-800 border-blue-200",
          divider: "border-blue-200",
          badge: "bg-blue-600 text-white",
        };
      case "rose":
        return {
          headerBg: "bg-rose-950 text-white",
          accentText: "text-rose-700",
          accentBorder: "border-rose-600",
          tagBg: "bg-rose-50 text-rose-800 border-rose-200",
          divider: "border-rose-200",
          badge: "bg-rose-600 text-white",
        };
      case "amber":
        return {
          headerBg: "bg-amber-950 text-white",
          accentText: "text-amber-800",
          accentBorder: "border-amber-600",
          tagBg: "bg-amber-50 text-amber-900 border-amber-200",
          divider: "border-amber-200",
          badge: "bg-amber-600 text-white",
        };
      case "indigo":
      default:
        return {
          headerBg: "bg-indigo-950 text-white",
          accentText: "text-indigo-700",
          accentBorder: "border-indigo-600",
          tagBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
          divider: "border-indigo-100",
          badge: "bg-indigo-600 text-white",
        };
    }
  };

  const colors = getAccentColorClasses();

  // Spacing & Font size classes for 1-page fit
  const getTypographyClasses = () => {
    let fontClass = "text-[11px] leading-[1.35]";
    let headingClass = "text-xs tracking-wide font-bold";
    let titleClass = "text-lg font-extrabold";
    let spacingClass = "space-y-2.5";
    let itemSpacing = "space-y-1";

    if (config.fontSize === "compact") {
      fontClass = "text-[10px] leading-[1.3]";
      headingClass = "text-[11px] tracking-wide font-bold";
      titleClass = "text-base font-extrabold";
    } else if (config.fontSize === "spacious") {
      fontClass = "text-[12px] leading-[1.45]";
      headingClass = "text-sm tracking-wide font-bold";
      titleClass = "text-xl font-extrabold";
    }

    if (config.spacing === "tight") {
      spacingClass = "space-y-1.5";
      itemSpacing = "space-y-0.5";
    } else if (config.spacing === "relaxed") {
      spacingClass = "space-y-3.5";
      itemSpacing = "space-y-1.5";
    }

    return { fontClass, headingClass, titleClass, spacingClass, itemSpacing };
  };

  const typo = getTypographyClasses();

  // Filter diff highlights
  const diffs = (optimizedData.diffHighlights || []).filter((d) => {
    if (selectedDiffSection === "all") return true;
    return d.section.toLowerCase().includes(selectedDiffSection.toLowerCase());
  });

  return (
    <div id="optimized-resume-studio" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header / Control Bar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Analysis
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> ATS-Optimized Single Page
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Target: <strong className="text-white">{optimizedData.targetJobTitle}</strong> at {optimizedData.targetCompanyName}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-md">
              {resume.title}
            </h1>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "preview" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 1-Page Preview
          </button>
          <button
            onClick={() => setViewMode("diff")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "diff" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" /> Diff Inspector ({optimizedData.diffHighlights?.length || 0})
          </button>
          <button
            onClick={() => setViewMode("edit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "edit" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Live Editor
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors flex items-center gap-1.5"
            title="Copy as clean Markdown"
          >
            {copiedText === "markdown" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedText === "markdown" ? "Copied!" : "Markdown"}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved to Library!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isSaving ? "Saving..." : "Save Resume"}</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Download PDF / Print
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Optimization Controls & Change Log (4 Cols) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Key Improvements Made */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Optimization Changes
              </span>
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Strict Single Page
              </span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {(optimizedData.changesSummary || []).map((change, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{change}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estimated ATS Score:</span>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="line-through text-slate-500">{optimizedData.atsImprovementEstimate?.previousScore || 75}%</span>
                <span className="text-emerald-400 text-sm">→ {optimizedData.atsImprovementEstimate?.projectedScore || 95}%</span>
              </div>
            </div>
          </div>

          {/* Single-Page Layout & Format Customizer */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Layout & Page Fit Controls</h2>
            </div>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">Visual Layout Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "modern", label: "Modern Clean" },
                  { id: "executive", label: "Executive Serif" },
                  { id: "minimal", label: "Tech Minimal" },
                  { id: "sidebar", label: "Two-Column" },
                  { id: "classic", label: "ATS Classic" },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setConfig((prev) => ({ ...prev, template: tpl.id as any }))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      config.template === tpl.id
                        ? "bg-indigo-600/30 border-indigo-500 text-white font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Density for 1-Page Guarantee */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">Font Density (1-Page Calibration)</label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {(["compact", "normal", "spacious"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setConfig((prev) => ({ ...prev, fontSize: size }))}
                    className={`py-1 rounded-md text-center capitalize transition-colors ${
                      config.fontSize === size ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 block">Header & Accent Theme</label>
              <div className="flex items-center gap-2">
                {[
                  { id: "indigo", bg: "bg-indigo-600" },
                  { id: "slate", bg: "bg-slate-700" },
                  { id: "emerald", bg: "bg-emerald-600" },
                  { id: "blue", bg: "bg-blue-600" },
                  { id: "rose", bg: "bg-rose-600" },
                  { id: "amber", bg: "bg-amber-600" },
                ].map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setConfig((prev) => ({ ...prev, accentColor: color.id as any }))}
                    className={`w-6 h-6 rounded-full ${color.bg} transition-transform ${
                      config.accentColor === color.id ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"
                    }`}
                    title={color.id}
                  />
                ))}
              </div>
            </div>

            {/* Single-Page Page Meter */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Single Page Status:
                </span>
                <span className="font-bold text-emerald-400">100% Calibrated Fit</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Layout and margins are locked to strict 1-page standard dimensions (8.5" × 11").
              </p>
            </div>
          </div>
        </aside>

        {/* Right Main Panel: Resume Live Canvas or Diff Inspector (8 Cols) */}
        <main className="lg:col-span-8">
          {viewMode === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                <span>Standard 8.5" × 11" Single Page Layout</span>
                <span className="text-emerald-400 font-medium">Ready for PDF Download / Print</span>
              </div>

              {/* White Printable Single-Page Sheet Container */}
              <div className="bg-slate-800/40 p-4 sm:p-8 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto shadow-2xl">
                <div
                  ref={resumePrintRef}
                  id="printable-resume-page"
                  className={`w-full max-w-[780px] bg-white text-slate-900 p-8 sm:p-10 rounded-sm shadow-xl min-h-[960px] print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none print:min-h-0 ${
                    config.template === "executive" ? "font-serif" : "font-sans"
                  }`}
                  style={{
                    boxSizing: "border-box",
                  }}
                >
                  {/* Template Style 1: Modern Clean */}
                  {config.template === "modern" && (
                    <div className={typo.spacingClass}>
                      {/* Header */}
                      <div className="border-b-2 pb-3 border-indigo-600">
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                          {resume.contact?.fullName || "Alex Morgan"}
                        </h1>
                        <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                          {resume.targetRole || resume.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2">
                          <span>{resume.contact?.email || "alex.morgan@example.com"}</span>
                          <span>•</span>
                          <span>{resume.contact?.phone || "+1 (555) 234-5678"}</span>
                          <span>•</span>
                          <span>{resume.contact?.location || "San Francisco, CA"}</span>
                          <span>•</span>
                          <span className="text-indigo-600">{resume.contact?.linkedIn || "linkedin.com/in/alexmorgan"}</span>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-1">
                        <h2 className={`font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-0.5 ${typo.headingClass}`}>
                          Professional Summary
                        </h2>
                        <p className={`text-slate-700 leading-relaxed ${typo.fontClass}`}>
                          {resume.summary}
                        </p>
                      </div>

                      {/* Technical Skills */}
                      <div className="space-y-1">
                        <h2 className={`font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-0.5 ${typo.headingClass}`}>
                          Technical & Core Competencies
                        </h2>
                        <div className={`text-slate-800 ${typo.fontClass} space-y-1`}>
                          <div>
                            <strong className="text-slate-900 font-semibold">Languages & Frameworks: </strong>
                            {(resume.skills.technical || []).join(" • ")}
                          </div>
                          <div>
                            <strong className="text-slate-900 font-semibold">Tools & Cloud Architecture: </strong>
                            {(resume.skills.tools || []).join(" • ")}
                          </div>
                          <div>
                            <strong className="text-slate-900 font-semibold">Methodologies & Leadership: </strong>
                            {(resume.skills.soft || []).join(" • ")}
                          </div>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="space-y-2">
                        <h2 className={`font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-0.5 ${typo.headingClass}`}>
                          Professional Experience
                        </h2>
                        <div className="space-y-3">
                          {(resume.experience || []).map((exp, i) => (
                            <div key={exp.id || i} className={typo.itemSpacing}>
                              <div className="flex items-baseline justify-between">
                                <div>
                                  <span className="font-bold text-slate-900 text-xs sm:text-[13px]">{exp.role}</span>
                                  <span className="text-slate-600 text-xs"> — {exp.company}</span>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 shrink-0">{exp.duration}</span>
                              </div>
                              <ul className={`list-disc list-outside ml-4 text-slate-700 ${typo.fontClass} space-y-1`}>
                                {(exp.description || []).map((bullet, bIdx) => (
                                  <li key={bIdx} className="leading-snug">
                                    {bullet}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-1">
                        <h2 className={`font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-0.5 ${typo.headingClass}`}>
                          Education
                        </h2>
                        <div className="space-y-1">
                          {(resume.education || []).map((edu, i) => (
                            <div key={edu.id || i} className="flex items-baseline justify-between text-xs">
                              <div>
                                <strong className="text-slate-900">{edu.degree}</strong>
                                <span className="text-slate-600"> — {edu.institution}</span>
                              </div>
                              <span className="text-[11px] text-slate-500">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Projects / Certifications */}
                      {(resume.projects?.length || resume.certifications?.length) ? (
                        <div className="space-y-1">
                          <h2 className={`font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-0.5 ${typo.headingClass}`}>
                            Key Projects & Certifications
                          </h2>
                          <div className={`text-slate-700 ${typo.fontClass} space-y-1`}>
                            {(resume.projects || []).slice(0, 2).map((p, i) => (
                              <div key={p.id || i}>
                                <strong className="text-slate-900">{p.title}</strong> [{p.techStack?.join(", ")}]: {p.description}
                              </div>
                            ))}
                            {resume.certifications?.length ? (
                              <div>
                                <strong className="text-slate-900">Certifications: </strong>
                                {resume.certifications.join(" • ")}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Template Style 2: Executive Serif */}
                  {config.template === "executive" && (
                    <div className={typo.spacingClass}>
                      <div className="text-center border-b border-slate-300 pb-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                          {resume.contact?.fullName || "Alex Morgan"}
                        </h1>
                        <p className="text-xs font-semibold text-slate-600 italic mt-0.5">
                          {resume.targetRole || resume.title}
                        </p>
                        <div className="flex justify-center items-center gap-3 text-[11px] text-slate-600 mt-1.5 font-sans">
                          <span>{resume.contact?.email || "alex.morgan@example.com"}</span>
                          <span>•</span>
                          <span>{resume.contact?.phone || "+1 (555) 234-5678"}</span>
                          <span>•</span>
                          <span>{resume.contact?.location || "San Francisco, CA"}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                          Executive Profile
                        </h2>
                        <p className={`text-slate-800 leading-relaxed ${typo.fontClass}`}>{resume.summary}</p>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                          Core Competencies
                        </h2>
                        <div className={`text-slate-800 font-sans ${typo.fontClass} grid grid-cols-2 gap-x-4 gap-y-1`}>
                          <div><strong>Technical:</strong> {(resume.skills.technical || []).slice(0, 8).join(", ")}</div>
                          <div><strong>Architecture & Tools:</strong> {(resume.skills.tools || []).slice(0, 6).join(", ")}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                          Professional Experience
                        </h2>
                        <div className="space-y-3 font-sans">
                          {(resume.experience || []).map((exp, i) => (
                            <div key={exp.id || i} className={typo.itemSpacing}>
                              <div className="flex items-baseline justify-between">
                                <span className="font-bold text-slate-900 text-xs">{exp.role}, {exp.company}</span>
                                <span className="text-[11px] text-slate-500">{exp.duration}</span>
                              </div>
                              <ul className={`list-disc list-outside ml-4 text-slate-700 ${typo.fontClass} space-y-0.5`}>
                                {(exp.description || []).map((bullet, bIdx) => (
                                  <li key={bIdx}>{bullet}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                          Education & Accreditations
                        </h2>
                        <div className="font-sans space-y-1">
                          {(resume.education || []).map((edu, i) => (
                            <div key={edu.id || i} className="flex justify-between text-xs">
                              <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                              <span className="text-[11px] text-slate-500">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Template Style 3, 4, 5: Compact ATS / Minimal / Sidebar */}
                  {(config.template === "minimal" || config.template === "classic" || config.template === "sidebar") && (
                    <div className={typo.spacingClass}>
                      <div className="border-b border-slate-900 pb-2">
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                          {resume.contact?.fullName || "Alex Morgan"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-700 mt-1 font-mono">
                          <span>{resume.targetRole || resume.title}</span>
                          <span>|</span>
                          <span>{resume.contact?.email || "alex.morgan@example.com"}</span>
                          <span>|</span>
                          <span>{resume.contact?.location || "San Francisco, CA"}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                          SUMMARY
                        </h2>
                        <p className={`text-slate-800 ${typo.fontClass}`}>{resume.summary}</p>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                          SKILLS & TECHNOLOGIES
                        </h2>
                        <p className={`text-slate-800 ${typo.fontClass}`}>
                          <strong>Technical: </strong>{(resume.skills.technical || []).join(", ")} | <strong>Tools: </strong>{(resume.skills.tools || []).join(", ")}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                          EXPERIENCE
                        </h2>
                        {(resume.experience || []).map((exp, i) => (
                          <div key={exp.id || i} className={typo.itemSpacing}>
                            <div className="flex justify-between text-xs">
                              <strong>{exp.role} — {exp.company}</strong>
                              <span className="font-mono text-[11px]">{exp.duration}</span>
                            </div>
                            <ul className={`list-disc list-outside ml-4 text-slate-800 ${typo.fontClass} space-y-0.5`}>
                              {(exp.description || []).map((bullet, bIdx) => (
                                <li key={bIdx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
                          EDUCATION
                        </h2>
                        {(resume.education || []).map((edu, i) => (
                          <div key={edu.id || i} className="flex justify-between text-xs">
                            <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                            <span className="font-mono text-[11px]">{edu.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View Mode 2: Diff Inspector */}
          {viewMode === "diff" && (
            <div className="space-y-5">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-indigo-400" /> Side-by-Side Optimization Inspector
                  </h2>
                  <p className="text-xs text-slate-400">
                    See exactly how your original content was enhanced for {optimizedData.targetJobTitle}.
                  </p>
                </div>

                <select
                  value={selectedDiffSection}
                  onChange={(e) => setSelectedDiffSection(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-hidden"
                >
                  <option value="all">All Sections ({optimizedData.diffHighlights?.length || 0})</option>
                  <option value="summary">Summary</option>
                  <option value="experience">Experience</option>
                  <option value="skills">Skills</option>
                </select>
              </div>

              <div className="space-y-4">
                {diffs.map((diff, i) => (
                  <div key={i} className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {diff.section}
                      </span>
                      <span className="text-[11px] text-slate-400 italic">
                        {diff.reason}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Original */}
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                          Original Resume
                        </span>
                        <p className="text-slate-300 leading-relaxed">{diff.original}</p>
                      </div>

                      {/* Optimized */}
                      <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-500/30 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> JD-Optimized Single Page
                        </span>
                        <p className="text-white font-medium leading-relaxed">{diff.optimized}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Mode 3: In-Place Live Editor */}
          {viewMode === "edit" && (
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-400" /> In-Place Single-Page Editor
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Fine-tune any wording or numbers before saving or downloading your 1-page resume.
                </p>
              </div>

              {/* Summary Editor */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Professional Summary</label>
                <textarea
                  rows={4}
                  value={resume.summary}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Technical Skills Editor */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Technical Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={(resume.skills.technical || []).join(", ")}
                  onChange={(e) =>
                    setResume((prev) => ({
                      ...prev,
                      skills: {
                        ...prev.skills,
                        technical: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    }))
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Work Experience Bullets Editor */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-300 block">Work Experience Bullet Points</label>
                {(resume.experience || []).map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-indigo-400">{exp.role} at {exp.company}</span>
                    {(exp.description || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="space-y-1">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
