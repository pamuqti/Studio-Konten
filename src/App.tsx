import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BrandBrain,
  ContentDocument,
  ContentItem,
  ContentPlanOptions,
  ContentStatus,
  StrategyBlueprint,
  ToastMessage,
  ScheduledPost,
  SocialPlatformKey,
  PlatformConnection,
  CloudflareR2Config
} from './types';
import { sampleBrandTrajecto, emptyBrand } from './data/sampleBrand';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { ContentItemModal } from './components/ContentItemModal';
import { BriefModal } from './components/BriefModal';
import { BrandBrainModal } from './components/BrandBrainModal';
import { StrategistModal } from './components/StrategistModal';
import { AiToolsView } from './components/AiToolsView';
import { HistoryView } from './components/HistoryView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DesktopInstallModal } from './components/DesktopInstallModal';
import { ToastContainer } from './components/Toast';
import { PublishingCalendarView } from './components/PublishingCalendarView';
import { ContentPoolDrawer } from './components/ContentPoolDrawer';
import { PostSchedulerModal } from './components/PostSchedulerModal';
import { SocialConnectionsModal } from './components/SocialConnectionsModal';
import { generateTemplatePlan, generateContentPlanAi } from './services/gemini';
import { executePublishPost } from './services/socialApi';

const STORAGE_KEY = 'ruang-konten-v3';

const defaultConnections: Record<SocialPlatformKey, PlatformConnection> = {
  instagram: {
    platform: 'instagram',
    authMethod: 'manual_token',
    status: 'disconnected',
    accountId: '',
    accountName: '',
    accountHandle: '',
    defaultPublishMode: 'auto_queue',
    autoPublishEnabled: true
  },
  tiktok: {
    platform: 'tiktok',
    authMethod: 'manual_token',
    status: 'disconnected',
    accountId: '',
    accountName: '',
    accountHandle: '',
    defaultPublishMode: 'inbox_draft',
    autoPublishEnabled: true
  },
  youtube: {
    platform: 'youtube',
    authMethod: 'manual_token',
    status: 'disconnected',
    accountId: '',
    accountName: '',
    accountHandle: '',
    defaultPublishMode: 'native_schedule',
    autoPublishEnabled: true
  },
  threads: {
    platform: 'threads',
    authMethod: 'manual_token',
    status: 'disconnected',
    accountId: '',
    accountName: '',
    accountHandle: '',
    defaultPublishMode: 'auto_queue',
    autoPublishEnabled: true
  },
  facebook: {
    platform: 'facebook',
    authMethod: 'manual_token',
    status: 'disconnected',
    accountId: '',
    accountName: '',
    accountHandle: '',
    defaultPublishMode: 'native_schedule',
    autoPublishEnabled: true
  }
};

const defaultR2: CloudflareR2Config = {
  accountId: '',
  accessKeyId: '',
  secretAccessKey: '',
  bucketName: 'ruang-konten-media',
  publicUrl: '',
  isConfigured: false
};

