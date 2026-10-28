import React, { useState } from 'react';
import { ContentDocument } from '../types';
import {
  Archive,
  Search,
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  generateDocumentMarkdown,
  generateDocumentCSV,
  downloadFile
} from '../utils/export';

interface HistoryViewProps {
  docs: ContentDocument[];
  onOpenDoc: (doc: ContentDocument) => void;
  onDeleteDoc: (id: string) => void;
  onImportDocs: (docs: ContentDocument[]) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  docs,
  onOpenDoc,
  onDeleteDoc,
  onImportDocs,
  onNotify
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = docs.filter(d => {
    const brandName = d.brand?.name || "";
    return (
      searchQuery === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brandName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleBackupAllJson = () => {
    if (docs.length === 0) {
      onNotify?.("Belum ada riwayat dokumen untuk dicadangkan.", "info");
      return;
    }
    const jsonStr = JSON.stringify(docs, null, 2);
    downloadFile(`ruang-konten-semua-proyek-${new Date().toISOString().slice(0, 10)}.json`, jsonStr, "application/json;charset=utf-8");
    onNotify?.("Semua dokumen berhasil dicadangkan ke JSON.", "success");
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        const imported = Array.isArray(parsed) ? parsed : [parsed];
        const valid = imported.filter((d: any) => d && d.id && Array.isArray(d.items));
        if (valid.length === 0) {
          throw new Error("Format file JSON tidak sesuai standar proyek Ruang Konten.");
        }
        onImportDocs(valid);
        onNotify?.(`${valid.length} dokumen berhasil diimpor ke riwayat.`, "success");
      } catch (err: any) {
        onNotify?.(err.message || "Gagal membaca file JSON cadangan.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#dce4db] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eaf2ea] border border-[#d3e3d1] flex items-center justify-center text-[#205c49]">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#142620] font-heading">
              Arsip & Riwayat Proyek
            </h2>
            <p className="text-xs text-[#687a70]">
              Kelola, cadangkan, dan buka kembali draf strategi konten yang pernah Anda buat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl border border-[#d6dfd5] bg-[#fafcf9] hover:bg-white text-xs font-semibold text-[#183127] cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-[#205c49]" />
            <span>Impor JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
          <button
            onClick={handleBackupAllJson}
            className="px-3.5 py-2 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cadangkan Semua JSON</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-[#dce4db]">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#819488] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul proyek atau nama brand..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#d6dfd5] outline-none focus:border-[#205c49]"
          />
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-[#d1ded0] bg-[#fafcf9] text-center max-w-md mx-auto space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#eaf2ea] text-[#205c49] flex items-center justify-center mx-auto mb-2">
            <Archive className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#142620]">Tidak ada proyek yang sesuai</h3>
          <p className="text-xs text-[#718278]">
            Mulai susun kalender konten Anda di menu Rencana Konten.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => {
            const approvedCount = doc.items.filter(it => it.status === 'approved').length;
            const brandSlug = (doc.brand?.name || "brand").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");

            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl border border-[#dce4db] p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-[#eaf4e9] px-2 py-0.5 rounded-md">
                      Kalender Konten
                    </span>
                    <span className="text-[10px] text-[#718278] font-mono">
                      {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#142620] font-heading mb-1 line-clamp-2">
                    {doc.title}
                  </h3>
                  <div className="text-xs text-[#52665b] mb-3">
                    Brand: <strong>{doc.brand?.name || "Brand"}</strong> • Sumber:{" "}
                    {doc.source === "gemini" ? "Gemini AI" : "Template"}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#718278] bg-[#fafcf9] p-2 rounded-xl border border-[#edf2ea]">
                    <span>Total: <strong>{doc.items.length}</strong> konten</span>
                    <span>•</span>
                    <span className="text-emerald-700">Disetujui: <strong>{approvedCount}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#edf1eb] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const md = generateDocumentMarkdown(doc);
                        downloadFile(`ruang-konten-${brandSlug}-${doc.id.slice(0, 6)}.md`, md, "text/markdown;charset=utf-8");
                        onNotify?.("Markdown berhasil diunduh.", "success");
                      }}
                      className="p-1.5 rounded-lg border border-[#d6dfd5] text-[#52665b] hover:text-[#205c49] hover:bg-[#f1f6ef] cursor-pointer"
                      title="Unduh Markdown"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const csv = generateDocumentCSV(doc);
                        downloadFile(`ruang-konten-${brandSlug}-${doc.id.slice(0, 6)}.csv`, csv, "text/csv;charset=utf-8");
                        onNotify?.("CSV berhasil diunduh.", "success");
                      }}
                      className="p-1.5 rounded-lg border border-[#d6dfd5] text-[#52665b] hover:text-[#205c49] hover:bg-[#f1f6ef] cursor-pointer"
                      title="Unduh CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus proyek "${doc.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
                          onDeleteDoc(doc.id);
                          onNotify?.("Proyek dihapus dari riwayat.", "info");
                        }
                      }}
                      className="p-1.5 rounded-lg border border-[#d6dfd5] text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDoc(doc)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Buka Proyek</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
