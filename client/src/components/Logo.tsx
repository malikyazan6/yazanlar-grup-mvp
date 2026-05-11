import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-auto" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Modern 'Y' İkonu - Endüstriyel ve Geometrik */}
        <path
          d="M20 15L50 55L80 15"
          stroke="#1e3a8a" /* Derin Lacivert */
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 55V90"
          stroke="#71717a" /* Çelik Grisi */
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Mühendislik vizyonunu simgeleyen destek çizgisi */}
        <path
          d="M35 85H65"
          stroke="#71717a"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold tracking-tighter text-[#1e3a8a]">
          YAZANLAR
        </span>
        <span className="text-[10px] font-medium tracking-[0.2em] text-[#71717a] uppercase">
          Grup B2B İhtisas
        </span>
      </div>
    </div>
  );
};

export default Logo;
