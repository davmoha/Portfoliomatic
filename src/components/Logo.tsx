import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [srcIndex, setSrcIndex] = useState(0);
  const candidates = ['/logo.png', '/assets/logo.png', '/oval_final.png'];

  const dimensions = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto'
  }[size];

  // Try candidate image files first
  if (srcIndex < candidates.length) {
    return (
      <img
        src={candidates[srcIndex]}
        alt="Mo-Blind Solutions LLC"
        className={`${dimensions} object-contain transition-transform hover:scale-105 ${className}`}
        onError={() => setSrcIndex(i => i + 1)}
      />
    );
  }

  // High-fidelity vector fallback matching oval_final.png
  return (
    <svg
      viewBox="0 0 300 200"
      className={`${dimensions} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ovalBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2c3038" />
          <stop offset="100%" stopColor="#12151a" />
        </radialGradient>
      </defs>

      {/* Outer Oval */}
      <ellipse cx="150" cy="100" rx="142" ry="92" fill="url(#ovalBg)" stroke="#06b6d4" strokeWidth="6" />

      {/* Flying Duck Illustration */}
      <g stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Head and beak */}
        <path d="M178 86 C182 86, 186 84, 192 85 C190 87, 185 88, 181 89 Z" fill="#06b6d4" />
        {/* Body contour */}
        <path d="M142 90 C155 88, 168 85, 178 86 C173 93, 165 96, 150 97 C138 98, 126 95, 120 92 Z" />
        {/* Left Wing extended */}
        <path d="M146 86 C143 70, 138 52, 142 44 C146 54, 152 68, 154 78" />
        <path d="M144 56 C149 64, 154 72, 156 82" />
        <path d="M136 60 C139 68, 143 76, 145 84" />
        {/* Right Wing */}
        <path d="M152 82 C158 66, 165 52, 172 46 C172 58, 170 70, 166 80" />
        {/* Tail feathers */}
        <path d="M120 92 C114 93, 108 92, 106 88 C112 89, 118 90, 123 91" />
      </g>

      {/* Mo-Blind Typography */}
      <text
        x="150"
        y="142"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="34"
        fontWeight="800"
        letterSpacing="0.5"
      >
        Mo-Blind
      </text>

      {/* Tagline */}
      <text
        x="150"
        y="160"
        textAnchor="middle"
        fill="#06b6d4"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="4"
      >
        BRING'EM CLOSE
      </text>
    </svg>
  );
};
