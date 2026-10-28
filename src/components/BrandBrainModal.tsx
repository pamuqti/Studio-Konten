import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BrandBrain, CustomKnowledgeBlock } from '../types';
import {
  Palette,
  SlidersVertical,
  Check,
  X,
  Sparkles,
  Upload,
  RefreshCw,
  Copy,
  Download,
  Plus,
  Trash2,
  Eye,
  CircleCheck,
  CircleAlert,
  Swords,
  Target,
  Gem,
  Boxes,
  FileText,
  Users,
  Search,
  ChevronDown,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit3,
  UserCheck,
  FolderPlus,
  ShieldCheck,
  CheckCircle2,
  Folder,
  Filter,
  Briefcase
} from 'lucide-react';
import {
  sampleBrandTrajecto,
  sampleBrandKopiSenja,
  sampleBrandGrowthForge,
  emptyBrand,
  BRAND_PRESETS
} from '../data/sampleBrand';
import {
  INDUSTRY_BRAND_TEMPLATES,
  INDUSTRY_CATEGORIES,
  SCALE_LEVELS,
  INDUSTRY_SERVICES_PRESETS,
  IndustryKey,
  BusinessScaleKey,
  IndustryTemplateMeta,
  IndustryServiceOption
} from '../data/industryTemplates';
import {
  compileBrandBrainPrompt,
  calculateBrainCompleteness,
  createDefaultBlock
} from '../utils/brandBrainExport';
import { extractBrandBrainAi } from '../services/gemini';
import {
  BrandBrainExportPanel,
  BrandBrainExportMenu,
  BrandBrainImportModal
} from './BrandBrainExportEngine';
import { copyToClipboard, downloadFile } from '../utils/export';

interface BrandBrainModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  brand: BrandBrain;
  brands?: BrandBrain[];
  activeBrandId?: string;
  onSelectBrand?: (id: string) => void;
  onSave: (brand: BrandBrain) => void;
  onCreateBrand?: (brand: BrandBrain) => void;
  onDuplicateBrand?: (id: string) => void;
  onDeleteBrand?: (id: string) => void;
  onImportBrands?: (brands: BrandBrain[]) => void;
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  embedded?: boolean;
}

