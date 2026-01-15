import React from 'react';

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export default function Logo({ className = "w-10 h-10", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#2d2d2d" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" rx="22" fill="url(#logoGradient)" />

        <path
          d="M 30 25 L 30 65 Q 30 75 40 75 L 45 75"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M 45 40 L 45 25 L 60 50 L 75 25 L 75 75"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">JMilli</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Tax Services</span>
        </div>
      )}
    </div>
  );
}
