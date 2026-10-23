'use client';

import { FormEvent, useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export function CreateTripButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    if (!name) {
      setError('Enter a place or trip name.');
      setIsSaving(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Unable to connect to your account. Check your Supabase settings.');
      setIsSaving(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setError('Please sign in before creating a trip.');
      setIsSaving(false);
      return;
    }

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({ user_id: userData.user.id, name })
      .select('id')
      .single();

    if (tripError) {
      setError(tripError.message);
      setIsSaving(false);
      return;
    }

    router.push(`/travel/${trip.id}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError('');
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] transition hover:bg-[#312a26]"
      >
        <FolderPlus size={17} aria-hidden="true" />
        Add a Trip
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1714]/40 px-6 py-8" role="presentation">
          <div className="w-full max-w-lg rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="trip-dialog-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8c7767]">New folder</p>
                <h2 id="trip-dialog-title" className="mt-2 text-2xl font-semibold text-[#1a1715]">Add a Trip</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close dialog" className="rounded-full p-2 text-[#6d5d54] hover:bg-[#f2eae2]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-[#403630]">
                Place or trip name
                <input required autoFocus name="name" maxLength={120} placeholder="Where did you go?" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
              </label>
              {error && <p role="alert" className="rounded-2xl bg-[#f9e4df] p-3 text-sm text-[#8c3f35]">{error}</p>}
              <button disabled={isSaving} type="submit" className="w-full rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] disabled:opacity-60">
                {isSaving ? 'Creating trip...' : 'Create Trip Folder'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
