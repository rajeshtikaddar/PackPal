import React, { useState } from 'react';
import { ActiveTab, User } from '../types';
import { USER_AVATAR } from '../data/mockData';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPlanTrip: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPlanTrip,
  currentUser,
  onLogout,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="bg-[#f8f9fa] border-b border-[#e1e3e4]/60 sticky top-0 z-40 w-full shadow-xs">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-[#a04100] hover:bg-[#edeeef] p-2 rounded-full transition-colors active:scale-95"
              title="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className="text-xl md:text-2xl font-bold text-[#a04100] tracking-tight hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-2xl">backpack</span>
              <span>PackPal</span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-2 text-sm font-semibold ${
                activeTab === 'home'
                  ? 'bg-[#edeeef] text-[#a04100] font-bold shadow-xs'
                  : 'text-[#5a4136] hover:bg-[#edeeef]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">home</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-2 text-sm font-semibold ${
                activeTab === 'trips'
                  ? 'bg-[#edeeef] text-[#a04100] font-bold shadow-xs'
                  : 'text-[#5a4136] hover:bg-[#edeeef]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">luggage</span>
              <span>My Trips</span>
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-2 text-sm font-semibold ${
                activeTab === 'guides'
                  ? 'bg-[#edeeef] text-[#a04100] font-bold shadow-xs'
                  : 'text-[#5a4136] hover:bg-[#edeeef]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">explore</span>
              <span>Guides</span>
            </button>

            <button
              onClick={onOpenPlanTrip}
              className="ml-2 bg-[#ff6b00] hover:bg-[#a04100] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Plan Trip</span>
            </button>
          </nav>

          {/* User Profile Avatar / Sign In indicator */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 p-1 rounded-full transition-all border ${
              activeTab === 'profile'
                ? 'border-[#a04100] ring-2 ring-[#a04100]/20 bg-[#ff6b00]/10'
                : 'border-transparent hover:bg-gray-100'
            }`}
            title={currentUser ? `Profile: ${currentUser.name}` : 'Sign In / Profile'}
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : currentUser ? (
              <div className="w-9 h-9 rounded-full bg-[#a04100] text-white font-bold text-sm flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
            )}
            {currentUser && (
              <span className="hidden lg:inline text-xs font-bold text-[#191c1d] pr-2 max-w-[120px] truncate">
                {currentUser.name}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Navigation Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 p-6 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex justify-between items-center pb-6 border-b border-[#e1e3e4]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b00]/10 flex items-center justify-center text-[#a04100]">
                    <span className="material-symbols-outlined text-2xl font-bold">backpack</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#a04100]">PackPal</h2>
                    <p className="text-xs text-[#5a4136]">Travel Gear Companion</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* User Identity Card inside Drawer */}
              <div className="my-4 p-3 bg-[#f3f4f5] rounded-xl flex items-center space-x-3 border border-[#e2bfb0]/30">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : currentUser ? (
                  <div className="w-10 h-10 rounded-full bg-[#a04100] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#191c1d] truncate">
                    {currentUser ? currentUser.name : 'Guest User'}
                  </p>
                  <p className="text-[10px] text-[#5a4136] truncate">
                    {currentUser ? currentUser.identifier : 'Not signed in'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === 'home' ? 'bg-[#ff6b00]/10 text-[#a04100]' : 'text-[#191c1d] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <span className="material-symbols-outlined">home</span>
                  <span>Home Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('trips');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === 'trips' ? 'bg-[#ff6b00]/10 text-[#a04100]' : 'text-[#191c1d] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <span className="material-symbols-outlined">luggage</span>
                  <span>My Trips & Checklists</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('guides');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === 'guides' ? 'bg-[#ff6b00]/10 text-[#a04100]' : 'text-[#191c1d] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <span className="material-symbols-outlined">explore</span>
                  <span>Terrain Guides</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setDrawerOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === 'profile' ? 'bg-[#ff6b00]/10 text-[#a04100]' : 'text-[#191c1d] hover:bg-[#f3f4f5]'
                  }`}
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile & Auth Settings</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e1e3e4] space-y-2">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenPlanTrip();
                }}
                className="w-full bg-[#a04100] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-sm hover:bg-[#7a3000] transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                <span>Plan New Trip</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onLogout();
                  }}
                  className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
