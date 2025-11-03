import React, { useState, useCallback } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface PromptDisplayProps {
  prompt: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-100">Generated Prompt</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors text-sm"
        >
          <CopyIcon className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="flex-grow p-4 bg-slate-900 rounded-lg overflow-y-auto max-h-[60vh] lg:max-h-full">
        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
          {prompt}
        </p>
      </div>
    </div>
  );
};
