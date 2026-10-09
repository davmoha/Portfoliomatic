import React, { useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Download,
  AlertCircle,
  FileCode,
  Globe,
  X,
  Lock
} from 'lucide-react';
import { PortfolioData } from '../types/portfolio';
import {
  generateDefaultProfileImage,
  generateStarterResumePdf
} from '../utils/assetsGenerator';
import { downloadSingleFile } from '../utils/zipExporter';
import { generatePortfolioHtml, generateReadme } from '../utils/templateGenerator';

interface FilesTabProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
  isUnlocked?: boolean;
  onOpenUnlock?: (action: 'deploy' | 'download' | 'code') => void;
}

export const FilesTab: React.FC<FilesTabProps> = ({
  portfolio,
  setPortfolio,
  isUnlocked = false,
  onOpenUnlock
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Logo upload handler
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

  // Profile image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (e.g. JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      setPortfolio(prev => ({
        ...prev,
        profileImage: {
          fileName: 'profile.jpg',
          dataUrl,
          uploaded: true
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // Resume PDF upload handler
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 25MB as per GitHub limits)
    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds 25 MB limit specified by GitHub.');
      return;
    }

    const sizeFormatted = (file.size / 1024).toFixed(1) + ' KB';
    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      setPortfolio(prev => ({
        ...prev,
        resumePdf: {
          fileName: 'resume.pdf',
          dataUrl,
          uploaded: true,
          fileSize: sizeFormatted
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // Generate fallback avatar
  const handleGenerateAvatar = () => {
    const generated = generateDefaultProfileImage(
      portfolio.fullName,
      portfolio.theme.accent,
      portfolio.theme.bg
    );
    setPortfolio(prev => ({
      ...prev,
      profileImage: {
        fileName: 'profile.jpg',
        dataUrl: generated,
        uploaded: false
      }
    }));
  };

  // Generate starter resume
  const handleGeneratePdf = () => {
    const starterPdf = generateStarterResumePdf(
      portfolio.fullName,
      portfolio.headline,
      portfolio.email
    );
    setPortfolio(prev => ({
      ...prev,
      resumePdf: {
        fileName: 'resume.pdf',
        dataUrl: starterPdf,
        uploaded: false,
        fileSize: '1.2 KB'
      }
    }));
  };

  // Current avatar source
  const currentAvatarSrc =
    portfolio.profileImage.dataUrl ||
    generateDefaultProfileImage(portfolio.fullName, portfolio.theme.accent, portfolio.theme.bg);

  return (
    <div className="space-y-6">
      {/* Informative banner from Guide */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-2 text-teal-400 font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>Strict File Naming Required by GitHub Pages Guide</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          The template references <code>profile.jpg</code> for your headshot and <code>resume.pdf</code> for your
          curriculum vitae. Both files are automatically named and bundled with your generated site.
        </p>
      </div>

      {/* Profile Picture Uploader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Profile Photo (<code>profile.jpg</code>)
            </span>
          </div>
          {portfolio.profileImage.uploaded ? (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" /> Custom photo uploaded
            </span>
          ) : (
            <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
              <Sparkles className="w-3 h-3" /> Auto-Generated Monogram
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            <img
              src={currentAvatarSrc}
              alt="Avatar preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-teal-400 shadow-md bg-slate-950"
            />
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-xs text-slate-400">
              Upload a clear head-and-shoulders portrait on a simple background.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
                Upload Photo
              </button>
              <button
                type="button"
                onClick={handleGenerateAvatar}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Generate Monogram
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Logo Graphic Uploader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Brand Logo (<code>logo.png</code>)
            </span>
          </div>
          {portfolio.logoImage?.uploaded ? (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" /> Custom logo uploaded
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              Text badge active ({portfolio.brandName || 'Mo-Blind'})
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          {/* Logo Preview */}
          <div className="relative group shrink-0 w-20 h-16 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center p-1.5 overflow-hidden">
            {portfolio.logoImage?.dataUrl ? (
              <img
                src={portfolio.logoImage.dataUrl}
                alt="Logo preview"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-[10px] font-bold text-teal-400 font-mono text-center">
                {portfolio.brandName || 'LOGO'}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload an optional PNG or SVG logo icon to display in your portfolio navigation header.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>{portfolio.logoImage?.uploaded ? 'Replace Logo' : 'Upload Logo'}</span>
              </button>
              {portfolio.logoImage?.uploaded && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-medium border border-slate-800 hover:border-rose-800/40 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  Reset to Text Badge
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume PDF Uploader */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Résumé PDF (<code>resume.pdf</code>)
            </span>
          </div>
          {portfolio.resumePdf.uploaded ? (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" /> Custom PDF uploaded ({portfolio.resumePdf.fileSize})
            </span>
          ) : (
            <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
              <Sparkles className="w-3 h-3" /> Starter PDF Ready
            </span>
          )}
        </div>

        <div className="pt-1 space-y-2">
          <p className="text-xs text-slate-400">
            A public-safe PDF of your employment history, competencies, and contact email.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
              Upload resume.pdf
            </button>
            <button
              type="button"
              onClick={handleGeneratePdf}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Reset Starter PDF
            </button>
          </div>
        </div>
      </div>

      {/* Package File Inventory */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
          Output Bundle Files
        </span>
        <div className="space-y-2">
          {/* index.html */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-mono">
              <FileCode className="w-4 h-4 text-teal-400" />
              <span>index.html</span>
              <span className="text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded font-sans">
                HTML + CSS + Repo Script
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isUnlocked) {
                  onOpenUnlock?.('download');
                  return;
                }
                downloadSingleFile('index.html', generatePortfolioHtml(portfolio), 'text/html');
              }}
              className={`flex items-center gap-1 text-xs transition-colors ${
                !isUnlocked
                  ? 'text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:underline'
              }`}
            >
              {!isUnlocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Download className="w-3 h-3" />}
              <span>{!isUnlocked ? 'Unlock Code' : 'Download'}</span>
            </button>
          </div>

          {/* profile.jpg */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-mono">
              <ImageIcon className="w-4 h-4 text-teal-400" />
              <span>profile.jpg</span>
              <span className="text-[10px] text-slate-400 font-sans">Portrait Photo</span>
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          {/* logo.png (if uploaded) */}
          {portfolio.logoImage?.dataUrl && (
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-teal-500/30 text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-slate-200 font-mono">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>logo.png</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded font-sans">
                  Brand Logo Graphic
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Bundled
              </span>
            </div>
          )}

          {/* resume.pdf */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-mono">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>resume.pdf</span>
              <span className="text-[10px] text-slate-400 font-sans">Curriculum Vitae</span>
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>

          {/* README.md */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-mono">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>README.md</span>
              <span className="text-[10px] text-slate-400 font-sans">Repository Case Study</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isUnlocked) {
                  onOpenUnlock?.('download');
                  return;
                }
                downloadSingleFile('README.md', generateReadme(portfolio), 'text/markdown');
              }}
              className={`flex items-center gap-1 text-xs transition-colors ${
                !isUnlocked
                  ? 'text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:underline'
              }`}
            >
              {!isUnlocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Download className="w-3 h-3" />}
              <span>{!isUnlocked ? 'Unlock MD' : 'Download'}</span>
            </button>
          </div>

          {/* .nojekyll */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-200 font-mono">
              <FileCode className="w-4 h-4 text-slate-400" />
              <span>.nojekyll</span>
              <span className="text-[10px] text-slate-400 font-sans">GitHub Pages Flag</span>
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
