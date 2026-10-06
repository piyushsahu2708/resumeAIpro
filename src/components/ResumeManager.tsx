import React, { useState } from "react";
import { Plus, FileText, CheckCircle2, Edit3, Trash2, Sparkles, Briefcase, Code2, Award, Calendar } from "lucide-react";
import { Resume } from "../types";
import { ResumeEditorModal } from "./ResumeEditorModal";

interface ResumeManagerProps {
  resumes: Resume[];
  selectedResumeId: string;
  onSelectResume: (id: string) => void;
  onCreateResume: (resume: Partial<Resume>) => Promise<void>;
  onUpdateResume: (id: string, resume: Partial<Resume>) => Promise<void>;
  onDeleteResume: (id: string) => Promise<void>;
  onGoToAnalyze: () => void;
  onOpenUploadModal?: () => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
  resumes = [],
  selectedResumeId,
  onSelectResume,
  onCreateResume,
  onUpdateResume,
  onDeleteResume,
  onGoToAnalyze,
  onOpenUploadModal,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | null>(null);

  const safeResumes = resumes || [];
  const activeResume = safeResumes.find((r) => r.id === selectedResumeId) || safeResumes[0] || null;

  const handleOpenCreate = () => {
    setEditingResume(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (resume: Resume) => {
    setEditingResume(resume);
    setIsEditorOpen(true);
  };

  const handleSaveModal = async (payload: Partial<Resume>) => {
    if (editingResume) {
      await onUpdateResume(editingResume.id, payload);
    } else {
      await onCreateResume(payload);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Resume Library</h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain multiple tailored versions for different job archetypes (Fullstack, Frontend, Cloud/DevOps).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:border-indigo-400 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2"
            >
              Upload PDF / File
            </button>
          )}
          <button
            id="create-new-resume-btn"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Resume
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List of Saved Resumes */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Saved Resumes ({safeResumes.length})
          </h2>

          {safeResumes.map((resume) => {
            const isSelected = resume.id === selectedResumeId;
            return (
              <div
                key={resume.id}
                id={`resume-card-${resume.id}`}
                onClick={() => onSelectResume(resume.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? "bg-indigo-50/50 border-indigo-300 shadow-xs ring-1 ring-indigo-200"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 shrink-0 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                      <h3 className="text-sm font-bold text-slate-900 truncate">{resume.title}</h3>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mt-0.5 truncate">{resume.targetRole || "Software Role"}</p>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {/* Skills tags preview */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(resume.skills?.technical || []).slice(0, 4).map((tech, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                      {tech}
                    </span>
                  ))}
                  {(resume.skills?.technical || []).length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{resume.skills.technical.length - 4} more
                    </span>
                  )}
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(resume);
                    }}
                    className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <div className="flex items-center gap-2">
                    {safeResumes.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
                            onDeleteResume(resume.id);
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Active Resume Inspection & Quick Actions */}
        <div className="lg:col-span-8">
          {activeResume ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Profile Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Active Profile</span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                      Ready for Matching
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{activeResume.title}</h2>
                  <p className="text-sm font-medium text-slate-600">{activeResume.targetRole}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    id="edit-active-resume-btn"
                    onClick={() => handleOpenEdit(activeResume)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Content
                  </button>
                  <button
                    id="analyze-with-active-btn"
                    onClick={onGoToAnalyze}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Run Job Match
                  </button>
                </div>
              </div>

              {/* Summary */}
              {activeResume.summary && (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Professional Summary</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {activeResume.summary}
                  </p>
                </div>
              )}

              {/* Skills Matrix */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Structured Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
                    <span className="text-[11px] font-bold text-indigo-900 block mb-2">Technical Core</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeResume.skills?.technical || []).map((s, i) => (
                        <span key={i} className="text-xs bg-white text-indigo-700 px-2 py-0.5 rounded-md font-medium border border-indigo-200/60 shadow-2xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-[11px] font-bold text-emerald-900 block mb-2">Soft & Leadership</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeResume.skills?.soft || []).map((s, i) => (
                        <span key={i} className="text-xs bg-white text-emerald-700 px-2 py-0.5 rounded-md font-medium border border-emerald-200/60 shadow-2xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-800 block mb-2">Tools & DevOps</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeResume.skills?.tools || []).map((s, i) => (
                        <span key={i} className="text-xs bg-white text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200 shadow-2xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Work Experience ({activeResume.experience?.length || 0})
                </h3>
                <div className="space-y-4">
                  {(activeResume.experience || []).map((exp, i) => (
                    <div key={exp.id || i} className="border-l-2 border-indigo-200 pl-4 py-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{exp.duration}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600">{exp.company} {exp.location ? `• ${exp.location}` : ""}</p>
                      <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                        {exp.description.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Education</h3>
                  <div className="space-y-2">
                    {(activeResume.education || []).map((edu, i) => (
                      <div key={edu.id || i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600">{edu.institution} ({edu.year})</p>
                        {edu.details && <p className="text-slate-500 mt-1 text-[11px]">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Projects & Impact</h3>
                  <div className="space-y-2">
                    {(activeResume.projects || []).map((proj, i) => (
                      <div key={proj.id || i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <p className="font-bold text-slate-900">{proj.title}</p>
                        <p className="text-indigo-600 text-[11px] font-medium">{proj.techStack.join(", ")}</p>
                        <p className="text-slate-600 mt-1">{proj.description}</p>
                      </div>
                    ))}
                    {(activeResume.projects || []).length === 0 && (
                      <p className="text-xs text-slate-400 italic">No featured projects added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Resume Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create a new resume or paste your text to get started with instant AI job description matching.
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
              >
                Create Your First Resume
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <ResumeEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveModal}
          initialResume={editingResume}
        />
      )}
    </div>
  );
};
