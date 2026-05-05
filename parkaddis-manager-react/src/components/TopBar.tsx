import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  showProfile?: boolean;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
  profileIcon?: React.ReactNode;
  onProfileClick?: () => void;
}

export default function TopBar({ 
  showProfile = true, 
  showLogo = true, 
  rightElement,
  profileIcon,
  onProfileClick
}: TopBarProps) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-md w-full sticky top-0 z-40 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {showLogo ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="font-headline font-extrabold text-lg tracking-tighter text-primary uppercase">Park</span>
            <span className="font-headline font-extrabold text-lg tracking-tighter text-slate-400 uppercase">Addis</span>
          </div>
        </div>
      ) : <div />}
      <div className="flex items-center gap-3">
        {rightElement}
        {showProfile && (
          <div 
            onClick={handleProfileClick}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Administrator</p>
              <p className="text-xs font-semibold text-slate-900">Abebe B.</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden flex items-center justify-center bg-white">
              {profileIcon || (
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
  );
}
