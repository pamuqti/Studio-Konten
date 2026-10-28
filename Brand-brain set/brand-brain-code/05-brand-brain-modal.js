/**
 * Brand Brain - Modal editor (UI)
 * Komponen React modal "Brand Brain" dengan semua tab (Fondasi, Kompetitor, Audience, Penawaran, Karakter, Content DNA, Memory, Acuan Bebas, Inspector, Export).
 *
 * Diekstrak dari kalender_konten_planner__3_.html (bundle Vite, di-minify) lalu dirapikan dengan Prettier.
 * Nama variabel pendek (c, d, u, o, j, ...) adalah nama asli hasil minify, belum di-rename.
 *
 * Berisi: Dy
 *
 * Bergantung pada simbol lain di bundle (tidak ikut file ini):
 *   Ar, Cy, Fb, G, Lh, Ll, Nn, Ou, Qb, Rh, T0, Xb, Xn, Zn, _a, _h, _u, bbxImportBtn, bbxMenu, bbxPanel, jn, jr, lk, n, ot, pa, sy, u0, ut, ze
 */

const Dy = ({ isOpen: c, onClose: d, brand: u, onSave: o, onNotify: j }) => {
  const g = { ...pa, ...(u || {}), color: u?.color || pa.color },
    [p, y] = G.useState(g),
    [S, _] = G.useState("foundation"),
    [D, x] = G.useState(!0),
    [b, H] = G.useState(""),
    [F, ne] = G.useState(!1),
    [W, Z] = G.useState(null),
    Q = G.useRef(null),
    [oe, I] = G.useState(null),
    [te, le] = G.useState(""),
    [fe, U] = G.useState(null),
    [ye, ie] = G.useState("all"),
    [Ee, je] = G.useState(!1);
  if (
    (G.useEffect(() => {
      c && (y({ ...pa, ...(u || {}), color: u?.color || pa.color }), Z(null), I(null));
    }, [c, u]),
    !c)
  )
    return null;
  const Ge = Qb(p),
    ke = (f, N) => {
      y((J) => ({ ...J, [f]: N, fieldStatus: { ...(J.fieldStatus || {}), [f]: "confirmed" } }));
    },
    xe = (f, N) => {
      y((J) => {
        const me = { ...(J.positioning || {}), [f]: N },
          qe = `${J.name || "Brand"} adalah ${me.weAre || "solusi"} untuk ${me.forAudience || "audiens"} yang butuh ${me.whoNeed || "jawaban"}, karena ${me.becauseWhy || "teruji"}, berbeda dari ${me.unlike || "alternatif lain"}.`;
        return {
          ...J,
          positioning: {
            ...me,
            statement: me.statement && f !== "statement" ? qe : me.statement || qe,
          },
        };
      });
    },
    z = (f, N) => {
      y((J) => ({
        ...J,
        audienceDNA: {
          ...(J.audienceDNA || {}),
          demographics: { ...(J.audienceDNA?.demographics || {}), [f]: N },
        },
      }));
    },
    E = (f, N) => {
      const J = N.split(
        `
`,
      )
        .map((me) => me.trim())
        .filter(Boolean);
      y((me) => ({
        ...me,
        audienceDNA: {
          ...(me.audienceDNA || {}),
          psychographics: { ...(me.audienceDNA?.psychographics || {}), [f]: J },
        },
      }));
    },
    L = (f, N) => {
      y((J) => ({
        ...J,
        personalityVoice: {
          ...(J.personalityVoice || {}),
          spectrum: { ...(J.personalityVoice?.spectrum || {}), [f]: N },
        },
      }));
    },
    P = (f, N) => {
      const J = N.split(
        `
`,
      )
        .map((me) => me.trim())
        .filter(Boolean);
      y((me) => ({ ...me, personalityVoice: { ...(me.personalityVoice || {}), [f]: J } }));
    },
    ae = (f, N) => {
      const J = N.split(
        `
`,
      )
        .map((me) => me.trim())
        .filter(Boolean);
      y((me) => ({ ...me, brandMemory: { ...(me.brandMemory || {}), [f]: J } }));
    },
    Ne = (f, N) => {
      const J = N.split(
        `
`,
      )
        .map((me) => me.trim())
        .filter(Boolean);
      y((me) => ({
        ...me,
        brandMemory: {
          ...(me.brandMemory || {}),
          claimsGuardrail: { ...(me.brandMemory?.claimsGuardrail || {}), [f]: J },
        },
      }));
    },
    Te = (f, N) => {
      y((J) => ({
        ...J,
        competitorContext: { ...(J.competitorContext || {}), [f]: N },
        fieldStatus: { ...(J.fieldStatus || {}), competitorContext: "confirmed" },
      }));
    },
    Ce = (f, N) => {
      y((J) => ({
        ...J,
        offerConversionDNA: { ...(J.offerConversionDNA || {}), [f]: N },
        fieldStatus: { ...(J.fieldStatus || {}), offerConversionDNA: "confirmed" },
      }));
    },
    k = (f, N) => {
      y((J) => ({
        ...J,
        proofCredibility: { ...(J.proofCredibility || {}), [f]: N },
        fieldStatus: { ...(J.fieldStatus || {}), proofCredibility: "confirmed" },
      }));
    },
    Y = (f, N) => {
      y((J) => ({
        ...J,
        visualDNA: { ...(J.visualDNA || {}), [f]: N },
        fieldStatus: { ...(J.fieldStatus || {}), visualDNA: "confirmed" },
      }));
    },
    pe = (f, N) => {
      y((J) => {
        const me = { ...(J.platformAccounts || {}), [f]: N };
        return {
          ...J,
          platformAccounts: me,
          instagramHandle: f === "instagram" ? N : J.instagramHandle,
        };
      });
    },
    ge = (f) => {
      const N = (f || te).trim();
      N && (y((J) => ({ ...J, customDirectives: [...(J.customDirectives || []), N] })), le(""));
    },
    ee = (f) => {
      y((N) => ({
        ...N,
        customDirectives: (N.customDirectives || []).filter((J, me) => me !== f),
      }));
    },
    re = (f, N) => {
      y((J) => {
        const me = [...(J.customDirectives || [])];
        return ((me[f] = N), { ...J, customDirectives: me });
      });
    },
    Ae = (f = "Aturan Wajib AI") => {
      const N = Xb(f);
      y((J) => ({ ...J, customBlocks: [N, ...(J.customBlocks || [])] }));
    },
    ue = (f) => {
      y((N) => ({
        ...N,
        customBlocks: (N.customBlocks || []).map((J) =>
          J.id === f ? { ...J, isActive: !J.isActive } : J,
        ),
      }));
    },
    we = (f, N) => {
      y((J) => ({
        ...J,
        customBlocks: (J.customBlocks || []).map((me) =>
          me.id === f ? { ...me, ...N, updatedAt: new Date().toISOString() } : me,
        ),
      }));
    },
    da = (f) => {
      y((N) => ({ ...N, customBlocks: (N.customBlocks || []).filter((J) => J.id !== f) }));
    },
    he = async (f) => {
      U(f.id);
      try {
        const N = await u0(f.title, f.category, f.content, p);
        N &&
          (we(f.id, { content: N }),
          j && j("✨ Blok acuan berhasil diperinci dan disempurnakan via AI!", "success"));
      } catch (N) {
        (console.error("Failed to expand block with AI:", N),
          j && j("Gagal mengembangkan blok via AI. Pastikan API Key aktif.", "error"));
      } finally {
        U(null);
      }
    },
    Se = () => {
      const f = ot(p);
      (navigator.clipboard.writeText(f),
        je(!0),
        setTimeout(() => je(!1), 2e3),
        j && j("Seluruh teks acuan Brand Brain berhasil disalin!", "success"));
    },
    M = () => {
      const f = ot(p);
      (Cy(`${p.name || "Brand"}-Brain-Prompt.md`, f, "text/markdown"),
        j && j("File Markdown acuan berhasil diunduh!", "success"));
    },
    T = async () => {
      if (!b.trim()) {
        j && j("Tuliskan cerita/deskripsi brand terlebih dahulu.", "info");
        return;
      }
      ne(!0);
      try {
        const f = await Rh(b);
        (y((N) => ({ ...N, ...f.brand, color: f.brand.color || N.color || "#205c49" })),
          Z(f.analysisSummary || "Brand Brain berhasil diisi 80% otomatis via AI."),
          j && j("Brand Brain berhasil diekstrak dan diisi otomatis!", "success"));
      } catch (f) {
        j && j(f.message || "Gagal mengekstrak profil brand.", "error");
      } finally {
        ne(!1);
      }
    },
    B = (f) => {
      const N = f.target.files?.[0];
      if (!N) return;
      const J = new FileReader();
      ((J.onload = (me) => {
        const qe = me.target?.result;
        if (qe)
          try {
            const na = Lh(qe, N.name);
            (I(N.name),
              na.isFreeformText && na.rawText
                ? (H(na.rawText),
                  j &&
                    j(
                      `File "${N.name}" dimuat. Klik "Ekstrak Brand Brain" untuk memproses.`,
                      "info",
                    ))
                : (y((Ca) => ({ ...Ca, ...na.brand })),
                  j && j(`Brand Brain "${na.brand.name || N.name}" berhasil diimpor!`, "success")));
          } catch (na) {
            j && j(na.message || "Gagal membaca file.", "error");
          }
      }),
        J.readAsText(N));
    },
    $ = (f) => {
      (y(f), j && j(`Brand Brain "${f.name}" berhasil dimuat!`, "success"));
    },
    X = (f) => {
      if ((f.preventDefault(), !p.name.trim())) {
        alert("Nama brand wajib diisi.");
        return;
      }
      (o(p), d());
    },
    se = (f, N) => {
      const J = p.fieldStatus?.[f] || (N ? "confirmed" : "missing");
      return J === "confirmed" || (N && !p.fieldStatus?.[f])
        ? n.jsxs("span", {
            className:
              "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200",
            children: [
              n.jsx(Ar, { className: "w-3 h-3" }),
              n.jsx("span", { children: "Terkonfirmasi" }),
            ],
          })
        : J === "ai_suggested"
          ? n.jsxs("span", {
              className:
                "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200",
              children: [
                n.jsx(ze, { className: "w-3 h-3 text-amber-600" }),
                n.jsx("span", { children: "Saran AI" }),
              ],
            })
          : n.jsxs("span", {
              className:
                "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200",
              children: [
                n.jsx(Ou, { className: "w-3 h-3" }),
                n.jsx("span", { children: "Perlu Diisi" }),
              ],
            });
    };
  return n.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in",
    children: n.jsxs("div", {
      className:
        "bg-white rounded-3xl border border-[#dce4db] shadow-2xl max-w-5xl xl:max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden",
      children: [
        n.jsxs("div", {
          className:
            "p-4 sm:p-5 border-b border-[#edf1eb] flex items-center justify-between bg-[#fafcf9]",
          children: [
            n.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                n.jsx("div", {
                  className:
                    "w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm transition-colors",
                  style: { backgroundColor: p.color || "#205c49" },
                  children: n.jsx(jr, { className: "w-5 h-5" }),
                }),
                n.jsxs("div", {
                  children: [
                    n.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        n.jsx("h2", {
                          className: "text-base sm:text-lg font-bold text-[#142620] font-heading",
                          children: "Brand Brain",
                        }),
                        n.jsx("span", {
                          className:
                            "text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f1e9] text-[#205c49] border border-[#cfded1]",
                          children: "Otak Seluruh Konten",
                        }),
                      ],
                    }),
                    n.jsx("p", {
                      className: "text-xs text-[#697c70] mt-0.5",
                      children:
                        "Satu sumber kebenaran identitas, positioning, psikografi, dan guardrails kreatif untuk seluruh modul AI.",
                    }),
                  ],
                }),
              ],
            }),
            n.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                n.jsx(bbxImportBtn, { brand: p, onNotify: j, onApply: (f) => y(f) }),
                n.jsx(bbxMenu, { brand: p, onNotify: j, onMore: () => _("export") }),
                n.jsxs("button", {
                  type: "button",
                  onClick: () => $(Fb),
                  className:
                    "px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs",
                  title: "Muat contoh lengkap Brand Brain untuk Trajecto",
                  children: [
                    n.jsx(ze, { className: "w-3.5 h-3.5 text-sky-600" }),
                    n.jsx("span", { children: "⚡ Muat Trajecto Brain" }),
                  ],
                }),
                n.jsx("button", {
                  onClick: d,
                  className:
                    "p-2 rounded-xl text-[#697c70] hover:text-[#142620] hover:bg-[#edf2ec] transition-colors",
                  "aria-label": "Tutup",
                  children: n.jsx(Zn, { className: "w-5 h-5" }),
                }),
              ],
            }),
          ],
        }),
        n.jsxs("div", {
          className:
            "px-5 py-3.5 bg-gradient-to-r from-amber-50/70 via-emerald-50/50 to-sky-50/70 border-b border-[#e5ece3]",
          children: [
            n.jsxs("div", {
              className: "flex flex-wrap items-center justify-between gap-3",
              children: [
                n.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    n.jsxs("span", {
                      className: "text-xs font-bold text-[#183127] flex items-center gap-1.5",
                      children: [
                        n.jsx(ze, { className: "w-3.5 h-3.5 text-amber-600" }),
                        n.jsx("span", {
                          children: "Quick Start: Ekstrak Brand Brain 70–80% Otomatis",
                        }),
                      ],
                    }),
                    n.jsxs("span", {
                      className:
                        "text-[10px] px-2 py-0.5 rounded-full bg-white text-[#52665b] border border-[#d2ded2] font-semibold",
                      children: ["Kelengkapan: ", Ge.score, "%"],
                    }),
                  ],
                }),
                n.jsx("button", {
                  type: "button",
                  onClick: () => x(!D),
                  className: "text-xs font-semibold text-[#205c49] hover:underline",
                  children: D ? "Sembunyikan Kotak AI" : "Buka Kotak AI Generator",
                }),
              ],
            }),
            D &&
              n.jsxs("div", {
                className: "mt-2.5 space-y-2",
                children: [
                  n.jsx("textarea", {
                    rows: 2,
                    value: b,
                    onChange: (f) => H(f.target.value),
                    placeholder:
                      "Contoh: Saya punya brand skincare lokal 'Dew Botanicals' untuk wanita pekerja 25-35 tahun yang sibuk. Pembeda kami adalah formula minimalis 3 langkah bebas alkohol dengan hasil calming dalam 7 hari...",
                    className:
                      "w-full px-3.5 py-2 rounded-xl border border-[#cbdcd0] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none bg-white/90 placeholder:text-gray-400",
                  }),
                  n.jsxs("div", {
                    className: "flex items-center justify-between gap-2 flex-wrap",
                    children: [
                      n.jsxs("label", {
                        className:
                          "cursor-pointer inline-flex items-center gap-1.5 text-xs text-[#52665b] hover:text-[#183127]",
                        children: [
                          n.jsx(_u, { className: "w-3.5 h-3.5" }),
                          n.jsx("span", { children: "Unggah materi proposal/file (.md / .json)" }),
                          n.jsx("input", {
                            type: "file",
                            ref: Q,
                            accept: ".json,.md,.markdown,.txt",
                            onChange: B,
                            className: "hidden",
                          }),
                        ],
                      }),
                      n.jsx("button", {
                        type: "button",
                        disabled: F,
                        onClick: T,
                        className:
                          "px-4 py-1.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50",
                        children: F
                          ? n.jsxs(n.Fragment, {
                              children: [
                                n.jsx(Nn, { className: "w-3.5 h-3.5 animate-spin" }),
                                n.jsx("span", { children: "Menganalisis & Mengisi Brain…" }),
                              ],
                            })
                          : n.jsxs(n.Fragment, {
                              children: [
                                n.jsx(ze, { className: "w-3.5 h-3.5 text-amber-300" }),
                                n.jsx("span", { children: "Ekstrak Brand Brain via AI" }),
                              ],
                            }),
                      }),
                    ],
                  }),
                  W &&
                    n.jsxs("div", {
                      className:
                        "p-2.5 rounded-lg bg-white/90 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2",
                      children: [
                        n.jsx(ut, { className: "w-4 h-4 text-emerald-600 shrink-0" }),
                        n.jsxs("span", {
                          children: [W, " Silakan tinjau tab di bawah dan edit sesuai kebutuhan."],
                        }),
                      ],
                    }),
                ],
              }),
          ],
        }),
        n.jsx("div", {
          className: "border-b border-[#edf1eb] bg-[#f8faf7] p-2.5 sm:px-4 select-none",
          children: n.jsx("div", {
            className:
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 bbx-grid10 gap-1.5 sm:gap-2",
            children: [
              {
                id: "foundation",
                icon: "🏛️",
                label: "Fondasi",
                sub: "Positioning",
                field: "positioning",
                hasVal: !!p.positioning?.statement,
              },
              {
                id: "market",
                icon: "⚔️",
                label: "Kompetitor",
                sub: "Rival & Pasar",
                field: "competitorContext",
                hasVal: !!p.competitorContext?.directCompetitors?.length,
              },
              {
                id: "audience",
                icon: "🎯",
                label: "Audience DNA",
                sub: "Pain & Persona",
                field: "audienceDNA",
                hasVal: !!p.audienceDNA?.psychographics?.painPoints?.length,
              },
              {
                id: "offer",
                icon: "💎",
                label: "Penawaran",
                sub: "Bukti & Garansi",
                field: "offerConversionDNA",
                hasVal: !!p.offerConversionDNA?.mainOffer,
              },
              {
                id: "personality",
                icon: "🎭",
                label: "Karakter & Gaya",
                sub: "Voice & Visual",
                field: "personalityVoice",
                hasVal: !!p.personalityVoice?.humanPersona,
              },
              {
                id: "content",
                icon: "📊",
                label: "Content DNA",
                sub: "Pilar & CTA",
                field: "contentDNA",
                hasVal: !!p.contentDNA?.pillars?.length,
              },
              {
                id: "memory",
                icon: "🧠",
                label: "Brand Memory",
                sub: "Guardrails",
                field: "brandMemory",
                hasVal: !!p.brandMemory?.alwaysSay?.length,
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
                ),
              },
              {
                id: "inspector",
                icon: "👁️",
                label: "AI Inspector",
                sub: "Live Prompt",
                field: "aiPersonaInstructions",
                hasVal: !!(p.aiPersonaInstructions || p.positioning?.statement),
              },
              {
                id: "export",
                icon: "📤",
                label: "Export",
                sub: "Form Ekspor",
                field: "__export",
                hasVal: !!p.name,
              },
            ].map((f) => {
              const N = S === f.id,
                J = p.fieldStatus?.[f.field],
                me = f.hasVal || J === "confirmed",
                qe = J === "ai_suggested";
              return n.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => _(f.id),
                  className: `py-2 px-2 sm:px-2.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-1 ${N ? "bg-white border-[#205c49]/40 shadow-xs ring-1 ring-[#205c49]/20" : "bg-[#f0f4ef]/60 border-transparent hover:bg-white/90 hover:border-[#dce4db]"}`,
                  children: [
                    n.jsxs("div", {
                      className: "flex items-center justify-between gap-1 w-full",
                      children: [
                        n.jsx("span", { className: "text-sm shrink-0", children: f.icon }),
                        n.jsx("span", {
                          className: `w-2 h-2 rounded-full shrink-0 ${me ? "bg-emerald-500" : qe ? "bg-amber-500 animate-pulse" : "bg-rose-400"}`,
                          title: me ? "Terkonfirmasi / Terisi" : qe ? "Saran AI" : "Perlu Diisi",
                        }),
                      ],
                    }),
                    n.jsxs("div", {
                      className: "min-w-0",
                      children: [
                        n.jsx("div", {
                          className: `text-xs truncate ${N ? "font-bold text-[#142620]" : "font-semibold text-[#485c51]"}`,
                          children: f.label,
                        }),
                        n.jsx("div", {
                          className: "text-[10px] text-[#718478] truncate leading-tight",
                          children: f.sub,
                        }),
                      ],
                    }),
                  ],
                },
                f.id,
              );
            }),
          }),
        }),
        n.jsxs("form", {
          id: "brand-brain-form",
          onSubmit: X,
          className: "flex-1 overflow-y-auto p-5 sm:p-6 space-y-6",
          children: [
            S === "foundation" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "1. Identitas Inti Brand" }),
                          se("foundation", !!(p.name && p.product)),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Nama Brand *",
                              }),
                              n.jsx("input", {
                                type: "text",
                                required: !0,
                                value: p.name,
                                onChange: (f) => ke("name", f.target.value),
                                placeholder: "cth: Trajecto",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Kategori / Industri",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.category || "",
                                onChange: (f) => ke("category", f.target.value),
                                placeholder: "cth: Aplikasi Produktivitas / SaaS",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Website / Link Bio",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.website || "",
                                onChange: (f) => ke("website", f.target.value),
                                placeholder: "https://trajecto.web.app",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className:
                          "p-3.5 rounded-xl border border-[#dce6dc] bg-[#f8fbf8] space-y-3",
                        children: [
                          n.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              n.jsxs("span", {
                                className:
                                  "text-xs font-bold text-[#183127] flex items-center gap-1.5",
                                children: [
                                  n.jsx("span", { children: "Akun Platform Resmi Brand" }),
                                  n.jsx("span", {
                                    className:
                                      "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e8f1e9] text-[#205c49] border border-[#cfded1]",
                                    children: "Acuan Kalender Konten",
                                  }),
                                ],
                              }),
                              n.jsx("span", {
                                className: "text-[10px] text-[#697c70]",
                                children: "Digunakan untuk alokasi otomatis postingan per akun",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                            children: [
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-[11px] font-semibold text-[#183127] mb-1 flex items-center gap-1",
                                    children: n.jsx("span", { children: "📸 Instagram" }),
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.platformAccounts?.instagram || p.instagramHandle || "",
                                    onChange: (f) => pe("instagram", f.target.value),
                                    placeholder: "@trajecto.app",
                                    className:
                                      "w-full px-2.5 py-1.5 rounded-lg border border-[#cbdcd0] bg-white text-xs outline-none focus:border-[#205c49]",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-[11px] font-semibold text-[#183127] mb-1 flex items-center gap-1",
                                    children: n.jsx("span", { children: "🎵 TikTok" }),
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.platformAccounts?.tiktok || "",
                                    onChange: (f) => pe("tiktok", f.target.value),
                                    placeholder: "@trajecto.id",
                                    className:
                                      "w-full px-2.5 py-1.5 rounded-lg border border-[#cbdcd0] bg-white text-xs outline-none focus:border-[#205c49]",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-[11px] font-semibold text-[#183127] mb-1 flex items-center gap-1",
                                    children: n.jsx("span", { children: "🧵 Threads / X" }),
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.platformAccounts?.threads || "",
                                    onChange: (f) => pe("threads", f.target.value),
                                    placeholder: "@trajecto.app",
                                    className:
                                      "w-full px-2.5 py-1.5 rounded-lg border border-[#cbdcd0] bg-white text-xs outline-none focus:border-[#205c49]",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-[11px] font-semibold text-[#183127] mb-1 flex items-center gap-1",
                                    children: n.jsx("span", { children: "💼 LinkedIn" }),
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.platformAccounts?.linkedin || "",
                                    onChange: (f) => pe("linkedin", f.target.value),
                                    placeholder: "company/trajecto",
                                    className:
                                      "w-full px-2.5 py-1.5 rounded-lg border border-[#cbdcd0] bg-white text-xs outline-none focus:border-[#205c49]",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-[11px] font-semibold text-[#183127] mb-1 flex items-center gap-1",
                                    children: n.jsx("span", { children: "▶️ YouTube" }),
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.platformAccounts?.youtube || "",
                                    onChange: (f) => pe("youtube", f.target.value),
                                    placeholder: "@trajecto-app",
                                    className:
                                      "w-full px-2.5 py-1.5 rounded-lg border border-[#cbdcd0] bg-white text-xs outline-none focus:border-[#205c49]",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className:
                                      "block text-[11px] font-semibold text-[#183127] mb-1 flex items-center gap-1",
                                    children: n.jsx("span", { children: "👥 Facebook Page" }),
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.platformAccounts?.facebook || "",
                                    onChange: (f) => pe("facebook", f.target.value),
                                    placeholder: "TrajectoOfficial",
                                    className:
                                      "w-full px-2.5 py-1.5 rounded-lg border border-[#cbdcd0] bg-white text-xs outline-none focus:border-[#205c49]",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("label", {
                            className: "block text-xs font-semibold text-[#183127] mb-1",
                            children: "Produk / Layanan Utama",
                          }),
                          n.jsx("input", {
                            type: "text",
                            value: p.product,
                            onChange: (f) => ke("product", f.target.value),
                            placeholder:
                              "cth: All-in-One Personal Productivity, Time-Blocking & Agile Focus Operating System",
                            className:
                              "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsxs("label", {
                            className:
                              "block text-xs font-semibold text-[#183127] mb-1 flex items-center justify-between",
                            children: [
                              n.jsx("span", { children: "Brand Promise (Janji Nyata Brand)" }),
                              n.jsx("span", {
                                className: "text-[10px] text-[#697c70] font-normal",
                                children: "Membantu [Audience] melakukan [Hasil] tanpa [Hambatan]",
                              }),
                            ],
                          }),
                          n.jsx("textarea", {
                            rows: 2,
                            value: p.brandPromise || "",
                            onChange: (f) => ke("brandPromise", f.target.value),
                            placeholder:
                              "cth: Membantu freelancer menyelesaikan kerjaan prioritas sebelum jam 5 sore tanpa stres dan tanpa terjebak siklus bikin template berjam-jam.",
                            className:
                              "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Warna Identitas (Primary Hex)",
                              }),
                              n.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  n.jsx("input", {
                                    type: "color",
                                    value: p.color || "#205c49",
                                    onChange: (f) => ke("color", f.target.value),
                                    className:
                                      "w-9 h-9 rounded-xl border border-[#d6dfd5] cursor-pointer p-0.5 bg-white",
                                  }),
                                  n.jsx("input", {
                                    type: "text",
                                    value: p.color || "#205c49",
                                    onChange: (f) => ke("color", f.target.value),
                                    className:
                                      "w-28 px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs font-mono uppercase",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Website / Landing Page",
                              }),
                              n.jsx("input", {
                                type: "url",
                                value: p.website || "",
                                onChange: (f) => ke("website", f.target.value),
                                placeholder: "https://trajecto.web.app",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "2. Positioning Framework (Wajib Pembeda)" }),
                          se("positioning", !!p.positioning?.statement),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "We Are (Apa sebenarnya brand ini?)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.positioning?.weAre || "",
                                onChange: (f) => xe("weAre", f.target.value),
                                placeholder: "cth: Personal Agile Focus Operating System",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "For (Siapa target utamanya?)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.positioning?.forAudience || "",
                                onChange: (f) => xe("forAudience", f.target.value),
                                placeholder:
                                  "cth: Freelancer & solo founder yang to-do list-nya menumpuk",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Who Need (Masalah apa yang mereka punya?)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.positioning?.whoNeed || "",
                                onChange: (f) => xe("whoNeed", f.target.value),
                                placeholder:
                                  "cth: Sistem kerja harian yang membatasi overload dan memicu eksekusi nyata",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Because (Kenapa harus percaya / Bukti?)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.positioning?.becauseWhy || "",
                                onChange: (f) => xe("becauseWhy", f.target.value),
                                placeholder:
                                  "cth: Metode Agile Sprint 1-hari dan visual time-blocking interaktif langsung di browser",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("label", {
                            className: "block text-xs font-semibold text-[#183127] mb-1",
                            children:
                              "Unlike (Apa perbedaan dengan alternatif / kompetitor yang dihindari?)",
                          }),
                          n.jsx("input", {
                            type: "text",
                            value: p.positioning?.unlike || "",
                            onChange: (f) => xe("unlike", f.target.value),
                            placeholder:
                              "cth: Notion yang makan waktu seharian buat setup template atau to-do list pasif yang bikin stres",
                            className:
                              "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className:
                          "p-3.5 rounded-xl bg-[#f0f6ee] border border-[#d3e3d0] space-y-1",
                        children: [
                          n.jsx("span", {
                            className:
                              "text-[10px] font-bold uppercase tracking-wider text-emerald-900 block",
                            children: "Positioning Statement Otomatis untuk AI:",
                          }),
                          n.jsxs("p", {
                            className: "text-xs text-[#1c4535] font-medium leading-relaxed italic",
                            children: [
                              '"',
                              p.positioning?.statement ||
                                "Lengkapi form di atas untuk menghasilkan positioning statement otomatis.",
                              '"',
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "market" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-[#ecf3ea]/60 border border-[#cfe0cc] rounded-2xl p-4 text-xs text-[#245946] flex items-start gap-3",
                    children: [
                      n.jsx(sy, { className: "w-5 h-5 shrink-0 mt-0.5 text-[#205c49]" }),
                      n.jsxs("div", {
                        className: "leading-relaxed",
                        children: [
                          n.jsx("p", {
                            className: "font-bold text-sm mb-0.5 text-[#183127]",
                            children: "Fakta Lapangan & Peta Kompetisi Nyata",
                          }),
                          n.jsx("p", {
                            className: "text-[#3d6554]",
                            children:
                              "Strategi bukan onani konsep di atas kertas. AI butuh tahu persis siapa lawan di lapangan, apa kebiasaan alternatif konsumen, dan apa kelemahan kompetitor agar konten Anda menusuk tepat di rasa frustrasi pasar.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "1. Pemetaan Lawan & Alternatif di Lapangan" }),
                          se("competitorContext", !!p.competitorContext?.directCompetitors?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Kompetitor Langsung (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.competitorContext?.directCompetitors || []).join(`
`),
                                onChange: (f) =>
                                  Te(
                                    "directCompetitors",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `Notion
ClickUp
Sunsama`,
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-[#728378] mt-1",
                                children:
                                  "Brand yang biasa dibandingkan langsung oleh prospek sebelum membeli.",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Alternatif Substitusi Saat Ini (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.competitorContext?.indirectCompetitors || []).join(`
`),
                                onChange: (f) =>
                                  Te(
                                    "indirectCompetitors",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `Buku catatan kertas (bullet journal)
Google Calendar kosongan
Kirim chat WhatsApp ke nomor sendiri`,
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-[#728378] mt-1",
                                children:
                                  "Kebiasaan lama atau 'cara gratisan' yang sekarang masih mereka pakai.",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsx("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: n.jsx("span", {
                          children: "2. Celah Pasar & Pagar Pembeda (Differentiator Reality)",
                        }),
                      }),
                      n.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children:
                                  "Kelemahan Kompetitor / Rasa Frustrasi Konsumen di Lapangan",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: p.competitorContext?.competitorWeakness || "",
                                onChange: (f) => Te("competitorWeakness", f.target.value),
                                placeholder:
                                  "Cth: Notion & ClickUp terlalu lambat dan rumit (feature bloatware), butuh waktu belajar berjam-jam sehingga memicu productive procrastination. Sunsama terlalu mahal (US$20/bln) dan wajib kartu kredit luar negeri.",
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-[#728378] mt-1",
                                children:
                                  "Kekecewaan riil yang sering diungkapkan pelanggan kompetitor di forum atau kolom review.",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-rose-900 mb-1",
                                children:
                                  "Hal yang Dilakukan Kompetitor tapi HARAM Ditiru oleh Brand Kita (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.competitorContext?.whatWeWillNeverDo || []).join(`
`),
                                onChange: (f) =>
                                  Te(
                                    "whatWeWillNeverDo",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `Jangan pernah meminta user setting database relasional atau bikin template dari nol
Jangan pernah memasang paywall mahal sebelum user merasakan manfaat sprint 1 hari
Jangan pernah membuat UI kaku yang terasa seperti dashboard korporat`,
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-rose-700 mt-1",
                                children:
                                  "Pagar kreatif agar konten AI tidak menjiplak gaya atau jebakan klise pemain lama.",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "audience" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "1. Demografi & Persona Primer" }),
                          se("audienceDNA", !!p.audienceDNA?.demographics?.age),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Rentang Usia",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.audienceDNA?.demographics?.age || "",
                                onChange: (f) => z("age", f.target.value),
                                placeholder: "cth: 22 - 35 tahun",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Pekerjaan / Profesi",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.audienceDNA?.demographics?.occupation || "",
                                onChange: (f) => z("occupation", f.target.value),
                                placeholder: "cth: Freelancer, Desainer, Software Engineer",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Lifestyle & Kebiasaan",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.audienceDNA?.demographics?.lifestyle || "",
                                onChange: (f) => z("lifestyle", f.target.value),
                                placeholder: "cth: WFH, sering ke coffee shop, tech-savvy",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("label", {
                            className: "block text-xs font-semibold text-[#183127] mb-1",
                            children: "Ringkasan Audiens (Backwards-Compatible)",
                          }),
                          n.jsx("input", {
                            type: "text",
                            value: p.audience,
                            onChange: (f) => ke("audience", f.target.value),
                            placeholder:
                              "cth: Freelancer, remote worker, dan solopreneur yang burnout karena to-do list menumpuk",
                            className:
                              "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", {
                            children: "2. Psikografis Mendalam (Bahan Bakar Hook AI)",
                          }),
                          se("audienceDNA", !!p.audienceDNA?.psychographics?.painPoints?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-rose-900 mb-1",
                                children: "Pain Points / Frustrasi (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 4,
                                value: (p.audienceDNA?.psychographics?.painPoints || []).join(`
`),
                                onChange: (f) => E("painPoints", f.target.value),
                                placeholder: `To-do list puluhan item bikin cemas
Habis waktu berjam-jam bikin dashboard Notion estetik
Tidur malam dengan rasa bersalah`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-emerald-900 mb-1",
                                children: "Desires / Impian Terbesar (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 4,
                                value: (p.audienceDNA?.psychographics?.desires || []).join(`
`),
                                onChange: (f) => E("desires", f.target.value),
                                placeholder: `Tutup laptop jam 5 sore dengan tenang
Hanya fokus 2-3 tugas bernilai tinggi
Sistem kerja langsung jalan tanpa setup`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/20 text-xs focus:ring-2 focus:ring-emerald-500/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-amber-900 mb-1",
                                children: "Objections / Keraguan Beli (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 4,
                                value: (p.audienceDNA?.psychographics?.objections || []).join(`
`),
                                onChange: (f) => E("objections", f.target.value),
                                placeholder: `Paling ribet setup lagi kayak tool lain
Biaya langganan mahal dollar kartu kredit
Takut dianggurin lagi setelah beli`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-amber-200 bg-amber-50/20 text-xs focus:ring-2 focus:ring-amber-500/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children:
                                  "Scroll Stoppers (Apa yang bikin mereka berhenti scrolling?)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.audienceDNA?.contentBehavior?.scrollStoppers || "",
                                onChange: (f) =>
                                  y((N) => ({
                                    ...N,
                                    audienceDNA: {
                                      ...(N.audienceDNA || {}),
                                      contentBehavior: {
                                        ...(N.audienceDNA?.contentBehavior || {}),
                                        scrollStoppers: f.target.value,
                                      },
                                    },
                                  })),
                                placeholder:
                                  "cth: Pengakuan jujur productive procrastination, perbandingan Notion vs realita",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children:
                                  "Comment Triggers (Apa yang memicu mereka komentar/debat?)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.audienceDNA?.contentBehavior?.commentTriggers || "",
                                onChange: (f) =>
                                  y((N) => ({
                                    ...N,
                                    audienceDNA: {
                                      ...(N.audienceDNA || {}),
                                      contentBehavior: {
                                        ...(N.audienceDNA?.contentBehavior || {}),
                                        commentTriggers: f.target.value,
                                      },
                                    },
                                  })),
                                placeholder:
                                  "cth: Debat to-do list vs time-blocking, curhat jam kerja freelancer yang kacau",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "offer" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-[#ecf3ea]/60 border border-[#cfe0cc] rounded-2xl p-4 text-xs text-[#245946] flex items-start gap-3",
                    children: [
                      n.jsx(lk, { className: "w-5 h-5 shrink-0 mt-0.5 text-[#205c49]" }),
                      n.jsxs("div", {
                        className: "leading-relaxed",
                        children: [
                          n.jsx("p", {
                            className: "font-bold text-sm mb-0.5 text-[#183127]",
                            children: "Arsitektur Penawaran & Bukti Empiris Lapangan",
                          }),
                          n.jsx("p", {
                            className: "text-[#3d6554]",
                            children:
                              "Konten tanpa penawaran konkret dan bukti lapangan hanyalah omong kosong. Data ini dipakai AI untuk menyusun hook studi kasus, mengatasi keraguan harga, dan CTA penutup yang realistis.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", {
                            children: "1. Detail Penawaran & Transaksi (Offer Architecture)",
                          }),
                          se("offerConversionDNA", !!p.offerConversionDNA?.mainOffer),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Hero Offer (Produk/Penawaran Utama)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.offerConversionDNA?.mainOffer || "",
                                onChange: (f) => Ce("mainOffer", f.target.value),
                                placeholder: "Cth: Trajecto Annual Pro / Lifetime License",
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Entry Offer / Lead Magnet / Free Tier",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.offerConversionDNA?.entryOffer || "",
                                onChange: (f) => Ce("entryOffer", f.target.value),
                                placeholder: "Cth: Free Web-Sprint Sandbox langsung di browser",
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Rentang Harga & Model Pembayaran",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.offerConversionDNA?.priceRange || "",
                                onChange: (f) => Ce("priceRange", f.target.value),
                                placeholder:
                                  "Cth: Gratis untuk Free Web Access • Rp 99.000/tahun untuk Cloud Sync",
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Garansi & Risk Reversal (Peredam Keraguan)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.offerConversionDNA?.riskReversal || "",
                                onChange: (f) => Ce("riskReversal", f.target.value),
                                placeholder:
                                  "Cth: 30-Hari jaminan uang kembali 100% tanpa tanya jika tidak merasa lebih fokus",
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className: "sm:col-span-2",
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children: "Mekanisme Transaksi / Jalur Checkout (Purchase Path)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.offerConversionDNA?.purchasePath || "",
                                onChange: (f) => Ce("purchasePath", f.target.value),
                                placeholder:
                                  "Cth: Direct Web Checkout via QRIS, GoPay, ShopeePay di trajecto.web.app / Kirim DM Instagram",
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", {
                            children: "2. Bukti Empiris & Kredibilitas di Lapangan",
                          }),
                          se("proofCredibility", !!p.proofCredibility?.hardProofPoints?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "space-y-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children:
                                  "Bukti Keras / Data Nyata (1 per baris: angka pengguna, riset, akreditasi, rating)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.proofCredibility?.hardProofPoints || []).join(`
`),
                                onChange: (f) =>
                                  k(
                                    "hardProofPoints",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `Dipakai oleh lebih dari 1.200+ freelancer & digital nomad aktif
Rata-rata user menghemat 2,5 jam per hari dari siklus to-do list berantakan
Rating kepuasan 4.9/5 dari komunitas kreator mandiri`,
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children:
                                  "Kisah Transformasi Nyata (Before & After Lapangan, 1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.proofCredibility?.caseTransformations || []).join(`
`),
                                onChange: (f) =>
                                  k(
                                    "caseTransformations",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `UI/UX Designer yang sebelumnya lembur sampai jam 2 pagi, kini konsisten tutup laptop jam 5 sore setelah membatasi 3 tugas per hari.
Software engineer freelance yang berhenti terjebak 'Notion restructuring loop' dan berhasil merilis 2 side project dalam 1 bulan.`,
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-[#183127] mb-1",
                                children:
                                  "Suara Asli Pelanggan (Raw Customer Voice / Kutipan Asli, 1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.proofCredibility?.customerVoiceRaw || []).join(`
`),
                                onChange: (f) =>
                                  k(
                                    "customerVoiceRaw",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `'Gue capek tiap malam ngerasa bersalah padahal seharian di depan laptop. Trajecto bikin batasan kerja gue jadi nyata.'
'Akhirnya ada tools yang nggak nyuruh gue belajar nonton tutorial YouTube cuma buat nyatet kerjaan hari ini.'`,
                                className:
                                  "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-[#728378] mt-1",
                                children:
                                  "Bahan bakar emas untuk AI merangkai hook relatable dan skenario video UGC.",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "personality" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "1. Personifikasi & Spektrum Karakter" }),
                          se("personalityVoice", !!p.personalityVoice?.humanPersona),
                        ],
                      }),
                      n.jsxs("div", {
                        children: [
                          n.jsx("label", {
                            className: "block text-xs font-semibold text-[#183127] mb-1",
                            children: "Jika Brand Ini Seorang Manusia, Karakter Bicaranya Seperti:",
                          }),
                          n.jsx("input", {
                            type: "text",
                            value: p.personalityVoice?.humanPersona || "",
                            onChange: (f) =>
                              y((N) => ({
                                ...N,
                                personalityVoice: {
                                  ...(N.personalityVoice || {}),
                                  humanPersona: f.target.value,
                                },
                              })),
                            placeholder:
                              "cth: Teman pintar yang santai di coffee shop: bicaranya blak-blakan jujur, nggak suka teori berbusa, fokus eksekusi.",
                            className:
                              "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "space-y-3 pt-2",
                        children: [
                          n.jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              n.jsx("span", {
                                className: "text-xs font-bold text-[#183127]",
                                children: "Spektrum Nada Bicara:",
                              }),
                              n.jsx("span", {
                                className: "text-[11px] text-[#697c70]",
                                children: "Geser untuk menentukan gaya bahasa AI",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs",
                            children: [
                              n.jsxs("div", {
                                className: "p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]",
                                children: [
                                  n.jsxs("div", {
                                    className:
                                      "flex justify-between text-[11px] font-medium text-[#52665b] mb-1.5",
                                    children: [
                                      n.jsx("span", { children: "Formal (0%)" }),
                                      n.jsxs("span", {
                                        className:
                                          "font-bold text-[#205c49] px-2 py-0.5 rounded-md bg-[#205c49]/10",
                                        children: [
                                          p.personalityVoice?.spectrum?.formality ?? 80,
                                          "% Casual",
                                        ],
                                      }),
                                      n.jsx("span", { children: "Kasual (100%)" }),
                                    ],
                                  }),
                                  n.jsx("input", {
                                    type: "range",
                                    min: "0",
                                    max: "100",
                                    value: p.personalityVoice?.spectrum?.formality ?? 80,
                                    onChange: (f) => L("formality", Number(f.target.value)),
                                    className: "w-full accent-[#205c49] cursor-pointer",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                className: "p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]",
                                children: [
                                  n.jsxs("div", {
                                    className:
                                      "flex justify-between text-[11px] font-medium text-[#52665b] mb-1.5",
                                    children: [
                                      n.jsx("span", { children: "Serius (0%)" }),
                                      n.jsxs("span", {
                                        className:
                                          "font-bold text-[#205c49] px-2 py-0.5 rounded-md bg-[#205c49]/10",
                                        children: [
                                          p.personalityVoice?.spectrum?.playfulness ?? 55,
                                          "% Playful",
                                        ],
                                      }),
                                      n.jsx("span", { children: "Ceria (100%)" }),
                                    ],
                                  }),
                                  n.jsx("input", {
                                    type: "range",
                                    min: "0",
                                    max: "100",
                                    value: p.personalityVoice?.spectrum?.playfulness ?? 55,
                                    onChange: (f) => L("playfulness", Number(f.target.value)),
                                    className: "w-full accent-[#205c49] cursor-pointer",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                className: "p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]",
                                children: [
                                  n.jsxs("div", {
                                    className:
                                      "flex justify-between text-[11px] font-medium text-[#52665b] mb-1.5",
                                    children: [
                                      n.jsx("span", { children: "Pakar Dingin (0%)" }),
                                      n.jsxs("span", {
                                        className:
                                          "font-bold text-[#205c49] px-2 py-0.5 rounded-md bg-[#205c49]/10",
                                        children: [
                                          p.personalityVoice?.spectrum?.approach ?? 75,
                                          "% Bersahabat",
                                        ],
                                      }),
                                      n.jsx("span", { children: "Sahabat Dekat (100%)" }),
                                    ],
                                  }),
                                  n.jsx("input", {
                                    type: "range",
                                    min: "0",
                                    max: "100",
                                    value: p.personalityVoice?.spectrum?.approach ?? 75,
                                    onChange: (f) => L("approach", Number(f.target.value)),
                                    className: "w-full accent-[#205c49] cursor-pointer",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                className: "p-3.5 rounded-xl bg-[#f8faf7] border border-[#e2e8e0]",
                                children: [
                                  n.jsxs("div", {
                                    className:
                                      "flex justify-between text-[11px] font-medium text-[#52665b] mb-1.5",
                                    children: [
                                      n.jsx("span", { children: "Hati-hati (0%)" }),
                                      n.jsxs("span", {
                                        className:
                                          "font-bold text-[#205c49] px-2 py-0.5 rounded-md bg-[#205c49]/10",
                                        children: [
                                          p.personalityVoice?.spectrum?.energy ?? 70,
                                          "% Berani / Bold",
                                        ],
                                      }),
                                      n.jsx("span", { children: "Blak-blakan (100%)" }),
                                    ],
                                  }),
                                  n.jsx("input", {
                                    type: "range",
                                    min: "0",
                                    max: "100",
                                    value: p.personalityVoice?.spectrum?.energy ?? 70,
                                    onChange: (f) => L("energy", Number(f.target.value)),
                                    className: "w-full accent-[#205c49] cursor-pointer",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "2. Aturan Gaya Bahasa (DO vs DON'T)" }),
                          se("personalityVoice", !!p.personalityVoice?.voiceDo?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
                        children: [
                          n.jsxs("div", {
                            className:
                              "p-4 rounded-2xl bg-emerald-50/30 border border-emerald-200/80 space-y-4",
                            children: [
                              n.jsxs("div", {
                                children: [
                                  n.jsxs("div", {
                                    className: "flex items-center gap-1.5 mb-1.5",
                                    children: [
                                      n.jsx("span", {
                                        className: "w-2 h-2 rounded-full bg-emerald-600",
                                      }),
                                      n.jsx("label", {
                                        className: "text-xs font-bold text-emerald-950",
                                        children: "DO (Aturan Wajib Diterapkan — 1 per baris)",
                                      }),
                                    ],
                                  }),
                                  n.jsx("textarea", {
                                    rows: 4,
                                    value: (p.personalityVoice?.voiceDo || []).join(`
`),
                                    onChange: (f) => P("voiceDo", f.target.value),
                                    placeholder: `Gunakan bahasa Indonesia santai dan natural
Tulis kalimat pendek dan tajam
Gunakan analogi konkret situasi kerja sehari-hari`,
                                    className:
                                      "w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/30 outline-none",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className: "block text-xs font-bold text-emerald-950 mb-1.5",
                                    children: "Signature Words (Kosa Kata Khas — 1 per baris)",
                                  }),
                                  n.jsx("textarea", {
                                    rows: 3,
                                    value: (p.personalityVoice?.signatureWords || []).join(`
`),
                                    onChange: (f) => P("signatureWords", f.target.value),
                                    placeholder: `productive procrastination
Agile Sprint personal
eksekusi riil
Notion fatigue`,
                                    className:
                                      "w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                                  }),
                                ],
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className:
                              "p-4 rounded-2xl bg-rose-50/30 border border-rose-200/80 space-y-4",
                            children: [
                              n.jsxs("div", {
                                children: [
                                  n.jsxs("div", {
                                    className: "flex items-center gap-1.5 mb-1.5",
                                    children: [
                                      n.jsx("span", {
                                        className: "w-2 h-2 rounded-full bg-rose-600",
                                      }),
                                      n.jsx("label", {
                                        className: "text-xs font-bold text-rose-950",
                                        children: "DON'T (Haram Digunakan — 1 per baris)",
                                      }),
                                    ],
                                  }),
                                  n.jsx("textarea", {
                                    rows: 4,
                                    value: (p.personalityVoice?.voiceDont || []).join(`
`),
                                    onChange: (f) => P("voiceDont", f.target.value),
                                    placeholder: `Jangan gunakan motivasi klise ('gapai mimpimu')
Jangan gunakan jargon korporat kaku ('sinergi menyeluruh')
Jangan hard-selling berteriak diskon murahan`,
                                    className:
                                      "w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                                  }),
                                ],
                              }),
                              n.jsxs("div", {
                                children: [
                                  n.jsx("label", {
                                    className: "block text-xs font-bold text-rose-950 mb-1.5",
                                    children: "Forbidden Words (Kata Terlarang — 1 per baris)",
                                  }),
                                  n.jsx("textarea", {
                                    rows: 3,
                                    value: (p.personalityVoice?.forbiddenWords || []).join(`
`),
                                    onChange: (f) => P("forbiddenWords", f.target.value),
                                    placeholder: `cepat kaya
terbukti 100% tanpa usaha
wajib beli sekarang
revolusi hidup`,
                                    className:
                                      "w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", {
                            children: "3. Arah Visual & Art Direction (Anti-Slop Guardrail)",
                          }),
                          se("visualDNA", !!p.visualDNA?.photographyStyle?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-5",
                        children: [
                          n.jsxs("div", {
                            className:
                              "p-4 rounded-2xl bg-[#fafcf9] border border-[#dce4db] space-y-2",
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-bold text-[#183127]",
                                children: "Arah Fotografi & Footage Riil (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.visualDNA?.photographyStyle || []).join(`
`),
                                onChange: (f) =>
                                  Y(
                                    "photographyStyle",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `Authentic Smartphone UGC (layar laptop di coffee shop)
Clean candid work-in-progress nyata
Screen recording demo 10 detik to-the-point`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] bg-white text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-[#728378]",
                                children:
                                  "Dipakai sebagai acuan arahan visual pada rencana konten.",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className:
                              "p-4 rounded-2xl bg-rose-50/20 border border-rose-200/80 space-y-2",
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-bold text-rose-950",
                                children: "Visual yang DILARANG / Anti-Slop (1 per baris)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.visualDNA?.visualDoNotUse || []).join(`
`),
                                onChange: (f) =>
                                  Y(
                                    "visualDoNotUse",
                                    f.target.value
                                      .split(
                                        `
`,
                                      )
                                      .map((N) => N.trim())
                                      .filter(Boolean),
                                  ),
                                placeholder: `Foto stok korporat kaku berjas senyum di ruang rapat
Grafik 3D kartun generik yang tidak membumi
Tipografi kecil tidak terbaca di smartphone`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                              }),
                              n.jsx("p", {
                                className: "text-[10px] text-rose-700",
                                children:
                                  "Pagar agar output visual tidak terasa seperti gambar template generik.",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "content" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "1. Pilar Konten & Alokasi Persentase" }),
                          se("contentDNA", !!p.contentDNA?.pillars?.length),
                        ],
                      }),
                      n.jsx("div", {
                        className: "space-y-3",
                        children: (
                          p.contentDNA?.pillars || [
                            {
                              name: "Edukasi & Bongkar Mitos",
                              percentage: 35,
                              description: "Bedah masalah dan cara time-blocking",
                            },
                            {
                              name: "Prinsip Kerja & Nilai",
                              percentage: 25,
                              description: "Filosofi fokus tenang dan batasan kerja",
                            },
                            {
                              name: "Showcase Fitur & Solusi",
                              percentage: 20,
                              description: "Demo visual browser dan kartu sprint",
                            },
                            {
                              name: "Relatable Story & Curhat",
                              percentage: 20,
                              description: "Kisah harian kehidupan mandiri",
                            },
                          ]
                        ).map((f, N) =>
                          n.jsxs(
                            "div",
                            {
                              className:
                                "flex items-center gap-3 p-2.5 rounded-xl border border-[#edf1eb] bg-[#fafcf9]",
                              children: [
                                n.jsx("div", {
                                  className:
                                    "w-8 h-8 rounded-lg bg-[#205c49]/10 text-[#205c49] font-bold text-xs flex items-center justify-center shrink-0",
                                  children: N + 1,
                                }),
                                n.jsxs("div", {
                                  className: "flex-1 min-w-0",
                                  children: [
                                    n.jsxs("div", {
                                      className: "flex items-center justify-between gap-2",
                                      children: [
                                        n.jsx("span", {
                                          className: "text-xs font-bold text-[#142620] truncate",
                                          children: f.name,
                                        }),
                                        n.jsxs("span", {
                                          className: "text-xs font-bold text-[#205c49]",
                                          children: [f.percentage, "%"],
                                        }),
                                      ],
                                    }),
                                    n.jsx("p", {
                                      className: "text-[11px] text-[#697c70] truncate",
                                      children: f.description,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            N,
                          ),
                        ),
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", {
                            children: "2. Pemetaan Call to Action (CTA) Sesuai Funnel",
                          }),
                          se("contentDNA", !!p.contentDNA?.funnelCTA?.awareness),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-blue-900 mb-1",
                                children: "🌟 Awareness CTA (Konten Jangkauan / Viral)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.contentDNA?.funnelCTA?.awareness || "",
                                onChange: (f) =>
                                  y((N) => ({
                                    ...N,
                                    contentDNA: {
                                      ...(N.contentDNA || {}),
                                      funnelCTA: {
                                        ...(N.contentDNA?.funnelCTA || {}),
                                        awareness: f.target.value,
                                      },
                                    },
                                  })),
                                placeholder:
                                  "Simpan postingan ini biar lo ingat pas to-do list mulai berantakan besok.",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-blue-200 text-xs focus:ring-2 focus:ring-blue-500/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-amber-900 mb-1",
                                children: "🤝 Consideration CTA (Konten Edukasi / Kepercayaan)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.contentDNA?.funnelCTA?.consideration || "",
                                onChange: (f) =>
                                  y((N) => ({
                                    ...N,
                                    contentDNA: {
                                      ...(N.contentDNA || {}),
                                      funnelCTA: {
                                        ...(N.contentDNA?.funnelCTA || {}),
                                        consideration: f.target.value,
                                      },
                                    },
                                  })),
                                placeholder:
                                  "Coba tes cara kerja time-blocking visual di browser lo: trajecto.web.app",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-amber-200 text-xs focus:ring-2 focus:ring-amber-500/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-rose-900 mb-1",
                                children: "🔥 Conversion CTA (Konten Penawaran / Checkout)",
                              }),
                              n.jsx("input", {
                                type: "text",
                                value: p.contentDNA?.funnelCTA?.conversion || "",
                                onChange: (f) =>
                                  y((N) => ({
                                    ...N,
                                    contentDNA: {
                                      ...(N.contentDNA || {}),
                                      funnelCTA: {
                                        ...(N.contentDNA?.funnelCTA || {}),
                                        conversion: f.target.value,
                                      },
                                    },
                                  })),
                                placeholder:
                                  "Mulai sprint pertama lo hari ini tanpa setup di trajecto.web.app (Free Web Access)",
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "memory" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", { children: "1. Memori Brand: Prinsip Abadi" }),
                          se("brandMemory", !!p.brandMemory?.alwaysSay?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-emerald-900 mb-1",
                                children: "Things We Always Say (Prinsip yang Selalu Diulang)",
                              }),
                              n.jsx("textarea", {
                                rows: 4,
                                value: (p.brandMemory?.alwaysSay || []).join(`
`),
                                onChange: (f) => ae("alwaysSay", f.target.value),
                                placeholder: `Kerjaan klien bayar hasil eksekusi, bukan estetiknya dashboard.
Maksimal 3 tugas prioritas per hari.
Jam 5 sore laptop ditutup.`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/20 text-xs focus:ring-2 focus:ring-emerald-500/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-rose-900 mb-1",
                                children: "Things We Never Say (Hal yang Tidak Pernah Dijanjikan)",
                              }),
                              n.jsx("textarea", {
                                rows: 4,
                                value: (p.brandMemory?.neverSay || []).join(`
`),
                                onChange: (f) => ae("neverSay", f.target.value),
                                placeholder: `Bekerjalah 16 jam sehari selagi muda.
Semua tugas bisa beres semalam jika kamu lembur.
Menjamin kamu tidak akan pernah malas lagi.`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("h3", {
                        className:
                          "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsx("span", {
                            children: "2. Pagar Klaim Hukum & Promosi (Claims Guardrail)",
                          }),
                          se("brandMemory", !!p.brandMemory?.claimsGuardrail?.allowed?.length),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-emerald-900 mb-1",
                                children: "Klaim yang Diizinkan (Boleh & Aman Dikatakan)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.brandMemory?.claimsGuardrail?.allowed || []).join(`
`),
                                onChange: (f) => Ne("allowed", f.target.value),
                                placeholder: `Aplikasi berbasis web ringan langsung jalan di browser
Menggunakan metode Agile Sprint harian dan time-blocking visual
Bisa diakses tanpa perlu instalasi atau kartu kredit`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            children: [
                              n.jsx("label", {
                                className: "block text-xs font-semibold text-rose-900 mb-1",
                                children: "Klaim yang Dilarang (Over-Promise / Berbahaya)",
                              }),
                              n.jsx("textarea", {
                                rows: 3,
                                value: (p.brandMemory?.claimsGuardrail?.forbidden || []).join(`
`),
                                onChange: (f) => Ne("forbidden", f.target.value),
                                placeholder: `Menjamin produktivitas naik 1000% dalam sehari
Menjamin tidak akan pernah prokrastinasi lagi seumur hidup`,
                                className:
                                  "w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/20 text-xs focus:ring-2 focus:ring-rose-500/30 outline-none",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            S === "custom" &&
              n.jsxs("div", {
                className: "space-y-6",
                children: [
                  n.jsx("div", {
                    className:
                      "bg-gradient-to-r from-emerald-50 via-[#f0f7f3] to-teal-50 border border-[#cfe2d4] rounded-2xl p-4.5 sm:p-5 shadow-xs",
                    children: n.jsxs("div", {
                      className: "flex items-start justify-between gap-3",
                      children: [
                        n.jsxs("div", {
                          className: "space-y-1",
                          children: [
                            n.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                n.jsx("span", { className: "text-xl", children: "🧩" }),
                                n.jsx("h3", {
                                  className: "text-sm font-bold text-[#142620]",
                                  children: "Acuan Bebas & Modular Knowledge Engine",
                                }),
                                n.jsx("span", {
                                  className:
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#205c49] text-white",
                                  children: "Universal Anchor",
                                }),
                              ],
                            }),
                            n.jsxs("p", {
                              className: "text-xs text-[#4b6054] leading-relaxed max-w-3xl",
                              children: [
                                "Brand Brain adalah acuan universal yang ",
                                n.jsx("strong", { children: "bisa apa saja" }),
                                ". Anda bebas menambahkan aturan wajib, SOP konten internal, katalog produk & harga, FAQ, hingga template copywriting spesifik. Semua acuan yang aktif otomatis diserap oleh AI di semua studio konten & konsultasi!",
                              ],
                            }),
                          ],
                        }),
                        n.jsx("div", {
                          className: "flex items-center gap-2 shrink-0",
                          children: n.jsxs("button", {
                            type: "button",
                            onClick: () => Ae("Aturan Wajib AI"),
                            className:
                              "px-3 py-1.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer",
                            children: [
                              n.jsx(Ll, { className: "w-3.5 h-3.5" }),
                              n.jsx("span", { children: "Tambah Blok Acuan" }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("div", {
                        className:
                          "flex items-center justify-between border-b pb-2.5 border-[#edf1eb] flex-wrap gap-2",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsxs("h3", {
                                className:
                                  "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center gap-1.5",
                                children: [
                                  n.jsx("span", {
                                    children: "1. Aturan Kustom AI (Directives / Golden Rules)",
                                  }),
                                  n.jsxs("span", {
                                    className: "text-[11px] font-semibold text-[#5a7063] lowercase",
                                    children: [
                                      "(",
                                      p.customDirectives?.length || 0,
                                      " aturan aktif)",
                                    ],
                                  }),
                                ],
                              }),
                              n.jsx("p", {
                                className: "text-[11px] text-[#697c70] mt-0.5",
                                children:
                                  "Aturan ringkas spesifik yang wajib dipatuhi AI saat menulis caption, hook, script video, atau menyusun rencana konten.",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className: "flex items-center gap-1 flex-wrap",
                            children: [
                              n.jsx("span", {
                                className: "text-[10px] text-[#718478] mr-1",
                                children: "Inspirasi cepat:",
                              }),
                              [
                                'Gunakan sapaan akrab "Teman Semua"',
                                'Sebut harga jelas tanpa kata "DM ya"',
                                "Selalu sertakan 3 hashtag relevan",
                                "Fokus edukasi solusi masalah, bukan hard-selling",
                              ].map((f, N) =>
                                n.jsxs(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => ge(f),
                                    className:
                                      "text-[10px] px-2 py-0.5 rounded-lg bg-[#f0f4ef] hover:bg-[#e2ebe1] text-[#2c4739] border border-[#d8e3d7] transition-colors",
                                    children: ["+ ", f.slice(0, 22), "..."],
                                  },
                                  N,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          n.jsx("input", {
                            type: "text",
                            value: te,
                            onChange: (f) => le(f.target.value),
                            onKeyDown: (f) => {
                              f.key === "Enter" && (f.preventDefault(), ge());
                            },
                            placeholder:
                              "Tulis aturan baru... Contoh: Jangan pernah pakai kata klise seperti 'Solusi Terbaik' atau 'Yuk Tunggu Apa Lagi'",
                            className:
                              "flex-1 px-3.5 py-2 rounded-xl border border-[#cbdcd0] text-xs focus:ring-2 focus:ring-[#205c49]/30 focus:border-[#205c49] outline-none bg-white placeholder:text-gray-400",
                          }),
                          n.jsxs("button", {
                            type: "button",
                            onClick: () => ge(),
                            className:
                              "px-4 py-2 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0",
                            children: [
                              n.jsx(Ll, { className: "w-3.5 h-3.5" }),
                              n.jsx("span", { children: "Tambah" }),
                            ],
                          }),
                        ],
                      }),
                      n.jsx("div", {
                        className: "space-y-2 pt-1",
                        children:
                          (p.customDirectives || []).length === 0
                            ? n.jsx("div", {
                                className:
                                  "text-center py-5 border border-dashed border-[#dce4db] rounded-xl text-[#7a8f81] text-xs",
                                children:
                                  "Belum ada aturan kustom. Tuliskan aturan di atas atau klik salah satu inspirasi cepat.",
                              })
                            : (p.customDirectives || []).map((f, N) =>
                                n.jsxs(
                                  "div",
                                  {
                                    className:
                                      "flex items-center gap-2 p-2.5 rounded-xl border border-[#dce4db] bg-[#fafcf9] hover:bg-white transition-all group",
                                    children: [
                                      n.jsx("span", {
                                        className:
                                          "w-5 h-5 rounded-full bg-[#205c49]/10 text-[#205c49] text-[10px] font-bold flex items-center justify-center shrink-0",
                                        children: N + 1,
                                      }),
                                      n.jsx("input", {
                                        type: "text",
                                        value: f,
                                        onChange: (J) => re(N, J.target.value),
                                        className:
                                          "flex-1 text-xs bg-transparent border-none outline-none text-[#1b3429] font-medium",
                                      }),
                                      n.jsx("button", {
                                        type: "button",
                                        onClick: () => ee(N),
                                        className:
                                          "p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-60 group-hover:opacity-100",
                                        title: "Hapus aturan",
                                        children: n.jsx(Xn, { className: "w-3.5 h-3.5" }),
                                      }),
                                    ],
                                  },
                                  N,
                                ),
                              ),
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-4",
                    children: [
                      n.jsxs("div", {
                        className:
                          "flex items-center justify-between border-b pb-2.5 border-[#edf1eb] flex-wrap gap-2",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsxs("h3", {
                                className:
                                  "text-xs font-bold uppercase tracking-wider text-[#142620] flex items-center gap-1.5",
                                children: [
                                  n.jsx("span", {
                                    children: "2. Blok Acuan Modular (Custom Knowledge Blocks)",
                                  }),
                                  n.jsxs("span", {
                                    className: "text-[11px] font-semibold text-[#5a7063] lowercase",
                                    children: ["(", p.customBlocks?.length || 0, " blok)"],
                                  }),
                                ],
                              }),
                              n.jsx("p", {
                                className: "text-[11px] text-[#697c70] mt-0.5",
                                children:
                                  "Simpan SOP, daftar paket harga, script penjualan, FAQ keberatan konsumen, riset kompetitor, atau materi bebas lainnya dalam blok terstruktur.",
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className: "flex items-center gap-2 flex-wrap",
                            children: [
                              n.jsxs("select", {
                                value: ye,
                                onChange: (f) => ie(f.target.value),
                                className:
                                  "px-2.5 py-1.5 rounded-xl border border-[#cbdcd0] text-[11px] font-medium text-[#2f4639] bg-white outline-none cursor-pointer",
                                children: [
                                  n.jsxs("option", {
                                    value: "all",
                                    children: [
                                      "Semua Kategori (",
                                      p.customBlocks?.length || 0,
                                      ")",
                                    ],
                                  }),
                                  n.jsx("option", {
                                    value: "Aturan Wajib AI",
                                    children: "Aturan Wajib AI",
                                  }),
                                  n.jsx("option", {
                                    value: "Katalog Produk & Harga",
                                    children: "Katalog Produk & Harga",
                                  }),
                                  n.jsx("option", {
                                    value: "SOP & Konten",
                                    children: "SOP & Konten",
                                  }),
                                  n.jsx("option", {
                                    value: "FAQ & Objections",
                                    children: "FAQ & Objections",
                                  }),
                                  n.jsx("option", {
                                    value: "Koleksi Copywriting",
                                    children: "Koleksi Copywriting",
                                  }),
                                  n.jsx("option", {
                                    value: "Kampanye & Event",
                                    children: "Kampanye & Event",
                                  }),
                                  n.jsx("option", {
                                    value: "Riset & Catatan Bebas",
                                    children: "Riset & Catatan Bebas",
                                  }),
                                ],
                              }),
                              n.jsxs("button", {
                                type: "button",
                                onClick: () => Ae(ye === "all" ? "Aturan Wajib AI" : ye),
                                className:
                                  "px-3 py-1.5 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer",
                                children: [
                                  n.jsx(Ll, { className: "w-3.5 h-3.5" }),
                                  n.jsx("span", { children: "Tambah Blok" }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsx("div", {
                        className: "space-y-3 pt-1",
                        children:
                          (p.customBlocks || []).filter((f) => ye === "all" || f.category === ye)
                            .length === 0
                            ? n.jsxs("div", {
                                className:
                                  "text-center py-8 border border-dashed border-[#dce4db] rounded-2xl p-6 bg-[#fafcf9]",
                                children: [
                                  n.jsx(T0, { className: "w-8 h-8 text-[#8da094] mx-auto mb-2" }),
                                  n.jsxs("p", {
                                    className: "text-xs font-semibold text-[#30483c]",
                                    children: [
                                      "Belum ada blok acuan ",
                                      ye !== "all" ? `dalam kategori "${ye}"` : "",
                                    ],
                                  }),
                                  n.jsx("p", {
                                    className: "text-[11px] text-[#718478] mt-1 max-w-md mx-auto",
                                    children:
                                      "Tambahkan blok acuan untuk menyimpan katalog produk, SOP pembuatan konten, panduan handling objection, atau catatan bebas lainnya.",
                                  }),
                                  n.jsx("div", {
                                    className:
                                      "flex items-center justify-center gap-2 mt-4 flex-wrap",
                                    children: [
                                      "Katalog Produk & Harga",
                                      "SOP & Konten",
                                      "FAQ & Objections",
                                    ].map((f) =>
                                      n.jsxs(
                                        "button",
                                        {
                                          type: "button",
                                          onClick: () => Ae(f),
                                          className:
                                            "px-3 py-1.5 rounded-xl bg-white border border-[#cfded1] text-xs font-medium text-[#205c49] hover:bg-[#edf5ef] transition-colors shadow-2xs",
                                          children: ["+ Tambah ", f],
                                        },
                                        f,
                                      ),
                                    ),
                                  }),
                                ],
                              })
                            : (p.customBlocks || [])
                                .filter((f) => ye === "all" || f.category === ye)
                                .map((f) =>
                                  n.jsxs(
                                    "div",
                                    {
                                      className: `rounded-2xl border transition-all ${f.isActive ? "border-[#cfe2d4] bg-white shadow-xs" : "border-gray-200 bg-gray-50/60 opacity-70"}`,
                                      children: [
                                        n.jsxs("div", {
                                          className:
                                            "p-3.5 sm:px-4 border-b border-[#edf1eb] flex items-center justify-between flex-wrap gap-2 bg-[#fcfdfb] rounded-t-2xl",
                                          children: [
                                            n.jsxs("div", {
                                              className:
                                                "flex items-center gap-2.5 flex-1 min-w-[200px]",
                                              children: [
                                                n.jsxs("button", {
                                                  type: "button",
                                                  onClick: () => ue(f.id),
                                                  className: `px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${f.isActive ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-gray-200 text-gray-600 border-gray-300"}`,
                                                  title: f.isActive
                                                    ? "Aktif sebagai acuan AI"
                                                    : "Nonaktif (Diabaikan AI)",
                                                  children: [
                                                    n.jsx("span", {
                                                      className: `w-1.5 h-1.5 rounded-full ${f.isActive ? "bg-emerald-600" : "bg-gray-400"}`,
                                                    }),
                                                    n.jsx("span", {
                                                      children: f.isActive ? "Aktif" : "Nonaktif",
                                                    }),
                                                  ],
                                                }),
                                                n.jsxs("select", {
                                                  value: f.category,
                                                  onChange: (N) =>
                                                    we(f.id, { category: N.target.value }),
                                                  className:
                                                    "text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-[#cbdcd0] bg-white text-[#2a4537] outline-none",
                                                  children: [
                                                    n.jsx("option", {
                                                      value: "Aturan Wajib AI",
                                                      children: "Aturan Wajib AI",
                                                    }),
                                                    n.jsx("option", {
                                                      value: "Katalog Produk & Harga",
                                                      children: "Katalog Produk & Harga",
                                                    }),
                                                    n.jsx("option", {
                                                      value: "SOP & Konten",
                                                      children: "SOP & Konten",
                                                    }),
                                                    n.jsx("option", {
                                                      value: "FAQ & Objections",
                                                      children: "FAQ & Objections",
                                                    }),
                                                    n.jsx("option", {
                                                      value: "Koleksi Copywriting",
                                                      children: "Koleksi Copywriting",
                                                    }),
                                                    n.jsx("option", {
                                                      value: "Kampanye & Event",
                                                      children: "Kampanye & Event",
                                                    }),
                                                    n.jsx("option", {
                                                      value: "Riset & Catatan Bebas",
                                                      children: "Riset & Catatan Bebas",
                                                    }),
                                                  ],
                                                }),
                                                n.jsx("input", {
                                                  type: "text",
                                                  value: f.title,
                                                  onChange: (N) =>
                                                    we(f.id, { title: N.target.value }),
                                                  placeholder: "Judul Blok Acuan...",
                                                  className:
                                                    "flex-1 font-bold text-xs text-[#142620] bg-transparent border-b border-transparent hover:border-[#cbdcd0] focus:border-[#205c49] outline-none px-1 py-0.5",
                                                }),
                                              ],
                                            }),
                                            n.jsxs("div", {
                                              className: "flex items-center gap-1.5 shrink-0",
                                              children: [
                                                n.jsx("button", {
                                                  type: "button",
                                                  disabled: fe === f.id,
                                                  onClick: () => he(f),
                                                  className:
                                                    "px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50",
                                                  title:
                                                    "Gunakan AI untuk memperinci dan menyempurnakan isi blok acuan ini",
                                                  children:
                                                    fe === f.id
                                                      ? n.jsxs(n.Fragment, {
                                                          children: [
                                                            n.jsx(Nn, {
                                                              className:
                                                                "w-3 h-3 animate-spin text-amber-700",
                                                            }),
                                                            n.jsx("span", {
                                                              children: "Memperinci...",
                                                            }),
                                                          ],
                                                        })
                                                      : n.jsxs(n.Fragment, {
                                                          children: [
                                                            n.jsx(ze, {
                                                              className: "w-3 h-3 text-amber-600",
                                                            }),
                                                            n.jsx("span", {
                                                              children: "Perinci via AI",
                                                            }),
                                                          ],
                                                        }),
                                                }),
                                                n.jsx("button", {
                                                  type: "button",
                                                  onClick: () => da(f.id),
                                                  className:
                                                    "p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors",
                                                  title: "Hapus blok acuan",
                                                  children: n.jsx(Xn, { className: "w-3.5 h-3.5" }),
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        n.jsxs("div", {
                                          className: "p-3.5 sm:px-4",
                                          children: [
                                            n.jsx("textarea", {
                                              rows: 5,
                                              value: f.content,
                                              onChange: (N) =>
                                                we(f.id, { content: N.target.value }),
                                              placeholder:
                                                "Tuliskan isi acuan di sini secara bebas, format poin-poin atau paragraf. AI akan membaca persis seperti yang tertulis...",
                                              className:
                                                "w-full px-3 py-2 rounded-xl border border-[#d6dfd5] text-xs font-mono focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed bg-[#fcfdfb]",
                                            }),
                                            n.jsxs("div", {
                                              className:
                                                "flex items-center justify-between text-[10px] text-[#718478] mt-1.5 px-0.5",
                                              children: [
                                                n.jsx("span", {
                                                  children:
                                                    "Format Markdown didukung (poin -, nomor 1., tabel, bold **)",
                                                }),
                                                n.jsxs("span", {
                                                  children: [f.content?.length || 0, " karakter"],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                    f.id,
                                  ),
                                ),
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-3",
                    children: [
                      n.jsxs("div", {
                        className:
                          "flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("h3", {
                                className:
                                  "text-xs font-bold uppercase tracking-wider text-[#142620]",
                                children: "3. Basis Pengetahuan Bebas (Freeform Raw Knowledge)",
                              }),
                              n.jsx("p", {
                                className: "text-[11px] text-[#697c70] mt-0.5",
                                children:
                                  "Tempelkan teks mentah dokumen, transkrip meeting, deskripsi produk lengkap, press release, atau catatan internal apa pun.",
                              }),
                            ],
                          }),
                          se("customKnowledge", !!p.customKnowledge),
                        ],
                      }),
                      n.jsx("textarea", {
                        rows: 6,
                        value: p.customKnowledge || "",
                        onChange: (f) => y((N) => ({ ...N, customKnowledge: f.target.value })),
                        placeholder: `Paste dokumen panjang apa saja di sini...
Contoh:
Perusahaan kami didirikan tahun 2023 dengan misi merapikan alur kerja agensi digital. Kami memiliki 3 paket layanan: Starter Rp499rb, Pro Rp1,2jt, dan Enterprise custom quote. Keunggulan kami adalah sistem pelaporan realtime dan dashboard analitik terpadu...`,
                        className:
                          "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed",
                      }),
                      n.jsxs("div", {
                        className:
                          "flex items-center justify-between text-[10px] text-[#718478] px-0.5",
                        children: [
                          n.jsx("span", {
                            children:
                              "AI otomatis mengekstrak fakta penting dari teks ini saat memproduksi konten",
                          }),
                          n.jsxs("span", {
                            children: [p.customKnowledge?.length || 0, " karakter"],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-white rounded-2xl border border-[#dce4db] p-5 shadow-xs space-y-3",
                    children: [
                      n.jsxs("div", {
                        className:
                          "flex items-center justify-between border-b pb-2 border-[#edf1eb]",
                        children: [
                          n.jsxs("div", {
                            children: [
                              n.jsx("h3", {
                                className:
                                  "text-xs font-bold uppercase tracking-wider text-[#142620]",
                                children:
                                  "4. Instruksi Persona & Peran Khusus AI (AI Persona / Roleplay)",
                              }),
                              n.jsx("p", {
                                className: "text-[11px] text-[#697c70] mt-0.5",
                                children:
                                  "Instruksi bagaimana AI harus berperilaku secara spesifik saat berperan sebagai copywriter, perencana konten, atau konsultan brand ini.",
                              }),
                            ],
                          }),
                          se("aiPersonaInstructions", !!p.aiPersonaInstructions),
                        ],
                      }),
                      n.jsx("textarea", {
                        rows: 4,
                        value: p.aiPersonaInstructions || "",
                        onChange: (f) =>
                          y((N) => ({ ...N, aiPersonaInstructions: f.target.value })),
                        placeholder: `Contoh:
Berperilakulah seperti Senior Growth Marketer & Creative Director yang tajam, blak-blakan, namun ramah. Jangan pernah gunakan gaya bahasa kaku korporat. Utamakan sudut pandang audiens yang skeptis terhadap janji manis...`,
                        className:
                          "w-full px-3.5 py-2.5 rounded-xl border border-[#d6dfd5] text-xs focus:ring-2 focus:ring-[#205c49]/30 outline-none leading-relaxed",
                      }),
                    ],
                  }),
                ],
              }),
            S === "inspector" &&
              n.jsxs("div", {
                className: "space-y-5",
                children: [
                  n.jsxs("div", {
                    className:
                      "bg-gradient-to-r from-slate-900 via-gray-900 to-[#142620] text-white rounded-2xl p-5 shadow-md",
                    children: [
                      n.jsxs("div", {
                        className: "flex items-start justify-between flex-wrap gap-4",
                        children: [
                          n.jsxs("div", {
                            className: "space-y-1",
                            children: [
                              n.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  n.jsx(_h, { className: "w-5 h-5 text-emerald-400" }),
                                  n.jsx("h3", {
                                    className: "text-sm font-bold tracking-wide",
                                    children: "AI Brand Brain Live Prompt Inspector",
                                  }),
                                  n.jsx("span", {
                                    className:
                                      "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
                                    children: "System Prompt Ready",
                                  }),
                                ],
                              }),
                              n.jsxs("p", {
                                className: "text-xs text-gray-300 leading-relaxed max-w-2xl",
                                children: [
                                  "Inilah dokumen acuan lengkap yang dikompilasi dari seluruh tab Brand Brain. Teks ini disuntikkan secara otomatis sebagai ",
                                  n.jsx("strong", { children: "System Knowledge & Guardrails" }),
                                  " ke Gemini AI setiap kali Anda membuat Rencana Konten, memakai Konsultasi AI, Caption Polisher, dan Hook Generator.",
                                ],
                              }),
                            ],
                          }),
                          n.jsxs("div", {
                            className: "flex items-center gap-2 flex-wrap",
                            children: [
                              n.jsx("button", {
                                type: "button",
                                onClick: Se,
                                className:
                                  "px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/20 cursor-pointer",
                                children: Ee
                                  ? n.jsxs(n.Fragment, {
                                      children: [
                                        n.jsx(ut, { className: "w-3.5 h-3.5 text-emerald-400" }),
                                        n.jsx("span", { children: "Tersalin!" }),
                                      ],
                                    })
                                  : n.jsxs(n.Fragment, {
                                      children: [
                                        n.jsx(_a, { className: "w-3.5 h-3.5 text-gray-300" }),
                                        n.jsx("span", { children: "Salin Prompt Acuan" }),
                                      ],
                                    }),
                              }),
                              n.jsxs("button", {
                                type: "button",
                                onClick: M,
                                className:
                                  "px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer",
                                children: [
                                  n.jsx(jn, { className: "w-3.5 h-3.5" }),
                                  n.jsx("span", { children: "Unduh Prompt .md" }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      n.jsxs("div", {
                        className:
                          "flex items-center gap-3 pt-4 border-t border-white/10 text-xs text-gray-300 flex-wrap",
                        children: [
                          n.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              n.jsx("span", {
                                className: "text-gray-400",
                                children: "Total Karakter Acuan:",
                              }),
                              n.jsxs("span", {
                                className: "font-bold text-emerald-300",
                                children: [ot(p).length.toLocaleString(), " karakter"],
                              }),
                            ],
                          }),
                          n.jsx("span", { children: "•" }),
                          n.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              n.jsx("span", {
                                className: "text-gray-400",
                                children: "Estimasi Kata:",
                              }),
                              n.jsxs("span", {
                                className: "font-bold text-emerald-300",
                                children: [
                                  "~",
                                  Math.round(ot(p).split(/\s+/).length).toLocaleString(),
                                  " kata",
                                ],
                              }),
                            ],
                          }),
                          n.jsx("span", { children: "•" }),
                          n.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              n.jsx("span", {
                                className: "text-gray-400",
                                children: "Blok Acuan Aktif:",
                              }),
                              n.jsxs("span", {
                                className: "font-bold text-emerald-300",
                                children: [
                                  (p.customBlocks || []).filter((f) => f.isActive).length,
                                  " dari ",
                                  (p.customBlocks || []).length,
                                ],
                              }),
                            ],
                          }),
                          n.jsx("span", { children: "•" }),
                          n.jsxs("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                              n.jsx("span", {
                                className: "text-gray-400",
                                children: "Aturan Wajib:",
                              }),
                              n.jsxs("span", {
                                className: "font-bold text-emerald-300",
                                children: [p.customDirectives?.length || 0, " aturan"],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  n.jsxs("div", {
                    className:
                      "bg-[#101713] rounded-2xl border border-[#21352a] overflow-hidden shadow-inner",
                    children: [
                      n.jsxs("div", {
                        className:
                          "px-4 py-2.5 bg-[#17221c] border-b border-[#21352a] flex items-center justify-between",
                        children: [
                          n.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              n.jsxs("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                  n.jsx("span", {
                                    className:
                                      "w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block",
                                  }),
                                  n.jsx("span", {
                                    className:
                                      "w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block",
                                  }),
                                  n.jsx("span", {
                                    className:
                                      "w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block",
                                  }),
                                ],
                              }),
                              n.jsx("span", {
                                className: "text-xs font-mono text-gray-300 font-semibold ml-2",
                                children: "compiled_brand_brain_prompt.md",
                              }),
                            ],
                          }),
                          n.jsx("span", {
                            className: "text-[11px] font-mono text-emerald-400/80",
                            children: "UTF-8 • Markdown",
                          }),
                        ],
                      }),
                      n.jsx("div", {
                        className:
                          "p-4 max-h-[460px] overflow-y-auto font-mono text-[11px] text-emerald-100/90 leading-relaxed whitespace-pre-wrap select-text",
                        children: ot(p),
                      }),
                    ],
                  }),
                ],
              }),
            S === "export" && n.jsx(bbxPanel, { brand: p, onNotify: j }),
            n.jsx("div", { className: "h-2" }),
          ],
        }),
        n.jsxs("div", {
          className:
            "p-4 sm:px-6 border-t border-[#edf1eb] bg-[#fafcf9] flex items-center justify-between flex-wrap gap-3 shrink-0",
          children: [
            n.jsxs("div", {
              className: "text-xs text-[#52665b] flex items-center gap-2",
              children: [
                n.jsx("span", { children: "Kelengkapan Brand Brain:" }),
                n.jsxs("span", {
                  className:
                    "font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px]",
                  children: [Ge.score, "%"],
                }),
                n.jsx("span", {
                  className: "hidden sm:inline text-[#728378]",
                  children: " • Otomatis memandu seluruh studio konten",
                }),
              ],
            }),
            n.jsxs("div", {
              className: "flex items-center gap-2.5",
              children: [
                n.jsx("button", {
                  type: "button",
                  onClick: d,
                  className:
                    "px-4 py-2 rounded-xl border border-[#dce4db] bg-white text-xs font-semibold text-[#52665b] hover:bg-[#f6faf4] transition-colors cursor-pointer",
                  children: "Batal",
                }),
                n.jsxs("button", {
                  type: "submit",
                  form: "brand-brain-form",
                  className:
                    "px-5 py-2 rounded-xl bg-[#205c49] hover:bg-[#184738] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer",
                  children: [
                    n.jsx(ut, { className: "w-4 h-4 text-emerald-300" }),
                    n.jsx("span", { children: "Simpan Brand Brain" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};

