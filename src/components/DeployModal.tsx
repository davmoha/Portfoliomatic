import React, { useState, useEffect } from 'react';
import {
  X,
  Github,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PortfolioData } from '../types/portfolio';
import { deployToGitHub, DeploymentLog, DeploymentResult } from '../utils/githubDeployer';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose, portfolio }) => {
  const [authMethod, setAuthMethod] = useState<'pat' | 'oauth'>('pat');
  const [patToken, setPatToken] = useState('');
  const [oauthToken, setOauthToken] = useState('');
  const [oauthUser, setOauthUser] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [result, setResult] = useState<DeploymentResult | null>(null);
  const [oauthStatus, setOauthStatus] = useState<{
    oauthConfigured: boolean;
    appUrl: string;
    callbackUrl: string;
  } | null>(null);

  // Check backend OAuth config status on mount
  useEffect(() => {
    fetch('/api/auth/status')
      .then(res => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          throw new Error('Static frontend mode (no Node backend running)');
        }
        return res.json();
      })
      .then(data => {
        setOauthStatus(data);
        if (data.oauthConfigured) {
          setAuthMethod('oauth');
        } else {
          setAuthMethod('pat');
        }
      })
      .catch(() => {
        setOauthStatus({
          oauthConfigured: false,
          appUrl: window.location.origin,
          callbackUrl: `${window.location.origin}/auth/callback`
        });
        setAuthMethod('pat');
      });
  }, []);

  // Listen for OAuth postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setOauthToken(event.data.token);
        setOauthUser(event.data.user);
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        alert(`GitHub Authentication Failed: ${event.data.error}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  const activeToken = authMethod === 'oauth' ? oauthToken : patToken;

  const handleStartOAuthPopup = async () => {
    try {
      const res = await fetch(`/api/auth/github/url?origin=${encodeURIComponent(window.location.origin)}`);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(
          'GitHub OAuth requires a running Node.js server. Because this site is hosted on static web hosting (Apache/Hostinger), please use the "Personal Access Token (PAT)" method above — it connects directly to GitHub from your browser without needing a server!'
        );
      }
      const data = await res.json();
      if (!data.url) {
        throw new Error(data.error || 'GitHub OAuth is not configured on the server yet.');
      }
      const popup = window.open(data.url, 'github_oauth_popup', 'width=600,height=750');
      if (!popup) {
        alert('Popup was blocked by your browser. Please allow popups to connect with GitHub.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to open GitHub OAuth popup');
      setAuthMethod('pat');
    }
  };

  const handleDeploy = async () => {
    if (!activeToken) {
      alert('Please connect via GitHub OAuth or provide a GitHub Personal Access Token.');
      return;
    }

    setIsDeploying(true);
    setLogs([]);
    setResult(null);

    const deployResult = await deployToGitHub(activeToken, portfolio, log => {
      setLogs(prev => [...prev, log]);
    });

    setIsDeploying(false);
    setResult(deployResult);

    if (deployResult.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Deploy to GitHub Pages</h2>
              <p className="text-xs text-slate-400">
                Pushes your files directly to <code>username.github.io</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Target details */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-teal-400" />
              <span>Target Website:</span>
              <strong className="text-white font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                https://{portfolio.githubUsername || 'username'}.github.io/
              </strong>
            </div>
            <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
              Root Branch: main
            </span>
          </div>

          {/* Authentication Method Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Choose Authentication Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAuthMethod('pat')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  authMethod === 'pat'
                    ? 'border-teal-400 bg-teal-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Key className="w-4 h-4 text-teal-400" />
                  <span>Personal Access Token (PAT)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Instant connect without OAuth app registration. Recommended for quick deployments.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('oauth')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  authMethod === 'oauth'
                    ? 'border-teal-400 bg-teal-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>OAuth 1-Click Login</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Log in via GitHub OAuth popup window if OAuth app credentials are set up.
                </p>
              </button>
            </div>
          </div>

          {/* PAT Input Section */}
          {authMethod === 'pat' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  GitHub Personal Access Token (Classic or Fine-grained)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,workflow,read:user&description=Portfoliomatic+GitHub+Pages+Deployer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Create token on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <input
                type="password"
                value={patToken}
                onChange={e => setPatToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
              />

              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Requires <strong>repo</strong> and <strong>workflow</strong> scope so the deployer can commit
                  files and enable GitHub Pages on your behalf.
                </span>
              </div>
            </div>
          )}

          {/* OAuth Connect Section */}
          {authMethod === 'oauth' && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
              {oauthUser ? (
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={oauthUser.avatar_url}
                      alt={oauthUser.login}
                      className="w-8 h-8 rounded-full border border-emerald-400/50"
                    />
                    <div>
                      <span className="font-semibold text-white block">Connected as @{oauthUser.login}</span>
                      <span className="text-emerald-400 text-[11px]">Ready to push to {oauthUser.login}.github.io</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOauthToken('');
                      setOauthUser(null);
                    }}
                    className="text-slate-400 hover:text-rose-400 text-xs hover:underline"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Connect your GitHub account to authorize automatic repository creation and publishing.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartOAuthPopup}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    Sign in with GitHub OAuth
                  </button>

                  {/* Callback instructions */}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200/90 space-y-2">
                    <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> If using GitHub OAuth App:
                    </div>
                    <p className="text-[11px] text-slate-300">
                      GitHub requires the exact callback URL registered in your GitHub Developer Settings to match your site domain:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-[10px] bg-slate-900 px-2 py-1.5 rounded border border-slate-700 text-teal-300 select-all break-all">
                        {`${window.location.origin}/auth/callback`}
                      </code>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      If GitHub says <em>"redirect_uri is not associated with this application"</em>, your GitHub OAuth App settings have a different URL (e.g. localhost or a different domain) than <strong>{window.location.origin}</strong>.
                    </p>
                    <div className="pt-1 border-t border-amber-500/20">
                      <button
                        type="button"
                        onClick={() => setAuthMethod('pat')}
                        className="text-xs text-teal-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        → Or switch to Personal Access Token (PAT) for instant direct deploy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Live Deployment Logs / Progress */}
          {logs.length > 0 && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 text-teal-400 font-bold uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5" /> Deployment Console Output
              </div>
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 leading-relaxed ${
                    log.isError ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 shrink-0 text-[10px]">{log.timestamp}</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Success Banner */}
          {result?.success && (
            <div className="bg-teal-500/10 border border-teal-500/40 rounded-xl p-4 text-xs text-teal-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                <span>Portfolio Successfully Deployed to GitHub Pages!</span>
              </div>
              <p className="text-slate-300">
                Your portfolio repository has been pushed and GitHub Pages is configured.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={result.liveSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20"
                >
                  <Globe className="w-3.5 h-3.5" /> Visit Live Site
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={result.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> Open Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 italic">
                * Note: GitHub Pages can take up to 2-5 minutes to build and propagate DNS worldwide on your first
                deploy.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleDeploy}
            disabled={isDeploying || !activeToken}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deploying to GitHub...</span>
              </>
            ) : (
              <>
                <Github className="w-4 h-4 fill-slate-950" />
                <span>Push &amp; Deploy Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
