import React, { useState } from 'react';
import { TerrainGuide, SavedTip } from '../types';
import { TERRAIN_GUIDES, SAVED_TIPS } from '../data/mockData';

interface GuidesViewProps {
  onSelectTerrainGuide: (guide: TerrainGuide) => void;
}

export const GuidesView: React.FC<GuidesViewProps> = ({ onSelectTerrainGuide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tips, setTips] = useState<SavedTip[]>(SAVED_TIPS);
  const [showAllTipsModal, setShowAllTipsModal] = useState(false);

  const toggleSaveTip = (tipId: string) => {
    setTips(
      tips.map((t) => (t.id === tipId ? { ...t, isSaved: !t.isSaved } : t))
    );
  };

  const filteredGuides = TERRAIN_GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-6 space-y-8 pb-24 md:pb-8">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#a04100] tracking-tight">
            Terrain Guides
          </h2>
          <p className="text-base text-[#5a4136] mt-1">
            Expert packing advice tailored to your environment.
          </p>
        </div>

        <div className="relative w-full max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#5a4136]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search destinations or climates..."
            className="w-full bg-[#f3f4f5] text-[#191c1d] border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#006399] focus:bg-white transition-all text-base placeholder-[#5a4136]/70 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Terrain Discovery (Bento Grid) */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#191c1d]">Explore Terrains</h3>

        <div className="bento-grid">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => onSelectTerrainGuide(guide)}
              className={`${
                guide.gridClass || ''
              } relative rounded-xl overflow-hidden shadow-xs group cursor-pointer min-h-[200px] border border-black/5 hover:border-[#a04100]/40 transition-all duration-300`}
            >
              <img
                src={guide.coverImage}
                alt={guide.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center space-x-2 text-white mb-1.5">
                  <span className="material-symbols-outlined text-lg">
                    {guide.climateIcon}
                  </span>
                  {guide.climateTag && (
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                      {guide.climateTag}
                    </span>
                  )}
                </div>

                <h4 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {guide.title}
                </h4>

                <p className="text-xs md:text-sm text-gray-200 opacity-90 line-clamp-2">
                  {guide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Tips */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#191c1d]">Saved Tips</h3>
          <button
            onClick={() => setShowAllTipsModal(true)}
            className="text-[#a04100] text-xs font-bold hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white p-4 rounded-xl shadow-xs border border-[#e2bfb0]/30 flex space-x-3.5 items-start relative group hover:shadow-md transition-shadow"
            >
              <div
                className={`${tip.iconBg} p-2.5 rounded-full ${tip.iconColor} shrink-0 flex items-center justify-center`}
              >
                <span className="material-symbols-outlined text-xl">{tip.icon}</span>
              </div>
              <div className="flex-1 pr-6">
                <h5 className="text-sm font-bold text-[#191c1d] mb-1">{tip.title}</h5>
                <p className="text-xs text-[#5a4136] leading-relaxed">{tip.description}</p>
              </div>
              <button
                onClick={() => toggleSaveTip(tip.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-[#a04100]"
                title="Save tip"
              >
                <span className={`material-symbols-outlined text-lg ${tip.isSaved ? 'text-[#a04100]' : ''}`}>
                  {tip.isSaved ? 'bookmark' : 'bookmark_border'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* View All Tips Dialog */}
      {showAllTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-lg font-bold text-[#191c1d]">All Travel & Packing Tips</h3>
              <button
                onClick={() => setShowAllTipsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {tips.map((tip) => (
                <div key={tip.id} className="p-3 bg-[#f8f9fa] rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-2 text-[#a04100] mb-1">
                    <span className="material-symbols-outlined text-lg">{tip.icon}</span>
                    <span className="text-xs font-bold">{tip.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllTipsModal(false)}
              className="w-full bg-[#a04100] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
