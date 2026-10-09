import React from 'react';
import {
  FileText,
  Globe,
  Mic,
  Mail,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
  Users,
  Award,
  Zap,
  PhoneCall,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface LandingHubProps {
  onSelectTool: (tool: 'portfolio' | 'resume' | 'interview' | 'coverletter') => void;
  isUnlocked: boolean;
  onOpenUnlock: (action?: 'deploy' | 'download' | 'code') => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectTool,
  isUnlocked,
  onOpenUnlock
}) => {
  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Mo-Blind Solutions LLC • Career Launchpad Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop Sending Generic Applications.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300">
              Launch an Unbeatable Campaign.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
            Designed for transitioning military veterans, seasoned operators, and ambitious professionals. Turn complex career backgrounds into ATS-optimized resumes, rehearse against specific hiring manager personas, and deploy a live portfolio website in 1 click.
          </p>

          {/* Quick Stats / Highlights */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-400 font-semibold border-t border-slate-800/80 pt-5">
            <div className="flex items-center gap-1.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero AI Hallucinations</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Demilitarized Terminology</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>100% Free Hosting on GitHub</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>50% Military Discount (<code className="bg-slate-800 text-teal-300 px-1 py-0.5 rounded font-mono">VETLAUNCH</code>)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tools Grid: 4 Accessible Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Select Your Career Weapon
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Access individual tools or run the complete 3-in-1 pipeline.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">Military code:</span>
            <code className="bg-slate-900 border border-slate-700 text-teal-300 px-2 py-1 rounded text-xs font-mono font-bold">
              VETLAUNCH (50% Off)
            </code>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: ATS Resume Architect & Gap Closer */}
          <div
            onClick={() => onSelectTool('resume')}
            className="group relative bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white block">$29</span>
                  <span className="text-[11px] font-bold text-teal-400">Vets: $14.50</span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-[11px] font-semibold mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>17–20 Year Transition Model</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                  ATS Resume Architect &amp; Gap Closer
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Consolidate up to 5 previous resumes, military evaluations (NCOERs/OERs), or job histories. Demilitarizes terminology, runs real-time ATS keyword gap analysis, and interactively weaves in unmentioned real-world experience.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Interactive gap closer (click missing skills to add experience)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Strict zero-hallucination constraint</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs font-bold text-teal-400 group-hover:underline flex items-center gap-1.5">
                <span>Try Draft Free</span>
                {!isUnlocked && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Export Locked ($14.50/$29)
                  </span>
                )}
              </span>
              <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-teal-400 text-slate-300 group-hover:text-slate-950 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Portfoliomatic GitHub Pages Deployer */}
          <div
            onClick={() => onSelectTool('portfolio')}
            className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white block">$29</span>
                  <span className="text-[11px] font-bold text-cyan-400">Vets: $14.50</span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold mb-2">
                  <Zap className="w-3 h-3" />
                  <span>Zero Monthly Hosting Fees</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Portfoliomatic Live Portfolio Deployer
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Generate modern developer and executive portfolios with real-time hex color customization, 6 specular card styles, asset uploads, live responsive preview, and 1-click deployment straight to free GitHub Pages hosting.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>6 high-end specular cards (Glass, Cyber, Titanium, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Portable JSON save/open files (no database required)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs font-bold text-cyan-400 group-hover:underline flex items-center gap-1.5">
                <span>Customize Free</span>
                {!isUnlocked && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Deploy &amp; ZIP Locked
                  </span>
                )}
              </span>
              <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-cyan-400 text-slate-300 group-hover:text-slate-950 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Hiring Manager Mock Interviewer */}
          <div
            onClick={() => onSelectTool('interview')}
            className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                  <Mic className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white block">$29</span>
                  <span className="text-[11px] font-bold text-amber-400">Vets: $14.50</span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-2">
                  <Users className="w-3 h-3" />
                  <span>Persona Calibration</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Hiring Manager Persona Interviewer
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Rehearse your upcoming interview with an AI agent calibrated to your specific interviewer's name, company, and tenure. Conducts a realistic back-and-forth simulation with instant coaching feedback after every answer.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dynamic 1-question-at-a-time live conversational drill</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Post-session strengths &amp; weakness readiness report</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs font-bold text-amber-400 group-hover:underline flex items-center gap-1.5">
                <span>Start Practice Drill</span>
                {!isUnlocked && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> 1 Turn Free • Pass Locked
                  </span>
                )}
              </span>
              <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-amber-400 text-slate-300 group-hover:text-slate-950 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 4: Targeted Executive Cover Letter */}
          <div
            onClick={() => onSelectTool('coverletter')}
            className="group relative bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/20 transition-all">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white block">$19.99</span>
                  <span className="text-[11px] font-bold text-violet-400">Order Bump: +$9.99</span>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-[11px] font-semibold mb-2">
                  <Award className="w-3 h-3" />
                  <span>Pain-Point Synthesis</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                  Targeted Executive Cover Letter
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Synthesize your unique career transition into a compelling, 3-paragraph executive narrative connecting your past accomplishments directly to the target company's immediate business bottlenecks and leadership needs.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Available standalone or as a 1-click +$9.99 add-on</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Formatted for immediate copy/paste into application portals</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs font-bold text-violet-400 group-hover:underline flex items-center gap-1">
                Generate Cover Letter
              </span>
              <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-violet-400 text-slate-300 group-hover:text-slate-950 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Complete 3-in-1 Bundle Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-cyan-950/70 border-2 border-teal-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Best Value • Most Popular Choice</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            The Complete Career Launchpad Campaign Pass
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Full 90-day active campaign access to all 3 flagship engines with 10 role customizations (ATS Resume Architect, Mock Interview Simulator, and permanent Portfoliomatic GitHub Deployer) + Cover Letter.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-teal-300 font-semibold">
            <span>✓ 10 Role Customizations Included</span>
            <span>•</span>
            <span>Add-On: +$10 for 5 Extra Roles &amp; Drills</span>
            <span>•</span>
            <span>Free GitHub Hosting Forever</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="text-center lg:text-right">
            <div className="flex items-baseline justify-center lg:justify-end gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white">$49</span>
              <span className="text-xs line-through text-slate-500 font-bold">$107 Value</span>
            </div>
            <span className="text-xs text-teal-400 font-bold block">
              Vets Pay Only $24.50 with code VETLAUNCH
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              90-Day Campaign Pass • Includes 10 Roles
            </span>
          </div>

          <button
            onClick={() => onOpenUnlock('download')}
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-xl shadow-teal-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
          >
            <span>Unlock Campaign Pass ($49)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Cadillac Tier (Alex Hormozi Grand Slam Offer) */}
      <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive 1-on-1 • The Cadillac Option</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              1-on-1 Career Strategy &amp; Technical Audit Intensive
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Work directly with <strong>David Mohammed, PMP, CSM, PCCSE</strong> (24 years of technical leadership directing enterprise cybersecurity, infrastructure, and multi-site operations).
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-amber-300 block">$199</span>
            <span className="text-xs font-bold text-amber-400/80">Veterans: $99 (50% Off)</span>
          </div>
        </div>

        {/* Deliverables Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>60-Min Recorded Strategy Call</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Direct deep dive into your target role, salary negotiation targets, positioning against civilian competitors, and live interview drill.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Line-by-Line Resume Overhaul</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Asynchronous executive review of your resume and GitHub portfolio with personalized edits from a senior technical director.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Direct LinkedIn Strategy Sync</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Audit of your LinkedIn headline, bio, and featured project links to ensure inbound recruiters find and message you directly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <span className="text-xs text-slate-400 italic">
            * Strictly limited to 5 candidates per week to ensure dedicated preparation time.
          </span>

          <a
            href="https://www.linkedin.com/in/david-a-mohammed"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <span>Book 1-on-1 Intensive via LinkedIn</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
