import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
import { useRefetchOnFocus } from '@/hooks/useRefetchOnFocus';
import ImageUpload from '@/components/ImageUpload';
import CrudForm, { FormField } from '@/components/CrudForm';
import ConfirmDelete from '@/components/ConfirmDelete';

type MediaTab =
  | 'hero'
  | 'exosomes'
  | 'skin'
  | 'hair'
  | 'aesthetic'
  | 'doctor'
  | 'results'
  | 'clinic'
  | 'founder';

type HeroSlide = {
  id: string;
  image_url: string;
  alt: string | null;
  sort_order: number;
  is_published: boolean;
};

type ServiceRow = {
  id: string;
  title: string;
  image_url: string | null;
  category_id: string;
  sort_order: number;
  is_published: boolean;
};

type Category = { id: string; slug: string; label: string };

type ResultRow = {
  id: string;
  label: string;
  before_url: string;
  after_url: string;
  sort_order: number;
  is_published: boolean;
  category: string;
};

type GalleryItem = {
  id: string;
  image_url: string;
  label: string;
  tag: string | null;
  is_tall: boolean;
  sort_order: number;
  is_published: boolean;
};

const TABS: { id: MediaTab; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'exosomes', label: 'Exosomes' },
  { id: 'skin', label: 'Skin' },
  { id: 'hair', label: 'Hair' },
  { id: 'aesthetic', label: 'Aesthetic' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'results', label: 'Results' },
  { id: 'clinic', label: 'Clinic' },
  { id: 'founder', label: 'Founder' },
];

const STORAGE =
  'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery';

const CLINIC_SEED: Omit<GalleryItem, 'id'>[] = [
  {
    image_url: `${STORAGE}/interior-waiting.webp`,
    label: 'Reception & waiting',
    tag: 'Clinic',
    is_tall: false,
    sort_order: 1,
    is_published: true,
  },
  {
    image_url: `${STORAGE}/welcome-board.webp`,
    label: 'Welcome — coffee & cookies corner',
    tag: 'Visit',
    is_tall: true,
    sort_order: 2,
    is_published: true,
  },
];

const LOCAL_HERO = '/images/hero/clinic-hero@1920.jpg?v=9';
const LOCAL_EXO = '/images/treatments/skin/exosomes-promo.webp?v=5';
const LOCAL_DOCTOR = '/images/doctor/dr-prakash-acharya.png';
const LOCAL_FOUNDER = '/images/founder/arjun-giri.png';

function isStockUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes('pexels.com') ||
    lower.includes('unsplash.com') ||
    lower.includes('images.unsplash')
  );
}

function displayUrl(url: string | null | undefined, fallback: string): string {
  if (!url || isStockUrl(url)) return fallback;
  return url;
}

