/**
 * Curated, reliable SVG hardware component illustrations and high-fidelity product representations.
 * Guaranteed 100% load reliability across all browsers, containers, and offline environments.
 */

// Generate a high-contrast, identifiable hardware vector diagram thumbnail for every component type
export function generateHardwareSvg(name: string, category: string, id: string): string {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();

  // 1. ESP32 / ESP32-S3 / ESP32-C6 (Gold antenna, RF shield, header pins)
  if (n.includes("esp32") || id.includes("esp32")) {
    const isC6 = n.includes("c6");
    const isS3 = n.includes("s3");
    const label = isC6 ? "ESP32-C6" : isS3 ? "ESP32-S3" : "ESP32";
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%230f172a"/>
      <rect x="18" y="10" width="64" height="80" rx="5" fill="%231e293b" stroke="%2338bdf8" stroke-width="1.5"/>
      <!-- Header pins -->
      <g fill="%23e2e8f0">
        <rect x="14" y="20" width="3" height="4" rx="1"/><rect x="14" y="28" width="3" height="4" rx="1"/><rect x="14" y="36" width="3" height="4" rx="1"/><rect x="14" y="44" width="3" height="4" rx="1"/><rect x="14" y="52" width="3" height="4" rx="1"/><rect x="14" y="60" width="3" height="4" rx="1"/><rect x="14" y="68" width="3" height="4" rx="1"/><rect x="14" y="76" width="3" height="4" rx="1"/>
        <rect x="83" y="20" width="3" height="4" rx="1"/><rect x="83" y="28" width="3" height="4" rx="1"/><rect x="83" y="36" width="3" height="4" rx="1"/><rect x="83" y="44" width="3" height="4" rx="1"/><rect x="83" y="52" width="3" height="4" rx="1"/><rect x="83" y="60" width="3" height="4" rx="1"/><rect x="83" y="68" width="3" height="4" rx="1"/><rect x="83" y="76" width="3" height="4" rx="1"/>
      </g>
      <!-- PCB Trace Antenna (Gold) -->
      <path d="M 28 16 L 72 16 L 72 24 L 62 24 L 62 19 L 52 19 L 52 24 L 42 24 L 42 19 L 32 19 L 32 24 L 28 24 Z" fill="%23fbbf24" stroke="%23d97706" stroke-width="0.8"/>
      <!-- Metal RF Shield -->
      <rect x="25" y="30" width="50" height="42" rx="3" fill="%23475569" stroke="%2394a3b8" stroke-width="1.2"/>
      <rect x="30" y="35" width="40" height="32" rx="2" fill="%23334155"/>
      <text x="50" y="50" fill="%2338bdf8" font-family="monospace" font-size="7.5" font-weight="bold" text-anchor="middle">ESPRESSIF</text>
      <text x="50" y="59" fill="%23f8fafc" font-family="monospace" font-size="7.5" font-weight="bold" text-anchor="middle">${label}</text>
      <!-- Micro USB Port -->
      <rect x="40" y="85" width="20" height="7" rx="1.5" fill="%2394a3b8" stroke="%23cbd5e1" stroke-width="1"/>
    </svg>`;
  }

  // 2. Arduino Uno R4 / Arduino Boards (Classic Teal/Cyan PCB, DIP MCU, ICSP header)
  if (n.includes("arduino") || id.includes("arduino")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23042f2e"/>
      <rect x="12" y="16" width="76" height="68" rx="6" fill="%230891b2" stroke="%2322d3ee" stroke-width="2"/>
      <!-- Barrel Jack & USB-B -->
      <rect x="10" y="24" width="14" height="18" rx="2" fill="%2394a3b8" stroke="%23f1f5f9" stroke-width="1"/>
      <rect x="10" y="56" width="12" height="16" rx="2" fill="%231e293b"/>
      <!-- Header sockets -->
      <rect x="28" y="20" width="54" height="6" rx="1" fill="%230f172a" stroke="%2338bdf8" stroke-width="0.8"/>
      <rect x="34" y="74" width="48" height="6" rx="1" fill="%230f172a" stroke="%2338bdf8" stroke-width="0.8"/>
      <!-- Main Controller IC -->
      <rect x="36" y="38" width="38" height="24" rx="3" fill="%23090d16" stroke="%2364748b" stroke-width="1"/>
      <!-- Arduino infinity logo -->
      <circle cx="49" cy="49" r="4.5" fill="none" stroke="%2322d3ee" stroke-width="1.2"/>
      <circle cx="59" cy="49" r="4.5" fill="none" stroke="%2322d3ee" stroke-width="1.2"/>
      <text x="54" y="60" fill="%23f8fafc" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">UNO R4</text>
    </svg>`;
  }

  // 3. Teensy 4.0 / 4.1 (Compact Black & Gold SOM DIP)
  if (n.includes("teensy") || id.includes("teensy")) {
    const is41 = n.includes("4.1");
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23020617"/>
      <rect x="20" y="${is41 ? '8' : '15'}" width="60" height="${is41 ? '84' : '70'}" rx="4" fill="%230f172a" stroke="%23fbbf24" stroke-width="1.8"/>
      <!-- Gold pins -->
      <g fill="%23fbbf24">
        <circle cx="25" cy="20" r="1.5"/><circle cx="25" cy="28" r="1.5"/><circle cx="25" cy="36" r="1.5"/><circle cx="25" cy="44" r="1.5"/><circle cx="25" cy="52" r="1.5"/><circle cx="25" cy="60" r="1.5"/><circle cx="25" cy="68" r="1.5"/><circle cx="25" cy="76" r="1.5"/>
        <circle cx="75" cy="20" r="1.5"/><circle cx="75" cy="28" r="1.5"/><circle cx="75" cy="36" r="1.5"/><circle cx="75" cy="44" r="1.5"/><circle cx="75" cy="52" r="1.5"/><circle cx="75" cy="60" r="1.5"/><circle cx="75" cy="68" r="1.5"/><circle cx="75" cy="76" r="1.5"/>
      </g>
      <!-- NXP i.MX RT1062 BGA Chip -->
      <rect x="35" y="36" width="30" height="30" rx="2" fill="%231e293b" stroke="%23e2e8f0" stroke-width="1"/>
      <text x="50" y="48" fill="%2338bdf8" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">NXP 600M</text>
      <text x="50" y="58" fill="%23fbbf24" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">${is41 ? 'TEENSY 4.1' : 'TEENSY 4.0'}</text>
      <!-- USB & Boot button -->
      <rect x="42" y="${is41 ? '7' : '14'}" width="16" height="6" fill="%23cbd5e1" rx="1"/>
      <circle cx="50" cy="${is41 ? '76' : '72'}" r="3" fill="%23ef4444"/>
    </svg>`;
  }

  // 4. Jetson Orin Nano / Xavier / Kria / Coral / Hailo SOMs (Industrial AI compute heat spreader)
  if (n.includes("orin") || n.includes("jetson") || n.includes("kria") || n.includes("coral") || n.includes("hailo") || n.includes("microzed") || n.includes("som") || c.includes("som")) {
    const isNvidia = n.includes("orin") || n.includes("jetson");
    const isKria = n.includes("kria") || n.includes("zynq") || n.includes("fpga");
    const label = isNvidia ? "JETSON ORIN" : isKria ? "AMD KRIA SOM" : n.includes("coral") ? "CORAL TPU" : "AI ACCELERATOR";
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%230b132b"/>
      <!-- Carrier / SOM PCB -->
      <rect x="10" y="15" width="80" height="70" rx="5" fill="%231c2541" stroke="${isNvidia ? '%2376b900' : isKria ? '%23f97316' : '%2338bdf8'}" stroke-width="2"/>
      <!-- Heatsink Fin Grill -->
      <rect x="22" y="24" width="56" height="42" rx="4" fill="%230f172a" stroke="%2364748b" stroke-width="1.5"/>
      <line x1="28" y1="28" x2="28" y2="62" stroke="%23475569" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="36" y1="28" x2="36" y2="62" stroke="%23475569" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="44" y1="28" x2="44" y2="62" stroke="%23475569" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="52" y1="28" x2="52" y2="62" stroke="%23475569" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="60" y1="28" x2="60" y2="62" stroke="%23475569" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="68" y1="28" x2="68" y2="62" stroke="%23475569" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Center Badge -->
      <rect x="26" y="37" width="48" height="18" rx="3" fill="%23020617" stroke="${isNvidia ? '%2376b900' : '%2338bdf8'}" stroke-width="1"/>
      <text x="50" y="49" fill="${isNvidia ? '%2376b900' : '%2338bdf8'}" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">${label}</text>
      <!-- Edge Connector Fingers -->
      <g fill="%23fbbf24">
        <rect x="15" y="80" width="3" height="4"/><rect x="21" y="80" width="3" height="4"/><rect x="27" y="80" width="3" height="4"/><rect x="33" y="80" width="3" height="4"/><rect x="39" y="80" width="3" height="4"/><rect x="45" y="80" width="3" height="4"/><rect x="51" y="80" width="3" height="4"/><rect x="57" y="80" width="3" height="4"/><rect x="63" y="80" width="3" height="4"/><rect x="69" y="80" width="3" height="4"/><rect x="75" y="80" width="3" height="4"/><rect x="81" y="80" width="3" height="4"/>
      </g>
    </svg>`;
  }

  // 5. Raspberry Pi 5 / 4 / CM4 (Green PCB, 40-pin GPIO, Quad USB, Ethernet)
  if (n.includes("raspberry") || n.includes("rpi") || c.includes("sbc")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23064e3b"/>
      <!-- Green PCB -->
      <rect x="12" y="15" width="76" height="70" rx="6" fill="%23059669" stroke="%2334d399" stroke-width="2"/>
      <!-- 40-Pin GPIO Header -->
      <rect x="18" y="19" width="48" height="6" rx="1" fill="%23022c22" stroke="%23fbbf24" stroke-width="0.8"/>
      <!-- Broadcom SoC with Heat spreader -->
      <rect x="35" y="36" width="26" height="26" rx="3" fill="%23cbd5e1" stroke="%2364748b" stroke-width="1.5"/>
      <text x="48" y="52" fill="%230f172a" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">BCM2712</text>
      <!-- Dual USB 3.0 & Ethernet Ports -->
      <rect x="74" y="24" width="16" height="14" rx="2" fill="%2394a3b8" stroke="%23e2e8f0" stroke-width="1"/>
      <rect x="74" y="42" width="16" height="14" rx="2" fill="%233b82f6" stroke="%2393c5fd" stroke-width="1"/>
      <rect x="74" y="60" width="16" height="16" rx="2" fill="%2394a3b8" stroke="%23e2e8f0" stroke-width="1"/>
      <!-- Micro HDMI Ports -->
      <rect x="22" y="80" width="8" height="4" rx="1" fill="%23cbd5e1"/>
      <rect x="34" y="80" width="8" height="4" rx="1" fill="%23cbd5e1"/>
      <text x="25" y="70" fill="%23ec4899" font-family="sans-serif" font-size="10" font-weight="bold">🍓</text>
    </svg>`;
  }

  // 6. Parallax Cyber:bot & micro:bit Robot Platform (Chassis with wheels and 5x5 LED matrix)
  if (n.includes("cyber:bot") || n.includes("parallax") || n.includes("micro:bit") || c.includes("platform")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%230f172a"/>
      <!-- Robot Rubber Drive Wheels (Left & Right) -->
      <rect x="8" y="25" width="12" height="50" rx="4" fill="%231e293b" stroke="%23475569" stroke-width="1.5"/>
      <rect x="80" y="25" width="12" height="50" rx="4" fill="%231e293b" stroke="%23475569" stroke-width="1.5"/>
      <!-- Aluminum Chassis Plate -->
      <rect x="22" y="20" width="56" height="60" rx="8" fill="%231e1b4b" stroke="%23818cf8" stroke-width="2"/>
      <!-- micro:bit Controller Board -->
      <rect x="30" y="26" width="40" height="34" rx="4" fill="%23090d16" stroke="%23ec4899" stroke-width="1.5"/>
      <!-- 5x5 LED Matrix Display -->
      <g fill="%23f43f5e">
        <circle cx="38" cy="34" r="1.2"/><circle cx="44" cy="34" r="1.2"/><circle cx="50" cy="34" r="1.2"/><circle cx="56" cy="34" r="1.2"/><circle cx="62" cy="34" r="1.2"/>
        <circle cx="38" cy="40" r="1.2"/><circle cx="44" cy="40" r="1.2"/><circle cx="50" cy="40" r="1.2"/><circle cx="56" cy="40" r="1.2"/><circle cx="62" cy="40" r="1.2"/>
        <circle cx="38" cy="46" r="1.2"/><circle cx="44" cy="40" r="1.2"/><circle cx="50" cy="46" r="1.2"/><circle cx="56" cy="46" r="1.2"/><circle cx="62" cy="46" r="1.2"/>
        <circle cx="38" cy="52" r="1.2"/><circle cx="44" cy="52" r="1.2"/><circle cx="50" cy="52" r="1.2"/><circle cx="56" cy="52" r="1.2"/><circle cx="62" cy="52" r="1.2"/>
      </g>
      <!-- Breadboard & Header Area -->
      <rect x="30" y="64" width="40" height="12" rx="2" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1"/>
      <text x="50" y="72" fill="%230284c7" font-family="monospace" font-size="5.5" font-weight="bold" text-anchor="middle">CYBER:BOT</text>
    </svg>`;
  }

  // 7. LiDAR / ToF / Optical Distance Sensor (RPLiDAR spinning turret or VL53 ToF optical lens)
  if (n.includes("lidar") || n.includes("tof") || n.includes("vl53") || n.includes("rplidar") || n.includes("tfmini")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23020617"/>
      <!-- Round 360 Turret Housing -->
      <circle cx="50" cy="50" r="38" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/>
      <circle cx="50" cy="50" r="28" fill="%23090d16" stroke="%230284c7" stroke-width="1.5"/>
      <!-- Optical Transmitter and Receiver Lens -->
      <circle cx="42" cy="48" r="8" fill="%230f172a" stroke="%23ef4444" stroke-width="2"/>
      <circle cx="42" cy="48" r="4" fill="%23ef4444"/>
      <circle cx="58" cy="48" r="8" fill="%230f172a" stroke="%2322c55e" stroke-width="2"/>
      <circle cx="58" cy="48" r="4" fill="%2322c55e"/>
      <!-- Laser Scanning Beam Radiation Cone -->
      <path d="M 42 40 L 25 15 L 75 15 L 58 40 Z" fill="%23ef4444" fill-opacity="0.2"/>
      <text x="50" y="70" fill="%2338bdf8" font-family="monospace" font-size="6.5" font-weight="bold" text-anchor="middle">360° LiDAR</text>
    </svg>`;
  }

  // 8. Ultrasonic Sonar Sensor (HC-SR04 / Ping))) Dual Transducer Cylinders)
  if (n.includes("sonar") || n.includes("ultrasonic") || n.includes("hc-sr04") || n.includes("ping")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23091e3a"/>
      <!-- Blue PCB Board -->
      <rect x="10" y="26" width="80" height="48" rx="5" fill="%230284c7" stroke="%2338bdf8" stroke-width="2"/>
      <!-- Left Transducer (Transmitter 'T') -->
      <circle cx="32" cy="50" r="16" fill="%23cbd5e1" stroke="%23475569" stroke-width="2"/>
      <circle cx="32" cy="50" r="11" fill="%231e293b" stroke="%2394a3b8" stroke-width="1.5"/>
      <text x="32" y="53" fill="%23f8fafc" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">T</text>
      <!-- Right Transducer (Receiver 'R') -->
      <circle cx="68" cy="50" r="16" fill="%23cbd5e1" stroke="%23475569" stroke-width="2"/>
      <circle cx="68" cy="50" r="11" fill="%231e293b" stroke="%2394a3b8" stroke-width="1.5"/>
      <text x="68" y="53" fill="%23f8fafc" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">R</text>
      <!-- Crystal oscillator and header pins -->
      <rect x="46" y="44" width="8" height="12" rx="2" fill="%2394a3b8"/>
      <rect x="42" y="70" width="16" height="4" fill="%23fbbf24"/>
    </svg>`;
  }

  // 9. Camera Module (Raspberry Pi HQ Camera / OpenMV / Oak-D / Depth Camera Lens)
  if (n.includes("camera") || n.includes("cam") || n.includes("imx") || n.includes("ov5640") || n.includes("oak-d") || n.includes("depthai")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%230b0f19"/>
      <!-- Camera PCB module -->
      <rect x="18" y="18" width="64" height="64" rx="6" fill="%231e293b" stroke="%2338bdf8" stroke-width="2"/>
      <!-- Brass / Aluminum Lens Bezel -->
      <circle cx="50" cy="50" r="24" fill="%23020617" stroke="%23fbbf24" stroke-width="2"/>
      <circle cx="50" cy="50" r="18" fill="%230f172a" stroke="%2338bdf8" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="11" fill="%231e1b4b" stroke="%23818cf8" stroke-width="1"/>
      <circle cx="50" cy="50" r="5" fill="%236366f1"/>
      <!-- Glass reflection highlight -->
      <path d="M 42 40 A 12 12 0 0 1 58 40" stroke="%23ffffff" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <text x="50" y="80" fill="%2394a3b8" font-family="monospace" font-size="6" text-anchor="middle">RGB-D VISION</text>
    </svg>`;
  }

  // 10. IMU / 9-DOF / Gyroscope / Magnetometer / Accel Sensor (BNO085, BNO055, ICM-20948, MPU6050)
  if (n.includes("imu") || n.includes("gyro") || n.includes("bno") || n.includes("icm") || n.includes("mpu") || n.includes("accel") || n.includes("9-dof")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23180b2b"/>
      <!-- Purple Stemma QT / Qwiic sensor PCB -->
      <rect x="18" y="20" width="64" height="60" rx="6" fill="%23581c87" stroke="%23c084fc" stroke-width="2"/>
      <!-- Gold corner mounting holes -->
      <circle cx="26" cy="28" r="2.5" fill="%230f172a" stroke="%23fbbf24" stroke-width="1"/>
      <circle cx="74" cy="28" r="2.5" fill="%230f172a" stroke="%23fbbf24" stroke-width="1"/>
      <circle cx="26" cy="72" r="2.5" fill="%230f172a" stroke="%23fbbf24" stroke-width="1"/>
      <circle cx="74" cy="72" r="2.5" fill="%230f172a" stroke="%23fbbf24" stroke-width="1"/>
      <!-- 9-Axis Coordinate Triad (X, Y, Z) -->
      <circle cx="50" cy="50" r="14" fill="%23090d16" stroke="%23a855f7" stroke-width="1.5"/>
      <line x1="50" y1="50" x2="50" y2="38" stroke="%2322c55e" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="50" x2="62" y2="50" stroke="%23ef4444" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="50" x2="41" y2="59" stroke="%233b82f6" stroke-width="2" stroke-linecap="round"/>
      <text x="50" y="36" fill="%2322c55e" font-family="monospace" font-size="5" font-weight="bold" text-anchor="middle">Z</text>
      <text x="65" y="52" fill="%23ef4444" font-family="monospace" font-size="5" font-weight="bold">X</text>
      <text x="38" y="63" fill="%233b82f6" font-family="monospace" font-size="5" font-weight="bold">Y</text>
      <text x="50" y="70" fill="%23f3e8ff" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">9-DOF AHRS</text>
    </svg>`;
  }

  // 11. Environmental Sensor (BME280, BME680, SHT41, Temp, Humidity, Air Quality)
  if (n.includes("bme") || n.includes("sht") || n.includes("temp") || n.includes("humidity") || n.includes("pressure") || n.includes("gas") || n.includes("voc")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%2306281e"/>
      <rect x="20" y="20" width="60" height="60" rx="6" fill="%23065f46" stroke="%2334d399" stroke-width="2"/>
      <!-- Metal MEMS vent package -->
      <rect x="36" y="36" width="28" height="28" rx="3" fill="%23cbd5e1" stroke="%2394a3b8" stroke-width="1.5"/>
      <circle cx="43" cy="43" r="2.5" fill="%23022c22"/>
      <!-- Wave ripples representing humidity / atmospheric pressure -->
      <path d="M 32 70 Q 50 64 68 70" stroke="%23a7f3d0" stroke-width="2" fill="none"/>
      <path d="M 36 74 Q 50 68 64 74" stroke="%2334d399" stroke-width="1.5" fill="none"/>
      <text x="50" y="54" fill="%230f172a" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">MEMS</text>
      <text x="50" y="28" fill="%23ecfdf5" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">ENV SENSOR</text>
    </svg>`;
  }

  // 12. Actuators / Servos / Stepper Motors / Brushless Motors
  if (n.includes("servo") || n.includes("motor") || n.includes("stepper") || n.includes("dynamixel") || n.includes("mg996r") || n.includes("feetech") || c.includes("actuator")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%231a0b02"/>
      <!-- Servo Body -->
      <rect x="20" y="32" width="60" height="48" rx="4" fill="%231c1917" stroke="%23f97316" stroke-width="2"/>
      <!-- Mounting Flanges -->
      <rect x="12" y="44" width="76" height="8" rx="2" fill="%23292524" stroke="%23f97316" stroke-width="1.2"/>
      <circle cx="16" cy="48" r="2" fill="%230c0a09"/>
      <circle cx="84" cy="48" r="2" fill="%230c0a09"/>
      <!-- Output Spline Gear Shaft & Horn -->
      <circle cx="40" cy="26" r="12" fill="%23fbbf24" stroke="%23d97706" stroke-width="1.5"/>
      <circle cx="40" cy="26" r="6" fill="%2378350f"/>
      <line x1="40" y1="26" x2="68" y2="16" stroke="%23f8fafc" stroke-width="4" stroke-linecap="round"/>
      <circle cx="68" cy="16" r="4" fill="%23cbd5e1" stroke="%23475569" stroke-width="1"/>
      <text x="50" y="70" fill="%23fdba74" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">SERVO ACTUATOR</text>
    </svg>`;
  }

  // 13. Motor Driver / Servo Controller (PCA9685, L298N, TB6612, A4988, DRV8833, Cytron)
  if (n.includes("driver") || n.includes("pca9685") || n.includes("l298n") || n.includes("tb6612") || n.includes("a4988") || n.includes("cytron") || c.includes("driver")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%231e1b4b"/>
      <!-- Driver PCB -->
      <rect x="15" y="16" width="70" height="68" rx="5" fill="%23312e81" stroke="%23818cf8" stroke-width="2"/>
      <!-- Aluminum Heatsink -->
      <rect x="30" y="24" width="40" height="30" rx="2" fill="%23090d16" stroke="%2394a3b8" stroke-width="1"/>
      <line x1="36" y1="26" x2="36" y2="52" stroke="%23cbd5e1" stroke-width="2"/>
      <line x1="43" y1="26" x2="43" y2="52" stroke="%23cbd5e1" stroke-width="2"/>
      <line x1="50" y1="26" x2="50" y2="52" stroke="%23cbd5e1" stroke-width="2"/>
      <line x1="57" y1="26" x2="57" y2="52" stroke="%23cbd5e1" stroke-width="2"/>
      <line x1="64" y1="26" x2="64" y2="52" stroke="%23cbd5e1" stroke-width="2"/>
      <!-- Screw Terminal Blocks -->
      <rect x="18" y="66" width="18" height="14" rx="2" fill="%2315803d" stroke="%2386efac" stroke-width="1"/>
      <rect x="64" y="66" width="18" height="14" rx="2" fill="%2315803d" stroke="%2386efac" stroke-width="1"/>
      <text x="50" y="62" fill="%23a5b4fc" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">H-BRIDGE / PWM</text>
    </svg>`;
  }

  // 13.5. Battery Level Indicator / Fuel Gauge / Voltmeter
  if (n.includes("indicator") || n.includes("fuel gauge") || n.includes("voltmeter") || n.includes("bargraph") || id.includes("battery_indicator")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23022c22"/>
      <rect x="14" y="24" width="72" height="52" rx="6" fill="%23064e3b" stroke="%2334d399" stroke-width="2"/>
      <!-- Battery shell frame -->
      <rect x="22" y="34" width="50" height="24" rx="3" fill="%23021f18" stroke="%2310b981" stroke-width="1.5"/>
      <rect x="72" y="41" width="4" height="10" rx="1" fill="%2310b981"/>
      <!-- LED bargraph segments -->
      <rect x="26" y="38" width="8" height="16" rx="1.5" fill="%23ef4444"/>
      <rect x="36" y="38" width="8" height="16" rx="1.5" fill="%23f59e0b"/>
      <rect x="46" y="38" width="8" height="16" rx="1.5" fill="%2310b981"/>
      <rect x="56" y="38" width="12" height="16" rx="1.5" fill="%2334d399"/>
      <!-- Push-to-test button -->
      <circle cx="80" cy="30" r="3" fill="%23f43f5e"/>
      <text x="50" y="70" fill="%236ee7b7" font-family="monospace" font-size="6.5" font-weight="bold" text-anchor="middle">BATT GAUGE</text>
    </svg>`;
  }

  // 13.6. Animatronics & Expression (Animated Eyes, Purr Transducer, Whisker Array)
  if (c.includes("animatronics") || n.includes("oled") || n.includes("eye") || n.includes("purr") || n.includes("whisker") || n.includes("petting") || n.includes("paw")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%232e0854"/>
      <rect x="14" y="18" width="72" height="64" rx="6" fill="%234c1d95" stroke="%23c084fc" stroke-width="2"/>
      <!-- Dual Animated OLED Eyes -->
      <rect x="22" y="30" width="24" height="22" rx="4" fill="%2309090b" stroke="%2338bdf8" stroke-width="1.5"/>
      <ellipse cx="34" cy="41" rx="6" ry="7" fill="%2338bdf8"/>
      <circle cx="36" cy="39" r="2" fill="%23ffffff"/>
      <rect x="54" y="30" width="24" height="22" rx="4" fill="%2309090b" stroke="%2338bdf8" stroke-width="1.5"/>
      <ellipse cx="66" cy="41" rx="6" ry="7" fill="%2338bdf8"/>
      <circle cx="68" cy="39" r="2" fill="%23ffffff"/>
      <!-- Whisker lines -->
      <line x1="10" y1="58" x2="26" y2="60" stroke="%23e9d5ff" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="10" y1="65" x2="26" y2="64" stroke="%23e9d5ff" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="90" y1="58" x2="74" y2="60" stroke="%23e9d5ff" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="90" y1="65" x2="74" y2="64" stroke="%23e9d5ff" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Heartbeat / Purr wave -->
      <path d="M 38 68 Q 44 64 50 68 T 62 68" stroke="%23f472b6" stroke-width="2" fill="none"/>
      <text x="50" y="77" fill="%23f0abfc" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">ANIMATRONICS</text>
    </svg>`;
  }

  // 14. Power Supply / LiPo Battery / UBEC / Voltage Regulator
  if (n.includes("battery") || n.includes("power") || n.includes("lipo") || n.includes("ubec") || n.includes("charger") || n.includes("buck") || c.includes("power")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="14" fill="%23022c22"/>
      <!-- Battery Pack Body -->
      <rect x="18" y="24" width="64" height="52" rx="6" fill="%23064e3b" stroke="%2310b981" stroke-width="2"/>
      <!-- XT60 Power Connector & Heavy Gauge Leads -->
      <path d="M 30 24 L 30 14" stroke="%23ef4444" stroke-width="3" stroke-linecap="round"/>
      <path d="M 40 24 L 40 14" stroke="%23090d16" stroke-width="3" stroke-linecap="round"/>
      <rect x="26" y="8" width="20" height="8" rx="2" fill="%23eab308" stroke="%23ca8a04" stroke-width="1"/>
      <!-- Lightning power bolt -->
      <path d="M 54 36 L 44 50 L 52 50 L 46 64 L 60 48 L 52 48 Z" fill="%23fbbf24" stroke="%23d97706" stroke-width="1"/>
      <text x="50" y="70" fill="%236ee7b7" font-family="monospace" font-size="7" font-weight="bold" text-anchor="middle">LiPo / UBEC</text>
    </svg>`;
  }

  // 15. Generic Electronic Hardware Component Fallback
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="14" fill="%230f172a"/>
    <rect x="18" y="18" width="64" height="64" rx="6" fill="%231e293b" stroke="%2338bdf8" stroke-width="1.8"/>
    <!-- Silicon IC package with pins -->
    <rect x="32" y="32" width="36" height="36" rx="3" fill="%23020617" stroke="%2364748b" stroke-width="1"/>
    <circle cx="38" cy="38" r="2" fill="%2338bdf8"/>
    <g fill="%23fbbf24">
      <rect x="22" y="38" width="8" height="2"/><rect x="22" y="44" width="8" height="2"/><rect x="22" y="50" width="8" height="2"/><rect x="22" y="56" width="8" height="2"/>
      <rect x="70" y="38" width="8" height="2"/><rect x="70" y="44" width="8" height="2"/><rect x="70" y="50" width="8" height="2"/><rect x="70" y="56" width="8" height="2"/>
    </g>
    <text x="50" y="52" fill="%2338bdf8" font-family="monospace" font-size="6" font-weight="bold" text-anchor="middle">HARDWARE</text>
    <text x="50" y="60" fill="%2394a3b8" font-family="monospace" font-size="5" text-anchor="middle">COMPONENT</text>
  </svg>`;
}
