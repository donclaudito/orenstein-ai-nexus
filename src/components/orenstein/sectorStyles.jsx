import React from 'react';
import { Stethoscope, BookOpen, Briefcase, Scissors } from 'lucide-react';

export const SECTORS_LIST = ["Administrativo", "Médico", "Cirurgia", "Orientações"];

export const getSectorStyles = (category, isDarkMode) => {
  switch (category) {
    case 'Médico': 
      return { 
        icon: <Stethoscope className="w-5 h-5 text-emerald-500" />, 
        bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', 
        border: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200',
        text: 'text-emerald-500'
      };
    case 'Cirurgia': 
      return { 
        icon: <Scissors className="w-5 h-5 text-purple-500" />, 
        bg: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50', 
        border: isDarkMode ? 'border-purple-500/20' : 'border-purple-200',
        text: 'text-purple-600'
      };
    case 'Orientações': 
      return { 
        icon: <BookOpen className="w-5 h-5 text-amber-500" />, 
        bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50', 
        border: isDarkMode ? 'border-amber-500/20' : 'border-amber-200',
        text: 'text-amber-600'
      };
    case 'Administrativo': 
    default: 
      return { 
        icon: <Briefcase className="w-5 h-5 text-blue-500" />, 
        bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50', 
        border: isDarkMode ? 'border-blue-500/20' : 'border-blue-200',
        text: 'text-blue-600'
      };
  }
};

export const getSectorIcon = (category) => {
  switch (category) {
    case 'Médico': return <Stethoscope className="w-4 h-4 text-emerald-500" />;
    case 'Cirurgia': return <Scissors className="w-4 h-4 text-purple-500" />;
    case 'Orientações': return <BookOpen className="w-4 h-4 text-amber-500" />;
    default: return <Briefcase className="w-4 h-4 text-blue-500" />;
  }
};