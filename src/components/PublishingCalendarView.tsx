import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  ExternalLink,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Calendar,
  Send
} from 'lucide-react';
import { ScheduledPost, ContentItem, SocialPlatformKey } from '../types';
import { PLATFORMS_META } from '../data/platforms';

interface PublishingCalendarViewProps {
  posts: ScheduledPost[];
  approvedItemsCount: number;
  onOpenPool: () => void;
  onSelectDate: (dateStr: string) => void;
  onEditPost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
  onNewPost: () => void;
}

export const PublishingCalendarView: React.FC<PublishingCalendarViewProps> = ({
  posts,
  approvedItemsCount,
  onOpenPool,
  onSelectDate,
  onEditPost,
  onDeletePost,
  onNewPost
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const mondayStartOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const postsByDate: Record<string, ScheduledPost[]> = {};
  posts.forEach(p => {
    if (!postsByDate[p.scheduledDate]) {
      postsByDate[p.scheduledDate] = [];
    }
    postsByDate[p.scheduledDate].push(p);
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'native_scheduled':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-200" title="Jadwal di Server Platform (YouTube Studio / Meta)">
            Native Scheduled
          </span>
        );
      case 'inbox_sent':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/10 text-slate-900 border border-slate-300" title="Draf terkirim ke Inbox TikTok HP">
            TikTok Inbox
          </span>
        );
      case 'published':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            Tayang
          </span>
        );
      case 'failed':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
            Gagal
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
            Antrean (Queued)
          </span>
        );
    }
  };

  const totalNative = posts.filter(p => p.overallStatus === 'native_scheduled').length;
  const totalInbox = posts.filter(p => p.overallStatus === 'inbox_sent').length;

  return (
    <div className="space-y-5">
      {/* Top Banner Staging Jeda Produksi */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#17382d] via-[#205c49] to-[#286f58] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold font-heading text-white tracking-tight">
                Ruang Tayang (Distribusi 5 Platform)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                Auto-Publishing Active
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed max-w-xl">
              Hubungkan naskah yang sudah selesai diproduksi dengan video final (Cloudflare R2) dan jadwalkan ke Facebook, Instagram, Threads, TikTok, & YouTube.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPool}
            className="px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Kantong Naskah ({approvedItemsCount})</span>
          </button>

          <button
            type="button"
            onClick={onNewPost}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-stone-50 text-[#17382d] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#205c49]" />
            <span>Jadwalkan Konten</span>
          </button>
        </div>
      </div>

      {/* Month Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#dce4dc] shadow-2xs">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-extrabold text-[#192b24] font-heading">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={handleToday}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            Hari Ini
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#f4f7f4] px-2.5 py-1 rounded-xl text-[11px] font-semibold text-[#3b4e43]">
            <span>Total Terjadwal:</span>
            <span className="font-bold text-[#192b24]">{posts.length}</span>
          </div>
          {totalNative > 0 && (
            <div className="flex items-center gap-1 bg-purple-50 text-purple-800 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-purple-200">
              <span>YT & FB Native:</span>
              <span>{totalNative}</span>
            </div>
          )}
          {totalInbox > 0 && (
            <div className="flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-xl text-[11px] font-bold border border-slate-300">
              <span>TikTok Inbox:</span>
              <span>{totalInbox}</span>
            </div>
          )}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl border border-[#dce4dc] shadow-2xs overflow-hidden">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 border-b border-[#edf2ed] bg-[#f9faf9] text-center text-xs font-bold text-[#55695e] py-2.5">
          <div>Senin</div>
          <div>Selasa</div>
          <div>Rabu</div>
          <div>Kamis</div>
          <div>Jumat</div>
          <div>Sabtu</div>
          <div className="text-rose-600">Minggu</div>
        </div>

        {/* Month Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#edf2ed] bg-[#edf2ed]">
          {Array.from({ length: mondayStartOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="bg-[#fafbfa] min-h-[120px] p-2 opacity-40" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayPosts = postsByDate[dateStr] || [];
            const isToday = new Date().toISOString().slice(0, 10) === dateStr;

            return (
              <div
                key={dateStr}
                className={`bg-white min-h-[120px] p-2 flex flex-col justify-between group transition-colors hover:bg-emerald-50/20 ${
                  isToday ? 'ring-2 ring-[#205c49] ring-inset z-10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday ? 'bg-[#205c49] text-white shadow-2xs' : 'text-[#2a3c33]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  <button
                    onClick={() => onSelectDate(dateStr)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-opacity cursor-pointer"
                    title={`Jadwalkan konten di tanggal ${dateStr}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-1.5 flex-1 space-y-1.5 overflow-y-auto max-h-[110px]">
                  {dayPosts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => onEditPost(p)}
                      className="p-1.5 rounded-xl border border-[#dbe3db] bg-[#fbfdfb] hover:border-[#205c49] hover:shadow-xs transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-[#1f332a] flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-[#205c49]" />
                          <span>{p.scheduledTime}</span>
                        </span>
                        {getStatusBadge(p.overallStatus)}
                      </div>

                      <div className="font-bold text-[11px] text-[#192b24] line-clamp-1">
                        {p.title}
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        {p.targetPlatforms.map(pf => (
                          <span key={pf} className="text-[10px]" title={PLATFORMS_META[pf]?.name}>
                            {PLATFORMS_META[pf]?.icon}
                          </span>
                        ))}
                        {p.media?.length > 0 && (
                          <span className="text-[9px] text-[#4d6657] font-semibold ml-auto flex items-center gap-0.5">
                            {p.media[0].type === 'video' ? '🎬' : '🖼️'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
