import dotenv from 'dotenv';
dotenv.config();
import prisma from '../shared/config/prisma.js';

// Helper slug generator
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ─────────────────────────────────────────────────────────
// CATEGORY DATA DEFINITION
// ─────────────────────────────────────────────────────────
const CATEGORIES_DATA = [
  {
    id: 'wedding',
    name: 'Wedding Staging & Mandaps',
    slug: 'wedding',
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
        name: 'Ceilings & Cloth Canopies',
        slug: 'ceilings',
        description: 'Traditional Scalloped Velvet Ruffles, Concentric Silk Rings & Mandap Roof Ceiling Work',
        image: '/ceilings/traditional_ceiling_decor.jpg',
        popularItems: ['Scalloped Velvet Ceiling Canopy', 'Triple-Layer Red & Yellow Ruffle', 'Concentric Silk Mandala Ceiling', 'Pleated Mandap Roof Decor'],
        subSubcategories: [
          { id: 'scalloped-ceilings', name: 'Scalloped Velvet Ceilings', slug: 'scalloped-velvet-ceilings' },
          { id: 'silk-mandala-ceilings', name: 'Concentric Silk Mandalas', slug: 'concentric-silk-mandalas' },
          { id: 'hanging-drape-roofs', name: 'Pleated Mandap Roofs', slug: 'pleated-mandap-roofs' },
        ],
      },
      {
        id: 'mandaps',
        name: 'Mandaps',
        slug: 'mandaps',
        description: 'Traditional Marigold, Crystal Dome & Royal Carved Wooden Mandaps',
        image: 'https://images.unsplash.com/photo-1595183818343-dac68e26830c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Royal Marigold Mandap', 'Pastel Orchid Dome', 'Carved Teakwood Mandap', 'Glass Pillar Mandap'],
        subSubcategories: [
          { id: 'traditional-mandaps', name: 'Traditional Floral Mandaps', slug: 'traditional-floral-mandaps' },
          { id: 'royal-carved-mandaps', name: 'Royal Carved Teak Mandaps', slug: 'royal-carved-teak-mandaps' },
          { id: 'modern-glass-mandaps', name: 'Modern Crystal & Glass Mandaps', slug: 'modern-crystal-glass-mandaps' },
        ],
      },
      {
        id: 'tents',
        name: 'Tents',
        slug: 'tents',
        description: 'Waterproof German Hangar Tents, Pagoda Tents & Maharaja Shamianas',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        popularItems: ['German Hangar Structure', 'Pagoda High-Peak Tent', 'Rajasthani Mughal Tent', 'Transparent Dome Tent'],
        subSubcategories: [
          { id: 'german-hangars', name: 'Aluminium German Hangars', slug: 'aluminium-german-hangars' },
          { id: 'pagoda-tents', name: 'Pagoda High-Peak Tents', slug: 'pagoda-high-peak-tents' },
          { id: 'mughal-shamianas', name: 'Maharaja Royal Shamianas', slug: 'maharaja-royal-shamianas' },
        ],
      },
      {
        id: 'canopies',
        name: 'Canopies',
        slug: 'canopies',
        description: 'Suspended Floral Canopies, Draped Pergolas & Entry Pathway Arches',
        image: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Hanging Floral Canopy', 'Velvet Draped Pergola', 'Tunnel Light Canopy', 'Chunri Entrance Canopy'],
      },
      {
        id: 'backdrops',
        name: 'Backdrops',
        slug: 'backdrops',
        description: 'Mirror Sheesh Mahal, Gold Foil Jali & 3D Floral Photo Walls',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Sheesh Mahal Mirror Wall', 'Golden Carved Jali', 'Hydrangea Flower Wall', 'Fairy Light Draped Wall'],
      },
      {
        id: 'jaimala',
        name: 'Jaimala Stages',
        slug: 'jaimala',
        description: 'Rotating Revolving Jaimala Stages, Hydraulic Lotus & Rose Varmalas',
        image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Hydraulic Lotus Stage', 'Revolving Floral Platform', 'Exotic Orchid Varmala', 'Cold Pyro Jaimala Stage'],
      },
      {
        id: 'stage-items',
        name: 'Stage Items',
        slug: 'stage-items',
        description: 'Stage Carpeting, Maharaja Throne Sofas, Brass Urlis & Royal Steps',
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Maharaja Twin Thrones', 'Carved Royal Risers', 'Grand Brass Urlis', 'Illuminated Acrylic Steps'],
      },
    ],
  },
  {
    id: 'furniture',
    name: 'Luxury Furniture & Seating',
    slug: 'furniture',
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
        name: 'All Chairs',
        slug: 'chairs',
        description: 'Bespoke Bentwood Designer Chairs & Commercial Molded Plastic Armchairs',
        image: '/chairs/ornate_black_red_chair.jpg',
        popularItems: ['Ornate Black/Red Armchair', 'Pearl Black/Red Chair', 'Orlando Yellow Chair', 'Seagull Red Chair'],
        subSubcategories: [
          { id: 'ornate-bentwood', name: 'Ornate Bentwood Chairs', slug: 'ornate-bentwood-chairs' },
          { id: 'chiavari-chairs', name: 'Chiavari & Tiffany Chairs', slug: 'chiavari-tiffany-chairs' },
          { id: 'banquet-cushioned', name: 'Banquet Cushioned Chairs', slug: 'banquet-cushioned-chairs' },
        ],
      },
      {
        id: 'designer-chairs',
        name: 'Designer Chairs',
        slug: 'designer-chairs',
        description: 'Bespoke Ornate Bentwood Armchairs, Pearl Black & Red Lounge Seating',
        image: '/chairs/ornate_black_red_chair.jpg',
        popularItems: ['Ornate Black/Red Armchair', 'Pearl Black/Red Chair', 'Ornate Jordan Pattern Chair'],
      },
      {
        id: 'plastic-chairs',
        name: 'Plastic Chairs',
        slug: 'plastic-chairs',
        description: 'Heavy-Duty Molded Plastic Armchairs & Stackable Ceremonial Seating',
        image: '/chairs/orlando_plastic_chair.jpg',
        popularItems: ['Orlando Yellow Armchair', 'Windsor Brown Armchair', 'Seagull Red Chair'],
      },
      {
        id: 'tables',
        name: 'Tables',
        slug: 'tables',
        description: 'Round Banquet Tables, Italian Marble Coffee Tables & Dining Sets',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Round Banquet Tables (60")', 'Italian Marble Coffee Table', 'Long VIP Dining Tables', 'Cocktail High Tables'],
      },
      {
        id: 'sofas',
        name: 'Sofas & Lounges',
        slug: 'sofas',
        description: 'Emerald Tufted Velvet Sofas, Chesterfield Lounges & Sectionals',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Emerald Tufted 3-Seater', 'Cream Velvet Chesterfield', 'Royal Golden Diwan', 'L-Shaped VIP Lounge Sofa'],
      },
      {
        id: 'bar-tables',
        name: 'Bar Tables & Stools',
        slug: 'bar-tables',
        description: 'High-Top Cocktail Bar Tables, LED Illuminated & Gold Chrome Stools',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Champagne Gold High Tables', 'LED Glow Cocktail Tables', 'Velvet Swivel Bar Stools', 'Rustic Wooden Bar Highs'],
      },
      {
        id: 'counters',
        name: 'Counters & Desks',
        slug: 'counters',
        description: 'Reception Desks, Registration Desks & Curved Modular Counters',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Mirrored Reception Counter', 'Gold Laser-Cut Desk', 'Curved Welcome Counter', 'Registration Kiosks'],
      },
    ],
  },
  {
    id: 'catering',
    name: 'Catering & Commercial Equipment',
    slug: 'catering',
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
        name: 'Luxury Crockery & Glassware',
        slug: 'crockery',
        description: 'Bone China Plates, Royal Brass Thali Sets, Crystal Glassware & Cutlery',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Royal Brass Kansa Thali Set', 'Gold-Rimmed Bone China Plates', 'Crystal Wine & Water Goblets', 'Mirror Polish Cutlery Set'],
      },
      {
        id: 'serving-items',
        name: 'Serving Dishes & Chafers',
        slug: 'serving-items',
        description: 'Roll-Top Chafing Dishes, Silver Platters, Beverage Dispensers & Tongs',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Roll-Top Hydraulic Chafing Dish', 'Hammered Copper Serving Bowls', 'Triple Tier Beverage Dispenser', 'Carved Silver Serving Trays'],
      },
      {
        id: 'gas-pipes',
        name: 'Commercial Gas & Piping',
        slug: 'gas-pipes',
        description: 'High-Pressure Reinforced LPG Gas Pipes, Industrial Regulators & Manifolds',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Commercial Steel Braided Gas Pipe', 'High-Flow Multi-Cylinder Manifold', 'Heavy Duty Gas Pressure Regulator', 'Quick-Release Gas Connectors'],
      },
      {
        id: 'catering-equipment',
        name: 'Commercial Cooking Equipment',
        slug: 'catering-equipment',
        description: 'Commercial Bhatti Burners, Tandoor Ovens, Deep Fryers & Hot Boxes',
        image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Stainless Steel Clay Tandoor', 'Triple Burner Commercial Bhatti', 'Electric Insulated Hot Box', 'Heavy Duty Commercial Fryer'],
      },
      {
        id: 'buffet-counters',
        name: 'Live Buffet Stations & Islands',
        slug: 'buffet-counters',
        description: 'Granite-Top Live Food Stations, Chaat Counters & LED Buffet Display Sets',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        popularItems: ['LED Backlit Buffet Counter', 'Granite-Top Live Dosa/Chaat Counter', 'Wooden Rustic Buffet Island', 'Carved Royal Sweet Counter'],
      },
    ],
  },
  {
    id: 'decor',
    name: 'Event Decor & Styling',
    slug: 'decor',
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
        name: 'Artificial & Real-Touch Flowers',
        slug: 'artificial-flowers',
        description: 'High-Density Rose Walls, Hanging Wisteria, Hydrangea Mats & Garlands',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80',
        popularItems: ['3D Real-Touch Rose Wall', 'Cascading White Wisteria Hangings', 'Marigold Toran Garlands', 'Tropical Palm & Orchid Mats'],
      },
      {
        id: 'props',
        name: 'Thematic Props & Urlis',
        slug: 'props',
        description: 'Vintage Birdcages, Antique Brass Urlis, Mirror Frames & Haldi Rickshaws',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Hand-Painted Haldi Rickshaw', 'Antique Brass Floating Urlis', 'Golden Geometric Frames', 'Moroccan Lantern Set'],
      },
      {
        id: 'panels',
        name: 'Jali & Backdrop Panels',
        slug: 'panels',
        description: 'Laser-Cut MDF Jali Panels, Gold Leaf Backdrop Panels & Acrylic Screens',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Carved Mughal Jali Panels', 'Golden Mirror Acrylic Panel', 'Geometric 3D Wall Panel', 'Rustic Distressed Wood Screen'],
      },
      {
        id: 'fabrics',
        name: 'Drapery & Velvet Fabrics',
        slug: 'fabrics',
        description: 'Heavy Velvet Drapes, Shimmer Georgette, Organza Rolls & Silk Curtains',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Royal Crimson Heavy Velvet', 'Ivory Flowing Georgette Fabric', 'Pastel Pink Shimmer Organza', 'Pleated Silk Drapery Rolls'],
      },
      {
        id: 'centerpieces',
        name: 'Table Centerpieces & Candelabras',
        slug: 'centerpieces',
        description: 'Crystal Candelabras, Golden Floral Stands & LED Table Vases',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
        popularItems: ['5-Arm Crystal Candelabra', 'Tall Gold Geometric Flower Tower', 'Warm Mercury Glass Votives', 'Floating Blossom Glass Bowl'],
      },
      {
        id: 'lighting',
        name: 'Architectural & Mood Lighting',
        slug: 'lighting',
        description: 'Warm Edison Fairy Bulbs, LED Sharpie Moving Heads & RGB Focus Halogens',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Vintage Edison Bulb Strings', 'LED 36-Beam Moving Head', 'Warm Ambient Up-Lighting Cans', 'Crystal Chandelier Hanging Array'],
      },
    ],
  },
  {
    id: 'event-essentials',
    name: 'Event Essentials & Infrastructure',
    slug: 'event-essentials',
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
        name: 'Mist Coolers & Portable ACs',
        slug: 'coolers',
        description: 'High-Capacity Industrial Mist Coolers & Commercial Ducting AC Units',
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Commercial Mist Jet Cooler (100L)', 'Heavy Ducting Portable AC (5 Ton)', 'Centrifugal Outdoor Air Cooler', 'Silent Water Evaporative Cooler'],
      },
      {
        id: 'fans',
        name: 'High-Velocity Fans',
        slug: 'fans',
        description: '3-Speed Pedestal Misting Fans, Giant Industrial Floor Fans & Wall Mounts',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
        popularItems: ['26" Heavy-Duty Pedestal Misting Fan', 'High-Velocity Floor Drum Fan', 'Industrial Wall Mounted Fan', 'Oscillating Tent Pole Fans'],
      },
      {
        id: 'carpets',
        name: 'VIP Carpets & Aisle Runners',
        slug: 'carpets',
        description: 'Royal Red VIP Runners, Royal Blue Hall Carpeting & Plush White Aisle Runners',
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
        popularItems: ['MCCL 9811 BLACK GOLD', 'MCCL Sage Green Octagon', 'MCCL White Terrazzo Diamond', 'MCCL White Petal Marble'],
      },
      {
        id: 'mats',
        name: 'Floor Mats & Rubber Runners',
        slug: 'mats',
        description: 'MCCL Luxury Event Floor Mats, Anti-Skid Rubber Backed Mats & Ceremonial Runners',
        image: '/Mats/MCCL_9641_BLACK_GOLD.jpg',
        popularItems: ['MCCL 9641 Black & Gold', 'MCCL 9631 Green & Gold', 'MCCL 9609 Blue & Beige', 'MCCL 9619 Maroon'],
      },
      {
        id: 'electrical-items',
        name: 'Electrical Distribution Panels',
        slug: 'electrical-items',
        description: 'Main Distribution Panels (DBs), Heavy Rubber Cables, DB Boxes & Extension Hubs',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['63A 3-Phase Weatherproof DB Box', 'Heavy Armored Power Cable (100m)', 'Rubberized Industrial Cable Protectors', 'High-Load Spike Extension Boards'],
      },
      {
        id: 'miscellaneous-equipment',
        name: 'Crowd Control & Rigging',
        slug: 'miscellaneous-equipment',
        description: 'Barricades, Stanchions with Velvet Ropes, Sound Rigging & Ladder Scaffolding',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Gold Stanchions with Red Velvet Ropes', 'Crowd Control Steel Barricades', 'Aluminum Scaffolding Tower', 'Heavy Ground Anchoring Stakes'],
      },
    ],
  },
  {
    id: 'custom-manufacturing',
    name: 'Custom Manufacturing & Fabrication',
    slug: 'custom-manufacturing',
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
        name: 'Custom Aluminum Tents',
        slug: 'custom-tents',
        description: 'Tailored Heavy-Span Aluminum Tents, Transparent Glass Pavilions & Custom Shapes',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Custom Curvature Clear-Span Tent', 'Heavy Weatherproof Dome Pavilion', 'Double-Decker VIP Hospitality Tent', 'Branded Corporate Expo Structure'],
      },
      {
        id: 'custom-counters',
        name: 'Bespoke Registration & Bar Counters',
        slug: 'custom-counters',
        description: 'Bespoke Logo Backlit Reception Counters, Bar Islands & Interactive Registration Kiosks',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        popularItems: ['3D Acrylic Backlit Brand Counter', 'Curved Brass-Inlaid Bar Counter', 'Hydraulic Mobile DJ Booth', 'Touchscreen Integrated Kiosk Counter'],
      },
      {
        id: 'custom-furniture',
        name: 'Custom Heritage Furniture',
        slug: 'custom-furniture',
        description: 'Hand-Carved Heritage Teak Thrones, Custom Banquet Benches & Unique Booths',
        image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=80',
        popularItems: ['Custom Engraved Teakwood Swing', 'Bespoke Velvet Curved Banquettes', 'Gold-Leaf Embossed Maharaja Chairs', 'Geometric Marble Dining Sets'],
      },
      {
        id: 'custom-decor',
        name: 'Custom 3D Sculptures & Decor',
        slug: 'custom-decor',
        description: 'Bespoke 3D Sculptures, Mythological Statues, Giant Flower Arcs & Kinetic Displays',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        popularItems: ['12-Foot Fiberglass Peacock Sculpture', 'Custom Acrylic LED Chandelier Array', 'Kinetic Floral Ceiling Rig', 'Gold-Coated Mythological Temple Facade'],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// FILTER DEFINITIONS
// ─────────────────────────────────────────────────────────
const FILTERS_DATA = [
  {
    name: 'Design Style',
    label: 'Style & Theme',
    key: 'style',
    type: 'select',
    sortOrder: 1,
    applicableCategories: ['all'],
    values: [
      { value: 'Traditional', label: 'Traditional Heritage', sortOrder: 1 },
      { value: 'Royal', label: 'Royal Maharaja', sortOrder: 2 },
      { value: 'Modern', label: 'Contemporary Modern', sortOrder: 3 },
      { value: 'Boho', label: 'Bohemian Rustic', sortOrder: 4 },
      { value: 'Industrial', label: 'Commercial Industrial', sortOrder: 5 },
      { value: 'Bespoke', label: 'Bespoke Custom', sortOrder: 6 },
    ],
  },
  {
    name: 'Color Palette',
    label: 'Primary Color',
    key: 'color',
    type: 'multi-select',
    sortOrder: 2,
    applicableCategories: ['all'],
    values: [
      { value: 'Gold', label: 'Imperial Gold', sortOrder: 1 },
      { value: 'Red', label: 'Royal Crimson Red', sortOrder: 2 },
      { value: 'White', label: 'Pristine White / Ivory', sortOrder: 3 },
      { value: 'Emerald', label: 'Emerald Green', sortOrder: 4 },
      { value: 'Maroon', label: 'Deep Maroon', sortOrder: 5 },
      { value: 'Blue', label: 'Royal Sapphire Blue', sortOrder: 6 },
      { value: 'Yellow', label: 'Haldi Marigold Yellow', sortOrder: 7 },
      { value: 'Black', label: 'Pearl Black', sortOrder: 8 },
    ],
  },
  {
    name: 'Material',
    label: 'Primary Material',
    key: 'material',
    type: 'multi-select',
    sortOrder: 3,
    applicableCategories: ['wedding', 'furniture', 'decor', 'catering'],
    values: [
      { value: 'Teakwood', label: 'Seasoned Teakwood', sortOrder: 1 },
      { value: 'Velvet', label: 'Heavy Italian Velvet', sortOrder: 2 },
      { value: 'Brass', label: 'Pure Brass / Kansa', sortOrder: 3 },
      { value: 'Silk', label: 'Pleated Raw Silk', sortOrder: 4 },
      { value: 'Steel', label: 'Food-Grade Stainless Steel', sortOrder: 5 },
      { value: 'Plastic', label: 'High-Density Virgin Plastic', sortOrder: 6 },
      { value: 'Glass', label: 'Toughened Mirror Glass', sortOrder: 7 },
      { value: 'Marble', label: 'Italian Polished Marble', sortOrder: 8 },
    ],
  },
  {
    name: 'Budget Tier',
    label: 'Price Range',
    key: 'price_range',
    type: 'select',
    sortOrder: 4,
    applicableCategories: ['all'],
    values: [
      { value: 'under-25k', label: 'Economy (Under ₹25,000)', sortOrder: 1 },
      { value: '25k-50k', label: 'Mid-Range (₹25,000 – ₹50,000)', sortOrder: 2 },
      { value: '50k-100k', label: 'Premium (₹50,000 – ₹1,00,000)', sortOrder: 3 },
      { value: 'above-100k', label: 'Luxury (Above ₹1,00,000)', sortOrder: 4 },
    ],
  },
];

// ─────────────────────────────────────────────────────────
// BADGES DEFINITIONS
// ─────────────────────────────────────────────────────────
const BADGES_DATA = [
  { name: 'Bestseller', slug: 'bestseller', label: 'Bestseller', color: '#f59e0b', bgColor: '#451a03', icon: '⭐', sortOrder: 1 },
  { name: 'Royal Collection', slug: 'royal-collection', label: 'Royal Collection', color: '#e879f9', bgColor: '#4a044e', icon: '👑', sortOrder: 2 },
  { name: 'Heritage Collection', slug: 'heritage-collection', label: 'Heritage Collection', color: '#fb7185', bgColor: '#4c0519', icon: '🏛️', sortOrder: 3 },
  { name: 'Grand Entry', slug: 'grand-entry', label: 'Grand Entry', color: '#38bdf8', bgColor: '#082f49', icon: '✨', sortOrder: 4 },
  { name: 'New Arrival', slug: 'new-arrival', label: 'New Arrival', color: '#34d399', bgColor: '#064e3b', icon: '🆕', sortOrder: 5 },
  { name: 'Designer Choice', slug: 'designer-choice', label: 'Designer Choice', color: '#a78bfa', bgColor: '#2e1065', icon: '💎', sortOrder: 6 },
  { name: 'Factory Direct', slug: 'factory-direct', label: 'Factory Direct', color: '#f43f5e', bgColor: '#4c0519', icon: '🏭', sortOrder: 7 },
  { name: 'Original Masterpiece', slug: 'original-masterpiece', label: 'Original Masterpiece', color: '#fbbf24', bgColor: '#451a03', icon: '🏆', sortOrder: 8 },
];

// ─────────────────────────────────────────────────────────
// CMS PAGES DEFINITIONS
// ─────────────────────────────────────────────────────────
const PAGES_DATA = [
  {
    title: 'About Shiv Shakti Events Mart',
    slug: 'about-us',
    status: 'PUBLISHED',
    heroImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80',
    seoTitle: 'About Us | Shiv Shakti Events Mart Luxury Wedding Infrastructure',
    seoDescription: 'Leading suppliers and manufacturers of luxury Indian wedding mandaps, German hangar structures, banquet furniture, and turnkey decor.',
    content: `# Heritage & Craftsmanship Since 1998

Welcome to **Shiv Shakti Events Mart**, India's premier infrastructure and staging powerhouse for luxury weddings, corporate summits, and grand ceremonial exhibitions.

## Our Philosophy
Every wedding is a sacred milestone. We merge artisanal craftsmanship with heavy-duty structural engineering to deliver royal wedding mandaps, waterproof German hangars, crystal dome staging, and bespoke banquet seating.

### Core Capabilities:
- **In-House CNC Fabrication:** Custom aluminium pavilions, laser-cut jali walls, and bespoke curved counters.
- **Turnkey Logistics:** Direct fleet delivery across North India with zero staging lag.
- **Hospitality Grade Equipment:** Commercial bhatti stoves, hydraulic roll-top chafers, and food-grade brass dinnerware.

Contact our concierge desk for bespoke fabrication consultations.`,
  },
  {
    title: 'Custom Manufacturing & Fabrication Services',
    slug: 'custom-manufacturing',
    status: 'PUBLISHED',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    seoTitle: 'Bespoke Event Fabrication & CNC Manufacturing | Shiv Shakti',
    seoDescription: 'Direct factory manufacturing for clear-span aluminium tents, branded welcome counters, hand-carved teakwood thrones, and hydraulic stages.',
    content: `# Direct Factory Manufacturing & Custom Engineering

Shiv Shakti operates state-of-the-art fabrication facilities dedicated to event industry professionals, hoteliers, and premium event designers.

## What We Build
1. **Clear-Span Aluminium Hangars:** Certified wind-resistant structures spanning 10m to 50m with transparent PVC fabric roofs.
2. **Hydraulic & Revolving Stages:** Motorized lotus mechanisms, rotating jaimala stages, and heavy ground elevators.
3. **Architectural Jali & Prop Walls:** Laser-cut acrylic, MDF, and gold-leaf embossed backdrops.
4. **Heritage Banquet Woodwork:** Seasoned CP teakwood carvings, velvet Chesterfield lounges, and VIP diwans.

Request a factory quote or send blueprint CAD files directly to our engineering team.`,
  },
  {
    title: 'Services & Turnkey Staging',
    slug: 'services',
    status: 'PUBLISHED',
    heroImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80',
    seoTitle: 'Turnkey Event Infrastructure Services | Shiv Shakti Events Mart',
    seoDescription: 'End-to-end wedding infrastructure rental, staging deployment, climate control, power logistics, and custom decor installations.',
    content: `# Comprehensive Event Infrastructure Services

We provide complete logistics and staging infrastructure for events of all scales:

- **Wedding Ceremonies:** Mandaps, Jaimala stages, floral canopies, sheesh mahal backdrops.
- **Corporate Summits & Expos:** Pagoda tents, registration counters, sound rigging, LED buffet islands.
- **Climate Control & Ground Logistics:** 100L mist cooling jets, 5-ton portable ducting ACs, heavy distribution panels, and VIP red carpets.

All equipment undergoes rigorous pre-dispatch safety and hygiene inspections.`,
  },
  {
    title: 'Terms of Service & Booking Policy',
    slug: 'terms',
    status: 'PUBLISHED',
    heroImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    seoTitle: 'Terms of Service | Shiv Shakti Events Mart',
    seoDescription: 'Standard terms of service, equipment rental policies, payment milestones, and security guidelines.',
    content: `# Terms & Conditions of Rental & Supply

### 1. Booking & Reservation
Equipment slots and bespoke manufacturing timelines are confirmed upon receipt of advance deposit and signed proposal.

### 2. Delivery & Installation
Our staging crew manages on-site unloading and erection. The client must ensure site readiness, power hookups, and ground clearances.

### 3. Damage & Return
Rented items must be returned in good condition. Reasonable wear is accepted; structural damages will be assessed at factory replacement cost.`,
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    status: 'PUBLISHED',
    heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    seoTitle: 'Privacy Policy | Shiv Shakti Events Mart',
    seoDescription: 'Privacy policy and data protection commitments for Shiv Shakti Events Mart customers and quote requesters.',
    content: `# Privacy Policy

Shiv Shakti Events Mart respects your personal and business privacy.

- **Information Collected:** Contact names, phone numbers, delivery venue addresses, and custom design preferences.
- **Data Usage:** Strictly used for proposal generation, order processing, and concierge delivery tracking.
- **Confidentiality:** We do not sell or lease your event details or blueprints to third-party marketing entities.`,
  },
];

// ─────────────────────────────────────────────────────────
// MAIN SEED & BACKFILL ROUTINE
// ─────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting Comprehensive CMS Data Seed & Migration Backfill...');

  // 1. SEED CATEGORIES (3-TIER HIERARCHY)
  console.log('\n📁 1. Seeding Category Hierarchy (Tier 1, 2, 3)...');
  let categoryCount = 0;
  let subcategoryCount = 0;
  let subSubcategoryCount = 0;

  for (let i = 0; i < CATEGORIES_DATA.length; i++) {
    const catData = CATEGORIES_DATA[i];

    // Level 1: Category
    const category = await prisma.category.upsert({
      where: { id: catData.id },
      update: {
        name: catData.name,
        slug: catData.slug,
        shortTitle: catData.shortTitle,
        tagline: catData.tagline,
        icon: catData.icon,
        badge: catData.badge,
        promo: catData.promo,
        level: 1,
        sortOrder: i + 1,
        isActive: true,
      },
      create: {
        id: catData.id,
        name: catData.name,
        slug: catData.slug,
        shortTitle: catData.shortTitle,
        tagline: catData.tagline,
        icon: catData.icon,
        badge: catData.badge,
        promo: catData.promo,
        level: 1,
        sortOrder: i + 1,
        isActive: true,
      },
    });
    categoryCount++;

    // Level 2: Subcategories
    for (let j = 0; j < catData.subsections.length; j++) {
      const subData = catData.subsections[j];
      const subcategory = await prisma.category.upsert({
        where: { id: subData.id },
        update: {
          name: subData.name,
          slug: `${catData.slug}-${subData.slug}`,
          description: subData.description,
          image: subData.image,
          popularItems: subData.popularItems || [],
          parentId: category.id,
          level: 2,
          sortOrder: j + 1,
          isActive: true,
        },
        create: {
          id: subData.id,
          name: subData.name,
          slug: `${catData.slug}-${subData.slug}`,
          description: subData.description,
          image: subData.image,
          popularItems: subData.popularItems || [],
          parentId: category.id,
          level: 2,
          sortOrder: j + 1,
          isActive: true,
        },
      });
      subcategoryCount++;

      // Level 3: Sub-subcategories (if defined)
      if (subData.subSubcategories && subData.subSubcategories.length > 0) {
        for (let k = 0; k < subData.subSubcategories.length; k++) {
          const subSubData = subData.subSubcategories[k];
          await prisma.category.upsert({
            where: { id: subSubData.id },
            update: {
              name: subSubData.name,
              slug: `${subData.slug}-${subSubData.slug}`,
              parentId: subcategory.id,
              level: 3,
              sortOrder: k + 1,
              isActive: true,
            },
            create: {
              id: subSubData.id,
              name: subSubData.name,
              slug: `${subData.slug}-${subSubData.slug}`,
              parentId: subcategory.id,
              level: 3,
              sortOrder: k + 1,
              isActive: true,
            },
          });
          subSubcategoryCount++;
        }
      }
    }
  }
  console.log(`✅ Seeded ${categoryCount} Categories (L1), ${subcategoryCount} Subcategories (L2), ${subSubcategoryCount} Sub-subcategories (L3).`);

  // 2. SEED FILTERS & FILTER VALUES
  console.log('\n🎛️ 2. Seeding Dynamic Attribute Filters & Values...');
  const createdFilterMap = new Map<string, any>();
  const createdValueMap = new Map<string, string>(); // value -> valueId

  for (const f of FILTERS_DATA) {
    const filter = await prisma.filter.upsert({
      where: { key: f.key },
      update: {
        name: f.name,
        label: f.label,
        type: f.type,
        sortOrder: f.sortOrder,
        applicableCategories: f.applicableCategories,
        isActive: true,
      },
      create: {
        name: f.name,
        label: f.label,
        key: f.key,
        type: f.type,
        sortOrder: f.sortOrder,
        applicableCategories: f.applicableCategories,
        isActive: true,
      },
    });
    createdFilterMap.set(f.key, filter);

    for (const v of f.values) {
      const val = await prisma.filterValue.upsert({
        where: {
          filterId_value: {
            filterId: filter.id,
            value: v.value,
          },
        },
        update: {
          label: v.label,
          sortOrder: v.sortOrder,
        },
        create: {
          filterId: filter.id,
          value: v.value,
          label: v.label,
          sortOrder: v.sortOrder,
        },
      });
      createdValueMap.set(`${f.key}:${v.value.toLowerCase()}`, val.id);
    }
  }
  console.log(`✅ Seeded ${FILTERS_DATA.length} dynamic filters and ${createdValueMap.size} filter values.`);

  // 3. SEED BADGES
  console.log('\n🏷️ 3. Seeding Badges...');
  const createdBadgeMap = new Map<string, string>(); // slug -> badgeId
  for (const b of BADGES_DATA) {
    const badge = await prisma.badge.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        label: b.label,
        color: b.color,
        bgColor: b.bgColor,
        icon: b.icon,
        sortOrder: b.sortOrder,
        isActive: true,
      },
      create: {
        name: b.name,
        slug: b.slug,
        label: b.label,
        color: b.color,
        bgColor: b.bgColor,
        icon: b.icon,
        sortOrder: b.sortOrder,
        isActive: true,
      },
    });
    createdBadgeMap.set(b.slug, badge.id);
    createdBadgeMap.set(b.name.toLowerCase(), badge.id);
  }
  console.log(`✅ Seeded ${BADGES_DATA.length} badges.`);

  // 4. SEED CMS PAGES
  console.log('\n📄 4. Seeding Dynamic CMS Pages...');
  for (const p of PAGES_DATA) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        status: p.status,
        content: p.content,
        heroImage: p.heroImage,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: p.status === 'PUBLISHED' ? new Date() : null,
      },
      create: {
        title: p.title,
        slug: p.slug,
        status: p.status,
        content: p.content,
        heroImage: p.heroImage,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        publishedAt: p.status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }
  console.log(`✅ Seeded ${PAGES_DATA.length} CMS Pages.`);

  // 5. BACKFILL 991 EXISTING PRODUCTS
  console.log('\n📦 5. Backfilling Existing Products (SKU, Slug, Images, Lifecycle, Facets)...');
  const allProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });
  console.log(`Found ${allProducts.length} products to backfill.`);

  const usedSlugs = new Set<string>();
  let backfilledCount = 0;
  let imageCount = 0;
  let filterLinkCount = 0;
  let badgeLinkCount = 0;

  // Category SKU prefixes
  const catPrefixMap: Record<string, string> = {
    wedding: 'WED',
    furniture: 'FURN',
    catering: 'CAT',
    decor: 'DEC',
    'event-essentials': 'ESS',
    'custom-manufacturing': 'MFG',
  };

  const catCounters: Record<string, number> = {
    wedding: 0,
    furniture: 0,
    catering: 0,
    decor: 0,
    'event-essentials': 0,
    'custom-manufacturing': 0,
    other: 0,
  };

  for (let idx = 0; idx < allProducts.length; idx++) {
    const p = allProducts[idx];
    const catKey = p.categoryId || 'other';
    catCounters[catKey] = (catCounters[catKey] || 0) + 1;
    const catPrefix = catPrefixMap[catKey] || 'SKU';
    const skuCode = p.sku || `SKU-${catPrefix}-${String(catCounters[catKey]).padStart(4, '0')}`;

    // Unique slug generation
    let baseSlug = slugify(p.name);
    if (!baseSlug) baseSlug = `product-${p.id.slice(0, 8)}`;
    let finalSlug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(finalSlug);

    // Calculate realistic compare price
    const compareAtPrice = p.compareAtPrice || Math.round(p.price * 1.25);

    // Update Product with SKU, Slug, Status, PublishedAt
    await prisma.product.update({
      where: { id: p.id },
      data: {
        sku: skuCode,
        slug: p.slug || finalSlug,
        status: p.status || 'PUBLISHED',
        compareAtPrice,
        publishedAt: p.publishedAt || p.createdAt || new Date(),
        seoTitle: `${p.name} | Shiv Shakti Events Mart`,
        seoDescription: p.description?.slice(0, 160) || `${p.name} luxury staging supply.`,
        seoKeywords: `${p.name}, ${p.style}, ${p.categoryId}, wedding staging, event supplies`,
      },
    });
    backfilledCount++;

    // Create Primary ProductImage if not already existing
    const existingImages = await prisma.productImage.count({ where: { productId: p.id } });
    if (existingImages === 0 && p.image) {
      await prisma.productImage.create({
        data: {
          productId: p.id,
          url: p.image,
          altText: p.name,
          isPrimary: true,
          type: 'primary',
          sortOrder: 0,
        },
      });
      imageCount++;
    }

    // Auto-assign Style filter
    if (p.style) {
      const valId = createdValueMap.get(`style:${p.style.toLowerCase()}`);
      if (valId) {
        await prisma.productFilterValue.upsert({
          where: {
            productId_filterValueId: {
              productId: p.id,
              filterValueId: valId,
            },
          },
          update: {},
          create: {
            productId: p.id,
            filterValueId: valId,
          },
        });
        filterLinkCount++;
      }
    }

    // Auto-assign Price Range filter
    let priceTier = 'under-25k';
    if (p.price >= 100000) priceTier = 'above-100k';
    else if (p.price >= 50000) priceTier = '50k-100k';
    else if (p.price >= 25000) priceTier = '25k-50k';

    const priceValId = createdValueMap.get(`price_range:${priceTier}`);
    if (priceValId) {
      await prisma.productFilterValue.upsert({
        where: {
          productId_filterValueId: {
            productId: p.id,
            filterValueId: priceValId,
          },
        },
        update: {},
        create: {
          productId: p.id,
          filterValueId: priceValId,
        },
      });
      filterLinkCount++;
    }

    // Auto-assign Badges if product has tags or isFeatured
    if (p.isFeatured) {
      const badgeId = createdBadgeMap.get('royal-collection') || createdBadgeMap.get('bestseller');
      if (badgeId) {
        await prisma.productBadge.upsert({
          where: { productId_badgeId: { productId: p.id, badgeId } },
          update: {},
          create: { productId: p.id, badgeId },
        });
        badgeLinkCount++;
      }
    }

    if (p.tag) {
      const tagLower = p.tag.toLowerCase();
      let matchedBadgeId = null;
      if (tagLower.includes('masterpiece')) matchedBadgeId = createdBadgeMap.get('original-masterpiece');
      else if (tagLower.includes('bestseller')) matchedBadgeId = createdBadgeMap.get('bestseller');
      else if (tagLower.includes('heritage')) matchedBadgeId = createdBadgeMap.get('heritage-collection');
      else if (tagLower.includes('grand')) matchedBadgeId = createdBadgeMap.get('grand-entry');
      else if (tagLower.includes('designer')) matchedBadgeId = createdBadgeMap.get('designer-choice');
      else matchedBadgeId = createdBadgeMap.get('popular');

      if (matchedBadgeId) {
        await prisma.productBadge.upsert({
          where: { productId_badgeId: { productId: p.id, badgeId: matchedBadgeId } },
          update: {},
          create: { productId: p.id, badgeId: matchedBadgeId },
        });
        badgeLinkCount++;
      }
    }
  }

  console.log(`✅ Backfilled ${backfilledCount} products with SKUs, Slugs, Statuses, ${imageCount} primary images, ${filterLinkCount} filter links, ${badgeLinkCount} badge links.`);

  // 6. VERIFY ADMIN USER
  console.log('\n👑 6. Verifying Admin User...');
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });
  if (adminUser) {
    console.log(`✅ Active Admin User: ${adminUser.email} (${adminUser.name})`);
  } else {
    const firstUser = await prisma.user.findFirst();
    if (firstUser) {
      await prisma.user.update({
        where: { id: firstUser.id },
        data: { role: 'ADMIN' },
      });
      console.log(`✅ Elevated ${firstUser.email} to ADMIN role.`);
    }
  }

  console.log('\n🎉 ALL CMS DATA & BACKFILL SEEDING COMPLETED SUCCESSFULLY!\n');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('❌ Seeding failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
