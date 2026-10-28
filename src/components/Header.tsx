import React, { useState } from 'react';
import { BrandBrain, ContentDocument } from '../types';
import {
  Menu,
  Download,
  FileText,
  FileSpreadsheet,
  Share2,
  Key
} from 'lucide-react';
import {
  buildBriefModel,
  generateBriefsHtml,
  generateDocumentMarkdown,
  generateDocumentCSV,
  generatePublishPackJson,
  downloadFile,
  printBriefHtml
} from '../utils/export';

interface HeaderProps {
  currentView: string;
  activeDoc: ContentDocument | null;
  brand: BrandBrain;
  useAI?: boolean;
  onToggleAI?: (useAI: boolean) => void;
  onOpenBrandModal?: () => void;
  onOpenApiKeyModal?: () => void;
  onOpenStrategistModal?: () => void;
  onOpenDesktopModal?: () => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onToggleMobileMenu?: () => void;
  onSelectView?: (view: string) => void;
  onOpenPool?: () => void;
  onOpenConnections?: () => void;
  approvedCount?: number;
  connectedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeDoc,
  brand,
  onNotify,
  onOpenApiKeyModal,
  onToggleMobileMenu,
  onSelectView,
  onOpenPool,
  onOpenConnections,
  approvedCount = 0,
  connectedCount = 0
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  const getViewTitle = () => {
    if (currentView === 'brand') return 'Kelola Profil Brand';
    if (currentView === 'history') return 'Arsip & Cadangan Proyek';
    if (currentView === 'tools') return 'Asisten Copywriting & Hook';
    if (currentView === 'publish_calendar') return 'Ruang Tayang (Auto-Publisher)';
    return 'Ruang Rencana Konten';
  };

