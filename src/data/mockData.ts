import { Trip, TerrainGuide, SavedTip } from '../types';

export const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB6HE8xYj9tuwxyBDaN1devHjcliDLZYSRsl60qAxj2Gugo9RYtYhFuQ1DZf5g-HNHYO9NxTyX7L4q_C-uUAbWpvCLixMiSs8O0Yy5d_b9x8ukRhC_389W-elccYJJ_3fN0EVBSTDKYfru80fDpli4Y6SadUzHxf4F1tJOaZkRBzcRdonf70Gc88UA23CWSlUPFpxWN2_KSTpf5SrHpTO1ZbStndJCmsPJU8Kl9mzUMukzqhHthZEE";

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'himalayan-trek',
    title: 'Himalayan Trek',
    destination: 'Annapurna Circuit, Nepal',
    dates: 'Oct 12 - Oct 26, 2024',
    startDate: '2024-10-12',
    endDate: '2024-10-26',
    daysAwayText: '5 days away',
    climateIcon: 'ac_unit',
    terrain: 'Mountain',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgRWGAcA4UaK7lkSjotTptQyPrURrjGK9nKNa1dspsjVFc-pyG8OK_12Tob3reEsjyG1uGkdrYh2ffUXoF364F3AFJAdDa51vgDBViX63y2pRprpulJNe-xTtaTLMq-hGytsThh75hciILhbGTIiRBcgGJibMBtUWi7fmD-W1PEUxGPGwoJA7ZbTTP2c98KtUwiKYfRN51nev13xFEYQru5QFXCMCHXBE-V4j3u6h-do3c7mbziyY',
    categories: [
      {
        id: 'cat-essentials',
        title: 'Essentials',
        icon: 'badge',
        colorClass: 'bg-secondary-container/20 text-on-secondary-container',
        items: [
          { id: 'e1', name: 'Passport', checked: true },
          { id: 'e2', name: 'Trekking Permit', checked: true },
          { id: 'e3', name: 'First Aid Kit', checked: false },
          { id: 'e4', name: 'Travel Insurance Documents', checked: true },
          { id: 'e5', name: 'Local Currency (NPR Cash)', checked: true }
        ]
      },
      {
        id: 'cat-gear',
        title: 'Trekking Gear',
        icon: 'hiking',
        colorClass: 'bg-primary-container/20 text-on-primary-container',
        items: [
          { id: 'g1', name: 'Thermal Layers', checked: false },
          { id: 'g2', name: 'Hiking Boots', checked: true },
          { id: 'g3', name: 'Sleeping Bag (-15°C)', checked: false },
          { id: 'g4', name: 'Trekking Poles', checked: true },
          { id: 'g5', name: 'Waterproof Rain Cover for Pack', checked: true },
          { id: 'g6', name: 'Heavy Down Jacket', checked: false }
        ]
      },
      {
        id: 'cat-electronics',
        title: 'Electronics',
        icon: 'cable',
        colorClass: 'bg-tertiary-container/20 text-on-tertiary-container',
        items: [
          { id: 'el1', name: 'Power Bank 20000mAh', checked: false },
          { id: 'el2', name: 'Camera & Lenses', checked: false },
          { id: 'el3', name: 'Headlamp + Extra Batteries', checked: false },
          { id: 'el4', name: 'Solar Charger Panel', checked: true },
          { id: 'el5', name: 'Universal Plug Adapter', checked: true },
          { id: 'el6', name: 'Satellite Handheld Communicator', checked: false }
        ]
      },
      {
        id: 'cat-personal',
        title: 'Personal Care & Hydration',
        icon: 'medical_services',
        colorClass: 'bg-amber-100 text-amber-900',
        items: [
          { id: 'p1', name: 'Lip Balm with SPF 30', checked: true },
          { id: 'p2', name: 'Biodegradable Camp Soap', checked: false },
          { id: 'p3', name: 'Water Purification Tablets', checked: false },
          { id: 'p4', name: 'Quick-Dry Microfiber Towel', checked: false }
        ]
      }
    ]
  },
  {
    id: 'goa-beach',
    title: 'Goa Beach Escape',
    destination: 'Palolem Beach, Goa',
    dates: 'Nov 10 - Nov 17, 2024',
    startDate: '2024-11-10',
    endDate: '2024-11-17',
    daysAwayText: '2 weeks away',
    climateIcon: 'light_mode',
    terrain: 'Beach',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYIWEu04yOAamwvtMDYdCtKEYkFXTDC0nhvmsNBG9Bomlt3SsFmU8vO6KVZHLh1VAB08uHvFipVvtoFh5agsYPutqa9GztSi9euPei0UcP-T3TznDrHYGCCb3appMI5EsuIz0EuWYT3OoLpMDB4HMwH7IASoNcC8a-hZBoT9ZiAC6XJ06X_30e4jfadxxX8jDVVfcAIc3ZPgOEhlOGLeX_8ko2wgwcwl97a6z9l6U_bVlo6OchoB8',
    categories: [
      {
        id: 'cat-beachwear',
        title: 'Beachwear & Apparel',
        icon: 'dry',
        colorClass: 'bg-blue-100 text-blue-900',
        items: [
          { id: 'b1', name: 'Swimwear (2 Sets)', checked: true },
          { id: 'b2', name: 'Linen Shirts & Shorts', checked: false },
          { id: 'b3', name: 'UV Polarized Sunglasses', checked: true },
          { id: 'b4', name: 'Waterproof Sandals', checked: false },
          { id: 'b5', name: 'Wide-Brim Sun Hat', checked: false }
        ]
      },
      {
        id: 'cat-sun-care',
        title: 'Sun & Skin Protection',
        icon: 'light_mode',
        colorClass: 'bg-orange-100 text-orange-900',
        items: [
          { id: 's1', name: 'Reef-Safe Sunscreen SPF 50', checked: false },
          { id: 's2', name: 'Soothing Aloe Vera Gel', checked: false },
          { id: 's3', name: 'Mosquito Repellent Spray', checked: false }
        ]
      },
      {
        id: 'cat-beach-tech',
        title: 'Gadgets & Leisure',
        icon: 'cable',
        colorClass: 'bg-emerald-100 text-emerald-900',
        items: [
          { id: 'bt1', name: 'Waterproof Phone Pouch', checked: false },
          { id: 'bt2', name: 'Portable Bluetooth Speaker', checked: false }
        ]
      }
    ]
  }
];

