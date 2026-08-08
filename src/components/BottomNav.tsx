import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-white border-t border-[#e2bfb0] shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl">
      {/* Home Tab */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'home'
            ? 'bg-[#ff6b00] text-white rounded-full px-4 py-1.5 scale-95 font-semibold shadow-xs'
            : 'text-[#5a4136] px-4 py-1 hover:text-[#a04100]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">home</span>
        <span className="text-[11px] font-semibold mt-0.5 tracking-wider">Home</span>
      </button>

      {/* My Trips Tab */}
      <button
        onClick={() => setActiveTab('trips')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'trips'
            ? 'bg-[#ff6b00] text-white rounded-full px-4 py-1.5 scale-95 font-semibold shadow-xs'
            : 'text-[#5a4136] px-4 py-1 hover:text-[#a04100]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">luggage</span>
        <span className="text-[11px] font-semibold mt-0.5 tracking-wider">My Trips</span>
      </button>

      {/* Guides Tab */}
      <button
        onClick={() => setActiveTab('guides')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'guides'
            ? 'bg-[#ff6b00] text-white rounded-full px-4 py-1.5 scale-95 font-semibold shadow-xs'
            : 'text-[#5a4136] px-4 py-1 hover:text-[#a04100]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">explore</span>
        <span className="text-[11px] font-semibold mt-0.5 tracking-wider">Guides</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'profile'
            ? 'bg-[#ff6b00] text-white rounded-full px-4 py-1.5 scale-95 font-semibold shadow-xs'
            : 'text-[#5a4136] px-4 py-1 hover:text-[#a04100]'
        }`}
      >
        <span className="material-symbols-outlined text-xl">person</span>
        <span className="text-[11px] font-semibold mt-0.5 tracking-wider">Profile</span>
      </button>
    </nav>
  );
};
