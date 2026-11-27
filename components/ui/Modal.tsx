"use client";

import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { cn } from "@/lib/cn";

/* ============================================================
   Modal — native <dialog>.showModal() gives us focus trapping,
   Escape handling and focus restoration for free; CSS animates
   the open/close from the [data-modal] rules in globals.css.
   ============================================================ */

const CLOSE_MS = 250;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name announced when the dialog opens. */
  label: string;
  /** "center" — floating panel. "menu" — full-height curtain from the top. */
  anim?: "center" | "menu";
  panelClassName?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, label, anim = "center", panelClassName, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const closeTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Keep the dialog element in sync with the controlled `open` state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setClosing(false);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Lock page scroll while open; scrollbar-gutter keeps the layout steady.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closeTimer.current !== null) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      dialog.close();
      setClosing(false);
      onCloseRef.current();
    }, CLOSE_MS);
  };

  return (
    <dialog
      ref={dialogRef}
      data-modal=""
      data-modal-anim={anim}
      data-closing={closing ? "" : undefined}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => onCloseRef.current()}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className={cn(
          "relative flex max-h-full w-full flex-col overflow-hidden rounded-[20px] border border-line bg-elevated shadow-[0_50px_140px_-24px_rgb(0_0_0/0.85)]",
          panelClassName,
        )}
      >
        <button
          type="button"
          onClick={requestClose}
          aria-label="Close dialog"
          className="absolute top-3 right-3 z-20 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition-[background-color,border-color,scale] duration-300 hover:border-white/40 hover:bg-black/75 active:scale-90"
        >
          <FaXmark className="size-5" aria-hidden />
        </button>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  );
}
