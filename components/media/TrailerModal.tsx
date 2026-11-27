"use client";

import Modal from "@/components/ui/Modal";

export interface TrailerTarget {
  key: string;
  title: string;
}

interface TrailerModalProps {
  trailer: TrailerTarget | null;
  onClose: () => void;
}

/** YouTube trailer in a modal — the iframe only mounts while open, so audio stops on close. */
export default function TrailerModal({ trailer, onClose }: TrailerModalProps) {
  return (
    <Modal
      open={trailer !== null}
      onClose={onClose}
      label={trailer ? `Trailer: ${trailer.title}` : "Trailer"}
      panelClassName="max-w-5xl bg-black"
    >
      {trailer && (
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
            title={`${trailer.title} — official trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="block size-full"
          />
        </div>
      )}
    </Modal>
  );
}
