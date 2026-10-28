import React, { useState } from 'react';
import {
  X,
  Settings,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Server,
  Cloud
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
  const [localConnections, setLocalConnections] = useState({ ...connections });
  const [localR2, setLocalR2] = useState({ ...r2Config });
  const [testingStatus, setTestingStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setLocalConnections({ ...connections });
      setLocalR2({ ...r2Config });
      setTestingStatus(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#dce4dc] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8e2] bg-[#f9fbf9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#205c49] text-white flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1a2d26] font-heading">
                Koneksi 5 Platform Sosial & Cloudflare R2
              </h2>
              <p className="text-[11px] text-[#63756b]">
                Manajemen token Dual-Mode (OAuth & Manual) untuk auto-publishing otomatis
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

        {/* Tab Navigation */}
        <div className="flex border-b border-[#edf2ed] bg-[#fafcfa] overflow-x-auto px-4 gap-1">
          {(['instagram', 'tiktok', 'youtube', 'threads', 'facebook'] as SocialPlatformKey[]).map(pf => {
            const meta = PLATFORMS_META[pf];
            const isConn = localConnections[pf]?.status === 'connected';
            const isActive = activeTab === pf;

            return (
              <button
                key={pf}
                onClick={() => setActiveTab(pf)}
                className={`py-2.5 px-3 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#205c49] text-[#205c49]'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConn ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-stone-300'
                  }`}
                />
              </button>
            );
          })}

          <button
            onClick={() => setActiveTab('r2')}
            className={`py-2.5 px-3 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'r2'
                ? 'border-[#205c49] text-[#205c49]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-amber-600" />
            <span>Cloudflare R2</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 flex-1 overflow-y-auto text-xs space-y-4">
          {activeTab === 'r2' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                <Cloud className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-950 leading-relaxed">
                  <div className="font-bold text-xs text-amber-900">
                    Cloudflare R2 Object Storage (Free Tier)
                  </div>
                  <div>
                    Gratis <b>10 GB storage per bulan</b> dan <b>Rp 0 biaya egress</b> saat server Instagram & TikTok mengunduh video Anda. Masukkan kredensial dari Cloudflare Dashboard &gt; R2.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#44564c] mb-1">
                    Cloudflare Account ID
                  </label>
                  <input
                    type="text"
                    value={localR2.accountId}
                    onChange={e => setLocalR2(prev => ({ ...prev, accountId: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#d2dbd2] text-xs"
                    placeholder="mis. 8f92a1040cb273..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#44564c] mb-1">
                    R2 Bucket Name
                  </label>
                  <input
                    type="text"
                    value={localR2.bucketName}
                    onChange={e => setLocalR2(prev => ({ ...prev, bucketName: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#d2dbd2] text-xs"
                    placeholder="ruang-konten-media"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#44564c] mb-1">
                    Access Key ID
                  </label>
                  <input
                    type="text"
                    value={localR2.accessKeyId}
                    onChange={e => setLocalR2(prev => ({ ...prev, accessKeyId: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#d2dbd2] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#44564c] mb-1">
                    Secret Access Key
                  </label>
                  <input
                    type="password"
                    value={localR2.secretAccessKey}
                    onChange={e => setLocalR2(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#d2dbd2] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#44564c] mb-1">
                  Public R2 URL (r2.dev atau Custom Domain)
                </label>
                <input
                  type="text"
                  value={localR2.publicUrl}
                  onChange={e => setLocalR2(prev => ({ ...prev, publicUrl: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#d2dbd2] text-xs"
                  placeholder="https://pub-xxxxxxxxxxxx.r2.dev"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Aktifkan 'R2.dev subdomain' di tab Settings bucket Cloudflare R2 Anda.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info platform */}
              <div className="p-3.5 rounded-2xl bg-[#f2f7f3] border border-[#d3e5d5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{PLATFORMS_META[activeTab].icon}</span>
                  <div>
                    <h3 className="font-bold text-xs text-[#192b24]">
                      {PLATFORMS_META[activeTab].name}
                    </h3>
                    <div className="text-[10px] text-[#55695e]">
                      {PLATFORMS_META[activeTab].specs.nativeScheduleSupported
                        ? 'Mendukung Native Scheduling bawaan platform'
                        : 'Mendukung Auto-Publishing Queue & Inbox Draft'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      localConnections[activeTab]?.status === 'connected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {localConnections[activeTab]?.status === 'connected'
                      ? 'Terhubung'
                      : 'Belum Terhubung'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTestConnection(activeTab)}
                    disabled={Boolean(testingStatus)}
                    className="px-3 py-1 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs font-bold text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${testingStatus === activeTab ? 'animate-spin' : ''}`} />
                    <span>Test Koneksi</span>
                  </button>
                </div>
              </div>

              {/* Mode Input Token Manual (Developer Mode) */}
              <div className="border border-[#dce4dc] rounded-2xl p-4 bg-white space-y-3">
                <div className="text-[11px] font-bold text-[#35483d] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Input Token / Kredensial Manual</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-1">
                      Account ID / Page ID / Channel ID
                    </label>
                    <input
                      type="text"
                      value={localConnections[activeTab]?.accountId || ''}
                      onChange={e => handleUpdateConnField(activeTab, 'accountId', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs"
                      placeholder={
                        activeTab === 'facebook'
                          ? 'Page ID Facebook'
                          : activeTab === 'instagram'
                          ? 'IG Business Account ID'
                          : activeTab === 'youtube'
                          ? 'YouTube Channel ID'
                          : 'User / Open ID'
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-1">
                      Nama Akun / @Handle Tampilan
                    </label>
                    <input
                      type="text"
                      value={localConnections[activeTab]?.accountName || ''}
                      onChange={e => handleUpdateConnField(activeTab, 'accountName', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs"
                      placeholder="mis. @trajecto.id"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-600 mb-1">
                    Access Token / Refresh Token (Secret)
                  </label>
                  <input
                    type="password"
                    value={localConnections[activeTab]?.tokenSecret || ''}
                    onChange={e => handleUpdateConnField(activeTab, 'tokenSecret', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-mono"
                    placeholder="Tempel token rahasia di sini..."
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    {activeTab === 'facebook' && 'Gunakan Page Access Token dari Meta Graph API Explorer / System User.'}
                    {activeTab === 'instagram' && 'Gunakan Long-Lived Token Instagram Graph API (60 hari) atau System User Token.'}
                    {activeTab === 'threads' && 'Gunakan Threads Long-Lived User Token dari Threads API.'}
                    {activeTab === 'youtube' && 'Gunakan Google OAuth 2.0 Refresh Token dengan scope youtube.upload.'}
                    {activeTab === 'tiktok' && 'Gunakan TikTok Open API Access Token (v2).'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e8e2] bg-[#f9fbf9] flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Token tersimpan aman secara lokal & di server Anda.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl hover:bg-stone-100 text-xs font-semibold text-stone-700 cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-[#205c49] hover:bg-[#184839] text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
