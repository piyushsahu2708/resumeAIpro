import React, { useState } from "react";
import { X, Plus, Trash2, Sparkles, FileText, Briefcase, GraduationCap, Code2, Award, Upload } from "lucide-react";
import { Resume, WorkExperience, Education, Project } from "../types";
import { api } from "../lib/api";

interface ResumeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resume: Partial<Resume>) => Promise<void>;
  initialResume?: Resume | null;
}

export const ResumeEditorModal: React.FC<ResumeEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialResume,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "skills" | "experience" | "education" | "projects" | "raw">("details");
  const [loading, setLoading] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialResume?.title || "My Software Engineering Resume");
  const [targetRole, setTargetRole] = useState(initialResume?.targetRole || "Senior Full Stack Developer");
  const [summary, setSummary] = useState(
    initialResume?.summary ||
      "Results-driven software engineer with extensive experience building performant web applications, REST APIs, and microservices."
  );

  // Skills
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(
    initialResume?.skills?.technical || ["React.js", "Node.js", "Express.js", "TypeScript", "MongoDB", "REST APIs"]
  );
  const [softSkills, setSoftSkills] = useState<string[]>(
    initialResume?.skills?.soft || ["Agile/Scrum", "Team Leadership", "Problem Solving"]
  );
  const [tools, setTools] = useState<string[]>(
    initialResume?.skills?.tools || ["Git", "Docker", "Postman", "VS Code"]
  );

  const [newTechSkill, setNewTechSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newTool, setNewTool] = useState("");

  // Experience
  const [experience, setExperience] = useState<WorkExperience[]>(
    initialResume?.experience || [
      {
        id: "exp_init_1",
        role: "Full Stack Developer",
        company: "Tech Innovations",
        duration: "2022 - Present",
        location: "San Francisco, CA",
        isCurrent: true,
        description: [
          "Developed high-throughput web applications with React, Node.js, and TypeScript.",
          "Implemented Redis caching and optimized database queries, reducing response latency by 35%."
        ]
      }
    ]
  );

  // Education
  const [education, setEducation] = useState<Education[]>(
    initialResume?.education || [
      {
        id: "edu_init_1",
        degree: "B.S. in Computer Science",
        institution: "State University",
        year: "2018 - 2022",
        details: "Graduated with Honors"
      }
    ]
  );

  // Projects
  const [projects, setProjects] = useState<Project[]>(
    initialResume?.projects || []
  );

  // Certifications & Achievements
  const [certifications, setCertifications] = useState<string[]>(initialResume?.certifications || []);
  const [newCert, setNewCert] = useState("");
  const [achievements, setAchievements] = useState<string[]>(initialResume?.achievements || []);
  const [newAchieve, setNewAchieve] = useState("");

  // Raw text import
  const [rawText, setRawText] = useState("");

  if (!isOpen) return null;

  const handleAiParseRawText = async () => {
    if (!rawText.trim() || rawText.trim().length < 30) {
      setError("Please paste a comprehensive resume text (at least 30 characters) to parse.");
      return;
    }

    setAiParsing(true);
    setError(null);

    try {
      const parsed = await api.parseResumeText(rawText);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.targetRole) setTargetRole(parsed.targetRole);
      if (parsed.summary) setSummary(parsed.summary);
      if (parsed.skills?.technical) setTechnicalSkills(parsed.skills.technical);
      if (parsed.skills?.soft) setSoftSkills(parsed.skills.soft);
      if (parsed.skills?.tools) setTools(parsed.skills.tools);
      if (parsed.experience) setExperience(parsed.experience as WorkExperience[]);
      if (parsed.education) setEducation(parsed.education as Education[]);
      if (parsed.projects) setProjects(parsed.projects as Project[]);
      if (parsed.certifications) setCertifications(parsed.certifications);
      if (parsed.achievements) setAchievements(parsed.achievements);

      setActiveTab("details");
    } catch (err: any) {
      setError(err.message || "Failed to parse resume text. You can still fill in the tabs manually.");
    } finally {
      setAiParsing(false);
    }
  };

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: "exp_" + Date.now().toString().slice(-6),
      role: "Software Engineer",
      company: "Company Name",
      duration: "2023 - Present",
      location: "Remote",
      isCurrent: true,
      description: ["Spearheaded core feature implementation using modern frameworks."]
    };
    setExperience([...experience, newExp]);
  };

  const handleUpdateExp = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const handleAddExpBullet = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].description.push("New accomplishment or responsibility.");
    setExperience(updated);
  };

  const handleUpdateExpBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...experience];
    updated[expIndex].description[bulletIndex] = text;
    setExperience(updated);
  };

  const handleDeleteExpBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    updated[expIndex].description.splice(bulletIndex, 1);
    setExperience(updated);
  };

  const handleDeleteExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        id: "edu_" + Date.now().toString().slice(-6),
        degree: "Bachelor of Science in Computer Science",
        institution: "University Name",
        year: "2020 - 2024",
        details: ""
      }
    ]);
  };

  const handleAddProject = () => {
    setProjects([
      ...projects,
      {
        id: "proj_" + Date.now().toString().slice(-6),
        title: "Fullstack Web Platform",
        techStack: ["React", "TypeScript", "Node.js"],
        description: "Engineered responsive full-stack platform with secure authentication.",
        link: "https://github.com/example/repo"
      }
    ]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please provide a resume title.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload: Partial<Resume> = {
      ...(initialResume?.id ? { id: initialResume.id } : {}),
      title: title.trim(),
      targetRole: targetRole.trim(),
      summary: summary.trim(),
      skills: {
        technical: technicalSkills,
        soft: softSkills,
        tools,
      },
      experience,
      education,
      projects,
      certifications,
      achievements,
      rawText: rawText.trim() || undefined,
    };

    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="resume-editor-modal"
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialResume ? "Edit Resume Details" : "Create / Import Resume"}
              </h2>
              <p className="text-xs text-slate-500">
                Structure your technical background for high-precision ATS matching.
              </p>
            </div>
          </div>
          <button
            id="close-resume-editor-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto text-xs font-medium space-x-1">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "details"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Summary & Role
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "skills"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Skills ({technicalSkills.length + softSkills.length + tools.length})
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "experience"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Experience ({experience.length})
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "education"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Education & Projects
          </button>

          <button
            onClick={() => setActiveTab("raw")}
            className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "raw"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            AI Raw Text Importer
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Tab 1: Basic Details & Summary */}
          {activeTab === "details" && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Identifier Title</label>
                <input
                  id="resume-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior MERN Stack Developer (2026)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role / Primary Title</label>
                <input
                  id="resume-target-role-input"
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Summary / Objective
                </label>
                <textarea
                  id="resume-summary-textarea"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summarize your years of experience, core technical specializations, and key business impact..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Include your highest-level technical competencies and metrics here.
                </p>
              </div>

              {/* Quick Certifications & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Certifications</span>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCert}
                      onChange={(e) => setNewCert(e.target.value)}
                      placeholder="e.g. AWS Solutions Architect"
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCert.trim()) {
                          e.preventDefault();
                          setCertifications([...certifications, newCert.trim()]);
                          setNewCert("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCert.trim()) {
                          setCertifications([...certifications, newCert.trim()]);
                          setNewCert("");
                        }
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {certifications.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {c}
                        <button onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-slate-600">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="block text-xs font-semibold text-slate-700 mb-2">Key Achievements</span>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAchieve}
                      onChange={(e) => setNewAchieve(e.target.value)}
                      placeholder="e.g. 1st Place Hackathon Winner"
                      className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-md"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newAchieve.trim()) {
                          e.preventDefault();
                          setAchievements([...achievements, newAchieve.trim()]);
                          setNewAchieve("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAchieve.trim()) {
                          setAchievements([...achievements, newAchieve.trim()]);
                          setNewAchieve("");
                        }
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {achievements.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
                        {a}
                        <button onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))} className="text-amber-500 hover:text-amber-700">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Skills */}
          {activeTab === "skills" && (
            <div className="space-y-6 max-w-3xl">
              {/* Technical Skills */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Technical Skills (Languages, Frameworks, Databases)
                  </label>
                  <span className="text-[11px] text-slate-400">{technicalSkills.length} items</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTechSkill}
                    onChange={(e) => setNewTechSkill(e.target.value)}
                    placeholder="e.g. React, Node.js, PostgreSQL, Docker..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTechSkill.trim()) {
                        e.preventDefault();
                        setTechnicalSkills([...technicalSkills, newTechSkill.trim()]);
                        setNewTechSkill("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTechSkill.trim()) {
                        setTechnicalSkills([...technicalSkills, newTechSkill.trim()]);
                        setNewTechSkill("");
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {technicalSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => setTechnicalSkills(technicalSkills.filter((_, i) => i !== index))}
                        className="text-indigo-400 hover:text-indigo-700 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Soft & Leadership Skills
                  </label>
                  <span className="text-[11px] text-slate-400">{softSkills.length} items</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    placeholder="e.g. Agile/Scrum, Mentorship, Cross-Functional Leadership..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSoftSkill.trim()) {
                        e.preventDefault();
                        setSoftSkills([...softSkills, newSoftSkill.trim()]);
                        setNewSoftSkill("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSoftSkill.trim()) {
                        setSoftSkills([...softSkills, newSoftSkill.trim()]);
                        setNewSoftSkill("");
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
                  >
                    Add Soft Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {softSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => setSoftSkills(softSkills.filter((_, i) => i !== index))}
                        className="text-emerald-400 hover:text-emerald-700 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Utilities */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Tools, Platforms & Testing
                  </label>
                  <span className="text-[11px] text-slate-400">{tools.length} items</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="e.g. Git, Jira, Postman, Jest, Vite, Figma..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTool.trim()) {
                        e.preventDefault();
                        setTools([...tools, newTool.trim()]);
                        setNewTool("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTool.trim()) {
                        setTools([...tools, newTool.trim()]);
                        setNewTool("");
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
                  >
                    Add Tool
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tools.map((t, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTools(tools.filter((_, i) => i !== index))}
                        className="text-slate-400 hover:text-slate-700 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Work Experience */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Include chronological roles. Strong action verbs and metrics improve ATS keyword scoring.
                </p>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Role
                </button>
              </div>

              <div className="space-y-4">
                {experience.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800">Role #{expIdx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(expIdx)}
                        className="text-rose-500 hover:text-rose-700 p-1 text-xs flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title / Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExp(expIdx, "role", e.target.value)}
                          placeholder="Senior Software Engineer"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExp(expIdx, "company", e.target.value)}
                          placeholder="Tech Corp"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duration</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleUpdateExp(expIdx, "duration", e.target.value)}
                          placeholder="2022 - Present"
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-slate-700">Bullet Points / Accomplishments</label>
                        <button
                          type="button"
                          onClick={() => handleAddExpBullet(expIdx)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {exp.description.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex items-start gap-2">
                            <span className="text-slate-400 text-xs mt-1.5">•</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => handleUpdateExpBullet(expIdx, bulletIdx, e.target.value)}
                              placeholder="Action verb + context + measurable result (e.g. Scaled API throughput by 40%)..."
                              className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-hidden bg-slate-50/50"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteExpBullet(expIdx, bulletIdx)}
                              className="text-slate-400 hover:text-rose-500 p-1 mt-1"
                              title="Delete bullet"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Education & Projects */}
          {activeTab === "education" && (
            <div className="space-y-6">
              {/* Education Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" /> Education
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Degree
                  </button>
                </div>

                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx].degree = e.target.value;
                            setEducation(updated);
                          }}
                          placeholder="Degree (e.g. B.S. in Computer Science)"
                          className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md sm:col-span-2"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[idx].year = e.target.value;
                            setEducation(updated);
                          }}
                          placeholder="Year (e.g. 2018 - 2022)"
                          className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                        />
                      </div>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx].institution = e.target.value;
                          setEducation(updated);
                        }}
                        placeholder="Institution / University Name"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md mb-2"
                      />
                      <input
                        type="text"
                        value={edu.details || ""}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[idx].details = e.target.value;
                          setEducation(updated);
                        }}
                        placeholder="Honors, relevant coursework, or GPA (optional)"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-md text-slate-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-600" /> Featured Projects
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Project
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[idx].title = e.target.value;
                            setProjects(updated);
                          }}
                          placeholder="Project Title"
                          className="font-bold text-xs px-2.5 py-1 border border-slate-300 rounded-md w-2/3"
                        />
                        <button
                          type="button"
                          onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 text-xs p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={proj.techStack.join(", ")}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].techStack = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          setProjects(updated);
                        }}
                        placeholder="Tech Stack (comma separated: React, Node.js, Docker)"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-md mb-2 text-slate-600"
                      />
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...projects];
                          updated[idx].description = e.target.value;
                          setProjects(updated);
                        }}
                        placeholder="Project impact and key architecture..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: AI Raw Text Importer */}
          {activeTab === "raw" && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">AI Resume Parser</h4>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    Paste your entire raw resume text, markdown, or plain text export below. Our Gemini 3.7 Flash engine will automatically extract and categorize skills, work experience, roles, and education into the structured tabs.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paste Resume Content Here
                </label>
                <textarea
                  id="raw-resume-text-input"
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your full resume text here..."
                  className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden bg-white leading-relaxed"
                />
              </div>

              <button
                id="parse-raw-resume-btn"
                type="button"
                onClick={handleAiParseRawText}
                disabled={aiParsing || !rawText.trim()}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {aiParsing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Extracting & Structuring Resume with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Parse and Populate Structured Sections</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              id="save-resume-btn"
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {loading ? "Saving..." : initialResume ? "Update Resume" : "Save Resume"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
