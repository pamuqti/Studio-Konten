import React from 'react';
import { BrandBrain, ContentDocument } from '../types';
import {
  Calendar,
  Sparkles,
  Archive,
  ChevronRight,
  Compass,
  FileText,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  brand: BrandBrain;
  brands?: BrandBrain[];
  onSelectBrand?: (id: string) => void;
  onOpenBrandModal: () => void;
  onOpenStrategistModal: () => void;
  docs: ContentDocument[];
  syncStatus?: 'synced' | 'saving' | 'error';
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenDesktopModal?: () => void;
  onOpenApiKeyModal?: () => void;
  onOpenConnectionsModal?: () => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  brand,
  brands,
  onSelectBrand,
  onOpenBrandModal,
  onOpenStrategistModal,
  docs,
  syncStatus = 'synced',
  mobileOpen = false,
  onCloseMobile,
  onOpenDesktopModal,
  onOpenApiKeyModal,
  onOpenConnectionsModal,
  onNotify
}) => {
  const brandColor = brand.color || "#205c49";
  const brandName = brand.name || "Ruang Brand";
  const brandCategory = brand.category || "Atur profil brand";

  const planDocsCount = docs.filter(d => d.module === 'plan').length;

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-[#eae6f3] flex flex-col h-full select-none">
      {/* Brand & Logo Header */}
      <div className="p-5 border-b border-[#f0ecf7]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              r.
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight font-heading text-[#1b152c]">
                Ruang Konten
              </div>
              <div className="text-[10px] text-[#736c87] font-medium tracking-wide uppercase">
                Studio Strategi Brand
              </div>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-[#728378] hover:text-[#183127] rounded-lg cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Brand Brain Switcher Box */}
        <button
          onClick={() => {
            onSelectView('brand');
            onCloseMobile?.();
          }}
          className={`mt-4 w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group cursor-pointer ${
            currentView === 'brand'
              ? 'bg-[#205c49] text-white border-[#205c49] shadow-sm'
              : 'bg-[#f5f8f4] hover:bg-[#ebf2ea] border-[#dce5db]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white shadow-xs"
              style={{ backgroundColor: brandColor }}
            />
            <div className="truncate">
              <div
                className={`text-xs font-bold truncate flex items-center gap-1.5 ${
                  currentView === 'brand' ? 'text-white' : 'text-[#183127]'
                }`}
              >
                <span>{brandName}</span>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                    currentView === 'brand'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f4f1fa] text-[#6c43e3]'
                  }`}
                >
                  Profil Aktif
                </span>
                {brands && brands.length > 1 && (
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                      currentView === 'brand'
                        ? 'bg-white/10 text-[#c4b5fd] border border-white/20'
                        : 'bg-[#f0f4ee] text-[#55695e] border border-[#d6dfd4]'
                    }`}
                  >
                    {brands.length} Profil
                  </span>
                )}
              </div>
              <div
                className={`text-[10px] truncate ${
                  currentView === 'brand' ? 'text-[#c4b5fd]' : 'text-[#718278]'
                }`}
              >
                {brandCategory}
              </div>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-all shrink-0 ${
              currentView === 'brand'
                ? 'text-[#a5b4fc] translate-x-0.5'
                : 'text-[#8b9c91] group-hover:text-[#6c43e3] group-hover:translate-x-0.5'
            }`}
          />
        </button>

        {/* AI Strategist Button */}
        <button
          onClick={() => {
            onOpenStrategistModal();
            onCloseMobile?.();
          }}
          className="mt-2.5 w-full p-2.5 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white flex items-center justify-between text-left shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-[#ffd188] group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Konsultasi AI</div>
              <div className="text-[10px] text-[#c4b5fd]">Arahkan maksud konten</div>
            </div>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Alur Kerja Konten */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#736c87] flex items-center justify-between">
            <span>Alur Kerja Konten</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#f4f1fa] text-[#6c43e3] font-bold border border-[#eae6f3]">
              Terintegrasi
            </span>
          </div>
          <nav className="space-y-1">
            {/* 1. Ruang Rencana */}
            <button
              onClick={() => {
                onSelectView('plan');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                currentView === 'plan'
                  ? 'bg-[#1b152c] text-white shadow-sm font-semibold'
                  : 'text-[#736c87] hover:bg-[#f4f1fa] hover:text-[#1b152c]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText
                  className={`w-4 h-4 shrink-0 ${
                    currentView === 'plan' ? 'text-[#a5b4fc]' : 'text-[#6c43e3]'
                  }`}
                />
                <div className="truncate">
                  <div className="truncate font-semibold">1. Ruang Rencana</div>
                  <div
                    className={`text-[10px] truncate ${
                      currentView === 'plan' ? 'text-[#c4b5fd]' : 'text-[#7e9084]'
                    }`}
                  >
                    Ide AI, Naskah & Brief
                  </div>
                </div>
              </div>
              {planDocsCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    currentView === 'plan'
                      ? 'bg-emerald-800 text-[#c4b5fd]'
                      : 'bg-[#f4f1fa] text-[#6c43e3]'
                  }`}
                >
                  {planDocsCount}
                </span>
              )}
            </button>

            {/* 2. Ruang Tayang / Auto-Publisher */}
            <button
              onClick={() => {
                onSelectView('publish_calendar');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                currentView === 'publish_calendar'
                  ? 'bg-[#1b152c] text-white shadow-sm font-semibold'
                  : 'text-[#736c87] hover:bg-[#f4f1fa] hover:text-[#1b152c]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Calendar
                  className={`w-4 h-4 shrink-0 ${
                    currentView === 'publish_calendar' ? 'text-[#a5b4fc]' : 'text-emerald-700'
                  }`}
                />
                <div className="truncate">
                  <div className="truncate font-semibold flex items-center gap-1.5">
                    <span>2. Ruang Tayang</span>
                    <span className="px-1 py-0.2 rounded text-[8px] bg-amber-400 text-amber-950 font-bold uppercase">5 API</span>
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      currentView === 'publish_calendar' ? 'text-[#c4b5fd]' : 'text-[#7e9084]'
                    }`}
                  >
                    Kalender & Auto-Publisher
                  </div>
                </div>
              </div>
            </button>
          </nav>
        </div>

        {/* Distribusi & Integrasi Platform */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#736c87]">
            Integrasi Sosial Media
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => {
                onOpenConnectionsModal?.();
                onCloseMobile?.();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#736c87] hover:bg-[#f4f1fa] hover:text-[#1b152c] transition-all text-left cursor-pointer border border-transparent hover:border-[#dce5db]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🌐</span>
                <div>
                  <div className="font-semibold text-xs">Koneksi 5 Platform</div>
                  <div className="text-[10px] text-[#788a7f]">FB, IG, Threads, TikTok, YT</div>
                </div>
              </div>
            </button>
          </nav>
        </div>


        {/* Arsip & Riwayat */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#736c87]">
            Penyimpanan
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => {
                onSelectView('history');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                currentView === 'history'
                  ? 'bg-[#1b152c] text-white shadow-sm font-semibold'
                  : 'text-[#736c87] hover:bg-[#f4f1fa] hover:text-[#1b152c]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Archive
                  className={`w-4 h-4 shrink-0 ${
                    currentView === 'history' ? 'text-[#a5b4fc]' : 'text-[#736c87]'
                  }`}
                />
                <span>Arsip & Riwayat</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  currentView === 'history'
                    ? 'bg-emerald-800 text-[#c4b5fd]'
                    : 'bg-[#f4f1fa] text-[#6c43e3]'
                }`}
              >
                {docs.length}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-white h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
