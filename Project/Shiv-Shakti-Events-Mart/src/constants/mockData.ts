// ========================================================
// CATALOG & CONTENT DATA CONSTANTS
// All product catalog data is managed dynamically via PostgreSQL
// and the Admin Dashboard. Local mock datasets are deprecated.
// ========================================================

export interface ProductItem {
  id: string;
  name: string;
  categoryId: string; // 'wedding' | 'furniture' | 'catering' | 'decor' | 'event-essentials' | 'custom-manufacturing'
  subcategoryId: string; // 'mandaps' | 'tents' | 'chairs' | etc.
  subSubcategoryId?: string;
  category?: string; // legacy support
  style: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  tag?: string;
}

// Dynamic catalog: items are fetched from backend API via useProducts()
export const CATALOG_PRODUCTS: ProductItem[] = [];

// Backward compatibility empty arrays
export const DECOR_THEMES: ProductItem[] = [];
export const FURNITURE_ITEMS: ProductItem[] = [];

export const INFLUENCER_REELS = [
  {
    name: 'Shwetambari Shetty',
    quote: '"My Shiv Shakti Events Mart wedding was straight out of an ancient royal fable. Impeccable attention to floral symmetry!"',
    role: 'Wellness Entrepreneur & Bride',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    views: '1.2M'
  },
  {
    name: 'Vineeta Singh',
    quote: '"The custom teakwood swing and emerald sofas added an unbeatable premium touch to our home decor transition."',
    role: 'CEO & Luxury Lifestyle Critic',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    views: '840K'
  },
  {
    name: 'Mallika Dua',
    quote: '"Who says traditional drapes can\'t look modern? Shiv Shakti Events Mart cracked the exact contemporary Indian aesthetic!"',
    role: 'Actor & Content Creator',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    views: '2.1M'
  },
  {
    name: 'Maheep Kapoor',
    quote: '"Absolutely love their home styling. The brass work is pristine, and the craftsmanship details are pure luxury."',
    role: 'Interior Designer & Stylist',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    views: '1.5M'
  }
];

export const CUSTOMIZER_BACKDROPS = [
  { id: 'palace', name: 'Palace Courtyard', image: 'https://images.unsplash.com/photo-1585121517533-030f22496a75?auto=format&fit=crop&w=600&q=80' },
  { id: 'beach', name: 'Beachfront Sunset', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { id: 'banquet', name: 'Grand Ballroom', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80' },
  { id: 'lawn', name: 'Lush Garden Lawn', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80' }
];

export const CUSTOMIZER_THEMES = [
  { id: 'royal-marigold', name: 'Heritage Golden Marigold', cost: 10000, color: 'from-amber-400 to-amber-600' },
  { id: 'pastel-orchid', name: 'Pastel Orchid Bliss', cost: 25000, color: 'from-pink-300 to-purple-400' },
  { id: 'crimson-velvet', name: 'Crimson Velvet & Brass', cost: 35000, color: 'from-rose-800 to-red-950' },
  { id: 'boho-pampas', name: 'Minimalist Boho Pampas', cost: 15000, color: 'from-stone-300 to-amber-200' }
];

export const CUSTOMIZER_SEATINGS = [
  { id: 'swing', name: 'Teakwood Royal Swing', cost: 12000, img: '🛋️' },
  { id: 'maharaja', name: 'Maharaja Velvet Sofa', cost: 20000, img: '👑' },
  { id: 'french-love', name: 'Pastel French Loveseat', cost: 16000, img: '🌺' },
  { id: 'boho-cushion', name: 'Low Boho Cushions', cost: 6000, img: '🧘' }
];

export const DESIGN_STYLES = [
  { title: 'Royal Heritage', subtitle: 'Gold foil arches, heavy rose work', bg: 'bg-amber-100 border-amber-200 text-amber-950' },
  { title: 'Modern Minimal', subtitle: 'Clean pastel contours, floating lights', bg: 'bg-emerald-50 border-emerald-100 text-emerald-950' },
  { title: 'Bohemian Dream', subtitle: 'Macrame hangings, rich pampas grass', bg: 'bg-stone-200/60 border-stone-300 text-stone-850' },
  { title: 'Victorian Charm', subtitle: 'Deep button tufts, rich high valances', bg: 'bg-rose-50 border-rose-100 text-rose-950' },
  { title: 'Rustic Woodland', subtitle: 'Birch arches, heavy vines, warm bulbs', bg: 'bg-amber-50 border-amber-150 text-amber-900' },
  { title: 'Vibrant Fusion', subtitle: 'Marigold cascades, Rajasthani colors', bg: 'bg-purple-50 border-purple-100 text-purple-950' }
];

export const FAQ_ITEMS = [
  {
    q: 'How long do the wedding flowers remain fresh after booking installation?',
    a: 'We source fresh marigolds, roses, and orchids directly from verified high-altitude nurseries. They are misted with micro-nutrients immediately post-scaffolding and are guaranteed to retain absolute velvet sheen for up to 36 hours from installation.'
  },
  {
    q: 'Can I choose custom fabric colors or heights not listed in the visualizer?',
    a: 'Absolutely! Our Customizer Studio shows only popular curated choices. Our full production unit carries over 140 fabric colors in organza, georgette, and thick velvet, and frames can be scaled dynamically from 8 feet to 16 feet depending on venue roof clearances.'
  },
  {
    q: 'Is the solid furniture catalog assembled on delivery or flatpacked?',
    a: 'Our premium teakwood swings and tufted emerald sofas are delivered fully assembled in highly cushioned luxury trucks. Our specialized master carpenters perform the final site anchoring to ensure structural safety.'
  },
  {
    q: 'What is your booking slot advance cancellation and refund policy?',
    a: 'For event bookings, we offer a 100% refund or slot change up to 14 days prior to your occasion. For custom teakwood furniture, because each piece is individually carved by master artisans, changes are accepted only within 48 hours of order confirmation.'
  }
];

export const WIZARD_SCALES = [
  { id: 'intimate', name: 'Intimate / Elegant', desc: 'Perfect for smaller homes, cozy backyards, or intimate ceremonies (<100 guests).' },
  { id: 'premium', name: 'Premium Craft', desc: 'Our gold standard: gorgeous structures, detailed florals, and signature designer drapes.' },
  { id: 'royal', name: 'Royal Heritage', desc: 'Grand scale luxury installations, magnificent fort decors, imported floral towers, luxury lounges.' }
];

export const WIZARD_VENUES = [
  { id: 'banquet', name: 'Banquet Hall / Indoor', icon: '🏛️' },
  { id: 'garden', name: 'Lush Outdoor Garden', icon: '🌳' },
  { id: 'beach', name: 'Coastal / Beachfront', icon: '🏖️' },
  { id: 'fort', name: 'Heritage Palace / Fort', icon: '🏰' },
  { id: 'residence', name: 'Private Luxury Residence', icon: '🏡' }
];

export const WIZARD_DRAPES = [
  { id: 'standard', name: 'Standard Georgette drapes & Local Floristry', desc: 'Classic setup incorporating local seasonal flowers.' },
  { id: 'heavy', name: 'Premium Velvet/Organza & Exotic Blooms', desc: 'Thick layered fabric folds, orchids, lilies, customized structures.' },
  { id: 'glass', name: 'Custom Glass, Crystals & Warm Edison Lamps', desc: 'Highly architectural, reflecting sparkles, fairy glass globes.' }
];
