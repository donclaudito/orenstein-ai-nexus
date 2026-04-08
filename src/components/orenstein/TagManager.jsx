import React, { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';

export default function TagManager({ tags = [], onChange, suggestedTags = [], isDarkMode }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filteredSuggestions = suggestedTags.filter(t =>
    t.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(t)
  );

  const addTag = (tag) => {
    const normalized = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (normalized && !tags.includes(normalized)) {
      onChange([...tags, normalized]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex flex-wrap gap-1.5 p-3 border rounded-3xl min-h-[48px] cursor-text transition-all focus-within:border-blue-500/50 ${
          isDarkMode ? 'bg-black/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isDarkMode
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            #{tag}
            <button onClick={(e) => { e.stopPropagation(); removeTag(tag); }} className="hover:opacity-70 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? 'Adicionar tags...' : ''}
          className={`flex-1 min-w-[80px] outline-none text-sm bg-transparent font-bold ${
            isDarkMode ? 'text-white placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'
          }`}
        />
      </div>

      {showSuggestions && (filteredSuggestions.length > 0 || inputValue.trim()) && (
        <div className={`absolute top-full left-0 right-0 mt-1 border rounded-2xl shadow-xl z-30 overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {inputValue.trim() && !tags.includes(inputValue.trim().toLowerCase()) && (
            <button
              onMouseDown={() => addTag(inputValue)}
              className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold transition-colors border-b ${
                isDarkMode ? 'text-blue-400 hover:bg-blue-500/10 border-slate-800' : 'text-blue-600 hover:bg-blue-50 border-slate-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Criar tag "{inputValue.trim().toLowerCase()}"
            </button>
          )}
          {filteredSuggestions.slice(0, 6).map(tag => (
            <button
              key={tag}
              onMouseDown={() => addTag(tag)}
              className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold transition-colors ${
                isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
      <p className={`text-[10px] mt-1.5 px-2 font-medium ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        Enter ou vírgula para adicionar · Backspace para remover
      </p>
    </div>
  );
}