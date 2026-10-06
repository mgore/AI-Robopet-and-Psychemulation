export interface AuthorizedVendor {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  url: string;
  directStoreUrl: string;
  headquarters: string;
  country: string;
  categorySpecialty: string;
  badgeColor: string;
  searchKeyword: string;
  description: string;
  isNatoAligned: boolean;
}

export const AUTHORIZED_VENDORS: AuthorizedVendor[] = [
  {
    id: "digikey",
    name: "DigiKey Electronics",
    shortName: "DigiKey",
    tagline: "Millions of in-stock components & Category 721 SOMs with same-day shipping",
    url: "https://www.digikey.com/",
    directStoreUrl: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    headquarters: "Thief River Falls, MN",
    country: "USA (NATO)",
    categorySpecialty: "SOMs, FPGAs, Microcontrollers, Sensors, Passives & Power",
    badgeColor: "border-red-800/60 bg-red-950/40 text-red-300",
    searchKeyword: "DigiKey",
    description: "One of the world's largest authorized distributors of electronic components, FPGA system-on-modules, motor drivers, and sensor evaluation boards.",
    isNatoAligned: true
  },
  {
    id: "mouser",
    name: "Mouser Electronics",
    shortName: "Mouser",
    tagline: "Global distributor of semiconductors & advanced electronic components",
    url: "https://www.mouser.com/",
    directStoreUrl: "https://www.mouser.com/c/?q=Arduino+ESP32+Robotics",
    headquarters: "Mansfield, TX",
    country: "USA (NATO)",
    categorySpecialty: "Semiconductors, Dev Boards, Embedded Wireless & Robotics ICs",
    badgeColor: "border-blue-800/60 bg-blue-950/40 text-blue-300",
    searchKeyword: "Mouser",
    description: "Premier Berkshire Hathaway company distributing authentic components from over 1,200 manufacturer brands with rigorous traceability.",
    isNatoAligned: true
  },
  {
    id: "adafruit",
    name: "Adafruit Industries",
    shortName: "Adafruit",
    tagline: "Maker electronics, STEM robotics, STEMMA QT sensors & CircuitPython",
    url: "https://www.adafruit.com/",
    directStoreUrl: "https://www.adafruit.com/category/57",
    headquarters: "New York City, NY",
    country: "USA (100% Domestic)",
    categorySpecialty: "Sensors, Feather MCUs, OLEDs, NeoPixels & Animatronics",
    badgeColor: "border-pink-800/60 bg-pink-950/40 text-pink-300",
    searchKeyword: "Adafruit",
    description: "NYC-based 100% woman-owned open-hardware manufacturing pioneer. Designs featherweight microcontrollers, plug-and-play STEMMA QT I2C sensors, and bio-mimetic companion parts.",
    isNatoAligned: true
  },
  {
    id: "sparkfun",
    name: "SparkFun Electronics",
    shortName: "SparkFun",
    tagline: "Open-source robotics hardware, Qwiic sensor ecosystem & Artemis modules",
    url: "https://www.sparkfun.com/",
    directStoreUrl: "https://www.sparkfun.com/categories/273",
    headquarters: "Boulder, CO",
    country: "USA (100% Domestic)",
    categorySpecialty: "Qwiic I2C Ecosystem, Motor Drivers, GPS & Audio Synths",
    badgeColor: "border-rose-800/60 bg-rose-950/40 text-rose-300",
    searchKeyword: "SparkFun",
    description: "Colorado-based open-hardware manufacturer offering solderless Qwiic robotics interconnects, precision IMU sensors, and durable robotic motor carrier shields.",
    isNatoAligned: true
  },
  {
    id: "pololu",
    name: "Pololu Robotics & Electronics",
    shortName: "Pololu",
    tagline: "High-performance micro metal gearmotors, motor drivers & step regulators",
    url: "https://www.pololu.com/",
    directStoreUrl: "https://www.pololu.com/category/11/motors-and-gearboxes",
    headquarters: "Las Vegas, NV",
    country: "USA (100% Domestic)",
    categorySpecialty: "Gearmotors, Dual H-Bridges, Encoders & Power Regulators",
    badgeColor: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
    searchKeyword: "Pololu",
    description: "Engineering-grade robotics manufacturer renowned for precision micro metal gearmotors, magnetic quadrature encoders, and ultra-compact DC motor drivers.",
    isNatoAligned: true
  },
  {
    id: "microcenter",
    name: "Micro Center",
    shortName: "Micro Center",
    tagline: "Maker / STEM Category 712, physical store pickup & Raspberry Pi partner",
    url: "https://www.microcenter.com/",
    directStoreUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    headquarters: "Hilliard, OH",
    country: "USA (Nationwide Stores)",
    categorySpecialty: "Inland Maker Line, Raspberry Pi, Arduino & Rapid Prototyping",
    badgeColor: "border-amber-800/60 bg-amber-950/40 text-amber-300",
    searchKeyword: "Micro Center",
    description: "Leading brick-and-mortar and online computer and electronics destination featuring dedicated Maker/STEM departments, 3D printers, and Arduino boards.",
    isNatoAligned: true
  },
  {
    id: "pishop",
    name: "PiShop.us",
    shortName: "PiShop.us",
    tagline: "Official Raspberry Pi Approved Reseller in the United States",
    url: "https://www.pishop.us/",
    directStoreUrl: "https://www.pishop.us/categories",
    headquarters: "Wilmington, DE",
    country: "USA (Approved Reseller)",
    categorySpecialty: "Raspberry Pi 4 / 5, Compute Module 4, Cameras & HATs",
    badgeColor: "border-red-700/60 bg-red-950/40 text-red-200",
    searchKeyword: "PiShop",
    description: "Official Raspberry Pi distributor offering authentic single-board computers, camera modules, carrier boards, and certified power adapters with guaranteed MSRP.",
    isNatoAligned: true
  },
  {
    id: "newark",
    name: "Newark element14",
    shortName: "Newark",
    tagline: "Premier industrial distributor & developmental robotics hardware hub",
    url: "https://www.newark.com/",
    directStoreUrl: "https://www.newark.com/browse-for-products",
    headquarters: "Chicago, IL",
    country: "USA / North America (NATO)",
    categorySpecialty: "Industrial Compute, BeagleBone, Relays & Measurement",
    badgeColor: "border-cyan-800/60 bg-cyan-950/40 text-cyan-300",
    searchKeyword: "Newark",
    description: "High-service distribution partner of technology products, services and solutions for electronic system design, maintenance and repair.",
    isNatoAligned: true
  },
  {
    id: "parallax",
    name: "Parallax Inc.",
    shortName: "Parallax",
    tagline: "Cyber:bot STEM Explorer & Propeller 8-Cog multi-core robotics controllers",
    url: "https://www.parallax.com/",
    directStoreUrl: "https://www.parallax.com/product/bbc-microbit-v2/",
    headquarters: "Rocklin, CA",
    country: "USA (100% Domestic)",
    categorySpecialty: "Propeller MCUs, Feedback 360 Servos, ToF Ranging & Whisker Bumpers",
    badgeColor: "border-teal-800/60 bg-teal-950/40 text-teal-300",
    searchKeyword: "Parallax",
    description: "American robotics educational pioneer creating deterministic multicore coprocessors, closed-loop continuous rotation servos, and STEM robotic rover kits.",
    isNatoAligned: true
  },
  {
    id: "arrow",
    name: "Arrow Electronics",
    shortName: "Arrow",
    tagline: "Industrial enterprise distributor for NVIDIA Jetson Edge AI & compute",
    url: "https://www.arrow.com/",
    directStoreUrl: "https://www.arrow.com/en/products/945-13450-0000-100/nvidia",
    headquarters: "Centennial, CO",
    country: "USA (NATO)",
    categorySpecialty: "NVIDIA Jetson Orin Nano, Industrial SoMs & High-Speed Transceivers",
    badgeColor: "border-purple-800/60 bg-purple-950/40 text-purple-300",
    searchKeyword: "Arrow",
    description: "Fortune 500 company providing industrial components, embedded vision kits, and Edge AI supercomputing modules to aerospace and robotics builders.",
    isNatoAligned: true
  },
  {
    id: "robotshop",
    name: "RobotShop USA",
    shortName: "RobotShop",
    tagline: "The world's leading robot store for parts, kits, chassis & high-torque servos",
    url: "https://www.robotshop.com/",
    directStoreUrl: "https://www.robotshop.com/collections/robot-parts",
    headquarters: "Miramar, FL",
    country: "USA / Canada (NATO)",
    categorySpecialty: "Metal Geared Servos, Hexapod Chassis, Grippers & RPLiDAR",
    badgeColor: "border-orange-800/60 bg-orange-950/40 text-orange-300",
    searchKeyword: "RobotShop",
    description: "Specialized robotics marketplace carrying everything from micro hobby servos to heavy-duty planetary gearboxes, LiDAR sensors, and robotic arms.",
    isNatoAligned: true
  },
  {
    id: "servocity",
    name: "ServoCity",
    shortName: "ServoCity",
    tagline: "Actobotics structural building system, precision servoblocks & linear actuators",
    url: "https://www.servocity.com/",
    directStoreUrl: "https://www.servocity.com/servos",
    headquarters: "Winfield, KS",
    country: "USA (100% Domestic)",
    categorySpecialty: "Actobotics Channels, Heavy-Duty Servos & Gear Reduction Hubs",
    badgeColor: "border-yellow-800/60 bg-yellow-950/40 text-yellow-300",
    searchKeyword: "ServoCity",
    description: "Premier supplier of mechanical robotics components, aluminum structural channels, high-load servo gearboxes, and pan/tilt systems.",
    isNatoAligned: true
  },
  {
    id: "partsexpress",
    name: "Parts Express",
    shortName: "Parts Express",
    tagline: "Micro audio transducers, tactile bass exciters & bio-mimetic haptic purrs",
    url: "https://www.parts-express.com/",
    directStoreUrl: "https://www.parts-express.com/speaker-components/tactile-transducers",
    headquarters: "Springboro, OH",
    country: "USA (100% Domestic)",
    categorySpecialty: "Bone Conduction Transducers, Micro Amplifiers & Speakers",
    badgeColor: "border-indigo-800/60 bg-indigo-950/40 text-indigo-300",
    searchKeyword: "Parts Express",
    description: "Audio and tactile transducer specialist providing resonant bone-conduction exciters and miniature audio amplifiers perfect for companion robot purrs and vocalizations.",
    isNatoAligned: true
  },
  {
    id: "toradex",
    name: "Toradex Direct",
    shortName: "Toradex",
    tagline: "Industrial ARM System-on-Modules & carrier boards for critical robotics",
    url: "https://www.toradex.com/",
    directStoreUrl: "https://www.toradex.com/computer-on-modules",
    headquarters: "Horw, Switzerland / USA",
    country: "Switzerland / USA (NATO Aligned)",
    categorySpecialty: "Verdin & Colibri ARM SoMs, Industrial Linux (Torizon)",
    badgeColor: "border-lime-800/60 bg-lime-950/40 text-lime-300",
    searchKeyword: "Toradex",
    description: "Provides robust, pin-compatible System on Modules (SoMs) powered by NXP i.MX processors paired with industrial-grade Torizon Linux operating system.",
    isNatoAligned: true
  },
  {
    id: "phytec",
    name: "PHYTEC America",
    shortName: "PHYTEC",
    tagline: "Reliable embedded boards, SOMs & Linux camera integration",
    url: "https://www.phytec.com/",
    directStoreUrl: "https://www.phytec.com/products/system-on-modules/",
    headquarters: "Bainbridge Island, WA",
    country: "USA / Germany (NATO)",
    categorySpecialty: "phyCORE Microprocessor SoMs & MIPI CSI-2 Vision Kits",
    badgeColor: "border-sky-800/60 bg-sky-950/40 text-sky-300",
    searchKeyword: "PHYTEC",
    description: "Over 35 years of engineering embedded solutions for medical and industrial robotics with long-term 10-15 year product availability.",
    isNatoAligned: true
  }
];
