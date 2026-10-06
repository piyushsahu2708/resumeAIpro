import React, { useState } from "react";
import { Sparkles, Briefcase, Building, FileText, ArrowRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Resume } from "../types";

interface JobDescriptionInputProps {
  activeResume: Resume | null;
  onAnalyze: (payload: {
    resumeId: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  }) => Promise<void>;
  isAnalyzing: boolean;
  onOpenResumeEditor: () => void;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  activeResume,
  onAnalyze,
  isAnalyzing,
  onOpenResumeEditor,
}) => {
  const [jobTitle, setJobTitle] = useState("Senior Full Stack Engineer");
  const [companyName, setCompanyName] = useState("Stripe");
  const [jobDescription, setJobDescription] = useState(
    `We are seeking a Senior Full Stack Engineer with strong experience in React.js, Node.js, TypeScript, PostgreSQL, and AWS (ECS, Lambda, S3). You will build secure, highly reliable payment interfaces and distributed backend microservices. Experience with CI/CD pipelines, Docker, Kubernetes, and financial compliance (SOC2/PCI) is a strong plus.`
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Industry Sample Presets
  const samplePresets = [
    {
      title: "Senior Full Stack (Fintech)",
      company: "Stripe",
      text: `We are looking for a Senior Full Stack Engineer to join our Payment Platform team.

Responsibilities:
- Build and scale developer-facing interfaces and high-throughput APIs using React, Node.js, Express, and TypeScript.
- Design resilient distributed architectures with PostgreSQL, Redis caching, and AWS cloud infrastructure.
- Implement secure authentication mechanisms (JWT, OAuth, RBAC) compliant with SOC2 and PCI-DSS standards.
- Partner with product managers and designers to deliver frictionless customer checkout experiences.
- Drive automated CI/CD deployment pipelines using Docker and Kubernetes.

Requirements:
- 4+ years of professional experience building web applications with React.js and Node.js.
- Strong proficiency with TypeScript, RESTful API design, and SQL / NoSQL database optimization.
- Experience with containerization (Docker) and cloud deployments (AWS or GCP).
- Excellent communication and collaboration skills in fast-paced agile teams.`,
    },
    {
      title: "Frontend UI/UX Specialist",
      company: "Airbnb",
      text: `Airbnb is seeking an experienced Frontend Engineer passionate about user experience, responsive web design, and web performance.

Key Responsibilities:
- Develop delightful, accessible user interfaces using React, Next.js, TypeScript, and modern CSS/Tailwind.
- Build reusable UI component libraries and contribute to our global design system.
- Optimize web application performance, Core Web Vitals, and Lighthouse metrics across desktop and mobile.
- Implement robust unit and integration test suites using Jest, React Testing Library, and Cypress.

Qualifications:
- 3+ years of frontend development experience with React and TypeScript.
- Deep understanding of DOM manipulation, CSS layout algorithms, and WCAG accessibility guidelines.
- Experience with state management (Zustand, Redux) and server-side rendering.
- Strong eye for typography, micro-interactions, and visual craftsmanship.`,
    },
    {
      title: "AI / Cloud Software Engineer",
      company: "Scale AI / OpenAI Partner",
      text: `We are seeking a Cloud Software Engineer to build AI-powered agentic platforms and LLM workflow orchestrators.

Key Responsibilities:
- Design and implement LLM integrations using Gemini API, OpenAI API, and vector databases (Pinecone, Chroma).
- Build asynchronous backend processing pipelines using Node.js / Express or Python FastAPI.
- Manage containerized microservices in Docker and deploy on Google Cloud Run or AWS ECS.
- Optimize prompt engineering, structured output validation, and streaming SSE responses.

Requirements:
- 3+ years experience in backend or full-stack software development.
- Hands-on experience integrating LLM APIs, prompt engineering, and structured JSON schemas.
- Familiarity with cloud services (GCP, AWS), Docker containers, and CI/CD pipelines.`,
    },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setJobTitle(preset.title);
    setCompanyName(preset.company);
    setJobDescription(preset.text);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 25) {
      setValidationError("Please enter a detailed job description (minimum 25 characters) to perform matching.");
      return;
    }

    if (!activeResume) {
      setValidationError("Please select or create a resume first.");
      return;
    }

    setValidationError(null);
    onAnalyze({
      resumeId: activeResume.id,
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      jobDescription: jobDescription.trim(),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Step 1
            </span>
            <h2 className="text-lg font-bold text-slate-900">Target Job Description & Matching</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare your active resume against any Job Description to generate ATS score, missing keywords, and skill gaps.
          </p>
        </div>

        {/* Active Resume Indicator */}
        {activeResume && (
          <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 truncate max-w-[170px]">{activeResume.title}</p>
              <p className="text-[11px] text-slate-400 truncate">{activeResume.skills?.technical?.length || 0} skills loaded</p>
            </div>
            <button
              type="button"
              onClick={onOpenResumeEditor}
              className="ml-1 text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Preset Quick Fill Buttons */}
      <div className="px-6 pt-4 pb-2 bg-slate-50/20 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Sample JDs:
        </span>
        {samplePresets.map((preset, i) => (
          <button
            key={i}
            id={`preset-jd-${i}`}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shrink-0 transition-colors"
          >
            {preset.title} ({preset.company})
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {validationError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Target Job Title
            </label>
            <input
              id="job-title-input"
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Developer"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" /> Company Name (Optional)
            </label>
            <input
              id="company-name-input"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Stripe, Google, Meta"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Full Job Description / Requirements
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {jobDescription.length} characters
            </span>
          </div>
          <textarea
            id="job-description-textarea"
            rows={8}
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job posting, qualifications, required skills, and responsibilities here..."
            className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white leading-relaxed font-sans"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>LLM-powered semantic parsing, ATS keyword density, & gap matrix.</span>
          </div>

          <button
            id="run-analysis-btn"
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analyzing Resume vs Job Description...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
