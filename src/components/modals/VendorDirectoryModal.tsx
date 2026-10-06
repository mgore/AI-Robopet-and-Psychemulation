import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Building2,
  ExternalLink,
  Search,
  ShieldCheck,
  Globe,
  ShoppingBag,
  Filter,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { AUTHORIZED_VENDORS, AuthorizedVendor } from "../../data/vendorsData";

interface VendorDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVendorFilter?: (vendorKeyword: string) => void;
}

export const VendorDirectoryModal: React.FC<VendorDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectVendorFilter
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  if (!isOpen) return null;

  const filteredVendors = AUTHORIZED_VENDORS.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.categorySpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedTag === "all") return true;
    if (selectedTag === "domestic") return vendor.country.includes("100% Domestic");
    if (selectedTag === "sensors") return vendor.categorySpecialty.toLowerCase().includes("sensor");
    if (selectedTag === "actuators") return vendor.categorySpecialty.toLowerCase().includes("motor") || vendor.categorySpecialty.toLowerCase().includes("servo");
    if (selectedTag === "compute") return vendor.categorySpecialty.toLowerCase().includes("mcu") || vendor.categorySpecialty.toLowerCase().includes("som") || vendor.categorySpecialty.toLowerCase().includes("microcontroller") || vendor.categorySpecialty.toLowerCase().includes("raspberry");
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto"
        >
          {/* MODAL HEADER */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  100% NATO-Aligned &amp; Domestic Sourcing
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {AUTHORIZED_VENDORS.length} Authorized Distributors
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-mono mt-1.5">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>Authorized Hardware Vendors Directory</span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-2xl">
                Direct verified links to every authorized manufacturer and distributor storefront in our sourcing database. All vendor links are certified genuine, authentic component supplies.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition cursor-pointer shrink-0"
              title="Close vendor directory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SEARCH & CATEGORY FILTER BAR */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor, city, or component..."
                className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto text-[11px] font-mono">
              <span className="text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: "all", label: "All Vendors" },
                { id: "domestic", label: "100% US Domestic" },
                { id: "compute", label: "MCUs & SOMs" },
                { id: "sensors", label: "Sensors" },
                { id: "actuators", label: "Motors & Servos" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTag(tab.id)}
                  className={`px-2.5 py-1 rounded-md border transition cursor-pointer ${
                    selectedTag === tab.id
                      ? "bg-emerald-950 text-emerald-300 border-emerald-700 font-bold"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* VENDORS GRID LIST */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-100 text-sm font-mono group-hover:text-emerald-400 transition">
                          {vendor.name}
                        </h3>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${vendor.badgeColor}`}>
                          {vendor.country}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>📍 {vendor.headquarters}</span>
                      </div>
                    </div>

                    <a
                      href={vendor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-900 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700 transition shrink-0"
                      title={`Visit official ${vendor.name} website`}
                    >
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>Homepage</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                    {vendor.tagline}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-900 flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-slate-500">Specialty Focus:</span>
                    <span className="text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800/60 leading-tight">
                      {vendor.categorySpecialty}
                    </span>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
                  {onSelectVendorFilter ? (
                    <button
                      onClick={() => {
                        onSelectVendorFilter(vendor.searchKeyword);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 text-[11px] font-bold transition hover:underline cursor-pointer"
                      title={`Filter workshop catalog to ${vendor.name} components`}
                    >
                      <span>Show Catalog Parts</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-slate-600 text-[10px]">Verified Sourced</span>
                  )}

                  <a
                    href={vendor.directStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold border border-emerald-800/80 transition shadow-sm text-[11px]"
                    title={`Open ${vendor.name} robotics storefront catalog`}
                  >
                    <ShoppingBag className="w-3 h-3 text-emerald-400" />
                    <span>Open Store Page</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* MODAL FOOTER */}
          <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 shrink-0">
            <div className="flex items-center gap-2 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                All {AUTHORIZED_VENDORS.length} suppliers are verified authentic, US and NATO-aligned distributors. Unauthorized or non-traceable vendors are strictly omitted.
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition cursor-pointer"
            >
              Close Directory
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
