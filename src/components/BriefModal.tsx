import React from 'react';
import { BrandBrain, ContentItem } from '../types';
import { X, Printer, Download, Copy, FileText } from 'lucide-react';
import {
  buildBriefModel,
  generateBriefsHtml,
  generateSingleBriefMarkdown,
  printBriefHtml,
  downloadFile,
  copyToClipboard
} from '../utils/export';

interface BriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
  brand: BrandBrain;
  onEdit: (item: ContentItem) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BriefModal: React.FC<BriefModalProps> = ({
  isOpen,
  onClose,
  item,
  brand,
  onEdit,
  onNotify
}) => {
  if (!isOpen || !item) return null;

  const briefModel = buildBriefModel(item, "Kalender Konten");
  const briefHtml = generateBriefsHtml([briefModel], brand, `Brief: ${item.title}`);
  const briefMd = generateSingleBriefMarkdown(briefModel, brand);
  const brandSlug = (brand.name || "brand").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

  const handleCopy = () => {
    copyToClipboard(briefMd).then(ok => {
      onNotify?.(ok ? "Brief Markdown berhasil disalin!" : "Gagal menyalin brief.", ok ? "success" : "error");
    });
  };

  const handleDownloadHtml = () => {
    downloadFile(`brief-${brandSlug}-${item.id.slice(0, 8)}.html`, briefHtml, "text/html;charset=utf-8");
    onNotify?.("File HTML brief berhasil diunduh.", "success");
  };

  const handleDownloadMd = () => {
    downloadFile(`brief-${brandSlug}-${item.id.slice(0, 8)}.md`, briefMd, "text/markdown;charset=utf-8");
    onNotify?.("File Markdown brief berhasil diunduh.", "success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-[#dce4db] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#edf1eb] flex items-center justify-between bg-[#fafcf9]">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#73857b] mb-1">
              Rencana Konten & Brief Produksi
            </div>
            <h2 className="text-base font-bold text-[#142620] font-heading truncate">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-2.5 bg-[#f5f8f4] border-b border-[#e1e9df] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-[#63756b]">
            Brief lengkap dengan checklist produksi, panduan brand, dan instruksi penempatan
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border border-[#cfded1] bg-white hover:bg-[#edf5ef] text-xs font-semibold text-[#205c49] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin .md</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMd}
              className="px-3 py-1.5 rounded-xl border border-[#cfded1] bg-white hover:bg-[#edf5ef] text-xs font-semibold text-[#205c49] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh .md</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-xl border border-[#cfded1] bg-white hover:bg-[#edf5ef] text-xs font-semibold text-[#205c49] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .html</span>
            </button>
            <button
              type="button"
              onClick={() => printBriefHtml(briefHtml)}
              className="px-3 py-1.5 rounded-xl bg-[#205c49] text-white hover:bg-[#184738] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Content iframe */}
        <div className="flex-1 overflow-y-auto">
          <iframe
            title="Brief Document"
            srcDoc={briefHtml}
            className="w-full h-full min-h-[480px] border-none"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#edf1eb] bg-[#fafcf9] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#d6dfd5] bg-white hover:bg-[#f1f6ef] text-xs font-semibold text-[#52665b] cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="px-5 py-2 rounded-xl bg-[#205c49] hover:bg-[#184738] text-xs font-bold text-white cursor-pointer shadow-xs"
          >
            Edit Konten Ini
          </button>
        </div>
      </div>
    </div>
  );
};
