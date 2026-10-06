import { HardwareComponent, RobotProfile, RobotArchetypeTag } from "./types";

const rawSupplierCatalog: HardwareComponent[] = [
  // ==========================================
  // SECTION 1: MICROCONTROLLERS & REAL-TIME EMBEDDED
  // ==========================================
  {
    id: "esp32_wroom",
    name: "ESP32-WROOM-32E (DevKitC)",
    category: "Microcontroller",
    estimatedPriceUSD: 6,
    specs: "Dual-core Tensilica LX6 @240MHz, 520KB SRAM, built-in Wi-Fi and BLE",
    roleInProject: "Cost-effective controller for IoT rovers or micro-ROS agents with direct wireless telemetry and command reception.",
    voltage: "3.3V (Logic) / 5V USB",
    interface: "GPIO, ADC, DAC, PWM, I2C, SPI, UART",
    manufacturer: "Adafruit / SparkFun (US DevKit)",
    productUrl: "https://www.adafruit.com/product/3269",
    originCountry: "USA (Adafruit Sourced)",
    isNatoAligned: true,
    natoAllianceNote: "Assembled & tested by Adafruit (New York) / SparkFun (Colorado) with US open-source firmware",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3269" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/13907" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/3269/6238038" }
    ]
  },
  {
    id: "arduino_uno_r4",
    name: "Arduino Uno R4 Minima",
    category: "Microcontroller",
    estimatedPriceUSD: 20,
    specs: "Renesas RA4M1 (32-bit ARM Cortex-M4 @48MHz), 32KB SRAM, 256KB Flash, 5V native",
    roleInProject: "Low-latency micro-controller. Ideal for low-level sensor reading, encoder tick tracking, and servo PWM control loops.",
    voltage: "5V / 12V DC input",
    interface: "GPIO, ADC, DAC, PWM, I2C, SPI, CAN bus",
    manufacturer: "Arduino Official (Italy & USA)",
    productUrl: "https://store.arduino.cc/products/uno-r4-minima",
    originCountry: "Italy (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Official open-source hardware designed & manufactured in Ivrea, Italy (NATO Founder)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/arduino/ABX00080/20379963" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Arduino%20Uno%20R4" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/22572" }
    ]
  },
  {
    id: "pjrc_teensy_41",
    name: "PJRC Teensy 4.1 SOM Microcontroller Board",
    category: "Microcontroller",
    estimatedPriceUSD: 32.5,
    specs: "NXP i.MX RT1062 ARM Cortex-M7 @600MHz (up to 1GHz), 1MB RAM, 8MB Flash, 10/100 Ethernet PHY",
    roleInProject: "Extreme real-time micro-controller with 600MHz DSP capability. Runs dual-loop PID at 10kHz with high-speed CAN FD.",
    voltage: "3.3V Logic (5V tolerant Vin)",
    interface: "10/100 Ethernet, USB 2.0 HS (480Mbps), 3x CAN Bus (1x CAN FD), 8x UART, 3x SPI, 3x I2C, 35x PWM",
    manufacturer: "PJRC",
    productUrl: "https://www.pjrc.com/store/teensy41.html",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Designed, engineered, and manufactured by PJRC in Sherwood, Oregon, USA",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/sparkfun-electronics/DEV-16771/12398570" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/16771" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4648" }
    ]
  },
  {
    id: "pjrc_teensy_40",
    name: "PJRC Teensy 4.0 Ultra-Compact SOM Board",
    category: "Microcontroller",
    estimatedPriceUSD: 23.8,
    specs: "NXP i.MX RT1062 ARM Cortex-M7 @600MHz, 1MB RAM, 2MB Flash, DIP-28 1.4x0.7 inch form factor",
    roleInProject: "Ultra-compact high-speed controller for tight kinematic arms, gimbal stabilizers, and inertial measurement units.",
    voltage: "3.3V Logic (3.6V - 6.0V Vin)",
    interface: "USB HS 480Mbps, 3x CAN bus, 7x UART, 3x SPI, 3x I2C, 31x PWM, 14x Analog Inputs",
    manufacturer: "PJRC",
    productUrl: "https://www.pjrc.com/store/teensy40.html",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered and manufactured in Sherwood, Oregon, USA",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/sparkfun-electronics/DEV-15583/10243180" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/15583" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4323" }
    ]
  },
  {
    id: "esp32_s3_wroom",
    name: "Espressif ESP32-S3-WROOM-1-N16R8 SOM Module",
    category: "Microcontroller",
    estimatedPriceUSD: 4.2,
    specs: "Xtensa 32-bit LX7 Dual-Core @240MHz with Vector SIMD NN Instructions, 8MB PSRAM, 16MB Flash",
    roleInProject: "AI-vector enabled edge microcontroller for on-device keyword spotting, wake word triggers, and tinyML vision.",
    voltage: "3.0V - 3.6V DC",
    interface: "2.4 GHz Wi-Fi + Bluetooth 5 LE/Mesh, 45x GPIO, DVP Camera, RGB LCD, SPI, I2C, TWAI/CAN",
    manufacturer: "Espressif Systems",
    productUrl: "https://www.espressif.com/en/products/socs/esp32-s3",
    originCountry: "Global / US Vetted",
    isNatoAligned: true,
    natoAllianceNote: "Vetted and stocked through DigiKey, Mouser, and Adafruit USA with open-source ESP-IDF",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/espressif-systems/ESP32-S3-WROOM-1-N16R8/16182181" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=ESP32-S3-WROOM-1" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5297" }
    ]
  },
  {
    id: "esp32_c6_wroom",
    name: "Espressif ESP32-C6-WROOM-1 SOM Module (Wi-Fi 6 + Thread)",
    category: "Microcontroller",
    estimatedPriceUSD: 3.5,
    specs: "32-bit RISC-V Single-Core @160MHz + LP RISC-V Core + 512KB SRAM + 8MB Flash + Matter/Thread",
    roleInProject: "Ultra-modern RISC-V IoT node connecting robot sensors over Thread / Zigbee 3.0 mesh and Wi-Fi 6.",
    voltage: "3.0V - 3.6V DC",
    interface: "Wi-Fi 6 (802.11ax) + BLE 5 + IEEE 802.15.4 (Zigbee 3.0 / Thread), 30x GPIO, SPI, I2C, UART",
    manufacturer: "Espressif Systems",
    productUrl: "https://www.espressif.com/en/products/socs/esp32-c6",
    originCountry: "Global / US Vetted",
    isNatoAligned: true,
    natoAllianceNote: "Certified for open-source Matter, Thread, and Zephyr RTOS",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/espressif-systems/ESP32-C6-WROOM-1-N8/18063073" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=ESP32-C6-WROOM-1" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5933" }
    ]
  },
  {
    id: "stm32_h743zi_core",
    name: "STMicroelectronics STM32H743ZI Nucleo / Core Module",
    category: "Microcontroller",
    estimatedPriceUSD: 28.9,
    specs: "ARM 32-bit Cortex-M7 @480MHz, DP-FPU, Chrom-ART 2D GPU, 2MB Flash, 1MB RAM, 10/100 Eth",
    roleInProject: "Heavy-duty deterministic industrial robotics controller for multi-axis coordinate transforms and CAN-FD networks.",
    voltage: "3.3V Logic (5V tolerant I/O)",
    interface: "10/100 Ethernet MAC (IEEE1588), USB HS OTG, 4x I2C, 6x SPI, 4x USART, 2x FDCAN, 3x ADC (3.6MSPS)",
    manufacturer: "STMicroelectronics",
    productUrl: "https://www.st.com/en/evaluation-tools/nucleo-h743zi.html",
    originCountry: "France / Italy / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "STMicroelectronics (Geneva, France, Italy - NATO Members); widely used in aerospace and automotive",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/stmicroelectronics/NUCLEO-H743ZI2/10287957" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=NUCLEO-H743ZI" }
    ]
  },
  {
    id: "nordic_nrf5340_som",
    name: "Nordic Semiconductor nRF5340 Dual-Core BLE 5.3 SOM",
    category: "Microcontroller",
    estimatedPriceUSD: 12.5,
    specs: "Dual Cortex-M33 (128MHz App Core + 64MHz Net Core), 1MB Flash, 512KB RAM, LE Audio, Arm TrustZone",
    roleInProject: "Ultra-low-power dual-core wireless supervisor handling BLE telemetry and audio streaming simultaneously.",
    voltage: "1.7V - 5.5V DC",
    interface: "Bluetooth 5.3, LE Audio, Mesh, Thread, Zigbee, NFC-A, Full-Speed USB, QSPI, 4x SPI, 4x I2C",
    manufacturer: "Nordic Semiconductor / Fanstel",
    productUrl: "https://www.nordicsemi.com/Products/nRF5340",
    originCountry: "Norway / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Nordic Semi (Trondheim, Norway - NATO Member); hardware crypto & ARM CryptoCell-312",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/fanstel-corp/BT40F/13535914" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=nRF5340" }
    ]
  },
  {
    id: "particle_boron_lte",
    name: "Particle Boron LTE CAT-M1 / NB-IoT + BLE Cellular SOM",
    category: "Microcontroller",
    estimatedPriceUSD: 69,
    specs: "Nordic nRF52840 Cortex-M4F @64MHz + Quectel BG96 Worldwide LTE Cat-M1/NB-IoT Modem, LiPo Charger",
    roleInProject: "Long-range cellular teleoperation controller for remote agricultural or field exploration rovers.",
    voltage: "3.3V Logic / 3.7V LiPo or USB",
    interface: "Cellular LTE Cat-M1/NB-IoT, Bluetooth 5, NFC, 20x Mixed GPIO, SPI, I2C, UART, PWM",
    manufacturer: "Particle Industries",
    productUrl: "https://store.particle.io/products/boron-lte",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "San Francisco, CA headquartered IoT platform with US Cloud Device Security",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/particle-industries-inc/BRN404X/13149818" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4042" }
    ]
  },
  {
    id: "particle_photon_2",
    name: "Particle Photon 2 Wi-Fi 6 + BLE 5 IoT Module",
    category: "Microcontroller",
    estimatedPriceUSD: 19.5,
    specs: "Realtek RTL872x Dual-Core Cortex-M33 @200MHz, 3MB SRAM, 8MB Flash, Dual-Band Wi-Fi 6 (2.4/5GHz)",
    roleInProject: "High-throughput cloud-connected micro-controller with dual-band Wi-Fi 6 for fast OTA updates and telemetry.",
    voltage: "3.3V Logic (5V Vin)",
    interface: "Dual-band 2.4/5GHz Wi-Fi 6 (802.11ax) + BLE 5.0, 20x GPIO, 6x ADC, SPI, I2C, UART",
    manufacturer: "Particle Industries",
    productUrl: "https://store.particle.io/products/photon-2",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered in USA by Particle Industries with enterprise fleet management",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/particle-industries-inc/PHN2TRAY/18069352" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Particle%20Photon%202" }
    ]
  },
  {
    id: "parallax_microbit_v2",
    name: "Parallax BBC micro:bit v2 Module (Cyber:bot Controller)",
    category: "Microcontroller",
    estimatedPriceUSD: 21,
    specs: "Nordic nRF52833 Cortex-M4 @64MHz, 512KB Flash, 128KB RAM, 5x5 LED matrix, MEMS mic, speaker",
    roleInProject: "Pluggable brain card for Parallax Cyber:bot and robotics education. Runs MicroPython and block coding.",
    voltage: "3.3V DC (Edge / Battery / USB)",
    interface: "2.4GHz Radio / BLE 5.0, I2C, SPI, UART, 25-pin Edge Connector",
    manufacturer: "BBC / micro:bit Foundation",
    productUrl: "https://www.parallax.com/product/bbc-microbit-v2/",
    originCountry: "United Kingdom (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered in the UK with ARM Nordic Silicon; widely adopted across US/UK education",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/bbc-microbit-v2/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/micro-bit-educational-foundation/MB298/13175850" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4774" }
    ]
  },
  {
    id: "parallax_propeller_chip",
    name: "Parallax P8X32A-Q44 Propeller 1 Multicore MCU",
    category: "Microcontroller",
    estimatedPriceUSD: 8.95,
    specs: "32-bit Multicore 8-Cog MCU, 80MHz, 32KB Hub RAM + 32KB ROM, QFP-44 package, deterministic timing",
    roleInProject: "Dedicated multicore coprocessor running simultaneous parallel motor loops, encoder reads, and servo timings without interrupts.",
    voltage: "3.3V DC (5V tolerant with series resistors)",
    interface: "32 Smart GPIOs, I2C, SPI, UART, Video Gen",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/p8x32a-q44-propeller-chip/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Designed, copyrighted, and patented by Parallax Inc. in Rocklin, California, USA",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/p8x32a-q44-propeller-chip/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/P8X32A-Q44/1498642" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=P8X32A-Q44" }
    ]
  },

  // ==========================================
  // SECTION 2: SINGLE BOARD COMPUTERS (SBC)
  // ==========================================
  {
    id: "rpi4",
    name: "Raspberry Pi 4 Model B (8GB)",
    category: "SBC",
    estimatedPriceUSD: 75,
    specs: "Quad-core Cortex-A72 @1.5GHz, 8GB LPDDR4, dual HDMI, Gigabit Eth, Wi-Fi 5",
    roleInProject: "Primary robot host computer for high-level computer vision, ROS 2 nodes, navigation stack and local LLM clients.",
    voltage: "5.1V",
    interface: "40-pin GPIO, I2C, SPI, UART, USB 3.0",
    manufacturer: "Raspberry Pi Ltd",
    productUrl: "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/",
    originCountry: "United Kingdom (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Designed in Cambridge, UK; manufactured in Sony Pencoed plant, Wales (NATO Member)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/raspberry-pi/RASPBERRY-PI-4B-8GB/12423719" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Raspberry%20Pi%204" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4564" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/16790" }
    ]
  },
  {
    id: "rpi5",
    name: "Raspberry Pi 5 (8GB)",
    category: "SBC",
    estimatedPriceUSD: 80,
    specs: "Quad-core Cortex-A76 @2.4GHz, 8GB LPDDR4X, PCIe 2.0, dual camera/display transceivers, custom RP1 silicon",
    roleInProject: "Advanced host computer with extra processor bandwidth for heavy neural network pipelines and real-time mapping.",
    voltage: "5.1V 5A Type-C",
    interface: "40-pin GPIO, I2C, SPI, UART, USB 3.0, PCIe Gen2 x1",
    manufacturer: "Raspberry Pi Ltd",
    productUrl: "https://www.raspberrypi.com/products/raspberry-pi-5/",
    originCountry: "United Kingdom (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Custom RP1 silicon & Broadcom BCM2712 designed in UK/USA; built in Wales, UK",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/raspberry-pi/SC1112/21666635" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Raspberry%20Pi%205" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5813" }
    ]
  },
  {
    id: "jetson_nano",
    name: "NVIDIA Jetson Nano Developer Kit",
    category: "SBC",
    estimatedPriceUSD: 149,
    specs: "Quad-core ARM A57, 128-core Maxwell GPU (472 GFLOPS FP16), 4GB LPDDR4, CUDA support",
    roleInProject: "Edge AI computer for real-time deep learning, high-frame-rate object detection, and spatial coordinate neural maps.",
    voltage: "5V 4A DC input",
    interface: "GPIO, I2C, SPI, UART, I2S, Camera MIPI-CSI",
    manufacturer: "NVIDIA Corporation",
    productUrl: "https://developer.nvidia.com/embedded/jetson-nano-developer-kit",
    originCountry: "USA (Santa Clara, CA)",
    isNatoAligned: true,
    natoAllianceNote: "Designed in Silicon Valley, California, USA; US defense contractor & AI leader",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/nvidia/945-13450-0000-100/10384777" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=NVIDIA%20Jetson%20Nano" },
      { name: "Arrow Electronics", region: "USA (Centennial, CO)", url: "https://www.arrow.com/en/products/945-13450-0000-100/nvidia" }
    ]
  },

  // ==========================================
  // SECTION 3: SYSTEM-ON-MODULES (SOM / COMPUTE / LINUX)
  // ==========================================
  {
    id: "rpi_cm4_8gb",
    name: "Raspberry Pi Compute Module 4 (CM4108032)",
    category: "SOM / Compute",
    estimatedPriceUSD: 85,
    specs: "Broadcom BCM2711 Quad Cortex-A72 @1.5GHz, 8GB LPDDR4, 32GB eMMC, Wi-Fi 5 & BLE 5.0",
    roleInProject: "Industrial grade SOM brain mounted to custom carrier board for vibration-resistant drone or rover deployment.",
    voltage: "5.0V DC supply via carrier",
    interface: "PCIe 2.0 x1 lane, GbE (IEEE1588), dual 4K HDMI, 2x MIPI CSI-2, 2x MIPI DSI, 28x GPIO",
    manufacturer: "Raspberry Pi Ltd",
    productUrl: "https://www.raspberrypi.com/products/compute-module-4/",
    originCountry: "United Kingdom (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Manufactured in Sony UK Technology Centre in Wales, UK (NATO Member)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/raspberry-pi/CM4108032/13532655" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=CM4108032" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4786" }
    ]
  },
  {
    id: "rpi_cm4_lite_4gb",
    name: "Raspberry Pi Compute Module 4 Lite (CM4004000)",
    category: "SOM / Compute",
    estimatedPriceUSD: 45,
    specs: "Broadcom BCM2711 Quad Cortex-A72 @1.5GHz, 4GB LPDDR4, Lite (MicroSD/NVMe PCIe Boot)",
    roleInProject: "High speed SOM using NVMe SSD via PCIe lane for massive ROS bag logging and mapping datasets.",
    voltage: "5.0V DC",
    interface: "PCIe 2.0 x1, GbE, dual 4K HDMI, 2x MIPI CSI, 2x MIPI DSI, 28x GPIO",
    manufacturer: "Raspberry Pi Ltd",
    productUrl: "https://www.raspberrypi.com/products/compute-module-4/",
    originCountry: "United Kingdom (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Manufactured in Wales, UK",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/raspberry-pi/CM4004000/13532644" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=CM4004000" }
    ]
  },
  {
    id: "toradex_colibri_imx6ull",
    name: "Toradex Colibri iMX6ULL SOM Module",
    category: "SOM / Compute",
    estimatedPriceUSD: 52,
    specs: "NXP i.MX 6ULL ARM Cortex-A7 @800MHz, 512MB DDR3L, 4GB eMMC, Wi-Fi/BT, SODIMM-200 form factor",
    roleInProject: "Ultra-low power industrial embedded Linux module for rugged headless AGV field controllers.",
    voltage: "3.3V DC input",
    interface: "10/100 Ethernet, USB 2.0 OTG/Host, 2x CAN 2.0B, 4x I2C, 4x SPI, 8x UART, RGB LCD",
    manufacturer: "Toradex",
    productUrl: "https://www.toradex.com/computer-on-modules/colibri-arm-family/nxp-imx-6ull",
    originCountry: "Switzerland / USA (Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Toradex (Lucerne, Switzerland & Horw); guaranteed 10+ year industrial product lifecycle",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/toradex-inc/00401100/10453880" },
      { name: "Toradex Direct", region: "USA / Global", url: "https://www.toradex.com/" }
    ]
  },
  {
    id: "digi_connectcore_8m_mini",
    name: "Digi ConnectCore 8M Mini Industrial SOM Module",
    category: "SOM / Compute",
    estimatedPriceUSD: 98,
    specs: "NXP i.MX 8M Mini Quad A53 @1.6GHz + Cortex-M4 @400MHz + 2GB LPDDR4 + 8GB eMMC + TrustFence",
    roleInProject: "Secure dual-core processor isolating safety motor loops on M4 while running full Ubuntu ROS on A53 cores.",
    voltage: "3.3V - 5.0V DC",
    interface: "GbE MAC, PCIe 2.0, USB 2.0 OTG, MIPI CSI-2, MIPI DSI, 4x I2C, 3x SPI, 4x UART",
    manufacturer: "Digi International",
    productUrl: "https://www.digi.com/products/embedded-systems/digi-connectcore/digi-connectcore-8m-mini",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Digi International (Hopkins, Minnesota, USA); includes Digi TrustFence hardware security",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/digi/CC-WMX-ET8D-NN/11688647" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=ConnectCore%208M%20Mini" }
    ]
  },
  {
    id: "microchip_sama5d27_som",
    name: "Microchip ATSAMA5D27-SOM1 Industrial Linux SOM",
    category: "SOM / Compute",
    estimatedPriceUSD: 45.5,
    specs: "ARM Cortex-A5 @500MHz with NEON + ATECC508A Crypto + 128MB DDR2 SiP + 64MB QSPI Flash",
    roleInProject: "Hardened, crypto-authenticated Linux engine for mission-critical telemetry encryption and CAN-FD gatewaying.",
    voltage: "3.3V DC single rail",
    interface: "10/100 Ethernet PHY, 2x CAN-FD, USB 2.0 Host/Device, 2x SDIO, 7x UART, 2x SPI, 3x I2C",
    manufacturer: "Microchip Technology",
    productUrl: "https://www.microchip.com/en-us/product/ATSAMA5D27-SOM1",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Microchip Technology (Chandler, Arizona, USA); MIL-STD qualified manufacturing flows",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/microchip-technology/ATSAMA5D27-SOM1/8118023" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=ATSAMA5D27-SOM1" }
    ]
  },
  {
    id: "beaglecore_bcm1",
    name: "BeagleBoard BeagleCore BCM1 Industrial SOM Module",
    category: "SOM / Compute",
    estimatedPriceUSD: 69,
    specs: "TI Sitara AM3358 Cortex-A8 @1.0GHz + Dual 200MHz PRU Real-Time Coprocessors + 512MB RAM + 4GB eMMC",
    roleInProject: "Real-time robotics SOM with dual 200MHz Programmable Real-Time Units (PRU) generating sub-microsecond pulse trains.",
    voltage: "3.3V / 5.0V DC",
    interface: "10/100 Ethernet, USB 2.0 Client/Host, 2x CAN 2.0B, 2x I2C, 2x SPI, 6x UART, 65x GPIO",
    manufacturer: "BeagleBoard.org",
    productUrl: "https://beagleboard.org/",
    originCountry: "USA / Germany (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Texas Instruments Sitara silicon (Dallas, TX); industrial packaging by BeagleCore GmbH (Germany)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/beagleboard-by-seeed-studio/102990479/6822879" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=BeagleCore%20BCM1" }
    ]
  },
  {
    id: "variscite_dart_mx8m_plus",
    name: "Variscite DART-MX8M-PLUS Industrial SOM Module",
    category: "SOM / Compute",
    estimatedPriceUSD: 125,
    specs: "NXP i.MX 8M Plus Quad A53 @1.8GHz + 2.3 TOPS NPU + 800MHz Cortex-M7 + Dual ISP + 4GB LPDDR4",
    roleInProject: "High-end quad-camera vision SOM with dual hardware ISP and neural network hardware acceleration.",
    voltage: "3.3V - 4.5V DC",
    interface: "PCIe Gen3, 2x GbE (TSN), 2x USB 3.0, 2x MIPI CSI-2, 2x CAN FD, HDMI 2.0a, LVDS",
    manufacturer: "Variscite",
    productUrl: "https://www.variscite.com/product/system-on-module-som/cortex-a53-krait/dart-mx8m-plus-nxp-i-mx-8m-plus/",
    originCountry: "Israel / USA (NATO Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Designed & produced with full compliance for medical, defense, and high-reliability robotics",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/variscite-ltd/VVDARTMX8MP001/15783944" },
      { name: "Variscite Direct", region: "USA / Global", url: "https://www.variscite.com/" }
    ]
  },
  {
    id: "phytec_phycore_am62x",
    name: "PHYTEC phyCORE-AM62x System-on-Module",
    category: "SOM / Compute",
    estimatedPriceUSD: 72,
    specs: "TI Sitara AM6254 Quad Cortex-A53 @1.4GHz + Cortex-M4F @400MHz + 2GB LPDDR4 + 8GB eMMC",
    roleInProject: "Modern low-cost quad-core industrial SOM for edge human-machine interfaces and dual CAN-FD networks.",
    voltage: "3.3V DC input",
    interface: "2x GbE (RGMII), USB 2.0, 3x CAN-FD, 3x SPI, 3x I2C, 9x UART, MIPI CSI-2, LVDS",
    manufacturer: "PHYTEC",
    productUrl: "https://www.phytec.com/product/phycore-am62x/",
    originCountry: "Germany / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "PHYTEC America (Bainbridge Island, WA) & PHYTEC Messtechnik (Mainz, Germany - NATO)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/phytec-america-llc/PCM-071-3221111I-A/18063541" },
      { name: "PHYTEC America", region: "USA (Bainbridge Island, WA)", url: "https://www.phytec.com/" }
    ]
  },

  // ==========================================
  // SECTION 4: FPGA & MPSOC SYSTEM-ON-MODULES
  // ==========================================
  {
    id: "xilinx_kria_k26",
    name: "AMD Xilinx Kria K26 System-on-Module (FPGA/MPSoC)",
    category: "SOM / FPGA & MPSoC",
    estimatedPriceUSD: 279,
    specs: "Quad Cortex-A53 (1.5GHz) + Dual Cortex-R5F + 256K Logic Cell FPGA + 4GB DDR4 + 16GB eMMC",
    roleInProject: "Ultra-low-latency real-time vision FPGA pipeline. Hardware accelerator for 4K stereo visual odometry @ 60 FPS.",
    voltage: "5.0V DC (±5%)",
    interface: "PCIe Gen2 x4, 4x 10GbE, USB 3.0, MIPI CSI-2, 4x UART, 2x SPI, 2x I2C, CAN FD",
    manufacturer: "AMD Xilinx",
    productUrl: "https://www.xilinx.com/products/som/kria/k26c-commercial.html",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "AMD Xilinx (Santa Clara, CA, USA); production SOM for defense, vision AI, and aerospace",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/amd/SM-K26-XCL2GC/14638706" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Kria%20K26" },
      { name: "Avnet", region: "USA (Phoenix, AZ)", url: "https://www.avnet.com/" }
    ]
  },
  {
    id: "microchip_polarfire_soc",
    name: "Microchip PolarFire SoC MPFS250T RISC-V FPGA Module",
    category: "SOM / FPGA & MPSoC",
    estimatedPriceUSD: 345,
    specs: "Quad 64-bit RISC-V U54-MC (667MHz) + PolarFire 254K LE Low-Power FPGA + 2GB LPDDR4 + 8GB eMMC",
    roleInProject: "Defense-grade, single-event-upset (SEU) immune Linux FPGA platform for harsh radiation and aerospace environments.",
    voltage: "3.3V / 5.0V DC",
    interface: "PCIe Gen2, 2x GbE, USB 2.0, 2x CAN 2.0B, 2x SPI, 2x I2C, 5x UART, 136 FPGA I/Os",
    manufacturer: "Microchip Technology / Aries",
    productUrl: "https://www.microchip.com/en-us/products/fpgas-and-plds/system-on-chip-fpgas/polarfire-soc-fpgas",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Silicon manufactured in US domestic fabs; immune to neutron single event upsets",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/microchip-technology/MPFS-ICICLE-KIT-ES/12739345" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=PolarFire%20SoC" }
    ]
  },
  {
    id: "numato_zynq_7010",
    name: "Numato Lab NLSOMCZ7010 Zynq-7010 FPGA SOM Module",
    category: "SOM / FPGA & MPSoC",
    estimatedPriceUSD: 89,
    specs: "Dual ARM Cortex-A9 @667MHz + Artix-7 FPGA (28K Logic Cells) + 512MB DDR3 + 128Mb QSPI",
    roleInProject: "Accessible entry-level FPGA coprocessor for high-speed digital pulse generation and LIDAR time-tagging.",
    voltage: "3.3V - 5.0V DC",
    interface: "GbE, USB 2.0 OTG, 84 FPGA General Purpose I/Os, SPI, I2C, UART",
    manufacturer: "Numato Lab",
    productUrl: "https://numato.com/",
    originCountry: "USA / Allied Distribution",
    isNatoAligned: true,
    natoAllianceNote: "Supported by open AMD Vivado WebPACK and Linux kernel trees",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/numato-lab/NLSOMCZ7010-01/10452391" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Numato%20Zynq" }
    ]
  },
  {
    id: "terasic_cyclone_v_gx",
    name: "Terasic Cyclone V GX SOM Module (Intel Altera)",
    category: "SOM / FPGA & MPSoC",
    estimatedPriceUSD: 195,
    specs: "Dual ARM Cortex-A9 @800MHz + Cyclone V GX FPGA (77K LEs, 3.125Gbps SerDes) + 1GB DDR3",
    roleInProject: "High-bandwidth industrial transceiver board with PCIe and gigabit serial interfaces for multi-axis servo sync.",
    voltage: "5.0V DC input",
    interface: "PCIe Gen1 x4, GbE, USB 2.0 OTG, 2x CAN, SPI, I2C, UART, 138 User FPGA I/Os",
    manufacturer: "Terasic Technologies",
    productUrl: "https://www.terasic.com.tw/",
    originCountry: "Taiwan (NATO Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Intel Altera silicon architecture; manufactured by Terasic (Hsinchu, Taiwan)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/terasic-inc/P0159/5482312" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Terasic%20Cyclone%20V" }
    ]
  },

  // ==========================================
  // SECTION 5: AI ACCELERATORS & EDGE TENSOR MODULES
  // ==========================================
  {
    id: "nvidia_jetson_orin_nano_8gb",
    name: "NVIDIA Jetson Orin Nano Developer SOM Module (8GB)",
    category: "SOM / AI Accelerator",
    estimatedPriceUSD: 249,
    specs: "6-Core ARM Cortex-A78AE + 1024-Core Ampere GPU (40 TOPS INT8 AI) + 8GB 128-bit LPDDR5",
    roleInProject: "Next-gen edge computing brain. Runs multi-modal LLMs, YOLOv8 segmentation, and Isaac ROS SLAM concurrently.",
    voltage: "5.0V - 20.0V DC (7W-15W Envelope)",
    interface: "PCIe Gen3 x4, 3x USB 3.2 Gen2, GbE, 4x MIPI CSI-2, 3x UART, 2x SPI, 3x I2C, CAN bus",
    manufacturer: "NVIDIA Corporation",
    productUrl: "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/",
    originCountry: "USA / Taiwan (NATO / Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered in Santa Clara, CA, USA; supports NVIDIA Isaac ROS, TensorRT, and DeepStream",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/nvidia/945-13766-0000-000/18063211" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Jetson%20Orin%20Nano" },
      { name: "Arrow Electronics", region: "USA (Centennial, CO)", url: "https://www.arrow.com/en/products/945-13766-0000-000/nvidia" }
    ]
  },
  {
    id: "nvidia_jetson_orin_nx_16gb",
    name: "NVIDIA Jetson Orin NX 16GB SOM Module",
    category: "SOM / AI Accelerator",
    estimatedPriceUSD: 599,
    specs: "8-Core Cortex-A78AE + 1024-Core Ampere GPU + 2x NVDLA v2 (100 TOPS INT8 AI) + 16GB LPDDR5",
    roleInProject: "Industrial-grade autonomous vehicle brain capable of processing 8 high-resolution cameras simultaneously at 30 FPS.",
    voltage: "5.0V - 20.0V DC (10W-25W)",
    interface: "PCIe Gen4 x4, 10GbE/1GbE, 3x USB 3.2, 4x MIPI CSI-2, 3x UART, 2x SPI, 3x I2C, CAN FD",
    manufacturer: "NVIDIA Corporation",
    productUrl: "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/",
    originCountry: "USA / Taiwan (NATO / Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Silicon Valley designed AI flagship module for uncrewed defense and commercial robotics",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/nvidia/945-13766-0005-000/18063212" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Jetson%20Orin%20NX" }
    ]
  },
  {
    id: "nvidia_jetson_agx_orin_64gb",
    name: "NVIDIA Jetson AGX Orin Industrial SOM Module (64GB)",
    category: "SOM / AI Accelerator",
    estimatedPriceUSD: 1999,
    specs: "12-Core ARM Cortex-A78AE + 2048-Core Ampere GPU + 64 Tensor Cores (275 TOPS AI @ 75W), 64GB LPDDR5",
    roleInProject: "Full-scale autonomous driving and humanoid robot central compute node running end-to-end foundation models.",
    voltage: "7V - 20V DC (15W - 75W)",
    interface: "PCIe Gen4 x8/x4, 2x 10GbE, 4x USB 3.2, 16x MIPI CSI-2 lanes, 4x UART, 3x SPI, 2x CAN FD",
    manufacturer: "NVIDIA Corporation",
    productUrl: "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/",
    originCountry: "USA / Taiwan (NATO / Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Designed in USA with extended temperature range (-40°C to +85°C) and ECC memory",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/nvidia/900-13701-0050-000/17758992" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=AGX%20Orin" }
    ]
  },
  {
    id: "google_coral_edge_tpu_som",
    name: "Google Coral Edge TPU System-on-Module (SoM)",
    category: "SOM / AI Accelerator",
    estimatedPriceUSD: 114.99,
    specs: "NXP i.MX 8M SoC (Quad A53 + M4F) + Google Edge TPU ASIC (4 TOPS @ 2W) + 2GB LPDDR4",
    roleInProject: "Low-power TensorFlow Lite accelerator running MobileNet v2 image classification at over 400 FPS.",
    voltage: "5.0V DC (±5%)",
    interface: "GbE, USB 3.0 OTG, HDMI 2.0a, MIPI DSI, MIPI CSI-2, 2x SPI, 3x I2C, 4x UART",
    manufacturer: "Google / ASUS",
    productUrl: "https://coral.ai/products/som/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Google Coral (Mountain View, CA, USA); optimized for low-power edge neural network inferencing",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/coral/G650-00001-01/10258778" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Google%20Coral%20SOM" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/15454" }
    ]
  },
  {
    id: "hailo_8_m2_module",
    name: "Hailo-8 M.2 AI Acceleration Module (26 TOPS)",
    category: "SOM / AI Accelerator",
    estimatedPriceUSD: 189,
    specs: "Structure-Defined Dataflow Neural Network Core (26 TOPS @ 2.5W typical power), M.2 2280 form factor",
    roleInProject: "High-density neural network accelerator for Raspberry Pi 5 / CM4 via PCIe lane with breakthrough power efficiency.",
    voltage: "3.3V DC (M.2 rail)",
    interface: "PCIe Gen3 x4 / x2 lanes (M.2 Key M / B+M)",
    manufacturer: "Hailo Technologies",
    productUrl: "https://hailo.ai/products/ai-accelerators/hailo-8-m2-ai-acceleration-module/",
    originCountry: "Israel / USA (NATO Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Hailo (Tel Aviv & US Office); official AI partner for Raspberry Pi 5 AI Kit",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/hailo-technologies-ltd/HM218B1C2FA/16543180" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Hailo-8" }
    ]
  },

  // ==========================================
  // SECTION 6: SENSORS & PERCEPTION BREAKOUTS (ADAFRUIT CAT 57 + PARALLAX + SENSIRION)
  // ==========================================
  {
    id: "hcsr04",
    name: "HC-SR04 Ultrasonic Distance Sensor",
    category: "Sensor",
    estimatedPriceUSD: 4,
    specs: "Ultrasonic sonar, range 2cm - 400cm, accuracy +/- 3mm, 15 degree cone",
    roleInProject: "Standard range finder to prevent robot collisions. Triggers ultrasonic ping and times the echo return.",
    voltage: "5V DC",
    interface: "Digital GPIO (Trigger & Echo pins)",
    manufacturer: "SparkFun Electronics",
    productUrl: "https://www.sparkfun.com/products/15569",
    originCountry: "USA (SparkFun Quality Assured)",
    isNatoAligned: true,
    natoAllianceNote: "US distributor SparkFun certifies signal timing & voltage specs in Boulder, CO",
    authorizedSuppliers: [
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/15569" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3942" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/sparkfun-electronics/SEN-15569/10243169" }
    ]
  },
  {
    id: "rplidar_a1",
    name: "RPLIDAR A1M8 360° Laser Range Scanner",
    category: "Sensor",
    estimatedPriceUSD: 99,
    specs: "360 degree laser scanner, 12m range, 5.5Hz - 10Hz rotational frequency, 8000 sample/sec",
    roleInProject: "Core mapping sensor. Generates planar laser sweep lines for ROS 2 Hector / Cartographer SLAM navigation.",
    voltage: "5V USB / UART power",
    interface: "UART (Serial, baud rate 115200)",
    manufacturer: "SparkFun / Adafruit (US Import Vetted)",
    productUrl: "https://www.sparkfun.com/products/16977",
    originCountry: "USA Distributed (SparkFun / Adafruit Vetted)",
    isNatoAligned: true,
    natoAllianceNote: "Vetted and distributed with verified USB drivers by SparkFun Electronics (Colorado, USA)",
    authorizedSuppliers: [
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/16977" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4010" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/sparkfun-electronics/SEN-16977/13682976" }
    ]
  },
  {
    id: "mpu6050",
    name: "MPU6050 6-Axis Accelerometer/Gyro",
    category: "Sensor",
    estimatedPriceUSD: 5,
    specs: "3-axis gyro (up to 2000 deg/s), 3-axis accelerometer (up to 16g), onboard Digital Motion Processor (DMP)",
    roleInProject: "Measures attitude, roll, pitch, yaw, and centripetal accelerations for self-balancing rovers or hexapod leg levelers.",
    voltage: "3.3V / 5V input",
    interface: "I2C (Address 0x68)",
    manufacturer: "TDK InvenSense (USA / Japan)",
    productUrl: "https://www.invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/",
    originCountry: "USA (San Jose, CA - InvenSense HQ)",
    isNatoAligned: true,
    natoAllianceNote: "InvenSense headquartered in Silicon Valley, California (USA) / TDK Corp (Japan - US Treaty Ally)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/tdk-invensense/MPU-6050/3507003" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=MPU-6050" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3886" }
    ]
  },
  {
    id: "vl53l0x",
    name: "VL53L0X Time-of-Flight (ToF) Distance Sensor",
    category: "Sensor",
    estimatedPriceUSD: 8,
    specs: "940nm laser ranging, range up to 2m, millimetric accuracy, immune to surface reflectance",
    roleInProject: "Extremely precise short-range distance mapping. Perfect for object detection directly inside robotic claws.",
    voltage: "2.8V - 5V DC input",
    interface: "I2C (Address 0x29)",
    manufacturer: "STMicroelectronics (Geneva / France / Italy)",
    productUrl: "https://www.st.com/en/imaging-and-photonics-solutions/vl53l0x.html",
    originCountry: "France / Italy (NATO Allies)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered in STMicroelectronics R&D centers in Grenoble, France & Agrate, Italy (NATO Members)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3317" },
      { name: "Pololu Robotics", region: "USA (Las Vegas, NV)", url: "https://www.pololu.com/product/2490" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/stmicroelectronics/VL53L0CXV0DH-1/6005721" }
    ]
  },
  {
    id: "pi_cam_v2",
    name: "Raspberry Pi Camera Module V2",
    category: "Sensor",
    estimatedPriceUSD: 30,
    specs: "Sony IMX219 8-megapixel sensor, supports 1080p30 video capture, fixed focus",
    roleInProject: "Feeds image frames to host computer for object recognition, QR code detection, line tracking, or face capture.",
    voltage: "CSI ribbon cable (3.3V derived)",
    interface: "MIPI CSI (Camera Serial Interface)",
    manufacturer: "Raspberry Pi Ltd / Sony Japan",
    productUrl: "https://www.raspberrypi.com/products/camera-module-v2/",
    originCountry: "United Kingdom (NATO Ally) & Japan",
    isNatoAligned: true,
    natoAllianceNote: "Camera module engineered in UK; Sony IMX219 sensor manufactured in Japan (US Treaty Ally)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/raspberry-pi/RPI-CAM-V2/6122699" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Raspberry%20Pi%20Camera%20v2" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3099" }
    ]
  },
  {
    id: "adafruit_sht45",
    name: "Adafruit Sensirion SHT45 Precision Temp & Humidity Breakout",
    category: "Sensor",
    estimatedPriceUSD: 14.95,
    specs: "±1.0% RH relative humidity accuracy, ±0.1°C temperature accuracy with integrated condensation heater",
    roleInProject: "High-grade scientific environmental telemetry for laboratory automation, greenhouse rovers, or cleanrooms.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Sensirion",
    productUrl: "https://www.adafruit.com/product/5665",
    originCountry: "Switzerland / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Sensirion AG (Stäfa, Switzerland); assembled by Adafruit in NYC, USA",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5665" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/5665/17760920" }
    ]
  },
  {
    id: "adafruit_sht40",
    name: "Adafruit Sensirion SHT40 Temperature & Humidity Breakout",
    category: "Sensor",
    estimatedPriceUSD: 5.95,
    specs: "±1.8% RH accuracy, ±0.2°C temperature accuracy, 0.4uA ultra-low power consumption",
    roleInProject: "Low-power environmental monitoring for battery-powered explorer rovers.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Sensirion",
    productUrl: "https://www.adafruit.com/product/4885",
    originCountry: "Switzerland / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Sensirion sensor silicon assembled on Adafruit STEMMA QT board (USA)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4885" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/4885/13682970" }
    ]
  },
  {
    id: "adafruit_bme280",
    name: "Adafruit Bosch BME280 Temp, Humidity & Pressure Sensor",
    category: "Sensor",
    estimatedPriceUSD: 19.95,
    specs: "Barometric Pressure 300-1100 hPa (±1m altitude), Temp -40 to +85°C (±1°C), Humidity 0-100% (±3%)",
    roleInProject: "Tri-function sensor providing precision altitude barometric estimates for UAVs and indoor vertical floor navigation.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C / SPI (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Bosch Sensortec",
    productUrl: "https://www.adafruit.com/product/2652",
    originCountry: "Germany / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Bosch Sensortec (Reutlingen, Germany - NATO Founder); assembled by Adafruit in New York, USA",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/2652" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/2652/5629432" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Adafruit%202652" }
    ]
  },
  {
    id: "adafruit_bme688",
    name: "Adafruit Bosch BME688 AI Gas, Pressure, Humidity & Temp",
    category: "Sensor",
    estimatedPriceUSD: 19.95,
    specs: "4-in-1 sensor with MOX gas scanner and BSEC 2.0 AI software to detect VOCs, VSC, and air quality",
    roleInProject: "Gas leak detection and chemical sniff node for safety hazmat and air quality rovers.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C / SPI (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Bosch Sensortec",
    productUrl: "https://www.adafruit.com/product/5046",
    originCountry: "Germany / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Bosch Sensortec (Germany) + Adafruit (USA) STEMMA QT ecosystem",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5046" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/5046/14638708" }
    ]
  },
  {
    id: "adafruit_bno085",
    name: "Adafruit 9-DOF Orientation IMU Fusion Breakout - BNO085",
    category: "Sensor",
    estimatedPriceUSD: 19.95,
    specs: "Outputs drift-corrected 3D Quaternions, Rotation Vectors, Linear Accel @ 400Hz via ARM Cortex-M0+ coprocessor",
    roleInProject: "Zero-drift robotic heading sensor. Eliminates complex Kalman filter code on host processor by computing quaternions internally.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C, SPI, UART, UART-RVC (Robot Vacuum Mode)",
    manufacturer: "Adafruit / CEVA Hillcrest",
    productUrl: "https://www.adafruit.com/product/4754",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "CEVA Hillcrest Laboratories (Rockville, Maryland, USA); assembled in NYC by Adafruit",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4754" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/4754/13165039" }
    ]
  },
  {
    id: "adafruit_bno055",
    name: "Adafruit 9-DOF Absolute Orientation IMU - BNO055",
    category: "Sensor",
    estimatedPriceUSD: 29.95,
    specs: "All-in-one sensor fusion hub with internal ARM Cortex-M0 running Bosch BSX3.0 algorithm @ 100Hz",
    roleInProject: "Plug-and-play absolute 3D Euler angles (Yaw, Pitch, Roll) and gravity vectors without gyro integration drift.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C / UART (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Bosch Sensortec",
    productUrl: "https://www.adafruit.com/product/4646",
    originCountry: "Germany / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Bosch Sensortec (Germany) + Adafruit (USA); STEMMA QT quick connect",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4646" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/4646/12398579" }
    ]
  },
  {
    id: "adafruit_vl53l4cx",
    name: "Adafruit VL53L4CX Time of Flight Distance Sensor (6m)",
    category: "Sensor",
    estimatedPriceUSD: 14.95,
    specs: "940nm VCSEL laser emitter with multizone SPAD array, ranging distances 1mm to 6000mm (6m) with 18° FOV",
    roleInProject: "Long range infrared laser obstacle detector for high speed indoor rovers.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / STMicroelectronics",
    productUrl: "https://www.adafruit.com/product/5425",
    originCountry: "France / Italy / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "STMicroelectronics photonics (Grenoble, France) + Adafruit carrier (USA)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5425" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/5425/16543190" }
    ]
  },
  {
    id: "adafruit_vl53l1x",
    name: "Adafruit VL53L1X Long Range ToF Distance Sensor (4m)",
    category: "Sensor",
    estimatedPriceUSD: 14.95,
    specs: "Optical distance measurement up to 4000mm (4m), up to 50Hz ranging frequency, programmable 15°-27° FOV",
    roleInProject: "Narrow beam optical range finder with configurable region-of-interest (ROI) detection zones.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / STMicroelectronics",
    productUrl: "https://www.adafruit.com/product/3967",
    originCountry: "France / Italy / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "STMicroelectronics + Adafruit STEMMA QT",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3967" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/3967/9658064" }
    ]
  },
  {
    id: "adafruit_vl53l4cd",
    name: "Adafruit VL53L4CD High-Speed Short Range ToF (1.3m)",
    category: "Sensor",
    estimatedPriceUSD: 9.95,
    specs: "High-speed 100Hz ranging rate, 1mm to 1300mm range, immune to target color and reflectance",
    roleInProject: "High-speed proximity sensor for close-quarters obstacle avoidance and surface edge detection.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / STMicroelectronics",
    productUrl: "https://www.adafruit.com/product/5396",
    originCountry: "France / Italy / USA (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "STMicroelectronics + Adafruit STEMMA QT",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/5396" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/5396/16382944" }
    ]
  },
  {
    id: "adafruit_as7341",
    name: "Adafruit AS7341 10-Channel Spectral Light / Color Sensor",
    category: "Sensor",
    estimatedPriceUSD: 15.95,
    specs: "8 optical channels across visible spectrum (415nm to 680nm) + Clear + Near-IR with 16-bit 6-ch ADC",
    roleInProject: "Scientific color classification and chemical reagent spectroscopy for sorting robots.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / ams OSRAM",
    productUrl: "https://www.adafruit.com/product/4698",
    originCountry: "Austria / USA (EU / Allied)",
    isNatoAligned: true,
    natoAllianceNote: "ams OSRAM (Premstaetten, Austria); assembled by Adafruit in NYC, USA",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/4698" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/4698/12838702" }
    ]
  },
  {
    id: "adafruit_apds9960",
    name: "Adafruit APDS9960 Proximity, Light, RGB & Gesture Sensor",
    category: "Sensor",
    estimatedPriceUSD: 7.5,
    specs: "Touchless 4-way gesture recognition (Up/Down/Left/Right), ambient RGB color sensing, 100mm proximity",
    roleInProject: "Enables natural human hand-wave interaction commands for companion and social robots.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Broadcom",
    productUrl: "https://www.adafruit.com/product/3595",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Broadcom Inc. (San Jose, CA, USA) + Adafruit STEMMA QT breakout",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3595" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/3595/7649488" }
    ]
  },
  {
    id: "adafruit_as5600",
    name: "Adafruit AS5600 Magnetic Rotary Angle Encoder Breakout",
    category: "Sensor",
    estimatedPriceUSD: 5.95,
    specs: "12-bit resolution 360° contactless magnetic position sensing with 4096 positions/rev, immune to dust",
    roleInProject: "Absolute joint angle feedback for robotic arm servos, wheel odometry, and steering gimbal position.",
    voltage: "3.3V - 5V DC",
    interface: "I2C / Analog Voltage / PWM (STEMMA QT)",
    manufacturer: "Adafruit / ams OSRAM",
    productUrl: "https://www.adafruit.com/product/6040",
    originCountry: "Austria / USA (EU / Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Contactless Hall-effect sensor by ams OSRAM + Adafruit STEMMA QT board",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/6040" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/6040/22180491" }
    ]
  },
  {
    id: "adafruit_sph0645",
    name: "Adafruit I2S MEMS Microphone Breakout (SPH0645LM4H)",
    category: "Sensor",
    estimatedPriceUSD: 6.95,
    specs: "50Hz to 15KHz frequency response, digital I2S 24-bit audio output, SNR 65dB, omnidirectional",
    roleInProject: "Direct digital audio stream input for voice command parsing, sound localization, and acoustic alarms.",
    voltage: "3.3V DC direct logic",
    interface: "I2S Digital Audio (BCLK, WSEL, DOUT)",
    manufacturer: "Adafruit / Knowles",
    productUrl: "https://www.adafruit.com/product/3421",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Knowles Corporation (Itasca, Illinois, USA); assembled by Adafruit in NYC",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3421" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/3421/6827118" }
    ]
  },
  {
    id: "adafruit_amg8833",
    name: "Adafruit AMG8833 Grid-EYE 8x8 IR Thermal Camera Breakout",
    category: "Sensor",
    estimatedPriceUSD: 44.95,
    specs: "8x8 (64 pixel) infrared thermal grid imaging, 0°C to 80°C (±2.5°C), 10Hz frame rate, 7m human detection",
    roleInProject: "Thermal heat tracking, human body detection, fire spot identification, and night-vision thermal scans.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Panasonic",
    productUrl: "https://www.adafruit.com/product/3538",
    originCountry: "Japan / USA (Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Panasonic Industrial (Osaka, Japan - US Treaty Ally); breakout engineered by Adafruit",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3538" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/3538/7349992" }
    ]
  },
  {
    id: "adafruit_ina219",
    name: "Adafruit INA219 High Side DC Current & Power Sensor",
    category: "Sensor",
    estimatedPriceUSD: 9.95,
    specs: "Monitors 0V to +26VDC bus, max ±3.2A continuous current with 0.8mA resolution, precision 0.1 ohm shunt",
    roleInProject: "Real-time battery power telemetry, motor stall detection, and system power budget monitoring.",
    voltage: "3.3V - 5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Texas Instruments",
    productUrl: "https://www.adafruit.com/product/904",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Texas Instruments (Dallas, TX, USA) + Adafruit Industries (New York, NY, USA)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/904" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/904/5353629" }
    ]
  },
  {
    id: "adafruit_mcp9808",
    name: "Adafruit MCP9808 High Accuracy I2C Temperature Sensor",
    category: "Sensor",
    estimatedPriceUSD: 4.95,
    specs: "±0.25°C typical accuracy from -40°C to +125°C with selectable 0.0625°C resolution and alert interrupt",
    roleInProject: "Motor driver and battery thermal protection sensor with hardware alert interrupt line.",
    voltage: "2.7V - 5.5V DC (STEMMA QT)",
    interface: "I2C (STEMMA QT / Qwiic)",
    manufacturer: "Adafruit / Microchip",
    productUrl: "https://www.adafruit.com/product/1782",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Microchip (Chandler, AZ) silicon on Adafruit PCB (New York, USA)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/1782" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/1782/5353655" }
    ]
  },
  {
    id: "parallax_ping_28015",
    name: "Parallax Ping))) Ultrasonic Distance Sensor (#28015)",
    category: "Sensor",
    estimatedPriceUSD: 32.95,
    specs: "Accurate ultrasonic time-of-flight ranging from 2cm to 300cm (0.8 in to 10 ft) with burst indicator LED",
    roleInProject: "Single-pin I/O sonar ranger for distance measurement and obstacle avoidance on mobile robotics.",
    voltage: "5.0V DC (±5%)",
    interface: "Single-Pin Bi-directional Digital Pulse (Trigger & Echo)",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/ping-ultrasonic-distance-sensor/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered and manufactured by Parallax Inc. in Rocklin, California, USA",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/ping-ultrasonic-distance-sensor/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/28015/1498647" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Parallax%2028015" }
    ]
  },
  {
    id: "parallax_laserping_28041",
    name: "Parallax LaserPING 2m Optical Rangefinder (#28041)",
    category: "Sensor",
    estimatedPriceUSD: 34.95,
    specs: "Co-planar 850nm infrared laser ToF ranging from 2cm to 200cm (up to 2m) with PWM or Serial ASCII output",
    roleInProject: "Narrow-beam laser rangefinder immune to acoustic reflections and soft obstacle sound absorption.",
    voltage: "3.3V - 5.0V DC",
    interface: "PWM Pulse / Asynchronous Serial ASCII UART (Single I/O pin)",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/laserping-2m-rangefinder/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Manufactured by Parallax Inc. in Rocklin, CA, USA",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/laserping-2m-rangefinder/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/28041/10452392" }
    ]
  },
  {
    id: "parallax_qti_27401",
    name: "Parallax QTI Line-Follower Infrared Sensor (#27401)",
    category: "Sensor",
    estimatedPriceUSD: 4.95,
    specs: "Close-proximity phototransistor/IR emitter pair with RC decay timing for line following & edge detection",
    roleInProject: "Surface reflection sensor for high-speed black/white line tracking and table edge cliff avoidance.",
    voltage: "3.3V - 5.0V DC",
    interface: "Digital RC decay time measurement pin",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/qti-line-follower-appkit-for-the-boe-bot/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Parallax Inc. (Rocklin, California, USA)",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/qti-sensor/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/27401/1498648" }
    ]
  },
  {
    id: "parallax_whiskers_kit",
    name: "Parallax Cyber:bot Breadboard Whiskers & Touch Bumpers Kit",
    category: "Sensor",
    estimatedPriceUSD: 7.5,
    specs: "Mechanical spring-wire collision bumper whiskers for tactile physical obstacle detection on rovers",
    roleInProject: "Fail-safe tactile bump sensing that triggers emergency hardware stops if digital sonars are blinded.",
    voltage: "3.3V / 5.0V DC (Resistor pull-up)",
    interface: "Digital Contact Closure (Active Low)",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Rocklin, CA manufactured mechanical & electronics kit",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/" }
    ]
  },
  {
    id: "parallax_ir_38khz_pair",
    name: "Parallax 38 kHz Infrared Obstacle Detection Pair",
    category: "Sensor",
    estimatedPriceUSD: 8.95,
    specs: "Paired 38kHz modulated 940nm IR LEDs with shielded 38kHz IR photodetector receivers for non-contact sensing",
    roleInProject: "Modulated infrared obstacle detector that filters out sunlight and ambient fluorescent lighting.",
    voltage: "3.3V - 5.0V DC",
    interface: "Digital Active-Low Demodulated Output",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Parallax Inc. USA robotics curriculum standard",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/" }
    ]
  },

  // ==========================================
  // SECTION 7: ACTUATORS & SERVOS
  // ==========================================
  {
    id: "mg996r",
    name: "MG996R High Torque Metal Gear Servo",
    category: "Actuator",
    estimatedPriceUSD: 12,
    specs: "Metal gear, stall torque 10 kg-cm (6V), 180 degree rotation, 0.17s/60 deg speed",
    roleInProject: "Drives robotic arm hinge joints, heavy duty steering linkages, or leg Coxa joints.",
    voltage: "4.8V - 7.2V",
    interface: "PWM (Pulse Width Modulation)",
    manufacturer: "Pololu / ServoCity (US Stocked)",
    productUrl: "https://www.pololu.com/product/2142",
    originCountry: "USA (Pololu Distribution)",
    isNatoAligned: true,
    natoAllianceNote: "Distributed, stress-tested and certified by Pololu Robotics (Las Vegas, NV) & ServoCity (Winfield, KS)",
    authorizedSuppliers: [
      { name: "Pololu Robotics", region: "USA (Las Vegas, NV)", url: "https://www.pololu.com/product/2142" },
      { name: "ServoCity", region: "USA (Winfield, KS)", url: "https://www.servocity.com/" },
      { name: "RobotShop USA", region: "USA (Miramar, FL)", url: "https://www.robotshop.com/products/mg996r-servo-motor" }
    ]
  },
  {
    id: "sg90",
    name: "SG90 Micro Servo 9g",
    category: "Actuator",
    estimatedPriceUSD: 4,
    specs: "Plastic gear, stall torque 1.6 kg-cm (4.8V), 180 degree rotation, 0.12s/60 deg",
    roleInProject: "Ultra-lightweight actuation for camera pan/tilt sweep systems, grabber claws, or secondary expressive ears/flags.",
    voltage: "4.8V - 6.0V",
    interface: "PWM (Pulse Width Modulation)",
    manufacturer: "Adafruit / SparkFun (US Inspected)",
    productUrl: "https://www.adafruit.com/product/169",
    originCountry: "USA (Adafruit QC Certified)",
    isNatoAligned: true,
    natoAllianceNote: "Sourced through Adafruit (NYC, USA) with US customer technical support & warranty",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/169" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/9065" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/169/5353609" }
    ]
  },
  {
    id: "nema17",
    name: "NEMA 17 Stepper Motor (1.5A)",
    category: "Actuator",
    estimatedPriceUSD: 18,
    specs: "1.8 deg step angle (200 steps/rev), holding torque 40 Ncm, current 1.5A",
    roleInProject: "High precision rotational movement for joint limits, linear rail guides, or heavy-duty planetary wheel shafts.",
    voltage: "Requires dedicated stepper driver (e.g. A4988) 12V-36V",
    interface: "4-wire bipolar phase control",
    manufacturer: "Pololu Robotics (US Stock)",
    productUrl: "https://www.pololu.com/product/1200",
    originCountry: "USA (Pololu Las Vegas HQ)",
    isNatoAligned: true,
    natoAllianceNote: "Inspected & warrantied by Pololu Robotics (Las Vegas, NV, USA)",
    authorizedSuppliers: [
      { name: "Pololu Robotics", region: "USA (Las Vegas, NV)", url: "https://www.pololu.com/product/1200" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/10846" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/pololu-corporation/1200/10450849" }
    ]
  },
  {
    id: "tt_motor",
    name: "TT Dual-Shaft DC Gear Motor",
    category: "Actuator",
    estimatedPriceUSD: 4,
    specs: "1:48 gear ratio, recommended voltage 3V - 6V, includes plastic wheels",
    roleInProject: "Drives basic left and right wheels of multi-terrain mobile rovers.",
    voltage: "3V - 6V DC",
    interface: "Analog Voltage polarity (requires H-Bridge)",
    manufacturer: "Adafruit / SparkFun USA",
    productUrl: "https://www.adafruit.com/product/3777",
    originCountry: "USA (Adafruit / SparkFun Distribution)",
    isNatoAligned: true,
    natoAllianceNote: "US distributor certified with complete documentation from NYC / Boulder",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/3777" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/13302" }
    ]
  },
  {
    id: "parallax_servo_360_feedback",
    name: "Parallax 360° High-Speed Feedback Servo (#900-00360)",
    category: "Actuator",
    estimatedPriceUSD: 22.95,
    specs: "Continuous rotation servo with internal Hall-effect magnetic encoder delivering pulse-width angle feedback",
    roleInProject: "Precision closed-loop drive wheel motor reporting exact angular speed, direction, and distance traveled without external encoders.",
    voltage: "4.8V - 6.0V DC",
    interface: "Dual Wire: Standard 50Hz PWM control + Digital PWM feedback line",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/parallax-feedback-360-high-speed-servo/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Patented feedback servo technology engineered by Parallax Inc. (Rocklin, CA)",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/parallax-feedback-360-high-speed-servo/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/900-00360/9658066" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=900-00360" }
    ]
  },
  {
    id: "parallax_servo_standard_continuous",
    name: "Parallax Standard Continuous Rotation Servo (#900-00008)",
    category: "Actuator",
    estimatedPriceUSD: 14.95,
    specs: "Standard bidirectional continuous rotation drive servo, 38 oz-in torque at 6V, 0-60 RPM",
    roleInProject: "Reliable, easy-to-control direct-drive wheel actuator for educational and prototyping rovers.",
    voltage: "4.8V - 6.0V DC",
    interface: "3-pin standard servo PWM (50Hz)",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/parallax-continuous-rotation-servo/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Parallax Inc. (Rocklin, CA, USA)",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/parallax-continuous-rotation-servo/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/900-00008/1498650" }
    ]
  },

  // ==========================================
  // SECTION 8: MOTOR DRIVERS & COPENT ROLLERS
  // ==========================================
  {
    id: "pca9685",
    name: "PCA9685 16-Channel 12-bit PWM Driver",
    category: "Motor Driver",
    estimatedPriceUSD: 8,
    specs: "I2C interface, built-in clock generator, programmable PWM frequency up to 1.6kHz",
    roleInProject: "Relieves the primary MCU from continuous PWM interrupts. Controls up to 16 servos using only 2 I2C pins.",
    voltage: "5V-6V external servo terminal",
    interface: "I2C (Address 0x40 default)",
    manufacturer: "Adafruit / NXP Semiconductors",
    productUrl: "https://www.adafruit.com/product/815",
    originCountry: "USA / Netherlands (NATO Member)",
    isNatoAligned: true,
    natoAllianceNote: "Silicon by NXP (Eindhoven, Netherlands); PCB design & assembly by Adafruit (New York, USA)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/815" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/adafruit-industries-llc/815/5353628" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=PCA9685" }
    ]
  },
  {
    id: "l298n",
    name: "L298N Dual H-Bridge Motor Driver Module",
    category: "Motor Driver",
    estimatedPriceUSD: 5,
    specs: "Dual full H-bridge, drives two DC motors or one stepper, peaks up to 2A per channel",
    roleInProject: "Provides power separation and bidirectional rotation control for standard TT gear DC wheels.",
    voltage: "5V logic input, 5V-35V motor drive",
    interface: "PWM & Digital Pin (IN1/IN2/IN3/IN4/ENA/ENB)",
    manufacturer: "STMicroelectronics / SparkFun",
    productUrl: "https://www.sparkfun.com/products/14451",
    originCountry: "Switzerland / Italy (NATO Ally STMicro)",
    isNatoAligned: true,
    natoAllianceNote: "Dual H-bridge silicon produced by STMicroelectronics (Geneva / Italy / France - NATO Members)",
    authorizedSuppliers: [
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/14451" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/stmicroelectronics/L298N/585836" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/ProductDetail/STMicroelectronics/L298N" }
    ]
  },
  {
    id: "tb6612",
    name: "TB6612FNG Dual DC Motor Driver Board",
    category: "Motor Driver",
    estimatedPriceUSD: 6,
    specs: "Highly efficient MOSFET driver, 1.2A continuous (3.2A peak) per channel, low voltage drop",
    roleInProject: "Ultra-compact, low heat generation driver for high-efficiency miniature rovers.",
    voltage: "2.7V-5.5V logic, 2.5V-13.5V motor drive",
    interface: "PWM & Digital Pins",
    manufacturer: "Pololu Robotics / Toshiba",
    productUrl: "https://www.pololu.com/product/713",
    originCountry: "USA (Pololu LV Board) / Japan (Toshiba - Allied)",
    isNatoAligned: true,
    natoAllianceNote: "Toshiba silicon (Tokyo, Japan - US Treaty Ally); breakout engineered in Las Vegas, Nevada by Pololu",
    authorizedSuppliers: [
      { name: "Pololu Robotics", region: "USA (Las Vegas, NV)", url: "https://www.pololu.com/product/713" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/14450" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/pololu-corporation/713/10450821" }
    ]
  },
  {
    id: "a4988",
    name: "A4988 Stepper Motor Driver Board",
    category: "Motor Driver",
    estimatedPriceUSD: 4,
    specs: "Adjustable current limiting, over-current protection, 5 microstep resolutions (down to 1/16)",
    roleInProject: "Drives bipolar stepper motors with simple Step and Direction pin logic.",
    voltage: "3V-5.5V logic, 8V-35V stepper drive",
    interface: "Digital Step/Dir pin interface",
    manufacturer: "Allegro MicroSystems / Pololu",
    productUrl: "https://www.pololu.com/product/1182",
    originCountry: "USA (Manchester, NH - Allegro MicroSystems)",
    isNatoAligned: true,
    natoAllianceNote: "Silicon designed by Allegro MicroSystems (New Hampshire, USA); carrier manufactured by Pololu (USA)",
    authorizedSuppliers: [
      { name: "Pololu Robotics", region: "USA (Las Vegas, NV)", url: "https://www.pololu.com/product/1182" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/allegro-microsystems/A4988SETTR-T/2227181" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/ProductDetail/Allegro-MicroSystems/A4988SETTR-T" }
    ]
  },
  {
    id: "parallax_cyberbot_carrier",
    name: "Parallax cyber:bot Board with Propeller Multicore Coprocessor",
    category: "Motor Driver",
    estimatedPriceUSD: 89,
    specs: "Parallax P8X32A 8-Cog 32-bit Multicore MCU @80MHz (160 MIPS) carrier for real-time PID motor loops",
    roleInProject: "Carrier board that interfaces micro:bit with feedback servos, sensor breadboard, and handles closed-loop speed regulation.",
    voltage: "6V - 15V DC Barrel / 5V 1.5A & 3.3V 500mA LDO Rails",
    interface: "micro:bit Edge Socket, 8-ch Servo PWM, 400-tie Breadboard, I2C, SPI",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/cyberbot-board/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Manufactured in Rocklin, California, USA with Propeller 8-core silicon",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/cyberbot-board/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/32700/10452393" }
    ]
  },

  // ==========================================
  // SECTION 9: ROBOT PLATFORMS & FULL KITS
  // ==========================================
  {
    id: "parallax_cyberbot_kit",
    name: "Parallax Cyber:bot Robot Kit with micro:bit (Full Platform)",
    category: "Robot Platform",
    estimatedPriceUSD: 229,
    specs: "Complete STEM & Cybersecurity mobile robot with BBC micro:bit v2 + Propeller 8-Cog coprocessor + aluminum chassis + 360° feedback servos",
    roleInProject: "Turnkey hardware platform for mobile robotics, cybersecurity labs, Python kinematics, and sensor payload experiments.",
    voltage: "6.0V - 9.0V DC (5x AA pack)",
    interface: "micro:bit Edge Connector, 8x Servo PWM, Breadboard I/O, 2.4GHz Radio/BLE",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered and manufactured in Rocklin, California, USA; NICERC cybersecurity educational standard",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/32710/10243190" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Cyberbot%20Robot%20Kit" }
    ]
  },

  // ==========================================
  // SECTION 10: POWER SUPPLY & ENERGY
  // ==========================================
  {
    id: "lipo_2s",
    name: "2S 7.4V 2200mAh LiPo Battery Pack",
    category: "Power Supply",
    estimatedPriceUSD: 22,
    specs: "Rechargeable Lithium-Polymer, 7.4V, 30C continuous discharge (66A peak)",
    roleInProject: "Provides high-drain, lightweight energy reservoir to power continuous high-torque servo hinges.",
    voltage: "7.4V (8.4V fully charged)",
    interface: "XT60 Power connector, JST-XH balance connector",
    manufacturer: "Gens ace / Horizon Hobby (US HQ)",
    productUrl: "https://www.genstattu.com/",
    originCountry: "USA (Horizon Hobby / Gens Ace US HQ, Dublin, CA)",
    isNatoAligned: true,
    natoAllianceNote: "Distributed and compliance-certified by Horizon Hobby (Champaign, IL, USA)",
    authorizedSuppliers: [
      { name: "Horizon Hobby", region: "USA (Champaign, IL)", url: "https://www.horizonhobby.com/" },
      { name: "Amain Hobbies", region: "USA (Chico, CA)", url: "https://www.amainhobbies.com/" }
    ]
  },
  {
    id: "ubec_5v",
    name: "5V 5A UBEC Regulator Converter",
    category: "Power Supply",
    estimatedPriceUSD: 7,
    specs: "Switching DC-DC buck regulator, inputs 5.5V-26V, outputs clean 5.0V @ 5A with over-temp protection",
    roleInProject: "Steps down battery pack voltages to steady 5.0V to feed delicate Raspberry Pi/ESP32 logic gates and servos.",
    voltage: "Inputs 5.5V-26V, outputs 5.0V",
    interface: "Screw terminals / red-black power lines",
    manufacturer: "Pololu / Texas Instruments",
    productUrl: "https://www.pololu.com/product/2851",
    originCountry: "USA (Pololu Las Vegas / TI Dallas)",
    isNatoAligned: true,
    natoAllianceNote: "Switching regulator module engineered & manufactured by Pololu (Las Vegas, NV, USA) using Texas Instruments ICs",
    authorizedSuppliers: [
      { name: "Pololu Robotics", region: "USA (Las Vegas, NV)", url: "https://www.pololu.com/product/2851" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/pololu-corporation/2851/10450912" }
    ]
  },
  {
    id: "holder_18650",
    name: "Double 18650 Battery Holder with Cells",
    category: "Power Supply",
    estimatedPriceUSD: 14,
    specs: "Includes two 3.7V 2500mAh high-drain Li-ion cells, XT30 connector, built-in PCM protection",
    roleInProject: "Moderate discharge rechargeable power supply for wheeled rovers and IoT agents.",
    voltage: "7.4V combined nominal",
    interface: "XT30 / red-black wires",
    manufacturer: "Keystone Electronics (New York, USA)",
    productUrl: "https://www.keystone-mfg.com/",
    originCountry: "USA (New Hyde Park, NY)",
    isNatoAligned: true,
    natoAllianceNote: "Battery holder engineered by Keystone Electronics Corp (New York, USA)",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/keystone-electronics/1043/3182513" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=Keystone%2018650" }
    ]
  },
  {
    id: "parallax_battery_holder_5aa",
    name: "Parallax 5x AA Battery Holder with 2.1mm Barrel Jack",
    category: "Power Supply",
    estimatedPriceUSD: 4.5,
    specs: "5x AA cell holder delivering 6.0V (NiMH rechargeable) or 7.5V (Alkaline) with center-positive 2.1mm plug",
    roleInProject: "Direct plug-in power source for Parallax Cyber:bot carrier board and servos.",
    voltage: "6.0V - 7.5V DC output",
    interface: "2.1mm Center-Positive Barrel Jack",
    manufacturer: "Parallax Inc.",
    productUrl: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Parallax Inc. USA standard power supply",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/product/5-cell-aa-battery-holder-with-barrel-plug/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/parallax-inc/753-00007/1498652" }
    ]
  },
  {
    id: "battery_indicator_led_bargraph",
    name: "1S–8S LED Battery Level Voltage Indicator Board",
    category: "Power Supply",
    estimatedPriceUSD: 1.8,
    specs: "Selectable 1S–8S solder pads (3.7V–33.6V), 5-segment ultra-bright green/red LED bargraph, momentary push-to-test button, 15mA test draw",
    roleInProject: "Real-time battery gauge mounted directly to robot companion exterior chassis. Gives instantaneous optical battery status at zero computational overhead.",
    voltage: "3.7V - 30V DC",
    interface: "2-Wire DC Vin (+ / -)",
    manufacturer: "MakerFocus / SparkFun Partner",
    productUrl: "https://www.sparkfun.com/",
    originCountry: "USA / Open Hardware",
    isNatoAligned: true,
    natoAllianceNote: "Vetted open-hardware battery diagnostic gauge stocked by domestic maker suppliers",
    authorizedSuppliers: [
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/" },
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "max17048_fuel_gauge",
    name: "I2C MAX17048 LiPo Fuel Gauge & State-of-Charge Monitor",
    category: "Power Supply",
    estimatedPriceUSD: 3.85,
    specs: "ModelGauge algorithm, 1S (3.7V) LiPo/Li-Ion I2C battery monitor, alerts on low battery %, no current sense resistor needed, ultra-low 23uA idle draw",
    roleInProject: "Precision state-of-charge battery fuel gauge. Reports exact battery % and millivolts to MCU over I2C bus for graceful shutdown and auto-docking.",
    voltage: "2.5V - 4.5V (3.3V Logic)",
    interface: "I2C (0x36)",
    manufacturer: "SparkFun / Adafruit",
    productUrl: "https://www.sparkfun.com/products/10617",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Engineered by SparkFun Electronics (Boulder, CO) with open-source Arduino/CircuitPython drivers",
    authorizedSuppliers: [
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/10617" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/sparkfun-electronics/PRT-10617/5673792" }
    ]
  },
  {
    id: "mini_digital_voltmeter",
    name: "Mini 0.28\" 2-Wire Digital DC Voltmeter Module",
    category: "Power Supply",
    estimatedPriceUSD: 1.5,
    specs: "0.28 inch 3-digit high-contrast LED display, 2.5V–30V DC measurement range, reverse polarity protection, 12mA draw",
    roleInProject: "Cost-effective digital companion voltage readout. Shows real-time pack voltage with numerical precision right on the robot housing.",
    voltage: "2.5V - 30V DC",
    interface: "2-Wire DC (Red Vin+, Black GND)",
    manufacturer: "Adafruit / DFRobot",
    productUrl: "https://www.adafruit.com/product/575",
    originCountry: "USA / Global Maker Vetted",
    isNatoAligned: true,
    natoAllianceNote: "Stocked and quality-tested by Adafruit (New York, NY)",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/575" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/" }
    ]
  },
  {
    id: "dual_18650_shield_typec",
    name: "Dual 18650 Li-ion Battery Shield with 5V/3A Boost & Type-C",
    category: "Power Supply",
    estimatedPriceUSD: 4.5,
    specs: "Holds 2x standard 18650 cells, integrated 5V 3A synchronous boost converter, Type-C charging port, over-discharge & short protection",
    roleInProject: "Budget-friendly companion robot power plant. Provides clean regulated 5V power to MCU and servos with plug-and-play USB-C charging.",
    voltage: "3.7V - 4.2V Batt -> 5V 3A Regulated Out",
    interface: "USB-A + Type-C + Screw Terminals",
    manufacturer: "Waveshare / Adafruit Partner",
    productUrl: "https://www.waveshare.com/",
    originCountry: "Global / US Vetted",
    isNatoAligned: true,
    natoAllianceNote: "Tested with dual 18650 cells under 3A surge draws for high-reflex servos",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" },
      { name: "Amazon US / Micro Center", region: "USA", url: "https://www.microcenter.com/" }
    ]
  },

  // ==========================================
  // SECTION 11: WIRELESS & ACCESSORIES
  // ==========================================
  {
    id: "digi_xbee_3_zigbee",
    name: "Digi XBee 3 Zigbee 3.0 / 802.15.4 RF Module",
    category: "Accessory",
    estimatedPriceUSD: 24.5,
    specs: "Silicon Labs EFR32MG Cortex-M4 with MicroPython, 2.4GHz Zigbee Mesh (up to 2 mile line-of-sight range)",
    roleInProject: "Long-range mesh networking radio connecting robot swarms and telemetry base stations.",
    voltage: "2.1V - 3.6V DC",
    interface: "Zigbee 3.0 Mesh RF, UART, SPI, 15x GPIO, 4x 10-bit ADC",
    manufacturer: "Digi International",
    productUrl: "https://www.digi.com/products/embedded-systems/digi-xbee/rf-modules/2-4-ghz-rf-modules/xbee3-zigbee-3",
    originCountry: "USA (Domestic NATO)",
    isNatoAligned: true,
    natoAllianceNote: "Digi International (Hopkins, MN, USA); defense and industrial mesh networking standard",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/en/products/detail/digi/XB3-24Z8UM-J/8342410" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/c/?q=XBee3%20Zigbee" }
    ]
  },

  // ==========================================
  // SECTION 12: MICRO CENTER MAKER/STEM (Category 712)
  // https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712
  // ==========================================
  {
    id: "microcenter_inland_mega_2560",
    name: "Inland MEGA 2560 R3 Board (Micro Center Maker/STEM)",
    category: "Microcontroller",
    estimatedPriceUSD: 19.99,
    specs: "ATmega2560-16AU @ 16MHz, 256KB Flash, 8KB SRAM, 54 digital I/O pins (15 PWM), 16 analog inputs, 4 hardware UARTs",
    roleInProject: "High-pinout real-time robotic controller for complex multi-actuator rovers, multi-servo arms, and sensor arrays.",
    voltage: "5V Logic / 7-12V Input",
    interface: "54x GPIO, 16x ADC, 15x PWM, 4x UART, SPI, I2C",
    manufacturer: "Inland (Micro Center)",
    productUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    originCountry: "USA (Micro Center Maker Line)",
    isNatoAligned: true,
    natoAllianceNote: "Micro Center Maker/STEM domestic retail line (Category 712)",
    authorizedSuppliers: [
      { name: "Micro Center", region: "USA (Maker/STEM Category 712)", url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712" }
    ]
  },
  {
    id: "microcenter_inland_esp32_core",
    name: "Inland ESP32 Core Board (Wi-Fi + BLE DevKit)",
    category: "Microcontroller",
    estimatedPriceUSD: 7.99,
    specs: "Dual-Core Xtensa LX6 @ 240MHz, 520KB SRAM, 4MB Flash, integrated 2.4GHz 802.11b/g/n Wi-Fi and Bluetooth 4.2/BLE",
    roleInProject: "High-speed wireless communications controller for telemetry broadcasting, ROS2 micro-XRCE agent, and motor control.",
    voltage: "3.3V Logic / 5V USB",
    interface: "GPIO, ADC, DAC, capacitive touch, I2C, SPI, UART, PWM",
    manufacturer: "Inland (Micro Center)",
    productUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    originCountry: "USA (Micro Center Maker Line)",
    isNatoAligned: true,
    natoAllianceNote: "Micro Center Maker/STEM domestic retail line (Category 712)",
    authorizedSuppliers: [
      { name: "Micro Center", region: "USA (Maker/STEM Category 712)", url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712" }
    ]
  },
  {
    id: "microcenter_inland_l298p_shield",
    name: "Inland L298P 4-Channel Motor Drive Shield",
    category: "Motor Driver",
    estimatedPriceUSD: 14.99,
    specs: "Dual L298P H-Bridge ICs driving 2x DC motors (up to 2A per channel) or 1x 4-wire bipolar stepper; onboard buzzer, ultrasonic header & servo power port",
    roleInProject: "Direct plug-and-play shield for Arduino Uno/Mega robots driving twin DC drive motors with PWM speed modulation.",
    voltage: "4.8V - 24V Motor Supply / 5V Logic",
    interface: "Arduino Shield Header, PWM Speed (D10, D11), Direction (D12, D13), Buzzer (D4)",
    manufacturer: "Inland (Micro Center)",
    productUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    originCountry: "USA (Micro Center Maker Line)",
    isNatoAligned: true,
    natoAllianceNote: "Micro Center Maker/STEM domestic retail line (Category 712)",
    authorizedSuppliers: [
      { name: "Micro Center", region: "USA (Maker/STEM Category 712)", url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712" }
    ]
  },
  {
    id: "microcenter_inland_sensor_kit_37",
    name: "Inland 37-in-1 Robotics Sensor Super Kit",
    category: "Sensor",
    estimatedPriceUSD: 29.99,
    specs: "Comprehensive 37-piece sensor suite including Ultrasonic HC-SR04, PIR motion, Hall magnetic, Flame IR, Tilt switch, Rotary encoder, Analog temp & RGB LED modules",
    roleInProject: "Complete multi-modal perception toolkit for obstacle detection, environment mapping, posture sensing, and user feedback.",
    voltage: "3.3V - 5.0V DC",
    interface: "Analog Voltage, Digital I/O, 1-Wire, I2C",
    manufacturer: "Inland (Micro Center)",
    productUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    originCountry: "USA (Micro Center Maker Line)",
    isNatoAligned: true,
    natoAllianceNote: "Micro Center Maker/STEM domestic retail line (Category 712)",
    authorizedSuppliers: [
      { name: "Micro Center", region: "USA (Maker/STEM Category 712)", url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712" }
    ]
  },
  {
    id: "microcenter_inland_servo_9g_3pk",
    name: "Inland 9G Micro Servos (3-Pack)",
    category: "Actuator",
    estimatedPriceUSD: 8.99,
    specs: "3x 9-gram mini servos, 1.6 kg-cm stall torque @ 4.8V, 0.12s/60° speed, 180° rotation, includes assorted servo horns and screws",
    roleInProject: "Actuation for pan-and-tilt sensor turrets, robotic claw grippers, and steering mechanisms.",
    voltage: "4.8V - 6.0V DC",
    interface: "3-pin Standard PWM (50Hz)",
    manufacturer: "Inland (Micro Center)",
    productUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    originCountry: "USA (Micro Center Maker Line)",
    isNatoAligned: true,
    natoAllianceNote: "Micro Center Maker/STEM domestic retail line (Category 712)",
    authorizedSuppliers: [
      { name: "Micro Center", region: "USA (Maker/STEM Category 712)", url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712" }
    ]
  },
  {
    id: "microcenter_inland_ks0327_stepper",
    name: "Inland Keyestudio Stepper Driver + 28BYJ-48 5V Stepper Kit",
    category: "Motor Driver",
    estimatedPriceUSD: 11.99,
    specs: "3x 28BYJ-48 5V 4-phase geared stepper motors with ULN2003 Darlington driver boards; 64:1 reduction ratio with 5.625°/64 step angle",
    roleInProject: "Precision positioning stepper drive for robotic arm joints, indexers, and dial controls.",
    voltage: "5.0V DC",
    interface: "4-Phase GPIO Stepping (IN1, IN2, IN3, IN4)",
    manufacturer: "Inland (Micro Center)",
    productUrl: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    originCountry: "USA (Micro Center Maker Line)",
    isNatoAligned: true,
    natoAllianceNote: "Micro Center Maker/STEM domestic retail line (Category 712)",
    authorizedSuppliers: [
      { name: "Micro Center", region: "USA (Maker/STEM Category 712)", url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712" }
    ]
  },

  // ==========================================
  // SECTION 13: PISHOP.US RASPBERRY PI & ROBOTICS
  // https://www.pishop.us/categories
  // ==========================================
  {
    id: "pishop_rpi5_8gb",
    name: "Raspberry Pi 5 (8GB RAM) - PiShop Approved",
    category: "SBC",
    estimatedPriceUSD: 80.00,
    specs: "Broadcom BCM2712 Quad-Core 64-bit Arm Cortex-A76 @ 2.4GHz, VideoCore VII GPU @ 800MHz, 8GB LPDDR4X-4267, PCIe 2.0 x1 M.2, Dual 4Kp60 HDMI",
    roleInProject: "Flagship SBC host for high-throughput ROS2 Humble nodes, realtime stereo vision, SLAM navigation, and local LLM agents.",
    voltage: "5.1V / 5.0A USB-C PD (27W Recommended)",
    interface: "40-Pin GPIO, PCIe 2.0, 2x 4-Lane MIPI DSI/CSI, Gigabit Ethernet, 2x USB 3.0, 2x USB 2.0, Dual-band 802.11ac Wi-Fi, BLE 5.0",
    manufacturer: "Raspberry Pi Foundation",
    productUrl: "https://www.pishop.us/categories",
    originCountry: "United Kingdom (NATO Founder)",
    isNatoAligned: true,
    natoAllianceNote: "Official Raspberry Pi Approved Reseller USA (PiShop.us)",
    authorizedSuppliers: [
      { name: "PiShop.us", region: "USA (Official Raspberry Pi Approved Reseller)", url: "https://www.pishop.us/categories" },
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "pishop_rpi_ai_hat_plus",
    name: "Raspberry Pi AI HAT+ (Hailo-8L 13 TOPS)",
    category: "SOM / AI Accelerator",
    estimatedPriceUSD: 70.00,
    specs: "Hailo-8L Neural Processing Unit delivering 13 TOPS INT8 deep learning inference, connects via Raspberry Pi 5 PCIe ribbon cable",
    roleInProject: "Accelerates YOLOv8 object detection, pose estimation, and segmentation at 30+ FPS directly on the robot chassis with zero CPU load.",
    voltage: "Power drawn through Raspberry Pi 5 PCIe header",
    interface: "PCIe 2.0 x1 via 16-pin FPC ribbon connector",
    manufacturer: "Raspberry Pi / Hailo",
    productUrl: "https://www.pishop.us/categories",
    originCountry: "United Kingdom / Israel (Allied)",
    isNatoAligned: true,
    natoAllianceNote: "PiShop.us official inventory; Hailo allied technology",
    authorizedSuppliers: [
      { name: "PiShop.us", region: "USA (Official Raspberry Pi Approved Reseller)", url: "https://www.pishop.us/categories" }
    ]
  },
  {
    id: "pishop_rpi_ai_camera",
    name: "Raspberry Pi AI Camera (Sony IMX500 12.3MP)",
    category: "Sensor",
    estimatedPriceUSD: 70.00,
    specs: "Sony IMX500 Intelligent Vision Sensor with integrated AI tensor accelerator running MobileNet and neural classification on-chip",
    roleInProject: "Outputs pre-processed bounding boxes, human pose coordinates, and class labels directly to Raspberry Pi over standard CSI without host CPU overhead.",
    voltage: "3.3V via MIPI CSI ribbon",
    interface: "2-lane MIPI CSI-2 camera connector (compatible with Pi 4, Pi 5, Pi Zero 2)",
    manufacturer: "Raspberry Pi / Sony",
    productUrl: "https://www.pishop.us/categories",
    originCountry: "Japan (NATO Global Partner)",
    isNatoAligned: true,
    natoAllianceNote: "Sony IMX500 on-sensor AI; distributed via PiShop.us",
    authorizedSuppliers: [
      { name: "PiShop.us", region: "USA (Official Raspberry Pi Approved Reseller)", url: "https://www.pishop.us/categories" }
    ]
  },
  {
    id: "pishop_rpi_pico_2",
    name: "Raspberry Pi Pico 2 (RP2350 Dual M33 / Hazard3 RISC-V)",
    category: "Microcontroller",
    estimatedPriceUSD: 5.00,
    specs: "Dual ARM Cortex-M33 or Dual Hazard3 RISC-V @ 150MHz (user selectable), 520KB SRAM, 4MB QSPI Flash, Arm TrustZone security, 12 Programmable I/O (PIO) state machines",
    roleInProject: "Next-generation low-latency motor control co-processor with ultra-flexible PIO state machines for quadrature encoders, DMX, and WS2812B.",
    voltage: "3.3V Logic / 1.8V - 5.5V Input",
    interface: "26x Multi-function GPIO, 3x ADC, 2x SPI, 2x I2C, 2x UART, 16x PWM, 12x PIO",
    manufacturer: "Raspberry Pi Foundation",
    productUrl: "https://www.pishop.us/categories",
    originCountry: "United Kingdom (NATO Founder)",
    isNatoAligned: true,
    natoAllianceNote: "Designed in Cambridge, UK; sold via PiShop.us",
    authorizedSuppliers: [
      { name: "PiShop.us", region: "USA (Official Raspberry Pi Approved Reseller)", url: "https://www.pishop.us/categories" }
    ]
  },
  {
    id: "pishop_pimoroni_yukon_host",
    name: "Pimoroni Yukon High-Power Modular Robotics Host",
    category: "Motor Driver",
    estimatedPriceUSD: 44.95,
    specs: "RP2040-powered modular robotics platform accepting up to 6 high-current Yukon modules (Dual Motor, Stepper, Big Motor, Audio, Encoder); 5V - 17V power input",
    roleInProject: "Central high-power robotics power hub and motion coordinator capable of delivering up to 15A continuous current to servos and DC motors.",
    voltage: "5.0V - 17.0V DC Input",
    interface: "USB-C, Qw/ST (Qwiic/STEMMA QT), 6x High-Power Module Slots, I2C, SPI, UART",
    manufacturer: "Pimoroni / PiShop.us",
    productUrl: "https://www.pishop.us/categories",
    originCountry: "United Kingdom (NATO Founder)",
    isNatoAligned: true,
    natoAllianceNote: "Pimoroni robotics; stocked at PiShop.us",
    authorizedSuppliers: [
      { name: "PiShop.us", region: "USA (Official Raspberry Pi Approved Reseller)", url: "https://www.pishop.us/categories" }
    ]
  },
  {
    id: "pishop_waveshare_motor_hat",
    name: "Waveshare Motor Driver HAT for Raspberry Pi",
    category: "Motor Driver",
    estimatedPriceUSD: 21.95,
    specs: "Onboard PCA9685 I2C PWM chip + Dual TB6612FNG H-bridges, drives up to 4x DC motors or 2x stepper motors + 5V 3A onboard regulator",
    roleInProject: "Stacks directly onto Raspberry Pi 40-pin GPIO header, controlling mobile rover drive wheels via I2C with zero GPIO pin contention.",
    voltage: "6V - 12V DC Motor Power / 5V Logic",
    interface: "Raspberry Pi 40-Pin Header, I2C (Address 0x40/0x60)",
    manufacturer: "Waveshare / PiShop.us",
    productUrl: "https://www.pishop.us/categories",
    originCountry: "USA Distributor (PiShop.us)",
    isNatoAligned: true,
    natoAllianceNote: "PiShop.us verified robotics accessory",
    authorizedSuppliers: [
      { name: "PiShop.us", region: "USA (Official Raspberry Pi Approved Reseller)", url: "https://www.pishop.us/categories" }
    ]
  },

  // ==========================================
  // SECTION 14: NEWARK ELEMENT14 INDUSTRIAL ELECTRONICS
  // https://www.newark.com/browse-for-products
  // ==========================================
  {
    id: "newark_stm32_nucleo_f446re",
    name: "STMicroelectronics STM32 Nucleo-F446RE Dev Board",
    category: "Microcontroller",
    estimatedPriceUSD: 19.86,
    specs: "ARM 32-bit Cortex-M4 CPU with FPU @ 180MHz, 512KB Flash, 128KB SRAM, Arduino Uno V3 & ST Morpho headers, onboard ST-LINK/V2-1 debugger",
    roleInProject: "Industrial-grade determinism for hard real-time motor commutation, field-oriented control (FOC), and high-frequency sensor fusion.",
    voltage: "3.3V Logic / 5V USB or 7-12V Vin",
    interface: "ST Morpho + Arduino V3 headers, 3x SPI, 3x I2C, 4x USART, 2x CAN 2.0B, 16-bit & 32-bit timers",
    manufacturer: "STMicroelectronics",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "Switzerland / France / Italy (NATO Allies)",
    isNatoAligned: true,
    natoAllianceNote: "STMicroelectronics European semiconductor design; stocked by Newark",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "newark_beaglebone_black_industrial",
    name: "BeagleBone Black Industrial (TI Sitara AM3358)",
    category: "SBC",
    estimatedPriceUSD: 79.95,
    specs: "TI AM3358 ARM Cortex-A8 @ 1GHz with Dual 200MHz PRU Real-Time Co-Processors, 512MB DDR3, 4GB 8-bit eMMC, Industrial -40°C to +85°C rated",
    roleInProject: "Dual PRU (Programmable Real-Time Unit) co-processors execute nanosecond-precise motor stepping and encoder quadrature while running Linux on Cortex-A8.",
    voltage: "5.0V DC Input (barrel jack or USB)",
    interface: "2x 46-Pin Cape Headers, 65x GPIO, 8x PWM, 4x Timers, 5x UART, 2x I2C, 2x SPI, CAN Bus",
    manufacturer: "BeagleBoard.org / Newark element14",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "USA (NATO Domestic)",
    isNatoAligned: true,
    natoAllianceNote: "BeagleBoard.org US open-source computing, stocked by Newark",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "newark_arduino_nano_33_ble_sense",
    name: "Arduino Nano 33 BLE Sense (Edge ML Edition)",
    category: "Microcontroller",
    estimatedPriceUSD: 36.30,
    specs: "Nordic nRF52840 32-bit ARM Cortex-M4F @ 64MHz, 1MB Flash, 256KB RAM, 9-axis IMU (LSM9DS1), humidity/temp (HTS221), barometric (LPS22HB), microphone (MP34DT05), gesture/proximity (APDS9960)",
    roleInProject: "Complete self-contained sensor fusion and TinyML gesture/voice recognition node in an ultra-compact breadboard-friendly form factor.",
    voltage: "3.3V Logic / 5V USB",
    interface: "14x Digital I/O (all PWM), 8x ADC, I2C, SPI, UART, Bluetooth 5.0 / BLE",
    manufacturer: "Arduino Official / Newark",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "Italy (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Official Arduino manufacture; premier distributor Newark element14",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "newark_tmc2209_silentstep",
    name: "Trinamic TMC2209 SilentStepStick Stepper Driver (Newark)",
    category: "Motor Driver",
    estimatedPriceUSD: 14.50,
    specs: "Trinamic TMC2209-LA driver IC, StealthChop2 ultra-silent motor operation, SpreadCycle high-dynamics, StallGuard4 sensorless homing, up to 2.8A peak / 2.0A RMS",
    roleInProject: "Whisper-quiet precision stepper control for robotic arms, pan/tilt gimbal turrets, and precision linear positioning with sensorless obstacle homing.",
    voltage: "4.75V - 28V DC Motor Supply / 3.3V - 5V Logic",
    interface: "STEP / DIR interface or single-wire UART configuration",
    manufacturer: "Analog Devices Trinamic / Newark",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "Germany (NATO Ally)",
    isNatoAligned: true,
    natoAllianceNote: "Analog Devices Trinamic Germany; Newark authorized distribution",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "newark_ti_bq25895_charger",
    name: "Texas Instruments BQ25895 I2C Li-Ion Charger & Boost Module",
    category: "Power Supply",
    estimatedPriceUSD: 28.50,
    specs: "High-efficiency 5A switch-mode battery charge management and 3.1A boost power delivery, MaxCharge technology for high-voltage USB, programmable I2C telemetry",
    roleInProject: "Intelligent battery power management for mobile rovers, reporting state-of-charge, voltage, charge current, and thermal telemetry over I2C.",
    voltage: "3.9V - 14V Input / 3.84V - 4.6V Battery / 5.15V Boost Output",
    interface: "I2C (Address 0x6A), INT interrupt pin, Status LEDs",
    manufacturer: "Texas Instruments / Newark element14",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "USA (NATO Domestic)",
    isNatoAligned: true,
    natoAllianceNote: "Texas Instruments Dallas, TX; Newark franchise distributor",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "newark_honeywell_ss49e_hall",
    name: "Honeywell SS49E Linear Hall-Effect Magnetic Sensor",
    category: "Sensor",
    estimatedPriceUSD: 2.75,
    specs: "High-accuracy linear ratiometric Hall-effect sensor, quad Hall element, responds to both North and South magnetic poles with low-noise analog output",
    roleInProject: "Contactless angular wheel position, magnetic gear tooth counting, and robotic arm joint limit sensing immune to mechanical wear.",
    voltage: "2.7V - 6.5V DC",
    interface: "3-pin Analog Output (VCC, GND, VOUT ratiometric to VCC)",
    manufacturer: "Honeywell / Newark element14",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "USA (NATO Domestic)",
    isNatoAligned: true,
    natoAllianceNote: "Honeywell Sensing & Productivity Solutions; Newark authorized distributor",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },
  {
    id: "newark_pololu_d24v10f5_stepdown",
    name: "Pololu 5V 1A Step-Down Voltage Regulator D24V10F5",
    category: "Power Supply",
    estimatedPriceUSD: 9.95,
    specs: "High-efficiency synchronous buck regulator, input 5.5V to 36V, continuous 1A output at 5V, 80% to 93% efficiency, integrated thermal and reverse voltage protection",
    roleInProject: "Steps down 7.4V or 11.1V battery voltages cleanly to power 5V microcontrollers, Raspberry Pi SBCs, and sensitive sensors without heat buildup.",
    voltage: "5.5V - 36V Input -> 5.0V Regulated Output",
    interface: "3-Pin Breadboard Header (VIN, GND, VOUT) with Shutdown Pin",
    manufacturer: "Pololu / Newark element14",
    productUrl: "https://www.newark.com/browse-for-products",
    originCountry: "USA (Las Vegas, NV)",
    isNatoAligned: true,
    natoAllianceNote: "Pololu Robotics USA; stocked by Newark",
    authorizedSuppliers: [
      { name: "Newark element14", region: "North America (Premier Industrial Distributor)", url: "https://www.newark.com/browse-for-products" }
    ]
  },

  // =========================================================================
  // SECTION 15: ANIMATRONICS & EXPRESSION (COMPANION KINETICS & REFLEXES)
  // =========================================================================
  {
    id: "micro_servo_sg90_pack",
    name: "SG90 9g Sub-Micro Reflex Servos (3-Pack)",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 5.8,
    specs: "3x 9-gram analog micro-servos, 1.8 kg-cm torque, 0.10s/60° rotational speed at 4.8V, includes nylon horn arms",
    roleInProject: "High-speed reflex actuators for independent ear twitches, eyelid flickers, and tail wag kinematic flourishes on a budget.",
    voltage: "4.8V - 6.0V DC",
    interface: "PWM (50Hz Standard Servo Signal)",
    manufacturer: "TowerPro / Maker Store",
    productUrl: "https://www.adafruit.com/product/169",
    originCountry: "Global / US Vetted",
    isNatoAligned: true,
    natoAllianceNote: "Vetted budget standard for rapid robotics actuation",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/169" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/products/9065" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "servo_mg90s_fast_metal",
    name: "MG90S High-Speed Metal Gear Micro Servo",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 3.6,
    specs: "Full metal brass/aluminum gear train, ball bearing pivot, 0.08s/60° high-speed response, 2.2 kg-cm torque",
    roleInProject: "Fast-twitch kinematic servo for rapid companion head tracking, cat-like alertness reflexes, and expressive neck tilts.",
    voltage: "4.8V - 6.0V DC",
    interface: "PWM (50Hz Servo Pin)",
    manufacturer: "TowerPro / Pololu Compatible",
    productUrl: "https://www.pololu.com/",
    originCountry: "Global / US Bench Tested",
    isNatoAligned: true,
    natoAllianceNote: "Metal gear durability under sudden rapid shock loads",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" },
      { name: "Mouser Electronics", region: "USA (Mansfield, TX)", url: "https://www.mouser.com/" }
    ]
  },
  {
    id: "pantilt_micro_reflex",
    name: "Dual-Axis Micro Pan/Tilt Reflex Gimbal with Servos",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 6.5,
    specs: "2-DOF lightweight nylon pan/tilt bracket pre-fitted with dual 9g micro-servos, 180° pan and 150° tilt range",
    roleInProject: "Expressive companion head/neck articulation. Allows the robot to tilt its head inquiringly, track moving objects, and nod.",
    voltage: "5.0V DC",
    interface: "2x PWM Channels (Pan & Tilt)",
    manufacturer: "Adafruit / SparkFun",
    productUrl: "https://www.adafruit.com/product/1967",
    originCountry: "USA (Adafruit Sourced)",
    isNatoAligned: true,
    natoAllianceNote: "Pre-assembled animatronics neck gimbal kit",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/1967" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/" }
    ]
  },
  {
    id: "dual_oled_animated_eyes",
    name: "Dynamic 0.96\" Dual I2C OLED Animated Eye Displays (Pair)",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 6.2,
    specs: "2x 128x64 high-contrast blue/white OLED screens with shared I2C bus (selectable 0x3C/0x3D addresses), SSD1306 driver",
    roleInProject: "Expressive ocular system. Renders animated procedural cat pupils, emotional blinking, winking, and sleepy squinting in real time.",
    voltage: "3.3V - 5.0V DC",
    interface: "I2C (0x3C and 0x3D)",
    manufacturer: "Adafruit / MakerFocus",
    productUrl: "https://www.adafruit.com/product/938",
    originCountry: "USA (Adafruit Tested)",
    isNatoAligned: true,
    natoAllianceNote: "I2C dual-display compatible with Teensy, ESP32, and Arduino SSD1306 graphics libs",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/938" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "haptic_purr_transducer",
    name: "Resonant Haptic Purr Transducer & Mini Bass Exciter (24mm)",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 3.4,
    specs: "24mm 4-ohm 2W tactile voice-coil exciter, vibrates chassis surfaces at 40Hz–120Hz feline purr resonance frequency",
    roleInProject: "Physical purr generator. Translates gentle petting interactions into deep, soothing physical vibration and acoustic purr hum throughout the robot body.",
    voltage: "3.3V - 5.0V (via mini amp or PWM MOSFET)",
    interface: "PWM / Analog Audio Out",
    manufacturer: "Dayton Audio / Adafruit",
    productUrl: "https://www.adafruit.com/product/1785",
    originCountry: "USA (Dayton Audio / Adafruit Sourced)",
    isNatoAligned: true,
    natoAllianceNote: "Acoustic chassis resonance actuator for organic haptic response",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/1785" },
      { name: "Parts Express", region: "USA (Springboro, OH)", url: "https://www.parts-express.com/" }
    ]
  },
  {
    id: "capacitive_touch_whiskers",
    name: "Flexible Capacitive Touch Whisker Array Kit (4-Wire)",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 3.9,
    specs: "4x super-elastic nickel-titanium (Nitinol) whiskers with silicone dampeners and capacitive touch breakout leads",
    roleInProject: "Feline vibrissae tactile array. Detects narrow corridor obstacles, gentle drafts, or affectionate hand petting along the companion's cheeks.",
    voltage: "3.3V / 5V Logic",
    interface: "Capacitive Touch Pins / GPIO",
    manufacturer: "Parallax / Maker Labs",
    productUrl: "https://www.parallax.com/",
    originCountry: "USA (Parallax Sourced)",
    isNatoAligned: true,
    natoAllianceNote: "Zero-wear flexible nitinol whisker sensing array",
    authorizedSuppliers: [
      { name: "Parallax Inc.", region: "USA (Rocklin, CA)", url: "https://www.parallax.com/" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/" }
    ]
  },
  {
    id: "pam8403_companion_speaker",
    name: "PAM8403 3W Micro Amp + 28mm Mylar Companion Speaker",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 2.4,
    specs: "Class-D 3W stereo amplifier module (efficiency >90%) with compact 28mm 8-ohm mylar cone speaker",
    roleInProject: "Acoustic companion voice module. Produces cheerful chirps, melodic trills, authentic meows, and emotional sound cues.",
    voltage: "2.5V - 5.5V DC",
    interface: "DAC / PWM / I2S Audio Pin",
    manufacturer: "Diodes Inc. IC / Adafruit Partner",
    productUrl: "https://www.adafruit.com/",
    originCountry: "USA / Global Maker Vetted",
    isNatoAligned: true,
    natoAllianceNote: "Ultra-compact audio stage for companion sound effects",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "ws2812b_mood_bar",
    name: "WS2812B NeoPixel 8-LED Emotive Mood Bar & Tail Tip",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 2.2,
    specs: "8x individually addressable 5050 RGB LEDs with built-in WS2812B ICs, single-wire control, 16.7 million colors",
    roleInProject: "Aura and emotion signaling. Glows soothing warm amber when calm, pulsing cyan when active, and flickers red when low battery.",
    voltage: "5.0V DC",
    interface: "1-Wire Digital Signal (DIN)",
    manufacturer: "Worldsemi / Adafruit NeoPixel",
    productUrl: "https://www.adafruit.com/product/1426",
    originCountry: "USA (Adafruit Sourced)",
    isNatoAligned: true,
    natoAllianceNote: "Standard RGB emotive strip for tail illumination and battery status",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/1426" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "submicro_3g_servo",
    name: "Sub-Micro 3.7g Coreless Ultra-Fast Micro Servo",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 2.9,
    specs: "Ultra-miniature 3.7g coreless motor servo, 0.06s/60° instantaneous twitch speed, 0.8 kg-cm torque",
    roleInProject: "Ultra-low mass servo for delicate ear twitching, whisker positioning, or subtle emotive brow adjustments without weighing down the head.",
    voltage: "3.7V - 4.8V DC",
    interface: "PWM (Standard Servo Pin)",
    manufacturer: "EMAX / HobbyKing US",
    productUrl: "https://www.adafruit.com/",
    originCountry: "Global / US Distributed",
    isNatoAligned: true,
    natoAllianceNote: "Sub-4g coreless actuator for rapid feline ear kinematic nuance",
    authorizedSuppliers: [
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" },
      { name: "Amain Hobbies", region: "USA (Chico, CA)", url: "https://www.amainhobbies.com/" }
    ]
  },
  {
    id: "silicone_paw_fsr_pads",
    name: "Silicone Soft Paw Touch Pads with Embedded Micro-FSR (Pair)",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 4.2,
    specs: "Molded high-grip silicone paw pads with integrated 0.5-inch round force-sensing resistors (FSR), 20g to 10kg sensitivity",
    roleInProject: "Tactile ground contact and stepping sensation. Senses surface pressure, enabling soft feline-like silent footsteps and lap cuddles.",
    voltage: "3.3V - 5.0V Analog",
    interface: "Analog ADC (2 Channels)",
    manufacturer: "Interlink Electronics / Adafruit",
    productUrl: "https://www.adafruit.com/product/166",
    originCountry: "USA (Interlink Electronics, Camarillo, CA)",
    isNatoAligned: true,
    natoAllianceNote: "Interlink Electronics USA genuine force sensors",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/166" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  },
  {
    id: "ttp223_touch_pads",
    name: "TTP223 Capacitive Hidden Petting Sensor (3-Pack)",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 2.1,
    specs: "3x compact 15x11mm capacitive touch switch modules, senses touch through up to 3mm of plastic, faux fur, or 3D print walls",
    roleInProject: "Hidden touch sensors under the robot's faux fur or top shell. Triggers joyful ear wiggles and purring when the robot is gently stroked.",
    voltage: "2.0V - 5.5V DC",
    interface: "Digital High/Low (3x GPIO)",
    manufacturer: "Tontek / Adafruit Partner",
    productUrl: "https://www.adafruit.com/",
    originCountry: "Global / US Tested",
    isNatoAligned: true,
    natoAllianceNote: "Through-chassis touch detection for petting recognition",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/" },
      { name: "SparkFun Electronics", region: "USA (Boulder, CO)", url: "https://www.sparkfun.com/" }
    ]
  },
  {
    id: "coin_vibe_heartbeat",
    name: "Micro 10mm Coin Vibration Motor Heartbeat Beeper",
    category: "Animatronics & Expression",
    estimatedPriceUSD: 1.2,
    specs: "10mm x 2.7mm pancake eccentric rotating mass (ERM) motor, 12,000 RPM at 3V, self-adhesive backing, 70mA draw",
    roleInProject: "Rhythmic companion heartbeat feedback or subtle responsive shiver when waking up from sleep mode.",
    voltage: "2.5V - 3.7V DC",
    interface: "PWM / GPIO via 2N2222 Transistor",
    manufacturer: "Adafruit Industries",
    productUrl: "https://www.adafruit.com/product/1201",
    originCountry: "USA (Adafruit Sourced)",
    isNatoAligned: true,
    natoAllianceNote: "Tactile pulse actuator for lifelike bio-mimetic heartbeat",
    authorizedSuppliers: [
      { name: "Adafruit Industries", region: "USA (New York, NY)", url: "https://www.adafruit.com/product/1201" },
      { name: "DigiKey", region: "USA (Thief River Falls, MN)", url: "https://www.digikey.com/" }
    ]
  }
];

export const SUPPLIER_CATALOG: HardwareComponent[] = rawSupplierCatalog.map(item => {
  const cat = item.category;
  const nameLower = item.name.toLowerCase();
  const roleLower = item.roleInProject.toLowerCase();
  const idLower = item.id.toLowerCase();

  let tags: RobotArchetypeTag[] = [];

  if (
    cat === "Motor Driver" ||
    idLower.includes("wheel") ||
    idLower.includes("motor") ||
    idLower.includes("chassis") ||
    idLower.includes("l298n") ||
    idLower.includes("tb6612") ||
    nameLower.includes("rover") ||
    nameLower.includes("wheel") ||
    nameLower.includes("differential")
  ) {
    tags.push("wheeled_rover");
  }

  if (
    idLower.includes("servo") ||
    idLower.includes("pca9685") ||
    idLower.includes("arm") ||
    idLower.includes("mg996r") ||
    nameLower.includes("arm") ||
    nameLower.includes("manipulator") ||
    nameLower.includes("gimbal") ||
    roleLower.includes("arm") ||
    roleLower.includes("servo") ||
    roleLower.includes("joint")
  ) {
    tags.push("kinematics_oriented");
  }

  if (
    idLower.includes("pca9685") ||
    idLower.includes("sg90") ||
    idLower.includes("mpu6050") ||
    idLower.includes("bno085") ||
    nameLower.includes("hexapod") ||
    nameLower.includes("spider") ||
    nameLower.includes("quadruped") ||
    roleLower.includes("walker") ||
    roleLower.includes("servo")
  ) {
    tags.push("spider");
  }

  if (
    idLower.includes("pca9685") ||
    idLower.includes("mg996r") ||
    nameLower.includes("biped") ||
    nameLower.includes("humanoid") ||
    nameLower.includes("android") ||
    roleLower.includes("bipedal") ||
    roleLower.includes("humanoid") ||
    cat === "Animatronics & Expression"
  ) {
    tags.push("android");
  }

  if (tags.length === 0) {
    tags = ["wheeled_rover", "kinematics_oriented", "spider", "android"];
  }

  return {
    ...item,
    archetypeTags: Array.from(new Set(tags))
  };
});

export const PRESET_PROJECTS = [
  {
    name: "Expressive Companion Robot Pet (Sub-$100 Build)",
    type: "hexapod" as const,
    goal: "An affordable, lifelike animatronic pet with cat-like reflex servos, animated OLED eye gazes, soothing purr haptics, capacitive touch whiskers, and an onboard LED battery monitor for under $100.",
    budget: 95,
    microcontroller: "ESP32-WROOM-32E (DevKitC)",
    components: [
      SUPPLIER_CATALOG.find(c => c.id === "esp32_wroom")!,
      SUPPLIER_CATALOG.find(c => c.id === "battery_indicator_led_bargraph")!,
      SUPPLIER_CATALOG.find(c => c.id === "servo_mg90s_fast_metal")!,
      SUPPLIER_CATALOG.find(c => c.id === "micro_servo_sg90_pack")!,
      SUPPLIER_CATALOG.find(c => c.id === "dual_oled_animated_eyes")!,
      SUPPLIER_CATALOG.find(c => c.id === "haptic_purr_transducer")!,
      SUPPLIER_CATALOG.find(c => c.id === "capacitive_touch_whiskers")!,
      SUPPLIER_CATALOG.find(c => c.id === "ttp223_touch_pads")!,
      SUPPLIER_CATALOG.find(c => c.id === "pam8403_companion_speaker")!,
      SUPPLIER_CATALOG.find(c => c.id === "ws2812b_mood_bar")!,
      SUPPLIER_CATALOG.find(c => c.id === "dual_18650_shield_typec")!
    ].filter(Boolean)
  },
  {
    name: "Autonomous Obstacle-Avoiding Rover",
    type: "wheeled_rover" as const,
    goal: "Navigate rooms autonomously, sweeping an ultrasonic sensor left and right to build distance paths, avoiding obstacles, and mapping walls via RPLIDAR.",
    budget: 200,
    microcontroller: "Raspberry Pi 4 Model B (8GB)",
    components: [
      SUPPLIER_CATALOG.find(c => c.id === "rpi4")!,
      SUPPLIER_CATALOG.find(c => c.id === "l298n")!,
      SUPPLIER_CATALOG.find(c => c.id === "tt_motor")!,
      SUPPLIER_CATALOG.find(c => c.id === "hcsr04")!,
      SUPPLIER_CATALOG.find(c => c.id === "rplidar_a1")!,
      SUPPLIER_CATALOG.find(c => c.id === "holder_18650")!,
      SUPPLIER_CATALOG.find(c => c.id === "ubec_5v")!
    ].filter(Boolean)
  },
  {
    name: "Parallax Cyber:bot STEM & Security Rover",
    type: "wheeled_rover" as const,
    goal: "A dual-controller STEM explorer using BBC micro:bit v2 and Parallax Propeller 8-Cog coprocessor with 360° feedback servos, LaserPING ToF ranging, and tactile whisker bumpers.",
    budget: 290,
    microcontroller: "Parallax BBC micro:bit v2 Module (Cyber:bot Controller)",
    components: [
      SUPPLIER_CATALOG.find(c => c.id === "parallax_microbit_v2")!,
      SUPPLIER_CATALOG.find(c => c.id === "parallax_cyberbot_carrier")!,
      SUPPLIER_CATALOG.find(c => c.id === "parallax_servo_360_feedback")!,
      SUPPLIER_CATALOG.find(c => c.id === "parallax_laserping_28041")!,
      SUPPLIER_CATALOG.find(c => c.id === "parallax_whiskers_kit")!,
      SUPPLIER_CATALOG.find(c => c.id === "parallax_battery_holder_5aa")!
    ].filter(Boolean)
  },
  {
    name: "Edge AI Visual Navigation Sentinel (Orin + ToF)",
    type: "wheeled_rover" as const,
    goal: "High-performance edge AI sentinel rover powered by NVIDIA Jetson Orin Nano with multi-zone VL53L4CX Time-of-Flight lidar and BNO085 9-DOF quaternion orientation.",
    budget: 380,
    microcontroller: "NVIDIA Jetson Orin Nano Developer SOM Module (8GB)",
    components: [
      SUPPLIER_CATALOG.find(c => c.id === "nvidia_jetson_orin_nano_8gb")!,
      SUPPLIER_CATALOG.find(c => c.id === "tb6612")!,
      SUPPLIER_CATALOG.find(c => c.id === "adafruit_vl53l4cx")!,
      SUPPLIER_CATALOG.find(c => c.id === "adafruit_bno085")!,
      SUPPLIER_CATALOG.find(c => c.id === "adafruit_bme688")!,
      SUPPLIER_CATALOG.find(c => c.id === "lipo_2s")!,
      SUPPLIER_CATALOG.find(c => c.id === "ubec_5v")!
    ].filter(Boolean)
  },
  {
    name: "Kinematic Robotic Sorting Arm",
    type: "robotic_arm" as const,
    goal: "A 4-axis robotic manipulator arm that tracks colored objects via computer vision, computes inverse kinematics on a host processor, and sorts blocks into bins.",
    budget: 150,
    microcontroller: "Arduino Uno R4 Minima",
    components: [
      SUPPLIER_CATALOG.find(c => c.id === "arduino_uno_r4")!,
      SUPPLIER_CATALOG.find(c => c.id === "pca9685")!,
      SUPPLIER_CATALOG.find(c => c.id === "mg996r")!,
      SUPPLIER_CATALOG.find(c => c.id === "sg90")!,
      SUPPLIER_CATALOG.find(c => c.id === "vl53l0x")!,
      SUPPLIER_CATALOG.find(c => c.id === "lipo_2s")!,
      SUPPLIER_CATALOG.find(c => c.id === "ubec_5v")!
    ].filter(Boolean)
  },
  {
    name: "Self-Stabilizing Hexapod Walker",
    type: "hexapod" as const,
    goal: "A 6-legged walking spider robot with 12 micro servos that dynamically adjusts its body height and level orientation based on realtime gyro telemetry.",
    budget: 120,
    microcontroller: "ESP32-WROOM-32E (DevKitC)",
    components: [
      SUPPLIER_CATALOG.find(c => c.id === "esp32_wroom")!,
      SUPPLIER_CATALOG.find(c => c.id === "pca9685")!,
      SUPPLIER_CATALOG.find(c => c.id === "sg90")!,
      SUPPLIER_CATALOG.find(c => c.id === "mpu6050")!,
      SUPPLIER_CATALOG.find(c => c.id === "holder_18650")!,
      SUPPLIER_CATALOG.find(c => c.id === "ubec_5v")!
    ].filter(Boolean)
  }
];
