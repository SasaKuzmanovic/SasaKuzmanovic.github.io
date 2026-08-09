import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase, STORAGE_BUCKET } from "./supabase";
import "./styles.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

function formatCount(n) {
  return `${n} ${n === 1 ? "trenutak" : "trenutaka"} podijeljeno`;
}

async function loadPhotos() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("wedding_photos")
    .select("id, storage_path, original_name, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(photo => {
    const { data: publicData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(photo.storage_path);

    return {
      ...photo,
      src: publicData.publicUrl
    };
  });
}

async function uploadPhoto(file) {
  if (!supabase) throw new Error("Supabase is not configured.");
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`${file.name}: unsupported image type.`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${file.name}: maximum file size is 10 MB.`);
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { error: rowError } = await supabase
    .from("wedding_photos")
    .insert({
      storage_path: path,
      original_name: file.name
    });

  if (rowError) {
    // Best-effort cleanup if the database row could not be created.
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    throw rowError;
  }
}

function App() {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  const refreshPhotos = async () => {
    try {
      setError("");
      const data = await loadPhotos();
      setPhotos(data);
    } catch (err) {
      setError(err.message || "Could not load the gallery.");
    }
  };

  useEffect(() => {
    refreshPhotos();

    if (!supabase) return;

    // Everyone viewing the site receives newly inserted photo rows in real time.
    const channel = supabase
      .channel("wedding-gallery")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wedding_photos" },
        () => refreshPhotos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sortedPhotos = useMemo(() => photos, [photos]);

  function openUpload() {
    fileInput.current?.click();
  }

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    setUploading(true);
    setError("");

    let success = 0;
    const failures = [];

    for (const file of files) {
      try {
        await uploadPhoto(file);
        success++;
      } catch (err) {
        failures.push(err.message || file.name);
      }
    }

    await refreshPhotos();
    setUploading(false);

    if (success) {
      setNotice(
        `${success} trenutaka${success === 1 ? "" : "s"} ${success === 1 ? "je" : "je"} podijeljeno sa galerijom.`
      );
      setTimeout(() => setNotice(""), 3500);
    }

    if (failures.length) {
      setError(failures.join(" "));
    }
  }

  function nextPhoto() {
    setSelected(current => (current + 1) % sortedPhotos.length);
  }

  function previousPhoto() {
    setSelected(current =>
      (current - 1 + sortedPhotos.length) % sortedPhotos.length
    );
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (selected === null) return;
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") previousPhoto();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, sortedPhotos.length]);

  return (
    <div className="site-shell">
      <header className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <nav className="nav">
          <div className="monogram">M <span>♥</span> B</div>

          <button className="upload-button" onClick={openUpload} disabled={uploading}>
            <span className="upload-icon">{uploading ? "…" : "↑"}</span>
            {uploading ? "Uploading…" : "Dodajte fotografije"}
          </button>

          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            hidden
            onChange={handleFiles}
          />
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Mali komadic našeg dana</p>
          <h1>Nase Vjencanje</h1>
          <div className="ornament"><span /> <b>♥</b> <span /></div>
          <p className="date">12 · 08 · 2026</p>
          <p className="intro">
            Voljeni bismo vidjeti dan kroz vaše oči.<br />
            Podijelite vaše omiljene trenutke i učinite ovu galeriju našom.
          </p>
          <button className="primary-button" onClick={openUpload} disabled={uploading}>
            <span>＋</span> {uploading ? "Uploading…" : "Podijeli fotografije"}
          </button>
        </div>

        <div className="scroll-cue">ISTRAZI VISE <span>↓</span></div>
      </header>

      <main>
        <section className="gallery-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Captured with love</p>
              <h2>Nasi Trenutci</h2>
            </div>
            <div className="photo-count">
              <strong>{photos.length}</strong>
              <span>{formatCount(photos.length).replace(`${photos.length} `, "")}</span>
            </div>
          </div>

          {notice && <div className="notice success">{notice}</div>}
          {error && <div className="notice error">{error}</div>}

          {!supabase && (
            <div className="notice error">
              This site is not connected to Supabase yet. Copy <code>.env.example</code> to <code>.env</code>
              and add your Supabase project URL and publishable key.
            </div>
          )}

          {photos.length === 0 && supabase ? (
            <div className="empty-state">
              <div className="mini-ornament">♥</div>
              <h3>Budi prvi koji ce podijeliti najbolje trenutke</h3>
              <p>Podijeli svoje omiljene trenutke s nama.</p>
              <button className="primary-button dark" onClick={openUpload}>＋ Upload a photo</button>
            </div>
          ) : (
            <div className="gallery-grid">
              {sortedPhotos.map((photo, index) => (
                <button
                  className={`photo-card card-${index % 5}`}
                  key={photo.id}
                  onClick={() => setSelected(index)}
                  aria-label={`View ${photo.original_name || "photo"}`}
                >
                  <img src={photo.src} alt="" loading="lazy" />
                  <span className="card-overlay">
                    <span>View photo</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <div className="gallery-footer">
              <div className="mini-ornament">♥</div>
              <p>Neka sjecanja teku</p>
              <button className="text-button" onClick={openUpload}>
                Podijeli jos fotografija <span>→</span>
              </button>
            </div>
          )}
        </section>
      </main>

      <footer>
        <div className="monogram">M <span>♥</span> B</div>
        <p>Hvala što ste bili s nama.</p>
        <small>Made with love · 2026</small>
      </footer>

      {selected !== null && sortedPhotos[selected] && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="close-button" onClick={() => setSelected(null)}>×</button>

          <button
            className="slide-arrow left"
            onClick={e => { e.stopPropagation(); previousPhoto(); }}
            aria-label="Previous photo"
          >‹</button>

          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={sortedPhotos[selected].src} alt="" />
            <div className="slide-caption">
              <span>{selected + 1} / {sortedPhotos.length}</span>
            </div>
          </div>

          <button
            className="slide-arrow right"
            onClick={e => { e.stopPropagation(); nextPhoto(); }}
            aria-label="Next photo"
          >›</button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
