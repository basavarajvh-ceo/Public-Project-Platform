import React from 'react';

export const LogoSVG: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M15 10h40c25 0 25 45 0 45H35v35H15V10zm20 18v15h20c8 0 8-15 0-15H35z" fill="#002b7f"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M35 35h30c18 0 18 35 0 35H50v20H35V35zm15 15v10h15c6 0 6-10 0-10H50z" fill="#f97316"/>
  </svg>
);
