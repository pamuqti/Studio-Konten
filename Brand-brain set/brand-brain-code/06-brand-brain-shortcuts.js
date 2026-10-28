/**
 * Brand Brain - Pintasan & Konektor
 * Panel pintasan alat di sidebar + tombol "Sambungkan Brand Brain" (unduh/salin JSON konektor).
 *
 * Diekstrak dari kalender_konten_planner__3_.html (bundle Vite, di-minify) lalu dirapikan dengan Prettier.
 * Nama variabel pendek (c, d, u, o, j, ...) adalah nama asli hasil minify, belum di-rename.
 *
 * Berisi: bbsKey, bbsDefCats, bbsDef, bbsLoad, bbsSave, bbsUrl, bbsShrink, bbsForm, bbsShortcuts
 *
 * Bergantung pada simbol lain di bundle (tidak ikut file ini):
 *   G, Oa, bbxBuild, bbxH, bbxSecs, gt
 */

const bbsKey = "ruang-konten-shortcuts-v1";

const bbsDefCats = ["Visual", "Video", "Konten", "Utilities"];

const bbsDef = [
  {
    id: "feed",
    name: "Konsep Feed & Grid",
    cat: "Visual",
    icon: "🖼️",
    url: "",
    thumb: "",
    desc: "Pengaturan Visual & Grid",
    pro: !1,
  },
  {
    id: "carousel",
    name: "Slide Carousel",
    cat: "Visual",
    icon: "🎞️",
    url: "",
    thumb: "",
    desc: "Pengaturan Slide Berseri",
    pro: !1,
  },
  {
    id: "story",
    name: "Storyboard Video",
    cat: "Video",
    icon: "🎬",
    url: "",
    thumb: "",
    desc: "Pengaturan Reels & TikTok",
    pro: !1,
  },
  {
    id: "kol",
    name: "Brief KOL & Kreator",
    cat: "Konten",
    icon: "🤝",
    url: "",
    thumb: "",
    desc: "Pengaturan Brief Kreator",
    pro: !1,
  },
  {
    id: "threads",
    name: "Studio Threads",
    cat: "Konten",
    icon: "🧵",
    url: "",
    thumb: "",
    desc: "Pengaturan Utas Teks",
    pro: !1,
  },
];

const bbsLoad = () => {
  try {
    const r = JSON.parse(localStorage.getItem(bbsKey) || "null");
    if (r && Array.isArray(r.items))
      return { items: r.items, cats: Array.isArray(r.cats) && r.cats.length ? r.cats : bbsDefCats };
  } catch {}
  return { items: bbsDef, cats: bbsDefCats };
};

const bbsSave = (d) => {
  try {
    localStorage.setItem(bbsKey, JSON.stringify(d));
    return !0;
  } catch {
    return !1;
  }
};

const bbsUrl = (u) => {
  u = String(u || "").trim();
  if (!u) return "";
  /^https?:\/\//i.test(u) || (u = "https://" + u);
  try {
    return new URL(u).href;
  } catch {
    return "";
  }
};

const bbsShrink = (file) =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = () => rej(new Error("read"));
    fr.onload = () => {
      const im = new Image();
      im.onerror = () => rej(new Error("img"));
      im.onload = () => {
        const s = Math.min(1, 800 / im.width),
          c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.width * s));
        c.height = Math.max(1, Math.round(im.height * s));
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.82));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });

