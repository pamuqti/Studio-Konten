import { ContentDocument, ContentItem, BrandBrain } from '../types';

export function generateDocumentMarkdown(c: ContentDocument): string {
  let d = `# ${c.title}\n\n`;
  d += `**Brand:** ${c.brand.name} (${c.brand.category || "Brand"})\n`;
  d += `**Modul:** ${(c.module || "plan").toUpperCase()}\n`;
  d += `**Dibuat:** ${new Date(c.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}\n`;
  d += `**Sumber:** ${c.source === "gemini" ? "Gemini AI Brain" : "Template Pola Editorial"}\n`;

  if (c.options.topic) d += `**Topik:** ${c.options.topic}\n`;
  if (c.options.goal) d += `**Tujuan:** ${c.options.goal}\n`;
  if (c.options.platform) d += `**Platform:** ${c.options.platform}\n`;
  d += `\n---\n\n`;

  c.items.forEach((u, o) => {
    d += `## ${o + 1}. ${u.title}\n`;
    d += `**Status:** ${
      u.status === "approved"
        ? "✅ Disetujui"
        : u.status === "in_progress"
        ? "⏳ Dalam Produksi"
        : "📝 Draf"
    }\n\n`;

    Object.entries(u.fields).forEach(([j, g]) => {
      d += `### ${j}\n${g}\n\n`;
    });

    if (u.notes) {
      d += `> **Catatan Internal:** ${u.notes}\n\n`;
    }
    d += `---\n\n`;
  });

  return d;
}

export function generateDocumentCSV(c: ContentDocument): string {
  const allFieldKeys = Array.from(new Set(c.items.flatMap(g => Object.keys(g.fields))));
  const headers = ["No", "Judul", "Status", ...allFieldKeys, "Catatan"];
  
  const escapeCell = (g: any) => {
    let p = String(g ?? "").trim();
    if (/^[\s]*[=+@-]/.test(p)) {
      p = "'" + p;
    }
    return `"${p.replace(/"/g, '""')}"`;
  };

  const rows = c.items.map((g, p) => {
    const fieldValues = allFieldKeys.map(S => g.fields[S] || "");
    return [String(p + 1), g.title, g.status, ...fieldValues, g.notes || ""]
      .map(escapeCell)
      .join(",");
  });

  return "\uFEFF" + [headers.map(escapeCell).join(","), ...rows].join("\r\n");
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export interface RuangKontenPublishPack {
  version: 1;
  type: 'ruang-konten-pack';
  exportedAt: string;
  sourceApp: 'Ruang Konten Planner';
  brand: BrandBrain;
  planTitle: string;
  items: Array<{
    id: string;
    title: string;
    status: string;
    pilar?: string;
    hook?: string;
    sudutKonten?: string;
    briefVisual?: string;
    caption: string;
    cta?: string;
    tahapFunnel?: string;
    format?: string;
    platform?: string;
    targetPlatforms?: string[];
    recommendedTime?: string;
    notes?: string;
  }>;
}

export function generatePublishPackJson(doc: ContentDocument, brand: BrandBrain, itemIds?: string[]): string {
  const targetItems = itemIds && itemIds.length > 0
    ? doc.items.filter(it => itemIds.includes(it.id))
    : doc.items;

  const pack: RuangKontenPublishPack = {
    version: 1,
    type: 'ruang-konten-pack',
    exportedAt: new Date().toISOString(),
    sourceApp: 'Ruang Konten Planner',
    brand: doc.brand || brand,
    planTitle: doc.title,
    items: targetItems.map(it => {
      const f = it.fields || {};
      const platform = f.Platform || 'Instagram';
      
      // Deteksi platform target dari format/placement
      const targetPlatforms: string[] = [];
      const placement = (f['Tipe Placement'] || f.Format || '').toLowerCase();
      if (placement.includes('video') || placement.includes('reels') || placement.includes('shorts') || placement.includes('tiktok')) {
        targetPlatforms.push('instagram', 'tiktok', 'youtube', 'facebook');
      } else if (placement.includes('thread')) {
        targetPlatforms.push('threads');
      } else {
        targetPlatforms.push(platform.toLowerCase());
      }

      return {
        id: it.id,
        title: it.title,
        status: it.status,
        pilar: f.Pilar,
        hook: f.Hook || f.Headline,
        sudutKonten: f['Sudut Konten'],
        briefVisual: f['Brief Visual'],
        caption: f.Caption || '',
        cta: f.CTA,
        tahapFunnel: f['Tahap Funnel'],
        format: f.Format || f['Tipe Placement'],
        platform,
        targetPlatforms,
        recommendedTime: f['Jam Tayang'],
        notes: it.notes
      };
    })
  };

  return JSON.stringify(pack, null, 2);
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-999999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const result = document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve(result);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return Promise.resolve(false);
  }
}

