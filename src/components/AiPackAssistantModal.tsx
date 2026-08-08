import React, { useState } from 'react';
import { Trip, PackingCategory, PackingItem } from '../types';

interface AiPackAssistantModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onClose: () => void;
  onApplyGeneratedItems: (updatedTrip: Trip) => void;
}

export const AiPackAssistantModal: React.FC<AiPackAssistantModalProps> = ({
  isOpen,
  trip,
  onClose,
  onApplyGeneratedItems,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customNotes, setCustomNotes] = useState('');
  const [generatedData, setGeneratedData] = useState<any | null>(null);

  if (!isOpen || !trip) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination || trip.title,
          terrain: trip.terrain,
          durationDays: 7,
          climate: trip.terrain,
          notes: customNotes,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to connect to AI Packing service.');
      }

      const data = await response.json();
      setGeneratedData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedData || !generatedData.categories) return;

    // Convert AI response to app categories
    const newCategories: PackingCategory[] = generatedData.categories.map(
      (cat: any, idx: number) => ({
        id: `ai-cat-${Date.now()}-${idx}`,
        title: cat.title,
        icon: cat.icon || 'inventory_2',
        colorClass: 'bg-primary-container/20 text-on-primary-container',
        items: (cat.items || []).map((item: any, itemIdx: number) => ({
          id: `ai-item-${Date.now()}-${idx}-${itemIdx}`,
          name: item.name,
          checked: false,
          notes: item.notes,
        })),
      })
    );

    // Merge or overwrite trip categories
    const updatedTrip: Trip = {
      ...trip,
      categories: [...trip.categories, ...newCategories],
    };

    onApplyGeneratedItems(updatedTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-[#e2bfb0]/40">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
          <div className="flex items-center space-x-2 text-[#a04100]">
            <span className="material-symbols-outlined text-2xl font-bold">auto_awesome</span>
            <h3 className="text-xl font-bold">AI Packing Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Trip Summary Badge */}
        <div className="bg-[#f3f4f5] p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-[#191c1d]">
          <div>
            <span className="text-[#5a4136]">Trip:</span> {trip.title}
          </div>
          <div className="bg-[#ff6b00]/10 text-[#a04100] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
            {trip.terrain}
          </div>
        </div>

        {!generatedData ? (
          /* Input prompt form */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5a4136] mb-1">
                Specific Trip Details & Activities (Optional)
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g., Cold weather photography trip, 4-day mountain trekking with camping, remote drone photography."
                className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-3 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-[#a04100] hover:bg-[#7a3000] text-white py-3 rounded-xl font-bold text-sm shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Generating Terrain List...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  <span>Generate Recommended Checklist</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Display Generated Results */
          <div className="space-y-4">
            <div className="bg-[#2c694e]/10 border border-[#2c694e]/30 p-3 rounded-xl text-xs text-[#2c694e] font-semibold">
              <span className="font-bold">Advice:</span> {generatedData.overviewAdvice}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {generatedData.categories?.map((cat: any, idx: number) => (
                <div key={idx} className="p-3 bg-[#f8f9fa] rounded-xl border border-gray-200">
                  <div className="font-bold text-xs text-[#a04100] mb-1.5 flex items-center space-x-1">
                    <span className="material-symbols-outlined text-base">inventory_2</span>
                    <span>{cat.title}</span>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1 pl-2">
                    {cat.items?.map((item: any, itemIdx: number) => (
                      <li key={itemIdx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]" />
                        <span className="font-medium">{item.name}</span>
                        {item.notes && <span className="text-gray-400 text-[10px]">({item.notes})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApply}
                className="flex-1 bg-[#a04100] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#7a3000]"
              >
                Add Items to My Checklist
              </button>
              <button
                onClick={() => setGeneratedData(null)}
                className="px-4 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-300"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
