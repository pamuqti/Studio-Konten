import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BrandBrain } from '../types';
import { Download, Copy, Check, X, Upload, Sparkles, RefreshCw, FileText } from 'lucide-react';
import { calculateBrainCompleteness, compileBrandBrainPrompt } from '../utils/brandBrainExport';
import { downloadFile as gt, copyToClipboard as Oa } from '../utils/export';

const G = React;
const n = {
  jsx: (type: any, props: any, key?: any) => React.createElement(type, { ...props, key }),
  jsxs: (type: any, props: any, key?: any) => React.createElement(type, { ...props, key }),
  Fragment: React.Fragment
};
const jn = Download;
const ut = Check;
const _a = Copy;
const Zn = X;
const _u = Upload;
const Nn = RefreshCw;
const ze = Sparkles;
const jr = FileText;

const Qb = calculateBrainCompleteness;
const ot = compileBrandBrainPrompt;

const bbxH = (t: any, p: any, ...c: any[]) => {
  const { key, ...r } = p || {};
  if (c.length) (r as any).children = c.length === 1 ? c[0] : c;
  return React.createElement(t, { ...r, key });
};

const bbxHas=v=>v==null?!1:typeof v=="string"?v.trim().length>0:Array.isArray(v)?v.some(bbxHas):typeof v=="object"?Object.values(v).some(bbxHas):!0;
const bbxSecs=[
{id:"identity",icon:"🏛️",label:"Identitas & Fondasi",lock:!0,keys:["name","category","product","brandPromise","mission","vision","values","audience","usp","tone","cta","color","website","instagramHandle","platformAccounts"]},
{id:"positioning",icon:"🧭",label:"Positioning",keys:["positioning"]},
{id:"market",icon:"⚔️",label:"Kompetitor & Pasar",keys:["competitorContext"]},
{id:"audience",icon:"🎯",label:"Audience DNA",keys:["audienceDNA"]},
{id:"offer",icon:"💎",label:"Penawaran & Konversi",keys:["offerConversionDNA"]},
{id:"proof",icon:"🏆",label:"Bukti & Kredibilitas",keys:["proofCredibility"]},
{id:"voice",icon:"🎭",label:"Karakter & Suara",keys:["personalityVoice"]},
{id:"visual",icon:"🎨",label:"Visual DNA",keys:["visualDNA"]},
{id:"content",icon:"📊",label:"Content DNA",keys:["contentDNA"]},
{id:"memory",icon:"🧠",label:"Brand Memory & Guardrails",keys:["brandMemory"]},
{id:"directives",icon:"📜",label:"Aturan Kustom AI",keys:["customDirectives"]},
{id:"blocks",icon:"🧩",label:"Blok Acuan Modular",keys:["customBlocks"]},
{id:"knowledge",icon:"📚",label:"Basis Pengetahuan Bebas",keys:["customKnowledge"]},
{id:"persona",icon:"🤖",label:"Persona AI",keys:["aiPersonaInstructions"]}];
const bbxFilled=(s,p)=>s.keys.some(k=>bbxHas(p[k]));
const bbxFmts=[
{id:"prompt",icon:"🧠",name:"Prompt AI",ext:"md",mime:"text/markdown;charset=utf-8",desc:"Teks acuan siap tempel ke Gemini / ChatGPT / Claude (sama seperti AI Inspector)."},
{id:"json",icon:"🗄️",name:"Backup JSON",ext:"json",mime:"application/json;charset=utf-8",desc:"Data lengkap, bisa diimpor kembali lewat Quick Start di Brand Brain."},
{id:"md",icon:"📝",name:"Brand Guide",ext:"md",mime:"text/markdown;charset=utf-8",desc:"Dokumen Markdown yang rapi dan mudah dibaca tim atau klien."},
{id:"connector",icon:"🔌",name:"Konektor Funnel",ext:"json",mime:"application/json;charset=utf-8",desc:"Skema stabil untuk app standalone: data sumber konten per tahap funnel (TOFU sampai Retention)."},
{id:"template",icon:"📋",name:"Template Kosong",ext:"json",mime:"application/json;charset=utf-8",desc:"Skema konektor tanpa isi, lengkap dengan panduan tiap field untuk acuan app lain."},
{id:"html",icon:"📄",name:"Brand Sheet",ext:"html",mime:"text/html;charset=utf-8",desc:"Halaman siap cetak. Buka lalu Print untuk jadi PDF."}];
const bbxL: any={name:"Nama Brand",category:"Kategori",product:"Produk / Layanan",brandPromise:"Brand Promise",mission:"Misi",vision:"Visi",values:"Nilai Brand",audience:"Target Audiens",usp:"USP / Pembeda",tone:"Tone of Voice",cta:"CTA Utama",color:"Warna Utama",website:"Website",instagramHandle:"Instagram",platformAccounts:"Akun Platform",instagram:"Instagram",tiktok:"TikTok",threads:"Threads / X",linkedin:"LinkedIn",youtube:"YouTube",facebook:"Facebook",weAre:"Kami adalah",forAudience:"Untuk",whoNeed:"Yang membutuhkan",becauseWhy:"Karena",unlike:"Berbeda dari",statement:"Positioning Statement",directCompetitors:"Kompetitor Langsung",indirectCompetitors:"Alternatif / Substitusi",competitorWeakness:"Kelemahan Kompetitor",whatWeWillNeverDo:"Tidak Akan Pernah Kami Lakukan",primary:"Audiens Utama",demographics:"Demografi",age:"Usia",gender:"Gender",location:"Lokasi",occupation:"Pekerjaan",lifestyle:"Gaya Hidup",purchasingPower:"Daya Beli",psychographics:"Psikografi",painPoints:"Pain Points",desires:"Keinginan",fears:"Ketakutan",objections:"Keberatan",contentBehavior:"Perilaku Konten",scrollStoppers:"Penghenti Scroll",commentTriggers:"Pemicu Komentar",purchaseTriggers:"Pemicu Pembelian",mainOffer:"Penawaran Utama",entryOffer:"Penawaran Awal",priceRange:"Rentang Harga",riskReversal:"Garansi",purchasePath:"Jalur Pembelian",hardProofPoints:"Bukti Keras",caseTransformations:"Studi Transformasi",customerVoiceRaw:"Suara Pelanggan",humanPersona:"Persona Manusia",spectrum:"Spektrum Nada",formality:"Kasual (0-100)",playfulness:"Keceriaan (0-100)",approach:"Kedekatan (0-100)",positioningTier:"Tier Positioning (0-100)",energy:"Keberanian (0-100)",voiceDo:"DO (Wajib)",voiceDont:"DON'T (Dilarang)",signatureWords:"Kata Khas",forbiddenWords:"Kata Terlarang",palette:"Palet Warna",secondary:"Sekunder",accent:"Aksen",background:"Latar",photographyStyle:"Gaya Fotografi",visualDoNotUse:"Visual yang Dihindari",pillars:"Pilar Konten",percentage:"Persentase",description:"Deskripsi",contentRatio:"Rasio Konten",awareness:"Awareness",education:"Edukasi",engagement:"Engagement",conversion:"Konversi",loyalty:"Loyalitas",funnelCTA:"CTA per Funnel",consideration:"Consideration",retention:"Retensi",alwaysSay:"Selalu Katakan",neverSay:"Tidak Pernah Katakan",signatureStories:"Cerita Khas",claimsGuardrail:"Pagar Klaim",allowed:"Diizinkan",forbidden:"Dilarang"};
const bbxLab=(k: any,par?: any)=>k==="primary"&&par==="palette"?"Utama":bbxL[k]||String(k).replace(/([A-Z])/g," $1").replace(/^./,x=>x.toUpperCase());
const bbxEsc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const bbxPick=(p: any,sel: any,o: any): any=>{const out: any={};bbxSecs.forEach(s=>{if(!(s.lock||sel[s.id]))return;s.keys.forEach(k=>{let v=p[k];if(k==="customBlocks"&&Array.isArray(v)&&o.onlyActive)v=v.filter(b=>b&&b.isActive!==!1);if(bbxHas(v))out[k]=v})});if(!out.name)out.name=p.name||"Brand";if(o.meta&&p.fieldStatus)out.fieldStatus=p.fieldStatus;return out};
const bbxNodes=(p,sel,o)=>{const nodes=[],item=(x)=>{if(x==null||typeof x!="object")return String(x);const nm=x.name||x.title,rest=Object.entries(x).filter(([k,v])=>k!=="name"&&k!=="title"&&bbxHas(v)).map(([k,v])=>bbxLab(k, undefined)+": "+v);return nm?nm+(rest.length?" — "+rest.join(" · "):""):rest.join(" · ")};
const walk=(v,k,d,par,top)=>{if(!bbxHas(v))return;if(k==="customBlocks"){v.forEach(b=>{if(b&&bbxHas(b.content))nodes.push({t:"block",title:b.title||"Blok Acuan",cat:b.category||"",content:String(b.content).trim()})});return}if(k==="customKnowledge"||k==="aiPersonaInstructions"){nodes.push({t:"text",x:String(v).trim()});return}if(Array.isArray(v)){nodes.push({t:"ul",k:top?"":bbxLab(k,par),items:v.filter(bbxHas).map(item)});return}if(typeof v=="object"){if(!top)nodes.push({t:"sub",x:bbxLab(k,par),d});Object.entries(v).forEach(([a,b])=>walk(b,a,d+1,k,!1));return}nodes.push({t:"kv",k:bbxLab(k,par),v:String(v)})};
const data=bbxPick(p,sel,o);bbxSecs.forEach(s=>{const ks=s.keys.filter(k=>bbxHas(data[k]));if(!ks.length||!(s.lock||sel[s.id]))return;nodes.push({t:"h",x:s.icon+" "+s.label});ks.forEach(k=>walk(data[k],k,0,"",!s.lock))});return nodes};
const bbxMd=(nodes,title,meta)=>{let o="# "+title+"\n";if(meta)o+="\n> "+meta+"\n";nodes.forEach(x=>{if(x.t==="h")o+="\n## "+x.x+"\n\n";else if(x.t==="sub")o+="\n"+"#".repeat(Math.min(6,x.d+3))+" "+x.x+"\n\n";else if(x.t==="kv")o+="- **"+x.k+":** "+x.v.replace(/\n+/g," ")+"\n";else if(x.t==="ul"){if(x.k)o+="\n**"+x.k+"**\n\n";o+=x.items.map(i=>"- "+i.replace(/\n+/g," ")).join("\n")+"\n\n"}else if(x.t==="block")o+="\n### "+x.title+(x.cat?" _("+x.cat+")_":"")+"\n\n"+x.content+"\n";else if(x.t==="text")o+=x.x+"\n"});return o.trim()+"\n"};
const bbxHtml=(nodes,p,meta)=>{const c=/^#[0-9a-f]{3,8}$/i.test(p.color||"")?p.color:"#205c49",sw=v=>/^#[0-9a-f]{3,8}$/i.test(v)?'<i class="sw" style="background:'+bbxEsc(v)+'"></i>':"";let b="",open=!1;nodes.forEach(x=>{if(x.t==="h"){if(open)b+="</section>";b+='<section class="card"><h2>'+bbxEsc(x.x)+"</h2>";open=!0}else if(x.t==="sub")b+="<h3>"+bbxEsc(x.x)+"</h3>";else if(x.t==="kv")b+='<div class="kv"><span>'+bbxEsc(x.k)+"</span><p>"+sw(x.v)+bbxEsc(x.v).replace(/\n/g,"<br>")+"</p></div>";else if(x.t==="ul")b+=(x.k?'<div class="lbl">'+bbxEsc(x.k)+"</div>":"")+"<ul>"+x.items.map(i=>"<li>"+bbxEsc(i)+"</li>").join("")+"</ul>";else if(x.t==="block")b+='<div class="blk"><h4>'+bbxEsc(x.title)+(x.cat?" <small>"+bbxEsc(x.cat)+"</small>":"")+"</h4><div class=\"pre\">"+bbxEsc(x.content)+"</div></div>";else if(x.t==="text")b+='<div class="pre">'+bbxEsc(x.x)+"</div>"});if(open)b+="</section>";const css=":root{--c:"+c+"}*{box-sizing:border-box}body{margin:0;background:#f4f7f3;color:#142620;font:14px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}header{background:var(--c);color:#fff;padding:40px 24px}header>div{max-width:860px;margin:0 auto}.badge{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,255,255,.2);padding:3px 10px;border-radius:99px}h1{margin:10px 0 4px;font-size:30px}header p{margin:0;opacity:.9}main{max-width:860px;margin:0 auto;padding:24px;display:grid;gap:16px}.card{background:#fff;border:1px solid #dce4db;border-radius:16px;padding:20px 22px;break-inside:avoid-page}h2{margin:0 0 12px;font-size:15px;border-bottom:1px solid #edf1eb;padding-bottom:8px}h3{margin:16px 0 6px;font-size:13px;color:var(--c)}h4{margin:12px 0 6px;font-size:13px}h4 small{font-weight:500;color:#697c70}.kv{display:grid;grid-template-columns:190px 1fr;gap:10px;padding:5px 0;border-bottom:1px dashed #edf1eb}.kv span{font-size:12px;font-weight:700;color:#52665b}.kv p{margin:0}.lbl{font-size:12px;font-weight:700;color:#52665b;margin-top:10px}ul{margin:4px 0 8px;padding-left:20px}li{margin:2px 0}.pre{white-space:pre-wrap;background:#f8faf7;border:1px solid #e5ece3;border-radius:10px;padding:10px 12px;font-size:13px}.sw{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:6px;vertical-align:middle;border:1px solid rgba(0,0,0,.15)}footer{max-width:860px;margin:0 auto;padding:0 24px 32px;font-size:11px;color:#697c70}@media(max-width:600px){.kv{grid-template-columns:1fr;gap:0}}@media print{body{background:#fff}header{-webkit-print-color-adjust:exact;print-color-adjust:exact}.card{border-color:#ccc}}";return'<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+bbxEsc((p.name||"Brand")+" - Brand Brain")+"</title><style>"+css+'</style></head><body><header><div><span class="badge">Brand Brain</span><h1>'+bbxEsc(p.name||"Brand")+"</h1><p>"+bbxEsc([p.category,p.product].filter(Boolean).join(" · "))+"</p></div></header><main>"+b+"</main><footer>"+bbxEsc(meta||"")+"</footer></body></html>"};
const bbxGuide={
"brand.name":"Nama brand persis seperti yang dipakai di semua konten.",
"brand.category":"Kategori atau industri bisnis.",
"brand.product":"Produk/layanan utama dalam satu kalimat.",
"brand.promise":"Janji nyata brand: membantu [audiens] mendapat [hasil] tanpa [hambatan].",
"brand.mission":"Misi brand (alasan brand ada).",
"brand.vision":"Visi jangka panjang brand.",
"brand.values":"Nilai/prinsip brand (list pendek).",
"brand.cta_default":"CTA default bila konten tidak punya CTA khusus.",
"brand.platforms":"Handle akun resmi per platform (instagram, tiktok, threads, linkedin, youtube, facebook).",
"positioning.statement":"Kalimat positioning: [Brand] adalah [kategori] untuk [audiens] yang butuh [kebutuhan], karena [alasan], beda dari [alternatif].",
"audience_profile.summary":"Ringkasan ICP (Ideal Customer Profile) dalam satu kalimat.",
"audience_profile.demographics":"Usia, gender, lokasi, pekerjaan, gaya hidup, daya beli target.",
"competition.weakness":"Kelemahan kompetitor/frustrasi pasar yang bisa dijadikan sudut konten.",
"competition.never_do":"Hal yang dilakukan kompetitor tapi tidak akan pernah ditiru brand.",
"voice.persona":"Jika brand adalah manusia, seperti apa cara bicaranya.",
"voice.tone":"Tone of voice ringkas.",
"voice.spectrum":"Skala 0-100 untuk casual, playful, friendly, bold.",
"voice.do / voice.dont":"Aturan gaya bahasa yang wajib dan dilarang.",
"voice.signature_words / voice.forbidden_words":"Kata khas brand dan kata yang dilarang muncul.",
"visual.palette":"Warna brand (primary, secondary, accent, background) dalam hex.",
"visual.photography_style / visual.avoid":"Gaya visual yang dipakai dan yang dihindari.",
"guardrails.always_say / guardrails.never_say":"Prinsip yang selalu diulang dan kalimat yang tidak pernah dikatakan.",
"guardrails.claims_allowed / guardrails.claims_forbidden":"Klaim aman vs klaim terlarang (berlaku untuk konten dan materi sales).",
"guardrails.custom_directives":"Aturan tambahan khusus yang wajib dipatuhi AI saat membuat konten.",
"guardrails.ai_persona":"Instruksi peran/persona AI saat menulis untuk brand ini.",
"content_strategy.pillars":"Pilar konten: nama, share_pct (total idealnya 100), deskripsi.",
"content_strategy.ratio":"Rasio konten per tujuan (persen): awareness, education, engagement, conversion, loyalty.",
"content_strategy.campaigns":"Blok kampanye/event aktif (kategori Kampanye & Event).",
"content_strategy.copy_library":"Koleksi copywriting yang boleh dijadikan acuan gaya (kategori Koleksi Copywriting).",
"funnel.stages[awareness]":"TOFU. Bahan konten untuk audiens yang belum kenal brand. Isi pain_points, fears, scroll_stoppers, comment_triggers, signature_stories.",
"funnel.stages[consideration]":"MOFU. Bahan konten untuk audiens yang membandingkan solusi. Isi desires, usp, differentiator, competitor_weakness, hard_proof_points, values.",
"funnel.stages[conversion]":"BOFU. Bahan konten dan sales untuk audiens yang siap beli. Isi offer, harga, garansi, jalur beli, objections, case_transformations, customer_voice, catalog_blocks, faq_blocks.",
"funnel.stages[retention]":"Bahan konten untuk pelanggan: customer_voice, mission, vision.",
"funnel.stages[].cta":"CTA khusus tahap funnel tersebut.",
"funnel.stages[].content_share_pct":"Porsi konten untuk tahap ini. Consideration = education + engagement, retention = loyalty.",
"funnel.stages[].goal / audience_state / kpi_suggestions":"Nilai default dari sistem. Boleh diganti oleh app yang membaca.",
"knowledge.notes":"Catatan/dokumen mentah bebas sebagai konteks tambahan.",
"knowledge.other_blocks":"Blok acuan lain (SOP, aturan, riset) yang tidak masuk kategori di atas."};
const bbxConn=(p,blank,o)=>{if(blank)p={};o=o||{};const S=v=>v==null?"":String(v).trim(),A=v=>Array.isArray(v)?v.filter(x=>x!=null&&String(x).trim()!=="").map(x=>typeof x=="string"?x.trim():x):[],N=v=>typeof v=="number"&&isFinite(v)?v:null,
pos=p.positioning||{},cc=p.competitorContext||{},ad=p.audienceDNA||{},dm=ad.demographics||{},ps=ad.psychographics||{},cb=ad.contentBehavior||{},of=p.offerConversionDNA||{},pf=p.proofCredibility||{},pv=p.personalityVoice||{},sp=pv.spectrum||{},vd=p.visualDNA||{},pal=vd.palette||{},cd=p.contentDNA||{},cr=cd.contentRatio||{},fc=cd.funnelCTA||{},bm=p.brandMemory||{},cg=bm.claimsGuardrail||{},pa=p.platformAccounts||{},
blocks=(Array.isArray(p.customBlocks)?p.customBlocks:[]).filter(b=>b&&(o.onlyActive===!1||b.isActive!==!1)&&bbxHas(b.content)).map(b=>({title:S(b.title),category:S(b.category),content:S(b.content)})),
res=[/katalog|harga/i,/faq|objection/i,/kampanye|event/i,/copywriting/i],cat=i=>blocks.filter(b=>res[i].test(b.category)),other=blocks.filter(b=>!res.some(r=>r.test(b.category))),
ed=N(cr.education),eg=N(cr.engagement),share={awareness:N(cr.awareness),consideration:ed==null&&eg==null?null:(ed||0)+(eg||0),conversion:N(cr.conversion),retention:N(cr.loyalty)},
st=(id,tag,label,goal,state,kpi,src,cta)=>({id,tag,label,goal,audience_state:state,content_share_pct:share[id],cta:S(cta),kpi_suggestions:kpi,source_material:src});
const out={schema:"brand-brain-connector",schema_version:"1.0",source_app:"Ruang Konten",exported_at:blank||!o.meta?"":new Date().toISOString(),completeness_pct:blank||!o.meta?null:Qb(p).score,
brand:{name:S(p.name),category:S(p.category),product:S(p.product),promise:S(p.brandPromise),mission:S(p.mission),vision:S(p.vision),values:A(p.values),website:S(p.website),primary_color:S(p.color),cta_default:S(p.cta),platforms:{instagram:S(pa.instagram||p.instagramHandle),tiktok:S(pa.tiktok),threads:S(pa.threads),linkedin:S(pa.linkedin),youtube:S(pa.youtube),facebook:S(pa.facebook)}},
positioning:{we_are:S(pos.weAre),for_audience:S(pos.forAudience),who_need:S(pos.whoNeed),because:S(pos.becauseWhy),unlike:S(pos.unlike),statement:S(pos.statement)},
audience_profile:{summary:S(p.audience),primary:S(ad.primary),demographics:{age:S(dm.age),gender:S(dm.gender),location:S(dm.location),occupation:S(dm.occupation),lifestyle:S(dm.lifestyle),purchasing_power:S(dm.purchasingPower)}},
competition:{direct:A(cc.directCompetitors),indirect:A(cc.indirectCompetitors),weakness:S(cc.competitorWeakness),never_do:A(cc.whatWeWillNeverDo)},
voice:{persona:S(pv.humanPersona),tone:S(p.tone),spectrum:{casual:N(sp.formality),playful:N(sp.playfulness),friendly:N(sp.approach),positioning_tier:N(sp.positioningTier),bold:N(sp.energy)},do:A(pv.voiceDo),dont:A(pv.voiceDont),signature_words:A(pv.signatureWords),forbidden_words:A(pv.forbiddenWords)},
visual:{palette:{primary:S(pal.primary||p.color),secondary:S(pal.secondary),accent:S(pal.accent),background:S(pal.background)},photography_style:A(vd.photographyStyle),avoid:A(vd.visualDoNotUse)},
guardrails:{always_say:A(bm.alwaysSay),never_say:A(bm.neverSay),claims_allowed:A(cg.allowed),claims_forbidden:A(cg.forbidden),custom_directives:A(p.customDirectives),ai_persona:S(p.aiPersonaInstructions)},
content_strategy:{pillars:(Array.isArray(cd.pillars)?cd.pillars:[]).filter(x=>x&&bbxHas(x.name)).map(x=>({name:S(x.name),share_pct:N(x.percentage),description:S(x.description)})),ratio:{awareness:N(cr.awareness),education:ed,engagement:eg,conversion:N(cr.conversion),loyalty:N(cr.loyalty)},campaigns:cat(2),copy_library:cat(3)},
funnel:{stages:[
st("awareness","TOFU","Awareness","Dikenal dan menghentikan scroll audiens yang belum kenal brand.","Belum kenal brand; baru sadar punya masalah (problem-aware).",["reach","views","saves","shares","follower baru"],{pain_points:A(ps.painPoints),fears:A(ps.fears),scroll_stoppers:S(cb.scrollStoppers),comment_triggers:S(cb.commentTriggers),signature_stories:A(bm.signatureStories)},fc.awareness),
st("consideration","MOFU","Consideration","Membangun kepercayaan dan membuktikan brand layak dipilih dibanding alternatif.","Sudah paham masalahnya dan sedang membandingkan solusi (solution-aware).",["engagement rate","profile visit","link click","DM masuk","watch time"],{desires:A(ps.desires),usp:S(p.usp),differentiator:S(pos.unlike),positioning_statement:S(pos.statement),competitor_weakness:S(cc.competitorWeakness),hard_proof_points:A(pf.hardProofPoints),values:A(p.values)},fc.consideration),
st("conversion","BOFU","Conversion","Mengubah calon pembeli menjadi lead atau pembeli.","Siap membeli tapi masih ragu atau punya keberatan (product-aware).",["CTR","lead","checkout / penjualan","conversion rate","CPA"],{main_offer:S(of.mainOffer),entry_offer:S(of.entryOffer),price_range:S(of.priceRange),risk_reversal:S(of.riskReversal),purchase_path:S(of.purchasePath),objections:A(ps.objections),purchase_triggers:S(cb.purchaseTriggers),case_transformations:A(pf.caseTransformations),customer_voice:A(pf.customerVoiceRaw),catalog_blocks:cat(0),faq_blocks:cat(1)},fc.conversion||p.cta),
st("retention","RETENTION","Retention & Advocacy","Menjaga pelanggan tetap aktif, puas, dan mau merekomendasikan.","Sudah menjadi pelanggan atau pengguna.",["repeat purchase","referral","UGC","churn","NPS"],{customer_voice:A(pf.customerVoiceRaw),mission:S(p.mission),vision:S(p.vision)},fc.retention)]},
knowledge:{notes:S(p.customKnowledge),other_blocks:other}};
if(blank){(out as any).readme="Template kosong skema konektor Ruang Konten. Struktur key selalu sama pada file yang berisi data, jadi app standalone bisa membaca tanpa cek key hilang. Field kosong bernilai \"\", [] atau null.";(out as any).field_guide=bbxGuide}return out};
const bbxBuild=(p: any,sel: any,o: any,fmt: any)=>{if(fmt==="connector"||fmt==="template")return{text:JSON.stringify(bbxConn(p,fmt==="template",o),null,2),ext:"json",mime:"application/json;charset=utf-8"};const f=bbxFmts.find(x=>x.id===fmt)||bbxFmts[0],d=new Date().toLocaleDateString("en-CA"),score=Qb(p as any).score,meta=o.meta?"Diekspor dari Ruang Konten · "+d+" · Kelengkapan "+score+"%":"";let text="";if(fmt==="json"){const out: any = { type: "brand-brain-export", version: 1 };if(o.meta){out.exportedAt=new Date().toISOString();out.completeness=score}out.brand=bbxPick(p,sel,o);text=JSON.stringify(out,null,2)}else if(fmt==="prompt"){const part: any=bbxPick(p,sel,o);if(Array.isArray(part.customBlocks))part.customBlocks=part.customBlocks.map((x: any)=>({...x,isActive:!0}));text=(meta?"["+meta+"]\n":"")+ot(part as any).trim()+"\n"}else{const nodes=bbxNodes(p,sel,o);text=fmt==="md"?bbxMd(nodes,(p.name||"Brand")+" - Brand Brain",meta):bbxHtml(nodes,p,meta)}return{text,ext:f.ext,mime:f.mime}};


const bbxPanel=({brand:p,onNotify:j})=>{const h=bbxH,[fmt,setFmt]=G.useState("prompt"),[sel,setSel]=G.useState(()=>{const o={};bbxSecs.forEach(s=>{o[s.id]=!!s.lock||bbxFilled(s,p)});return o}),[onlyActive,setOA]=G.useState(!0),[meta,setMeta]=G.useState(!0),[addDate,setAD]=G.useState(!0),[fname,setFname]=G.useState(""),[copied,setCopied]=G.useState(!1),opts={onlyActive,meta},out=G.useMemo(()=>bbxBuild(p,sel,opts,fmt),[p,sel,onlyActive,meta,fmt]),slug=x=>String(x||"").toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,""),base=slug(fname)||(fmt==="template"?"brand-brain-connector-template":slug(p.name||"brand")+"-brand-brain"+(fmt==="connector"?"-connector":"")),file=base+(addDate?"-"+new Date().toLocaleDateString("en-CA"):"")+"."+out.ext,total=bbxSecs.length,picked=bbxSecs.filter(s=>s.lock||sel[s.id]).length,words=out.text.trim().split(/\s+/).filter(Boolean).length,kb=(new Blob([out.text]).size/1024).toFixed(1),toggle=id=>setSel(o=>({...o,[id]:!o[id]})),preset=k=>setSel(()=>{const o={};bbxSecs.forEach(s=>{o[s.id]=!!s.lock||(k==="all"?!0:k==="filled"?bbxFilled(s,p):["positioning","voice","memory","directives"].includes(s.id))});return o}),doDownload=()=>{gt(file, out.text, out.mime);j&&j('File "'+file+'" berhasil diunduh.',"success")},doCopy=()=>{Oa(out.text).then(ok=>{if(ok){setCopied(!0);setTimeout(()=>setCopied(!1),2e3);j&&j("Hasil ekspor disalin ke clipboard.","success")}else j&&j("Gagal menyalin. Coba unduh sebagai file.","error")})},noEnter=e=>{e.key==="Enter"&&e.preventDefault()},cur=bbxFmts.find(x=>x.id===fmt),fixedSchema=fmt==="connector"||fmt==="template",blocksOn=sel.blocks,mkBtn=(cls,onClick,ic,txt)=>h("button",{type:"button",onClick,className:"bbx-btn "+cls},ic,h("span",null,txt));
return h("div",{className:"bbx"},
h("div",{className:"bbx-note"},h("span",null,"ℹ️"),h("span",null,"Ekspor memakai isi form saat ini, termasuk perubahan yang belum kamu simpan. Pilih format, pilih bagian yang mau ikut, lalu unduh atau salin.")),
h("div",{className:"bbx-card"},h("div",{className:"bbx-h"},h("span",null,"1. Format Ekspor"),h("span",{className:"bbx-hint"},"Pilih satu")),
h("div",{className:"bbx-fmts"},bbxFmts.map(f=>h("button",{key:f.id,type:"button",onClick:()=>setFmt(f.id),className:"bbx-fmt"+(fmt===f.id?" on":"")},h("b",null,f.icon+" "+f.name,h("span",{className:"bbx-ext"},"."+f.ext)),h("span",null,f.desc))))),
h("div",{className:"bbx-card"+(fixedSchema?" bbx-dim":"")},h("div",{className:"bbx-h"},h("span",null,"2. Bagian yang Diekspor"),h("span",{className:"bbx-hint"},fixedSchema?"Format ini selalu memuat skema lengkap":picked+" dari "+total+" bagian dipilih")),
h("div",{className:"bbx-row",style:{marginBottom:"0.75rem"}},h("span",{className:"bbx-hint"},"Preset cepat:"),mkBtn("bbx-ghost",()=>preset("filled"),null,"Hanya yang terisi"),mkBtn("bbx-ghost",()=>preset("short"),null,"Ringkas (voice & guardrails)"),mkBtn("bbx-ghost",()=>preset("all"),null,"Pilih semua")),
h("div",{className:"bbx-secs"},bbxSecs.map(s=>{const on=!!(s.lock||sel[s.id]),fl=bbxFilled(s,p);return h("label",{key:s.id,className:"bbx-sec"+(on?" on":"")+(s.lock?" lock":"")},h("input",{type:"checkbox",checked:on,disabled:!!s.lock,onChange:()=>toggle(s.id)}),h("span",null,s.icon),h("span",null,s.label+(s.lock?" (wajib)":"")),h("small",{className:fl?"bbx-ok":"bbx-no"},fl?"Terisi":"Kosong"))}))),
h("div",{className:"bbx-card"},h("div",{className:"bbx-h"},h("span",null,"3. Opsi & Nama File")),
h("div",{className:"bbx-opts"},
h("label",{className:"bbx-chk"},h("input",{type:"checkbox",checked:meta,onChange:e=>setMeta(e.target.checked)}),h("span",null,"Sertakan info ekspor (tanggal & kelengkapan)")),
h("label",{className:"bbx-chk"+(blocksOn?"":" off")},h("input",{type:"checkbox",checked:onlyActive,disabled:!blocksOn,onChange:e=>setOA(e.target.checked)}),h("span",null,"Blok acuan aktif saja")),
h("label",{className:"bbx-chk"},h("input",{type:"checkbox",checked:addDate,onChange:e=>setAD(e.target.checked)}),h("span",null,"Tambahkan tanggal di nama file"))),
h("div",{className:"bbx-row",style:{marginTop:"0.9rem"}},h("input",{type:"text",value:fname,onChange:e=>setFname(e.target.value),onKeyDown:noEnter,placeholder:slug(p.name||"brand")+"-brand-brain",className:"bbx-input",style:{flex:"1 1 220px"}}),h("span",{className:"bbx-hint"},"Nama file: ",h("b",{style:{color:"#142620"}},file)))),
h("div",{className:"bbx-card"},h("div",{className:"bbx-h"},h("span",null,"Pratinjau & Ekspor"),h("span",{className:"bbx-hint"},out.text.length.toLocaleString()+" karakter · ~"+words.toLocaleString()+" kata · "+kb+" KB")),
h("div",{className:"bbx-row",style:{marginBottom:"0.75rem"}},mkBtn("bbx-primary",doDownload,h(jn,{className:"w-3.5 h-3.5"}),"Unduh "+cur.name+" (."+out.ext+")"),mkBtn("bbx-ghost",doCopy,copied?h(ut,{className:"w-3.5 h-3.5"}):h(_a,{className:"w-3.5 h-3.5"}),copied?"Tersalin!":"Salin ke Clipboard")),
fmt==="html"?h("iframe",{className:"bbx-frame",title:"Pratinjau Brand Sheet",sandbox:"",srcDoc:out.text}):h("pre",{className:"bbx-pre"},out.text))
)};
const bbsKey="ruang-konten-shortcuts-v1",bbsDefCats=["Visual","Video","Konten","Utilities"],bbsDef=[
{id:"feed",name:"Konsep Feed & Grid",cat:"Visual",icon:"🖼️",url:"",thumb:"",desc:"Pengaturan Visual & Grid",pro:!1},
{id:"carousel",name:"Slide Carousel",cat:"Visual",icon:"🎞️",url:"",thumb:"",desc:"Pengaturan Slide Berseri",pro:!1},
{id:"story",name:"Storyboard Video",cat:"Video",icon:"🎬",url:"",thumb:"",desc:"Pengaturan Reels & TikTok",pro:!1},
{id:"kol",name:"Brief KOL & Kreator",cat:"Konten",icon:"🤝",url:"",thumb:"",desc:"Pengaturan Brief Kreator",pro:!1},
{id:"threads",name:"Studio Threads",cat:"Konten",icon:"🧵",url:"",thumb:"",desc:"Pengaturan Utas Teks",pro:!1}];
const bbsLoad=()=>{try{const r=JSON.parse(localStorage.getItem(bbsKey)||"null");if(r&&Array.isArray(r.items))return{items:r.items,cats:Array.isArray(r.cats)&&r.cats.length?r.cats:bbsDefCats}}catch{}return{items:bbsDef,cats:bbsDefCats}};
const bbsSave=d=>{try{localStorage.setItem(bbsKey,JSON.stringify(d));return!0}catch{return!1}};
const bbsUrl=u=>{u=String(u||"").trim();if(!u)return"";/^https?:\/\//i.test(u)||(u="https://"+u);try{return new URL(u).href}catch{return""}};
const bbsShrink=file=>new Promise((res,rej)=>{const fr=new FileReader;fr.onerror=()=>rej(new Error("read"));fr.onload=()=>{const im=new Image;im.onerror=()=>rej(new Error("img"));im.onload=()=>{const s=Math.min(1,800/im.width),c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.width*s));c.height=Math.max(1,Math.round(im.height*s));c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.82))};im.src=fr.result as string};fr.readAsDataURL(file)});
const bbsForm=({init,isNew,cats,onCats,onSave,onDelete,onClose})=>{const h=bbxH,[d,setD]=G.useState({name:init.name||"",cat:init.cat||"",url:init.url||"",thumb:init.thumb||"",desc:init.desc||"",pro:!!init.pro}),[mode,setMode]=G.useState(init.thumb&&/^https?:/i.test(init.thumb)?"url":"upload"),[catMgr,setCatMgr]=G.useState(!1),[newCat,setNewCat]=G.useState(""),[err,setErr]=G.useState(""),set=(k,v)=>setD(o=>({...o,[k]:v})),pick=async f=>{if(!f)return;if(!/^image\/(png|jpe?g|webp)$/i.test(f.type)){setErr("Format harus JPG, PNG, atau WEBP.");return}if(f.size>5*1024*1024){setErr("Ukuran gambar maksimal 5MB.");return}try{set("thumb",await bbsShrink(f));setErr("")}catch{setErr("Gambar tidak bisa dibaca.")}},addCat=()=>{const v=newCat.trim();if(!v||cats.includes(v))return;onCats([...cats,v]);set("cat",v);setNewCat("")},submit=e=>{e.preventDefault();if(!d.name.trim()){setErr("Nama alat wajib diisi.");return}const raw=d.url.trim(),u=bbsUrl(raw);if(raw&&!u){setErr("URL aplikasi tidak valid.");return}let th=d.thumb;if(mode==="url"&&th&&!/^data:/.test(th)){th=bbsUrl(th);if(!th){setErr("URL thumbnail tidak valid.");return}}onSave({...init,name:d.name.trim(),cat:d.cat,url:u,thumb:th,desc:d.desc.trim(),pro:d.pro})};
return h("div",{className:"bbs-ov",onMouseDown:e=>{e.target===e.currentTarget&&onClose()}},
h("form",{className:"bbs-modal",onSubmit:submit},
h("div",{className:"bbs-top"},h("h3",null,isNew?"Tambah Alat Baru":"Edit Detail Alat: "+(init.name||"")),h("button",{type:"button",className:"bbs-x",onClick:onClose,"aria-label":"Tutup"},"✕")),
h("label",{className:"bbs-l"},"Nama Alat"),
h("input",{className:"bbs-in",value:d.name,onChange:e=>set("name",e.target.value),placeholder:"cth: Tikar"}),
h("div",{className:"bbs-lr"},h("label",{className:"bbs-l"},"Kategori Alat ",h("span",{className:"bbs-op"},"(Opsional)")),h("button",{type:"button",className:"bbs-lk",onClick:()=>setCatMgr(v=>!v)},"🏷 Pengaturan Kategori")),
h("select",{className:"bbs-in",value:d.cat,onChange:e=>set("cat",e.target.value)},h("option",{value:""},"Tanpa kategori"),cats.map(c=>h("option",{key:c,value:c},c))),
catMgr&&h("div",{className:"bbs-cm"},h("div",{className:"bbs-chips"},cats.map(c=>h("span",{key:c,className:"bbs-chip"},c,h("button",{type:"button",title:"Hapus kategori",onClick:()=>{onCats(cats.filter(x=>x!==c));d.cat===c&&set("cat","")}},"✕")))),h("div",{className:"bbs-cadd"},h("input",{className:"bbs-in",value:newCat,placeholder:"Kategori baru",onChange:e=>setNewCat(e.target.value),onKeyDown:e=>{e.key==="Enter"&&(e.preventDefault(),addCat())}}),h("button",{type:"button",className:"bbs-b2",onClick:addCat},"Tambah"))),
h("label",{className:"bbs-l"},"URL Aplikasi"),
h("input",{className:"bbs-in",value:d.url,onChange:e=>set("url",e.target.value),placeholder:"https://..."}),
h("div",{className:"bbs-lr",style:{marginTop:"16px"}},h("label",{className:"bbs-l",style:{margin:0}},"🖼 Thumbnail Alat"),h("div",{className:"bbs-seg"},h("button",{type:"button",className:mode==="upload"?"on":"",onClick:()=>setMode("upload")},"⬆ Upload File"),h("button",{type:"button",className:mode==="url"?"on":"",onClick:()=>setMode("url")},"🔗 Tautan URL"))),
mode==="upload"?h("label",{className:"bbs-drop",onDragOver:e=>e.preventDefault(),onDrop:e=>{e.preventDefault();pick(e.dataTransfer.files&&e.dataTransfer.files[0])}},h("input",{type:"file",accept:"image/png,image/jpeg,image/webp",style:{display:"none"},onChange:e=>{pick(e.target.files&&e.target.files[0]);e.target.value=""}}),d.thumb?h("img",{src:d.thumb,alt:"Thumbnail"}):h("span",{className:"bbs-dh"},"Klik atau seret gambar ke sini")):h("div",{className:"bbs-drop"},h("input",{className:"bbs-in",value:/^data:/.test(d.thumb)?"":d.thumb,placeholder:"https://contoh.com/gambar.jpg",onChange:e=>set("thumb",e.target.value)}),d.thumb&&!/^data:/.test(d.thumb)&&h("img",{src:d.thumb,alt:"Thumbnail",style:{marginTop:"10px"}})),
d.thumb&&h("div",{className:"bbs-ts"},h("span",{className:"ok"},"✓ Gambar Terpasang"),h("button",{type:"button",onClick:()=>set("thumb","")},"Hapus")),
h("p",{className:"bbs-h"},"Unggah file gambar dari komputer (JPG, PNG, WEBP max 5MB) atau masukkan tautan URL gambar."),
h("label",{className:"bbs-l"},"Deskripsi Singkat"),
h("textarea",{className:"bbs-in",rows:2,value:d.desc,onChange:e=>set("desc",e.target.value)}),
err&&h("p",{className:"bbs-err"},err),
h("div",{className:"bbs-ft"},h("label",{className:"bbs-pro"},h("input",{type:"checkbox",checked:d.pro,onChange:e=>set("pro",e.target.checked)}),h("span",null,"Tandai Khusus Member PRO")),h("div",{className:"bbs-fb"},!isNew&&h("button",{type:"button",className:"bbs-del",onClick:()=>{window.confirm('Hapus shortcut "'+init.name+'"?')&&onDelete()}},"Hapus"),h("button",{type:"button",className:"bbs-b2",onClick:onClose},"Batal"),h("button",{type:"submit",className:"bbs-b1"},"Simpan")))))};
const bbsShortcuts=({brand})=>{const h=bbxH,[data,setData]=G.useState(bbsLoad),[edit,setEdit]=G.useState(null),[msg,setMsg]=G.useState(""),flash=t=>{setMsg(t);setTimeout(()=>setMsg(""),2400)},commit=x=>{setData(x);bbsSave(x)||flash("Gagal menyimpan: penyimpanan browser penuh.")},go=it=>{it.url?window.open(it.url,"_blank","noopener"):setEdit({item:it})},mk=()=>{const o={};bbxSecs.forEach(s=>o[s.id]=!0);return bbxBuild(brand||{},o,{onlyActive:!0,meta:!0},"connector").text},dl=()=>{const nm=String(brand&&brand.name||"brand").toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"")||"brand";gt(nm+"-brand-brain-connector-"+new Date().toLocaleDateString("en-CA")+".json",mk(),"application/json;charset=utf-8");flash("Brand Brain JSON diunduh.")},tp=()=>{gt("brand-brain-connector-template.json",bbxBuild({},{},{},"template").text,"application/json;charset=utf-8");flash("Template kosong diunduh.")},cp=()=>{Oa(mk()).then(ok=>flash(ok?"Brand Brain JSON disalin.":"Gagal menyalin."))};
return h("div",null,
h("div",{className:"px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#819287] flex items-center justify-between"},h("span",null,"App Standalone"),h("span",{className:"text-[9px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200"},"Shortcut")),
h("nav",{className:"space-y-1"},data.items.map(it=>h("div",{key:it.id,className:"bbs-item"},
h("button",{type:"button",className:"bbs-main",onClick:()=>go(it),title:it.url||"URL belum diatur"},it.thumb?h("img",{className:"bbs-th",src:it.thumb,alt:""}):h("span",{className:"bbs-th bbs-em"},it.icon||"🧩"),h("span",{className:"bbs-txt"},h("b",null,it.name,it.pro&&h("em",{className:"bbs-pro-b"},"PRO")),h("small",null,it.url?(it.desc||it.cat||""):"Klik untuk mengatur URL")),it.url&&h("span",{className:"bbs-ext"},"↗")),
h("button",{type:"button",className:"bbs-edit",onClick:()=>setEdit({item:it}),title:"Edit detail alat"},"✎"))),
h("button",{type:"button",className:"bbs-add",onClick:()=>setEdit({item:{id:"t-"+Date.now(),name:"",cat:"",url:"",thumb:"",desc:"",pro:!1},isNew:!0})},"+ Tambah Alat")),
h("div",{className:"bbs-conn"},h("div",{className:"bbs-ct"},"🔗 Sambungkan Brand Brain"),h("div",{className:"bbs-cb"},h("button",{type:"button",onClick:dl},"⬇ JSON"),h("button",{type:"button",onClick:cp},"Salin"),h("button",{type:"button",onClick:tp,title:"Template kosong + panduan field"},"Template")),h("small",null,"JSON Konektor Funnel untuk dibaca app standalone."),msg&&h("div",{className:"bbs-msg"},msg)),
edit&&h(bbsForm,{key:edit.item.id,init:edit.item,isNew:!!edit.isNew,cats:data.cats,onCats:c=>commit({...data,cats:c}),onClose:()=>setEdit(null),onSave:v=>{const ex=data.items.some(x=>x.id===v.id);commit({...data,items:ex?data.items.map(x=>x.id===v.id?v:x):[...data.items,v]});setEdit(null)},onDelete:()=>{commit({...data,items:data.items.filter(x=>x.id!==edit.item.id)});setEdit(null)}}))};

