import React, { useState, useMemo } from 'react';
import { BrandBrain, ContentDocument, ContentItem, ContentPlanOptions, ContentStatus } from '../types';
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Table as TableIcon,
  Kanban,
  PenLine,
  Trash2,
  Clock,
  Flame,
  Sparkles,
  Zap,
  Compass,
  Check,
  CircleCheck
} from 'lucide-react';
import {
  platformsData,
  placementTypesData,
  funnelStagesData,
  defaultPillars
} from '../data/platforms';
import { generatePublishPackJson, downloadFile } from '../utils/export';

interface CalendarViewProps {
  document: ContentDocument | null;
  brand: BrandBrain;
  useAI: boolean;
  isGenerating: boolean;
  onGenerate: (options: ContentPlanOptions) => void;
  onOpenStrategistModal: () => void;
  onEditItem: (item: ContentItem) => void;
  onViewBrief: (item: ContentItem) => void;
  onAddItem: (item: ContentItem) => void;
  onUpdateItem: (item: ContentItem) => void;
  onDeleteItems: (ids: string[]) => void;
  onBulkUpdateItems?: (items: ContentItem[]) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  document,
  brand,
  useAI,
  isGenerating,
  onGenerate,
  onOpenStrategistModal,
  onEditItem,
  onViewBrief,
  onAddItem,
  onDeleteItems,
  onBulkUpdateItems,
  onStatusChange,
  onNotify
}) => {
  const getAccountHandle = (platform: string, b: BrandBrain) => {
    const accs = b.platformAccounts || {};
    let handle = "@" + (b.name.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand");
    if (platform === "Instagram") return accs.instagram || b.instagramHandle || handle;
    if (platform === "TikTok") return accs.tiktok || handle;
    if (platform === "Threads") return accs.threads || handle;
    if (platform === "LinkedIn") return accs.linkedin || `company/${handle.replace("@", "")}`;
    if (platform === "YouTube") return accs.youtube || handle;
    if (platform === "Facebook") return accs.facebook || handle;
    return handle;
  };

  const [topic, setTopic] = useState(document?.options?.topic || "Rutinitas & Solusi Keseharian");
  const [trendContext, setTrendContext] = useState(document?.options?.trendContext || "");
  const [goal, setGoal] = useState(document?.options?.goal || "Awareness");
  const [count, setCount] = useState<number>(document?.options?.count || 30);
  const [startDate, setStartDate] = useState(document?.options?.start || new Date().toISOString().slice(0, 10));

  const [viewMode, setViewMode] = useState<'table' | 'calendar' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPillar, setFilterPillar] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterPlacement, setFilterPlacement] = useState("all");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    Array.isArray(document?.options?.contentTypes) ? document.options.contentTypes : []
  );
  const [selectedFunnelStages, setSelectedFunnelStages] = useState<string[]>(
    Array.isArray(document?.options?.funnelStages) ? document.options.funnelStages : []
  );

  const handleSubmitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      topic,
      trendContext: trendContext.trim() || undefined,
      goal: selectedFunnelStages.length
        ? selectedFunnelStages.map(s => funnelStagesData[s]?.short).filter(Boolean).join(" + ")
        : goal,
      platform: "Semua Platform",
      count,
      start: startDate,
      contentTypes: selectedContentTypes.length ? selectedContentTypes : undefined,
      funnelStages: selectedFunnelStages.length ? selectedFunnelStages : undefined
    });
  };

  const items = document?.items || [];

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (filteredItems.length === 0) return;
    const allSelected = filteredItems.every(it => selectedIds.has(it.id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        filteredItems.forEach(it => next.delete(it.id));
      } else {
        filteredItems.forEach(it => next.add(it.id));
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const n = selectedIds.size;
    if (window.confirm(`Yakin ingin menghapus ${n} konten terpilih dari rencana ini?`)) {
      onDeleteItems(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleExportSelectedToCalendar = () => {
    if (selectedIds.size === 0 || !document) return;
    const brandSlug = (document.brand?.name || brand.name || "brand").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    const packJson = generatePublishPackJson(document, document.brand || brand, Array.from(selectedIds));
    downloadFile(`${brandSlug}-selected-${selectedIds.size}-pack.rkpack.json`, packJson, 'application/json;charset=utf-8');
    onNotify?.(`${selectedIds.size} konten terpilih berhasil diekspor sebagai paket Ruang Kalender (.rkpack.json)!`, 'success');
  };

  const handleDeleteOne = (id: string, title?: string) => {
    if (window.confirm(`Hapus konten "${title || "ini"}" dari rencana?`)) {
      onDeleteItems([id]);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBatchStatus = (newStatus: ContentStatus) => {
    if (selectedIds.size === 0 || !onBulkUpdateItems) return;
    const updated = items.map(it => (selectedIds.has(it.id) ? { ...it, status: newStatus } : it));
    onBulkUpdateItems(updated);
    onNotify?.(`Status ${selectedIds.size} konten terpilih diubah menjadi "${newStatus}".`, 'success');
  };

  const handleAddManualItem = () => {
    const today = new Date().toISOString().slice(0, 10);
    const placementType = "Video Pendek";
    const targetPlacements = placementTypesData[placementType].targetPlacements.join(", ");
    const platform = "TikTok";
    const targetHandle = getAccountHandle(platform, brand);

    const newItem: ContentItem = {
      id: "item-" + Date.now(),
      title: `${String(items.length + 1).padStart(2, "0")} · [${placementType}] Konten Baru`,
      status: "draft",
      fields: {
        Tanggal: today,
        "Jam Tayang": "19:00 WIB",
        "Tipe Placement": placementType,
        Penempatan: targetPlacements,
        Platform: platform,
        "Akun Target": targetHandle,
        Pilar: "Edukasi & Tips",
        Hook: "",
        "Sudut Konten": "",
        "Brief Visual": "",
        Caption: "",
        CTA: brand.cta || "Simpan postingan ini!",
        Checklist: "unchecked"
      }
    };
    onAddItem(newItem);
    onEditItem(newItem);
  };

  const platformCounts = useMemo(() => {
    const res: Record<string, number> = { all: items.length };
    Object.keys(platformsData).forEach(k => {
      res[k] = 0;
    });
    items.forEach(it => {
      const p = it.fields.Platform || "Instagram";
      const comb = (it.fields.Penempatan || "") + " " + p;
      Object.keys(platformsData).forEach(k => {
        if (comb.toLowerCase().includes(k.toLowerCase())) {
          res[k] = (res[k] || 0) + 1;
        }
      });
    });
    return res;
  }, [items]);

  const filteredItems = items.filter(it => {
    const matchSearch =
      searchQuery === "" ||
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(it.fields).toLowerCase().includes(searchQuery.toLowerCase());
    const matchPillar = filterPillar === "all" || it.fields.Pilar === filterPillar;
    const matchStatus = filterStatus === "all" || it.status === filterStatus;
    const placement = it.fields["Tipe Placement"] || "";
    const matchPlacement =
      filterPlacement === "all" ||
      placement.toLowerCase() === filterPlacement.toLowerCase() ||
      (it.fields.Format || "").toLowerCase().includes(filterPlacement.toLowerCase());
    const platform = it.fields.Platform || "Instagram";
    const comb = (it.fields.Penempatan || "") + " " + platform;
    const matchPlatform =
      filterPlatform === "all" ||
      platform.toLowerCase() === filterPlatform.toLowerCase() ||
      comb.toLowerCase().includes(filterPlatform.toLowerCase());

    return matchSearch && matchPillar && matchStatus && matchPlacement && matchPlatform;
  });

  const getPillarColor = (pilar?: string) => {
    const found = defaultPillars.find(p => p.name === pilar);
    return found ? found.color : "bg-stone-100 text-stone-700 border-stone-200";
  };

  const getFunnelBadgeStyle = (label?: string) => {
    if (!label) return {};
    if (/^TOFU/.test(label)) return { background: "#e0f2fe", color: "#075985", border: "1px solid #bae6fd" };
    if (/^MOFU/.test(label)) return { background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" };
    if (/^BOFU/.test(label)) return { background: "#ffe4e6", color: "#9f1239", border: "1px solid #fecdd3" };
    return { background: "#ede9fe", color: "#5b21b6", border: "1px solid #ddd6fe" };
  };

  const calculatedPlatformsPerDay = selectedContentTypes.length
    ? Object.keys(platformsData).filter(pf =>
        selectedContentTypes.some(ct =>
          placementTypesData[ct]?.targetPlacements.some(pl => pl.toLowerCase().includes(pf.toLowerCase()))
        )
      ).length
    : 6;

  return (
    <div className="space-y-6">
      {/* Interactive AI Strategist Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#1b152c] via-[#352559] to-[#6c43e3] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm text-white">
                Konsultasi Interaktif AI (Chat Gemini)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-extrabold uppercase">
                Rekomendasi
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed max-w-xl">
              Arahkan maksud, target penjualan, dan tema konten Anda bersama Gemini terlebih dahulu sebelum menyusun kalender editorial 30 hari.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenStrategistModal}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-[#17382d] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Mulai Konsultasi Chat</span>
        </button>
      </div>

      {/* Main Generator Box */}
      <section className="bg-white rounded-3xl border border-[#eae6f3] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#f0ecf7] flex flex-wrap items-center justify-between gap-3 bg-[#fafcf9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f4f1fa] border border-[#d3e3d1] flex items-center justify-center text-[#6c43e3]">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1b152c] font-heading">
                Kalender Editorial Konten
              </h2>
              <p className="text-xs text-[#687a70]">
                Rancang agenda terstruktur 1, 3, 7, 14, atau 30 hari untuk {brand.name}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#5c6e64]">
            <span>Mode:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-semibold ${
                useAI
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-emerald-100 text-emerald-900 border border-emerald-300"
              }`}
            >
              {useAI ? "Gemini AI Brain" : "Template Pola Terkurasi"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmitPlan} className="p-5 sm:p-6 space-y-5">
          {/* Omnichannel Explanation Notice */}
          <div className="p-3.5 rounded-2xl bg-[#f2f7f3] border border-[#d2e4d4] flex items-start gap-3 text-xs text-[#204031]">
            <span className="text-lg">🎯</span>
            <div className="flex-1">
              <div className="font-bold text-[#1b152c]">
                Omnichannel Harian: Minimal 1 Core Konten per Platform Setiap Hari
              </div>
              <p className="text-[11px] text-[#486354] mt-0.5 leading-relaxed">
                Setiap hari kalender memuat minimal 1 core konten spesifik untuk{" "}
                <strong>seluruh platform resmi</strong>: <strong>Instagram</strong> (Carousel/Feed),{" "}
                <strong>TikTok</strong> (Video Pendek FYP), <strong>Threads</strong> (Microblogging),{" "}
                <strong>LinkedIn</strong> (PDF Slide/Studi Kasus), <strong>YouTube</strong> (Shorts + 1 Video Panjang per minggu), dan{" "}
                <strong>Facebook</strong> (Post Gambar Komunitas). Tiap konten disesuaikan format placement & jam tayang primernya.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1b152c] mb-1.5">
                Topik / Fokus Kampanye
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Contoh: Edukasi Kopi & Peluncuran Cold Brew"
                className="w-full px-3 py-2 rounded-xl border border-[#eae6f3] text-xs focus:ring-2 focus:ring-[#6c43e3]/30 focus:border-[#6c43e3] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600 inline" />
                  <span>Sambungkan Tren / Isu Terkini</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">Opsional</span>
              </label>
              <input
                type="text"
                value={trendContext}
                onChange={e => setTrendContext(e.target.value)}
                placeholder="Contoh: Sound POV 'Gak Bahaya Ta', meme kantor, dll."
                className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none bg-rose-50/20 placeholder:text-stone-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:col-span-2 lg:col-span-1">
              <div>
                <label className="block text-xs font-semibold text-[#1b152c] mb-1.5 truncate">
                  Tujuan
                </label>
                <select
                  value={goal}
                  disabled={selectedFunnelStages.length > 0}
                  onChange={e => setGoal(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-[#eae6f3] text-xs focus:ring-2 focus:ring-[#6c43e3]/30 focus:border-[#6c43e3] outline-none bg-white font-medium cursor-pointer"
                >
                  <option value="Awareness">Awareness</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Interaksi">Interaksi</option>
                  <option value="Penjualan">Penjualan</option>
                  <option value="Peluncuran Produk">Launching</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b152c] mb-1.5 truncate">
                  Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-[#eae6f3] text-xs focus:ring-2 focus:ring-[#6c43e3]/30 focus:border-[#6c43e3] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b152c] mb-1.5 truncate">
                  Rentang
                </label>
                <select
                  value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl border border-[#eae6f3] text-xs focus:ring-2 focus:ring-[#6c43e3]/30 focus:border-[#6c43e3] outline-none bg-white font-semibold cursor-pointer"
                >
                  <option value={1}>1 Hari ({calculatedPlatformsPerDay} Post)</option>
                  <option value={3}>3 Hari (Mini Sprint • {3 * calculatedPlatformsPerDay} Post)</option>
                  <option value={7}>7 Hari (1 Minggu • {7 * calculatedPlatformsPerDay} Post)</option>
                  <option value={14}>14 Hari (2 Minggu • {14 * calculatedPlatformsPerDay} Post)</option>
                  <option value={30}>30 Hari (1 Bulan • {30 * calculatedPlatformsPerDay} Post)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Funnel Stage Selector */}
          <div className="p-4 rounded-2xl border border-[#d2e4d4] bg-[#fafcf9] space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-1.5">
              <div className="text-xs font-bold text-[#1b152c] flex items-center gap-1.5">
                <span>🎯 Pilih Tujuan Konten (Tahap Funnel)</span>
              </div>
              <div className="text-[11px] text-[#687a70]">
                Pilih satu atau lebih. Menentukan hook, pilar, dan CTA tiap konten.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedFunnelStages([])}
                className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedFunnelStages.length === 0
                    ? "border-2 border-[#6c43e3] bg-[#f4f1fa] shadow-xs"
                    : "border-[#eae6f3] bg-white hover:bg-[#f8f7fc]"
                }`}
              >
                <div>
                  <span className="text-xl block mb-1">⚖️</span>
                  <div className="text-xs font-bold text-[#1b152c]">Otomatis (Rasio Brand Brain)</div>
                  <div className="text-[10.5px] text-[#5c6e64] mt-1 leading-relaxed">
                    Semua tahap dibagi proporsional sesuai acuan Brand Brain
                  </div>
                </div>
                {selectedFunnelStages.length === 0 && (
                  <span className="text-[10px] font-bold text-[#6c43e3] mt-2 block">✓ Terpilih</span>
                )}
              </button>

              {Object.entries(funnelStagesData).map(([k, s]) => {
                const isSelected = selectedFunnelStages.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setSelectedFunnelStages(prev =>
                        prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
                      );
                    }}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-2 border-[#6c43e3] bg-[#f4f1fa] shadow-xs"
                        : "border-[#eae6f3] bg-white hover:bg-[#f8f7fc]"
                    }`}
                  >
                    <div>
                      <span className="text-xl block mb-1">{s.icon}</span>
                      <div className="text-xs font-bold text-[#1b152c]">{s.title}</div>
                      <div className="text-[10.5px] text-[#5c6e64] mt-1 leading-relaxed">
                        {s.goal}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#6c43e3] mt-2 block">✓ Terpilih</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="p-4 rounded-2xl border border-[#d2e4d4] bg-[#fafcf9] space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-1.5">
              <div className="text-xs font-bold text-[#1b152c]">
                🎴 Pilih Tipe Konten yang Akan Dibuat
              </div>
              <div className="text-[11px] text-[#687a70]">
                Pilih satu atau lebih. Kalender hanya berisi tipe yang dipilih.
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              <button
                type="button"
                onClick={() => setSelectedContentTypes([])}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedContentTypes.length === 0
                    ? "border-2 border-[#6c43e3] bg-[#f4f1fa] shadow-xs"
                    : "border-[#eae6f3] bg-white hover:bg-[#f8f7fc]"
                }`}
              >
                <div>
                  <span className="text-lg block mb-0.5">✨</span>
                  <div className="text-xs font-bold text-[#1b152c]">Semua Tipe</div>
                  <div className="text-[10px] text-[#5c6e64] mt-0.5">Omnichannel harian</div>
                </div>
                {selectedContentTypes.length === 0 && (
                  <span className="text-[9px] font-bold text-[#6c43e3] mt-1.5 block">✓ Aktif</span>
                )}
              </button>

              {Object.entries(placementTypesData).map(([k, t]) => {
                const isSelected = selectedContentTypes.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setSelectedContentTypes(prev =>
                        prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
                      );
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-2 border-[#6c43e3] bg-[#f4f1fa] shadow-xs"
                        : "border-[#eae6f3] bg-white hover:bg-[#f8f7fc]"
                    }`}
                  >
                    <div>
                      <span className="text-lg block mb-0.5">{t.icon}</span>
                      <div className="text-xs font-bold text-[#1b152c] truncate">{t.name}</div>
                      <div className="text-[10px] text-[#5c6e64] mt-0.5 line-clamp-1">
                        {t.spec.split("•")[0]}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-bold text-[#6c43e3] mt-1.5 block">✓ Aktif</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#f0ecf7] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#687a70]">
              Brand acuan: <strong>{brand.name}</strong> • Audiens:{" "}
              {brand.audience ? `${brand.audience.slice(0, 40)}…` : "Umum"}{" "}
              {trendContext.trim() && `• Mode Tren: "${trendContext.slice(0, 30)}…"`}
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`py-2.5 px-6 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center gap-2 disabled:opacity-50 whitespace-nowrap cursor-pointer text-white ${
                trendContext.trim() ? "bg-rose-700 hover:bg-rose-800" : "bg-[#6c43e3] hover:bg-[#ed8a33]"
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyusun Rencana Konten Harian…</span>
                </>
              ) : (
                <>
                  {trendContext.trim() ? (
                    <Flame className="w-4 h-4 text-amber-300" />
                  ) : useAI ? (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-300" />
                  )}
                  <span>
                    {items.length > 0
                      ? `Perbarui Rencana (${count} Hari)`
                      : `Susun Rencana Konten (${count} Hari)`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* When Empty */}
      {items.length === 0 ? (
        <div className="p-12 rounded-3xl border-2 border-dashed border-[#d1ded0] bg-[#fafcf9] text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ecf4ea] text-[#6c43e3] flex items-center justify-center mx-auto shadow-xs">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1b152c] font-heading">
            Belum ada kalender konten aktif
          </h3>
          <p className="text-xs text-[#736c87] leading-relaxed max-w-[65ch] mx-auto">
            Tentukan fokus topik di atas, lalu klik <strong>"Susun Rencana Konten"</strong>. Anda juga dapat memilih <strong>1 Hari</strong> untuk ide postingan tunggal spesifik, atau klik tombol manual di bawah.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleSubmitPlan}
              className="py-2.5 px-5 rounded-2xl bg-[#6c43e3] text-white text-xs font-semibold hover:bg-[#ed8a33] transition-all whitespace-nowrap shadow-xs cursor-pointer"
            >
              Mulai Susun Konten ({count} Hari)
            </button>
            <button
              type="button"
              onClick={handleAddManualItem}
              className="py-2.5 px-5 rounded-2xl bg-white border border-[#eae6f3] text-[#6c43e3] text-xs font-semibold hover:bg-[#f3f7f2] transition-all whitespace-nowrap shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat 1 Konten Saja</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results Section */
        <section className="space-y-4">
          {/* Platform Filter Tabs */}
          <div className="bg-white p-3.5 rounded-3xl border border-[#eae6f3] shadow-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#736c87]">
                  Filter Akun Platform
                </span>
                <span className="text-[10px] bg-[#ecf4ea] text-[#6c43e3] font-bold px-2 py-0.5 rounded-full border border-[#d3e3d1]">
                  Unified Master Calendar
                </span>
              </div>
              <div className="text-xs text-[#6a7c72]">
                Total: <strong className="text-[#1b152c]">{items.length}</strong> konten terjadwal
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setFilterPlatform("all")}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  filterPlatform === "all"
                    ? "bg-[#18382d] text-white shadow-xs"
                    : "bg-[#f4f7f2] hover:bg-[#eaf0e8] text-[#34483e] border border-[#e1e9df]"
                }`}
              >
                <span className="text-sm">🌐</span>
                <div className="text-left">
                  <div className="leading-tight">Semua Akun Platform</div>
                  <div
                    className={`text-[10px] font-normal ${
                      filterPlatform === "all" ? "text-emerald-200" : "text-[#6b7e73]"
                    }`}
                  >
                    Multi-Channel Terpadu
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                    filterPlatform === "all" ? "bg-white/20 text-white" : "bg-[#e2ebe0] text-[#233b30]"
                  }`}
                >
                  {items.length}
                </span>
              </button>

              {Object.entries(platformsData).map(([pName, pInfo]) => {
                const handle = getAccountHandle(pName, brand);
                const count = platformCounts[pName] || 0;
                const isSelected = filterPlatform.toLowerCase() === pName.toLowerCase();
                return (
                  <button
                    key={pName}
                    type="button"
                    onClick={() => setFilterPlatform(pName)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-[#18382d] text-white shadow-xs"
                        : "bg-[#f4f7f2] hover:bg-[#eaf0e8] text-[#34483e] border border-[#e1e9df]"
                    }`}
                  >
                    <span className="text-sm">{pInfo.icon}</span>
                    <div className="text-left">
                      <div className="leading-tight">{pName}</div>
                      <div
                        className={`text-[10px] font-mono font-normal truncate max-w-[120px] ${
                          isSelected ? "text-emerald-200" : "text-[#6b7e73]"
                        }`}
                      >
                        {handle}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-0.5 ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#e2ebe0] text-[#233b30]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Filter & View Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-[#eae6f3]">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#819488] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari ide, hook, pilar, atau platform..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#eae6f3] outline-none focus:border-[#6c43e3]"
                />
              </div>

              <select
                value={filterPlacement}
                onChange={e => setFilterPlacement(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-[#eae6f3] bg-white outline-none font-semibold text-[#1f4a3a] cursor-pointer"
              >
                <option value="all">Semua Tipe Placement</option>
                {Object.entries(placementTypesData).map(([k, t]) => (
                  <option key={k} value={k}>
                    {t.icon} {k}
                  </option>
                ))}
              </select>

              <select
                value={filterPillar}
                onChange={e => setFilterPillar(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-[#eae6f3] bg-white outline-none cursor-pointer"
              >
                <option value="all">Semua Pilar</option>
                {defaultPillars.map(p => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-[#eae6f3] bg-white outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="draft">📝 Draf</option>
                <option value="in_progress">⏳ Produksi</option>
                <option value="approved">✅ Disetujui</option>
                <option value="scheduled">📅 Terjadwal</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddManualItem}
                className="py-1.5 px-3.5 rounded-xl bg-[#6c43e3] hover:bg-[#ed8a33] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Tambah 1 postingan baru ke kalender aktif"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah 1 Konten</span>
              </button>

              <div className="flex items-center bg-[#f1f5ef] p-1 rounded-xl border border-[#eae6f3]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-[#1b152c] shadow-xs'
                      : 'text-[#64756b] hover:text-[#1b152c]'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Tabel</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'calendar'
                      ? 'bg-white text-[#1b152c] shadow-xs'
                      : 'text-[#64756b] hover:text-[#1b152c]'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Kalender</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'kanban'
                      ? 'bg-white text-[#1b152c] shadow-xs'
                      : 'text-[#64756b] hover:text-[#1b152c]'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Pipeline</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW: TABLE */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-3xl border border-[#eae6f3] overflow-hidden shadow-xs">
              <div className="p-3.5 border-b border-[#f0ecf7] bg-[#fafcf9] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="p-1 rounded hover:bg-[#eaf4ea] text-[#6c43e3] transition-colors cursor-pointer"
                      title={
                        filteredItems.length > 0 && filteredItems.every(it => selectedIds.has(it.id))
                          ? "Batalkan pilihan semua"
                          : "Pilih semua konten"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={filteredItems.length > 0 && filteredItems.every(it => selectedIds.has(it.id))}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded text-[#6c43e3] accent-[#6c43e3] cursor-pointer"
                      />
                    </button>
                    <span className="text-xs font-bold text-[#1b152c]">
                      {selectedIds.size > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-[#1b5140] font-mono bg-[#eaf4ea] px-2.5 py-0.5 rounded-full border border-[#cbe0cb]">
                          <span>✓</span>
                          <span>{selectedIds.size} konten dipilih</span>
                        </span>
                      ) : (
                        <span className="text-[#566a5e]">
                          Checklist Manajemen Konten ({filteredItems.length} baris)
                        </span>
                      )}
                    </span>
                  </div>
                  {selectedIds.size > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Batal Pilih
                    </button>
                  )}
                </div>

                {selectedIds.size > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 animate-in fade-in">
                    <button
                      type="button"
                      onClick={handleDeleteSelected}
                      className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      title="Hapus semua konten yang dicentang"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus ({selectedIds.size})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportSelectedToCalendar}
                      className="py-1.5 px-3 rounded-xl bg-[#6c43e3] hover:bg-[#184839] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      title="Ekspor konten terpilih sebagai paket untuk Ruang Kalender"
                    >
                      <span>🚀</span>
                      <span>Kirim ({selectedIds.size}) ke Ruang Kalender</span>
                    </button>

                    <div className="flex items-center gap-1 bg-white border border-[#eae6f3] rounded-xl p-0.5 text-xs font-medium shadow-2xs">
                      <span className="text-[11px] text-[#6b7e73] px-2 font-semibold">
                        Ubah Status:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleBatchStatus('draft')}
                        className="px-2 py-1 rounded-lg hover:bg-stone-100 text-stone-700 cursor-pointer"
                      >
                        Draf
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchStatus('in_progress')}
                        className="px-2 py-1 rounded-lg hover:bg-amber-100 text-amber-800 cursor-pointer"
                      >
                        Produksi
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchStatus('approved')}
                        className="px-2 py-1 rounded-lg hover:bg-emerald-100 text-emerald-800 cursor-pointer"
                      >
                        Disetujui
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchStatus('scheduled')}
                        className="px-2 py-1 rounded-lg hover:bg-sky-100 text-sky-800 cursor-pointer"
                      >
                        Terjadwal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs text-[#6c43e3] hover:underline font-semibold cursor-pointer"
                    >
                      Pilih Semua ({filteredItems.length})
                    </button>
                    <span className="text-[11px] text-[#718377] italic">
                      • Centang baris untuk menghapus atau mengubah status massal
                    </span>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fafcf9] border-b border-[#f0ecf7] text-xs font-semibold text-[#736c87]">
                      <th className="py-3 px-3 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={filteredItems.length > 0 && filteredItems.every(it => selectedIds.has(it.id))}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded text-[#6c43e3] accent-[#6c43e3] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3 w-28">Tanggal & Jam</th>
                      <th className="py-3 px-3 w-36">Tipe Placement</th>
                      <th className="py-3 px-3 min-w-[200px]">Penempatan Platform</th>
                      <th className="py-3 px-3 w-32">Pilar Konten</th>
                      <th className="py-3 px-4 min-w-[240px]">Arah & Sudut Konten</th>
                      <th className="py-3 px-3 w-28">Status</th>
                      <th className="py-3 px-3 w-40 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ecf7] text-xs">
                    {filteredItems.map((item, idx) => {
                      const date = item.fields.Tanggal || "-";
                      const time = item.fields["Jam Tayang"];
                      const isSelected = selectedIds.has(item.id);
                      const placement = item.fields["Tipe Placement"] || "Post Gambar";
                      const penempatan = item.fields.Penempatan || item.fields.Platform || "Instagram";
                      const platform = item.fields.Platform || "Instagram";
                      const targetHandle = item.fields["Akun Target"] || getAccountHandle(platform, brand);
                      const pilar = item.fields.Pilar || "Edukasi & Tips";
                      const hook = item.fields.Hook || item.title;
                      const angle = item.fields["Sudut Konten"] || "-";
                      const placementInfo = placementTypesData[placement] || placementTypesData["Post Gambar"];
                      const placementChips = penempatan.split(",").map(s => s.trim()).filter(Boolean);

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isSelected ? "bg-[#f4f1fa] hover:bg-[#dfeee0]" : "hover:bg-[#f9fbf8]"
                          }`}
                        >
                          <td className="py-3.5 px-3 align-top text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.id)}
                              className="w-4 h-4 rounded text-[#6c43e3] accent-[#6c43e3] cursor-pointer mt-1"
                            />
                          </td>
                          <td className="py-3.5 px-3 align-top font-medium text-[#4b5e52]">
                            <div className="text-sm font-bold text-[#1b152c]">
                              {date.slice(8) || String(idx + 1).padStart(2, "0")}
                            </div>
                            <div className="text-[11px] text-[#6b7e73] font-mono">{date.slice(0, 7)}</div>
                            {time && (
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#6c43e3] mt-1 bg-[#f4f1fa] px-1.5 py-0.5 rounded w-fit">
                                <Clock className="w-2.5 h-2.5 text-[#6c43e3]" />
                                <span>{time}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-3 align-top">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg border w-fit ${
                                  placementInfo.badgeClass
                                }`}
                              >
                                <span>{placementInfo.icon}</span>
                                <span>{placement}</span>
                              </span>
                              <span className="text-[10px] text-[#687a70] line-clamp-1">
                                {placementInfo.spec}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 align-top">
                            <div className="space-y-1">
                              <div className="flex flex-wrap gap-1">
                                {placementChips.map(p => (
                                  <span
                                    key={p}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#f1f6f1] text-[#1c4d3d] border border-[#d2e4d0] px-1.5 py-0.5 rounded-md"
                                  >
                                    <span>{p}</span>
                                  </span>
                                ))}
                              </div>
                              <div className="text-[10px] text-[#6b7e73] font-mono truncate max-w-[190px]">
                                Akun: {targetHandle}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 align-top">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${getPillarColor(
                                  pilar
                                )}`}
                              >
                                {pilar}
                              </span>
                              {item.fields["Tahap Funnel"] && (
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                                  style={getFunnelBadgeStyle(item.fields["Tahap Funnel"])}
                                >
                                  {item.fields["Tahap Funnel"]}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-bold text-[#1b152c] text-xs mb-1">{hook}</div>
                            <div className="text-xs text-[#736c87] line-clamp-2 leading-relaxed">
                              {angle}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 align-top">
                            <select
                              value={item.status}
                              onChange={e => onStatusChange(item.id, e.target.value as ContentStatus)}
                              className={`text-xs font-semibold py-1 px-2 rounded-lg border outline-none cursor-pointer whitespace-nowrap ${
                                item.status === "approved"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : item.status === "in_progress"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-stone-50 text-stone-700 border-stone-300"
                              }`}
                            >
                              <option value="draft">Draf</option>
                              <option value="in_progress">Produksi</option>
                              <option value="approved">Disetujui</option>
                              <option value="scheduled">Terjadwal</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-3 align-top text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => onViewBrief(item)}
                                className="py-1 px-2 rounded-lg border border-[#6c43e3] bg-[#6c43e3] hover:bg-[#ed8a33] text-xs font-semibold text-white flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                                title="Lihat rencana konten & brief"
                              >
                                <span>📄</span>
                                <span>Brief</span>
                              </button>
                              <button
                                onClick={() => onEditItem(item)}
                                className="py-1 px-2 rounded-lg border border-[#eae6f3] bg-white hover:bg-[#f8f7fc] text-xs font-semibold text-[#6c43e3] flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                                title="Edit naskah & detail"
                              >
                                <PenLine className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOne(item.id, hook)}
                                className="p-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors shadow-2xs cursor-pointer"
                                title="Hapus konten ini dari rencana"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: CALENDAR */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-3xl border border-[#eae6f3] p-5 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {filteredItems.map((item, idx) => {
                  const date = item.fields.Tanggal || "";
                  const time = item.fields["Jam Tayang"];
                  const isSelected = selectedIds.has(item.id);
                  const placement = item.fields["Tipe Placement"] || "Post Gambar";
                  const penempatan = item.fields.Penempatan || item.fields.Platform || "Instagram";
                  const platform = item.fields.Platform || "Instagram";
                  const targetHandle = item.fields["Akun Target"] || getAccountHandle(platform, brand);
                  const pilar = item.fields.Pilar || "Edukasi & Tips";
                  const hook = item.fields.Hook || item.title;
                  const placementInfo = placementTypesData[placement] || placementTypesData["Post Gambar"];

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#6c43e3] bg-[#f4f1fa] shadow-xs ring-1 ring-[#6c43e3]/20"
                          : "border-[#eae6f3] bg-[#fafcf9] hover:bg-white hover:shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.id)}
                              className="w-4 h-4 rounded text-[#6c43e3] accent-[#6c43e3] cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#6c43e3] font-mono">
                              {date || `Hari #${idx + 1}`}
                            </span>
                          </div>
                          {time && (
                            <span className="text-[10px] text-[#4b5e52] font-semibold flex items-center gap-0.5 bg-[#f4f1fa] px-1.5 py-0.5 rounded">
                              <Clock className="w-2.5 h-2.5 text-[#6c43e3]" />
                              {time}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${
                              placementInfo.badgeClass
                            }`}
                          >
                            <span>{placementInfo.icon}</span>
                            <span>{placement}</span>
                          </span>
                          <span className="text-[10px] text-[#6b7e73] font-mono truncate max-w-[100px]">
                            {targetHandle}
                          </span>
                        </div>

                        <div className="text-[10px] text-[#2d5242] bg-[#f4f1fa] px-1.5 py-0.5 rounded font-medium mb-2 truncate">
                          📍 {penempatan}
                        </div>

                        <div className="mb-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getPillarColor(
                              pilar
                            )}`}
                          >
                            {pilar.split("&")[0]}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#1b152c] mb-2 line-clamp-2 leading-snug">
                          {hook}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-[#f0ecf7] flex items-center justify-between">
                        <select
                          value={item.status}
                          onChange={e => onStatusChange(item.id, e.target.value as ContentStatus)}
                          className="text-[10px] font-semibold py-0.5 px-1.5 rounded border outline-none bg-white cursor-pointer"
                        >
                          <option value="draft">Draf</option>
                          <option value="in_progress">Produksi</option>
                          <option value="approved">Disetujui</option>
                          <option value="scheduled">Terjadwal</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onViewBrief(item)}
                            className="text-[11px] font-semibold text-[#6c43e3] hover:underline cursor-pointer"
                          >
                            Brief →
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOne(item.id, hook)}
                            className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                            title="Hapus konten"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: KANBAN PIPELINE */}
          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: "draft", label: "Draf Awal", color: "bg-stone-100 text-stone-800" },
                { id: "in_progress", label: "Dalam Produksi", color: "bg-amber-100 text-amber-900" },
                { id: "approved", label: "Disetujui", color: "bg-emerald-100 text-emerald-900" },
                { id: "scheduled", label: "Terjadwal Tayang", color: "bg-sky-100 text-sky-900" }
              ].map(col => {
                const colItems = filteredItems.filter(it => it.status === col.id);
                return (
                  <div
                    key={col.id}
                    className="bg-[#f5f8f4] p-3.5 rounded-3xl border border-[#eae6f3] flex flex-col min-h-[420px]"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${col.color}`}>
                        {col.label}
                      </span>
                      <span className="text-xs text-[#718278] font-semibold">
                        {colItems.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {colItems.map(it => {
                        const platform = it.fields.Platform || "Instagram";
                        const targetHandle = it.fields["Akun Target"] || getAccountHandle(platform, brand);
                        const platformInfo = platformsData[platform] || platformsData.Instagram;
                        const time = it.fields["Jam Tayang"];
                        return (
                          <div
                            key={it.id}
                            className="p-3 bg-white rounded-2xl border border-[#eae6f3] shadow-2xs hover:shadow-xs transition-all space-y-2"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                                  platformInfo.badgeClass
                                }`}
                              >
                                <span>{platformInfo.icon}</span>
                                <span>{platform}</span>
                              </span>
                              <span className="text-[9px] text-[#6b7e73] font-mono truncate max-w-[90px]">
                                {targetHandle}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-[#718278] font-mono">
                              <span>{it.fields.Tanggal || "Tanggal -"}</span>
                              {time && <span className="text-[#6c43e3] font-semibold">{time}</span>}
                            </div>

                            <div className="text-xs font-bold text-[#1b152c] leading-snug">
                              {it.fields.Hook || it.title}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[#f0f4ee]">
                              <button
                                onClick={() => onViewBrief(it)}
                                className="text-[10px] font-semibold text-[#6c43e3] hover:underline cursor-pointer"
                              >
                                📄 Brief
                              </button>
                              <button
                                onClick={() => onEditItem(it)}
                                className="text-[10px] font-semibold text-stone-600 hover:text-[#6c43e3] cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {colItems.length === 0 && (
                        <div className="h-24 flex items-center justify-center text-[11px] text-[#819287] italic">
                          Kosong
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
