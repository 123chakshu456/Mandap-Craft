// ==========================================
// CATEGORIES & SUBSECTIONS DATA STRUCTURE
// Complete hierarchical catalog data
// ==========================================

export interface SubCategoryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  popularItems: string[];
}

export interface CategoryData {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  icon: string; // Emoji or icon name
  badge?: string;
  promo: {
    title: string;
    subtitle: string;
    badge: string;
    discount?: string;
    image: string;
    ctaText: string;
    targetSubcategory?: string;
  };
  subsections: SubCategoryItem[];
}

export const CATEGORIES: CategoryData[] = [
  {
    id: 'wedding',
    title: 'WEDDING',
    shortTitle: 'Wedding',
    tagline: 'Sacred Rituals & Royal Ceremonial Stages',
    icon: '🏰',
    badge: 'Popular',
    promo: {
      title: 'Grand Wedding Mandap Sets',
      subtitle: 'Complete ceremonial staging with fresh floral arches, carved pillars & sacred havan kund.',
      badge: 'Heritage Collection',
      discount: 'Up to 25% Off Packages',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80',
      ctaText: 'Explore Wedding Staging',
      targetSubcategory: 'mandaps',
    },
    subsections: [
      {
        id: 'ceilings',
        title: 'Ceilings & Cloth Canopies',
        description: 'Traditional Scalloped Velvet Ruffles, Concentric Silk Rings & Mandap Roof Ceiling Work',
        image: '/ceilings/traditional_ceiling_decor.jpg',
        popularItems: ['Scalloped Velvet Ceiling Canopy', 'Triple-Layer Red & Yellow Ruffle', 'Concentric Silk Mandala Ceiling', 'Pleated Mandap Roof Decor'],
      },
      {
        id: 'mandaps',
        title: 'Mandaps',
        description: 'Traditional Marigold, Crystal Dome & Royal Carved Wooden Mandaps',
        image: 'https://images.unsplash.com/photo-1595183818343-dac68e26830c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Royal Marigold Mandap', 'Pastel Orchid Dome', 'Carved Teakwood Mandap', 'Glass Pillar Mandap'],
      },
      {
        id: 'tents',
        title: 'Tents',
        description: 'Waterproof German Hangar Tents, Pagoda Tents & Maharaja Shamianas',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        popularItems: ['German Hangar Structure', 'Pagoda High-Peak Tent', 'Rajasthani Mughal Tent', 'Transparent Dome Tent'],
      },
      {
        id: 'canopies',
        title: 'Canopies',
        description: 'Suspended Floral Canopies, Draped Pergolas & Entry Pathway Arches',
        image: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Hanging Floral Canopy', 'Velvet Draped Pergola', 'Tunnel Light Canopy', 'Chunri Entrance Canopy'],
      },
      {
        id: 'backdrops',
        title: 'Backdrops',
        description: 'Mirror Sheesh Mahal, Gold Foil Jali & 3D Floral Photo Walls',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Sheesh Mahal Mirror Wall', 'Golden Carved Jali', 'Hydrangea Flower Wall', 'Fairy Light Draped Wall'],
      },
      {
        id: 'jaimala',
        title: 'Jaimala',
        description: 'Rotating Revolving Jaimala Stages, Hydraulic Lotus & Rose Varmalas',
        image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Hydraulic Lotus Stage', 'Revolving Floral Platform', 'Exotic Orchid Varmala', 'Cold Pyro Jaimala Stage'],
      },
      {
        id: 'stage-items',
        title: 'Stage items',
        description: 'Stage Carpeting, Maharaja Throne Sofas, Brass Urlis & Royal Steps',
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Maharaja Twin Thrones', 'Carved Royal Risers', 'Grand Brass Urlis', 'Illuminated Acrylic Steps'],
      },
    ],
  },
  {
    id: 'furniture',
    title: 'FURNITURE',
    shortTitle: 'Furniture',
    tagline: 'Artisanal Woodwork & Luxury Banquet Seating',
    icon: '🛋️',
    badge: 'Premium',
    promo: {
      title: 'Artisan Banquet & Lounge Sets',
      subtitle: 'Hand-carved seasoned teakwood, velvet Chesterfield sofas, and mirror-finish bar counters.',
      badge: 'Seasoned Teakwood',
      discount: 'Bulk Rental & Sale Discounts',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80',
      ctaText: 'Browse Furniture Collection',
      targetSubcategory: 'chairs',
    },
    subsections: [
      {
        id: 'chairs',
        title: 'All Chairs',
        description: 'Bespoke Bentwood Designer Chairs & Commercial Molded Plastic Armchairs',
        image: '/chairs/ornate_black_red_chair.jpg',
        popularItems: ['Ornate Black/Red Armchair (₹3,000)', 'Pearl Black/Red Chair (₹2,950)', 'Orlando Yellow Chair (₹1,700)', 'Seagull Red Chair (₹780)'],
      },
      {
        id: 'designer-chairs',
        title: 'Designer Chairs',
        description: 'Bespoke Ornate Bentwood Armchairs, Pearl Black & Red Lounge Seating',
        image: '/chairs/ornate_black_red_chair.jpg',
        popularItems: ['Ornate Black/Red Armchair (₹3,000)', 'Pearl Black/Red Chair (₹2,950)', 'Ornate Jordan Pattern Chair (₹2,450)'],
      },
      {
        id: 'plastic-chairs',
        title: 'Plastic Chairs',
        description: 'Heavy-Duty Molded Plastic Armchairs & Stackable Ceremonial Seating',
        image: '/chairs/orlando_plastic_chair.jpg',
        popularItems: ['Orlando Yellow Armchair (₹1,700)', 'Windsor Brown Armchair (₹1,400)', 'Seagull Red Chair (₹780)'],
      },
      {
        id: 'tables',
        title: 'Tables',
        description: 'Round Banquet Tables, Italian Marble Coffee Tables & Dining Sets',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Round Banquet Tables (60")', 'Italian Marble Coffee Table', 'Long VIP Dining Tables', 'Cocktail High Tables'],
      },
      {
        id: 'sofas',
        title: 'Sofas',
        description: 'Emerald Tufted Velvet Sofas, Chesterfield Lounges & Sectionals',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Emerald Tufted 3-Seater', 'Cream Velvet Chesterfield', 'Royal Golden Diwan', 'L-Shaped VIP Lounge Sofa'],
      },
      {
        id: 'bar-tables',
        title: 'Bar tables',
        description: 'High-Top Cocktail Bar Tables, LED Illuminated & Gold Chrome Stools',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Champagne Gold High Tables', 'LED Glow Cocktail Tables', 'Velvet Swivel Bar Stools', 'Rustic Wooden Bar Highs'],
      },
      {
        id: 'counters',
        title: 'Counters',
        description: 'Reception Desks, Registration Desks & Curved Modular Counters',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Mirrored Reception Counter', 'Gold Laser-Cut Desk', 'Curved Welcome Counter', 'Registration Kiosks'],
      },
      {
        id: 'outdoor-furniture',
        title: 'Outdoor Furniture',
        description: 'Heavy-Duty Outdoor Event Chairs, Rattan Swings, Rope Daybeds & Poolside Recliners',
        image: '/catalogue/cat_p24_1_rattan-swing_of-01.jpg',
        popularItems: ['Rattan Garden Swing', 'Rope Swing Chair', 'Poolside Recliner', 'Outdoor Dining Chair'],
      },
    ],
  },
  {
    id: 'catering',
    title: 'CATERING',
    shortTitle: 'Catering',
    tagline: 'Commercial Equipment, Luxury Crockery & Live Stations',
    icon: '🍽️',
    badge: 'Heavy Duty',
    promo: {
      title: 'Commercial Catering & Buffet Systems',
      subtitle: 'Complete buffet lines, brass silverware, industrial gas burners, and high-temp food warmers.',
      badge: 'Hospitality Grade',
      discount: 'Food-grade Certified',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=700&q=80',
      ctaText: 'Explore Catering Range',
      targetSubcategory: 'buffet-counters',
    },
    subsections: [
      {
        id: 'crockery',
        title: 'Crockery',
        description: 'Bone China Plates, Royal Brass Thali Sets, Crystal Glassware & Cutlery',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Royal Brass Kansa Thali Set', 'Gold-Rimmed Bone China Plates', 'Crystal Wine & Water Goblets', 'Mirror Polish Cutlery Set'],
      },
      {
        id: 'serving-items',
        title: 'Serving items',
        description: 'Roll-Top Chafing Dishes, Silver Platters, Beverage Dispensers & Tongs',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Roll-Top Hydraulic Chafing Dish', 'Hammered Copper Serving Bowls', 'Triple Tier Beverage Dispenser', 'Carved Silver Serving Trays'],
      },
      {
        id: 'gas-pipes',
        title: 'Gas pipes',
        description: 'High-Pressure Reinforced LPG Gas Pipes, Industrial Regulators & Manifolds',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Commercial Steel Braided Gas Pipe', 'High-Flow Multi-Cylinder Manifold', 'Heavy Duty Gas Pressure Regulator', 'Quick-Release Gas Connectors'],
      },
      {
        id: 'catering-equipment',
        title: 'Catering equipment',
        description: 'Commercial Bhatti Burners, Tandoor Ovens, Deep Fryers & Hot Boxes',
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Stainless Steel Clay Tandoor', 'Triple Burner Commercial Bhatti', 'Electric Insulated Hot Box', 'Heavy Duty Commercial Fryer'],
      },
      {
        id: 'buffet-counters',
        title: 'Buffet counters',
        description: 'Granite-Top Live Food Stations, Chaat Counters & LED Buffet Display Sets',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        popularItems: ['LED Backlit Buffet Counter', 'Granite-Top Live Dosa/Chaat Counter', 'Wooden Rustic Buffet Island', 'Carved Royal Sweet Counter'],
      },
    ],
  },
  {
    id: 'decor',
    title: 'DECOR',
    shortTitle: 'Decor',
    tagline: 'Floral Masterpieces, Thematic Props & Ambient Mood Lighting',
    icon: '✨',
    badge: 'Artisanal',
    promo: {
      title: 'Grand Wedding & Event Styling',
      subtitle: 'Lush 3D floral walls, vintage brass urns, flowing silk organza fabrics, and warm crystal chandeliers.',
      badge: 'Designer Choice',
      discount: 'Custom Color Themes',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
      ctaText: 'Discover Decor Trends',
      targetSubcategory: 'artificial-flowers',
    },
    subsections: [
      {
        id: 'artificial-flowers',
        title: 'Artificial flowers',
        description: 'High-Density Rose Walls, Hanging Wisteria, Hydrangea Mats & Garlands',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
        popularItems: ['3D Real-Touch Rose Wall', 'Cascading White Wisteria Hangings', 'Marigold Toran Garlands', 'Tropical Palm & Orchid Mats'],
      },
      {
        id: 'props',
        title: 'Props',
        description: 'Vintage Birdcages, Antique Brass Urlis, Mirror Frames & Haldi Rickshaws',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Hand-Painted Haldi Rickshaw', 'Antique Brass Floating Urlis', 'Golden Geometric Frames', 'Moroccan Lantern Set'],
      },
      {
        id: 'panels',
        title: 'Panels',
        description: 'Laser-Cut MDF Jali Panels, Gold Leaf Backdrop Panels & Acrylic Screens',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Carved Mughal Jali Panels', 'Golden Mirror Acrylic Panel', 'Geometric 3D Wall Panel', 'Rustic Distressed Wood Screen'],
      },
      {
        id: 'fabrics',
        title: 'Fabrics',
        description: 'Heavy Velvet Drapes, Shimmer Georgette, Organza Rolls & Silk Curtains',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Royal Crimson Heavy Velvet', 'Ivory Flowing Georgette Fabric', 'Pastel Pink Shimmer Organza', 'Pleated Silk Drapery Rolls'],
      },
      {
        id: 'centerpieces',
        title: 'Centerpieces',
        description: 'Crystal Candelabras, Golden Floral Stands & LED Table Vases',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
        popularItems: ['5-Arm Crystal Candelabra', 'Tall Gold Geometric Flower Tower', 'Warm Mercury Glass Votives', 'Floating Blossom Glass Bowl'],
      },
      {
        id: 'lighting',
        title: 'Lighting',
        description: 'Warm Edison Fairy Bulbs, LED Sharpie Moving Heads & RGB Focus Halogens',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Vintage Edison Bulb Strings', 'LED 36-Beam Moving Head', 'Warm Ambient Up-Lighting Cans', 'Crystal Chandelier Hanging Array'],
      },
    ],
  },
  {
    id: 'event-essentials',
    title: 'EVENT ESSENTIALS',
    shortTitle: 'Event Essentials',
    tagline: 'Climate Control, Power Distribution & Flooring Logistics',
    icon: '⚡',
    badge: 'Reliable',
    promo: {
      title: 'Power, Cooling & Ground Management',
      subtitle: 'High-velocity mist coolers, heavy duty silent generators, plush red VIP carpets, and interlocking flooring.',
      badge: 'All-Weather Ready',
      discount: 'Commercial Grade Quality',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=700&q=80',
      ctaText: 'Explore Event Essentials',
      targetSubcategory: 'coolers',
    },
    subsections: [
      {
        id: 'coolers',
        title: 'Coolers',
        description: 'High-Capacity Industrial Mist Coolers & Commercial Ducting AC Units',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Commercial Mist Jet Cooler (100L)', 'Heavy Ducting Portable AC (5 Ton)', 'Centrifugal Outdoor Air Cooler', 'Silent Water Evaporative Cooler'],
      },
      {
        id: 'fans',
        title: 'Fans',
        description: '3-Speed Pedestal Misting Fans, Giant Industrial Floor Fans & Wall Mounts',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
        popularItems: ['26" Heavy-Duty Pedestal Misting Fan', 'High-Velocity Floor Drum Fan', 'Industrial Wall Mounted Fan', 'Oscillating Tent Pole Fans'],
      },
      {
        id: 'carpets',
        title: 'Carpets',
        description: 'Royal Red VIP Runners, Royal Blue Hall Carpeting & Plush White Aisle Runners',
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
        popularItems: ['MCCL 9811 BLACK GOLD', 'MCCL Sage Green Octagon', 'MCCL White Terrazzo Diamond', 'MCCL White Petal Marble'],
      },
      {
        id: 'mats',
        title: 'Mats',
        description: 'MCCL Luxury Event Floor Mats, Anti-Skid Rubber Backed Mats & Ceremonial Runners',
        image: '/Mats/MCCL_9641_BLACK_GOLD.jpg',
        popularItems: ['MCCL 9641 Black & Gold', 'MCCL 9631 Green & Gold', 'MCCL 9609 Blue & Beige', 'MCCL 9619 Maroon'],
      },
      {
        id: 'electrical-items',
        title: 'Electrical items',
        description: 'Main Distribution Panels (DBs), Heavy Rubber Cables, DB Boxes & Extension Hubs',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['63A 3-Phase Weatherproof DB Box', 'Heavy Armored Power Cable (100m)', 'Rubberized Industrial Cable Protectors', 'High-Load Spike Extension Boards'],
      },
      {
        id: 'miscellaneous-equipment',
        title: 'Miscellaneous equipment',
        description: 'Barricades, Stanchions with Velvet Ropes, Sound Rigging & Ladder Scaffolding',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Gold Stanchions with Red Velvet Ropes', 'Crowd Control Steel Barricades', 'Aluminum Scaffolding Tower', 'Heavy Ground Anchoring Stakes'],
      },
      {
        id: 'heaters',
        title: 'Patio & Event Heaters',
        description: 'Commercial Outdoor Patio Heaters, Electric Quartz Infrared & Pyramid Flame Gas Heaters',
        image: '/catalogue/cat_p2_4_patio-heater_pyramid-heater.jpg',
        popularItems: ['Pyramid Flame Gas Heater', 'Electric Patio Heater', 'Commercial Mushroom Gas Heater'],
      },
    ],
  },
  {
    id: 'custom-manufacturing',
    title: 'CUSTOM / MANUFACTURING',
    shortTitle: 'Custom / Mfg',
    tagline: 'In-House Fabrication, Bespoke Structures & Brand Customization',
    icon: '🛠️',
    badge: 'Custom Made',
    promo: {
      title: 'Bespoke In-House Manufacturing',
      subtitle: 'From concept blueprints to CNC fabrication—we build custom aluminium-structure tents, branded counters, and signature stages.',
      badge: 'Factory Direct',
      discount: 'Made To Order',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
      ctaText: 'Request Custom Manufacturing',
      targetSubcategory: 'custom-tents',
    },
    subsections: [
      {
        id: 'custom-tents',
        title: 'Custom tents',
        description: 'Tailored Heavy-Span Aluminum Tents, Transparent Glass Pavilions & Custom Shapes',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Custom Curvature Clear-Span Tent', 'Heavy Weatherproof Dome Pavilion', 'Double-Decker VIP Hospitality Tent', 'Branded Corporate Expo Structure'],
      },
      {
        id: 'custom-counters',
        title: 'Custom counters',
        description: 'Bespoke Logo Backlit Reception Counters, Bar Islands & Interactive Registration Kiosks',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['3D Acrylic Backlit Brand Counter', 'Curved Brass-Inlaid Bar Counter', 'Hydraulic Mobile DJ Booth', 'Touchscreen Integrated Kiosk Counter'],
      },
      {
        id: 'custom-furniture',
        title: 'Custom furniture',
        description: 'Hand-Carved Heritage Teak Thrones, Custom Banquet Benches & Unique Booths',
        image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Custom Engraved Teakwood Swing', 'Bespoke Velvet Curved Banquettes', 'Gold-Leaf Embossed Maharaja Chairs', 'Geometric Marble Dining Sets'],
      },
      {
        id: 'custom-decor',
        title: 'Custom décor',
        description: 'Bespoke 3D Sculptures, Mythological Statues, Giant Flower Arcs & Kinetic Displays',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        popularItems: ['12-Foot Fiberglass Peacock Sculpture', 'Custom Acrylic LED Chandelier Array', 'Kinetic Floral Ceiling Rig', 'Gold-Coated Mythological Temple Facade'],
      },
    ],
  },
];

// Quick helper utilities
export const getCategoryById = (id: string): CategoryData | undefined => {
  return CATEGORIES.find(cat => cat.id.toLowerCase() === id.toLowerCase());
};

export const getAllSubcategories = (): SubCategoryItem[] => {
  return CATEGORIES.flatMap(cat => cat.subsections);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): SubCategoryItem | undefined => {
  const cat = getCategoryById(categoryId);
  return cat?.subsections.find(sub => sub.id.toLowerCase() === subcategoryId.toLowerCase());
};
