import React, { useState } from 'react';
import { Trip } from '../types';

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrip: (newTrip: Trip) => void;
  onGenerateWithAi: (tripData: { destination: string; terrain: string; durationDays: number; title: string }) => void;
}

export const PlanTripModal: React.FC<PlanTripModalProps> = ({
  isOpen,
  onClose,
  onCreateTrip,
  onGenerateWithAi,
}) => {
  const [destination, setDestination] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [terrain, setTerrain] = useState<'Mountain' | 'Beach' | 'Jungle' | 'Urban' | 'Desert' | 'General'>('Mountain');
  const [useAi, setUseAi] = useState(true);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() && !title.trim()) return;

    const finalTitle = title.trim() || `${destination} Adventure`;
    const dateRangeStr = startDate && endDate ? `${startDate} - ${endDate}` : 'Upcoming Trip';

    let coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6M6YQci9M-6FzPYCjVkdHHV6sBQFEef1iu6JJnKPkdMbyQyBydFRbeX5AIMbkydhi-YWYAiS6q9yHpPKwJcEF_L91xxTpRaQ6hjplJAEAcebSfjOuyrITBpnA9dHhPucPaHGcGgLjvt2DkS_y8maa4Npli8giXPzlktO6TFY9VqEYxE-Ko0s5vC1r9acpq_nBD_hT0BdB2ezfyABg5jJJCO1Lm6fhCPc0fEuCdPI2DSBX_0UEhuw';
    let climateIcon = 'ac_unit';

    if (terrain === 'Beach') {
      coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYIWEu04yOAamwvtMDYdCtKEYkFXTDC0nhvmsNBG9Bomlt3SsFmU8vO6KVZHLh1VAB08uHvFipVvtoFh5agsYPutqa9GztSi9euPei0UcP-T3TznDrHYGCCb3appMI5EsuIz0EuWYT3OoLpMDB4HMwH7IASoNcC8a-hZBoT9ZiAC6XJ06X_30e4jfadxxX8jDVVfcAIc3ZPgOEhlOGLeX_8ko2wgwcwl97a6z9l6U_bVlo6OchoB8';
      climateIcon = 'light_mode';
    } else if (terrain === 'Jungle') {
      coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4DcG23Klt1YVYh2saxjK1kqAMhDazGUr5JoZRB4QQVfmel5yLoln_D9orSk1xTD6D1RmxcP_IBvHGibhSVxGcaHVn-zJoCx333ZC6NXn5Ks50OHu21FvgcnWvKpjGi7jtyBVk4UpK_AsaSD2K9VXS2q0NtWALICr6kiaTUTS2xEqnY9j9BOn9v4EkoDzol01x8kz_E7zrnu3oJ2txEvPAnzYIFD_xEWpl-OSraZKJ7CqADJRpVDw';
      climateIcon = 'water_drop';
    } else if (terrain === 'Urban') {
      coverImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDPF0-8X42OFW93vVIJChqDgbmUZ_4BslRcNOBylG0unFXZSPOVa1pPat3sRPyRxTeKAdg57jMXfL5M7CVlhxKHI4MerrWGNPxoFDk0vCJZHt0Kla46gafzLQ4FaLZawkrgopBOIJPP_fd0694qGuUweVS1APdBi3YvhB-UE0oMiMFE2GatFxQiKO4zeLBsWWu_zOeJqh7mw_ArSw-Lv_5VDnsYNfPEdiShMD5-qZ4WUeLud0MEms';
      climateIcon = 'location_city';
    }

    if (useAi) {
      onGenerateWithAi({
        destination,
        terrain,
        durationDays: 7,
        title: finalTitle,
      });
      onClose();
      return;
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: finalTitle,
      destination,
      dates: dateRangeStr,
      startDate,
      endDate,
      daysAwayText: 'Upcoming',
      climateIcon,
      terrain,
      coverImage,
      categories: [
        {
          id: `cat-${Date.now()}-1`,
          title: 'Essentials',
          icon: 'badge',
          colorClass: 'bg-secondary-container/20 text-on-secondary-container',
          items: [
            { id: `i1`, name: 'Passport & Identification', checked: false },
            { id: `i2`, name: 'Credit Cards & Travel Cash', checked: false },
          ],
        },
        {
          id: `cat-${Date.now()}-2`,
          title: 'Apparel & Footwear',
          icon: 'checkroom',
          colorClass: 'bg-primary-container/20 text-on-primary-container',
          items: [
            { id: `i3`, name: 'Weather-Appropriate Clothing', checked: false },
          ],
        },
      ],
    };

    onCreateTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-[#e2bfb0]/40">
        <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
          <div className="flex items-center space-x-2 text-[#a04100]">
            <span className="material-symbols-outlined text-2xl font-bold">flight_takeoff</span>
            <h3 className="text-xl font-bold">Plan New Trip</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5a4136] mb-1">
              Destination *
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Patagonia, Argentina"
              className="w-full text-sm bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-3 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a4136] mb-1">
              Trip Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Patagonia Trekking Expedition"
              className="w-full text-sm bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-3 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5a4136] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-2.5 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5a4136] mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-2.5 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a4136] mb-1.5">
              Terrain & Climate Type
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[
                { name: 'Mountain', icon: 'hiking' },
                { name: 'Beach', icon: 'light_mode' },
                { name: 'Jungle', icon: 'water_drop' },
                { name: 'Urban', icon: 'location_city' },
                { name: 'Desert', icon: 'sunny' },
                { name: 'General', icon: 'explore' },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setTerrain(item.name as any)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 transition-all ${
                    terrain === item.name
                      ? 'border-[#a04100] bg-[#ff6b00]/10 text-[#a04100]'
                      : 'border-gray-200 bg-[#f8f9fa] text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Generator Option Toggle */}
          <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#a04100]">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              <div>
                <div className="text-xs font-bold">Auto-Generate Packing Checklist</div>
                <div className="text-[11px] text-[#5a4136]">
                  Uses Gemini AI to tailor gear to climate & terrain
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={useAi}
              onChange={(e) => setUseAi(e.target.checked)}
              className="w-5 h-5 accent-[#a04100] cursor-pointer"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#a04100] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#7a3000] shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>{useAi ? 'Generate Trip with AI' : 'Create Trip'}</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-xs hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
