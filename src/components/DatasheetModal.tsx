import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Download,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  Table,
  FileSpreadsheet,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowUpDown,
  Zap,
  Radio,
  SlidersHorizontal,
  ArrowLeftRight,
  Scale,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  BookmarkCheck
} from "lucide-react";
import { HardwareComponent } from "../types";
import { SUPPLIER_CATALOG } from "../data";
import { generateHardwareSvg } from "../lib/hardwareThumbnails";
import { CompareComponentsView } from "./CompareComponentsView";

export interface DatasheetRow {
  productName: string;
  category: 
    | "Sensor" 
    | "SOM / Embedded Compute (Linux/RTOS)" 
    | "SOM / AI Accelerator & Vision" 
    | "SOM / FPGA & MPSoC" 
    | "SOM / Microcontroller Board" 
    | "SOM / Industrial IoT & Wireless"
    | "Robot Kit / Platform" 
    | "Controller / Module" 
    | "Controller Carrier / Co-Processor" 
    | "Actuator / Closed-Loop Sensor"
    | "Motor Driver"
    | "Power Supply";
  manufacturer: string;
  coreProcessor: string;
  coProcessorOrNPU: string;
  clockSpeed: string;
  ramAndFlash: string;
  connectorType: string;
  voltage: string;
  interface: string;
  operatingTemp: string;
  specs: string;
  priceUSD: number;
  url: string;
  origin: string;
  sourceGroup: 
    | "Adafruit Category 57" 
    | "DigiKey Filter 721" 
    | "Parallax Cyber:bot Kit" 
    | "Micro Center Maker/STEM" 
    | "PiShop.us Categories" 
    | "Newark element14 Products";
}

