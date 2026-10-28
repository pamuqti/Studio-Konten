import React, { useState } from 'react';
import { BrandBrain } from '../types';
import { bbxSecs, bbxBuild } from './BrandBrainExportEngine';
import { downloadFile, copyToClipboard } from '../utils/export';

export interface ShortcutItem {
  id: string;
  name: string;
  cat: string;
  icon?: string;
  url: string;
  thumb?: string;
  desc: string;
  pro: boolean;
}

const bbsKey = "ruang-konten-shortcuts-v1";
const bbsDefCats = ["Visual", "Video", "Konten", "Utilities"];

const bbsDef: ShortcutItem[] = [
  {
    id: "feed",
    name: "Konsep Feed & Grid",
    cat: "Visual",
    icon: "🖼️",
    url: "",
    thumb: "",
    desc: "Pengaturan Visual & Grid",
    pro: false,
  },
  {
    id: "carousel",
    name: "Slide Carousel",
    cat: "Visual",
    icon: "🎞️",
    url: "",
    thumb: "",
    desc: "Pengaturan Slide Berseri",
    pro: false,
  },
  {
    id: "story",
    name: "Storyboard Video",
    cat: "Video",
    icon: "🎬",
    url: "",
    thumb: "",
    desc: "Pengaturan Reels & TikTok",
    pro: false,
  },
  {
    id: "kol",
    name: "Brief KOL & Kreator",
    cat: "Konten",
    icon: "🤝",
    url: "",
    thumb: "",
    desc: "Pengaturan Brief Kreator",
    pro: false,
  },
  {
    id: "threads",
    name: "Studio Threads",
    cat: "Konten",
    icon: "🧵",
    url: "",
    thumb: "",
    desc: "Pengaturan Utas Teks",
    pro: false,
  },
];

const bbsLoad = (): { items: ShortcutItem[]; cats: string[] } => {
  try {
    const r = JSON.parse(localStorage.getItem(bbsKey) || "null");
    if (r && Array.isArray(r.items)) {
      return {
        items: r.items,
        cats: Array.isArray(r.cats) && r.cats.length ? r.cats : bbsDefCats,
      };
    }
  } catch {}
  return { items: bbsDef, cats: bbsDefCats };
};

const bbsSave = (d: { items: ShortcutItem[]; cats: string[] }): boolean => {
  try {
    localStorage.setItem(bbsKey, JSON.stringify(d));
    return true;
  } catch {
    return false;
  }
};

const bbsUrl = (u: string): string => {
  u = String(u || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    return new URL(u).href;
  } catch {
    return "";
  }
};

const bbsShrink = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = () => rej(new Error("read"));
    fr.onload = () => {
      const im = new Image();
      im.onerror = () => rej(new Error("img"));
      im.onload = () => {
        const s = Math.min(1, 800 / im.width);
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(im.width * s));
        c.height = Math.max(1, Math.round(im.height * s));
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.drawImage(im, 0, 0, c.width, c.height);
          res(c.toDataURL("image/jpeg", 0.82));
        } else {
          rej(new Error("canvas context"));
        }
      };
      im.src = fr.result as string;
    };
    fr.readAsDataURL(file);
  });

interface ShortcutFormProps {
  init: ShortcutItem;
  isNew: boolean;
  cats: string[];
  onCats: (cats: string[]) => void;
  onSave: (item: ShortcutItem) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const ShortcutModalForm: React.FC<ShortcutFormProps> = ({
  init,
  isNew,
  cats,
  onCats,
  onSave,
  onDelete,
  onClose,
}) => {
  const [d, setD] = useState({
    name: init.name || "",
    cat: init.cat || "",
    url: init.url || "",
    thumb: init.thumb || "",
    desc: init.desc || "",
    pro: !!init.pro,
  });
  const [mode, setMode] = useState<"upload" | "url">(
    init.thumb && /^https?:/i.test(init.thumb) ? "url" : "upload"
  );
  const [catMgr, setCatMgr] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [err, setErr] = useState("");

  const setField = (k: string, v: any) => setD((o) => ({ ...o, [k]: v }));

  const pickFile = async (f: File | null) => {
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
      setField("thumb", await bbsShrink(f));
      setErr("");
    } catch {
      setErr("Gambar tidak bisa dibaca.");
    }
  };

