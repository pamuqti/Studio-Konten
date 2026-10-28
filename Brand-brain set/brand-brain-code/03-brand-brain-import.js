/**
 * Brand Brain - Impor (Import)
 * Parser & pemetaan impor (Backup JSON, Konektor Funnel, JSON generik, .md/.txt) dan modal Import.
 *
 * Diekstrak dari kalender_konten_planner__3_.html (bundle Vite, di-minify) lalu dirapikan dengan Prettier.
 * Nama variabel pendek (c, d, u, o, j, ...) adalah nama asli hasil minify, belum di-rename.
 *
 * Berisi: Lh, Ty, Ay, bbiSpec, bbiObj, bbiNum, bbiStr, bbiCo, bbiFromConn, bbiParse, bbiCount, bbiMv, bbiApply, bbxImportBtn
 *
 * Bergantung pada simbol lain di bundle (tidak ikut file ini):
 *   G, Sy, bbxFilled, bbxH, bbxHas, bbxSecs
 */

function Lh(c, d) {
  const u = c.trim();
  return d.toLowerCase().endsWith(".json") || u.startsWith("{") ? Ty(u) : Ay(u);
}

function Ty(c) {
  try {
    const d = JSON.parse(c);
    if (d && d.schema === "brand-brain-connector")
      throw new Error(
        "ini file Konektor Funnel (untuk app standalone). Untuk impor ke Brand Brain gunakan Backup JSON.",
      );
    if (d && d.type == "brand-brain-export" && d.brand && typeof d.brand == "object")
      return { brand: { ...d.brand }, isFreeformText: !1, rawText: c };
    const u = d.brand || d.data || d.dna || d,
      o = {
        name: String(u.name || u.brandName || u.namaBrand || "").trim(),
        category: String(u.category || u.kategori || "").trim(),
        product: String(u.product || u.produk || u.layanan || "").trim(),
        audience: String(u.audience || u.targetAudiens || u.audiens || "").trim(),
        usp: String(u.usp || u.keunggulan || u.valueProposition || "").trim(),
        tone: String(
          u.tone || u.toneOfVoice || u.gayaBahasa || "Hangat, bersahabat, dan edukatif",
        ).trim(),
        cta: String(u.cta || u.callToAction || "Hubungi kami via link bio").trim(),
        color: String(u.color || u.warna || "#205c49").trim(),
        instagramHandle: String(u.instagramHandle || u.handle || u.ig || "").trim(),
      };
    return (
      o.color.startsWith("#") || (o.color = "#205c49"),
      { brand: o, isFreeformText: !1, rawText: c }
    );
  } catch (d) {
    throw new Error(`Format JSON tidak valid: ${d.message}`);
  }
}

