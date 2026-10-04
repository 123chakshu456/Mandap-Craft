import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const machinesData = [
  {
    sku: 'SKU-NIR-KNEADER-REG',
    name: 'Shiv Shakti Regular Dough Kneader (Atta Kneader)',
    price: 5250,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456193/shiv-shakti-products/cat_nir_p2_1_dough-ball-machine-pneumatic_nir-005_hi8sqi.jpg'
    ],
    description: 'Heavy duty commercial dough and atta kneading machine designed for restaurants, hotels, mess halls, and catering businesses. Made with food-grade stainless steel bowl and high-torque motor.',
    features: [
      'Food-grade stainless steel bowl and kneading arm',
      'High-performance copper winding motor',
      'Capacity range from 2 Kg to 50 Kg per batch',
      'Smooth gear-driven operation with minimal vibration'
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
    sku: 'SKU-NIR-KNEADER-UTYPE',
    name: 'Shiv Shakti U-Type Dough Kneader (Atta Kneader)',
    price: 14700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456193/shiv-shakti-products/cat_nir_p2_1_dough-ball-machine-pneumatic_nir-005_hi8sqi.jpg'
    ],
    description: 'Industrial U-type trough dough kneader with horizontal rotating spiral blades. Ideal for bakeries, sweet shops, and commercial establishments requiring high batch capacities.',
    features: [
      'Horizontal U-shaped stainless steel mixing chamber',
      'Tilting trough mechanism for quick dough discharge',
      'Powerful heavy-duty gear reduction system',
      'Capacities up to 80 Kg dough per batch'
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
    sku: 'SKU-NIR-KNEADER-SPIRAL',
    name: 'Shiv Shakti Spiral Dough Kneader (Semi & Fully Automatic)',
    price: 80000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456193/shiv-shakti-products/cat_nir_p2_1_dough-ball-machine-pneumatic_nir-005_hi8sqi.jpg'
    ],
    description: 'Professional Italian-style spiral dough mixer with dual-speed motor and rotating bowl for delicate gluten formation in bakery bread, pizza, and pastry dough.',
    features: [
      'Dual motor drive for rotating spiral hook and bowl',
      'Semi-automatic and fully automatic electronic timer controls',
      'Available in single phase and 3-phase high power models',
      'Safety grid cover with auto shut-off mechanism'
    ],
    models: [
      { model: '20 Kg Semi Auto (1 Phase)', motor: '3 HP / 1.5 HP', size: '42*22*38', weight: '260 Kg', capacity: '10-15 Kg', price: 80000 },
      { model: '20 Kg Semi Auto (3 Phase)', motor: '3 HP / 1 HP', size: '42*22*38', weight: '260 Kg', capacity: '10-15 Kg', price: 80000 },
      { model: '20 Kg Fully Automatic', motor: '3 HP / 1 HP', size: '42*22*38', weight: '270 Kg', capacity: '10-15 Kg', price: 100000 },
      { model: '40 Kg Semi Automatic', motor: '5 HP / 1.5 HP', size: '46*22*42', weight: '370 Kg', capacity: '15-35 Kg', price: 115000 },
      { model: '40 Kg Fully Automatic', motor: '5 HP / 1.5 HP', size: '46*22*42', weight: '390 Kg', capacity: '15-35 Kg', price: 135000 },
      { model: '80 Kg Semi Automatic', motor: '7 HP / 2 HP', size: '48*22*46', weight: '405 Kg', capacity: '30-75 Kg', price: 230000 },
      { model: '80 Kg Fully Automatic', motor: '7 HP / 2 HP', size: '48*22*46', weight: '425 Kg', capacity: '30-75 Kg', price: 250000 }
    ]
  },
  {
    sku: 'SKU-NIR-KNEADER-LTYPE',
    name: 'Shiv Shakti L-Type Dough Kneader (Regular & Deluxe)',
    price: 17500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456195/shiv-shakti-products/cat_nir_p3_3_besan-making-machine-deluxe_nir-011_kwjvur.jpg'
    ],
    description: 'Ergonomic L-type atta dough mixer designed for heavy continuous operation. Available in both open frame Regular and fully covered Deluxe stainless steel enclosure.',
    features: [
      'Heavy cast iron frame with stainless steel contact parts',
      'Covered body option for maximum cleanliness and safety',
      'High reduction planetary gear train for stiff doughs',
      'Smooth tilting bowl for fast unloading'
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
    sku: 'SKU-NIR-KHICHIYA-LTYPE',
    name: 'Shiv Shakti L-Type Khichiya Machine with Burner',
    price: 25000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456195/shiv-shakti-products/cat_nir_p3_1_khichiya-making-machine_nir-009_kubhmw.jpg'
    ],
    description: 'Specialized Khichiya dough cooking and kneading machine equipped with integrated gas burner underneath the bowl for simultaneous cooking and stirring of rice flour papad dough.',
    features: [
      'Equipped with industrial gas burner under stainless steel vessel',
      'Continuous stirring prevents dough from burning or scorching',
      'Heavy duty motor and reduction gear for thick hot dough',
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
    name: 'Shiv Shakti Commercial Mava Machine (Regular & Tilting)',
    price: 57000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456195/shiv-shakti-products/cat_nir_p3_4_wet-grinder-machine-tilting_nir-012_djhil9.jpg'
    ],
    description: 'Heavy duty milk boiling and mava condensing machine for dairy, sweets, and halwai use. Automatic rotating scraper ensures zero milk sticking or caramelizing.',
    features: [
      'Food grade SS rotating scraper arm with Teflon scrapers',
      'Gas heating chamber with uniform heat distribution',
      'Available in stationary and tilting models for easy unloading',
      'Batch sizes from 55 Liters up to 300 Liters'
    ],
    models: [
      { model: '55 Ltr Regular', motor: '0.5 HP', size: '47*26*32', weight: '135 Kg', capacity: '5-7 Ltr Mava', price: 57000 },
      { model: '55 Ltr Tilting', motor: '0.5 HP', size: '52*26*56', weight: '160 Kg', capacity: '5-7 Ltr Mava', price: 63000 },
      { model: '100 Ltr Regular', motor: '1 HP', size: '50*27*39', weight: '210 Kg', capacity: '10-12 Ltr Mava', price: 68000 },
      { model: '100 Ltr Tilting', motor: '1 HP', size: '57*32*60', weight: '235 Kg', capacity: '10-12 Ltr Mava', price: 74000 },
      { model: '200 Ltr Regular', motor: '1.5 HP', size: '55*38*40', weight: '300 Kg', capacity: '20-30 Ltr Mava', price: 90000 },
      { model: '200 Ltr Tilting', motor: '1.5 HP', size: '65*38*62', weight: '360 Kg', capacity: '20-30 Ltr Mava', price: 105000 },
      { model: '300 Ltr Regular', motor: '2 HP', size: '59*43*45', weight: '360 Kg', capacity: '30-50 Ltr Mava', price: 147000 },
      { model: '300 Ltr Tilting', motor: '2 HP', size: '69*43*68', weight: '430 Kg', capacity: '30-50 Ltr Mava', price: 168000 }
    ]
  },
  {
    sku: 'SKU-NIR-MUSTI-MACHINE',
    name: 'Shiv Shakti Musti Machine (28 Inch Sweets Kadai)',
    price: 47000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456195/shiv-shakti-products/cat_nir_p3_1_khichiya-making-machine_nir-009_kubhmw.jpg'
    ],
    description: 'Rotary scraping sweet cooker machine with a 28 inch stainless steel kadai. Specially built for dense sweets, soan papdi, peda, and kaju katli processing.',
    features: [
      'Large 28-inch heavy gauge stainless steel kadai',
      'Available with integrated high-efficiency gas burner',
      'Heavy 2 HP motor for high viscous sweet preparation',
      'Robust gear drive with 10-15 Kg batch capacity'
    ],
    models: [
      { model: 'Musti Machine 28" Kadai', motor: '2 HP', size: '39*34*47', weight: '170 Kg', capacity: '10-15 Kg', price: 47000 },
      { model: 'Musti Machine 28" Kadai with Burner', motor: '2 HP', size: '39*34*55', weight: '175 Kg', capacity: '10-15 Kg', price: 50000 }
    ]
  },
  {
    sku: 'SKU-NIR-HALWA-MACHINE',
    name: 'Shiv Shakti Commercial Halwa Making Machine',
    price: 85000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456197/shiv-shakti-products/cat_nir_p4_1_wet-grinder-machine-regular_nir-013_ugnxrt.jpg'
    ],
    description: 'Heavy duty automatic halwa preparation machine with motorized planetary scrapers. Ideal for gajar halwa, moong dal halwa, and sweet manufacturing plants.',
    features: [
      'Heavy industrial cooking trough with continuous scraping',
      'Trough sizes from 2 Feet to 5 Feet',
      'High-grade stainless steel interior',
      'Even heating without bottom burning'
    ],
    models: [
      { model: '2 Feet Halwa Machine', motor: '1 HP', size: '48*30*43', weight: '200 Kg', capacity: '20-25 Kg', price: 85000 },
      { model: '3 Feet Halwa Machine', motor: '1.5 HP', size: '56*38*43', weight: '250 Kg', capacity: '30-35 Kg', price: 100000 },
      { model: '4 Feet Halwa Machine', motor: '2 HP', size: '68*50*49', weight: '300 Kg', capacity: '50-60 Kg', price: 135000 },
      { model: '5 Feet Halwa Machine', motor: '3 HP', size: '88*62*49', weight: '350 Kg', capacity: '70-80 Kg', price: 235000 }
    ]
  },
  {
    sku: 'SKU-NIR-DOUGH-BALL-PNEU',
    name: 'Shiv Shakti Pneumatic Dough Ball (Peda / Loi) Machine',
    price: 35000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456197/shiv-shakti-products/cat_nir_p4_1_wet-grinder-machine-regular_nir-013_ugnxrt.jpg'
    ],
    description: 'Precision pneumatic dough cutting and ball forming machine for uniform chapati, puri, and peda balls from 13 grams to 45 grams.',
    features: [
      'Adjustable ball weight from 13gm to 45gm',
      'Available with or without silent air compressor',
      'Accurate cutting tolerance and rapid ball ejection',
      'Compact footprint suitable for kitchens of all sizes'
    ],
    models: [
      { model: 'Pneumatic Without Compressor', motor: 'Air Operated', size: '27*19*41', weight: '37 Kg', capacity: '2-3 Kg / min', price: 35000 },
      { model: 'Pneumatic With Compressor', motor: 'Compressor Incl.', size: '27*19*41', weight: '77 Kg', capacity: '2-3 Kg / min', price: 45000 }
    ]
  },
  {
    sku: 'SKU-NIR-CHAPATI-MACHINE',
    name: 'Shiv Shakti Commercial Chapati & Roti Making Machine',
    price: 22000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456197/shiv-shakti-products/cat_nir_p4_1_wet-grinder-machine-regular_nir-013_ugnxrt.jpg'
    ],
    description: 'High efficiency automatic and semi-automatic roti pressing and baking machines. Produces uniform, soft, and fully puffed chapatis with zero oil.',
    features: [
      'Teflon-coated pressing plates with dual digital thermostats',
      'Conveyor type automated models with integrated gas puffing tunnel',
      'Capacities from 300 up to 1000 chapatis per hour',
      'Reduces labor and guarantees consistent thickness'
    ],
    models: [
      { model: 'Chapati Machine Domestic', motor: '0.25 HP', size: '13*9*12', weight: '18 Kg', capacity: '300 Pcs / Hr', price: 22000 },
      { model: 'Chapati Machine Small', motor: '0.25 HP', size: '13*14*17', weight: '31 Kg', capacity: '350-400 Pcs / Hr', price: 38500 },
      { model: 'Chapati Machine Big', motor: '1 HP', size: '31*17*19', weight: '107 Kg', capacity: '700-1000 Pcs / Hr', price: 60500 },
      { model: 'Automatic Small (Conveyor Type)', motor: '0.75 + 0.75 HP', size: '44*21*42', weight: '125 Kg', capacity: '350-500 Pcs / Hr', price: 104500 },
      { model: 'Automatic Big (Conveyor Type)', motor: '1 + 1 HP', size: '73*62*29', weight: '420 Kg', capacity: '800-1000 Pcs / Hr', price: 198000 }
    ]
  },
  {
    sku: 'SKU-NIR-FARSAN-SEV',
    name: 'Shiv Shakti Commercial Namkeen / Farsan Sev Machine',
    price: 15000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456197/shiv-shakti-products/cat_nir_p4_1_wet-grinder-machine-regular_nir-013_ugnxrt.jpg'
    ],
    description: 'Electric motorized farsan and sev extrusion machine for producing nylon sev, bhujia, papdi, and bhavnagri gathiya directly into frying kadai.',
    features: [
      'Mountable over frying pans or on a mobile trolley',
      'Stainless steel cylinder with multiple interchangeable jalis',
      'High throughput up to 150 Kg namkeen per hour',
      'Smooth pneumatic/screw pressure mechanism'
    ],
    models: [
      { model: '7" Farsan Machine', motor: '0.5 HP', size: '40*11*38', weight: '55 Kg', capacity: '60-70 Kg / Hr', price: 15000 },
      { model: '9" Farsan Machine', motor: '1 HP', size: '45*14*38', weight: '80 Kg', capacity: '100-150 Kg / Hr', price: 17000 }
    ]
  },
  {
    sku: 'SKU-NIR-FAFDA-MACHINE',
    name: 'Shiv Shakti Fafda Gathiya Machine',
    price: 13500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456197/shiv-shakti-products/cat_nir_p4_1_wet-grinder-machine-regular_nir-013_ugnxrt.jpg'
    ],
    description: 'Specialized Gujarati fafda making machine with precision stainless steel rolling cylinders for extruding crisp and thin fafda strips effortlessly.',
    features: [
      'Accurate thickness adjustment gauge',
      'Stainless steel food contact parts',
      'Available in Regular and Jumbo high capacity models',
      'Output from 30 Kg to 70 Kg fafda per hour'
    ],
    models: [
      { model: 'Fafda Machine Regular', motor: '0.25 HP', size: '14*9*16', weight: '21 Kg', capacity: '30-40 Kg / Hr', price: 13500 },
      { model: 'Fafda Machine Jumbo', motor: '0.5 HP', size: '20*10*21', weight: '40 Kg', capacity: '55-70 Kg / Hr', price: 20000 }
    ]
  },
  {
    sku: 'SKU-NIR-SAMOSA-PATTI',
    name: 'Shiv Shakti Samosa Patti & Spring Roll Sheeter',
    price: 14500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456199/shiv-shakti-products/cat_nir_p5_1_chilli-cutter-machine_nir-017_lll6ab.jpg'
    ],
    description: 'Electric rolling and sheeting machine for samosa patti, spring roll sheets, and wonton skins. Guarantees paper-thin dough sheets consistently.',
    features: [
      'High precision 98x240mm chrome plated rollers',
      'Adjustable sheet thickness knob',
      'Sturdy compact benchtop design',
      'Smooth forward and reverse rotation'
    ],
    models: [
      { model: 'Samosa Patti Machine', motor: '0.25 HP', size: '10*22*17', weight: '33 Kg', capacity: '98x240mm Roller', price: 14500 }
    ]
  },
  {
    sku: 'SKU-NIR-HAND-POTATO-SLICER',
    name: 'Shiv Shakti Hand Potato Slicer Machine',
    price: 1700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456199/shiv-shakti-products/cat_nir_p5_1_chilli-cutter-machine_nir-017_lll6ab.jpg'
    ],
    description: 'Manual heavy duty potato slicer with hardened stainless steel cutting blades. Easy to operate for instant wafer and salad slicing.',
    features: [
      'Heavy cast body with 3 sharp stainless steel blades',
      'Produces uniform flat and crinkle cuts',
      'Zero electricity required, portable and rugged',
      'Ideal for small snack stalls, canteens, and caterers'
    ],
    models: [
      { model: 'Hand Potato Slicer M.S.', motor: 'Manual', size: '9*5*11', weight: '4 Kg', capacity: '3 S.S. Blades', price: 1700 }
    ]
  },
  {
    sku: 'SKU-NIR-POTATO-PEELER',
    name: 'Shiv Shakti Commercial Potato Peeler Machine',
    price: 10500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456199/shiv-shakti-products/cat_nir_p5_1_chilli-cutter-machine_nir-017_lll6ab.jpg'
    ],
    description: 'High speed abrasive centrifugal potato and ginger peeler with automatic water flush inlet. Peels an entire batch in just 2 to 3 minutes with minimal wastage.',
    features: [
      'Silicon carbide abrasive disc and drum lining',
      'Rapid peeling cycle of 2 to 5 minutes per batch',
      'Water inlet pipe for automatic skin flushing',
      'Capacities ranging from 5 Kg up to 50 Kg per batch'
    ],
    models: [
      { model: '5 Kg Peeler Machine', motor: '0.75 HP', size: '22*14*16', weight: '38 Kg', capacity: '2-3 Min Duration', price: 10500 },
      { model: '10 Kg Peeler Machine', motor: '1 HP', size: '24*16*32', weight: '48 Kg', capacity: '3-5 Min Duration', price: 14000 },
      { model: '15 Kg Peeler Machine', motor: '1 HP', size: '29*18*36', weight: '67 Kg', capacity: '5-7 Min Duration', price: 18000 },
      { model: '20 Kg Peeler Machine', motor: '1.5 HP', size: '29*18*40', weight: '71 Kg', capacity: '7-10 Min Duration', price: 21000 },
      { model: '30 Kg Peeler Machine', motor: '2 HP', size: '34*21*43', weight: '97 Kg', capacity: '10-12 Min Duration', price: 31500 },
      { model: '50 Kg Peeler Machine', motor: '3 HP', size: '37*27*45', weight: '120 Kg', capacity: '12-15 Min Duration', price: 47500 }
    ]
  },
  {
    sku: 'SKU-NIR-POTATO-WAFER-CHIPS',
    name: 'Shiv Shakti Commercial Potato Wafer & Finger Chips Machine',
    price: 18000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456199/shiv-shakti-products/cat_nir_p5_1_chilli-cutter-machine_nir-017_lll6ab.jpg'
    ],
    description: 'High throughput motorized potato slicing machine for making potato chips, ruffles, salli, and french fry finger cuts at 200 to 250 Kg per hour.',
    features: [
      'Interchangeable dies for flat slices, crinkle cuts, and sticks',
      'Stainless steel cutting chamber and feeding hopper',
      'High productivity: up to 250 Kg potatoes per hour',
      'Uniform thickness with negligible breakage'
    ],
    models: [
      { model: 'Potato Wafer Machine (3 Dies)', motor: '0.5 HP', size: '19*13*26', weight: '43 Kg', capacity: '200-250 Kg / Hr', price: 18000 },
      { model: 'Finger Chips Machine (1 Die)', motor: '0.5 HP', size: '19*13*26', weight: '40 Kg', capacity: '170-230 Kg / Hr', price: 21000 }
    ]
  },
  {
    sku: 'SKU-NIR-BANANA-WAFER',
    name: 'Shiv Shakti Commercial Banana Wafer Slicing Machine',
    price: 18000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456199/shiv-shakti-products/cat_nir_p5_1_chilli-cutter-machine_nir-017_lll6ab.jpg'
    ],
    description: 'Specialized plantain and raw banana slicing machine. Can be fitted with variable electronic speed control to direct-slice bananas right into hot oil fryers.',
    features: [
      'High speed rotary blade slices 250 to 350 Kg per hour',
      'Electronic speed controller option for precision thickness',
      'Direct-into-kadai slicing design prevents banana browning',
      'Stainless steel 3-die cutting plate assembly'
    ],
    models: [
      { model: 'Banana Wafer Machine (960 RPM)', motor: '1 HP', size: '35*13*25', weight: '40 Kg', capacity: '250-300 Kg / Hr', price: 18000 },
      { model: 'Wafer Machine With Speed Control', motor: '1 HP (960-1440 RPM)', size: '42*13*34', weight: '55 Kg', capacity: '300-350 Kg / Hr', price: 30000 }
    ]
  },
  {
    sku: 'SKU-NIR-OIL-DRYER',
    name: 'Shiv Shakti Centrifugal Oil / Water Hydro Dryer Machine',
    price: 18000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456199/shiv-shakti-products/cat_nir_p5_1_chilli-cutter-machine_nir-017_lll6ab.jpg'
    ],
    description: 'High-speed centrifugal hydro extractor for separating excess oil from fried snacks (sev, chips, wafers) or drying water after washing vegetables.',
    features: [
      'Removable perforated stainless steel inner basket',
      'Tilting frame option for instant unloading without lifting basket',
      'Reduces oil content in fried namkeen by up to 30%',
      'Capacities from 10 Kg up to 50 Kg per cycle'
    ],
    models: [
      { model: '10 Kg Regular Dryer', motor: '1 HP', size: '35*21*30', weight: '71 Kg', capacity: '2-3 Min / Batch', price: 18000 },
      { model: '15 Kg Tilting Dryer', motor: '1 HP', size: '28*25*35', weight: '84 Kg', capacity: '3-5 Min / Batch', price: 21000 },
      { model: '30 Kg Tilting Dryer', motor: '1.5 HP', size: '31*25*40', weight: '103 Kg', capacity: '5-7 Min / Batch', price: 31500 },
      { model: '50 Kg Tilting Dryer', motor: '2 HP', size: '36*37*40', weight: '130 Kg', capacity: '7-10 Min / Batch', price: 68000 }
    ]
  },
  {
    sku: 'SKU-NIR-POWDER-MIXING',
    name: 'Shiv Shakti Commercial Ribbon Powder Mixing Machine',
    price: 19000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456200/shiv-shakti-products/cat_nir_p6_1_hand-potato-slicer_nir-021_y3ta3j.jpg'
    ],
    description: 'Horizontal ribbon blender powder mixing machine for dry spices, flour, besan, seasonings, and masala blends.',
    features: [
      'Double spiral ribbon agitator for homogeneous blending',
      'Bottom butterfly discharge valve',
      'Food grade stainless steel mixing trough',
      'Sizes from 1.5 Feet to 5 Feet'
    ],
    models: [
      { model: '1.5 Feet Powder Mixer', motor: '1 HP', size: '30*21*40', weight: '80 Kg', capacity: '5-15 Kg', price: 19000 },
      { model: '2 Feet Powder Mixer', motor: '1.5 HP', size: '37*27*48', weight: '190 Kg', capacity: '10-30 Kg', price: 42000 },
      { model: '3 Feet Powder Mixer', motor: '2 HP', size: '61*27*48', weight: '250 Kg', capacity: '15-60 Kg', price: 68000 },
      { model: '5 Feet Powder Mixer', motor: '3 HP', size: '85*27*48', weight: '370 Kg', capacity: '20-80 Kg', price: 95000 }
    ]
  },
  {
    sku: 'SKU-NIR-FARSAN-MIXING',
    name: 'Shiv Shakti Farsan & Namkeen Mixing Machine',
    price: 14500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456200/shiv-shakti-products/cat_nir_p6_1_hand-potato-slicer_nir-021_y3ta3j.jpg'
    ],
    description: 'Horizontal mixer designed to blend various namkeen ingredients, spices, roasted peanuts, and seasonings without breaking delicate fried items.',
    features: [
      'Gentle paddle action prevents breakage of sev and boondi',
      'Quick manual or lever tilting for emptying',
      'Capacities from 2 Kg to 80 Kg per batch',
      'Stainless steel contacts and heavy structural base'
    ],
    models: [
      { model: '1 Feet Farsan Mixer', motor: '0.5 HP', size: '30*21*46', weight: '45 Kg', capacity: '2-4 Kg', price: 14500 },
      { model: '1.5 Feet Farsan Mixer', motor: '0.75 HP', size: '36*21*26', weight: '54 Kg', capacity: '4-8 Kg', price: 16500 },
      { model: '2 Feet Farsan Mixer', motor: '1 HP', size: '48*28*40', weight: '166 Kg', capacity: '10-30 Kg', price: 33500 },
      { model: '3 Feet Farsan Mixer', motor: '2 HP', size: '62*28*40', weight: '190 Kg', capacity: '15-60 Kg', price: 48000 },
      { model: '5 Feet Farsan Mixer', motor: '3 HP', size: '86*28*40', weight: '250 Kg', capacity: '20-80 Kg', price: 63000 }
    ]
  },
  {
    sku: 'SKU-NIR-COATING-PAN',
    name: 'Shiv Shakti Namkeen Masala Coating Pan Machine',
    price: 17500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456200/shiv-shakti-products/cat_nir_p6_1_hand-potato-slicer_nir-021_y3ta3j.jpg'
    ],
    description: 'Rotary tumbling pan for coating spices, seasonings, flavorings, and sugar syrup on kurkure, potato chips, peanuts, and namkeen snacks.',
    features: [
      'Tilting semi-spherical stainless steel pan for 360-degree tumbling',
      'Models available with integrated LPG burner for warm roasting',
      'Even spice distribution with zero breakage',
      'Batch capacities from 7 Kg to 40 Kg'
    ],
    models: [
      { model: 'Small Tilting Coating Pan', motor: '0.75 HP', size: '30*26*52', weight: '75 Kg', capacity: '7-10 Kg', price: 17500 },
      { model: 'Small Coating Pan with Burner', motor: '0.75 HP', size: '30*26*52', weight: '77 Kg', capacity: '7-10 Kg', price: 19500 },
      { model: 'Medium Tilting Coating Pan', motor: '1 HP', size: '30*26*52', weight: '77 Kg', capacity: '15-20 Kg', price: 29500 },
      { model: 'Medium Coating Pan with Burner', motor: '1 HP', size: '30*26*52', weight: '79 Kg', capacity: '15-20 Kg', price: 31000 },
      { model: 'Large Tilting Coating Pan', motor: '1 HP', size: '40*30*52', weight: '105 Kg', capacity: '20-30 Kg', price: 52500 },
      { model: 'Regular Coating Machine', motor: '1.5 HP', size: '37*22*32', weight: '175 Kg', capacity: '20-40 Kg', price: 63000 }
    ]
  },
  {
    sku: 'SKU-NIR-VEG-CHOPPING',
    name: 'Shiv Shakti Commercial Vegetable Chopping Machine',
    price: 11600,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456200/shiv-shakti-products/cat_nir_p6_1_hand-potato-slicer_nir-021_y3ta3j.jpg'
    ],
    description: 'High efficiency motorized vegetable bowl chopping machine. Finely chops onions, cabbage, carrots, capsicum, and ginger in seconds.',
    features: [
      'Stainless steel bowl with rotary triple blade cutter',
      'Chops up to 150 Kg vegetables per hour',
      'Aluminium and S.S. robust food contact assembly',
      'Ideal for Chinese food, momos, samosa fillings, and curries'
    ],
    models: [
      { model: 'Vegetable Chopping S.S. Bowl', motor: '1 HP', size: '28*21*15', weight: '28 Kg', capacity: '150 Kg / Hr', price: 11600 },
      { model: 'Kadukas Shredder with 2 Jali', motor: '1 HP', size: '18*13*21', weight: '28 Kg', capacity: '80 Kg / Hr', price: 13300 }
    ]
  },
  {
    sku: 'SKU-NIR-VEG-CUTTER',
    name: 'Shiv Shakti Multi-Purpose Vegetable Cutting Machine',
    price: 13500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456200/shiv-shakti-products/cat_nir_p6_1_hand-potato-slicer_nir-021_y3ta3j.jpg'
    ],
    description: 'Heavy duty commercial vegetable cutter with multi-die cutting attachments for slicing, dicing, cubing, and julienning all types of root vegetables.',
    features: [
      'Heavy commercial copper motor for continuous 8-hour duty',
      'Dual feeding chutes for long and round vegetables',
      'Outputs from 200 Kg up to 1000 Kg per hour',
      'Quick blade change system without tools'
    ],
    models: [
      { model: '1 HP Regular Veg Cutter', motor: '1 HP', size: '21*11*22', weight: '44 Kg', capacity: '200-250 Kg / Hr', price: 13500 },
      { model: '1 HP Deluxe Veg Cutter', motor: '1 HP', size: '21*11*33', weight: '46 Kg', capacity: '200-250 Kg / Hr', price: 15500 },
      { model: '2 HP Regular Veg Cutter', motor: '2 HP', size: '25*14*28', weight: '72 Kg', capacity: '1000 Kg / Hr', price: 36500 }
    ]
  },
  {
    sku: 'SKU-NIR-CHILLI-CUTTER',
    name: 'Shiv Shakti Commercial Green Chilli Cutting Machine',
    price: 3900,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456202/shiv-shakti-products/cat_nir_p7_1_steam-dhokla-box_nir-025_ad7urp.jpg'
    ],
    description: 'Specialized stainless steel circular knife cutter for chopping green chillies, spring onions, beans, and herbs quickly without crushing.',
    features: [
      'Rotary razor sharp stainless steel knives',
      'Prevents hand burning and chili eye irritation',
      'Capacities from manual up to 450 Kg chillies per hour',
      'Heavy duty motor and compact space saving base'
    ],
    models: [
      { model: 'Hand Chilli Cutter', motor: 'Manual', size: '17*11*22', weight: '9 Kg', capacity: 'Manual Feed', price: 3900 },
      { model: '1 HP Chilli Cutter', motor: '1 HP', size: '21*12*20', weight: '26 Kg', capacity: '100-200 Kg / Hr', price: 7500 },
      { model: '2 HP Chilli Cutter', motor: '2 HP', size: '22*17*26', weight: '32 Kg', capacity: '250-450 Kg / Hr', price: 12500 }
    ]
  },
  {
    sku: 'SKU-NIR-ONION-SLICER',
    name: 'Shiv Shakti Commercial Onion Slicer Machine',
    price: 10500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456202/shiv-shakti-products/cat_nir_p7_1_steam-dhokla-box_nir-025_ad7urp.jpg'
    ],
    description: 'Electric rotary onion slicing machine designed for commercial biryani, gravy, and frying onion preparations. Delivers crisp, even rings.',
    features: [
      'Special anti-tear cutting blade geometry',
      'Capacities from 100 Kg to 200 Kg onions per hour',
      'Fully enclosed safety casing',
      'Fast cleaning with easy wash chute'
    ],
    models: [
      { model: 'Regular Onion Slicer', motor: '1 HP', size: '25*13*22', weight: '39 Kg', capacity: '100-150 Kg / Hr', price: 10500 },
      { model: 'Big Onion Slicer', motor: '1 HP', size: '19*13*26', weight: '40 Kg', capacity: '150-200 Kg / Hr', price: 15500 }
    ]
  },
  {
    sku: 'SKU-NIR-DRY-FRUIT-CUTTER',
    name: 'Shiv Shakti Dry Fruit Chips, Powder & Tukda Machine',
    price: 1700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456202/shiv-shakti-products/cat_nir_p7_1_steam-dhokla-box_nir-025_ad7urp.jpg'
    ],
    description: 'Versatile dry fruit processing machine for almond, cashew, pistachio, and walnut cutting into paper thin flakes, fine powder, or diced tukda.',
    features: [
      'Hardened stainless steel micro blades',
      'Produces almond / pista flakes for ice creams and sweets',
      'Manual and motorized electric configurations',
      'Clean cut without releasing oil from nuts'
    ],
    models: [
      { model: 'Small Hand Dry Fruit Slicer', motor: 'Manual', size: '8*6*6', weight: '1.5 Kg', capacity: 'Manual Flakes', price: 1700 },
      { model: 'Big Hand Dry Fruit Slicer', motor: 'Manual', size: '8*7*9', weight: '5 Kg', capacity: 'Manual Flakes', price: 3400 },
      { model: 'Big Hand with Motor (0.25 HP)', motor: '0.25 HP', size: '11*10*18', weight: '16 Kg', capacity: '5-10 Kg / Hr', price: 7800 },
      { model: 'Dry Fruit Tukda Machine', motor: '1 HP', size: '17*12*24', weight: '38 Kg', capacity: '15-20 Kg / Hr', price: 12500 },
      { model: 'Dry Fruit Chips & Powder Machine', motor: '1 HP', size: '22*13*20', weight: '28 Kg', capacity: '15-20 Kg / Hr', price: 12500 }
    ]
  },
  {
    sku: 'SKU-NIR-CHATNI-MACHINE',
    name: 'Shiv Shakti Commercial Chatni & Stone Grinder Machine',
    price: 5200,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456202/shiv-shakti-products/cat_nir_p7_1_steam-dhokla-box_nir-025_ad7urp.jpg'
    ],
    description: 'Traditional stone disc wet chutney and gravy machine for continuous fine grinding of coconut chutney, green chutney, and soaked dal.',
    features: [
      'Authentic emery stone grinding wheels',
      'High capacity flow-through design',
      'Available with or without high-torque electric motor',
      'Output up to 850 Kg chutney per hour'
    ],
    models: [
      { model: '32 No. Without Motor & Body', motor: 'Bare Unit', size: '15*10*11', weight: '16 Kg', capacity: 'Flow Through', price: 5200 },
      { model: '1 HP 32 No. Chatni Machine', motor: '1 HP', size: '18*13*26', weight: '52 Kg', capacity: '100-150 Kg / Hr', price: 13800 },
      { model: '64 No. Without Motor & Body', motor: 'Bare Unit', size: 'Standard', weight: '40 Kg', capacity: 'High Output', price: 19800 },
      { model: '2 HP 64 No. Chatni Machine', motor: '2 HP', size: '25*18*35', weight: '75 Kg', capacity: '150-850 Kg / Hr', price: 33000 }
    ]
  },
  {
    sku: 'SKU-NIR-MANGO-PULP',
    name: 'Shiv Shakti Commercial Mango Pulp Making Machine',
    price: 32000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456202/shiv-shakti-products/cat_nir_p7_1_steam-dhokla-box_nir-025_ad7urp.jpg'
    ],
    description: 'Industrial fruit pulping machine for extracting smooth pulp from mango, tomato, guava, and berries while automatically discharging seeds and skins.',
    features: [
      'Continuous separation of fruit pulp from seeds and peels',
      'Food contact stainless steel sieve screens',
      'Heavy duty motor with capacity from 50 Kg up to 1000 Kg per hour',
      'Essential for juice centers, canning units, and catering kitchens'
    ],
    models: [
      { model: '50 Kg Model', motor: '1 HP', size: '33*19*42', weight: '56 Kg', capacity: '10-50 Kg / Hr', price: 32000 },
      { model: '200 Kg Model', motor: '1.5 HP', size: '41*20*42', weight: '90 Kg', capacity: '50-200 Kg / Hr', price: 43000 },
      { model: '400 Kg Model', motor: '2 HP', size: '53*24*42', weight: '115 Kg', capacity: '100-400 Kg / Hr', price: 53000 },
      { model: '1000 Kg Model', motor: '3 HP', size: '63*27*42', weight: '170 Kg', capacity: '200-1000 Kg / Hr', price: 135000 }
    ]
  },
  {
    sku: 'SKU-NIR-MIXER-GRINDER',
    name: 'Shiv Shakti Heavy Duty Commercial Mixer Grinder',
    price: 6200,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456204/shiv-shakti-products/cat_nir_p8_1_oil-expeller-machine_nir-029_wfussp.jpg'
    ],
    description: 'High-speed 2880 RPM commercial kitchen blender and mixer grinder. Available in Round, Square, and Tilting configurations for gravies, pastes, and wet grinding.',
    features: [
      'Ultra high speed 2880 RPM industrial copper motor',
      'Thick stainless steel jar with laser-welded blades',
      'Tilting jar option eliminates heavy lifting of hot gravies',
      'Capacities: 3 Liter, 5 Liter, 10 Liter, and 15 Liter'
    ],
    models: [
      { model: 'Round 3 Ltr (2880 RPM)', motor: '0.5 HP', size: '9*9*19', weight: '11 Kg', capacity: '3 Liter Jar', price: 6200 },
      { model: 'Round 5 Ltr (2880 RPM)', motor: '1.5 HP', size: '11*11*24', weight: '27 Kg', capacity: '5 Liter Jar', price: 8500 },
      { model: 'Round 10 Ltr (2880 RPM)', motor: '2 HP', size: '11*14*30', weight: '30 Kg', capacity: '10 Liter Jar', price: 9800 },
      { model: 'Square 5 Ltr (2880 RPM)', motor: '1.5 HP', size: '11*11*24', weight: '29 Kg', capacity: '5 Liter Jar', price: 9900 },
      { model: 'Square 10 Ltr (2880 RPM)', motor: '2 HP', size: '11*14*30', weight: '35 Kg', capacity: '10 Liter Jar', price: 11600 },
      { model: 'Square 15 Ltr (2880 RPM)', motor: '3 HP', size: '17*15*37', weight: '47 Kg', capacity: '15 Liter Jar', price: 16800 },
      { model: 'Tilting 5 Ltr (2880 RPM)', motor: '1.5 HP', size: '22*16*37', weight: '31 Kg', capacity: '5 Liter Tilting', price: 11600 },
      { model: 'Tilting 10 Ltr (2880 RPM)', motor: '2 HP', size: '22*16*41', weight: '35 Kg', capacity: '10 Liter Tilting', price: 12700 },
      { model: 'Tilting 15 Ltr (2880 RPM)', motor: '3 HP', size: '24*17*50', weight: '51 Kg', capacity: '15 Liter Tilting', price: 17900 }
    ]
  },
  {
    sku: 'SKU-NIR-VALONA-MACHINE',
    name: 'Shiv Shakti Valona Machine (Chhas / Buttermilk Churner)',
    price: 3700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456205/shiv-shakti-products/cat_nir_p9_1_chapati-puffer_nir-033_fnz4cx.jpg'
    ],
    description: 'Electric buttermilk and butter churner machine (Valona) for dairy farms, temples, sweet shops, and catering. Separates white makkhan and churns silky chaas effortlessly.',
    features: [
      'Food grade stainless steel churning rod and beater',
      'Wall mountable or stand-supported designs',
      'Heavy duty motor built for continuous daily churning',
      'Vessel capacities from 10 Liters up to 200 Liters'
    ],
    models: [
      { model: '10 Ltr Valona', motor: '50 Hz', size: 'Standard', weight: '3 Kg', capacity: '10 Ltr Vessel', price: 3700 },
      { model: '30 Ltr Valona', motor: '80 Hz', size: 'Standard', weight: '5 Kg', capacity: '30 Ltr Vessel', price: 4400 },
      { model: '40 Ltr Valona', motor: '0.25 HP', size: 'Standard', weight: '6 Kg', capacity: '40 Ltr Vessel', price: 5000 },
      { model: '60 Ltr Valona', motor: '0.5 HP', size: 'Standard', weight: '7 Kg', capacity: '60 Ltr Vessel', price: 5500 },
      { model: '60 Ltr Heavy Model', motor: '0.5 HP', size: 'Standard', weight: '15 Kg', capacity: '60 Ltr Vessel', price: 5900 },
      { model: '80 Ltr Valona', motor: '0.75 HP', size: '5*5*27', weight: '8 Kg', capacity: '80 Ltr Vessel', price: 6100 },
      { model: '100 Ltr Regular Model', motor: '1 HP', size: '8*8*38', weight: '22 Kg', capacity: '100 Ltr Vessel', price: 9400 },
      { model: '100 Ltr Heavy Model', motor: '1.5 HP', size: '8*8*38', weight: '25 Kg', capacity: '100 Ltr Vessel', price: 11600 },
      { model: '200 Ltr Regular Model', motor: '1.5 HP', size: '9*9*49', weight: '25 Kg', capacity: '200 Ltr Vessel', price: 11600 },
      { model: '200 Ltr Heavy Model', motor: '2 HP', size: '9*9*49', weight: '30 Kg', capacity: '200 Ltr Vessel', price: 14900 }
    ]
  },
  {
    sku: 'SKU-NIR-PLANETARY-MIXER',
    name: 'Shiv Shakti Commercial Planetary Mixer Machine',
    price: 7000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456205/shiv-shakti-products/cat_nir_p9_1_chapati-puffer_nir-033_fnz4cx.jpg'
    ],
    description: 'Planetary action bakery mixer for whipping cream, beating egg whites, cake batter mixing, and light dough kneading.',
    features: [
      'Complete with wire whip, flat beater, and dough hook attachments',
      'Removable stainless steel mixing bowl',
      'Multi-speed transmission for versatile baking applications',
      'Available in 5 Liter table top and 20 Liter floor standing models'
    ],
    models: [
      { model: '5 Ltr Planetary Mixer', motor: '0.25 HP', size: '15*11*18', weight: '17 Kg', capacity: '1-2 Ltr Batch', price: 7000 },
      { model: '20 Ltr Indian Model', motor: '1 HP', size: '25*19*40', weight: '65 Kg', capacity: '10-22 Ltr Batch', price: 35000 }
    ]
  },
  {
    sku: 'SKU-NIR-WET-GRINDER',
    name: 'Shiv Shakti Commercial Wet Grinder (Regular & Tilting)',
    price: 19800,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456205/shiv-shakti-products/cat_nir_p9_1_chapati-puffer_nir-033_fnz4cx.jpg'
    ],
    description: 'Heavy duty commercial stone wet grinder for idli, dosa, and vada batter preparation. Natural granite stones retain batter coolness and fluffiness.',
    features: [
      'Natural cylindrical granite grinding stones',
      'Stainless steel drum with tilting frame for quick batter pouring',
      'High-torque motor for continuous grinding',
      'Capacities from 5 Liters up to 20 Liters'
    ],
    models: [
      { model: '5 Ltr Regular Wet Grinder', motor: '0.5 HP', size: '31*19*40', weight: '115 Kg', capacity: '5 Liter Drum', price: 19800 },
      { model: '10 Ltr Regular Wet Grinder', motor: '1 HP', size: '33*22*40', weight: '170 Kg', capacity: '10 Liter Drum', price: 25400 },
      { model: '15 Ltr Regular Wet Grinder', motor: '1.5 HP', size: '36*25*43', weight: '210 Kg', capacity: '15 Liter Drum', price: 30900 },
      { model: '7 Ltr Tilting Wet Grinder', motor: '0.5 HP', size: '25*18*44', weight: '120 Kg', capacity: '7 Liter Tilting', price: 34700 },
      { model: '10 Ltr Tilting Wet Grinder', motor: '1 HP', size: '27*19*46', weight: '142 Kg', capacity: '10 Liter Tilting', price: 36900 },
      { model: '15 Ltr Tilting Wet Grinder', motor: '1.5 HP', size: '29*20*46', weight: '158 Kg', capacity: '15 Liter Tilting', price: 39100 },
      { model: '20 Ltr Tilting Wet Grinder', motor: '2 HP', size: '29*20*48', weight: '170 Kg', capacity: '20 Liter Tilting', price: 43500 }
    ]
  },
  {
    sku: 'SKU-NIR-WET-DAL-MACHINE',
    name: 'Shiv Shakti Commercial Wet Dal Machine (Plate Mill)',
    price: 6700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456207/shiv-shakti-products/cat_nir_p10_1_masala-peti_nir-037_mue6f0.jpg'
    ],
    description: 'Instant plate-type wet dal and rice grinding mill for South Indian batter, besan batter, and lentil pastes with continuous flow.',
    features: [
      'Emery stone or cast steel grinding plates (6", 8", and 11")',
      'Continuous discharge spout for uninterrupted processing',
      'Available with or without heavy duty electric motor',
      'Outputs up to 120 Kg batter per hour'
    ],
    models: [
      { model: '6" Plate Without Motor', motor: 'Bare Unit', size: '21*13*17', weight: '22 Kg', capacity: 'Continuous', price: 6700 },
      { model: '6" Plate With Motor (1.5 HP)', motor: '1.5 HP', size: '21*13*32', weight: '58 Kg', capacity: '40-60 Kg / Hr', price: 17100 },
      { model: '8" Plate Without Motor', motor: 'Bare Unit', size: 'Standard', weight: '65 Kg', capacity: 'Continuous', price: 15500 },
      { model: '8" Plate With Motor (2 HP)', motor: '2 HP', size: 'Standard', weight: '105 Kg', capacity: '80-100 Kg / Hr', price: 29800 },
      { model: '11" Plate Without Motor', motor: 'Bare Unit', size: 'Standard', weight: '110 Kg', capacity: 'Continuous', price: 27600 },
      { model: '11" Plate With Motor (3 HP)', motor: '3 HP', size: 'Standard', weight: '150 Kg', capacity: '100-120 Kg / Hr', price: 38500 }
    ]
  },
  {
    sku: 'SKU-NIR-COCONUT-SCRAPER',
    name: 'Shiv Shakti Commercial Coconut Scraper Machine',
    price: 3000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456207/shiv-shakti-products/cat_nir_p10_1_masala-peti_nir-037_mue6f0.jpg'
    ],
    description: 'Electric motorized fresh coconut grater with high speed stainless steel scraper claw. Grates whole fresh coconuts in under 30 seconds.',
    features: [
      'Stainless steel multi-tooth scraping head',
      'Splash guard tray and stable tabletop mounting',
      'Available in compact 0.25 HP and commercial 1 HP models',
      'Essential for catering, South Indian cooking, and sweets'
    ],
    models: [
      { model: 'Small Coconut Scraper', motor: '0.25 HP', size: 'Standard', weight: '10 Kg', capacity: 'Quick Grate', price: 3000 },
      { model: 'Regular Coconut Scraper', motor: '1 HP', size: '21*12*20', weight: '24 Kg', capacity: 'Heavy Duty', price: 10000 }
    ]
  },
  {
    sku: 'SKU-NIR-ATTA-CHAKKI',
    name: 'Shiv Shakti Automatic Wooden Box Flour Mill (Ghar Ghanti)',
    price: 13300,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456207/shiv-shakti-products/cat_nir_p10_1_masala-peti_nir-037_mue6f0.jpg'
    ],
    description: 'Fully automatic domestic and commercial flour mill encased in a premium wooden cabinet. Grinds wheat, millet, corn, rice, and pulses with 100% nutrient retention.',
    features: [
      'Microprocessor auto-sensing grain detection and shut-off',
      'Cold grinding technology retains natural aroma and vitamins',
      'Stainless steel chamber with anti-microbial coating',
      'Whisper-quiet operation and child safety interlock'
    ],
    models: [
      { model: '1 HP Automatic Flour Mill', motor: '1 HP', size: '18*13*33', weight: '42 Kg', capacity: '5 to 7 Kg / Hr', price: 13300 },
      { model: '2 HP Automatic Flour Mill', motor: '2 HP', size: '19*15*34', weight: '50 Kg', capacity: '10 to 12 Kg / Hr', price: 17600 }
    ]
  },
  {
    sku: 'SKU-NIR-GRAVY-MACHINE',
    name: 'Shiv Shakti Commercial Gravy Machine (Food Grinder)',
    price: 7300,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456207/shiv-shakti-products/cat_nir_p10_1_masala-peti_nir-037_mue6f0.jpg'
    ],
    description: 'High capacity food grinding and gravy processing machine. Liquefies cooked onions, tomatoes, boiled cashews, and garlic ginger paste into fine restaurant gravies.',
    features: [
      'Hardened stainless steel cutter blades and perforated chambers',
      'Models available with hammer beating assembly for fibrous spices',
      'Continuous gravity feed hopper with heavy shut-off gate',
      'Motor power ranging from 1 HP up to 7 HP'
    ],
    models: [
      { model: '1 HP Gravy Machine (5" x 3")', motor: '1 HP', size: '19*13*19', weight: '28 Kg', capacity: '5" x 3" Chamber', price: 7300 },
      { model: '2 HP Gravy Machine (7" x 3")', motor: '2 HP', size: '20*16*26', weight: '35 Kg', capacity: '7" x 3" Chamber', price: 8500 },
      { model: '2 HP Gravy Machine (Hammer)', motor: '2 HP', size: '20*16*26', weight: '35 Kg', capacity: '7" x 3" Hammer', price: 9000 },
      { model: '3 HP Gravy Machine (9" x 3")', motor: '3 HP', size: '23*17*29', weight: '43 Kg', capacity: '9" x 3" Chamber', price: 11000 },
      { model: '3 HP Gravy Machine (Hammer)', motor: '3 HP', size: '23*17*29', weight: '43 Kg', capacity: '9" x 3" Hammer', price: 11500 },
      { model: '5 HP Gravy Machine (12" x 4")', motor: '5 HP', size: '23*17*18', weight: '71 Kg', capacity: '12" x 4" Chamber', price: 20000 },
      { model: '7 HP Gravy Machine (14" x 5.5")', motor: '7 HP', size: '35*22*43', weight: '120 Kg', capacity: '14" x 5.5" Chamber', price: 42000 }
    ]
  },
  {
    sku: 'SKU-NIR-2IN1-PULVERISER',
    name: 'Shiv Shakti S.S. Body 2-in-1 Pulveriser Machine',
    price: 14400,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456207/shiv-shakti-products/cat_nir_p10_1_masala-peti_nir-037_mue6f0.jpg'
    ],
    description: 'Dual-purpose stainless steel pulveriser machine capable of grinding both dry spices (turmeric, coriander, chilli) and grains into fine flour in a single pass.',
    features: [
      'Food-grade S.S. grinding chamber with multiple mesh sieves',
      'Cyclone hopper with zero flour loss dust cloth',
      'High-speed balanced rotor for cool and aroma-preserving grinding',
      'Outputs: 10 to 20 Kg per hour'
    ],
    models: [
      { model: '2 HP 2-in-1 Pulveriser', motor: '2 HP', size: '25*12*33', weight: '46 Kg', capacity: '10 to 14 Kg / Hr', price: 14400 },
      { model: '3 HP 2-in-1 Pulveriser', motor: '3 HP', size: '27*17*38', weight: '52 Kg', capacity: '18 to 20 Kg / Hr', price: 16500 }
    ]
  },
  {
    sku: 'SKU-NIR-BLOWER-PULVERISER',
    name: 'Shiv Shakti Blower Hammer Pulveriser (M.S. & S.S. Body)',
    price: 17000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456209/shiv-shakti-products/cat_nir_p11_1_electric-frying-pan_nir-041_prnpte.jpg'
    ],
    description: 'Heavy duty cyclone blower pulveriser with swinging hammer beaters. Automatically air-lifts pulverized spices and herbs into cyclone collector.',
    features: [
      'Integrated pneumatic blower and cyclone separator',
      'Heat-treated alloy steel hammer beaters',
      'Available in both mild steel (M.S.) and full stainless steel (S.S.)',
      'Capacities up to 100 Kg fine spice powder per hour'
    ],
    models: [
      { model: 'M.S. 2 HP W/O Motor', motor: 'Bare Unit', size: '30*24*45', weight: '56 Kg', capacity: '30 Kg / Hr', price: 17000 },
      { model: 'M.S. 2 HP With Motor', motor: '2 HP', size: '30*24*45', weight: '88 Kg', capacity: '30 Kg / Hr', price: 25000 },
      { model: 'M.S. 3 HP W/O Motor', motor: 'Bare Unit', size: '36*24*50', weight: '71 Kg', capacity: '45 Kg / Hr', price: 21000 },
      { model: 'M.S. 3 HP With Motor', motor: '3 HP', size: '36*24*50', weight: '120 Kg', capacity: '45 Kg / Hr', price: 32500 },
      { model: 'M.S. 5 HP W/O Motor', motor: 'Bare Unit', size: '40*30*55', weight: '114 Kg', capacity: '60 Kg / Hr', price: 26000 },
      { model: 'M.S. 5 HP With Motor', motor: '5 HP', size: '40*30*55', weight: '150 Kg', capacity: '60 Kg / Hr', price: 45000 },
      { model: 'S.S. 2 HP W/O Motor', motor: 'Bare Unit', size: '30*24*45', weight: '56 Kg', capacity: '30 Kg / Hr', price: 29500 },
      { model: 'S.S. 2 HP With Motor', motor: '2 HP', size: '30*24*45', weight: '88 Kg', capacity: '30 Kg / Hr', price: 38000 },
      { model: 'S.S. 3 HP W/O Motor', motor: 'Bare Unit', size: '36*24*50', weight: '71 Kg', capacity: '45 Kg / Hr', price: 33500 },
      { model: 'S.S. 3 HP With Motor', motor: '3 HP', size: '36*24*50', weight: '120 Kg', capacity: '45 Kg / Hr', price: 45000 },
      { model: 'S.S. 5 HP W/O Motor', motor: 'Bare Unit', size: '40*30*55', weight: '114 Kg', capacity: '60 Kg / Hr', price: 40000 },
      { model: 'S.S. 5 HP With Motor', motor: '5 HP', size: '40*30*55', weight: '150 Kg', capacity: '60 Kg / Hr', price: 58000 },
      { model: 'S.S. 10 HP W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '100 Kg', capacity: '100 Kg / Hr', price: 68000 },
      { model: 'S.S. 10 HP With Motor', motor: '10 HP', size: 'Standard', weight: '100 Kg', capacity: '100 Kg / Hr', price: 83600 }
    ]
  },
  {
    sku: 'SKU-NIR-NATURAL-MASALA',
    name: 'Shiv Shakti Natural Masala Grinder Machine (Hammer Mill)',
    price: 38500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456211/shiv-shakti-products/cat_nir_p12_1_mushti-machine_nir-045_qaib9r.jpg'
    ],
    description: 'Traditional slow-speed natural masala hammer grinder designed to preserve essential oils and natural aromatics in organic and Ayurvedic spices.',
    features: [
      'Multi-hammer beating system (2, 3, 4, 6, and 8 hammers)',
      'Preserves volatile aromatic oils without heating spices',
      'Heavy cast and square profile structural enclosures',
      'Available with or without industrial motor'
    ],
    models: [
      { model: '2 Hammer W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '190 Kg', capacity: '5-7 Kg / Hr', price: 38500 },
      { model: '2 Hammer (1 HP)', motor: '1 HP', size: 'Standard', weight: '190 Kg', capacity: '5-7 Kg / Hr', price: 46200 },
      { model: '3 Hammer W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '190 Kg', capacity: '10-12 Kg / Hr', price: 44000 },
      { model: '3 Hammer (1.5 HP)', motor: '1.5 HP', size: 'Standard', weight: '190 Kg', capacity: '10-12 Kg / Hr', price: 53900 },
      { model: '4 Hammer W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '190 Kg', capacity: '15-17 Kg / Hr', price: 60500 },
      { model: '4 Hammer (2 HP)', motor: '2 HP', size: 'Standard', weight: '190 Kg', capacity: '15-17 Kg / Hr', price: 71000 },
      { model: '4 Hammer Square W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '190 Kg', capacity: '15-17 Kg / Hr', price: 82500 },
      { model: '4 Hammer Square (3 HP)', motor: '3 HP', size: 'Standard', weight: '190 Kg', capacity: '15-17 Kg / Hr', price: 93500 },
      { model: '6 Hammer Square W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '220 Kg', capacity: 'Heavy Duty', price: 125000 },
      { model: '6 Hammer Square With Motor', motor: '5 HP', size: 'Standard', weight: '250 Kg', capacity: 'Heavy Duty', price: 140000 },
      { model: '8 Hammer Square W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '280 Kg', capacity: 'Industrial', price: 165000 },
      { model: '8 Hammer Square With Motor', motor: '7.5 HP', size: 'Standard', weight: '320 Kg', capacity: 'Industrial', price: 190000 }
    ]
  },
  {
    sku: 'SKU-NIR-VIBRO-SIFTER',
    name: 'Shiv Shakti Commercial Vibro Sifter Grading Machine',
    price: 48000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456211/shiv-shakti-products/cat_nir_p12_1_mushti-machine_nir-045_qaib9r.jpg'
    ],
    description: 'Multi-deck circular vibratory screening and sifting machine for grading flour, spices, seasonings, granules, and powders.',
    features: [
      'High amplitude vibration with 3-phase motor',
      'Quick-release clamp rings for rapid screen change',
      'Available in 2 Feet, 3 Feet, and 4 Feet sieve diameters',
      'Dust-tight enclosed construction'
    ],
    models: [
      { model: '2 Feet (3 Phase)', motor: '0.5 HP', size: '34*25*28', weight: '100 Kg', capacity: 'Screen Diameter 24"', price: 48000 },
      { model: '3 Feet (3 Phase)', motor: '1 HP', size: '49*36*32', weight: '150 Kg', capacity: 'Screen Diameter 36"', price: 70000 },
      { model: '4 Feet (3 Phase)', motor: '2 HP', size: '58*48*34', weight: '350 Kg', capacity: 'Screen Diameter 48"', price: 120000 }
    ]
  },
  {
    sku: 'SKU-NIR-COCONUT-SHREDDER',
    name: 'Shiv Shakti Coconut Shredding Machine (S.S. Model)',
    price: 38000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456214/shiv-shakti-products/cat_nir_p12_3_coconut-scraper-machine_nir-047_bsjouk.jpg'
    ],
    description: 'Industrial coconut kernel deshelling and shredding machine for producing fine desiccated coconut flakes for bakery and confectioneries.',
    features: [
      '100% food grade stainless steel construction',
      'Heavy 1 HP copper winding motor',
      'Continuous shredding drum with safety guard',
      'Hygienic easy wash-down structure'
    ],
    models: [
      { model: 'Coconut Shredding Machine S.S.', motor: '1 HP', size: 'Standard', weight: '55 Kg', capacity: 'Continuous', price: 38000 }
    ]
  },
  {
    sku: 'SKU-NIR-OIL-EXPELLER',
    name: 'Shiv Shakti Cold Press Oil Maker Machine (Oil Expeller)',
    price: 14900,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456213/shiv-shakti-products/cat_nir_p13_1_halwa-making-machine_nir-049_oy57xd.jpg'
    ],
    description: 'Compact cold press oil extraction machine for extracting 100% pure organic oil from groundnut, mustard, sesame, almond, and sunflower seeds.',
    features: [
      'S.S. food-grade screw press chamber',
      'Cold press extraction preserves natural nutrients and aroma',
      'Outputs 2 to 3 Liters pure oil per hour',
      'Clean cake discharge for easy disposal'
    ],
    models: [
      { model: 'S.S. Body Oil Maker', motor: '0.25 HP', size: '18*7*10', weight: '12 Kg', capacity: '2-3 Ltr / Hr', price: 14900 }
    ]
  },
  {
    sku: 'SKU-NIR-FRENCH-FRIES',
    name: 'Shiv Shakti Commercial French Fries / Finger Chips Machine',
    price: 1900,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456214/shiv-shakti-products/cat_nir_p13_3_small-dry-fruit-chips-machine-with-motor_nir-051_y7mmxn.jpg'
    ],
    description: 'Professional potato finger chips cutter available in manual lever action and electric motorized models for fast food joints and caterers.',
    features: [
      'Hardened cross-cutting grid blades (7mm and 10mm)',
      'Single stroke pushes whole potato into uniform fries',
      'Available in plastic, cast iron (C.I.), and automated electric S.S.',
      'Prevents potato breakage and ensures crispy fries'
    ],
    models: [
      { model: 'Plastic Body Manual Slicer', motor: 'Manual', size: '7*10*18', weight: '6 Kg', capacity: '7mm / 10mm Die', price: 1900 },
      { model: 'C.I. Body Heavy Manual Slicer', motor: 'Manual', size: '14*10*29', weight: '14 Kg', capacity: '7mm / 10mm Die', price: 3100 },
      { model: 'Auto S.S. Body with Motor', motor: '0.5 HP', size: '23*12*19', weight: '40 Kg', capacity: '7mm / 10mm Die', price: 17600 }
    ]
  },
  {
    sku: 'SKU-NIR-CABBAGE-CUTTER',
    name: 'Shiv Shakti Commercial Cabbage Cutter Machine',
    price: 16000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456213/shiv-shakti-products/cat_nir_p13_1_halwa-making-machine_nir-049_oy57xd.jpg'
    ],
    description: 'High speed motorized cabbage shredding machine for salad bars, manchurian, chowmein, and spring roll stuffing.',
    features: [
      'High speed 960 RPM razor cutting disc',
      'Produces fine, uniform shredded cabbage strips',
      'Heavy 1 HP motor with 80 to 100 Kg/Hr capacity',
      'Stainless steel hopper and cutting blades'
    ],
    models: [
      { model: 'Cabbage Cutter (960 RPM)', motor: '1 HP', size: '15*15*25', weight: '60 Kg', capacity: '80-100 Kg / Hr', price: 16000 }
    ]
  },
  {
    sku: 'SKU-NIR-CARROT-JUICER',
    name: 'Shiv Shakti Commercial Carrot & Fruit Juicer Machine',
    price: 8000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456214/shiv-shakti-products/cat_nir_p13_3_small-dry-fruit-chips-machine-with-motor_nir-051_y7mmxn.jpg'
    ],
    description: 'Centrifugal continuous juice extractor for carrots, apples, beetroot, and mixed vegetables with instant pulp ejection.',
    features: [
      'Continuous waste pulp ejection chute',
      'Rapid juice extraction: a glass in under 30 seconds',
      'Food grade stainless steel cutting cutter and mesh strainer',
      'Available in 2 glass, 4 glass, 6 glass, and slow cold-press models'
    ],
    models: [
      { model: 'Slow Speed Juicer (52 RPM)', motor: 'Low Speed', size: '9*8*16', weight: '10 Kg', capacity: 'Cold Press Pulp', price: 8000 },
      { model: '2 Glass Model', motor: '0.25 HP', size: '10*10*15', weight: '10 Kg', capacity: '2 Min / Cycle', price: 8000 },
      { model: '4 Glass Model', motor: '0.5 HP', size: '11*13*16', weight: '14 Kg', capacity: '2 Min / Cycle', price: 10500 },
      { model: '6 Glass Model', motor: '0.75 HP', size: '13*13*19', weight: '22 Kg', capacity: '2 Min / Cycle', price: 13800 }
    ]
  },
  {
    sku: 'SKU-NIR-SUGARCANE-MACHINE',
    name: 'Shiv Shakti Stainless Steel Sugarcane Juice Machine',
    price: 16500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456213/shiv-shakti-products/cat_nir_p13_1_halwa-making-machine_nir-049_oy57xd.jpg'
    ],
    description: 'Single-pass commercial sugarcane crushing machine with 3 food-grade stainless steel rollers. Extracts over 95% juice in a single pass.',
    features: [
      'Single pass 100% juice extraction with zero cane re-feeding',
      'Enclosed stainless steel rollers for maximum customer hygiene',
      'Waste bagasse auto-exit at rear',
      'Capacities from 50 up to 300 glasses per hour'
    ],
    models: [
      { model: 'Household Sugarcane Machine', motor: '0.25 HP', size: '12*8*12', weight: '18 Kg', capacity: '50-60 Glasses / Hr', price: 16500 },
      { model: 'Slim Body Sugarcane Machine', motor: '0.5 HP', size: '9*20*15', weight: '56 Kg', capacity: '200-250 Glasses / Hr', price: 25300 },
      { model: 'Hygienic Jumbo Sugarcane Machine', motor: '1.0 HP', size: '23*17*22', weight: '70 Kg', capacity: '200-300 Glasses / Hr', price: 30900 }
    ]
  },
  {
    sku: 'SKU-NIR-ORANGE-JUICER',
    name: 'Shiv Shakti Commercial Orange & Citrus Juicer Machine',
    price: 2000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456213/shiv-shakti-products/cat_nir_p13_1_halwa-making-machine_nir-049_oy57xd.jpg'
    ],
    description: 'Electric and manual citrus fruit reamer juicer for oranges, sweet limes (mosambi), and lemons without crushing bitter seeds.',
    features: [
      'Aluminium/SS conical reamer cones for all citrus sizes',
      'Electric 0.5 HP high torque motor models',
      'Extracts pure sweet juice with zero seed bitterness',
      'Capacities up to 100 glasses per hour'
    ],
    models: [
      { model: 'Hand Orange Juicer', motor: 'Manual', size: '8*6*21', weight: '4 Kg', capacity: 'Manual Press', price: 2000 },
      { model: 'Regular Electric Juicer', motor: '0.5 HP', size: '15*15*25', weight: '19 Kg', capacity: '80-100 Glasses / Hr', price: 14300 },
      { model: '2 in 1 Electric Juicer Model', motor: '0.5 HP', size: '15*15*25', weight: '19 Kg', capacity: '80-100 Glasses / Hr', price: 15500 }
    ]
  },
  {
    sku: 'SKU-NIR-ICE-GOLA',
    name: 'Shiv Shakti Commercial Ice Gola & Ice Tukda Machine',
    price: 3900,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456216/shiv-shakti-products/cat_nir_p14_2_dry-fruit-cutting-machine-tukda_nir-054_kuc6dx.jpg'
    ],
    description: 'Electric and manual ice shaving and crushing machines for snow cones, ice gola, and crushed bar cocktail ice.',
    features: [
      'High speed shaving blade creates snowflake ice consistency',
      'Ice tukda models crush ice blocks into uniform chunks',
      'Cast iron and stainless steel heavy vibration-free body',
      'Available with or without high-torque 1 HP motor'
    ],
    models: [
      { model: 'Ice Tukda Small W/O Motor', motor: 'Bare Unit', size: '17*15*16', weight: '9 Kg', capacity: 'Small Block', price: 3900 },
      { model: 'Ice Gola Machine W/O Motor', motor: 'Bare Unit', size: '11*16*26', weight: '19 Kg', capacity: 'Gola Shaver', price: 5500 },
      { model: 'Ice Tukda Big W/O Motor', motor: 'Bare Unit', size: '18*16*18', weight: '12 Kg', capacity: 'Big Block', price: 5500 },
      { model: 'Ice Tukda Small With Motor (0.5 HP)', motor: '0.5 HP', size: '17*15*30', weight: '36 Kg', capacity: 'Electric Tukda', price: 12700 },
      { model: 'Ice Gola Machine With Motor (1 HP)', motor: '1 HP', size: '20*16*31', weight: '30 Kg', capacity: 'Fast Snow Shaver', price: 14400 },
      { model: 'Ice Tukda Big With Motor (1 HP)', motor: '1 HP', size: '18*16*32', weight: '42 Kg', capacity: 'Heavy Duty Tukda', price: 15500 }
    ]
  },
  {
    sku: 'SKU-NIR-STEAM-BOX',
    name: 'Shiv Shakti Commercial Steam Idli, Dhokla & Khaman Box',
    price: 14700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456214/shiv-shakti-products/cat_nir_p14_1_dry-fruit-chips-and-powder-machine_nir-053_tgmzby.jpg'
    ],
    description: 'Commercial stainless steel steam cooking chamber with multiple tray tiers for steaming idli, Gujarati dhokla, and nylon khaman with zero water dripping on food.',
    features: [
      'Slanted roof prevents condensation water drops on food',
      'Standard 14" x 18" stainless steel trays with handles',
      'Integrated water tank with LPG burner heating bottom',
      'Options for standard trays, deep trays (2.5"), and idli cavity plates'
    ],
    models: [
      { model: 'Dhokla Steam Box 6 Tray', motor: 'Gas Heated', size: '24*25*35', weight: '39 Kg', capacity: '6 Trays (1.5 Kg / tray)', price: 14700 },
      { model: 'Idli Steam Box 6 Tray (72 Idlis)', motor: 'Gas Heated', size: '24*25*35', weight: '39 Kg', capacity: '6 Trays (12 Nos / tray)', price: 14700 },
      { model: 'Dhokla Steam Box 8 Tray', motor: 'Gas Heated', size: '24*25*39', weight: '45 Kg', capacity: '8 Trays (1.5 Kg / tray)', price: 15700 },
      { model: 'Idli Steam Box 8 Tray (96 Idlis)', motor: 'Gas Heated', size: '24*25*39', weight: '45 Kg', capacity: '8 Trays (12 Nos / tray)', price: 15700 },
      { model: 'Khaman Box 6 Tray (Deep 2.5")', motor: 'Gas Heated', size: '24*25*40', weight: '42 Kg', capacity: '6 Trays (2.5 Kg / tray)', price: 15700 },
      { model: 'Khaman 6 Tray with Chhapri', motor: 'Gas Heated', size: '24*25*40', weight: '45 Kg', capacity: '6 Trays with Dome Lid', price: 16600 },
      { model: 'Dhokla Steam Box 10 Tray', motor: 'Gas Heated', size: '24*25*46', weight: '53 Kg', capacity: '10 Trays (1.5 Kg / tray)', price: 17800 },
      { model: 'Idli Steam Box 10 Tray (120 Idlis)', motor: 'Gas Heated', size: '24*25*43', weight: '53 Kg', capacity: '10 Trays (12 Nos / tray)', price: 17800 },
      { model: 'Khaman Box 8 Tray (Deep 2.5")', motor: 'Gas Heated', size: '24*25*47', weight: '47 Kg', capacity: '8 Trays (2.5 Kg / tray)', price: 17800 },
      { model: 'Khaman 8 Tray with Chhapri', motor: 'Gas Heated', size: '24*25*47', weight: '50 Kg', capacity: '8 Trays with Dome Lid', price: 19000 },
      { model: 'Dhokla Steam Box 12 Tray', motor: 'Gas Heated', size: '24*25*47', weight: '60 Kg', capacity: '12 Trays (1.5 Kg / tray)', price: 19900 },
      { model: 'Idli Steam Box 12 Tray (144 Idlis)', motor: 'Gas Heated', size: '24*25*47', weight: '60 Kg', capacity: '12 Trays (12 Nos / tray)', price: 19900 },
      { model: 'Khaman Box 10 Tray (Deep 2.5")', motor: 'Gas Heated', size: '24*25*53', weight: '55 Kg', capacity: '10 Trays (2.5 Kg / tray)', price: 21000 },
      { model: 'Khaman Box 12 Tray (Deep 2.5")', motor: 'Gas Heated', size: '24*25*60', weight: '63 Kg', capacity: '12 Trays (2.5 Kg / tray)', price: 22000 },
      { model: 'Khaman 10 Tray with Chhapri', motor: 'Gas Heated', size: '24*25*53', weight: '58 Kg', capacity: '10 Trays with Dome Lid', price: 22500 }
    ]
  },
  {
    sku: 'SKU-NIR-MASALA-GRINDER',
    name: 'Shiv Shakti Commercial Masala Grinder Machine',
    price: 7200,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456217/shiv-shakti-products/cat_nir_p15_1_roti-making-machine_nir-057_kitcpl.jpg'
    ],
    description: 'High-speed dry masala and spice batch pulverizer. Grinds hard dry spices like cinnamon, dry ginger, cloves, turmeric, and black pepper into ultra-fine powder.',
    features: [
      'Tilting jar mechanism for complete powder pouring',
      'High-speed 28000 RPM stainless steel cutter blades',
      'Overload protective circuit breaker',
      'Batch sizes: 500gm, 1 Kg, 2 Kg, and 3 Kg'
    ],
    models: [
      { model: '500 GM Masala Grinder', motor: 'High RPM', size: 'Compact', weight: '8 Kg', capacity: '500 gm Batch', price: 7200 },
      { model: '1 Kg Masala Grinder', motor: 'High RPM', size: 'Medium', weight: '12 Kg', capacity: '1 Kg Batch', price: 11000 },
      { model: '2 Kg Masala Grinder', motor: 'High RPM', size: 'Heavy', weight: '16 Kg', capacity: '2 Kg Batch', price: 13300 },
      { model: '3 Kg Masala Grinder', motor: 'High RPM', size: 'Industrial', weight: '20 Kg', capacity: '3 Kg Batch', price: 16500 }
    ]
  },
  {
    sku: 'SKU-NIR-MASALA-PETI',
    name: 'Shiv Shakti Stainless Steel Commercial Masala Peti',
    price: 1100,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456217/shiv-shakti-products/cat_nir_p15_1_roti-making-machine_nir-057_kitcpl.jpg'
    ],
    description: 'Heavy gauge stainless steel modular spice box (Masala Peti) with transparent or stainless lids for organizing commercial kitchen condiments.',
    features: [
      'Food grade S.S. with seamless deep-drawn removable cups',
      'Hygienic dust-proof hinged cover lid',
      'Configurations: 6 box, 9 box, and 12 box',
      'Available in 500gm cup and 1 Kg cup depth sizes'
    ],
    models: [
      { model: '6 Box Masala Peti (500gm)', motor: 'None', size: '16*11*4', weight: '3 Kg', capacity: '6 x 500gm cups', price: 1100 },
      { model: '9 Box Masala Peti (500gm)', motor: 'None', size: '16*16*4', weight: '4.5 Kg', capacity: '9 x 500gm cups', price: 1400 },
      { model: '6 Box Masala Peti (1 Kg)', motor: 'None', size: '16*11*6', weight: '4 Kg', capacity: '6 x 1 Kg cups', price: 1600 },
      { model: '12 Box Masala Peti (500gm)', motor: 'None', size: '21*16*4', weight: '6 Kg', capacity: '12 x 500gm cups', price: 1800 },
      { model: '9 Box Masala Peti (1 Kg)', motor: 'None', size: '16*16*6', weight: '5.5 Kg', capacity: '9 x 1 Kg cups', price: 1900 },
      { model: '12 Box Masala Peti (1 Kg)', motor: 'None', size: '21*16*6', weight: '7 Kg', capacity: '12 x 1 Kg cups', price: 2500 }
    ]
  },
  {
    sku: 'SKU-NIR-PIZZA-OVEN',
    name: 'Shiv Shakti Commercial Gas / Electric Pizza Oven',
    price: 7800,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456217/shiv-shakti-products/cat_nir_p15_1_roti-making-machine_nir-057_kitcpl.jpg'
    ],
    description: 'High-temperature stone-bed pizza and bakery deck oven. Reaches 400°C for baking crispy Neapolitan pizzas, garlic breads, cookies, and buns.',
    features: [
      'Refractory cordierite pizza stone baking deck',
      'Heavy double-wall glass wool insulation',
      'Dual top and bottom independent heat control',
      'Capacities from 2 pizzas up to 12 pizzas per batch'
    ],
    models: [
      { model: '8" x 12" (2 Nos Pizza)', motor: 'Deck Oven', size: '12*22*15', weight: '14 Kg', capacity: '2 Pizzas', price: 7800 },
      { model: '10" x 16" (4 Nos Pizza)', motor: 'Deck Oven', size: '16*27*15', weight: '18 Kg', capacity: '4 Pizzas', price: 8800 },
      { model: '12" x 18" (6 Nos Pizza)', motor: 'Deck Oven', size: '18*29*15', weight: '24 Kg', capacity: '6 Pizzas', price: 9900 },
      { model: '18" x 18" (8 Nos Pizza)', motor: 'Deck Oven', size: '25*29*15', weight: '29 Kg', capacity: '8 Pizzas', price: 11000 },
      { model: '18" x 24" (10 Nos Pizza)', motor: 'Deck Oven', size: '25*37*15', weight: '35 Kg', capacity: '10 Pizzas', price: 16000 },
      { model: '24" x 24" (12 Nos Pizza)', motor: 'Deck Oven', size: '31*37*15', weight: '40 Kg', capacity: '12 Pizzas', price: 19300 }
    ]
  },
  {
    sku: 'SKU-NIR-SANDWICH-GRILLER',
    name: 'Shiv Shakti Commercial Sandwich Griller Machine',
    price: 6700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456217/shiv-shakti-products/cat_nir_p15_1_roti-making-machine_nir-057_kitcpl.jpg'
    ],
    description: 'Heavy duty cast iron contact sandwich griller and panini press with ribbed plates for fast toasting and appetizing grill marks.',
    features: [
      'Heavy seasoned cast iron grill plates with deep ribs',
      'Adjustable counterbalanced top plate pressure',
      'High temperature thermostat up to 300°C',
      'Available in Single, Double, and Jumbo capacities'
    ],
    models: [
      { model: 'Single Type Griller (4 Nos)', motor: 'Electric Heat', size: '18*13*12', weight: '9 Kg', capacity: '4 Sandwiches', price: 6700 },
      { model: 'Jumbo Type Griller', motor: 'Electric Heat', size: 'Standard', weight: '15 Kg', capacity: 'Jumbo Panini', price: 12000 },
      { model: 'Double Type Griller (8 Nos)', motor: 'Electric Heat', size: '20*27*13', weight: '21 Kg', capacity: '8 Sandwiches', price: 12700 }
    ]
  },
  {
    sku: 'SKU-NIR-DEEP-FRYER',
    name: 'Shiv Shakti Commercial Deep Fryer (Single & Double Tank)',
    price: 7800,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456217/shiv-shakti-products/cat_nir_p15_1_roti-making-machine_nir-057_kitcpl.jpg'
    ],
    description: 'High-power electric stainless steel deep fat fryer with precise digital thermostat for frying samosas, fries, chicken, and kachoris.',
    features: [
      'Stainless steel wire mesh frying baskets with insulated handles',
      'Cool-zone technology prevents crumbs from burning in oil',
      'Options with floor stands and dual independent oil wells',
      'Capacities: 5 Liters and 13 Liters'
    ],
    models: [
      { model: '5 Ltr Regular Fryer', motor: 'Electric Heat', size: '27*12*16', weight: '10 Kg', capacity: '5 Liter Tank', price: 7800 },
      { model: '5 Ltr Fryer With Stand', motor: 'Electric Heat', size: '27*12*36', weight: '13 Kg', capacity: '5 Liter Tank', price: 8800 },
      { model: '5 Ltr Double Tank Fryer', motor: 'Electric Heat', size: '27*24*15', weight: '18 Kg', capacity: '2 x 5 Liter Tanks', price: 15500 },
      { model: '13 Ltr Regular Fryer', motor: 'Electric Heat', size: '28*14*18', weight: '15 Kg', capacity: '13 Liter Tank', price: 15500 },
      { model: '5 Ltr Double with Stand', motor: 'Electric Heat', size: '28*24*36', weight: '22 Kg', capacity: '2 x 5 Liter Tanks', price: 17100 },
      { model: '13 Ltr Fryer With Stand', motor: 'Electric Heat', size: '29*16*31', weight: '20 Kg', capacity: '13 Liter Tank', price: 17600 },
      { model: '13 Ltr Double Tank Fryer', motor: 'Electric Heat', size: '29*32*21', weight: '30 Kg', capacity: '2 x 13 Liter Tanks', price: 27000 },
      { model: '13 Ltr Double with Stand', motor: 'Electric Heat', size: '29*32*39', weight: '35 Kg', capacity: '2 x 13 Liter Tanks', price: 32500 }
    ]
  },
  {
    sku: 'SKU-NIR-ELECTRIC-KADAI',
    name: 'Shiv Shakti Electric Commercial Kadai with Stand',
    price: 6700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456218/shiv-shakti-products/cat_nir_p16_1_potato-slicer-machine_nir-061_bujypi.jpg'
    ],
    description: 'Electric immersion heated stainless steel cooking kadai mounted on heavy tubular stands for sweet shops, mess halls, and caterers.',
    features: [
      'Heavy-duty industrial heating elements encased under bowl',
      'Precise thermostat prevents oil overheating and smoking',
      'Available in circular and square stand frame profiles',
      'Bowl diameters from 8" up to 36" (up to 30 Liter oil capacity)'
    ],
    models: [
      { model: 'Round 12" Kadai (5 Ltr)', motor: 'Electric', size: 'Standard', weight: '15 Kg', capacity: '5 Ltr Capacity', price: 6700 },
      { model: 'Round 16" Kadai (8 Ltr)', motor: 'Electric', size: 'Standard', weight: '20 Kg', capacity: '8 Ltr Capacity', price: 8300 },
      { model: '8" Kadai with Stand (6 Ltr)', motor: 'Electric', size: '23*23*32', weight: '21 Kg', capacity: '6 Ltr Capacity', price: 12200 },
      { model: '20" Kadai with Stand (10 Ltr)', motor: 'Electric', size: '25*25*32', weight: '23 Kg', capacity: '10 Ltr Capacity', price: 17100 },
      { model: '22" Kadai with Stand (15 Ltr)', motor: 'Electric', size: '26.5*26.5*33', weight: '27 Kg', capacity: '15 Ltr Capacity', price: 20500 },
      { model: '24" Kadai with Stand (20 Ltr)', motor: 'Electric', size: '28*28*34', weight: '31 Kg', capacity: '20 Ltr Capacity', price: 23200 },
      { model: '26" Kadai with Stand (24 Ltr)', motor: 'Electric', size: '30*30*36', weight: '35 Kg', capacity: '24 Ltr Capacity', price: 24800 },
      { model: '28" Kadai with Stand (26 Ltr)', motor: 'Electric', size: '33.5*33.5*38', weight: '40 Kg', capacity: '26 Ltr Capacity', price: 29000 },
      { model: '30" Kadai with Stand (28 Ltr)', motor: 'Electric', size: '35*35*32', weight: '44 Kg', capacity: '28 Ltr Capacity', price: 33000 },
      { model: '36" Kadai with Stand (30 Ltr)', motor: 'Electric', size: '41*41*32', weight: '56 Kg', capacity: '30 Ltr Capacity', price: 52900 }
    ]
  },
  {
    sku: 'SKU-NIR-DEHYDRATOR',
    name: 'Shiv Shakti Commercial Food Dehydrator Machine',
    price: 18000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456218/shiv-shakti-products/cat_nir_p16_1_potato-slicer-machine_nir-061_bujypi.jpg'
    ],
    description: 'Hot air circulation food and herb dehydrator machine with multi-tier stainless steel mesh trays for drying fruits, jerky, vegetables, and tea.',
    features: [
      '360-degree horizontal forced hot air circulation',
      'Precise digital timer (up to 24 hrs) and digital thermostat',
      'Stainless steel body with heat-resistant tempered glass doors',
      'Capacities from 6 Trays up to 96 Trays'
    ],
    models: [
      { model: '6 Tray Dehydrator', motor: 'Digital Control', size: '53*39*37.5 cm', weight: '9.5 Kg', capacity: '3-5 Kg / Batch', price: 18000 },
      { model: '10 Tray Dehydrator', motor: 'Digital Control', size: '47*41.5*50 cm', weight: '10 Kg', capacity: '5-8 Kg / Batch', price: 23000 },
      { model: '12 Tray Dehydrator', motor: 'Digital Control', size: '64*54*52 cm', weight: '20 Kg', capacity: '10-15 Kg / Batch', price: 35000 },
      { model: '20 Tray Dehydrator', motor: 'Digital Control', size: '64*54*89 cm', weight: '29 Kg', capacity: '20-25 Kg / Batch', price: 47000 },
      { model: '24 Tray Dehydrator', motor: 'Digital Control', size: '64*54*89 cm', weight: '29 Kg', capacity: '25-30 Kg / Batch', price: 55000 },
      { model: '40 Tray Dehydrator', motor: 'Digital Control', size: '65*52*181 cm', weight: '56.5 Kg', capacity: '40-50 Kg / Batch', price: 90000 },
      { model: '48 Tray Dehydrator', motor: 'Digital Control', size: '65*52*181 cm', weight: '106 Kg', capacity: '50-60 Kg / Batch', price: 100000 },
      { model: '96 Tray Dehydrator', motor: 'Digital Control', size: '105*66*186 cm', weight: '136.8 Kg', capacity: '100-120 Kg / Batch', price: 180000 }
    ]
  },
  {
    sku: 'SKU-NIR-BATCH-FRYER',
    name: 'Shiv Shakti Continuous Automatic Batch Fryer (110 to 140 Ltr)',
    price: 160000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456220/shiv-shakti-products/cat_nir_p17_1_potato-peeler-machine_nir-065_tbal2b.jpg'
    ],
    description: 'Industrial fully automatic continuous rectangular batch fryer with mechanized basket lifting and tilting. Engineered for commercial production of kurkure, fryums, wafers, and dal.',
    features: [
      'Pan dimensions: 22" x 46", Full machine size: 100" x 60" x 85"',
      'Motorized basket lift mechanism with digital timer',
      'Kurkure & Fryums: 250 Kg/Hr, Potato/Banana Wafers: 55 Kg/Hr, Chana Dal: 150 Kg/Hr',
      'Heavy 3.25 HP power composition with industrial diesel/gas burners'
    ],
    models: [
      { model: 'Rectangular Fryer 110-140 Ltr (Fully Automatic)', motor: '3.25 HP', size: '100*60*85', weight: '450 Kg', capacity: '250 Kg Kurkure / Hr', price: 160000 }
    ]
  },
  {
    sku: 'SKU-NIR-ROASTING-MACHINE',
    name: 'Shiv Shakti Commercial Roasting Machine (Tilting Type)',
    price: 75000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456220/shiv-shakti-products/cat_nir_p17_1_potato-peeler-machine_nir-065_tbal2b.jpg'
    ],
    description: 'Rotary bowl roasting machine with dual gas burners and tilting gearbox. Designed for dry roasting spices, grains, peanuts, and dry fruits.',
    features: [
      'Heavy S.S. 202 grade bowl with worm gear tilting',
      '2 Nos. 12-inch high output commercial gas burners',
      'Bowl rotates at 16 RPM driven by 1 HP 1440 RPM motor',
      'Batch capacity: 15 to 20 Kg per batch'
    ],
    models: [
      { model: 'Roasting Machine (Tilting Type)', motor: '1 HP (16 RPM Bowl)', size: '40*52*58', weight: '200 Kg', capacity: '15-20 Kg / Batch', price: 75000 }
    ]
  },
  {
    sku: 'SKU-NIR-SHRIKHAND-MIXER',
    name: 'Shiv Shakti Shrikhand & Maska Mixing Machine',
    price: 19000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456221/shiv-shakti-products/cat_nir_p17_3_farshan-mixing-machine_nir-067_mbkspg.jpg'
    ],
    description: 'Planetary mixing machine specifically engineered for blending hung curd (chakka), sugar, cardamom, and saffron into velvety Shrikhand.',
    features: [
      'High-shear mixing blades eliminate lumps in thick dairy curd',
      'Capacities from 5 Kg up to 50 Kg per batch',
      'Heavy duty motor and reduction gearbox',
      'Maska butter kneading models available'
    ],
    models: [
      { model: '5 Kg Shrikhand Mixer', motor: '0.5 HP', size: '25*18*35', weight: '90 Kg', capacity: '1-5 Kg', price: 19000 },
      { model: '10 Kg Shrikhand Mixer', motor: '1 HP', size: '23*21*48', weight: '98 Kg', capacity: '3-10 Kg', price: 21500 },
      { model: '15 Kg Shrikhand Mixer', motor: '1 HP', size: '27*21*48', weight: '115 Kg', capacity: '7-15 Kg', price: 24000 },
      { model: 'Maska Butter Machine', motor: '1.5 HP', size: '25*20*39', weight: '60 Kg', capacity: '30-40 Kg / Hr', price: 26000 },
      { model: '20 Kg Shrikhand Mixer', motor: '1.5 HP', size: '35*25*40', weight: '125 Kg', capacity: '10-20 Kg', price: 28500 },
      { model: '30 Kg Shrikhand Mixer', motor: '2 HP', size: '40*30*45', weight: '135 Kg', capacity: '15-30 Kg', price: 34000 },
      { model: '50 Kg Shrikhand Mixer', motor: '3 HP', size: '45*35*52', weight: '166 Kg', capacity: '25-50 Kg', price: 56500 }
    ]
  },
  {
    sku: 'SKU-NIR-GARLIC-MACHINE',
    name: 'Shiv Shakti Commercial Garlic Breaker & Peeler Machine',
    price: 8300,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456222/shiv-shakti-products/cat_nir_p18_1_chatni-machine_nir-069_ny5avx.jpg'
    ],
    description: 'Integrated garlic clove breaker and pneumatic dry skin peeler. Gently breaks whole garlic bulbs into cloves and peels them with 98% efficiency without damaging the clove.',
    features: [
      'Silicone roller clove separator does not bruise cloves',
      'Dry skin pneumatic peel separation with zero water contact',
      'Outputs up to 70 Kg cloves per hour',
      'Stainless steel food contact parts'
    ],
    models: [
      { model: 'Garlic Peeler Machine (S.S.)', motor: '0.25 HP', size: '11*9*23', weight: '15 Kg', capacity: '10-12 Kg / Hr', price: 8300 },
      { model: 'Garlic Breaker W/O Motor', motor: 'Bare Unit', size: 'Standard', weight: '40 Kg', capacity: '60-70 Kg / Hr', price: 19250 },
      { model: 'Garlic Breaker with Motor (1 HP)', motor: '1 HP', size: 'Standard', weight: '45 Kg', capacity: '60-70 Kg / Hr', price: 24200 }
    ]
  },
  {
    sku: 'SKU-NIR-GAS-CHULA',
    name: 'Shiv Shakti Stainless Steel Commercial Gas Chula / Bhatti',
    price: 1700,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456222/shiv-shakti-products/cat_nir_p18_1_chatni-machine_nir-069_ny5avx.jpg'
    ],
    description: 'Heavy duty stainless steel commercial gas stoves (chulas) designed for high pressure LPG cylinders. Built for heavy brass and aluminium catering degs.',
    features: [
      'Thick stainless steel tubular frame construction',
      'Cast iron burner tops with needle valve flame control',
      'Available in Round and Square models from 10" up to 18"',
      'Supports loads over 100 Kg without bending'
    ],
    models: [
      { model: '10" x 10" Round Chula', motor: 'Gas Bhatti', size: '10" x 10"', weight: '4 Kg', capacity: 'Commercial Burner', price: 1700 },
      { model: '10" x 10" Square Chula', motor: 'Gas Bhatti', size: '10" x 10"', weight: '3.2 Kg', capacity: 'Commercial Burner', price: 1700 },
      { model: '12" x 12" Round Chula', motor: 'Gas Bhatti', size: '12" x 12"', weight: '5 Kg', capacity: 'Commercial Burner', price: 1800 },
      { model: '12" x 12" Square Chula', motor: 'Gas Bhatti', size: '12" x 12"', weight: '3.5 Kg', capacity: 'Commercial Burner', price: 1800 },
      { model: '15" x 15" Round Chula', motor: 'Gas Bhatti', size: '15" x 15"', weight: '7.5 Kg', capacity: 'Heavy Deg Burner', price: 2200 },
      { model: '15" x 15" Square Chula', motor: 'Gas Bhatti', size: '15" x 15"', weight: '5.5 Kg', capacity: 'Heavy Deg Burner', price: 2200 },
      { model: '18" x 18" Square Chula', motor: 'Gas Bhatti', size: '18" x 18"', weight: '10 Kg', capacity: 'Jumbo Deg Burner', price: 2800 }
    ]
  },
  {
    sku: 'SKU-NIR-CHINESE-RANGE',
    name: 'Shiv Shakti Commercial Chinese Cooking Gas Range',
    price: 15500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456224/shiv-shakti-products/cat_nir_p19_1_mixer-grinder-square_nir-073_pzh80x.jpg'
    ],
    description: 'Heavy gauge stainless steel commercial Chinese cooking range with high pressure jet burners, water wash trough, and back-splash wall.',
    features: [
      'T-35 / M-22 high-heat wok blast jet burners',
      'Continuous stainless steel drain trough for easy cleaning',
      'Full stainless steel body with sturdy heavy legs',
      'Configurations: 1 Burner, 2 Burner, and 3 Burner'
    ],
    models: [
      { model: '1 Burner Chinese Range', motor: 'Gas Range', size: '21*23*36', weight: '35 Kg', capacity: '1 Wok Station', price: 15500 },
      { model: '2 Burner Chinese Range', motor: 'Gas Range', size: '26*45*36', weight: '53 Kg', capacity: '2 Wok Stations', price: 22000 },
      { model: '3 Burner Chinese Range', motor: 'Gas Range', size: '26*72*36', weight: '83 Kg', capacity: '3 Wok Stations', price: 26500 }
    ]
  },
  {
    sku: 'SKU-NIR-PUFFER-TABLE',
    name: 'Shiv Shakti Stainless Steel Chapati & Dosa Puffer Table',
    price: 10500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456224/shiv-shakti-products/cat_nir_p19_1_mixer-grinder-square_nir-073_pzh80x.jpg'
    ],
    description: 'Commercial tawa puffer table for making rotis, parathas, and dosas with integrated side gas grill puffer for rapid balloon puffing.',
    features: [
      'Heavy machined cast iron or mild steel tawa plate (12mm to 16mm)',
      'Side live-flame puffer grid for instant roti puffing',
      'Available with tabletop or full standing tubular frames',
      'Sizes: 1.5 x 3 Feet and 2 x 4 Feet'
    ],
    models: [
      { model: 'Dosa Puffer 1.5 x 3 Feet', motor: 'Gas Heated', size: '18*39*12', weight: '38 Kg', capacity: '1.5 x 3 Ft Tawa', price: 10500 },
      { model: 'Chapati Puffer 1.5 x 3 Feet', motor: 'Gas Heated', size: '18*39*12', weight: '38 Kg', capacity: '1.5 x 3 Ft Tabletop', price: 11000 },
      { model: 'Dosa Puffer With Stand (1.5 x 3 Ft)', motor: 'Gas Heated', size: '18*39*32', weight: '45 Kg', capacity: '1.5 x 3 Ft with Stand', price: 11000 },
      { model: 'Chapati Puffer With Stand (1.5 x 3 Ft)', motor: 'Gas Heated', size: '18*39*32', weight: '45 Kg', capacity: '1.5 x 3 Ft with Stand', price: 12200 },
      { model: 'Dosa Puffer 2 x 4 Feet', motor: 'Gas Heated', size: '24*51*15', weight: '60 Kg', capacity: '2 x 4 Ft Tabletop', price: 17100 },
      { model: 'Chapati Puffer 2 x 4 Feet', motor: 'Gas Heated', size: '24*51*15', weight: '60 Kg', capacity: '2 x 4 Ft Tabletop', price: 17600 },
      { model: 'Dosa Puffer With Stand (2 x 4 Ft)', motor: 'Gas Heated', size: '24*51*32', weight: '65 Kg', capacity: '2 x 4 Ft with Stand', price: 17600 },
      { model: 'Chapati Puffer With Stand (2 x 4 Ft)', motor: 'Gas Heated', size: '24*51*32', weight: '65 Kg', capacity: '2 x 4 Ft with Stand', price: 19800 }
    ]
  },
  {
    sku: 'SKU-NIR-BAIN-MARIE',
    name: 'Shiv Shakti Stainless Steel Bain Marie (Food Warmer Counter)',
    price: 13000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456224/shiv-shakti-products/cat_nir_p19_1_mixer-grinder-square_nir-073_pzh80x.jpg'
    ],
    description: 'Electric and gas heated Bain Marie food warmer counters for banquet buffets and self-service restaurants. Keeps dal, gravies, and curries hot and fresh.',
    features: [
      'High grade food safe GN containers with notched lids',
      'Water bath indirect heating prevents food from drying or burning',
      'Available in 4, 6, 8, 10, 12, and 14 bowl arrangements',
      'Options with glass sneeze guards and under-shelf stands'
    ],
    models: [
      { model: '4 Bowl Table Top (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '18 Kg', capacity: '4 Round Bowls', price: 13000 },
      { model: '4 Bowl With Stand (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '24 Kg', capacity: '4 Round Bowls', price: 15000 },
      { model: '4 Bowl Table Top (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '20 Kg', capacity: '4 Square Pans', price: 15000 },
      { model: '6 Bowl Table Top (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '25 Kg', capacity: '6 Round Bowls', price: 16000 },
      { model: '4 Bowl With Stand (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '26 Kg', capacity: '4 Square Pans', price: 17000 },
      { model: '8 Bowl Table Top (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '30 Kg', capacity: '8 Round Bowls', price: 17000 },
      { model: '6 Bowl With Stand (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '32 Kg', capacity: '6 Round Bowls', price: 18000 },
      { model: '6 Bowl Table Top (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '28 Kg', capacity: '6 Square Pans', price: 19000 },
      { model: '10 Bowl Table Top (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '36 Kg', capacity: '10 Round Bowls', price: 19000 },
      { model: '8 Bowl With Stand (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '38 Kg', capacity: '8 Round Bowls', price: 20000 },
      { model: '6 Bowl With Stand (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '35 Kg', capacity: '6 Square Pans', price: 21000 },
      { model: '8 Bowl Table Top (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '35 Kg', capacity: '8 Square Pans', price: 21000 },
      { model: '10 Bowl With Stand (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '42 Kg', capacity: '10 Round Bowls', price: 21000 },
      { model: '12 Bowl Table Top (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '42 Kg', capacity: '12 Round Bowls', price: 21500 },
      { model: '12 Bowl With Stand (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '48 Kg', capacity: '12 Round Bowls', price: 23500 },
      { model: '8 Bowl With Stand (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '42 Kg', capacity: '8 Square Pans', price: 24000 },
      { model: '10 Bowl Table Top (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '42 Kg', capacity: '10 Square Pans', price: 24000 },
      { model: '10 Bowl With Stand (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '48 Kg', capacity: '10 Square Pans', price: 26000 },
      { model: '12 Bowl Table Top (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '48 Kg', capacity: '12 Square Pans', price: 27500 },
      { model: '12 Bowl With Stand (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '54 Kg', capacity: '12 Square Pans', price: 29500 },
      { model: '14 Bowl Table Top (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '50 Kg', capacity: '14 Round Bowls', price: 29500 },
      { model: '14 Bowl With Stand (Round)', motor: 'Hot Water Bath', size: 'Standard', weight: '56 Kg', capacity: '14 Round Bowls', price: 31500 },
      { model: '14 Bowl Table Top (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '56 Kg', capacity: '14 Square Pans', price: 36500 },
      { model: '14 Bowl With Stand (Square)', motor: 'Hot Water Bath', size: 'Standard', weight: '64 Kg', capacity: '14 Square Pans', price: 38500 }
    ]
  },
  {
    sku: 'SKU-NIR-BREAD-CUTTER',
    name: 'Shiv Shakti Commercial Bread & Rusk Cutter Machine',
    price: 27600,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456228/shiv-shakti-products/cat_nir_p21_1_blower-hammer-pulverizer_nir-081_pzhaux.jpg'
    ],
    description: 'Electric bread loaf and rusk slicing machine with harmonic oscillating serrated stainless steel blades. Slices entire loaf in 5 seconds with zero crumbing.',
    features: [
      'Food grade stainless steel oscillating cutting blades',
      'Adjustable bread pusher and crumb collection tray',
      'Bread loaf model and adjustable heavy rusk cutter model',
      'Perfect slice thickness and crumb retention'
    ],
    models: [
      { model: 'Bread Cutter 0.5 HP (2280 RPM)', motor: '0.5 HP (2280 RPM)', size: '20*32*17', weight: '46 Kg', capacity: 'Standard Loaves', price: 27600 },
      { model: 'Bread / Rusk Cutter 1 HP (Adjustable)', motor: '1 HP (M.S. Body / S.S. Blade)', size: '65*34*43', weight: '130 Kg', capacity: 'Adjustable Thickness', price: 38500 }
    ]
  },
  {
    sku: 'SKU-NIR-MANCHURIAN-BALL',
    name: 'Shiv Shakti Manchurian Ball Making Machine',
    price: 7800,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456228/shiv-shakti-products/cat_nir_p21_1_blower-hammer-pulverizer_nir-081_pzhaux.jpg'
    ],
    description: 'Manual and electric vegetable ball forming machine for Chinese veg manchurian, kofta, and cheese balls. Forms perfectly round balls rapidly.',
    features: [
      'Full stainless steel body with 3 Kg bowl capacity',
      'Dual interchangeable hole sizes: 18mm and 25mm',
      'Produces hundreds of uniform balls per minute',
      'Disassembles in seconds for complete washing'
    ],
    models: [
      { model: 'Manchurian Ball Machine (18mm & 25mm)', motor: 'Manual / Auto Feed', size: '23*41*28', weight: '10 Kg', capacity: '3 Kg Bowl (18/25mm)', price: 7800 }
    ]
  },
  {
    sku: 'SKU-NIR-PAPAD-MACHINE',
    name: 'Shiv Shakti Semi-Automatic Papad Making Machine',
    price: 16500,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456228/shiv-shakti-products/cat_nir_p21_1_blower-hammer-pulverizer_nir-081_pzhaux.jpg'
    ],
    description: 'High capacity papad, mathiya, and chorafali pressing machine. Rolls dough into uniform, round, translucent papad circles continuously.',
    features: [
      'Non-stick pressing rollers with thickness adjustment',
      'Outputs 55 to 60 Kg papad per day',
      'Heavy 0.5 HP electric motor with gear transmission',
      'Zero manual rolling effort required'
    ],
    models: [
      { model: 'Papad Machine 0.5 HP', motor: '0.5 HP', size: '27*30*18', weight: '65 Kg', capacity: '55-60 Kg / Day', price: 16500 }
    ]
  },
  {
    sku: 'SKU-NIR-DIESEL-BHATTI',
    name: 'Shiv Shakti Commercial Diesel Bhatti (Blower Burner)',
    price: 15000,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456228/shiv-shakti-products/cat_nir_p21_1_blower-hammer-pulverizer_nir-081_pzhaux.jpg'
    ],
    description: 'High-temperature diesel blower bhatti for large wedding cooking, jalebi frying, and boiling huge cauldrons at high fuel economy.',
    features: [
      'High-pressure air blower ensures smokeless blue flame',
      'Integrated 20 Liter heavy diesel fuel tank',
      '2-in-1 dual burner models available for simultaneous cooking',
      'Cuts cooking fuel costs significantly compared to commercial LPG'
    ],
    models: [
      { model: 'Diesel Bhatti (0.25 HP Blower)', motor: '0.25 HP Blower', size: '49*19*23', weight: '20 Ltr Tank', capacity: 'High Output Flame', price: 15000 },
      { model: '2 in 1 Diesel Bhatti', motor: '0.25 HP Blower', size: '49*19*23', weight: '20 Ltr Tank', capacity: 'Dual Flame Station', price: 17000 }
    ]
  },
  {
    sku: 'SKU-NIR-TANDOOR-BHATTI',
    name: 'Shiv Shakti Commercial M.S. Tandoor Bhatti',
    price: 6100,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456231/shiv-shakti-products/cat_nir_p22_4_tandoor-bhatti_nir-088_epjl5i.jpg'
    ],
    description: 'Heavy duty commercial clay tandoor oven housed in a reinforced mild steel casing with castor wheels for baking tandoori rotis, naans, and tikkas.',
    features: [
      'Authentic handcrafted earthen clay pot inside',
      'Thermal mineral wool insulation keeps outer casing safe',
      'Heavy mild steel outer barrel with mobility wheels',
      'Operates with charcoal or commercial gas burner'
    ],
    models: [
      { model: 'M. S. Tandoor Bhatti', motor: 'Charcoal / Gas', size: 'Standard', weight: '70 Kg', capacity: 'Commercial Naan Pot', price: 6100 }
    ]
  },
  {
    sku: 'SKU-NIR-HOT-POT',
    name: 'Shiv Shakti Stainless Steel Commercial Hot Pot Casserole',
    price: 2600,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456230/shiv-shakti-products/cat_nir_p22_1_tilting-roasting-machine_nir-085_ihzgyi.jpg'
    ],
    description: 'Heavy gauge double wall insulated stainless steel thermal hot pot (casserole) for keeping chapatis, puris, rice, and curries hot for over 6 hours.',
    features: [
      'High-density PUF insulation maintains food temperature over 6 hours',
      '100% food-grade stainless steel inside and outside',
      'Sturdy locking lid handles for catering transportation',
      'Capacities ranging from 2.5 Liters up to 40 Liters'
    ],
    models: [
      { model: '2.5 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '2 Kg', capacity: '2.5 Liter', price: 2600 },
      { model: '5 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '3 Kg', capacity: '5 Liter', price: 2800 },
      { model: '7.5 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '4 Kg', capacity: '7.5 Liter', price: 3100 },
      { model: '10 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '5 Kg', capacity: '10 Liter', price: 3400 },
      { model: '15 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '6.5 Kg', capacity: '15 Liter', price: 3900 },
      { model: '20 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '8 Kg', capacity: '20 Liter', price: 4100 },
      { model: '25 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '9.5 Kg', capacity: '25 Liter', price: 5500 },
      { model: '30 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '11 Kg', capacity: '30 Liter', price: 6100 },
      { model: '40 Liter Hot Pot', motor: 'Thermal PUF', size: 'Standard', weight: '14 Kg', capacity: '40 Liter', price: 7200 }
    ]
  },
  {
    sku: 'SKU-NIR-WATER-COOLER',
    name: 'Shiv Shakti Commercial Stainless Steel Water Cooler',
    price: 25400,
    images: [
      'https://res.cloudinary.com/owbjdijm/image/upload/v1790456230/shiv-shakti-products/cat_nir_p22_1_tilting-roasting-machine_nir-085_ihzgyi.jpg'
    ],
    description: 'Heavy duty commercial chilled drinking water dispenser with Emerson/Copeland compressors for banquet venues, schools, hospitals, and factories.',
    features: [
      'Food grade stainless steel internal tank and faucets',
      'High efficiency copper cooling coil and eco-friendly refrigerant',
      'Fast cooling rate with heavy thermostatic control',
      'Storage capacities from 20 Liters up to 200 Liters'
    ],
    models: [
      { model: '20SP1 (20 Ltr Storage)', motor: 'Compressor', size: '14 x 14 x 39', weight: '35 Kg', capacity: '20 Ltr / Hr Cooling', price: 25400 },
      { model: '40SP2+ (40 Ltr Storage)', motor: 'Compressor', size: '15 x 15 x 48', weight: '45 Kg', capacity: '40 Ltr / Hr Cooling', price: 30900 },
      { model: '60SP2+ (60 Ltr Storage)', motor: 'Compressor', size: '18 x 17 x 50', weight: '55 Kg', capacity: '60 Ltr / Hr Cooling', price: 39600 },
      { model: '80SP2+ (80 Ltr Storage)', motor: 'Compressor', size: '22 x 18 x 51', weight: '70 Kg', capacity: '80 Ltr / Hr Cooling', price: 48500 },
      { model: '100SP2+ (100 Ltr Storage)', motor: 'Compressor', size: '25 x 18 x 52', weight: '85 Kg', capacity: '100 Ltr / Hr Cooling', price: 52900 },
      { model: '200SP3+ (200 Ltr Storage)', motor: 'Compressor', size: '33 x 20 x 64', weight: '120 Kg', capacity: '200 Ltr / Hr Cooling', price: 88000 }
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
  console.log(`Starting replacement of machine products. Total new machines to insert: ${machinesData.length}`);

  // Delete previous SKU-NIR- products
  const deleteResult = await prisma.product.deleteMany({
    where: {
      sku: { startsWith: 'SKU-NIR' }
    }
  });
  console.log(`Deleted ${deleteResult.count} obsolete NIR products.`);

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

    const modelsJson = JSON.stringify(m.models);
    await prisma.$executeRawUnsafe(
      `UPDATE "products" SET "presetSizes" = $1::jsonb, "pricingUnit" = 'FIXED' WHERE "id" = $2`,
      modelsJson,
      createdProduct.id
    );

    inserted++;
    console.log(`[${inserted}/${machinesData.length}] Created: ${createdProduct.name} (${m.models.length} models, ${m.images.length} images)`);
  }

  console.log(`Successfully completed! Total inserted: ${inserted}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