  const addCat = () => {
    const v = newCat.trim();
    if (!v || cats.includes(v)) return;
    onCats([...cats, v]);
    setField("cat", v);
    setNewCat("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.name.trim()) {
      setErr("Nama alat wajib diisi.");
      return;
    }
    const raw = d.url.trim();
    const u = bbsUrl(raw);
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

  return (
    <div
      className="bbs-ov"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="bbs-modal" onSubmit={submit}>
        <div className="bbs-top">
          <h3>{isNew ? "Tambah Alat Baru" : `Edit Detail Alat: ${init.name || ""}`}</h3>
          <button type="button" className="bbs-x" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>

        <label className="bbs-l">Nama Alat</label>
        <input
          className="bbs-in"
          value={d.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="cth: Tikar"
        />

        <div className="bbs-lr">
          <label className="bbs-l">
            Kategori Alat <span className="bbs-op">(Opsional)</span>
          </label>
          <button
            type="button"
            className="bbs-lk"
            onClick={() => setCatMgr((v) => !v)}
          >
            🏷 Pengaturan Kategori
          </button>
        </div>

        <select
          className="bbs-in"
          value={d.cat}
          onChange={(e) => setField("cat", e.target.value)}
        >
          <option value="">Tanpa kategori</option>
          {cats.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {catMgr && (
          <div className="bbs-cm">
            <div className="bbs-chips">
              {cats.map((c) => (
                <span key={c} className="bbs-chip">
                  {c}
                  <button
                    type="button"
                    title="Hapus kategori"
                    onClick={() => {
                      onCats(cats.filter((x) => x !== c));
                      if (d.cat === c) setField("cat", "");
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="bbs-cadd">
              <input
                className="bbs-in"
                value={newCat}
                placeholder="Kategori baru"
                onChange={(e) => setNewCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCat();
                  }
                }}
              />
              <button type="button" className="bbs-b2" onClick={addCat}>
                Tambah
              </button>
            </div>
          </div>
        )}

        <label className="bbs-l">URL Aplikasi</label>
        <input
          className="bbs-in"
          value={d.url}
          onChange={(e) => setField("url", e.target.value)}
          placeholder="https://..."
        />

        <div className="bbs-lr" style={{ marginTop: "16px" }}>
          <label className="bbs-l" style={{ margin: 0 }}>
            🖼 Thumbnail Alat
          </label>
          <div className="bbs-seg">
            <button
              type="button"
              className={mode === "upload" ? "on" : ""}
              onClick={() => setMode("upload")}
            >
              ⬆ Upload File
            </button>
            <button
              type="button"
              className={mode === "url" ? "on" : ""}
              onClick={() => setMode("url")}
            >
              🔗 Tautan URL
            </button>
          </div>
        </div>

        {mode === "upload" ? (
          <label
            className="bbs-drop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              pickFile(e.dataTransfer.files?.[0] || null);
            }}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: "none" }}
              onChange={(e) => {
                pickFile(e.target.files?.[0] || null);
                e.target.value = "";
              }}
            />
            {d.thumb ? (
              <img src={d.thumb} alt="Thumbnail" />
            ) : (
              <span className="bbs-dh">Klik atau seret gambar ke sini</span>
            )}
          </label>
        ) : (
          <div className="bbs-drop">
            <input
              className="bbs-in"
              value={!/^data:/.test(d.thumb) ? d.thumb : ""}
              placeholder="https://contoh.com/gambar.jpg"
              onChange={(e) => setField("thumb", e.target.value)}
            />
            {d.thumb && !/^data:/.test(d.thumb) && (
              <img
                src={d.thumb}
                alt="Thumbnail"
                style={{ marginTop: "10px", maxHeight: "80px", objectFit: "contain" }}
              />
            )}
          </div>
        )}

        {d.thumb && (
          <div className="bbs-ts">
            <span className="ok">✓ Gambar Terpasang</span>
            <button type="button" onClick={() => setField("thumb", "")}>
              Hapus
            </button>
          </div>
        )}

        <p className="bbs-h">
          Unggah file gambar dari komputer (JPG, PNG, WEBP max 5MB) atau masukkan tautan URL gambar.
        </p>

        <label className="bbs-l">Deskripsi Singkat</label>
        <textarea
          className="bbs-in"
          rows={2}
          value={d.desc}
          onChange={(e) => setField("desc", e.target.value)}
        />

        {err && <p className="bbs-err">{err}</p>}

        <div className="bbs-ft">
          <label className="bbs-pro">
            <input
              type="checkbox"
              checked={d.pro}
              onChange={(e) => setField("pro", e.target.checked)}
            />
            <span>Tandai Khusus Member PRO</span>
          </label>
          <div className="bbs-fb">
            {!isNew && onDelete && (
              <button
                type="button"
                className="bbs-del"
                onClick={() => {
                  if (window.confirm(`Hapus shortcut "${init.name}"?`)) {
                    onDelete();
                  }
                }}
              >
                Hapus
              </button>
            )}
            <button type="button" className="bbs-b2" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="bbs-b1">
              Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const BrandBrainShortcuts: React.FC<{ brand?: BrandBrain }> = ({ brand }) => {
  const [data, setData] = useState(bbsLoad);
  const [edit, setEdit] = useState<{ item: ShortcutItem; isNew?: boolean } | null>(null);
  const [msg, setMsg] = useState("");

  const flash = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  };

  const commit = (x: { items: ShortcutItem[]; cats: string[] }) => {
    setData(x);
    if (!bbsSave(x)) flash("Gagal menyimpan: penyimpanan browser penuh.");
  };

  const go = (it: ShortcutItem) => {
    if (it.url) {
      window.open(it.url, "_blank", "noopener");
    } else {
      setEdit({ item: it });
    }
  };

  const mk = () => {
    const o: Record<string, boolean> = {};
    bbxSecs.forEach((s) => (o[s.id] = true));
    return bbxBuild(brand || ({} as BrandBrain), o, { onlyActive: true, meta: true }, "connector").text;
  };

  const dl = () => {
    const nm =
      String((brand && brand.name) || "brand")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "brand";
    downloadFile(
      `${nm}-brand-brain-connector-${new Date().toLocaleDateString("en-CA")}.json`,
      mk(),
      "application/json;charset=utf-8"
    );
    flash("Brand Brain JSON diunduh.");
  };

  const tp = () => {
    downloadFile(
      "brand-brain-connector-template.json",
      bbxBuild({} as BrandBrain, {}, {}, "template").text,
      "application/json;charset=utf-8"
    );
    flash("Template kosong diunduh.");
  };

  const cp = () => {
    copyToClipboard(mk()).then((ok) => {
      flash(ok ? "Brand Brain JSON disalin." : "Gagal menyalin.");
    });
  };

  return (
    <div>
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#819287] flex items-center justify-between">
        <span>App Standalone</span>
        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
          Shortcut
        </span>
      </div>

      <nav className="space-y-1">
        {data.items.map((it) => (
          <div key={it.id} className="bbs-item">
            <button
              type="button"
              className="bbs-main"
              onClick={() => go(it)}
              title={it.url || "URL belum diatur"}
            >
              {it.thumb ? (
                <img className="bbs-th" src={it.thumb} alt="" />
              ) : (
                <span className="bbs-th bbs-em">{it.icon || "🧩"}</span>
              )}
              <span className="bbs-txt">
                <b>
                  {it.name}
                  {it.pro && <em className="bbs-pro-b">PRO</em>}
                </b>
                <small>{it.url ? it.desc || it.cat || "" : "Klik untuk mengatur URL"}</small>
              </span>
              {it.url && <span className="bbs-ext">↗</span>}
            </button>
            <button
              type="button"
              className="bbs-edit"
              onClick={() => setEdit({ item: it })}
              title="Edit detail alat"
            >
              ✎
            </button>
          </div>
        ))}

        <button
          type="button"
          className="bbs-add"
          onClick={() =>
            setEdit({
              item: {
                id: `t-${Date.now()}`,
                name: "",
                cat: "",
                url: "",
                thumb: "",
                desc: "",
                pro: false,
              },
              isNew: true,
            })
          }
        >
          + Tambah Alat
        </button>
      </nav>

      {/* Sambungkan Brand Brain Box */}
      <div className="bbs-conn">
        <div className="bbs-ct">🔗 Sambungkan Brand Brain</div>
        <div className="bbs-cb">
          <button type="button" onClick={dl}>
            ⬇ JSON
          </button>
          <button type="button" onClick={cp}>
            Salin
          </button>
          <button
            type="button"
            onClick={tp}
            title="Template kosong + panduan field"
          >
            Template
          </button>
        </div>
        <small>JSON Konektor Funnel untuk dibaca app standalone.</small>
        {msg && <div className="bbs-msg">{msg}</div>}
      </div>

      {edit && (
        <ShortcutModalForm
          key={edit.item.id}
          init={edit.item}
          isNew={!!edit.isNew}
          cats={data.cats}
          onCats={(c) => commit({ ...data, cats: c })}
          onClose={() => setEdit(null)}
          onSave={(v) => {
            const ex = data.items.some((x) => x.id === v.id);
            commit({
              ...data,
              items: ex
                ? data.items.map((x) => (x.id === v.id ? v : x))
                : [...data.items, v],
            });
            setEdit(null);
          }}
          onDelete={() => {
            commit({
              ...data,
              items: data.items.filter((x) => x.id !== edit.item.id),
            });
            setEdit(null);
          }}
        />
      )}
    </div>
  );
};
