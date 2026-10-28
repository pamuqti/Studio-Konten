/**
 * Brand Brain - Helper bersama
 * Plumbing Gemini API (API key, pemanggil model, parser respons), brand kosong default (pa, Sy),
 * dan utilitas unduh / salin (gt, Cy, Oa) yang dipakai modul Brand Brain lain.
 *
 * Diekstrak dari kalender_konten_planner__3_.html lalu dirapikan dengan Prettier.
 *
 * Berisi: pa, Eu, dt, vr, ku, Vt, Nh, bt, a0, wn, __splitExtract, wr, Sr, gt, Oa, Sy, Cy
 */

const pa = {
  name: "",
  category: "",
  product: "",
  audience: "",
  usp: "",
  tone: "Hangat, bersahabat, dan edukatif",
  cta: "Hubungi kami via link bio",
  color: "#205c49",
  instagramHandle: "",
  platformAccounts: {
    instagram: "",
    tiktok: "",
    threads: "",
    linkedin: "",
    youtube: "",
    facebook: "",
  },
};

const Eu = ["gemini-3-flash-preview", "gemini-2.5-flash"];

let dt = "gemini-3-flash-preview";

function vr() {
  return dt;
}

function ku() {
  if (typeof window < "u") {
    const d = window;
    if (
      d.__GEMINI_API_KEY__ &&
      typeof d.__GEMINI_API_KEY__ == "string" &&
      d.__GEMINI_API_KEY__.trim()
    )
      return {
        key: d.__GEMINI_API_KEY__.trim(),
        source: "window",
        sourceDescription: "Auto-Injected (window.__GEMINI_API_KEY__)",
        isAutoInjected: !0,
      };
    if (d.GEMINI_API_KEY && typeof d.GEMINI_API_KEY == "string" && d.GEMINI_API_KEY.trim())
      return {
        key: d.GEMINI_API_KEY.trim(),
        source: "window",
        sourceDescription: "Auto-Injected (window.GEMINI_API_KEY)",
        isAutoInjected: !0,
      };
    if (d.API_KEY && typeof d.API_KEY == "string" && d.API_KEY.trim())
      return {
        key: d.API_KEY.trim(),
        source: "window",
        sourceDescription: "Auto-Injected (window.API_KEY)",
        isAutoInjected: !0,
      };
    if (d.aistudio?.apiKey || d.aiStudio?.apiKey)
      return {
        key: String(d.aistudio?.apiKey || d.aiStudio?.apiKey).trim(),
        source: "window",
        sourceDescription: "Google AI Studio Session",
        isAutoInjected: !0,
      };
    try {
      const u = new URLSearchParams(window.location.search),
        o = u.get("gemini_api_key") || u.get("apiKey") || u.get("key");
      if (o && o.trim())
        return {
          key: o.trim(),
          source: "url",
          sourceDescription: "URL Parameter (?apiKey=)",
          isAutoInjected: !0,
        };
    } catch {}
    try {
      const u = localStorage.getItem(bu);
      if (u && u.trim())
        return {
          key: u.trim(),
          source: "storage",
          sourceDescription: "Browser LocalStorage",
          isAutoInjected: !1,
        };
    } catch {}
  }
  const c = "";
  return c.trim()
    ? {
        key: c.trim(),
        source: "env",
        sourceDescription: "Vite Environment Variable",
        isAutoInjected: !0,
      }
    : { key: "", source: "none", sourceDescription: "Belum diatur", isAutoInjected: !1 };
}

function Vt() {
  return ku().key;
}

function Nh(c) {
  try {
    (c.trim()
      ? (localStorage.setItem(bu, c.trim()),
        typeof window < "u" && (window.__GEMINI_API_KEY__ = c.trim()))
      : (localStorage.removeItem(bu), typeof window < "u" && (window.__GEMINI_API_KEY__ = "")),
      typeof window < "u" &&
        window.dispatchEvent(new CustomEvent("gemini-api-key-changed", { detail: c.trim() })));
  } catch {}
}

function bt() {
  return typeof window < "u" && window.__GEMINI_CANVAS__ ? !0 : !!Vt();
}

async function a0(c) {
  if (!c || !c.trim()) return { success: !1, model: "", error: "API Key kosong." };
  for (const d of Eu)
    try {
      const u = `https://generativelanguage.googleapis.com/v1beta/models/${d}:generateContent?key=${c.trim()}`,
        o = await fetch(u, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: 'Balas dengan kata "READY".' }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        });
      if (o.ok) return ((dt = d), { success: !0, model: d });
      const g = (await o.json().catch(() => null))?.error?.message || `HTTP ${o.status}`;
      if (o.status === 400 && (g.includes("API key not valid") || g.includes("API_KEY_INVALID")))
        return { success: !1, model: d, error: "API Key tidak valid." };
      if (o.status === 404) continue;
      return { success: !1, model: d, error: g };
    } catch {}
  return {
    success: !1,
    model: "",
    error: "Gagal terhubung ke Google Gemini API. Cek koneksi Anda.",
  };
}

