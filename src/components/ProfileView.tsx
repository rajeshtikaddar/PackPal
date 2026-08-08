import React, { useState } from 'react';
import { User, Trip } from '../types';
import {
  authenticateUser,
  registerUser,
  DEFAULT_DEMO_USER,
  detectIdentifierType,
} from '../utils/auth';

interface ProfileViewProps {
  currentUser: User | null;
  trips: Trip[];
  onLogin: (user: User) => void;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onOpenPlanTrip: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  trips,
  onLogin,
  onLogout,
  onUpdateUser,
  onOpenPlanTrip,
}) => {
  // Auth Form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit Profile modal/mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPassword, setEditPassword] = useState(currentUser?.password || '');
  const [editAvatar, setEditAvatar] = useState<string | undefined>(currentUser?.avatar);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  ];

  const openEditProfile = () => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPassword(currentUser.password);
      setEditAvatar(currentUser.avatar);
      setCustomAvatarUrl('');
      setShowUrlInput(false);
    }
    setIsEditingProfile(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditAvatar(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Switch account state (forcing sign in form even if logged in)
  const [forceShowAuthForm, setForceShowAuthForm] = useState(false);

  // Stats calculation
  const totalTrips = trips.length;
  let totalItems = 0;
  let packedItems = 0;
  trips.forEach((t) => {
    t.categories?.forEach((cat) => {
      cat.items?.forEach((item) => {
        totalItems++;
        if (item.checked) packedItems++;
      });
    });
  });
  const avgProgress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  // Handle Login
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorType(null);
    setSuccessMessage(null);

    const result = authenticateUser({ identifier, password });

    if (!result.success) {
      setErrorMessage(result.message || 'Authentication failed.');
      setErrorType(result.errorType || 'ERROR');
      return;
    }

    if (result.user) {
      setSuccessMessage(`Welcome back, ${result.user.name}!`);
      onLogin(result.user);
      setForceShowAuthForm(false);
      setIdentifier('');
      setPassword('');
    }
  };

  // Handle Sign Up
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorType(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      setErrorType('INVALID');
      return;
    }

    const result = registerUser({
      name: fullName,
      identifier,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.message || 'Registration failed.');
      setErrorType(result.errorType || 'ERROR');
      return;
    }

    if (result.user) {
      setSuccessMessage(`Account created successfully! Welcome to PackPal, ${result.user.name}.`);
      onLogin(result.user);
      setForceShowAuthForm(false);
      setIdentifier('');
      setPassword('');
      setFullName('');
    }
  };

  // Handle Quick Demo Account Login
  const handleQuickDemoLogin = () => {
    setErrorMessage(null);
    setSuccessMessage('Logged in as Demo User Alex Vance.');
    onLogin(DEFAULT_DEMO_USER);
    setForceShowAuthForm(false);
  };

  // Handle Save Profile Edits
  const handleSaveProfileEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!editName.trim()) return;

    const updated: User = {
      ...currentUser,
      name: editName.trim(),
      avatar: editAvatar,
      password: editPassword.trim() || currentUser.password,
    };

    onUpdateUser(updated);
    setIsEditingProfile(false);
    setSuccessMessage('Profile details updated successfully!');
  };

  const idType = detectIdentifierType(identifier);

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-6 space-y-6 pb-24 md:pb-8">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="bg-[#2c694e]/10 border border-[#2c694e]/30 rounded-2xl p-4 flex justify-between items-center text-xs font-semibold text-[#2c694e] shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-[#2c694e]/70 hover:text-[#2c694e]"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Render AUTH FORM if user is logged out OR explicitly clicked Switch Account */}
      {(!currentUser || forceShowAuthForm) ? (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e2bfb0]/40 max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="w-14 h-14 bg-[#ff6b00]/10 text-[#a04100] rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="material-symbols-outlined text-3xl font-bold">account_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-[#191c1d]">
              {authMode === 'login' ? 'Sign In to PackPal' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-[#5a4136]">
              {authMode === 'login'
                ? 'Manage your customized travel gear and terrain packing lists.'
                : 'Join PackPal to organize adventures and generate AI gear checklists.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#f3f4f5] p-1 rounded-xl">
            <button
              onClick={() => {
                setAuthMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'login'
                  ? 'bg-[#a04100] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-[#a04100] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Validation & Error Alert Banner */}
          {errorMessage && (
            <div
              className={`p-4 rounded-xl text-xs font-semibold flex items-start space-x-2.5 ${
                errorType === 'EXISTS'
                  ? 'bg-amber-50 border border-amber-200 text-amber-900'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg shrink-0 mt-0.5">
                {errorType === 'EXISTS' ? 'info' : 'warning'}
              </span>
              <div className="flex-1 space-y-1">
                <p className="leading-relaxed">{errorMessage}</p>
                {errorType === 'EXISTS' && (
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-[#a04100] underline text-xs font-bold block pt-1"
                  >
                    Click here to Sign In now →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main Auth Form */}
          <form
            onSubmit={authMode === 'login' ? handleSignIn : handleSignUp}
            className="space-y-4"
          >
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-[#5a4136] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl py-3 pl-10 pr-3 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#5a4136]">
                  Email or Mobile Number *
                </label>
                {identifier && (
                  <span className="text-[10px] font-bold text-[#a04100] uppercase tracking-wider bg-[#ff6b00]/10 px-2 py-0.5 rounded-full">
                    {idType === 'email' ? 'Email Detected' : 'Mobile Number Detected'}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  {idType === 'email' ? 'mail' : 'smartphone'}
                </span>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. alex@example.com or +1 555-019-2834"
                  className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl py-3 pl-10 pr-3 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5a4136] mb-1">
                Password *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl py-3 pl-10 pr-10 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#a04100] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#7a3000] shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="pt-2 border-t border-[#e1e3e4] text-center space-y-3">
            <p className="text-[11px] text-[#5a4136] font-medium">
              Want to test with a pre-configured profile?
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full border border-[#a04100] text-[#a04100] hover:bg-[#a04100]/10 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined text-base">badge</span>
              <span>Quick Demo Sign In (Alex Vance)</span>
            </button>

            {currentUser && forceShowAuthForm && (
              <button
                type="button"
                onClick={() => setForceShowAuthForm(false)}
                className="text-xs text-gray-500 hover:underline pt-1 block mx-auto"
              >
                Return to logged in profile ({currentUser.name})
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Render LOGGED IN Profile View */
        <>
          {/* Profile Header Card */}
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e2bfb0]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group cursor-pointer" onClick={openEditProfile} title="Click to change profile picture">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-[#ff6b00]/20 shadow-sm transition-all group-hover:brightness-90"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#a04100] text-white font-bold text-3xl flex items-center justify-center ring-4 ring-[#ff6b00]/20 shadow-sm transition-all group-hover:brightness-90">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  <span>Change Photo</span>
                </div>
                <span className="absolute bottom-0 right-0 bg-[#2c694e] text-white p-1 rounded-full text-xs font-bold shadow-xs">
                  <span className="material-symbols-outlined text-base">verified</span>
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-[#191c1d]">{currentUser.name}</h2>
                  <span className="bg-[#ff6b00]/10 text-[#a04100] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {currentUser.identifierType === 'email' ? 'Verified Email' : 'Verified Mobile'}
                  </span>
                </div>
                <p className="text-xs text-[#5a4136] font-medium flex items-center justify-center sm:justify-start gap-1">
                  <span className="material-symbols-outlined text-sm">
                    {currentUser.identifierType === 'email' ? 'mail' : 'smartphone'}
                  </span>
                  <span>{currentUser.identifier}</span>
                </p>
                <p className="text-xs text-gray-500 pt-0.5">
                  Member since {currentUser.joinedYear || '2024'} • Active Explorer
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
              <button
                onClick={openEditProfile}
                className="px-3.5 py-2 border border-[#e2bfb0] text-[#191c1d] hover:bg-[#f3f4f5] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setForceShowAuthForm(true);
                  setAuthMode('login');
                  setIdentifier('');
                  setPassword('');
                }}
                className="px-3.5 py-2 border border-[#a04100] text-[#a04100] hover:bg-[#a04100]/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">swap_horiz</span>
                <span>Switch Account</span>
              </button>

              <button
                onClick={onLogout}
                className="px-3.5 py-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Log Out</span>
              </button>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#e2bfb0]/30 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#ff6b00]/10 text-[#a04100] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">luggage</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#191c1d]">{totalTrips}</div>
                <div className="text-xs font-semibold text-[#5a4136]">Trips Planned</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2bfb0]/30 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#2c694e]/10 text-[#2c694e] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">checklist</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#191c1d]">{packedItems}</div>
                <div className="text-xs font-semibold text-[#5a4136]">Items Packed ({avgProgress}%)</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e2bfb0]/30 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#006399]/10 text-[#006399] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">explore</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#191c1d]">4</div>
                <div className="text-xs font-semibold text-[#5a4136]">Terrain Guides Saved</div>
              </div>
            </div>
          </section>

          {/* Account Security & Preferences */}
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-[#e2bfb0]/30 space-y-6">
            <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
              <h3 className="text-lg font-bold text-[#191c1d]">Account Settings & Preferences</h3>
              <span className="text-xs text-[#5a4136] font-semibold">
                ID: <code className="bg-[#f3f4f5] px-2 py-0.5 rounded font-mono">{currentUser.id}</code>
              </span>
            </div>

            <div className="space-y-4 text-sm">
              {/* Account Identifier Info */}
              <div className="flex justify-between items-center py-2 border-b border-[#e1e3e4]">
                <div>
                  <div className="font-bold text-[#191c1d]">Login Credential</div>
                  <div className="text-xs text-[#5a4136]">
                    Registered {currentUser.identifierType === 'email' ? 'Email Address' : 'Mobile Phone Number'}
                  </div>
                </div>
                <div className="text-xs font-bold text-[#a04100] bg-[#ff6b00]/10 px-3 py-1 rounded-xl flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    {currentUser.identifierType === 'email' ? 'mail' : 'smartphone'}
                  </span>
                  <span>{currentUser.identifier}</span>
                </div>
              </div>

              {/* Password Status */}
              <div className="flex justify-between items-center py-2 border-b border-[#e1e3e4]">
                <div>
                  <div className="font-bold text-[#191c1d]">Account Security</div>
                  <div className="text-xs text-[#5a4136]">Password protection status</div>
                </div>
                <button
                  onClick={() => {
                    setEditName(currentUser.name);
                    setEditPassword(currentUser.password);
                    setIsEditingProfile(true);
                  }}
                  className="text-xs font-bold text-[#a04100] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">lock_reset</span>
                  <span>Change Password</span>
                </button>
              </div>

              {/* Measurement Units */}
              <div className="flex justify-between items-center py-2 border-b border-[#e1e3e4]">
                <div>
                  <div className="font-bold text-[#191c1d]">Measurement Units</div>
                  <div className="text-xs text-[#5a4136]">Temperature (°C / °F) & gear weights</div>
                </div>
                <div className="flex bg-[#f3f4f5] p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateUser({ ...currentUser, preferredUnits: 'metric' })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentUser.preferredUnits === 'metric' || !currentUser.preferredUnits
                        ? 'bg-[#a04100] text-white shadow-xs'
                        : 'text-gray-600'
                    }`}
                  >
                    Metric (°C)
                  </button>
                  <button
                    onClick={() => onUpdateUser({ ...currentUser, preferredUnits: 'imperial' })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentUser.preferredUnits === 'imperial'
                        ? 'bg-[#a04100] text-white shadow-xs'
                        : 'text-gray-600'
                    }`}
                  >
                    Imperial (°F)
                  </button>
                </div>
              </div>

              {/* Reminders Toggle */}
              <div className="flex justify-between items-center py-2 border-b border-[#e1e3e4]">
                <div>
                  <div className="font-bold text-[#191c1d]">Smart Trip Reminders</div>
                  <div className="text-xs text-[#5a4136]">Notify me 48 hours before departure</div>
                </div>
                <button
                  onClick={() =>
                    onUpdateUser({ ...currentUser, notifications: !currentUser.notifications })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    currentUser.notifications !== false ? 'bg-[#ff6b00]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      currentUser.notifications !== false ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onOpenPlanTrip}
                className="flex-1 bg-[#a04100] text-white py-3 rounded-xl font-bold text-sm shadow-xs hover:bg-[#7a3000] transition-colors flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                <span>Plan New Custom Trip</span>
              </button>
            </div>
          </section>
        </>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#e2bfb0]/40">
            <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
              <h3 className="text-lg font-bold text-[#191c1d]">Edit Account Profile</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfileEdits} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Profile Picture Section */}
              <div className="space-y-3 bg-[#f8f9fa] p-4 rounded-xl border border-[#e2bfb0]/40">
                <label className="block text-xs font-bold text-[#5a4136]">
                  Profile Picture
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative group shrink-0">
                    {editAvatar ? (
                      <img
                        src={editAvatar}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-[#a04100]/30 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#a04100] text-white font-bold text-xl flex items-center justify-center ring-2 ring-[#a04100]/30 shadow-xs">
                        {(editName || currentUser.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 bg-[#a04100] text-white p-1 rounded-full shadow-md hover:bg-[#7a3000] transition-transform active:scale-90"
                      title="Upload new photo"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#a04100] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#7a3000] transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">upload</span>
                        <span>Upload Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="border border-[#e2bfb0] text-[#5a4136] px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">link</span>
                        <span>URL</span>
                      </button>

                      {editAvatar && (
                        <button
                          type="button"
                          onClick={() => setEditAvatar(undefined)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1.5 flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Upload JPG, PNG or WebP image file (max 5MB)
                    </p>
                  </div>
                </div>

                {/* URL Input field */}
                {showUrlInput && (
                  <div className="pt-2 border-t border-[#e1e3e4] space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#5a4136]">
                      Paste Avatar Image Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1 text-xs bg-white border border-[#e2bfb0] rounded-lg p-2 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl.trim()) {
                            setEditAvatar(customAvatarUrl.trim());
                            setShowUrlInput(false);
                          }
                        }}
                        className="bg-[#a04100] text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#7a3000]"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Preset Avatars Grid */}
                <div className="pt-2 border-t border-[#e1e3e4]">
                  <label className="block text-[11px] font-bold text-[#5a4136] mb-1.5">
                    Or select an avatar style:
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditAvatar(url)}
                        className={`relative rounded-full overflow-hidden w-10 h-10 transition-all ${
                          editAvatar === url
                            ? 'ring-2 ring-[#a04100] scale-105 shadow-sm'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Preset avatar ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {editAvatar === url && (
                          <div className="absolute inset-0 bg-[#a04100]/30 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4136] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-3 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4136] mb-1">
                  Login Credential ({currentUser.identifierType === 'email' ? 'Email' : 'Mobile'})
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.identifier}
                  className="w-full text-xs bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 font-mono cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  To change your registered email or mobile number, please contact support or re-register.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4136] mb-1">
                  Change Password
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-3 pr-10 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showEditPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#a04100] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#7a3000]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
