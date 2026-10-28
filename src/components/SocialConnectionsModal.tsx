import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Cloud,
  Eye,
  EyeOff,
  Globe,
  HardDrive,
  Check
} from 'lucide-react';
import {
  SocialPlatformKey,
  PlatformConnection,
  CloudflareR2Config
} from '../types';
import { PLATFORMS_META } from '../data/platforms';
import { testPlatformConnection } from '../services/socialApi';

interface SocialConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connections: Record<SocialPlatformKey, PlatformConnection>;
  r2Config: CloudflareR2Config;
  onSaveConnections: (updated: Record<SocialPlatformKey, PlatformConnection>) => void;
  onSaveR2Config: (config: CloudflareR2Config) => void;
  onNotify: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SocialConnectionsModal: React.FC<SocialConnectionsModalProps> = ({
  isOpen,
  onClose,
  connections,
  r2Config,
  onSaveConnections,
  onSaveR2Config,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<SocialPlatformKey | 'r2'>('instagram');
  const [localConnections, setLocalConnections] = useState<Record<SocialPlatformKey, PlatformConnection>>({ ...connections });
  const [localR2, setLocalR2] = useState<CloudflareR2Config>({ ...r2Config });
  const [testingStatus, setTestingStatus] = useState<string | null>(null);
  const [showTokenSecret, setShowTokenSecret] = useState(false);
  const [showR2Secret, setShowR2Secret] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalConnections({ ...connections });
      setLocalR2({ ...r2Config });
      setTestingStatus(null);
      setShowTokenSecret(false);
      setShowR2Secret(false);
    }
  }, [isOpen, connections, r2Config]);

  if (!isOpen) return null;

  const handleUpdateConnField = (
    pf: SocialPlatformKey,
    field: keyof PlatformConnection,
    value: any
  ) => {
    setLocalConnections(prev => ({
      ...prev,
      [pf]: {
        ...prev[pf],
        [field]: value
      }
    }));
  };

  const handleTestConnection = async (pf: SocialPlatformKey) => {
    setTestingStatus(pf);
    try {
      const res = await testPlatformConnection(pf, localConnections[pf]);
      if (res.success) {
        handleUpdateConnField(pf, 'status', 'connected');
        if (res.accountName) handleUpdateConnField(pf, 'accountName', res.accountName);
        if (res.accountHandle) handleUpdateConnField(pf, 'accountHandle', res.accountHandle);
        onNotify(res.message, 'success');
      } else {
        handleUpdateConnField(pf, 'status', 'error');
        handleUpdateConnField(pf, 'lastError', res.message);
        onNotify(res.message, 'error');
      }
    } catch (e: any) {
      onNotify(e.message || 'Gagal memverifikasi token', 'error');
    } finally {
      setTestingStatus(null);
    }
  };

  const handleSaveAll = () => {
    onSaveConnections(localConnections);
    onSaveR2Config(localR2);
    onNotify('Pengaturan token 5 platform & Cloudflare R2 berhasil disimpan.', 'success');
    onClose();
  };

  const connectedCount = (['instagram', 'tiktok', 'youtube', 'threads', 'facebook'] as SocialPlatformKey[])
    .filter(pf => localConnections[pf]?.status === 'connected').length;

  const isR2Configured = Boolean(
    localR2.accountId && localR2.bucketName && localR2.accessKeyId && localR2.secretAccessKey && localR2.publicUrl
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#dce5db] overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        {/* Header Bersih & Lega */}
        <div className="px-6 py-4.5 border-b border-[#edf1eb] bg-[#fbfdfb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#205c49] text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#142620] font-heading flex items-center gap-2">
                <span>Koneksi Platform & Cloudflare R2</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-[#1e5845] border border-emerald-200">
                  {connectedCount}/5 Terhubung
                </span>
              </h2>
              <p className="text-xs text-[#62776a]">
                Pengaturan integrasi API resmi & Cloudflare Storage untuk publikasi otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#687b70] hover:text-[#142620] hover:bg-[#edf3ec] transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Master-Detail Layout Dua Kolom (Bebas Tumpukan) */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Kolom Kiri: Navigasi Platform & Storage (Master) */}
          <div className="w-72 shrink-0 bg-[#f9fbf8] border-r border-[#e4ebe3] flex flex-col justify-between p-3.5 select-none overflow-y-auto">
            <div className="space-y-4">
              {/* Grup Platform Sosial */}
              <div>
                <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#798e81]">
                  Media Sosial (5 Platform)
                </div>
                <div className="space-y-1">
                  {(['instagram', 'tiktok', 'youtube', 'threads', 'facebook'] as SocialPlatformKey[]).map(pf => {
                    const meta = PLATFORMS_META[pf];
                    const conn = localConnections[pf];
                    const isConn = conn?.status === 'connected';
                    const isSelected = activeTab === pf;

                    return (
                      <button
                        key={pf}
                        type="button"
                        onClick={() => setActiveTab(pf)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-[#142620] shadow-sm border border-[#cfded1] ring-2 ring-[#205c49]/15'
                            : 'text-[#415549] hover:bg-[#eef5ed] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{meta.icon}</span>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate flex items-center gap-1.5">
                              <span>{meta.name}</span>
                            </div>
                            <div className="text-[10px] text-[#718578] truncate">
                              {conn?.accountName || conn?.accountHandle || 'Belum diatur'}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isConn
                              ? 'bg-emerald-500 ring-4 ring-emerald-100'
                              : 'bg-stone-300'
                          }`}
                          title={isConn ? 'Terhubung' : 'Belum Terhubung'}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grup Media Storage */}
              <div>
                <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#798e81]">
                  Penyimpanan Objek Publik
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('r2')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                    activeTab === 'r2'
                      ? 'bg-white text-[#142620] shadow-sm border border-[#cfded1] ring-2 ring-[#205c49]/15'
                      : 'text-[#415549] hover:bg-[#eef5ed] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Cloud className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">Cloudflare R2</div>
                      <div className="text-[10px] text-[#718578] truncate">
                        {isR2Configured ? 'Bucket Terhubung' : '10 GB Free Storage'}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isR2Configured
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : 'bg-stone-300'
                    }`}
                    title={isR2Configured ? 'Storage Aktif' : 'Storage Belum Lengkap'}
                  />
                </button>
              </div>
            </div>

            {/* Kotak Ringkasan Bawah Sidebar */}
            <div className="p-3 bg-white rounded-2xl border border-[#dce5db] text-xs space-y-1.5 mt-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#788c7f]">
                Status Eksekusi
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#2c4034]">
                <span>Sosial Media:</span>
                <span className="font-bold text-[#205c49]">{connectedCount} dari 5 aktif</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#2c4034]">
                <span>Cloudflare R2:</span>
                <span className={`font-bold ${isR2Configured ? 'text-emerald-700' : 'text-stone-500'}`}>
                  {isR2Configured ? 'Siap Upload' : 'Belum diisi'}
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Area Konfigurasi Lega & Terfokus (Detail) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6 bg-white">
            {activeTab === 'r2' ? (
              /* PANEL CLOUDFLARE R2 */
              <div className="space-y-6 animate-in fade-in">
                {/* Header R2 */}
                <div className="flex items-center justify-between pb-4 border-b border-[#edf1eb] flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-xs">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#142620] font-heading flex items-center gap-2">
                        <span>Cloudflare R2 Object Storage</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Free Tier 10 GB
                        </span>
                      </h3>
                      <p className="text-xs text-[#63776a]">
                        Tempat penampungan file video/gambar publik untuk ditarik oleh API Instagram, TikTok, & YouTube
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                      isR2Configured
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isR2Configured ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                    <span>{isR2Configured ? 'Konfigurasi Lengkap' : 'Belum Lengkap'}</span>
                  </span>
                </div>

                {/* Info Keunggulan R2 Free */}
                <div className="p-4 rounded-2xl bg-[#f5f8f5] border border-[#d6e3d7] flex items-start gap-3">
                  <HardDrive className="w-4 h-4 text-[#205c49] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#354b3e] leading-relaxed">
                    <strong>Mengapa Cloudflare R2?</strong> Berbeda dengan AWS S3, Cloudflare R2 memberikan <b>Rp 0 biaya egress</b> (download bandwidth gratis selamanya) dan <b>10 GB storage gratis tiap bulan</b>. Sangat ideal untuk menampung video Reels/TikTok.
                  </div>
                </div>

                {/* Form Input R2 Grid Dua Kolom */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-[#142620] uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#205c49]" />
                    <span>1. Kredensial S3-Compatible API</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                        Cloudflare Account ID *
                      </label>
                      <input
                        type="text"
                        value={localR2.accountId}
                        onChange={e => setLocalR2(prev => ({ ...prev, accountId: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                        placeholder="mis. 8f92a1040cb27318..."
                      />
                      <span className="text-[10px] text-[#718578] mt-1 block">Ditemukan di URL Cloudflare Dashboard</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                        R2 Bucket Name *
                      </label>
                      <input
                        type="text"
                        value={localR2.bucketName}
                        onChange={e => setLocalR2(prev => ({ ...prev, bucketName: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                        placeholder="mis. ruang-konten-media"
                      />
                      <span className="text-[10px] text-[#718578] mt-1 block">Nama bucket R2 yang telah Anda buat</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                        Access Key ID *
                      </label>
                      <input
                        type="text"
                        value={localR2.accessKeyId}
                        onChange={e => setLocalR2(prev => ({ ...prev, accessKeyId: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                        placeholder="Access Key R2 API Token"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                        Secret Access Key *
                      </label>
                      <div className="relative">
                        <input
                          type={showR2Secret ? 'text' : 'password'}
                          value={localR2.secretAccessKey}
                          onChange={e => setLocalR2(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                          className="w-full px-3.5 py-2 pr-10 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                          placeholder="Secret Key Token"
                        />
                        <button
                          type="button"
                          onClick={() => setShowR2Secret(!showR2Secret)}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          {showR2Secret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* URL Publik */}
                <div className="space-y-2 pt-2 border-t border-[#edf1eb]">
                  <label className="block text-xs font-bold text-[#2a3e33]">
                    2. Public R2 URL (Public Domain / r2.dev Subdomain) *
                  </label>
                  <input
                    type="text"
                    value={localR2.publicUrl}
                    onChange={e => setLocalR2(prev => ({ ...prev, publicUrl: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                    placeholder="https://pub-xxxxxxxxxxxx.r2.dev atau https://media.brandanda.com"
                  />
                  <p className="text-[11px] text-[#63776a] leading-relaxed">
                    💡 Aktifkan <b>Public Development URL (r2.dev)</b> di menu <i>Bucket Settings &gt; Public Access</i> pada Cloudflare Dashboard Anda agar media dapat diakses oleh server TikTok/Meta.
                  </p>
                </div>
              </div>
            ) : (
              /* PANEL DETAIL PLATFORM SOSIAL */
              <div className="space-y-6 animate-in fade-in">
                {/* Header Detail Platform */}
                <div className="flex items-center justify-between pb-4 border-b border-[#edf1eb] flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">{PLATFORMS_META[activeTab].icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-[#142620] font-heading flex items-center gap-2">
                        <span>{PLATFORMS_META[activeTab].name}</span>
                        {localConnections[activeTab]?.status === 'connected' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Terhubung</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                            Belum Terhubung
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#63776a]">
                        {PLATFORMS_META[activeTab].specs.nativeScheduleSupported
                          ? 'Mendukung penjadwalan native server bawaan platform'
                          : 'Mendukung auto-publishing queue & draft inbox'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTestConnection(activeTab)}
                    disabled={Boolean(testingStatus)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f1f6ef] border border-[#cfded1] text-xs font-bold text-[#205c49] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingStatus === activeTab ? 'animate-spin' : ''}`} />
                    <span>{testingStatus === activeTab ? 'Menguji...' : 'Uji Koneksi'}</span>
                  </button>
                </div>

                {/* Section 1: Identitas Akun */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#142620] uppercase tracking-wider flex items-center gap-1.5">
                    <span>1. Identitas Akun & Handle</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                        {activeTab === 'facebook'
                          ? 'Page ID Facebook'
                          : activeTab === 'instagram'
                          ? 'Instagram Business Account ID'
                          : activeTab === 'youtube'
                          ? 'YouTube Channel ID'
                          : 'Akun / Open ID Platform'}
                      </label>
                      <input
                        type="text"
                        value={localConnections[activeTab]?.accountId || ''}
                        onChange={e => handleUpdateConnField(activeTab, 'accountId', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                        placeholder="Contoh: 178414001234567"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                        Nama Tampilan / @Handle Akun
                      </label>
                      <input
                        type="text"
                        value={localConnections[activeTab]?.accountName || ''}
                        onChange={e => handleUpdateConnField(activeTab, 'accountName', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs bg-white outline-none focus:border-[#205c49]"
                        placeholder="Contoh: @trajecto.id"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Kredensial Token Rahasia */}
                <div className="space-y-3 pt-2 border-t border-[#edf1eb]">
                  <div className="text-xs font-bold text-[#142620] uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#205c49]" />
                    <span>2. Access Token / Token Rahasia</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2a3e33] mb-1">
                      Long-Lived Access Token / Refresh Token (Secret)
                    </label>
                    <div className="relative">
                      <input
                        type={showTokenSecret ? 'text' : 'password'}
                        value={localConnections[activeTab]?.tokenSecret || ''}
                        onChange={e => handleUpdateConnField(activeTab, 'tokenSecret', e.target.value)}
                        className="w-full px-3.5 py-2 pr-10 rounded-xl border border-[#cbd8cb] text-xs font-mono bg-white outline-none focus:border-[#205c49]"
                        placeholder="Tempel token rahasia resmi di sini..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowTokenSecret(!showTokenSecret)}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showTokenSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Panduan Pengambilan Token yang Rapi & Tenang */}
                  <div className="p-3.5 rounded-2xl bg-[#f7faf6] border border-[#d6e3d7] text-xs text-[#3a5243] space-y-1 leading-relaxed">
                    <div className="font-bold flex items-center gap-1.5 text-[#1b3b2c]">
                      <ShieldCheck className="w-4 h-4 text-[#205c49]" />
                      <span>Panduan Resmi {PLATFORMS_META[activeTab].name}:</span>
                    </div>
                    {activeTab === 'facebook' && (
                      <p>Gunakan <b>Page Access Token</b> permanen dari Meta for Developers &gt; Graph API Explorer atau via System User Business Manager.</p>
                    )}
                    {activeTab === 'instagram' && (
                      <p>Gunakan <b>Instagram Graph API Long-Lived Token</b> (masa berlaku 60 hari) atau Token System User dengan permission <code>instagram_content_publish</code>.</p>
                    )}
                    {activeTab === 'threads' && (
                      <p>Gunakan <b>Threads Long-Lived User Token</b> dari Threads API dengan scope <code>threads_basic</code> dan <code>threads_content_publish</code>.</p>
                    )}
                    {activeTab === 'youtube' && (
                      <p>Gunakan <b>Google OAuth 2.0 Refresh Token</b> dari Google Cloud Console dengan scope <code>https://www.googleapis.com/auth/youtube.upload</code>.</p>
                    )}
                    {activeTab === 'tiktok' && (
                      <p>Gunakan <b>TikTok Open API Access Token (v2)</b> dengan scope <code>video.upload</code> dan <code>video.publish</code>.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bersih */}
        <div className="px-6 py-4 border-t border-[#edf1eb] bg-[#fbfdfb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#5f7467]">
            <ShieldCheck className="w-4 h-4 text-[#205c49]" />
            <span>Kredensial disimpan terenkripsi di server lokal Anda.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl hover:bg-[#edf3ec] text-xs font-semibold text-[#405448] transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-[#205c49] hover:bg-[#184839] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
