import React from 'react';
import { Palette, Sparkles, Check, Layers } from 'lucide-react';
import { PortfolioData, ColorTheme, PRESET_THEMES, CARD_STYLE_OPTIONS, CardStyle } from '../types/portfolio';

interface ThemeCustomizerTabProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

export const ThemeCustomizerTab: React.FC<ThemeCustomizerTabProps> = ({ portfolio, setPortfolio }) => {
  const currentTheme = portfolio.theme;
  const currentCardStyle = portfolio.cardStyle || 'clean';

  const updateCardStyle = (style: CardStyle) => {
    setPortfolio(prev => ({
      ...prev,
      cardStyle: style
    }));
  };

  const updateColor = (key: keyof ColorTheme, val: string) => {
    setPortfolio(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: val
      }
    }));
  };

  const applyPreset = (preset: ColorTheme) => {
    setPortfolio(prev => ({
      ...prev,
      theme: { ...preset }
    }));
  };

  const colorFields: Array<{
    key: keyof ColorTheme;
    label: string;
    description: string;
  }> = [
    { key: 'bg', label: 'Page Background', description: 'Overall page backdrop (--bg)' },
    { key: 'surface', label: 'Card Surface', description: 'Project & content cards (--surface)' },
    { key: 'surface2', label: 'Secondary Surface', description: 'Tag badges & icon boxes (--surface-2)' },
    { key: 'border', label: 'Border & Dividers', description: 'Lines, card outlines & nav border (--border)' },
    { key: 'accent', label: 'Primary Accent', description: 'Brand links, dots & highlights (--accent)' },
    { key: 'accent2', label: 'Secondary Accent', description: 'Tag text & subtle badges (--accent-2)' },
    { key: 'text', label: 'Main Text', description: 'Primary headings and paragraph text (--text)' },
    { key: 'muted', label: 'Muted Text', description: 'Subheadings, labels, and dates (--muted)' },
    { key: 'buttonGradientStart', label: 'Button Gradient Start', description: 'Primary button gradient origin' },
    { key: 'buttonGradientEnd', label: 'Button Gradient End', description: 'Primary button gradient end' }
  ];

  return (
    <div className="space-y-6">
      {/* Preset Themes */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Choose Preset Theme
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PRESET_THEMES.map((preset, idx) => {
            const isSelected = currentTheme.name === preset.name;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-teal-400 bg-slate-800 shadow-md shadow-teal-500/10'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* Visual Palette Preview */}
                <div className="flex items-center gap-1 mb-2">
                  <span
                    className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                    style={{ backgroundColor: preset.bg }}
                  />
                  <span
                    className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                    style={{ backgroundColor: preset.surface }}
                  />
                  <span
                    className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                    style={{ backgroundColor: preset.accent }}
                  />
                  <span
                    className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${preset.buttonGradientStart}, ${preset.buttonGradientEnd})`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Repository & Card Visual Effects */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" /> Repository Card Visual Effects & Textures
          </label>
          <span className="text-[11px] text-teal-400 font-mono bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            Interactive
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3.5">
          Select a design effect for your project & repository cards. Updates live in your preview and exported website!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CARD_STYLE_OPTIONS.map(opt => {
            const isSelected = currentCardStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateCardStyle(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-400 bg-slate-800/90 shadow-lg shadow-teal-500/10 ring-1 ring-teal-400/50'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* Miniature Visual Texture */}
                <div className="h-14 rounded-lg mb-2.5 overflow-hidden border border-slate-700/60 relative p-2 flex flex-col justify-center items-center bg-slate-950">
                  {opt.id === 'clean' && (
                    <div className="w-full h-full rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-mono">Solid Surface</span>
                    </div>
                  )}

                  {opt.id === 'silver-shimmer' && (
                    <div className="w-full h-full rounded border border-slate-300/40 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-700/40 via-slate-200/15 to-slate-800/70 shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -rotate-12 translate-x-[-100%] group-hover:translate-x-[150%] transition-transform duration-700" />
                      <span className="text-[10px] font-semibold text-slate-100 tracking-wide z-10">
                        ✨ Silver Shimmer
                      </span>
                    </div>
                  )}

                  {opt.id === 'matrix-rain' && (
                    <div className="w-full h-full rounded border border-emerald-500/40 bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-mono text-[9px] text-emerald-400">
                      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:6px_6px]" />
                      <span className="z-10 font-bold text-emerald-300 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]">
                        &gt; 0101_CYBER
                      </span>
                    </div>
                  )}

                  {opt.id === 'diamond-grid' && (
                    <div className="w-full h-full rounded border border-cyan-500/30 bg-slate-900/90 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(45deg,#38bdf8_25%,transparent_25%),linear-gradient(-45deg,#38bdf8_25%,transparent_25%)] [background-size:8px_8px]" />
                      <span className="text-[10px] font-semibold text-cyan-200 z-10">◈ Diamond Mesh</span>
                    </div>
                  )}

                  {opt.id === 'tech-checker' && (
                    <div className="w-full h-full rounded border border-slate-700 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:10px_10px]" />
                      <span className="text-[10px] font-mono text-slate-300 z-10">+ Blueprint Grid</span>
                    </div>
                  )}

                  {opt.id === 'aurora-glow' && (
                    <div className="w-full h-full rounded border border-white/20 bg-slate-950 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#2dd4bf33,transparent_60%),radial-gradient(ellipse_at_bottom_right,#818cf840,transparent_60%)]">
                      <span className="text-[10px] font-semibold text-teal-200 z-10">✦ Aurora Glow</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {opt.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hex Code & Color Picker Customization */}
      <div className="pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-teal-400" /> Hex Code Color Controls
        </label>
        <p className="text-xs text-slate-400 mb-4">
          Adjust every CSS color variable in real time using Hex codes (e.g. <code>#0b1120</code>) or the color picker.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {colorFields.map(field => {
            const val = (currentTheme[field.key] as string) || '#ffffff';
            return (
              <div
                key={field.key}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
              >
                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{field.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{field.description}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Native Color Picker */}
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700 shrink-0 shadow-inner">
                    <input
                      type="color"
                      value={val.startsWith('#') && val.length === 7 ? val : '#0b1120'}
                      onChange={e => updateColor(field.key, e.target.value)}
                      className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0"
                    />
                  </div>

                  {/* Hex Text Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={val}
                      onChange={e => updateColor(field.key, e.target.value)}
                      placeholder="#000000"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
