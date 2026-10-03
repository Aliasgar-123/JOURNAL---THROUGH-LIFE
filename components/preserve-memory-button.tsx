'use client';

import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { MemoryCategory } from '@/lib/types';

const maxImageSize = 10 * 1024 * 1024;
const maxImageCount = 8;
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function PreserveMemoryButton({ category }: { category?: MemoryCategory }) {
  const isTravelMemory = category === 'Travel';
  const isAcademicMemory = category === 'Academia';
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [selectionError, setSelectionError] = useState('');

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedImages = Array.from(event.currentTarget.files ?? []);
    setError('');
    if (selectedImages.length > maxImageCount) {
      setSelectionError(`Choose up to ${maxImageCount} images.`);
      setImages([]);
      return;
    }
    const oversizedImage = selectedImages.find((image) => image.size > maxImageSize);
    if (oversizedImage) {
      setSelectionError('Each image must be 10 MB or smaller.');
      setImages([]);
      return;
    }
    if (selectedImages.some((image) => !allowedImageTypes.includes(image.type))) {
      setSelectionError('Use JPEG, PNG, WebP, GIF, or AVIF images.');
      setImages([]);
      return;
    }
    setSelectionError('');
    setImages(selectedImages);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const formData = new FormData(event.currentTarget);
    const selectedImages = images.map((file, index) => ({
      file,
      caption: String(formData.get(`caption-${index}`) ?? '').trim(),
    }));
    if (isTravelMemory && selectedImages.length === 0) {
      setError('Add at least one photo to save a travel memory.');
      setSaving(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const { data: userData } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    if (!supabase || !userData.user) {
      setError('Please sign in before saving a memory.');
    } else {
      const { data: memory, error: insertError } = await supabase.from('memories').insert({
        user_id: userData.user.id,
        title: isTravelMemory ? String(formData.get('place')).trim() : String(formData.get('title')).trim(),
        description: String(formData.get('description')),
        location: isTravelMemory ? String(formData.get('place')).trim() : String(formData.get('location') ?? '').trim(),
        ...(category && { category }),
      }).select('id').single();
      if (insertError) {
        setError(insertError.message);
      } else {
        const uploadedPaths: string[] = [];
        let uploadError = '';
        for (const { file } of selectedImages) {
          const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const path = `${userData.user.id}/${memory.id}/${crypto.randomUUID()}.${extension}`;
          const { error: storageError } = await supabase.storage.from('memory-media').upload(path, file, {
            contentType: file.type,
            upsert: false,
          });
          if (storageError) {
            uploadError = storageError.message;
            break;
          }
          uploadedPaths.push(path);
        }

        if (!uploadError && selectedImages.length) {
          const { error: mediaError } = await supabase.from('media').insert(
            selectedImages.map(({ caption }, index) => ({
              memory_id: memory.id,
              storage_path: uploadedPaths[index],
              media_type: 'image',
              caption,
            })),
          );
          if (mediaError) uploadError = mediaError.message;
        }

        if (uploadError) {
          if (uploadedPaths.length) await supabase.storage.from('memory-media').remove(uploadedPaths);
          await supabase.from('memories').delete().eq('id', memory.id);
          setError(uploadError);
        } else {
          setSaved(true);
        }
      }
    }
    setSaving(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSaved(false);
          setImages([]);
          setSelectionError('');
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] transition hover:bg-[#312a26]"
      >
        {isTravelMemory ? 'Add a travel memory' : isAcademicMemory ? 'Add an academic memory' : 'Preserve this memory'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1714]/40 px-6 py-8" role="presentation">
          <div className="w-full max-w-lg rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="memory-dialog-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8c7767]">New entry</p>
                <h2 id="memory-dialog-title" className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1a1715]">
                  {isTravelMemory ? 'Save a travel memory' : isAcademicMemory ? 'Save an academic memory' : 'Preserve a memory'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close dialog" className="rounded-full p-2 text-[#6d5d54] hover:bg-[#f2eae2]">
                <X size={18} />
              </button>
            </div>

            {saved ? (
              <div className="mt-6 rounded-2xl bg-[#f2eae2] p-4 text-sm leading-6 text-[#4e433d]">
                Your memory and images have been saved.
                <button type="button" onClick={() => setIsOpen(false)} className="mt-4 block font-medium text-[#1d1917] underline underline-offset-4">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {isTravelMemory ? (
                  <label className="block text-sm font-medium text-[#403630]">
                    Place visited
                    <input required autoFocus name="place" maxLength={200} placeholder="Where did you go?" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                  </label>
                ) : (
                  <label className="block text-sm font-medium text-[#403630]">
                    Title
                    <input required name="title" placeholder="A moment worth keeping" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                  </label>
                )}
                {!isTravelMemory && (
                  <label className="block text-sm font-medium text-[#403630]">
                    Place (optional)
                    <input name="location" maxLength={200} placeholder="Where was this?" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                  </label>
                )}
                <label className="block text-sm font-medium text-[#403630]">
                  What happened?
                  <textarea required name="description" rows={4} placeholder="Write a few lines..." className="mt-2 w-full resize-none rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                </label>
                <label className="block text-sm font-medium text-[#403630]">
                  Images
                  <input required={isTravelMemory} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple onChange={handleImageSelection} className="mt-2 block w-full text-sm text-[#685d56] file:mr-3 file:rounded-full file:border-0 file:bg-[#efe5dd] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#403630] hover:file:bg-[#e8d9ce]" />
                </label>
                {images.map((image, index) => (
                  <label key={`${image.name}-${image.lastModified}`} className="block text-sm font-medium text-[#403630]">
                    Caption for {image.name}
                    <input name={`caption-${index}`} maxLength={500} placeholder="Add a caption (optional)" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                  </label>
                ))}
                {(selectionError || error) && <p className="rounded-2xl bg-[#f9e4df] p-3 text-sm text-[#8c3f35]">{selectionError || error}</p>}
                <button disabled={saving || !!selectionError} type="submit" className="w-full rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] hover:bg-[#312a26] disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save memory'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}