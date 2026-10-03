'use client';

import { Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { MemoryItem } from '@/lib/types';

export function DeleteMemoryButton({ memory }: { memory: MemoryItem }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  async function deleteMemory() {
    setIsDeleting(true);
    setError('');
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Please sign in before deleting a memory.');
      setIsDeleting(false);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError('Please sign in before deleting a memory.');
      setIsDeleting(false);
      return;
    }

    const { data: photos, error: photosError } = await supabase
      .from('media')
      .select('storage_path')
      .eq('memory_id', memory.id);
    if (photosError) {
      setError(photosError.message);
      setIsDeleting(false);
      return;
    }

    const paths = (photos ?? []).map((photo) => photo.storage_path);
    if (paths.length) {
      const { error: storageError } = await supabase.storage.from('memory-media').remove(paths);
      if (storageError) {
        setError(storageError.message);
        setIsDeleting(false);
        return;
      }
    }

    const { error: deleteError } = await supabase.from('memories').delete().eq('id', memory.id);
    if (deleteError) {
      setError(deleteError.message);
      setIsDeleting(false);
      return;
    }

    setIsOpen(false);
    setIsDeleting(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError('');
          setIsOpen(true);
        }}
        aria-label={`Delete ${memory.title}`}
        title="Delete memory"
        className="grid size-8 shrink-0 place-items-center rounded-full text-[#8c3f35] hover:bg-[#f9e4df]"
      >
        <Trash2 size={15} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1d1714]/45 px-4 py-6" role="presentation">
          <section role="alertdialog" aria-modal="true" aria-labelledby={`delete-memory-title-${memory.id}`} aria-describedby={`delete-memory-description-${memory.id}`} className="w-full max-w-md rounded-[24px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8c7767]">Permanent action</p>
                <h2 id={`delete-memory-title-${memory.id}`} className="mt-2 text-xl font-semibold text-[#1d1a18]">Delete this memory?</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Cancel deletion" className="rounded-full p-2 text-[#6d5d54] hover:bg-[#f2eae2]">
                <X size={18} />
              </button>
            </div>
            <p id={`delete-memory-description-${memory.id}`} className="mt-4 text-sm leading-6 text-[#685d56]">
              “{memory.title}” and its attached photos will be permanently deleted.
            </p>
            {error && <p role="alert" className="mt-4 rounded-xl bg-[#f9e4df] p-3 text-sm text-[#8c3f35]">{error}</p>}
            <div className="mt-6 flex justify-end gap-3 border-t border-[#e7dfd7] pt-4">
              <button type="button" disabled={isDeleting} onClick={() => setIsOpen(false)} className="rounded-full px-4 py-2 text-sm text-[#685d56] hover:bg-[#f2eae2] disabled:opacity-50">
                Cancel
              </button>
              <button type="button" disabled={isDeleting} onClick={deleteMemory} className="rounded-full bg-[#8c3f35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#713229] disabled:opacity-60">
                {isDeleting ? 'Deleting...' : 'Delete memory'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}