function Ay(c) {
  const d = { ...Sy },
    u = c.split(`
`);
  let o = 0;
  const j = [
      {
        key: "name",
        regex:
          /(?:nama\s*brand|brand\s*name|nama|^#\s+profil\s*&\s*dna\s*brand:?|^#\s+brand:?)\s*[:=]\s*(.+)/i,
      },
      { key: "category", regex: /(?:kategori\s*(?:bisnis)?|category|industri)\s*[:=]\s*(.+)/i },
      {
        key: "product",
        regex:
          /(?:produk\s*(?:\/|dan)?\s*layanan|produk|product|layanan|deskripsi\s*produk)\s*[:=]\s*(.+)/i,
      },
      {
        key: "audience",
        regex:
          /(?:target\s*audiens|audiens|audience|target\s*pasar|target\s*konsumen)\s*[:=]\s*(.+)/i,
      },
      {
        key: "usp",
        regex:
          /(?:keunggulan(?:\s*unik)?|usp|unique\s*selling\s*proposition|pembeda|value\s*prop(?:osition)?)\s*[:=]\s*(.+)/i,
      },
      {
        key: "tone",
        regex: /(?:gaya\s*bahasa|tone(?:\s*of\s*voice)?|nada\s*bicara|tone)\s*[:=]\s*(.+)/i,
      },
      { key: "cta", regex: /(?:call\s*to\s*action|cta|ajakan\s*bertindak)\s*[:=]\s*(.+)/i },
      { key: "color", regex: /(?:warna(?:\s*utama)?|color|hex\s*color)\s*[:=]\s*(.+)/i },
      { key: "instagramHandle", regex: /(?:instagram(?:\s*handle)?|ig|handle)\s*[:=]\s*(.+)/i },
    ],
    g = (y) =>
      y
        .replace(/[*_`]/g, "")
        .replace(/^["']|["']$/g, "")
        .trim();
  for (const y of u) {
    const S = y.trim();
    if (S) {
      if (!d.name && /^#\s+([^#:\n]+)$/.test(S)) {
        const _ = S.match(/^#\s+([^#:\n]+)$/);
        if (_ && !_[1].toLowerCase().includes("profil")) {
          ((d.name = g(_[1])), o++);
          continue;
        }
      }
      for (const { key: _, regex: D } of j) {
        const x = S.match(D);
        if (x && x[1]) {
          const b = g(x[1]);
          if (b) {
            if (_ === "color") {
              const H = b.match(/#[0-9a-fA-F]{3,8}/);
              d.color = H ? H[0] : "#205c49";
            } else
              _ === "instagramHandle"
                ? (d.instagramHandle = b.startsWith("@") ? b : `@${b}`)
                : (d[_] = b);
            o++;
          }
          break;
        }
      }
    }
  }
  const p = o < 2;
  if (p) {
    const y = u.find((S) => /^#+\s+/.test(S.trim()));
    (y && (d.name = g(y.replace(/^#+\s+/, ""))), (d.product = c.slice(0, 1500)));
  }
  return { brand: d, isFreeformText: p, rawText: c };
}

const bbiSpec = {
  name: "s",
  category: "s",
  product: "s",
  brandPromise: "s",
  mission: "s",
  vision: "s",
  values: "a",
  audience: "s",
  tone: "s",
  usp: "s",
  cta: "s",
  color: "s",
  website: "s",
  instagramHandle: "s",
  platformAccounts: {
    instagram: "s",
    tiktok: "s",
    threads: "s",
    linkedin: "s",
    youtube: "s",
    facebook: "s",
  },
  audienceDNA: {
    primary: "s",
    demographics: {
      age: "s",
      gender: "s",
      location: "s",
      occupation: "s",
      lifestyle: "s",
      purchasingPower: "s",
    },
    psychographics: { painPoints: "a", desires: "a", fears: "a", objections: "a" },
    contentBehavior: { scrollStoppers: "s", commentTriggers: "s", purchaseTriggers: "s" },
  },
  positioning: {
    weAre: "s",
    forAudience: "s",
    whoNeed: "s",
    becauseWhy: "s",
    unlike: "s",
    statement: "s",
  },
  personalityVoice: {
    spectrum: {
      formality: "n",
      playfulness: "n",
      approach: "n",
      positioningTier: "n",
      energy: "n",
    },
    humanPersona: "s",
    voiceDo: "a",
    voiceDont: "a",
    signatureWords: "a",
    forbiddenWords: "a",
  },
  competitorContext: {
    directCompetitors: "a",
    indirectCompetitors: "a",
    competitorWeakness: "s",
    whatWeWillNeverDo: "a",
  },
  offerConversionDNA: {
    mainOffer: "s",
    entryOffer: "s",
    priceRange: "s",
    riskReversal: "s",
    purchasePath: "s",
  },
  proofCredibility: { hardProofPoints: "a", caseTransformations: "a", customerVoiceRaw: "a" },
  visualDNA: {
    palette: { primary: "s", secondary: "s", accent: "s", background: "s" },
    photographyStyle: "a",
    visualDoNotUse: "a",
  },
  contentDNA: {
    pillars: "p",
    contentRatio: {
      awareness: "n",
      education: "n",
      engagement: "n",
      conversion: "n",
      loyalty: "n",
    },
    funnelCTA: { awareness: "s", consideration: "s", conversion: "s", retention: "s" },
  },
  brandMemory: {
    alwaysSay: "a",
    neverSay: "a",
    signatureStories: "a",
    claimsGuardrail: { allowed: "a", forbidden: "a" },
  },
  customDirectives: "a",
  customBlocks: "b",
  customKnowledge: "s",
  aiPersonaInstructions: "s",
};

const bbiObj = (v) => v && typeof v == "object" && !Array.isArray(v);

const bbiNum = (v) =>
  typeof v == "number" && isFinite(v)
    ? v
    : typeof v == "string" && v.trim() !== "" && isFinite(+v)
      ? +v
      : void 0;

const bbiStr = (v) =>
  typeof v == "string"
    ? v
    : typeof v == "number"
      ? String(v)
      : Array.isArray(v)
        ? v
            .filter((x) => x != null)
            .map(String)
            .join("\n")
        : "";

const bbiCo = (sp, v, i) => {
  if (sp === "s") return bbiStr(v);
  if (sp === "n") return bbiNum(v);
  if (sp === "a")
    return Array.isArray(v)
      ? v
          .filter((x) => x != null && String(x).trim() !== "")
          .map((x) => (typeof x == "string" ? x : String(x)))
      : typeof v == "string" && v.trim()
        ? v
            .split(/\n+/)
            .map((x) => x.trim())
            .filter(Boolean)
        : [];
  if (sp === "p")
    return (Array.isArray(v) ? v : [])
      .filter((x) => bbiObj(x) && bbiStr(x.name).trim())
      .map((x) => ({
        name: bbiStr(x.name),
        percentage: bbiNum(x.percentage) || 0,
        description: bbiStr(x.description),
      }));
  if (sp === "b")
    return (Array.isArray(v) ? v : [])
      .filter((x) => bbiObj(x) && bbiStr(x.content).trim())
      .map((x, n) => ({
        id: bbiStr(x.id) || "imp-" + Date.now() + "-" + n,
        title: bbiStr(x.title) || "Blok Acuan",
        category: bbiStr(x.category),
        content: bbiStr(x.content),
        isActive: x.isActive !== !1,
      }));
  const o = {};
  if (!bbiObj(v)) return o;
  Object.keys(sp).forEach((k) => {
    const r = bbiCo(sp[k], v[k]);
    r !== void 0 && (o[k] = r);
  });
  return o;
};

const bbiFromConn = (d) => {
  const st = (id) => ((d.funnel && d.funnel.stages) || []).find((x) => x && x.id === id) || {},
    sm = (id) => st(id).source_material || {},
    b = d.brand || {},
    pl = b.platforms || {},
    po = d.positioning || {},
    ap = d.audience_profile || {},
    dm = ap.demographics || {},
    cp = d.competition || {},
    v = d.voice || {},
    sp = v.spectrum || {},
    vi = d.visual || {},
    pal = vi.palette || {},
    gr = d.guardrails || {},
    cs = d.content_strategy || {},
    ra = cs.ratio || {},
    kn = d.knowledge || {},
    aw = sm("awareness"),
    co = sm("consideration"),
    cv = sm("conversion"),
    re = sm("retention"),
    first = (...x) =>
      x.find((y) => y != null && (Array.isArray(y) ? y.length : String(y).trim() !== "")),
    L = (x) => (Array.isArray(x) ? x : []);
  return {
    name: b.name,
    category: b.category,
    product: b.product,
    brandPromise: b.promise,
    mission: b.mission,
    vision: b.vision,
    values: b.values,
    audience: ap.summary,
    tone: v.tone,
    usp: co.usp,
    cta: b.cta_default,
    color: b.primary_color,
    website: b.website,
    instagramHandle: pl.instagram,
    platformAccounts: {
      instagram: pl.instagram,
      tiktok: pl.tiktok,
      threads: pl.threads,
      linkedin: pl.linkedin,
      youtube: pl.youtube,
      facebook: pl.facebook,
    },
    audienceDNA: {
      primary: ap.primary,
      demographics: {
        age: dm.age,
        gender: dm.gender,
        location: dm.location,
        occupation: dm.occupation,
        lifestyle: dm.lifestyle,
        purchasingPower: dm.purchasing_power,
      },
      psychographics: {
        painPoints: aw.pain_points,
        desires: co.desires,
        fears: aw.fears,
        objections: cv.objections,
      },
      contentBehavior: {
        scrollStoppers: aw.scroll_stoppers,
        commentTriggers: aw.comment_triggers,
        purchaseTriggers: cv.purchase_triggers,
      },
    },
    positioning: {
      weAre: po.we_are,
      forAudience: po.for_audience,
      whoNeed: po.who_need,
      becauseWhy: po.because,
      unlike: first(po.unlike, co.differentiator),
      statement: first(po.statement, co.positioning_statement),
    },
    personalityVoice: {
      spectrum: {
        formality: sp.casual,
        playfulness: sp.playful,
        approach: sp.friendly,
        positioningTier: sp.positioning_tier,
        energy: sp.bold,
      },
      humanPersona: v.persona,
      voiceDo: v.do,
      voiceDont: v.dont,
      signatureWords: v.signature_words,
      forbiddenWords: v.forbidden_words,
    },
    competitorContext: {
      directCompetitors: cp.direct,
      indirectCompetitors: cp.indirect,
      competitorWeakness: first(cp.weakness, co.competitor_weakness),
      whatWeWillNeverDo: cp.never_do,
    },
    offerConversionDNA: {
      mainOffer: cv.main_offer,
      entryOffer: cv.entry_offer,
      priceRange: cv.price_range,
      riskReversal: cv.risk_reversal,
      purchasePath: cv.purchase_path,
    },
    proofCredibility: {
      hardProofPoints: co.hard_proof_points,
      caseTransformations: cv.case_transformations,
      customerVoiceRaw: first(cv.customer_voice, re.customer_voice),
    },
    visualDNA: {
      palette: {
        primary: pal.primary,
        secondary: pal.secondary,
        accent: pal.accent,
        background: pal.background,
      },
      photographyStyle: vi.photography_style,
      visualDoNotUse: vi.avoid,
    },
    contentDNA: {
      pillars: L(cs.pillars).map((x) => ({
        name: x && x.name,
        percentage: x && x.share_pct,
        description: x && x.description,
      })),
      contentRatio: {
        awareness: ra.awareness,
        education: ra.education,
        engagement: ra.engagement,
        conversion: ra.conversion,
        loyalty: ra.loyalty,
      },
      funnelCTA: {
        awareness: st("awareness").cta,
        consideration: st("consideration").cta,
        conversion: st("conversion").cta,
        retention: st("retention").cta,
      },
    },
    brandMemory: {
      alwaysSay: gr.always_say,
      neverSay: gr.never_say,
      signatureStories: aw.signature_stories,
      claimsGuardrail: { allowed: gr.claims_allowed, forbidden: gr.claims_forbidden },
    },
    customDirectives: gr.custom_directives,
    aiPersonaInstructions: gr.ai_persona,
    customKnowledge: kn.notes,
    customBlocks: [
      ...L(cv.catalog_blocks),
      ...L(cv.faq_blocks),
      ...L(cs.campaigns),
      ...L(cs.copy_library),
      ...L(kn.other_blocks),
    ],
  };
};

const bbiParse = (text) => {
  let d;
  try {
    d = JSON.parse(String(text).replace(/^\uFEFF/, ""));
  } catch {
    throw new Error("Isi bukan JSON yang valid. Pastikan file utuh dan tidak terpotong.");
  }
  if (!bbiObj(d)) throw new Error("JSON harus berupa objek Brand Brain.");
  let kind, label, raw;
  if (d.schema === "brand-brain-connector") {
    kind = "connector";
    label = "Konektor Funnel";
    raw = bbiFromConn(d);
  } else if (d.type === "brand-brain-export" && bbiObj(d.brand)) {
    kind = "backup";
    label = "Backup JSON";
    raw = d.brand;
  } else {
    const c = [d.brand, d.data, d.dna, d].find(
      (x) => bbiObj(x) && Object.keys(bbiSpec).some((k) => k in x),
    );
    if (!c)
      throw new Error(
        "Format tidak dikenali. Gunakan Backup JSON atau Konektor Funnel dari menu Export.",
      );
    kind = "generic";
    label = "JSON Brand Brain";
    raw = c;
  }
  const brand = bbiCo(bbiSpec, raw);
  Object.keys(brand).forEach((k) => {
    bbxHas(brand[k]) || delete brand[k];
  });
  if (!Object.keys(brand).length)
    throw new Error(
      kind === "connector"
        ? "File ini masih template kosong, belum ada isinya."
        : "File tidak berisi data Brand Brain.",
    );
  return {
    kind,
    label,
    brand,
    exportedAt:
      typeof d.exportedAt == "string"
        ? d.exportedAt
        : typeof d.exported_at == "string"
          ? d.exported_at
          : "",
    completeness:
      typeof d.completeness == "number"
        ? d.completeness
        : typeof d.completeness_pct == "number"
          ? d.completeness_pct
          : null,
  };
};

const bbiCount = (v) =>
  Array.isArray(v)
    ? v.filter(bbxHas).length
    : bbiObj(v)
      ? Object.values(v).reduce((a, x) => a + bbiCount(x), 0)
      : bbxHas(v)
        ? 1
        : 0;

const bbiMv = (cur, inc, mode) => {
  if (!bbxHas(inc)) return cur;
  if (bbiObj(inc)) {
    const r = bbiObj(cur) ? { ...cur } : {};
    Object.keys(inc).forEach((k) => {
      const x = bbiMv(r[k], inc[k], mode);
      x !== void 0 && (r[k] = x);
    });
    return r;
  }
  return mode === "fill" && bbxHas(cur) ? cur : inc;
};

const bbiApply = (p, brand, keys, mode) => {
  const r = { ...p };
  keys.forEach((k) => {
    if (!(k in brand)) return;
    if (k === "customBlocks") {
      const c = Array.isArray(p.customBlocks) ? p.customBlocks : [],
        same = (a, b) => a.title === b.title && a.category === b.category;
      r.customBlocks =
        mode === "fill"
          ? [...c, ...brand.customBlocks.filter((b) => !c.some((x) => same(x, b)))]
          : [
              ...c.filter((x) => !brand.customBlocks.some((b) => same(x, b))),
              ...brand.customBlocks,
            ];
    } else r[k] = bbiMv(p[k], brand[k], mode);
  });
  return r;
};

const bbxImportBtn = ({ brand: p, onApply, onNotify: j }) => {
  const h = bbxH,
    [open, setOpen] = G.useState(!1),
    [text, setText] = G.useState(""),
    [fn, setFn] = G.useState(""),
    [res, setRes] = G.useState(null),
    [err, setErr] = G.useState(""),
    [sel, setSel] = G.useState({}),
    [mode, setMode] = G.useState("replace"),
    reset = () => {
      setText("");
      setFn("");
      setRes(null);
      setErr("");
      setSel({});
      setMode("replace");
    },
    close = () => {
      setOpen(!1);
      reset();
    },
    analyze = (t, name) => {
      try {
        const r = bbiParse(t),
          o = {};
        bbxSecs.forEach((s) => {
          o[s.id] = s.keys.some((k) => bbxHas(r.brand[k]));
        });
        setRes(r);
        setSel(o);
        setErr("");
        setFn(name || fn);
      } catch (e) {
        setRes(null);
        setErr(e.message || "Gagal membaca file.");
      }
    },
    onFile = (f) => {
      if (!f) return;
      if (f.size > 5 * 1024 * 1024) {
        setErr("Ukuran file maksimal 5MB.");
        return;
      }
      const fr = new FileReader();
      fr.onerror = () => setErr("File tidak bisa dibaca.");
      fr.onload = () => analyze(String(fr.result || ""), f.name);
      fr.readAsText(f);
    },
    keys = res
      ? bbxSecs
          .filter((s) => sel[s.id])
          .flatMap((s) => s.keys)
          .filter((k) => k in res.brand)
      : [],
    doApply = () => {
      if (!res || !keys.length) return;
      onApply((cur) => bbiApply(cur, res.brand, keys, mode));
      j &&
        j(
          "Brand Brain dari file diterapkan ke form. Klik Simpan Brand Brain untuk menyimpan.",
          "success",
        );
      close();
    };
  return h(
    "div",
    { className: "bbm" },
    h(
      "button",
      {
        type: "button",
        onClick: () => setOpen(!0),
        className:
          "px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6faf4] text-[#205c49] border border-[#cfded1] text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs",
        title: "Import Brand Brain dari file JSON",
      },
      h("span", { style: { fontSize: "11px" } }, "⬆"),
      h("span", null, "Import"),
    ),
    open &&
      h(
        "div",
        {
          className: "bbs-ov",
          onMouseDown: (e) => {
            e.target === e.currentTarget && close();
          },
        },
        h(
          "div",
          { className: "bbs-modal bbi-modal" },
          h(
            "div",
            { className: "bbs-top" },
            h("h3", null, "Import Brand Brain"),
            h(
              "button",
              { type: "button", className: "bbs-x", onClick: close, "aria-label": "Tutup" },
              "✕",
            ),
          ),
          !res
            ? h(
                "div",
                null,
                h(
                  "p",
                  { className: "bbs-h", style: { margin: "6px 0 10px" } },
                  "Terima Backup JSON, Konektor Funnel, atau template yang sudah kamu isi. Isinya diperiksa dulu sebelum masuk ke form.",
                ),
                h(
                  "label",
                  {
                    className: "bbs-drop",
                    onDragOver: (e) => e.preventDefault(),
                    onDrop: (e) => {
                      e.preventDefault();
                      onFile(e.dataTransfer.files && e.dataTransfer.files[0]);
                    },
                  },
                  h("input", {
                    type: "file",
                    accept: ".json,application/json",
                    style: { display: "none" },
                    onChange: (e) => {
                      onFile(e.target.files && e.target.files[0]);
                      e.target.value = "";
                    },
                  }),
                  h("span", { className: "bbs-dh" }, "Klik atau seret file .json ke sini"),
                ),
                h("label", { className: "bbs-l" }, "Atau tempel isi JSON"),
                h("textarea", {
                  className: "bbs-in",
                  rows: 5,
                  value: text,
                  onChange: (e) => setText(e.target.value),
                  placeholder: '{ "schema": "brand-brain-connector", ... }',
                  style: { fontFamily: "ui-monospace,monospace", fontSize: "11px" },
                }),
                err && h("p", { className: "bbs-err" }, err),
                h(
                  "div",
                  { className: "bbs-ft", style: { justifyContent: "flex-end" } },
                  h(
                    "div",
                    { className: "bbs-fb" },
                    h("button", { type: "button", className: "bbs-b2", onClick: close }, "Batal"),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "bbs-b1",
                        disabled: !text.trim(),
                        style: text.trim() ? null : { opacity: 0.4, cursor: "not-allowed" },
                        onClick: () => analyze(text, "JSON yang ditempel"),
                      },
                      "Periksa JSON",
                    ),
                  ),
                ),
              )
            : h(
                "div",
                null,
                h(
                  "div",
                  { className: "bbi-sum" },
                  h("span", { className: "bbi-badge" }, res.label),
                  h("b", null, res.brand.name || "(tanpa nama)"),
                  h(
                    "small",
                    null,
                    [
                      fn,
                      res.exportedAt ? "diekspor " + res.exportedAt.slice(0, 10) : "",
                      res.completeness != null ? "kelengkapan " + res.completeness + "%" : "",
                    ]
                      .filter(Boolean)
                      .join(" · "),
                  ),
                ),
                h(
                  "div",
                  { className: "bbs-l", style: { marginTop: "14px" } },
                  "Bagian yang diimpor",
                ),
                h(
                  "div",
                  { className: "bbi-secs" },
                  bbxSecs.map((s) => {
                    const has = s.keys.some((k) => bbxHas(res.brand[k])),
                      n = s.keys.reduce((a, k) => a + bbiCount(res.brand[k]), 0),
                      ex = bbxFilled(s, p);
                    return h(
                      "label",
                      { key: s.id, className: "bbi-sec" + (has ? "" : " off") },
                      h("input", {
                        type: "checkbox",
                        disabled: !has,
                        checked: !!sel[s.id] && has,
                        onChange: () => setSel((o) => ({ ...o, [s.id]: !o[s.id] })),
                      }),
                      h("span", null, s.icon + " " + s.label),
                      h(
                        "small",
                        null,
                        has
                          ? n + " item" + (ex && s.id !== "identity" ? " · ada isi" : "")
                          : "kosong",
                      ),
                    );
                  }),
                ),
                h("div", { className: "bbs-l" }, "Jika bagian sudah ada isinya"),
                h(
                  "label",
                  { className: "bbi-rad" },
                  h("input", {
                    type: "radio",
                    name: "bbimode",
                    checked: mode === "replace",
                    onChange: () => setMode("replace"),
                  }),
                  h(
                    "span",
                    null,
                    h("b", null, "Timpa"),
                    h(
                      "small",
                      null,
                      "Isi dari file menggantikan isi yang ada. Field kosong di file tidak menghapus apa pun.",
                    ),
                  ),
                ),
                h(
                  "label",
                  { className: "bbi-rad" },
                  h("input", {
                    type: "radio",
                    name: "bbimode",
                    checked: mode === "fill",
                    onChange: () => setMode("fill"),
                  }),
                  h(
                    "span",
                    null,
                    h("b", null, "Gabung"),
                    h(
                      "small",
                      null,
                      "Hanya mengisi field yang masih kosong. Isi yang sudah ada tetap aman.",
                    ),
                  ),
                ),
                h(
                  "p",
                  { className: "bbs-h" },
                  "Perubahan masuk ke form dan baru tersimpan setelah kamu klik Simpan Brand Brain.",
                ),
                h(
                  "div",
                  { className: "bbs-ft" },
                  h(
                    "button",
                    { type: "button", className: "bbs-lk", onClick: reset },
                    "← Ganti file",
                  ),
                  h(
                    "div",
                    { className: "bbs-fb" },
                    h("button", { type: "button", className: "bbs-b2", onClick: close }, "Batal"),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "bbs-b1",
                        disabled: !keys.length,
                        style: keys.length ? null : { opacity: 0.4, cursor: "not-allowed" },
                        onClick: doApply,
                      },
                      "Terapkan ke Form",
                    ),
                  ),
                ),
              ),
        ),
      ),
  );
};

