import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  withLink?: boolean;
}

export const BrandIcon: React.FC<{ sizeClass?: string; className?: string; isDarkBg?: boolean }> = ({ 
  sizeClass = "w-14 h-14", 
  className = "",
  isDarkBg = false,
}) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClass} ${className}`}>
      <img 
        src={logoImg} 
        alt="WorkNiva Logo" 
        className={`w-full h-full object-contain rounded-2xl drop-shadow-md transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-xl ${
          isDarkBg ? 'ring-1 ring-white/20 shadow-md shadow-black/20' : 'shadow-xs'
        }`} 
      />
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'auto',
  showSubtitle = false,
  subtitle = 'Premium Workspaces',
  showBadge = false,
  badgeText = '',
  withLink = true,
}) => {
  const sizeMap = {
    sm: {
      icon: 'w-10 h-10',
      text: 'text-xl',
      sub: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    md: {
      icon: 'w-13 h-13 sm:w-14 sm:h-14',
      text: 'text-2xl sm:text-3xl',
      sub: 'text-[10px] sm:text-[11px]',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      icon: 'w-16 h-16 sm:w-18 sm:h-18',
      text: 'text-3xl sm:text-4xl',
      sub: 'text-xs',
      badge: 'text-[11px] px-2.5 py-0.5',
    },
    xl: {
      icon: 'w-20 h-20 sm:w-24 sm:h-24',
      text: 'text-4xl sm:text-5xl',
      sub: 'text-sm',
      badge: 'text-xs px-3 py-1',
    },
  };

  const { icon: iconClass, text: textClass, sub: subClass, badge: badgeClass } = sizeMap[size];

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-deep-charcoal';
  const accentColor = isLight ? 'text-[#E27D60]' : 'text-terracotta';
  const subColor = isLight ? 'text-white/60' : 'text-deep-charcoal/60';
  const badgeBg = isLight 
    ? 'bg-white/10 text-white border-white/20' 
    : 'bg-deep-forest/5 text-deep-forest border-deep-forest/15';

  const content = (
    <div className={`group inline-flex items-center gap-3.5 select-none ${className}`}>
      <BrandIcon sizeClass={iconClass} isDarkBg={isLight} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`font-display tracking-tight font-bold leading-none ${textClass} ${textColor}`}>
            Work<span className={accentColor}>Niva</span>
          </span>
          {showBadge && badgeText && (
            <span className={`font-mono uppercase font-semibold tracking-wider rounded-full border ${badgeBg} ${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>
        {showSubtitle && (
          <span className={`font-sans uppercase tracking-widest font-semibold mt-1 ${subClass} ${subColor}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;
