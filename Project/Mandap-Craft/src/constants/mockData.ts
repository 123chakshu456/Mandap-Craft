// ==========================================
// MOCK DATA - All product and content data
// ==========================================

export interface ProductItem {
  id: string;
  name: string;
  categoryId: string; // 'wedding' | 'furniture' | 'catering' | 'decor' | 'event-essentials' | 'custom-manufacturing'
  subcategoryId: string; // 'mandaps' | 'tents' | 'chairs' | etc.
  category?: string; // legacy support
  style: 'Traditional' | 'Modern' | 'Royal' | 'Boho' | 'Industrial' | 'Bespoke';
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  tag?: string;
}

export const CATALOG_PRODUCTS: ProductItem[] = [
  // ==========================================
  // WEDDING
  // ==========================================
  {
    id: 'marigold-mandap',
    name: 'Royal Marigold Canopy Mandap',
    categoryId: 'wedding',
    subcategoryId: 'mandaps',
    category: 'mandap',
    style: 'Traditional',
    price: 125000,
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1595183818343-dac68e26830c?auto=format&fit=crop&w=800&q=80',
    description: 'A traditional masterpiece adorned with thousands of fresh orange & yellow marigolds, premium heavy drapes, and antique brass bells hanging symmetrically.',
    features: ['Fresh local flowers', 'Antique brass pillars', 'Traditional low seating', 'Includes Havankund setup'],
    isFeatured: true,
    tag: 'Bestseller'
  },
  {
    id: 'orchid-mandap',
    name: 'Pastel Orchid Symphony Dome Mandap',
    categoryId: 'wedding',
    subcategoryId: 'mandaps',
    category: 'mandap',
    style: 'Modern',
    price: 180000,
    rating: 4.8,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    description: 'Modern suspended floral dome composed of imported white and pink orchids, delicate baby\'s breath, crystal string drops, and sheer ivory georgette drapes.',
    features: ['Premium imported orchids', 'Floating floral dome', 'Warm LED spotlighting', 'Luxury tufted cream chairs'],
    isFeatured: true,
  },
  {
    id: 'boho-mandap',
    name: 'Bohemian Sunset Beach Mandap',
    categoryId: 'wedding',
    subcategoryId: 'mandaps',
    category: 'mandap',
    style: 'Boho',
    price: 95000,
    rating: 4.7,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80',
    description: 'An organic wooden structure set up with soft pampas grass, cream macrame details, woven rugs, warm wicker lanterns, and lightweight peach linen fabrics.',
    features: ['Eco-friendly wooden frame', 'Pampas and neutral floristry', 'Rustic cross-back chairs', 'Intimate candle decorations']
  },
  {
    id: 'german-hangar-tent',
    name: 'German Hangar All-Weather Tent (50x100ft)',
    categoryId: 'wedding',
    subcategoryId: 'tents',
    style: 'Modern',
    price: 320000,
    rating: 4.9,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    description: 'High-grade German aluminum alloy clear-span structure tent with fire-retardant and waterproof PVC roofing. Includes false ceiling drapes and central AC ducting mounts.',
    features: ['Heavy-gauge aluminum frame', '100% waterproof & flame-resistant', 'Supports internal AC cooling', 'Includes luxury ceiling drapes']
  },
  {
    id: 'pagoda-canopy-tent',
    name: 'Royal Pagoda High-Peak Tent Set',
    categoryId: 'wedding',
    subcategoryId: 'tents',
    style: 'Royal',
    price: 85000,
    rating: 4.8,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    description: 'Distinctive high-peak cone pagoda tents ideal for VIP guest lounges, outdoor food stations, and cocktail gazebos.',
    features: ['High-peak architectural profile', 'Self-supporting steel frame', 'Scalloped valance styling', 'Side curtains with church windows']
  },
  {
    id: 'floral-tunnel-canopy',
    name: 'Cascading Wisteria Entrance Canopy',
    categoryId: 'wedding',
    subcategoryId: 'canopies',
    style: 'Modern',
    price: 110000,
    rating: 4.9,
    reviews: 74,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: '60-foot grand bridal walkway canopy adorned with thousands of hanging white wisteria, crystal drops, and warm fairy light curtains.',
    features: ['Modular arch framework', 'Dense artificial wisteria', 'Warm fairy light matrix', 'Red velvet carpet included']
  },
  {
    id: 'sheesh-mahal-stage',
    name: 'The Sheesh Mahal Royal Stage',
    categoryId: 'wedding',
    subcategoryId: 'stage-items',
    category: 'stage',
    style: 'Royal',
    price: 250000,
    rating: 5.0,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    description: 'A breathtaking stage backdrop incorporating heritage mirror-work panels, intricate gold arches, royal red velvet steps, and grand majestic floral arrangements.',
    features: ['High-reflection mirror panels', 'Golden carved arches', 'Grand stage lighting design', 'Royal Maharaja luxury sofas'],
    isFeatured: true,
    tag: 'Royal Pick'
  },
  {
    id: 'hydraulic-lotus-jaimala',
    name: 'Hydraulic Lotus Revolving Jaimala Stage',
    categoryId: 'wedding',
    subcategoryId: 'jaimala',
    style: 'Royal',
    price: 145000,
    rating: 4.9,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=80',
    description: 'Mechanized opening lotus petals stage with smooth 360-degree motorized rotation, cold pyro spark mounts, and heavy floral bed.',
    features: ['Motorized opening petals', 'Smooth 360° silent rotation', 'Integrated cold pyro triggers', 'Includes twin designer varmalas']
  },
  {
    id: 'gold-jali-backdrop',
    name: 'Imperial Golden Jali & Velvet Backdrop',
    categoryId: 'wedding',
    subcategoryId: 'backdrops',
    style: 'Traditional',
    price: 90000,
    rating: 4.8,
    reviews: 51,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80',
    description: 'Mughal architectural CNC carved panels coated with 24K gold foil finish over rich crimson velvet back panels.',
    features: ['Laser-cut MDF jali', 'Gold leaf foil coating', 'Crimson velvet acoustics', 'Integrated warm backlighting']
  },

  // ==========================================
  // FURNITURE
  // ==========================================
  {
    id: 'velvet-sofa',
    name: 'Victorian Tufted Emerald Sofa',
    categoryId: 'furniture',
    subcategoryId: 'sofas',
    category: 'seating',
    style: 'Royal',
    price: 45999,
    rating: 4.9,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'A masterpiece of classic design, featuring royal emerald green velvet, diamond tufting, and carved teakwood legs with a premium gold-brushed finish.',
    features: ['Solid seasoned teakwood', 'High-density memory foam', 'Premium velvet fabric', 'Includes 3 satin throw pillows'],
    isFeatured: true,
    tag: 'Luxury'
  },
  {
    id: 'chiavari-chairs-set',
    name: 'Gold Phoenix Chiavari Chairs (Pack of 50)',
    categoryId: 'furniture',
    subcategoryId: 'chairs',
    style: 'Royal',
    price: 65000,
    rating: 4.9,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    description: 'High-strength polycarbonate resin Chiavari chairs with gold chrome electroplating and high-density foam cushions with velcro straps.',
    features: ['Electroplated gold sheen', 'Supports up to 250kg each', 'Stackable design', 'Waterproof velvet cushions']
  },
  {
    id: 'maharaja-throne-chairs',
    name: 'Maharaja Royal High-Back Throne Pair',
    categoryId: 'furniture',
    subcategoryId: 'chairs',
    category: 'seating',
    style: 'Traditional',
    price: 34999,
    rating: 5.0,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted solid teakwood couple thrones featuring intricate peacock and floral crest carvings with deep red velvet upholstery.',
    features: ['Pure solid teakwood carving', 'Gold leaf painted crests', 'Orthopedic lumbar support', 'Stain-resistant velvet']
  },
  {
    id: 'marble-table',
    name: 'Marbled Serenity Round Banquet Table (60")',
    categoryId: 'furniture',
    subcategoryId: 'tables',
    category: 'tables',
    style: 'Modern',
    price: 18499,
    rating: 4.7,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    description: 'Elegant dining and banquet table featuring natural Italian white marble top with chamfered edges and champagne gold metal legs.',
    features: ['Italian white-gray marble', 'Champagne gold-brushed metal base', 'Sleek rounded edges', 'Water-resistant treatment']
  },
  {
    id: 'champagne-bar-tables',
    name: 'Champagne Gold Cocktail High Bar Table',
    categoryId: 'furniture',
    subcategoryId: 'bar-tables',
    style: 'Modern',
    price: 8999,
    rating: 4.8,
    reviews: 39,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    description: 'High-top bar cocktail table with tempered smoked-glass top and heavy weighted circular gold base for stable banquet socializing.',
    features: ['Tempered smoked glass', 'Weighted anti-tip base', 'Compact 30" diameter', 'Adjustable leveling glides']
  },
  {
    id: 'illuminated-reception-counter',
    name: 'Curved LED Acrylic Reception Counter',
    categoryId: 'furniture',
    subcategoryId: 'counters',
    style: 'Modern',
    price: 42000,
    rating: 4.9,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Modular curved reception and welcome desk with programmable RGB backlighting, lockable inner cash drawers, and cable management ports.',
    features: ['Seamless translucent acrylic', 'RGB smartphone LED control', 'Built-in storage compartments', 'Cable grommets and ports']
  },

  // ==========================================
  // CATERING
  // ==========================================
  {
    id: 'kansa-thali-set',
    name: 'Royal Pure Kansa (Bronze) Banquet Thali Set (6-Piece)',
    categoryId: 'catering',
    subcategoryId: 'crockery',
    style: 'Traditional',
    price: 3899,
    rating: 5.0,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic 78% copper and 22% tin bronze thali set containing 1 large royal platter, 4 bowls, 1 dessert dish, and a bronze tumbler.',
    features: ['Certified food-safe Kansa', 'Hand-hammered finish', 'Ayurvedic health benefits', 'Heavy gauge durability'],
    tag: 'Authentic'
  },
  {
    id: 'roll-top-chafing-dish',
    name: 'Hydraulic Roll-Top Stainless Steel Chafing Dish (9L)',
    categoryId: 'catering',
    subcategoryId: 'serving-items',
    style: 'Modern',
    price: 7499,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    description: 'Commercial 304 food-grade stainless steel chafing unit with soft-closing hydraulic roll-top lid, clear glass viewing window, and dual burner holders.',
    features: ['Hydraulic soft-close hinge', 'Clear heat-resistant glass window', 'Dual fuel burner chambers', 'Electro-polished mirror finish']
  },
  {
    id: 'reinforced-gas-pipe',
    name: 'Industrial Braided Steel LPG Gas Hose Kit (50m)',
    categoryId: 'catering',
    subcategoryId: 'gas-pipes',
    style: 'Industrial',
    price: 12500,
    rating: 4.8,
    reviews: 43,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    description: 'High-pressure fireproof stainless steel wire braided flexible gas delivery pipe with brass quick-release couplings and high-flow regulator.',
    features: ['300 PSI burst pressure rated', 'Fire-resistant silicone inner tube', 'Brass quick-connect fittings', 'ISI mark certified']
  },
  {
    id: 'commercial-clay-tandoor',
    name: 'Stainless Steel Commercial Charcoal Tandoor',
    categoryId: 'catering',
    subcategoryId: 'catering-equipment',
    style: 'Industrial',
    price: 28000,
    rating: 4.9,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
    description: 'High-capacity authentic clay pot wrapped in insulated heavy stainless steel outer drum with heavy-duty castor wheels and temperature gauge.',
    features: ['Handcrafted clay chamber', 'Mineral wool insulation', 'Heavy duty locking castors', 'Includes skewers & naan gaddi']
  },
  {
    id: 'granite-buffet-counter',
    name: 'Modular Granite-Top Live Food Buffet Counter',
    categoryId: 'catering',
    subcategoryId: 'buffet-counters',
    style: 'Modern',
    price: 68000,
    rating: 4.8,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty 8-foot catering island counter with polished black galaxy granite counter-top, sneeze guard, and built-in hot pan cutouts.',
    features: ['Heat-proof granite slab', 'Toughened glass sneeze guard', 'Internal shelf storage', 'Stainless steel folding frame']
  },

  // ==========================================
  // DECOR
  // ==========================================
  {
    id: 'flower-wall-3d',
    name: '3D High-Density Hydrangea & Rose Floral Wall',
    categoryId: 'decor',
    subcategoryId: 'artificial-flowers',
    style: 'Modern',
    price: 52000,
    rating: 4.9,
    reviews: 139,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    description: 'Interlocking 8x10ft real-touch artificial floral backdrop wall packed with over 4,000 premium fabric roses, peonies, and hydrangeas.',
    features: ['Real-touch micro-fiber petals', 'Weatherproof UV-resistant', 'Interlocking snap-on grid', 'Foldable roll-up design'],
    isFeatured: true,
  },
  {
    id: 'brass-urli-props',
    name: 'Hand-Hammered Antique Brass Urlis & Floating Diya Set',
    categoryId: 'decor',
    subcategoryId: 'props',
    style: 'Traditional',
    price: 16500,
    rating: 4.9,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    description: 'Set of 3 graduating traditional brass urlis (24", 18", 14") with carved floral rims, suited for floating fresh rose petals and tealight candles.',
    features: ['Pure solid brass casting', 'Intricate peacock etched handles', 'Polished golden lacquer finish', 'Set of 3 with matching stands']
  },
  {
    id: 'carved-mdf-panels',
    name: 'Mughal Heritage Laser-Cut Arch Panels (Set of 4)',
    categoryId: 'decor',
    subcategoryId: 'panels',
    style: 'Royal',
    price: 26000,
    rating: 4.8,
    reviews: 46,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Precision CNC cut 12mm high-density moisture-resistant panels with symmetrical jali patterns and matte gold PU paint coating.',
    features: ['Moisture resistant HDHMR board', '2-side gold PU lacquer', 'Self-standing folding hinges', 'Lightweight yet structural']
  },
  {
    id: 'crimson-velvet-fabric',
    name: 'Royal Heavy Crimson Velvet Fabric Roll (100 Meters)',
    categoryId: 'decor',
    subcategoryId: 'fabrics',
    style: 'Royal',
    price: 32000,
    rating: 5.0,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    description: 'High-pile 420 GSM lush crushed velvet fabric with deep acoustic damping properties and rich sheen under stage lights.',
    features: ['420 GSM heavy weight', 'Acoustic sound-dampening', 'Wrinkle-resistant weave', 'Rich light-responsive sheen']
  },
  {
    id: 'crystal-candelabra',
    name: '5-Tier K9 Crystal Candelabra Centerpiece',
    categoryId: 'decor',
    subcategoryId: 'centerpieces',
    style: 'Modern',
    price: 6800,
    rating: 4.8,
    reviews: 105,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    description: '36-inch tall sparkling K9 faceted optical crystal centerpiece with 5 candle arms and cascading crystal bead pendants.',
    features: ['High-refractive K9 crystal', 'Weighted gold plated base', 'Holds standard taper or LED lights', 'Sturdy anti-scratch felt bottom']
  },
  {
    id: 'sharpie-beam-lights',
    name: '7R 230W Beam Moving Head Stage Lights (Pair)',
    categoryId: 'decor',
    subcategoryId: 'lighting',
    style: 'Modern',
    price: 48000,
    rating: 4.9,
    reviews: 63,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    description: 'Professional DMX-512 controlled moving head stage lights with 14 colors + open, 17 gobos, prism rotation, and razor-sharp long-throw beams.',
    features: ['230W Osram discharge lamp', '14 color dichroic filter wheel', 'DMX-512 & Auto Sound active', 'Ultra-fast pan/tilt motors']
  },

  // ==========================================
  // EVENT ESSENTIALS
  // ==========================================
  {
    id: 'mist-cooler-100l',
    name: 'Heavy Duty Commercial Centrifugal Mist Cooler (100L)',
    categoryId: 'event-essentials',
    subcategoryId: 'coolers',
    style: 'Industrial',
    price: 24500,
    rating: 4.9,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    description: 'High-power 100-liter centrifugal mist cooling fan producing micro-droplet mist that drops ambient outdoor temperature by up to 10°C.',
    features: ['100L tank (8+ hours run time)', 'Centrifugal non-clogging mist plate', 'Cools up to 1,500 sq.ft.', 'Lockable castor wheels'],
    tag: 'Summer Essential'
  },
  {
    id: 'pedestal-mist-fan',
    name: '26" Industrial 3-Speed Pedestal Misting Fan',
    categoryId: 'event-essentials',
    subcategoryId: 'fans',
    style: 'Industrial',
    price: 13999,
    rating: 4.8,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    description: 'Commercial oscillating heavy iron pedestal fan with high air-throw distance of 30 feet, 90-degree oscillation, and copper-wound motor.',
    features: ['100% pure copper motor', '90° auto-oscillation', 'Height adjustable up to 6.5ft', 'Heavy anti-vibration base']
  },
  {
    id: 'red-vip-carpet',
    name: 'Plush Crimson Red VIP Event Runner (6x50ft)',
    categoryId: 'event-essentials',
    subcategoryId: 'carpets',
    style: 'Royal',
    price: 8500,
    rating: 4.9,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty needle-punched red velvet event runner carpet with latex anti-skid rubber backing and bound anti-fraying borders.',
    features: ['High-density needle punched pile', 'Latex non-slip rubber backing', 'Stain-resistant fibers', 'Includes heavy binding on edges']
  },
  {
    id: 'interlocking-turf-mats',
    name: 'High-Density Interlocking Green Turf Mats (Pack of 20 Tiles)',
    categoryId: 'event-essentials',
    subcategoryId: 'mats',
    style: 'Modern',
    price: 6499,
    rating: 4.7,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    description: '35mm artificial grass tiles mounted on interlocking drainage grids, perfect for mud-free garden pathways and temporary lawn flooring.',
    features: ['Self-draining grid base', 'Realistic 4-tone lush turf', 'Tool-free interlocking tabs', 'Supports high heel traffic']
  },
  {
    id: 'power-db-box',
    name: '63A 3-Phase Weatherproof Power Distribution Panel (DB)',
    categoryId: 'event-essentials',
    subcategoryId: 'electrical-items',
    style: 'Industrial',
    price: 29500,
    rating: 5.0,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: 'IP65 waterproof heavy-duty electrical distribution panel with individual MCBs, digital voltmeter, phase indicators, and industrial plug sockets.',
    features: ['IP65 waterproof enclosure', 'Individual MCB / ELCB breakers', 'Digital voltage & current meters', 'Heavy duty industrial sockets']
  },
  {
    id: 'crowd-stanchions-ropes',
    name: 'Gold Stanchion Posts with Red Velvet Ropes (Set of 6)',
    categoryId: 'event-essentials',
    subcategoryId: 'miscellaneous-equipment',
    style: 'Royal',
    price: 11999,
    rating: 4.9,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    description: 'Mirror-polished titanium gold stainless steel queue stanchion poles with weighted concrete bases and 5-foot thick red velvet ropes.',
    features: ['Mirror gold titanium coating', 'Heavy 8kg weighted base', 'Thick red velvet ropes (5ft)', '4-way rope adapter tops']
  },

  // ==========================================
  // CUSTOM / MANUFACTURING
  // ==========================================
  {
    id: 'custom-clear-span-tent',
    name: 'Custom Fabricated Clear-Span Aluminum Tent (Bespoke Specs)',
    categoryId: 'custom-manufacturing',
    subcategoryId: 'custom-tents',
    style: 'Bespoke',
    price: 450000,
    rating: 5.0,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    description: 'Custom engineered high-span tensile aluminum tent manufactured precisely to your venue dimensions with custom gable walls and logo branding.',
    features: ['Engineered structural blueprints', 'T6 hard-pressed extruded aluminum', 'Custom wall heights up to 6 meters', 'Turnkey installation included'],
    tag: 'Bespoke'
  },
  {
    id: 'custom-brand-counter',
    name: 'Custom 3D Acrylic Backlit Brand & Welcome Counter',
    categoryId: 'custom-manufacturing',
    subcategoryId: 'custom-counters',
    style: 'Bespoke',
    price: 58000,
    rating: 4.9,
    reviews: 35,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'In-house laser-crafted wooden and acrylic welcome counter fabricated with your company or family monogram with integrated RGB illumination.',
    features: ['Custom laser-cut 3D monogram', 'Wireless LED illumination', 'Formica stain-proof finish', 'Built-in locking cash drawer']
  },
  {
    id: 'custom-teak-swing',
    name: 'Bespoke Hand-Carved Teakwood Royal Jhoola',
    categoryId: 'custom-manufacturing',
    subcategoryId: 'custom-furniture',
    category: 'swings',
    style: 'Bespoke',
    price: 64999,
    rating: 5.0,
    reviews: 41,
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80',
    description: 'Individually commissioned swing carved out of a single block of mature CP teakwood with your choice of floral or mythological motifs.',
    features: ['100% solid seasoned teakwood', 'Pure brass cast link chains', 'Customized dimensions & upholstery', 'Lifetime termite guarantee']
  },
  {
    id: 'custom-fiber-sculpture',
    name: 'Custom 12-Foot Fiberglass Thematic Decor Sculpture',
    categoryId: 'custom-manufacturing',
    subcategoryId: 'custom-decor',
    style: 'Bespoke',
    price: 120000,
    rating: 4.9,
    reviews: 24,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Custom sculpted weatherproof fiberglass (FRP) peacocks, elephants, mythological deities, or modern abstract art pieces with automotive gold paint finish.',
    features: ['Clay modeling to FRP casting', 'Weatherproof automotive PU finish', 'Reinforced internal steel armature', 'Lightweight & easy to transport']
  }
];

// Backward compatibility arrays
export const DECOR_THEMES = CATALOG_PRODUCTS.filter(p => p.categoryId === 'wedding' || p.categoryId === 'decor');
export const FURNITURE_ITEMS = CATALOG_PRODUCTS.filter(p => p.categoryId === 'furniture' || p.categoryId === 'custom-manufacturing');

export const INFLUENCER_REELS = [
  {
    name: 'Shwetambari Shetty',
    quote: '"My Mandap-Craft wedding was straight out of an ancient royal fable. Impeccable attention to floral symmetry!"',
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
    quote: '"Who says traditional drapes can\'t look modern? Mandap-Craft cracked the exact contemporary Indian aesthetic!"',
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
