import React, { useRef } from 'react';
import { User, Mail, Globe, ShieldAlert, Award, Briefcase, MapPin, ExternalLink, Image as ImageIcon, X, Upload } from 'lucide-react';
import { PortfolioData } from '../types/portfolio';

interface ProfileTabProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ portfolio, setPortfolio }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => {
    setPortfolio(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (e.g. PNG, SVG, JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      setPortfolio(prev => ({
        ...prev,
        logoImage: {
          fileName: file.name || 'logo.png',
          dataUrl,
          uploaded: true
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setPortfolio(prev => ({
      ...prev,
      logoImage: {
        fileName: 'logo.png',
        dataUrl: '',
        uploaded: false
      }
    }));
  };

  const handleUsernameChange = (val: string) => {
    const cleanUsername = val.trim().replace(/^@/, '');
    setPortfolio(prev => ({
      ...prev,
      githubUsername: cleanUsername,
      repoName: cleanUsername ? `${cleanUsername}.github.io` : 'username.github.io'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200/90 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold block mb-0.5">Privacy Notice (from Guide)</strong>
          Your GitHub Pages site is public. Remove private home addresses, personal phone numbers, or confidential
          client info. Use a broad location like "Florida, USA".
        </div>
      </div>

      {/* GitHub Username & Target Repo */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-teal-400">
          GitHub Target Repository
        </label>
        <div>
          <label className="text-xs text-slate-300 font-medium block mb-1.5">GitHub Username</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm font-mono">
              @
            </span>
            <input
              type="text"
              value={portfolio.githubUsername}
              onChange={e => handleUsernameChange(e.target.value)}
              placeholder="e.g. davmoha or alexrivera"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Target Pages Repo:{' '}
              <code className="text-teal-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                {portfolio.githubUsername ? `${portfolio.githubUsername}.github.io` : 'username.github.io'}
              </code>
            </span>
            {portfolio.githubUsername && (
              <a
                href={`https://github.com/${portfolio.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline flex items-center gap-1"
              >
                Profile <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Identity & Header Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={portfolio.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                placeholder="David Mohammed"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Brand / Company Name</label>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium hover:underline cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{portfolio.logoImage?.dataUrl ? 'Change Logo Image' : 'Upload Logo (.png)'}</span>
              </button>
            </div>
            
            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={portfolio.brandName}
                  onChange={e => updateField('brandName', e.target.value)}
                  placeholder="Mo-Blind"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* Logo preview thumbnail if uploaded */}
              {portfolio.logoImage?.dataUrl && (
                <div className="flex items-center gap-1.5 bg-slate-800 border border-teal-500/40 px-2 py-1.5 rounded-lg shrink-0">
                  <img
                    src={portfolio.logoImage.dataUrl}
                    alt="Logo preview"
                    className="h-6 w-auto max-w-[60px] object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    title="Remove custom logo image"
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {portfolio.logoImage?.dataUrl
                ? '✓ Custom logo image active (saved as logo.png in portfolio assets)'
                : 'Upload an optional PNG/SVG logo to replace the default text badge.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Professional Credentials / Subtitle
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={portfolio.credentials}
                onChange={e => updateField('credentials', e.target.value)}
                placeholder="PMP, CSM, PCCSE"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Contact Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={portfolio.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="virtualmoha@gmail.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Job Title / Target Role Headline <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={portfolio.headline}
              onChange={e => updateField('headline', e.target.value)}
              placeholder="Technical Project Manager | AI Solution Consultant"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Clearly states the position or value proposition you want visitors to see first.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Location (Public-Safe)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={portfolio.location}
                onChange={e => updateField('location', e.target.value)}
                placeholder="Florida, USA"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">CTA Button Text (Nav Action)</label>
            <input
              type="text"
              value={portfolio.hireMeButtonText}
              onChange={e => updateField('hireMeButtonText', e.target.value)}
              placeholder="Hire Me"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">LinkedIn Profile URL (Optional)</label>
          <input
            type="url"
            value={portfolio.linkedinUrl}
            onChange={e => updateField('linkedinUrl', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Support / PayPal / Donation Link (Optional)
          </label>
          <input
            type="url"
            value={portfolio.donationUrl || ''}
            onChange={e => updateField('donationUrl', e.target.value)}
            placeholder="https://www.paypal.com/ncp/payment/..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Add a link if you want visitors to be able to support or buy you a coffee directly from your portfolio.
          </span>
        </div>
      </div>
    </div>
  );
};