const bbmDate=()=>new Date().toLocaleDateString("en-CA"),bbmSlug=x=>String(x||"").toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"")||"brand";
const bbxMenu=({brand:p,onNotify:j,onMore})=>{const h=bbxH,[open,setOpen]=G.useState(!1),ref=G.useRef(null);G.useEffect(()=>{if(!open)return;const f=e=>{ref.current&&!ref.current.contains(e.target)&&setOpen(!1)},k=e=>{e.key==="Escape"&&setOpen(!1)};document.addEventListener("mousedown",f);document.addEventListener("keydown",k);return()=>{document.removeEventListener("mousedown",f);document.removeEventListener("keydown",k)}},[open]);
const all=()=>{const o={};bbxSecs.forEach(s=>o[s.id]=!0);return o},O={onlyActive:!0,meta:!0},nm=bbmSlug(p&&p.name),mk=fmt=>bbxBuild(p||{},all(),O,fmt),
dl=fmt=>{const r=mk(fmt),name=(fmt==="template"?"brand-brain-connector-template":nm+"-brand-brain"+(fmt==="connector"?"-connector":""))+"-"+bbmDate()+"."+r.ext;gt(name, r.text, r.mime);setOpen(!1);j&&j('"'+name+'" berhasil diunduh.',"success")},
cp=fmt=>{Oa(mk(fmt).text).then(ok=>{setOpen(!1);j&&j(ok?"JSON disalin ke clipboard.":"Gagal menyalin.",ok?"success":"error")})},
it=(ic,t,s,on)=>h("button",{type:"button",className:"bbm-it",onClick:on},h("span",{className:"bbm-ic"},ic),h("span",{className:"bbm-tx"},h("b",null,t),h("small",null,s)));
return h("div",{className:"bbm",ref},
h("button",{type:"button",onClick:()=>setOpen(v=>!v),"aria-expanded":open,className:"px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#205c49] border border-[#cfded1] text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs",title:"Export Brand Brain"},h(jn,{className:"w-3.5 h-3.5"}),h("span",null,"Export"),h("span",{style:{fontSize:"9px"}},"▾")),
open&&h("div",{className:"bbm-menu"},
h("div",{className:"bbm-g"},"Berisi (data saat ini)"),
it("🔌","Konektor Funnel (.json)","Untuk app standalone, tersusun per tahap funnel.",()=>dl("connector")),
it("📋","Salin Konektor Funnel","Salin JSON berisi ke clipboard.",()=>cp("connector")),
it("🗄️","Backup JSON (.json)","Data lengkap, bisa diimpor kembali ke Brand Brain.",()=>dl("json")),
it("🧠","Prompt AI (.md)","Teks acuan siap tempel ke AI.",()=>dl("prompt")),
h("div",{className:"bbm-sep"}),
h("div",{className:"bbm-g"},"Kosong"),
it("📄","Template Kosong (.json)","Skema konektor tanpa isi + panduan tiap field.",()=>dl("template")),
it("📋","Salin Template Kosong","Salin template ke clipboard.",()=>cp("template")),
h("div",{className:"bbm-sep"}),
it("⚙️","Form Export Lengkap…","Pilih format, bagian, dan nama file.",()=>{setOpen(!1);onMore&&onMore()})))};
const bbiSpec={name:"s",category:"s",product:"s",brandPromise:"s",mission:"s",vision:"s",values:"a",audience:"s",tone:"s",usp:"s",cta:"s",color:"s",website:"s",instagramHandle:"s",
platformAccounts:{instagram:"s",tiktok:"s",threads:"s",linkedin:"s",youtube:"s",facebook:"s"},
audienceDNA:{primary:"s",demographics:{age:"s",gender:"s",location:"s",occupation:"s",lifestyle:"s",purchasingPower:"s"},psychographics:{painPoints:"a",desires:"a",fears:"a",objections:"a"},contentBehavior:{scrollStoppers:"s",commentTriggers:"s",purchaseTriggers:"s"}},
positioning:{weAre:"s",forAudience:"s",whoNeed:"s",becauseWhy:"s",unlike:"s",statement:"s"},
personalityVoice:{spectrum:{formality:"n",playfulness:"n",approach:"n",positioningTier:"n",energy:"n"},humanPersona:"s",voiceDo:"a",voiceDont:"a",signatureWords:"a",forbiddenWords:"a"},
competitorContext:{directCompetitors:"a",indirectCompetitors:"a",competitorWeakness:"s",whatWeWillNeverDo:"a"},
offerConversionDNA:{mainOffer:"s",entryOffer:"s",priceRange:"s",riskReversal:"s",purchasePath:"s"},
proofCredibility:{hardProofPoints:"a",caseTransformations:"a",customerVoiceRaw:"a"},
visualDNA:{palette:{primary:"s",secondary:"s",accent:"s",background:"s"},photographyStyle:"a",visualDoNotUse:"a"},
contentDNA:{pillars:"p",contentRatio:{awareness:"n",education:"n",engagement:"n",conversion:"n",loyalty:"n"},funnelCTA:{awareness:"s",consideration:"s",conversion:"s",retention:"s"}},
brandMemory:{alwaysSay:"a",neverSay:"a",signatureStories:"a",claimsGuardrail:{allowed:"a",forbidden:"a"}},
customDirectives:"a",customBlocks:"b",customKnowledge:"s",aiPersonaInstructions:"s"};
const bbiObj=v=>v&&typeof v=="object"&&!Array.isArray(v);
const bbiNum=v=>typeof v=="number"&&isFinite(v)?v:typeof v=="string"&&v.trim()!==""&&isFinite(+v)?+v:void 0;
const bbiStr=v=>typeof v=="string"?v:typeof v=="number"?String(v):Array.isArray(v)?v.filter(x=>x!=null).map(String).join("\n"):"";
const bbiCo=(sp: any,v: any,i?: any): any=>{if(sp==="s")return bbiStr(v);if(sp==="n")return bbiNum(v);if(sp==="a")return Array.isArray(v)?v.filter(x=>x!=null&&String(x).trim()!=="").map(x=>typeof x=="string"?x:String(x)):typeof v=="string"&&v.trim()?v.split(/\n+/).map(x=>x.trim()).filter(Boolean):[];
if(sp==="p")return(Array.isArray(v)?v:[]).filter(x=>bbiObj(x)&&bbiStr(x.name).trim()).map(x=>({name:bbiStr(x.name),percentage:bbiNum(x.percentage)||0,description:bbiStr(x.description)}));
if(sp==="b")return(Array.isArray(v)?v:[]).filter(x=>bbiObj(x)&&bbiStr(x.content).trim()).map((x,n)=>({id:bbiStr(x.id)||"imp-"+Date.now()+"-"+n,title:bbiStr(x.title)||"Blok Acuan",category:bbiStr(x.category),content:bbiStr(x.content),isActive:x.isActive!==!1}));
const o: any={};if(!bbiObj(v))return o;Object.keys(sp).forEach(k=>{const r=bbiCo(sp[k],v[k]);r!==void 0&&(o[k]=r)});return o};
const bbiFromConn=d=>{const st=id=>((d.funnel&&d.funnel.stages)||[]).find(x=>x&&x.id===id)||{},sm=id=>st(id).source_material||{},b=d.brand||{},pl=b.platforms||{},po=d.positioning||{},ap=d.audience_profile||{},dm=ap.demographics||{},cp=d.competition||{},v=d.voice||{},sp=v.spectrum||{},vi=d.visual||{},pal=vi.palette||{},gr=d.guardrails||{},cs=d.content_strategy||{},ra=cs.ratio||{},kn=d.knowledge||{},aw=sm("awareness"),co=sm("consideration"),cv=sm("conversion"),re=sm("retention"),first=(...x)=>x.find(y=>y!=null&&(Array.isArray(y)?y.length:String(y).trim()!=="")),L=x=>Array.isArray(x)?x:[];
return{name:b.name,category:b.category,product:b.product,brandPromise:b.promise,mission:b.mission,vision:b.vision,values:b.values,audience:ap.summary,tone:v.tone,usp:co.usp,cta:b.cta_default,color:b.primary_color,website:b.website,instagramHandle:pl.instagram,platformAccounts:{instagram:pl.instagram,tiktok:pl.tiktok,threads:pl.threads,linkedin:pl.linkedin,youtube:pl.youtube,facebook:pl.facebook},
audienceDNA:{primary:ap.primary,demographics:{age:dm.age,gender:dm.gender,location:dm.location,occupation:dm.occupation,lifestyle:dm.lifestyle,purchasingPower:dm.purchasing_power},psychographics:{painPoints:aw.pain_points,desires:co.desires,fears:aw.fears,objections:cv.objections},contentBehavior:{scrollStoppers:aw.scroll_stoppers,commentTriggers:aw.comment_triggers,purchaseTriggers:cv.purchase_triggers}},
positioning:{weAre:po.we_are,forAudience:po.for_audience,whoNeed:po.who_need,becauseWhy:po.because,unlike:first(po.unlike,co.differentiator),statement:first(po.statement,co.positioning_statement)},
personalityVoice:{spectrum:{formality:sp.casual,playfulness:sp.playful,approach:sp.friendly,positioningTier:sp.positioning_tier,energy:sp.bold},humanPersona:v.persona,voiceDo:v.do,voiceDont:v.dont,signatureWords:v.signature_words,forbiddenWords:v.forbidden_words},
competitorContext:{directCompetitors:cp.direct,indirectCompetitors:cp.indirect,competitorWeakness:first(cp.weakness,co.competitor_weakness),whatWeWillNeverDo:cp.never_do},
offerConversionDNA:{mainOffer:cv.main_offer,entryOffer:cv.entry_offer,priceRange:cv.price_range,riskReversal:cv.risk_reversal,purchasePath:cv.purchase_path},
proofCredibility:{hardProofPoints:co.hard_proof_points,caseTransformations:cv.case_transformations,customerVoiceRaw:first(cv.customer_voice,re.customer_voice)},
visualDNA:{palette:{primary:pal.primary,secondary:pal.secondary,accent:pal.accent,background:pal.background},photographyStyle:vi.photography_style,visualDoNotUse:vi.avoid},
contentDNA:{pillars:L(cs.pillars).map(x=>({name:x&&x.name,percentage:x&&x.share_pct,description:x&&x.description})),contentRatio:{awareness:ra.awareness,education:ra.education,engagement:ra.engagement,conversion:ra.conversion,loyalty:ra.loyalty},funnelCTA:{awareness:st("awareness").cta,consideration:st("consideration").cta,conversion:st("conversion").cta,retention:st("retention").cta}},
brandMemory:{alwaysSay:gr.always_say,neverSay:gr.never_say,signatureStories:aw.signature_stories,claimsGuardrail:{allowed:gr.claims_allowed,forbidden:gr.claims_forbidden}},
customDirectives:gr.custom_directives,aiPersonaInstructions:gr.ai_persona,customKnowledge:kn.notes,customBlocks:[...L(cv.catalog_blocks),...L(cv.faq_blocks),...L(cs.campaigns),...L(cs.copy_library),...L(kn.other_blocks)]}};
const bbiParse=text=>{let d;try{d=JSON.parse(String(text).replace(/^\uFEFF/,""))}catch{throw new Error("Isi bukan JSON yang valid. Pastikan file utuh dan tidak terpotong.")}
if(!bbiObj(d))throw new Error("JSON harus berupa objek Brand Brain.");let kind,label,raw;
if(d.schema==="brand-brain-connector"){kind="connector";label="Konektor Funnel";raw=bbiFromConn(d)}
else if(d.type==="brand-brain-export"&&bbiObj(d.brand)){kind="backup";label="Backup JSON";raw=d.brand}
else{const c=[d.brand,d.data,d.dna,d].find(x=>bbiObj(x)&&Object.keys(bbiSpec).some(k=>k in x));if(!c)throw new Error("Format tidak dikenali. Gunakan Backup JSON atau Konektor Funnel dari menu Export.");kind="generic";label="JSON Brand Brain";raw=c}
const brand=bbiCo(bbiSpec,raw);Object.keys(brand).forEach(k=>{bbxHas(brand[k])||delete brand[k]});
if(!Object.keys(brand).length)throw new Error(kind==="connector"?"File ini masih template kosong, belum ada isinya.":"File tidak berisi data Brand Brain.");
return{kind,label,brand,exportedAt:typeof d.exportedAt=="string"?d.exportedAt:typeof d.exported_at=="string"?d.exported_at:"",completeness:typeof d.completeness=="number"?d.completeness:typeof d.completeness_pct=="number"?d.completeness_pct:null}};
const bbiCount=v=>Array.isArray(v)?v.filter(bbxHas).length:bbiObj(v)?Object.values(v).reduce((a,x)=>a+bbiCount(x),0):bbxHas(v)?1:0;
const bbiMv=(cur,inc,mode)=>{if(!bbxHas(inc))return cur;if(bbiObj(inc)){const r=bbiObj(cur)?{...cur}:{};Object.keys(inc).forEach(k=>{const x=bbiMv(r[k],inc[k],mode);x!==void 0&&(r[k]=x)});return r}return mode==="fill"&&bbxHas(cur)?cur:inc};
const bbiApply=(p,brand,keys,mode)=>{const r={...p};keys.forEach(k=>{if(!(k in brand))return;if(k==="customBlocks"){const c=Array.isArray(p.customBlocks)?p.customBlocks:[],same=(a,b)=>a.title===b.title&&a.category===b.category;r.customBlocks=mode==="fill"?[...c,...brand.customBlocks.filter(b=>!c.some(x=>same(x,b)))]:[...c.filter(x=>!brand.customBlocks.some(b=>same(x,b))),...brand.customBlocks]}else r[k]=bbiMv(p[k],brand[k],mode)});return r};
const bbxImportBtn=({brand:p,onApply,onNotify:j})=>{const h=bbxH,[open,setOpen]=G.useState(!1),[text,setText]=G.useState(""),[fn,setFn]=G.useState(""),[res,setRes]=G.useState(null),[err,setErr]=G.useState(""),[sel,setSel]=G.useState({}),[mode,setMode]=G.useState("replace"),
reset=()=>{setText("");setFn("");setRes(null);setErr("");setSel({});setMode("replace")},close=()=>{setOpen(!1);reset()},
analyze=(t,name)=>{try{const r=bbiParse(t),o={};bbxSecs.forEach(s=>{o[s.id]=s.keys.some(k=>bbxHas(r.brand[k]))});setRes(r);setSel(o);setErr("");setFn(name||fn)}catch(e){setRes(null);setErr(e.message||"Gagal membaca file.")}},
onFile=f=>{if(!f)return;if(f.size>5*1024*1024){setErr("Ukuran file maksimal 5MB.");return}const fr=new FileReader;fr.onerror=()=>setErr("File tidak bisa dibaca.");fr.onload=()=>analyze(String(fr.result||""),f.name);fr.readAsText(f)},
keys=res?bbxSecs.filter(s=>sel[s.id]).flatMap(s=>s.keys).filter(k=>k in res.brand):[],
doApply=()=>{if(!res||!keys.length)return;onApply(cur=>bbiApply(cur,res.brand,keys,mode));j&&j("Brand Brain dari file diterapkan ke form. Klik Simpan Brand Brain untuk menyimpan.","success");close()};
return h("div",{className:"bbm"},
h("button",{type:"button",onClick:()=>setOpen(!0),className:"px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#205c49] border border-[#cfded1] text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs",title:"Import Brand Brain dari file JSON"},h("span",{style:{fontSize:"11px"}},"⬆"),h("span",null,"Import")),
open&&h("div",{className:"bbs-ov",onMouseDown:e=>{e.target===e.currentTarget&&close()}},
h("div",{className:"bbs-modal bbi-modal"},
h("div",{className:"bbs-top"},h("h3",null,"Import Brand Brain"),h("button",{type:"button",className:"bbs-x",onClick:close,"aria-label":"Tutup"},"✕")),
!res?h("div",null,
h("p",{className:"bbs-h",style:{margin:"6px 0 10px"}},"Terima Backup JSON, Konektor Funnel, atau template yang sudah kamu isi. Isinya diperiksa dulu sebelum masuk ke form."),
h("label",{className:"bbs-drop",onDragOver:e=>e.preventDefault(),onDrop:e=>{e.preventDefault();onFile(e.dataTransfer.files&&e.dataTransfer.files[0])}},h("input",{type:"file",accept:".json,application/json",style:{display:"none"},onChange:e=>{onFile(e.target.files&&e.target.files[0]);e.target.value=""}}),h("span",{className:"bbs-dh"},"Klik atau seret file .json ke sini")),
h("label",{className:"bbs-l"},"Atau tempel isi JSON"),
h("textarea",{className:"bbs-in",rows:5,value:text,onChange:e=>setText(e.target.value),placeholder:'{ "schema": "brand-brain-connector", ... }',style:{fontFamily:"ui-monospace,monospace",fontSize:"11px"}}),
err&&h("p",{className:"bbs-err"},err),
h("div",{className:"bbs-ft",style:{justifyContent:"flex-end"}},h("div",{className:"bbs-fb"},h("button",{type:"button",className:"bbs-b2",onClick:close},"Batal"),h("button",{type:"button",className:"bbs-b1",disabled:!text.trim(),style:text.trim()?null:{opacity:.4,cursor:"not-allowed"},onClick:()=>analyze(text,"JSON yang ditempel")},"Periksa JSON")))):
h("div",null,
h("div",{className:"bbi-sum"},h("span",{className:"bbi-badge"},res.label),h("b",null,res.brand.name||"(tanpa nama)"),h("small",null,[fn,res.exportedAt?"diekspor "+res.exportedAt.slice(0,10):"",res.completeness!=null?"kelengkapan "+res.completeness+"%":""].filter(Boolean).join(" · "))),
h("div",{className:"bbs-l",style:{marginTop:"14px"}},"Bagian yang diimpor"),
h("div",{className:"bbi-secs"},bbxSecs.map(s=>{const has=s.keys.some(k=>bbxHas(res.brand[k])),n=s.keys.reduce((a,k)=>a+bbiCount(res.brand[k]),0),ex=bbxFilled(s,p);return h("label",{key:s.id,className:"bbi-sec"+(has?"":" off")},h("input",{type:"checkbox",disabled:!has,checked:!!sel[s.id]&&has,onChange:()=>setSel(o=>({...o,[s.id]:!o[s.id]}))}),h("span",null,s.icon+" "+s.label),h("small",null,has?n+" item"+(ex&&s.id!=="identity"?" · ada isi":""):"kosong"))})),
h("div",{className:"bbs-l"},"Jika bagian sudah ada isinya"),
h("label",{className:"bbi-rad"},h("input",{type:"radio",name:"bbimode",checked:mode==="replace",onChange:()=>setMode("replace")}),h("span",null,h("b",null,"Timpa"),h("small",null,"Isi dari file menggantikan isi yang ada. Field kosong di file tidak menghapus apa pun."))),
h("label",{className:"bbi-rad"},h("input",{type:"radio",name:"bbimode",checked:mode==="fill",onChange:()=>setMode("fill")}),h("span",null,h("b",null,"Gabung"),h("small",null,"Hanya mengisi field yang masih kosong. Isi yang sudah ada tetap aman."))),
h("p",{className:"bbs-h"},"Perubahan masuk ke form dan baru tersimpan setelah kamu klik Simpan Brand Brain."),
h("div",{className:"bbs-ft"},h("button",{type:"button",className:"bbs-lk",onClick:reset},"← Ganti file"),h("div",{className:"bbs-fb"},h("button",{type:"button",className:"bbs-b2",onClick:close},"Batal"),h("button",{type:"button",className:"bbs-b1",disabled:!keys.length,style:keys.length?null:{opacity:.4,cursor:"not-allowed"},onClick:doApply},"Terapkan ke Form")))))))};
const bbpStatus={draft:"Draf Awal",in_progress:"Dalam Produksi",approved:"Disetujui",scheduled:"Terjadwal"};


export {
  bbxSecs,
  bbxFmts,
  bbxBuild,
  bbxPanel as BrandBrainExportPanel,
  bbxMenu as BrandBrainExportMenu,
  bbxImportBtn as BrandBrainImportModal
};
