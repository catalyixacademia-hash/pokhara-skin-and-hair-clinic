import { useState } from 'react';
import { MEDIA_BUCKET, supabase } from '@/lib/supabase';

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder: string;
};

export default function ImageUpload({ value, onChange, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${folder}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      upsert: true,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      {value && (
        <img
          src={value}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-xl border border-line/70"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-[color-mix(in_srgb,var(--color-primary)_10%,white)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-primary)]"
      />
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className="admin-input"
      />
      {uploading && <p className="text-xs text-muted">Uploading…</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
