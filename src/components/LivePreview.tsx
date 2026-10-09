import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Code2,
  Eye,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { PortfolioData } from '../types/portfolio';
import { generatePortfolioHtml } from '../utils/templateGenerator';
import { generateDefaultProfileImage } from '../utils/assetsGenerator';

interface LivePreviewProps {
  portfolio: PortfolioData;
  viewport: 'desktop' | 'tablet' | 'mobile';
  isUnlocked?: boolean;
  onOpenUnlock?: (action: 'code') => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  portfolio,
  viewport,
  isUnlocked = false,
  onOpenUnlock
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Generate HTML
  const compiledHtml = useMemo(() => {
    let html = generatePortfolioHtml(portfolio);

    // If profileImage has dataUrl or default generated, inline it for the preview iframe
    const profileImgSrc =
      portfolio.profileImage.dataUrl ||
      generateDefaultProfileImage(portfolio.fullName, portfolio.theme.accent, portfolio.theme.bg);

    // Replace relative profile.jpg with dataUrl so it renders in srcdoc preview
    if (profileImgSrc) {
      html = html.replace('src="profile.jpg"', `src="${profileImgSrc}"`);
    }

    // Replace relative logo.png with dataUrl so it renders in srcdoc preview
    if (portfolio.logoImage?.dataUrl) {
      html = html.replace('src="logo.png"', `src="${portfolio.logoImage.dataUrl}"`);
    }

    return html;
  }, [portfolio]);

  const handleCopyCode = async () => {
    if (!isUnlocked) {
      onOpenUnlock?.('code');
      return;
    }
    try {
      await navigator.clipboard.writeText(compiledHtml);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([compiledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Viewport width styling
  const viewportWidthClass = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  }[viewport];

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
        isFullScreen ? 'fixed inset-4 z-50 rounded-2xl' : 'h-full min-h-[600px]'
      }`}
    >
      {/* Mock Browser Header / Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        {/* Window dots */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* Address bar simulating GitHub Pages */}
        <div className="flex-1 max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center justify-between text-slate-400 gap-2">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-mono text-[11px] text-slate-300">
              https://<strong className="text-teal-400">{portfolio.githubUsername || 'username'}</strong>.github.io/
            </span>
          </div>
          <button
            onClick={() => setIframeKey(k => k + 1)}
            title="Reload Preview"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-2">
          {/* Tabs: Preview vs Code */}
          <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>HTML</span>
              {!isUnlocked && <Lock className="w-2.5 h-2.5 text-teal-400 ml-0.5" />}
            </button>
          </div>

          {/* Popout button */}
          <button
            onClick={handleOpenNewWindow}
            title="Open in new window"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullScreen(f => !f)}
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Preview'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 bg-slate-950 overflow-auto flex items-start justify-center p-3 relative">
        {activeTab === 'preview' ? (
          <div
            className={`transition-all duration-300 h-full rounded-lg shadow-xl overflow-hidden border border-slate-800/80 bg-slate-900 ${viewportWidthClass}`}
          >
            <iframe
              key={iframeKey}
              title="Portfolio Live Preview"
              srcDoc={compiledHtml}
              className="w-full h-full min-h-[750px] border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col bg-slate-950 text-slate-200 font-mono text-xs p-4 overflow-hidden rounded-lg border border-slate-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
              <span className="text-teal-400 font-semibold">index.html (Production Output)</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : !isUnlocked ? 'Unlock Code' : 'Copy HTML'}
              </button>
            </div>

            {/* Code Body with Lock Overlay if not unlocked */}
            <div className="relative flex-1 overflow-auto">
              <pre className={`overflow-auto whitespace-pre leading-relaxed selection:bg-teal-500/30 ${!isUnlocked ? 'filter blur-[3px] select-none opacity-40' : ''}`}>
                <code>{compiledHtml}</code>
              </pre>

              {!isUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950/70 backdrop-blur-[2px] text-center z-10">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">Production Code Locked</h3>
                  <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                    Unlock Portfoliomatic Pro to view, copy, and export complete production-ready source code, or enter your veteran access code.
                  </p>
                  <button
                    onClick={() => onOpenUnlock?.('code')}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlock Pro / Veteran Code ($19.99)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

