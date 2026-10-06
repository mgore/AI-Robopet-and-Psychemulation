import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  X,
  Smartphone,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Wrench
} from "lucide-react";
import { HardwareComponent } from "../../types";

interface WorkshopQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncUrl: string;
  copySyncLink: () => void;
  copiedQRLink: boolean;
  downloadQRImage: () => void;
  onExportPDF: () => void;
  activeDrawer: HardwareComponent[];
  robotType: string;
}

export const WorkshopQRModal: React.FC<WorkshopQRModalProps> = ({
  isOpen,
  onClose,
  syncUrl,
  copySyncLink,
  copiedQRLink,
  downloadQRImage,
  onExportPDF,
  activeDrawer,
  robotType
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl flex flex-col gap-5 relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-950/80 border border-cyan-800/60 rounded-xl text-cyan-400">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                  <span>Workshop Mobile QR Sync</span>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Live PDF Link
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Scan on phone or tablet to open report at your workbench
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition cursor-pointer border-0 bg-transparent"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Left: QR Code Graphic */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-5 flex flex-col items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.12)]">
              <div className="bg-white p-3 rounded-xl border border-slate-700 shadow-inner">
                <QRCodeSVG
                  value={syncUrl}
                  size={170}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-cyan-300 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scan with Phone Camera</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Syncs {activeDrawer.length} parts •{" "}
                  {robotType
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </p>
              </div>
            </div>

            {/* Right: Quick Actions & Links */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Mobile Workshop Sync Link
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={syncUrl}
                    className="bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-[11px] font-mono text-slate-300 w-full focus:outline-none"
                  />
                  <button
                    onClick={copySyncLink}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded transition border border-slate-700 shrink-0 cursor-pointer"
                    title="Copy Sync URL"
                  >
                    {copiedQRLink ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions list */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={onExportPDF}
                  className="w-full py-2 px-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-200 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  Download PDF Report Now
                </button>

                <button
                  onClick={downloadQRImage}
                  className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  Save QR Graphic (.PNG)
                </button>

                <a
                  href={syncUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold rounded-lg transition flex items-center justify-center gap-2 text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Preview Mobile Workshop URL
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Workbench Note */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
            <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-200">Workshop Assembly Tip:</strong>{" "}
              Open this report on mobile to inspect pinouts, GPIO logic levels, and voltage warnings hands-free while soldering or connecting motor drivers.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
