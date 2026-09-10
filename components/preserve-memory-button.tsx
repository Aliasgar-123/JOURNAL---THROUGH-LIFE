'use client';

import { X } from 'lucide-react';
import { FormEvent, useState } from 'react';

export function PreserveMemoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSaved(false);
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] transition hover:bg-[#312a26]"
      >
        Preserve this memory
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1714]/40 px-6 py-8" role="presentation">
          <div className="w-full max-w-lg rounded-[28px] border border-[#e7dfd7] bg-[#fffdfb] p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="memory-dialog-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8c7767]">New entry</p>
                <h2 id="memory-dialog-title" className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#1a1715]">
                  Preserve a memory
                </h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close dialog" className="rounded-full p-2 text-[#6d5d54] hover:bg-[#f2eae2]">
                <X size={18} />
              </button>
            </div>

            {saved ? (
              <div className="mt-6 rounded-2xl bg-[#f2eae2] p-4 text-sm leading-6 text-[#4e433d]">
                Your memory is ready to be connected to persistent storage. For now, this entry stays in the current session.
                <button type="button" onClick={() => setIsOpen(false)} className="mt-4 block font-medium text-[#1d1917] underline underline-offset-4">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-sm font-medium text-[#403630]">
                  Title
                  <input required name="title" placeholder="A moment worth keeping" className="mt-2 w-full rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                </label>
                <label className="block text-sm font-medium text-[#403630]">
                  What happened?
                  <textarea required name="description" rows={4} placeholder="Write a few lines..." className="mt-2 w-full resize-none rounded-2xl border border-[#e4d8cf] bg-[#fbf8f5] px-4 py-3 text-sm outline-none focus:border-[#8c7767]" />
                </label>
                <button type="submit" className="w-full rounded-full bg-[#1a1715] px-5 py-3 text-sm font-medium text-[#f5efe9] hover:bg-[#312a26]">
                  Save memory
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}