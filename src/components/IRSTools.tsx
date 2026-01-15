import React from 'react';
import { ExternalLink, FileCheck, Smartphone, Calculator, FileText, BookOpen, Search } from 'lucide-react';

export default function IRSTools() {
  const tools = [
    {
      title: 'IRS Official Portal',
      description: 'Access tax forms and publications',
      icon: FileCheck,
      href: 'https://www.irs.gov',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'IRS2Go Mobile',
      description: 'Check refund status on the go',
      icon: Smartphone,
      href: 'https://www.irs.gov/newsroom/irs-go-mobile-app',
      iconBg: 'bg-green-500/10 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Tax Estimator',
      description: 'Calculate your tax withholding',
      icon: Calculator,
      href: 'https://www.irs.gov/individuals/tax-withholding-estimator',
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Free File',
      description: 'File your taxes online for free',
      icon: FileText,
      href: 'https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free',
      iconBg: 'bg-orange-500/10 dark:bg-orange-500/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Publications',
      description: 'Browse IRS publications',
      icon: BookOpen,
      href: 'https://www.irs.gov/forms-pubs',
      iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      title: 'Track Refund',
      description: 'Check your refund status',
      icon: Search,
      href: 'https://www.irs.gov/refunds',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="relative" style={{ perspective: '1200px' }}>
        <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-gray-800/50 shadow-2xl shadow-black/5 dark:shadow-black/20">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>

          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 flex items-center justify-center shadow-lg shadow-gray-900/20 dark:shadow-gray-100/20">
                <ExternalLink className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                IRS Tools
              </h3>
            </div>

            <div className="space-y-2.5">
              {tools.map((tool, index) => {
                const IconComponent = tool.icon;
                return (
                  <a
                    key={tool.title}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    style={{
                      transformStyle: 'preserve-3d',
                      animation: `subtleFloat ${4 + index * 0.5}s ease-in-out infinite`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-lg shadow-black/5 dark:shadow-black/10 transition-all duration-500 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/20 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-transparent dark:from-white/5 dark:via-white/3 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                      <div className="relative flex items-center gap-4">
                        <div className={`${tool.iconBg} rounded-xl p-3 transition-all duration-500 group-hover:scale-110 shadow-sm`}>
                          <IconComponent className={`w-5 h-5 ${tool.iconColor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5 text-[15px] tracking-tight transition-transform duration-300 group-hover:translate-x-0.5">
                            {tool.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                          <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtleFloat {
          0%, 100% {
            transform: translateY(0px) translateZ(0px);
          }
          50% {
            transform: translateY(-4px) translateZ(8px);
          }
        }
      `}</style>
    </div>
  );
}
