'use client';

import Image from 'next/image';
import { Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { MemoryItem } from '@/lib/types';

const maxImageSize = 10 * 1024 * 1024;
const maxImageCount = 8;
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function EditMemoryButton({ memory }: { memory: MemoryItem }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectionError, setSelectionError] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);
  const isTravelMemory = memory.category === 'Travel';
  const keptMedia = memory.media.filter((photo) => !removedMediaIds.includes(photo.id));

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedImages = Array.from(event.currentTarget.files ?? []);
    const availableSlots = maxImageCount - keptMedia.length;
    setError('');
    if (selectedImages.length > availableSlots) {
      setSelectionError(`Choose up to ${availableSlots} more images.`);
      setNewImages([]);
      return;
    }
    const oversizedImage = selectedImages.find((image) => image.size > maxImageSize);
    if (oversizedImage) {
      setSelectionError('Each image must be 10 MB or smaller.');
      setNewImages([]);
      return;
    }
    if (selectedImages.some((image) => !allowedImageTypes.includes(image.type))) {
      setSelectionError('Use JPEG, PNG, WebP, GIF, or AVIF images.');
      setNewImages([]);
      return;
    }
    setSelectionError('');
    setNewImages(selectedImages);
  }

  function togglePhotoRemoval(photoId: string) {
    setRemovedMediaIds((current) => current.includes(photoId)
      ? current.filter((id) => id !== photoId)
      : [...current, photoId]);
    setSelectionError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const remainingPhotos = keptMedia.length + newImages.length;
    if (isTravelMemory && remainingPhotos === 0) {
      setError('Keep or add at least one photo for a travel memory.');
      return;
    }

    setSaving(true);
    setError('');
    const formData = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Please sign in before editing a memory.');
      setSaving(false);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError('Please sign in before editing a memory.');
      setSaving(false);
      return;
    }

    const place = String(formData.get('place') ?? '').trim();
    const { error: updateError } = await supabase.from('memories').update({
      title: isTravelMemory ? place : String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      location: isTravelMemory ? place : String(formData.get('location') ?? '').trim(),
    }).eq('id', memory.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    let photoError = '';
    for (const photo of keptMedia) {
      const { error: captionError } = await supabase.from('media').update({
        caption: String(formData.get(`caption-${photo.id}`) ?? '').trim(),
      }).eq('id', photo.id);
      if (captionError) {
        photoError = captionError.message;
        break;
      }
    }

    if (!photoError && removedMediaIds.length) {
      const removedMedia = memory.media.filter((photo) => removedMediaIds.includes(photo.id));
      const { error: deleteError } = await supabase.from('media').delete().in('id', removedMediaIds);
      if (deleteError) {
        photoError = deleteError.message;
      } else {
        const { error: storageError } = await supabase.storage.from('memory-media').remove(removedMedia.map((photo) => photo.storagePath));
        if (storageError) photoError = storageError.message;
      }
    }

    const uploadedPaths: string[] = [];
    if (!photoError) {
      for (const image of newImages) {
        const extension = image.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${userData.user.id}/${memory.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('memory-media').upload(path, image, {
          contentType: image.type,
          upsert: false,
        });
        if (uploadError) {
          photoError = uploadError.message;
          break;
        }
        uploadedPaths.push(path);
      }
    }

    if (!photoError && newImages.length) {
      const { error: insertError } = await supabase.from('media').insert(newImages.map((image, index) => ({
        memory_id: memory.id,
        storage_path: uploadedPaths[index],
        media_type: 'image',
        caption: String(formData.get(`new-caption-${index}`) ?? '').trim(),
      })));
      if (insertError) photoError = insertError.message;
    }

    if (photoError) {
      if (uploadedPaths.length) await supabase.storage.from('memory-media').remove(uploadedPaths);
      setError(`Memory details were saved, but a photo update failed: ${photoError}`);
    } else {
      setSaved(true);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSaved(false);
          setError('');
          setSelectionError('');
          setNewImages([]);
          setRemovedMediaIds([]);
          setIsOpen(true);
        }}
        aria-label={`Edit ${memory.title}`}
        title="Edit memory"
        className="grid size-8 shrink-0 place-items-center rounded-full text-[#6d5d54] hover:bg-[#f2eae2] hover:text-[#1d1917]"
      >
        <Pencil size={15} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1714]/40 px-4 py-6" role="presentation">
          <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby={`edit-memory-title-${memory.id}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8c7767]">Edit entry</p>
                <h2 id={`edit-memory-title-${memory.id}`} className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1a1715]">
                  {isTravelMemory ? 'Edit travel memory' : 'Edit memory'}
                </h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close editor" className="rounded-full p-2 text-[#6d5d54] hover:bg-[#f2eae2]">
                <X size={18} />
              </button>
            </div>

            {saved ? (
              <div className="mt-6 rounded-2xl bg-[#f2eae2] p-4 text-sm leading-6 text-[#4e433d]">
                Your changes have been saved.
                <button type="button" onClick={() => setIsOpen(false)} className="mt-4 block font-medium text-[#1d1917] underline underline-offset-4">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-[#403630]">
                  {isTravelMemory ? 'Place visited' : 'Title'}
                  <input
                    required
                    name={isTravelMemory ? 'place' : 'title'}
                    maxLength={200}
                    defaultValue={isTravelMemory ? memory.location || memory.title : memory.title}
                    className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]"
                  />
                </label>
                {!isTravelMemory && (
                  <label className="block text-sm font-medium text-[#403630]">
                    Place (optional)
                    <input name="location" maxLength={200} defaultValue={memory.location} placeholder="Where was this?" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                  </label>
                )}
                <label className="block text-sm font-medium text-[#403630]">
                  What happened?
                  <textarea required name="description" rows={4} defaultValue={memory.description} className="mt-2 w-full resize-y rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                </label>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-[#403630]">Photos</legend>
                  {memory.media.map((photo) => {
                    const removed = removedMediaIds.includes(photo.id);
                    return (
                      <div key={photo.id} className={`flex gap-3 rounded-2xl border border-[#e4d8cf] p-3 ${removed ? 'opacity-55' : ''}`}>
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f2eae2]">
                          <Image src={photo.url} alt={photo.caption || memory.title} fill sizes="80px" unoptimized className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="block text-xs text-[#685d56]">
                            Caption
                            <input name={`caption-${photo.id}`} maxLength={500} defaultValue={photo.caption} disabled={removed} className="mt-1 w-full rounded-xl border border-[#e4d8cf] bg-[#fbf8f5] px-3 py-2 text-sm outline-none focus:border-[#8c7767] disabled:opacity-50" />
                          </label>
                          <button type="button" onClick={() => togglePhotoRemoval(photo.id)} className="mt-2 text-xs font-medium text-[#8c3f35] underline underline-offset-2">
                            {removed ? 'Keep photo' : 'Remove photo'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </fieldset>

                {newImages.map((image, index) => (
                  <label key={`${image.name}-${image.lastModified}`} className="block text-sm font-medium text-[#403630]">
                    Caption for {image.name}
                    <input name={`new-caption-${index}`} maxLength={500} placeholder="Add a caption (optional)" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                  </label>
                ))}

                <label className="block text-sm font-medium text-[#403630]">
                  Add photos
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple onChange={handleImageSelection} className="mt-2 block w-full text-sm text-[#685d56] file:mr-3 file:rounded-full file:border-0 file:bg-[#efe5dd] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#403630] hover:file:bg-[#e8d9ce]" />
                  <span className="mt-1 block text-xs font-normal text-[#8b7b70]">Up to {maxImageCount} photos, 10 MB each.</span>
                </label>

                {(selectionError || error) && <p role="alert" className="rounded-2xl bg-[#f9e4df] p-3 text-sm text-[#8c3f35]">{selectionError || error}</p>}
                <div className="flex justify-end gap-3 border-t border-[#e7dfd7] pt-4">
                  <button type="button" onClick={() => setIsOpen(false)} className="rounded-full px-4 py-2 text-sm text-[#685d56] hover:bg-[#f2eae2]">Cancel</button>
                  <button disabled={saving || !!selectionError} type="submit" className="rounded-full bg-[#1a1715] px-5 py-2.5 text-sm font-medium text-[#f5efe9] hover:bg-[#312a26] disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}