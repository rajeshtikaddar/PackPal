export interface User {
  id: string;
  name: string;
  identifier: string; // Email or Mobile Number
  identifierType: 'email' | 'mobile';
  password: string;
  avatar?: string;
  joinedYear?: string;
  preferredUnits?: 'metric' | 'imperial';
  notifications?: boolean;
}

export interface PackingItem {
  id: string;
  name: string;
  checked: boolean;
  notes?: string;
  quantity?: number;
}

export interface PackingCategory {
  id: string;
  title: string;
  icon: string; // Material symbol icon name (e.g. 'badge', 'hiking', 'cable', 'medical_services')
  colorClass?: string;
  items: PackingItem[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  startDate?: string;
  endDate?: string;
  daysAwayText: string;
  climateIcon: string; // Material symbol icon name (e.g. 'ac_unit', 'light_mode', 'landscape')
  terrain: 'Mountain' | 'Beach' | 'Jungle' | 'Urban' | 'Desert' | 'General';
  coverImage: string;
  categories: PackingCategory[];
}

export interface TerrainGuide {
  id: string;
  title: string;
  subtitle: string;
  climateTag?: string;
  climateIcon: string;
  coverImage: string;
  gridClass?: string; // e.g., 'bento-tall' or 'bento-wide'
  description: string;
  essentialsAdvice: string;
  weatherOverview: string;
  recommendedCategories: {
    title: string;
    icon: string;
    items: string[];
  }[];
}

export interface SavedTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  isSaved?: boolean;
}

export type ActiveTab = 'home' | 'trips' | 'guides' | 'profile';
