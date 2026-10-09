import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

// Load Cloudinary mapping
const cloudinaryImages = JSON.parse(
  fs.readFileSync('src/scripts/cloudinary_nir_images.json', 'utf8')
);

function getCloudinaryUrl(pattern) {
  const found = cloudinaryImages.find(img => img.filename.includes(pattern));
  if (!found) {
    throw new Error(`Cloudinary image matching pattern "${pattern}" not found!`);
  }
  return found.url;
}

const machinesData = [
  // Page 2
  {
    sku: 'SKU-NIR-REGULAR-DOUGH-KNEADER',
    name: 'Shiv Shakti Regular - Dough Kneader (Atta Kneader)',
    price: 5250,
    images: [
      getCloudinaryUrl('cat_nir_p1_2_atta-maker-compact_nir-002'),
      getCloudinaryUrl('cat_nir_p1_3_atta-maker-commercial_nir-003')
    ],
    description: 'Commercial regular dough and atta kneading machine designed for restaurants, mess halls, hotels, and catering operations. Features food-grade stainless steel bowl and high-torque copper motor.',
    features: [
      'Food-grade stainless steel bowl and kneading arm',
      'High-performance copper winding motor',
      'Capacity range from 2 Kg to 50 Kg per batch',
      'Heavy-duty cast structure with smooth gear-driven operation'
    ],
    models: [
      { model: '2 Kg Regular', motor: '0.25 HP', size: '15*13*18', weight: '17 Kg', capacity: '1-2 Kg', price: 5250 },
      { model: '5 Kg Regular', motor: '0.5 HP', size: '26*15*23', weight: '42 Kg', capacity: '2-5 Kg', price: 10500 },
      { model: '10 Kg Regular', motor: '1 HP', size: '39*21*33', weight: '102 Kg', capacity: '5-10 Kg', price: 20500 },
      { model: '15 Kg Regular', motor: '1 HP', size: '40*23*36', weight: '110 Kg', capacity: '5-15 Kg', price: 21500 },
      { model: '20 Kg Regular', motor: '1.5 HP', size: '42*23*39', weight: '119 Kg', capacity: '10-20 Kg', price: 27500 },
      { model: '25 Kg Regular', motor: '1.5 HP', size: '47*25*40', weight: '125 Kg', capacity: '12-25 Kg', price: 28300 },
      { model: '30 Kg Regular', motor: '2 HP', size: '48*26*40', weight: '130 Kg', capacity: '15-30 Kg', price: 30500 },
      { model: '40 Kg Regular', motor: '2 HP', size: '50*25*38', weight: '175 Kg', capacity: '20-40 Kg', price: 42000 },
      { model: '50 Kg Regular', motor: '3 HP', size: '50*27*39', weight: '185 Kg', capacity: '25-50 Kg', price: 47500 }
    ]
  },
  {
    sku: 'SKU-NIR-UTYPE-DOUGH-KNEADER',
    name: 'Shiv Shakti U-Type - Dough Kneader (Atta Kneader)',
    price: 14700,
    images: [
      getCloudinaryUrl('cat_nir_p2_4_u-type-atta-kneading-machine_nir-008')
    ],
    description: 'Industrial U-type trough dough kneader with horizontal rotating spiral blades. Ideal for sweet shops, commercial bakeries, and large-scale catering facilities.',
    features: [
      'Horizontal U-shaped stainless steel trough',
      'Tilting mechanism for fast, effortless dough unloading',
      'Capacities ranging from 1 Foot to 5 Feet',
      'Heavy reduction gear box for uniform mixing'
    ],
    models: [
      { model: '1 Feet', motor: '0.5 HP', size: '30*25*26', weight: '45 Kg', capacity: '2-4 Kg', price: 14700 },
      { model: '1.5 Feet', motor: '1 HP', size: '30*26*27', weight: '54 Kg', capacity: '4-8 Kg', price: 16300 },
      { model: '2 Feet', motor: '1.5 HP', size: '56*25*41', weight: '190 Kg', capacity: '10-30 Kg', price: 36500 },
      { model: '3 Feet', motor: '2 HP', size: '68*25*41', weight: '220 Kg', capacity: '15-60 Kg', price: 68000 },
      { model: '5 Feet', motor: '3 HP', size: '92*25*41', weight: '370 Kg', capacity: '20-80 Kg', price: 90000 }
    ]
  },
  {
    sku: 'SKU-NIR-SPIRAL-DOUGH-KNEADER',
    name: 'Shiv Shakti Spiral - Dough Kneader (Atta Kneader)',
    price: 80000,
    images: [
      getCloudinaryUrl('cat_nir_p2_2_spiral-machine-semi-automatic_nir-006'),
      getCloudinaryUrl('cat_nir_p2_3_spiral-machine-fully-automatic_nir-007')
    ],
    description: 'High efficiency spiral dough kneader with rotating stainless bowl for delicate gluten stretching. Perfect for bakeries, pizza bases, and high-hydration doughs.',
    features: [
      'Simultaneous bowl and spiral hook rotation',
      'Available in Semi-Automatic and Fully Automatic models',
      'Single phase and 3-phase high power motor configurations',
      'Protective safety wire grid with emergency shut-off'
    ],
    models: [
      { model: '20 Kg Semi Auto (1 Phase)', motor: '3 HP / 1.5 HP', size: '42*22*38', weight: '260 Kg', capacity: '10-15 Kg', price: 80000 },
      { model: '20 Kg Semi Automatic', motor: '3 HP / 1 HP', size: '42*22*38', weight: '260 Kg', capacity: '10-15 Kg', price: 80000 },
      { model: '20 Kg Fully Automatic', motor: '3 HP / 1 HP', size: '42*22*38', weight: '270 Kg', capacity: '10-15 Kg', price: 100000 },
      { model: '40 Kg Semi Automatic', motor: '5 HP / 1.5 HP', size: '46*22*42', weight: '370 Kg', capacity: '15-35 Kg', price: 115000 },
      { model: '40 Kg Fully Automatic', motor: '5 HP / 1.5 HP', size: '46*22*42', weight: '390 Kg', capacity: '15-35 Kg', price: 135000 },
      { model: '80 Kg Semi Automatic', motor: '7 HP / 2 HP', size: '48*22*46', weight: '405 Kg', capacity: '30-75 Kg', price: 230000 },
      { model: '80 Kg Fully Automatic', motor: '7 HP / 2 HP', size: '48*22*46', weight: '425 Kg', capacity: '30-75 Kg', price: 250000 }
    ]
  },

  // Page 3
  {
    sku: 'SKU-NIR-LTYPE-DOUGH-KNEADER',
    name: 'Shiv Shakti L-Type - Dough Kneader (Atta Kneader)',
    price: 17500,
    images: [
      getCloudinaryUrl('cat_nir_p3_2_besan-making-machine_nir-010'),
      getCloudinaryUrl('cat_nir_p3_3_besan-making-machine-deluxe_nir-011')
    ],
    description: 'Heavy duty L-type atta dough mixer designed for continuous heavy duty kneading. Available in Regular open frame and Deluxe full-enclosed sheet metal body.',
    features: [
      'Available in Regular and Deluxe full covered body options',
      'Tilting bowl mechanism for quick and clean emptying',
      'Food grade stainless steel contact bowl and arm',
      'Capacity range from 5 Kg up to 50 Kg per batch'
    ],
    models: [
      { model: '5 Kg Regular', motor: '0.5 HP', size: '25*18*35', weight: '85 Kg', capacity: '1-5 Kg', price: 17500 },
      { model: '5 Kg Deluxe Full Type', motor: '0.5 HP', size: '25*18*35', weight: '90 Kg', capacity: '1-5 Kg', price: 20000 },
      { model: '10 Kg Regular', motor: '1 HP', size: '23*21*46', weight: '93 Kg', capacity: '3-10 Kg', price: 20500 },
      { model: '10 Kg Deluxe Full Type', motor: '1 HP', size: '23*21*48', weight: '98 Kg', capacity: '3-10 Kg', price: 22500 },
      { model: '15 Kg Regular', motor: '1 HP', size: '27*21*46', weight: '110 Kg', capacity: '7-15 Kg', price: 23000 },
      { model: '15 Kg Deluxe Full Type', motor: '1 HP', size: '27*21*48', weight: '115 Kg', capacity: '7-15 Kg', price: 25000 },
      { model: '20 Kg Regular', motor: '1.5 HP', size: '35*25*40', weight: '120 Kg', capacity: '10-20 Kg', price: 28000 },
      { model: '20 Kg Deluxe Full Type', motor: '1.5 HP', size: '35*25*40', weight: '125 Kg', capacity: '10-20 Kg', price: 30000 },
      { model: '30 Kg Regular', motor: '2 HP', size: '40*30*45', weight: '130 Kg', capacity: '15-30 Kg', price: 33800 },
      { model: '30 Kg Deluxe Full Type', motor: '2 HP', size: '40*30*45', weight: '135 Kg', capacity: '15-30 Kg', price: 35500 },
      { model: '50 Kg Regular', motor: '3 HP', size: '45*35*52', weight: '160 Kg', capacity: '25-50 Kg', price: 57500 },
      { model: '50 Kg Deluxe Full Type', motor: '3 HP', size: '45*35*52', weight: '166 Kg', capacity: '25-50 Kg', price: 60000 }
    ]
  },
  {
    sku: 'SKU-NIR-LTYPE-KHICHIYA',
    name: 'Shiv Shakti L-Type - Khichiya Machine',
    price: 25000,
    images: [
      getCloudinaryUrl('cat_nir_p3_1_khichiya-making-machine_nir-009')
    ],
    description: 'Specialized Khichiya cooking and kneading machine with gas burner fitted beneath the vessel. Cooks rice flour papad dough while continuously stirring.',
    features: [
      'Equipped with heavy gas burner under stainless steel vessel',
      'Continuous automatic stirring prevents batter from sticking',
      'Heavy reduction gear box engineered for dense doughs',
      'Capacities ranging from 5 Kg up to 50 Kg per batch'
    ],
    models: [
      { model: '5 Kg Deluxe & Burner', motor: '0.5 HP', size: '25*18*37', weight: '97 Kg', capacity: '1-5 Kg', price: 25000 },
      { model: '10 Kg Deluxe & Burner', motor: '1 HP', size: '29*20*39', weight: '105 Kg', capacity: '3-10 Kg', price: 28500 },
      { model: '15 Kg Deluxe & Burner', motor: '1 HP', size: '32*20*40', weight: '110 Kg', capacity: '7-15 Kg', price: 29500 },
      { model: '20 Kg Deluxe & Burner', motor: '1.5 HP', size: '35*25*42', weight: '115 Kg', capacity: '10-20 Kg', price: 33000 },
      { model: '30 Kg Deluxe & Burner', motor: '2 HP', size: '40*30*47', weight: '125 Kg', capacity: '15-30 Kg', price: 38000 },
      { model: '50 Kg Deluxe & Burner', motor: '3 HP', size: '45*35*55', weight: '150 Kg', capacity: '25-50 Kg', price: 72500 }
    ]
  },
  {
    sku: 'SKU-NIR-MAVA-MACHINE',
    name: 'Shiv Shakti Mava Machine',
    price: 57000,
    images: [
      getCloudinaryUrl('cat_nir_p11_3_mava-machine-regular_nir-043'),
      getCloudinaryUrl('cat_nir_p11_4_mava-machine-tilting_nir-044')
    ],
    description: 'Heavy duty commercial mava and khoya boiling machine with automatic rotating scraper blade for dairy farms, sweet makers, and catering kitchens.',
    features: [
      'Teflon scraping blades prevent milk caramelization and scorching',
      'Available in Regular fixed and Tilting models',
      'Even gas heating chamber for efficient boiling',
      'Capacities from 55 Liters up to 300 Liters'
    ],
    models: [
      { model: '55 Ltr. Regular', motor: '0.5 HP', size: '47*26*32', weight: '135 Kg', capacity: '5-7 Ltr', price: 57000 },
      { model: '55 Ltr. Tilting', motor: '0.5 HP', size: '52*26*56', weight: '160 Kg', capacity: '5-7 Ltr', price: 63000 },
      { model: '100 Ltr. Regular', motor: '1 HP', size: '50*27*39', weight: '210 Kg', capacity: '10-12 Ltr', price: 68000 },
      { model: '100 Ltr. Tilting', motor: '1 HP', size: '57*32*60', weight: '235 Kg', capacity: '10-12 Ltr', price: 74000 },
      { model: '200 Ltr. Regular', motor: '1.5 HP', size: '55*38*40', weight: '300 Kg', capacity: '20-30 Ltr', price: 90000 },
      { model: '200 Ltr. Tilting', motor: '1.5 HP', size: '65*38*62', weight: '360 Kg', capacity: '20-30 Ltr', price: 105000 },
      { model: '300 Ltr. Regular', motor: '2 HP', size: '59*43*45', weight: '360 Kg', capacity: '30-50 Ltr', price: 147000 },
      { model: '300 Ltr. Tilting', motor: '2 HP', size: '69*43*68', weight: '430 Kg', capacity: '30-50 Ltr', price: 168000 }
    ]
  },
  {
    sku: 'SKU-NIR-MUSTI-MACHINE',
    name: 'Shiv Shakti Musti Machine',
    price: 47000,
    images: [
      getCloudinaryUrl('cat_nir_p12_1_mushti-machine_nir-045')
    ],
    description: 'Heavy duty sweet shop kadai stirrer and musti machine with 28-inch heavy gauge stainless kadai for dense halwa, barfi, and mava sweets.',
    features: [
      '28-inch diameter heavy duty stainless steel kadai',
      'Powerful 2 HP copper motor with torque reduction gearing',
      'Option with integrated industrial gas burner stand',
      'Sturdy steel framework with minimal vibration'
    ],
    models: [
      { model: 'Musti Machine 28 Inch Kadai', motor: '2 HP', size: '39*34*47', weight: '170 Kg', capacity: '10-15 Kg', price: 47000 },
      { model: 'Musti Machine - 28 Inch Kadai with Burner', motor: '2 HP', size: '39*34*55', weight: '175 Kg', capacity: '10-15 Kg', price: 50000 }
    ]
  },

  // Page 4
  {
    sku: 'SKU-NIR-HALVA-MACHINE',
    name: 'Shiv Shakti Halva Machine',
    price: 85000,
    images: [
      getCloudinaryUrl('cat_nir_p13_1_halwa-making-machine_nir-049')
    ],
    description: 'Commercial automatic halva making machine with rotating kadai and planetary mixing arms for continuous sweet preparation in large batch sizes.',
    features: [
      'Large heavy duty sweet frying and boiling kadai',
      'Sizes available from 2 Feet up to 5 Feet diameter',
      'High reduction gear box for viscous sweet batters',
      'High throughput capacities from 20 Kg to 80 Kg per batch'
    ],
    models: [
      { model: '2 Feet', motor: '1 HP', size: '48*30*43', weight: '200 Kg', capacity: '20-25 Kg', price: 85000 },
      { model: '3 Feet', motor: '1.5 HP', size: '56*38*43', weight: '250 Kg', capacity: '30-35 Kg', price: 100000 },
      { model: '4 Feet', motor: '2 HP', size: '68*50*49', weight: '300 Kg', capacity: '50-60 Kg', price: 135000 },
      { model: '5 Feet', motor: '3 HP', size: '88*62*49', weight: '350 Kg', capacity: '70-80 Kg', price: 235000 }
    ]
  },
  {
    sku: 'SKU-NIR-DOUGH-BALL-MACHINE',
    name: 'Shiv Shakti Dough Ball Making Machine',
    price: 35000,
    images: [
      getCloudinaryUrl('cat_nir_p2_1_dough-ball-machine-pneumatic_nir-005')
    ],
    description: 'Pneumatic dough ball (peda / loi) cutting machine for chapatis, rotis, and puris. Portions dough into uniform gram weights quickly and accurately.',
    features: [
      'Precision weight range from 13 grams to 45 grams per ball',
      'Food grade stainless steel hopper and cutter blades',
      'Available with or without heavy duty air compressor',
      'High speed output saving immense manual labor'
    ],
    models: [
      { model: 'Pneumatic (Without Compressor)', motor: 'Pneumatic', size: '27*19*41', weight: '37 Kg', capacity: '2-3 Kg (13g-45g)', price: 35000 },
      { model: 'Pneumatic (With Compressor)', motor: 'Pneumatic + Compressor', size: '27*19*41', weight: '77 Kg', capacity: '2-3 Kg (13g-45g)', price: 45000 }
    ]
  },
  {
    sku: 'SKU-NIR-SEMI-AUTO-CHAPATI',
    name: 'Shiv Shakti Semi Automatic Chapati Machine',
    price: 22000,
    images: [
      getCloudinaryUrl('cat_nir_p15_1_roti-making-machine_nir-057')
    ],
    description: 'Tabletop semi-automatic chapati and roti pressing and semi-baking machine for caterers, messes, restaurants, and domestic catering setups.',
    features: [
      'Dual heated pressing plates with non-stick finish',
      'Produces uniform thickness round chapatis in seconds',
      'Available in Domestic, Small Commercial, and Big Commercial capacities',
      'Production rates up to 1000 pieces per hour'
    ],
    models: [
      { model: 'Chapati Machine Domestic', motor: '0.25 HP', size: '13*9*12', weight: '18 Kg', capacity: '300 Pcs/Hr', price: 22000 },
      { model: 'Chapati Machine Small', motor: '0.25 HP', size: '13*14*17', weight: '31 Kg', capacity: '350-400 Pcs/Hr', price: 38500 },
      { model: 'Chapati Machine Big', motor: '1 HP', size: '31*17*19', weight: '107 Kg', capacity: '700-1000 Pcs/Hr', price: 60500 }
    ]
  },
  {
    sku: 'SKU-NIR-AUTO-CHAPATI-CONVEYOR',
    name: 'Shiv Shakti Automatic Chapati Machine (Conveyor Type)',
    price: 104500,
    images: [
      getCloudinaryUrl('cat_nir_p15_2_automatic-roti-making-machine_nir-058')
    ],
    description: 'High capacity fully automatic conveyor belt chapati machine. Feeds, rolls, cooks, and puffs chapatis continuously with automated heat zones.',
    features: [
      'Automatic rolling and multi-stage conveyor baking system',
      'Produces fully puffed, golden-brown rotis without oil',
      'Output speeds up to 1000 chapatis per hour',
      'Heavy gauge stainless steel body with digital temperature controller'
    ],
    models: [
      { model: 'Automatic Small', motor: '0.75+0.75 HP', size: '44*21*42', weight: '125 Kg', capacity: '350-500 Pcs/Hr', price: 104500 },
      { model: 'Automatic Big', motor: '1+1 HP', size: '73*62*29', weight: '420 Kg', capacity: '800-1000 Pcs/Hr', price: 198000 }
    ]
  },
  {
    sku: 'SKU-NIR-NAMKEEN-FARSAN-MACHINE',
    name: 'Shiv Shakti Namkeen (Farsan) Machine',
    price: 15000,
    images: [
      getCloudinaryUrl('cat_nir_p15_3_namkeen-making-machine_nir-059')
    ],
    description: 'Electric namkeen, farsan, and sev extruder machine with motorized pressing arm. Allows continuous dropping of sev directly into frying kadai.',
    features: [
      'Motorized downward pressing stroke for effortless extrusion',
      'Interchangeable brass and stainless dies for varied namkeen thicknesses',
      'Available in 7-inch and 9-inch barrel diameters',
      'High hourly capacity reaching up to 150 Kg namkeen per hour'
    ],
    models: [
      { model: '7" Farsan Machine', motor: '0.5 HP', size: '40*11*38', weight: '55 Kg', capacity: '60-70 Kg/Hr', price: 15000 },
      { model: '9" Farsan Machine', motor: '1 HP', size: '45*14*38', weight: '80 Kg', capacity: '100-150 Kg/Hr', price: 17000 }
    ]
  },
  {
    sku: 'SKU-NIR-FAFDA-GATHIYA-MACHINE',
    name: 'Shiv Shakti Fafda Gathiya Machine',
    price: 13500,
    images: [
      getCloudinaryUrl('cat_nir_p18_2_fafda-machine_nir-070')
    ],
    description: 'Dedicated Gujarati fafda and gathiya extrusion machine with precise roller spacing for perfectly elongated and uniform fafda strips.',
    features: [
      'Smooth stainless steel roller extrusion mechanism',
      'Quick-adjust knob for strip thickness',
      'Available in Regular and Jumbo high-capacity models',
      'Output capacity up to 70 Kg fafda per hour'
    ],
    models: [
      { model: 'Fafda Machine Regular', motor: '0.25 HP', size: '14*9*16', weight: '21 Kg', capacity: '30-40 Kg/Hr', price: 13500 },
      { model: 'Fafda Machine Jumbo', motor: '0.5 HP', size: '20*10*21', weight: '40 Kg', capacity: '55-70 Kg/Hr', price: 20000 }
    ]
  },

  // Page 5
  {
    sku: 'SKU-NIR-SAMOSA-PATTI-MACHINE',
    name: 'Shiv Shakti Samosa Patti Machine',
    price: 14500,
    images: [
      getCloudinaryUrl('cat_nir_p16_2_samosa-sheeter-machine_nir-062')
    ],
    description: 'Commercial dough sheeter for samosa patti, spring roll sheets, and pastry layers. Produces uniform paper-thin dough sheets consistently.',
    features: [
      'Heavy 98x240mm precision stainless steel rollers',
      'Adjustable gauge dial for micrometric thickness control',
      'Compact footprint with high torque motor drive',
      'Smooth continuous feed for fast snack manufacturing'
    ],
    models: [
      { model: 'Samosa Patti Machine', motor: '0.25 HP', size: '10*22*17', weight: '33 Kg', capacity: '98x240mm Roller', price: 14500 }
    ]
  },
  {
    sku: 'SKU-NIR-HAND-POTATO-SLICER',
    name: 'Shiv Shakti Hand Potato Slicer',
    price: 1700,
    images: [
      getCloudinaryUrl('cat_nir_p6_1_hand-potato-slicer_nir-021')
    ],
    description: 'Manual lever-action stainless blade potato and vegetable slicer for quick wafer and chip preparation at event live counters.',
    features: [
      'Durable M.S. body frame with 3 stainless steel cutting blades',
      'Manual smooth reciprocating slicing action',
      'Compact and highly portable for event counters',
      'Zero electricity required'
    ],
    models: [
      { model: 'Hand Potato Slicer', motor: 'Manual', size: '9*5*11', weight: '4 Kg', capacity: '3 Nos. Blades', price: 1700 }
    ]
  },
  {
    sku: 'SKU-NIR-POTATO-PEELER-MACHINE',
    name: 'Shiv Shakti Potato Peeler Machine',
    price: 10500,
    images: [
      getCloudinaryUrl('cat_nir_p17_1_potato-peeler-machine_nir-065')
    ],
    description: 'Abrasive drum commercial potato peeler machine with water inlet connection. Peels full batches of potatoes thoroughly in 2 to 3 minutes.',
    features: [
      'Heavy silicon carbide abrasive peeling disc and interior drum',
      'Integrated water spray connection cleans peelings automatically',
      'Peeling cycle time of just 2 to 5 minutes per batch',
      'Available in capacities from 5 Kg up to 50 Kg per batch'
    ],
    models: [
      { model: '5 Kg Peeler Machine', motor: '0.75 HP', size: '22*14*16', weight: '38 Kg', capacity: '2-3 Min / 5 Kg', price: 10500 },
      { model: '10 Kg Peeler Machine', motor: '1 HP', size: '24*16*32', weight: '48 Kg', capacity: '3-5 Min / 10 Kg', price: 14000 },
      { model: '15 Kg Peeler Machine', motor: '1 HP', size: '29*18*36', weight: '67 Kg', capacity: '5-7 Min / 15 Kg', price: 18000 },
      { model: '20 Kg Peeler Machine', motor: '1.5 HP', size: '29*18*40', weight: '71 Kg', capacity: '7-10 Min / 20 Kg', price: 21000 },
      { model: '30 Kg Peeler Machine', motor: '2 HP', size: '34*21*43', weight: '97 Kg', capacity: '10-12 Min / 30 Kg', price: 31500 },
      { model: '50 Kg Peeler Machine', motor: '3 HP', size: '37*27*45', weight: '120 Kg', capacity: '12-15 Min / 50 Kg', price: 47500 }
    ]
  },
  {
    sku: 'SKU-NIR-POTATO-WAFER-MACHINE',
    name: 'Shiv Shakti Potato Wafer Machine',
    price: 18000,
    images: [
      getCloudinaryUrl('cat_nir_p16_1_potato-slicer-machine_nir-061')
    ],
    description: 'High speed motorized potato wafer slicing machine with interchangeable dies for flat slices, ruffles, and finger chips.',
    features: [
      'High speed rotary blade rotor producing uniform wafer cuts',
      'Includes multiple precision dies (2.5mm to 6mm and finger chips)',
      'Outputs up to 250 Kg potato wafers per hour',
      'Food-grade stainless contact chamber'
    ],
    models: [
      { model: 'Wafer Machine (3 Dies)', motor: '0.5 HP', size: '19*13*26', weight: '43 Kg', capacity: '200-250 Kg/Hr', price: 18000 },
      { model: 'Finger Chips Machine (1 Die)', motor: '0.5 HP', size: '19*13*26', weight: '40 Kg', capacity: '170-230 Kg/Hr', price: 21000 }
    ]
  },
  {
    sku: 'SKU-NIR-BANANA-WAFER-MACHINE',
    name: 'Shiv Shakti Banana Wafer Machine',
    price: 18000,
    images: [
      getCloudinaryUrl('cat_nir_p16_3_banana-slicer-machine_nir-063')
    ],
    description: 'Electric banana and plantain wafer slicing machine designed for round and longitudinal banana chips directly over frying pans.',
    features: [
      'Rotates at 960 RPM for ultra-clean banana wafer slices',
      'Optional electronic variable speed controller (960 to 144 RPM)',
      'Includes 3 specialized wafer slicing dies',
      'Capacity up to 350 Kg banana chips per hour'
    ],
    models: [
      { model: 'Wafer Machine (3 Die, 960 RPM)', motor: '1 HP', size: '35*13*25', weight: '40 Kg', capacity: '250-300 Kg/Hr', price: 18000 },
      { model: 'Wafer Machine With Speed Control (3 Die)', motor: '1 HP (960-144 RPM)', size: '42*13*34', weight: '55 Kg', capacity: '300-350 Kg/Hr', price: 30000 }
    ]
  },
  {
    sku: 'SKU-NIR-DRYER-MACHINE',
    name: 'Shiv Shakti Dryer Machine',
    price: 18000,
    images: [
      getCloudinaryUrl('cat_nir_p17_2_oil-dryer-machine_nir-066')
    ],
    description: 'Centrifugal hydro extractor oil and water dryer machine for removing excess surface oil from fried snacks, sev, wafers, and washed vegetables.',
    features: [
      'High speed perforated spin basket de-oils fried food rapidly',
      'Available in Regular and convenient Tilting body configurations',
      'Spin cycle de-oiling completed in 2 to 5 minutes',
      'Capacities ranging from 10 Kg to 50 Kg per batch'
    ],
    models: [
      { model: '10 Kg Regular', motor: '1 HP', size: '35*21*30', weight: '71 Kg', capacity: '2-3 Min / 10 Kg', price: 18000 },
      { model: '15 Kg Tilting', motor: '1 HP', size: '28*25*35', weight: '84 Kg', capacity: '3-5 Min / 15 Kg', price: 21000 },
      { model: '30 Kg Tilting', motor: '1.5 HP', size: '31*25*40', weight: '103 Kg', capacity: '5-7 Min / 30 Kg', price: 31500 },
      { model: '50 Kg Tilting', motor: '2 HP', size: '36*37*40', weight: '130 Kg', capacity: '7-10 Min / 50 Kg', price: 68000 }
    ]
  },

  // Page 6
  {
    sku: 'SKU-NIR-POWDER-MIXING-MACHINE',
    name: 'Shiv Shakti Powder Mixing Machine',
    price: 19000,
    images: [
      getCloudinaryUrl('cat_nir_p20_2_powder-mixer-machine_nir-078')
    ],
    description: 'Horizontal ribbon blender powder mixing machine for spices, dry masala blends, premixes, and flour blends.',
    features: [
      'Counter-directional double ribbon agitator for homogenous blending',
      'Heavy stainless steel trough with top dust cover',
      'Capacities from 1.5 Feet (19000) up to 5 Feet',
      'Bottom sliding discharge gate for fast packaging'
    ],
    models: [
      { model: '1.5 Feet', motor: '0.75 HP', size: '28*20*35', weight: '90 Kg', capacity: '5-15 Kg', price: 19000 },
      { model: '2 Feet', motor: '1.5 HP', size: '37*27*48', weight: '190 Kg', capacity: '10-30 Kg', price: 42000 },
      { model: '3 Feet', motor: '2 HP', size: '61*27*48', weight: '250 Kg', capacity: '15-60 Kg', price: 68000 },
      { model: '5 Feet', motor: '3 HP', size: '85*27*48', weight: '370 Kg', capacity: '20-80 Kg', price: 95000 }
    ]
  },
  {
    sku: 'SKU-NIR-FARSAN-MIXING-MACHINE',
    name: 'Shiv Shakti Farsan Mixing Machine',
    price: 14500,
    images: [
      getCloudinaryUrl('cat_nir_p17_3_farshan-mixing-machine_nir-067')
    ],
    description: 'Motorized trough mixing machine for farsan, mixture, chivda, and namkeen ingredients ensuring zero breakage of delicate snack pieces.',
    features: [
      'Gentle tumbling and paddle action protects snack crispiness',
      'Capacities available from 1 Foot to 5 Feet',
      'Heavy reduction gear box for continuous duty',
      'Smooth tilting cradle for rapid emptying'
    ],
    models: [
      { model: '1 Feet', motor: '0.5 HP', size: '30*21*46', weight: '45 Kg', capacity: '2-4 Kg', price: 14500 },
      { model: '1.5 Feet', motor: '0.75 HP', size: '36*21*26', weight: '54 Kg', capacity: '4-8 Kg', price: 16500 },
      { model: '2 Feet', motor: '1 HP', size: '48*28*40', weight: '166 Kg', capacity: '10-30 Kg', price: 33500 },
      { model: '3 Feet', motor: '2 HP', size: '62*28*40', weight: '190 Kg', capacity: '15-60 Kg', price: 48000 },
      { model: '5 Feet', motor: '3 HP', size: '86*28*40', weight: '250 Kg', capacity: '20-80 Kg', price: 63000 }
    ]
  },
  {
    sku: 'SKU-NIR-NAMKEEN-COATING-MIXING',
    name: 'Shiv Shakti Namkeen Coating Mixing Machine',
    price: 17500,
    images: [
      getCloudinaryUrl('cat_nir_p17_4_namkeen-coating-machine_nir-068')
    ],
    description: 'Rotating pan seasoning and flavour coating machine for namkeen, peanuts, chips, and popcorn. Available with tilting pan and gas burner.',
    features: [
      'Rotary hemispherical pan applies oil and spice powder uniformly',
      'Tilting drum design simplifies unloading',
      'Gas burner models available for hot syrup and roasting coatings',
      'Batch capacities up to 40 Kg per rotation'
    ],
    models: [
      { model: 'Small Tilting', motor: '0.75 HP', size: '30*26*52', weight: '75 Kg', capacity: '7-10 Kg', price: 17500 },
      { model: 'Small With Burner', motor: '0.75 HP', size: '30*26*52', weight: '77 Kg', capacity: '7-10 Kg', price: 19500 },
      { model: 'Medium Tilting', motor: '1 HP', size: '30*26*52', weight: '77 Kg', capacity: '15-20 Kg', price: 29500 },
      { model: 'Medium With Burner', motor: '1 HP', size: '30*26*52', weight: '79 Kg', capacity: '15-20 Kg', price: 31000 },
      { model: 'Large Tilting', motor: '1 HP', size: '40*30*52', weight: '105 Kg', capacity: '20-30 Kg', price: 52500 },
      { model: 'Regular', motor: '1.5 HP', size: '37*22*32', weight: '175 Kg', capacity: '20-40 Kg', price: 63000 }
    ]
  },
  {
    sku: 'SKU-NIR-KADUKAS-MACHINE',
    name: 'Shiv Shakti Kadukas Machine',
    price: 13300,
    images: [
      getCloudinaryUrl('cat_nir_p19_3_kadukas-machine_nir-075')
    ],
    description: 'Electric commercial grating (kadukas) machine for cheese, paneer, carrots, mooli, coconut, and vegetables with 2 interchangeable jalis.',
    features: [
      'Heavy cast aluminium housing with food contact hygiene',
      'Supplied with 2 interchangeable stainless steel grating drums',
      'High throughput capacity of 80 Kg per hour',
      'Powerful 1 HP motor for continuous catering use'
    ],
    models: [
      { model: 'Aluminium Body With 2 Jali', motor: '1 HP', size: '18*13*21', weight: '28 Kg', capacity: '80 Kg/Hr', price: 13300 }
    ]
  },
  {
    sku: 'SKU-NIR-VEG-CHOPPING-MACHINE',
    name: 'Shiv Shakti Vegetable Chopping Machine',
    price: 11600,
    images: [
      getCloudinaryUrl('cat_nir_p5_3_vegetable-chopping-machine_nir-019')
    ],
    description: 'High speed vegetable and onion chopping machine with spinning bowl and multi-curved s.s. cutter blades for catering prep.',
    features: [
      'All stainless steel body and rotating bowl',
      'Chops onions, garlic, cabbage, and chillies uniformly in seconds',
      'High capacity processing 150 Kg vegetables per hour',
      'Equipped with safety lid interlock'
    ],
    models: [
      { model: 'S.S. Body - S.S. Bowl', motor: '1 HP', size: '28*21*15', weight: '28 Kg', capacity: '150 Kg/Hr', price: 11600 }
    ]
  },
  {
    sku: 'SKU-NIR-VEG-CUTTING-MACHINE',
    name: 'Shiv Shakti Vegetable Cutting Machine',
    price: 13500,
    images: [
      getCloudinaryUrl('cat_nir_p4_3_vegetable-cutting-machine_nir-015')
    ],
    description: 'Multipurpose vegetable cutter for dicing, slicing, and shredding all types of vegetables with heavy duty rotor and blade discs.',
    features: [
      'High capacity multi-blade disc cutter system',
      'Available in Regular and Deluxe covered body configurations',
      'Outputs up to 1000 Kg vegetables per hour on high power models',
      'Rapid interchange of dicing and slicing discs'
    ],
    models: [
      { model: '1 HP Regular', motor: '1 HP', size: '21*11*22', weight: '44 Kg', capacity: '200-250 Kg/Hr', price: 13500 },
      { model: '1 HP Deluxe', motor: '1 HP', size: '21*11*33', weight: '46 Kg', capacity: '200-250 Kg/Hr', price: 15500 },
      { model: '2 HP Regular', motor: '2 HP', size: '25*14*28', weight: '72 Kg', capacity: '100-1000 Kg/Hr', price: 36500 }
    ]
  },
  {
    sku: 'SKU-NIR-SALAD-CUTTING-MACHINE',
    name: 'Shiv Shakti Salad Cutting Machine',
    price: 2800,
    images: [
      getCloudinaryUrl('cat_nir_p5_4_salad-cutting-machine_nir-020')
    ],
    description: 'Compact manual counter cutter for salad vegetables, cucumbers, radishes, and carrots with sharp stainless blades.',
    features: [
      'Durable M.S. frame with stainless steel contact blades',
      'Compact dimensions fitting live buffet counters',
      'Fast single-stroke lever action',
      'Easy to wash and sanitize'
    ],
    models: [
      { model: 'Salad Cutting Machine', motor: 'Manual', size: '7*8*14', weight: '5 Kg', capacity: 'S.S. Blade', price: 2800 }
    ]
  },

  // Page 7
  {
    sku: 'SKU-NIR-CHILLI-CUTTING-MACHINE',
    name: 'Shiv Shakti Chilli Cutting Machine',
    price: 3900,
    images: [
      getCloudinaryUrl('cat_nir_p5_1_chilli-cutter-machine_nir-017')
    ],
    description: 'Specialized high speed green chilli cutting and slicing machine. Available in manual hand-cranked and motorized configurations.',
    features: [
      'High speed rotary blade chops chillies without crushing or juicing',
      'Prevents hand burning and chili eye irritation during prep',
      'Motorized models process up to 450 Kg per hour',
      'Easy wash-down stainless steel cutting chute'
    ],
    models: [
      { model: 'Hand Chilli', motor: 'Manual', size: '17*11*22', weight: '9 Kg', capacity: 'Hand Operated', price: 3900 },
      { model: '1 HP Model', motor: '1 HP', size: '21*12*20', weight: '26 Kg', capacity: '100-200 Kg/Hr', price: 7500 },
      { model: '2 HP Model', motor: '2 HP', size: '22*17*26', weight: '32 Kg', capacity: '250-450 Kg/Hr', price: 12500 }
    ]
  },
  {
    sku: 'SKU-NIR-ONION-SLICER-MACHINE',
    name: 'Shiv Shakti Onion Slicer Machine',
    price: 10500,
    images: [
      getCloudinaryUrl('cat_nir_p4_2_onion-slicer-machine_nir-014')
    ],
    description: 'Motorized commercial onion slicer. Delivers thin, even onion rings and slices rapidly for biryani, gravies, and salads.',
    features: [
      'Rotary slicing disc with precision dual cutting edges',
      'Available in Regular and Big commercial feed chutes',
      'Outputs from 100 Kg to 200 Kg sliced onions per hour',
      'Enclosed motor housing for water-safe cleaning'
    ],
    models: [
      { model: 'Regular Onion Slicer', motor: '1 HP', size: '25*13*22', weight: '39 Kg', capacity: '100-150 Kg/Hr', price: 10500 },
      { model: 'Big Onion Slicer', motor: '1 HP', size: '19*13*26', weight: '40 Kg', capacity: '150-200 Kg/Hr', price: 15500 }
    ]
  },
  {
    sku: 'SKU-NIR-DRY-FRUIT-CHIPS-TUKDA',
    name: 'Shiv Shakti Dry Fruit Chips, Powder & Tukda Machine',
    price: 1700,
    images: [
      getCloudinaryUrl('cat_nir_p14_1_dry-fruit-chips-and-powder-machine_nir-053'),
      getCloudinaryUrl('cat_nir_p14_2_dry-fruit-cutting-machine-tukda_nir-054')
    ],
    description: 'Precision cutters and slicers for almonds, cashews, pistachios, and nuts. Available in manual hand models and motorized chips, powder, and tukda variants.',
    features: [
      'Interchangeable cutting drums for flakes, chips, granules, and powder',
      'Available in hand models as well as 0.25 HP and 1 HP motorized models',
      'Zero oil expulsion or paste formation during nut slicing',
      'Capacity range from 5 Kg up to 20 Kg nuts per hour'
    ],
    models: [
      { model: 'Small Hand', motor: 'Manual', size: '8*6*6', weight: '1.5 Kg', capacity: 'Hand Operated', price: 1700 },
      { model: 'Big Hand', motor: 'Manual', size: '8*7*9', weight: '5 Kg', capacity: 'Hand Operated', price: 3400 },
      { model: 'Hand Big with Motor', motor: '0.25 HP', size: '11*10*18', weight: '16 Kg', capacity: '5-10 Kg/Hr', price: 7800 },
      { model: 'Dry Fruit Tukda', motor: '1 HP', size: '17*12*24', weight: '38 Kg', capacity: '15-20 Kg/Hr', price: 12500 },
      { model: 'Dry Fruit Chips & Powder', motor: '1 HP', size: '22*13*20', weight: '28 Kg', capacity: '15-20 Kg/Hr', price: 12500 }
    ]
  },
  {
    sku: 'SKU-NIR-LADU-CRUSHER-MACHINE',
    name: 'Shiv Shakti Ladu Crusher Machine',
    price: 4400,
    images: [
      getCloudinaryUrl('cat_nir_p14_1_dry-fruit-chips-and-powder-machine_nir-053')
    ],
    description: 'Specialized sweet shop ladu crusher for boondi, motichoor, and besan ladu crumb preparation with motorized rotor.',
    features: [
      'Crushes boondi and fried gram balls into uniform crumbs',
      'Available with full motor stand or standalone mechanism head',
      'Output capacity up to 100 Kg ladu material per hour',
      'Food-grade contact surfaces'
    ],
    models: [
      { model: 'Without Motor & Body', motor: 'None', size: '15*16*17', weight: '13 Kg', capacity: 'Head Only', price: 4400 },
      { model: 'Ladu Crusher With Motor', motor: '1 HP', size: '15*16*32', weight: '40 Kg', capacity: '80-100 Kg/Hr', price: 12200 }
    ]
  },
  {
    sku: 'SKU-NIR-CHATANI-MACHINE',
    name: 'Shiv Shakti Chatani Machine',
    price: 5200,
    images: [
      getCloudinaryUrl('cat_nir_p18_1_chatni-machine_nir-069')
    ],
    description: 'Heavy duty commercial stone chatni and wet masala grinding machine for coconut chutney, mint, green masala, and ginger-garlic paste.',
    features: [
      'Natural carborundum grinding stones provide authentic stone-ground taste',
      'Available in 32 No. and large 64 No. sizes with or without motor',
      'Massive throughput capacities up to 850 Kg per hour',
      'Adjustable stone clearance for fine paste or coarse texture'
    ],
    models: [
      { model: '32 No. Without Motor & Body', motor: 'None', size: '15*10*11', weight: '16 Kg', capacity: 'Head Only', price: 5200 },
      { model: '1 HP 32 No.', motor: '1 HP', size: '18*13*26', weight: '52 Kg', capacity: '100-150 Kg/Hr', price: 13800 },
      { model: '64 No. Without Motor & Body', motor: 'None', size: 'Head', weight: '40 Kg', capacity: 'Head Only', price: 19800 },
      { model: '2 HP 64 No.', motor: '2 HP', size: '25*18*35', weight: '75 Kg', capacity: '150-850 Kg/Hr', price: 33000 }
    ]
  },
  {
    sku: 'SKU-NIR-MANGO-PULP-MACHINE',
    name: 'Shiv Shakti Mango Pulp Machine',
    price: 32000,
    images: [
      getCloudinaryUrl('cat_nir_p13_2_mango-machine_nir-050')
    ],
    description: 'Industrial fruit and mango pulping machine. Separates skins, seeds, and pulp automatically for mango ras, tomato puree, and fruit pulp.',
    features: [
      'High speed internal paddle rotor with stainless mesh screen',
      'Continuous waste discharge separates seeds and skin automatically',
      'Processing capacities from 50 Kg up to 1000 Kg per hour',
      'Complete food-grade stainless steel fabrication'
    ],
    models: [
      { model: '50 Kg Model', motor: '1 HP', size: '33*19*42', weight: '56 Kg', capacity: '10-50 Kg/Hr', price: 32000 },
      { model: '200 Kg Model', motor: '1.5 HP', size: '41*20*42', weight: '90 Kg', capacity: '50-200 Kg/Hr', price: 43000 },
      { model: '400 Kg Model', motor: '2 HP', size: '53*24*42', weight: '115 Kg', capacity: '100-400 Kg/Hr', price: 53000 },
      { model: '1000 Kg Model', motor: '3 HP', size: '63*27*42', weight: '170 Kg', capacity: '200-1000 Kg/Hr', price: 135000 }
    ]
  },

  // Page 8
  {
    sku: 'SKU-NIR-ROUND-MIXER-GRINDER',
    name: 'Shiv Shakti Round-Heavy Duty Mixer Grinder',
    price: 6200,
    images: [
      getCloudinaryUrl('cat_nir_p19_2_mixer-grinder-round_nir-074')
    ],
    description: 'Heavy duty commercial round body mixer grinder operating at 2880 RPM. Designed for heavy daily restaurant masala grinding.',
    features: [
      'High speed 2880 RPM copper winding commercial motor',
      'Heavy gauge stainless steel jars with locking lids',
      'Available in 3 Ltr, 5 Ltr, and 10 Ltr capacities with extra jars',
      'Overload protector switch and rubber shock mount feet'
    ],
    models: [
      { model: '3 Ltr. (2880 RPM)', motor: '0.5 HP', size: '9*9*19', weight: '11 Kg', capacity: '3 Ltr', price: 6200 },
      { model: '5 Ltr. (2880 RPM)', motor: '1.5 HP', size: '11*11*24', weight: '27 Kg', capacity: '5 Ltr', price: 8500 },
      { model: '10 Ltr. (2880 RPM)', motor: '2 HP', size: '11*14*30', weight: '30 Kg', capacity: '10 Ltr', price: 9800 },
      { model: '3 Ltr Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '2 Kg', capacity: '3 Ltr Jar', price: 1500 },
      { model: '5 Ltr Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '3 Kg', capacity: '5 Ltr Jar', price: 2200 },
      { model: '10 Ltr Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '4 Kg', capacity: '10 Ltr Jar', price: 2600 }
    ]
  },
  {
    sku: 'SKU-NIR-SQUARE-MIXER-GRINDER',
    name: 'Shiv Shakti Square-Heavy Duty Mixer Grinder',
    price: 9900,
    images: [
      getCloudinaryUrl('cat_nir_p19_1_mixer-grinder-square_nir-073')
    ],
    description: 'Square body commercial heavy duty mixer grinder with heavy gauge chassis and industrial high torque 2880 RPM drive.',
    features: [
      'Square sheet metal housing with reinforced motor seating',
      'High capacity jars up to 15 Liters',
      'Full speed 2880 RPM operation for super fine gravies and purees',
      'Industrial rotary on/off and pulse control switches'
    ],
    models: [
      { model: '5 Ltr. (2880 RPM)', motor: '1.5 HP', size: '11*11*24', weight: '29 Kg', capacity: '5 Ltr', price: 9900 },
      { model: '10 Ltr. (2880 RPM)', motor: '2 HP', size: '11*14*30', weight: '35 Kg', capacity: '10 Ltr', price: 11600 },
      { model: '15 Ltr. (2880 RPM)', motor: '3 HP', size: '17*15*37', weight: '47 Kg', capacity: '15 Ltr', price: 16800 },
      { model: '15 Ltr Square Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '5 Kg', capacity: '15 Ltr Jar', price: 5300 }
    ]
  },
  {
    sku: 'SKU-NIR-TILTING-MIXER-GRINDER',
    name: 'Shiv Shakti Tilting-Heavy Duty Mixer Grinder',
    price: 11600,
    images: [
      getCloudinaryUrl('cat_nir_p19_4_mixer-grinder-tilting_nir-076')
    ],
    description: 'Heavy duty tilting commercial mixer grinder. The entire motor and jar assembly tilts on pivot bearings for easy pouring of thick batters.',
    features: [
      'Tilting bracket enables pouring heavy gravies without detaching the jar',
      'High speed 2880 RPM copper motor from 1.5 HP to 3 HP',
      'Capacities in 5 Ltr, 10 Ltr, and 15 Ltr',
      'Heavy counterweight base provides maximum stability'
    ],
    models: [
      { model: '5 Ltr. Tilting (2880 RPM)', motor: '1.5 HP', size: '22*16*37', weight: '31 Kg', capacity: '5 Ltr', price: 11600 },
      { model: '10 Ltr. Tilting (2880 RPM)', motor: '2 HP', size: '22*16*41', weight: '35 Kg', capacity: '10 Ltr', price: 12700 },
      { model: '15 Ltr. Tilting (2880 RPM)', motor: '3 HP', size: '24*17*50', weight: '51 Kg', capacity: '15 Ltr', price: 17900 },
      { model: '5 Ltr Tilting Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '3 Kg', capacity: '5 Ltr Jar', price: 2100 },
      { model: '10 Ltr Tilting Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '4 Kg', capacity: '10 Ltr Jar', price: 2500 },
      { model: '15 Ltr Tilting Jar (Extra)', motor: 'Jar Only', size: 'Standard', weight: '5 Kg', capacity: '15 Ltr Jar', price: 5000 }
    ]
  },
  {
    sku: 'SKU-NIR-VEG-CUTTER-PLASTIC',
    name: 'Shiv Shakti Vegetable Cutting Machine (Plastic)',
    price: 10500,
    images: [
      getCloudinaryUrl('cat_nir_p4_3_vegetable-cutting-machine_nir-015')
    ],
    description: 'Commercial vegetable cutting machine built with reinforced food-grade engineered polymer body and stainless cutting blades.',
    features: [
      'Corrosion-proof food grade plastic body',
      'Razor sharp stainless steel cutting blades',
      'Compact countertop footprint',
      'High speed uniform slicing for restaurant salads and toppings'
    ],
    models: [
      { model: 'Vegetable Cutting Plastic Model', motor: 'Motorized', size: '8*8*15', weight: '15 Kg', capacity: 'S.S. Blade', price: 10500 }
    ]
  },

  // Page 9
  {
    sku: 'SKU-NIR-VALONA-MACHINE',
    name: 'Shiv Shakti Valona Machine',
    price: 3700,
    images: [
      getCloudinaryUrl('cat_nir_p21_2_valona-machine_nir-082')
    ],
    description: 'Commercial butter churning and buttermilk (chhas / lassi) valona machine with vertical high speed agitator shaft.',
    features: [
      'High speed churning arm separates fresh makkhan from buttermilk in minutes',
      'Available in capacities from 10 Liters up to 200 Liters Heavy Model',
      'Single and dual speed copper winding motor options',
      'Sanitary stainless steel shaft and churning head'
    ],
    models: [
      { model: '10 Ltr. (50 Hz)', motor: 'Compact', size: 'Compact', weight: '3 Kg', capacity: '10 Ltr', price: 3700 },
      { model: '30 Ltr. (80 Hz)', motor: 'Standard', size: 'Standard', weight: '5 Kg', capacity: '30 Ltr', price: 4400 },
      { model: '40 Ltr.', motor: '0.25 HP', size: 'Standard', weight: '6 Kg', capacity: '40 Ltr', price: 5000 },
      { model: '60 Ltr.', motor: '0.5 HP', size: 'Standard', weight: '7 Kg', capacity: '60 Ltr', price: 5500 },
      { model: '60 Ltr. Heavy Model', motor: '0.5 HP', size: 'Heavy', weight: '15 Kg', capacity: '60 Ltr', price: 5900 },
      { model: '80 Ltr.', motor: '0.75 HP', size: '5*5*27', weight: '8 Kg', capacity: '80 Ltr', price: 6100 },
      { model: '100 Ltr. Regular Model', motor: '1 HP', size: '8*8*38', weight: '22 Kg', capacity: '100 Ltr', price: 9400 },
      { model: '100 Ltr. Heavy Model', motor: '1.5 HP', size: '8*8*38', weight: '25 Kg', capacity: '100 Ltr', price: 11600 },
      { model: '200 Ltr. Regular Model', motor: '1.5 HP', size: '9*9*49', weight: '25 Kg', capacity: '200 Ltr', price: 11600 },
      { model: '200 Ltr. Heavy Model', motor: '2 HP', size: '9*9*49', weight: '30 Kg', capacity: '200 Ltr', price: 14900 }
    ]
  },
  {
    sku: 'SKU-NIR-CAKE-PLANETARY-MIXER',
    name: 'Shiv Shakti Cake-Planetary Mixer Machine',
    price: 7000,
    images: [
      getCloudinaryUrl('cat_nir_p1_4_planetary-machine_nir-004')
    ],
    description: 'Commercial planetary mixer for cake batter, whipping cream, egg whites, and icing. Planetary gear rotation aerates batters perfectly.',
    features: [
      'Multi-speed planetary head with dual rotation mechanism',
      'Includes stainless steel bowl, whisk, and flat beater attachments',
      'Available in 5 Ltr compact and 20 Ltr Indian Heavy Duty model',
      'Safety micro-switch and bowl guard'
    ],
    models: [
      { model: '5 Ltr.', motor: '0.25 HP', size: '15*11*18', weight: '17 Kg', capacity: '1-2 Ltr Bowl', price: 7000 },
      { model: 'Cake-Planetary Mixer (Indian Model 20 Ltr)', motor: '1 HP', size: '25*19*40', weight: '65 Kg', capacity: '10-22 Ltr Bowl', price: 35000 }
    ]
  },
  {
    sku: 'SKU-NIR-WET-GRINDER-MACHINE',
    name: 'Shiv Shakti Wet Grinder Machine',
    price: 19800,
    images: [
      getCloudinaryUrl('cat_nir_p4_1_wet-grinder-machine-regular_nir-013')
    ],
    description: 'Commercial fixed-drum wet grinder with granite grinding stones for idli, dosa, and vada batter preparation.',
    features: [
      'Heavy natural conical granite grinding stones and stone base',
      'Maintains low batter temperature during grinding to prevent fermentation',
      'Capacities in 5 Ltr, 10 Ltr, and 15 Ltr',
      'High torque heavy gear motor for long continuous duty'
    ],
    models: [
      { model: '5 Ltr.', motor: '0.5 HP', size: '31*19*40', weight: '115 Kg', capacity: '5 Ltr', price: 19800 },
      { model: '10 Ltr.', motor: '1 HP', size: '33*22*40', weight: '170 Kg', capacity: '10 Ltr', price: 25400 },
      { model: '15 Ltr.', motor: '1.5 HP', size: '36*25*43', weight: '210 Kg', capacity: '15 Ltr', price: 30900 }
    ]
  },
  {
    sku: 'SKU-NIR-TILTING-WET-GRINDER',
    name: 'Shiv Shakti Tilting Wet Grinder Machine',
    price: 34700,
    images: [
      getCloudinaryUrl('cat_nir_p3_4_wet-grinder-machine-tilting_nir-012')
    ],
    description: 'Commercial tilting wet grinder with natural stone rollers. Entire drum tilts with handwheel lever for effortless batter discharge.',
    features: [
      'Tilting drum design saves time and avoids lifting heavy wet batter',
      'High density granite rollers ensure smooth idli/dosa texture',
      'Capacities from 7 Ltr up to 20 Ltr',
      'Heavy stainless steel exterior body covering'
    ],
    models: [
      { model: '7 Ltr.', motor: '0.5 HP', size: '25*18*44', weight: '120 Kg', capacity: '7 Ltr', price: 34700 },
      { model: '10 Ltr.', motor: '1 HP', size: '27*19*46', weight: '142 Kg', capacity: '10 Ltr', price: 36900 },
      { model: '15 Ltr.', motor: '1.5 HP', size: '29*20*46', weight: '158 Kg', capacity: '15 Ltr', price: 39100 },
      { model: '20 Ltr.', motor: '2 HP', size: '29*20*48', weight: '170 Kg', capacity: '20 Ltr', price: 43500 }
    ]
  },

  // Page 10
  {
    sku: 'SKU-NIR-WET-DAL-MACHINE',
    name: 'Shiv Shakti Wet Dal Machine',
    price: 6700,
    images: [
      getCloudinaryUrl('cat_nir_p13_4_wet-dal-grinding-machine_nir-052')
    ],
    description: 'Commercial wet dal and grain plate mill for grinding soaked pulses, chana, urad dal, and rice batter for snack production.',
    features: [
      'High grade abrasive grinding plates produce smooth dal paste',
      'Available with 6", 8", and 11" plate sizes with or without motor',
      'Output capacity from 40 Kg up to 120 Kg wet dal per hour',
      'Micro-adjustment dial to calibrate paste coarseness'
    ],
    models: [
      { model: '6" Plate Without Motor', motor: 'None', size: '21*13*17', weight: '22 Kg', capacity: '40-60 Kg/Hr', price: 6700 },
      { model: '6" Plate With Motor', motor: '1.5 HP', size: '21*13*32', weight: '58 Kg', capacity: '40-60 Kg/Hr', price: 17100 },
      { model: '8" Plate Without Motor', motor: 'None', size: 'Stand', weight: '65 Kg', capacity: '80-100 Kg/Hr', price: 15500 },
      { model: '8" Plate With Motor', motor: '2 HP', size: 'Stand', weight: '105 Kg', capacity: '80-100 Kg/Hr', price: 29800 },
      { model: '11" Plate Without Motor', motor: 'None', size: 'Heavy', weight: '110 Kg', capacity: '100-120 Kg/Hr', price: 27600 },
      { model: '11" Plate With Motor', motor: '3 HP', size: 'Heavy', weight: '150 Kg', capacity: '100-120 Kg/Hr', price: 38500 }
    ]
  },
  {
    sku: 'SKU-NIR-COCONUT-SCRAPPER',
    name: 'Shiv Shakti Coconut Scrapper',
    price: 3000,
    images: [
      getCloudinaryUrl('cat_nir_p12_3_coconut-scraper-machine_nir-047')
    ],
    description: 'Motorized commercial coconut scrapper with high speed stainless fluted scrapping head and protective splatter guard.',
    features: [
      'Food-grade stainless steel multi-blade scraper head',
      'Available in Small 0.25 HP and Regular 1 HP commercial models',
      'Scrapes fresh coconut halves completely in under 30 seconds',
      'Stable rubber-mounted anti-slip base'
    ],
    models: [
      { model: 'Small Coconut Scrapper', motor: '0.25 HP', size: 'Compact', weight: '10 Kg', capacity: 'Fresh Coconut', price: 3000 },
      { model: 'Regular Coconut Scrapper', motor: '1 HP', size: '21*12*20', weight: '24 Kg', capacity: 'Fresh Coconut', price: 10000 }
    ]
  },
  {
    sku: 'SKU-NIR-ATTA-CHAKKI-WOODEN',
    name: 'Shiv Shakti Atta Chakki - Wooden Box Flour Mill Machine',
    price: 13300,
    images: [
      getCloudinaryUrl('cat_nir_p1_2_atta-maker-compact_nir-002')
    ],
    description: 'Fully automatic stone-grind wooden cabinet flour mill (ghar ghanti) for grinding fresh wheat, bajra, jowar, maize, and grains.',
    features: [
      'Acoustic wooden cabinet design minimizes grinding noise',
      'Automatic sensor controls start and stop on grain feed',
      'Capacities in 1 HP (5-7 Kg/Hr) and 2 HP (10-12 Kg/Hr)',
      'Produces cool, nutrient-rich flour with zero heat build-up'
    ],
    models: [
      { model: '1 HP Automatic (5 to 7 Kg)', motor: '1 HP', size: '18*13*33', weight: '42 Kg', capacity: '5 Kg Hopper', price: 13300 },
      { model: '2 HP Automatic (10 to 12 Kg)', motor: '2 HP', size: '19*15*34', weight: '50 Kg', capacity: '7 Kg Hopper', price: 17600 }
    ]
  },
  {
    sku: 'SKU-NIR-GRAVY-MACHINE',
    name: 'Shiv Shakti Gravy Machine',
    price: 7300,
    images: [
      getCloudinaryUrl('cat_nir_p14_4_gravy-machine_nir-056')
    ],
    description: 'High capacity commercial restaurant gravy and food grinding machine for onions, tomatoes, boiled vegetables, ginger, and garlic.',
    features: [
      'Dual cutter and hammer pulverizing options for smooth curry bases',
      'Available from 1 HP up to massive 7 HP industrial models',
      'Food-grade stainless steel grinding chamber',
      'Instant continuous discharge through bottom spout'
    ],
    models: [
      { model: '1HP Gravy Machine', motor: '1 HP', size: '19*13*19', weight: '28 Kg', capacity: '5" x 3" Chamber', price: 7300 },
      { model: '2HP Gravy Machine', motor: '2 HP', size: '20*16*26', weight: '35 Kg', capacity: '7" x 3" Chamber', price: 8500 },
      { model: '2HP Gravy Machine (Hammer)', motor: '2 HP', size: '20*16*26', weight: '35 Kg', capacity: '7" x 3" Chamber', price: 9000 },
      { model: '3HP Gravy Machine', motor: '3 HP', size: '23*17*29', weight: '43 Kg', capacity: '9" x 3" Chamber', price: 11000 },
      { model: '3HP Gravy Machine (Hammer)', motor: '3 HP', size: '23*17*29', weight: '43 Kg', capacity: '9" x 3" Chamber', price: 11500 },
      { model: '5HP Gravy Machine', motor: '5 HP', size: '23*17*18', weight: '71 Kg', capacity: '12" x 4" Chamber', price: 20000 },
      { model: '7HP Gravy Machine', motor: '7 HP', size: '35*22*43', weight: '120 Kg', capacity: '14" x 5.5" Chamber', price: 42000 }
    ]
  },
  {
    sku: 'SKU-NIR-SS-2IN1-PULVERISER',
    name: 'Shiv Shakti S. S. Body 2 In 1 Pulveriser',
    price: 14400,
    images: [
      getCloudinaryUrl('cat_nir_p20_1_2-in-1-pulverizer_nir-077')
    ],
    description: 'Stainless steel dual-purpose hammer pulveriser for dry grains, spices, pulses, turmeric, chili, and coriander.',
    features: [
      'Complete SS 304 food-grade grinding chamber and body',
      'Grinds both dry and wet items with interchangeable screen sieves',
      'Capacities in 2 HP (10-14 Kg/Hr) and 3 HP (18-20 Kg/Hr)',
      'Cyclone collection with cloth air filter'
    ],
    models: [
      { model: '2 HP (10 to 14 Kg)', motor: '2 HP', size: '25*12*33', weight: '46 Kg', capacity: '9" x 5" Chamber', price: 14400 },
      { model: '3 HP (18 to 20 Kg)', motor: '3 HP', size: '27*17*38', weight: '52 Kg', capacity: '10" x 5.2" Chamber', price: 16500 }
    ]
  },

  // Page 11
  {
    sku: 'SKU-NIR-MS-BODY-PULVERISER',
    name: 'Shiv Shakti M. S. Body Pulveriser Without Motor',
    price: 10500,
    images: [
      getCloudinaryUrl('cat_nir_p21_1_blower-hammer-pulverizer_nir-081')
    ],
    description: 'Heavy cast mild steel pulveriser standalone grinding unit without motor. Features heavy swinging hammers and replaceable screen liners.',
    features: [
      'Heavy cast iron frame with 4-way reversible hardened hammers',
      'Chamber sizes from 8" x 4" up to 12" x 4"',
      'Engineered for coupling to existing electric motors or diesel engines',
      'Continuous hopper feed for commercial spice and grain grinding'
    ],
    models: [
      { model: '8" Pulveriser', motor: 'None', size: '23*16*33', weight: '53 Kg', capacity: '8" x 4" Chamber', price: 10500 },
      { model: '10" Pulveriser', motor: 'None', size: '23*29*34', weight: '58 Kg', capacity: '10" x 4" Chamber', price: 11600 },
      { model: '12" Pulveriser', motor: 'None', size: '33*16*40', weight: '70 Kg', capacity: '12" x 4" Chamber', price: 12700 }
    ]
  },
  {
    sku: 'SKU-NIR-BOWL-CHOPPING-MACHINE',
    name: 'Shiv Shakti Bowl Chopping Machine',
    price: 31500,
    images: [
      getCloudinaryUrl('cat_nir_p4_4_bowl-chopping-machine_nir-016')
    ],
    description: 'Industrial meat and vegetable bowl chopper with high speed rotating blades cutting through a motorized revolving bowl.',
    features: [
      'High speed curved knives pass through rotating stainless bowl',
      'Emulsifies meat, vegetables, and stuffing without warming product',
      'Massive throughput processing 150 Kg to 200 Kg per hour',
      'Stainless steel safety cover with auto stop micro-switch'
    ],
    models: [
      { model: 'Bowl Chopper', motor: '1 HP', size: '22*16*21', weight: '53 Kg', capacity: '150-200 Kg/Hr', price: 31500 }
    ]
  },
  {
    sku: 'SKU-NIR-POPCORN-MACHINE',
    name: 'Shiv Shakti Popcorn Machine Without Glass',
    price: 19800,
    images: [
      getCloudinaryUrl('cat_nir_p15_3_namkeen-making-machine_nir-059')
    ],
    description: 'Commercial popping kettle popcorn machine frame for outdoor catering, events, and live stalls. Available in electric and gas models.',
    features: [
      'Non-stick heated kettle with automatic spring stirrer',
      'Available in 250 gm Electric and 300 gm Gas burner models',
      'Fast 2-minute popping cycle per batch',
      'Heavy stainless steel structural frame'
    ],
    models: [
      { model: '250 gm Electric Model', motor: 'Electric', size: '15*22*29', weight: '20 Kg', capacity: '250 gm Kettle', price: 19800 },
      { model: '300 gm Gas Model', motor: 'Gas', size: '22*20*38', weight: '31 Kg', capacity: '300 gm Kettle', price: 24200 }
    ]
  },
  {
    sku: 'SKU-NIR-BLOWER-PULVERISER-MS',
    name: 'Shiv Shakti Blower (Hammer) Pulveriser M.S.',
    price: 17000,
    images: [
      getCloudinaryUrl('cat_nir_p21_1_blower-hammer-pulverizer_nir-081')
    ],
    description: 'Blower hammer mill pulveriser with pneumatic cyclone discharge for fine grinding of red chilli, haldi, besan, and spices.',
    features: [
      'Integrated pneumatic blower conveys ground flour into cyclone dust bag',
      'Heavy mild steel build with high hardness beaters',
      'Available with or without high power copper motor (2 HP, 3 HP, 5 HP)',
      'Dust-free operation with continuous top hopper feed'
    ],
    models: [
      { model: '2 HP Pulveriser (W/O Motor)', motor: 'None', size: '30*24*45', weight: '56 Kg', capacity: 'Chamber Standard', price: 17000 },
      { model: '2 HP Pulveriser With Motor', motor: '2 HP', size: '30*24*45', weight: '88 Kg', capacity: 'Chamber Standard', price: 25000 },
      { model: '3 HP Pulveriser (W/O Motor)', motor: 'None', size: '36*24*50', weight: '71 Kg', capacity: 'Chamber Standard', price: 21000 },
      { model: '3 HP Pulveriser With Motor', motor: '3 HP', size: '36*24*50', weight: '120 Kg', capacity: 'Chamber Standard', price: 32500 },
      { model: '5 HP Pulveriser (W/O Motor)', motor: 'None', size: '40*30*55', weight: '114 Kg', capacity: 'Chamber Standard', price: 26000 },
      { model: '5 HP Pulveriser With Motor', motor: '5 HP', size: '40*30*55', weight: '150 Kg', capacity: 'Chamber Standard', price: 45000 }
    ]
  },

  // Page 12
  {
    sku: 'SKU-NIR-BLOWER-PULVERISER-SS',
    name: 'Shiv Shakti Blower (Hammer) Pulveriser S.S.',
    price: 29500,
    images: [
      getCloudinaryUrl('cat_nir_p21_1_blower-hammer-pulverizer_nir-081')
    ],
    description: 'Food grade stainless steel blower hammer pulveriser with pneumatic cyclone collection for commercial spice mills and pharmaceutical powders.',
    features: [
      'Complete contact parts made of food grade stainless steel',
      'Cyclone separator discharges dust-free powder directly into sacks',
      'Available in capacities from 2 HP up to heavy 10 HP industrial setup',
      'Grinds fine turmeric, coriander, chilli, and chemical powders'
    ],
    models: [
      { model: '2 HP Pulveriser (W/O Motor)', motor: 'None', size: '30*24*45', weight: '56 Kg', capacity: '30 Kg/Hr', price: 29500 },
      { model: '2 HP Pulveriser With Motor', motor: '2 HP', size: '30*24*45', weight: '88 Kg', capacity: '30 Kg/Hr', price: 38000 },
      { model: '3 HP Pulveriser (W/O Motor)', motor: 'None', size: '36*24*50', weight: '71 Kg', capacity: '45 Kg/Hr', price: 33500 },
      { model: '3 HP Pulveriser With Motor', motor: '3 HP', size: '36*24*50', weight: '120 Kg', capacity: '45 Kg/Hr', price: 45000 },
      { model: '5 HP Pulveriser (W/O Motor)', motor: 'None', size: '40*30*55', weight: '114 Kg', capacity: '60 Kg/Hr', price: 40000 },
      { model: '5 HP Pulveriser With Motor', motor: '5 HP', size: '40*30*55', weight: '150 Kg', capacity: '60 Kg/Hr', price: 58000 },
      { model: '10 HP Pulveriser (W/O Motor)', motor: 'None', size: 'Heavy', weight: '100 Kg', capacity: '100 Kg/Hr', price: 68000 },
      { model: '10 HP Pulveriser With Motor', motor: '10 HP', size: 'Heavy', weight: '100 Kg', capacity: '100 Kg/Hr', price: 83600 }
    ]
  },
  {
    sku: 'SKU-NIR-NATURAL-MASALA-GRINDER',
    name: 'Shiv Shakti Natural Masala Grinder',
    price: 38500,
    images: [
      getCloudinaryUrl('cat_nir_p20_4_natural-masala-grinder_nir-080')
    ],
    description: 'Traditional slow-temperature natural masala hammer mill for cold grinding of whole spices without evaporating aromatic volatile oils.',
    features: [
      'Preserves natural aroma, color, and essential oils of spices',
      'Multi-hammer heavy beaters with balanced flywheel',
      'Available in 2-Hammer, 3-Hammer, 4-Hammer, 6-Hammer, and 8-Hammer options',
      'Heavy square structural chassis designed for lifelong durability'
    ],
    models: [
      { model: '2 Hammer W/O Motor', motor: 'None', size: 'Standard', weight: '190 Kg', capacity: '5-7 Kg/Hr', price: 38500 },
      { model: '2 Hammer With Motor', motor: '1 HP', size: 'Standard', weight: '190 Kg', capacity: '5-7 Kg/Hr', price: 46200 },
      { model: '3 Hammer W/O Motor', motor: 'None', size: 'Standard', weight: '190 Kg', capacity: '10-12 Kg/Hr', price: 44000 },
      { model: '3 Hammer With Motor', motor: '1.5 HP', size: 'Standard', weight: '190 Kg', capacity: '10-12 Kg/Hr', price: 53900 },
      { model: '4 Hammer W/O Motor', motor: 'None', size: 'Standard', weight: '190 Kg', capacity: '15-17 Kg/Hr', price: 60500 },
      { model: '4 Hammer With Motor', motor: '2 HP', size: 'Standard', weight: '190 Kg', capacity: '15-17 Kg/Hr', price: 71000 },
      { model: '4 Hammer W/O Motor (Square)', motor: 'None', size: 'Square Body', weight: '190 Kg', capacity: '15-17 Kg/Hr', price: 82500 },
      { model: '4 Hammer (Square) With Motor', motor: '3 HP', size: 'Square Body', weight: '190 Kg', capacity: '15-17 Kg/Hr', price: 93500 },
      { model: '6 Hammer W/O Motor (Square)', motor: 'None', size: 'Square Body', weight: '220 Kg', capacity: '25-30 Kg/Hr', price: 125000 },
      { model: '6 Hammer (Square) With Motor', motor: '5 HP', size: 'Square Body', weight: '260 Kg', capacity: '25-30 Kg/Hr', price: 140000 },
      { model: '8 Hammer W/O Motor (Square)', motor: 'None', size: 'Square Body', weight: '280 Kg', capacity: '40-50 Kg/Hr', price: 165000 },
      { model: '8 Hammer (Square) With Motor', motor: '7.5 HP', size: 'Square Body', weight: '340 Kg', capacity: '40-50 Kg/Hr', price: 190000 }
    ]
  },
  {
    sku: 'SKU-NIR-VIBRO-SIFTER',
    name: 'Shiv Shakti Vibro Sifter',
    price: 48000,
    images: [
      getCloudinaryUrl('cat_nir_p22_3_vibro-sifter-machine_nir-087')
    ],
    description: 'High frequency circular vibro sifter and grading screen for flour, spices, pulses, powders, and granule classification.',
    features: [
      'Multi-plane 3D vibration for rapid de-dusting and grading',
      'Food grade stainless contact screen decks',
      'Available in 2 Feet, 3 Feet, and 4 Feet 3-Phase configurations',
      'Quick screen clamping rings for fast mesh changes'
    ],
    models: [
      { model: '2 Feet (3 Phase)', motor: '0.5 HP', size: '34*25*28', weight: '100 Kg', capacity: '2 Feet Deck', price: 48000 },
      { model: '3 Feet (3 Phase)', motor: '1 HP', size: '49*36*32', weight: '150 Kg', capacity: '3 Feet Deck', price: 70000 },
      { model: '4 Feet (3 Phase)', motor: '2 HP', size: '58*48*34', weight: '350 Kg', capacity: '4 Feet Deck', price: 120000 }
    ]
  },
  {
    sku: 'SKU-NIR-COCONUT-SHREDDING-SS',
    name: 'Shiv Shakti Coconut Shredding Machine (SS) Model',
    price: 38000,
    images: [
      getCloudinaryUrl('cat_nir_p6_3_coconut-shredding-machine_nir-023')
    ],
    description: 'Industrial coconut shredder machine in complete stainless steel body for sweet factories, bakeries, and desiccated coconut processing.',
    features: [
      'High speed rotary stainless pin drum shreds whole coconut kernel',
      'Uniform fine shredding for sweets, gravies, and drying',
      'Equipped with 1 HP high torque copper winding motor',
      'Heavy vibration-damped floor stand'
    ],
    models: [
      { model: 'Coconut Shredding Machine', motor: '1 HP', size: 'Standard', weight: '55 Kg', capacity: 'Commercial S.S.', price: 38000 }
    ]
  },

  // Page 13
  {
    sku: 'SKU-NIR-OIL-MAKER-MACHINE',
    name: 'Shiv Shakti Oil Maker Machine',
    price: 14900,
    images: [
      getCloudinaryUrl('cat_nir_p8_1_oil-expeller-machine_nir-029')
    ],
    description: 'Compact automatic cold press oil expeller for peanuts, sesame, mustard, coconut, sunflower, and flaxseed oil extraction.',
    features: [
      'All stainless steel food contact screw press chamber',
      'Cold press extraction retains 100% vitamins and natural taste',
      'Processes 2 to 3 Liters of pure cold pressed oil per hour',
      'Simple one-touch operation with automatic temperature heater'
    ],
    models: [
      { model: 'S. S. Body Oil Maker', motor: '0.25 HP', size: '18*7*10', weight: '12 Kg', capacity: '2-3 Ltr/Hr', price: 14900 }
    ]
  },
  {
    sku: 'SKU-NIR-FRENCH-FRIES-MACHINE',
    name: 'Shiv Shakti Finger Chips / French Fries Machine',
    price: 1900,
    images: [
      getCloudinaryUrl('cat_nir_p8_3_finger-chips-machine_nir-031')
    ],
    description: 'Commercial french fries and finger chips cutter. Available in manual counter levers as well as electric automatic stainless cutters.',
    features: [
      'Cuts whole potatoes into 7mm and 10mm uniform french fries in one stroke',
      'Available in Plastic Body, Cast Iron (C.I.), and Motorized Auto S.S.',
      'Hardened stainless steel cross grid blades',
      'High output for cafes, fast food, and large event catering'
    ],
    models: [
      { model: 'Plastic Body', motor: 'Manual', size: '7*10*18', weight: '6 Kg', capacity: '7mm / 10mm', price: 1900 },
      { model: 'C. I. Body', motor: 'Manual', size: '14*10*29', weight: '14 Kg', capacity: '7mm / 10mm', price: 3100 },
      { model: 'Auto S. S. Body With Motor', motor: '0.5 HP', size: '23*12*19', weight: '40 Kg', capacity: '7mm / 10mm', price: 17600 }
    ]
  },
  {
    sku: 'SKU-NIR-CABBAGE-CUTTER-MACHINE',
    name: 'Shiv Shakti Cabbage Cutter Machine',
    price: 16000,
    images: [
      getCloudinaryUrl('cat_nir_p5_2_cabbage-shredding-machine_nir-018')
    ],
    description: 'High speed commercial cabbage shredder and cutter for spring rolls, manchurian, momos, slaw, and chinese catering prep.',
    features: [
      'Rotates at 960 RPM for wafer-thin continuous cabbage shreds',
      'Processes 80 Kg to 100 Kg cabbage per hour effortlessly',
      'Stainless steel cutting rotor and feed hopper',
      'Heavy vibration-damped 1 HP motor drive'
    ],
    models: [
      { model: 'Cabbage Cutter (960 RPM)', motor: '1 HP', size: '15*15*25', weight: '60 Kg', capacity: '80-100 Kg/Hr', price: 16000 }
    ]
  },
  {
    sku: 'SKU-NIR-CARROT-JUICER-MACHINE',
    name: 'Shiv Shakti Vegetable Carrot Juicer Machine',
    price: 8000,
    images: [
      getCloudinaryUrl('cat_nir_p18_3_juicer-machine_nir-071')
    ],
    description: 'Commercial centrifugal juicer for carrots, apples, beetroot, and hard fruits with automatic dry pulp ejection.',
    features: [
      'Heavy centrifugal grating disc extracts maximum juice yield',
      'Fast 2-minute extraction rates from 2 glasses to 6 glasses per cycle',
      'Available in 0.25 HP, 0.5 HP, and 0.75 HP commercial models',
      'Stainless steel extraction basket and spouts'
    ],
    models: [
      { model: '2 Glass Model', motor: '0.25 HP', size: '10*10*15', weight: '10 Kg', capacity: '2 Glass / 2 Min', price: 8000 },
      { model: '4 Glass Model', motor: '0.5 HP', size: '11*13*16', weight: '14 Kg', capacity: '4 Glass / 2 Min', price: 10500 },
      { model: '6 Glass Model', motor: '0.75 HP', size: '13*13*19', weight: '22 Kg', capacity: '6 Glass / 2 Min', price: 13800 }
    ]
  },
  {
    sku: 'SKU-NIR-SLOW-SPEED-JUICER',
    name: 'Shiv Shakti Slow Speed Juicer Machine',
    price: 8000,
    images: [
      getCloudinaryUrl('cat_nir_p18_3_juicer-machine_nir-071')
    ],
    description: 'Cold press slow masticating juicer operating at 52 RPM for premium enzyme-rich fresh fruit and vegetable juices.',
    features: [
      'Slow cold press screw auger rotating at 52 RPM preserves nutrients',
      'Yields crystal clear juice with zero heat friction',
      'Compact countertop footprint',
      'Durable engineered gearing with quiet operation'
    ],
    models: [
      { model: 'Slow Speed Juicer Machine (52 RPM)', motor: 'Electric (52 RPM)', size: '9*8*16', weight: '10 Kg', capacity: 'Cold Press', price: 8000 }
    ]
  },
  {
    sku: 'SKU-NIR-SS-SUGARCANE-MACHINE',
    name: 'Shiv Shakti S. S. Sugarcane Machine',
    price: 16500,
    images: [
      getCloudinaryUrl('cat_nir_p18_3_juicer-machine_nir-071')
    ],
    description: 'All stainless steel 3-roller sugarcane juice extraction machine. Extracts up to 99% juice in a single pass without re-feeding.',
    features: [
      'Food grade diamond knurled SS rollers ensure complete extraction in 1 pass',
      'Available in Household, Slim Body, and Hygienic Jumbo commercial models',
      'Capacities up to 300 glasses per hour',
      'Hygienic enclosed crushing chamber with acrylic window'
    ],
    models: [
      { model: 'Household', motor: '0.25 HP', size: '12*8*12', weight: '18 Kg', capacity: '50-60 Glass/Hr', price: 16500 },
      { model: 'Slim Body Sugarcane', motor: '0.5 HP', size: '9*20*15', weight: '56 Kg', capacity: '200-250 Glass/Hr', price: 25300 },
      { model: 'Hygienic Jumbo', motor: '1 HP', size: '23*17*22', weight: '70 Kg', capacity: '200-300 Glass/Hr', price: 30900 }
    ]
  },
  {
    sku: 'SKU-NIR-ORANGE-JUICER-MACHINE',
    name: 'Shiv Shakti Orange Juicer Machine',
    price: 2000,
    images: [
      getCloudinaryUrl('cat_nir_p18_3_juicer-machine_nir-071')
    ],
    description: 'Citrus, orange, sweet lime (mosambi), and pomegranate juicer available in manual hand lever and high speed electric models.',
    features: [
      'Extracts bitterless citrus juice without crushing seeds or pith',
      'Available in Hand Juicer, Regular Electric, and 2-In-1 Electric models',
      'Electric models extract 80 to 100 glasses of juice per hour',
      'Stainless steel reamer cone and juice collection bowl'
    ],
    models: [
      { model: 'Hand Juicer', motor: 'Manual', size: '8*6*21', weight: '4 Kg', capacity: 'Manual Lever', price: 2000 },
      { model: 'Regular Juicer', motor: '0.5 HP', size: '15*15*25', weight: '19 Kg', capacity: '80-100 Glass/Hr', price: 14300 },
      { model: '2 In 1 Model', motor: '0.5 HP', size: '15*15*25', weight: '19 Kg', capacity: '80-100 Glass/Hr', price: 15500 }
    ]
  },

  // Page 14
  {
    sku: 'SKU-NIR-ICE-GOLA-MACHINE',
    name: 'Shiv Shakti Ice Gola Machine',
    price: 5500,
    images: [
      getCloudinaryUrl('cat_nir_p14_2_dry-fruit-cutting-machine-tukda_nir-054')
    ],
    description: 'Commercial ice gola and ice shaver machine with hardened shaving blades for bar golas, snow cones, and chilled catering displays.',
    features: [
      'Precision razor shaving blade shaves ice into snow-fine texture',
      'Available with high speed 1 HP motor or standalone manual mechanism',
      'Robust cast metal frame with stainless steel catch tray',
      'High speed shaving for peak summer event demand'
    ],
    models: [
      { model: 'Ice Gola M/C Without Motor', motor: 'None', size: '11*16*26', weight: '19 Kg', capacity: 'Mechanism Only', price: 5500 },
      { model: 'Ice Gola M/C With Motor', motor: '1 HP', size: '20*16*31', weight: '30 Kg', capacity: '1 HP Motorized', price: 14400 }
    ]
  },
  {
    sku: 'SKU-NIR-ICE-TUKDA-MACHINE',
    name: 'Shiv Shakti Ice Tukda Machine',
    price: 3900,
    images: [
      getCloudinaryUrl('cat_nir_p14_2_dry-fruit-cutting-machine-tukda_nir-054')
    ],
    description: 'Heavy duty commercial ice crusher (ice tukda machine) for crushing ice blocks into cubes and chunks for drinks and buffet counter storage.',
    features: [
      'Heavy cast crushing teeth break ice slabs into uniform pieces',
      'Available in Small and Big sizes, with or without electric motor',
      'Ideal for chilling bar counters, water coolers, and fresh fruit spreads',
      'Heavy vibration-damped iron housing'
    ],
    models: [
      { model: 'Small Without Motor', motor: 'None', size: '17*15*16', weight: '9 Kg', capacity: 'Small Block', price: 3900 },
      { model: 'Big Without Motor', motor: 'None', size: '18*16*18', weight: '12 Kg', capacity: 'Big Block', price: 5500 },
      { model: 'Small With Motor', motor: '0.5 HP', size: '17*15*30', weight: '36 Kg', capacity: 'Small Block Motorized', price: 12700 },
      { model: 'Big With Motor', motor: '1 HP', size: '18*16*32', weight: '42 Kg', capacity: 'Big Block Motorized', price: 15500 }
    ]
  },
  {
    sku: 'SKU-NIR-DHOKLA-STEAM-BOX',
    name: 'Shiv Shakti Dhokla Machine Steam Box',
    price: 14700,
    images: [
      getCloudinaryUrl('cat_nir_p7_1_steam-dhokla-box_nir-025')
    ],
    description: 'Commercial stainless steel steam box for dhokla, live gujarati snacks, and steamed delicacies with multi-tier tray slide racks.',
    features: [
      'Food grade stainless steel construction with heavy silicone gasket door',
      'Standard 14" x 18" x 1.25" stainless steel baking trays',
      'Capacities in 6 Tray, 8 Tray, 10 Tray, and 12 Tray models',
      'Fast steam generation with uniform heat distribution across all tiers'
    ],
    models: [
      { model: '6 Tray', motor: 'Steam Box', size: '24*25*35', weight: '39 Kg', capacity: '6 Tray (1.5 Kg/Tray)', price: 14700 },
      { model: '8 Tray', motor: 'Steam Box', size: '24*25*39', weight: '45 Kg', capacity: '8 Tray (1.5 Kg/Tray)', price: 15700 },
      { model: '10 Tray', motor: 'Steam Box', size: '24*25*46', weight: '53 Kg', capacity: '10 Tray (1.5 Kg/Tray)', price: 17800 },
      { model: '12 Tray', motor: 'Steam Box', size: '24*25*47', weight: '60 Kg', capacity: '12 Tray (1.5 Kg/Tray)', price: 19900 }
    ]
  },
  {
    sku: 'SKU-NIR-IDLI-STEAM-BOX',
    name: 'Shiv Shakti Idli Machine Steam Box',
    price: 14700,
    images: [
      getCloudinaryUrl('cat_nir_p7_2_steam-idli-box_nir-026')
    ],
    description: 'Commercial idli steaming box with multi-cavity idli plate racks for mass production in hotels, caterers, and canteens.',
    features: [
      'Equipped with 14" x 18" idli mold plates (12 idlis per plate)',
      'Stainless steel steam insulated body with heavy cam latch',
      'Capacities in 6 Tray, 8 Tray, 10 Tray, and 12 Tray configurations',
      'Cooks tender, fluffy idlis in 10 to 12 minutes'
    ],
    models: [
      { model: '6 Tray', motor: 'Steam Box', size: '24*25*35', weight: '39 Kg', capacity: '6 Tray (12 Nos/Tray)', price: 14700 },
      { model: '8 Tray', motor: 'Steam Box', size: '24*25*39', weight: '45 Kg', capacity: '8 Tray (12 Nos/Tray)', price: 15700 },
      { model: '10 Tray', motor: 'Steam Box', size: '24*25*43', weight: '53 Kg', capacity: '10 Tray (12 Nos/Tray)', price: 17800 },
      { model: '12 Tray', motor: 'Steam Box', size: '24*25*47', weight: '60 Kg', capacity: '12 Tray (12 Nos/Tray)', price: 19900 }
    ]
  },
  {
    sku: 'SKU-NIR-KHAMAN-DHOKLA-STEAM-BOX',
    name: 'Shiv Shakti Khaman Dhokla Machine Steam Box',
    price: 15700,
    images: [
      getCloudinaryUrl('cat_nir_p7_3_khaman-dhokla-box_nir-027')
    ],
    description: 'Deep tray steam box specifically built for spongy nylon khaman and vatana dhokla requiring 2.5-inch deep baking trays.',
    features: [
      'Extra-deep 14" x 18" x 2.5" stainless baking trays (2.5 Kg per tray)',
      'Heavy steam circulation channels produce high rising khaman',
      'Available in 6 Tray, 8 Tray, 10 Tray, and 12 Tray sizes',
      'Integrated water drain valve and steam escape vent'
    ],
    models: [
      { model: '6 Tray', motor: 'Steam Box', size: '24*25*40', weight: '42 Kg', capacity: '6 Tray (2.5 Kg/Tray)', price: 15700 },
      { model: '8 Tray', motor: 'Steam Box', size: '24*25*47', weight: '47 Kg', capacity: '8 Tray (2.5 Kg/Tray)', price: 17800 },
      { model: '10 Tray', motor: 'Steam Box', size: '24*25*53', weight: '55 Kg', capacity: '10 Tray (2.5 Kg/Tray)', price: 21000 },
      { model: '12 Tray', motor: 'Steam Box', size: '24*25*60', weight: '63 Kg', capacity: '12 Tray (2.5 Kg/Tray)', price: 22000 }
    ]
  },
  {
    sku: 'SKU-NIR-KHAMAN-WITH-CHHAPRI',
    name: 'Shiv Shakti Khaman Dhokla with Chhapri',
    price: 16600,
    images: [
      getCloudinaryUrl('cat_nir_p7_3_khaman-dhokla-box_nir-027')
    ],
    description: 'Khaman dhokla steam box with built-in top steam hood canopy (chhapri) to prevent condensation water from dripping onto hot khaman.',
    features: [
      'Slanted condensate deflector canopy (chhapri) preserves top texture',
      'Deep 2.5-inch trays with 2.5 Kg capacity per tray',
      'Capacities in 6 Tray, 8 Tray, and 10 Tray',
      'All stainless steel hygienic build'
    ],
    models: [
      { model: '6 Tray', motor: 'Steam Box', size: '24*25*40', weight: '45 Kg', capacity: '6 Tray (2.5 Kg/Tray)', price: 16600 },
      { model: '8 Tray', motor: 'Steam Box', size: '24*25*47', weight: '50 Kg', capacity: '8 Tray (2.5 Kg/Tray)', price: 19000 },
      { model: '10 Tray', motor: 'Steam Box', size: '24*25*53', weight: '58 Kg', capacity: '10 Tray (2.5 Kg/Tray)', price: 22500 }
    ]
  },

  // Page 15
  {
    sku: 'SKU-NIR-MASALA-GRINDER',
    name: 'Shiv Shakti Masala Grinder',
    price: 7200,
    images: [
      getCloudinaryUrl('cat_nir_p20_3_masala-grinder_nir-079')
    ],
    description: 'High speed commercial dry masala and spice batch grinder for restaurant kitchens, catering counters, and spice shops.',
    features: [
      'Heavy rotating stainless steel cutting blades at 25000 RPM',
      'Grinds whole garam masala, cinnamon, black pepper, and dry herbs in seconds',
      'Available in 500gm, 1 Kg, 2 Kg, and 3 Kg batch sizes',
      'Tilting handle for easy pouring of ground spice powder'
    ],
    models: [
      { model: '500 GM', motor: 'Electric High Speed', size: 'Standard', weight: '6 Kg', capacity: '500 gm', price: 7200 },
      { model: '1 Kg.', motor: 'Electric High Speed', size: 'Standard', weight: '9 Kg', capacity: '1 Kg', price: 11000 },
      { model: '2 Kg.', motor: 'Electric High Speed', size: 'Heavy', weight: '13 Kg', capacity: '2 Kg', price: 13300 },
      { model: '3 Kg.', motor: 'Electric High Speed', size: 'Heavy', weight: '16 Kg', capacity: '3 Kg', price: 16500 }
    ]
  },
  {
    sku: 'SKU-NIR-MASALA-PETI',
    name: 'Shiv Shakti Masala Peti',
    price: 1100,
    images: [
      getCloudinaryUrl('cat_nir_p10_1_masala-peti_nir-037')
    ],
    description: 'Stainless steel commercial multi-compartment masala box (masala peti) with individual removable containers and hinged cover.',
    features: [
      'Food grade stainless steel construction with dust-proof lid',
      'Available in 6 Box, 9 Box, and 12 Box compartments',
      'Container sizes in 500gm and 1 Kg depths',
      'Heavy duty carrying handles and latch'
    ],
    models: [
      { model: '6 Box (500gm)', motor: 'Storage', size: '16*11*4', weight: '3 Kg', capacity: '6 x 500gm', price: 1100 },
      { model: '9 Box (500gm)', motor: 'Storage', size: '16*16*4', weight: '4 Kg', capacity: '9 x 500gm', price: 1400 },
      { model: '12 Box (500gm)', motor: 'Storage', size: '21*16*4', weight: '5 Kg', capacity: '12 x 500gm', price: 1800 },
      { model: '6 Box (1 Kg)', motor: 'Storage', size: '16*11*6', weight: '4 Kg', capacity: '6 x 1 Kg', price: 1600 },
      { model: '9 Box (1 Kg)', motor: 'Storage', size: '16*16*6', weight: '5.5 Kg', capacity: '9 x 1 Kg', price: 1900 },
      { model: '12 Box (1 Kg)', motor: 'Storage', size: '21*16*6', weight: '7 Kg', capacity: '12 x 1 Kg', price: 2500 }
    ]
  },
  {
    sku: 'SKU-NIR-PIZZA-OVEN',
    name: 'Shiv Shakti Pizza Oven',
    price: 7800,
    images: [
      getCloudinaryUrl('cat_nir_p6_4_pizza-oven_nir-024')
    ],
    description: 'Commercial deck pizza and baking oven for pizzas, garlic breads, patties, and baked dishes in restaurants and food stalls.',
    features: [
      'Heavy refractory deck and dual top/bottom heating elements',
      'Independent thermostatic temperature controls up to 350°C',
      'Sizes ranging from compact 8" x 12" up to heavy 24" x 24" (12 pizzas)',
      'Insulated stainless steel door with heat-resistant handle'
    ],
    models: [
      { model: '8" x 12"', motor: 'Electric / Gas', size: '12*22*15', weight: '14 Kg', capacity: '2 Nos.', price: 7800 },
      { model: '10" x 16"', motor: 'Electric / Gas', size: '16*27*15', weight: '18 Kg', capacity: '4 Nos.', price: 8800 },
      { model: '12" x 18"', motor: 'Electric / Gas', size: '18*29*15', weight: '24 Kg', capacity: '6 Nos.', price: 9900 },
      { model: '18" x 18"', motor: 'Electric / Gas', size: '25*29*15', weight: '29 Kg', capacity: '8 Nos.', price: 11000 },
      { model: '18" x 24"', motor: 'Electric / Gas', size: '25*37*15', weight: '35 Kg', capacity: '10 Nos.', price: 16000 },
      { model: '24" x 24"', motor: 'Electric / Gas', size: '31*37*15', weight: '40 Kg', capacity: '12 Nos.', price: 19300 }
    ]
  },
  {
    sku: 'SKU-NIR-SANDWICH-GRILLER',
    name: 'Shiv Shakti Sandwich Griller',
    price: 6700,
    images: [
      getCloudinaryUrl('cat_nir_p21_4_sandwich-griller-machine_nir-084')
    ],
    description: 'Commercial panini and sandwich contact griller with heavy ribbed cast iron plates for crispy grilled sandwiches and rolls.',
    features: [
      'Heavy ribbed cast iron contact plates for even heat and grill marks',
      'Available in Single Type, Double Type, and Jumbo commercial sizes',
      'Fast 2-minute grilling cycle per sandwich batch',
      'Adjustable top plate hinge accommodates thick stuffed sandwiches'
    ],
    models: [
      { model: 'Single Type', motor: 'Electric', size: '18*13*12', weight: '9 Kg', capacity: '4 Nos.', price: 6700 },
      { model: 'Double Type', motor: 'Electric', size: '20*27*13', weight: '21 Kg', capacity: '8 Nos.', price: 12700 },
      { model: 'Jumbo Type', motor: 'Electric', size: 'Jumbo', weight: '26 Kg', capacity: '12 Nos.', price: 12000 }
    ]
  },
  {
    sku: 'SKU-NIR-DEEP-FRYER',
    name: 'Shiv Shakti Deep Fryer',
    price: 7800,
    images: [
      getCloudinaryUrl('cat_nir_p7_4_deep-fryer-machine_nir-028')
    ],
    description: 'Commercial deep fryer with stainless steel oil tanks, immersion heating elements, and wire mesh frying baskets.',
    features: [
      'Precision capillary thermostat with auto cutoff safety',
      'Available in 5 Liter and 13 Liter single and double tank models',
      'Floor stand and table top options available',
      'Food-grade stainless steel tanks with oil drain cold zone'
    ],
    models: [
      { model: '5 Ltr. Regular', motor: 'Electric', size: '27*12*16', weight: '10 Kg', capacity: '5 Ltr Single', price: 7800 },
      { model: '5 Ltr. With Stand', motor: 'Electric', size: '27*12*36', weight: '13 Kg', capacity: '5 Ltr With Stand', price: 8800 },
      { model: '5 Ltr. Double Type', motor: 'Electric', size: '27*24*15', weight: '18 Kg', capacity: '5+5 Ltr Double', price: 15500 },
      { model: '5 Ltr. Double Type With Stand', motor: 'Electric', size: '28*24*36', weight: '22 Kg', capacity: '5+5 Ltr With Stand', price: 17100 },
      { model: '13 Ltr. Regular', motor: 'Electric', size: '28*14*18', weight: '15 Kg', capacity: '13 Ltr Single', price: 15500 },
      { model: '13 Ltr. Regular With Stand', motor: 'Electric', size: '29*16*31', weight: '20 Kg', capacity: '13 Ltr With Stand', price: 17600 },
      { model: '13 Ltr. Double Type', motor: 'Electric', size: '29*32*21', weight: '30 Kg', capacity: '13+13 Ltr Double', price: 27000 },
      { model: '13 Ltr. Double Type With Stand', motor: 'Electric', size: '29*32*39', weight: '35 Kg', capacity: '13+13 Ltr With Stand', price: 32500 }
    ]
  },

  // Page 16
  {
    sku: 'SKU-NIR-ELECTRIC-KADAI',
    name: 'Shiv Shakti Electric Kadai with Stand',
    price: 6700,
    images: [
      getCloudinaryUrl('cat_nir_p11_1_electric-frying-pan_nir-041')
    ],
    description: 'Electric commercial frying kadai with heavy tubular elements and stainless steel body stand for halwai, jalebi, and snack frying.',
    features: [
      'Heavy stainless steel deep kadai bowl with tubular immersion heating',
      'Available in Round models (12" to 16") and Stand models (8" to 36")',
      'Thermostatic oil temperature controller avoids oil burning',
      'Oil capacities ranging from 5 Liters up to 30 Liters'
    ],
    models: [
      { model: '12" Kadai (Round Model)', motor: 'Electric', size: 'Round Stand', weight: '15 Kg', capacity: '5 Ltr', price: 6700 },
      { model: '16" Kadai (Round Model)', motor: 'Electric', size: 'Round Stand', weight: '20 Kg', capacity: '8 Ltr', price: 8300 },
      { model: '8" Kadai with Stand', motor: 'Electric', size: '23*23*32', weight: '21 Kg', capacity: '6 Ltr', price: 12200 },
      { model: '20" Kadai with Stand', motor: 'Electric', size: '25*25*32', weight: '23 Kg', capacity: '10 Ltr', price: 17100 },
      { model: '22" Kadai with Stand', motor: 'Electric', size: '26.5*26.5*33', weight: '27 Kg', capacity: '15 Ltr', price: 20500 },
      { model: '24" Kadai with Stand', motor: 'Electric', size: '28*28*34', weight: '31 Kg', capacity: '20 Ltr', price: 23200 },
      { model: '26" Kadai with Stand', motor: 'Electric', size: '30*30*36', weight: '35 Kg', capacity: '24 Ltr', price: 24800 },
      { model: '28" Kadai with Stand', motor: 'Electric', size: '33.5*33.5*38', weight: '40 Kg', capacity: '26 Ltr', price: 29000 },
      { model: '30" Kadai with Stand', motor: 'Electric', size: '35*35*32', weight: '44 Kg', capacity: '28 Ltr', price: 33000 },
      { model: '36" Kadai with Stand', motor: 'Electric', size: '41*41*32', weight: '56 Kg', capacity: '30 Ltr', price: 52900 }
    ]
  },
  {
    sku: 'SKU-NIR-DEHYDRATOR-MACHINE',
    name: 'Shiv Shakti Dehydrator Machine',
    price: 18000,
    images: [
      getCloudinaryUrl('cat_nir_p21_3_rotary-oven_nir-083')
    ],
    description: 'Commercial hot air circulation food dehydrator for fruits, vegetables, herbs, spices, dry snacks, and papad drying.',
    features: [
      'Cross-flow convection fan circulates hot air evenly across all trays',
      'Digital timer and thermostatic temperature adjustment from 30°C to 90°C',
      'Models available from 6 Trays up to massive 96 Trays (120 Kg batch)',
      'All stainless steel food contact trays and insulated housing'
    ],
    models: [
      { model: '6 Tray', motor: 'Electric Fan', size: '53*39*37.5', weight: '9.5 Kg', capacity: '3-5 Kg / Batch', price: 18000 },
      { model: '10 Tray', motor: 'Electric Fan', size: '47*41.5*50', weight: '10 Kg', capacity: '5-8 Kg / Batch', price: 23000 },
      { model: '12 Tray', motor: 'Electric Fan', size: '64*54*52', weight: '20 Kg', capacity: '10-15 Kg / Batch', price: 35000 },
      { model: '20 Tray', motor: 'Electric Fan', size: '64*54*89.5', weight: '29 Kg', capacity: '20-25 Kg / Batch', price: 47000 },
      { model: '24 Tray', motor: 'Electric Fan', size: '64*54*89.5', weight: '29 Kg', capacity: '25-30 Kg / Batch', price: 55000 },
      { model: '40 Tray', motor: 'Electric Fan', size: '65*52*181.5', weight: '56.5 Kg', capacity: '40-50 Kg / Batch', price: 90000 },
      { model: '48 Tray', motor: 'Electric Fan', size: '65*52*181.5', weight: '106 Kg', capacity: '50-60 Kg / Batch', price: 100000 },
      { model: '96 Tray', motor: 'Electric Fan', size: '105*66*186', weight: '136.8 Kg', capacity: '100-120 Kg / Batch', price: 180000 }
    ]
  },
  {
    sku: 'SKU-NIR-JAGGERY-CRUSHER',
    name: 'Shiv Shakti Jaggery Crusher Machine',
    price: 25000,
    images: [
      getCloudinaryUrl('cat_nir_p20_1_2-in-1-pulverizer_nir-077')
    ],
    description: 'Electric commercial jaggery (gur) breaking and crushing machine for sweet shops, bakeries, and chikki making units.',
    features: [
      'Heavy duty crusher drum pulverizes solid jaggery blocks without melting',
      'High capacity processing 250 Kg jaggery per hour',
      'Equipped with 1 HP copper winding motor',
      'Sanitary stainless steel discharge chute'
    ],
    models: [
      { model: 'Jaggery Crusher Machine', motor: '1 HP', size: '12*9*36', weight: '50 Kg', capacity: '250 Kg/Hr', price: 25000 }
    ]
  },

  // Page 17
  {
    sku: 'SKU-NIR-RECTANGULAR-BATCH-FRYER',
    name: 'Shiv Shakti Rectangular Fryer 110 to 140 Ltr.',
    price: 160000,
    images: [
      getCloudinaryUrl('cat_nir_p16_4_rectangular-batch-fryer-machine_nir-064')
    ],
    description: 'Fully automatic rectangular continuous batch fryer with 22" x 46" pan for kurkure, fryums, wafers, moong dal, and chana dal.',
    features: [
      'Pan size 22" x 46" with full body dimensions 100" x 60" x 85"',
      'Power composition 3.25 HP fully automatic conveyance mechanism',
      'Massive throughput: Kurkure/Fryums 250 Kg/Hr, Potato/Banana Wafer 55 Kg/Hr',
      'Moong Dal 100-120 Kg/Hr, Chana Dal 120-150 Kg/Hr'
    ],
    models: [
      { model: 'Pan Size 22*46 (110-140 Ltr)', motor: '3.25 HP Fully Auto', size: '100*60*85', weight: '380 Kg', capacity: '110-140 Ltr Pan', price: 160000 }
    ]
  },
  {
    sku: 'SKU-NIR-ROASTING-MACHINE-TILTING',
    name: 'Shiv Shakti Roasting Machine (Tilting Type)',
    price: 75000,
    images: [
      getCloudinaryUrl('cat_nir_p22_1_tilting-roasting-machine_nir-085')
    ],
    description: 'Tilting gas roasting machine for grains, peanuts, spices, semolina, and nuts with rotating drum and twin 12-inch gas burners.',
    features: [
      'Dual 12-inch industrial gas burners with verm gear reduction',
      'Food grade SS 202 bowl with 16 RPM uniform rotating motion',
      'Tilting body mechanism for instant batch discharge',
      'Roasts 15 to 20 Kg per batch evenly without scorching'
    ],
    models: [
      { model: 'Roasting Machine (Tilting Type)', motor: '1 HP (1440 RPM)', size: '40*52*58', weight: '200 Kg', capacity: '15-20 Kg / Batch', price: 75000 }
    ]
  },
  {
    sku: 'SKU-NIR-MASKA-MACHINE',
    name: 'Shiv Shakti Maska Machine',
    price: 26000,
    images: [
      getCloudinaryUrl('cat_nir_p12_2_maska-machine_nir-046')
    ],
    description: 'Stainless steel body maska and hung curd mixing machine for shrikhand, flavored yogurts, and butter creams.',
    features: [
      'Stainless steel body with high torque 1.5 HP motor',
      'Homogenizes hung curd (chakka) into ultra-smooth maska base',
      'Processing capacity of 30 to 40 Kg per hour',
      'Hygienic enclosed design for commercial sweet shops'
    ],
    models: [
      { model: 'S. S. Body 1.5 HP', motor: '1.5 HP', size: '25*20*39', weight: '60 Kg', capacity: '30-40 Kg/Hr', price: 26000 }
    ]
  },
  {
    sku: 'SKU-NIR-SHRIKHAND-MIXING',
    name: 'Shiv Shakti Shrikhand Mixing Machine',
    price: 19000,
    images: [
      getCloudinaryUrl('cat_nir_p14_3_shrikhand-mixer-machine_nir-055')
    ],
    description: 'Commercial shrikhand and amrakhand mixing and kneading machine for sweet makers. Blends sugar, saffron, and nuts thoroughly.',
    features: [
      'Planetary paddle arms aerate and blend maska with fine sugar',
      'Capacities ranging from 5 Kg up to 50 Kg per batch',
      'Tilting bowl allows fast unloading of finished shrikhand',
      'All stainless steel food contact bowl and arms'
    ],
    models: [
      { model: '5 Kg', motor: '0.5 HP', size: '25*18*35', weight: '90 Kg', capacity: '1-5 Kg/Batch', price: 19000 },
      { model: '10 Kg', motor: '1 HP', size: '23*21*48', weight: '98 Kg', capacity: '3-10 Kg/Batch', price: 21500 },
      { model: '15 Kg', motor: '1 HP', size: '27*21*48', weight: '115 Kg', capacity: '7-15 Kg/Batch', price: 24000 },
      { model: '20 Kg', motor: '1.5 HP', size: '35*25*40', weight: '125 Kg', capacity: '10-20 Kg/Batch', price: 28500 },
      { model: '30 Kg', motor: '2 HP', size: '40*30*45', weight: '135 Kg', capacity: '15-30 Kg/Batch', price: 34000 },
      { model: '50 Kg', motor: '3 HP', size: '45*35*52', weight: '166 Kg', capacity: '25-50 Kg/Batch', price: 56500 }
    ]
  },

  // Page 18
  {
    sku: 'SKU-NIR-GARLIC-BREAKER',
    name: 'Shiv Shakti Garlic Breaker Machine',
    price: 19250,
    images: [
      getCloudinaryUrl('cat_nir_p6_2_garlic-peeler-machine_nir-022')
    ],
    description: 'Commercial garlic bulb breaker machine. Breaks whole garlic heads into individual cloves without damaging clove flesh.',
    features: [
      'Specially designed rubber rollers separate garlic cloves cleanly',
      'Prepares cloves for peeling machine feed chute',
      'Available with 1 HP motor or standalone head',
      'Throughput capacity of 60 to 70 Kg garlic per hour'
    ],
    models: [
      { model: 'M. S. Body Without Motor', motor: 'None', size: 'Standard', weight: '40 Kg', capacity: 'Mechanism Only', price: 19250 },
      { model: 'M. S. Body With Motor', motor: '1 HP', size: 'Standard', weight: '45 Kg', capacity: '60-70 Kg/Hr', price: 24200 }
    ]
  },
  {
    sku: 'SKU-NIR-GARLIC-PEELER',
    name: 'Shiv Shakti Garlic Peeler Machine',
    price: 8300,
    images: [
      getCloudinaryUrl('cat_nir_p6_2_garlic-peeler-machine_nir-022')
    ],
    description: 'Dry garlic peeling machine with silicone rubber peeling paddles and stainless steel hopper for fast clove skin removal.',
    features: [
      'Gentle peeling action removes dry papery skin without bruising cloves',
      'All stainless steel food contact body',
      'Peels 10 to 12 Kg garlic cloves per hour',
      'Energy efficient 0.25 HP copper motor'
    ],
    models: [
      { model: 'S. S. Body', motor: '0.25 HP', size: '11*9*23', weight: '15 Kg', capacity: '10-12 Kg/Hr', price: 8300 }
    ]
  },
  {
    sku: 'SKU-NIR-SS-CHULA',
    name: 'Shiv Shakti S. S. Chula',
    price: 1700,
    images: [
      getCloudinaryUrl('cat_nir_p9_3_gas-stove_nir-035')
    ],
    description: 'Commercial stainless steel heavy duty bhatti and gas stove burner for catering pans, degh, and heavy kadai cooking.',
    features: [
      'Heavy gauge stainless steel round and square frames',
      'High thermal efficiency cast iron bhatti burners',
      'Available in Round (10" to 15") and Square (10" to 18") sizes',
      'Supports heavy catering vessels up to 100 kg weight'
    ],
    models: [
      { model: '10" x 10" Round', motor: 'Gas Bhatti', size: '10" x 10" Round', weight: '4 Kg', capacity: 'Heavy Duty', price: 1700 },
      { model: '10" x 10" Square', motor: 'Gas Bhatti', size: '10" x 10" Square', weight: '3.2 Kg', capacity: 'Heavy Duty', price: 1700 },
      { model: '12" x 12" Round', motor: 'Gas Bhatti', size: '12" x 12" Round', weight: '5 Kg', capacity: 'Heavy Duty', price: 1800 },
      { model: '12" x 12" Square', motor: 'Gas Bhatti', size: '12" x 12" Square', weight: '3.5 Kg', capacity: 'Heavy Duty', price: 1800 },
      { model: '15" x 15" Round', motor: 'Gas Bhatti', size: '15" x 15" Round', weight: '7.5 Kg', capacity: 'Heavy Duty', price: 2200 },
      { model: '15" x 15" Square', motor: 'Gas Bhatti', size: '15" x 15" Square', weight: '5.5 Kg', capacity: 'Heavy Duty', price: 2200 },
      { model: '18" x 18" Square', motor: 'Gas Bhatti', size: '18" x 18" Square', weight: '10 Kg', capacity: 'Heavy Duty', price: 2800 }
    ]
  },
  {
    sku: 'SKU-NIR-ANIMAL-FEED-PELLET',
    name: 'Shiv Shakti Animal Feed Pellet Machine',
    price: 25000,
    images: [
      getCloudinaryUrl('cat_nir_p8_2_animal-feed-pellet-machine_nir-030')
    ],
    description: 'Flat die animal feed pellet making machine for cattle feed, poultry feed, goat feed, and fish pellet manufacturing.',
    features: [
      'Heavy Crown Premium reduction gear box for high density pellets',
      'Interchangeable die plates for 4mm to 10mm pellet diameters',
      'Available in 3 HP, 5 HP, and 7 HP with or without motor',
      'Hourly production capacities up to 300 Kg pellets per hour'
    ],
    models: [
      { model: '3 HP W/O Motor (4 Inch)', motor: 'None', size: '32*12*24', weight: '70 Kg', capacity: '100-130 Kg/Hr (4-10mm)', price: 25000 },
      { model: '3 HP (4 Inch)', motor: '3 HP', size: '32*12*24', weight: '92 Kg', capacity: '100-130 Kg/Hr (4-10mm)', price: 34500 },
      { model: '5 HP W/O Motor (6 Inch)', motor: 'None', size: '38*12*26', weight: '85 Kg', capacity: '150-180 Kg/Hr (4-10mm)', price: 27500 },
      { model: '5 HP (6 Inch)', motor: '5 HP', size: '38*12*26', weight: '120 Kg', capacity: '150-180 Kg/Hr (4-10mm)', price: 40000 },
      { model: '7 HP W/O Motor (8 Inch)', motor: 'None', size: '42*12*29', weight: '95 Kg', capacity: '200-300 Kg/Hr (4-10mm)', price: 29500 },
      { model: '7 HP (8 Inch)', motor: '7 HP', size: '42*12*29', weight: '135 Kg', capacity: '200-300 Kg/Hr (4-10mm)', price: 45000 }
    ]
  },

  // Page 19
  {
    sku: 'SKU-NIR-CHINESE-GAS-BURNER',
    name: 'Shiv Shakti Chinese Gas Burner',
    price: 15500,
    images: [
      getCloudinaryUrl('cat_nir_p9_4_chinese-gas-range_nir-036')
    ],
    description: 'Commercial stainless steel Chinese cooking gas range with high pressure jet burners and water faucet splashback.',
    features: [
      'High pressure jet burners generate authentic wok hei heat',
      'Heavy stainless steel wok rings with rear splashback panel',
      'Available in 1 Burner, 2 Burner, and 3 Burner configurations',
      'Drainage trough for continuous wok cooling water flow'
    ],
    models: [
      { model: '1 Burner', motor: 'Gas Range', size: '21*23*36', weight: '35 Kg', capacity: '1 Wok Station', price: 15500 },
      { model: '2 Burner', motor: 'Gas Range', size: '26*45*36', weight: '53 Kg', capacity: '2 Wok Station', price: 22000 },
      { model: '3 Burner', motor: 'Gas Range', size: '26*72*36', weight: '83 Kg', capacity: '3 Wok Station', price: 26500 }
    ]
  },
  {
    sku: 'SKU-NIR-SS-CHAPATI-DOSA-PUFFER',
    name: 'Shiv Shakti S. S. Chapati & Dosa Puffer',
    price: 10500,
    images: [
      getCloudinaryUrl('cat_nir_p9_1_chapati-puffer_nir-033'),
      getCloudinaryUrl('cat_nir_p9_2_dosa-puffer_nir-034')
    ],
    description: 'Commercial stainless steel chapati puffing bhatti and dosa plate table. Available with or without under-shelf stand.',
    features: [
      'Heavy polished steel tawa plate with uniform gas burner distribution',
      'Integrated wire mesh side puffer station for instant chapati rising',
      'Sizes in 1.5 x 3 Feet and 2 x 4 Feet',
      'Available tabletop or with heavy stainless stand'
    ],
    models: [
      { model: 'Dosa Puffer 1.5 x 3 Feet', motor: 'Gas', size: '18*39*12', weight: '38 Kg', capacity: '1.5 x 3 Feet', price: 10500 },
      { model: 'Dosa Puffer with Stand 1.5 x 3 Feet', motor: 'Gas', size: '18*39*32', weight: '45 Kg', capacity: '1.5 x 3 Feet Stand', price: 11000 },
      { model: 'Chapati Puffer 1.5 x 3 Feet', motor: 'Gas', size: '18*39*12', weight: '38 Kg', capacity: '1.5 x 3 Feet', price: 11000 },
      { model: 'Chapati Puffer with Stand 1.5 x 3 Feet', motor: 'Gas', size: '18*39*32', weight: '45 Kg', capacity: '1.5 x 3 Feet Stand', price: 12200 },
      { model: 'Dosa Puffer 2 x 4 Feet', motor: 'Gas', size: '24*51*15', weight: '60 Kg', capacity: '2 x 4 Feet', price: 17100 },
      { model: 'Dosa Puffer with Stand 2 x 4 Feet', motor: 'Gas', size: '24*51*32', weight: '65 Kg', capacity: '2 x 4 Feet Stand', price: 17600 },
      { model: 'Chapati Puffer 2 x 4 Feet', motor: 'Gas', size: '24*51*15', weight: '60 Kg', capacity: '2 x 4 Feet', price: 17600 },
      { model: 'Chapati Puffer with Stand 2 x 4 Feet', motor: 'Gas', size: '24*51*32', weight: '65 Kg', capacity: '2 x 4 Feet Stand', price: 19800 }
    ]
  },
  {
    sku: 'SKU-NIR-SS-BAIN-MARIE',
    name: 'Shiv Shakti S. S. Bain Marie',
    price: 13000,
    images: [
      getCloudinaryUrl('cat_nir_p10_4_bain-marie_nir-040')
    ],
    description: 'Stainless steel hot water bain marie food warmer counter for buffet lines, banquet catering, and restaurant service.',
    features: [
      'Keeps gravies, dals, and cooked foods hot at serving temperature without burning',
      'Available in 4, 6, 8, 10, 12, and 14 bowl setups in Round and Square pans',
      'Table top and full stand options available with gas or electric heating',
      'Food-grade stainless steel with individual lids'
    ],
    models: [
      { model: '4 Bowl Table Top (Round)', motor: 'Bain Marie', size: 'Table Top', weight: '25 Kg', capacity: '4 Round Bowls', price: 13000 },
      { model: '4 Bowl with Stand (Round)', motor: 'Bain Marie', size: 'With Stand', weight: '32 Kg', capacity: '4 Round Bowls', price: 15000 },
      { model: '6 Bowl Table Top (Round)', motor: 'Bain Marie', size: 'Table Top', weight: '30 Kg', capacity: '6 Round Bowls', price: 16000 },
      { model: '6 Bowl with Stand (Round)', motor: 'Bain Marie', size: 'With Stand', weight: '38 Kg', capacity: '6 Round Bowls', price: 18000 },
      { model: '8 Bowl Table Top (Round)', motor: 'Bain Marie', size: 'Table Top', weight: '35 Kg', capacity: '8 Round Bowls', price: 17000 },
      { model: '8 Bowl with Stand (Round)', motor: 'Bain Marie', size: 'With Stand', weight: '45 Kg', capacity: '8 Round Bowls', price: 20000 },
      { model: '10 Bowl Table Top (Round)', motor: 'Bain Marie', size: 'Table Top', weight: '40 Kg', capacity: '10 Round Bowls', price: 19000 },
      { model: '10 Bowl with Stand (Round)', motor: 'Bain Marie', size: 'With Stand', weight: '52 Kg', capacity: '10 Round Bowls', price: 21000 },
      { model: '12 Bowl Table Top (Round)', motor: 'Bain Marie', size: 'Table Top', weight: '46 Kg', capacity: '12 Round Bowls', price: 21500 },
      { model: '12 Bowl with Stand (Round)', motor: 'Bain Marie', size: 'With Stand', weight: '60 Kg', capacity: '12 Round Bowls', price: 23500 },
      { model: '14 Bowl Table Top (Round)', motor: 'Bain Marie', size: 'Table Top', weight: '52 Kg', capacity: '14 Round Bowls', price: 29500 },
      { model: '14 Bowl with Stand (Round)', motor: 'Bain Marie', size: 'With Stand', weight: '68 Kg', capacity: '14 Round Bowls', price: 31500 },
      { model: '4 Bowl Table Top (Square)', motor: 'Bain Marie', size: 'Table Top', weight: '26 Kg', capacity: '4 Square Bowls', price: 15000 },
      { model: '4 Bowl with Stand (Square)', motor: 'Bain Marie', size: 'With Stand', weight: '34 Kg', capacity: '4 Square Bowls', price: 17000 },
      { model: '6 Bowl Table Top (Square)', motor: 'Bain Marie', size: 'Table Top', weight: '32 Kg', capacity: '6 Square Bowls', price: 19000 },
      { model: '6 Bowl with Stand (Square)', motor: 'Bain Marie', size: 'With Stand', weight: '40 Kg', capacity: '6 Square Bowls', price: 21000 },
      { model: '8 Bowl Table Top (Square)', motor: 'Bain Marie', size: 'Table Top', weight: '38 Kg', capacity: '8 Square Bowls', price: 21000 },
      { model: '8 Bowl with Stand (Square)', motor: 'Bain Marie', size: 'With Stand', weight: '48 Kg', capacity: '8 Square Bowls', price: 24000 },
      { model: '10 Bowl Table Top (Square)', motor: 'Bain Marie', size: 'Table Top', weight: '44 Kg', capacity: '10 Square Bowls', price: 24000 },
      { model: '10 Bowl with Stand (Square)', motor: 'Bain Marie', size: 'With Stand', weight: '56 Kg', capacity: '10 Square Bowls', price: 26000 },
      { model: '12 Bowl Table Top (Square)', motor: 'Bain Marie', size: 'Table Top', weight: '50 Kg', capacity: '12 Square Bowls', price: 27500 },
      { model: '12 Bowl with Stand (Square)', motor: 'Bain Marie', size: 'With Stand', weight: '64 Kg', capacity: '12 Square Bowls', price: 29500 },
      { model: '14 Bowl Table Top (Square)', motor: 'Bain Marie', size: 'Table Top', weight: '58 Kg', capacity: '14 Square Bowls', price: 36500 },
      { model: '14 Bowl with Stand (Square)', motor: 'Bain Marie', size: 'With Stand', weight: '74 Kg', capacity: '14 Square Bowls', price: 38500 }
    ]
  },

  // Page 20
  {
    sku: 'SKU-NIR-HAND-OPERATED-SEV',
    name: 'Shiv Shakti Hand Operated Sev Machine',
    price: 1900,
    images: [
      getCloudinaryUrl('cat_nir_p10_2_sev-machine_nir-038')
    ],
    description: 'Manual lever-action brass / steel sev and gathiya maker for live event snack frying and sweet shop counters.',
    features: [
      'Heavy metal cylinder with precision threaded screw or lever plunger',
      'Available in Galvanize Body and Stainless Steel Body',
      'Includes multiple traditional namkeen and jalebi disc plates',
      'Lightweight and easily mountable on live frying kadai brackets'
    ],
    models: [
      { model: 'Galvanize Body', motor: 'Manual', size: '28*10*7', weight: '6 Kg', capacity: 'Manual Press', price: 1900 },
      { model: 'Steel Body', motor: 'Manual', size: '28*10*7', weight: '8 Kg', capacity: 'Manual Press', price: 4400 }
    ]
  },
  {
    sku: 'SKU-NIR-ROTARY-OVEN',
    name: 'Shiv Shakti Rotary Oven',
    price: 220000,
    images: [
      getCloudinaryUrl('cat_nir_p21_3_rotary-oven_nir-083')
    ],
    description: 'Industrial revolving trolley rotary rack bakery oven for bread, buns, cookies, rusk, and biscuits with digital temperature profiling.',
    features: [
      'Revolving rack mechanism guarantees 100% uniform color and crust',
      'Forced air convection system with low fuel consumption burner',
      'Models available in 24 Tray, 36 Tray, 48 Tray, and 72 Tray capacities',
      'Complete stainless steel internal chamber with steam injection'
    ],
    models: [
      { model: '24 Tray', motor: 'Rotary Rack', size: 'Bakery Rack', weight: '650 Kg', capacity: '24 Tray Trolley', price: 220000 },
      { model: '36 Tray', motor: 'Rotary Rack', size: 'Bakery Rack', weight: '850 Kg', capacity: '36 Tray Trolley', price: 286000 },
      { model: '48 Tray', motor: 'Rotary Rack', size: 'Bakery Rack', weight: '1100 Kg', capacity: '48 Tray Trolley', price: 352000 },
      { model: '72 Tray', motor: 'Rotary Rack', size: 'Bakery Rack', weight: '1450 Kg', capacity: '72 Tray Trolley', price: 396000 }
    ]
  },

  // Page 21
  {
    sku: 'SKU-NIR-BREAD-RUSK-CUTTER',
    name: 'Shiv Shakti Bread / Rusk Cutter',
    price: 38500,
    images: [
      getCloudinaryUrl('cat_nir_p22_2_bread-crust-cutter-machine_nir-086')
    ],
    description: 'High capacity bread and rusk slicing machine with adjustable blade pitch and stainless steel reciprocating cutter blades.',
    features: [
      'Mild steel structural body with food grade stainless cutting blades',
      'Powered by 1 HP copper motor for fast continuous bakery slicing',
      'Adjustable 1-inch cutting thickness gauge for rusks and bread loaves',
      'Heavy 130 Kg chassis ensures vibration-free slicing'
    ],
    models: [
      { model: 'Bread / Rusk Cutter (1 HP)', motor: '1 HP', size: '65 x 34 x 43', weight: '130 Kg', capacity: '1" Adjustable', price: 38500 }
    ]
  },
  {
    sku: 'SKU-NIR-BREAD-CUTTER',
    name: 'Shiv Shakti Bread Cutter',
    price: 27600,
    images: [
      getCloudinaryUrl('cat_nir_p22_2_bread-crust-cutter-machine_nir-086')
    ],
    description: 'Commercial bread loaf slicer operating at 2280 RPM. Slices full sandwich loaves into perfectly uniform sandwich bread slices.',
    features: [
      'High speed 2280 RPM cutting action produces clean slices without crumbs',
      '0.5 HP energy-saving commercial motor',
      'Compact bakery table footprint',
      'Integrated crumb collection drawer'
    ],
    models: [
      { model: 'Bread Cutter (0.5 HP, 2280 RPM)', motor: '0.5 HP (2280 RPM)', size: '20*32*17', weight: '46 Kg', capacity: 'Bread Loaf', price: 27600 }
    ]
  },
  {
    sku: 'SKU-NIR-MANCHURIAN-BALL-MACHINE',
    name: 'Shiv Shakti Manchurian Ball Machine',
    price: 7800,
    images: [
      getCloudinaryUrl('cat_nir_p8_4_manchurian-ball-machine_nir-032')
    ],
    description: 'Compact automatic veg manchurian ball making and dropping machine for chinese caterers, fast food stalls, and restaurants.',
    features: [
      'All stainless steel food contact bowl and cutting dies',
      'Includes 18mm and 25mm diameter ball forming holes',
      'Bowl capacity of 3 Kg batter per fill',
      'Drops perfectly round manchurian balls directly into frying oil'
    ],
    models: [
      { model: 'Manchurian Ball Machine', motor: 'Electric Mechanism', size: '23 x 41 x 28', weight: '10 Kg', capacity: '3 Kg Bowl (18/25mm)', price: 7800 }
    ]
  },
  {
    sku: 'SKU-NIR-SEMI-PAPAD-MACHINE',
    name: 'Shiv Shakti Semi Papad Making Machine',
    price: 16500,
    images: [
      getCloudinaryUrl('cat_nir_p10_3_papad-machine_nir-039')
    ],
    description: 'Semi-automatic papad press and rolling machine for urad, moong, and rice papad production at high daily volumes.',
    features: [
      'Heavy dual pressing plate mechanism driven by 0.5 HP reduction motor',
      'Rolls ultra-thin circular papads with uniform thickness',
      'Daily production capacity of 55 to 60 Kg papad',
      'Durable cast metal frame with stainless steel contact discs'
    ],
    models: [
      { model: 'Semi Papad Making Machine', motor: '0.5 HP', size: '27*30*18', weight: '65 Kg', capacity: '55-60 Kg / Day', price: 16500 }
    ]
  },
  {
    sku: 'SKU-NIR-DIESEL-BHATTI',
    name: 'Shiv Shakti Diesel Bhatti',
    price: 15000,
    images: [
      getCloudinaryUrl('cat_nir_p9_3_gas-stove_nir-035')
    ],
    description: 'Commercial diesel-fired high flame bhatti with electric blower burner for mass event catering and outdoor wedding feasts.',
    features: [
      'Generates extreme high BTU cooking heat for giant catering cauldrons (degh)',
      'Equipped with 0.25 HP forced air draft blower motor',
      'Available in Single Diesel Bhatti and 2-In-1 (Diesel + Gas) Bhatti models',
      'Heavy 20 Liter fuel tank with flow control regulator valve'
    ],
    models: [
      { model: 'Diesel Bhatti', motor: '0.25 HP Blower', size: '49*19*23', weight: '35 Kg', capacity: '20 Ltr. Tank', price: 15000 },
      { model: '2 In 1 Bhatti (Diesel + Gas)', motor: '0.25 HP Blower', size: '49*19*23', weight: '38 Kg', capacity: '20 Ltr. Tank', price: 17000 }
    ]
  },

  // Page 22
  {
    sku: 'SKU-NIR-TANDOOR-BHATTI',
    name: 'Shiv Shakti Tandur Bhathhi',
    price: 6100,
    images: [
      getCloudinaryUrl('cat_nir_p22_4_tandoor-bhatti_nir-088')
    ],
    description: 'Commercial mild steel (M.S.) tandoor bhatti with authentic clay pot liner and rockwool thermal insulation for rotis, naans, and tikkas.',
    features: [
      'Authentic clay pot interior creates crisp, smoked restaurant naans',
      'Heavy mild steel outer casing with cast iron top ring',
      'Thermal rockwool insulation retains intense heat for hours',
      'Castor wheels attached for easy positioning at live banquet counters'
    ],
    models: [
      { model: 'M. S. Tandur Bhathhi', motor: 'Coal / Gas', size: 'Commercial Standard', weight: '65 Kg', capacity: 'Live Tandoor', price: 6100 }
    ]
  },
  {
    sku: 'SKU-NIR-HOT-POT',
    name: 'Shiv Shakti Hot Pot',
    price: 2600,
    images: [
      getCloudinaryUrl('cat_nir_p11_2_hot-pot_nir-042')
    ],
    description: 'Commercial stainless steel double-wall insulated hot pot casserole for keeping chapatis, rotis, rice, and curries hot on buffet lines.',
    features: [
      'Double-walled stainless steel construction with high-efficiency PUF insulation',
      'Heavy twist-lock lid seals in steam and freshness for up to 6 hours',
      'Capacities available from 2.5 Liters up to 40 Liters',
      'Integrated side handles for safe banquet transport'
    ],
    models: [
      { model: '2.5 Liter', motor: 'Insulated', size: '2.5 Liter', weight: '2 Kg', capacity: '2.5 Ltr', price: 2600 },
      { model: '5 Liter', motor: 'Insulated', size: '5 Liter', weight: '3 Kg', capacity: '5 Ltr', price: 2800 },
      { model: '7.5 Liter', motor: 'Insulated', size: '7.5 Liter', weight: '4 Kg', capacity: '7.5 Ltr', price: 3100 },
      { model: '10 Liter', motor: 'Insulated', size: '10 Liter', weight: '5 Kg', capacity: '10 Ltr', price: 3400 },
      { model: '15 Liter', motor: 'Insulated', size: '15 Liter', weight: '6 Kg', capacity: '15 Ltr', price: 3900 },
      { model: '20 Liter', motor: 'Insulated', size: '20 Liter', weight: '7.5 Kg', capacity: '20 Ltr', price: 4100 },
      { model: '25 Liter', motor: 'Insulated', size: '25 Liter', weight: '9 Kg', capacity: '25 Ltr', price: 5500 },
      { model: '30 Liter', motor: 'Insulated', size: '30 Liter', weight: '10.5 Kg', capacity: '30 Ltr', price: 6100 },
      { model: '40 Liter', motor: 'Insulated', size: '40 Liter', weight: '13 Kg', capacity: '40 Ltr', price: 7200 }
    ]
  },
  {
    sku: 'SKU-NIR-WATER-COOLER',
    name: 'Shiv Shakti Water Cooler',
    price: 25400,
    images: [
      getCloudinaryUrl('cat_nir_p23_1_water-cooler_nir-089')
    ],
    description: 'Commercial stainless steel chilled drinking water cooler for banquets, wedding halls, restaurants, and catering centers.',
    features: [
      'Food grade stainless steel internal storage tank and heavy chrome taps',
      'Eco-friendly refrigeration compressor with rapid chilling cycle',
      'Capacities from 20 Liters (20SP1) up to 200 Liters (200SP3+)',
      'Digital thermostat with automatic compressor cutoff'
    ],
    models: [
      { model: '20SP1 (20 Ltr)', motor: 'Compressor', size: '14 x 14 x 39', weight: '35 Kg', capacity: '20 Ltr Storage', price: 25400 },
      { model: '40SP2+ (40 Ltr)', motor: 'Compressor', size: '15 x 15 x 48', weight: '45 Kg', capacity: '40 Ltr Storage', price: 30900 },
      { model: '60SP2+ (60 Ltr)', motor: 'Compressor', size: '18 x 17 x 50', weight: '55 Kg', capacity: '60 Ltr Storage', price: 39600 },
      { model: '80SP2+ (80 Ltr)', motor: 'Compressor', size: '22 x 18 x 51', weight: '70 Kg', capacity: '80 Ltr Storage', price: 48500 },
      { model: '100SP2+ (100 Ltr)', motor: 'Compressor', size: '25 x 18 x 52', weight: '85 Kg', capacity: '100 Ltr Storage', price: 52900 },
      { model: '200SP3+ (200 Ltr)', motor: 'Compressor', size: '33 x 20 x 64', weight: '120 Kg', capacity: '200 Ltr Storage', price: 88000 }
    ]
  }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function main() {
  console.log(`========================================================`);
  console.log(`🚀 RE-SEEDING CATERING EQUIPMENT MACHINES FROM PDF`);
  console.log(`========================================================\n`);

  console.log(`Checking existing crates in catering -> catering-equipment...`);
  const cratesCount = await prisma.product.count({
    where: {
      categoryId: 'catering',
      subcategoryId: 'catering-equipment',
      sku: { startsWith: 'SKU-CRATE' }
    }
  });
  console.log(`Found ${cratesCount} CRATES in database. These will NOT be touched.`);

  // Delete all non-crate products in catering equipment
  console.log(`Deleting previous machine products in catering-equipment...`);
  const deleteResult = await prisma.product.deleteMany({
    where: {
      categoryId: 'catering',
      subcategoryId: 'catering-equipment',
      NOT: {
        sku: { startsWith: 'SKU-CRATE' }
      }
    }
  });
  console.log(`✅ Deleted ${deleteResult.count} obsolete machine products.\n`);

  console.log(`Inserting ${machinesData.length} newly parsed machine products with exact PDF names...`);

  let inserted = 0;
  for (const m of machinesData) {
    const slug = slugify(m.name);
    const createdProduct = await prisma.product.create({
      data: {
        sku: m.sku,
        name: m.name,
        slug: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
        categoryId: 'catering',
        subcategoryId: 'catering-equipment',
        style: 'Commercial',
        price: m.price,
        image: m.images[0],
        description: m.description,
        features: m.features,
        isFeatured: true,
        tag: 'Catalogue 2026',
        inStock: true,
        status: 'PUBLISHED',
        rating: 4.8 + Math.round(Math.random() * 2) / 10,
        reviews: 15 + Math.floor(Math.random() * 25),
        images: {
          create: m.images.map((imgUrl, idx) => ({
            url: imgUrl,
            altText: `${m.name} - View ${idx + 1}`,
            sortOrder: idx,
            isPrimary: idx === 0,
            type: 'gallery'
          }))
        }
      }
    });

    // Update presetSizes (model variants) and pricingUnit
    const modelsJson = JSON.stringify(m.models);
    await prisma.$executeRawUnsafe(
      `UPDATE "products" SET "presetSizes" = $1::jsonb, "pricingUnit" = 'FIXED' WHERE "id" = $2`,
      modelsJson,
      createdProduct.id
    );

    inserted++;
    console.log(`[${inserted}/${machinesData.length}] Created: "${createdProduct.name}" (${m.models.length} model variants)`);
  }

  console.log(`\n========================================================`);
  console.log(`🎉 COMPLETED! Total machines inserted: ${inserted}`);
  console.log(`========================================================`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Fatal error during seeding:', e);
  await prisma.$disconnect();
  process.exit(1);
});