export const TERRAIN_GUIDES: TerrainGuide[] = [
  {
    id: 'mountain-peaks',
    title: 'Mountain Peaks',
    subtitle: 'Essentials for high-altitude survival and layering systems.',
    climateTag: 'Cold Weather',
    climateIcon: 'ac_unit',
    gridClass: 'bento-tall',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6M6YQci9M-6FzPYCjVkdHHV6sBQFEef1iu6JJnKPkdMbyQyBydFRbeX5AIMbkydhi-YWYAiS6q9yHpPKwJcEF_L91xxTpRaQ6hjplJAEAcebSfjOuyrITBpnA9dHhPucPaHGcGgLjvt2DkS_y8maa4Npli8giXPzlktO6TFY9VqEYxE-Ko0s5vC1r9acpq_nBD_hT0BdB2ezfyABg5jJJCO1Lm6fhCPc0fEuCdPI2DSBX_0UEhuw',
    description: 'High-altitude environments demand strict gear compliance to guard against hypothermia, acute mountain sickness, and severe wind chill.',
    essentialsAdvice: 'Focus on the 3-layer system: moisture-wicking base layers, insulating mid-layers (fleece/down), and windproof/waterproof hardshell protection.',
    weatherOverview: 'Rapidly shifting weather, sub-zero nighttime temperatures, intense UV exposure at altitude.',
    recommendedCategories: [
      {
        title: 'Base & Thermal Layers',
        icon: 'layers',
        items: ['Merino Wool Base Shirt', 'Thermal Leggings', 'Wool Hiking Socks', 'Windproof Gloves']
      },
      {
        title: 'Safety & Altitude Gear',
        icon: 'health_and_safety',
        items: ['Satellite Communicator', 'Emergency Thermal Blanket', 'Polarized Glacier Glasses (Category 4)', 'Lip Balm with SPF 50']
      }
    ]
  },
  {
    id: 'sandy-shores',
    title: 'Sandy Shores',
    subtitle: 'Sun protection & beach-to-street wear.',
    climateTag: 'Tropical & Coastal',
    climateIcon: 'light_mode',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-D9hXc_nhkj0aZFYXrUsYvSyxA7UeLNzbORQcTImoNDfU_2j_V7erW294IZZky5XvOm0s7RIAC4hhVC17_sHFW68sQEQ6XA8ZrccR72vBec3JaSSVz8hAsJ67raoNjrdhbNyEfwjLlefu7LBEiAxXakZCARSGkrUXLhB84XAjDPjbTiQ7nF_wTlsu3zXTuYeltHfnSidrGCN3nMSxcJ0oNZrs5i6MlbqBMQysgisMWOOuCOXlCDw',
    description: 'Beach and coastal expeditions require lightweight, quick-drying breathable fabrics paired with non-toxic marine protection.',
    essentialsAdvice: 'Opt for non-nano zinc oxide sunscreen to preserve coral reefs, along with dry bags to protect sensitive camera equipment from sand and saltwater.',
    weatherOverview: 'High temperatures, intense UV index, ocean salt air, sudden sea breezes.',
    recommendedCategories: [
      {
        title: 'Coastal Essentials',
        icon: 'water',
        items: ['Reef-Safe Mineral Sunscreen', 'Waterproof IPX8 Dry Bag', 'Breathable Linen Outfits', 'Microfiber Quick-Dry Towel']
      }
    ]
  },
  {
    id: 'dense-jungles',
    title: 'Dense Jungles',
    subtitle: 'Waterproof gear & bug protection.',
    climateTag: 'Humid Rainforest',
    climateIcon: 'water_drop',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4DcG23Klt1YVYh2saxjK1kqAMhDazGUr5JoZRB4QQVfmel5yLoln_D9orSk1xTD6D1RmxcP_IBvHGibhSVxGcaHVn-zJoCx333ZC6NXn5Ks50OHu21FvgcnWvKpjGi7jtyBVk4UpK_AsaSD2K9VXS2q0NtWALICr6kiaTUTS2xEqnY9j9BOn9v4EkoDzol01x8kz_E7zrnu3oJ2txEvPAnzYIFD_xEWpl-OSraZKJ7CqADJRpVDw',
    description: 'Rainforest treks involve near 100% humidity, frequent downpours, and abundant insect life.',
    essentialsAdvice: 'Never pack pure cotton. Use synthetic quick-dry fabrics treated with permethrin, high-strength Picaridin repellent, and dry storage liners.',
    weatherOverview: 'Hot, high humidity, unpredictable intense torrential rain, damp nights.',
    recommendedCategories: [
      {
        title: 'Jungle Protection',
        icon: 'shield',
        items: ['Picaridin Insect Repellent', 'Permethrin-Treated Shirts', 'Gaiters for Leech Protection', 'Silnylon Dry Compression Sack']
      }
    ]
  },
  {
    id: 'urban-explorations',
    title: 'Urban Explorations',
    subtitle: 'Day-to-night comfort and tech safety essentials for the modern metropolis.',
    climateTag: 'City Navigation',
    climateIcon: 'location_city',
    gridClass: 'bento-wide',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDPF0-8X42OFW93vVIJChqDgbmUZ_4BslRcNOBylG0unFXZSPOVa1pPat3sRPyRxTeKAdg57jMXfL5M7CVlhxKHI4MerrWGNPxoFDk0vCJZHt0Kla46gafzLQ4FaLZawkrgopBOIJPP_fd0694qGuUweVS1APdBi3YvhB-UE0oMiMFE2GatFxQiKO4zeLBsWWu_zOeJqh7mw_ArSw-Lv_5VDnsYNfPEdiShMD5-qZ4WUeLud0MEms',
    description: 'Navigating bustling cities requires versatile gear that transitions seamlessly from subway commuting to evening dining while safeguarding digital assets.',
    essentialsAdvice: 'Equip your daypack with RFID-blocking sleeves, hidden zipper locks, a high-capacity compact battery, and ergonomic walking shoes.',
    weatherOverview: 'Moderate to warm, urban heat island effects, unexpected metro AC drops.',
    recommendedCategories: [
      {
        title: 'Urban Mobility & Tech Safety',
        icon: 'backpack',
        items: ['Anti-Theft Sling Bag', 'Compact 65W GaN Charger', 'Noise-Canceling Earbuds', 'RFID Minimalist Wallet']
      }
    ]
  }
];