async function wn(c, d, u, o, j, k) {
  const g = [d || dt, ...Eu.filter((y) => y !== (d || dt))];
  let p = null;
  for (const y of g)
    try {
      const S = `https://generativelanguage.googleapis.com/v1beta/models/${y}:generateContent?key=${c}`,
        _ = { contents: [{ role: "user", parts: [{ text: o }] }] };
      u && (_.systemInstruction = { parts: [{ text: u }] });
      const D = { temperature: 0.7 };
      (j && ((D.responseMimeType = "application/json"), (D.responseSchema = j)),
        (_.generationConfig = D));
      const x = await (k ? __gemFetch : fetch)(S, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_),
      });
      if (!x.ok) {
        const ne =
          (await x.json().catch(() => null))?.error?.message || `HTTP ${x.status} ${x.statusText}`;
        if (
          x.status === 404 ||
          ne.toLowerCase().includes("not found") ||
          ne.toLowerCase().includes("is not supported")
        ) {
          (console.warn(`Model ${y} not supported, trying fallback model...`, ne),
            (p = new Error(`Gemini API (${y}): ${ne}`)));
          continue;
        }
        throw new Error(`Gemini API Error (${y}): ${ne}`);
      }
      const H = (await x.json())?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!H) throw new Error(`Respons dari Gemini (${y}) kosong.`);
      return ((dt = y), j ? JSON.parse(H.trim()) : H);
    } catch (S) {
      if (((p = S), S.message && (S.message.includes("404") || S.message.includes("not found"))))
        continue;
      throw S;
    }
  throw p || new Error("Gagal menghubungi Gemini API dengan semua model yang tersedia.");
}

async function __splitExtract(d, u, o, S) {
  const G = [
      [
        "name",
        "category",
        "product",
        "brandPromise",
        "audience",
        "usp",
        "tone",
        "cta",
        "color",
        "instagramHandle",
        "analysisSummary",
        "positioning",
      ],
      ["competitorContext"],
      ["audienceDNA"],
      ["offerConversionDNA", "proofCredibility"],
      ["personalityVoice", "visualDNA"],
      ["contentDNA"],
      ["brandMemory"],
    ],
    L = [
      "Fondasi",
      "Kompetitor",
      "Audience DNA",
      "Penawaran",
      "Karakter & Gaya",
      "Content DNA",
      "Brand Memory",
    ],
    out = {},
    miss = [];
  for (let n = 0; n < G.length; n++) {
    const g = G[n],
      sub = {
        type: "OBJECT",
        properties: {},
        required: (S.required || []).filter((k) => g.includes(k)),
      };
    g.forEach((k) => {
      sub.properties[k] = S.properties[k];
    });
    try {
      const r = await wn(
        d,
        dt,
        u,
        o +
          "\n\nFOKUS PERMINTAAN INI: isi HANYA bagian berikut secara lengkap dan mendalam: " +
          g.join(", ") +
          ". Bagian lain diproses terpisah, jangan diisi.",
        sub,
        !0,
      );
      Object.assign(out, r);
    } catch (e) {
      if (n === 0) throw e;
      if (e && e.isLimit) {
        for (let m = n; m < G.length; m++) miss.push(L[m]);
        break;
      }
      miss.push(L[n]);
    }
  }
  if (miss.length && out.analysisSummary)
    out.analysisSummary +=
      " (Belum terisi karena limit Canvas: " + miss.join(", ") + ". Klik Ekstrak lagi nanti.)";
  return out;
}

async function wr(c) {
  if (!(c.headers.get("content-type") || "").includes("application/json"))
    return { ok: !1, data: null };
  try {
    return { ok: !0, data: await c.json() };
  } catch {
    return { ok: !1, data: null };
  }
}

function Sr() {
  return typeof window < "u" && !!window.__GEMINI_CANVAS__;
}

function gt(c, d, u) {
  const o = new Blob([d], { type: u }),
    j = URL.createObjectURL(o),
    g = document.createElement("a");
  ((g.href = j),
    (g.download = c),
    document.body.appendChild(g),
    g.click(),
    document.body.removeChild(g),
    setTimeout(() => URL.revokeObjectURL(j), 3e4));
}

function Oa(c) {
  if (navigator.clipboard && window.isSecureContext)
    return navigator.clipboard
      .writeText(c)
      .then(() => !0)
      .catch(() => !1);
  try {
    const d = document.createElement("textarea");
    ((d.value = c),
      (d.style.position = "fixed"),
      (d.style.left = "-999999px"),
      document.body.appendChild(d),
      d.focus(),
      d.select());
    const u = document.execCommand("copy");
    return (document.body.removeChild(d), Promise.resolve(u));
  } catch (d) {
    return (console.error("Failed to copy text: ", d), Promise.resolve(!1));
  }
}

const Sy = {
  name: "",
  category: "",
  product: "",
  audience: "",
  usp: "",
  tone: "Hangat, bersahabat, dan edukatif",
  cta: "Hubungi kami via link bio",
  color: "#205c49",
  instagramHandle: "",
};

function Cy(c, d, u) {
  const o = new Blob([c], { type: u }),
    j = URL.createObjectURL(o),
    g = document.createElement("a");
  ((g.href = j),
    (g.download = d),
    document.body.appendChild(g),
    g.click(),
    document.body.removeChild(g),
    URL.revokeObjectURL(j));
}

