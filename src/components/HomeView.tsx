import React, { useState } from 'react';
import { Trip, TerrainGuide } from '../types';
import { QUICK_GUIDE_THUMBNAILS } from '../data/mockData';

interface HomeViewProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onOpenPlanTrip: () => void;
  onSelectTerrain: (terrainId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  trips,
  onSelectTrip,
  onOpenPlanTrip,
  onSelectTerrain,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate live progress percentage for a trip
  const calculateProgress = (trip: Trip) => {
    let total = 0;
    let checked = 0;
    trip.categories.forEach((cat) => {
      cat.items.forEach((item) => {
        total++;
        if (item.checked) checked++;
      });
    });
    if (total === 0) return 0;
    return Math.round((checked / total) * 100);
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.terrain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-6 space-y-6 pb-24 md:pb-8">
      {/* Search Bar */}
      <section className="w-full">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-4 text-[#5a4136] z-10 pointer-events-none text-2xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Where are you heading?"
            className="w-full bg-[#f3f4f5] border border-transparent rounded-xl py-3.5 pl-12 pr-4 text-base text-[#191c1d] placeholder-[#5a4136]/70 focus:border-[#006399] focus:ring-1 focus:ring-[#006399] focus:bg-white focus:outline-none transition-all duration-200 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Upcoming Trips */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#191c1d]">Upcoming Trips</h2>
          <span className="text-xs font-semibold text-[#a04100] bg-[#ff6b00]/10 px-2.5 py-1 rounded-full">
            {filteredTrips.length} {filteredTrips.length === 1 ? 'Trip' : 'Trips'}
          </span>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-dashed border-[#e2bfb0] space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#a04100]">flight_takeoff</span>
            <p className="text-sm font-semibold text-[#5a4136]">No trips found matching "{searchQuery}"</p>
            <button
              onClick={onOpenPlanTrip}
              className="bg-[#a04100] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#7a3000] transition-colors"
            >
              Plan A New Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => {
              const progress = calculateProgress(trip);
              return (
                <article
                  key={trip.id}
                  onClick={() => onSelectTrip(trip.id)}
                  className="bg-white rounded-xl shadow-xs overflow-hidden flex flex-col group cursor-pointer border border-[#e2bfb0]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                    
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-full p-1.5 flex items-center justify-center border border-white/30 text-white shadow-xs">
                      <span className="material-symbols-outlined text-lg">
                        {trip.climateIcon}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 text-white">
                      <h3 className="text-xl font-bold tracking-tight">{trip.title}</h3>
                      <p className="text-xs opacity-90 flex items-center gap-1 mt-1 font-medium">
                        <span className="material-symbols-outlined text-sm">schedule</span>{' '}
                        {trip.daysAwayText}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2 bg-white">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[11px] font-bold text-[#5a4136] uppercase tracking-wider">
                        Packing Progress
                      </span>
                      <span className="text-xs font-bold text-[#a04100]">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#e1e3e4] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#a04100] h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Plan New Trip Banner */}
      <section className="w-full">
        <button
          onClick={onOpenPlanTrip}
          className="w-full bg-[#a04100] text-white rounded-xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[#8e3800] active:scale-[0.99] relative overflow-hidden group text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
          <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xs shrink-0">
              <span className="material-symbols-outlined text-3xl font-bold">add</span>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Plan New Trip</h3>
              <p className="text-xs md:text-sm opacity-90 font-medium">
                Start organizing your next great adventure.
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined hidden sm:block text-white/60 group-hover:text-white transition-colors text-2xl z-10">
            arrow_forward
          </span>
        </button>
      </section>

      {/* Quick Guides Carousel */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[#191c1d]">Quick Guides</h2>
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {QUICK_GUIDE_THUMBNAILS.map((guide, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTerrain(guide.terrainId)}
              className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden relative snap-start group shadow-xs border border-[#e1e3e4] hover:border-[#a04100] transition-all text-left"
            >
              <img
                src={guide.image}
                alt={guide.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-1 p-2 text-center">
                <span className="material-symbols-outlined text-2xl drop-shadow-md">
                  {guide.icon}
                </span>
                <span className="text-[11px] font-bold tracking-widest uppercase drop-shadow-md">
                  {guide.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
