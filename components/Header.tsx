
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        AI Image Suite
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
        Generate LoRA training packs or edit your images with simple text prompts.
      </p>
    </header>
  );
};

export default Header;