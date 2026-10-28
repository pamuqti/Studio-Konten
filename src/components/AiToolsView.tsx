import React, { useState } from 'react';
import { BrandBrain } from '../types';
import {
  Sparkles,
  Dna,
  MessageSquare,
  Lightbulb,
  WandSparkles,
  Camera,
  Copy,
  Check,
  RefreshCw,
  Upload,
  ArrowRight
} from 'lucide-react';
import { extractBrandBrainAi, polishCaptionAi, generateHookIdeasAi, getGeminiApiKey, getActiveModel } from '../services/gemini';
import { copyToClipboard } from '../utils/export';

interface AiToolsViewProps {
  brand: BrandBrain;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onUpdateBrand?: (brand: BrandBrain) => void;
}

export const AiToolsView: React.FC<AiToolsViewProps> = ({
  brand,
  onNotify,
  onUpdateBrand
}) => {
  const [activeTab, setActiveTab] = useState<'dna' | 'threads' | 'hooks' | 'caption' | 'prompt'>('dna');

  // DNA Extractor state
  const [dnaInput, setDnaInput] = useState("");
  const [isExtractingDna, setIsExtractingDna] = useState(false);
  const [extractedBrand, setExtractedBrand] = useState<Partial<BrandBrain> | null>(null);
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);

  // Meta Threads state
  const [threadTopic, setThreadTopic] = useState("");
  const [threadAngle, setThreadAngle] = useState("Mitos vs Realita (Contrarian & Jujur)");
  const [isGeneratingThread, setIsGeneratingThread] = useState(false);
  const [threadPosts, setThreadPosts] = useState<string[]>([]);

  // Hook ideas state
  const [hookTopic, setHookTopic] = useState("");
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [hookList, setHookList] = useState<Array<{ category: string; hookText: string; explanation?: string }>>([]);

  // Caption polisher state
  const [rawCaption, setRawCaption] = useState("");
  const [captionStyle, setCaptionStyle] = useState("Storytelling & emosional");
  const [isPolishing, setIsPolishing] = useState(false);
  const [captionVariations, setCaptionVariations] = useState<Array<{ label: string; caption: string; hook: string }>>([]);

  // AI Photo Prompt state
  const [photoScene, setPhotoScene] = useState("");
  const [photoLighting, setPhotoLighting] = useState("Commercial Natural Light");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const handleExtractDna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dnaInput.trim()) {
      onNotify?.("Masukkan deskripsi produk terlebih dahulu.", "info");
      return;
    }
    setIsExtractingDna(true);
    try {
      const res = await extractBrandBrainAi(dnaInput);
      setExtractedBrand(res.brand);
      setAnalysisNote(res.analysisSummary || null);
      onNotify?.(`DNA Brand "${res.brand.name || "Baru"}" berhasil dianalisis!`, "success");
    } catch (err: any) {
      onNotify?.(err.message || "Gagal menganalisis produk.", "error");
    } finally {
      setIsExtractingDna(false);
    }
  };

  const handleApplyDnaToActiveBrand = () => {
    if (!extractedBrand || !onUpdateBrand) return;
    onUpdateBrand({
      ...brand,
      ...extractedBrand,
      name: extractedBrand.name || brand.name
    });
    onNotify?.(`Profil brand aktif diperbarui menjadi "${extractedBrand.name || brand.name}".`, "success");
  };

  const handleGenerateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingThread(true);
    const topic = threadTopic.trim() || `Mengatasi overwhelmed audiens ${brand.audience} dengan ${brand.name}`;

    try {
      const p1 = `Pengakuan jujur: banyak dari kita yang terjebak "productive procrastination" saat berhadapan dengan ${topic.toLowerCase()}.\n\nKita sibuk nata sistem yang kelihatan rapi, tapi kerjaan prioritasnya malah nggak pernah beres. Ini cara lepas dari siklus itu 🧵👇`;
      const p2 = `Otak kita gampang banget tertipu. Saat kita menghabiskan waktu berjam-jam milih icon, utak-atik template, atau bikin daftar to-do list panjang, kita merasa udah "bekerja keras".\n\nPadahal? Hasilnya nol. Klien atau diri kita sendiri butuh eksekusi riil, bukan dashboard estetik.`;
      const p3 = `Solusinya: Sederhanakan siklus harian lo.\n\n1. Batasi maksimal 3 kartu prioritas per hari.\n2. Terapkan time-blocking visual yang kaku.\n3. Lewat jam kerja, evaluasi apa yang menghambat, bukan lanjut lembur tanpa arah.`;
      const p4 = `${brand.name} dirancang persis dengan prinsip ini: ${brand.usp || "langsung jalan di browser tanpa perlu setup template berjam-jam"}.\n\nBuka webnya, tentukan sprint lo hari ini, dan kunci fokus tanpa distraksi.`;
      const p5 = `${brand.cta || "Coba sprint gratis pertama lo hari ini"}.\n\nKalau thread ini bermanfaat, bookmark atau share ke teman yang to-do list-nya sering mandek!`;

      setThreadPosts([p1, p2, p3, p4, p5]);
      onNotify?.("Naskah Thread berhasil disusun!", "success");
    } finally {
      setIsGeneratingThread(false);
    }
  };

  const handleCopyEntireThread = () => {
    if (threadPosts.length === 0) return;
    const combined = threadPosts.map((p, idx) => `[Post ${idx + 1}]\n${p}`).join('\n\n---\n\n');
    copyToClipboard(combined).then(ok => {
      onNotify?.(ok ? "Seluruh naskah thread disalin ke clipboard!" : "Gagal menyalin.", ok ? "success" : "error");
    });
  };

  const handleGenerateHooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookTopic.trim()) return;
    setIsGeneratingHooks(true);
    try {
      const res = await generateHookIdeasAi(hookTopic, brand);
      setHookList(res);
      onNotify?.("Variasi ide hook berhasil disusun.", "success");
    } catch (err: any) {
      onNotify?.(err.message || "Gagal memproses hook.", "error");
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const handlePolishCaption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawCaption.trim()) return;
    setIsPolishing(true);
    try {
      const res = await polishCaptionAi(rawCaption, brand, captionStyle);
      setCaptionVariations(res);
      onNotify?.("3 variasi caption berhasil dipoles.", "success");
    } catch (err: any) {
      onNotify?.(err.message || "Gagal memoles caption.", "error");
    } finally {
      setIsPolishing(false);
    }
  };

  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `Editorial commercial photo of ${brand.product || brand.name}. Scene context: ${photoScene || "clean minimalist studio tabletop"}. Lighting: ${photoLighting}. Brand color accents ${brand.color}. Clean negative space for typography on top, shot on 50mm f/1.8 lens, 8k resolution, authentic contemporary aesthetic --ar 4:5`;
    setGeneratedPrompt(prompt);
    onNotify?.("Prompt gambar AI siap disalin.", "success");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* View Header */}
      <div className="bg-white rounded-3xl border border-[#dce4db] p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#142620] font-heading">
              Asisten Hook & Copywriting AI
            </h2>
            <p className="text-xs text-[#687a70]">
              Alat bantu cerdas untuk merumuskan DNA brand, menyusun hook memikat, memoles naskah caption, naskah Threads, dan prompt visual {brand.name}.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#f1f5ef] p-1.5 rounded-2xl border border-[#dce4db]">
        <button
          onClick={() => setActiveTab('dna')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dna' ? "bg-white text-[#183127] shadow-xs" : "text-[#64756b] hover:text-[#183127]"
          }`}
        >
          <Dna className="w-4 h-4 text-[#205c49]" />
          <span>DNA Brand</span>
        </button>
        <button
          onClick={() => setActiveTab('threads')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'threads' ? "bg-white text-[#183127] shadow-xs" : "text-[#64756b] hover:text-[#183127]"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span>Meta Threads</span>
        </button>
        <button
          onClick={() => setActiveTab('hooks')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'hooks' ? "bg-white text-[#183127] shadow-xs" : "text-[#64756b] hover:text-[#183127]"
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Hook</span>
        </button>
        <button
          onClick={() => setActiveTab('caption')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'caption' ? "bg-white text-[#183127] shadow-xs" : "text-[#64756b] hover:text-[#183127]"
          }`}
        >
          <WandSparkles className="w-4 h-4 text-emerald-600" />
          <span>Poles Caption</span>
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'prompt' ? "bg-white text-[#183127] shadow-xs" : "text-[#64756b] hover:text-[#183127]"
          }`}
        >
          <Camera className="w-4 h-4 text-sky-600" />
          <span>Prompt Foto AI</span>
        </button>
      </div>

      {/* TAB 1: DNA BRAND EXTRACTOR */}
      {activeTab === 'dna' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#dce4db] p-6 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#e8f2eb] text-[#1c4d3d] border border-[#cfdfd3]">
                Brand Strategist
              </span>
              <h3 className="text-sm font-bold text-[#142620] font-heading mt-2">
                Ekstrak & Rumuskan Profil Brand dari Teks Produk Mentah
              </h3>
              <p className="text-xs text-[#52665b] leading-relaxed mt-1">
                Tempelkan deskripsi produk apa pun (katalog, materi pitch, review, atau catatan usaha). AI akan membedah nama, kategori, target audiens, USP, tone of voice, dan CTA.
              </p>
            </div>

            <form onSubmit={handleExtractDna} className="space-y-4">
              <textarea
                rows={4}
                required
                value={dnaInput}
                onChange={e => setDnaInput(e.target.value)}
                placeholder="Contoh: Kami menjual aplikasi manajemen fokus dan waktu untuk freelancer mandiri yang lelah dengan template to-do list rumit..."
                className="w-full p-3 rounded-2xl border border-[#cbdcd0] text-xs leading-relaxed focus:ring-2 focus:ring-[#205c49]/30 outline-none"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#526a5c]">
                  Brand aktif saat ini: <strong>{brand.name}</strong>
                </span>
                <button
                  type="submit"
                  disabled={isExtractingDna || !dnaInput.trim()}
                  className="py-2.5 px-5 rounded-xl bg-[#205c49] text-white text-xs font-semibold hover:bg-[#184738] shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isExtractingDna ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menganalisis DNA Produk...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analisis & Rumuskan DNA Brand</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {extractedBrand && (
            <div className="bg-white rounded-3xl border border-[#b8d6c4] p-6 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-4 border-b border-[#e5efe7] pb-4">
                <div>
                  <h4 className="text-base font-bold text-[#142620] font-heading">
                    {extractedBrand.name}
                  </h4>
                  <p className="text-xs text-[#52695c] mt-0.5">
                    {extractedBrand.category} • {extractedBrand.instagramHandle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApplyDnaToActiveBrand}
                  className="py-2 px-4 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan ke Brand Aktif</span>
                </button>
              </div>

              {analysisNote && (
                <div className="p-3.5 rounded-2xl bg-[#f5f9f6] border border-[#dbece0] text-xs text-[#204031] italic">
                  "{analysisNote}"
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-xs font-semibold text-[#52665b] block">Produk / Layanan:</span>
                  <p className="font-semibold text-[#142620] mt-0.5">{extractedBrand.product}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#52665b] block">Target Audiens:</span>
                  <p className="text-[#142620] mt-0.5">{extractedBrand.audience}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#52665b] block">Keunggulan Utama (USP):</span>
                  <p className="text-[#142620] mt-0.5">{extractedBrand.usp}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#52665b] block">Ajakan Bertindak (CTA):</span>
                  <p className="font-medium text-emerald-800 mt-0.5">"{extractedBrand.cta}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: META THREADS */}
      {activeTab === 'threads' && (
        <div className="bg-white rounded-3xl border border-[#dce4db] p-6 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
              Meta Threads Specialist
            </span>
            <h3 className="text-sm font-bold text-[#142620] font-heading mt-2">
              Generator Naskah Thread (Meta Threads)
            </h3>
            <p className="text-xs text-[#52665b] leading-relaxed mt-1">
              Hasilkan rangkaian 4-5 post terhubung dengan hook kontrarian yang menghentikan scroll, bedah masalah, framework solusi, dan soft CTA menuju brand {brand.name}.
            </p>
          </div>

          <form onSubmit={handleGenerateThread} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                  Topik / Keresahan Pembuka
                </label>
                <input
                  type="text"
                  value={threadTopic}
                  onChange={e => setThreadTopic(e.target.value)}
                  placeholder={`Contoh: Jebakan productive procrastination untuk ${brand.audience || "audiens"}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                  Sudut Pandang / Angle
                </label>
                <select
                  value={threadAngle}
                  onChange={e => setThreadAngle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#d6dfd5] text-xs bg-white font-medium outline-none cursor-pointer"
                >
                  <option value="Mitos vs Realita (Contrarian & Jujur)">Mitos vs Realita (Contrarian)</option>
                  <option value="Bedah Kesalahan & Solusi (Case Study)">Bedah Kesalahan & Solusi</option>
                  <option value="Tips Praktis 3 Poin (Actionable)">Tips Praktis 3 Poin</option>
                  <option value="Curhat Pengalaman Pribadi (Authentic)">Curhat Pengalaman Pribadi</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isGeneratingThread}
                className="py-2.5 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-xs cursor-pointer"
              >
                {isGeneratingThread ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyusun Thread…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>{threadPosts.length > 0 ? "Susun Ulang Thread" : "Susun Naskah Thread"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {threadPosts.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#edf1eb]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#142620]">
                  Rangkaian Thread ({threadPosts.length} Post)
                </span>
                <button
                  type="button"
                  onClick={handleCopyEntireThread}
                  className="px-3 py-1.5 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-700 text-purple-800 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Seluruh Naskah Thread</span>
                </button>
              </div>

              <div className="space-y-3">
                {threadPosts.map((post, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[#e2eae1] bg-[#fafcf9] space-y-2.5 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[#edf1eb]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-[#183127]">
                          {idx === 0
                            ? "Post 1 (Hook Pembuka 🧵)"
                            : idx === threadPosts.length - 1
                            ? `Post ${idx + 1} (CTA / Penutup)`
                            : `Post ${idx + 1} (Eksplorasi Ide)`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          copyToClipboard(post);
                          onNotify?.(`Post ${idx + 1} disalin ke clipboard!`, "success");
                        }}
                        className="text-purple-700 hover:underline font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Post</span>
                      </button>
                    </div>
                    <p className="text-xs text-[#203328] leading-relaxed whitespace-pre-line font-normal">
                      {post}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HOOKS */}
      {activeTab === 'hooks' && (
        <div className="bg-white rounded-3xl border border-[#dce4db] p-6 shadow-xs space-y-6">
          <form onSubmit={handleGenerateHooks} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                Topik / Masalah / Pembahasan Konten
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={hookTopic}
                  onChange={e => setHookTopic(e.target.value)}
                  placeholder="Contoh: Kesalahan mengatur to-do list harian freelancer"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                />
                <button
                  type="submit"
                  disabled={isGeneratingHooks}
                  className="py-2.5 px-4 rounded-xl bg-[#205c49] text-white text-xs font-semibold hover:bg-[#184738] flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isGeneratingHooks ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>Buat 5 Hook</span>
                </button>
              </div>
            </div>
          </form>

          {hookList.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#edf1eb]">
              <div className="text-xs font-bold text-[#142620]">Rekomendasi Hook Siap Pakai:</div>
              <div className="space-y-2.5">
                {hookList.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#fafcf9] rounded-2xl border border-[#dce4db] flex items-center justify-between gap-3 hover:bg-white transition-all"
                  >
                    <div>
                      <span className="text-xs font-semibold text-emerald-900 bg-[#eaf4e9] px-2 py-0.5 rounded-md mr-2 whitespace-nowrap">
                        {h.category}
                      </span>
                      <span className="text-xs font-semibold text-[#142620]">"{h.hookText}"</span>
                      {h.explanation && (
                        <p className="text-xs text-[#52665b] mt-1 leading-relaxed">{h.explanation}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(h.hookText);
                        onNotify?.("Hook disalin ke clipboard.", "success");
                      }}
                      className="p-1.5 rounded-lg border border-[#d6dfd5] text-[#52665b] hover:text-[#205c49] hover:bg-[#eef5ed] shrink-0 cursor-pointer"
                      title="Salin Hook"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: POLISH CAPTION */}
      {activeTab === 'caption' && (
        <div className="bg-white rounded-3xl border border-[#dce4db] p-6 shadow-xs space-y-6">
          <form onSubmit={handlePolishCaption} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                Draf Awal atau Poin Ide Caption
              </label>
              <textarea
                rows={4}
                required
                value={rawCaption}
                onChange={e => setRawCaption(e.target.value)}
                placeholder="Tuliskan draf kasar caption Anda di sini..."
                className="w-full p-3 rounded-2xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#183127]">Gaya Naskah:</span>
                <select
                  value={captionStyle}
                  onChange={e => setCaptionStyle(e.target.value)}
                  className="py-1.5 px-3 rounded-xl border border-[#d6dfd5] text-xs bg-white outline-none cursor-pointer"
                >
                  <option value="Storytelling & emosional">Storytelling & Relatable</option>
                  <option value="Ringkas & to the point">Ringkas & Punchy</option>
                  <option value="Edukatif & berbobot">Edukatif & Terstruktur</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isPolishing}
                className="py-2.5 px-5 rounded-xl bg-[#205c49] text-white text-xs font-semibold hover:bg-[#184738] flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isPolishing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <WandSparkles className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>Poles Menjadi 3 Variasi</span>
              </button>
            </div>
          </form>

          {captionVariations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#edf1eb]">
              {captionVariations.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-[#fafcf9] rounded-2xl border border-[#dce4db] p-4 flex flex-col justify-between hover:bg-white transition-all space-y-3"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-emerald-900 bg-[#eaf4e9] px-2 py-0.5 rounded-md inline-block">
                      {v.label}
                    </span>
                    <div className="text-xs font-bold text-[#142620]">{v.hook}</div>
                    <p className="text-xs text-[#3a5043] whitespace-pre-line leading-relaxed">
                      {v.caption}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(v.caption);
                      onNotify?.("Caption disalin ke clipboard.", "success");
                    }}
                    className="w-full py-1.5 px-3 rounded-xl border border-[#d6dfd5] text-xs font-semibold text-[#205c49] hover:bg-[#205c49] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Caption Ini</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AI PHOTO PROMPT */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-3xl border border-[#dce4db] p-6 shadow-xs space-y-6">
          <form onSubmit={handleGeneratePrompt} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                Suasana atau Aktivitas Produk yang Ingin Difoto
              </label>
              <input
                type="text"
                required
                value={photoScene}
                onChange={e => setPhotoScene(e.target.value)}
                placeholder="Contoh: Freelancer di coffee shop membuka laptop dengan secangkir kopi hangat"
                className="w-full p-3 rounded-2xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#183127] mb-1.5">
                  Gaya Pencahayaan & Kamera
                </label>
                <select
                  value={photoLighting}
                  onChange={e => setPhotoLighting(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-[#d6dfd5] text-xs bg-white outline-none cursor-pointer"
                >
                  <option value="Commercial Natural Light">Warm Morning Daylight (Natural)</option>
                  <option value="High-end Studio Lighting">Studio Softbox Flash (Katalog Bersih)</option>
                  <option value="Cinematic Mood Lighting">Cinematic Golden Hour (Hangat & Dramatis)</option>
                  <option value="Flat Lay Overhead">Flat Lay Top-Down (Rapi & Seimbang)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-5 rounded-xl bg-[#205c49] text-white text-xs font-semibold hover:bg-[#184738] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Susun Prompt Fotografi AI</span>
                </button>
              </div>
            </div>
          </form>

          {generatedPrompt && (
            <div className="p-4 bg-[#f4f8f2] rounded-2xl border border-[#d5e4d2] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Prompt Siap Pakai di Midjourney / Flux / Nano Banana:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(generatedPrompt);
                    onNotify?.("Prompt gambar AI disalin.", "success");
                  }}
                  className="py-1 px-2.5 bg-white hover:bg-emerald-50 text-xs font-semibold text-emerald-900 rounded-lg border border-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Prompt</span>
                </button>
              </div>
              <p className="text-xs font-mono text-[#1f4234] leading-relaxed bg-white/90 p-3 rounded-xl border border-[#d8e5d6]">
                {generatedPrompt}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
