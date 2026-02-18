import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ isDarkMode, currentWorkspace, activeApp, onNavigate }) {
  const breadcrumbItems = [
    { label: currentWorkspace?.name || 'Workspace', level: 'workspace' }
  ];

  if (activeApp) {
    breadcrumbItems.push(
      { label: activeApp.category, level: 'sector' },
      { label: activeApp.title, level: 'app' }
    );
  }

  return (
    <div className={`px-4 py-3 mb-4 border-b ${isDarkMode ? 'border-slate-800/50' : 'border-slate-200'}`}>
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => {
                if (item.level === 'workspace') {
                  onNavigate('workspace');
                } else if (item.level === 'sector') {
                  onNavigate('sector');
                }
              }}
              className={`text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all ${
                index === breadcrumbItems.length - 1
                  ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {item.label}
            </button>
            {index < breadcrumbItems.length - 1 && (
              <ChevronRight className={`w-3 h-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}