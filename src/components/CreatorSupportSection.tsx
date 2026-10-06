import React, { useState } from "react";
import {
  QrCode,
  Heart,
  ExternalLink,
  Copy,
  Check,
  Edit3
} from "lucide-react";

interface CreatorSupportSectionProps {
  paypalLink: string;
  onSavePaypalLink: (newLink: string) => void;
  triggerNotification: (msg: string) => void;
}

export const CreatorSupportSection: React.FC<CreatorSupportSectionProps> = ({
  paypalLink,
  onSavePaypalLink,
  triggerNotification
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLink, setTempLink] = useState(paypalLink);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(paypalLink);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 2000);
    triggerNotification("Copied PayPal support link to clipboard!");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLink.trim()) {
      onSavePaypalLink(tempLink.trim());
      setIsEditing(false);
      triggerNotification("Updated PayPal donation link!");
    }
  };

  return (
    <section
      id="creator-paypal-section"
      className="w-full border-t border-slate-800/80 bg-slate-950/95 py-10 px-4 sm:px-6 lg:px-8 mt-12 text-slate-300 font-sans"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* PayPal QR Code Display */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-2.5 shadow-xl border border-slate-300/30 flex items-center justify-center relative overflow-hidden group">
              <img
                src="/paypal-qr.svg"
                alt="PayPal QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-slate-400">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan with phone or PayPal app</span>
            </div>
          </div>

          {/* Details & Direct Link */}
          <div className="flex-1 flex flex-col justify-between text-center sm:text-left w-full space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-mono font-bold mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
                <span>Support &amp; Donations</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-display tracking-tight">
                Support AI RoboPet
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                Scan the QR code or click the direct link below to support ongoing hardware research, open-source robotics, and server compute.
              </p>
            </div>

            {/* Link Bar */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
              {!isEditing ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <a
                      id="footer-paypal-direct-link"
                      href={paypalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2.5 bg-[#0070ba] hover:bg-[#005ea6] text-white font-mono font-bold text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer group"
                      title="Open PayPal Payment / Donation in new tab"
                    >
                      <Heart className="w-4 h-4 text-rose-300 fill-rose-400/40 shrink-0" />
                      <span>Support on PayPal</span>
                      <ExternalLink className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </a>

                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl transition text-xs font-mono flex items-center gap-1 cursor-pointer shrink-0"
                        title="Copy link to clipboard"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="sm:hidden text-xs">Copy</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTempLink(paypalLink);
                          setIsEditing(true);
                        }}
                        className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-700 rounded-xl transition text-xs font-mono cursor-pointer shrink-0"
                        title="Edit PayPal link URL"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 break-all text-center sm:text-left flex items-center gap-1.5 pt-1">
                    <span className="text-slate-500">Destination:</span>
                    <span className="text-cyan-400/90">{paypalLink}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempLink}
                      onChange={(e) => { setTempLink(e.target.value); }}
                      placeholder="https://www.paypal.com/ncp/payment/..."
                      className="flex-1 bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer shrink-0 border-0"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 border-0"
                    >
                      Cancel
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono text-left">
                    Enter your exact PayPal.Me URL or donation page link.
                  </span>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
