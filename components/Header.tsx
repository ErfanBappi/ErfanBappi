import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4 bg-[#2563EB] rounded-2xl">
      <h1 className="text-4xl md:text-5xl font-bold text-white">Otto Studio</h1>
      <p className="mt-2 text-lg md:text-xl text-white/90">
        AI-powered backgrounds for your product photos
      </p>
    </header>
  );
};

export default Header;
