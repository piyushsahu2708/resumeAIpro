import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileUp,
  Code,
  Layers,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { Resume } from "../types";
import { api } from "../lib/api";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resume: Resume) => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "paste" | "samples">("file");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleProcessUpload = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      let rawText = "";

      if (activeTab === "file") {
        if (!selectedFile) {
          throw new Error("Please select a resume file (.pdf, .docx, .txt, .json).");
        }
        // Read file content
        rawText = await selectedFile.text();
      } else if (activeTab === "paste") {
        if (!pastedText || pastedText.trim().length < 20) {
          throw new Error("Please paste resume text of at least 20 characters.");
        }
        rawText = pastedText;
      }

      // Call API to extract structured resume
      const parsed = await api.uploadResumeFile({
        filename: selectedFile?.name || "Uploaded Resume",
        rawText,
      });

      // Save into user database
      const created = await api.createResume({
        ...parsed,
        title: parsed.title || selectedFile?.name.replace(/\.[^/.]+$/, "") || "Uploaded Resume",
      });

      onSuccess(created);
      onClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process resume. Please verify file formatting.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = async (sampleType: "mern" | "frontend" | "cloud") => {
    setIsProcessing(true);
    setError(null);
    try {
      let sampleData: Partial<Resume>;

      if (sampleType === "mern") {
        sampleData = {
          title: "Senior Full Stack (MERN) Resume",
          targetRole: "Senior Full Stack Developer",
          summary: "Results-driven Full Stack Engineer with 5+ years of experience designing and scaling web applications using React.js, Node.js, Express, TypeScript, and MongoDB. Proven track record of improving throughput by 40% and deploying microservices to AWS.",
          skills: {
            technical: ["React.js", "Node.js", "Express.js", "MongoDB", "TypeScript", "JavaScript", "REST APIs", "GraphQL", "Redux Toolkit", "Tailwind CSS"],
            soft: ["Agile/Scrum", "Team Mentorship", "Technical Architecture", "Problem Solving"],
            tools: ["Git & GitHub", "Docker", "Postman", "Vite", "Jest", "Jira"],
          },
          experience: [
            {
              id: "exp_1",
              role: "Senior Full Stack Developer",
              company: "TechNova Solutions",
              duration: "2023 - Present",
              location: "San Francisco, CA",
              isCurrent: true,
              description: [
                "Architected and deployed microservices-based SaaS platform serving 150K+ monthly active users using React, Node.js, and MongoDB.",
                "Reduced client-side load time by 45% by implementing code-splitting, lazy loading, and Redis caching.",
                "Built robust RESTful APIs with JWT authentication, role-based access control, and rate limiting."
              ]
            },
            {
              id: "exp_2",
              role: "Full Stack Software Engineer",
              company: "CloudVantage Apps",
              duration: "2021 - 2023",
              location: "Austin, TX",
              isCurrent: false,
              description: [
                "Developed responsive single-page web applications with React, Redux, and Tailwind CSS.",
                "Integrated third-party payment gateways (Stripe) and webhook event processors with Node.js/Express.",
                "Containerized development environments with Docker to standardize local setup across 20+ engineers."
              ]
            }
          ],
          education: [
            {
              id: "edu_1",
              degree: "B.S. in Computer Science",
              institution: "University of California, Berkeley",
              year: "2017 - 2021",
              details: "Dean's Honor List"
            }
          ],
          projects: [
            {
              id: "proj_1",
              title: "Real-time Collaboration Workspace",
              techStack: ["React", "TypeScript", "Node.js", "Socket.io", "MongoDB"],
              description: "Built collaborative document editor with live sync and presence indicators.",
              link: "https://github.com/example/collab"
            }
          ],
          certifications: ["AWS Certified Solutions Architect – Associate (2024)", "MongoDB Certified Developer"],
          achievements: ["1st Place Hackathon Winner TechCrunch Disrupt 2023"],
        };
      } else if (sampleType === "frontend") {
        sampleData = {
          title: "Frontend Engineering Specialist",
          targetRole: "Senior Frontend / UI Engineer",
          summary: "Frontend Developer specialized in React, Next.js, and TypeScript with deep focus on accessibility (WCAG), performance optimization, and scalable design systems.",
          skills: {
            technical: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "CSS Modules", "HTML5/CSS3", "JavaScript (ES6+)", "Zustand"],
            soft: ["UI/UX Design Communication", "Attention to Detail", "Agile Sprints"],
            tools: ["Figma", "Storybook", "Vite", "Jest & React Testing Library", "Lighthouse"],
          },
          experience: [
            {
              id: "exp_f1",
              role: "Senior Frontend Engineer",
              company: "DesignCraft UI",
              duration: "2022 - Present",
              location: "Remote",
              isCurrent: true,
              description: [
                "Engineered multi-brand design system with 40+ accessible React components used across 5 flagship web apps.",
                "Boosted Core Web Vitals to 98+ Lighthouse scores through image optimization and server components."
              ]
            }
          ],
          education: [
            {
              id: "edu_f1",
              degree: "B.S. in Software Engineering",
              institution: "University of Washington",
              year: "2018 - 2022"
            }
          ],
          projects: [
            {
              id: "proj_f1",
              title: "Component Sandbox & Visual Playground",
              techStack: ["React", "Tailwind", "Vite", "TypeScript"],
              description: "Interactive visual component documentation engine."
            }
          ],
          certifications: ["Meta Certified Frontend Developer"],
          achievements: ["Featured on React newsletter for accessible modal design"]
        };
      } else {
        sampleData = {
          title: "Cloud & DevOps Engineer",
          targetRole: "Cloud Platform / DevOps Engineer",
          summary: "Cloud Architect with expertise in AWS, Kubernetes, Docker, CI/CD automation, and infrastructure as code (Terraform).",
          skills: {
            technical: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux/Bash", "Python", "Node.js", "PostgreSQL", "Prometheus"],
            soft: ["Site Reliability", "Incident Management", "Security Best Practices"],
            tools: ["GitHub Actions", "ArgoCD", "Grafana", "Helm", "Datadog"]
          },
          experience: [
            {
              id: "exp_c1",
              role: "DevOps Engineer",
              company: "ScaleCloud Systems",
              duration: "2022 - Present",
              location: "Seattle, WA",
              isCurrent: true,
              description: [
                "Automated multi-region Kubernetes clusters with Terraform and Helm, achieving 99.99% service availability.",
                "Constructed zero-downtime CI/CD deployment pipelines reducing release deployment times from 45 min to 4 min."
              ]
            }
          ],
          education: [
            {
              id: "edu_c1",
              degree: "B.S. in Information Systems",
              institution: "Georgia Tech",
              year: "2018 - 2022"
            }
          ],
          projects: [],
          certifications: ["AWS Certified Solutions Architect – Professional", "CKA: Certified Kubernetes Administrator"],
          achievements: ["Led SOC2 Compliance Audit with 0 security findings"]
        };
      }

      const created = await api.createResume(sampleData);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to load sample resume.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upload or Import Resume</h2>
              <p className="text-xs text-slate-500">
                Extract your personal details, experience, skills, and layout structure instantly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/30">
          <button
            onClick={() => setActiveTab("file")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "file"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileUp className="w-3.5 h-3.5" /> Upload File (PDF / DOCX / TXT)
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "paste"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Paste Text / Markdown
          </button>
          <button
            onClick={() => setActiveTab("samples")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "samples"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample Presets
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tab 1: Upload File */}
          {activeTab === "file" && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? "border-indigo-600 bg-indigo-50/50"
                    : selectedFile
                    ? "border-emerald-500 bg-emerald-50/30"
                    : "border-slate-300 hover:border-indigo-400 bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    selectedFile ? "bg-emerald-100 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <FileText className="w-6 h-6" />
                </div>

                <div>
                  {selectedFile ? (
                    <>
                      <p className="text-sm font-bold text-emerald-800">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-800">
                        Drag and drop your resume file here
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Supports PDF, DOCX, TXT, or JSON (Max 10MB)
                      </p>
                    </>
                  )}
                </div>

                {!selectedFile && (
                  <button
                    type="button"
                    className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold shadow-2xs"
                  >
                    Browse Files
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Paste Raw Text */}
          {activeTab === "paste" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Paste your resume text below:
              </label>
              <textarea
                rows={9}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste summary, experience bullet points, skills, and education..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden leading-relaxed font-mono"
              />
            </div>
          )}

          {/* Tab 3: Sample Presets */}
          {activeTab === "samples" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Choose a pre-configured professional profile to test drive the ATS matching and 1-page generator instantly:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectSample("mern")}
                  disabled={isProcessing}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/40 text-left transition-all space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Senior Full Stack (MERN)</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    React, Node.js, TypeScript, MongoDB, AWS (5+ yrs)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample("frontend")}
                  disabled={isProcessing}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/40 text-left transition-all space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Code className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Frontend UI/UX Specialist</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    React, Next.js, Design Systems, Tailwind, WCAG
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample("cloud")}
                  disabled={isProcessing}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/40 text-left transition-all space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Cloud & DevOps Architect</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    AWS, Docker, Kubernetes, CI/CD Pipelines
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>

          {activeTab !== "samples" && (
            <button
              onClick={handleProcessUpload}
              disabled={isProcessing || (activeTab === "file" && !selectedFile) || (activeTab === "paste" && !pastedText.trim())}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract & Add to Library</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