export const bbpStatusLabel: Record<string, string> = {
  draft: "Draf Awal",
  in_progress: "Dalam Produksi",
  approved: "Disetujui",
  scheduled: "Terjadwal"
};

const bbpIsLong = (k: string, s: string) =>
  s.length > 70 ||
  /\n/.test(s) ||
  /hook|headline|caption|cta|call-to-action|sudut|brief|narasi|naskah|\bisi\b|prompt|arahan|instruksi|deskripsi|panduan|art direction|layout|pesan|tujuan|ketentuan|penyampaian|konflik|framework|tips|pain|pemicu|guardrail|alur|tagging/i.test(k);

export interface BriefModel {
  title: string;
  status: string;
  mod: string;
  meta: Array<{ k: string; v: string }>;
  blocks: Array<{ k: string; v: string }>;
  chk: string | null;
  notes: string;
  pilar: string;
}

export function buildBriefModel(item: ContentItem, moduleName: string = "Kalender Konten"): BriefModel {
  const f = item.fields || {};
  const meta: Array<{ k: string; v: string }> = [];
  const blocks: Array<{ k: string; v: string }> = [];
  let chk: string | null = null;

  Object.entries(f).forEach(([k, v]) => {
    const s = String(v ?? "").trim();
    if (/checklist/i.test(k)) {
      chk = s;
      return;
    }
    if (!s) return;
    if (bbpIsLong(k, s)) {
      blocks.push({ k, v: s });
    } else {
      meta.push({ k, v: s });
    }
  });

  return {
    title: String(item.title || "Tanpa Judul"),
    status: bbpStatusLabel[item.status] || String(item.status || ""),
    mod: moduleName || "",
    meta,
    blocks,
    chk,
    notes: String(item.notes || "").trim(),
    pilar: String(f.Pilar || "")
  };
}

export function getBriefBrandContext(brand?: BrandBrain, pilar?: string) {
  const b = brand || ({} as BrandBrain);
  const pv = b.personalityVoice || {};
  const bm = b.brandMemory || {};
  const cd = b.contentDNA || {};
  const rows: Array<[string, string]> = [];

  const add = (k: string, v: any) => {
    const text = Array.isArray(v) ? v.join("; ") : String(v || "").trim();
    if (text) rows.push([k, text]);
  };

  add("Target audiens", b.audience);
  add("Tone of voice", b.tone);
  add("Wajib (DO)", pv.voiceDo?.slice(0, 4));
  add("Dilarang (DON'T)", pv.voiceDont?.slice(0, 4));
  add("Kata terlarang", pv.forbiddenWords?.slice(0, 8));
  add("Tidak pernah dikatakan", bm.neverSay?.slice(0, 4));
  add("Klaim terlarang", bm.claimsGuardrail?.forbidden?.slice(0, 4));

  if (pilar && Array.isArray(cd.pillars)) {
    const pl = cd.pillars.find(x => x && x.name && (
      pilar.toLowerCase().includes(String(x.name).toLowerCase()) ||
      String(x.name).toLowerCase().includes(pilar.toLowerCase())
    ));
    if (pl && pl.description) {
      rows.unshift(["Pilar: " + pl.name, String(pl.description)]);
    }
  }

  return rows;
}

export function getBriefChecklist(m: BriefModel, b?: BrandBrain): string[] {
  const has = (r: RegExp) => m.blocks.some(x => r.test(x.k)) || m.meta.some(x => r.test(x.k));
  const c: string[] = [];
  if (has(/hook|headline/i)) c.push("Hook menghentikan scroll dalam 1-3 detik");
  if (has(/caption|\bisi\b|narasi|naskah/i)) c.push("Copy sesuai tone of voice brand" + (b && b.tone ? " (" + b.tone + ")" : ""));
  if (has(/cta|call-to-action/i)) c.push("CTA jelas, satu tujuan, dan sesuai tahap funnel");
  const fw = b?.personalityVoice?.forbiddenWords || [];
  c.push(fw.length ? "Tidak memakai kata atau klaim terlarang (" + fw.slice(0, 4).join(", ") + ")" : "Tidak ada klaim yang melanggar guardrail brand");
  if (has(/visual|art direction|arahan|layout/i)) c.push("Visual sesuai brief dan palet brand");
  if (has(/tanggal|jam|akun|platform|jadwal/i)) c.push("Akun target, tanggal, dan jam tayang sudah benar");
  c.push("Disetujui dan siap dijadwalkan");
  return c;
}

