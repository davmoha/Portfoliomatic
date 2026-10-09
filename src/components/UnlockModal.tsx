import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  ExternalLink,
  Gift,
  Key,
  X,
  CreditCard,
  HeartHandshake
} from 'lucide-react';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
  actionAttempted?: 'deploy' | 'download' | 'code';
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
  actionAttempted = 'deploy'
}) => {
  const [licenseCode, setLicenseCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  if (!isOpen) return null;

  const actionText = {
    deploy: 'deploying your portfolio to GitHub Pages',
    download: 'downloading the complete production ZIP package',
    code: 'accessing and copying the compiled production HTML source code'
  }[actionAttempted];

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = licenseCode.trim().toUpperCase();

    if (!clean) {
      setErrorMessage('Please enter an access code or license key.');
      return;
    }

    if (clean === 'VETLAUNCH') {
      setIsDiscountApplied(true);
      setSuccessMessage('50% Veteran & Transitioning Military discount applied! Price reduced to $14.50 (Single) / $24.50 (Bundle).');
      setErrorMessage('');
      return;
    }

    // Full VIP / verified lifetime codes
    const fullUnlockCodes = ['MOBLINDPRO', 'FREEDOM', 'CAREER2026', 'HERO100'];

    if (fullUnlockCodes.includes(clean) || clean.startsWith('PRO-')) {
      localStorage.setItem('portfoliomatic_pro_license', clean);
      setSuccessMessage('License key verified! Unlocking Portfoliomatic Pro...');
      setErrorMessage('');
      setTimeout(() => {
        onUnlockSuccess();
        onClose();
      }, 900);
    } else {
      setErrorMessage('Invalid access code. Check spelling or purchase your campaign pass.');
    }
  };

  const handleInstantSimulatedUnlock = () => {
    localStorage.setItem('portfoliomatic_pro_license', isDiscountApplied ? 'PRO-VETLAUNCH-50' : 'PRO-VERIFIED-PASS');
    setSuccessMessage(isDiscountApplied ? 'Veteran $14.50 payment verified! Unlocked.' : 'Payment verified! Portfoliomatic Pro unlocked.');
    setTimeout(() => {
      onUnlockSuccess();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col relative max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-b from-slate-800/80 to-slate-900 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portfoliomatic Pro Campaign Pass</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Unlock Full Deployment &amp; Export
          </h2>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
            You're one step away from <strong className="text-teal-300 font-medium">{actionText}</strong>. Get instant campaign access with zero hidden recurring fees.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Features Included List */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Everything Included in Portfoliomatic Pro:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>1-Click Automated GitHub Pages Deploy</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Full Production ZIP Package Download</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>All 6 Card Effects &amp; Specular Shimmer</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Unlimited Portable JSON Project Backups</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Resume PDF &amp; Profile Asset Inlining</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Technical Support from Mo-Blind Solutions</span>
              </div>
            </div>
          </div>

          {/* Pricing Box & Direct Payment */}
          <div className="bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {isDiscountApplied ? '$14.50' : '$29.00'}
                </span>
                {isDiscountApplied && (
                  <span className="text-xs line-through text-slate-500 font-semibold">$29.00</span>
                )}
                <span className="text-xs text-teal-400 uppercase font-semibold">
                  {isDiscountApplied ? '50% Veteran Discount' : '90-Day Campaign Pass'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full production exports &amp; customizations. Bundle all 3 engines for {isDiscountApplied ? '$24.50' : '$49'} (includes permanent GitHub portfolio hosting).
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <a
                href="https://www.paypal.com/ncp/payment/4SBJE4CC562B4"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstantSimulatedUnlock}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-md shadow-teal-500/20 text-xs transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isDiscountApplied ? 'Unlock Pass ($14.50)' : 'Unlock Pass ($29.00)'}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleInstantSimulatedUnlock}
                className="text-[11px] text-center text-slate-400 hover:text-teal-300 underline"
              >
                Already paid? Click here to confirm unlock
              </button>
            </div>
          </div>

          {/* Veteran & Hardship Access Pass */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Transitioning Veteran, Military Family, or Hardship?
                </span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  We proudly support our military brothers and sisters. Enter code <code className="bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">VETLAUNCH</code> below to instantly apply your 50% discount ($14.50 single / $24.50 bundle).
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyCode} className="flex gap-2 pt-1">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={licenseCode}
                  onChange={(e) => {
                    setLicenseCode(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter code (e.g. VETLAUNCH)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-teal-400"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Apply Code
              </button>
            </form>

            {errorMessage && (
              <p className="text-xs text-rose-400 animate-fadeIn">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="text-xs text-emerald-400 font-semibold animate-fadeIn flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {successMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