export default function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // State initialization from localStorage
  const [appState, setAppState] = useState<{
    brand: BrandBrain;
    brands: BrandBrain[];
    activeBrandId: string;
    docs: ContentDocument[];
    activeDocId: Record<string, string | null>;
    scheduledPosts: ScheduledPost[];
    connections: Record<SocialPlatformKey, PlatformConnection>;
    r2Config: CloudflareR2Config;
  }>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validDocs = Array.isArray(parsed?.docs)
          ? parsed.docs.filter((d: any) => d && d.id && Array.isArray(d.items))
          : [];

        let loadedBrands: BrandBrain[] = Array.isArray(parsed?.brands) && parsed.brands.length > 0
          ? parsed.brands
          : [
              parsed?.brand && typeof parsed.brand === 'object' && parsed.brand.name
                ? { ...sampleBrandTrajecto, ...parsed.brand }
                : sampleBrandTrajecto
            ];

        loadedBrands = loadedBrands.map((b, idx) => ({
          ...b,
          id: b.id || `brand-${idx + 1}-${(b.name || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '')}`
        }));

        const activeId = parsed?.activeBrandId || loadedBrands[0].id || 'brand-trajecto';
        const activeBrand = loadedBrands.find(b => b.id === activeId) || loadedBrands[0];

        return {
          brand: activeBrand,
          brands: loadedBrands,
          activeBrandId: activeBrand.id || 'brand-trajecto',
          docs: validDocs,
          activeDocId: parsed?.activeDocId || {},
          scheduledPosts: Array.isArray(parsed?.scheduledPosts) ? parsed.scheduledPosts : [],
          connections: parsed?.connections || defaultConnections,
          r2Config: parsed?.r2Config || defaultR2
        };
      }
    } catch (e) {
      console.error("Error loading stored app state:", e);
    }

    // Default with pre-seeded sample plan for Trajecto
    const initialPlan = generateTemplatePlan(sampleBrandTrajecto, {
      topic: "Personal Productivity & Agile Focus Operating System",
      count: 30,
      goal: "Awareness & Konversi"
    });

    return {
      brand: sampleBrandTrajecto,
      brands: [sampleBrandTrajecto],
      activeBrandId: sampleBrandTrajecto.id || 'brand-trajecto',
      docs: [initialPlan],
      activeDocId: { plan: initialPlan.id },
      scheduledPosts: [],
      connections: defaultConnections,
      r2Config: defaultR2
    };
  });

  const [currentView, setCurrentView] = useState<'plan' | 'publish_calendar' | 'brand' | 'tools' | 'history'>('plan');
  const [useAI, setUseAI] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isStrategistModalOpen, setIsStrategistModalOpen] = useState(false);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [viewingBriefItem, setViewingBriefItem] = useState<ContentItem | null>(null);

  // Social Publishing Modals & Drawers
  const [isPoolDrawerOpen, setIsPoolDrawerOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [schedulingContentItem, setSchedulingContentItem] = useState<ContentItem | null>(null);
  const [editingScheduledPost, setEditingScheduledPost] = useState<ScheduledPost | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | undefined>();

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error("Error saving app state to localStorage:", e);
    }
  }, [appState]);

  const activeDoc = useMemo(() => {
    if (currentView === 'tools' || currentView === 'history' || currentView === 'brand') return null;
    const docId = appState.activeDocId[currentView];
    if (docId) {
      const found = appState.docs.find(d => d.id === docId);
      if (found) return found;
    }
    return appState.docs.find(d => d.module === currentView) || null;
  }, [appState.docs, appState.activeDocId, currentView]);

  const handleGeneratePlan = async (options: ContentPlanOptions) => {
    setIsGenerating(true);
    try {
      const basePlan = generateTemplatePlan(appState.brand, options);
      let finalPlan = basePlan;

      if (useAI) {
        try {
          const aiItems = await generateContentPlanAi(appState.brand, options, basePlan.items);
          finalPlan = {
            ...basePlan,
            source: 'gemini',
            items: aiItems
          };
          addToast(`Kalender konten berhasil disusun menggunakan Gemini AI!`, 'success');
        } catch (err: any) {
          console.warn("AI generation failed, fallback to curated templates:", err);
          finalPlan = basePlan;
          addToast(`Pola kurasi editorial berhasil disusun (${err.message || 'offline fallback'}).`, 'info');
        }
      } else {
        addToast("Kalender konten berhasil disusun dari pola editorial kurasi.", 'success');
      }

      setAppState(prev => {
        const withoutCurrent = prev.docs.filter(d => d.id !== finalPlan.id);
        return {
          ...prev,
          docs: [finalPlan, ...withoutCurrent],
          activeDocId: {
            ...prev.activeDocId,
            plan: finalPlan.id
          }
        };
      });
    } catch (e: any) {
      addToast(e.message || "Gagal menyusun rencana konten.", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyStrategistPlan = (
    items: ContentItem[],
    blueprint: StrategyBlueprint,
    dayCount: number
  ) => {
    const newDoc: ContentDocument = {
      version: 1,
      id: `plan-consulted-${Date.now()}`,
      module: "plan",
      title: `Kalender Konten (${dayCount} Hari) · ${appState.brand.name}`,
      brand: appState.brand,
      options: {
        topic: blueprint.coreAngle,
        count: dayCount,
        goal: blueprint.summary
      },
      items,
      source: "gemini",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
      strategyNotes: blueprint.summary,
      history: [
        {
          timestamp: new Date().toISOString(),
          action: `Dihasilkan melalui Konsultasi Strategis Interaktif Gemini (${blueprint.summary})`
        }
      ]
    };

    setAppState(prev => {
      const rest = prev.docs.filter(d => d.id !== newDoc.id);
      return {
        ...prev,
        docs: [newDoc, ...rest],
        activeDocId: {
          ...prev.activeDocId,
          plan: newDoc.id
        }
      };
    });

    setCurrentView('plan');
    addToast(`Kalender konten ${dayCount} hari berhasil diterapkan dari Konsultasi AI!`, 'success');
  };

  const handleSelectBrand = (brandId: string) => {
    const found = appState.brands.find(b => b.id === brandId);
    if (!found) return;
    setAppState(prev => ({
      ...prev,
      activeBrandId: found.id || brandId,
      brand: found
    }));
    addToast(`Beralih ke profil brand "${found.name}".`, 'info');
  };

  const handleSaveBrand = (newBrand: BrandBrain) => {
    const brandWithId: BrandBrain = {
      ...newBrand,
      id: newBrand.id || appState.brand.id || `brand-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    setAppState(prev => {
      const exists = prev.brands.some(b => b.id === brandWithId.id);
      const updatedBrands = exists
        ? prev.brands.map(b => (b.id === brandWithId.id ? brandWithId : b))
        : [...prev.brands, brandWithId];

      return {
        ...prev,
        brands: updatedBrands,
        brand: brandWithId,
        activeBrandId: brandWithId.id || prev.activeBrandId
      };
    });

    addToast(`Profil Brand Brain "${brandWithId.name}" berhasil disimpan.`, 'success');
  };

  const handleCreateBrand = (newBrand: BrandBrain) => {
    const brandWithId: BrandBrain = {
      ...newBrand,
      id: newBrand.id || `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAppState(prev => ({
      ...prev,
      brands: [...prev.brands, brandWithId],
      brand: brandWithId,
      activeBrandId: brandWithId.id || `brand-${Date.now()}`
    }));

    addToast(`Profil baru "${brandWithId.name}" berhasil dibuat dan diaktifkan.`, 'success');
  };

  const handleDuplicateBrand = (brandId: string) => {
    const target = appState.brands.find(b => b.id === brandId) || appState.brand;
    const duplicated: BrandBrain = {
      ...target,
      id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${target.name} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAppState(prev => ({
      ...prev,
      brands: [...prev.brands, duplicated],
      brand: duplicated,
      activeBrandId: duplicated.id || ''
    }));

    addToast(`Profil "${duplicated.name}" berhasil diduplikasi dan diaktifkan.`, 'success');
  };

  const handleDeleteBrand = (brandId: string) => {
    if (appState.brands.length <= 1) {
      addToast('Tidak bisa menghapus: Minimal harus ada 1 profil brand.', 'error');
      return;
    }

    setAppState(prev => {
      const remaining = prev.brands.filter(b => b.id !== brandId);
      const nextActive = prev.activeBrandId === brandId ? remaining[0] : prev.brand;
      return {
        ...prev,
        brands: remaining,
        brand: nextActive,
        activeBrandId: nextActive.id || remaining[0].id || ''
      };
    });

    addToast('Profil brand berhasil dihapus.', 'info');
  };

  const handleImportBrands = (importedBrands: BrandBrain[]) => {
    if (!importedBrands.length) return;
    const sanitized = importedBrands.map((b, idx) => ({
      ...emptyBrand,
      ...b,
      id: b.id || `brand-imported-${Date.now()}-${idx}`
    }));

    setAppState(prev => {
      const existingIds = new Set(prev.brands.map(b => b.id));
      const newBrands = sanitized.filter(b => !existingIds.has(b.id));
      const combined = [...prev.brands, ...newBrands];
      const active = sanitized[0] || prev.brand;

      return {
        ...prev,
        brands: combined,
        brand: active,
        activeBrandId: active.id || combined[0].id || ''
      };
    });

    addToast(`Berhasil mengimpor ${sanitized.length} profil brand.`, 'success');
  };

  const handleUpdateItem = (updatedItem: ContentItem) => {
    if (!activeDoc) return;
    const newItems = activeDoc.items.map(it => (it.id === updatedItem.id ? updatedItem : it));
    const updatedDoc: ContentDocument = {
      ...activeDoc,
      updatedAt: new Date().toISOString(),
      items: newItems
    };
    setAppState(prev => ({
      ...prev,
      docs: prev.docs.map(d => (d.id === updatedDoc.id ? updatedDoc : d))
    }));
  };

  const handleAddItem = (newItem: ContentItem) => {
    if (!activeDoc) {
      const newPlan = generateTemplatePlan(appState.brand, { topic: "Konten Baru", count: 0 });
      newPlan.items = [newItem];
      setAppState(prev => ({
        ...prev,
        docs: [newPlan, ...prev.docs],
        activeDocId: { ...prev.activeDocId, plan: newPlan.id }
      }));
    } else {
      const updatedDoc: ContentDocument = {
        ...activeDoc,
        updatedAt: new Date().toISOString(),
        items: [newItem, ...activeDoc.items]
      };
      setAppState(prev => ({
        ...prev,
        docs: prev.docs.map(d => (d.id === updatedDoc.id ? updatedDoc : d))
      }));
    }
    addToast("1 konten baru berhasil ditambahkan ke kalender.", 'success');
  };

  const handleDeleteItems = (ids: string[]) => {
    if (!activeDoc) return;
    const idSet = new Set(ids);
    const newItems = activeDoc.items.filter(it => !idSet.has(it.id));
    const updatedDoc: ContentDocument = {
      ...activeDoc,
      updatedAt: new Date().toISOString(),
      items: newItems
    };
    setAppState(prev => ({
      ...prev,
      docs: prev.docs.map(d => (d.id === updatedDoc.id ? updatedDoc : d))
    }));
    addToast(`${ids.length} konten berhasil dihapus dari rencana.`, 'info');
  };

  const handleBulkUpdateItems = (newItems: ContentItem[]) => {
    if (!activeDoc) return;
    const updatedDoc: ContentDocument = {
      ...activeDoc,
      updatedAt: new Date().toISOString(),
      items: newItems
    };
    setAppState(prev => ({
      ...prev,
      docs: prev.docs.map(d => (d.id === updatedDoc.id ? updatedDoc : d))
    }));
  };

  const handleStatusChange = (id: string, newStatus: ContentStatus) => {
    if (!activeDoc) return;
    const newItems = activeDoc.items.map(it => (it.id === id ? { ...it, status: newStatus } : it));
    const updatedDoc: ContentDocument = {
      ...activeDoc,
      updatedAt: new Date().toISOString(),
      items: newItems
    };
    setAppState(prev => ({
      ...prev,
      docs: prev.docs.map(d => (d.id === updatedDoc.id ? updatedDoc : d))
    }));
  };

  const handleOpenDoc = (doc: ContentDocument) => {
    setCurrentView('plan');
    setAppState(prev => ({
      ...prev,
      activeDocId: {
        ...prev.activeDocId,
        [doc.module]: doc.id
      }
    }));
    addToast(`Membuka proyek "${doc.title}".`, 'success');
  };

  const handleDeleteDoc = (id: string) => {
    setAppState(prev => ({
      ...prev,
      docs: prev.docs.filter(d => d.id !== id)
    }));
  };

  const handleImportDocs = (importedDocs: ContentDocument[]) => {
    setAppState(prev => ({
      ...prev,
      docs: [...importedDocs, ...prev.docs]
    }));
  };

  // Naskah yang sudah disetujui (Approved) otomatis menjadi isi Kantong Naskah
  const approvedItems = useMemo(() => {
    const planDoc = activeDoc?.module === 'plan' ? activeDoc : appState.docs.find(d => d.module === 'plan');
    return planDoc ? planDoc.items.filter(it => it.status === 'approved') : [];
  }, [activeDoc, appState.docs]);

  const handleStartSchedulePoolItem = (item: ContentItem) => {
    setSchedulingContentItem(item);
    setEditingScheduledPost(null);
    setIsPoolDrawerOpen(false);
    setIsSchedulerModalOpen(true);
  };

  const handleSelectCalendarDate = (dateStr: string) => {
    setSelectedCalendarDate(dateStr);
    setSchedulingContentItem(null);
    setEditingScheduledPost(null);
    setIsSchedulerModalOpen(true);
  };

  const handleEditScheduledPost = (post: ScheduledPost) => {
    setEditingScheduledPost(post);
    setSchedulingContentItem(null);
    setIsSchedulerModalOpen(true);
  };

  const handleSaveScheduledPost = (post: ScheduledPost) => {
    setAppState(prev => {
      const exists = prev.scheduledPosts.some(p => p.id === post.id);
      const updated = exists
        ? prev.scheduledPosts.map(p => (p.id === post.id ? post : p))
        : [...prev.scheduledPosts, post];
      return {
        ...prev,
        scheduledPosts: updated
      };
    });
    addToast(`Jadwal untuk ${post.scheduledDate} ${post.scheduledTime} WIB berhasil disimpan!`, 'success');
  };

  const handlePublishNow = async (post: ScheduledPost) => {
    try {
      addToast('Mengeksekusi publikasi ke platform sosial media...', 'info');
      const res = await executePublishPost(post, appState.connections);

      const updatedLogs: any = {};
      let hasNativeScheduled = false;
      let hasInboxSent = false;
      let hasPublished = false;
      const failedPlatforms: string[] = [];

      Object.entries(res.results || {}).forEach(([pf, r]: any) => {
        if (r.status === 'failed') failedPlatforms.push(pf);
        updatedLogs[pf] = {
          platform: pf,
          mode: post.platformOverrides?.[pf as SocialPlatformKey]?.publishMode || 'auto_queue',
          status: r.status,
          scheduledAt: post.scheduledAtIso,
          executedAt: new Date().toISOString(),
          externalPostId: r.externalPostId,
          externalPostUrl: r.externalPostUrl,
          errorMessage: r.errorMessage,
          retryCount: 0
        };

        if (r.status === 'native_scheduled') hasNativeScheduled = true;
        if (r.status === 'inbox_sent') hasInboxSent = true;
        if (r.status === 'published') hasPublished = true;
      });

      const succeededCount = Object.keys(updatedLogs).length - failedPlatforms.length;
      const overallStatus: ScheduledPost['overallStatus'] = succeededCount === 0
        ? 'failed'
        : failedPlatforms.length > 0
        ? 'partial'
        : hasPublished
        ? 'published'
        : hasNativeScheduled
        ? 'native_scheduled'
        : hasInboxSent
        ? 'inbox_sent'
        : 'queued';

      const finalizedPost: ScheduledPost = {
        ...post,
        overallStatus,
        publishLogs: updatedLogs,
        updatedAt: new Date().toISOString()
      };

      handleSaveScheduledPost(finalizedPost);
      if (failedPlatforms.length === 0) {
        addToast('Konten berhasil diproses ke platform target!', 'success');
      } else {
        const firstError = res.results?.[failedPlatforms[0]]?.errorMessage;
        addToast(`Gagal di ${failedPlatforms.join(', ')}${firstError ? `: ${firstError}` : ''}`, 'error');
      }
    } catch (e: any) {
      addToast(e.message || 'Gagal memproses ke platform', 'error');
    }
  };

  const handleDeleteScheduledPost = (id: string) => {
    setAppState(prev => ({
      ...prev,
      scheduledPosts: prev.scheduledPosts.filter(p => p.id !== id)
    }));
    addToast('Jadwal post berhasil dihapus dari kalender tayang.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#192a24] flex font-sans antialiased selection:bg-[#205c49] selection:text-white">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={v => {
          setCurrentView(v as any);
          setMobileMenuOpen(false);
        }}
        brand={appState.brand}
        brands={appState.brands}
        onSelectBrand={handleSelectBrand}
        onOpenBrandModal={() => setCurrentView('brand')}
        onOpenStrategistModal={() => setIsStrategistModalOpen(true)}
        docs={appState.docs}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenDesktopModal={() => setIsDesktopModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenConnectionsModal={() => setIsConnectionsModalOpen(true)}
        onNotify={addToast}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <Header
          currentView={currentView}
          activeDoc={activeDoc}
          brand={appState.brand}
          useAI={useAI}
          onToggleAI={ai => {
            setUseAI(ai);
            addToast(ai ? "Mode Gemini AI aktif." : "Mode Pola Editorial aktif.", "info");
          }}
          onOpenBrandModal={() => setCurrentView('brand')}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onOpenStrategistModal={() => setIsStrategistModalOpen(true)}
          onOpenDesktopModal={() => setIsDesktopModalOpen(true)}
          onSelectView={setCurrentView}
          onOpenPool={() => setIsPoolDrawerOpen(true)}
          onOpenConnections={() => setIsConnectionsModalOpen(true)}
          approvedCount={approvedItems.length}
          connectedCount={Object.values(appState.connections).filter((c: any) => c?.status === 'connected').length}
          onNotify={addToast}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'plan' && (
              <CalendarView
                document={activeDoc}
                brand={appState.brand}
                useAI={useAI}
                isGenerating={isGenerating}
                onGenerate={handleGeneratePlan}
                onOpenStrategistModal={() => setIsStrategistModalOpen(true)}
                onEditItem={item => setEditingItem(item)}
                onViewBrief={item => setViewingBriefItem(item)}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItems={handleDeleteItems}
                onBulkUpdateItems={handleBulkUpdateItems}
                onStatusChange={handleStatusChange}
                onNotify={addToast}
              />
            )}

            {currentView === 'publish_calendar' && (
              <PublishingCalendarView
                posts={appState.scheduledPosts}
                approvedItemsCount={approvedItems.length}
                onOpenPool={() => setIsPoolDrawerOpen(true)}
                onSelectDate={handleSelectCalendarDate}
                onEditPost={handleEditScheduledPost}
                onDeletePost={handleDeleteScheduledPost}
                onNewPost={() => {
                  setEditingScheduledPost(null);
                  setSchedulingContentItem(null);
                  setSelectedCalendarDate(undefined);
                  setIsSchedulerModalOpen(true);
                }}
              />
            )}

            {currentView === 'brand' && (
              <BrandBrainModal
                isOpen={true}
                embedded={true}
                onClose={() => setCurrentView('plan')}
                brand={appState.brand}
                brands={appState.brands}
                activeBrandId={appState.activeBrandId}
                onSelectBrand={handleSelectBrand}
                onSave={handleSaveBrand}
                onCreateBrand={handleCreateBrand}
                onDuplicateBrand={handleDuplicateBrand}
                onDeleteBrand={handleDeleteBrand}
                onImportBrands={handleImportBrands}
                onNotify={addToast}
              />
            )}

            {currentView === 'tools' && (
              <AiToolsView
                brand={appState.brand}
                onNotify={addToast}
                onUpdateBrand={handleSaveBrand}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                docs={appState.docs}
                onOpenDoc={handleOpenDoc}
                onDeleteDoc={handleDeleteDoc}
                onImportDocs={handleImportDocs}
                onNotify={addToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals & Overlays */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={hasKey => {
          addToast(hasKey ? "Gemini API Key tersimpan. Fitur AI siap digunakan!" : "Gemini API Key dihapus.", "info");
        }}
      />

      <StrategistModal
        isOpen={isStrategistModalOpen}
        onClose={() => setIsStrategistModalOpen(false)}
        brand={appState.brand}
        onApplyPlan={handleApplyStrategistPlan}
        onNotify={addToast}
      />

      <ContentItemModal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        brand={appState.brand}
        onSave={handleUpdateItem}
        onNotify={addToast}
      />

      <BriefModal
        isOpen={Boolean(viewingBriefItem)}
        onClose={() => setViewingBriefItem(null)}
        item={viewingBriefItem}
        brand={appState.brand}
        onEdit={item => {
          setViewingBriefItem(null);
          setEditingItem(item);
        }}
        onNotify={addToast}
      />

      <DesktopInstallModal
        isOpen={isDesktopModalOpen}
        onClose={() => setIsDesktopModalOpen(false)}
        onInstalled={() => {
          addToast("Ruang Konten Desktop Mode berhasil dipasang!", "success");
        }}
      />

      {/* Social Auto-Publisher Modals */}
      <ContentPoolDrawer
        isOpen={isPoolDrawerOpen}
        onClose={() => setIsPoolDrawerOpen(false)}
        approvedItems={approvedItems}
        onScheduleItem={handleStartSchedulePoolItem}
      />

      <PostSchedulerModal
        isOpen={isSchedulerModalOpen}
        onClose={() => {
          setIsSchedulerModalOpen(false);
          setEditingScheduledPost(null);
          setSchedulingContentItem(null);
        }}
        contentItem={schedulingContentItem}
        existingPost={editingScheduledPost}
        initialDate={selectedCalendarDate}
        brand={appState.brand}
        connections={appState.connections}
        r2Config={appState.r2Config}
        onSaveSchedule={handleSaveScheduledPost}
        onPublishNow={handlePublishNow}
      />

      <SocialConnectionsModal
        isOpen={isConnectionsModalOpen}
        onClose={() => setIsConnectionsModalOpen(false)}
        connections={appState.connections}
        r2Config={appState.r2Config}
        onSaveConnections={updated => setAppState(prev => ({ ...prev, connections: updated }))}
        onSaveR2Config={cfg => setAppState(prev => ({ ...prev, r2Config: cfg }))}
        onNotify={addToast}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
