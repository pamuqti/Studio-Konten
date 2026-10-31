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
import { extractBrandBrainAi, expandCustomBlockAi } from '../services/gemini';
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
  const [profileViewMode, setProfileViewMode] = useState<'editor' | 'manage'>('editor');
  const [showAiBox, setShowAiBox] = useState(true);
  const [rawExtractText, setRawExtractText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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
      setUploadedFileName(null);
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
      onNotify?.("Ketik cerita brand, produk, atau tempel profil bisnis Anda terlebih dahulu.", "info");
      return;
    }
    setIsExtracting(true);
    try {
      const res = await extractBrandBrainAi(rawExtractText);
      setData(prev => ({
        ...prev,
        ...res.brand,
        color: res.brand.color || prev.color || "#205c49"
      }));
      setAnalysisNote(res.analysisSummary || "Brand Brain berhasil diekstrak dan diintegrasikan!");
      onNotify?.(`Brand Brain "${res.brand.name || "Brand"}" berhasil diekstrak!`, "success");
    } catch (e: any) {
      onNotify?.(e.message || "Gagal mengekstrak profil brand.", "error");
    } finally {
      setIsExtracting(false);
    }
  };

  // Import JSON / Markdown file
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileNameLower = file.name.toLowerCase();
    const isMarkdown = fileNameLower.endsWith(".md") || fileNameLower.endsWith(".markdown") || fileNameLower.endsWith(".txt");
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target?.result as string;
        if (isMarkdown) {
          setRawExtractText(text);
          setUploadedFileName(file.name);
          setShowAiBox(true);
          onNotify?.(`File "${file.name}" dimuat! Klik 'Ekstrak Brand Brain via AI' untuk memetakan isinya ke semua kolom.`, "info");
        } else {
          const parsed = JSON.parse(text);
          const importedBrand = parsed.brand || parsed.data || parsed;
          setData(prev => ({
            ...prev,
            ...importedBrand
          }));
          setUploadedFileName(file.name);
          onNotify?.(`Brand Brain "${importedBrand.name || file.name}" berhasil diimpor!`, "success");
        }
      } catch (err: any) {
        onNotify?.(err.message || "Gagal membaca file.", "error");
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

  const getTabsForBrand = (p: BrandBrain) => [
    {
      id: "foundation",
      icon: "🏛️",
      label: "Fondasi",
      sub: "Positioning",
      field: "positioning",
      hasVal: !!p.positioning?.statement
    },
    {
      id: "market",
      icon: "⚔️",
      label: "Kompetitor",
      sub: "Rival & Pasar",
      field: "competitorContext",
      hasVal: !!p.competitorContext?.directCompetitors?.length
    },
    {
      id: "audience",
      icon: "🎯",
      label: "Audience DNA",
      sub: "Pain & Persona",
      field: "audienceDNA",
      hasVal: !!p.audienceDNA?.psychographics?.painPoints?.length
    },
    {
      id: "offer",
      icon: "💎",
      label: "Penawaran",
      sub: "Bukti & Garansi",
      field: "offerConversionDNA",
      hasVal: !!p.offerConversionDNA?.mainOffer
    },
    {
      id: "personality",
      icon: "🎭",
      label: "Karakter & Gaya",
      sub: "Voice & Visual",
      field: "personalityVoice",
      hasVal: !!p.personalityVoice?.humanPersona
    },
    {
      id: "content",
      icon: "📊",
      label: "Content DNA",
      sub: "Pilar & CTA",
      field: "contentDNA",
      hasVal: !!p.contentDNA?.pillars?.length
    },
    {
      id: "memory",
      icon: "🧠",
      label: "Brand Memory",
      sub: "Guardrails",
      field: "brandMemory",
      hasVal: !!p.brandMemory?.alwaysSay?.length
    },
    {
      id: "custom",
      icon: "🧩",
      label: "Acuan Bebas",
      sub: "Blok & Aturan",
      field: "customBlocks",
      hasVal: !!(
        (p.customBlocks && p.customBlocks.length > 0) ||
        (p.customDirectives && p.customDirectives.length > 0) ||
        p.customKnowledge
      )
    },
    {
      id: "inspector",
      icon: "👁️",
      label: "AI Inspector",
      sub: "Live Prompt",
      field: "aiPersonaInstructions",
      hasVal: !!(p.aiPersonaInstructions || p.positioning?.statement)
    },
    {
      id: "export",
      icon: "📤",
      label: "Export",
      sub: "Form Ekspor",
      field: "__export",
      hasVal: !!p.name
    }
  ];

  const renderBrandTabs = (
    p: BrandBrain,
    setP: React.Dispatch<React.SetStateAction<BrandBrain>>,
    currentTab: string,
    setCurrentTab: (t: string) => void,
    formId: string,
    onFormSubmit: (e: React.FormEvent) => void
  ) => {
    const tabList = getTabsForBrand(p);

    const se = (field: string, hasVal: boolean) => {
      const status = p.fieldStatus?.[field] || (hasVal ? "confirmed" : "missing");
      if (status === "confirmed" || (hasVal && !p.fieldStatus?.[field])) {
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CircleCheck className="w-3 h-3" />
            <span>Terkonfirmasi</span>
          </span>
        );
      }
      if (status === "ai_suggested") {
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Saran AI</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          <CircleAlert className="w-3 h-3" />
          <span>Perlu Diisi</span>
        </span>
      );
    };

    const ke = (field: keyof BrandBrain, val: any) => {
      setP(J => ({
        ...J,
        [field]: val,
        fieldStatus: { ...(J.fieldStatus || {}), [field]: "confirmed" }
      }));
    };

    const xe = (field: string, val: string) => {
      setP(J => {
        const me = { ...(J.positioning || {}), [field]: val };
        const qe = `${J.name || "Brand"} adalah ${me.weAre || "solusi"} untuk ${me.forAudience || "audiens"} yang butuh ${me.whoNeed || "jawaban"}, karena ${me.becauseWhy || "teruji"}, berbeda dari ${me.unlike || "alternatif lain"}.`;
        return {
          ...J,
          positioning: {
            ...me,
            statement: me.statement && field !== "statement" ? qe : me.statement || qe
          }
        };
      });
    };

    const z = (field: string, val: string) => {
      setP(J => ({
        ...J,
        audienceDNA: {
          ...(J.audienceDNA || {}),
          demographics: { ...(J.audienceDNA?.demographics || {}), [field]: val }
        }
      }));
    };

    const E = (field: "painPoints" | "desires" | "fears" | "objections", val: string) => {
      const arr = val.split("\n").map(s => s.trim()).filter(Boolean);
      setP(me => ({
        ...me,
        audienceDNA: {
          ...(me.audienceDNA || {}),
          psychographics: { ...(me.audienceDNA?.psychographics || {}), [field]: arr }
        }
      }));
    };

    const L = (field: string, val: number) => {
      setP(J => ({
        ...J,
        personalityVoice: {
          ...(J.personalityVoice || {}),
          spectrum: { ...(J.personalityVoice?.spectrum || {}), [field]: val }
        }
      }));
    };

    const P = (field: "voiceDo" | "voiceDont" | "signatureWords" | "forbiddenWords", val: string) => {
      const arr = val.split("\n").map(s => s.trim()).filter(Boolean);
      setP(me => ({
        ...me,
        personalityVoice: { ...(me.personalityVoice || {}), [field]: arr }
      }));
    };

    const ae = (field: "alwaysSay" | "neverSay", val: string) => {
      const arr = val.split("\n").map(s => s.trim()).filter(Boolean);
      setP(me => ({
        ...me,
        brandMemory: { ...(me.brandMemory || {}), [field]: arr }
      }));
    };

    const Ne = (field: "allowed" | "forbidden", val: string) => {
      const arr = val.split("\n").map(s => s.trim()).filter(Boolean);
      setP(me => ({
        ...me,
        brandMemory: {
          ...(me.brandMemory || {}),
          claimsGuardrail: { ...(me.brandMemory?.claimsGuardrail || {}), [field]: arr }
        }
      }));
    };

    const Te = (field: string, val: any) => {
      setP(J => ({
        ...J,
        competitorContext: { ...(J.competitorContext || {}), [field]: val },
        fieldStatus: { ...(J.fieldStatus || {}), competitorContext: "confirmed" }
      }));
    };

    const Ce = (field: string, val: any) => {
      setP(J => ({
        ...J,
        offerConversionDNA: { ...(J.offerConversionDNA || {}), [field]: val },
        fieldStatus: { ...(J.fieldStatus || {}), offerConversionDNA: "confirmed" }
      }));
    };

    const k = (field: string, val: any) => {
      setP(J => ({
        ...J,
        proofCredibility: { ...(J.proofCredibility || {}), [field]: val },
        fieldStatus: { ...(J.fieldStatus || {}), proofCredibility: "confirmed" }
      }));
    };

    const Y = (field: string, val: any) => {
      setP(J => ({
        ...J,
        visualDNA: { ...(J.visualDNA || {}), [field]: val },
        fieldStatus: { ...(J.fieldStatus || {}), visualDNA: "confirmed" }
      }));
    };

    const pe = (platformKey: string, val: string) => {
      setP(J => {
        const me = { ...(J.platformAccounts || {}), [platformKey]: val };
        return {
          ...J,
          platformAccounts: me,
          instagramHandle: platformKey === "instagram" ? val : J.instagramHandle
        };
      });
    };

    const ge = (val?: string) => {
      const text = (val || newDirective).trim();
      if (!text) return;
      setP(J => ({ ...J, customDirectives: [...(J.customDirectives || []), text] }));
      setNewDirective("");
    };

    const ee = (idx: number) => {
      setP(N => ({
        ...N,
        customDirectives: (N.customDirectives || []).filter((_, me) => me !== idx)
      }));
    };

    const re = (idx: number, val: string) => {
      setP(J => {
        const me = [...(J.customDirectives || [])];
        me[idx] = val;
        return { ...J, customDirectives: me };
      });
    };

    const Ae = (cat: string = "Aturan Wajib AI") => {
      const blk = createDefaultBlock(cat);
      setP(J => ({ ...J, customBlocks: [blk, ...(J.customBlocks || [])] }));
    };

    const ue = (id: string) => {
      setP(N => ({
        ...N,
        customBlocks: (N.customBlocks || []).map(J =>
          J.id === id ? { ...J, isActive: !J.isActive } : J
        )
      }));
    };

    const we = (id: string, updates: Partial<CustomKnowledgeBlock>) => {
      setP(J => ({
        ...J,
        customBlocks: (J.customBlocks || []).map(me =>
          me.id === id ? { ...me, ...updates, updatedAt: new Date().toISOString() } : me
        )
      }));
    };

    const da = (id: string) => {
      setP(N => ({
        ...N,
        customBlocks: (N.customBlocks || []).filter(J => J.id !== id)
      }));
    };

    const he = async (blk: CustomKnowledgeBlock) => {
      setExpandingBlockId(blk.id);
      try {
        const expanded = await expandCustomBlockAi(blk.title, blk.category, blk.content, p);
        if (expanded) {
          we(blk.id, { content: expanded });
          onNotify?.("✨ Blok acuan berhasil diperinci dan disempurnakan via AI!", "success");
        }
      } catch (err) {
        console.error("Failed to expand block with AI:", err);
        onNotify?.("Gagal mengembangkan blok via AI. Pastikan API Key aktif.", "error");
      } finally {
        setExpandingBlockId(null);
      }
    };

    const Se = () => {
      const text = compileBrandBrainPrompt(p);
      copyToClipboard(text).then(ok => {
        if (ok) {
          setCopiedPrompt(true);
          setTimeout(() => setCopiedPrompt(false), 2000);
          onNotify?.("Seluruh teks acuan Brand Brain berhasil disalin!", "success");
        }
      });
    };

    const M = () => {
      const text = compileBrandBrainPrompt(p);
      downloadFile(`${p.name || "Brand"}-Brain-Prompt.md`, text, "text/markdown;charset=utf-8");
      onNotify?.("File Markdown acuan berhasil diunduh!", "success");
    };

    const compiledPromptText = compileBrandBrainPrompt(p);

    return (
      <>
        {/* Tab Navigation */}
        <div className="border-b border-[#eae6f3] bg-[#f8f6f1] p-3 sm:px-5 select-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 bbx-grid10 gap-1.5 sm:gap-2">
            {tabList.map(f => {
              const N = currentTab === f.id;
              const J = p.fieldStatus?.[f.field];
              const me = f.hasVal || J === "confirmed";
              const qe = J === "ai_suggested";
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCurrentTab(f.id)}
                  className={`py-2.5 px-2.5 sm:px-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between gap-1.5 ${
                    N
                      ? "bg-[#1b152c] text-white border-[#1b152c] shadow-sm"
                      : "bg-[#f8f7fc] border-[#eae6f3] text-[#736c87] hover:bg-[#f4f1fa] hover:text-[#1b152c] hover:border-[#d7d0eb]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-sm shrink-0">{f.icon}</span>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        me ? "bg-emerald-500" : qe ? "bg-amber-500 animate-pulse" : "bg-rose-400"
                      }`}
                      title={me ? "Terkonfirmasi / Terisi" : qe ? "Saran AI" : "Perlu Diisi"}
                    />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs truncate ${
                        N ? "font-bold text-white" : "font-semibold text-[#1b152c]"
                      }`}
                    >
                      {f.label}
                    </div>
                    <div
                      className={`text-[10px] truncate leading-tight ${N ? "text-[#c4b5fd]" : "text-[#736c87]"}`}
                    >
                      {f.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <form
          id={formId}
          onSubmit={onFormSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6"
        >
          {/* TAB 1: FONDASI */}
          {currentTab === "foundation" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Identitas Inti Brand</span>
                  {se("foundation", !!(p.name && p.product))}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Nama Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={p.name}
                      onChange={f => ke("name", f.target.value)}
                      placeholder="cth: Trajecto"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Kategori / Industri
                    </label>
                    <input
                      type="text"
                      value={p.category || ""}
                      onChange={f => ke("category", f.target.value)}
                      placeholder="cth: Aplikasi Produktivitas / SaaS"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Website / Link Bio
                    </label>
                    <input
                      type="text"
                      value={p.website || ""}
                      onChange={f => ke("website", f.target.value)}
                      placeholder="https://trajecto.web.app"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#dce6dc] bg-[#f8fbf8] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-[#1b152c] flex items-center gap-1.5">
                      <span>Akun Platform Resmi Brand</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e8f1e9] text-[#6c43e3] border border-[#eae6f3]">
                        Acuan Kalender Konten
                      </span>
                    </span>
                    <span className="text-[10px] text-[#736c87]">
                      Digunakan untuk alokasi otomatis postingan per akun
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1b152c] mb-1 flex items-center gap-1">
                        <span>📸 Instagram</span>
                      </label>
                      <input
                        type="text"
                        value={p.platformAccounts?.instagram || p.instagramHandle || ""}
                        onChange={f => pe("instagram", f.target.value)}
                        placeholder="@trajecto.app"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae6f3] bg-white text-xs outline-none focus:border-[#205c49]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1b152c] mb-1 flex items-center gap-1">
                        <span>🎵 TikTok</span>
                      </label>
                      <input
                        type="text"
                        value={p.platformAccounts?.tiktok || ""}
                        onChange={f => pe("tiktok", f.target.value)}
                        placeholder="@trajecto.id"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae6f3] bg-white text-xs outline-none focus:border-[#205c49]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1b152c] mb-1 flex items-center gap-1">
                        <span>🧵 Threads / X</span>
                      </label>
                      <input
                        type="text"
                        value={p.platformAccounts?.threads || ""}
                        onChange={f => pe("threads", f.target.value)}
                        placeholder="@trajecto.app"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae6f3] bg-white text-xs outline-none focus:border-[#205c49]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1b152c] mb-1 flex items-center gap-1">
                        <span>💼 LinkedIn</span>
                      </label>
                      <input
                        type="text"
                        value={p.platformAccounts?.linkedin || ""}
                        onChange={f => pe("linkedin", f.target.value)}
                        placeholder="company/trajecto"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae6f3] bg-white text-xs outline-none focus:border-[#205c49]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1b152c] mb-1 flex items-center gap-1">
                        <span>▶️ YouTube</span>
                      </label>
                      <input
                        type="text"
                        value={p.platformAccounts?.youtube || ""}
                        onChange={f => pe("youtube", f.target.value)}
                        placeholder="@trajecto-app"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae6f3] bg-white text-xs outline-none focus:border-[#205c49]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1b152c] mb-1 flex items-center gap-1">
                        <span>👥 Facebook Page</span>
                      </label>
                      <input
                        type="text"
                        value={p.platformAccounts?.facebook || ""}
                        onChange={f => pe("facebook", f.target.value)}
                        placeholder="TrajectoOfficial"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#eae6f3] bg-white text-xs outline-none focus:border-[#205c49]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                    Produk / Layanan Utama
                  </label>
                  <input
                    type="text"
                    value={p.product}
                    onChange={f => ke("product", f.target.value)}
                    placeholder="cth: All-in-One Personal Productivity, Time-Blocking & Agile Focus Operating System"
                    className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1b152c] mb-1 flex items-center justify-between flex-wrap gap-1">
                    <span>Brand Promise (Janji Nyata Brand)</span>
                    <span className="text-[10px] text-[#736c87] font-normal">
                      Membantu [Audience] melakukan [Hasil] tanpa [Hambatan]
                    </span>
                  </label>
                  <textarea
                    rows={2}
                    value={p.brandPromise || ""}
                    onChange={f => ke("brandPromise", f.target.value)}
                    placeholder="cth: Membantu freelancer menyelesaikan kerjaan prioritas sebelum jam 5 sore tanpa stres dan tanpa terjebak siklus bikin template berjam-jam."
                    className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Warna Identitas (Primary Hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={p.color || "#205c49"}
                        onChange={f => ke("color", f.target.value)}
                        className="w-9 h-9 rounded-xl border border-[#d6dfd5] cursor-pointer p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={p.color || "#205c49"}
                        onChange={f => ke("color", f.target.value)}
                        className="w-28 px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Website / Landing Page
                    </label>
                    <input
                      type="url"
                      value={p.website || ""}
                      onChange={f => ke("website", f.target.value)}
                      placeholder="https://trajecto.web.app"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Positioning Framework (Wajib Pembeda)</span>
                  {se("positioning", !!p.positioning?.statement)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      We Are (Apa sebenarnya brand ini?)
                    </label>
                    <input
                      type="text"
                      value={p.positioning?.weAre || ""}
                      onChange={f => xe("weAre", f.target.value)}
                      placeholder="cth: Personal Agile Focus Operating System"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      For (Siapa target utamanya?)
                    </label>
                    <input
                      type="text"
                      value={p.positioning?.forAudience || ""}
                      onChange={f => xe("forAudience", f.target.value)}
                      placeholder="cth: Freelancer & solo founder yang to-do list-nya menumpuk"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Who Need (Masalah apa yang mereka punya?)
                    </label>
                    <input
                      type="text"
                      value={p.positioning?.whoNeed || ""}
                      onChange={f => xe("whoNeed", f.target.value)}
                      placeholder="cth: Sistem kerja harian yang membatasi overload dan memicu eksekusi nyata"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Because (Kenapa harus percaya / Bukti?)
                    </label>
                    <input
                      type="text"
                      value={p.positioning?.becauseWhy || ""}
                      onChange={f => xe("becauseWhy", f.target.value)}
                      placeholder="cth: Metode Agile Sprint 1-hari dan visual time-blocking interaktif langsung di browser"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                    Unlike (Apa perbedaan dengan alternatif / kompetitor yang dihindari?)
                  </label>
                  <input
                    type="text"
                    value={p.positioning?.unlike || ""}
                    onChange={f => xe("unlike", f.target.value)}
                    placeholder="cth: Notion yang makan waktu seharian buat setup template atau to-do list pasif yang bikin stres"
                    className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>
                <div className="p-3.5 rounded-xl bg-[#f0f6ee] border border-[#d3e3d0] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                    Positioning Statement Otomatis untuk AI:
                  </span>
                  <p className="text-xs text-[#1c4535] font-medium leading-relaxed italic">
                    "
                    {p.positioning?.statement ||
                      "Lengkapi form di atas untuk menghasilkan positioning statement otomatis."}
                    "
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KOMPETITOR */}
          {currentTab === "market" && (
            <div className="space-y-6">
              <div className="bg-[#ecf3ea]/60 border border-[#cfe0cc] rounded-2xl p-4 text-xs text-[#245946] flex items-start gap-3">
                <Swords className="w-5 h-5 shrink-0 mt-0.5 text-[#6c43e3]" />
                <div className="leading-relaxed">
                  <p className="font-bold text-sm mb-0.5 text-[#1b152c]">
                    Fakta Lapangan & Peta Kompetisi Nyata
                  </p>
                  <p className="text-[#3d6554]">
                    Strategi bukan onani konsep di atas kertas. AI butuh tahu persis siapa lawan di lapangan, apa kebiasaan alternatif konsumen, dan apa kelemahan kompetitor agar konten Anda menusuk tepat di rasa frustrasi pasar.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Pemetaan Lawan & Alternatif di Lapangan</span>
                  {se("competitorContext", !!p.competitorContext?.directCompetitors?.length)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Kompetitor Langsung (1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.competitorContext?.directCompetitors || []).join("\n")}
                      onChange={f =>
                        Te(
                          "directCompetitors",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"Notion\nClickUp\nSunsama"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                    <p className="text-[10px] text-[#728378] mt-1">
                      Brand yang biasa dibandingkan langsung oleh prospek sebelum membeli.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Alternatif Substitusi Saat Ini (1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.competitorContext?.indirectCompetitors || []).join("\n")}
                      onChange={f =>
                        Te(
                          "indirectCompetitors",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"Buku catatan kertas (bullet journal)\nGoogle Calendar kosongan\nKirim chat WhatsApp ke nomor sendiri"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                    <p className="text-[10px] text-[#728378] mt-1">
                      Kebiasaan lama atau 'cara gratisan' yang sekarang masih mereka pakai.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Celah Pasar & Pagar Pembeda (Differentiator Reality)</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Kelemahan Kompetitor / Rasa Frustrasi Konsumen di Lapangan
                    </label>
                    <textarea
                      rows={3}
                      value={p.competitorContext?.competitorWeakness || ""}
                      onChange={f => Te("competitorWeakness", f.target.value)}
                      placeholder="Cth: Notion & ClickUp terlalu lambat dan rumit (feature bloatware), butuh waktu belajar berjam-jam sehingga memicu productive procrastination. Sunsama terlalu mahal (US$20/bln) dan wajib kartu kredit luar negeri."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                    <p className="text-[10px] text-[#728378] mt-1">
                      Kekecewaan riil yang sering diungkapkan pelanggan kompetitor di forum atau kolom review.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 mb-1">
                      Hal yang Dilakukan Kompetitor tapi HARAM Ditiru oleh Brand Kita (1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.competitorContext?.whatWeWillNeverDo || []).join("\n")}
                      onChange={f =>
                        Te(
                          "whatWeWillNeverDo",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"Jangan pernah meminta user setting database relasional atau bikin template dari nol\nJangan pernah memasang paywall mahal sebelum user merasakan manfaat sprint 1 hari\nJangan pernah membuat UI kaku yang terasa seperti dashboard korporat"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                    />
                    <p className="text-[10px] text-rose-700 mt-1">
                      Pagar kreatif agar konten AI tidak menjiplak gaya atau jebakan klise pemain lama.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIENCE DNA */}
          {currentTab === "audience" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Demografi & Persona Primer</span>
                  {se("audienceDNA", !!p.audienceDNA?.demographics?.age)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Rentang Usia
                    </label>
                    <input
                      type="text"
                      value={p.audienceDNA?.demographics?.age || ""}
                      onChange={f => z("age", f.target.value)}
                      placeholder="cth: 22 - 35 tahun"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Pekerjaan / Profesi
                    </label>
                    <input
                      type="text"
                      value={p.audienceDNA?.demographics?.occupation || ""}
                      onChange={f => z("occupation", f.target.value)}
                      placeholder="cth: Freelancer, Desainer, Software Engineer"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Lifestyle & Kebiasaan
                    </label>
                    <input
                      type="text"
                      value={p.audienceDNA?.demographics?.lifestyle || ""}
                      onChange={f => z("lifestyle", f.target.value)}
                      placeholder="cth: WFH, sering ke coffee shop, tech-savvy"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                    Ringkasan Audiens (Backwards-Compatible)
                  </label>
                  <input
                    type="text"
                    value={p.audience}
                    onChange={f => ke("audience", f.target.value)}
                    placeholder="cth: Freelancer, remote worker, dan solopreneur yang burnout karena to-do list menumpuk"
                    className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Psikografis Mendalam (Bahan Bakar Hook AI)</span>
                  {se("audienceDNA", !!p.audienceDNA?.psychographics?.painPoints?.length)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 mb-1">
                      Pain Points / Frustrasi (1 per baris)
                    </label>
                    <textarea
                      rows={4}
                      value={(p.audienceDNA?.psychographics?.painPoints || []).join("\n")}
                      onChange={f => E("painPoints", f.target.value)}
                      placeholder={"To-do list puluhan item bikin cemas\nHabis waktu berjam-jam bikin dashboard Notion estetik\nTidur malam dengan rasa bersalah"}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Desires / Impian Terbesar (1 per baris)
                    </label>
                    <textarea
                      rows={4}
                      value={(p.audienceDNA?.psychographics?.desires || []).join("\n")}
                      onChange={f => E("desires", f.target.value)}
                      placeholder={"Tutup laptop jam 5 sore dengan tenang\nHanya fokus 2-3 tugas bernilai tinggi\nSistem kerja langsung jalan tanpa setup"}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/20 text-xs focus:ring-2 focus:ring-emerald-500/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      Objections / Keraguan Beli (1 per baris)
                    </label>
                    <textarea
                      rows={4}
                      value={(p.audienceDNA?.psychographics?.objections || []).join("\n")}
                      onChange={f => E("objections", f.target.value)}
                      placeholder={"Paling ribet setup lagi kayak tool lain\nBiaya langganan mahal dollar kartu kredit\nTakut dianggurin lagi setelah beli"}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/20 text-xs focus:ring-2 focus:ring-amber-500/30 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Scroll Stoppers (Apa yang bikin mereka berhenti scrolling?)
                    </label>
                    <input
                      type="text"
                      value={p.audienceDNA?.contentBehavior?.scrollStoppers || ""}
                      onChange={f =>
                        setP(N => ({
                          ...N,
                          audienceDNA: {
                            ...(N.audienceDNA || {}),
                            contentBehavior: {
                              ...(N.audienceDNA?.contentBehavior || {}),
                              scrollStoppers: f.target.value
                            }
                          }
                        }))
                      }
                      placeholder="cth: Pengakuan jujur productive procrastination, perbandingan Notion vs realita"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Comment Triggers (Apa yang memicu mereka komentar/debat?)
                    </label>
                    <input
                      type="text"
                      value={p.audienceDNA?.contentBehavior?.commentTriggers || ""}
                      onChange={f =>
                        setP(N => ({
                          ...N,
                          audienceDNA: {
                            ...(N.audienceDNA || {}),
                            contentBehavior: {
                              ...(N.audienceDNA?.contentBehavior || {}),
                              commentTriggers: f.target.value
                            }
                          }
                        }))
                      }
                      placeholder="cth: Debat to-do list vs time-blocking, curhat jam kerja freelancer yang kacau"
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PENAWARAN */}
          {currentTab === "offer" && (
            <div className="space-y-6">
              <div className="bg-[#ecf3ea]/60 border border-[#cfe0cc] rounded-2xl p-4 text-xs text-[#245946] flex items-start gap-3">
                <Gem className="w-5 h-5 shrink-0 mt-0.5 text-[#6c43e3]" />
                <div className="leading-relaxed">
                  <p className="font-bold text-sm mb-0.5 text-[#1b152c]">
                    Arsitektur Penawaran & Bukti Empiris Lapangan
                  </p>
                  <p className="text-[#3d6554]">
                    Konten tanpa penawaran konkret dan bukti lapangan hanyalah omong kosong. Data ini dipakai AI untuk menyusun hook studi kasus, mengatasi keraguan harga, dan CTA penutup yang realistis.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Detail Penawaran & Transaksi (Offer Architecture)</span>
                  {se("offerConversionDNA", !!p.offerConversionDNA?.mainOffer)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Hero Offer (Produk/Penawaran Utama)
                    </label>
                    <input
                      type="text"
                      value={p.offerConversionDNA?.mainOffer || ""}
                      onChange={f => Ce("mainOffer", f.target.value)}
                      placeholder="Cth: Trajecto Annual Pro / Lifetime License"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Entry Offer / Lead Magnet / Free Tier
                    </label>
                    <input
                      type="text"
                      value={p.offerConversionDNA?.entryOffer || ""}
                      onChange={f => Ce("entryOffer", f.target.value)}
                      placeholder="Cth: Free Web-Sprint Sandbox langsung di browser"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Rentang Harga & Model Pembayaran
                    </label>
                    <input
                      type="text"
                      value={p.offerConversionDNA?.priceRange || ""}
                      onChange={f => Ce("priceRange", f.target.value)}
                      placeholder="Cth: Gratis untuk Free Web Access • Rp 99.000/tahun untuk Cloud Sync"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Garansi & Risk Reversal (Peredam Keraguan)
                    </label>
                    <input
                      type="text"
                      value={p.offerConversionDNA?.riskReversal || ""}
                      onChange={f => Ce("riskReversal", f.target.value)}
                      placeholder="Cth: 30-Hari jaminan uang kembali 100% tanpa tanya jika tidak merasa lebih fokus"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Mekanisme Transaksi / Jalur Checkout (Purchase Path)
                    </label>
                    <input
                      type="text"
                      value={p.offerConversionDNA?.purchasePath || ""}
                      onChange={f => Ce("purchasePath", f.target.value)}
                      placeholder="Cth: Direct Web Checkout via QRIS, GoPay, ShopeePay di trajecto.web.app / Kirim DM Instagram"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Bukti Empiris & Kredibilitas di Lapangan</span>
                  {se("proofCredibility", !!p.proofCredibility?.hardProofPoints?.length)}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Bukti Keras / Data Nyata (1 per baris: angka pengguna, riset, akreditasi, rating)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.proofCredibility?.hardProofPoints || []).join("\n")}
                      onChange={f =>
                        k(
                          "hardProofPoints",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"Dipakai oleh lebih dari 1.200+ freelancer & digital nomad aktif\nRata-rata user menghemat 2,5 jam per hari dari siklus to-do list berantakan\nRating kepuasan 4.9/5 dari komunitas kreator mandiri"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Kisah Transformasi Nyata (Before & After Lapangan, 1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.proofCredibility?.caseTransformations || []).join("\n")}
                      onChange={f =>
                        k(
                          "caseTransformations",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"UI/UX Designer yang sebelumnya lembur sampai jam 2 pagi, kini konsisten tutup laptop jam 5 sore setelah membatasi 3 tugas per hari.\nSoftware engineer freelance yang berhenti terjebak 'Notion restructuring loop' dan berhasil merilis 2 side project dalam 1 bulan."}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                      Suara Asli Pelanggan (Raw Customer Voice / Kutipan Asli, 1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.proofCredibility?.customerVoiceRaw || []).join("\n")}
                      onChange={f =>
                        k(
                          "customerVoiceRaw",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"'Gue capek tiap malam ngerasa bersalah padahal seharian di depan laptop. Trajecto bikin batasan kerja gue jadi nyata.'\n'Akhirnya ada tools yang nggak nyuruh gue belajar nonton tutorial YouTube cuma buat nyatet kerjaan hari ini.'"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                    <p className="text-[10px] text-[#728378] mt-1">
                      Bahan bakar emas untuk AI merangkai hook relatable dan skenario video UGC.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KARAKTER & GAYA */}
          {currentTab === "personality" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Personifikasi & Spektrum Karakter</span>
                  {se("personalityVoice", !!p.personalityVoice?.humanPersona)}
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-[#1b152c] mb-1">
                    Jika Brand Ini Seorang Manusia, Karakter Bicaranya Seperti:
                  </label>
                  <input
                    type="text"
                    value={p.personalityVoice?.humanPersona || ""}
                    onChange={f =>
                      setP(N => ({
                        ...N,
                        personalityVoice: {
                          ...(N.personalityVoice || {}),
                          humanPersona: f.target.value
                        }
                      }))
                    }
                    placeholder="cth: Teman pintar yang santai di coffee shop: bicaranya blak-blakan jujur, nggak suka teori berbusa, fokus eksekusi."
                    className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                  />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1b152c]">
                      Spektrum Nada Bicara:
                    </span>
                    <span className="text-[11px] text-[#736c87]">
                      Geser untuk menentukan gaya bahasa AI
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]">
                      <div className="flex justify-between text-[11px] font-medium text-[#736c87] mb-1.5">
                        <span>Formal (0%)</span>
                        <span className="font-bold text-[#6c43e3] px-2 py-0.5 rounded-md bg-[#205c49]/10">
                          {p.personalityVoice?.spectrum?.formality ?? 80}% Casual
                        </span>
                        <span>Kasual (100%)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={p.personalityVoice?.spectrum?.formality ?? 80}
                        onChange={f => L("formality", Number(f.target.value))}
                        className="w-full accent-[#205c49] cursor-pointer"
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]">
                      <div className="flex justify-between text-[11px] font-medium text-[#736c87] mb-1.5">
                        <span>Serius (0%)</span>
                        <span className="font-bold text-[#6c43e3] px-2 py-0.5 rounded-md bg-[#205c49]/10">
                          {p.personalityVoice?.spectrum?.playfulness ?? 55}% Playful
                        </span>
                        <span>Ceria (100%)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={p.personalityVoice?.spectrum?.playfulness ?? 55}
                        onChange={f => L("playfulness", Number(f.target.value))}
                        className="w-full accent-[#205c49] cursor-pointer"
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]">
                      <div className="flex justify-between text-[11px] font-medium text-[#736c87] mb-1.5">
                        <span>Pakar Dingin (0%)</span>
                        <span className="font-bold text-[#6c43e3] px-2 py-0.5 rounded-md bg-[#205c49]/10">
                          {p.personalityVoice?.spectrum?.approach ?? 75}% Bersahabat
                        </span>
                        <span>Sahabat Dekat (100%)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={p.personalityVoice?.spectrum?.approach ?? 75}
                        onChange={f => L("approach", Number(f.target.value))}
                        className="w-full accent-[#205c49] cursor-pointer"
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]">
                      <div className="flex justify-between text-[11px] font-medium text-[#736c87] mb-1.5">
                        <span>Hati-hati (0%)</span>
                        <span className="font-bold text-[#6c43e3] px-2 py-0.5 rounded-md bg-[#205c49]/10">
                          {p.personalityVoice?.spectrum?.energy ?? 70}% Berani / Bold
                        </span>
                        <span>Blak-blakan (100%)</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={p.personalityVoice?.spectrum?.energy ?? 70}
                        onChange={f => L("energy", Number(f.target.value))}
                        className="w-full accent-[#205c49] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Aturan Gaya Bahasa (DO vs DON'T)</span>
                  {se("personalityVoice", !!p.personalityVoice?.voiceDo?.length)}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-200/80 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <label className="text-xs font-bold text-emerald-950">
                          DO (Aturan Wajib Diterapkan — 1 per baris)
                        </label>
                      </div>
                      <textarea
                        rows={4}
                        value={(p.personalityVoice?.voiceDo || []).join("\n")}
                        onChange={f => P("voiceDo", f.target.value)}
                        placeholder={"Gunakan bahasa Indonesia santai dan natural\nTulis kalimat pendek dan tajam\nGunakan analogi konkret situasi kerja sehari-hari"}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/30 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1.5">
                        Signature Words (Kosa Kata Khas — 1 per baris)
                      </label>
                      <textarea
                        rows={3}
                        value={(p.personalityVoice?.signatureWords || []).join("\n")}
                        onChange={f => P("signatureWords", f.target.value)}
                        placeholder={"productive procrastination\nAgile Sprint personal\neksekusi riil\nNotion fatigue"}
                        className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/30 border border-rose-200/80 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        <label className="text-xs font-bold text-rose-950">
                          DON'T (Haram Digunakan — 1 per baris)
                        </label>
                      </div>
                      <textarea
                        rows={4}
                        value={(p.personalityVoice?.voiceDont || []).join("\n")}
                        onChange={f => P("voiceDont", f.target.value)}
                        placeholder={"Jangan gunakan motivasi klise ('gapai mimpimu')\nJangan gunakan jargon korporat kaku ('sinergi menyeluruh')\nJangan hard-selling berteriak diskon murahan"}
                        className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-rose-950 mb-1.5">
                        Forbidden Words (Kata Terlarang — 1 per baris)
                      </label>
                      <textarea
                        rows={3}
                        value={(p.personalityVoice?.forbiddenWords || []).join("\n")}
                        onChange={f => P("forbiddenWords", f.target.value)}
                        placeholder={"cepat kaya\nterbukti 100% tanpa usaha\nwajib beli sekarang\nrevolusi hidup"}
                        className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>3. Arah Visual & Art Direction (Anti-Slop Guardrail)</span>
                  {se("visualDNA", !!p.visualDNA?.photographyStyle?.length)}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="p-4 rounded-2xl bg-[#fafcf9] border border-[#eae6f3] space-y-2">
                    <label className="block text-xs font-bold text-[#1b152c]">
                      Arah Fotografi & Footage Riil (1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.visualDNA?.photographyStyle || []).join("\n")}
                      onChange={f =>
                        Y(
                          "photographyStyle",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"Authentic Smartphone UGC (layar laptop di coffee shop)\nClean candid work-in-progress nyata\nScreen recording demo 10 detik to-the-point"}
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] bg-white text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                    <p className="text-[10px] text-[#728378]">
                      Dipakai sebagai acuan arahan visual pada rencana konten.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/20 border border-rose-200/80 space-y-2">
                    <label className="block text-xs font-bold text-rose-950">
                      Visual yang DILARANG / Anti-Slop (1 per baris)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.visualDNA?.visualDoNotUse || []).join("\n")}
                      onChange={f =>
                        Y(
                          "visualDoNotUse",
                          f.target.value
                            .split("\n")
                            .map(N => N.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={"Foto stok korporat kaku berjas senyum di ruang rapat\nGrafik 3D kartun generik yang tidak membumi\nTipografi kecil tidak terbaca di smartphone"}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                    />
                    <p className="text-[10px] text-rose-700">
                      Pagar agar output visual tidak terasa seperti gambar template generik.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CONTENT DNA */}
          {currentTab === "content" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Pilar Konten & Alokasi Persentase</span>
                  {se("contentDNA", !!p.contentDNA?.pillars?.length)}
                </h3>
                <div className="space-y-3">
                  {(
                    p.contentDNA?.pillars || [
                      {
                        name: "Edukasi & Bongkar Mitos",
                        percentage: 35,
                        description: "Bedah masalah dan cara time-blocking"
                      },
                      {
                        name: "Prinsip Kerja & Nilai",
                        percentage: 25,
                        description: "Filosofi fokus tenang dan batasan kerja"
                      },
                      {
                        name: "Showcase Fitur & Solusi",
                        percentage: 20,
                        description: "Demo visual browser dan kartu sprint"
                      },
                      {
                        name: "Relatable Story & Curhat",
                        percentage: 20,
                        description: "Kisah harian kehidupan mandiri"
                      }
                    ]
                  ).map((f, N) => (
                    <div
                      key={N}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[#f0ecf7] bg-[#fafcf9]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#205c49]/10 text-[#6c43e3] font-bold text-xs flex items-center justify-center shrink-0">
                        {N + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#1b152c] truncate">
                            {f.name}
                          </span>
                          <span className="text-xs font-bold text-[#6c43e3]">
                            {f.percentage}%
                          </span>
                        </div>
                        <p className="text-[11px] text-[#736c87] truncate">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Pemetaan Call to Action (CTA) Sesuai Funnel</span>
                  {se("contentDNA", !!p.contentDNA?.funnelCTA?.awareness)}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-blue-900 mb-1">
                      🌟 Awareness CTA (Konten Jangkauan / Viral)
                    </label>
                    <input
                      type="text"
                      value={p.contentDNA?.funnelCTA?.awareness || ""}
                      onChange={f =>
                        setP(N => ({
                          ...N,
                          contentDNA: {
                            ...(N.contentDNA || {}),
                            funnelCTA: {
                              ...(N.contentDNA?.funnelCTA || {}),
                              awareness: f.target.value
                            }
                          }
                        }))
                      }
                      placeholder="Simpan postingan ini biar lo ingat pas to-do list mulai berantakan besok."
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs focus:ring-2 focus:ring-blue-500/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      🤝 Consideration CTA (Konten Edukasi / Kepercayaan)
                    </label>
                    <input
                      type="text"
                      value={p.contentDNA?.funnelCTA?.consideration || ""}
                      onChange={f =>
                        setP(N => ({
                          ...N,
                          contentDNA: {
                            ...(N.contentDNA || {}),
                            funnelCTA: {
                              ...(N.contentDNA?.funnelCTA || {}),
                              consideration: f.target.value
                            }
                          }
                        }))
                      }
                      placeholder="Coba tes cara kerja time-blocking visual di browser lo: trajecto.web.app"
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs focus:ring-2 focus:ring-amber-500/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 mb-1">
                      🔥 Conversion CTA (Konten Penawaran / Checkout)
                    </label>
                    <input
                      type="text"
                      value={p.contentDNA?.funnelCTA?.conversion || ""}
                      onChange={f =>
                        setP(N => ({
                          ...N,
                          contentDNA: {
                            ...(N.contentDNA || {}),
                            funnelCTA: {
                              ...(N.contentDNA?.funnelCTA || {}),
                              conversion: f.target.value
                            }
                          }
                        }))
                      }
                      placeholder="Mulai sprint pertama lo hari ini tanpa setup di trajecto.web.app (Free Web Access)"
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRAND MEMORY */}
          {currentTab === "memory" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>1. Memori Brand: Prinsip Abadi</span>
                  {se("brandMemory", !!p.brandMemory?.alwaysSay?.length)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Things We Always Say (Prinsip yang Selalu Diulang)
                    </label>
                    <textarea
                      rows={4}
                      value={(p.brandMemory?.alwaysSay || []).join("\n")}
                      onChange={f => ae("alwaysSay", f.target.value)}
                      placeholder={"Kerjaan klien bayar hasil eksekusi, bukan estetiknya dashboard.\nMaksimal 3 tugas prioritas per hari.\nJam 5 sore laptop ditutup."}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/20 text-xs focus:ring-2 focus:ring-emerald-500/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 mb-1">
                      Things We Never Say (Hal yang Tidak Pernah Dijanjikan)
                    </label>
                    <textarea
                      rows={4}
                      value={(p.brandMemory?.neverSay || []).join("\n")}
                      onChange={f => ae("neverSay", f.target.value)}
                      placeholder={"Bekerjalah 16 jam sehari selagi muda.\nSemua tugas bisa beres semalam jika kamu lembur.\nMenjamin kamu tidak akan pernah malas lagi."}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <span>2. Pagar Klaim Hukum & Promosi (Claims Guardrail)</span>
                  {se("brandMemory", !!p.brandMemory?.claimsGuardrail?.allowed?.length)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Klaim yang Diizinkan (Boleh & Aman Dikatakan)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.brandMemory?.claimsGuardrail?.allowed || []).join("\n")}
                      onChange={f => Ne("allowed", f.target.value)}
                      placeholder={"Aplikasi berbasis web ringan langsung jalan di browser\nMenggunakan metode Agile Sprint harian dan time-blocking visual\nBisa diakses tanpa perlu instalasi atau kartu kredit"}
                      className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-rose-900 mb-1">
                      Klaim yang Dilarang (Over-Promise / Berbahaya)
                    </label>
                    <textarea
                      rows={3}
                      value={(p.brandMemory?.claimsGuardrail?.forbidden || []).join("\n")}
                      onChange={f => Ne("forbidden", f.target.value)}
                      placeholder={"Menjamin produktivitas naik 1000% dalam sehari\nMenjamin tidak akan pernah prokrastinasi lagi seumur hidup"}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ACUAN BEBAS */}
          {currentTab === "custom" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 via-[#f0f7f3] to-teal-50 border border-[#cfe2d4] rounded-2xl p-4.5 sm:p-5 shadow-xs">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧩</span>
                      <h3 className="text-sm font-bold text-[#1b152c]">
                        Acuan Bebas & Modular Knowledge Engine
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#205c49] text-white">
                        Universal Anchor
                      </span>
                    </div>
                    <p className="text-xs text-[#4b6054] leading-relaxed max-w-3xl">
                      Brand Brain adalah acuan universal yang <strong>bisa apa saja</strong>. Anda bebas menambahkan aturan wajib, SOP konten internal, katalog produk & harga, FAQ, hingga template copywriting spesifik. Semua acuan yang aktif otomatis diserap oleh AI di semua studio konten & konsultasi!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => Ae("Aturan Wajib AI")}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Blok Acuan</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-[#f0ecf7] flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center gap-1.5">
                      <span>1. Aturan Kustom AI (Directives / Golden Rules)</span>
                      <span className="text-[11px] font-semibold text-[#5a7063] lowercase">
                        ({p.customDirectives?.length || 0} aturan aktif)
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#736c87] mt-0.5">
                      Aturan ringkas spesifik yang wajib dipatuhi AI saat menulis caption, hook, script video, atau menyusun rencana konten.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] text-[#718478] mr-1">Inspirasi cepat:</span>
                    {[
                      'Gunakan sapaan akrab "Teman Semua"',
                      'Sebut harga jelas tanpa kata "DM ya"',
                      "Selalu sertakan 3 hashtag relevan",
                      "Fokus edukasi solusi masalah, bukan hard-selling"
                    ].map((f, N) => (
                      <button
                        key={N}
                        type="button"
                        onClick={() => ge(f)}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-[#f0f4ef] hover:bg-[#e2ebe1] text-[#2c4739] border border-[#d8e3d7] transition-colors cursor-pointer"
                      >
                        + {f.slice(0, 22)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newDirective}
                    onChange={f => setNewDirective(f.target.value)}
                    onKeyDown={f => {
                      if (f.key === "Enter") {
                        f.preventDefault();
                        ge();
                      }
                    }}
                    placeholder="Tulis aturan baru... Contoh: Jangan pernah pakai kata klise seperti 'Solusi Terbaik' atau 'Yuk Tunggu Apa Lagi'"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#eae6f3] text-xs focus:ring-2 focus:ring-[#6c43e3]/20 focus:border-[#6c43e3] outline-none bg-white placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => ge()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {(p.customDirectives || []).length === 0 ? (
                    <div className="text-center py-5 border border-dashed border-[#eae6f3] rounded-xl text-[#7a8f81] text-xs">
                      Belum ada aturan kustom. Tuliskan aturan di atas atau klik salah satu inspirasi cepat.
                    </div>
                  ) : (
                    (p.customDirectives || []).map((f, N) => (
                      <div
                        key={N}
                        className="flex items-center gap-2 p-2.5 rounded-xl border border-[#eae6f3] bg-[#fafcf9] hover:bg-white transition-all group"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#205c49]/10 text-[#6c43e3] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {N + 1}
                        </span>
                        <input
                          type="text"
                          value={f}
                          onChange={J => re(N, J.target.value)}
                          className="flex-1 text-xs bg-transparent border-none outline-none text-[#1b3429] font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => ee(N)}
                          className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-60 group-hover:opacity-100 cursor-pointer"
                          title="Hapus aturan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-[#f0ecf7] flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c] flex items-center gap-1.5">
                      <span>2. Blok Acuan Modular (Custom Knowledge Blocks)</span>
                      <span className="text-[11px] font-semibold text-[#5a7063] lowercase">
                        ({p.customBlocks?.length || 0} blok)
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#736c87] mt-0.5">
                      Simpan SOP, daftar paket harga, script penjualan, FAQ keberatan konsumen, riset kompetitor, atau materi bebas lainnya dalam blok terstruktur.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={selectedBlockCat}
                      onChange={f => setSelectedBlockCat(f.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-[#eae6f3] text-[11px] font-medium text-[#2f4639] bg-white outline-none cursor-pointer"
                    >
                      <option value="all">
                        Semua Kategori ({p.customBlocks?.length || 0})
                      </option>
                      <option value="Aturan Wajib AI">Aturan Wajib AI</option>
                      <option value="Katalog Produk & Harga">Katalog Produk & Harga</option>
                      <option value="SOP & Konten">SOP & Konten</option>
                      <option value="FAQ & Objections">FAQ & Objections</option>
                      <option value="Koleksi Copywriting">Koleksi Copywriting</option>
                      <option value="Kampanye & Event">Kampanye & Event</option>
                      <option value="Riset & Catatan Bebas">Riset & Catatan Bebas</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => Ae(selectedBlockCat === "all" ? "Aturan Wajib AI" : selectedBlockCat)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Blok</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {(p.customBlocks || []).filter(
                    f => selectedBlockCat === "all" || f.category === selectedBlockCat
                  ).length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-[#eae6f3] rounded-2xl p-6 bg-[#fafcf9]">
                      <Boxes className="w-8 h-8 text-[#8da094] mx-auto mb-2" />
                      <p className="text-xs font-semibold text-[#30483c]">
                        Belum ada blok acuan{" "}
                        {selectedBlockCat !== "all" ? `dalam kategori "${selectedBlockCat}"` : ""}
                      </p>
                      <p className="text-[11px] text-[#718478] mt-1 max-w-md mx-auto">
                        Tambahkan blok acuan untuk menyimpan katalog produk, SOP pembuatan konten, panduan handling objection, atau catatan bebas lainnya.
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                        {["Katalog Produk & Harga", "SOP & Konten", "FAQ & Objections"].map(f => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => Ae(f)}
                            className="px-3 py-1.5 rounded-xl bg-white border border-[#eae6f3] text-xs font-medium text-[#6c43e3] hover:bg-[#edf5ef] transition-colors shadow-2xs cursor-pointer"
                          >
                            + Tambah {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    (p.customBlocks || [])
                      .filter(f => selectedBlockCat === "all" || f.category === selectedBlockCat)
                      .map(f => (
                        <div
                          key={f.id}
                          className={`rounded-2xl border transition-all ${
                            f.isActive
                              ? "border-[#cfe2d4] bg-white shadow-xs"
                              : "border-gray-200 bg-gray-50/60 opacity-70"
                          }`}
                        >
                          <div className="p-3.5 sm:px-4 border-b border-[#f0ecf7] flex items-center justify-between flex-wrap gap-2 bg-[#fcfdfb] rounded-t-2xl">
                            <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                              <button
                                type="button"
                                onClick={() => ue(f.id)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                  f.isActive
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : "bg-gray-200 text-gray-600 border-gray-300"
                                }`}
                                title={
                                  f.isActive ? "Aktif sebagai acuan AI" : "Nonaktif (Diabaikan AI)"
                                }
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    f.isActive ? "bg-emerald-600" : "bg-gray-400"
                                  }`}
                                />
                                <span>{f.isActive ? "Aktif" : "Nonaktif"}</span>
                              </button>
                              <select
                                value={f.category}
                                onChange={N => we(f.id, { category: N.target.value })}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-[#eae6f3] bg-white text-[#2a4537] outline-none"
                              >
                                <option value="Aturan Wajib AI">Aturan Wajib AI</option>
                                <option value="Katalog Produk & Harga">Katalog Produk & Harga</option>
                                <option value="SOP & Konten">SOP & Konten</option>
                                <option value="FAQ & Objections">FAQ & Objections</option>
                                <option value="Koleksi Copywriting">Koleksi Copywriting</option>
                                <option value="Kampanye & Event">Kampanye & Event</option>
                                <option value="Riset & Catatan Bebas">Riset & Catatan Bebas</option>
                              </select>
                              <input
                                type="text"
                                value={f.title}
                                onChange={N => we(f.id, { title: N.target.value })}
                                placeholder="Judul Blok Acuan..."
                                className="flex-1 font-bold text-xs text-[#1b152c] bg-transparent border-b border-transparent hover:border-[#eae6f3] focus:border-[#205c49] outline-none px-1 py-0.5"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                disabled={expandingBlockId === f.id}
                                onClick={() => he(f)}
                                className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Gunakan AI untuk memperinci dan menyempurnakan isi blok acuan ini"
                              >
                                {expandingBlockId === f.id ? (
                                  <>
                                    <RefreshCw className="w-3 h-3 animate-spin text-amber-700" />
                                    <span>Memperinci...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3 h-3 text-amber-600" />
                                    <span>Perinci via AI</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => da(f.id)}
                                className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus blok acuan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3.5 sm:px-4">
                            <textarea
                              rows={5}
                              value={f.content}
                              onChange={N => we(f.id, { content: N.target.value })}
                              placeholder="Tuliskan isi acuan di sini secara bebas, format poin-poin atau paragraf. AI akan membaca persis seperti yang tertulis..."
                              className="w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs font-mono focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed bg-[#fcfdfb]"
                            />
                            <div className="flex items-center justify-between text-[10px] text-[#718478] mt-1.5 px-0.5">
                              <span>
                                Format Markdown didukung (poin -, nomor 1., tabel, bold **)
                              </span>
                              <span>{f.content?.length || 0} karakter</span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c]">
                      3. Basis Pengetahuan Bebas (Freeform Raw Knowledge)
                    </h3>
                    <p className="text-[11px] text-[#736c87] mt-0.5">
                      Tempelkan teks mentah dokumen, transkrip meeting, deskripsi produk lengkap, press release, atau catatan internal apa pun.
                    </p>
                  </div>
                  {se("customKnowledge", !!p.customKnowledge)}
                </div>
                <textarea
                  rows={6}
                  value={p.customKnowledge || ""}
                  onChange={f => setP(N => ({ ...N, customKnowledge: f.target.value }))}
                  placeholder={"Paste dokumen panjang apa saja di sini...\nContoh:\nPerusahaan kami didirikan tahun 2023 dengan misi merapikan alur kerja agensi digital. Kami memiliki 3 paket layanan: Starter Rp499rb, Pro Rp1,2jt, dan Enterprise custom quote. Keunggulan kami adalah sistem pelaporan realtime dan dashboard analitik terpadu..."}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed"
                />
                <div className="flex items-center justify-between text-[10px] text-[#718478] px-0.5">
                  <span>
                    AI otomatis mengekstrak fakta penting dari teks ini saat memproduksi konten
                  </span>
                  <span>{p.customKnowledge?.length || 0} karakter</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#eae6f3] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-[#f0ecf7]">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1b152c]">
                      4. Instruksi Persona & Peran Khusus AI (AI Persona / Roleplay)
                    </h3>
                    <p className="text-[11px] text-[#736c87] mt-0.5">
                      Instruksi bagaimana AI harus berperilaku secara spesifik saat berperan sebagai copywriter, perencana konten, atau konsultan brand ini.
                    </p>
                  </div>
                  {se("aiPersonaInstructions", !!p.aiPersonaInstructions)}
                </div>
                <textarea
                  rows={4}
                  value={p.aiPersonaInstructions || ""}
                  onChange={f => setP(N => ({ ...N, aiPersonaInstructions: f.target.value }))}
                  placeholder={"Contoh:\nBerperilakulah seperti Senior Growth Marketer & Creative Director yang tajam, blak-blakan, namun ramah. Jangan pernah gunakan gaya bahasa kaku korporat. Utamakan sudut pandang audiens yang skeptis terhadap janji manis..."}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 9: AI INSPECTOR */}
          {currentTab === "inspector" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-[#142620] text-white rounded-2xl p-5 shadow-md">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-bold tracking-wide">
                        AI Brand Brain Live Prompt Inspector
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        System Prompt Ready
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                      Inilah dokumen acuan lengkap yang dikompilasi dari seluruh tab Brand Brain. Teks ini disuntikkan secara otomatis sebagai{" "}
                      <strong>System Knowledge & Guardrails</strong> ke Gemini AI setiap kali Anda membuat Rencana Konten, memakai Konsultasi AI, Caption Polisher, dan Hook Generator.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={Se}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-300" />
                          <span>Salin Prompt Acuan</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={M}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Prompt .md</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10 text-xs text-gray-300 flex-wrap mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Total Karakter Acuan:</span>
                    <span className="font-bold text-emerald-300">
                      {compiledPromptText.length.toLocaleString()} karakter
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Estimasi Kata:</span>
                    <span className="font-bold text-emerald-300">
                      ~{Math.round(compiledPromptText.split(/\s+/).length).toLocaleString()} kata
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Blok Acuan Aktif:</span>
                    <span className="font-bold text-emerald-300">
                      {(p.customBlocks || []).filter(f => f.isActive).length} dari{" "}
                      {(p.customBlocks || []).length}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Aturan Wajib:</span>
                    <span className="font-bold text-emerald-300">
                      {p.customDirectives?.length || 0} aturan
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#101713] rounded-2xl border border-[#21352a] overflow-hidden shadow-inner">
                <div className="px-4 py-2.5 bg-[#17221c] border-b border-[#21352a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>
                    <span className="text-xs font-mono text-gray-300 font-semibold ml-2">
                      compiled_brand_brain_prompt.md
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400/80">
                    UTF-8 • Markdown
                  </span>
                </div>
                <div className="p-4 max-h-[460px] overflow-y-auto font-mono text-[11px] text-emerald-100/90 leading-relaxed whitespace-pre-wrap select-text">
                  {compiledPromptText}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: EXPORT */}
          {currentTab === "export" && (
            <BrandBrainExportPanel brand={p} onNotify={onNotify} />
          )}

          <div className="h-2" />
        </form>
      </>
    );
  };

  const content = (
    <div
      className={`bg-white rounded-3xl border border-[#eae6f3] ${
        embedded
          ? 'shadow-xs w-full mb-10'
          : 'shadow-2xl max-w-5xl xl:max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden'
      }`}
    >
      


      {profileViewMode === 'manage' ? (
<div className="p-5 sm:p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#EBECEF] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F0F0F] font-heading flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5B78F6]" />
                <span>Daftar Profil Brand ({allProfiles.length})</span>
              </h3>
              <p className="text-xs text-[#676767] mt-0.5">
                Pilih profil aktif untuk diedit, duplikat, atau generate profil baru via AI Brand Brain.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProfileViewMode('editor')}
                className="px-4 py-2 rounded-full border border-[#eae6f3] bg-white hover:bg-[#f4f1fa] text-xs font-semibold text-[#1b152c] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>← Kembali ke Profil</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuickBrandName('');
                  const p = generateQuickPrompt(quickIndustry, quickScale, quickServiceId, '');
                  setRawExtractText(p);
                  setIsNewProfileModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Profil Baru</span>
              </button>
            </div>
          </div>

          {/* Header Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-[#f7f9f6] p-4 rounded-2xl border border-[#eae6f3] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#205c49]/10 text-[#6c43e3] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#6e7f74] font-medium">Total Profil Brand</div>
                <div className="text-xl font-extrabold text-[#1b152c] font-heading">{allProfiles.length} Brand</div>
              </div>
            </div>

            <div className="bg-[#f7f9f6] p-4 rounded-2xl border border-[#eae6f3] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: data.color || '#205c49' }}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="text-[11px] text-[#6e7f74] font-medium">Brand Aktif Sekarang</div>
                <div className="text-sm font-bold text-[#1b152c] truncate font-heading">{data.name || 'Belum dipilih'}</div>
              </div>
            </div>

            <div className="bg-[#f7f9f6] p-4 rounded-2xl border border-[#eae6f3] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#6e7f74] font-medium">Rata-rata Kelengkapan</div>
                <div className="text-xl font-extrabold text-[#1b152c] font-heading">
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
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#cbd8cb] text-xs focus:ring-2 focus:ring-[#6c43e3]/20 focus:border-[#6c43e3] outline-none bg-white"
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
                        : 'border-[#eae6f3] hover:border-[#b5c7b8] shadow-2xs'
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
                            <h4 className="font-bold text-sm text-[#1b152c] truncate font-heading">{p.name || 'Brand Tanpa Nama'}</h4>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="text-[11px] text-[#736c87] truncate">{p.category || 'Kategori umum'}</span>
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
                          <span className="font-bold text-[#1b152c]">{score}%</span>
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
                      <div className="space-y-1.5 text-[11px] text-[#55695e] border-t border-[#f0ecf7] pt-2.5">
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
                    <div className="p-3 border-t border-[#f0ecf7] bg-[#fafcf9] flex items-center justify-between gap-1.5">
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
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Buka Brand Brain</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => { handleSelectProfile(p.id || p.name); setProfileViewMode('editor'); }}
                        className="p-1.5 rounded-xl border border-[#eae6f3] bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-[#736c87] transition-all cursor-pointer shadow-2xs"
                        title="Lihat Detail Brand Brain"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateBrand && onDuplicateBrand(p.id || p.name)}
                        className="p-1.5 rounded-xl border border-[#eae6f3] bg-white hover:bg-[#f6faf4] text-[#736c87] transition-all cursor-pointer shadow-2xs"
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
                        className="p-1.5 rounded-xl border border-[#eae6f3] bg-white hover:bg-[#f6faf4] text-[#736c87] transition-all cursor-pointer shadow-2xs"
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
                        className="p-1.5 rounded-xl border border-[#eae6f3] bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-[#736c87] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
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
          {/* Unified Profile Header */}
          <div className="p-4 sm:px-6 border-b border-[#EBECEF] flex items-center justify-between bg-white flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0"
                style={{ backgroundColor: data.color || "#0F0F0F" }}
              >
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F] font-heading">
                    {data.name || "Profil Brand"}
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#5B78F6] border border-[#DDE3EA]">
                    {data.category || "Profil Aktif"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Kelengkapan: {completeness.score}%
                  </span>
                </div>
                <p className="text-xs text-[#676767] mt-0.5">
                  DNA & acuan strategis konten brand — dapat diedit langsung pada setiap tab di bawah.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Profile Switcher */}
              <div className="flex items-center gap-1.5 bg-[#FBFBFC] px-2.5 py-1.5 rounded-xl border border-[#EBECEF] shadow-2xs">
                <Users className="w-3.5 h-3.5 text-[#5B78F6]" />
                <span className="text-[11px] font-semibold text-[#676767]">Profil:</span>
                <select
                  value={data.id || activeBrandId || ''}
                  onChange={(e) => handleSelectProfile(e.target.value)}
                  className="text-xs font-bold text-[#0F0F0F] bg-transparent outline-none cursor-pointer pr-1 font-heading max-w-[140px] truncate"
                >
                  {allProfiles.map((p) => (
                    <option key={p.id || p.name} value={p.id || p.name}>
                      {p.name || 'Brand Tanpa Nama'}
                    </option>
                  ))}
                </select>
              </div>

              {/* + Profil Baru (Brand Brain AI Generator) */}
              <button
                type="button"
                onClick={() => {
                  setQuickBrandName('');
                  const p = generateQuickPrompt(quickIndustry, quickScale, quickServiceId, '');
                  setRawExtractText(p);
                  setIsNewProfileModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Generate profil brand baru via AI Brand Brain"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Profil Baru</span>
              </button>

              {/* Import Modal */}
              <BrandBrainImportModal
                brand={data}
                onNotify={onNotify}
                onApply={(updater: any) => {
                  setData(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
                }}
              />

              {/* Export Menu (3 options) */}
              <BrandBrainExportMenu
                brand={data}
                onNotify={onNotify}
                onMore={() => setActiveTab("export")}
              />

              {/* Duplikat Profil */}
              <button
                type="button"
                onClick={() => onDuplicateBrand && (data.id ? onDuplicateBrand(data.id) : null)}
                className="p-2 rounded-xl bg-[#FBFBFC] hover:bg-gray-100 text-[#0F0F0F] border border-[#EBECEF] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                title="Duplikat profil aktif ini"
              >
                <Copy className="w-3.5 h-3.5 text-[#676767]" />
              </button>

              {/* Manage All Profiles Button */}
              <button
                type="button"
                onClick={() => setProfileViewMode('manage')}
                className="px-3 py-1.5 rounded-xl bg-[#FBFBFC] hover:bg-gray-100 text-[#0F0F0F] border border-[#EBECEF] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Lihat daftar semua profil brand"
              >
                <Layers className="w-3.5 h-3.5 text-[#676767]" />
                <span className="hidden sm:inline">Daftar ({allProfiles.length})</span>
              </button>

              {!embedded && onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#676767] hover:text-[#0F0F0F] hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        {renderBrandTabs(data, setData, activeTab, setActiveTab, "brand-brain-form", handleSubmit)}

        {/* Footer */}
        <div
          className={`p-4 sm:px-6 border-t border-[#f0ecf7] bg-[#fafcf9] flex items-center justify-between flex-wrap gap-3 ${
            embedded ? 'sticky bottom-0 z-10 rounded-b-3xl shadow-xs' : 'shrink-0'
          }`}
        >
          <div className="text-xs text-[#736c87] flex items-center gap-2">
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
              className="px-4 py-2 rounded-xl border border-[#eae6f3] bg-white text-xs font-semibold text-[#736c87] hover:bg-[#f6faf4] transition-colors cursor-pointer"
            >
              {embedded ? "Reset Perubahan" : "Batal"}
            </button>
            <button
              type="submit"
              form="brand-brain-form"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
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
          <div className="bg-white rounded-3xl border border-[#eae6f3] shadow-2xl max-w-4xl xl:max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:px-6 bg-[#f7f9f6] border-b border-[#f0ecf7] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#205c49]/10 text-[#6c43e3] flex items-center justify-center font-bold shadow-2xs">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1b152c] font-heading flex items-center gap-2">
                    <span>Tambah Profil Brand Baru</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      ✨ Ekstrak Cerdas AI
                    </span>
                  </h3>
                  <p className="text-xs text-[#736c87]">
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
              <div className="bg-[#f8faf7] p-3.5 rounded-2xl border border-[#eae6f3] flex items-center gap-3 flex-wrap">
                <label className="text-xs font-bold text-[#1b152c] shrink-0 flex items-center gap-1.5">
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
                <div className="text-xs font-bold text-[#1b152c] flex items-center justify-between">
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
                            : 'bg-white border-[#eae6f3] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                        }`}
                      >
                        <div className="text-xl mb-1">{cat.icon}</div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#6c43e3]' : 'text-[#1b152c]'}`}>
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
                        : 'bg-white border-[#eae6f3] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                    }`}
                  >
                    <div className="text-xl mb-1">✍️</div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quickIndustry === 'custom' ? 'text-[#6c43e3]' : 'text-[#1b152c]'}`}>
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
                <div className="text-xs font-bold text-[#1b152c] flex items-center justify-between">
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
                            : 'bg-white border-[#eae6f3] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                        }`}
                      >
                        <div className="text-xl mb-1">{(s as any).icon || "🏢"}</div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#6c43e3]' : 'text-[#1b152c]'}`}>
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
                        : 'bg-white border-[#eae6f3] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                    }`}
                  >
                    <div className="text-xl mb-1">⚙️</div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quickScale === 'custom' ? 'text-[#6c43e3]' : 'text-[#1b152c]'}`}>
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
                <div className="text-xs font-bold text-[#1b152c]">
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
                            : 'bg-white border-[#eae6f3] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                        }`}
                      >
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#6c43e3]' : 'text-[#1b152c]'}`}>
                            {srv.name}
                          </div>
                          <div className="text-[10px] text-[#697d70] line-clamp-2 mt-0.5 leading-snug">
                            {srv.desc}
                          </div>
                        </div>
                        <div className="mt-1 text-[10px] text-[#6c43e3] font-medium truncate">
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
                        : 'bg-white border-[#eae6f3] hover:border-[#b5c7b8] hover:bg-[#f6faf4]'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quickServiceId === 'custom' ? 'text-[#6c43e3]' : 'text-[#1b152c]'}`}>
                        ➕ Produk / Servis Kustom
                      </div>
                      <div className="text-[10px] text-[#697d70] line-clamp-2 mt-0.5 leading-snug">
                        Tuliskan produk atau jasa spesifik milik bisnis Anda
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] text-[#6c43e3] font-medium">
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
                    <span className="text-xs font-bold text-[#1b152c] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Quick Start: Ekstrak Brand Brain 70–80% Otomatis</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#736c87] border border-[#d2ded2] font-semibold">
                      Kelengkapan: {calculateBrainCompleteness(newBrandForm).score}%
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isCreatingAiProfile || !rawExtractText.trim()}
                    onClick={handleExtractToBrandBrainForm}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
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
                  <div className="flex items-center justify-between text-xs font-bold text-[#1b152c]">
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eae6f3] text-xs focus:ring-2 focus:ring-[#6c43e3]/20 focus:border-[#6c43e3] outline-none bg-white font-mono leading-relaxed shadow-inner"
                  />
                </div>
              </div>

              {/* BRAND BRAIN: Form 9 Pilar Lengkap */}
              <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-xs mt-4">
                <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="font-bold text-sm text-[#1b152c] font-heading">
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

                {renderBrandTabs(
                  newBrandForm,
                  setNewBrandForm,
                  modalBrandTab,
                  setModalBrandTab,
                  "new-brand-brain-form",
                  e => {
                    e.preventDefault();
                    handleSaveCreatedProfile();
                  }
                )}
              </div>

              </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 bg-[#f7f9f6] border-t border-[#f0ecf7] flex items-center justify-between gap-3 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsNewProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#eae6f3] text-[#736c87] font-semibold hover:bg-white transition-colors cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isCreatingAiProfile || !quickBrandName.trim()}
                onClick={handleSaveCreatedProfile}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#a051e6] to-[#6c43e3] hover:from-[#ed8a33] hover:to-[#ed8a33] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
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
