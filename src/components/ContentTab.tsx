import React, { useState } from 'react';
import { Plus, X, Sparkles, Trash2, ListChecks, CheckCircle2 } from 'lucide-react';
import { PortfolioData } from '../types/portfolio';

interface ContentTabProps {
  portfolio: PortfolioData;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

const COMMON_SKILL_PRESETS = [
  'Project Management',
  'Agile / Scrum',
  'AI Consulting',
  'Process Improvement',
  'Workflow Automation',
  'Technical Documentation',
  'Stakeholder Communication',
  'Web Development',
  'Python',
  'TypeScript',
  'React',
  'Cloud Architecture',
  'Data Analysis',
  'Risk Management',
  'CI/CD Pipelines'
];

export const ContentTab: React.FC<ContentTabProps> = ({ portfolio, setPortfolio }) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newHighlightInput, setNewHighlightInput] = useState('');

  const updateField = <K extends keyof PortfolioData>(key: K, value: PortfolioData[K]) => {
    setPortfolio(prev => ({ ...prev, [key]: value }));
  };

  // Hero tags
  const addHeroTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || portfolio.heroTags.includes(trimmed)) return;
    setPortfolio(prev => ({
      ...prev,
      heroTags: [...prev.heroTags, trimmed]
    }));
    setNewTagInput('');
  };

  const removeHeroTag = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      heroTags: prev.heroTags.filter((_, i) => i !== index)
    }));
  };

  // Highlights
  const addHighlight = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    setPortfolio(prev => ({
      ...prev,
      experienceHighlights: [...prev.experienceHighlights, trimmed]
    }));
    setNewHighlightInput('');
  };

  const removeHighlight = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      experienceHighlights: prev.experienceHighlights.filter((_, i) => i !== index)
    }));
  };

  const updateHighlight = (index: number, val: string) => {
    setPortfolio(prev => ({
      ...prev,
      experienceHighlights: prev.experienceHighlights.map((item, i) => (i === index ? val : item))
    }));
  };

  // Skills
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || portfolio.skills.includes(trimmed)) return;
    setPortfolio(prev => ({
      ...prev,
      skills: [...prev.skills, trimmed]
    }));
    setNewSkillInput('');
  };

  const removeSkill = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Hero Section Content */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Hero Value Statement &amp; Badges
          </h3>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Hero Brief Summary</label>
          <textarea
            rows={2}
            value={portfolio.heroSummary}
            onChange={e => updateField('heroSummary', e.target.value)}
            placeholder="I turn complex workflows into clear, useful processes. Explore my work and get in touch about opportunities."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Hero Tags / Certifications</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {portfolio.heroTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-teal-300 text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeHeroTag(idx)}
                  className="hover:text-rose-400 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={e => setNewTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHeroTag(newTagInput))}
              placeholder="Add tag (e.g. PMP, CSM, AI)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
            />
            <button
              type="button"
              onClick={() => addHeroTag(newTagInput)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">About Me Section</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Section Label</label>
            <input
              type="text"
              value={portfolio.aboutLabel}
              onChange={e => updateField('aboutLabel', e.target.value)}
              placeholder="About me"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Headline Heading</label>
            <input
              type="text"
              value={portfolio.aboutHeading}
              onChange={e => updateField('aboutHeading', e.target.value)}
              placeholder="Operations-driven problem solver"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">About Bio Paragraphs</label>
          <textarea
            rows={4}
            value={portfolio.aboutBio}
            onChange={e => updateField('aboutBio', e.target.value)}
            placeholder="Write your professional story here..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400 leading-relaxed"
          />
        </div>
      </div>

      {/* Experience Highlights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Experience Highlights</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Section Label</label>
            <input
              type="text"
              value={portfolio.experienceLabel}
              onChange={e => updateField('experienceLabel', e.target.value)}
              placeholder="Experience"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Heading</label>
            <input
              type="text"
              value={portfolio.experienceHeading}
              onChange={e => updateField('experienceHeading', e.target.value)}
              placeholder="Selected highlights"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-300 block">Achievement Bullets</label>
          {portfolio.experienceHighlights.map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              <span className="text-teal-400 text-sm mt-1.5 font-bold">•</span>
              <textarea
                rows={2}
                value={highlight}
                onChange={e => updateHighlight(idx, e.target.value)}
                className="flex-1 bg-transparent border-0 text-xs text-white focus:outline-none resize-none leading-relaxed"
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Remove bullet"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newHighlightInput}
              onChange={e => setNewHighlightInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              placeholder="Add bullet accomplishment..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Skills &amp; Competencies</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {portfolio.skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-slate-400 hover:text-rose-400 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={e => setNewSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkillInput))}
            placeholder="Add new skill..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
          />
          <button
            type="button"
            onClick={() => addSkill(newSkillInput)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </div>

        {/* Quick suggestions */}
        <div>
          <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Quick add suggestions:</span>
          <div className="flex flex-wrap gap-1">
            {COMMON_SKILL_PRESETS.filter(p => !portfolio.skills.includes(p)).map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addSkill(preset)}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-teal-300 px-2 py-0.5 rounded transition-all"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
