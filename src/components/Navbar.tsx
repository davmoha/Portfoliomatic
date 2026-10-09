import React, { useRef } from 'react';
import {
  Download,
  Github,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  ExternalLink,
  Save,
  FolderOpen,
  Lock,
  CheckCircle2,
  FileText,
  Mic,
  Home,
  LayoutGrid
} from 'lucide-react';
import { PortfolioData, PRESET_THEMES, DEFAULT_PORTFOLIO, ALEX_RIVERA_PORTFOLIO } from '../types/portfolio';
import { Logo } from './Logo';

export type SuiteTool = 'hub' | 'portfolio' | 'resume' | 'interview' | 'coverletter';

interface NavbarProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (vp: 'desktop' | 'tablet' | 'mobile') => void;
  onDownloadZip: () => void;
  onOpenDeploy: () => void;
  onOpenGuide: () => void;
  onCopyHtml: () => void;
  copied: boolean;
  isDeploying?: boolean;
  isUnlocked: boolean;
  onOpenUnlock: (action?: 'deploy' | 'download' | 'code') => void;
  onToggleLockState?: () => void;
  onSaveProject: () => void;
  onLoadProject: (file: File) => void;
  currentSuiteTool: SuiteTool;
  onSelectSuiteTool: (tool: SuiteTool) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  portfolio,
  setPortfolio,
  viewport,
  setViewport,
  onDownloadZip,
  onOpenDeploy,
  onOpenGuide,
  onCopyHtml,
  copied,
  isDeploying,
  isUnlocked,
  onOpenUnlock,
  onToggleLockState,
  onSaveProject,
  onLoadProject,
  currentSuiteTool,
  onSelectSuiteTool
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetSelect = (presetKey: string) => {
    if (presetKey === 'david') {
      setPortfolio({ ...DEFAULT_PORTFOLIO, theme: { ...DEFAULT_PORTFOLIO.theme } });
    } else if (presetKey === 'alex') {
      setPortfolio({ ...ALEX_RIVERA_PORTFOLIO, theme: { ...ALEX_RIVERA_PORTFOLIO.theme } });
    } else if (presetKey === 'reset') {
      setPortfolio({
        ...DEFAULT_PORTFOLIO,
        githubUsername: '',
        repoName: 'username.github.io',
        fullName: 'Your Name',
        brandName: 'Portfolio',
        credentials: '',
        headline: 'Your Professional Headline',
        heroSummary: 'Brief introduction highlighting your core strengths and accomplishments.',
        heroTags: ['Project Management', 'Engineering'],
        email: 'your-email@example.com',
        theme: PRESET_THEMES[0]
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadProject(file);
    }
    // reset input so the same file can be reloaded if needed
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2 flex items-center justify-between gap-4">
        {/* Brand: Mo-Blind Solutions LLC Logo & Portfoliomatic */}
        <div className="flex items-center gap-3.5">
          <a
            href="https://mo-blind.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Mo-Blind Solutions LLC (mo-blind.com)"
            className="flex items-center transition-transform hover:scale-105 shrink-0"
          >
            <Logo size="md" />
          </a>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">Portfoliomatic</span>
              <a
                href="https://mo-blind.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-0.5"
              >
                by Mo-Blind Solutions LLC
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
              </a>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Portfolio Generator for Veterans &amp; Professionals
            </p>
          </div>
        </div>

        {/* Center: Suite Switcher + Tool Controls */}
        <div className="flex items-center gap-3">
          {/* Tool Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto max-w-[90vw] sm:max-w-none">
            <button
              onClick={() => onSelectSuiteTool('hub')}
              title="Return to Career Suite Command Hub"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentSuiteTool === 'hub'
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Hub</span>
            </button>

            <button
              onClick={() => onSelectSuiteTool('resume')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentSuiteTool === 'resume'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <button
              onClick={() => onSelectSuiteTool('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentSuiteTool === 'portfolio'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </button>

            <button
              onClick={() => onSelectSuiteTool('interview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentSuiteTool === 'interview'
                  ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Interview</span>
            </button>
          </div>

          {currentSuiteTool === 'portfolio' && (
            <div className="hidden xl:flex items-center gap-2">
              {/* Preset Selector */}
              <div className="relative flex items-center text-xs">
                <span className="text-slate-400 mr-2 flex items-center gap-1">
                  Template:
                </span>
                <select
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-400 text-xs font-medium cursor-pointer"
                  onChange={(e) => handlePresetSelect(e.target.value)}
                  defaultValue="david"
                >
                  <option value="david">David Mohammed (Dark Teal)</option>
                  <option value="alex">Alex Rivera (Operations Guide)</option>
                  <option value="reset">Start Blank</option>
                </select>
              </div>

              <div className="h-5 w-px bg-slate-800 mx-1" />

              {/* Save & Open Project File Buttons (Zero database requirement) */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80">
                <button
                  onClick={onSaveProject}
                  title="Download portfolio project backup file (.json)"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-teal-400" />
                  <span>Save</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Open a saved portfolio project (.json)"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-all cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="h-5 w-px bg-slate-800 mx-1" />

              {/* Viewport switcher */}
              <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/80 flex items-center">
                <button
                  onClick={() => setViewport('desktop')}
                  title="Desktop View (100%)"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewport === 'desktop'
                      ? 'bg-slate-700 text-teal-300 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  title="Tablet View (768px)"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewport === 'tablet'
                      ? 'bg-slate-700 text-teal-300 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  title="Mobile View (375px)"
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewport === 'mobile'
                      ? 'bg-slate-700 text-teal-300 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Guide Modal Trigger */}
              <button
                onClick={onOpenGuide}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all cursor-pointer"
                title="Read step-by-step GitHub Pages setup guide"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                Guide
              </button>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Pro Status or Unlock Trigger */}
          {!isUnlocked ? (
            <button
              onClick={() => onOpenUnlock('deploy')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 rounded-lg transition-all shadow-md animate-pulse cursor-pointer"
              title="Unlock full deployment, production ZIP, and code export"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Unlock Pass ($29 / $14.50 Vets)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg"
                title="Portfoliomatic Pro Pass Active"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pro Active</span>
              </div>
              {onToggleLockState && (
                <button
                  type="button"
                  onClick={onToggleLockState}
                  title="Click to simulate locked visitor view and test payment prompts"
                  className="hidden md:inline-flex text-[10px] text-slate-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 transition-colors"
                >
                  Test Lock
                </button>
              )}
            </div>
          )}

          {/* Download ZIP */}
          <button
            onClick={onDownloadZip}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer ${
              !isUnlocked
                ? 'bg-slate-900 text-amber-200 border border-amber-500/50 hover:bg-slate-800 hover:border-amber-400'
                : 'text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
            }`}
            title={!isUnlocked ? "Locked: Click to unlock complete production ZIP package" : "Download ZIP package with index.html, profile.jpg, resume.pdf, and README.md"}
          >
            {!isUnlocked ? (
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Download className="w-4 h-4 text-teal-400" />
            )}
            <span className="hidden sm:inline">{!isUnlocked ? 'Unlock' : 'Download'}</span> ZIP
            {!isUnlocked && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1 py-0.2 rounded font-bold ml-0.5">
                PRO
              </span>
            )}
          </button>

          {/* Deploy to GitHub */}
          <button
            onClick={onOpenDeploy}
            disabled={isDeploying}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
              !isUnlocked
                ? 'text-amber-200 bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/60 shadow-amber-500/10'
                : 'text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-teal-500/20'
            }`}
            title={!isUnlocked ? "Locked: Click to purchase campaign pass or enter veteran code" : "Deploy to GitHub"}
          >
            {!isUnlocked ? (
              <Lock className="w-4 h-4 text-amber-400" />
            ) : (
              <Github className="w-4 h-4 fill-slate-950" />
            )}
            <span>{!isUnlocked ? 'Unlock & Deploy' : 'Deploy to GitHub'}</span>
            {!isUnlocked && (
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-black">
                PRO
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

