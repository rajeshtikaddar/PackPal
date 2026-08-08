import React, { useState } from 'react';
import { Trip, PackingCategory, PackingItem } from '../types';

interface TripDetailViewProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onBack: () => void;
  onOpenAiAssistant: (trip: Trip) => void;
}

export const TripDetailView: React.FC<TripDetailViewProps> = ({
  trip,
  onUpdateTrip,
  onBack,
  onOpenAiAssistant,
}) => {
  const [addingCategoryForItem, setAddingCategoryForItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('inventory_2');

  // Calculate live stats
  let totalItems = 0;
  let packedItems = 0;
  trip.categories.forEach((cat) => {
    cat.items.forEach((item) => {
      totalItems++;
      if (item.checked) packedItems++;
    });
  });
  const progressPercent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  // Toggle item status
  const handleToggleItem = (catId: string, itemId: string) => {
    const updatedCategories = trip.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      };
    });
    onUpdateTrip({ ...trip, categories: updatedCategories });
  };

  // Add item to category
  const handleAddItem = (catId: string) => {
    if (!newItemName.trim()) return;
    const newItem: PackingItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      checked: false,
    };

    const updatedCategories = trip.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: [...cat.items, newItem],
      };
    });

    onUpdateTrip({ ...trip, categories: updatedCategories });
    setNewItemName('');
    setAddingCategoryForItem(null);
  };

  // Delete item
  const handleDeleteItem = (catId: string, itemId: string) => {
    const updatedCategories = trip.categories.map((cat) => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.filter((item) => item.id !== itemId),
      };
    });
    onUpdateTrip({ ...trip, categories: updatedCategories });
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategoryTitle.trim()) return;
    const newCat: PackingCategory = {
      id: `cat-${Date.now()}`,
      title: newCategoryTitle.trim(),
      icon: newCategoryIcon,
      colorClass: 'bg-primary-container/20 text-on-primary-container',
      items: [],
    };
    onUpdateTrip({ ...trip, categories: [...trip.categories, newCat] });
    setNewCategoryTitle('');
    setShowAddCategoryModal(false);
  };

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-6 space-y-6 pb-24 md:pb-8">
      {/* Top Header Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1 text-[#a04100] font-semibold text-sm hover:underline"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span>Back to Trips</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenAiAssistant(trip)}
            className="bg-[#ff6b00]/10 border border-[#ff6b00]/30 text-[#a04100] hover:bg-[#ff6b00] hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>AI Packing Assistant</span>
          </button>
        </div>
      </div>

      {/* Header & Progress Banner */}
      <section className="bg-white rounded-xl shadow-xs border border-[#e2bfb0]/30 overflow-hidden">
        <div className="h-48 md:h-64 relative">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full text-white">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {trip.title}
                </h1>
                <p className="text-xs md:text-sm font-medium opacity-90 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  {trip.dates}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-full p-2.5 flex items-center justify-center text-white border border-white/30 shadow-xs">
                <span className="material-symbols-outlined text-xl">
                  {trip.climateIcon}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="p-4 md:p-6 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#5a4136] uppercase tracking-wider">
              Packing Progress
            </span>
            <span className="text-xs font-bold text-[#a04100]">
              {progressPercent}% Packed ({packedItems}/{totalItems})
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#e1e3e4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff6b00] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Packing Lists Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trip.categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl p-4 md:p-5 shadow-xs border border-[#e2bfb0]/30 flex flex-col h-full hover:border-[#a04100]/40 transition-colors"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3 border-b border-[#e1e3e4] pb-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${category.colorClass || 'bg-[#ff6b00]/10 text-[#a04100]'}`}>
                  <span className="material-symbols-outlined text-xl">{category.icon}</span>
                </div>
                <h2 className="text-base font-bold text-[#191c1d]">{category.title}</h2>
              </div>
              <span className="text-xs font-bold text-[#5a4136] bg-[#f3f4f5] px-2 py-0.5 rounded-full">
                {category.items.filter((i) => i.checked).length}/{category.items.length}
              </span>
            </div>

            {/* Category Item List */}
            <ul className="flex-grow space-y-1 my-2">
              {category.items.length === 0 ? (
                <p className="text-xs text-[#5a4136] italic py-3 text-center">
                  No items in this section yet.
                </p>
              ) : (
                category.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-1.5 px-2 hover:bg-[#f3f4f5] rounded-lg transition-colors group"
                  >
                    <label className="flex items-center gap-3 flex-grow cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleItem(category.id, item.id)}
                        className="w-5 h-5 rounded border-[#8e7164] text-[#a04100] focus:ring-[#a04100] bg-white cursor-pointer accent-[#a04100]"
                      />
                      <span
                        className={`text-sm transition-all ${
                          item.checked
                            ? 'text-[#5a4136]/70 line-through font-normal'
                            : 'text-[#191c1d] font-medium'
                        }`}
                      >
                        {item.name}
                      </span>
                    </label>

                    <button
                      onClick={() => handleDeleteItem(category.id, item.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Add Item Form or Button */}
            {addingCategoryForItem === category.id ? (
              <div className="mt-3 pt-2 border-t border-[#e1e3e4] space-y-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem(category.id)}
                  placeholder="e.g., Thermal Gloves"
                  className="w-full text-xs bg-[#f3f4f5] border border-[#e2bfb0] rounded-lg p-2 text-[#191c1d] focus:outline-none focus:border-[#a04100]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddItem(category.id)}
                    className="flex-1 bg-[#a04100] text-white text-xs font-bold py-1.5 rounded-lg hover:bg-[#7a3000]"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingCategoryForItem(null);
                      setNewItemName('');
                    }}
                    className="px-3 bg-gray-200 text-gray-700 text-xs font-bold py-1.5 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAddingCategoryForItem(category.id);
                  setNewItemName('');
                }}
                className="mt-3 w-full py-2 border border-[#2c694e] text-[#2c694e] font-semibold text-xs rounded-xl hover:bg-[#2c694e]/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Add Item</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Category Action */}
      <div className="pt-2">
        <button
          onClick={() => setShowAddCategoryModal(true)}
          className="w-full py-3 border-2 border-dashed border-[#a04100]/40 text-[#a04100] font-bold text-sm rounded-xl hover:bg-[#a04100]/5 transition-colors flex items-center justify-center space-x-2"
        >
          <span className="material-symbols-outlined">library_add</span>
          <span>Create Custom Category</span>
        </button>
      </div>

      {/* Modal to Add New Category */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#191c1d]">Add Custom Packing Category</h3>
            <div>
              <label className="block text-xs font-bold text-[#5a4136] mb-1">Category Name</label>
              <input
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="e.g. Photography Gear"
                className="w-full text-sm bg-[#f3f4f5] border border-[#e2bfb0] rounded-xl p-3 focus:outline-none focus:border-[#a04100]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5a4136] mb-1">Select Icon</label>
              <div className="flex gap-2">
                {['photo_camera', 'medical_services', 'sports_esports', 'backpack', 'checkroom'].map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewCategoryIcon(icon)}
                    className={`p-3 rounded-xl border text-xl flex items-center justify-center ${
                      newCategoryIcon === icon ? 'border-[#a04100] bg-[#ff6b00]/10 text-[#a04100]' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-[#a04100] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#7a3000]"
              >
                Create Category
              </button>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="px-4 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
