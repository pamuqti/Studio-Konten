import React from 'react';
import { X, Trash2, Calendar, Sparkles, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ContentItem } from '../types';
import { PLATFORMS_META } from '../data/platforms';

interface ContentPoolDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  approvedItems: ContentItem[];
  onScheduleItem: (item: ContentItem) => void;
}

export const ContentPoolDrawer: React.FC<ContentPoolDrawerProps> = ({
  isOpen,
  onClose,
  approvedItems,
  onScheduleItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8e2] bg-[#f9fbf9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#1a2d26] font-heading">
                  Kantong Naskah Siap Tayang
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200/80 text-amber-900">
                  {approvedItems.length} Naskah
                </span>
              </div>
              <p className="text-[11px] text-[#63756b]">
                Naskah berstatus "Disetujui" menunggu video/desain selesai
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner on Production Gap */}
        <div className="p-3 mx-4 mt-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
          <span className="text-base shrink-0">💡</span>
          <div>
            <b>Menjembatani Jeda Produksi:</b> Setiap konten di Ruang Rencana yang diubah statusnya menjadi <b>"Disetujui" (Approved)</b> otomatis terkumpul di sini. Saat video selesai diedit di CapCut/Canva, klik <b>"Jadwalkan"</b> untuk memasangkan video & memilih platform tayang!
          </div>
        </div>

        {/* List of Pool Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {approvedItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#dce4dc] rounded-2xl">
              <span className="text-3xl mb-2">📭</span>
              <h3 className="text-xs font-bold text-[#1f332a]">Belum Ada Naskah Disetujui</h3>
              <p className="text-[11px] text-[#6b7d73] mt-1 max-w-xs">
                Ubah status konten di Ruang Rencana menjadi <b>Disetujui (Approved)</b> agar otomatis masuk ke antrean jadwal ini.
              </p>
            </div>
          ) : (
            approvedItems.map(it => {
              const f = it.fields || {};
              return (
                <div
                  key={it.id}
                  className="p-3.5 rounded-2xl border border-[#dce5dc] bg-white hover:border-[#205c49]/50 transition-all shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {f.Pilar && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#edf5ee] text-[#255240] border border-[#d2e4d3] mb-1">
                          {f.Pilar}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-[#182b24] line-clamp-1">
                        {f.Hook || it.title}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      Disetujui
                    </span>
                  </div>

                  {f.Caption && (
                    <p className="text-[11px] text-[#55695e] line-clamp-2 mt-1.5 leading-relaxed bg-[#f9faf9] p-2 rounded-xl">
                      {f.Caption}
                    </p>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-[#edf2ed] flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      {f.Format || f['Tipe Placement'] || 'Video Pendek'}
                    </span>

                    <button
                      onClick={() => onScheduleItem(it)}
                      className="px-3 py-1 rounded-xl bg-[#205c49] hover:bg-[#184839] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                    >
                      <span>Jadwalkan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#e2e8e2] bg-[#f9fbf9] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#718377]">
            {approvedItems.length} naskah siap dijadwalkan
          </span>
          <button
            onClick={onClose}
            className="text-xs text-[#205c49] hover:underline font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