export const BrandBrainModal: React.FC<BrandBrainModalProps> = ({
  isOpen = true,
  onClose,
  brand,
  brands,
  activeBrandId,
  onSelectBrand,
  onSave,
  onCreateBrand,
  onDuplicateBrand,
  onDeleteBrand,
  onImportBrands,
  onNotify,
  embedded = false
}) => {
  const [data, setData] = useState<BrandBrain>({ ...emptyBrand, ...brand });
  const [activeTab, setActiveTab] = useState<string>("foundation");
  const [profileViewMode, setProfileViewMode] = useState<'editor' | 'manage'>('manage');
  const [showAiBox, setShowAiBox] = useState(false);
  const [rawExtractText, setRawExtractText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);

  // Quick Start Cards State
  const [quickIndustry, setQuickIndustry] = useState<IndustryKey | 'custom'>('fnb');
  const [quickScale, setQuickScale] = useState<BusinessScaleKey | 'custom'>('smb');
  const [quickServiceId, setQuickServiceId] = useState<string>('fnb-coffee');
  const [quickBrandName, setQuickBrandName] = useState<string>('');
  const [quickCustomIndustry, setQuickCustomIndustry] = useState<string>('');
  const [quickCustomScale, setQuickCustomScale] = useState<string>('');
  const [quickCustomService, setQuickCustomService] = useState<string>('');
  const [quickCustomAudience, setQuickCustomAudience] = useState<string>('');
  const [quickCustomUsp, setQuickCustomUsp] = useState<string>('');

  const generateQuickPrompt = (
    indKey: IndustryKey | 'custom',
    scaleKey: BusinessScaleKey | 'custom',
    serviceId: string,
    brandName?: string,
    cInd?: string,
    cScale?: string,
    cSrv?: string,
    cAud?: string,
    cUsp?: string
  ): string => {
    const bName = (brandName !== undefined ? brandName : quickBrandName).trim() || data.name || "Brand Baru";

    let indLabel = "Kuliner & F&B";
    if (indKey === 'custom') {
      indLabel = (cInd !== undefined ? cInd : quickCustomIndustry).trim() || "Industri Kustom";
    } else {
      const f = INDUSTRY_CATEGORIES.find(c => c.id === indKey);
      if (f) indLabel = f.label;
    }

    let scaleLabel = "UMKM Berkembang";
    let scaleDesc = "Fokus diferensiasi USP & testing digital ads";
    if (scaleKey === 'custom') {
      scaleLabel = (cScale !== undefined ? cScale : quickCustomScale).trim() || "Skala Kustom";
      scaleDesc = "Disesuaikan dengan tim dan target pasar spesifik";
    } else {
      const s = SCALE_LEVELS.find(l => l.id === scaleKey);
      if (s) {
        scaleLabel = s.label;
        scaleDesc = s.desc;
      }
    }

    let serviceName = "";
    let serviceDesc = "";
    let audienceSample = "";
    let uspSample = "";

    if (indKey !== 'custom') {
      const presets = INDUSTRY_SERVICES_PRESETS[indKey] || [];
      const foundSrv = presets.find(p => p.id === serviceId);
      if (foundSrv) {
        serviceName = foundSrv.name;
        serviceDesc = foundSrv.desc;
        audienceSample = foundSrv.sampleAudience;
        uspSample = foundSrv.sampleUsp;
      }
    }

    if (serviceId === 'custom' || !serviceName) {
      serviceName = (cSrv !== undefined ? cSrv : quickCustomService).trim() || "Layanan / Produk Utama";
      serviceDesc = "Solusi langsung untuk kebutuhan dan masalah konsumen";
      audienceSample = (cAud !== undefined ? cAud : quickCustomAudience).trim() || "Target audiens dan calon pembeli potensial di Indonesia";
      uspSample = (cUsp !== undefined ? cUsp : quickCustomUsp).trim() || "Kualitas teruji dengan diferensiasi unik dibanding kompetitor";
    }

    return `Nama Brand: ${bName}
Kategori & Industri: ${indLabel}
Skala Bisnis: ${scaleLabel} (${scaleDesc})
Produk/Layanan Utama: ${serviceName} - ${serviceDesc}
Target Konsumen: ${audienceSample}
Keunggulan Unik (USP): ${uspSample}

Tolong rumuskan identitas Brand Brain 9 pilar komprehensif untuk brand ini:
1. Positioning yang tajam (weAre, forAudience, whoNeed, becauseWhy, unlike, statement)
2. DNA Target Audiens (demografi, 3-5 pain points terdalam, 3-5 desires emosional)
3. Keunggulan Kompetitif (USP) dan Janji Brand (Brand Promise)
4. Karakter Suara & Gaya Bahasa (Tone of Voice, kata wajib dan terlarang)
5. Guardrails Pesan & Batasan Klaim
6. 4-5 Pilar Konten Strategis siap pakai untuk media sosial (IG, TikTok, Threads).`;
  };

  const [newDirective, setNewDirective] = useState("");
  const [selectedBlockCat, setSelectedBlockCat] = useState("all");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [expandingBlockId, setExpandingBlockId] = useState<string | null>(null);

  // Quick Start Card Selection Handlers
  const handleSelectQuickIndustry = (indKey: IndustryKey | 'custom') => {
    setQuickIndustry(indKey);
    let nextSrv = quickServiceId;
    if (indKey === 'custom') {
      nextSrv = 'custom';
      setQuickServiceId('custom');
    } else {
      const presets = INDUSTRY_SERVICES_PRESETS[indKey] || [];
      nextSrv = presets[0]?.id || 'custom';
      setQuickServiceId(nextSrv);
    }
    const p = generateQuickPrompt(
      indKey,
      quickScale,
      nextSrv,
      quickBrandName,
      quickCustomIndustry,
      quickCustomScale,
      quickCustomService,
      quickCustomAudience,
      quickCustomUsp
    );
    setRawExtractText(p);
  };

  const handleSelectQuickScale = (scaleKey: BusinessScaleKey | 'custom') => {
    setQuickScale(scaleKey);
    const p = generateQuickPrompt(
      quickIndustry,
      scaleKey,
      quickServiceId,
      quickBrandName,
      quickCustomIndustry,
      quickCustomScale,
      quickCustomService,
      quickCustomAudience,
      quickCustomUsp
    );
    setRawExtractText(p);
  };

  const handleSelectQuickService = (srvId: string) => {
    setQuickServiceId(srvId);
    const p = generateQuickPrompt(
      quickIndustry,
      quickScale,
      srvId,
      quickBrandName,
      quickCustomIndustry,
      quickCustomScale,
      quickCustomService,
      quickCustomAudience,
      quickCustomUsp
    );
    setRawExtractText(p);
  };

  // Profile Management State
  const [manageSubTab, setManageSubTab] = useState<'profiles' | 'templates'>('profiles');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedScale, setSelectedScale] = useState<string>('all');
  const [templateSearch, setTemplateSearch] = useState<string>('');

  const [isNewProfileModalOpen, setIsNewProfileModalOpen] = useState(false);
  const [newBrandTab, setNewBrandTab] = useState<'foundation' | 'audience' | 'personality' | 'content' | 'memory'>('foundation');
  const [newBrandForm, setNewBrandForm] = useState<BrandBrain>({ ...emptyBrand });
  const [modalBrandTab, setModalBrandTab] = useState<string>('foundation');

  const updateNewBrandRoot = (field: keyof BrandBrain, val: any) => {
    setNewBrandForm(prev => ({
      ...prev,
      [field]: val,
      fieldStatus: { ...prev.fieldStatus, [field]: 'confirmed' }
    }));
  };

  const updateNewBrandPositioning = (field: string, val: string) => {
    setNewBrandForm(prev => {
      const pos = { ...(prev.positioning || {}), [field]: val };
      const stmt = `${prev.name || "Brand"} adalah ${pos.weAre || "solusi"} untuk ${pos.forAudience || "audiens"} yang butuh ${pos.whoNeed || "jawaban"}, karena ${pos.becauseWhy || "teruji"}, berbeda dari ${pos.unlike || "alternatif lain"}.`;
      return {
        ...prev,
        positioning: { ...pos, statement: pos.statement && field !== 'statement' ? stmt : pos.statement || stmt }
      };
    });
  };

  const updateNewBrandAudienceDemographics = (field: string, val: any) => {
    setNewBrandForm(prev => ({
      ...prev,
      audienceDNA: {
        ...(prev.audienceDNA || {}),
        demographics: {
          ...(prev.audienceDNA?.demographics || {}),
          [field]: val
        }
      }
    }));
  };

  const updateNewBrandAudiencePsychographics = (field: string, val: any) => {
    setNewBrandForm(prev => ({
      ...prev,
      audienceDNA: {
        ...(prev.audienceDNA || {}),
        psychographics: {
          ...(prev.audienceDNA?.psychographics || {}),
          [field]: val
        }
      }
    }));
  };

  const updateNewBrandVoiceSpectrum = (field: string, val: number) => {
    setNewBrandForm(prev => ({
      ...prev,
      personalityVoice: {
        ...(prev.personalityVoice || {}),
        voiceSpectrum: {
          ...(prev.personalityVoice?.voiceSpectrum || {}),
          [field]: val
        }
      }
    }));
  };

  const updateNewBrandVoiceArray = (field: string, val: any) => {
    setNewBrandForm(prev => ({
      ...prev,
      personalityVoice: {
        ...(prev.personalityVoice || {}),
        [field]: val
      }
    }));
  };

  const updateNewBrandPlatformAccount = (platformKey: string, val: any) => {
    setNewBrandForm(prev => ({
      ...prev,
      platformAccounts: {
        ...(prev.platformAccounts || {}),
        [platformKey]: val
      }
    }));
  };
  const _unusedUpdatePlatform = (platformKey: string, field: string, val: any) => {
    setNewBrandForm(prev => ({
      ...prev,
      socialAccounts: {
        ...(prev.socialAccounts || {}),
        [platformKey]: {
          ...(prev.socialAccounts?.[platformKey] || {}),
          [field]: val
        }
      }
    }));
  };

  const updateNewBrandMemoryArray = (field: 'alwaysSay' | 'neverSay', val: string[]) => {
    setNewBrandForm(prev => ({
      ...prev,
      brandMemory: {
        ...(prev.brandMemory || {}),
        [field]: val
      }
    }));
  };

  const updateNewBrandClaimsArray = (field: 'allowed' | 'forbidden', val: string[]) => {
    setNewBrandForm(prev => ({
      ...prev,
      brandMemory: {
        ...(prev.brandMemory || {}),
        claimsGuardrail: {
          ...(prev.brandMemory?.claimsGuardrail || {}),
          [field]: val
        }
      }
    }));
  };

  const setNewBrandDirective = (field: 'antiSlopDirectives' | 'industryDirectives', val: string) => {
    setNewBrandForm(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const [viewingBrandBrain, setViewingBrandBrain] = useState<BrandBrain | null>(null);
  const [newProfileMode, setNewProfileMode] = useState<'templates' | 'ai' | 'blank'>('templates');
  const [isCreatingAiProfile, setIsCreatingAiProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileCategory, setNewProfileCategory] = useState("");
  const [newProfileProduct, setNewProfileProduct] = useState("");
  const [newProfileColor, setNewProfileColor] = useState("#205c49");
  const [newProfilePreset, setNewProfilePreset] = useState<string>('empty');
  const [profileSearch, setProfileSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const allProfilesFileInputRef = useRef<HTMLInputElement>(null);

  const allProfiles = useMemo(() => {
    return brands && brands.length > 0 ? brands : [brand];
  }, [brands, brand]);

  const filteredTemplates = useMemo(() => {
    return INDUSTRY_BRAND_TEMPLATES.filter((tpl) => {
      if (selectedIndustry !== 'all' && tpl.industry !== selectedIndustry) {
        return false;
      }
      if (selectedScale !== 'all' && tpl.scale !== selectedScale) {
        return false;
      }
      if (templateSearch.trim()) {
        const q = templateSearch.toLowerCase();
        const matchName = tpl.name.toLowerCase().includes(q);
        const matchTagline = tpl.tagline.toLowerCase().includes(q);
        const matchIndustry = tpl.industryLabel.toLowerCase().includes(q);
        const matchScale = tpl.scaleLabel.toLowerCase().includes(q);
        const matchProduct = (tpl.brand.product || '').toLowerCase().includes(q);
        const matchUsp = (tpl.brand.usp || '').toLowerCase().includes(q);
        const matchAudience = (tpl.brand.audience || '').toLowerCase().includes(q);
        return matchName || matchTagline || matchIndustry || matchScale || matchProduct || matchUsp || matchAudience;
      }
      return true;
    });
  }, [selectedIndustry, selectedScale, templateSearch]);

  useEffect(() => {
    if (isOpen || embedded) {
      setData({ ...emptyBrand, ...brand, color: brand?.color || "#205c49" });
      setAnalysisNote(null);
      if (!rawExtractText) {
        setRawExtractText(generateQuickPrompt('fnb', 'smb', 'fnb-coffee', brand?.name));
      }
    }
  }, [isOpen, embedded, brand]);

  if (!isOpen && !embedded) return null;

  const completeness = calculateBrainCompleteness(data);

  const updateRoot = (field: keyof BrandBrain, val: any) => {
    setData(prev => ({
      ...prev,
      [field]: val,
      fieldStatus: { ...prev.fieldStatus, [field]: 'confirmed' }
    }));
  };

  const updatePositioning = (field: string, val: string) => {
    setData(prev => {
      const pos = { ...prev.positioning, [field]: val };
      const stmt = `${prev.name || "Brand"} adalah ${pos.weAre || "solusi"} untuk ${pos.forAudience || "audiens"} yang butuh ${pos.whoNeed || "jawaban"}, karena ${pos.becauseWhy || "teruji"}, berbeda dari ${pos.unlike || "alternatif lain"}.`;
      return {
        ...prev,
        positioning: { ...pos, statement: pos.statement && field !== 'statement' ? stmt : pos.statement || stmt }
      };
    });
  };

  const updateAudienceDemographics = (field: string, val: string) => {
    setData(prev => ({
      ...prev,
      audienceDNA: {
        ...prev.audienceDNA,
        demographics: { ...prev.audienceDNA?.demographics, [field]: val }
      }
    }));
  };

  const updateAudiencePsychographics = (field: 'painPoints' | 'desires' | 'fears' | 'objections', val: string) => {
    const arr = val.split('\n').map(s => s.trim()).filter(Boolean);
    setData(prev => ({
      ...prev,
      audienceDNA: {
        ...prev.audienceDNA,
        psychographics: { ...prev.audienceDNA?.psychographics, [field]: arr }
      }
    }));
  };

  const updateVoiceSpectrum = (field: string, val: number) => {
    setData(prev => ({
      ...prev,
      personalityVoice: {
        ...prev.personalityVoice,
        spectrum: { ...prev.personalityVoice?.spectrum, [field]: val }
      }
    }));
  };

  const updateVoiceArray = (field: 'voiceDo' | 'voiceDont' | 'signatureWords' | 'forbiddenWords', val: string) => {
    const arr = val.split('\n').map(s => s.trim()).filter(Boolean);
    setData(prev => ({
      ...prev,
      personalityVoice: { ...prev.personalityVoice, [field]: arr }
    }));
  };

  const updateMemoryArray = (field: 'alwaysSay' | 'neverSay', val: string) => {
    const arr = val.split('\n').map(s => s.trim()).filter(Boolean);
    setData(prev => ({
      ...prev,
      brandMemory: { ...prev.brandMemory, [field]: arr }
    }));
  };

  const updateClaimsArray = (field: 'allowed' | 'forbidden', val: string) => {
    const arr = val.split('\n').map(s => s.trim()).filter(Boolean);
    setData(prev => ({
      ...prev,
      brandMemory: {
        ...prev.brandMemory,
        claimsGuardrail: { ...prev.brandMemory?.claimsGuardrail, [field]: arr }
      }
    }));
  };

  const updatePlatformAccount = (platformKey: string, handle: string) => {
    setData(prev => {
      const accs = { ...prev.platformAccounts, [platformKey]: handle };
      return {
        ...prev,
        platformAccounts: accs,
        instagramHandle: platformKey === 'instagram' ? handle : prev.instagramHandle
      };
    });
  };

  // Directives
  const addDirective = (val?: string) => {
    const text = (val || newDirective).trim();
    if (!text) return;
    setData(prev => ({
      ...prev,
      customDirectives: [...(prev.customDirectives || []), text]
    }));
    setNewDirective("");
  };

  const removeDirective = (idx: number) => {
    setData(prev => ({
      ...prev,
      customDirectives: (prev.customDirectives || []).filter((_, i) => i !== idx)
    }));
  };

  // Custom Blocks
  const addCustomBlock = (cat: string = "Aturan Wajib AI") => {
    const blk = createDefaultBlock(cat);
    setData(prev => ({
      ...prev,
      customBlocks: [blk, ...(prev.customBlocks || [])]
    }));
  };

  const toggleBlockActive = (id: string) => {
    setData(prev => ({
      ...prev,
      customBlocks: (prev.customBlocks || []).map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    }));
  };

  const updateBlock = (id: string, updates: Partial<CustomKnowledgeBlock>) => {
    setData(prev => ({
      ...prev,
      customBlocks: (prev.customBlocks || []).map(b => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    }));
  };

  const deleteBlock = (id: string) => {
    setData(prev => ({
      ...prev,
      customBlocks: (prev.customBlocks || []).filter(b => b.id !== id)
    }));
  };

  // Quick Extract via AI
  const handleExtractBrand = async () => {
    if (!rawExtractText.trim()) {
      onNotify?.("Pilih kartu industri/skala atau ketik deskripsi brand terlebih dahulu.", "info");
      return;
    }
    setIsExtracting(true);
    try {
      const res = await extractBrandBrainAi(rawExtractText);

      const indLabel = quickIndustry === 'custom'
        ? (quickCustomIndustry.trim() || 'Bisnis Custom')
        : (INDUSTRY_CATEGORIES.find(c => c.id === quickIndustry)?.label || 'Bisnis & Komersial');

      const scKey = quickScale === 'custom' ? 'smb' : quickScale;
      const scLabel = quickScale === 'custom'
        ? (quickCustomScale.trim() || 'Skala Kustom')
        : (SCALE_LEVELS.find(s => s.id === quickScale)?.label || 'UMKM Berkembang');

      let serviceName = '';
      if (quickIndustry !== 'custom') {
        const presets = INDUSTRY_SERVICES_PRESETS[quickIndustry] || [];
        const found = presets.find(p => p.id === quickServiceId);
        if (found) serviceName = found.name;
      }
      if (!serviceName && quickCustomService.trim()) {
        serviceName = quickCustomService.trim();
      }

      const updatedBrand: BrandBrain = {
        ...data,
        ...res.brand,
        name: (quickBrandName.trim() || res.brand.name || data.name || "Brand Baru").trim(),
        category: indLabel,
        industry: indLabel,
        scale: scKey,
        scaleLabel: scLabel,
        product: serviceName || res.brand.product || data.product || "",
        color: res.brand?.color || data.color || "#205c49",
        updatedAt: new Date().toISOString()
      };

      setData(updatedBrand);
      onSave(updatedBrand);
      setAnalysisNote(res.analysisSummary || `Brand Brain "${updatedBrand.name}" berhasil diekstrak dan diintegrasikan ke profil aktif!`);
      onNotify?.(`Brand Brain "${updatedBrand.name}" berhasil diekstrak dan disimpan ke profil aktif!`, "success");
    } catch (e: any) {
      onNotify?.(e.message || "Gagal mengekstrak profil brand.", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  // Import JSON file
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target?.result as string;
        const parsed = JSON.parse(text);
        const importedBrand = parsed.brand || parsed.data || parsed;
        setData(prev => ({
          ...prev,
          ...importedBrand
        }));
        onNotify?.(`Brand Brain "${importedBrand.name || file.name}" berhasil diimpor!`, "success");
      } catch (err: any) {
        onNotify?.(err.message || "Gagal membaca file JSON.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCopyPrompt = () => {
    const text = compileBrandBrainPrompt(data);
    copyToClipboard(text).then(ok => {
      if (ok) {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
        onNotify?.("Seluruh teks acuan Brand Brain berhasil disalin!", "success");
      }
    });
  };

  const handleDownloadPrompt = () => {
    const text = compileBrandBrainPrompt(data);
    downloadFile(`${data.name || "Brand"}-Brain-Prompt.md`, text, "text/markdown;charset=utf-8");
    onNotify?.("File Markdown acuan berhasil diunduh!", "success");
  };

  const handleDownloadBackupJson = () => {
    const slug = (data.name || "brand").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    const jsonStr = JSON.stringify({
      type: "brand-brain-export",
      version: 1,
      exportedAt: new Date().toISOString(),
      completeness: completeness.score,
      brand: data
    }, null, 2);
    downloadFile(`${slug}-brand-brain-backup-${new Date().toISOString().slice(0, 10)}.json`, jsonStr, "application/json;charset=utf-8");
    onNotify?.("Backup JSON Brand Brain berhasil diunduh.", "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) {
      alert("Nama brand wajib diisi.");
      return;
    }
    onSave(data);
    onClose?.();
  };

  const handleSelectProfile = (pId: string) => {
    if (onSelectBrand) {
      onSelectBrand(pId);
    } else {
      const found = allProfiles.find(p => p.id === pId || p.name === pId);
      if (found) setData(found);
    }
  };

  const handleSelectPresetInModal = (presetId: string) => {
    setNewProfilePreset(presetId);
    if (presetId === 'empty') return;
    const found = INDUSTRY_BRAND_TEMPLATES.find(t => t.id === presetId);
    if (found) {
      setNewProfileName(found.brand.name);
      setNewProfileCategory(found.brand.category);
      setNewProfileProduct(found.brand.product);
      setNewProfileColor(found.brand.color || '#205c49');
    } else if (presetId === 'trajecto') {
      setNewProfileName(sampleBrandTrajecto.name);
      setNewProfileCategory(sampleBrandTrajecto.category);
      setNewProfileProduct(sampleBrandTrajecto.product);
      setNewProfileColor(sampleBrandTrajecto.color);
    } else if (presetId === 'kopi') {
      setNewProfileName(sampleBrandKopiSenja.name);
      setNewProfileCategory(sampleBrandKopiSenja.category);
      setNewProfileProduct(sampleBrandKopiSenja.product);
      setNewProfileColor(sampleBrandKopiSenja.color);
    } else if (presetId === 'growth') {
      setNewProfileName(sampleBrandGrowthForge.name);
      setNewProfileCategory(sampleBrandGrowthForge.category);
      setNewProfileProduct(sampleBrandGrowthForge.product);
      setNewProfileColor(sampleBrandGrowthForge.color);
    }
  };

  const handleCreateNewProfileFromTemplate = (tpl: IndustryTemplateMeta) => {
    const newBrand: BrandBrain = {
      ...tpl.brand,
      id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (onCreateBrand) {
      onCreateBrand(newBrand);
    } else {
      onSave(newBrand);
    }
    setData(newBrand);
    setIsNewProfileModalOpen(false);
    setProfileViewMode('editor');
    onNotify?.(`Profil baru "${newBrand.name}" dari template ${tpl.industryLabel} berhasil dibuat dan diaktifkan!`, 'success');
  };

  const handleExtractToBrandBrainForm = async () => {
    if (!rawExtractText.trim()) {
      onNotify?.('Pilih kartu acuan atau ketik teks acuan brand terlebih dahulu.', 'info');
      return;
    }
    setIsCreatingAiProfile(true);
    try {
      const res = await extractBrandBrainAi(rawExtractText);
      const indLabel = quickIndustry === 'custom'
        ? (quickCustomIndustry.trim() || 'Bisnis Custom')
        : (INDUSTRY_CATEGORIES.find(c => c.id === quickIndustry)?.label || 'Bisnis & Komersial');

      const scKey = quickScale === 'custom' ? 'smb' : quickScale;
      const scLabel = quickScale === 'custom'
        ? (quickCustomScale.trim() || 'Skala Kustom')
        : (SCALE_LEVELS.find(s => s.id === quickScale)?.label || 'UMKM Berkembang');

      let serviceName = '';
      if (quickIndustry !== 'custom') {
        const presets = INDUSTRY_SERVICES_PRESETS[quickIndustry] || [];
        const found = presets.find(p => p.id === quickServiceId);
        if (found) serviceName = found.name;
      }
      if (!serviceName && quickCustomService.trim()) {
        serviceName = quickCustomService.trim();
      }

      const brandTitle = quickBrandName.trim() || res.brand?.name || 'Brand Baru';

      setNewBrandForm(prev => ({
        ...prev,
        ...res.brand,
        name: brandTitle,
        category: indLabel,
        industry: indLabel,
        scale: scKey,
        scaleLabel: scLabel,
        product: serviceName || prev.product || res.brand.product || '',
        color: res.brand?.color || prev.color || '#205c49'
      }));

      onNotify?.('Brand Brain berhasil diekstrak! Tinjau dan sesuaikan di panel di bawah.', 'success');
    } catch (e: any) {
      onNotify?.(e.message || 'Gagal mengekstrak Brand Brain via AI.', 'error');
    } finally {
      setIsCreatingAiProfile(false);
    }
  };

  const handleSaveCreatedProfile = () => {
    if (!quickBrandName.trim()) {
      onNotify?.('Nama brand baru wajib diisi sebelum membuat profil.', 'error');
      return;
    }

    const indLabel = quickIndustry === 'custom'
      ? (quickCustomIndustry.trim() || 'Bisnis Custom')
      : (INDUSTRY_CATEGORIES.find(c => c.id === quickIndustry)?.label || 'Bisnis & Komersial');

    const scKey = quickScale === 'custom' ? 'smb' : quickScale;
    const scLabel = quickScale === 'custom'
      ? (quickCustomScale.trim() || 'Skala Kustom')
      : (SCALE_LEVELS.find(s => s.id === quickScale)?.label || 'UMKM Berkembang');

    let serviceName = '';
    if (quickIndustry !== 'custom') {
      const presets = INDUSTRY_SERVICES_PRESETS[quickIndustry] || [];
      const found = presets.find(p => p.id === quickServiceId);
      if (found) serviceName = found.name;
    }
    if (!serviceName && quickCustomService.trim()) {
      serviceName = quickCustomService.trim();
    }

    const brandTitle = quickBrandName.trim();
    const finalBrand: BrandBrain = {
      ...emptyBrand,
      ...newBrandForm,
      id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: brandTitle,
      category: newBrandForm.category || indLabel,
      industry: newBrandForm.industry || indLabel,
      scale: newBrandForm.scale || scKey,
      scaleLabel: newBrandForm.scaleLabel || scLabel,
      product: newBrandForm.product || serviceName || '',
      color: newBrandForm.color || '#205c49',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onCreateBrand) {
      onCreateBrand(finalBrand);
    } else {
      onSave(finalBrand);
    }
    setData(finalBrand);
    setIsNewProfileModalOpen(false);
    setShowAiBox(false);
    setProfileViewMode('editor');
    onNotify?.(`Profil "${finalBrand.name}" berhasil dibuat dan diaktifkan!`, 'success');
  };

  const handleCreateNewProfileFromAi = async () => {
    if (!quickBrandName.trim()) {
      onNotify?.("Nama brand baru wajib diisi.", "error");
      return;
    }
    if (!rawExtractText.trim()) {
      onNotify?.("Pilih kartu industri/skala atau ketik acuan brand terlebih dahulu.", "info");
      return;
    }
    setIsCreatingAiProfile(true);
    try {
      const res = await extractBrandBrainAi(rawExtractText);

      const indLabel = quickIndustry === 'custom'
        ? (quickCustomIndustry.trim() || 'Bisnis Custom')
        : (INDUSTRY_CATEGORIES.find(c => c.id === quickIndustry)?.label || 'Bisnis & Komersial');

      const scKey = quickScale === 'custom' ? 'smb' : quickScale;
      const scLabel = quickScale === 'custom'
        ? (quickCustomScale.trim() || 'Skala Kustom')
        : (SCALE_LEVELS.find(s => s.id === quickScale)?.label || 'UMKM Berkembang');

      let serviceName = '';
      if (quickIndustry !== 'custom') {
        const presets = INDUSTRY_SERVICES_PRESETS[quickIndustry] || [];
        const found = presets.find(p => p.id === quickServiceId);
        if (found) serviceName = found.name;
      }
      if (!serviceName && quickCustomService.trim()) {
        serviceName = quickCustomService.trim();
      }

      const brandTitle = quickBrandName.trim();
      const newBrand: BrandBrain = {
        ...emptyBrand,
        ...newBrandForm,
        ...res.brand,
        id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: brandTitle,
        category: indLabel,
        industry: indLabel,
        scale: scKey,
        scaleLabel: scLabel,
        product: serviceName || newBrandForm.product || res.brand.product || "",
        color: res.brand?.color || newBrandForm.color || "#205c49",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setNewBrandForm(newBrand);

      if (onCreateBrand) {
        onCreateBrand(newBrand);
      } else {
        onSave(newBrand);
      }
      setData(newBrand);
      setIsNewProfileModalOpen(false);
      setShowAiBox(false);
      setProfileViewMode('editor');
      onNotify?.(`Profil baru "${newBrand.name}" berhasil diekstrak via AI dan diaktifkan!`, 'success');
    } catch (e: any) {
      onNotify?.(e.message || "Gagal membuat profil via AI.", "error");
    } finally {
      setIsCreatingAiProfile(false);
    }
  };

  const handleCreateNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      alert("Nama profil brand wajib diisi.");
      return;
    }

    let baseBrand: BrandBrain = emptyBrand;
    const foundTemplate = INDUSTRY_BRAND_TEMPLATES.find(t => t.id === newProfilePreset);
    if (foundTemplate) {
      baseBrand = foundTemplate.brand;
    }

    const newBrand: BrandBrain = {
      ...baseBrand,
      id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: newProfileName.trim(),
      category: newProfileCategory.trim() || baseBrand.category || "Bisnis Umum",
      industry: baseBrand.industry || newProfileCategory.trim() || "Bisnis Umum",
      scale: baseBrand.scale || 'smb',
      scaleLabel: baseBrand.scaleLabel || 'UMKM Berkembang',
      product: newProfileProduct.trim() || baseBrand.product || "",
      color: newProfileColor || baseBrand.color || "#205c49",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onCreateBrand) {
      onCreateBrand(newBrand);
    } else {
      onSave(newBrand);
    }

    setData(newBrand);
    setIsNewProfileModalOpen(false);
    setNewProfileName('');
    setNewProfileCategory('');
    setNewProfileProduct('');
    setProfileViewMode('editor');
    onNotify?.(`Profil baru "${newBrand.name}" berhasil dibuat!`, 'success');
  };

  const handleAddPresetDirect = (preset: BrandBrain) => {
    const cloned: BrandBrain = {
      ...preset,
      id: `brand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (onCreateBrand) {
      onCreateBrand(cloned);
    } else {
      onSave(cloned);
    }
    setData(cloned);
    setProfileViewMode('editor');
    onNotify?.(`Profil "${cloned.name}" berhasil ditambahkan dan diaktifkan!`, 'success');
  };

  const handleExportAllProfiles = () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      type: "ruang-konten-brand-profiles-backup",
      profiles: allProfiles
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    downloadFile(
      `ruang-konten-semua-brand-profiles-${new Date().toISOString().slice(0, 10)}.json`,
      jsonStr,
      "application/json;charset=utf-8"
    );
    onNotify?.(`Berhasil mencadangkan ${allProfiles.length} profil brand.`, 'success');
  };

  const handleImportAllProfilesFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        let importedList: BrandBrain[] = [];
        if (Array.isArray(parsed?.profiles)) {
          importedList = parsed.profiles;
        } else if (Array.isArray(parsed)) {
          importedList = parsed;
        } else if (parsed && typeof parsed === 'object' && parsed.name) {
          importedList = [parsed];
        }
        if (importedList.length > 0) {
          if (onImportBrands) {
            onImportBrands(importedList);
          } else {
            onSave(importedList[0]);
          }
          onNotify?.(`Berhasil mengimpor ${importedList.length} profil brand.`, 'success');
        } else {
          onNotify?.("File JSON tidak memuat profil brand yang valid.", "error");
        }
      } catch (err: any) {
        onNotify?.(`Gagal membaca file JSON: ${err.message}`, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [
    { id: "foundation", icon: "🏛️", label: "Fondasi", sub: "Positioning" },
    { id: "market", icon: "⚔️", label: "Kompetitor", sub: "Rival & Pasar" },
    { id: "audience", icon: "🎯", label: "Audience DNA", sub: "Pain & Persona" },
    { id: "offer", icon: "💎", label: "Penawaran", sub: "Bukti & Garansi" },
    { id: "personality", icon: "🎭", label: "Karakter & Gaya", sub: "Voice & Visual" },
    { id: "content", icon: "📊", label: "Content DNA", sub: "Pilar & CTA" },
    { id: "memory", icon: "🧠", label: "Brand Memory", sub: "Guardrails" },
    { id: "custom", icon: "🧩", label: "Acuan Bebas", sub: "Blok & Aturan" },
    { id: "inspector", icon: "👁️", label: "AI Inspector", sub: "Live Prompt" },
    { id: "export", icon: "📤", label: "Export", sub: "Form Ekspor" }
  ];

  const content = (
    <div
      className={`bg-white rounded-3xl border border-[#dce4db] ${
        embedded
          ? 'shadow-xs w-full mb-10'
          : 'shadow-2xl max-w-5xl xl:max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden'
      }`}
    >
      {/* 1. Global Multi-Profile Command Bar */}
      <div className="p-3.5 sm:px-5 bg-[#f0f4ee] border-b border-[#dce5db] flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle: Daftar Profil vs Detail Brand Brain */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#d6dfd4] shadow-2xs">
            <button
              type="button"
              onClick={() => setProfileViewMode('manage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                profileViewMode === 'manage'
                  ? 'bg-[#205c49] text-white shadow-2xs'
                  : 'text-[#55695e] hover:text-[#183127] hover:bg-[#f6faf4]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Daftar Profil</span>
            </button>
            <button
              type="button"
              onClick={() => setProfileViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                profileViewMode === 'editor'
                  ? 'bg-[#205c49] text-white shadow-2xs'
                  : 'text-[#55695e] hover:text-[#183127] hover:bg-[#f6faf4]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Brand Brain</span>
            </button>
          </div>

          {/* Active Profile Dropdown Switcher */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#d6dfd4] shadow-2xs">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
              style={{ backgroundColor: data.color || '#205c49' }}
            />
            <span className="text-[11px] font-semibold text-[#718278]">Profil Aktif:</span>
            <select
              value={data.id || activeBrandId || ''}
              onChange={(e) => {
                handleSelectProfile(e.target.value);
              }}
              className="text-xs font-bold text-[#183127] bg-transparent outline-none cursor-pointer pr-1 font-heading"
            >
              {allProfiles.map((p) => (
                <option key={p.id || p.name} value={p.id || p.name}>
                  {p.name || 'Brand Tanpa Nama'} ({calculateBrainCompleteness(p).score}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Profile Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setQuickBrandName('');
              const p = generateQuickPrompt(quickIndustry, quickScale, quickServiceId, '');
              setRawExtractText(p);
              setIsNewProfileModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Profil Baru</span>
          </button>

          <button
            type="button"
            onClick={() => onDuplicateBrand && (data.id ? onDuplicateBrand(data.id) : null)}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#2c4035] border border-[#d6dfd4] text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            title="Duplikat profil aktif ini"
          >
            <Copy className="w-3.5 h-3.5 text-[#52665b]" />
            <span className="hidden sm:inline">Duplikat</span>
          </button>

          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#2c4035] border border-[#d6dfd4] text-xs font-semibold transition-all inline-flex items-center gap-1">
            <Upload className="w-3.5 h-3.5 text-[#52665b]" />
            <span className="hidden md:inline">Impor JSON</span>
            <input
              type="file"
              ref={allProfilesFileInputRef}
              accept=".json"
              onChange={handleImportAllProfilesFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleExportAllProfiles}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#2c4035] border border-[#d6dfd4] text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            title="Download cadangan JSON semua profil brand"
          >
            <Download className="w-3.5 h-3.5 text-[#52665b]" />
            <span className="hidden md:inline">Cadangkan Semua</span>
          </button>
        </div>
      </div>


      {profileViewMode === 'manage' ? (
<div className="p-5 sm:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#dce5db] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#14291f] font-heading flex items-center gap-2">
                <Users className="w-4 h-4 text-[#205c49]" />
                <span>Daftar Profil Brand Saya ({allProfiles.length})</span>
              </h3>
              <p className="text-xs text-[#55695e] mt-0.5">
                Kelola profil brand aktif Anda, beralih profil, duplikat, atau cadangkan seluruh identitas ke file JSON.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuickBrandName('');
                const p = generateQuickPrompt(quickIndustry, quickScale, quickServiceId, '');
                setRawExtractText(p);
                setIsNewProfileModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Profil Baru</span>
            </button>
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-[#f7f9f6] p-4 rounded-2xl border border-[#dce5db] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#205c49]/10 text-[#205c49] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#6e7f74] font-medium">Total Profil Brand</div>
                <div className="text-xl font-extrabold text-[#183127] font-heading">{allProfiles.length} Brand</div>
              </div>
            </div>

            <div className="bg-[#f7f9f6] p-4 rounded-2xl border border-[#dce5db] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: data.color || '#205c49' }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="text-[11px] text-[#6e7f74] font-medium">Brand Aktif Sekarang</div>
                <div className="text-sm font-bold text-[#183127] truncate font-heading">{data.name || 'Belum dipilih'}</div>
              </div>
            </div>

            <div className="bg-[#f7f9f6] p-4 rounded-2xl border border-[#dce5db] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#6e7f74] font-medium">Rata-rata Kelengkapan</div>
                <div className="text-xl font-extrabold text-[#183127] font-heading">
                  {Math.round(allProfiles.reduce((acc, p) => acc + calculateBrainCompleteness(p).score, 0) / (allProfiles.length || 1))}%
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={profileSearch}
                onChange={(e) => setProfileSearch(e.target.value)}
                placeholder="Cari profil brand berdasarkan nama, kategori, atau produk..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#cbd8cb] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none bg-white"
              />
            </div>
            <div className="text-xs text-[#6e7f74]">
              Menampilkan <strong>{allProfiles.length}</strong> profil brand
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allProfiles
              .filter((p) => {
                if (!profileSearch.trim()) return true;
                const q = profileSearch.toLowerCase();
                return (
                  p.name?.toLowerCase().includes(q) ||
                  p.category?.toLowerCase().includes(q) ||
                  p.product?.toLowerCase().includes(q)
                );
              })
              .map((p) => {
                const isSelected = p.id === (data.id || activeBrandId);
                const score = calculateBrainCompleteness(p).score;

                return (
                  <div
                    key={p.id || p.name}
                    onClick={() => {
                      handleSelectProfile(p.id || p.name);
                      setProfileViewMode('editor');
                    }}
                    className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden bg-white cursor-pointer hover:shadow-md ${
                      isSelected
                        ? 'border-[#205c49] shadow-md ring-2 ring-[#205c49]/20'
                        : 'border-[#dce4db] hover:border-[#b5c7b8] shadow-2xs'
                    }`}
                  >
                    {/* Top Color Band */}
                    <div className="h-2 w-full" style={{ backgroundColor: p.color || '#205c49' }} />

                    <div className="p-4 sm:p-5 space-y-3.5 flex-1">
                      {/* Brand Info & Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-2xs"
                            style={{ backgroundColor: p.color || '#205c49' }}
                          >
                            {(p.name || 'B').slice(0, 1).toUpperCase()}
                          </div>
                          <div className="truncate">
                            <h4 className="font-bold text-sm text-[#183127] truncate font-heading">{p.name || 'Brand Tanpa Nama'}</h4>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="text-[11px] text-[#697c70] truncate">{p.category || 'Kategori umum'}</span>
                              {p.scaleLabel && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-[#edf4ee] text-[#224e3d] border border-[#d4ded3]">
                                  {p.scaleLabel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Aktif
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectProfile(p.id || p.name)}
                            className="shrink-0 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-[#205c49] text-gray-700 hover:text-white text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                          >
                            Gunakan Profil
                          </button>
                        )}
                      </div>

                      {/* Completeness Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#6e7f74]">Kelengkapan Brain:</span>
                          <span className="font-bold text-[#183127]">{score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#e8eee6] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${score}%`,
                              backgroundColor: score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
                            }}
                          />
                        </div>
                      </div>

                      {/* Snippets */}
                      <div className="space-y-1.5 text-[11px] text-[#55695e] border-t border-[#edf1eb] pt-2.5">
                        <div className="line-clamp-1">
                          <strong className="text-[#203a2c]">Target:</strong> {p.audience || 'Belum diisi'}
                        </div>
                        <div className="line-clamp-1">
                          <strong className="text-[#203a2c]">USP:</strong> {p.usp || 'Belum diisi'}
                        </div>
                        <div className="line-clamp-1">
                          <strong className="text-[#203a2c]">Tone:</strong> {p.tone || 'Belum diisi'}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 border-t border-[#edf1eb] bg-[#fafcf9] flex items-center justify-between gap-1.5">
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProfile(p.id || p.name);
                            setProfileViewMode('editor');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Buka Brand Brain</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProfile(p.id || p.name);
                            setProfileViewMode('editor');
                            onNotify?.(`Profil "${p.name}" sekarang aktif!`, 'success');
                          }}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Buka Brand Brain</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => { handleSelectProfile(p.id || p.name); setProfileViewMode('editor'); }}
                        className="p-1.5 rounded-xl border border-[#dce4db] bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-[#52665b] transition-all cursor-pointer shadow-2xs"
                        title="Lihat Detail Brand Brain"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateBrand && onDuplicateBrand(p.id || p.name)}
                        className="p-1.5 rounded-xl border border-[#dce4db] bg-white hover:bg-[#f6faf4] text-[#52665b] transition-all cursor-pointer shadow-2xs"
                        title="Duplikat profil ini"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const slug = (p.name || 'brand').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
                          const jsonStr = JSON.stringify({
                            type: 'brand-brain-export',
                            version: 1,
                            exportedAt: new Date().toISOString(),
                            brand: p
                          }, null, 2);
                          downloadFile(`${slug}-brand-brain.json`, jsonStr, 'application/json;charset=utf-8');
                          onNotify?.(`Profil "${p.name}" berhasil diunduh.`, 'success');
                        }}
                        className="p-1.5 rounded-xl border border-[#dce4db] bg-white hover:bg-[#f6faf4] text-[#52665b] transition-all cursor-pointer shadow-2xs"
                        title="Download file JSON profil ini"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={allProfiles.length <= 1}
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus profil "${p.name}"?`)) {
                            onDeleteBrand && onDeleteBrand(p.id || p.name);
                          }
                        }}
                        className="p-1.5 rounded-xl border border-[#dce4db] bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[#52665b] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                        title={allProfiles.length <= 1 ? 'Minimal harus ada 1 profil' : 'Hapus profil ini'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          {/* Modal Top Bar */}
          <div className="p-4 sm:p-5 border-b border-[#edf1eb] flex items-center justify-between bg-[#fafcf9] flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
                style={{ backgroundColor: data.color || "#205c49" }}
              >
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-[#142620] font-heading">
                    {data.name || "Brand Brain"}
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f1e9] text-[#205c49] border border-[#cfded1]">
                    {data.category || "Otak Konten"}
                  </span>
                </div>
                <p className="text-xs text-[#697c70] mt-0.5">
                  Satu sumber kebenaran identitas, positioning, psikografi, dan guardrails kreatif untuk modul AI.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProfileViewMode('manage')}
                className="px-3 py-1.5 rounded-xl bg-[#f0f5ee] hover:bg-[#e4ede1] text-[#205c49] border border-[#d6dfd4] text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Buka daftar semua profil brand"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Daftar Profil ({allProfiles.length})</span>
              </button>

              {/* Brand Brain Header Actions from kalender_konten_planner (3).html */}
              <BrandBrainImportModal
                brand={data}
                onNotify={onNotify}
                onApply={(updater: any) => {
                  setData(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
                }}
              />
              <BrandBrainExportMenu
                brand={data}
                onNotify={onNotify}
                onMore={() => setActiveTab("export")}
              />
              <button
                type="button"
                onClick={() => {
                  setData({ ...sampleBrandTrajecto });
                  onNotify?.(`Brand Brain "${sampleBrandTrajecto.name}" berhasil dimuat!`, 'success');
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Muat contoh lengkap Brand Brain untuk Trajecto"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>⚡ Muat Trajecto Brain</span>
              </button>

              {!embedded && onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#697c70] hover:text-[#142620] hover:bg-[#edf2ec] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#edf1eb] bg-[#f8faf7] p-2.5 sm:px-4 select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 bbx-grid10 gap-1.5 sm:gap-2">
            {tabs.map(t => {
              const isCur = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2 px-2 sm:px-2.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1 ${
                    isCur
                      ? "bg-white border-[#205c49]/40 shadow-xs ring-1 ring-[#205c49]/20"
                      : "bg-[#f0f4ef]/60 border-transparent hover:bg-white/90 hover:border-[#dce4db]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-sm shrink-0">{t.icon}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs truncate ${
                        isCur ? "font-bold text-[#142620]" : "font-semibold text-[#485c51]"
                      }`}
                    >
                      {t.label}
                    </div>
                    <div className="text-[10px] text-[#718478] truncate leading-tight">{t.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form
          id="brand-brain-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6"
        >
          {/* TAB 1: FONDASI BRAND */}
          {activeTab === "foundation" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Nama Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={e => updateRoot("name", e.target.value)}
                    placeholder="Contoh: Kopi Nusantara"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kategori Bisnis
                  </label>
                  <input
                    type="text"
                    value={data.category}
                    onChange={e => updateRoot("category", e.target.value)}
                    placeholder="Contoh: F&B Specialty"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Warna Utama
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.color || "#205c49"}
                      onChange={e => updateRoot("color", e.target.value)}
                      className="w-9 h-9 rounded-xl border border-[#cbd8cb] p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.color || "#205c49"}
                      onChange={e => updateRoot("color", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline & Deskripsi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Tagline Brand
                  </label>
                  <input
                    type="text"
                    value={data.tagline || ""}
                    onChange={e => updateRoot("tagline", e.target.value)}
                    placeholder="Contoh: Kopi Asli, Rasa yang Mengikat Cerita"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Produk / Layanan Inti
                  </label>
                  <input
                    type="text"
                    value={data.product || ""}
                    onChange={e => updateRoot("product", e.target.value)}
                    placeholder="Contoh: Biji kopi sangrai mingguan & menu signature"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              {/* 5 Elemen Positioning */}
              <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#dce5db] space-y-3">
                <div className="font-bold text-xs text-[#183127] font-heading flex items-center justify-between">
                  <span>Rumusan Positioning (5 Elemen Teruji)</span>
                  <span className="text-[10px] text-[#697d70] font-normal">
                    Menyusun kalimat kebenaran posisi brand
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      1. Siapa Kami (weAre)
                    </span>
                    <input
                      type="text"
                      value={data.positioning?.weAre || ""}
                      onChange={e => updatePositioning("weAre", e.target.value)}
                      placeholder="Solusi platform kalender konten..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      2. Untuk Siapa (forAudience)
                    </span>
                    <input
                      type="text"
                      value={data.positioning?.forAudience || ""}
                      onChange={e => updatePositioning("forAudience", e.target.value)}
                      placeholder="Bisnis owner & agency kreator..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      3. Yang Membutuhkan (whoNeed)
                    </span>
                    <input
                      type="text"
                      value={data.positioning?.whoNeed || ""}
                      onChange={e => updatePositioning("whoNeed", e.target.value)}
                      placeholder="Sistem konten konsisten bebas burnout..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      4. Karena Mengapa (becauseWhy)
                    </span>
                    <input
                      type="text"
                      value={data.positioning?.becauseWhy || ""}
                      onChange={e => updatePositioning("becauseWhy", e.target.value)}
                      placeholder="Memadukan AI terarah dengan standar editorial..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-semibold text-[#506457]">
                      5. Berbeda dari Alternatif (unlike)
                    </span>
                    <input
                      type="text"
                      value={data.positioning?.unlike || ""}
                      onChange={e => updatePositioning("unlike", e.target.value)}
                      placeholder="Tools generator acak tanpa acuan brand..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-200 text-xs">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Pernyataan Positioning Terpadu:
                  </div>
                  <p className="text-[#1a382c] italic">
                    "{data.positioning?.statement || "Lengkapi 5 elemen di atas untuk menyusun pernyataan."}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPETITOR & PASAR */}
          {activeTab === "market" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kompetitor Langsung
                  </label>
                  <textarea
                    rows={4}
                    value={data.competitorAnalysis?.directCompetitors?.join("\n") || ""}
                    onChange={e =>
                      setData(p => ({
                        ...p,
                        competitorAnalysis: {
                          ...p.competitorAnalysis,
                          directCompetitors: e.target.value.split("\n").filter(Boolean)
                        }
                      }))
                    }
                    placeholder="Satu per baris:&#10;Kompetitor A&#10;Kompetitor B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Diferensiasi vs Rival (Kenapa Kita Menang)
                  </label>
                  <textarea
                    rows={4}
                    value={data.competitorAnalysis?.differentiation || data.usp || ""}
                    onChange={e => {
                      const val = e.target.value;
                      setData(p => ({
                        ...p,
                        usp: val,
                        competitorAnalysis: { ...p.competitorAnalysis, differentiation: val }
                      }));
                    }}
                    placeholder="Tuliskan keunggulan utama yang tidak mudah ditiru..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183127] mb-1">
                  Kelemahan Kompetitor yang Dieksploitasi
                </label>
                <textarea
                  rows={3}
                  value={data.competitorAnalysis?.competitorWeaknesses?.join("\n") || ""}
                  onChange={e =>
                    setData(p => ({
                      ...p,
                      competitorAnalysis: {
                        ...p.competitorAnalysis,
                        competitorWeaknesses: e.target.value.split("\n").filter(Boolean)
                      }
                    }))
                  }
                  placeholder="Contoh:&#10;Respon lambat&#10;Harga tersembunyi&#10;Materi basi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: AUDIENCE DNA */}
          {activeTab === "audience" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Rentang Usia
                  </label>
                  <input
                    type="text"
                    value={data.audienceDNA?.demographics?.ageRange || ""}
                    onChange={e => updateAudienceDemographics("ageRange", e.target.value)}
                    placeholder="Contoh: 24 - 38 tahun"
                    className="w-full px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Profesi / Peran
                  </label>
                  <input
                    type="text"
                    value={data.audienceDNA?.demographics?.roleOccupation || ""}
                    onChange={e => updateAudienceDemographics("roleOccupation", e.target.value)}
                    placeholder="Contoh: Founder UMKM, Freelancer"
                    className="w-full px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Status Finansial
                  </label>
                  <input
                    type="text"
                    value={data.audienceDNA?.demographics?.incomeLevel || ""}
                    onChange={e => updateAudienceDemographics("incomeLevel", e.target.value)}
                    placeholder="Contoh: Menengah ke atas (SES A-B)"
                    className="w-full px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Pain Points Terdalam (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={data.audienceDNA?.psychographics?.painPoints?.join("\n") || data.painPoints?.join("\n") || ""}
                    onChange={e => {
                      updateAudiencePsychographics("painPoints", e.target.value);
                      updateRoot("painPoints", e.target.value.split("\n").filter(Boolean));
                    }}
                    placeholder="Kelelahan buat konten tiap hari...&#10;Followers banyak tapi sepi closing..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Keinginan & Impian Emosional (Desires)
                  </label>
                  <textarea
                    rows={4}
                    value={data.audienceDNA?.psychographics?.desires?.join("\n") || ""}
                    onChange={e => updateAudiencePsychographics("desires", e.target.value)}
                    placeholder="Ingin punya funnel konten otomatis...&#10;Diakui sebagai thought leader..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Ketakutan Terbesar (Fears)
                  </label>
                  <textarea
                    rows={3}
                    value={data.audienceDNA?.psychographics?.fears?.join("\n") || ""}
                    onChange={e => updateAudiencePsychographics("fears", e.target.value)}
                    placeholder="Kalah saing dengan brand modal besar...&#10;Uang iklan terbuang percuma..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Keraguan Sebelum Membeli (Objections)
                  </label>
                  <textarea
                    rows={3}
                    value={data.audienceDNA?.psychographics?.objections?.join("\n") || ""}
                    onChange={e => updateAudiencePsychographics("objections", e.target.value)}
                    placeholder="Beneran bisa dipakai pemula?&#10;Ada jaminan kepuasan?..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PENAWARAN (OFFER) */}
          {activeTab === "offer" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Janji Brand (Brand Promise)
                  </label>
                  <input
                    type="text"
                    value={data.offerPromise?.brandPromise || ""}
                    onChange={e =>
                      setData(p => ({
                        ...p,
                        offerPromise: { ...p.offerPromise, brandPromise: e.target.value }
                      }))
                    }
                    placeholder="Contoh: Konten berkualitas tanpa stres mingguan"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Garansi / Risk Reversal
                  </label>
                  <input
                    type="text"
                    value={data.offerPromise?.guarantee || ""}
                    onChange={e =>
                      setData(p => ({
                        ...p,
                        offerPromise: { ...p.offerPromise, guarantee: e.target.value }
                      }))
                    }
                    placeholder="Contoh: 14 hari pengembalian uang tanpa syarat"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183127] mb-1">
                  Bukti Nyata (Social Proof & Bukti Keberhasilan)
                </label>
                <textarea
                  rows={3}
                  value={data.offerPromise?.socialProofPoints?.join("\n") || ""}
                  onChange={e =>
                    setData(p => ({
                      ...p,
                      offerPromise: {
                        ...p.offerPromise,
                        socialProofPoints: e.target.value.split("\n").filter(Boolean)
                      }
                    }))
                  }
                  placeholder="Contoh:&#10;Digunakan 2.400+ tim bisnis di 18 kota&#10;Rating 4.9/5 dari 350 ulasan terverifikasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PERSONALITY & VOICE */}
          {activeTab === "personality" && (
            <div className="space-y-5 animate-in fade-in">
              {/* Tone Voice Spectrum */}
              <div className="p-4 bg-[#f7f9f6] rounded-2xl border border-[#dce5db] space-y-4">
                <div className="font-bold text-xs text-[#183127] font-heading">
                  Spektrum Karakter Suara Brand (1 - 5)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#485c50] mb-1">
                      <span>Formal & Korporat</span>
                      <span>Santai & Akrab</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={data.personalityVoice?.spectrum?.formalToCasual || 3}
                      onChange={e => updateVoiceSpectrum("formalToCasual", Number(e.target.value))}
                      className="w-full accent-[#205c49] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#485c50] mb-1">
                      <span>Serius & Edukatif</span>
                      <span>Lucu & Humoris</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={data.personalityVoice?.spectrum?.seriousToPlayful || 3}
                      onChange={e => updateVoiceSpectrum("seriousToPlayful", Number(e.target.value))}
                      className="w-full accent-[#205c49] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Gaya yang Dianjurkan (Voice DO)
                  </label>
                  <textarea
                    rows={4}
                    value={data.personalityVoice?.voiceDo?.join("\n") || ""}
                    onChange={e => updateVoiceArray("voiceDo", e.target.value)}
                    placeholder="Satu per baris:&#10;Gunakan analogi sederhana&#10;Tunjukkan empati nyata&#10;Panggil 'Teman Kopi'"
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 text-xs bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    Gaya yang Dilarang (Voice DON'T)
                  </label>
                  <textarea
                    rows={4}
                    value={data.personalityVoice?.voiceDont?.join("\n") || ""}
                    onChange={e => updateVoiceArray("voiceDont", e.target.value)}
                    placeholder="Satu per baris:&#10;Jangan gunakan jargon teknis berlebihan&#10;Jangan menggurui audiens&#10;Jangan hard-selling kasar"
                    className="w-full px-3.5 py-2 rounded-xl border border-rose-300 text-xs bg-rose-50/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kata Khas / Signature Words
                  </label>
                  <input
                    type="text"
                    value={data.personalityVoice?.signatureWords?.join(", ") || ""}
                    onChange={e =>
                      setData(p => ({
                        ...p,
                        personalityVoice: {
                          ...p.personalityVoice,
                          signatureWords: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                        }
                      }))
                    }
                    placeholder="Pisahkan koma: Kopi Asli, Seduh Cerita, Rasa Nyata"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kata Terlarang (Forbidden Words)
                  </label>
                  <input
                    type="text"
                    value={data.personalityVoice?.forbiddenWords?.join(", ") || ""}
                    onChange={e =>
                      setData(p => ({
                        ...p,
                        personalityVoice: {
                          ...p.personalityVoice,
                          forbiddenWords: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                        }
                      }))
                    }
                    placeholder="Pisahkan koma: Murahan, Kaleng-kaleng, Dijamin Kaya"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTENT DNA & PILAR */}
          {activeTab === "content" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Pilar Konten Utama (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={data.pillars?.join("\n") || ""}
                    onChange={e => updateRoot("pillars", e.target.value.split("\n").filter(Boolean))}
                    placeholder="Contoh:&#10;Edukasi & Tips&#10;Behind the Scenes&#10;Cerita Pelanggan&#10;Penawaran & Promo"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Variasi Call To Action (CTA Utama)
                  </label>
                  <textarea
                    rows={4}
                    value={data.contentDNA?.ctaBank?.join("\n") || data.cta || ""}
                    onChange={e => {
                      const lines = e.target.value.split("\n").filter(Boolean);
                      setData(p => ({
                        ...p,
                        cta: e.target.value,
                        contentDNA: { ...p.contentDNA, ctaBank: lines }
                      }));
                    }}
                    placeholder="Contoh:&#10;Komentar 'MAU' untuk dapat resep&#10;Klik link di bio untuk order&#10;Bagikan ke teman ngopi Anda"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              {/* Akun Media Sosial Terhubung */}
              <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#dce5db] space-y-3">
                <div className="font-bold text-xs text-[#183127] font-heading flex items-center justify-between">
                  <span>Nama Akun Media Sosial Brand</span>
                  <span className="text-[10px] text-[#697d70] font-normal">
                    Otomatis mengisi kolom "Akun Target" di kalender konten
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      Instagram Handle:
                    </label>
                    <input
                      type="text"
                      value={data.platformAccounts?.instagram || data.instagramHandle || ""}
                      onChange={e => updatePlatformAccount('instagram', e.target.value)}
                      placeholder="@kopinusantara"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      TikTok Handle:
                    </label>
                    <input
                      type="text"
                      value={data.platformAccounts?.tiktok || ""}
                      onChange={e => updatePlatformAccount('tiktok', e.target.value)}
                      placeholder="@kopinusantara.id"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      Threads Handle:
                    </label>
                    <input
                      type="text"
                      value={data.platformAccounts?.threads || ""}
                      onChange={e => updatePlatformAccount('threads', e.target.value)}
                      placeholder="@kopinusantara"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      LinkedIn Company:
                    </label>
                    <input
                      type="text"
                      value={data.platformAccounts?.linkedin || ""}
                      onChange={e => updatePlatformAccount('linkedin', e.target.value)}
                      placeholder="Kopi Nusantara Group"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      YouTube Channel:
                    </label>
                    <input
                      type="text"
                      value={data.platformAccounts?.youtube || ""}
                      onChange={e => updatePlatformAccount('youtube', e.target.value)}
                      placeholder="@KopiNusantaraOfficial"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      Facebook Page:
                    </label>
                    <input
                      type="text"
                      value={data.platformAccounts?.facebook || ""}
                      onChange={e => updatePlatformAccount('facebook', e.target.value)}
                      placeholder="Kopi Nusantara ID"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRAND MEMORY & GUARDRAILS */}
          {activeTab === "memory" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Selalu Katakan (Always Say)
                  </label>
                  <textarea
                    rows={4}
                    value={data.brandMemory?.alwaysSay?.join("\n") || ""}
                    onChange={e => updateMemoryArray("alwaysSay", e.target.value)}
                    placeholder="Satu per baris:&#10;Biji kopi 100% lokal nusantara&#10;Dipanggang segar tiap hari"
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 text-xs bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    Jangan Pernah Katakan (Never Say)
                  </label>
                  <textarea
                    rows={4}
                    value={data.brandMemory?.neverSay?.join("\n") || ""}
                    onChange={e => updateMemoryArray("neverSay", e.target.value)}
                    placeholder="Satu per baris:&#10;Kopi sachet instan&#10;Menjatuhkan petani lokal"
                    className="w-full px-3.5 py-2 rounded-xl border border-rose-300 text-xs bg-rose-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183127] mb-1">
                  Batasan Klaim (Claims Guardrail Dilarang)
                </label>
                <textarea
                  rows={3}
                  value={data.brandMemory?.claimsGuardrail?.forbidden?.join("\n") || ""}
                  onChange={e => updateClaimsArray("forbidden", e.target.value)}
                  placeholder="Contoh:&#10;Dilarang klaim mengobati penyakit&#10;Dilarang menjanjikan omset pasti naik"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 8: ACUAN BEBAS (CUSTOM DIRECTIVES & BLOK) */}
          {activeTab === "custom" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce5db] space-y-3">
                <div className="font-bold text-xs text-[#183127] font-heading">
                  Instruksi Wajib Khusus AI (Directives)
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDirective}
                    onChange={e => setNewDirective(e.target.value)}
                    placeholder="Ketik aturan khusus (contoh: Selalu sertakan 3 hashtag brand di akhir caption)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => addDirective()}
                    className="px-4 py-2 rounded-xl bg-[#205c49] text-white text-xs font-bold hover:bg-[#184738] transition-all cursor-pointer shadow-xs"
                  >
                    Tambah
                  </button>
                </div>

                <div className="space-y-1.5 mt-2">
                  {(data.customDirectives || []).map((dir, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#dce4db] flex items-center justify-between text-xs"
                    >
                      <span className="text-[#1c3327]">{dir}</span>
                      <button
                        type="button"
                        onClick={() => removeDirective(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!data.customDirectives || data.customDirectives.length === 0) && (
                    <p className="text-[11px] text-[#718476] italic">Belum ada instruksi khusus tambahan.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AI INSPECTOR (LIVE PROMPT) */}
          {activeTab === "inspector" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#183127] font-heading">
                    Live System Prompt Brand Brain
                  </h4>
                  <p className="text-[11px] text-[#697d70]">
                    Inilah teks terstruktur yang otomatis disuntikkan ke Gemini AI setiap kali membuat konten.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="px-3 py-1.5 rounded-xl border border-[#cbd8cb] bg-white text-xs font-semibold text-[#304538] hover:bg-[#f6faf4] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#205c49]" />
                    <span>{copiedPrompt ? "Tersalin!" : "Salin Prompt"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPrompt}
                    className="px-3 py-1.5 rounded-xl bg-[#205c49] text-white text-xs font-bold hover:bg-[#184738] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .md</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#14261f] text-emerald-100 font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap select-text border border-black/20 shadow-inner">
                {compileBrandBrainPrompt(data)}
              </div>
            </div>
          )}

          {/* TAB 10: FORM EKSPOR (dari kalender_konten_planner (3).html) */}
          {activeTab === "export" && (
            <div className="space-y-6 animate-in fade-in">
              <BrandBrainExportPanel brand={data} onNotify={onNotify} />
            </div>
          )}
        </form>

        {/* Footer */}
        <div
          className={`p-4 sm:px-6 border-t border-[#edf1eb] bg-[#fafcf9] flex items-center justify-between flex-wrap gap-3 ${
            embedded ? 'sticky bottom-0 z-10 rounded-b-3xl shadow-xs' : 'shrink-0'
          }`}
        >
          <div className="text-xs text-[#52665b] flex items-center gap-2">
            <span>Kelengkapan Brand Brain:</span>
            <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]">
              {completeness.score}%
            </span>
            <span className="hidden sm:inline text-[#728378]">
              • Otomatis memandu seluruh studio konten
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (embedded) {
                  setData({ ...emptyBrand, ...brand, color: brand?.color || "#205c49" });
                  onNotify?.('Perubahan formulir telah direset.', 'info');
                } else if (onClose) {
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-xl border border-[#dce4db] bg-white text-xs font-semibold text-[#52665b] hover:bg-[#f6faf4] transition-colors cursor-pointer"
            >
              {embedded ? "Reset Perubahan" : "Batal"}
            </button>
            <button
              type="submit"
              form="brand-brain-form"
              className="px-5 py-2 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Simpan Brand Brain</span>
            </button>
          </div>
        </div>
        </>
      )}


      {/* New Profile Creation Dialog (Direct AI Card Extraction) */}
      {isNewProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#dce4db] shadow-2xl max-w-4xl xl:max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 bg-[#f7f9f6] border-b border-[#edf1eb] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#205c49]/10 text-[#205c49] flex items-center justify-center font-bold shadow-2xs">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#183127] font-heading flex items-center gap-2">
                    <span>Tambah Profil Brand Baru</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      ✨ Ekstrak Cerdas AI
                    </span>
                  </h3>
                  <p className="text-xs text-[#697c70]">
                    Pilih kartu industri, skala bisnis, dan produk untuk mengekstrak 9 pilar Brand Brain secara otomatis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProfileModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Step 0: Nama Brand Input (Wajib) */}
              <div className="bg-[#f8faf7] p-3.5 rounded-2xl border border-[#dce5db] flex items-center gap-3 flex-wrap">
                <label className="text-xs font-bold text-[#183127] shrink-0 flex items-center gap-1.5">
                  <span>Nama Brand Baru:</span>
                  <span className="text-red-500 font-bold text-sm">*</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    Wajib Diisi
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={quickBrandName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuickBrandName(val);
                    const p = generateQuickPrompt(
                      quickIndustry,
                      quickScale,
                      quickServiceId,
                      val,
                      quickCustomIndustry,
                      quickCustomScale,
                      quickCustomService,
                      quickCustomAudience,
                      quickCustomUsp
                    );
                    setRawExtractText(p);
                  }}
                  placeholder="Ketik nama brand Anda (contoh: Kopi Nusantara, Aura Glow, TechNova)"
                  className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs outline-none bg-white focus:ring-2 focus:ring-[#205c49]/30 font-medium"
                />
              </div>

              {/* Step 1: Kartu Pilihan Industri */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#183127] flex items-center justify-between">
                  <span>1. Pilih Industri Brand:</span>
                  <span className="text-[11px] text-[#63776b] font-normal">
                    Terpilih: <strong>{quickIndustry === 'custom' ? (quickCustomIndustry || 'Kustom') : INDUSTRY_CATEGORIES.find(c => c.id === quickIndustry)?.label}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INDUSTRY_CATEGORIES.map((cat) => {
                    const isSelected = quickIndustry === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectQuickIndustry(cat.id as IndustryKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-[#205c49] ring-2 ring-[#205c49]/20 shadow-xs'
                            : 'bg-white border-[#dce5db] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                        }`}
                      >
                        <div className="text-xl mb-1">{cat.icon}</div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#205c49]' : 'text-[#183127]'}`}>
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-[#697d70] truncate mt-0.5">{(cat as any).sub}</div>
                        </div>
                      </button>
                    );
                  })}
                  {/* Custom Industry Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectQuickIndustry('custom')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      quickIndustry === 'custom'
                        ? 'bg-emerald-50 border-[#205c49] ring-2 ring-[#205c49]/20 shadow-xs'
                        : 'bg-white border-[#dce5db] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                    }`}
                  >
                    <div className="text-xl mb-1">✍️</div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quickIndustry === 'custom' ? 'text-[#205c49]' : 'text-[#183127]'}`}>
                        Kustom / Lainnya
                      </div>
                      <div className="text-[10px] text-[#697d70] truncate mt-0.5">Ketik industri Anda</div>
                    </div>
                  </button>
                </div>

                {quickIndustry === 'custom' && (
                  <div className="pt-1.5 animate-in fade-in">
                    <input
                      type="text"
                      value={quickCustomIndustry}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuickCustomIndustry(val);
                        const p = generateQuickPrompt(
                          quickIndustry,
                          quickScale,
                          quickServiceId,
                          quickBrandName,
                          val,
                          quickCustomScale,
                          quickCustomService,
                          quickCustomAudience,
                          quickCustomUsp
                        );
                        setRawExtractText(p);
                      }}
                      placeholder="Ketik industri/niche Anda (contoh: Pet Shop & Grooming, Tour & Travel Umroh, Kursus Coding)..."
                      className="w-full px-3 py-1.5 rounded-xl border border-[#cbd8cb] text-xs outline-none bg-white focus:ring-2 focus:ring-[#205c49]/30"
                    />
                  </div>
                )}
              </div>

              {/* Step 2: Kartu Pilihan Skala Bisnis */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#183127] flex items-center justify-between">
                  <span>2. Pilih Skala Bisnis:</span>
                  <span className="text-[11px] text-[#63776b] font-normal">
                    Terpilih: <strong>{quickScale === 'custom' ? (quickCustomScale || 'Kustom') : SCALE_LEVELS.find(s => s.id === quickScale)?.label}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SCALE_LEVELS.map((s) => {
                    const isSelected = quickScale === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectQuickScale(s.id as BusinessScaleKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-[#205c49] ring-2 ring-[#205c49]/20 shadow-xs'
                            : 'bg-white border-[#dce5db] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                        }`}
                      >
                        <div className="text-xl mb-1">{(s as any).icon || "🏢"}</div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#205c49]' : 'text-[#183127]'}`}>
                            {s.label}
                          </div>
                          <div className="text-[10px] text-[#697d70] truncate mt-0.5">{(s as any).desc || (s as any).sub}</div>
                        </div>
                      </button>
                    );
                  })}
                  {/* Custom Scale Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectQuickScale('custom')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      quickScale === 'custom'
                        ? 'bg-emerald-50 border-[#205c49] ring-2 ring-[#205c49]/20 shadow-xs'
                        : 'bg-white border-[#dce5db] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                    }`}
                  >
                    <div className="text-xl mb-1">⚙️</div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quickScale === 'custom' ? 'text-[#205c49]' : 'text-[#183127]'}`}>
                        Kustom Skala
                      </div>
                      <div className="text-[10px] text-[#697d70] truncate mt-0.5">Tentukan sendiri</div>
                    </div>
                  </button>
                </div>

                {quickScale === 'custom' && (
                  <div className="pt-1.5 animate-in fade-in">
                    <input
                      type="text"
                      value={quickCustomScale}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuickCustomScale(val);
                        const p = generateQuickPrompt(
                          quickIndustry,
                          quickScale,
                          quickServiceId,
                          quickBrandName,
                          quickCustomIndustry,
                          val,
                          quickCustomService,
                          quickCustomAudience,
                          quickCustomUsp
                        );
                        setRawExtractText(p);
                      }}
                      placeholder="Ketik skala/tahapan bisnis Anda (contoh: Usaha Rumahan Rintisan, Waralaba 15 Cabang)..."
                      className="w-full px-3 py-1.5 rounded-xl border border-[#cbd8cb] text-xs outline-none bg-white focus:ring-2 focus:ring-[#205c49]/30"
                    />
                  </div>
                )}
              </div>

              {/* Step 3: Kartu Pilihan Servis & Produk */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[#183127]">
                  3. Pilih Layanan / Produk Utama:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {quickIndustry !== 'custom' && (INDUSTRY_SERVICES_PRESETS[quickIndustry] || []).map((srv) => {
                    const isSelected = quickServiceId === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleSelectQuickService(srv.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-[#205c49] ring-2 ring-[#205c49]/20 shadow-xs'
                            : 'bg-white border-[#dce5db] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#205c49]' : 'text-[#183127]'}`}>
                            {srv.name}
                          </div>
                          <div className="text-[10px] text-[#697d70] line-clamp-2 mt-0.5 leading-snug">
                            {srv.desc}
                          </div>
                        </div>
                        <div className="mt-1 text-[10px] text-[#205c49] font-medium truncate">
                          Target: {srv.defaultAudience}
                        </div>
                      </button>
                    );
                  })}
                  {/* Custom Service Card */}
                  <button
                    type="button"
                    onClick={() => handleSelectQuickService('custom')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      quickServiceId === 'custom'
                        ? 'bg-emerald-50 border-[#205c49] ring-2 ring-[#205c49]/20 shadow-xs'
                        : 'bg-white border-[#dce5db] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quickServiceId === 'custom' ? 'text-[#205c49]' : 'text-[#183127]'}`}>
                        ➕ Produk / Servis Kustom
                      </div>
                      <div className="text-[10px] text-[#697d70] line-clamp-2 mt-0.5 leading-snug">
                        Tuliskan produk atau jasa spesifik milik bisnis Anda
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] text-[#205c49] font-medium">
                      Input Bebas
                    </div>
                  </button>
                </div>

                {quickServiceId === 'custom' && (
                  <div className="pt-1.5 space-y-2 animate-in fade-in">
                    <input
                      type="text"
                      value={quickCustomService}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuickCustomService(val);
                        const p = generateQuickPrompt(
                          quickIndustry,
                          quickScale,
                          quickServiceId,
                          quickBrandName,
                          quickCustomIndustry,
                          quickCustomScale,
                          val,
                          quickCustomAudience,
                          quickCustomUsp
                        );
                        setRawExtractText(p);
                      }}
                      placeholder="Nama produk/layanan spesifik (contoh: Katering Sehat Rendah Kalori Mingguan)..."
                      className="w-full px-3 py-1.5 rounded-xl border border-[#cbd8cb] text-xs outline-none bg-white focus:ring-2 focus:ring-[#205c49]/30"
                    />
                  </div>
                )}
              </div>

              {/* Panel Quick Start: Ekstrak Brand Brain 70–80% Otomatis */}
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-amber-50/60 via-emerald-50/50 to-sky-50/60 p-4 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#183127] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Quick Start: Ekstrak Brand Brain 70–80% Otomatis</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#52665b] border border-[#d2ded2] font-semibold">
                      Kelengkapan: {calculateBrainCompleteness(newBrandForm).score}%
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isCreatingAiProfile || !rawExtractText.trim()}
                    onClick={handleExtractToBrandBrainForm}
                    className="px-4 py-2 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
                  >
                    {isCreatingAiProfile ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengekstrak AI…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ekstrak Brand Brain via AI</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#183127]">
                    <span>Ringkasan Teks Acuan Ekstraksi (Dapat Diedit Manual):</span>
                    <span className="text-[10px] text-[#697d70] font-normal">
                      AI akan membaca seluruh teks di bawah ini
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={rawExtractText}
                    onChange={(e) => setRawExtractText(e.target.value)}
                    placeholder="Pilihan kartu di atas otomatis mengisi form teks acuan ini. Anda juga bisa mengetik langsung deskripsi bisnis bebas di sini..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbdcd0] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none bg-white font-mono leading-relaxed shadow-inner"
                  />
                </div>
              </div>

              {/* BRAND BRAIN: Form 9 Pilar Lengkap */}
              <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-xs mt-4">
                <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="font-bold text-sm text-[#183127] font-heading">
                        Brand Brain: 9 Pilar Identitas Lengkap
                      </h4>
                      <p className="text-xs text-[#55695e]">
                        Terisi otomatis setelah ekstraksi AI & dapat disempurnakan langsung di tab-tab berikut:
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-emerald-800 border border-emerald-300">
                    Kelengkapan: {calculateBrainCompleteness(newBrandForm).score}%
                  </span>
                </div>

                {/* Tab Navigation */}
        <div className="border-b border-[#edf1eb] bg-[#f8faf7] p-2.5 sm:px-4 select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5 sm:gap-2">
            {tabs.map(t => {
              const isCur = modalBrandTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setModalBrandTab(t.id)}
                  className={`py-2 px-2 sm:px-2.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1 ${
                    isCur
                      ? "bg-white border-[#205c49]/40 shadow-xs ring-1 ring-[#205c49]/20"
                      : "bg-[#f0f4ef]/60 border-transparent hover:bg-white/90 hover:border-[#dce4db]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-sm shrink-0">{t.icon}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs truncate ${
                        isCur ? "font-bold text-[#142620]" : "font-semibold text-[#485c51]"
                      }`}
                    >
                      {t.label}
                    </div>
                    <div className="text-[10px] text-[#718478] truncate leading-tight">{t.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form
          id="new-brand-brain-form"
          onSubmit={(e) => { e.preventDefault(); handleSaveCreatedProfile(); }}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6"
        >
          {/* TAB 1: FONDASI BRAND */}
          {modalBrandTab === "foundation" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Nama Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandForm.name}
                    onChange={e => updateNewBrandRoot("name", e.target.value)}
                    placeholder="Contoh: Kopi Nusantara"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kategori Bisnis
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.category}
                    onChange={e => updateNewBrandRoot("category", e.target.value)}
                    placeholder="Contoh: F&B Specialty"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Warna Utama
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBrandForm.color || "#205c49"}
                      onChange={e => updateNewBrandRoot("color", e.target.value)}
                      className="w-9 h-9 rounded-xl border border-[#cbd8cb] p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newBrandForm.color || "#205c49"}
                      onChange={e => updateNewBrandRoot("color", e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline & Deskripsi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Tagline Brand
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.tagline || ""}
                    onChange={e => updateNewBrandRoot("tagline", e.target.value)}
                    placeholder="Contoh: Kopi Asli, Rasa yang Mengikat Cerita"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Produk / Layanan Inti
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.product || ""}
                    onChange={e => updateNewBrandRoot("product", e.target.value)}
                    placeholder="Contoh: Biji kopi sangrai mingguan & menu signature"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              {/* 5 Elemen Positioning */}
              <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#dce5db] space-y-3">
                <div className="font-bold text-xs text-[#183127] font-heading flex items-center justify-between">
                  <span>Rumusan Positioning (5 Elemen Teruji)</span>
                  <span className="text-[10px] text-[#697d70] font-normal">
                    Menyusun kalimat kebenaran posisi brand
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      1. Siapa Kami (weAre)
                    </span>
                    <input
                      type="text"
                      value={newBrandForm.positioning?.weAre || ""}
                      onChange={e => updateNewBrandPositioning("weAre", e.target.value)}
                      placeholder="Solusi platform kalender konten..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      2. Untuk Siapa (forAudience)
                    </span>
                    <input
                      type="text"
                      value={newBrandForm.positioning?.forAudience || ""}
                      onChange={e => updateNewBrandPositioning("forAudience", e.target.value)}
                      placeholder="Bisnis owner & agency kreator..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      3. Yang Membutuhkan (whoNeed)
                    </span>
                    <input
                      type="text"
                      value={newBrandForm.positioning?.whoNeed || ""}
                      onChange={e => updateNewBrandPositioning("whoNeed", e.target.value)}
                      placeholder="Sistem konten konsisten bebas burnout..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#506457]">
                      4. Karena Mengapa (becauseWhy)
                    </span>
                    <input
                      type="text"
                      value={newBrandForm.positioning?.becauseWhy || ""}
                      onChange={e => updateNewBrandPositioning("becauseWhy", e.target.value)}
                      placeholder="Memadukan AI terarah dengan standar editorial..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] font-semibold text-[#506457]">
                      5. Berbeda dari Alternatif (unlike)
                    </span>
                    <input
                      type="text"
                      value={newBrandForm.positioning?.unlike || ""}
                      onChange={e => updateNewBrandPositioning("unlike", e.target.value)}
                      placeholder="Tools generator acak tanpa acuan brand..."
                      className="mt-1 w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs"
                    />
                  </div>
                </div>

                <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-200 text-xs">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Pernyataan Positioning Terpadu:
                  </div>
                  <p className="text-[#1a382c] italic">
                    "{newBrandForm.positioning?.statement || "Lengkapi 5 elemen di atas untuk menyusun pernyataan."}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPETITOR & PASAR */}
          {modalBrandTab === "market" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kompetitor Langsung
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.competitorAnalysis?.directCompetitors?.join("\n") || ""}
                    onChange={e =>
                      setNewBrandForm(p => ({
                        ...p,
                        competitorAnalysis: {
                          ...p.competitorAnalysis,
                          directCompetitors: e.target.value.split("\n").filter(Boolean)
                        }
                      }))
                    }
                    placeholder="Satu per baris:&#10;Kompetitor A&#10;Kompetitor B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Diferensiasi vs Rival (Kenapa Kita Menang)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.competitorAnalysis?.differentiation || newBrandForm.usp || ""}
                    onChange={e => {
                      const val = e.target.value;
                      setNewBrandForm(p => ({
                        ...p,
                        usp: val,
                        competitorAnalysis: { ...p.competitorAnalysis, differentiation: val }
                      }));
                    }}
                    placeholder="Tuliskan keunggulan utama yang tidak mudah ditiru..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183127] mb-1">
                  Kelemahan Kompetitor yang Dieksploitasi
                </label>
                <textarea
                  rows={3}
                  value={newBrandForm.competitorAnalysis?.competitorWeaknesses?.join("\n") || ""}
                  onChange={e =>
                    setNewBrandForm(p => ({
                      ...p,
                      competitorAnalysis: {
                        ...p.competitorAnalysis,
                        competitorWeaknesses: e.target.value.split("\n").filter(Boolean)
                      }
                    }))
                  }
                  placeholder="Contoh:&#10;Respon lambat&#10;Harga tersembunyi&#10;Materi basi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: AUDIENCE DNA */}
          {modalBrandTab === "audience" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Rentang Usia
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.audienceDNA?.demographics?.ageRange || ""}
                    onChange={e => updateNewBrandAudienceDemographics("ageRange", e.target.value)}
                    placeholder="Contoh: 24 - 38 tahun"
                    className="w-full px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Profesi / Peran
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.audienceDNA?.demographics?.roleOccupation || ""}
                    onChange={e => updateNewBrandAudienceDemographics("roleOccupation", e.target.value)}
                    placeholder="Contoh: Founder UMKM, Freelancer"
                    className="w-full px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Status Finansial
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.audienceDNA?.demographics?.incomeLevel || ""}
                    onChange={e => updateNewBrandAudienceDemographics("incomeLevel", e.target.value)}
                    placeholder="Contoh: Menengah ke atas (SES A-B)"
                    className="w-full px-3 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Pain Points Terdalam (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.audienceDNA?.psychographics?.painPoints?.join("\n") || newBrandForm.painPoints?.join("\n") || ""}
                    onChange={e => {
                      updateNewBrandAudiencePsychographics("painPoints", e.target.value);
                      updateNewBrandRoot("painPoints", e.target.value.split("\n").filter(Boolean));
                    }}
                    placeholder="Kelelahan buat konten tiap hari...&#10;Followers banyak tapi sepi closing..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Keinginan & Impian Emosional (Desires)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.audienceDNA?.psychographics?.desires?.join("\n") || ""}
                    onChange={e => updateNewBrandAudiencePsychographics("desires", e.target.value)}
                    placeholder="Ingin punya funnel konten otomatis...&#10;Diakui sebagai thought leader..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Ketakutan Terbesar (Fears)
                  </label>
                  <textarea
                    rows={3}
                    value={newBrandForm.audienceDNA?.psychographics?.fears?.join("\n") || ""}
                    onChange={e => updateNewBrandAudiencePsychographics("fears", e.target.value)}
                    placeholder="Kalah saing dengan brand modal besar...&#10;Uang iklan terbuang percuma..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Keraguan Sebelum Membeli (Objections)
                  </label>
                  <textarea
                    rows={3}
                    value={newBrandForm.audienceDNA?.psychographics?.objections?.join("\n") || ""}
                    onChange={e => updateNewBrandAudiencePsychographics("objections", e.target.value)}
                    placeholder="Beneran bisa dipakai pemula?&#10;Ada jaminan kepuasan?..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PENAWARAN (OFFER) */}
          {modalBrandTab === "offer" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Janji Brand (Brand Promise)
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.offerPromise?.brandPromise || ""}
                    onChange={e =>
                      setNewBrandForm(p => ({
                        ...p,
                        offerPromise: { ...p.offerPromise, brandPromise: e.target.value }
                      }))
                    }
                    placeholder="Contoh: Konten berkualitas tanpa stres mingguan"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Garansi / Risk Reversal
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.offerPromise?.guarantee || ""}
                    onChange={e =>
                      setNewBrandForm(p => ({
                        ...p,
                        offerPromise: { ...p.offerPromise, guarantee: e.target.value }
                      }))
                    }
                    placeholder="Contoh: 14 hari pengembalian uang tanpa syarat"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183127] mb-1">
                  Bukti Nyata (Social Proof & Bukti Keberhasilan)
                </label>
                <textarea
                  rows={3}
                  value={newBrandForm.offerPromise?.socialProofPoints?.join("\n") || ""}
                  onChange={e =>
                    setNewBrandForm(p => ({
                      ...p,
                      offerPromise: {
                        ...p.offerPromise,
                        socialProofPoints: e.target.value.split("\n").filter(Boolean)
                      }
                    }))
                  }
                  placeholder="Contoh:&#10;Digunakan 2.400+ tim bisnis di 18 kota&#10;Rating 4.9/5 dari 350 ulasan terverifikasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cbd8cb] text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 5: PERSONALITY & VOICE */}
          {modalBrandTab === "personality" && (
            <div className="space-y-5 animate-in fade-in">
              {/* Tone Voice Spectrum */}
              <div className="p-4 bg-[#f7f9f6] rounded-2xl border border-[#dce5db] space-y-4">
                <div className="font-bold text-xs text-[#183127] font-heading">
                  Spektrum Karakter Suara Brand (1 - 5)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#485c50] mb-1">
                      <span>Formal & Korporat</span>
                      <span>Santai & Akrab</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={newBrandForm.personalityVoice?.spectrum?.formalToCasual || 3}
                      onChange={e => updateNewBrandVoiceSpectrum("formalToCasual", Number(e.target.value))}
                      className="w-full accent-[#205c49] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#485c50] mb-1">
                      <span>Serius & Edukatif</span>
                      <span>Lucu & Humoris</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={newBrandForm.personalityVoice?.spectrum?.seriousToPlayful || 3}
                      onChange={e => updateNewBrandVoiceSpectrum("seriousToPlayful", Number(e.target.value))}
                      className="w-full accent-[#205c49] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Gaya yang Dianjurkan (Voice DO)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.personalityVoice?.voiceDo?.join("\n") || ""}
                    onChange={e => updateNewBrandVoiceArray("voiceDo", e.target.value)}
                    placeholder="Satu per baris:&#10;Gunakan analogi sederhana&#10;Tunjukkan empati nyata&#10;Panggil 'Teman Kopi'"
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 text-xs bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    Gaya yang Dilarang (Voice DON'T)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.personalityVoice?.voiceDont?.join("\n") || ""}
                    onChange={e => updateNewBrandVoiceArray("voiceDont", e.target.value)}
                    placeholder="Satu per baris:&#10;Jangan gunakan jargon teknis berlebihan&#10;Jangan menggurui audiens&#10;Jangan hard-selling kasar"
                    className="w-full px-3.5 py-2 rounded-xl border border-rose-300 text-xs bg-rose-50/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kata Khas / Signature Words
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.personalityVoice?.signatureWords?.join(", ") || ""}
                    onChange={e =>
                      setNewBrandForm(p => ({
                        ...p,
                        personalityVoice: {
                          ...p.personalityVoice,
                          signatureWords: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                        }
                      }))
                    }
                    placeholder="Pisahkan koma: Kopi Asli, Seduh Cerita, Rasa Nyata"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Kata Terlarang (Forbidden Words)
                  </label>
                  <input
                    type="text"
                    value={newBrandForm.personalityVoice?.forbiddenWords?.join(", ") || ""}
                    onChange={e =>
                      setNewBrandForm(p => ({
                        ...p,
                        personalityVoice: {
                          ...p.personalityVoice,
                          forbiddenWords: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                        }
                      }))
                    }
                    placeholder="Pisahkan koma: Murahan, Kaleng-kaleng, Dijamin Kaya"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTENT DNA & PILAR */}
          {modalBrandTab === "content" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Pilar Konten Utama (Satu per baris)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.pillars?.join("\n") || ""}
                    onChange={e => updateNewBrandRoot("pillars", e.target.value.split("\n").filter(Boolean))}
                    placeholder="Contoh:&#10;Edukasi & Tips&#10;Behind the Scenes&#10;Cerita Pelanggan&#10;Penawaran & Promo"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#183127] mb-1">
                    Variasi Call To Action (CTA Utama)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.contentDNA?.ctaBank?.join("\n") || newBrandForm.cta || ""}
                    onChange={e => {
                      const lines = e.target.value.split("\n").filter(Boolean);
                      setNewBrandForm(p => ({
                        ...p,
                        cta: e.target.value,
                        contentDNA: { ...p.contentDNA, ctaBank: lines }
                      }));
                    }}
                    placeholder="Contoh:&#10;Komentar 'MAU' untuk dapat resep&#10;Klik link di bio untuk order&#10;Bagikan ke teman ngopi Anda"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                  />
                </div>
              </div>

              {/* Akun Media Sosial Terhubung */}
              <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#dce5db] space-y-3">
                <div className="font-bold text-xs text-[#183127] font-heading flex items-center justify-between">
                  <span>Nama Akun Media Sosial Brand</span>
                  <span className="text-[10px] text-[#697d70] font-normal">
                    Otomatis mengisi kolom "Akun Target" di kalender konten
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      Instagram Handle:
                    </label>
                    <input
                      type="text"
                      value={newBrandForm.platformAccounts?.instagram || newBrandForm.instagramHandle || ""}
                      onChange={e => updateNewBrandPlatformAccount('instagram', e.target.value)}
                      placeholder="@kopinusantara"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      TikTok Handle:
                    </label>
                    <input
                      type="text"
                      value={newBrandForm.platformAccounts?.tiktok || ""}
                      onChange={e => updateNewBrandPlatformAccount('tiktok', e.target.value)}
                      placeholder="@kopinusantara.id"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      Threads Handle:
                    </label>
                    <input
                      type="text"
                      value={newBrandForm.platformAccounts?.threads || ""}
                      onChange={e => updateNewBrandPlatformAccount('threads', e.target.value)}
                      placeholder="@kopinusantara"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      LinkedIn Company:
                    </label>
                    <input
                      type="text"
                      value={newBrandForm.platformAccounts?.linkedin || ""}
                      onChange={e => updateNewBrandPlatformAccount('linkedin', e.target.value)}
                      placeholder="Kopi Nusantara Group"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      YouTube Channel:
                    </label>
                    <input
                      type="text"
                      value={newBrandForm.platformAccounts?.youtube || ""}
                      onChange={e => updateNewBrandPlatformAccount('youtube', e.target.value)}
                      placeholder="@KopiNusantaraOfficial"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3d5345] mb-1">
                      Facebook Page:
                    </label>
                    <input
                      type="text"
                      value={newBrandForm.platformAccounts?.facebook || ""}
                      onChange={e => updateNewBrandPlatformAccount('facebook', e.target.value)}
                      placeholder="Kopi Nusantara ID"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#cbd8cb] bg-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRAND MEMORY & GUARDRAILS */}
          {modalBrandTab === "memory" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Selalu Katakan (Always Say)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.brandMemory?.alwaysSay?.join("\n") || ""}
                    onChange={e => updateNewBrandMemoryArray("alwaysSay", e.target.value)}
                    placeholder="Satu per baris:&#10;Biji kopi 100% lokal nusantara&#10;Dipanggang segar tiap hari"
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 text-xs bg-emerald-50/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    Jangan Pernah Katakan (Never Say)
                  </label>
                  <textarea
                    rows={4}
                    value={newBrandForm.brandMemory?.neverSay?.join("\n") || ""}
                    onChange={e => updateNewBrandMemoryArray("neverSay", e.target.value)}
                    placeholder="Satu per baris:&#10;Kopi sachet instan&#10;Menjatuhkan petani lokal"
                    className="w-full px-3.5 py-2 rounded-xl border border-rose-300 text-xs bg-rose-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#183127] mb-1">
                  Batasan Klaim (Claims Guardrail Dilarang)
                </label>
                <textarea
                  rows={3}
                  value={newBrandForm.brandMemory?.claimsGuardrail?.forbidden?.join("\n") || ""}
                  onChange={e => updateNewBrandClaimsArray("forbidden", e.target.value)}
                  placeholder="Contoh:&#10;Dilarang klaim mengobati penyakit&#10;Dilarang menjanjikan omset pasti naik"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 8: ACUAN BEBAS (CUSTOM DIRECTIVES & BLOK) */}
          {modalBrandTab === "custom" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-[#f8faf7] rounded-2xl border border-[#dce5db] space-y-3">
                <div className="font-bold text-xs text-[#183127] font-heading">
                  Instruksi Wajib Khusus AI (Directives)
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDirective}
                    onChange={e => setNewDirective(e.target.value)}
                    placeholder="Ketik aturan khusus (contoh: Selalu sertakan 3 hashtag brand di akhir caption)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#cbd8cb] text-xs outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => addDirective()}
                    className="px-4 py-2 rounded-xl bg-[#205c49] text-white text-xs font-bold hover:bg-[#184738] transition-all cursor-pointer shadow-xs"
                  >
                    Tambah
                  </button>
                </div>

                <div className="space-y-1.5 mt-2">
                  {(newBrandForm.customDirectives || []).map((dir, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#dce4db] flex items-center justify-between text-xs"
                    >
                      <span className="text-[#1c3327]">{dir}</span>
                      <button
                        type="button"
                        onClick={() => removeDirective(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!newBrandForm.customDirectives || newBrandForm.customDirectives.length === 0) && (
                    <p className="text-[11px] text-[#718476] italic">Belum ada instruksi khusus tambahan.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AI INSPECTOR (LIVE PROMPT) */}
          {modalBrandTab === "inspector" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#183127] font-heading">
                    Live System Prompt Brand Brain
                  </h4>
                  <p className="text-[11px] text-[#697d70]">
                    Inilah teks terstruktur yang otomatis disuntikkan ke Gemini AI setiap kali membuat konten.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="px-3 py-1.5 rounded-xl border border-[#cbd8cb] bg-white text-xs font-semibold text-[#304538] hover:bg-[#f6faf4] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#205c49]" />
                    <span>{copiedPrompt ? "Tersalin!" : "Salin Prompt"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPrompt}
                    className="px-3 py-1.5 rounded-xl bg-[#205c49] text-white text-xs font-bold hover:bg-[#184738] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .md</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#14261f] text-emerald-100 font-mono text-[11px] leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-wrap select-text border border-black/20 shadow-inner">
                {compileBrandBrainPrompt(newBrandForm)}
              </div>
            </div>
          )}
        </form>
              </div>

              </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 bg-[#f7f9f6] border-t border-[#edf1eb] flex items-center justify-between gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsNewProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#dce4db] text-[#52665b] font-semibold hover:bg-white transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isCreatingAiProfile || !quickBrandName.trim()}
                onClick={handleSaveCreatedProfile}
                className="px-6 py-2.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Buat Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      {content}
    </div>
  );
};
