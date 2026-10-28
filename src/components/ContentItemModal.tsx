import React, { useState } from 'react';
import { BrandBrain, ContentItem, ContentStatus } from '../types';
import {
  X,
  Sparkles,
  WandSparkles,
  Flame,
  Check,
  Copy,
  RefreshCw,
  Send,
  Printer
} from 'lucide-react';
import { polishCaptionAi, generateHookIdeasAi, generateTrendBridgeAi } from '../services/gemini';
import { copyToClipboard, buildBriefModel, generateBriefsHtml, printBriefHtml } from '../utils/export';

interface ContentItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
  brand: BrandBrain;
  onSave: (item: ContentItem) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContentItemModal: React.FC<ContentItemModalProps> = ({
  isOpen,
  onClose,
  item,
  brand,
  onSave,
  onNotify
}) => {
  if (!isOpen || !item) return null;

  const [title, setTitle] = useState(item.title);
  const [status, setStatus] = useState<ContentStatus>(item.status);
  const [fields, setFields] = useState({ ...item.fields });
  const [notes, setNotes] = useState(item.notes || "");

  const [activeTab, setActiveTab] = useState<'form' | 'brief'>('form');
  const [aiAssistantMode, setAiAssistantMode] = useState<'none' | 'caption' | 'hooks' | 'trend'>('none');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // AI assistant responses
  const [captionVariations, setCaptionVariations] = useState<Array<{ label: string; caption: string; hook: string }>>([]);
  const [hookIdeas, setHookIdeas] = useState<Array<{ category: string; hookText: string; explanation?: string }>>([]);
  const [trendInput, setTrendInput] = useState("");
  const [trendResult, setTrendResult] = useState<any>(null);

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      title,
      status,
      fields,
      notes
    });
    onNotify?.("Perubahan konten berhasil disimpan.", "success");
    onClose();
  };

  const handlePolishCaption = async () => {
    const rawCaption = fields.Caption || fields["Naskah Narasi / Voiceover"] || "";
    if (!rawCaption) {
      onNotify?.("Isi caption atau narasi terlebih dahulu untuk disempurnakan.", "info");
      return;
    }
    setAiAssistantMode('caption');
    setIsLoadingAi(true);
    try {
      const vars = await polishCaptionAi(rawCaption, brand);
      setCaptionVariations(vars);
      onNotify?.("Variasi caption berhasil disusun oleh AI.", "success");
    } catch (e: any) {
      onNotify?.(e.message || "Gagal memproses caption.", "error");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleGenerateHooks = async () => {
    const baseTopic = fields.Hook || fields.Headline || item.title;
    setAiAssistantMode('hooks');
    setIsLoadingAi(true);
    try {
      const hooks = await generateHookIdeasAi(baseTopic, brand);
      setHookIdeas(hooks);
      onNotify?.("Ide hook segar berhasil dibuat.", "success");
    } catch (e: any) {
      onNotify?.(e.message || "Gagal memproses hook.", "error");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleApplyCaption = (newCaption: string, newHook?: string) => {
    setFields(prev => {
      const next = { ...prev };
      if (next.Caption !== undefined) next.Caption = newCaption;
      if (newHook && next.Hook !== undefined) next.Hook = newHook;
      if (newHook && next.Headline !== undefined) next.Headline = newHook;
      return next;
    });
    onNotify?.("Caption diterapkan ke draf.", "success");
  };

  const handleAnalyzeTrend = async () => {
    if (!trendInput.trim()) {
      onNotify?.("Masukkan nama tren, sound viral, atau isu terlebih dahulu.", "info");
      return;
    }
    setAiAssistantMode('trend');
    setIsLoadingAi(true);
    try {
      const baseTopic = fields.Hook || fields.Headline || item.title;
      const res = await generateTrendBridgeAi(trendInput, baseTopic, brand);
      setTrendResult(res);
      onNotify?.("Jembatan tren (Trend Bridge) berhasil dirumuskan!", "success");
    } catch (e: any) {
      onNotify?.(e.message || "Gagal memproses analisis tren.", "error");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleApplyEntireTrend = () => {
    if (!trendResult) return;
    setFields(prev => {
      const next = { ...prev };
      const selectedHook = trendResult.hooks?.[0]?.hookText || prev.Hook || "";
      if (next.Hook !== undefined) next.Hook = selectedHook;
      if (next.Headline !== undefined) next.Headline = selectedHook;
      if (next["Sudut Konten"] !== undefined) {
        next["Sudut Konten"] = `[Tren: ${trendInput}] ${trendResult.bridgeAngle}`;
      }
      if (next.Caption !== undefined) next.Caption = trendResult.caption;
      if (next["Brief Visual"] !== undefined) {
        next["Brief Visual"] = `${trendResult.visualDirection} (Gaya Tren: ${trendInput})`;
      }
      return next;
    });
    setTitle(prev => `[Tren] ${prev.replace(/^\[Tren\]\s*/, "")}`);
    onNotify?.("Seluruh elemen tren diterapkan ke konten ini.", "success");
    setAiAssistantMode('none');
  };

  const briefModel = buildBriefModel({ ...item, title, status, fields, notes }, "Kalender Konten");
  const briefHtml = generateBriefsHtml([briefModel], brand, `Brief: ${title}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-[#dce4db] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#edf1eb] flex items-center justify-between bg-[#fafcf9]">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#73857b] mb-1">
              Editor Konten & Produksi
            </div>
            <h2 className="text-base font-bold text-[#142620] font-heading truncate">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 px-6 pt-2 bg-[#fafcf9] border-b border-[#e1e9df]">
          <button
            type="button"
            className={`text-xs font-bold px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'form'
                ? "border-[#205c49] text-[#205c49] bg-white rounded-t-xl"
                : "border-transparent text-[#697c70] hover:text-[#142620]"
            }`}
            onClick={() => setActiveTab('form')}
          >
            ✏️ Form Edit
          </button>
          <button
            type="button"
            className={`text-xs font-bold px-4 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'brief'
                ? "border-[#205c49] text-[#205c49] bg-white rounded-t-xl"
                : "border-transparent text-[#697c70] hover:text-[#142620]"
            }`}
            onClick={() => setActiveTab('brief')}
          >
            📄 Brief Produksi
          </button>
        </div>

        {/* AI Assistant Quick Actions Bar */}
        <div className="px-5 py-2.5 bg-[#f3f7f1] border-b border-[#e1e9df] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#304d3f] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Asisten AI:
            </span>
            <button
              type="button"
              onClick={handlePolishCaption}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#e9f2e7] border border-[#d2dfcf] text-xs font-semibold text-[#1f4737] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <WandSparkles className="w-3 h-3 text-emerald-700" />
              <span>Poles Caption</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateHooks}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#e9f2e7] border border-[#d2dfcf] text-xs font-semibold text-[#1f4737] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>5 Ide Hook Baru</span>
            </button>
            <button
              type="button"
              onClick={() => setAiAssistantMode(aiAssistantMode === 'trend' ? 'none' : 'trend')}
              className={`px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                aiAssistantMode === 'trend'
                  ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                  : "bg-white hover:bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <Flame className="w-3 h-3 text-rose-500" />
              <span>🔥 Sambungkan Tren</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#63756b] font-medium">Status:</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as ContentStatus)}
              className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                status === "approved"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : status === "in_progress"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-stone-50 text-stone-700 border-stone-300"
              }`}
            >
              <option value="draft">📝 Draf Awal</option>
              <option value="in_progress">⏳ Dalam Produksi</option>
              <option value="approved">✅ Disetujui</option>
              <option value="scheduled">📅 Terjadwal</option>
            </select>
          </div>
        </div>

        {/* AI Assistant Output Drawer */}
        {aiAssistantMode !== 'none' && (
          <div className="bg-[#fcfdfa] border-b border-[#e1e9df] p-4 max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-[#1a382b] flex items-center gap-1.5">
                {aiAssistantMode === 'trend' ? (
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                )}
                {aiAssistantMode === 'caption'
                  ? "Pilihan Format Caption dari AI"
                  : aiAssistantMode === 'hooks'
                  ? "Ide Hook Menarik"
                  : "Sambungkan Konten Ini dengan Tren (Trend Hijacker)"}
              </div>
              <button
                type="button"
                onClick={() => setAiAssistantMode('none')}
                className="text-[11px] text-stone-500 hover:text-stone-800 font-medium cursor-pointer"
              >
                Tutup Asisten ✕
              </button>
            </div>

            {isLoadingAi ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-[#205c49] font-medium">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menghubungkan ke Gemini AI Brain…</span>
              </div>
            ) : aiAssistantMode === 'trend' ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 min-w-[220px]">
                    <Flame className="w-3.5 h-3.5 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trendInput}
                      onChange={e => setTrendInput(e.target.value)}
                      placeholder="Ketik nama tren / sound / meme viral (contoh: Sound POV 'Gak Bahaya Ta', meme kantor, dll.)..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-rose-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAnalyzeTrend();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isLoadingAi}
                    onClick={handleAnalyzeTrend}
                    className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    <Flame className="w-3 h-3" />
                    <span>Kaitkan ke Brand</span>
                  </button>
                </div>

                {trendResult && !isLoadingAi && (
                  <div className="p-3 bg-white border border-rose-100 rounded-2xl space-y-2.5 shadow-2xs">
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                      <div className="font-bold text-rose-950 flex items-center gap-1.5 mb-1">
                        <span>🌉 Jembatan Relevansi (The Bridge):</span>
                      </div>
                      <p className="text-[#3b2b2b] leading-relaxed text-[11px]">{trendResult.bridgeAngle}</p>
                      <div className="mt-1.5 text-[10px] text-rose-800 font-semibold">
                        💡 Rekomendasi Format: <strong>{trendResult.suggestedPlacement}</strong>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-stone-800 mb-1.5">
                        Pilih Hook Tren (3 Detik Awal):
                      </div>
                      <div className="space-y-1.5">
                        {trendResult.hooks?.map((h: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-[#fafcf9] border border-[#e1ece0] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 mr-1.5">
                                {h.category}
                              </span>
                              <span className="text-xs font-medium text-stone-800">"{h.hookText}"</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleFieldChange("Hook", h.hookText);
                                handleFieldChange("Headline", h.hookText);
                                onNotify?.(`Hook "${h.category}" diterapkan.`, "success");
                              }}
                              className="shrink-0 text-[10px] font-bold text-rose-700 hover:text-white hover:bg-rose-600 px-2 py-1 rounded-lg border border-rose-200 transition-all cursor-pointer"
                            >
                              Pakai Hook
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-stone-600 truncate max-w-sm">
                        Visual Cue: <em>{trendResult.visualDirection}</em>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyEntireTrend}
                        className="shrink-0 py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terapkan Seluruh Naskah Tren</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : aiAssistantMode === 'caption' && captionVariations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {captionVariations.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-[#dce5db] rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                        {c.label}
                      </div>
                      <div className="text-xs font-semibold text-[#183127] mb-1.5 line-clamp-2">
                        {c.hook}
                      </div>
                      <div className="text-[11px] text-[#4f6155] whitespace-pre-line line-clamp-4 leading-relaxed mb-3">
                        {c.caption}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyCaption(c.caption, c.hook)}
                      className="w-full py-1.5 px-2 bg-[#ecf4ea] hover:bg-[#205c49] text-[#205c49] hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Pakai Ini</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : aiAssistantMode === 'hooks' && hookIdeas.length > 0 ? (
              <div className="space-y-2">
                {hookIdeas.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-[#dce5db] rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#ebf4ea] text-emerald-800 mr-2">
                        {h.category}
                      </span>
                      <span className="text-xs font-medium text-[#183127]">"{h.hookText}"</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleFieldChange("Hook", h.hookText);
                        handleFieldChange("Headline", h.hookText);
                        onNotify?.("Hook diterapkan.", "success");
                      }}
                      className="shrink-0 px-2.5 py-1 bg-[#f1f6ef] hover:bg-[#205c49] text-[#205c49] hover:text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      Pakai
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 1: Form Edit */}
        {activeTab === 'form' && (
          <form
            id="item-editor-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                Judul Item
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none font-semibold"
              />
            </div>

            {Object.entries(fields).map(([k, v]) => {
              const strVal = String(v ?? "");
              const isLong =
                k.toLowerCase().includes("caption") ||
                k.toLowerCase().includes("narasi") ||
                k.toLowerCase().includes("isi") ||
                k.toLowerCase().includes("prompt") ||
                k.toLowerCase().includes("brief") ||
                k.toLowerCase().includes("layout") ||
                strVal.length > 80;

              return (
                <div key={k}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#183127]">{k}</label>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(strVal);
                        onNotify?.(`${k} disalin ke clipboard.`, "success");
                      }}
                      className="text-[11px] text-[#63756b] hover:text-[#205c49] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </button>
                  </div>

                  {isLong ? (
                    <textarea
                      rows={Math.min(7, Math.max(3, Math.ceil(strVal.length / 70)))}
                      value={strVal}
                      onChange={e => handleFieldChange(k, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none leading-relaxed font-normal"
                    />
                  ) : (
                    <input
                      type="text"
                      value={strVal}
                      onChange={e => handleFieldChange(k, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none"
                    />
                  )}
                </div>
              );
            })}

            <div>
              <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                Catatan Internal Tim / Produksi
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Tambahkan catatan khusus desainer, videografer, atau jadwal posting..."
                className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none leading-relaxed"
              />
            </div>
          </form>
        )}

        {/* Tab 2: Brief View */}
        {activeTab === 'brief' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-3 bg-[#fafcf9] border-b border-[#edf1eb] flex items-center justify-between px-6">
              <span className="text-xs text-[#697c70]">
                Pratinjau brief produksi siap cetak
              </span>
              <button
                type="button"
                onClick={() => printBriefHtml(briefHtml)}
                className="px-3 py-1.5 rounded-xl bg-[#205c49] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-[#184738]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
            <iframe
              title="Brief Preview"
              srcDoc={briefHtml}
              className="w-full flex-1 min-h-[400px] border-none"
            />
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#edf1eb] bg-[#fafcf9] flex items-center justify-between">
          <div className="text-[11px] text-[#718278]">
            {Object.keys(fields).length} parameter konten dikonfigurasi.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#dce4db] text-xs font-semibold text-[#44564b] hover:bg-white transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="item-editor-form"
              className="px-5 py-2 rounded-xl bg-[#205c49] text-white text-xs font-semibold hover:bg-[#184738] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