export const DATASHEET_ENTRIES: DatasheetRow[] = [
  // ==========================================
  // DIGIKEY FILTER 721: FPGA & MPSoC SYSTEM-ON-MODULES
  // ==========================================
  {
    productName: "AMD Xilinx Kria K26 System-on-Module (FPGA / MPSoC)",
    category: "SOM / FPGA & MPSoC",
    manufacturer: "AMD Xilinx",
    coreProcessor: "Quad-Core ARM Cortex-A73/A53 (Zynq UltraScale+)",
    coProcessorOrNPU: "Dual Cortex-R5F + Mali-400 MP2 GPU + 256K System Logic Cells FPGA + 1.4 TOPS AI",
    clockSpeed: "1.5 GHz (A53) / 600 MHz (R5F)",
    ramAndFlash: "4GB DDR4 (64-bit) + 512Mb QSPI Flash + 16GB eMMC",
    connectorType: "Dual 240-pin Slim Board-to-Board (SAMTEC)",
    voltage: "5.0V DC (±5%)",
    interface: "PCIe Gen2 x4, 4x 10GbE, USB 3.0, MIPI CSI-2, SLVS-EC, 4x UART, 2x SPI, 2x I2C, CAN FD",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "High-density FPGA + heterogeneous ARM MPSoC tailored for smart camera vision, motor control & ROS2 edge robotics.",
    priceUSD: 279.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Microchip PolarFire SoC MPFS250T RISC-V FPGA Module",
    category: "SOM / FPGA & MPSoC",
    manufacturer: "Microchip Technology / Aries",
    coreProcessor: "Quad-Core 64-bit RISC-V (SiFive U54-MC) + 1x Monitor Core (E51)",
    coProcessorOrNPU: "PolarFire 254K Logic Elements Low-Power FPGA Fabric (784 Math Blocks / DSP)",
    clockSpeed: "667 MHz (RISC-V Cores)",
    ramAndFlash: "2GB LPDDR4 + 8GB eMMC Flash + 128Mb SPI Flash",
    connectorType: "3x High-Density Samtec Board-to-Board Connectors",
    voltage: "3.3V / 5.0V DC",
    interface: "PCIe Gen2, 2x GbE, USB 2.0, 2x CAN 2.0B, 2x SPI, 2x I2C, 5x UART, 136 FPGA I/Os",
    operatingTemp: "-40°C ~ +100°C (Extended Industrial)",
    specs: "Deterministic Linux-capable 64-bit multi-core RISC-V with ultra-low power non-volatile military-grade FPGA fabric.",
    priceUSD: 345.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Numato Lab NLSOMCZ7010 Zynq-7010 FPGA SOM Module",
    category: "SOM / FPGA & MPSoC",
    manufacturer: "Numato Lab",
    coreProcessor: "Dual-Core ARM Cortex-A9",
    coProcessorOrNPU: "Xilinx Artix-7 FPGA (28K Logic Cells, 80 DSP Slices)",
    clockSpeed: "667 MHz",
    ramAndFlash: "512MB DDR3 + 128Mb QSPI Flash + MicroSD Slot",
    connectorType: "2x 100-pin Hirose FX8 Board-to-Board Connectors",
    voltage: "3.3V - 5.0V DC",
    interface: "Gigabit Ethernet, USB 2.0 OTG, 84 FPGA General Purpose I/Os, SPI, I2C, UART",
    operatingTemp: "0°C ~ +70°C (Commercial)",
    specs: "Cost-effective compact Zynq SOM module for FPGA DSP algorithms, software-defined radio, and robotics vision.",
    priceUSD: 89.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA / Allied Distribution",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Terasic Cyclone V GX SOM Module (Intel Altera 5CGXFC5C6)",
    category: "SOM / FPGA & MPSoC",
    manufacturer: "Terasic Technologies",
    coreProcessor: "Hard Processor System Dual-Core ARM Cortex-A9",
    coProcessorOrNPU: "Intel Altera Cyclone V GX FPGA (77K Logic Elements, 3.125Gbps Transceivers)",
    clockSpeed: "800 MHz",
    ramAndFlash: "1GB DDR3 (HPS) + 256MB DDR3 (FPGA) + 64MB QSPI Flash + MicroSD",
    connectorType: "High-Speed Edge Connector (PCIe Edge/Header)",
    voltage: "5.0V DC input",
    interface: "PCIe Gen1 x4, GbE, USB 2.0 OTG, 2x CAN, SPI, I2C, UART, 138 User FPGA I/Os",
    operatingTemp: "-20°C ~ +70°C",
    specs: "Industrial Cyclone V SoC module for protocol translation, aerospace avionics, and high-bandwidth image capture.",
    priceUSD: 195.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Taiwan (NATO Allied)",
    sourceGroup: "DigiKey Filter 721"
  },

  // ==========================================
  // DIGIKEY FILTER 721: MICROPROCESSOR (MPU) & EMBEDDED LINUX SOMS
  // ==========================================
  {
    productName: "Raspberry Pi Compute Module 4 (CM4108032 - 8GB, 32GB eMMC, Wi-Fi)",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Raspberry Pi Ltd",
    coreProcessor: "Broadcom BCM2711 Quad-Core ARM Cortex-A72 (ARMv8 64-bit)",
    coProcessorOrNPU: "Broadcom VideoCore VI 3D GPU (OpenGL ES 3.1, Vulkan 1.2, 4Kp60 HEVC/H.265)",
    clockSpeed: "1.5 GHz",
    ramAndFlash: "8GB LPDDR4-3200 SDRAM + 32GB eMMC Flash Boot Drive",
    connectorType: "Dual 100-pin Hirose DF40 Board-to-Board Connectors (0.4mm pitch)",
    voltage: "5.0V DC supply via carrier board",
    interface: "PCIe 2.0 x1 lane, GbE (with IEEE1588), 2x HDMI 2.0 (4K60), 2x MIPI CSI-2, 2x MIPI DSI, USB 2.0, 28x GPIO",
    operatingTemp: "-20°C ~ +85°C (Extended Industrial)",
    specs: "Standard embedded compute module running full Debian/Ubuntu Linux, ROS2 Humble/Iron, and headless edge servers.",
    priceUSD: 85.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "United Kingdom (NATO Ally)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Raspberry Pi Compute Module 4 Lite (CM4004000 - 4GB RAM, Lite, Wi-Fi)",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Raspberry Pi Ltd",
    coreProcessor: "Broadcom BCM2711 Quad-Core ARM Cortex-A72",
    coProcessorOrNPU: "VideoCore VI 3D GPU + H.264/H.265 hardware video decoder",
    clockSpeed: "1.5 GHz",
    ramAndFlash: "4GB LPDDR4 SDRAM + Lite (External MicroSD / NVMe PCIe Boot)",
    connectorType: "Dual 100-pin Hirose DF40 Connectors",
    voltage: "5.0V DC",
    interface: "PCIe 2.0 x1, GbE, dual 4K HDMI, 2x MIPI CSI camera ports, 2x MIPI DSI displays, 2.4/5GHz Wi-Fi 5 & BLE",
    operatingTemp: "-20°C ~ +85°C",
    specs: "Flexible Lite model allowing NVMe SSD PCIe booting for high-throughput robotics sensor recording.",
    priceUSD: 45.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "United Kingdom (NATO Ally)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Toradex Colibri iMX6ULL SOM (512MB RAM, 4GB eMMC, Wi-Fi)",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Toradex",
    coreProcessor: "NXP i.MX 6ULL Single ARM Cortex-A7",
    coProcessorOrNPU: "NEON MPE + Hardware Cryptographic Engine (CAAM) + PXP 2D Pixel Pipeline",
    clockSpeed: "800 MHz",
    ramAndFlash: "512MB DDR3L (16-bit) + 4GB eMMC Flash + Wi-Fi 802.11ac / Bluetooth 5.0",
    connectorType: "200-pin SODIMM Edge Connector (Colibri Standard)",
    voltage: "3.3V DC power input",
    interface: "10/100 Mbit Ethernet PHY, USB 2.0 OTG + Host, 2x CAN 2.0B, 4x I2C, 4x SPI, 8x UART, RGB LCD 24-bit",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Ultra low power (<1W) Linux SOM module for battery-powered autonomous rovers, field telemetry, and remote PLCs.",
    priceUSD: 52.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Switzerland / USA (Allied)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Digi International ConnectCore 8M Mini SOM Module",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Digi International",
    coreProcessor: "NXP i.MX 8M Mini Quad-Core ARM Cortex-A53 (64-bit)",
    coProcessorOrNPU: "Dedicated Real-Time ARM Cortex-M4 @ 400MHz + GCNanoUltra 3D GPU + Digi TrustFence Crypto",
    clockSpeed: "1.6 GHz (Cortex-A53) / 400 MHz (Cortex-M4)",
    ramAndFlash: "2GB LPDDR4 + 8GB eMMC Flash + Dual-Band 802.11ac Wi-Fi & BLE 5.0",
    connectorType: "LGA 245-Pad Surface Mount (Stamp-Hole LGA Form Factor)",
    voltage: "3.3V - 5.0V DC",
    interface: "Gigabit Ethernet MAC, PCIe 2.0, USB 2.0 OTG, MIPI CSI-2 camera, MIPI DSI, 3x SAI Audio, 4x I2C, 3x SPI, 4x UART",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Surface-mount industrial compute core with hardware security, multi-OS support (Linux on A53 + FreeRTOS on M4).",
    priceUSD: 98.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Microchip ATSAMA5D27-SOM1 System-on-Module",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Microchip Technology",
    coreProcessor: "ARM Cortex-A5 32-bit MPU with NEON & VFPv4",
    coProcessorOrNPU: "ATECC508A Cryptographic Hardware Co-Processor + 2D Graphics Controller",
    clockSpeed: "500 MHz",
    ramAndFlash: "128MB DDR2 SDRAM (SiP) + 64MB QSPI Flash + 2Kb EEPROM (MAC Address)",
    connectorType: "Dual Castellated & Solder Pads (Edge Soldered)",
    voltage: "3.3V DC single rail",
    interface: "10/100 Ethernet PHY (KSZ8081), 2x CAN-FD, USB 2.0 Host/Device, 2x SDIO, 7x UART, 2x SPI, 3x TWI/I2C, 12-bit ADC",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Pre-certified secure industrial Linux SOM running Mainline Linux Kernel 5.x / Yocto Project with tamper detection.",
    priceUSD: 45.50,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "BeagleBoard BeagleCore BCM1 Industrial SOM Module",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "BeagleBoard.org",
    coreProcessor: "Texas Instruments Sitara AM3358 ARM Cortex-A8",
    coProcessorOrNPU: "Dual 32-bit 200MHz PRU (Programmable Real-Time Units) Coprocessors + PowerVR SGX530 3D GPU",
    clockSpeed: "1.0 GHz",
    ramAndFlash: "512MB DDR3 RAM + 4GB 8-bit eMMC Onboard Storage",
    connectorType: "LGA Solder-Down Pins (Castellated Surface Mount)",
    voltage: "3.3V / 5.0V DC",
    interface: "10/100 Ethernet MII, USB 2.0 Client/Host, 2x CAN 2.0B, 2x I2C, 2x SPI, 6x UART, 8-ch 12-bit ADC, 65x GPIO",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Industrial BeagleBone Black in tiny module format. Dual PRU units enable sub-microsecond motor step-pulse generation.",
    priceUSD: 69.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA / Germany (NATO Ally)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Variscite DART-MX8M-PLUS System-on-Module",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Variscite",
    coreProcessor: "NXP i.MX 8M Plus Quad-Core ARM Cortex-A53",
    coProcessorOrNPU: "Dedicated 2.3 TOPS Neural Processing Unit (NPU) + 800MHz Cortex-M7 Realtime Core + Dual ISP (2x 1080p60)",
    clockSpeed: "1.8 GHz (A53) / 800 MHz (M7)",
    ramAndFlash: "4GB LPDDR4 + 32GB eMMC Flash + Dual-Band Wi-Fi 6 & Bluetooth 5.3",
    connectorType: "3x 90-pin High-Density Hirose DF40 Board-to-Board",
    voltage: "3.3V - 4.5V DC",
    interface: "PCIe Gen3, 2x GbE (with TSN), 2x USB 3.0, 2x MIPI CSI-2 camera with dual ISP, 2x CAN FD, HDMI 2.0a, LVDS",
    operatingTemp: "-40°C ~ +85°C (Full Industrial)",
    specs: "Industrial vision & machine learning SOM combining 2.3 TOPS NPU, dual image signal processors, and TSN deterministic Ethernet.",
    priceUSD: 125.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Israel / USA (NATO Allied)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "PHYTEC phyCORE-AM62x System-on-Module",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "PHYTEC",
    coreProcessor: "Texas Instruments Sitara AM6254 Quad-Core ARM Cortex-A53",
    coProcessorOrNPU: "Dedicated ARM Cortex-M4F @ 400MHz + Single-Core PRU-SS + PowerVR Rogue 3D GPU",
    clockSpeed: "1.4 GHz",
    ramAndFlash: "2GB LPDDR4 + 8GB eMMC Flash + 64MB OSPI NOR Flash",
    connectorType: "Ultra-Flat Direct Solder SMT (BGA Form Factor)",
    voltage: "3.3V DC input",
    interface: "2x GbE (RGMII), USB 2.0 Dual-Role, 3x CAN-FD, 3x SPI, 3x I2C, 9x UART, MIPI CSI-2, LVDS display",
    operatingTemp: "-40°C ~ +105°C (Automotive / Harsh Industrial)",
    specs: "Next-gen low-power TI AM62x Linux SOM with deep power-down modes (<5mW) and automotive-grade temperature tolerance.",
    priceUSD: 72.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Germany / USA (NATO Ally)",
    sourceGroup: "DigiKey Filter 721"
  },

  // ==========================================
  // DIGIKEY FILTER 721: AI VISION & NEURAL ROBOTICS ACCELERATORS
  // ==========================================
  {
    productName: "NVIDIA Jetson Orin Nano Developer SOM Module (8GB)",
    category: "SOM / AI Accelerator & Vision",
    manufacturer: "NVIDIA Corporation",
    coreProcessor: "6-Core ARM Cortex-A78AE v8.2 64-bit CPU",
    coProcessorOrNPU: "1024-Core NVIDIA Ampere Architecture GPU with 32 Tensor Cores (40 TOPS INT8 Compute)",
    clockSpeed: "1.5 GHz (CPU) / 625 MHz (GPU)",
    ramAndFlash: "8GB 128-bit LPDDR5 (68 GB/s bandwidth) + External NVMe / QSPI boot",
    connectorType: "260-pin SO-DIMM Edge Connector",
    voltage: "5.0V - 20.0V DC (7W to 15W configurable power envelope)",
    interface: "PCIe Gen3 x4/x2/x1, 3x USB 3.2 Gen2, Gigabit Ethernet, 4x MIPI CSI-2 (2-lane/4-lane), 3x UART, 2x SPI, 3x I2C, CAN bus",
    operatingTemp: "-25°C ~ +80°C",
    specs: "Entry supercomputer SOM for edge AI robotics, running real-time YOLOv8, Isaac ROS perception, SLAM, and depth neural nets.",
    priceUSD: 249.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA / Taiwan (NATO / Allied)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "NVIDIA Jetson Orin NX 16GB SOM Module",
    category: "SOM / AI Accelerator & Vision",
    manufacturer: "NVIDIA Corporation",
    coreProcessor: "8-Core ARM Cortex-A78AE v8.2 64-bit CPU",
    coProcessorOrNPU: "1024-Core Ampere GPU + 32 Tensor Cores + 2x NVDLA v2 Deep Learning Engines (100 TOPS INT8 AI)",
    clockSpeed: "2.0 GHz (CPU) / 918 MHz (GPU)",
    ramAndFlash: "16GB 128-bit LPDDR5 (102.4 GB/s memory bandwidth) + NVMe boot",
    connectorType: "260-pin SO-DIMM Connector",
    voltage: "5.0V - 20.0V DC (10W to 25W configurable)",
    interface: "PCIe Gen4 x4/x2/x1, 10GbE / 1GbE, 3x USB 3.2, 4x MIPI CSI-2 (up to 8 cameras), 3x UART, 2x SPI, 3x I2C, CAN FD",
    operatingTemp: "-25°C ~ +85°C",
    specs: "Top-tier compact AI supercomputer SOM delivering 100 TOPS for multi-camera 3D obstacle avoidance and autonomous driving.",
    priceUSD: 599.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA / Taiwan (NATO / Allied)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "NVIDIA Jetson AGX Orin Industrial SOM Module (64GB)",
    category: "SOM / AI Accelerator & Vision",
    manufacturer: "NVIDIA Corporation",
    coreProcessor: "12-Core ARM Cortex-A78AE v8.2 CPU",
    coProcessorOrNPU: "2048-Core Ampere GPU + 64 Tensor Cores + 2x NVDLA v2 Engines (275 TOPS AI @ 75W)",
    clockSpeed: "2.2 GHz (CPU) / 1.3 GHz (GPU)",
    ramAndFlash: "64GB 256-bit LPDDR5 (204.8 GB/s) + 64GB eMMC 5.1",
    connectorType: "699-pin Board-to-Board Connector",
    voltage: "7V - 20V DC (15W - 75W configurable)",
    interface: "PCIe Gen4 x8/x4, 2x 10GbE, 4x USB 3.2, 16x MIPI CSI-2 camera lanes, 4x UART, 3x SPI, 4x I2C, 2x CAN FD",
    operatingTemp: "-40°C ~ +85°C (Rugged Industrial)",
    specs: "Heavy-duty 275 TOPS AI compute module with functional safety (SIL 3) for heavy autonomous industrial machinery and defense.",
    priceUSD: 1999.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA / Taiwan (NATO / Allied)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Google Coral Edge TPU System-on-Module (SoM)",
    category: "SOM / AI Accelerator & Vision",
    manufacturer: "Google / ASUS",
    coreProcessor: "NXP i.MX 8M SoC (Quad ARM Cortex-A53 + Cortex-M4F)",
    coProcessorOrNPU: "Google Edge TPU ASIC Coprocessor (4 TOPS @ 0.5W/TOPS, 2 TOPS/W efficiency)",
    clockSpeed: "1.5 GHz (A53) / 266 MHz (M4)",
    ramAndFlash: "2GB LPDDR4 + 8GB eMMC Flash + Wi-Fi 5 & Bluetooth 4.2",
    connectorType: "3x 100-pin Board-to-Board Hirose Connectors",
    voltage: "5.0V DC (±5%)",
    interface: "Gigabit Ethernet, USB 3.0 OTG, HDMI 2.0a, MIPI DSI, MIPI CSI-2, 2x SPI, 3x I2C, 4x UART, SAI Audio",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Fully integrated Linux SOM with onboard Google Edge TPU running TensorFlow Lite inferencing at 400+ FPS MobileNet.",
    priceUSD: 114.99,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Hailo-8 M.2 AI Acceleration Module (26 TOPS)",
    category: "SOM / AI Accelerator & Vision",
    manufacturer: "Hailo Technologies",
    coreProcessor: "Hailo-8 Neural Network Core Architecture",
    coProcessorOrNPU: "Structure-Defined Dataflow Neural Network Architecture (26 TOPS @ 2.5W typical power)",
    clockSpeed: "Scalable Dataflow Clock",
    ramAndFlash: "Integrated High-Bandwidth On-Chip SRAM (No external DRAM latency)",
    connectorType: "M.2 Key M 2280 / Key B+M 2242 Form Factor",
    voltage: "3.3V DC (M.2 rail)",
    interface: "PCIe Gen3 x4 / x2 lanes",
    operatingTemp: "-40°C ~ +85°C (Industrial Grade)",
    specs: "Compact 26 TOPS AI neural accelerator module pluggable into Raspberry Pi CM4 carrier, Jetson, or industrial x86/ARM SOMs.",
    priceUSD: 189.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Israel / USA (NATO Allied)",
    sourceGroup: "DigiKey Filter 721"
  },

  // ==========================================
  // DIGIKEY FILTER 721: REAL-TIME MICROCONTROLLER (MCU) SOM BOARDS
  // ==========================================
  {
    productName: "Teensy 4.1 SOM Microcontroller Board (NXP i.MX RT1062)",
    category: "SOM / Microcontroller Board",
    manufacturer: "PJRC",
    coreProcessor: "NXP i.MX RT1062 ARM Cortex-M7 with Double-Precision FPU",
    coProcessorOrNPU: "Dedicated Hardware Pixel Processing Pipeline (PXP) + Dual 32-bit Cryptographic Acceleration Units",
    clockSpeed: "600 MHz (Up to 1.0 GHz Overclockable)",
    ramAndFlash: "1024KB RAM (512KB Tightly Coupled TCM @ 600MHz) + 8MB Flash + MicroSD Socket + Footprint for 16MB PSRAM",
    connectorType: "DIP 48-Pin 0.1\" Breadboard Format / SMT Castellated Edge Pads",
    voltage: "3.3V Logic (5V tolerant power input regulator onboard)",
    interface: "10/100 Mbit Ethernet PHY, USB 2.0 High-Speed Host (480Mbps), 3x CAN Bus (1x CAN FD), 8x Serial UART, 3x SPI, 3x I2C, 35x PWM, 18x Analog ADC",
    operatingTemp: "-40°C ~ +85°C (Industrial Chipset)",
    specs: "World's fastest real-time microcontroller module for multi-axis inverse kinematics, field-oriented motor control (FOC), and dual audio DSP.",
    priceUSD: 32.50,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Teensy 4.0 Ultra-Compact SOM Board (NXP i.MX RT1062)",
    category: "SOM / Microcontroller Board",
    manufacturer: "PJRC",
    coreProcessor: "NXP i.MX RT1062 ARM Cortex-M7",
    coProcessorOrNPU: "Hardware Floating Point (VFPv5) + 32-ch DMA Engine",
    clockSpeed: "600 MHz",
    ramAndFlash: "1024KB RAM (512KB TCM) + 2MB Flash",
    connectorType: "DIP 28-Pin 0.1\" Header / Bottom SMT Pads",
    voltage: "3.3V Logic (3.6V - 6.0V power input)",
    interface: "USB High-Speed 480Mbps, 3x CAN bus, 7x UART, 3x SPI, 3x I2C, 31x PWM, 14x Analog Inputs, 2x I2S Digital Audio",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Miniaturized 1.4 x 0.7 inch real-time compute board delivering 600MHz raw ARM Cortex-M7 processing power.",
    priceUSD: 23.80,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Espressif ESP32-S3-WROOM-1-N16R8 SOM Module",
    category: "SOM / Microcontroller Board",
    manufacturer: "Espressif Systems",
    coreProcessor: "Xtensa 32-bit LX7 Dual-Core Processor with Vector Instructions (SIMD/NN)",
    coProcessorOrNPU: "Ultra-Low Power (ULP) RISC-V Coprocessor + Hardware Vector Accelerators for Neural Networks",
    clockSpeed: "240 MHz",
    ramAndFlash: "512KB SRAM + 384KB ROM + 8MB Octal PSRAM + 16MB Quad SPI Flash",
    connectorType: "Surface Mount Castellated Pads (SMD Stamp Module)",
    voltage: "3.0V - 3.6V DC",
    interface: "2.4 GHz Wi-Fi (802.11 b/g/n) + Bluetooth 5.0 LE / Mesh, 45x GPIO, 8-bit/16-bit DVP Camera, RGB LCD, SPI, I2C, I2S, UART, TWAI (CAN 2.0B)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Modern wireless dual-core MCU module optimized for offline voice recognition, wake-word detection, and camera streaming.",
    priceUSD: 4.20,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Fabless / Global Distribution",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Espressif ESP32-C6-WROOM-1 SOM Module (Wi-Fi 6 + Zigbee/Thread)",
    category: "SOM / Microcontroller Board",
    manufacturer: "Espressif Systems",
    coreProcessor: "32-bit High-Performance RISC-V Single-Core (RV32IMC)",
    coProcessorOrNPU: "Low-Power 32-bit RISC-V Core (20MHz) + Hardware Security (RSA-3072, ECC, AES-128/256)",
    clockSpeed: "160 MHz",
    ramAndFlash: "512KB HP SRAM + 16KB LP SRAM + 8MB Quad SPI Flash",
    connectorType: "Surface Mount Castellated SMT Pads",
    voltage: "3.0V - 3.6V DC",
    interface: "Wi-Fi 6 (802.11ax 2.4GHz) + Bluetooth 5 (LE) + IEEE 802.15.4 (Zigbee 3.0 & Thread / Matter Protocol), 30x GPIO, SPI, I2C, UART, SDIO, RMT",
    operatingTemp: "-40°C ~ +105°C (Extended Industrial)",
    specs: "Next-gen RISC-V Matter/Thread IoT SOM for home automation mesh robotics and low-latency Wi-Fi 6 telemetry.",
    priceUSD: 3.50,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Fabless / Global Distribution",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "STMicroelectronics STM32H743ZI Nucleo / Core Module",
    category: "SOM / Microcontroller Board",
    manufacturer: "STMicroelectronics",
    coreProcessor: "ARM 32-bit Cortex-M7 with Double-Precision FPU & L1 Cache (16KB I/D)",
    coProcessorOrNPU: "Chrom-ART 2D Graphics Accelerator + Hardware JPEG Codec + 32-ch DMA",
    clockSpeed: "480 MHz",
    ramAndFlash: "2MB Dual-Bank Flash + 1MB RAM (192KB TCM, 864KB SRAM, 4KB Backup)",
    connectorType: "ST Morpho Extension Headers & Arduino Uno V3 Pinout",
    voltage: "3.3V Logic (5V tolerant I/O)",
    interface: "10/100 Ethernet MAC with IEEE1588, USB 2.0 High-Speed OTG, 4x I2C, 6x SPI, 4x USART, 4x UART, 2x FDCAN, 3x 16-bit ADCs (3.6 MSPS), 2x DAC",
    operatingTemp: "-40°C ~ +85°C",
    specs: "High-end industrial ARM Cortex-M7 core module for precision drone flight controllers, CNC interpolation, and high-rate data logging.",
    priceUSD: 28.90,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "France / Italy / USA (NATO Ally)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Nordic Semiconductor nRF5340 Dual-Core BLE 5.3 SOM Module",
    category: "SOM / Microcontroller Board",
    manufacturer: "Nordic Semiconductor / Fanstel",
    coreProcessor: "Dual-Core ARM Cortex-M33 (128MHz Application Core with FPU + 64MHz Network Core)",
    coProcessorOrNPU: "ARM TrustZone Security + Hardware Cryptocell-312 + Audio Direction Finding (AoA/AoD)",
    clockSpeed: "128 MHz (App Core) / 64 MHz (Net Core)",
    ramAndFlash: "1MB Flash + 512KB RAM (App) | 256KB Flash + 64KB RAM (Network)",
    connectorType: "Castellated SMT Pads (LGA Module)",
    voltage: "1.7V - 5.5V DC (Wide Supply)",
    interface: "Bluetooth 5.3, Bluetooth LE Audio, Bluetooth Mesh, Thread, Zigbee, NFC-A, Full-Speed USB, QSPI, 4x SPI, 4x I2C, 4x UART, 48x GPIO",
    operatingTemp: "-40°C ~ +105°C (Extended Industrial)",
    specs: "High-end dual-core Bluetooth LE Audio & multiprotocol IoT module capable of running complex local sensor fusion while handling RF stack.",
    priceUSD: 12.50,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "Norway / USA (NATO Ally)",
    sourceGroup: "DigiKey Filter 721"
  },

  // ==========================================
  // DIGIKEY FILTER 721: INDUSTRIAL IOT & WIRELESS SOMS
  // ==========================================
  {
    productName: "Particle Boron LTE CAT-M1 / NB-IoT + BLE Cellular SOM",
    category: "SOM / Industrial IoT & Wireless",
    manufacturer: "Particle Industries",
    coreProcessor: "Nordic Semiconductor nRF52840 ARM Cortex-M4F @ 64MHz",
    coProcessorOrNPU: "Quectel BG96 Worldwide LTE Cat-M1 / NB-IoT + 2G Fallback Cellular Modem",
    clockSpeed: "64 MHz",
    ramAndFlash: "1MB Flash + 256KB RAM + 4MB External SPI Flash",
    connectorType: "28-pin Feather Form Factor / SMT Headers",
    voltage: "3.3V Logic / 3.7V LiPo Battery or USB (3.6V - 4.3V)",
    interface: "Cellular LTE Cat-M1/NB-IoT, Bluetooth 5, NFC, 20x Mixed-Signal GPIO, 6x ADC, SPI, I2C, UART, PWM",
    operatingTemp: "-20°C ~ +60°C",
    specs: "Turnkey cellular IoT module with global cloud connection and device management for remote robotic rovers and environmental buoys.",
    priceUSD: 69.00,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Particle Photon 2 Wi-Fi 6 + BLE 5 IoT Module",
    category: "SOM / Industrial IoT & Wireless",
    manufacturer: "Particle Industries",
    coreProcessor: "Realtek RTL872x Dual-Core (ARM Cortex-M33 @ 200MHz + Cortex-M23 @ 20MHz)",
    coProcessorOrNPU: "Hardware TrustZone + AES/SHA Crypto Engine",
    clockSpeed: "200 MHz",
    ramAndFlash: "3MB SRAM + 8MB Flash (2MB app + 6MB OTA storage)",
    connectorType: "28-pin Feather Standard / SMD",
    voltage: "3.3V Logic (5V tolerant Vin)",
    interface: "Dual-band 2.4GHz/5GHz Wi-Fi 6 (802.11ax/b/g/n) + BLE 5.0, 20x GPIO, 6x Analog ADC, SPI, I2C, UART, PWM",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Next-gen dual-band Wi-Fi 6 + Bluetooth 5 IoT development board with secure over-the-air firmware updates.",
    priceUSD: 19.50,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },
  {
    productName: "Digi XBee 3 Zigbee 3.0 / 802.15.4 RF Module",
    category: "SOM / Industrial IoT & Wireless",
    manufacturer: "Digi International",
    coreProcessor: "Silicon Labs EFR32MG ARM Cortex-M4 with MicroPython",
    coProcessorOrNPU: "Integrated RF Transceiver + AES-256 Security Engine",
    clockSpeed: "40 MHz",
    ramAndFlash: "1MB Flash + 32KB RAM (Supports programmable MicroPython scripts onboard)",
    connectorType: "20-pin Through-Hole (TH) / Surface Mount (SMT) / MMT",
    voltage: "2.1V - 3.6V DC",
    interface: "Zigbee 3.0 Mesh (2.4GHz, 13dBm output, up to 2 miles line-of-sight range), UART, SPI, 15x GPIO, 4x 10-bit ADC",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Industrial RF module for long-range multi-node swarm robotics and autonomous field mesh networks.",
    priceUSD: 24.50,
    url: "https://www.digikey.com/en/products/filter/microcontroller-microprocessor-fpga-som-modules/721",
    origin: "USA (Domestic NATO)",
    sourceGroup: "DigiKey Filter 721"
  },

  // ==========================================
  // ADAFRUIT CATEGORY 57: BREAKOUT SENSORS & STEMMA QT
  // ==========================================
  {
    productName: "Adafruit Sensirion SHT45 Precision Temp & Humidity Breakout",
    category: "Sensor",
    manufacturer: "Adafruit / Sensirion",
    coreProcessor: "Sensirion SHT4x 4th-Gen CMOSens ASIC",
    coProcessorOrNPU: "On-chip Integrated High-Accuracy Analog Front-End & Heaters",
    clockSpeed: "Up to 1.0 MHz (I2C Fast Mode Plus)",
    ramAndFlash: "Internal Calibration Register Array (NIST Traceable)",
    connectorType: "STEMMA QT / Qwiic 4-pin JST SH 1.0mm + 0.1\" Header",
    voltage: "3.3V - 5V DC (Onboard 3.3V LDO regulator)",
    interface: "I2C (STEMMA QT / Qwiic compatible)",
    operatingTemp: "-40°C ~ +125°C",
    specs: "Best-in-class ±1.0% RH relative humidity accuracy and ±0.1°C temperature accuracy with integrated condensation heater.",
    priceUSD: 14.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Switzerland / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit Sensirion SHT40 Temperature & Humidity Breakout",
    category: "Sensor",
    manufacturer: "Adafruit / Sensirion",
    coreProcessor: "Sensirion CMOSens SHT40 ASIC",
    coProcessorOrNPU: "Internal Signal Conditioning & Calibration Engine",
    clockSpeed: "Up to 1.0 MHz (I2C)",
    ramAndFlash: "Internal EEPROM Calibration",
    connectorType: "STEMMA QT / Qwiic 4-pin JST SH + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT)",
    operatingTemp: "-40°C ~ +125°C",
    specs: "±1.8% RH accuracy, ±0.2°C temperature accuracy, ultra-low power consumption (0.4uA avg).",
    priceUSD: 5.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Switzerland / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit Bosch BME280 Temp, Humidity & Pressure Sensor",
    category: "Sensor",
    manufacturer: "Adafruit / Bosch Sensortec",
    coreProcessor: "Bosch Sensortec BME280 MEMS Sensor Engine",
    coProcessorOrNPU: "Built-in IIR Filter & Factory Calibration Trims",
    clockSpeed: "Up to 3.4 MHz (I2C) / 10 MHz (SPI)",
    ramAndFlash: "On-chip Calibration Trims",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C / SPI (STEMMA QT / Qwiic)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Barometric Pressure: 300 to 1100 hPa (±1 hPa, ±1m altitude resolution), Temp: -40 to 85°C (±1°C), Humidity: 0-100% (±3%).",
    priceUSD: 19.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Germany / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit Bosch BME688 AI Gas, Pressure, Humidity & Temp",
    category: "Sensor",
    manufacturer: "Adafruit / Bosch Sensortec",
    coreProcessor: "Bosch BME688 4-in-1 MEMS Sensor with MOX Gas Scanner",
    coProcessorOrNPU: "BSEC 2.0 AI Software trained Gas Scanner Model",
    clockSpeed: "Up to 3.4 MHz (I2C) / 10 MHz (SPI)",
    ramAndFlash: "Embedded Heater Profile Registers",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C / SPI (STEMMA QT)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Gas scanner with AI Studio training to identify volatile sulfur compounds (VSC), breath VOCs, hydrogen sulfide, and barometric altitude.",
    priceUSD: 19.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Germany / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit 9-DOF Orientation IMU Fusion Breakout - BNO085",
    category: "Sensor",
    manufacturer: "Adafruit / CEVA Hillcrest Labs",
    coreProcessor: "CEVA SH-2 Sensor Hub + 3-Axis Accel / Gyro / Magnetometer",
    coProcessorOrNPU: "On-Chip 32-bit ARM Cortex-M0+ Sensor Fusion Coprocessor",
    clockSpeed: "Up to 400 kHz (I2C) / 3 MHz (SPI) / 3Mbps (UART-RVC)",
    ramAndFlash: "Internal Calibration Storage & Step Counter RAM",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C, SPI, UART, UART-RVC (Robot Vacuum Mode)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Outputs drift-corrected 3D Quaternions, Rotation Vectors, Game Vectors, Linear Acceleration, and Activity Classifiers at up to 400Hz.",
    priceUSD: 19.95,
    url: "https://www.adafruit.com/category/57",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit 9-DOF Absolute Orientation IMU - BNO055",
    category: "Sensor",
    manufacturer: "Adafruit / Bosch Sensortec",
    coreProcessor: "Bosch Sensortec BNO055 Smart Sensor Fusion Hub",
    coProcessorOrNPU: "Internal 32-bit ARM Cortex-M0 Core Running Bosch BSX3.0 Fusion",
    clockSpeed: "Up to 400 kHz (I2C) / 115200 Baud (UART)",
    ramAndFlash: "Internal Factory Calibration Register",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C / UART (STEMMA QT)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Outputs absolute orientation (Euler angles, Quaternions, Gravity Vector) with zero host CPU load at 100Hz output rate.",
    priceUSD: 29.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Germany / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit VL53L4CX Time of Flight Distance Sensor (6m)",
    category: "Sensor",
    manufacturer: "Adafruit / STMicroelectronics",
    coreProcessor: "ST FlightSense SPAD Optical ToF Sensor",
    coProcessorOrNPU: "ST Microcontroller Processing Multizone Histograms",
    clockSpeed: "Up to 1.0 MHz (I2C Fast Mode Plus)",
    ramAndFlash: "Firmware Algorithm Registers",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-20°C ~ +85°C",
    specs: "940nm invisible VCSEL laser emitter with multizone SPAD array, ranging distances from 1mm up to 6000mm (6m) with 18° FOV.",
    priceUSD: 14.95,
    url: "https://www.adafruit.com/category/57",
    origin: "France / Italy / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit VL53L1X Time of Flight Long Range Distance Sensor (4m)",
    category: "Sensor",
    manufacturer: "Adafruit / STMicroelectronics",
    coreProcessor: "ST FlightSense VL53L1X SPAD Array",
    coProcessorOrNPU: "On-chip Signal Processing Histogram",
    clockSpeed: "Up to 400 kHz (I2C)",
    ramAndFlash: "Configurable Region of Interest (ROI) Register",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-20°C ~ +85°C",
    specs: "Accurate optical distance measurement up to 4000mm (4m), up to 50Hz ranging frequency, programmable field-of-view from 15° to 27°.",
    priceUSD: 14.95,
    url: "https://www.adafruit.com/category/57",
    origin: "France / Italy / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit VL53L4CD Time of Flight Short Range Sensor (1.3m)",
    category: "Sensor",
    manufacturer: "Adafruit / STMicroelectronics",
    coreProcessor: "ST FlightSense VL53L4CD High-Speed Engine",
    coProcessorOrNPU: "Autonomous High-Speed Ranging Engine",
    clockSpeed: "Up to 1.0 MHz (I2C)",
    ramAndFlash: "Autonomous Threshold Interrupt Registers",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-30°C ~ +85°C",
    specs: "High speed up to 100Hz ranging rate, 1mm to 1300mm range, low power consumption, immune to target color and surface reflectance.",
    priceUSD: 9.95,
    url: "https://www.adafruit.com/category/57",
    origin: "France / Italy / USA (NATO Ally)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit AS7341 10-Channel Spectral Light / Color Sensor",
    category: "Sensor",
    manufacturer: "Adafruit / ams OSRAM",
    coreProcessor: "ams OSRAM AS7341 Spectral Engine",
    coProcessorOrNPU: "Integrated 16-bit 6-Channel Concurrent ADC",
    clockSpeed: "Up to 400 kHz (I2C)",
    ramAndFlash: "Internal Spectral Gain Calibration Registers",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-30°C ~ +70°C",
    specs: "8 optical channels across visible spectrum (415nm, 445nm, 480nm, 515nm, 555nm, 590nm, 630nm, 680nm) + 1 Clear + 1 Near-IR (NIR).",
    priceUSD: 15.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Austria / USA (EU / Allied)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit APDS9960 Digital Proximity, Light, RGB & Gesture",
    category: "Sensor",
    manufacturer: "Adafruit / Broadcom",
    coreProcessor: "Broadcom APDS-9960 Optical Hub",
    coProcessorOrNPU: "4-Directional IR Photodiode Matrix & State Machine",
    clockSpeed: "Up to 400 kHz (I2C)",
    ramAndFlash: "32-byte Gesture FIFO Buffer",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-30°C ~ +85°C",
    specs: "Touchless 4-way gesture recognition (Up/Down/Left/Right), ambient RGB color lux sensing, and 100mm proximity detection.",
    priceUSD: 7.50,
    url: "https://www.adafruit.com/category/57",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit AS5600 Magnetic Rotary Angle Encoder Breakout",
    category: "Sensor",
    manufacturer: "Adafruit / ams OSRAM",
    coreProcessor: "ams OSRAM AS5600 Hall Element Array",
    coProcessorOrNPU: "12-bit On-chip CORDIC Absolute Angle Calculator",
    clockSpeed: "Up to 1.0 MHz (I2C)",
    ramAndFlash: "Programmable Non-Volatile OTP Zero-Position",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C / Analog Voltage / PWM output",
    operatingTemp: "-40°C ~ +125°C (Automotive Qualified)",
    specs: "12-bit resolution 360° frictionless contactless magnetic position sensing with 4096 positions per revolution.",
    priceUSD: 5.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Austria / USA (EU / Allied)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit I2S MEMS Microphone Breakout (SPH0645LM4H)",
    category: "Sensor",
    manufacturer: "Adafruit / Knowles",
    coreProcessor: "Knowles SPH0645LM4H MEMS Acoustic Diaphragm",
    coProcessorOrNPU: "Integrated 24-bit I2S Digital Audio Converter",
    clockSpeed: "1.024 MHz to 4.096 MHz (I2S Bit Clock)",
    ramAndFlash: "Direct Streaming I2S (No Buffer)",
    connectorType: "0.1\" Breadboard Header",
    voltage: "3.3V DC (Direct 3.3V logic)",
    interface: "I2S Digital Audio (BCLK, WSEL, DOUT)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "50Hz to 15KHz frequency response, digital I2S 24-bit audio data output, low noise floor SNR 65dB, omnidirectional reception.",
    priceUSD: 6.95,
    url: "https://www.adafruit.com/category/57",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit AMG8833 Grid-EYE 8x8 IR Thermal Camera Breakout",
    category: "Sensor",
    manufacturer: "Adafruit / Panasonic",
    coreProcessor: "Panasonic Grid-EYE Thermopile Array",
    coProcessorOrNPU: "Built-in Thermistor & 12-bit ADC Engine",
    clockSpeed: "Up to 400 kHz (I2C)",
    ramAndFlash: "64-pixel Thermal Register Buffer",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "3.3V - 5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-20°C ~ +80°C",
    specs: "8x8 (64 pixel) infrared thermal grid imaging, temperature detection from 0°C to 80°C (±2.5°C), 10Hz frame rate, 7m human detection range.",
    priceUSD: 44.95,
    url: "https://www.adafruit.com/category/57",
    origin: "Japan / USA (Allied)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit INA219 High Side DC Current & Power Sensor",
    category: "Sensor",
    manufacturer: "Adafruit / Texas Instruments",
    coreProcessor: "Texas Instruments INA219 Bi-directional Monitor",
    coProcessorOrNPU: "Internal Multiplier for Direct Wattage Calculation",
    clockSpeed: "Up to 2.56 MHz (I2C)",
    ramAndFlash: "Calibration & Power Configuration Registers",
    connectorType: "STEMMA QT / Qwiic 4-pin + Screw Terminal",
    voltage: "3.3V - 5V DC (Monitors 0V to +26V bus)",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-40°C ~ +125°C",
    specs: "Measures high-side DC bus voltage up to +26VDC, max ±3.2A continuous current with 0.8mA resolution, precision 0.1 ohm 1% shunt.",
    priceUSD: 9.95,
    url: "https://www.adafruit.com/category/57",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Adafruit Category 57"
  },
  {
    productName: "Adafruit MCP9808 High Accuracy I2C Temperature Sensor",
    category: "Sensor",
    manufacturer: "Adafruit / Microchip Technology",
    coreProcessor: "Microchip MCP9808 Digital Temperature Sensor",
    coProcessorOrNPU: "User-programmable Alert Window Comparators",
    clockSpeed: "Up to 400 kHz (I2C)",
    ramAndFlash: "Critical Temperature Trip Point Registers",
    connectorType: "STEMMA QT / Qwiic 4-pin + 0.1\" Header",
    voltage: "2.7V - 5.5V DC",
    interface: "I2C (STEMMA QT / Qwiic)",
    operatingTemp: "-40°C ~ +125°C",
    specs: "±0.25°C typical accuracy from -40°C to +125°C with selectable 0.0625°C resolution and active-low interrupt alert pin.",
    priceUSD: 4.95,
    url: "https://www.adafruit.com/category/57",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Adafruit Category 57"
  },

  // ==========================================
  // PARALLAX CYBER:BOT ROBOT KIT & COMPONENTS
  // ==========================================
  {
    productName: "Parallax Cyber:bot Robot Kit with micro:bit (Full Robotics Platform)",
    category: "Robot Kit / Platform",
    manufacturer: "Parallax Inc.",
    coreProcessor: "BBC micro:bit (Nordic nRF52833 ARM Cortex-M4 @ 64MHz)",
    coProcessorOrNPU: "Parallax P8X32A Propeller 8-Cog Multicore Real-Time Coprocessor",
    clockSpeed: "64 MHz (nRF52833) + 80 MHz (Propeller)",
    ramAndFlash: "512KB Flash + 128KB RAM (micro:bit) + 32KB Hub RAM (Propeller)",
    connectorType: "micro:bit 80-pin Edge Connector + 8x 3-Pin Servo Headers + 400-Point Breadboard",
    voltage: "6.0V - 9.0V DC (5x AA pack) / 3.3V & 5V regulated rails",
    interface: "I2C, SPI, UART, 2.4GHz micro:bit Radio / BLE 5.0, 8-Channel PWM, Breadboard I/O",
    operatingTemp: "-10°C ~ +60°C",
    specs: "Complete STEM & Cyber-security robotics mobile platform. micro:bit runs Python high-level logic while Propeller coprocessor handles real-time PID motor feedback.",
    priceUSD: 229.00,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax BBC micro:bit v2 Module (Cyber:bot Controller)",
    category: "Controller / Module",
    manufacturer: "BBC / micro:bit Educational Foundation",
    coreProcessor: "Nordic Semiconductor nRF52833 ARM Cortex-M4 with FPU",
    coProcessorOrNPU: "NXP KL27Z Interface MCU + Dedicated 2.4GHz Radio",
    clockSpeed: "64 MHz",
    ramAndFlash: "512KB Flash + 128KB SRAM",
    connectorType: "25-pin Edge Connector (5 Large Rings, 20 Micro Pins)",
    voltage: "3.3V DC (Edge Connector / Battery / Micro-USB)",
    interface: "2.4GHz micro:bit Radio / Bluetooth 5.0 LE, I2C, SPI, UART, 5x5 LED Matrix, Capacitive Touch Logo, MEMS Mic",
    operatingTemp: "0°C ~ +50°C",
    specs: "Classroom and mobile robot brain with onboard 5x5 red LED display, MEMS microphone, speaker, accelerometer, magnetometer, and 2 pushbuttons.",
    priceUSD: 21.00,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "United Kingdom (NATO Ally)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax cyber:bot Board with Propeller Multicore Coprocessor",
    category: "Controller Carrier / Co-Processor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "Parallax P8X32A Propeller 8-Core (8-Cog) 32-bit Microcontroller",
    coProcessorOrNPU: "8 Independent 32-bit RISC Processing Cogs running concurrently",
    clockSpeed: "80 MHz (20 MIPS per cog = 160 MIPS aggregate)",
    ramAndFlash: "32KB Main Hub RAM + 32KB Hub ROM + 64KB I2C Boot EEPROM",
    connectorType: "micro:bit Edge Socket + 8-channel 3-Pin Servo Headers + 400-Tie Breadboard",
    voltage: "6V - 15V DC Barrel Jack / 5V 1.5A & 3.3V 500mA LDO Rails",
    interface: "micro:bit Edge Connector, I2C, SPI, 8x Servo PWM, 400 Tie-Point Breadboard Rails",
    operatingTemp: "-20°C ~ +70°C",
    specs: "Offloads all microsecond-accurate servo PWM generation, encoder pulse counting, and sensor ping timing from the micro:bit Python runtime.",
    priceUSD: 89.00,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax Ping))) Ultrasonic Distance Sensor (#28015)",
    category: "Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "Discrete Ultrasonic Transceiver Driver & Timing Logic",
    coProcessorOrNPU: "Tuned 40kHz Piezoceramic Transducer Matching Circuit",
    clockSpeed: "40 kHz Ultrasonic Burst Frequency",
    ramAndFlash: "Pulse Width Timing Response",
    connectorType: "3-Pin 0.1\" Header (GND, 5V, SIG)",
    voltage: "5.0V DC (±5%)",
    interface: "Single-Pin Bi-directional Digital Pulse (Trigger High, Echo Pulse Width)",
    operatingTemp: "0°C ~ +70°C",
    specs: "Accurate ultrasonic time-of-flight ranging from 2cm to 300cm (0.8 in to 10 ft) with burst indicator LED and narrow conical acceptance.",
    priceUSD: 32.95,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax LaserPING 2m Rangefinder Sensor (#28041)",
    category: "Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "ST FlightSense Optical Time-of-Flight Engine",
    coProcessorOrNPU: "Onboard PIC16 Coprocessor for Pulse-to-UART conversion",
    clockSpeed: "Single Pulse / 9600 Baud Serial",
    ramAndFlash: "Mode Selection Jumper Logic",
    connectorType: "3-Pin 0.1\" Header (GND, VIN, SIG)",
    voltage: "3.3V - 5.0V DC",
    interface: "PWM Pulse Duration OR Asynchronous Serial UART (9600 baud)",
    operatingTemp: "-10°C ~ +60°C",
    specs: "Near-infrared laser ToF ranging from 2cm to 200cm (2m) with co-located visible red aiming spot. Drop-in code compatible with ultrasonic Ping))).",
    priceUSD: 34.95,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax Whisker Contact Touch Sensor Assembly (Cyber:bot Pack)",
    category: "Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "Passive Mechanical Spring Contact Switch",
    coProcessorOrNPU: "Direct Hardware Pull-Up Resistor Circuit",
    clockSpeed: "Instantaneous Interrupt Contact",
    ramAndFlash: "N/A",
    connectorType: "3-pin Header Posts & Standoff Screws",
    voltage: "3.3V / 5V Logic Pull-Up",
    interface: "Digital GPIO Switch Contact to Ground (Left & Right 2-wire circuits)",
    operatingTemp: "-40°C ~ +125°C",
    specs: "Dual mechanical spring whiskers mounted to robot front standoffs for zero-latency tactile bumper collision detection.",
    priceUSD: 6.50,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax Infrared Obstacle Emitter & Receiver Pair (38kHz)",
    category: "Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "Vishay 38kHz IR Bandpass Demodulator",
    coProcessorOrNPU: "Tuned 38kHz Active IR LED Modulation",
    clockSpeed: "38 kHz Carrier Frequency",
    ramAndFlash: "N/A",
    connectorType: "Breadboard Through-Hole Component Leads",
    voltage: "3.3V - 5V DC",
    interface: "GPIO Modulated PWM Transmit + Active-Low Receiver Pin",
    operatingTemp: "-25°C ~ +85°C",
    specs: "Dual 940nm IR LEDs with light shields + matched 38kHz receivers for contactless left/right obstacle detection up to 30cm.",
    priceUSD: 8.95,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax Phototransistor Light Sensor Pair (#350-00029)",
    category: "Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "NPN Silicon Phototransistor",
    coProcessorOrNPU: "RC Decay Timing Circuit with 0.1uF Film Capacitor",
    clockSpeed: "RC Time Constant Measurement (10us to 50ms)",
    ramAndFlash: "N/A",
    connectorType: "Through-Hole Leads",
    voltage: "3.3V - 5V DC",
    interface: "Analog RC Time Decay Measurement via Digital GPIO (rctime)",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Matched visible light phototransistors (850nm peak) for flashlight following, shadow evasion, and light-seeking navigation.",
    priceUSD: 4.50,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax QTI Line Follower Sensor Module (#555-27401)",
    category: "Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "Fairchild QRB1134 Reflective Optical Phototransistor",
    coProcessorOrNPU: "Integrated Daylight Filter & 10nF RC Decay Circuit",
    clockSpeed: "RC Time Constant (100us to 3000us)",
    ramAndFlash: "N/A",
    connectorType: "3-pin 0.1\" Header (GND, 5V, SIG)",
    voltage: "3.3V - 5.0V DC",
    interface: "Digital RC decay pulse pin",
    operatingTemp: "-20°C ~ +75°C",
    specs: "High-contrast infrared reflective sensor for black/white line tracking, table edge cliff avoidance, and surface texture distinction.",
    priceUSD: 6.50,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },
  {
    productName: "Parallax Feedback 360° High Speed Continuous Servos (#900-00360)",
    category: "Actuator / Closed-Loop Sensor",
    manufacturer: "Parallax Inc.",
    coreProcessor: "Internal Servo Driver H-Bridge & Hall Effect Magnetic Sensor",
    coProcessorOrNPU: "Integrated PWM Duty-Cycle Angle Feedback Generator",
    clockSpeed: "50 Hz Control PWM / 910 Hz Feedback Pulse",
    ramAndFlash: "Magnetic Angle Trims",
    connectorType: "4-pin 0.1\" Servo Plug (Black: GND, Red: VIN, White: Control, Yellow: Feedback)",
    voltage: "5.0V - 6.0V DC",
    interface: "Standard 3-pin PWM Command + 4th wire Hall-Effect PWM Position Feedback",
    operatingTemp: "-10°C ~ +50°C",
    specs: "Closed-loop continuous rotation servo with internal Hall effect sensor providing 360° absolute angular position and velocity feedback at up to 140 RPM.",
    priceUSD: 24.95,
    url: "https://www.parallax.com/product/cyberbot-robot-kit-with-microbit/",
    origin: "USA (Domestic NATO)",
    sourceGroup: "Parallax Cyber:bot Kit"
  },

  // ==========================================
  // MICRO CENTER MAKER/STEM (Category 712)
  // https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712
  // ==========================================
  {
    productName: "Inland MEGA 2560 R3 Board (Micro Center Maker/STEM)",
    category: "SOM / Microcontroller Board",
    manufacturer: "Inland (Micro Center)",
    coreProcessor: "ATmega2560-16AU (8-bit AVR RISC)",
    coProcessorOrNPU: "ATmega16U2 USB-to-Serial Co-Processor",
    clockSpeed: "16 MHz",
    ramAndFlash: "8 KB SRAM + 256 KB Flash + 4 KB EEPROM",
    connectorType: "Standard 0.1\" Female Headers (54 Digital, 16 Analog)",
    voltage: "5.0V Logic (7.0V - 12.0V Barrel Jack Vin)",
    interface: "54x GPIO, 16x ADC, 15x PWM, 4x Hardware UARTs, SPI, I2C, ICSP",
    operatingTemp: "-40°C ~ +85°C",
    specs: "High-pinout robotics controller for multi-servo kinematics, sensory arrays, and direct motor PWM modulation.",
    priceUSD: 19.99,
    url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    origin: "USA (Micro Center Maker Line)",
    sourceGroup: "Micro Center Maker/STEM"
  },
  {
    productName: "Inland ESP32 Core Board (Wi-Fi + BLE DevKit)",
    category: "SOM / Microcontroller Board",
    manufacturer: "Inland (Micro Center)",
    coreProcessor: "Dual-Core 32-bit Xtensa LX6",
    coProcessorOrNPU: "Ultra Low Power (ULP) Co-Processor",
    clockSpeed: "240 MHz",
    ramAndFlash: "520 KB SRAM + 4 MB SPI Flash",
    connectorType: "Dual 15-pin 0.1\" Breadboard Header + Micro-USB",
    voltage: "3.3V Logic (5.0V USB Vin)",
    interface: "802.11b/g/n Wi-Fi, BLE 4.2, 30x GPIO, 12-bit ADC, 2x DAC, I2C, SPI, UART, PWM",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Integrated high-speed wireless telemetry, web dashboard server, and micro-ROS XRCE robotic communication bridge.",
    priceUSD: 7.99,
    url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    origin: "USA (Micro Center Maker Line)",
    sourceGroup: "Micro Center Maker/STEM"
  },
  {
    productName: "Inland L298P 4-Channel Motor Drive Shield",
    category: "Motor Driver",
    manufacturer: "Inland (Micro Center)",
    coreProcessor: "Dual L298P Dual Full-Bridge Drivers",
    coProcessorOrNPU: "Integrated Flyback Freewheeling Diodes",
    clockSpeed: "Up to 40 kHz PWM Modulation",
    ramAndFlash: "N/A (Driver Hardware)",
    connectorType: "Arduino Uno/Mega R3 Shield Stackable Headers + Screw Terminals",
    voltage: "4.8V - 24.0V DC Motor Supply / 5.0V Logic",
    interface: "Arduino Shield Header, PWM Speed (D10, D11), Direction (D12, D13), Buzzer (D4), Ultrasonic Header",
    operatingTemp: "-25°C ~ +130°C",
    specs: "Drives 2x DC motors (up to 2A per channel) or 1x 4-wire bipolar stepper; onboard piezo buzzer, ultrasonic sensor port & Bluetooth socket.",
    priceUSD: 14.99,
    url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    origin: "USA (Micro Center Maker Line)",
    sourceGroup: "Micro Center Maker/STEM"
  },
  {
    productName: "Inland 37-in-1 Robotics & Sensor Super Kit",
    category: "Sensor",
    manufacturer: "Inland (Micro Center)",
    coreProcessor: "Assorted Sensor ICs (HC-SR04, PIR, Hall, IR, Temp, Sound, Flame)",
    coProcessorOrNPU: "Integrated Comparator Op-Amps (LM393) on Breakout Boards",
    clockSpeed: "Analog & 40 kHz Ultrasonic Burst",
    ramAndFlash: "N/A",
    connectorType: "3-pin & 4-pin 0.1\" Dupont Headers",
    voltage: "3.3V - 5.0V DC",
    interface: "Analog Voltage, Digital I/O, 1-Wire, I2C, SPI",
    operatingTemp: "-20°C ~ +70°C",
    specs: "Comprehensive 37-piece sensor suite including Ultrasonic HC-SR04, PIR motion, Hall magnetic, Flame IR, Tilt switch, Rotary encoder, Analog temp & RGB modules.",
    priceUSD: 29.99,
    url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    origin: "USA (Micro Center Maker Line)",
    sourceGroup: "Micro Center Maker/STEM"
  },
  {
    productName: "Inland 9G Micro Servos (3-Pack)",
    category: "Actuator / Closed-Loop Sensor",
    manufacturer: "Inland (Micro Center)",
    coreProcessor: "Internal Analog Servo Amplifier IC & Feedback Potentiometer",
    coProcessorOrNPU: "Coreless DC Motor + Nylon Geartrain",
    clockSpeed: "50 Hz PWM Standard",
    ramAndFlash: "N/A",
    connectorType: "3-pin 0.1\" Dupont Plug (Brown: GND, Red: VCC, Orange: Signal)",
    voltage: "4.8V - 6.0V DC",
    interface: "Standard 50Hz PWM Duty Cycle (1ms - 2ms pulse width)",
    operatingTemp: "-10°C ~ +50°C",
    specs: "3x 9-gram micro servos with 1.6 kg-cm stall torque @ 4.8V, 0.12s/60° speed, 180° rotation, includes horns and linkage hardware.",
    priceUSD: 8.99,
    url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    origin: "USA (Micro Center Maker Line)",
    sourceGroup: "Micro Center Maker/STEM"
  },
  {
    productName: "Inland Keyestudio Stepper Driver + 28BYJ-48 5V Stepper Kit",
    category: "Motor Driver",
    manufacturer: "Inland (Micro Center)",
    coreProcessor: "ULN2003 High-Voltage High-Current Darlington Transistor Array",
    coProcessorOrNPU: "4-Phase LED Status Indicators (A, B, C, D)",
    clockSpeed: "Up to 1 kHz Step Rate",
    ramAndFlash: "N/A",
    connectorType: "5-pin JST-XH Stepper Plug + 4-pin 0.1\" Logic Header",
    voltage: "5.0V DC",
    interface: "4-Phase GPIO Stepping (IN1, IN2, IN3, IN4)",
    operatingTemp: "-20°C ~ +60°C",
    specs: "3x 28BYJ-48 5V 4-phase geared stepper motors with ULN2003 Darlington driver boards; 64:1 gear reduction ratio with 5.625°/64 step angle.",
    priceUSD: 11.99,
    url: "https://www.microcenter.com/search/search_results.aspx?fq=category:Maker%2FSTEM|712",
    origin: "USA (Micro Center Maker Line)",
    sourceGroup: "Micro Center Maker/STEM"
  },

  // ==========================================
  // PISHOP.US RASPBERRY PI & ROBOTICS
  // https://www.pishop.us/categories
  // ==========================================
  {
    productName: "Raspberry Pi 5 (8GB RAM) - PiShop Approved",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "Raspberry Pi Foundation",
    coreProcessor: "Broadcom BCM2712 Quad-Core 64-bit Arm Cortex-A76",
    coProcessorOrNPU: "VideoCore VII GPU @ 800MHz (Vulkan 1.2, OpenGL ES 3.1) + RP1 I/O Controller",
    clockSpeed: "2.4 GHz",
    ramAndFlash: "8GB LPDDR4X-4267 SDRAM + MicroSD / PCIe NVMe SSD slot",
    connectorType: "40-pin GPIO + 16-pin PCIe 2.0 FPC + 2x 4-lane MIPI CSI/DSI",
    voltage: "5.1V / 5.0A USB-C PD (27W Recommended)",
    interface: "PCIe 2.0, Gigabit Ethernet, 2x USB 3.0 (5Gbps), 2x USB 2.0, 2x 4Kp60 HDMI, Wi-Fi 802.11ac, BLE 5.0",
    operatingTemp: "0°C ~ +85°C",
    specs: "Flagship SBC host for high-throughput ROS2 Humble nodes, realtime stereo vision, SLAM navigation, and local LLM agents.",
    priceUSD: 80.00,
    url: "https://www.pishop.us/categories",
    origin: "United Kingdom (NATO Founder)",
    sourceGroup: "PiShop.us Categories"
  },
  {
    productName: "Raspberry Pi AI HAT+ (Hailo-8L 13 TOPS)",
    category: "SOM / AI Accelerator & Vision",
    manufacturer: "Raspberry Pi / Hailo",
    coreProcessor: "Hailo-8L Neural Processing Unit (NPU)",
    coProcessorOrNPU: "13 TOPS INT8 Deep Learning Accelerator",
    clockSpeed: "PCIe Gen 2.0 x1 Bus Speed",
    ramAndFlash: "Onboard NPU Pipeline Memory",
    connectorType: "Raspberry Pi 5 16-pin PCIe Ribbon Cable + Pass-through GPIO Header",
    voltage: "3.3V / 5.0V via Raspberry Pi 5 Header",
    interface: "PCIe 2.0 x1 Interface (fully integrated into Raspberry Pi OS libcamera & rpicam-apps)",
    operatingTemp: "0°C ~ +50°C",
    specs: "Accelerates YOLOv8 object detection, pose estimation, and semantic segmentation at 30+ FPS directly on the robot chassis with zero CPU overhead.",
    priceUSD: 70.00,
    url: "https://www.pishop.us/categories",
    origin: "United Kingdom / Israel (Allied)",
    sourceGroup: "PiShop.us Categories"
  },
  {
    productName: "Raspberry Pi AI Camera (Sony IMX500 12.3MP)",
    category: "Sensor",
    manufacturer: "Raspberry Pi / Sony",
    coreProcessor: "Sony IMX500 Intelligent Vision Sensor with On-Chip Neural Engine",
    coProcessorOrNPU: "Integrated Tensor Processing Engine running MobileNet & Classification Models",
    clockSpeed: "Internal AI Clock + 2-lane MIPI CSI-2 @ 1.5 Gbps",
    ramAndFlash: "On-chip Neural Weight SRAM + Firmware Flash",
    connectorType: "15-pin / 22-pin FPC Camera Ribbon Connector",
    voltage: "3.3V DC via MIPI Ribbon",
    interface: "2-lane MIPI CSI-2 Camera Interface + I2C Configuration Bus",
    operatingTemp: "-20°C ~ +70°C",
    specs: "Outputs pre-processed bounding boxes, human pose coordinates, and class metadata directly to Raspberry Pi over standard CSI without host CPU overhead.",
    priceUSD: 70.00,
    url: "https://www.pishop.us/categories",
    origin: "Japan (NATO Global Partner)",
    sourceGroup: "PiShop.us Categories"
  },
  {
    productName: "Raspberry Pi Pico 2 (RP2350 Dual M33 / Hazard3 RISC-V)",
    category: "SOM / Microcontroller Board",
    manufacturer: "Raspberry Pi Foundation",
    coreProcessor: "Dual ARM Cortex-M33 or Dual Hazard3 RISC-V (User-Switchable)",
    coProcessorOrNPU: "12x Programmable I/O (PIO) State Machines + Arm TrustZone Security",
    clockSpeed: "150 MHz",
    ramAndFlash: "520 KB SRAM + 4 MB QSPI Flash",
    connectorType: "Castellated Edge Holes / 40-pin 0.1\" Breadboard Format + Micro-USB",
    voltage: "3.3V Logic (1.8V - 5.5V DC Input via SMPS)",
    interface: "26x GPIO, 3x ADC, 2x SPI, 2x I2C, 2x UART, 16x PWM, 12x PIO machines",
    operatingTemp: "-20°C ~ +85°C",
    specs: "Next-generation low-latency motor control co-processor with ultra-flexible PIO state machines for quadrature encoders, DMX, and WS2812B.",
    priceUSD: 5.00,
    url: "https://www.pishop.us/categories",
    origin: "United Kingdom (NATO Founder)",
    sourceGroup: "PiShop.us Categories"
  },
  {
    productName: "Pimoroni Yukon High-Power Modular Robotics Host",
    category: "Motor Driver",
    manufacturer: "Pimoroni / PiShop.us",
    coreProcessor: "RP2040 Dual ARM Cortex-M0+ @ 133MHz",
    coProcessorOrNPU: "Integrated High-Current e-Fuse & Overvoltage Protection Controller",
    clockSpeed: "133 MHz",
    ramAndFlash: "264 KB SRAM + 16 MB QSPI Flash",
    connectorType: "6x Yukon High-Power Module Slots + XT30 Power In + Qw/ST Connector",
    voltage: "5.0V - 17.0V DC Input (up to 15A Total Output)",
    interface: "USB-C, Qw/ST (Qwiic/STEMMA QT), 6x High-Power Module Slots, I2C, SPI, UART, PWM",
    operatingTemp: "-20°C ~ +70°C",
    specs: "Central high-power robotics power hub and motion coordinator capable of delivering up to 15A continuous current to servos and DC motors.",
    priceUSD: 44.95,
    url: "https://www.pishop.us/categories",
    origin: "United Kingdom (NATO Founder)",
    sourceGroup: "PiShop.us Categories"
  },
  {
    productName: "Waveshare Motor Driver HAT for Raspberry Pi",
    category: "Motor Driver",
    manufacturer: "Waveshare / PiShop.us",
    coreProcessor: "PCA9685 16-Channel 12-Bit PWM Controller",
    coProcessorOrNPU: "Dual TB6612FNG Dual H-Bridge Motor Drivers",
    clockSpeed: "I2C Fast Mode 400 kHz / 1 kHz Motor PWM",
    ramAndFlash: "N/A",
    connectorType: "Raspberry Pi 40-Pin Stacking Header + Screw Terminals",
    voltage: "6.0V - 12.0V DC Motor Supply / 3.3V Logic",
    interface: "I2C Bus (Addresses 0x40 - 0x60 via solder jumpers) + 5V 3A onboard buck regulator",
    operatingTemp: "-20°C ~ +85°C",
    specs: "Stacks directly onto Raspberry Pi 40-pin GPIO header, controlling mobile rover drive wheels via I2C with zero GPIO pin contention.",
    priceUSD: 21.95,
    url: "https://www.pishop.us/categories",
    origin: "USA Distributor (PiShop.us)",
    sourceGroup: "PiShop.us Categories"
  },

  // ==========================================
  // NEWARK ELEMENT14 PRODUCTS
  // https://www.newark.com/browse-for-products
  // ==========================================
  {
    productName: "STMicroelectronics STM32 Nucleo-F446RE Dev Board",
    category: "SOM / Microcontroller Board",
    manufacturer: "STMicroelectronics",
    coreProcessor: "32-bit ARM Cortex-M4 with Single-Precision FPU & DSP",
    coProcessorOrNPU: "ST-LINK/V2-1 Debugger / Programmer Onboard",
    clockSpeed: "180 MHz (225 DMIPS)",
    ramAndFlash: "128 KB SRAM + 512 KB Flash",
    connectorType: "ST Morpho Extension Headers + Arduino Uno V3 Headers + Mini-USB",
    voltage: "3.3V Logic (7.0V - 12.0V Vin or 5V USB)",
    interface: "ST Morpho + Arduino V3, 3x SPI, 3x I2C, 4x USART, 2x CAN 2.0B, 2x 12-bit DAC, 3x 12-bit ADC",
    operatingTemp: "-40°C ~ +85°C (Industrial)",
    specs: "Industrial-grade determinism for hard real-time motor commutation, field-oriented control (FOC), and high-frequency sensor fusion.",
    priceUSD: 19.86,
    url: "https://www.newark.com/browse-for-products",
    origin: "Switzerland / France / Italy (NATO Allies)",
    sourceGroup: "Newark element14 Products"
  },
  {
    productName: "BeagleBone Black Industrial (TI Sitara AM3358)",
    category: "SOM / Embedded Compute (Linux/RTOS)",
    manufacturer: "BeagleBoard.org / Newark",
    coreProcessor: "Texas Instruments AM3358 ARM Cortex-A8",
    coProcessorOrNPU: "Dual 32-bit 200MHz PRU (Programmable Real-Time Unit) Co-Processors + SGX530 GPU",
    clockSpeed: "1.0 GHz (Cortex-A8) / 200 MHz (Dual PRU)",
    ramAndFlash: "512 MB DDR3 + 4 GB 8-bit eMMC Onboard Storage",
    connectorType: "Dual 46-pin 0.1\" Female Expansion Headers (P8, P9) + Mini-USB",
    voltage: "5.0V DC Input (Barrel Jack or USB)",
    interface: "65x GPIO, 8x PWM, 4x Timers, 5x UART, 2x I2C, 2x SPI, CAN Bus, 10/100 Ethernet, USB Host",
    operatingTemp: "-40°C ~ +85°C (Full Industrial)",
    specs: "Dual PRU co-processors execute nanosecond-precise motor stepping and encoder quadrature while running full Linux on Cortex-A8.",
    priceUSD: 79.95,
    url: "https://www.newark.com/browse-for-products",
    origin: "USA (NATO Domestic)",
    sourceGroup: "Newark element14 Products"
  },
  {
    productName: "Arduino Nano 33 BLE Sense (Edge ML Edition)",
    category: "SOM / Microcontroller Board",
    manufacturer: "Arduino Official / Newark",
    coreProcessor: "Nordic nRF52840 32-bit ARM Cortex-M4F with FPU",
    coProcessorOrNPU: "Integrated TinyML Sensor Suite (9-DOF IMU, Temp, Humidity, Pressure, Mic, Gesture)",
    clockSpeed: "64 MHz",
    ramAndFlash: "256 KB SRAM + 1 MB Flash",
    connectorType: "Castellated Pins / 30-pin DIP 0.1\" + Micro-USB",
    voltage: "3.3V Logic (5.0V USB Vin)",
    interface: "Bluetooth 5.0 / BLE, 14x Digital I/O (all PWM), 8x ADC, I2C, SPI, UART",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Complete self-contained sensor fusion and TinyML gesture/voice recognition node in an ultra-compact breadboard-friendly form factor.",
    priceUSD: 36.30,
    url: "https://www.newark.com/browse-for-products",
    origin: "Italy (NATO Ally)",
    sourceGroup: "Newark element14 Products"
  },
  {
    productName: "Trinamic TMC2209 SilentStepStick Stepper Driver",
    category: "Motor Driver",
    manufacturer: "Analog Devices Trinamic / Newark",
    coreProcessor: "Trinamic TMC2209-LA Ultra-Quiet Motor Driver IC",
    coProcessorOrNPU: "Hardware StealthChop2, SpreadCycle & StallGuard4 Sensorless Load Detection",
    clockSpeed: "Up to 256 Native Microsteps per Full Step",
    ramAndFlash: "Internal Configuration Registers",
    connectorType: "Standard 16-pin Pololu Stepper Driver Footprint",
    voltage: "4.75V - 28.0V DC Motor Power / 3.3V - 5.0V Logic",
    interface: "STEP / DIR interface or Single-Wire UART Configuration Bus",
    operatingTemp: "-40°C ~ +125°C",
    specs: "Whisper-quiet precision stepper control for robotic arms, pan/tilt gimbal turrets, and precision linear positioning with sensorless obstacle homing.",
    priceUSD: 14.50,
    url: "https://www.newark.com/browse-for-products",
    origin: "Germany (NATO Ally)",
    sourceGroup: "Newark element14 Products"
  },
  {
    productName: "Texas Instruments BQ25895 I2C Li-Ion Charger & Boost Module",
    category: "Power Supply",
    manufacturer: "Texas Instruments / Newark",
    coreProcessor: "TI BQ25895 Single-Cell Switch-Mode Battery Management IC",
    coProcessorOrNPU: "Integrated 7-Bit ADC for Voltage, Current & Temperature Telemetry",
    clockSpeed: "1.5 MHz Synchronous Switch-Mode Frequency",
    ramAndFlash: "I2C Configuration Registers",
    connectorType: "Screw Terminals + 0.1\" Header Pins",
    voltage: "3.9V - 14.0V DC Input / 5.15V Boost Output @ 3.1A",
    interface: "I2C Bus (Address 0x6A), INT Interrupt Pin, Status LEDs",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Intelligent battery power management for mobile rovers, reporting state-of-charge, voltage, charge current, and thermal telemetry over I2C.",
    priceUSD: 28.50,
    url: "https://www.newark.com/browse-for-products",
    origin: "USA (NATO Domestic)",
    sourceGroup: "Newark element14 Products"
  },
  {
    productName: "Honeywell SS49E Linear Hall-Effect Magnetic Sensor",
    category: "Sensor",
    manufacturer: "Honeywell / Newark element14",
    coreProcessor: "Solid-State Quad Hall Sensing Element & Linear Amplifier",
    coProcessorOrNPU: "Laser-Trimmed Resistor Matrix for Temperature Stability",
    clockSpeed: "High Frequency Real-Time Analog Output (<3µs response)",
    ramAndFlash: "N/A",
    connectorType: "3-pin TO-92 Radial Leads",
    voltage: "2.7V - 6.5V DC",
    interface: "3-pin Analog Output (VCC, GND, VOUT ratiometric to VCC)",
    operatingTemp: "-40°C ~ +100°C",
    specs: "Contactless angular wheel position, magnetic gear tooth counting, and robotic arm joint limit sensing immune to mechanical wear.",
    priceUSD: 2.75,
    url: "https://www.newark.com/browse-for-products",
    origin: "USA (NATO Domestic)",
    sourceGroup: "Newark element14 Products"
  },
  {
    productName: "Pololu 5V 1A Step-Down Voltage Regulator D24V10F5",
    category: "Power Supply",
    manufacturer: "Pololu / Newark element14",
    coreProcessor: "Monolithic Synchronous Buck Switching Converter",
    coProcessorOrNPU: "Integrated Thermal Shutdown & Reverse-Voltage Protection",
    clockSpeed: "High-frequency 500 kHz Switching",
    ramAndFlash: "N/A",
    connectorType: "3-pin 0.1\" Breadboard Header (VIN, GND, VOUT) with Shutdown Pin",
    voltage: "5.5V - 36.0V DC Input -> 5.0V Regulated Output (1A continuous)",
    interface: "Power IN, Power OUT, Ground, Low-Power SHDN Pin",
    operatingTemp: "-40°C ~ +85°C",
    specs: "Steps down 7.4V or 11.1V battery voltages cleanly to power 5V microcontrollers, Raspberry Pi SBCs, and sensitive sensors without heat buildup.",
    priceUSD: 9.95,
    url: "https://www.newark.com/browse-for-products",
    origin: "USA (Las Vegas, NV)",
    sourceGroup: "Newark element14 Products"
  }
];

export interface DatasheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (msg: string) => void;
  activeDrawer?: HardwareComponent[];
  catalog?: HardwareComponent[];
  initialMode?: "datasheet" | "compare";
  onAddToDrawer?: (item: HardwareComponent) => void;
  onRemoveFromDrawer?: (id: string) => void;
  getComponentThumbnail?: (item: HardwareComponent) => string;
}

export function DatasheetModal({
  isOpen,
  onClose,
  onNotify,
  activeDrawer = [],
  catalog = SUPPLIER_CATALOG,
  initialMode = "datasheet",
  onAddToDrawer,
  onRemoveFromDrawer,
  getComponentThumbnail
}: DatasheetModalProps) {
  const [activeTab, setActiveTab] = useState<"datasheet" | "compare">(initialMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSourceGroup, setSelectedSourceGroup] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedCSV, setCopiedCSV] = useState(false);
  const [copiedMD, setCopiedMD] = useState(false);

  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode, isOpen]);

  const filteredEntries = useMemo(() => {
    return DATASHEET_ENTRIES.filter((row) => {
      const matchSearch =
        row.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.coreProcessor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.coProcessorOrNPU.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.specs.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.interface.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.connectorType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSource =
        selectedSourceGroup === "All" || row.sourceGroup === selectedSourceGroup;

      const matchCategory =
        selectedCategory === "All" || row.category === selectedCategory;

      return matchSearch && matchSource && matchCategory;
    });
  }, [searchTerm, selectedSourceGroup, selectedCategory]);

  const generateCSVString = () => {
    const headers = [
      "Product_Name",
      "Category",
      "Manufacturer",
      "Core_Processor",
      "CoProcessor_or_NPU_Accelerator",
      "Clock_Speed",
      "RAM_and_Flash_Memory",
      "Connector_Type",
      "Operating_Voltage",
      "Communication_Interface_Peripherals",
      "Operating_Temperature",
      "Key_Technical_Specifications",
      "Estimated_Price_USD",
      "Supplier_Source_URL",
      "Origin_Supply_Chain",
      "Source_Catalog_Group"
    ];

    const rows = filteredEntries.map((row) => [
      `"${row.productName.replace(/"/g, '""')}"`,
      `"${row.category}"`,
      `"${row.manufacturer.replace(/"/g, '""')}"`,
      `"${row.coreProcessor.replace(/"/g, '""')}"`,
      `"${row.coProcessorOrNPU.replace(/"/g, '""')}"`,
      `"${row.clockSpeed.replace(/"/g, '""')}"`,
      `"${row.ramAndFlash.replace(/"/g, '""')}"`,
      `"${row.connectorType.replace(/"/g, '""')}"`,
      `"${row.voltage.replace(/"/g, '""')}"`,
      `"${row.interface.replace(/"/g, '""')}"`,
      `"${row.operatingTemp.replace(/"/g, '""')}"`,
      `"${row.specs.replace(/"/g, '""')}"`,
      row.priceUSD.toFixed(2),
      `"${row.url}"`,
      `"${row.origin}"`,
      `"${row.sourceGroup}"`
    ]);

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSVString();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `digikey_adafruit_parallax_master_datasheet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify?.("Downloaded Full Master Components Datasheet (.CSV)!");
  };

  const handleCopyCSV = () => {
    const csvContent = generateCSVString();
    void navigator.clipboard.writeText(csvContent);
    setCopiedCSV(true);
    setTimeout(() => { setCopiedCSV(false); }, 2000);
    onNotify?.("Copied full CSV datasheet to clipboard!");
  };

  const handleCopyMarkdown = () => {
    const headers = "| Product / Part Name | Category | Manufacturer | Core Processor | Co-Processor / NPU | Clock | RAM / Flash | Connector | Interface | Voltage | Price (USD) | Origin |";
    const divider = "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |";
    const rows = filteredEntries.map(
      (r) => `| **${r.productName}** | ${r.category} | ${r.manufacturer} | ${r.coreProcessor} | ${r.coProcessorOrNPU} | ${r.clockSpeed} | ${r.ramAndFlash} | ${r.connectorType} | ${r.interface} | ${r.voltage} | $${r.priceUSD.toFixed(2)} | ${r.origin} |`
    );
    const md = [headers, divider, ...rows].join("\n");
    void navigator.clipboard.writeText(md);
    setCopiedMD(true);
    setTimeout(() => { setCopiedMD(false); }, 2000);
    onNotify?.("Copied Markdown table to clipboard!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="bg-slate-900 border border-slate-700/80 w-full max-w-[96vw] max-h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        >
          {/* MODAL HEADER */}
          <div className="p-3.5 sm:p-4 bg-slate-950/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shadow-md transition ${
                activeTab === "compare"
                  ? "bg-violet-950 border border-violet-700/60 text-violet-400 shadow-violet-950/50"
                  : "bg-cyan-950 border border-cyan-700/60 text-cyan-400 shadow-cyan-950/50"
              }`}>
                {activeTab === "compare" ? <Scale className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-white font-mono flex items-center gap-2 flex-wrap">
                  {activeTab === "compare" ? (
                    <>
                      <span>Compare Components &amp; Hardware Specs</span>
                      <span className="text-[10px] bg-violet-950 text-violet-300 px-2 py-0.5 rounded border border-violet-800/70 font-bold">
                        Side-by-Side Analysis
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Microcontroller, MPU, FPGA, SOM &amp; Sensors Master Datasheet</span>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/70 font-bold">
                        {filteredEntries.length} Items Listed
                      </span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {activeTab === "compare"
                    ? "Side-by-side technical comparison of items from your build drawer and sourced catalogs."
                    : "DigiKey 721 + Adafruit 57 + Parallax Cyber:bot + Micro Center STEM + PiShop.us + Newark element14"}
                </p>
              </div>
            </div>

            {/* TAB SELECTOR & ACTIONS */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* VIEW MODE TABS: MASTER DATASHEET TABLE vs COMPARE COMPONENTS */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => { setActiveTab("datasheet"); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "datasheet"
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="View complete Master Datasheet table"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Master Datasheet</span>
                  <span className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                    {filteredEntries.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab("compare"); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "compare"
                      ? "bg-violet-950 text-violet-300 border border-violet-700/80 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Compare two components side-by-side"
                >
                  <Scale className="w-3.5 h-3.5 text-violet-400" />
                  <span>Compare Components</span>
                  <span className="text-[10px] bg-violet-900/60 text-violet-300 px-1.5 py-0.2 rounded border border-violet-800">
                    {activeDrawer.length} In Drawer
                  </span>
                </button>
              </div>

              {activeTab === "datasheet" && (
                <>
                  <button
                    onClick={handleCopyCSV}
                    className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Copy formatted CSV text to clipboard"
                  >
                    {copiedCSV ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedCSV ? "CSV Copied!" : "Copy CSV"}</span>
                  </button>

                  <button
                    onClick={handleCopyMarkdown}
                    className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Copy Markdown table formatted text"
                  >
                    {copiedMD ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Table className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedMD ? "Markdown Copied!" : "Copy Table"}</span>
                  </button>

                  <button
                    onClick={handleDownloadCSV}
                    className="px-3 sm:px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950/60"
                    title="Download this datasheet directly as a .CSV file"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-950" />
                    <span>Download .CSV</span>
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* TAB VIEW 1: COMPARE COMPONENTS VIEW */}
          {activeTab === "compare" ? (
            <CompareComponentsView
              activeDrawer={activeDrawer}
              catalog={catalog}
              onAddToDrawer={onAddToDrawer}
              onRemoveFromDrawer={onRemoveFromDrawer}
              onNotify={onNotify}
              getComponentThumbnail={getComponentThumbnail}
            />
          ) : (
            <>
              {/* FILTER & SEARCH TOOLBAR */}
              <div className="p-3 bg-slate-950/70 border-b border-slate-800/80 flex flex-col gap-2 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  {/* Search Box */}
                  <div className="relative flex-1 min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search parts, processors (Cortex, RISC-V, FPGA), NPU TOPS, I2C, SPI, PCIe, Hirose, DigiKey, Adafruit, Micro Center, PiShop, Newark..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  {/* Source Group Filters */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-cyan-400" />
                      Source:
                    </span>
                    {[
                      { id: "All", label: "All Catalogs" },
                      { id: "DigiKey Filter 721", label: "DigiKey 721" },
                      { id: "Adafruit Category 57", label: "Adafruit 57" },
                      { id: "Parallax Cyber:bot Kit", label: "Parallax" },
                      { id: "Micro Center Maker/STEM", label: "Micro Center STEM" },
                      { id: "PiShop.us Categories", label: "PiShop.us" },
                      { id: "Newark element14 Products", label: "Newark element14" }
                    ].map((grp) => (
                      <button
                        key={grp.id}
                        onClick={() => { setSelectedSourceGroup(grp.id); }}
                        className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition cursor-pointer ${
                          selectedSourceGroup === grp.id
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-700/80 font-bold shadow-sm"
                            : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                        }`}
                      >
                        {grp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono scrollbar-thin">
                  <span className="text-slate-500 shrink-0 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                    Category:
                  </span>
                  {[
                    "All",
                    "SOM / FPGA & MPSoC",
                    "SOM / Embedded Compute (Linux/RTOS)",
                    "SOM / AI Accelerator & Vision",
                    "SOM / Microcontroller Board",
                    "SOM / Industrial IoT & Wireless",
                    "Sensor",
                    "Robot Kit / Platform",
                    "Controller / Module",
                    "Controller Carrier / Co-Processor",
                    "Actuator / Closed-Loop Sensor",
                    "Motor Driver",
                    "Power Supply"
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); }}
                      className={`px-2 py-0.5 rounded-md whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold"
                          : "bg-slate-900/90 text-slate-400 hover:text-slate-300 border border-slate-800"
                      }`}
                    >
                      {cat === "All" ? "All Categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

          {/* MASTER DATASHEET TABLE */}
          <div className="flex-1 overflow-auto p-2 sm:p-3 font-mono text-xs">
            <div className="min-w-[1400px] border border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-950/70">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-2.5">Part / Product Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Manufacturer</th>
                    <th className="p-2.5">Core Processor</th>
                    <th className="p-2.5">Co-Processor / NPU / Fabric</th>
                    <th className="p-2.5">Clock Speed</th>
                    <th className="p-2.5">RAM &amp; Storage</th>
                    <th className="p-2.5">Connector Type</th>
                    <th className="p-2.5">Voltage</th>
                    <th className="p-2.5">Interfaces &amp; Peripherals</th>
                    <th className="p-2.5">Op. Temp</th>
                    <th className="p-2.5 text-right">Est. Price</th>
                    <th className="p-2.5 text-center">Origin</th>
                    <th className="p-2.5 text-center">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[11px]">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="p-8 text-center text-slate-500 font-mono">
                        No components match your search filter. Try another keyword or reset filters.
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-900/60 transition group text-slate-300"
                      >
                        {/* Part Name */}
                        <td className="p-2.5 font-semibold text-slate-100 max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            {row.sourceGroup === "Adafruit Category 57" ? (
                              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" title="Adafruit Sensor" />
                            ) : row.sourceGroup === "DigiKey Filter 721" ? (
                              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" title="DigiKey Category 721" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Parallax Cyber:bot" />
                            )}
                            <span className="leading-tight text-xs text-white">{row.productName}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-2.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                              row.category.includes("FPGA")
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                                : row.category.includes("AI Accelerator")
                                ? "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                                : row.category.includes("Embedded Compute")
                                ? "bg-purple-950/80 text-purple-300 border border-purple-800/60"
                                : row.category.includes("Microcontroller")
                                ? "bg-blue-950/80 text-blue-300 border border-blue-800/60"
                                : row.category.includes("Industrial IoT")
                                ? "bg-teal-950/80 text-teal-300 border border-teal-800/60"
                                : row.category.includes("Sensor")
                                ? "bg-indigo-950/80 text-indigo-300 border border-indigo-800/60"
                                : row.category.includes("Robot")
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                                : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}
                          >
                            {row.category}
                          </span>
                        </td>

                        {/* Manufacturer */}
                        <td className="p-2.5 text-slate-300 font-medium whitespace-nowrap">
                          {row.manufacturer}
                        </td>

                        {/* Core Processor */}
                        <td className="p-2.5 text-cyan-300 max-w-[170px] text-[10.5px] leading-tight">
                          {row.coreProcessor}
                        </td>

                        {/* Co-Processor / NPU */}
                        <td className="p-2.5 text-violet-300 max-w-[180px] text-[10px] leading-tight">
                          {row.coProcessorOrNPU}
                        </td>

                        {/* Clock Speed */}
                        <td className="p-2.5 text-amber-300 whitespace-nowrap text-[10.5px]">
                          {row.clockSpeed}
                        </td>

                        {/* RAM & Storage */}
                        <td className="p-2.5 text-slate-300 max-w-[160px] text-[10.5px] leading-tight">
                          {row.ramAndFlash}
                        </td>

                        {/* Connector Type */}
                        <td className="p-2.5 text-slate-400 max-w-[150px] text-[10px] leading-tight">
                          {row.connectorType}
                        </td>

                        {/* Supply Voltage */}
                        <td className="p-2.5 text-slate-300 whitespace-nowrap text-[10px]">
                          {row.voltage}
                        </td>

                        {/* Interfaces */}
                        <td className="p-2.5 text-slate-400 max-w-[190px] text-[10px] leading-tight">
                          {row.interface}
                        </td>

                        {/* Operating Temp */}
                        <td className="p-2.5 text-slate-400 whitespace-nowrap text-[9.5px]">
                          {row.operatingTemp}
                        </td>

                        {/* Price */}
                        <td className="p-2.5 text-right font-bold text-emerald-300 whitespace-nowrap">
                          ${row.priceUSD.toFixed(2)}
                        </td>

                        {/* Origin */}
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                            {row.origin.split(" ")[0]}
                          </span>
                        </td>

                        {/* Link */}
                        <td className="p-2.5 text-center whitespace-nowrap">
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 px-2 py-0.5 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 hover:border-cyan-700/60 transition text-[10px]"
                            title="Open direct catalog page"
                          >
                            <span>Link</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 shrink-0">
            <div className="flex items-center gap-4 flex-wrap text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> 
                <span className="text-slate-300 font-bold">DigiKey Category 721:</span> FPGA, MPU Linux SOMs, AI Accelerators (40–275 TOPS), Cortex-M7/RISC-V MCUs, Cellular/Wi-Fi IoT
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> 
                <span className="text-slate-300 font-bold">Adafruit Category 57:</span> Environmental, ToF Laser, IMU Fusion, Spectral &amp; Thermal Sensors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 
                <span className="text-slate-300 font-bold">Parallax:</span> Cyber:bot Robot Kit, Propeller 8-Cog Co-Processor &amp; Closed-Loop 360° Servos
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadCSV}
                className="text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Master CSV ({filteredEntries.length} items)</span>
              </button>
            </div>
          </div>
          </>
        )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
