import React from 'react';
import { TerrainGuide } from '../types';

interface TerrainDetailModalProps {
  guide: TerrainGuide | null;
  onClose: () => void;
  onCreateTripFromGuide: (guide: TerrainGuide) => void;
}

export const TerrainDetailModal: React.FC<TerrainDetailModalProps> = ({
  guide,
  onClose,
  onCreateTripFromGuide,
}) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e2bfb0]/40">
        {/* Cover Hero */}
        <div className="relative h-52 md:h-64 w-full">
          <img
            src={guide.coverImage}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center space-x-2 text-white/90 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-base">
                {guide.climateIcon}
              </span>
              <span>{guide.climateTag || 'Terrain Guide'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">{guide.title}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#a04100] uppercase tracking-wider">Overview</h3>
            <p className="text-sm text-[#191c1d] leading-relaxed font-medium">
              {guide.description}
            </p>
          </div>

          <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-xl p-4 space-y-1">
            <h4 className="text-xs font-bold text-[#a04100] uppercase tracking-wider flex items-center space-x-1">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Pro Essentials Advice</span>
            </h4>
            <p className="text-xs text-[#5a4136] leading-relaxed font-medium">
              {guide.essentialsAdvice}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#191c1d] uppercase tracking-wider">
              Recommended Gear Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guide.recommendedCategories.map((cat, idx) => (
                <div key={idx} className="bg-[#f8f9fa] border border-[#e1e3e4] p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-[#a04100] font-bold text-xs">
                    <span className="material-symbols-outlined text-base">{cat.icon}</span>
                    <span>{cat.title}</span>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1 pl-2">
                    {cat.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#e1e3e4] flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onCreateTripFromGuide(guide);
                onClose();
              }}
              className="flex-1 bg-[#a04100] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#7a3000] transition-colors flex items-center justify-center space-x-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">add_location_alt</span>
              <span>Create Trip From This Guide</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-xs hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