export const SAVED_TIPS: SavedTip[] = [
  {
    id: 'tip-1',
    title: 'The 3-Layer System',
    description: 'Base, mid, and shell layers explained for unpredictable mountain weather.',
    category: 'Clothing',
    icon: 'layers',
    iconBg: 'bg-primary-container/20',
    iconColor: 'text-primary',
    isSaved: true
  },
  {
    id: 'tip-2',
    title: 'Anti-Theft Packing',
    description: 'How to secure your tech and valuables while navigating crowded transit.',
    category: 'Safety',
    icon: 'backpack',
    iconBg: 'bg-tertiary-container/20',
    iconColor: 'text-tertiary',
    isSaved: true
  },
  {
    id: 'tip-3',
    title: 'Quick-Dry Fabrics',
    description: 'Why cotton is your enemy in high humidity and what to pack instead.',
    category: 'Materials',
    icon: 'dry',
    iconBg: 'bg-secondary-container/20',
    iconColor: 'text-secondary',
    isSaved: true
  }
];

export const QUICK_GUIDE_THUMBNAILS = [
  {
    title: 'Mountains',
    icon: 'hiking',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsLdLE5fqm-USsfAbARNjVYY3oRDbZa1juJHXYR5PR-DPaD7GmaZGxfoIfQIQO8qkzLi4_siehxqra2sFOZwgtbHYhDA45xIMonhRY3jQQwD9zdgpYwXNeMDQd1wm1O_qWu-rTSDtJri44qixkYcTD1Sbo6Y_J9mQQ-9tyH9BcRAWy8VfKvRglSLLO3kFD5dopsIc2zVgGiKX8aw2hbqCxqIA-tFHUU5R9zqSnGYi6KqeTfg7Aqho',
    terrainId: 'mountain-peaks'
  },
  {
    title: 'Beaches',
    icon: 'waves',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9VLO9sbAzKe0JZssptUgkLmEDepOcZypldGjGK5TrL9d372KU9uZZYRFpfLMFKOP4_oBsRCLYT7j13hKZsCrZ5P1syWX23kJiMmew6F6jTxEn6BKYvZ54eiW_eri2MfqpIV-GLJEBAGxD8hcB7asPfZBEGfFOrKVhRi0ey2YbkfoaUFm18qxzvuRk3m9qj6lmPqWsu1riwmSWeP0oNjhQr5G-FZOt8kdJgp9pwxxZt7CIsxlNkjQ',
    terrainId: 'sandy-shores'
  },
  {
    title: 'Trekking',
    icon: 'map',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Q23nWH_x-7xn1FmAUW006CoYQfJ_MmOfrbxEAW6siug_2y8fYUbttzqIeQZqWFkvQyvAfYSHrcjK4Cq2KoR4i2jtElUJHRw3noSyTrNP3Qx5SUpSmoP0DPeGLAJpLQlNV570KjUZ1kBnFDEagIpdoxs3Rle2JENaaJGZqe_kykWP7NFX_V3BYv7yL30APFPcf-Eyf7TyZYZLPJ2cPc58uHPN5_NBIU1E9Uv89-CxIaLCwme-9EU',
    terrainId: 'mountain-peaks'
  },
  {
    title: 'Tropical',
    icon: 'forest',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtOqvcqp_YEcYHXiCA2a8ECS3ifNvwtp-yoDG9RGPkTxN5mBMhsqNAmDCqiKjVHUcoR-TOsSJI_DSl7WCbBrzn4n8fR2rrdxteh4gt65ns35F7GL6vJW9HhBw-GkYbhNvsyz-o8tvLPP-PkStTWl2SILTehFRzPY3Og6YFK4WAw2M9azJirQpzyQ3N8uXlefvHRJtpAWZnJCApykJdtpeFZKoPgAfDKTaVbC8i6Jo6ZGt2z8S70Mg',
    terrainId: 'dense-jungles'
  }
];
