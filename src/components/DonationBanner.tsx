import React from 'react';
import { Heart, ShieldCheck, ExternalLink, Sparkles, CreditCard, Building2 } from 'lucide-react';
import { Logo } from './Logo';

interface DonationBannerProps {
  paypalUrl?: string;
}

export const DonationBanner: React.FC<DonationBannerProps> = ({
  paypalUrl = 'https://www.paypal.com/ncp/payment/4SBJE4CC562B4'
}) => {
  return (
    <footer className="w-full bg-slate-900/90 border-t border-slate-800/80 mt-8 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Veteran Community Initiative</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
              <span>Donate if this was useful</span>
            </h2>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              This site was created to help the veteran community build professional portfolio websites.
              Help keep this site free and support future template and tool development.
            </p>

            <p className="text-xs text-slate-400">
              Developed and provided by{' '}
              <a
                href="https://mo-blind.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline font-semibold"
              >
                Mo-Blind Solutions LLC
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
            {/* PayPal Primary Button */}
            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 group"
            >
              {/* PayPal Stylized icon */}
              <span className="font-extrabold tracking-tight text-white flex items-center gap-0.5">
                <span className="italic text-base">P</span>
                <span className="italic text-base text-cyan-300 -ml-1">P</span>
              </span>
              <span>Donate with PayPal</span>
              <ExternalLink className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              Secure donation via PayPal checkout
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60 pt-4">
        <div className="flex items-center gap-3">
          <a href="https://mo-blind.com" target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Logo size="sm" />
          </a>
          <span className="text-left">
            © {new Date().getFullYear()}{' '}
            <a
              href="https://mo-blind.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-teal-400 font-semibold transition-colors"
            >
              Mo-Blind Solutions LLC
            </a>
            . All rights reserved.
          </span>
        </div>

        <a
          href="https://mo-blind.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-400 hover:underline flex items-center gap-1 text-xs"
        >
          <span>https://mo-blind.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </footer>
  );
};
