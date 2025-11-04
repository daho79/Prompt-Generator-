import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
        Image Prompt Architect
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        Turn any image into a masterpiece prompt with AI
      </p>
    </header>
  );
};