  const handleExport = (format: 'md' | 'csv' | 'json' | 'pack-json' | 'brief-html' | 'brief-md' | 'brief-print') => {
    if (!activeDoc || !activeDoc.items?.length) {
      onNotify?.('Belum ada konten aktif untuk diekspor.', 'info');
      setExportOpen(false);
      return;
    }

    const brandSlug = (activeDoc.brand?.name || brand.name || "brand").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    const baseName = `ruang-konten-${activeDoc.module}-${brandSlug}-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'pack-json') {
      const packJson = generatePublishPackJson(activeDoc, activeDoc.brand || brand);
      downloadFile(`${brandSlug}-pack-siap-tayang-${new Date().toISOString().slice(0, 10)}.rkpack.json`, packJson, 'application/json;charset=utf-8');
      onNotify?.('Paket Naskah Siap Tayang (.rkpack.json) berhasil diekspor untuk Ruang Kalender!', 'success');
    } else if (format === 'md') {
      const md = generateDocumentMarkdown(activeDoc);
      downloadFile(`${baseName}.md`, md, 'text/markdown;charset=utf-8');
      onNotify?.('File Markdown berhasil diunduh.', 'success');
    } else if (format === 'csv') {
      const csv = generateDocumentCSV(activeDoc);
      downloadFile(`${baseName}.csv`, csv, 'text/csv;charset=utf-8');
      onNotify?.('File CSV berhasil diunduh untuk Excel / Google Sheets.', 'success');
    } else if (format === 'json') {
      const json = JSON.stringify(activeDoc, null, 2);
      downloadFile(`${baseName}.json`, json, 'application/json;charset=utf-8');
      onNotify?.('File JSON proyek berhasil dicadangkan.', 'success');
    } else if (format === 'brief-html') {
      const models = activeDoc.items.map(it => buildBriefModel(it, "Kalender Konten"));
      const html = generateBriefsHtml(models, activeDoc.brand || brand, `Brief Produksi: ${activeDoc.title}`);
      downloadFile(`brief-produksi-${brandSlug}-${new Date().toISOString().slice(0, 10)}.html`, html, 'text/html;charset=utf-8');
      onNotify?.('Brief Produksi HTML berhasil diunduh.', 'success');
    } else if (format === 'brief-md') {
      const models = activeDoc.items.map(it => buildBriefModel(it, "Kalender Konten"));
      const html = generateBriefsHtml(models, activeDoc.brand || brand, `Brief Produksi: ${activeDoc.title}`);
      const md = generateDocumentMarkdown(activeDoc);
      downloadFile(`brief-produksi-${brandSlug}-${new Date().toISOString().slice(0, 10)}.md`, md, 'text/markdown;charset=utf-8');
      onNotify?.('Brief Produksi Markdown berhasil diunduh.', 'success');
    } else if (format === 'brief-print') {
      const models = activeDoc.items.map(it => buildBriefModel(it, "Kalender Konten"));
      const html = generateBriefsHtml(models, activeDoc.brand || brand, `Brief Produksi: ${activeDoc.title}`);
      printBriefHtml(html);
    }

    setExportOpen(false);
  };

  return (
    <header className="h-16 border-b border-[#e3e8e2] bg-white/95 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Title & mobile menu */}
      <div className="flex items-center gap-3 text-xs min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 -ml-1 text-[#52665b] hover:text-[#183127] rounded-lg hover:bg-[#f1f5ef] cursor-pointer"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#728378] font-medium hidden sm:inline">Ruang Kerja</span>
          <span className="text-[#b5c2b9] hidden sm:inline">/</span>
          <span className="font-semibold text-[#183127] font-heading text-sm truncate">
            {getViewTitle()}
          </span>

          {/* Mode Switcher Pill */}
          {onSelectView && (
            <div className="hidden md:flex items-center bg-[#f1f5ef] p-0.5 rounded-xl border border-[#dce5db] ml-3">
              <button
                type="button"
                onClick={() => onSelectView('plan')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'plan'
                    ? 'bg-[#205c49] text-white shadow-2xs'
                    : 'text-[#4e6357] hover:text-[#183127]'
                }`}
              >
                📋 Ruang Rencana
              </button>
              <button
                type="button"
                onClick={() => onSelectView('publish_calendar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === 'publish_calendar'
                    ? 'bg-[#205c49] text-white shadow-2xs'
                    : 'text-[#4e6357] hover:text-[#183127]'
                }`}
              >
                📅 Ruang Tayang
              </button>
            </div>
          )}

          {activeDoc?.items && activeDoc.items.length > 0 && currentView === 'plan' && (
            <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ecf3ea] text-[#245946] border border-[#d2e2d0]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {activeDoc.items.length} konten
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Kantong Naskah Button */}
        {onOpenPool && (
          <button
            type="button"
            onClick={onOpenPool}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-xs font-bold text-amber-900 transition-all cursor-pointer shadow-2xs"
            title="Buka Kantong Naskah Siap Tayang"
          >
            <span>📥</span>
            <span className="hidden sm:inline">Kantong Naskah</span>
            {approvedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-600 text-white">
                {approvedCount}
              </span>
            )}
          </button>
        )}

        {/* Koneksi 5 Platform Button */}
        {onOpenConnections && (
          <button
            type="button"
            onClick={onOpenConnections}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] border border-[#dce4db] text-xs font-semibold text-[#183127] transition-all cursor-pointer shadow-2xs"
            title="Kelola Token 5 Platform (FB, IG, Threads, TikTok, YT) & Cloudflare R2"
          >
            <span>🌐</span>
            <span>{connectedCount}/5 Platform</span>
          </button>
        )}

        {onOpenApiKeyModal && (
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] border border-[#dce4db] text-xs font-semibold text-[#183127] transition-all cursor-pointer shadow-2xs"
            title="Pengaturan Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-[#205c49]" />
            <span className="hidden sm:inline">API Key</span>
          </button>
        )}

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] border border-[#dce4db] text-xs font-semibold text-[#183127] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#52665b]" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>

          {exportOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setExportOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#dce4db] py-2 z-40 text-xs animate-in fade-in">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#819287]">
                  Distribusi & Publikasi
                </div>
                <button
                  onClick={() => handleExport('pack-json')}
                  className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 flex items-center gap-2.5 text-[#183127] font-semibold cursor-pointer border-b border-[#edf1eb]"
                >
                  <span className="text-base">🚀</span>
                  <div>
                    <div className="text-emerald-800 flex items-center gap-1.5 font-bold">
                      Paket Ruang Kalender
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider">Baru</span>
                    </div>
                    <div className="text-[10px] text-[#52665b] font-normal">Format .rkpack.json untuk App Kalender</div>
                  </div>
                </button>

                <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold text-[#819287]">
                  Format Dokumen
                </div>
                <button
                  onClick={() => handleExport('md')}
                  className="w-full text-left px-3 py-2 hover:bg-[#f2f6f0] flex items-center gap-2 text-[#24382d] font-medium cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div>Markdown (.md)</div>
                    <div className="text-[10px] text-[#718278]">Format naskah rapi</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-2 hover:bg-[#f2f6f0] flex items-center gap-2 text-[#24382d] font-medium cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-sky-700" />
                  <div>
                    <div>Tabel CSV (.csv)</div>
                    <div className="text-[10px] text-[#718278]">Untuk Excel / Sheets</div>
                  </div>
                </button>

                <div className="h-px bg-[#edf1eb] my-1" />
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#819287]">
                  Brief Produksi Tim
                </div>
                <button
                  onClick={() => handleExport('brief-html')}
                  className="w-full text-left px-3 py-2 hover:bg-[#f2f6f0] flex items-center gap-2 text-[#24382d] font-medium cursor-pointer"
                >
                  <span className="text-sm">📄</span>
                  <div>
                    <div>Brief Produksi (.html)</div>
                    <div className="text-[10px] text-[#718278]">Siap cetak / browser view</div>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('brief-print')}
                  className="w-full text-left px-3 py-2 hover:bg-[#f2f6f0] flex items-center gap-2 text-[#24382d] font-medium cursor-pointer"
                >
                  <span className="text-sm">🖨</span>
                  <div>
                    <div>Cetak Semua Brief / PDF</div>
                    <div className="text-[10px] text-[#718278]">Buka print dialog</div>
                  </div>
                </button>

                <div className="h-px bg-[#edf1eb] my-1" />
                <button
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-3 py-2 hover:bg-[#f2f6f0] flex items-center gap-2 text-[#24382d] font-medium cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-amber-700" />
                  <div>
                    <div>Cadangan JSON Proyek</div>
                    <div className="text-[10px] text-[#718278]">Bisa diimpor kembali</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
