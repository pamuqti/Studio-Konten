import React, { useState, useRef, useEffect } from 'react';
import { BrandBrain, ConsultationTurn, StrategyBlueprint } from '../types';
import {
  Compass,
  X,
  Sparkles,
  Target,
  RefreshCw,
  Send,
  Check,
  FileCheck,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { consultContentStrategistAi, generateContentPlanAi, generateTemplatePlan } from '../services/gemini';

interface StrategistModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandBrain;
  onApplyPlan: (items: any[], blueprint: StrategyBlueprint, dayCount: number) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const quickGoalIdeas = [
  { icon: "🚀", label: "Peluncuran Produk", prompt: "Saya ingin merancang peluncuran produk baru dengan fokus membangun rasa penasaran dan pre-order." },
  { icon: "🎯", label: "Edukasi Otoritas", prompt: "Fokus saya adalah mengedukasi audiens tentang masalah utama mereka agar brand saya dianggap ahli di industri ini." },
  { icon: "🔥", label: "Interaksi & Jangkauan", prompt: "Tujuan utama saya adalah menaikkan engagement, komentar audiens, dan membuat konten yang mudah dibagikan." },
  { icon: "🛍️", label: "Flash Sale & Promo", prompt: "Kampanye penawaran spesial berbatas waktu untuk mendongkrak penjualan langsung dalam waktu singkat." }
];

export const StrategistModal: React.FC<StrategistModalProps> = ({
  isOpen,
  onClose,
  brand,
  onApplyPlan,
  onNotify
}) => {
  const [dayCount, setDayCount] = useState<number>(7);
  const [initialInput, setInitialInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [history, setHistory] = useState<ConsultationTurn[]>([]);
  const [maturityScore, setMaturityScore] = useState(0);
  const [blueprint, setBlueprint] = useState<StrategyBlueprint | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHistory([]);
      setHasStarted(false);
      setBlueprint(null);
      setMaturityScore(0);
      setInitialInput("");
      setChatInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  if (!isOpen) return null;

  const handleStartConsultation = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setIsLoading(true);
    setHasStarted(true);

    const userTurn: ConsultationTurn = {
      id: `turn-${Date.now()}`,
      sender: 'user',
      text: clean,
      timestamp: Date.now()
    };
    const newHist = [userTurn];
    setHistory(newHist);
    setInitialInput("");

    try {
      const res = await consultContentStrategistAi(clean, [], "plan", brand, dayCount);
      const aiTurn: ConsultationTurn = {
        id: `turn-${Date.now() + 1}`,
        sender: 'ai',
        text: res.aiReply,
        quickOptions: res.quickOptions,
        blueprint: res.blueprint,
        timestamp: Date.now() + 1
      };
      setHistory([...newHist, aiTurn]);
      setMaturityScore(res.maturityScore);
      if (res.blueprint) setBlueprint(res.blueprint);
    } catch (e: any) {
      console.error(e);
      onNotify?.(e.message || "Gagal menghubungi konsultan AI.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTurn = async (text: string) => {
    const clean = text.trim();
    if (!clean || isLoading) return;
    setIsLoading(true);

    const userTurn: ConsultationTurn = {
      id: `turn-${Date.now()}`,
      sender: 'user',
      text: clean,
      timestamp: Date.now()
    };
    const newHist = [...history, userTurn];
    setHistory(newHist);
    setChatInput("");

    try {
      const res = await consultContentStrategistAi(clean, newHist, "plan", brand, dayCount);
      const aiTurn: ConsultationTurn = {
        id: `turn-${Date.now() + 1}`,
        sender: 'ai',
        text: res.aiReply,
        quickOptions: res.quickOptions,
        blueprint: res.blueprint,
        timestamp: Date.now() + 1
      };
      setHistory([...newHist, aiTurn]);
      setMaturityScore(res.maturityScore);
      if (res.blueprint) setBlueprint(res.blueprint);
    } catch (e: any) {
      console.error(e);
      onNotify?.(e.message || "Gagal menghubungi konsultan AI.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const basePlan = generateTemplatePlan(brand, {
        topic: blueprint?.coreAngle || brand.product,
        count: dayCount,
        goal: blueprint?.summary || "Konversi & Edukasi"
      });

      const refinedItems = await generateContentPlanAi(
        brand,
        {
          topic: blueprint?.coreAngle || brand.product,
          count: dayCount,
          goal: blueprint?.summary || "Konversi & Edukasi Terarah"
        },
        basePlan.items
      );

      const finalBlueprint = blueprint || {
        coreAngle: `Strategi terarah untuk ${brand.name}`,
        targetAudienceRefined: brand.audience,
        recommendedPillars: ["Edukasi", "Story", "Produk", "CTA"],
        suggestedTone: brand.tone,
        suggestedCta: brand.cta,
        summary: `Strategi konten ${dayCount} hari hasil konsultasi interaktif bersama Gemini.`
      };

      onApplyPlan(refinedItems, finalBlueprint, dayCount);
      onNotify?.(`Kalender konten ${dayCount} hari berhasil diterapkan dari Blueprint Konsultasi!`, 'success');
      onClose();
    } catch (e: any) {
      console.error(e);
      onNotify?.(e.message || "Gagal mengeksekusi rencana.", "error");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setBlueprint(null);
    setMaturityScore(0);
    setHasStarted(false);
    setInitialInput("");
    setChatInput("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1d16]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#dce6dc] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5eee6] bg-[#f9fbf9] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#205c49] to-[#2c775f] text-white flex items-center justify-center shadow-md shadow-[#205c49]/20">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-[#142620]">
                  Gemini Content Strategist & Navigator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecf4ec] text-[#205c49] border border-[#cfe2ce]">
                  Interactive Flow
                </span>
              </div>
              <p className="text-xs text-[#5c7365]">
                Arahkan maksud & sasaran sesuai konteks jumlah rencana konten sebelum eksekusi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#d6e2d8] shadow-2xs">
              <span className="text-[10px] font-bold text-[#5c7365] uppercase tracking-wider">
                Skala:
              </span>
              <select
                value={dayCount}
                onChange={e => setDayCount(Number(e.target.value))}
                disabled={hasStarted || isLoading}
                className="text-xs font-bold bg-transparent text-[#205c49] cursor-pointer focus:outline-none"
              >
                <option value={1}>1 Hari (6 Post Induk)</option>
                <option value={3}>3 Hari (Mini Sprint • 18 Post)</option>
                <option value={7}>7 Hari (1 Minggu • 42 Post)</option>
                <option value={14}>14 Hari (2 Minggu • 84 Post)</option>
                <option value={30}>30 Hari (1 Bulan • 180 Post)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#ebf2ec] text-[#5c7365] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {hasStarted ? (
            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="p-3.5 rounded-2xl bg-[#f7f9f7] border border-[#dce6dc] flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#18352b] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#205c49]" />
                      <span>Kematangan Strategi</span>
                    </span>
                    <span className="text-[#205c49] font-bold">{maturityScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#e3ece4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#205c49] to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${maturityScore}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-[#5c7365] hover:text-[#18352b] hover:bg-[#ecf3ec] rounded-lg transition-colors cursor-pointer"
                  title="Reset Konsultasi"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Chat turns */}
              <div className="space-y-4">
                {history.map((turn, idx) => {
                  const isAi = turn.sender === 'ai';
                  return (
                    <div
                      key={turn.id || idx}
                      className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
                    >
                      {isAi && (
                        <div className="w-8 h-8 rounded-xl bg-[#205c49] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                        </div>
                      )}
                      <div className={`max-w-[85%] ${isAi ? "space-y-2.5" : ""}`}>
                        <div
                          className={`p-4 rounded-2xl text-xs leading-relaxed ${
                            isAi
                              ? "bg-white border border-[#dce6dc] text-[#142620] shadow-xs"
                              : "bg-[#205c49] text-white shadow-xs"
                          }`}
                        >
                          <p className="whitespace-pre-line">{turn.text}</p>
                        </div>

                        {/* Quick options */}
                        {isAi && turn.quickOptions && turn.quickOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {turn.quickOptions.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleSendTurn(opt)}
                                className="px-3 py-1.5 rounded-xl bg-[#f0f5f1] hover:bg-[#205c49] hover:text-white border border-[#cfe0d1] text-[#18352b] text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#205c49] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#dce6dc] text-xs text-[#5c7365] flex items-center gap-2 shadow-xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#205c49]" />
                      <span>Gemini sedang menganalisis strategi untuk {dayCount} hari konten...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Proposal Blueprint Ready Card */}
              {blueprint && maturityScore >= 70 && (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#f2f7f3] via-white to-[#edf5ef] border-2 border-[#205c49]/30 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#205c49] text-white flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#142620]">
                          Proposal Blueprint Strategis
                        </h4>
                        <span className="text-[10px] text-[#5c7365]">
                          Siap diterapkan ke Kalender Konten ({dayCount} Hari Rilis)
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Ready to Execute
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-[#dce6dc]">
                      <span className="font-bold text-[#18352b] block mb-0.5">🎯 Core Angle:</span>
                      <p className="text-[#4e6457] leading-relaxed">{blueprint.coreAngle}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#dce6dc]">
                      <span className="font-bold text-[#18352b] block mb-0.5">📊 Rekomendasi Pilar:</span>
                      <p className="text-[#4e6457] leading-relaxed">{blueprint.recommendedPillars?.join(", ")}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isExecuting}
                    onClick={handleExecute}
                    className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#205c49] to-[#2c775f] hover:from-[#18493a] hover:to-[#225e4c] text-white font-bold text-xs shadow-lg shadow-[#205c49]/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Mengeksekusi Kalender Konten ({dayCount} Hari)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>⚡ Terapkan & Eksekusi Content Plan ({dayCount} Hari)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Consultation Start Screen */
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#f2f7f3] to-[#e7f0e9] border border-[#dce8de]">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#205c49] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#18352b] mb-1">
                      Mulai dari Tujuan Nyata, Bukan Template Acak
                    </h4>
                    <p className="text-xs text-[#4e6457] leading-relaxed">
                      Konsultan AI akan mewawancarai Anda secara singkat untuk menemukan <em>core angle</em>, sasaran konversi, dan pilar konten yang paling relevan untuk{" "}
                      <strong>{brand.name}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Inspiration Goals */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#5c7365] block mb-2.5">
                  Pilih Inspirasi Sasaran Cepat:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickGoalIdeas.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleStartConsultation(q.prompt)}
                      className="text-left p-3.5 rounded-2xl border border-[#dce6dc] bg-white hover:bg-[#f6faf6] hover:border-[#205c49]/50 transition-all shadow-2xs group cursor-pointer flex items-start gap-3"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{q.icon}</span>
                      <div>
                        <span className="font-heading font-bold text-xs text-[#142620] group-hover:text-[#205c49] transition-colors block">
                          {q.label}
                        </span>
                        <p className="text-[11px] text-[#63796d] line-clamp-2 mt-0.5 leading-snug">
                          {q.prompt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom prompt input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5c7365] block">
                  Atau Ceritakan Sasaran Anda Sendiri:
                </label>
                <textarea
                  value={initialInput}
                  onChange={e => setInitialInput(e.target.value)}
                  placeholder={`Contoh: Saya ingin konten ${brand.product} yang mengedukasi pemula tentang masalah mereka dan mendorong mereka mengklik link WhatsApp di bio...`}
                  rows={3}
                  className="w-full p-3.5 text-xs rounded-2xl border border-[#d6e2d8] focus:border-[#205c49] focus:outline-none bg-white leading-relaxed"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={!initialInput.trim() || isLoading}
                    onClick={() => handleStartConsultation(initialInput)}
                    className="px-5 py-2.5 rounded-xl bg-[#205c49] hover:bg-[#18493a] text-white text-xs font-bold shadow-md shadow-[#205c49]/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>Mulai Konsultasi Strategis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat input footer if started */}
        {hasStarted && (
          <div className="p-4 border-t border-[#e5eee6] bg-[#f9fbf9] shrink-0">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendTurn(chatInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ketik jawaban atau preferensi tambahan Anda di sini..."
                className="flex-1 text-xs px-4 py-3 rounded-2xl border border-[#d6e2d8] focus:border-[#205c49] focus:outline-none bg-white"
                disabled={isLoading || isExecuting}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading || isExecuting}
                className="p-3 rounded-2xl bg-[#205c49] hover:bg-[#18493a] text-white transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
