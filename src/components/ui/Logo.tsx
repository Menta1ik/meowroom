import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img
      src="/logo.png"
      alt="Мяурум Логотип"
      className={className}
    />
  );
};

export default Logo;
