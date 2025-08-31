import React from 'react';

interface ViralityTestLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-3xl md:text-4xl',
  md: 'text-5xl md:text-6xl',
  lg: 'text-7xl md:text-8xl',
};

export const ViralityTestLogo: React.FC<ViralityTestLogoProps> = ({ size = 'md', className = '' }) => (
  <h1
    className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d93900] via-[#ff9800] to-[#d93900] tracking-tight drop-shadow-sm mb-2 ${sizeMap[size]} ${className}`.trim()}
  >
    ViralityTest
  </h1>
);
