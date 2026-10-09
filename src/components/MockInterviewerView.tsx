import React, { useState } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Award,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  FileText,
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  TrendingUp,
  Download
} from 'lucide-react';

interface MockInterviewerViewProps {
  isUnlocked: boolean;
  onOpenUnlock: (action?: 'deploy' | 'download' | 'code') => void;
  defaultResume?: string;
  defaultJobDescription?: string;
}

interface ChatTurn {
  role: 'interviewer' | 'candidate';
  text: string;
  feedback?: string | null;
  questionNumber?: number;
}

export const MockInterviewerView: React.FC<MockInterviewerViewProps> = ({
  isUnlocked,
  onOpenUnlock,
  defaultResume = '',
  defaultJobDescription = ''
}) => {
  const [positionName, setPositionName] = useState('Senior Cybersecurity Technical Project Manager');
  const [interviewerCompany, setInterviewerCompany] = useState('Defense & Aerospace Enterprise');
  const [interviewerName, setInterviewerName] = useState('Director of Technical Operations');
  const [interviewerEmail, setInterviewerEmail] = useState('');
  const [jobDescription, setJobDescription] = useState(
    defaultJobDescription ||
      `Requirements:\n- 10+ years directing technical infrastructure and cybersecurity operations\n- Proven ability leading cross-functional teams under strict SLAs\n- PMP, CISSP, or equivalent certifications\n- Deep knowledge of NIST 800-53, risk mitigation, and enterprise change management`
  );
  const [candidateResume, setCandidateResume] = useState(
    defaultResume ||
      `David Mohammed, PMP, CSM, PCCSE\n24 Years of technical leadership directing multi-site cybersecurity operations, defensive posture, and enterprise IT migrations. Commanded defense technical units, managed $1.2M vendor contracts, and spearheaded migration to zero-trust architecture.`
  );

  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [candidateInput, setCandidateInput] = useState('');
  const [interviewerPersona, setInterviewerPersona] = useState('');
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartSession = async () => {
    if (!positionName.trim() || !jobDescription.trim() || !candidateResume.trim()) {
      setErrorMessage('Please fill in Position Name, Job Description, and Candidate Resume to begin.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setTurns([]);
    setFinalReport(null);

    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionName,
          interviewerCompany,
          interviewerName,
          interviewerEmail,
          jobDescription,
          candidateResume,
          conversationHistory: [],
          userMessage:
            'Hello, I am ready to begin the interview rehearsal. Please introduce yourself in character as the interviewer, state the role, and ask your first question.'
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error starting interview rehearsal.');
      }

      const resData = await response.json();
      const data = resData.data;

      setInterviewerPersona(data.interviewerPersona || `${interviewerName} (${interviewerCompany})`);
      setTurns([
        {
          role: 'interviewer',
          text: data.interviewerReply,
          feedback: data.feedbackOnPrevious,
          questionNumber: data.questionNumber || 1
        }
      ]);
      setIsSessionActive(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start interview.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!candidateInput.trim()) return;

    // Check if session question limit reached for non-unlocked users
    if (!isUnlocked && turns.filter(t => t.role === 'interviewer').length >= 2) {
      onOpenUnlock('download');
      return;
    }

    const newCandidateTurn: ChatTurn = {
      role: 'candidate',
      text: candidateInput.trim()
    };

    const updatedHistory = [...turns, newCandidateTurn];
    setTurns(updatedHistory);
    const sentText = candidateInput;
    setCandidateInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionName,
          interviewerCompany,
          interviewerName,
          interviewerEmail,
          jobDescription,
          candidateResume,
          conversationHistory: updatedHistory,
          userMessage: sentText
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server error during interview response.');
      }

      const resData = await response.json();
      const data = resData.data;

      setTurns(prev => [
        ...prev,
        {
          role: 'interviewer',
          text: data.interviewerReply,
          feedback: data.feedbackOnPrevious,
          questionNumber: data.questionNumber || prev.length + 1
        }
      ]);

      if (data.isConcluded || data.overallSummary) {
        setFinalReport(data.overallSummary);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process interview response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionName,
          interviewerCompany,
          interviewerName,
          interviewerEmail,
          jobDescription,
          candidateResume,
          conversationHistory: turns,
          userMessage:
            'I would like to end the session now. Please provide a full, structured Interview Readiness Report summarizing my strongest answers, areas to sharpen, and concrete advice for the live interview.'
        })
      });

      if (response.ok) {
        const resData = await response.json();
        setFinalReport(resData.data.overallSummary || resData.data.interviewerReply);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Hiring Manager Persona Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Interview Rehearsal &amp; Coach
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Rehearse against the exact interviewer persona for your target role. Evaluates each response on the spot, offers instant coaching critiques, and identifies where your answers need harder metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isUnlocked && (
            <button
              onClick={() => onOpenUnlock('download')}
              className="px-4 py-2 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlock Unlimited ($29 / Vets $14.50)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      {!isSessionActive ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto w-full space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Calibrate Your Interview Session</h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide context about the position and interviewer so the simulation reflects their exact background and speaking style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Position Name
              </label>
              <input
                type="text"
                value={positionName}
                onChange={e => setPositionName(e.target.value)}
                placeholder="e.g. Senior Cybersecurity Project Manager"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Company
              </label>
              <input
                type="text"
                value={interviewerCompany}
                onChange={e => setInterviewerCompany(e.target.value)}
                placeholder="e.g. Northrop Grumman, Datadog"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Interviewer Name &amp; Title
              </label>
              <input
                type="text"
                value={interviewerName}
                onChange={e => setInterviewerName(e.target.value)}
                placeholder="e.g. Sarah Jenkins, VP of Engineering"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Interviewer Email or LinkedIn (Optional)
              </label>
              <input
                type="text"
                value={interviewerEmail}
                onChange={e => setInterviewerEmail(e.target.value)}
                placeholder="Optional for background research"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Target Job Description (JD)
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste requirements, duties, and qualifications..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Candidate Resume / Background
            </label>
            <textarea
              rows={5}
              value={candidateResume}
              onChange={e => setCandidateResume(e.target.value)}
              placeholder="Paste your resume summary, accomplishments, and career history..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl">
              {errorMessage}
            </p>
          )}

          <button
            onClick={handleStartSession}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Calibrating Interviewer Persona...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 fill-slate-950" />
                <span>Start Live Interview Simulation</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Active Simulation Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[700px]">
          {/* Simulation Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {interviewerPersona || `${interviewerName} (${interviewerCompany})`}
                </span>
                <span className="text-[11px] text-teal-400 font-medium">
                  Role: {positionName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEndSession}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Conclude &amp; Get Report
              </button>
              <button
                onClick={() => setIsSessionActive(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Reset Setup
              </button>
            </div>
          </div>

          {/* Dialogue Log */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-950/40">
            {turns.map((turn, idx) => (
              <div key={idx} className="space-y-3">
                {/* Feedback note if previous turn was candidate */}
                {turn.role === 'interviewer' && turn.feedback && (
                  <div className="bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-xl p-3.5 text-xs space-y-1">
                    <span className="font-bold text-teal-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Coach's Critique on Your Last Answer:
                    </span>
                    <p className="text-slate-300 leading-relaxed pl-5">{turn.feedback}</p>
                  </div>
                )}

                {/* Dialog message */}
                <div
                  className={`flex gap-3 max-w-2xl ${
                    turn.role === 'candidate' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      turn.role === 'candidate'
                        ? 'bg-teal-500 text-slate-950'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {turn.role === 'candidate' ? 'You' : 'HM'}
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      turn.role === 'candidate'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'bg-slate-900 text-slate-100 border border-slate-800 shadow-md'
                    }`}
                  >
                    {turn.role === 'interviewer' && turn.questionNumber && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                        Question #{turn.questionNumber}
                      </span>
                    )}
                    <p className="whitespace-pre-wrap">{turn.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 italic pl-11">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Interviewer is evaluating your response...</span>
              </div>
            )}

            {/* Final Report Card if Concluded */}
            {finalReport && (
              <div className="bg-slate-900 border-2 border-teal-500/40 rounded-2xl p-6 shadow-2xl space-y-3 mt-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Interview Readiness Report</span>
                </div>
                <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                  {finalReport}
                </pre>
              </div>
            )}
          </div>

          {/* User Input Footer */}
          {!isUnlocked && turns.filter(t => t.role === 'interviewer').length >= 1 && (
            <div className="px-4 py-2.5 bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 border-t border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium">
                  {turns.filter(t => t.role === 'interviewer').length >= 2
                    ? 'Free rehearsal turn limit reached. Unlock for unlimited questions & complete Readiness Report.'
                    : 'Free rehearsal question in progress. Unlock campaign pass for unlimited multi-turn simulations.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenUnlock('download')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs shrink-0 cursor-pointer shadow-sm transition-all"
              >
                Unlock Pass ($14.50 Vets / $29)
              </button>
            </div>
          )}

          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
            <textarea
              rows={2}
              value={candidateInput}
              onChange={e => setCandidateInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendResponse();
                }
              }}
              placeholder="Type your response to the interviewer (or press Enter to send)..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium resize-none"
            />

            <button
              onClick={handleSendResponse}
              disabled={isLoading || !candidateInput.trim()}
              className="px-5 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Send Answer</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
