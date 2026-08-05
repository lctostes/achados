import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import {
  Plus, Tag, Search, X, Link2, Trash2, Pencil,
  ChevronDown, ChevronRight, Circle, CircleSlash,
  Home, FolderPlus, ImageOff, Check, Settings, MessageSquare,
  LogOut, Loader2, Wand2, Share2, Copy, RefreshCw, Eye,
} from "lucide-react";

const PALETTE = {
  bg: "#EFEDE6",
  paper: "#FBFAF7",
  ink: "#1E2A24",
  inkSoft: "#5B6760",
  amber: "#C98A2C",
  amberDark: "#9C6A1D",
  coral: "#C15B44",
  line: "#D8D3C7",
  green: "#5C7A5A",
};

function faviconFor(link) {
  try {
    const u = new URL(link);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}

// ---------- Auth screen ----------

function AuthScreen() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async () => {
    setError("");
    setInfo("");
    if (!email.trim() || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) setError(error.message);
      else setInfo("Conta criada! Se a confirmação por e-mail estiver ativa no projeto, verifique sua caixa de entrada antes de entrar.");
    }
    setLoading(false);
  };

  return (
    <div
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6"
      style={{ background: PALETTE.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mb-8 text-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <Tag size={20} style={{ color: PALETTE.amber }} />
        </div>
        <h1 className="text-[30px]" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
          Achados
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: PALETTE.inkSoft }}>
          seus links, organizados como etiquetas
        </p>
      </div>

      <div className="rounded-2xl border p-5" style={{ borderColor: PALETTE.line, background: PALETTE.paper }}>
        <div className="mb-4 flex rounded-lg border p-1" style={{ borderColor: PALETTE.line }}>
          <button
            onClick={() => setMode("login")}
            className="flex-1 rounded-md py-2 text-[13px] font-semibold"
            style={{ background: mode === "login" ? PALETTE.ink : "transparent", color: mode === "login" ? PALETTE.paper : PALETTE.inkSoft }}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("signup")}
            className="flex-1 rounded-md py-2 text-[13px] font-semibold"
            style={{ background: mode === "signup" ? PALETTE.ink : "transparent", color: mode === "signup" ? PALETTE.paper : PALETTE.inkSoft }}
          >
            Criar conta
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            type="email"
            className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
            style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
            style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
          />

          {error && <p className="text-[12px]" style={{ color: PALETTE.coral }}>{error}</p>}
          {info && <p className="text-[12px]" style={{ color: PALETTE.green }}>{info}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-[14px] font-semibold disabled:opacity-60"
            style={{ background: PALETTE.ink, color: PALETTE.paper }}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Small UI atoms ----------

function TagChip({ children, active, onClick, tone = "ink" }) {
  const toneMap = {
    ink: { bg: active ? PALETTE.ink : "transparent", fg: active ? PALETTE.paper : PALETTE.ink, bd: PALETTE.ink },
    amber: { bg: active ? PALETTE.amber : "transparent", fg: active ? PALETTE.paper : PALETTE.amberDark, bd: PALETTE.amber },
  };
  const t = toneMap[tone];
  return (
    <button
      onClick={onClick}
      style={{ background: t.bg, color: t.fg, borderColor: t.bd }}
      className="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors"
    >
      {children}
    </button>
  );
}

function HangTagCard({ product, category, subcategory, onToggleActive, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const fav = faviconFor(product.link);

  return (
    <div className="relative rounded-2xl border shadow-sm" style={{ background: PALETTE.paper, borderColor: PALETTE.line }}>
      <div className="absolute -top-2 left-5 h-4 w-4 rounded-full border" style={{ background: PALETTE.bg, borderColor: PALETTE.line }} />
      <div className="mx-4 mt-0 border-t border-dashed" style={{ borderColor: PALETTE.line, marginTop: "2px" }} />

      <div className="flex gap-3 p-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
          style={{ borderColor: PALETTE.line, background: PALETTE.bg }}
        >
          {product.photo && !imgError ? (
            <img src={product.photo} alt={product.name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : fav ? (
            <img src={fav} alt="" className="h-7 w-7 opacity-70" />
          ) : (
            <ImageOff size={20} color={PALETTE.inkSoft} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: PALETTE.amberDark, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {category?.name}
            {subcategory ? ` · ${subcategory.name}` : ""}
          </div>
          <h3 className="mt-0.5 truncate text-[15px] font-semibold" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif" }}>
            {product.name}
          </h3>

          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-1 truncate text-[12px]"
            style={{ color: PALETTE.inkSoft }}
          >
            <Link2 size={12} />
            <span className="truncate">{product.link.replace(/^https?:\/\//, "")}</span>
          </a>

          {product.hashtags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.hashtags.map((h) => (
                <span
                  key={h}
                  className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: PALETTE.line, color: PALETTE.coral, fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  #{h}
                </span>
              ))}
            </div>
          )}

          {product.note && (
            <div className="mt-2 flex items-start gap-1.5">
              <MessageSquare size={12} className="mt-0.5 shrink-0" style={{ color: PALETTE.inkSoft }} />
              <p className="text-[12px] italic leading-snug" style={{ color: PALETTE.inkSoft }}>
                {product.note}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t px-4 py-2" style={{ borderColor: PALETTE.line }}>
        <button
          onClick={() => onToggleActive(product)}
          className="flex items-center gap-1.5 text-[12px] font-medium"
          style={{ color: product.active ? PALETTE.green : PALETTE.coral }}
        >
          {product.active ? <Circle size={10} fill={PALETTE.green} /> : <CircleSlash size={12} />}
          {product.active ? "Ativo" : "Link quebrado"}
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => onEdit(product)} style={{ color: PALETTE.inkSoft }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(product)} style={{ color: PALETTE.inkSoft }}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Add / Edit product form ----------

function ProductForm({ categories, initial, onCancel, onSave }) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name || "");
  const [link, setLink] = useState(initial?.link || "");
  const [photo, setPhoto] = useState(initial?.photo || "");
  const [categoryId, setCategoryId] = useState(initial?.category_id || categories[0]?.id || "");
  const [subcategoryId, setSubcategoryId] = useState(initial?.subcategory_id || "");
  const [hashtagInput, setHashtagInput] = useState((initial?.hashtags || []).join(", "));
  const [note, setNote] = useState(initial?.note || "");
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const currentCat = categories.find((c) => c.id === categoryId);

  useEffect(() => {
    if (currentCat && !currentCat.subcategories.find((s) => s.id === subcategoryId)) {
      setSubcategoryId(currentCat.subcategories[0]?.id || "");
    }
  }, [categoryId]);

  const autoFetch = async () => {
    if (!link.trim()) return;
    setFetching(true);
    setFetchMsg("");
    try {
      const { data, error } = await supabase.functions.invoke("fetch-metadata", {
        body: { url: link.trim() },
      });
      if (error) throw error;
      if (data?.name && !name) setName(data.name);
      if (data?.photo && !photo) setPhoto(data.photo);
      if (!data?.name && !data?.photo) setFetchMsg("Não consegui achar nome/foto automaticamente. Preencha à mão.");
    } catch (e) {
      setFetchMsg("Não consegui buscar automaticamente. Preencha à mão.");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !link.trim() || !categoryId) return;
    setSaving(true);
    const hashtags = hashtagInput.split(",").map((h) => h.trim().replace(/^#/, "")).filter(Boolean);
    await onSave({
      id: initial?.id,
      name: name.trim(),
      link: link.trim(),
      photo: photo.trim(),
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      hashtags,
      note: note.trim(),
      active: initial?.active ?? true,
    });
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
          Link do produto
        </label>
        <div className="flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-lg border px-3 py-2.5 text-[14px] outline-none"
            style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
          />
          <button
            onClick={autoFetch}
            disabled={!link.trim() || fetching}
            className="flex items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium disabled:opacity-40"
            style={{ background: PALETTE.amber, color: PALETTE.paper }}
          >
            {fetching ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
          </button>
        </div>
        {fetchMsg && <p className="mt-1.5 text-[12px]" style={{ color: PALETTE.amberDark }}>{fetchMsg}</p>}
        {!fetchMsg && <p className="mt-1.5 text-[12px]" style={{ color: PALETTE.inkSoft }}>Toque na varinha para tentar buscar nome e foto automaticamente.</p>}
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
          Nome do produto
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Boné Nike Dri-FIT"
          className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
        />
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
          Foto (URL da imagem)
        </label>
        <input
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://.../imagem.jpg"
          className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
        />
        {photo && (
          <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border" style={{ borderColor: PALETTE.line }}>
            <img src={photo} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
            style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
            Subcategoria
          </label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
            style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
          >
            <option value="">—</option>
            {currentCat?.subcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
          Hashtags (separadas por vírgula)
        </label>
        <input
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          placeholder="corrida, verão, promoção"
          className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
        />
      </div>

      <div>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>
          Observação (opcional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ex: Comprei o tamanho M, veste justo."
          rows={3}
          className="w-full resize-none rounded-lg border px-3 py-2.5 text-[14px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
        />
      </div>

      <div className="mt-1 flex gap-3">
        <button onClick={onCancel} className="flex-1 rounded-lg border py-2.5 text-[14px] font-medium" style={{ borderColor: PALETTE.line, color: PALETTE.inkSoft }}>
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !link.trim() || !categoryId || saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[14px] font-semibold disabled:opacity-40"
          style={{ background: PALETTE.ink, color: PALETTE.paper }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? "Salvar alterações" : "Adicionar link"}
        </button>
      </div>
    </div>
  );
}

// ---------- Category management ----------

function CategoriesScreen({ categories, onAddCategory, onDeleteCategory, onAddSub, onDeleteSub }) {
  const [newCat, setNewCat] = useState("");
  const [expanded, setExpanded] = useState({});
  const [subInputs, setSubInputs] = useState({});

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex gap-2">
        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newCat.trim() && (onAddCategory(newCat.trim()), setNewCat(""))}
          placeholder="Nova categoria (ex: Corrida)"
          className="flex-1 rounded-lg border px-3 py-2.5 text-[14px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
        />
        <button
          onClick={() => { if (newCat.trim()) { onAddCategory(newCat.trim()); setNewCat(""); } }}
          className="flex items-center justify-center rounded-lg px-3"
          style={{ background: PALETTE.ink, color: PALETTE.paper }}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((c) => {
          const isOpen = !!expanded[c.id];
          return (
            <div key={c.id} className="rounded-xl border" style={{ borderColor: PALETTE.line, background: PALETTE.paper }}>
              <button onClick={() => setExpanded((p) => ({ ...p, [c.id]: !p[c.id] }))} className="flex w-full items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="text-[15px] font-semibold" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif" }}>{c.name}</span>
                  <span className="text-[12px]" style={{ color: PALETTE.inkSoft }}>({c.subcategories.length})</span>
                </div>
                <Trash2 size={15} style={{ color: PALETTE.coral }} onClick={(e) => { e.stopPropagation(); onDeleteCategory(c.id); }} />
              </button>

              {isOpen && (
                <div className="border-t px-4 py-3" style={{ borderColor: PALETTE.line }}>
                  <div className="flex flex-wrap gap-2">
                    {c.subcategories.map((s) => (
                      <span key={s.id} className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: PALETTE.line, color: PALETTE.ink }}>
                        {s.name}
                        <X size={11} className="cursor-pointer" style={{ color: PALETTE.coral }} onClick={() => onDeleteSub(c.id, s.id)} />
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={subInputs[c.id] || ""}
                      onChange={(e) => setSubInputs((p) => ({ ...p, [c.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (subInputs[c.id] || "").trim()) {
                          onAddSub(c.id, subInputs[c.id].trim());
                          setSubInputs((p) => ({ ...p, [c.id]: "" }));
                        }
                      }}
                      placeholder="Nova subcategoria"
                      className="flex-1 rounded-lg border px-2.5 py-1.5 text-[13px] outline-none"
                      style={{ borderColor: PALETTE.line, background: PALETTE.bg, color: PALETTE.ink }}
                    />
                    <button
                      onClick={() => {
                        if ((subInputs[c.id] || "").trim()) {
                          onAddSub(c.id, subInputs[c.id].trim());
                          setSubInputs((p) => ({ ...p, [c.id]: "" }));
                        }
                      }}
                      className="rounded-lg px-2.5"
                      style={{ background: PALETTE.amber, color: PALETTE.paper }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {categories.length === 0 && (
          <p className="py-8 text-center text-[13px]" style={{ color: PALETTE.inkSoft }}>Nenhuma categoria ainda. Crie a primeira acima.</p>
        )}
      </div>
    </div>
  );
}

// ---------- Settings ----------

function genSlug() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
}

function SettingsScreen({ profile, onSave, onSignOut, onDone }) {
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [siteName, setSiteName] = useState(profile.site_name || "Achados");
  const [customName, setCustomName] = useState(profile.custom_name || false);
  const [saving, setSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(profile.is_public || false);
  const [slug, setSlug] = useState(profile.public_slug || "");
  const [shareSaving, setShareSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = slug ? `${window.location.origin}${window.location.pathname}?loja=${slug}` : "";

  const togglePublic = async () => {
    setShareSaving(true);
    const next = !isPublic;
    let useSlug = slug;
    if (next && !useSlug) {
      useSlug = genSlug();
      setSlug(useSlug);
    }
    setIsPublic(next);
    await onSave({ is_public: next, public_slug: useSlug });
    setShareSaving(false);
  };

  const regenerateLink = async () => {
    setShareSaving(true);
    const newSlug = genSlug();
    setSlug(newSlug);
    await onSave({ public_slug: newSlug });
    setShareSaving(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    if (!customName) setSiteName(firstName.trim() ? `Achados da ${firstName.trim()}` : "Achados");
  }, [firstName, customName]);

  const resetToDefault = () => {
    setCustomName(false);
    setSiteName(firstName.trim() ? `Achados da ${firstName.trim()}` : "Achados");
  };

  const save = async () => {
    setSaving(true);
    await onSave({ first_name: firstName.trim(), site_name: siteName.trim() || "Achados", custom_name: customName });
    setSaving(false);
    onDone();
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div>
        <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>Seu primeiro nome</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Ex: Marina"
          className="w-full rounded-lg border px-3 py-2.5 text-[14px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink }}
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.inkSoft }}>Nome do site</label>
          {customName && <button onClick={resetToDefault} className="text-[11px] font-medium" style={{ color: PALETTE.amberDark }}>Usar padrão</button>}
        </div>
        <input
          value={siteName}
          onChange={(e) => { setSiteName(e.target.value); setCustomName(true); }}
          placeholder="Achados da Marina"
          className="w-full rounded-lg border px-3 py-2.5 text-[15px] outline-none"
          style={{ borderColor: PALETTE.line, background: PALETTE.paper, color: PALETTE.ink, fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        />
        <p className="mt-1.5 text-[12px]" style={{ color: PALETTE.inkSoft }}>
          Padrão: "Achados da {firstName.trim() || "[seu nome]"}". Você pode escrever qualquer nome aqui.
        </p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] font-semibold disabled:opacity-60"
        style={{ background: PALETTE.ink, color: PALETTE.paper }}
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        Salvar
      </button>

      <div className="mt-2 rounded-xl border p-4" style={{ borderColor: PALETTE.line, background: PALETTE.paper }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={16} style={{ color: PALETTE.amberDark }} />
            <span className="text-[14px] font-semibold" style={{ color: PALETTE.ink }}>Compartilhar meus links</span>
          </div>
          <button
            onClick={togglePublic}
            disabled={shareSaving}
            role="switch"
            aria-checked={isPublic}
            className="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
            style={{ background: isPublic ? PALETTE.green : PALETTE.line }}
          >
            <span
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
              style={{ transform: isPublic ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
        </div>

        <p className="mt-1.5 text-[12px]" style={{ color: PALETTE.inkSoft }}>
          Quem tiver o link vê seus produtos em modo de visualização — sem poder editar, adicionar ou apagar nada.
        </p>

        {isPublic && slug && (
          <div className="mt-3">
            <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: PALETTE.line, background: PALETTE.bg }}>
              <span className="flex-1 truncate text-[12px]" style={{ color: PALETTE.ink, fontFamily: "'IBM Plex Mono', monospace" }}>
                {shareUrl}
              </span>
              <button onClick={copyLink} style={{ color: copied ? PALETTE.green : PALETTE.inkSoft }}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
            <button
              onClick={regenerateLink}
              disabled={shareSaving}
              className="mt-2 flex items-center gap-1.5 text-[12px] font-medium disabled:opacity-60"
              style={{ color: PALETTE.amberDark }}
            >
              <RefreshCw size={12} />
              Gerar novo link (desativa o antigo)
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onSignOut}
        className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[14px] font-medium"
        style={{ borderColor: PALETTE.line, color: PALETTE.coral }}
      >
        <LogOut size={15} />
        Sair da conta
      </button>
    </div>
  );
}

// ---------- Public read-only view ----------

function PublicHangTag({ product, category, subcategory }) {
  const [imgError, setImgError] = useState(false);
  const fav = faviconFor(product.link);

  return (
    <div className="relative rounded-2xl border shadow-sm" style={{ background: PALETTE.paper, borderColor: PALETTE.line }}>
      <div className="absolute -top-2 left-5 h-4 w-4 rounded-full border" style={{ background: PALETTE.bg, borderColor: PALETTE.line }} />
      <div className="mx-4 mt-0 border-t border-dashed" style={{ borderColor: PALETTE.line, marginTop: "2px" }} />

      <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 p-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
          style={{ borderColor: PALETTE.line, background: PALETTE.bg }}
        >
          {product.photo && !imgError ? (
            <img src={product.photo} alt={product.name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : fav ? (
            <img src={fav} alt="" className="h-7 w-7 opacity-70" />
          ) : (
            <ImageOff size={20} color={PALETTE.inkSoft} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: PALETTE.amberDark, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {category?.name}
            {subcategory ? ` · ${subcategory.name}` : ""}
          </div>
          <h3 className="mt-0.5 text-[15px] font-semibold" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif" }}>
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 truncate text-[12px]" style={{ color: PALETTE.inkSoft }}>
            <Link2 size={12} />
            <span className="truncate">{product.link.replace(/^https?:\/\//, "")}</span>
          </div>

          {product.hashtags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.hashtags.map((h) => (
                <span
                  key={h}
                  className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: PALETTE.line, color: PALETTE.coral, fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  #{h}
                </span>
              ))}
            </div>
          )}

          {product.note && (
            <div className="mt-2 flex items-start gap-1.5">
              <MessageSquare size={12} className="mt-0.5 shrink-0" style={{ color: PALETTE.inkSoft }} />
              <p className="text-[12px] italic leading-snug" style={{ color: PALETTE.inkSoft }}>{product.note}</p>
            </div>
          )}

          {!product.active && (
            <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium" style={{ color: PALETTE.coral }}>
              <CircleSlash size={12} />
              Link quebrado
            </div>
          )}
        </div>
      </a>
    </div>
  );
}

function PublicView({ slug }) {
  const [status, setStatus] = useState("loading"); // loading | notfound | ready
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("id, site_name, is_public")
        .eq("public_slug", slug)
        .eq("is_public", true)
        .maybeSingle();

      if (!prof) {
        setStatus("notfound");
        return;
      }

      const [{ data: cats }, { data: subs }, { data: prods }] = await Promise.all([
        supabase.from("categories").select("*").eq("user_id", prof.id).order("created_at"),
        supabase.from("subcategories").select("*").eq("user_id", prof.id).order("created_at"),
        supabase.from("products").select("*").eq("user_id", prof.id).order("created_at", { ascending: false }),
      ]);

      setProfile(prof);
      setCategories((cats || []).map((c) => ({ ...c, subcategories: (subs || []).filter((s) => s.category_id === c.id) })));
      setProducts(prods || []);
      setStatus("ready");
    })();
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: PALETTE.bg }}>
        <Loader2 size={24} className="animate-spin" style={{ color: PALETTE.inkSoft }} />
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-8 text-center" style={{ background: PALETTE.bg }}>
        <Tag size={22} style={{ color: PALETTE.amber }} />
        <h1 className="mt-3 text-[20px]" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
          Link não encontrado
        </h1>
        <p className="mt-2 text-[13px]" style={{ color: PALETTE.inkSoft }}>
          Esse link de compartilhamento não existe mais ou foi desativado por quem criou.
        </p>
      </div>
    );
  }

  const currentCategory = categories.find((c) => c.id === activeCat);
  const filtered = products.filter((p) => {
    if (activeCat && p.category_id !== activeCat) return false;
    if (activeSub && p.subcategory_id !== activeSub) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inTags = (p.hashtags || []).some((h) => h.toLowerCase().includes(q));
      if (!inName && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col" style={{ background: PALETTE.bg, fontFamily: "'Inter', sans-serif" }}>
      <div className="px-5 pb-3 pt-6">
        <div className="flex items-center gap-2">
          <Eye size={14} style={{ color: PALETTE.amber }} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: PALETTE.amberDark, fontFamily: "'IBM Plex Mono', monospace" }}>
            Modo visitante
          </span>
        </div>
        <h1 className="mt-1 truncate text-[28px] leading-none" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
          {profile?.site_name || "Achados"}
        </h1>
      </div>

      <div className="flex-1 px-5 pb-10">
        <div className="mb-3 flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: PALETTE.line, background: PALETTE.paper }}>
          <Search size={15} style={{ color: PALETTE.inkSoft }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou hashtag"
            className="flex-1 bg-transparent text-[14px] outline-none"
            style={{ color: PALETTE.ink }}
          />
        </div>

        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          <TagChip active={!activeCat} onClick={() => { setActiveCat(null); setActiveSub(null); }} tone="ink">Todos</TagChip>
          {categories.map((c) => (
            <TagChip key={c.id} active={activeCat === c.id} onClick={() => { setActiveCat(c.id); setActiveSub(null); }} tone="ink">{c.name}</TagChip>
          ))}
        </div>

        {currentCategory?.subcategories.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            <TagChip active={!activeSub} onClick={() => setActiveSub(null)} tone="amber">Todas</TagChip>
            {currentCategory.subcategories.map((s) => (
              <TagChip key={s.id} active={activeSub === s.id} onClick={() => setActiveSub(s.id)} tone="amber">{s.name}</TagChip>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4 pt-1">
          {filtered.map((p) => {
            const cat = categories.find((c) => c.id === p.category_id);
            const sub = cat?.subcategories.find((s) => s.id === p.subcategory_id);
            return <PublicHangTag key={p.id} product={p} category={cat} subcategory={sub} />;
          })}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-[13px]" style={{ color: PALETTE.inkSoft }}>Nenhum link encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Main App ----------

function PrivateApp() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = logged out
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [tab, setTab] = useState("feed");
  const [editing, setEditing] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadAll = async () => {
    setDataLoading(true);
    const userId = session.user.id;
    const [{ data: prof }, { data: cats }, { data: subs }, { data: prods }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("categories").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("subcategories").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("products").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    setProfile(prof || { first_name: "", site_name: "Achados", custom_name: false });
    const catsWithSubs = (cats || []).map((c) => ({
      ...c,
      subcategories: (subs || []).filter((s) => s.category_id === c.id),
    }));
    setCategories(catsWithSubs);
    setProducts(prods || []);
    setDataLoading(false);
  };

  useEffect(() => {
    if (session) loadAll();
  }, [session]);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: PALETTE.bg }}>
        <Loader2 size={24} className="animate-spin" style={{ color: PALETTE.inkSoft }} />
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  const currentCategory = categories.find((c) => c.id === activeCat);
  const filtered = products.filter((p) => {
    if (activeCat && p.category_id !== activeCat) return false;
    if (activeSub && p.subcategory_id !== activeSub) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inTags = (p.hashtags || []).some((h) => h.toLowerCase().includes(q));
      if (!inName && !inTags) return false;
    }
    return true;
  });

  // ---- mutations ----

  const toggleActive = async (product) => {
    const next = !product.active;
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active: next } : p)));
    await supabase.from("products").update({ active: next }).eq("id", product.id);
  };

  const deleteProduct = async (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    await supabase.from("products").delete().eq("id", product.id);
  };

  const saveProduct = async (prod) => {
    const userId = session.user.id;
    if (prod.id) {
      const { id, ...rest } = prod;
      await supabase.from("products").update(rest).eq("id", id);
    } else {
      await supabase.from("products").insert({ ...prod, user_id: userId });
    }
    await loadAll();
    setEditing(null);
    setTab("feed");
  };

  const addCategory = async (name) => {
    const userId = session.user.id;
    const { data } = await supabase.from("categories").insert({ name, user_id: userId }).select().single();
    if (data) setCategories((prev) => [...prev, { ...data, subcategories: [] }]);
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await supabase.from("categories").delete().eq("id", id);
  };

  const addSub = async (categoryId, name) => {
    const userId = session.user.id;
    const { data } = await supabase.from("subcategories").insert({ name, category_id: categoryId, user_id: userId }).select().single();
    if (data) setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, subcategories: [...c.subcategories, data] } : c)));
  };

  const deleteSub = async (categoryId, subId) => {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) } : c)));
    await supabase.from("subcategories").delete().eq("id", subId);
  };

  const saveProfile = async (updates) => {
    const userId = session.user.id;
    await supabase.from("profiles").upsert({ id: userId, ...updates });
    setProfile((p) => ({ ...p, ...updates }));
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col" style={{ background: PALETTE.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="px-5 pb-3 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={18} style={{ color: PALETTE.amber }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: PALETTE.amberDark, fontFamily: "'IBM Plex Mono', monospace" }}>
              {session.user.email}
            </span>
          </div>
          <button onClick={() => setTab("settings")} style={{ color: tab === "settings" ? PALETTE.ink : PALETTE.inkSoft }}>
            <Settings size={18} />
          </button>
        </div>
        <h1 className="mt-1 truncate text-[28px] leading-none" style={{ color: PALETTE.ink, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
          {profile?.site_name || "Achados"}
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: PALETTE.inkSoft }}>seus links, organizados como etiquetas</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-24">
        {dataLoading && (
          <div className="flex justify-center py-10">
            <Loader2 size={22} className="animate-spin" style={{ color: PALETTE.inkSoft }} />
          </div>
        )}

        {!dataLoading && tab === "feed" && (
          <>
            <div className="mb-3 flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: PALETTE.line, background: PALETTE.paper }}>
              <Search size={15} style={{ color: PALETTE.inkSoft }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou hashtag"
                className="flex-1 bg-transparent text-[14px] outline-none"
                style={{ color: PALETTE.ink }}
              />
            </div>

            <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
              <TagChip active={!activeCat} onClick={() => { setActiveCat(null); setActiveSub(null); }} tone="ink">Todos</TagChip>
              {categories.map((c) => (
                <TagChip key={c.id} active={activeCat === c.id} onClick={() => { setActiveCat(c.id); setActiveSub(null); }} tone="ink">{c.name}</TagChip>
              ))}
            </div>

            {currentCategory?.subcategories.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                <TagChip active={!activeSub} onClick={() => setActiveSub(null)} tone="amber">Todas</TagChip>
                {currentCategory.subcategories.map((s) => (
                  <TagChip key={s.id} active={activeSub === s.id} onClick={() => setActiveSub(s.id)} tone="amber">{s.name}</TagChip>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4 pt-1">
              {filtered.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                const sub = cat?.subcategories.find((s) => s.id === p.subcategory_id);
                return (
                  <HangTagCard
                    key={p.id}
                    product={p}
                    category={cat}
                    subcategory={sub}
                    onToggleActive={toggleActive}
                    onEdit={(prod) => { setEditing(prod); setTab("add"); }}
                    onDelete={deleteProduct}
                  />
                );
              })}
              {filtered.length === 0 && (
                <p className="py-12 text-center text-[13px]" style={{ color: PALETTE.inkSoft }}>Nenhum link encontrado.</p>
              )}
            </div>
          </>
        )}

        {!dataLoading && tab === "add" && (
          <ProductForm
            categories={categories}
            initial={editing}
            onCancel={() => { setEditing(null); setTab("feed"); }}
            onSave={saveProduct}
          />
        )}

        {!dataLoading && tab === "categories" && (
          <CategoriesScreen
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
            onAddSub={addSub}
            onDeleteSub={deleteSub}
          />
        )}

        {!dataLoading && tab === "settings" && profile && (
          <SettingsScreen
            profile={profile}
            onSave={saveProfile}
            onSignOut={() => supabase.auth.signOut()}
            onDone={() => setTab("feed")}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t px-6 py-2.5" style={{ background: PALETTE.paper, borderColor: PALETTE.line }}>
        <div className="flex items-center justify-around">
          <NavButton icon={Home} label="Links" active={tab === "feed"} onClick={() => setTab("feed")} />
          <button
            onClick={() => { setEditing(null); setTab("add"); }}
            className="flex h-11 w-11 items-center justify-center rounded-full -translate-y-3 shadow-md"
            style={{ background: PALETTE.amber, color: PALETTE.paper }}
          >
            <Plus size={22} />
          </button>
          <NavButton icon={FolderPlus} label="Categorias" active={tab === "categories"} onClick={() => setTab("categories")} />
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 px-2 py-1">
      <Icon size={20} color={active ? PALETTE.ink : PALETTE.inkSoft} />
      <span className="text-[10px] font-medium" style={{ color: active ? PALETTE.ink : PALETTE.inkSoft }}>{label}</span>
    </button>
  );
}

// ---------- Root: decide entre app privado e link público de visitante ----------

export default function App() {
  const slug = new URLSearchParams(window.location.search).get("loja");
  if (slug) return <PublicView slug={slug} />;
  return <PrivateApp />;
}