const bbsForm = ({ init, isNew, cats, onCats, onSave, onDelete, onClose }) => {
  const h = bbxH,
    [d, setD] = G.useState({
      name: init.name || "",
      cat: init.cat || "",
      url: init.url || "",
      thumb: init.thumb || "",
      desc: init.desc || "",
      pro: !!init.pro,
    }),
    [mode, setMode] = G.useState(init.thumb && /^https?:/i.test(init.thumb) ? "url" : "upload"),
    [catMgr, setCatMgr] = G.useState(!1),
    [newCat, setNewCat] = G.useState(""),
    [err, setErr] = G.useState(""),
    set = (k, v) => setD((o) => ({ ...o, [k]: v })),
    pick = async (f) => {
      if (!f) return;
      if (!/^image\/(png|jpe?g|webp)$/i.test(f.type)) {
        setErr("Format harus JPG, PNG, atau WEBP.");
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setErr("Ukuran gambar maksimal 5MB.");
        return;
      }
      try {
        set("thumb", await bbsShrink(f));
        setErr("");
      } catch {
        setErr("Gambar tidak bisa dibaca.");
      }
    },
    addCat = () => {
      const v = newCat.trim();
      if (!v || cats.includes(v)) return;
      onCats([...cats, v]);
      set("cat", v);
      setNewCat("");
    },
    submit = (e) => {
      e.preventDefault();
      if (!d.name.trim()) {
        setErr("Nama alat wajib diisi.");
        return;
      }
      const raw = d.url.trim(),
        u = bbsUrl(raw);
      if (raw && !u) {
        setErr("URL aplikasi tidak valid.");
        return;
      }
      let th = d.thumb;
      if (mode === "url" && th && !/^data:/.test(th)) {
        th = bbsUrl(th);
        if (!th) {
          setErr("URL thumbnail tidak valid.");
          return;
        }
      }
      onSave({
        ...init,
        name: d.name.trim(),
        cat: d.cat,
        url: u,
        thumb: th,
        desc: d.desc.trim(),
        pro: d.pro,
      });
    };
  return h(
    "div",
    {
      className: "bbs-ov",
      onMouseDown: (e) => {
        e.target === e.currentTarget && onClose();
      },
    },
    h(
      "form",
      { className: "bbs-modal", onSubmit: submit },
      h(
        "div",
        { className: "bbs-top" },
        h("h3", null, isNew ? "Tambah Alat Baru" : "Edit Detail Alat: " + (init.name || "")),
        h(
          "button",
          { type: "button", className: "bbs-x", onClick: onClose, "aria-label": "Tutup" },
          "✕",
        ),
      ),
      h("label", { className: "bbs-l" }, "Nama Alat"),
      h("input", {
        className: "bbs-in",
        value: d.name,
        onChange: (e) => set("name", e.target.value),
        placeholder: "cth: Tikar",
      }),
      h(
        "div",
        { className: "bbs-lr" },
        h(
          "label",
          { className: "bbs-l" },
          "Kategori Alat ",
          h("span", { className: "bbs-op" }, "(Opsional)"),
        ),
        h(
          "button",
          { type: "button", className: "bbs-lk", onClick: () => setCatMgr((v) => !v) },
          "🏷 Pengaturan Kategori",
        ),
      ),
      h(
        "select",
        { className: "bbs-in", value: d.cat, onChange: (e) => set("cat", e.target.value) },
        h("option", { value: "" }, "Tanpa kategori"),
        cats.map((c) => h("option", { key: c, value: c }, c)),
      ),
      catMgr &&
        h(
          "div",
          { className: "bbs-cm" },
          h(
            "div",
            { className: "bbs-chips" },
            cats.map((c) =>
              h(
                "span",
                { key: c, className: "bbs-chip" },
                c,
                h(
                  "button",
                  {
                    type: "button",
                    title: "Hapus kategori",
                    onClick: () => {
                      onCats(cats.filter((x) => x !== c));
                      d.cat === c && set("cat", "");
                    },
                  },
                  "✕",
                ),
              ),
            ),
          ),
          h(
            "div",
            { className: "bbs-cadd" },
            h("input", {
              className: "bbs-in",
              value: newCat,
              placeholder: "Kategori baru",
              onChange: (e) => setNewCat(e.target.value),
              onKeyDown: (e) => {
                e.key === "Enter" && (e.preventDefault(), addCat());
              },
            }),
            h("button", { type: "button", className: "bbs-b2", onClick: addCat }, "Tambah"),
          ),
        ),
      h("label", { className: "bbs-l" }, "URL Aplikasi"),
      h("input", {
        className: "bbs-in",
        value: d.url,
        onChange: (e) => set("url", e.target.value),
        placeholder: "https://...",
      }),
      h(
        "div",
        { className: "bbs-lr", style: { marginTop: "16px" } },
        h("label", { className: "bbs-l", style: { margin: 0 } }, "🖼 Thumbnail Alat"),
        h(
          "div",
          { className: "bbs-seg" },
          h(
            "button",
            {
              type: "button",
              className: mode === "upload" ? "on" : "",
              onClick: () => setMode("upload"),
            },
            "⬆ Upload File",
          ),
          h(
            "button",
            {
              type: "button",
              className: mode === "url" ? "on" : "",
              onClick: () => setMode("url"),
            },
            "🔗 Tautan URL",
          ),
        ),
      ),
      mode === "upload"
        ? h(
            "label",
            {
              className: "bbs-drop",
              onDragOver: (e) => e.preventDefault(),
              onDrop: (e) => {
                e.preventDefault();
                pick(e.dataTransfer.files && e.dataTransfer.files[0]);
              },
            },
            h("input", {
              type: "file",
              accept: "image/png,image/jpeg,image/webp",
              style: { display: "none" },
              onChange: (e) => {
                pick(e.target.files && e.target.files[0]);
                e.target.value = "";
              },
            }),
            d.thumb
              ? h("img", { src: d.thumb, alt: "Thumbnail" })
              : h("span", { className: "bbs-dh" }, "Klik atau seret gambar ke sini"),
          )
        : h(
            "div",
            { className: "bbs-drop" },
            h("input", {
              className: "bbs-in",
              value: /^data:/.test(d.thumb) ? "" : d.thumb,
              placeholder: "https://contoh.com/gambar.jpg",
              onChange: (e) => set("thumb", e.target.value),
            }),
            d.thumb &&
              !/^data:/.test(d.thumb) &&
              h("img", { src: d.thumb, alt: "Thumbnail", style: { marginTop: "10px" } }),
          ),
      d.thumb &&
        h(
          "div",
          { className: "bbs-ts" },
          h("span", { className: "ok" }, "✓ Gambar Terpasang"),
          h("button", { type: "button", onClick: () => set("thumb", "") }, "Hapus"),
        ),
      h(
        "p",
        { className: "bbs-h" },
        "Unggah file gambar dari komputer (JPG, PNG, WEBP max 5MB) atau masukkan tautan URL gambar.",
      ),
      h("label", { className: "bbs-l" }, "Deskripsi Singkat"),
      h("textarea", {
        className: "bbs-in",
        rows: 2,
        value: d.desc,
        onChange: (e) => set("desc", e.target.value),
      }),
      err && h("p", { className: "bbs-err" }, err),
      h(
        "div",
        { className: "bbs-ft" },
        h(
          "label",
          { className: "bbs-pro" },
          h("input", {
            type: "checkbox",
            checked: d.pro,
            onChange: (e) => set("pro", e.target.checked),
          }),
          h("span", null, "Tandai Khusus Member PRO"),
        ),
        h(
          "div",
          { className: "bbs-fb" },
          !isNew &&
            h(
              "button",
              {
                type: "button",
                className: "bbs-del",
                onClick: () => {
                  window.confirm('Hapus shortcut "' + init.name + '"?') && onDelete();
                },
              },
              "Hapus",
            ),
          h("button", { type: "button", className: "bbs-b2", onClick: onClose }, "Batal"),
          h("button", { type: "submit", className: "bbs-b1" }, "Simpan"),
        ),
      ),
    ),
  );
};

