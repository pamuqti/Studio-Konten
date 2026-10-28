import React, { useState, useEffect } from 'react';
import { Key, X, ShieldCheck, ExternalLink, Eye, EyeOff, RefreshCw, Check, CircleAlert, Sparkles } from 'lucide-react';
import { getApiKeyDetails, testGeminiApiKey, saveGeminiApiKey } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (hasKey: boolean) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; model?: string; error?: string } | null>(null);
  const [details, setDetails] = useState(() => getApiKeyDetails());

  useEffect(() => {
    if (isOpen) {
      const d = getApiKeyDetails();
      setDetails(d);
      setApiKey(d.key);
      setIsSaved(false);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, error: "Masukkan API Key terlebih dahulu." });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKey.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || "Gagal mengetes API Key." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveGeminiApiKey(apiKey.trim());
    setIsSaved(true);
    onSaved?.(Boolean(apiKey.trim()));
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey("");
    saveGeminiApiKey("");
    setTestResult(null);
    onSaved?.(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#dce4db] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e9efe8] bg-[#f8faf8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#205c49]/10 text-[#205c49] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#183127] font-heading">
                Pengaturan Gemini AI
              </h3>
              <p className="text-[11px] text-[#64756b]">
                Konfigurasi API Key untuk Live AI Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#728378] hover:text-[#183127] hover:bg-[#edf2ec] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#ecf3ea]/80 border border-[#cfe0cc] rounded-2xl p-3.5 text-xs text-[#245946] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#205c49]" />
            <div className="leading-relaxed">
              <p className="font-semibold mb-0.5">Aman & Terenkripsi</p>
              <p className="text-[11px] text-[#3d6554]">
                API key disimpan di memori lokal browser Anda (localStorage) dan dikirim langsung ke Google AI Studio via koneksi HTTPS resmi Google.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#183127]">Google Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#205c49] hover:underline flex items-center gap-1 font-normal"
              >
                <span>Dapatkan Key Gratis</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full pl-3.5 pr-20 py-2.5 text-xs rounded-xl border border-[#d2ddd0] focus:border-[#205c49] focus:ring-2 focus:ring-[#205c49]/20 outline-none transition-all font-mono"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-[#728378] hover:text-[#183127] rounded-md transition-colors cursor-pointer"
                  title={showKey ? "Sembunyikan" : "Tampilkan"}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {details.source !== "none" && details.source !== "storage" && (
              <p className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Terdeteksi otomatis dari: <strong>{details.sourceDescription}</strong>
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-[#728378]">
                Mendukung <code>gemini-3-flash-preview</code> dan <code>2.5-flash</code>.
              </p>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                className="text-xs px-2.5 py-1 font-semibold rounded-lg border border-[#205c49]/30 text-[#205c49] hover:bg-[#205c49]/10 disabled:opacity-50 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Mengecek...</span>
                  </>
                ) : (
                  <span>Tes Koneksi</span>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in duration-150 ${
                  testResult.success
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {testResult.success ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Terhubung! Model siap: <strong>{testResult.model}</strong></span>
                  </>
                ) : (
                  <>
                    <CircleAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">Gagal: {testResult.error}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#e9efe8] bg-[#f8faf8]">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-medium cursor-pointer"
            >
              Hapus Key
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#54645b] hover:bg-[#edf2ec] rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#205c49] hover:bg-[#184637] rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