const escapeHtml = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function generateSingleBriefMarkdown(m: BriefModel, b?: BrandBrain): string {
  const q = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n+/g, " ");
  const ctx = getBriefBrandContext(b, m.pilar);
  const done = /^(checked|done|selesai|true|ya|✓|✔)/i.test(m.chk || "");

  let o = "# Brief Konten: " + m.title + "\n\n> " + [m.mod, m.status && "Status: " + m.status, b && b.name && "Brand: " + b.name].filter(Boolean).join(" · ") + "\n";
  if (m.meta.length) {
    o += "\n## Ringkasan\n\n| Parameter | Isi |\n|---|---|\n" + m.meta.map(x => "| " + q(x.k) + " | " + q(x.v) + " |").join("\n") + "\n";
  }
  m.blocks.forEach(x => {
    o += "\n## " + x.k + "\n\n" + (/^(hook|headline)/i.test(x.k) ? x.v.split("\n").map(l => "> " + l).join("\n") : x.v) + "\n";
  });
  o += "\n## Checklist Produksi\n\n" + getBriefChecklist(m, b).map(c => "- [" + (done ? "x" : " ") + "] " + c).join("\n") + "\n";
  if (m.notes) o += "\n## Catatan Internal Tim\n\n" + m.notes + "\n";
  if (ctx.length) {
    o += "\n## Panduan Brand\n\n" + ctx.map(r => "- **" + r[0] + ":** " + q(r[1])).join("\n") + "\n";
  }
  return o;
}

