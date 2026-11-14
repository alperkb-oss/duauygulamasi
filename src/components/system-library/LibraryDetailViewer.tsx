import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trapFocus(event: globalThis.KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

export function LibraryDetailViewer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      } else if (event.key === 'Tab') {
        trapFocus(event, dialogRef.current);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-midnight-950 animate-fade-in">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full flex-col"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-emerald-800/40 bg-midnight-950 px-4 py-3 md:px-8">
          <h2 id={titleId} className="min-w-0 truncate text-lg font-display font-bold text-gold-100">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-3">
            <kbd className="hidden rounded border border-emerald-800/60 px-1.5 py-0.5 text-[10px] text-midnight-400 md:inline-block">
              Esc
            </kbd>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onCloseRef.current()}
              aria-label={t('library.closeViewer')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-800/50 bg-emerald-950/40 text-midnight-200 transition-colors hover:border-gold-400/50 hover:text-gold-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 pb-16 md:px-8">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