export default function MediaHub() {
  const [tab, setTab] = useState<MediaTab>('hero');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [heroes, setHeroes] = useState<HeroSlide[]>([]);
  const [exosomesUrl, setExosomesUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [doctorPortrait, setDoctorPortrait] = useState<string | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [editGallery, setEditGallery] = useState<GalleryItem | null>(null);
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, 'id'>>({
    image_url: '',
    label: '',
    tag: '',
    is_tall: false,
    sort_order: 10,
    is_published: true,
  });
  const [deleteGallery, setDeleteGallery] = useState<GalleryItem | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [
      heroesRes,
      settingsRes,
      catsRes,
      servicesRes,
      doctorRes,
      resultsRes,
      galleryRes,
    ] = await Promise.all([
      supabase.from('hero_slides').select('*').order('sort_order'),
      supabase.from('clinic_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('service_categories').select('id, slug, label').order('sort_order'),
      supabase.from('services').select('id, title, image_url, category_id, sort_order, is_published').order('sort_order'),
      supabase.from('doctor_profile').select('portrait_url').eq('id', 1).maybeSingle(),
      supabase.from('results').select('*').order('sort_order'),
      supabase.from('gallery_items').select('*').order('sort_order'),
    ]);

    const firstError =
      heroesRes.error?.message ||
      settingsRes.error?.message ||
      catsRes.error?.message ||
      servicesRes.error?.message ||
      doctorRes.error?.message ||
      resultsRes.error?.message ||
      galleryRes.error?.message;

    if (firstError) setError(firstError);

    setHeroes((heroesRes.data ?? []) as HeroSlide[]);
    {
      const row = settingsRes.data as Record<string, unknown> | null;
      const addr =
        row && typeof row.address === 'object' && row.address !== null
          ? (row.address as Record<string, unknown>)
          : {};
      const fromColumn =
        typeof row?.exosomes_promo_url === 'string' ? row.exosomes_promo_url : '';
      const fromAddress =
        typeof addr.exosomesPromoUrl === 'string' ? addr.exosomesPromoUrl : '';
      setExosomesUrl(fromColumn || fromAddress);
    }
    setCategories((catsRes.data ?? []) as Category[]);
    setServices((servicesRes.data ?? []) as ServiceRow[]);
    setDoctorPortrait(
      typeof doctorRes.data?.portrait_url === 'string' ? doctorRes.data.portrait_url : null,
    );
    setResults((resultsRes.data ?? []) as ResultRow[]);
    setGallery((galleryRes.data ?? []) as GalleryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useRefetchOnFocus(() => {
    void load();
  });

  const categoryIdBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of categories) map.set(c.slug, c.id);
    return map;
  }, [categories]);

  const servicesFor = (slug: string) => {
    const id = categoryIdBySlug.get(slug);
    if (!id) return [];
    return services.filter((s) => s.category_id === id);
  };

  const primaryHero = useMemo(
    () => heroes.find((h) => h.is_published) ?? heroes[0] ?? null,
    [heroes],
  );

  const saveHeroImage = async (url: string) => {
    setSaving(true);
    setError(null);
    setInfo(null);
    if (primaryHero) {
      const { error: updateError } = await supabase
        .from('hero_slides')
        .update({ image_url: url, is_published: true, updated_at: new Date().toISOString() })
        .eq('id', primaryHero.id);
      const result = mutationResult(updateError);
      if (!result.ok) setError(result.message);
      else setInfo('Hero image updated. Live site uses the first published slide.');
    } else {
      const { error: insertError } = await supabase.from('hero_slides').insert({
        image_url: url,
        alt: 'Clinic reception',
        sort_order: 0,
        is_published: true,
      });
      const result = mutationResult(insertError);
      if (!result.ok) setError(result.message);
      else setInfo('Hero image added.');
    }
    setSaving(false);
    void load();
  };

  const saveExosomes = async (url: string) => {
    setSaving(true);
    setError(null);
    setInfo(null);

    const { data: current, error: readError } = await supabase
      .from('clinic_settings')
      .select('address')
      .eq('id', 1)
      .maybeSingle();
    if (readError) {
      setSaving(false);
      setError(readError.message);
      return;
    }

    const prevAddress =
      current?.address && typeof current.address === 'object' && !Array.isArray(current.address)
        ? { ...(current.address as Record<string, unknown>) }
        : {};
    const nextAddress = { ...prevAddress };
    if (url.trim()) nextAddress.exosomesPromoUrl = url.trim();
    else delete nextAddress.exosomesPromoUrl;

    const { error: updateError } = await supabase
      .from('clinic_settings')
      .upsert(
        { id: 1, address: nextAddress, updated_at: new Date().toISOString() },
        { onConflict: 'id' },
      );
    const result = mutationResult(updateError);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setExosomesUrl(url);
    setInfo('Exosomes poster updated.');
  };

  const saveServiceImage = async (id: string, url: string) => {
    setSaving(true);
    setError(null);
    setInfo(null);
    const { error: updateError } = await supabase
      .from('services')
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq('id', id);
    const result = mutationResult(updateError);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setInfo('Treatment image updated.');
    void load();
  };

  const saveDoctorPortrait = async (url: string) => {
    setSaving(true);
    setError(null);
    setInfo(null);
    const { error: updateError } = await supabase
      .from('doctor_profile')
      .upsert(
        { id: 1, portrait_url: url || null, updated_at: new Date().toISOString() },
        { onConflict: 'id' },
      );
    const result = mutationResult(updateError);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDoctorPortrait(url);
    setInfo('Doctor portrait updated.');
  };

  const saveResultImage = async (id: string, field: 'before_url' | 'after_url', url: string) => {
    setSaving(true);
    setError(null);
    setInfo(null);
    const { error: updateError } = await supabase
      .from('results')
      .update({ [field]: url, updated_at: new Date().toISOString() })
      .eq('id', id);
    const result = mutationResult(updateError);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setInfo('Result image updated.');
    void load();
  };

  const handleSeedClinic = async () => {
    setSeeding(true);
    setError(null);
    setInfo(null);
    let inserted = 0;
    let updated = 0;
    for (const seed of CLINIC_SEED) {
      const existing = gallery.find((r) => r.label.toLowerCase() === seed.label.toLowerCase());
      if (existing) {
        const { error: updateError } = await supabase
          .from('gallery_items')
          .update({ ...seed, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (updateError) {
          setError(updateError.message);
          setSeeding(false);
          return;
        }
        updated += 1;
      } else {
        const { error: insertError } = await supabase.from('gallery_items').insert(seed);
        if (insertError) {
          setError(insertError.message);
          setSeeding(false);
          return;
        }
        inserted += 1;
      }
    }
    setSeeding(false);
    setInfo(
      inserted || updated
        ? `Clinic photos ready (${inserted} added, ${updated} refreshed).`
        : 'Clinic photos already present.',
    );
    void load();
  };

  const handleGallerySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.image_url.trim() || !galleryForm.label.trim()) {
      setError('Label and image are required.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { ...galleryForm, updated_at: new Date().toISOString() };
    const { error: saveError } = editGallery
      ? await supabase.from('gallery_items').update(payload).eq('id', editGallery.id)
      : await supabase.from('gallery_items').insert(payload);
    const result = mutationResult(saveError);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setGalleryFormOpen(false);
    void load();
  };

  const handleGalleryDelete = async () => {
    if (!deleteGallery) return;
    const { error: deleteError } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', deleteGallery.id);
    const result = mutationResult(deleteError);
    setDeleteGallery(null);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    void load();
  };

  if (loading) return <p className="text-muted">Loading media…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-secondary)] font-semibold mb-2">
            Website
          </p>
          <h1 className="admin-page-title text-3xl">Media</h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Section images that appear on the live site. Local curated photos are used when a CMS
            URL is empty or stock.
          </p>
        </div>
      </div>

      {info && (
        <p className="text-sm text-ink mb-3" role="status">
          {info}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </p>
      )}

      <div className="admin-media-tabs" role="tablist" aria-label="Media sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`admin-media-tab${tab === t.id ? ' admin-media-tab--active' : ''}`}
            onClick={() => {
              setTab(t.id);
              setInfo(null);
              setError(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              First published hero slide drives the homepage. Empty/stock falls back to the reception
              photo.
            </p>
            <Link to="/hero" className="admin-link">
              Full hero editor →
            </Link>
          </div>
          <div className="admin-media-grid">
            <article className="admin-media-card">
              <div className="admin-media-card__thumb">
                <img
                  src={displayUrl(primaryHero?.image_url, LOCAL_HERO)}
                  alt={primaryHero?.alt ?? 'Hero'}
                />
              </div>
              <div className="admin-media-card__body">
                <h3 className="admin-media-card__label">Homepage hero</h3>
                <p className="admin-media-card__meta">
                  {primaryHero?.is_published ? 'Published' : 'Using local fallback until published'}
                </p>
                <ImageUpload folder="hero" value={primaryHero?.image_url ?? ''} onChange={(url) => void saveHeroImage(url)} />
                {saving && <p className="text-xs text-muted mt-2">Saving…</p>}
              </div>
            </article>
          </div>
        </section>
      )}

      {tab === 'exosomes' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Promo poster on the Exosomes spotlight section.</p>
            <Link to="/settings" className="admin-link">
              Clinic settings →
            </Link>
          </div>
          <div className="admin-media-grid">
            <article className="admin-media-card">
              <div className="admin-media-card__thumb">
                <img src={displayUrl(exosomesUrl, LOCAL_EXO)} alt="Exosomes promo" />
              </div>
              <div className="admin-media-card__body">
                <h3 className="admin-media-card__label">Exosomes poster</h3>
                <p className="admin-media-card__meta">Full-frame promo · no crop overlays</p>
                <ImageUpload folder="exosomes" value={exosomesUrl} onChange={(url) => void saveExosomes(url)} />
              </div>
            </article>
          </div>
        </section>
      )}

      {(tab === 'skin' || tab === 'hair' || tab === 'aesthetic') && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Treatment card images for the {tab} tab. Matched to the public site by title.
            </p>
            <Link to="/services" className="admin-link">
              Full services editor →
            </Link>
          </div>
          <div className="admin-media-grid">
            {servicesFor(tab).map((svc) => (
              <article key={svc.id} className="admin-media-card">
                <div className="admin-media-card__thumb">
                  {svc.image_url && !isStockUrl(svc.image_url) ? (
                    <img src={svc.image_url} alt={svc.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted px-3 text-center">
                      Local fallback until uploaded
                    </div>
                  )}
                </div>
                <div className="admin-media-card__body">
                  <h3 className="admin-media-card__label">{svc.title}</h3>
                  <p className="admin-media-card__meta">
                    {svc.is_published ? 'Published' : 'Unpublished'}
                  </p>
                  <ImageUpload
                    folder={`treatments/${tab}`}
                    value={svc.image_url ?? ''}
                    onChange={(url) => void saveServiceImage(svc.id, url)}
                  />
                </div>
              </article>
            ))}
            {servicesFor(tab).length === 0 && (
              <p className="text-sm text-muted">No {tab} services in CMS yet.</p>
            )}
          </div>
        </section>
      )}

      {tab === 'doctor' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Portrait on the Dermatology / doctor section.</p>
            <Link to="/doctor" className="admin-link">
              Full doctor profile →
            </Link>
          </div>
          <div className="admin-media-grid">
            <article className="admin-media-card">
              <div className="admin-media-card__thumb">
                <img src={displayUrl(doctorPortrait, LOCAL_DOCTOR)} alt="Doctor portrait" />
              </div>
              <div className="admin-media-card__body">
                <h3 className="admin-media-card__label">Dr. Prakash Acharya</h3>
                <p className="admin-media-card__meta">doctor_profile.portrait_url</p>
                <ImageUpload
                  folder="doctor"
                  value={doctorPortrait ?? ''}
                  onChange={(url) => void saveDoctorPortrait(url)}
                />
              </div>
            </article>
          </div>
        </section>
      )}

      {tab === 'results' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Before/after pairs for Patient results. Empty CMS falls back to local illustrative set.
            </p>
            <Link to="/results" className="admin-link">
              Full results editor →
            </Link>
          </div>
          <div className="admin-media-grid">
            {results.map((row) => (
              <article key={row.id} className="admin-media-card">
                <div className="admin-media-card__thumb grid grid-cols-2 gap-px bg-line">
                  <img src={row.before_url} alt={`${row.label} before`} />
                  <img src={row.after_url} alt={`${row.label} after`} />
                </div>
                <div className="admin-media-card__body">
                  <h3 className="admin-media-card__label">{row.label}</h3>
                  <p className="admin-media-card__meta">
                    {row.category} · {row.is_published ? 'Published' : 'Draft'}
                  </p>
                  <FormField label="Before">
                    <ImageUpload
                      folder="results"
                      value={row.before_url}
                      onChange={(url) => void saveResultImage(row.id, 'before_url', url)}
                    />
                  </FormField>
                  <FormField label="After">
                    <ImageUpload
                      folder="results"
                      value={row.after_url}
                      onChange={(url) => void saveResultImage(row.id, 'after_url', url)}
                    />
                  </FormField>
                </div>
              </article>
            ))}
            {results.length === 0 && (
              <p className="text-sm text-muted">
                No CMS results yet — public site shows local fallback images.
              </p>
            )}
          </div>
        </section>
      )}

      {tab === 'clinic' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Inside the clinic gallery on the public site.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="admin-btn-secondary"
                disabled={seeding}
                onClick={() => void handleSeedClinic()}
              >
                {seeding ? 'Seeding…' : 'Restore clinic photos'}
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => {
                  setEditGallery(null);
                  setGalleryForm({
                    image_url: '',
                    label: '',
                    tag: 'Clinic',
                    is_tall: false,
                    sort_order: gallery.length ? Math.max(...gallery.map((g) => g.sort_order)) + 1 : 10,
                    is_published: true,
                  });
                  setGalleryFormOpen(true);
                }}
              >
                Add image
              </button>
            </div>
          </div>
          <div className="admin-media-grid">
            {gallery.map((item) => (
              <article key={item.id} className="admin-media-card">
                <div className="admin-media-card__thumb">
                  <img src={item.image_url} alt={item.label} />
                </div>
                <div className="admin-media-card__body">
                  <h3 className="admin-media-card__label">{item.label}</h3>
                  <p className="admin-media-card__meta">
                    {item.tag ?? '—'} · {item.is_published ? 'Published' : 'Draft'} · #{item.sort_order}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        setEditGallery(item);
                        setGalleryForm({
                          image_url: item.image_url,
                          label: item.label,
                          tag: item.tag,
                          is_tall: item.is_tall,
                          sort_order: item.sort_order,
                          is_published: item.is_published,
                        });
                        setGalleryFormOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => setDeleteGallery(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'founder' && (
        <section className="space-y-4">
          <p className="text-sm text-muted">
            Founder portrait on Clinic journey is a static local asset (not CMS-editable yet).
          </p>
          <div className="admin-media-grid">
            <article className="admin-media-card">
              <div className="admin-media-card__thumb">
                <img src={LOCAL_FOUNDER} alt="Mr. Arjun Giri" />
              </div>
              <div className="admin-media-card__body">
                <h3 className="admin-media-card__label">Mr. Arjun Giri</h3>
                <p className="admin-media-card__meta">Read-only · {LOCAL_FOUNDER}</p>
              </div>
            </article>
          </div>
        </section>
      )}

      <CrudForm
        title={editGallery ? 'Edit clinic photo' : 'Add clinic photo'}
        open={galleryFormOpen}
        onClose={() => setGalleryFormOpen(false)}
        onSubmit={(e) => void handleGallerySave(e)}
        saving={saving}
        error={error}
      >
        <FormField label="Label">
          <input
            className="admin-input"
            value={galleryForm.label}
            onChange={(e) => setGalleryForm({ ...galleryForm, label: e.target.value })}
            required
          />
        </FormField>
        <FormField label="Tag">
          <input
            className="admin-input"
            value={galleryForm.tag ?? ''}
            onChange={(e) => setGalleryForm({ ...galleryForm, tag: e.target.value })}
          />
        </FormField>
        <FormField label="Image">
          <ImageUpload
            folder="gallery"
            value={galleryForm.image_url}
            onChange={(url) => setGalleryForm({ ...galleryForm, image_url: url })}
          />
        </FormField>
        <FormField label="Sort order">
          <input
            type="number"
            className="admin-input"
            value={galleryForm.sort_order}
            onChange={(e) => setGalleryForm({ ...galleryForm, sort_order: Number(e.target.value) })}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={galleryForm.is_tall}
            onChange={(e) => setGalleryForm({ ...galleryForm, is_tall: e.target.checked })}
          />
          Tall cell
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={galleryForm.is_published}
            onChange={(e) => setGalleryForm({ ...galleryForm, is_published: e.target.checked })}
          />
          Published on website
        </label>
      </CrudForm>

      <ConfirmDelete
        open={!!deleteGallery}
        title="Delete clinic photo?"
        message={`Remove "${deleteGallery?.label}"?`}
        onConfirm={() => void handleGalleryDelete()}
        onCancel={() => setDeleteGallery(null)}
      />
    </div>
  );
}
