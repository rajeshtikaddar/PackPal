import React, { useState, useEffect } from 'react';
import { Trip, TerrainGuide, ActiveTab, User } from './types';
import { INITIAL_TRIPS, TERRAIN_GUIDES } from './data/mockData';
import {
  getCurrentUser,
  setCurrentUserSession,
  updateUserData,
} from './utils/auth';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { TripDetailView } from './components/TripDetailView';
import { GuidesView } from './components/GuidesView';
import { ProfileView } from './components/ProfileView';
import { PlanTripModal } from './components/PlanTripModal';
import { TerrainDetailModal } from './components/TerrainDetailModal';
import { AiPackAssistantModal } from './components/AiPackAssistantModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  // Helper to load user-specific trips
  const loadTripsForUser = (user: User | null): Trip[] => {
    if (!user) return [];
    try {
      const userKey = `packpal_trips_${user.id}`;
      const saved = localStorage.getItem(userKey);
      if (saved) return JSON.parse(saved);

      // Fallback: check general key for legacy demo user
      const legacySaved = localStorage.getItem('packpal_trips');
      if (legacySaved && user.id === 'user-demo-alex') {
        const parsed = JSON.parse(legacySaved);
        localStorage.setItem(userKey, JSON.stringify(parsed));
        return parsed;
      }

      // Default initial trips for a new user
      localStorage.setItem(userKey, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    } catch (e) {
      return INITIAL_TRIPS;
    }
  };

  const [trips, setTrips] = useState<Trip[]>(() => loadTripsForUser(currentUser));
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedTerrainGuide, setSelectedTerrainGuide] = useState<TerrainGuide | null>(null);
  const [planTripModalOpen, setPlanTripModalOpen] = useState(false);
  const [aiAssistantModalOpen, setAiAssistantModalOpen] = useState(false);

  // Sync trips when active user changes or when trips state changes
  useEffect(() => {
    if (!currentUser) {
      setTrips([]);
      return;
    }
    try {
      const userKey = `packpal_trips_${currentUser.id}`;
      localStorage.setItem(userKey, JSON.stringify(trips));
    } catch (e) {
      console.error('Failed to save user trips', e);
    }
  }, [trips, currentUser]);

  // Handle User Login / Switch
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserSession(user);
    const userTrips = loadTripsForUser(user);
    setTrips(userTrips);
    setSelectedTripId(null);
  };

  // Handle User Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserSession(null);
    setTrips([]);
    setSelectedTripId(null);
    setActiveTab('profile');
  };

  // Handle Update User
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    updateUserData(updatedUser);
  };

  // Selected trip object
  const activeTrip = trips.find((t) => t.id === selectedTripId) || null;

  // Update trip state
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  // Create new trip manually
  const handleCreateTrip = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setSelectedTripId(newTrip.id);
    setActiveTab('trips');
  };

  // Create new trip from Terrain Guide
  const handleCreateTripFromGuide = (guide: TerrainGuide) => {
    const newTrip: Trip = {
      id: `trip-guide-${Date.now()}`,
      title: `${guide.title} Adventure`,
      destination: guide.title,
      dates: 'Upcoming Trip',
      daysAwayText: 'Upcoming',
      climateIcon: guide.climateIcon,
      terrain: guide.title.includes('Shore') || guide.title.includes('Beach') ? 'Beach' : 'Mountain',
      coverImage: guide.coverImage,
      categories: guide.recommendedCategories.map((cat, idx) => ({
        id: `cat-guide-${idx}-${Date.now()}`,
        title: cat.title,
        icon: cat.icon,
        colorClass: 'bg-primary-container/20 text-on-primary-container',
        items: cat.items.map((item, itemIdx) => ({
          id: `item-guide-${idx}-${itemIdx}-${Date.now()}`,
          name: item,
          checked: false,
        })),
      })),
    };

    setTrips([newTrip, ...trips]);
    setSelectedTripId(newTrip.id);
    setActiveTab('trips');
  };

  // Generate trip with AI
  const handleGenerateWithAi = async (tripData: {
    destination: string;
    terrain: string;
    durationDays: number;
    title: string;
  }) => {
    let coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6M6YQci9M-6FzPYCjVkdHHV6sBQFEef1iu6JJnKPkdMbyQyBydFRbeX5AIMbkydhi-YWYAiS6q9yHpPKwJcEF_L91xxTpRaQ6hjplJAEAcebSfjOuyrITBpnA9dHhPucPaHGcGgLjvt2DkS_y8maa4Npli8giXPzlktO6TFY9VqEYxE-Ko0s5vC1r9acpq_nBD_hT0BdB2ezfyABg5jJJCO1Lm6fhCPc0fEuCdPI2DSBX_0UEhuw';
    let climateIcon = 'ac_unit';

    if (tripData.terrain === 'Beach') {
      coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYIWEu04yOAamwvtMDYdCtKEYkFXTDC0nhvmsNBG9Bomlt3SsFmU8vO6KVZHLh1VAB08uHvFipVvtoFh5agsYPutqa9GztSi9euPei0UcP-T3TznDrHYGCCb3appMI5EsuIz0EuWYT3OoLpMDB4HMwH7IASoNcC8a-hZBoT9ZiAC6XJ06X_30e4jfadxxX8jDVVfcAIc3ZPgOEhlOGLeX_8ko2wgwcwl97a6z9l6U_bVlo6OchoB8';
      climateIcon = 'light_mode';
    } else if (tripData.terrain === 'Jungle') {
      coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4DcG23Klt1YVYh2saxjK1kqAMhDazGUr5JoZRB4QQVfmel5yLoln_D9orSk1xTD6D1RmxcP_IBvHGibhSVxGcaHVn-zJoCx333ZC6NXn5Ks50OHu21FvgcnWvKpjGi7jtyBVk4UpK_AsaSD2K9VXS2q0NtWALICr6kiaTUTS2xEqnY9j9BOn9v4EkoDzol01x8kz_E7zrnu3oJ2txEvPAnzYIFD_xEWpl-OSraZKJ7CqADJRpVDw';
      climateIcon = 'water_drop';
    } else if (tripData.terrain === 'Urban') {
      coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDPF0-8X42OFW93vVIJChqDgbmUZ_4BslRcNOBylG0unFXZSPOVa1pPat3sRPyRxTeKAdg57jMXfL5M7CVlhxKHI4MerrWGNPxoFDk0vCJZHt0Kla46gafzLQ4FaLZawkrgopBOIJPP_fd0694qGuUweVS1APdBi3YvhB-UE0oMiMFE2GatFxQiKO4zeLBsWWu_zOeJqh7mw_ArSw-Lv_5VDnsYNfPEdiShMD5-qZ4WUeLud0MEms';
      climateIcon = 'location_city';
    }

    try {
      const response = await fetch('/api/ai-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: tripData.destination,
          terrain: tripData.terrain,
          durationDays: tripData.durationDays,
          climate: tripData.terrain,
        }),
      });

      if (response.ok) {
        const aiResult = await response.json();
        const generatedCategories = (aiResult.categories || []).map((cat: any, idx: number) => ({
          id: `ai-cat-${Date.now()}-${idx}`,
          title: cat.title,
          icon: cat.icon || 'inventory_2',
          colorClass: 'bg-primary-container/20 text-on-primary-container',
          items: (cat.items || []).map((i: any, itemIdx: number) => ({
            id: `ai-item-${Date.now()}-${idx}-${itemIdx}`,
            name: i.name,
            checked: false,
          })),
        }));

        const newTrip: Trip = {
          id: `trip-ai-${Date.now()}`,
          title: tripData.title || aiResult.suggestedTitle || `${tripData.destination} Trip`,
          destination: tripData.destination,
          dates: 'Upcoming Trip',
          daysAwayText: 'Upcoming',
          climateIcon,
          terrain: tripData.terrain as any,
          coverImage,
          categories: generatedCategories,
        };

        setTrips([newTrip, ...trips]);
        setSelectedTripId(newTrip.id);
        setActiveTab('trips');
        return;
      }
    } catch (err) {
      console.error('AI Generation fallback:', err);
    }

    // Fallback if AI endpoint fails or key missing
    const fallbackTrip: Trip = {
      id: `trip-fallback-${Date.now()}`,
      title: tripData.title || `${tripData.destination} Expedition`,
      destination: tripData.destination,
      dates: 'Upcoming Trip',
      daysAwayText: 'Upcoming',
      climateIcon,
      terrain: tripData.terrain as any,
      coverImage,
      categories: [
        {
          id: `f1-${Date.now()}`,
          title: 'Essentials',
          icon: 'badge',
          colorClass: 'bg-secondary-container/20 text-on-secondary-container',
          items: [
            { id: 'i1', name: 'Passport & Permits', checked: false },
            { id: 'i2', name: 'Travel Insurance & Cash', checked: false },
          ],
        },
        {
          id: `f2-${Date.now()}`,
          title: 'Gear & Clothing',
          icon: 'hiking',
          colorClass: 'bg-primary-container/20 text-on-primary-container',
          items: [
            { id: 'i3', name: 'Terrain Footwear & Outerwear', checked: false },
          ],
        },
      ],
    };

    setTrips([fallbackTrip, ...trips]);
    setSelectedTripId(fallbackTrip.id);
    setActiveTab('trips');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'trips') setSelectedTripId(null);
        }}
        onOpenPlanTrip={() => setPlanTripModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            trips={trips}
            onSelectTrip={(id) => {
              setSelectedTripId(id);
              setActiveTab('trips');
            }}
            onOpenPlanTrip={() => setPlanTripModalOpen(true)}
            onSelectTerrain={(terrainId) => {
              const guide = TERRAIN_GUIDES.find((g) => g.id === terrainId);
              if (guide) setSelectedTerrainGuide(guide);
            }}
          />
        )}

        {activeTab === 'trips' && (
          selectedTripId && activeTrip ? (
            <TripDetailView
              trip={activeTrip}
              onUpdateTrip={handleUpdateTrip}
              onBack={() => setSelectedTripId(null)}
              onOpenAiAssistant={() => setAiAssistantModalOpen(true)}
            />
          ) : (
            <HomeView
              trips={trips}
              onSelectTrip={(id) => setSelectedTripId(id)}
              onOpenPlanTrip={() => setPlanTripModalOpen(true)}
              onSelectTerrain={(terrainId) => {
                const guide = TERRAIN_GUIDES.find((g) => g.id === terrainId);
                if (guide) setSelectedTerrainGuide(guide);
              }}
            />
          )
        )}

        {activeTab === 'guides' && (
          <GuidesView
            onSelectTerrainGuide={(guide) => setSelectedTerrainGuide(guide)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            trips={trips}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onOpenPlanTrip={() => setPlanTripModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'trips') setSelectedTripId(null);
        }}
      />

      {/* Modals & Dialogs */}
      <PlanTripModal
        isOpen={planTripModalOpen}
        onClose={() => setPlanTripModalOpen(false)}
        onCreateTrip={handleCreateTrip}
        onGenerateWithAi={handleGenerateWithAi}
      />

      <TerrainDetailModal
        guide={selectedTerrainGuide}
        onClose={() => setSelectedTerrainGuide(null)}
        onCreateTripFromGuide={handleCreateTripFromGuide}
      />

      <AiPackAssistantModal
        isOpen={aiAssistantModalOpen}
        trip={activeTrip}
        onClose={() => setAiAssistantModalOpen(false)}
        onApplyGeneratedItems={(updatedTrip) => {
          handleUpdateTrip(updatedTrip);
        }}
      />
    </div>
  );
}
