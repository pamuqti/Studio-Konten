export type ContentStatus = 'draft' | 'in_progress' | 'approved' | 'scheduled';

export type SocialPlatformKey = 'facebook' | 'instagram' | 'threads' | 'tiktok' | 'youtube';

export type AuthMethod = 'oauth2' | 'manual_token';
export type ConnectionHealth = 'connected' | 'disconnected' | 'expiring_soon' | 'expired' | 'error';

export type PublishExecutionMode =
  | 'native_schedule'  // Masuk jadwal bawaan YouTube Studio / Facebook Page
  | 'inbox_draft'      // Kirim draf ke notifikasi Inbox TikTok HP
  | 'auto_queue'       // Antrean scheduler otomatis (IG / Threads / TikTok Direct)
  | 'direct_now';      // Publish instan sekarang

export type SchedulePublishStatus =
  | 'queued'            // Menunggu jam tayang
  | 'native_scheduled'  // Terjadwal di server platform (YouTube / Meta)
  | 'inbox_sent'        // Terkirim ke Inbox aplikasi (TikTok)
  | 'publishing'        // Sedang proses upload
  | 'published'         // Berhasil tayang
  | 'partial'           // Berhasil di sebagian platform
  | 'failed';           // Gagal tayang

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;                 // URL publik dari Cloudflare R2 atau URL lokal/preview
  r2Key?: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  aspectRatio?: '9:16' | '1:1' | '4:5' | '16:9' | string;
  durationSec?: number;
  thumbnailUrl?: string;
}

export interface PlatformOverrideConfig {
  enabled: boolean;
  publishMode?: PublishExecutionMode;
  customCaption?: string;
  firstComment?: string;
  threadsChain?: string[];
  tiktokPrivacy?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  tiktokDisableComment?: boolean;
  tiktokDisableDuet?: boolean;
  youtubeTitle?: string;
  youtubeCategoryId?: string;
  youtubePrivacy?: 'public' | 'unlisted' | 'private';
  youtubeMadeForKids?: boolean;
  youtubeTags?: string[];
}

export interface PublishAttemptLog {
  platform: SocialPlatformKey;
  mode: PublishExecutionMode;
  status: 'queued' | 'native_scheduled' | 'inbox_sent' | 'publishing' | 'published' | 'failed';
  scheduledAt: string;
  executedAt?: string;
  externalPostId?: string;
  externalPostUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount: number;
}

// Post yang sudah masuk ke Kalender Distribusi & Auto-Publisher
export interface ScheduledPost {
  id: string;
  contentItemId?: string;      // Terhubung ke ID naskah di Ruang Rencana
  brandId: string;
  brandName: string;
  title: string;
  scheduledDate: string;       // YYYY-MM-DD
  scheduledTime: string;       // HH:mm (WIB)
  timezone: string;            // 'Asia/Jakarta'
  scheduledAtIso: string;      // ISO 8601
  
  targetPlatforms: SocialPlatformKey[];
  masterCaption: string;
  media: MediaAttachment[];
  
  platformOverrides: Partial<Record<SocialPlatformKey, PlatformOverrideConfig>>;
  publishLogs: Partial<Record<SocialPlatformKey, PublishAttemptLog>>;
  overallStatus: SchedulePublishStatus;
  
  createdAt: string;
  updatedAt: string;
}

export interface PlatformConnection {
  platform: SocialPlatformKey;
  authMethod: AuthMethod;
  status: ConnectionHealth;
  accountId: string;           // FB Page ID / IG User ID / Threads User ID / TikTok Open ID / YT Channel ID
  accountName: string;         // mis. "Trajecto Official"
  accountHandle: string;       // @username
  avatarUrl?: string;
  tokenMask?: string;
  tokenSecret?: string;
  refreshToken?: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
  lastError?: string;
  defaultPublishMode: PublishExecutionMode;
  autoPublishEnabled: boolean;
}

export interface CloudflareR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
  isConfigured: boolean;
}

export type FunnelStageId = 'tofu' | 'mofu' | 'bofu' | 'ret';

export interface DemographicData {
  age?: string;
  gender?: string;
  location?: string;
  occupation?: string;
  lifestyle?: string;
  purchasingPower?: string;
}

export interface PsychographicData {
  painPoints?: string[];
  desires?: string[];
  fears?: string[];
  objections?: string[];
}

export interface ContentBehavior {
  scrollStoppers?: string;
  commentTriggers?: string;
  purchaseTriggers?: string;
}

export interface AudienceDNA {
  primary?: string;
  demographics?: DemographicData;
  psychographics?: PsychographicData;
  contentBehavior?: ContentBehavior;
}

export interface Positioning {
  weAre?: string;
  forAudience?: string;
  whoNeed?: string;
  becauseWhy?: string;
  unlike?: string;
  statement?: string;
}

