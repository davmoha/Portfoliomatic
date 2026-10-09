import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, username }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const toggleCheck = (stepId: number) => {
    setCheckedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const cleanUser = username.trim() || 'YOUR_USERNAME';

  const steps = [
    {
      id: 1,
      title: '1. Prepare your content',
      summary: 'Professional details, resume.pdf, profile.jpg, logo.png (optional), and privacy checklist.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>Gather these items before opening GitHub:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong>A professional name and headline:</strong> e.g., Operations Coordinator | Process Improvement or
              Technical Project Manager.
            </li>
            <li>
              <strong>A bio:</strong> Two or three sentences stating the work you want, your strengths, and one
              concrete accomplishment.
            </li>
            <li>
              <strong>A résumé PDF:</strong> Name the file exactly <code className="text-teal-300">resume.pdf</code>.
            </li>
            <li>
              <strong>A profile photo:</strong> Name the file exactly <code className="text-teal-300">profile.jpg</code>.
              Use a head-and-shoulders shot on a plain background.
            </li>
            <li>
              <strong>A brand logo (optional):</strong> Name the graphic <code className="text-teal-300">logo.png</code> or upload directly in Portfoliomatic.
            </li>
            <li>
              <strong>One to three public projects:</strong> Sample analyses, tools, documentation, or code repositories.
            </li>
          </ul>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200/90 text-[11px] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Privacy check:</strong> Your site and repos are public. Remove your home address, personal phone
              number, family details, duty station, or confidential employer data. Use a professional email and broad
              location such as "Florida, USA".
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '2. Create account & first project',
      summary: 'Sign up on GitHub, configure 2FA, and publish project repositories.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to{' '}
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline"
              >
                github.com/signup
              </a>{' '}
              and create your account. Pick a username you are comfortable putting on a résumé.
            </li>
            <li>Turn on two-factor authentication (2FA) in Settings &gt; Password and authentication.</li>
            <li>
              Create a new public repository for a project (e.g. <code>customer-service-process-guide</code>) with a
              descriptive README case study.
            </li>
          </ol>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-[11px] text-slate-400">
            <strong>Label every project honestly:</strong> State whether the project is a simulation, sample, or real
            work product. Never imply an invented client or outcome.
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '3. Website repository (username.github.io)',
      summary: 'Naming the GitHub Pages repository correctly.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            GitHub Pages requires special naming for your personal user portfolio repository:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/30 font-mono text-teal-300 text-xs text-center">
            {cleanUser}.github.io
          </div>
          <p>
            When named <code className="text-teal-300">{cleanUser}.github.io</code>, your website will be served directly
            at <code className="text-teal-300">https://{cleanUser}.github.io/</code>.
          </p>
          <p className="text-slate-400">
            Our <strong>Deploy to GitHub</strong> tool can automatically check and create this repository for you!
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: '4. Upload photo & résumé',
      summary: 'Commit profile.jpg and resume.pdf under 25 MiB.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Upload both files into the root of <code className="text-teal-300">{cleanUser}.github.io</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code className="text-teal-300">profile.jpg</code>: Professional portrait photo.
            </li>
            <li>
              <code className="text-teal-300">resume.pdf</code>: PDF document of your résumé.
            </li>
          </ul>
          <p className="text-slate-400">
            Keep each file under 25 MiB so mobile visitors load them quickly.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: '5. Generate index.html',
      summary: 'HTML, CSS variables, and dynamic GitHub repository fetching script.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            The generated <code className="text-teal-300">index.html</code> includes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Modern responsive design with CSS custom properties (variables) for all colors.</li>
            <li>Hero section with tags, about section, experience highlights, and skills chips.</li>
            <li>
              Dynamic JavaScript that fetches your public repositories from{' '}
              <code>https://api.github.com/users/{cleanUser}/repos</code>, generates project cards, and categorizes
              by topics!
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 6,
      title: '6. Turn on GitHub Pages',
      summary: 'Settings > Pages > Deploy from branch (main, root /)',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              In your repository <code className="text-teal-300">{cleanUser}.github.io</code>, go to{' '}
              <strong>Settings</strong> &gt; <strong>Pages</strong>.
            </li>
            <li>Under <strong>Build and deployment</strong>, choose <strong>Deploy from a branch</strong>.</li>
            <li>
              Select your default branch (usually <code className="text-teal-300">main</code>) and the{' '}
              <code className="text-teal-300">/(root)</code> folder. Click <strong>Save</strong>.
            </li>
            <li>
              Wait 1–3 minutes. Your site is live at{' '}
              <a
                href={`https://${cleanUser}.github.io/`}
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:underline"
              >
                https://{cleanUser}.github.io/
              </a>
              .
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 7,
      title: '7. Professional touch-up & case studies',
      summary: 'Restrained colors, honest case studies, and mobile responsiveness.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-800 rounded-lg">
              <strong className="text-white block mb-0.5">Target Role</strong>
              Lead with the role you want and one specific strength.
            </div>
            <div className="p-2.5 bg-slate-800 rounded-lg">
              <strong className="text-white block mb-0.5">Restrained Colors</strong>
              Keep text high contrast and readable against backgrounds.
            </div>
            <div className="p-2.5 bg-slate-800 rounded-lg">
              <strong className="text-white block mb-0.5">Case Study README</strong>
              Answer scenario, your role, what you produced, and what you learned.
            </div>
            <div className="p-2.5 bg-slate-800 rounded-lg">
              <strong className="text-white block mb-0.5">Mobile Check</strong>
              Verify navigation and card spacing on small screens.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: '8. Final review & troubleshooting',
      summary: 'Click every link, verify 404s, and test rate limits.',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p>Before sharing with recruiters or clients:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Confirm file names match <code>resume.pdf</code> and <code>profile.jpg</code> exactly.</li>
            <li>Check navigation anchors (#about, #experience, #skills, #projects, #resume, #contact).</li>
            <li>
              <strong>No cards showing?</strong> Confirm projects are <em>public</em> (not forks and not archived).
            </li>
            <li>
              <strong>404 Error?</strong> Confirm Pages branch is set to <code>main</code> and root <code>/</code>, then
              allow 2-5 minutes for GitHub build completion.
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-white">GitHub Pages Portfolio Master Guide</h2>
              <p className="text-xs text-slate-400">Complete 8-step setup checklist and best practices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with Left Nav & Right Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Step list navigation */}
          <div className="w-full md:w-72 bg-slate-950/90 border-r border-slate-800 p-3 overflow-y-auto space-y-1.5 shrink-0">
            {steps.map(step => {
              const isSelected = activeStep === step.id;
              const isChecked = Boolean(checkedSteps[step.id]);
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-slate-800 text-teal-300 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="truncate flex-1">
                    <span className="block truncate">{step.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleCheck(step.id);
                    }}
                    className="shrink-0 p-0.5"
                    title={isChecked ? 'Mark incomplete' : 'Mark completed'}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 transition-colors ${
                        isChecked ? 'text-emerald-400 fill-emerald-500/20' : 'text-slate-600'
                      }`}
                    />
                  </button>
                </button>
              );
            })}
          </div>

          {/* Step Detail Body */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {steps.find(s => s.id === activeStep)?.title}
              </h3>
              <button
                type="button"
                onClick={() => toggleCheck(activeStep)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                  checkedSteps[activeStep]
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {checkedSteps[activeStep] ? 'Completed' : 'Mark as done'}
              </button>
            </div>

            {steps.find(s => s.id === activeStep)?.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>
            Progress:{' '}
            <strong className="text-teal-400">
              {Object.values(checkedSteps).filter(Boolean).length} of {steps.length}
            </strong>{' '}
            completed
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
