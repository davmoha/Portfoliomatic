import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Palette,
  FolderArchive,
  BookOpen,
  Sparkles,
  Github,
  Download,
  Eye,
  Check,
  Code,
  Lock
} from 'lucide-react';
import { PortfolioData, DEFAULT_PORTFOLIO } from './types/portfolio';
import { Navbar } from './components/Navbar';
import { LivePreview } from './components/LivePreview';
import { ProfileTab } from './components/ProfileTab';
import { ContentTab } from './components/ContentTab';
import { ThemeCustomizerTab } from './components/ThemeCustomizerTab';
import { FilesTab } from './components/FilesTab';
import { DeployModal } from './components/DeployModal';
import { GuideModal } from './components/GuideModal';
import { UnlockModal } from './components/UnlockModal';
import { LandingHub } from './components/LandingHub';
import { ResumeArchitectView } from './components/ResumeArchitectView';
import { MockInterviewerView } from './components/MockInterviewerView';
import { SuiteTool } from './components/Navbar';
import { downloadPortfolioZip } from './utils/zipExporter';
import { generatePortfolioHtml } from './utils/templateGenerator';
import { exportProjectFile, importProjectFile } from './utils/projectFile';

export default function App() {
  // Active tool in the Mo-Blind Career Suite (defaults to the central Landing Hub)
  const [currentSuiteTool, setCurrentSuiteTool] = useState<SuiteTool>('hub');

  // Load initial state from localStorage or default
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem('portfoliomatic_data_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_PORTFOLIO;
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'content' | 'theme' | 'files'>('profile');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  // Pro monetization unlock state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const license = localStorage.getItem('portfoliomatic_pro_license');
      return !!license;
    } catch {
      return false;
    }
  });
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [unlockActionAttempted, setUnlockActionAttempted] = useState<'deploy' | 'download' | 'code'>('deploy');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('portfoliomatic_data_v1', JSON.stringify(portfolio));
    } catch {
      // ignore
    }
  }, [portfolio]);

  const handleResetSession = () => {
    if (confirm('Clear session data and reset to default?')) {
      localStorage.removeItem('portfoliomatic_data_v1');
      setPortfolio(DEFAULT_PORTFOLIO);
    }
  };

  const handleToggleTestLockState = () => {
    if (isUnlocked) {
      localStorage.removeItem('portfoliomatic_pro_license');
      setIsUnlocked(false);
    } else {
      localStorage.setItem('portfoliomatic_pro_license', 'PRO-VERIFIED-PASS');
      setIsUnlocked(true);
    }
  };

  const handleOpenUnlock = (action: 'deploy' | 'download' | 'code' = 'deploy') => {
    setUnlockActionAttempted(action);
    setIsUnlockOpen(true);
  };

  const handleDownloadZip = async () => {
    if (!isUnlocked) {
      handleOpenUnlock('download');
      return;
    }
    try {
      await downloadPortfolioZip(portfolio);
    } catch (err: any) {
      alert(`Download error: ${err.message}`);
    }
  };

  const handleOpenDeploy = () => {
    if (!isUnlocked) {
      handleOpenUnlock('deploy');
      return;
    }
    setIsDeployOpen(true);
  };

  const handleCopyHtml = async () => {
    if (!isUnlocked) {
      handleOpenUnlock('code');
      return;
    }
    try {
      const html = generatePortfolioHtml(portfolio);
      await navigator.clipboard.writeText(html);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSaveProject = () => {
    try {
      exportProjectFile(portfolio);
    } catch (err: any) {
      alert(`Could not export project file: ${err.message}`);
    }
  };

  const handleLoadProject = async (file: File) => {
    try {
      const loaded = await importProjectFile(file);
      setPortfolio(loaded);
    } catch (err: any) {
      alert(err.message || 'Failed to import project file.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        portfolio={portfolio}
        setPortfolio={setPortfolio}
        viewport={viewport}
        setViewport={setViewport}
        onDownloadZip={handleDownloadZip}
        onOpenDeploy={handleOpenDeploy}
        onOpenGuide={() => setIsGuideOpen(true)}
        onCopyHtml={handleCopyHtml}
        copied={copiedHtml}
        isUnlocked={isUnlocked}
        onOpenUnlock={handleOpenUnlock}
        onToggleLockState={handleToggleTestLockState}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
        currentSuiteTool={currentSuiteTool}
        onSelectSuiteTool={setCurrentSuiteTool}
      />

      {/* Main Workspace: Suite Tool Routing */}
      {currentSuiteTool === 'hub' ? (
        <LandingHub
          onSelectTool={setCurrentSuiteTool}
          isUnlocked={isUnlocked}
          onOpenUnlock={handleOpenUnlock}
        />
      ) : currentSuiteTool === 'resume' || currentSuiteTool === 'coverletter' ? (
        <ResumeArchitectView
          isUnlocked={isUnlocked}
          onOpenUnlock={handleOpenUnlock}
        />
      ) : currentSuiteTool === 'interview' ? (
        <MockInterviewerView
          isUnlocked={isUnlocked}
          onOpenUnlock={handleOpenUnlock}
        />
      ) : (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row gap-6">
          {/* Left Column: Form & Customizer Editor */}
          <section className="w-full lg:w-[480px] xl:w-[520px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden shrink-0">
            {/* Tabs navigation */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Identity</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Content</span>
              </button>

              <button
                onClick={() => setActiveTab('theme')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'theme'
                    ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Hex Colors</span>
              </button>

              <button
                onClick={() => setActiveTab('files')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === 'files'
                    ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span>Assets</span>
              </button>
            </div>

            {/* Tab content area with scrolling */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[calc(100vh-140px)]">
              {activeTab === 'profile' && (
                <ProfileTab portfolio={portfolio} setPortfolio={setPortfolio} />
              )}
              {activeTab === 'content' && (
                <ContentTab portfolio={portfolio} setPortfolio={setPortfolio} />
              )}
              {activeTab === 'theme' && (
                <ThemeCustomizerTab portfolio={portfolio} setPortfolio={setPortfolio} />
              )}
              {activeTab === 'files' && (
                <FilesTab
                  portfolio={portfolio}
                  setPortfolio={setPortfolio}
                  isUnlocked={isUnlocked}
                  onOpenUnlock={handleOpenUnlock}
                />
              )}
            </div>

            {/* Quick Footer inside Left Editor */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live synced
                </span>
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="text-slate-500 hover:text-rose-400 text-[11px] hover:underline"
                  title="Wipe browser edits and reset to blank template"
                >
                  Reset session
                </button>
              </div>
              <button
                onClick={handleOpenDeploy}
                className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                {!isUnlocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300">Unlock &amp; Deploy (Pro)</span>
                  </>
                ) : (
                  <>
                    <Github className="w-3.5 h-3.5" />
                    <span>Deploy to GitHub</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Right Column: Live Real-Time Preview */}
          <section className="flex-1 min-w-0 flex flex-col">
            <LivePreview
              portfolio={portfolio}
              viewport={viewport}
              isUnlocked={isUnlocked}
              onOpenUnlock={handleOpenUnlock}
            />
          </section>
        </main>
      )}

      {/* Portfoliomatic Pro Monetization / Unlock Modal */}
      <UnlockModal
        isOpen={isUnlockOpen}
        onClose={() => setIsUnlockOpen(false)}
        onUnlockSuccess={() => setIsUnlocked(true)}
        actionAttempted={unlockActionAttempted}
      />

      {/* Deployment Modal */}
      <DeployModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        portfolio={portfolio}
      />

      {/* 8-Step Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        username={portfolio.githubUsername}
      />
    </div>
  );
}
