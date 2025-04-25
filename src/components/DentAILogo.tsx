import React from 'react';
import logo from '../assets/dentai-logo-simple.png';

interface DentAILogoProps {
  className?: string;
}

const DentAILogo: React.FC<DentAILogoProps> = ({ className = "h-16 w-16" }) => {
  return (
    <img 
      src={logo} 
      alt="DentAI Logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default DentAILogo; 