const bbsShortcuts = ({ brand }) => {
  const h = bbxH,
    [data, setData] = G.useState(bbsLoad),
    [edit, setEdit] = G.useState(null),
    [msg, setMsg] = G.useState(""),
    flash = (t) => {
      setMsg(t);
      setTimeout(() => setMsg(""), 2400);
    },
    commit = (x) => {
      setData(x);
      bbsSave(x) || flash("Gagal menyimpan: penyimpanan browser penuh.");
    },
    go = (it) => {
      it.url ? window.open(it.url, "_blank", "noopener") : setEdit({ item: it });
    },
    mk = () => {
      const o = {};
      bbxSecs.forEach((s) => (o[s.id] = !0));
      return bbxBuild(brand || {}, o, { onlyActive: !0, meta: !0 }, "connector").text;
    },
    dl = () => {
      const nm =
        String((brand && brand.name) || "brand")
          .toLowerCase()
          .replace(/[^a-z0-9_-]+/g, "-")
          .replace(/^-+|-+$/g, "") || "brand";
      gt(
        nm + "-brand-brain-connector-" + new Date().toLocaleDateString("en-CA") + ".json",
        mk(),
        "application/json;charset=utf-8",
      );
      flash("Brand Brain JSON diunduh.");
    },
    tp = () => {
      gt(
        "brand-brain-connector-template.json",
        bbxBuild({}, {}, {}, "template").text,
        "application/json;charset=utf-8",
      );
      flash("Template kosong diunduh.");
    },
    cp = () => {
      Oa(mk()).then((ok) => flash(ok ? "Brand Brain JSON disalin." : "Gagal menyalin."));
    };
  return h(
    "div",
    null,
    h(
      "div",
      {
        className:
          "px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#819287] flex items-center justify-between",
      },
      h("span", null, "App Standalone"),
      h(
        "span",
        {
          className:
            "text-[9px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200",
        },
        "Shortcut",
      ),
    ),
    h(
      "nav",
      { className: "space-y-1" },
      data.items.map((it) =>
        h(
          "div",
          { key: it.id, className: "bbs-item" },
          h(
            "button",
            {
              type: "button",
              className: "bbs-main",
              onClick: () => go(it),
              title: it.url || "URL belum diatur",
            },
            it.thumb
              ? h("img", { className: "bbs-th", src: it.thumb, alt: "" })
              : h("span", { className: "bbs-th bbs-em" }, it.icon || "🧩"),
            h(
              "span",
              { className: "bbs-txt" },
              h("b", null, it.name, it.pro && h("em", { className: "bbs-pro-b" }, "PRO")),
              h("small", null, it.url ? it.desc || it.cat || "" : "Klik untuk mengatur URL"),
            ),
            it.url && h("span", { className: "bbs-ext" }, "↗"),
          ),
          h(
            "button",
            {
              type: "button",
              className: "bbs-edit",
              onClick: () => setEdit({ item: it }),
              title: "Edit detail alat",
            },
            "✎",
          ),
        ),
      ),
      h(
        "button",
        {
          type: "button",
          className: "bbs-add",
          onClick: () =>
            setEdit({
              item: {
                id: "t-" + Date.now(),
                name: "",
                cat: "",
                url: "",
                thumb: "",
                desc: "",
                pro: !1,
              },
              isNew: !0,
            }),
        },
        "+ Tambah Alat",
      ),
    ),
    h(
      "div",
      { className: "bbs-conn" },
      h("div", { className: "bbs-ct" }, "🔗 Sambungkan Brand Brain"),
      h(
        "div",
        { className: "bbs-cb" },
        h("button", { type: "button", onClick: dl }, "⬇ JSON"),
        h("button", { type: "button", onClick: cp }, "Salin"),
        h(
          "button",
          { type: "button", onClick: tp, title: "Template kosong + panduan field" },
          "Template",
        ),
      ),
      h("small", null, "JSON Konektor Funnel untuk dibaca app standalone."),
      msg && h("div", { className: "bbs-msg" }, msg),
    ),
    edit &&
      h(bbsForm, {
        key: edit.item.id,
        init: edit.item,
        isNew: !!edit.isNew,
        cats: data.cats,
        onCats: (c) => commit({ ...data, cats: c }),
        onClose: () => setEdit(null),
        onSave: (v) => {
          const ex = data.items.some((x) => x.id === v.id);
          commit({
            ...data,
            items: ex ? data.items.map((x) => (x.id === v.id ? v : x)) : [...data.items, v],
          });
          setEdit(null);
        },
        onDelete: () => {
          commit({ ...data, items: data.items.filter((x) => x.id !== edit.item.id) });
          setEdit(null);
        },
      }),
  );
};