export interface VoiceSpectrum {
  formality?: number;      // 0-100 (Formal vs Casual)
  playfulness?: number;    // 0-100 (Serious vs Playful)
  approach?: number;       // 0-100 (Cold expert vs Friendly friend)
  positioningTier?: number;// 0-100
  energy?: number;         // 0-100 (Cautious vs Bold)
}

export interface PersonalityVoice {
  spectrum?: VoiceSpectrum;
  humanPersona?: string;
  voiceDo?: string[];
  voiceDont?: string[];
  signatureWords?: string[];
  forbiddenWords?: string[];
}

export interface CompetitorContext {
  directCompetitors?: string[];
  indirectCompetitors?: string[];
  competitorWeakness?: string;
  whatWeWillNeverDo?: string[];
}

export interface OfferConversionDNA {
  mainOffer?: string;
  entryOffer?: string;
  priceRange?: string;
  riskReversal?: string;
  purchasePath?: string;
}

export interface ProofCredibility {
  hardProofPoints?: string[];
  caseTransformations?: string[];
  customerVoiceRaw?: string[];
}

export interface VisualPalette {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
}

export interface VisualDNA {
  palette?: VisualPalette;
  photographyStyle?: string[];
  visualDoNotUse?: string[];
}

export interface ContentPillar {
  name: string;
  percentage: number;
  description: string;
}

export interface ContentRatio {
  awareness?: number;
  education?: number;
  engagement?: number;
  conversion?: number;
  loyalty?: number;
}

export interface FunnelCTA {
  awareness?: string;
  consideration?: string;
  conversion?: string;
  retention?: string;
}

export interface ContentDNA {
  pillars?: ContentPillar[];
  contentRatio?: ContentRatio;
  funnelCTA?: FunnelCTA;
}

export interface ClaimsGuardrail {
  allowed?: string[];
  forbidden?: string[];
}

export interface BrandMemory {
  alwaysSay?: string[];
  neverSay?: string[];
  signatureStories?: string[];
  claimsGuardrail?: ClaimsGuardrail;
}

export interface CustomKnowledgeBlock {
  id: string;
  title: string;
  category: string;
  content: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface PlatformAccounts {
  instagram?: string;
  tiktok?: string;
  threads?: string;
  linkedin?: string;
  youtube?: string;
  facebook?: string;
}

export interface BrandBrain {
  id?: string;
  name: string;
  category: string;
  industry?: string;
  scale?: 'micro' | 'smb' | 'scaleup';
  scaleLabel?: string;
  product: string;
  brandPromise?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  audience: string;
  tone: string;
  usp: string;
  cta: string;
  color: string;
  website?: string;
  instagramHandle?: string;
  platformAccounts?: PlatformAccounts;
  audienceDNA?: AudienceDNA;
  positioning?: Positioning;
  personalityVoice?: PersonalityVoice;
  competitorContext?: CompetitorContext;
  offerConversionDNA?: OfferConversionDNA;
  proofCredibility?: ProofCredibility;
  visualDNA?: VisualDNA;
  contentDNA?: ContentDNA;
  brandMemory?: BrandMemory;
  customDirectives?: string[];
  customBlocks?: CustomKnowledgeBlock[];
  customKnowledge?: string;
  aiPersonaInstructions?: string;
  fieldStatus?: Record<string, 'confirmed' | 'ai_suggested' | 'missing'>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentItemFields {
  Tanggal?: string;
  'Jam Tayang'?: string;
  'Tipe Placement'?: string;
  Penempatan?: string;
  Platform?: string;
  'Akun Target'?: string;
  Format?: string;
  Pilar?: string;
  Hook?: string;
  Headline?: string;
  'Sudut Konten'?: string;
  'Brief Visual'?: string;
  Caption?: string;
  CTA?: string;
  'Tahap Funnel'?: string;
  Checklist?: string;
  'Kategori Platform'?: string;
  'Durasi Target'?: string;
  'Struktur Video'?: string;
  'Judul & Thumbnail'?: string;
  [key: string]: any;
}

export interface ContentItem {
  id: string;
  title: string;
  status: ContentStatus;
  fields: ContentItemFields;
  notes?: string;
}

export interface ContentPlanOptions {
  topic?: string;
  goal?: string;
  platform?: string;
  count?: number;
  start?: string;
  trendContext?: string;
  contentTypes?: string[];
  funnelStages?: string[];
  [key: string]: any;
}

export interface ContentDocument {
  version: number;
  id: string;
  module: string;
  title: string;
  options: ContentPlanOptions;
  brand: BrandBrain;
  items: ContentItem[];
  source?: 'gemini' | 'template';
  createdAt: string;
  updatedAt?: string;
  status?: string;
  strategyNotes?: string;
  history?: Array<{ timestamp: string; action: string }>;
}

export interface ConsultationTurn {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  quickOptions?: string[];
  blueprint?: StrategyBlueprint;
  timestamp: number;
}

export interface StrategyBlueprint {
  coreAngle: string;
  targetAudienceRefined: string;
  recommendedPillars: string[];
  suggestedTone: string;
  suggestedCta: string;
  summary: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
