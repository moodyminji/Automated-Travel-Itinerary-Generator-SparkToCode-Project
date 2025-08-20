// Modal.tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* soft overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* PANEL — force light cream, no dark overrides */}
      <div
        className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto
                   rounded-xl shadow-xl
                   bg-[#FFF7E6] text-slate-900    /* <- cream panel like the landing */
                   p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-2 hover:bg-black/5"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold mb-6">{title}</h2>

        {/* pretty typography */}
        <div className="prose prose-neutral max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
