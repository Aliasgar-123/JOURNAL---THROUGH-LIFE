'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { MemoryItem, MemoryMedia } from '@/lib/types';

type PhotoSelection = {
  memory: MemoryItem;
  photoIndex: number;
};

type PhotoLightboxContextValue = {
  openPhoto: (memory: MemoryItem, photo: MemoryMedia) => void;
};

const PhotoLightboxContext = createContext<PhotoLightboxContextValue | null>(null);

function usePhotoLightbox() {
  const context = useContext(PhotoLightboxContext);
  if (!context) throw new Error('MemoryPhotoButton must be rendered inside PhotoLightboxProvider');
  return context;
}

type MemoryPhotoButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> & {
  memory: MemoryItem;
  photo: MemoryMedia;
  imageWrapperClassName?: string;
  sizes?: string;
};

export function MemoryPhotoButton({
  memory,
  photo,
  className = '',
  imageWrapperClassName,
  sizes = '(max-width: 640px) 100vw, 50vw',
  ...buttonProps
}: MemoryPhotoButtonProps) {
  const { openPhoto } = usePhotoLightbox();
  const image = (
    <Image
      src={photo.url}
      alt={photo.caption || memory.title}
      fill
      sizes={sizes}
      unoptimized
      loading="lazy"
      className="object-cover"
    />
  );

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={() => openPhoto(memory, photo)}
      aria-label={`View photo${photo.caption ? `: ${photo.caption}` : ` for ${memory.title}`}`}
      className={`block cursor-zoom-in border-0 p-0 text-left ${className}`}
    >
      {imageWrapperClassName
        ? <span className={imageWrapperClassName}>{image}</span>
        : image}
    </button>
  );
}

function PhotoLightboxDialog({
  selection,
  onClose,
  onNavigate,
}: {
  selection: PhotoSelection;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedPhoto = selection.memory.media[selection.photoIndex];
  const photoCount = selection.memory.media.length;
  const date = new Date(`${selection.memory.date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && photoCount > 1) {
        const target = event.target;
        if (target instanceof HTMLElement && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName))) return;
        event.preventDefault();
        onNavigate(event.key === 'ArrowLeft' ? -1 : 1);
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const buttons = dialogRef.current.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton?.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [onClose, onNavigate, photoCount]);

  if (!selectedPhoto) return null;

  function changePhoto(direction: -1 | 1) {
    onNavigate(direction);
  }

  return (
    <div
      className="photo-lightbox-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-[#5c7078]/75 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo from ${selection.memory.title}`}
        tabIndex={-1}
        className="photo-lightbox-dialog relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-[900px] grid-rows-[minmax(220px,44dvh)_auto] overflow-hidden rounded-xl bg-[#fbfcfa] shadow-[0_30px_100px_rgba(24,38,44,0.28)] outline-none sm:h-[min(370px,calc(100dvh-3rem))] sm:max-h-[calc(100dvh-3rem)] sm:grid-cols-[1.15fr_0.85fr] sm:grid-rows-1"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative min-h-0 bg-[#e7eceb]">
          <Image
            src={selectedPhoto.url}
            alt={selectedPhoto.caption || selection.memory.title}
            fill
            sizes="(max-width: 640px) 100vw, 90vw"
            unoptimized
            className="object-contain"
            priority
          />
          {photoCount > 1 && (
            <>
              <button
                type="button"
                onClick={() => changePhoto(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-[#fbfcfa]/90 text-[#34464c] shadow-md hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5"
              >
                <ChevronLeft size={23} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => changePhoto(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-[#fbfcfa]/90 text-[#34464c] shadow-md hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5"
              >
                <ChevronRight size={23} aria-hidden="true" />
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-[#26363b]/75 px-3 py-1 font-sans text-xs text-white sm:bottom-5 sm:right-5">
                {selection.photoIndex + 1} / {photoCount}
              </span>
            </>
          )}
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full border border-[#34464c] bg-[#fbfcfa]/95 text-[#34464c] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34464c]"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="flex min-h-0 flex-col justify-center overflow-y-auto px-6 py-10 sm:px-10 sm:py-12">
          <div>
            <div className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#78909a]">{date}</div>
            <h2 className="mt-3 font-serif text-[26px] font-normal leading-tight text-[#2e4149] sm:text-[34px]">{selection.memory.title}</h2>
            {(selectedPhoto.caption || selection.memory.description) && (
              <p className="mt-4 whitespace-pre-wrap font-sans text-[12px] leading-[1.9] text-[#71858e] sm:text-[13px]">
                {selectedPhoto.caption || selection.memory.description}
              </p>
            )}
            {selection.memory.location && (
              <p className="mt-5 font-sans text-[10px] leading-5 text-[#78909a]">
                ~ {selection.memory.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhotoLightboxProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<PhotoSelection | null>(null);

  const openPhoto = useCallback((memory: MemoryItem, photo: MemoryMedia) => {
    const photoIndex = memory.media.findIndex((item) => item.id === photo.id);
    if (photoIndex < 0) throw new Error(`Photo ${photo.id} is not part of memory ${memory.id}`);
    setSelection({ memory, photoIndex });
  }, []);

  const close = useCallback(() => setSelection(null), []);
  const navigate = useCallback((direction: -1 | 1) => {
    setSelection((current) => {
      if (!current || current.memory.media.length < 2) return current;
      const photoIndex = (current.photoIndex + direction + current.memory.media.length) % current.memory.media.length;
      return { ...current, photoIndex };
    });
  }, []);

  return (
    <PhotoLightboxContext.Provider value={{ openPhoto }}>
      {children}
      {selection && <PhotoLightboxDialog selection={selection} onClose={close} onNavigate={navigate} />}
    </PhotoLightboxContext.Provider>
  );
}
