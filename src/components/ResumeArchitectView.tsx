import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Lock,
  Mail,
  RefreshCw,
  Award,
  TrendingUp,
  FileCheck,
  Sliders,
  ExternalLink
} from 'lucide-react';

interface ResumeTransformResult {
  matchScore: number;
  summaryHeadline: string;
  keywordsMatched: string[];
  keywordsMissing: string[];
  militaryTranslations: Array<{
    original: string;
    civilian: string;
    impact: string;
  }>;
  strategicGaps: string[];
  strategicRecommendations: string[];
  transformedResumeMarkdown: string;
  coverLetterMarkdown?: string | null;
}

interface ResumeArchitectViewProps {
  isUnlocked: boolean;
  onOpenUnlock: (action?: 'deploy' | 'download' | 'code') => void;
}

export const ResumeArchitectView: React.FC<ResumeArchitectViewProps> = ({
  isUnlocked,
  onOpenUnlock
}) => {
  const [candidateName, setCandidateName] = useState('David Mohammed');
  const [jobDescription, setJobDescription] = useState(
    `Senior Cybersecurity Technical Project Manager (Remote)\n\nRequirements:\n- 10+ years managing complex enterprise security implementations\n- Active PMP, CISSP, or PCCSE certifications\n- Deep experience with risk assessment frameworks (NIST 800-53, ISO 27001)\n- Proven experience directing incident response and threat mitigation\n- Exceptional stakeholder communication bridging engineering and executive leadership\n- Experience managing cross-functional technical teams and budget tracking in Jira/Confluence`
  );
  const [resumes, setResumes] = useState<string[]>([
    `David Mohammed, PMP, CSM, PCCSE\n24 Years of Experience directing complex cybersecurity, operations, and enterprise technical infrastructure.\n\nMilitary & Technical Leadership:\n- Directed multi-site communications and defensive cyber posture across 5 operating locations with zero downtime.\n- Commanded task-force technical units responsible for secure tactical and strategic network operations.\n- Spearheaded enterprise migration to zero-trust architecture saving $450k annually.\n- Mentored 120+ technical personnel and maintained 100% compliance across defense audits.`
  ]);
  const [activeResumeIndex, setActiveResumeIndex] = useState(0);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true);

  // Additional experience to close gaps
  const [additionalExperience, setAdditionalExperience] = useState('');
  const [selectedMissingKeyword, setSelectedMissingKeyword] = useState<string | null>(null);

  // Generation state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ResumeTransformResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeResultTab, setActiveResultTab] = useState<'resume' | 'coverletter' | 'analysis'>('resume');
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  const loadingSteps = [
    'Parsing target job description & extracting ATS keywords...',
    'Demilitarizing operational terminology into corporate civilian language...',
    'Mapping transferable skills & calculating keyword density score...',
    'Restructuring experience into 3-5 quantified, high-impact ROI bullets...',
    'Formulating targeted executive cover letter & strategic gap analysis...'
  ];

  const handleAddResumeSlot = () => {
    if (resumes.length >= 5) return;
    setResumes([...resumes, '']);
    setActiveResumeIndex(resumes.length);
  };

  const handleRemoveResumeSlot = (index: number) => {
    if (resumes.length <= 1) return;
    const updated = resumes.filter((_, i) => i !== index);
    setResumes(updated);
    setActiveResumeIndex(Math.max(0, index - 1));
  };

  const handleResumeTextChange = (text: string) => {
    const updated = [...resumes];
    updated[activeResumeIndex] = text;
    setResumes(updated);
  };

  const handleAddMissingKeywordToExperience = (keyword: string) => {
    setSelectedMissingKeyword(keyword);
    setAdditionalExperience(prev => {
      if (prev.includes(keyword)) return prev;
      const starter = prev ? `${prev}\n• ${keyword}: ` : `• ${keyword}: `;
      return starter;
    });
  };

  const handleGenerate = async () => {
    const filledResumes = resumes.filter(r => r.trim().length > 15);
    if (filledResumes.length === 0) {
      setErrorMessage('Please paste at least one past resume, NCOER, or job history.');
      return;
    }
    if (jobDescription.trim().length < 25) {
      setErrorMessage('Please paste the complete target job description.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setLoadingStep(0);

    // Combine original resumes + any newly added real experience
    const allInputs = [...filledResumes];
    if (additionalExperience.trim().length > 5) {
      allInputs.push(
        `ADDITIONAL CANDIDATE-VERIFIED EXPERIENCE & PREVIOUSLY OMITTED SKILLS:\n${additionalExperience.trim()}`
      );
    }

    // Step cycle animation
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const response = await fetch('/api/resume/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          resumes: allInputs,
          jobDescription,
          includeCoverLetter
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error during resume transformation.');
      }

      const resData = await response.json();
      setResult(resData.data);
      setActiveResultTab('resume');
    } catch (err: any) {
      clearInterval(interval);
      let msg = err.message || 'Failed to transform resume. Please try again.';
      try {
        if (msg.includes('{') && msg.includes('}')) {
          const jsonMatch = msg.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.error?.message) {
              msg = parsed.error.message;
            }
          }
        }
      } catch {
        // use msg
      }
      if (msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
        msg = 'Google AI service was temporarily busy. Click "Retry Now" to re-run with our automatic fallback engine.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, type: 'resume' | 'coverletter') => {
    if (!isUnlocked) {
      onOpenUnlock('code');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'resume') {
        setCopiedResume(true);
        setTimeout(() => setCopiedResume(false), 2000);
      } else {
        setCopiedCoverLetter(true);
        setTimeout(() => setCopiedCoverLetter(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const handleDownloadMarkdown = (content: string, filename: string) => {
    if (!isUnlocked) {
      onOpenUnlock('download');
      return;
    }
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Military-to-Civilian &amp; Executive Career Transformation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ATS Resume Architect &amp; Gap Analyzer
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Consolidate 3–5 previous resumes, military evaluations, or job histories into one ATS-optimized powerhouse tailored precisely to your target job description. <strong className="text-teal-300 font-semibold">Zero hallucinations or fabricated credentials.</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isUnlocked && (
            <button
              onClick={() => onOpenUnlock('download')}
              className="px-4 py-2 bg-teal-950/70 hover:bg-teal-900/80 border border-teal-500/40 text-teal-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>Unlock Export ($29 / Vets $14.50)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inputs (Job Description + Multi-Resume Upload) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {/* Candidate Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Candidate Name &amp; Target Title
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                placeholder="e.g. David Mohammed, PMP"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-medium"
              />
            </div>

            {/* Target Job Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Job Description (JD)
                </label>
                <span className="text-[11px] text-teal-400 font-semibold">Required for Keyword Mapping</span>
              </div>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting, required qualifications, and core duties here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono leading-relaxed"
              />
            </div>

            {/* Multi-Resume / Evaluation Input Slots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Resumes &amp; Military Evals ({resumes.length}/5)
                </label>
                {resumes.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddResumeSlot}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Resume
                  </button>
                )}
              </div>

              {/* Slot Switcher Tabs */}
              <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                {resumes.map((_, idx) => (
                  <div key={idx} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveResumeIndex(idx)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeResumeIndex === idx
                          ? 'bg-slate-800 text-teal-300 border border-slate-700 shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Source #{idx + 1}
                    </button>
                    {resumes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveResumeSlot(idx)}
                        title="Remove this resume source"
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <textarea
                rows={7}
                value={resumes[activeResumeIndex] || ''}
                onChange={e => handleResumeTextChange(e.target.value)}
                placeholder={`Paste Resume #${activeResumeIndex + 1}, evaluation report (NCOER/OER), or work history here...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono leading-relaxed"
              />
            </div>

            {/* Value-Add Order Bump Checkbox: Cover Letter */}
            <div className="bg-gradient-to-r from-teal-950/30 to-slate-950 border border-teal-500/30 rounded-xl p-3.5 flex items-start gap-3">
              <input
                type="checkbox"
                id="coverLetterToggle"
                checked={includeCoverLetter}
                onChange={e => setIncludeCoverLetter(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-500 rounded border-slate-700 bg-slate-900 focus:ring-teal-400 cursor-pointer"
              />
              <label htmlFor="coverLetterToggle" className="text-xs cursor-pointer">
                <span className="font-bold text-white block">
                  Include Tailored Executive Cover Letter <span className="text-amber-400 font-semibold">(+$9.99 Value Add)</span>
                </span>
                <span className="text-slate-400 block mt-0.5 leading-relaxed">
                  Synthesizes your military/career transition into a compelling, 3-paragraph narrative connecting your background to the company's pain points.
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="text-xs text-rose-300 font-medium bg-rose-950/60 border border-rose-800/50 p-3.5 rounded-xl animate-fadeIn flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer self-start sm:self-center transition-colors shadow-sm disabled:opacity-50"
                >
                  Retry Now
                </button>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 hover:from-teal-300 hover:to-cyan-200 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Transforming Your Career Documents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Analyze Gaps &amp; Transform Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Results & Gap Analysis */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[480px] text-center space-y-5 animate-fadeIn">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-teal-400 animate-spin" />
                <ShieldCheck className="w-7 h-7 text-teal-400 absolute inset-0 m-auto" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Analyzing &amp; Demilitarizing Your Background
                </h3>
                <p className="text-xs text-teal-400 font-medium animate-pulse">
                  {loadingSteps[loadingStep]}
                </p>
              </div>

              <div className="max-w-md w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!isLoading && !result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[480px] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Your Results Will Appear Here</h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Paste your past resume(s) and target job description on the left, then click <strong>"Analyze Gaps &amp; Transform Resume"</strong>. Our 17-20 year executive transition engine will deliver your ATS score, demilitarized terminology translations, and rewritten resume.
              </p>
            </div>
          )}

          {!isLoading && result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
              {/* Score & Header Card */}
              <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-teal-500/40 flex items-center justify-center shadow-inner">
                      <span className="text-lg font-black text-white">{result.matchScore}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                      ATS Keyword Match Score
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {result.summaryHeadline || 'Targeted Executive Transformation'}
                    </h3>
                  </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveResultTab('resume')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeResultTab === 'resume'
                        ? 'bg-slate-800 text-teal-300 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Transformed Resume
                  </button>

                  {result.coverLetterMarkdown && (
                    <button
                      onClick={() => setActiveResultTab('coverletter')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        activeResultTab === 'coverletter'
                          ? 'bg-slate-800 text-teal-300 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Cover Letter
                    </button>
                  )}

                  <button
                    onClick={() => setActiveResultTab('analysis')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      activeResultTab === 'analysis'
                        ? 'bg-slate-800 text-teal-300 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gap Analysis &amp; Translations
                  </button>
                </div>
              </div>

              {/* Prominent Locked Banner across the top of the result */}
              {!isUnlocked && (
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-b border-amber-500/30 p-3.5 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="font-bold text-amber-300 block">
                        Free Draft Preview Active • Full Export Locked
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Review your score and gap analysis. Unlock to copy raw markdown, download .md, and export executive cover letter.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenUnlock('download')}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Pass ($14.50 Vets / $29)</span>
                  </button>
                </div>
              )}

              {/* Tab 1: Transformed Resume */}
              {activeResultTab === 'resume' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400 font-mono">
                      ATS Formatted Resume (Markdown &amp; Text)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(result.transformedResumeMarkdown, 'resume')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg text-xs transition-colors cursor-pointer ${
                          !isUnlocked
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {copiedResume ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : !isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedResume ? 'Copied' : !isUnlocked ? 'Unlock to Copy' : 'Copy Resume'}</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDownloadMarkdown(
                            result.transformedResumeMarkdown,
                            `${(candidateName || 'candidate').toLowerCase().replace(/\s+/g, '-')}-resume.md`
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg text-xs transition-colors cursor-pointer ${
                          !isUnlocked
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {!isUnlocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{!isUnlocked ? 'Unlock .md' : 'Download .md'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <pre
                      className={`w-full bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[550px] overflow-y-auto selection:bg-teal-500/30 ${
                        !isUnlocked ? 'filter blur-[1.5px] select-none opacity-80' : ''
                      }`}
                    >
                      {result.transformedResumeMarkdown}
                    </pre>

                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-3">
                          <Lock className="w-6 h-6 text-teal-400" />
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">
                          Unlock Complete Production Resume
                        </h4>
                        <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
                          Your resume is generated and ready to download! Unlock full export or apply your 50% military discount code <code className="bg-slate-800 text-teal-300 px-1 py-0.5 rounded font-mono">VETLAUNCH</code> ($14.50).
                        </p>
                        <button
                          onClick={() => onOpenUnlock('download')}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                        >
                          Unlock Full Resume &amp; Cover Letter
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Refine / Gap Closer Callout */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-300">
                        Notice skills or qualifications from the job description missing from this draft?
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveResultTab('analysis')}
                      className="text-teal-400 hover:text-teal-300 font-bold hover:underline whitespace-nowrap flex items-center gap-1 cursor-pointer"
                    >
                      <span>Add Unmentioned Experience</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Cover Letter */}
              {activeResultTab === 'coverletter' && result.coverLetterMarkdown && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <span className="text-slate-400 font-mono">
                      Targeted Executive Cover Letter (Order Bump)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(result.coverLetterMarkdown || '', 'coverletter')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-lg text-xs transition-colors cursor-pointer ${
                          !isUnlocked
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {copiedCoverLetter ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : !isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCoverLetter ? 'Copied' : !isUnlocked ? 'Unlock to Copy' : 'Copy Letter'}</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDownloadMarkdown(
                            result.coverLetterMarkdown || '',
                            `${(candidateName || 'candidate').toLowerCase().replace(/\s+/g, '-')}-cover-letter.md`
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 font-semibold rounded-lg text-xs transition-colors cursor-pointer ${
                          !isUnlocked
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        {!isUnlocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Download className="w-3.5 h-3.5" />}
                        <span>{!isUnlocked ? 'Unlock .md' : 'Download .md'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <pre
                      className={`w-full bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[550px] overflow-y-auto selection:bg-teal-500/30 ${
                        !isUnlocked ? 'filter blur-[1.5px] select-none opacity-80' : ''
                      }`}
                    >
                      {result.coverLetterMarkdown}
                    </pre>

                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
                          <Lock className="w-6 h-6 text-amber-400" />
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">
                          Executive Cover Letter Locked
                        </h4>
                        <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
                          Tailored precisely to the hiring manager and target role. Unlock full export with code <code className="bg-slate-800 text-teal-300 px-1 py-0.5 rounded font-mono">VETLAUNCH</code> ($14.50).
                        </p>
                        <button
                          onClick={() => onOpenUnlock('download')}
                          className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md transition-all cursor-pointer"
                        >
                          Unlock Complete Cover Letter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Gap Analysis & Military Translations */}
              {activeResultTab === 'analysis' && (
                <div className="p-5 space-y-6 text-xs max-h-[600px] overflow-y-auto">
                  {/* Military-to-Civilian Translations */}
                  {result.militaryTranslations && result.militaryTranslations.length > 0 && (
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Military-to-Civilian Language Translations (Demilitarized)</span>
                      </h4>
                      <div className="space-y-2.5">
                        {result.militaryTranslations.map((trans, i) => (
                          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <span className="font-mono text-rose-300 line-through text-[11px]">
                                {trans.original}
                              </span>
                              <span className="font-bold text-emerald-400 text-xs">
                                ➔ {trans.civilian}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] leading-relaxed">{trans.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keywords Matched vs Missing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                      <span className="font-bold text-emerald-300 block mb-2">
                        ✓ Keywords Matched from Job Description ({result.keywordsMatched?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywordsMatched?.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-amber-300 block">
                          ⚠ Missing or Low-Frequency Keywords ({result.keywordsMissing?.length || 0})
                        </span>
                        <span className="text-[10px] text-amber-400/80 font-medium">Click to add experience</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywordsMissing?.map((kw, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAddMissingKeywordToExperience(kw)}
                            title={`Click if you have real experience with "${kw}" that wasn't in your old resume`}
                            className="bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 hover:border-amber-400 text-amber-200 px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 group"
                          >
                            <span>{kw}</span>
                            <span className="text-[10px] text-amber-400 group-hover:scale-125 transition-transform">+</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Gap Closer / Missing Experience Integrator */}
                  <div className="bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/40 rounded-xl p-4.5 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-xs">
                          Have Real Experience With Missing Skills That Wasn't On Your Old Resumes?
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                          Job seekers and transitioning veterans frequently leave key achievements off past evaluations. Add your authentic real-world experience below (or click any missing keyword above). We will re-generate your resume, re-calculate your ATS score, and weave those skills in without hallucinating.
                        </p>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={additionalExperience}
                      onChange={e => setAdditionalExperience(e.target.value)}
                      placeholder="e.g. • NIST 800-53: I led compliance audits for 2 years across tactical networks.&#10;• Vendor Management: Managed $1.2M in enterprise Cisco/Palo Alto support contracts..."
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-teal-400"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {additionalExperience.trim().length > 0 ? (
                          <span className="text-teal-300 font-semibold">✓ Ready to re-weave into your resume</span>
                        ) : (
                          'Tip: Click missing keywords above or type your unmentioned experience'
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isLoading || additionalExperience.trim().length < 5}
                        className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold text-xs rounded-lg shadow transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Re-Generate Resume with Added Experience</span>
                      </button>
                    </div>
                  </div>

                  {/* Strategic Gaps & Recommendations */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span>Prioritized Career Transition Recommendations</span>
                    </h4>
                    <ul className="space-y-2 text-slate-300 text-xs">
                      {result.strategicRecommendations?.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
