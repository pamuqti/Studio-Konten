import React from 'react';
import {
  Laptop,
  X,
  Sparkles,
  Maximize2,
  WifiOff,
  CloudDownload,
  ArrowRight,
  CircleHelp
} from 'lucide-react';

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstalled?: () => void;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
  onInstalled
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#e2e8e0] relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#205c49] via-[#1a4b3c] to-[#12382c] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
              <Laptop className="w-7 h-7 text-[#fef08a]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-emerald-100 tracking-wide uppercase mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Desktop Mode PWA</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight font-heading">
                Install Ruang Konten Desktop
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Gunakan layaknya software desktop Windows tanpa tab browser.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#f7f9f6] border border-[#e3e9e1] flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-[#205c49]/10 text-[#205c49] flex items-center justify-center mb-2">
                <Maximize2 className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#142620]">Jendela Penuh</h5>
              <p className="text-[11px] text-[#63756b] mt-0.5 leading-snug">
                Bebas gangguan tab & address bar browser.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-[#f7f9f6] border border-[#e3e9e1] flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-[#205c49]/10 text-[#205c49] flex items-center justify-center mb-2">
                <WifiOff className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#142620]">Dukungan Offline</h5>
              <p className="text-[11px] text-[#63756b] mt-0.5 leading-snug">
                Tetap bisa merancang & menulis tanpa internet.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-[#f7f9f6] border border-[#e3e9e1] flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-[#205c49]/10 text-[#205c49] flex items-center justify-center mb-2">
                <CloudDownload className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-[#142620]">Akses Cepat</h5>
              <p className="text-[11px] text-[#63756b] mt-0.5 leading-snug">
                Ikon shortcut di Windows Taskbar & Start Menu.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1a3328]">
              <CircleHelp className="w-4 h-4 text-[#205c49]" />
              <span>Cara Install Desktop di Google Chrome / Microsoft Edge:</span>
            </div>
            <div className="space-y-2.5 text-xs text-[#405449] bg-[#f8faf7] p-4 rounded-2xl border border-[#e1e9df]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#205c49] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-[#142620]">Address Bar Browser:</strong> Perhatikan ujung kanan bilah alamat (address bar). Klik ikon <strong>Install Ruang Konten</strong> (ikon komputer dengan panah bawah).
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#205c49] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-[#142620]">Atau via Menu Browser:</strong> Klik titik tiga (<strong>⋮</strong>) di pojok kanan atas browser &gt; pilih <strong>"Simpan dan bagikan" / "Aplikasi"</strong> &gt; pilih <strong>"Install Ruang Konten"</strong>.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#205c49] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-[#142620]">Konfirmasi:</strong> Klik <strong>"Install"</strong> pada jendela popup. Aplikasi akan langsung terbuka di jendela mandiri dan shortcut otomatis muncul di desktop Anda!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fbfdfa] border-t border-[#edf1ea] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5a6e63] hover:text-[#183127] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
