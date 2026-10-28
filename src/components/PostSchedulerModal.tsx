import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Film,
  Image as ImageIcon,
  Send,
  Radio,
  FileCheck,
  Check
} from 'lucide-react';
import {
  ScheduledPost,
  ContentItem,
  SocialPlatformKey,
  PlatformConnection,
  MediaAttachment,
  CloudflareR2Config,
  BrandBrain
} from '../types';
import { PLATFORMS_META } from '../data/platforms';
import { uploadMediaToR2 } from '../services/socialApi';

interface PostSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItem: ContentItem | null;
  existingPost: ScheduledPost | null;
  initialDate?: string;
  brand: BrandBrain;
  connections: Record<SocialPlatformKey, PlatformConnection>;
  r2Config: CloudflareR2Config;
  onSaveSchedule: (post: ScheduledPost) => void;
  onPublishNow: (post: ScheduledPost) => void;
}

export const PostSchedulerModal: React.FC<PostSchedulerModalProps> = ({
  isOpen,
  onClose,
  contentItem,
  existingPost,
  initialDate,
  brand,
  connections,
  r2Config,
  onSaveSchedule,
  onPublishNow
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().slice(0, 10);
  const f = contentItem?.fields || {};

  const [title, setTitle] = useState(
    existingPost?.title || f.Hook || contentItem?.title || 'Konten Baru'
  );
  const [scheduledDate, setScheduledDate] = useState(
    existingPost?.scheduledDate || initialDate || f.Tanggal || today
  );
  const [scheduledTime, setScheduledTime] = useState(
    existingPost?.scheduledTime || f['Jam Tayang'] || '19:00'
  );
  const [masterCaption, setMasterCaption] = useState(
    existingPost?.masterCaption || f.Caption || ''
  );
  const [targetPlatforms, setTargetPlatforms] = useState<SocialPlatformKey[]>(
    existingPost?.targetPlatforms || ['instagram', 'tiktok', 'youtube']
  );
  const [mediaList, setMediaList] = useState<MediaAttachment[]>(
    existingPost?.media || []
  );

  const [tiktokMode, setTiktokMode] = useState<'inbox_draft' | 'direct'>(
    (existingPost?.platformOverrides?.tiktok?.publishMode as any) || 'inbox_draft'
  );
  const [youtubeTitle, setYoutubeTitle] = useState(
    existingPost?.platformOverrides?.youtube?.youtubeTitle ||
      (f.Hook ? f.Hook.slice(0, 95) : title)
  );

  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePlatform = (pf: SocialPlatformKey) => {
    setTargetPlatforms(prev =>
      prev.includes(pf) ? prev.filter(p => p !== pf) : [...prev, pf]
    );
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setUploadError('');

    try {
      const isVideo = file.type.startsWith('video/');
      const uploaded = await uploadMediaToR2(file, r2Config);

      const newMedia: MediaAttachment = {
        id: `media-${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        url: uploaded.url,
        r2Key: uploaded.r2Key,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        aspectRatio: isVideo ? '9:16' : '1:1'
      };

      setMediaList([newMedia]);
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah media ke Cloudflare R2');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const preflightWarnings: string[] = [];
  if (targetPlatforms.includes('threads') && masterCaption.length > 500) {
    preflightWarnings.push(
      `Threads membatasi teks 500 karakter (saat ini ${masterCaption.length} karakter). Teks akan disesuaikan otomatis.`
    );
  }
  if (targetPlatforms.includes('youtube') && youtubeTitle.length > 100) {
    preflightWarnings.push(`Judul YouTube tidak boleh lebih dari 100 karakter.`);
  }
  if (
    (targetPlatforms.includes('tiktok') || targetPlatforms.includes('instagram')) &&
    mediaList.length === 0
  ) {
    preflightWarnings.push(
      `Video/Gambar belum dilampirkan. TikTok & Instagram mewajibkan file media.`
    );
  }

  const buildPostObject = (): ScheduledPost => {
    const scheduledAtIso = `${scheduledDate}T${scheduledTime}:00+07:00`;
    return {
      id: existingPost?.id || `post-${Date.now()}`,
      contentItemId: contentItem?.id || existingPost?.contentItemId,
      brandId: brand.id || 'brand',
      brandName: brand.name,
      title,
      scheduledDate,
      scheduledTime,
      timezone: 'Asia/Jakarta',
      scheduledAtIso,
      targetPlatforms,
      masterCaption,
      media: mediaList,
      platformOverrides: {
        tiktok: {
          enabled: targetPlatforms.includes('tiktok'),
          publishMode: tiktokMode
        },
        youtube: {
          enabled: targetPlatforms.includes('youtube'),
          youtubeTitle,
          publishMode: 'native_schedule'
        },
        facebook: {
          enabled: targetPlatforms.includes('facebook'),
          publishMode: 'native_schedule'
        }
      },
      publishLogs: existingPost?.publishLogs || {},
      overallStatus: existingPost?.overallStatus || 'queued',
      createdAt: existingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleSaveDraftSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const post = buildPostObject();
    onSaveSchedule(post);
    onClose();
  };

  const handleExecutePublishNow = async () => {
    const post = buildPostObject();
    setIsSubmitting(true);
    try {
      await onPublishNow(post);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#dce4dc] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8e2] bg-[#f9fbf9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#205c49] text-white flex items-center justify-center font-bold text-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1a2d26] font-heading">
                {existingPost ? 'Edit Jadwal Post' : 'Jadwalkan Konten ke 5 Platform'}
              </h2>
              <p className="text-[11px] text-[#63756b]">
                Pasangkan naskah dari rencana, unggah media (Cloudflare R2), & jadwalkan
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

        {/* Form Body */}
        <form onSubmit={handleSaveDraftSchedule} className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Judul Konten */}
          <div>
            <label className="block text-[11px] font-bold text-[#44564c] uppercase tracking-wider mb-1">
              Judul / Hook Konten
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#d2dbd2] focus:outline-none focus:ring-2 focus:ring-[#205c49]/30 text-xs font-semibold text-[#182b24]"
              placeholder="Contoh: 3 Trik Produktivitas yang Jarang Diketahui"
              required
            />
          </div>

          {/* Tanggal & Jam Tayang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f8faf8] p-3.5 rounded-2xl border border-[#e1e9e1]">
            <div>
              <label className="block text-[11px] font-bold text-[#44564c] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#205c49]" />
                <span>Tanggal Upload</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#d2dbd2] text-xs font-medium text-[#182b24]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#44564c] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#205c49]" />
                <span>Jam Tayang (WIB)</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#d2dbd2] text-xs font-medium text-[#182b24]"
                required
              />
            </div>
          </div>

          {/* Media Studio (Cloudflare R2 Upload) */}
          <div className="border border-[#dce4dc] rounded-2xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-[#44564c] uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-emerald-700" />
                <span>Media Video / Gambar Final</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-bold">
                  Cloudflare R2 Gratis
                </span>
              </label>
              {mediaList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMediaList([])}
                  className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                >
                  Hapus Media
                </button>
              )}
            </div>

            {mediaList.length > 0 ? (
              <div className="p-3 rounded-xl bg-[#f2f7f3] border border-[#d3e5d5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold">
                    {mediaList[0].type === 'video' ? '🎬' : '🖼️'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950 truncate max-w-xs">
                      {mediaList[0].filename}
                    </div>
                    <div className="text-[10px] text-[#4d6657]">
                      {(mediaList[0].sizeBytes / (1024 * 1024)).toFixed(1)} MB • Rasio {mediaList[0].aspectRatio}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                  Tersimpan di R2
                </span>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#d2dbd2] hover:border-[#205c49] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#fafcfa]">
                <Upload className="w-6 h-6 text-[#52665b] mb-1.5" />
                <span className="text-xs font-bold text-[#1f332a]">
                  {isUploadingMedia ? 'Mengunggah ke Cloudflare R2...' : 'Klik untuk Unggah Video .MP4 atau Gambar .JPG'}
                </span>
                <span className="text-[10px] text-[#718377] mt-0.5">
                  Mendukung Reels, TikTok, Shorts 9:16 (Maks 100MB)
                </span>
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleMediaUpload}
                  disabled={isUploadingMedia}
                  className="hidden"
                />
              </label>
            )}

            {uploadError && (
              <div className="mt-2 text-[11px] text-rose-600 font-medium">
                {uploadError}
              </div>
            )}
          </div>

          {/* Target 5 Platform Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#44564c] uppercase tracking-wider mb-2">
              Pilih Platform Tujuan (Cross-Posting)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['facebook', 'instagram', 'threads', 'tiktok', 'youtube'] as SocialPlatformKey[]).map(pf => {
                const meta = PLATFORMS_META[pf];
                const isSelected = targetPlatforms.includes(pf);

                return (
                  <button
                    key={pf}
                    type="button"
                    onClick={() => togglePlatform(pf)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#205c49] bg-emerald-50/60 shadow-2xs ring-1 ring-[#205c49]'
                        : 'border-[#dce4dc] bg-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base">{meta.icon}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                          isSelected ? 'bg-[#205c49] text-white' : 'border border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-[11px] text-[#192b24]">{meta.name}</div>
                      <div className="text-[9px] text-[#6b7e73]">
                        {meta.specs.nativeScheduleSupported ? 'Native Schedule' : 'Auto-Queue'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opsi Khusus YouTube & TikTok */}
          {targetPlatforms.includes('youtube') && (
            <div className="p-3 rounded-2xl bg-red-50/60 border border-red-200 space-y-1">
              <label className="text-[10px] font-bold text-red-900 uppercase">
                Judul Video YouTube (Maks 100 Karakter)
              </label>
              <input
                type="text"
                value={youtubeTitle}
                maxLength={100}
                onChange={e => setYoutubeTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-red-200 text-xs text-stone-900"
              />
            </div>
          )}

          {targetPlatforms.includes('tiktok') && (
            <div className="p-3 rounded-2xl bg-slate-900/5 border border-slate-300 space-y-1.5">
              <label className="text-[10px] font-bold text-slate-800 uppercase">
                Metode Publikasi TikTok
              </label>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tiktokMode"
                    checked={tiktokMode === 'inbox_draft'}
                    onChange={() => setTiktokMode('inbox_draft')}
                  />
                  <span>Kirim ke Inbox Draft TikTok (Bisa tambah lagu viral di HP)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tiktokMode"
                    checked={tiktokMode === 'direct'}
                    onChange={() => setTiktokMode('direct')}
                  />
                  <span>Direct Post (Langsung Tayang)</span>
                </label>
              </div>
            </div>
          )}

          {/* Master Caption */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#44564c] uppercase tracking-wider">
                Naskah / Caption Utama
              </label>
              <span className="text-[10px] text-stone-500">
                {masterCaption.length} karakter
              </span>
            </div>
            <textarea
              rows={4}
              value={masterCaption}
              onChange={e => setMasterCaption(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-[#d2dbd2] focus:outline-none focus:ring-2 focus:ring-[#205c49]/30 text-xs text-[#182b24] leading-relaxed"
              placeholder="Tulis caption atau naskah konten di sini..."
            />
          </div>

          {/* Preflight Warnings */}
          {preflightWarnings.length > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="font-bold text-[11px] text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Catatan Validasi Spesifikasi Platform:</span>
              </div>
              {preflightWarnings.map((w, idx) => (
                <div key={idx} className="text-[10px] text-amber-800 ml-5 list-disc">
                  • {w}
                </div>
              ))}
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-[#edf2ed] flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-600 font-semibold cursor-pointer"
            >
              Batal
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-all cursor-pointer"
              >
                Simpan ke Kalender
              </button>

              <button
                type="button"
                onClick={handleExecutePublishNow}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-[#205c49] hover:bg-[#184839] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Memproses...' : 'Kirim ke Schedule Platform'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