export function generateBriefsHtml(models: BriefModel[], brand?: BrandBrain, title: string = "Brief Produksi"): string {
  const c = brand?.color && /^#[0-9a-f]{3,8}$/i.test(brand.color) ? brand.color : "#205c49";
  const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  
  const css = `
    :root { --c: ${c}; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #eef2ee; color: #142620; font: 14px/1.65 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    .pg { max-width: 840px; margin: 20px auto; background: #fff; border: 1px solid #dce4db; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
    .hd { background: var(--c); color: #fff; padding: 26px 30px; }
    .bd { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; background: rgba(255,255,255,.2); padding: 3px 10px; border-radius: 99px; }
    h1 { margin: 10px 0 8px; font-size: 22px; font-weight: 800; font-family: 'Manrope', sans-serif; line-height: 1.25; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chips span { font-size: 11px; font-weight: 600; background: rgba(255,255,255,.18); padding: 2px 10px; border-radius: 99px; }
    .bd2 { padding: 22px 30px 26px; }
    h2 { margin: 22px 0 8px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--c); font-weight: 800; }
    h2:first-child { margin-top: 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; }
    .cell { border: 1px solid #e3ebe2; border-radius: 10px; padding: 8px 11px; background: #fafcf9; }
    .cell small { display: block; font-size: 10px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: #6b7e72; }
    .cell b { font-size: 13px; font-weight: 600; }
    .tx { white-space: pre-wrap; margin: 0; line-height: 1.6; }
    .hook { font-size: 16px; font-weight: 700; line-height: 1.45; border-left: 4px solid var(--c); padding: 6px 0 6px 14px; margin: 0; white-space: pre-wrap; background: #f7faf7; border-radius: 0 8px 8px 0; }
    .cp { background: #f6f9f5; border: 1px dashed #c9d9c8; border-radius: 12px; padding: 12px 14px; white-space: pre-wrap; margin: 0; line-height: 1.65; }
    .cta { display: inline-block; background: var(--c); color: #fff; font-weight: 700; border-radius: 10px; padding: 8px 14px; white-space: pre-wrap; font-size: 13px; }
    .ck { list-style: none; margin: 0; padding: 0; }
    .ck li { display: flex; gap: 9px; align-items: flex-start; padding: 4px 0; font-size: 13px; }
    .ck i { flex: none; width: 15px; height: 15px; border: 1.5px solid #8aa08f; border-radius: 4px; margin-top: 3px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-style: normal; color: #fff; }
    .ck i.on { background: var(--c); border-color: var(--c); }
    .nt { background: #fffbea; border: 1px solid #f3e3a1; border-radius: 10px; padding: 10px 13px; white-space: pre-wrap; margin: 0; }
    .bg { display: grid; grid-template-columns: 150px 1fr; gap: 4px 12px; font-size: 13px; }
    .bg small { font-weight: 700; color: #52665b; }
    .ft { max-width: 840px; margin: 0 auto 24px; font-size: 11px; color: #6b7e72; text-align: center; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border-bottom: 1px solid #e3ebe2; padding: 7px 8px; text-align: left; }
    th { font-size: 10px; letter-spacing: .06em; text-transform: uppercase; color: #6b7e72; }
    @media (max-width: 600px) { .bg { grid-template-columns: 1fr; } .hd, .bd2 { padding-left: 18px; padding-right: 18px; } }
    @media print { body { background: #fff; } .pg { margin: 0; border: 0; border-radius: 0; max-width: none; break-after: page; } .pg:last-of-type { break-after: auto; } .hd, .ck i.on { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;

  let body = "";
  if (models.length > 1) {
    body += `
      <article class="pg">
        <div class="hd">
          <span class="bd">Brief Produksi</span>
          <h1>${escapeHtml(title)}</h1>
          <div class="chips">
            ${[brand?.name && "Brand: " + brand.name, models.length + " konten", dateStr].filter(Boolean).map(x => "<span>" + escapeHtml(String(x)) + "</span>").join("")}
          </div>
        </div>
        <div class="bd2">
          <h2>Daftar Konten Terjadwal</h2>
          <table>
            <tr><th>#</th><th>Judul</th><th>Platform / Tanggal</th><th>Status</th></tr>
            ${models.map((m, i) => {
              const getField = (k: string) => (m.meta.find(x => x.k === k) || {}).v || "";
              return `<tr>
                <td>${i + 1}</td>
                <td>${escapeHtml(m.title)}</td>
                <td>${escapeHtml([getField("Platform"), getField("Tanggal") || getField("Tanggal Terjadwal")].filter(Boolean).join(" · "))}</td>
                <td>${escapeHtml(m.status)}</td>
              </tr>`;
            }).join("")}
          </table>
        </div>
      </article>
    `;
  }

  models.forEach(m => {
    const ctx = getBriefBrandContext(brand, m.pilar);
    const done = /^(checked|done|selesai|true|ya|✓|✔)/i.test(m.chk || "");
    const chips = [m.mod, m.status && "Status: " + m.status, brand && brand.name && "Brand: " + brand.name].filter(Boolean).map(x => "<span>" + escapeHtml(String(x)) + "</span>").join("");

    body += `
      <article class="pg">
        <div class="hd">
          <span class="bd">Brief Konten & Produksi</span>
          <h1>${escapeHtml(m.title)}</h1>
          <div class="chips">${chips}</div>
        </div>
        <div class="bd2">
    `;

    if (m.meta.length) {
      body += `<h2>Ringkasan</h2><div class="grid">${m.meta.map(x => `<div class="cell"><small>${escapeHtml(x.k)}</small><b>${escapeHtml(x.v)}</b></div>`).join("")}</div>`;
    }

    m.blocks.forEach(x => {
      const cls = /^(hook|headline)/i.test(x.k) ? "hook" : /caption|\bisi\b|narasi|naskah/i.test(x.k) ? "cp" : /cta|call-to-action/i.test(x.k) ? "cta" : "tx";
      body += `<h2>${escapeHtml(x.k)}</h2>`;
      if (cls === "cta") {
        body += `<div class="cta">${escapeHtml(x.v)}</div>`;
      } else {
        body += `<p class="${cls}">${escapeHtml(x.v)}</p>`;
      }
    });

    body += `<h2>Checklist Produksi</h2><ul class="ck">${getBriefChecklist(m, brand).map(c2 => `<li><i${done ? ' class="on">✓' : '>' }</i><span>${escapeHtml(c2)}</span></li>`).join("")}</ul>`;

    if (m.notes) {
      body += `<h2>Catatan Internal Tim</h2><p class="nt">${escapeHtml(m.notes)}</p>`;
    }

    if (ctx.length) {
      body += `<h2>Panduan Brand</h2><div class="bg">${ctx.map(r => `<small>${escapeHtml(r[0])}</small><span>${escapeHtml(r[1])}</span>`).join("")}</div>`;
    }

    body += `</div></article>`;
  });

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(models.length === 1 ? "Brief: " + models[0].title : title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  ${body}
  <div class="ft">Dibuat dari Ruang Konten · ${dateStr}</div>
</body>
</html>`;
}

export function printBriefHtml(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        setTimeout(() => iframe.remove(), 2500);
      }
    }, 400);
  }
}
