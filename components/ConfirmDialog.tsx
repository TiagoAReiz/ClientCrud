'use client';

import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  clientName?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  clientName,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Scrim */}
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-[10px]" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-surface-container-lowest w-full max-w-sm rounded-[1.5rem] shadow-[0px_12px_32px_rgba(5,26,62,0.15)] overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
          </div>

          <h3 className="text-xl font-bold text-on-surface mb-3 tracking-tight">Excluir Cliente?</h3>

          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            Tem certeza que deseja excluir o cliente{' '}
            {clientName && <span className="font-bold text-on-surface">{clientName}</span>}? Esta ação não pode ser
            desfeita.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full bg-error text-on-error py-4 px-6 rounded-xl font-bold tracking-wide active:scale-95 transition-transform shadow-lg shadow-error/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Excluir
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-primary-fixed text-primary py-4 px-6 rounded-xl font-bold tracking-wide active:scale-95 transition-transform disabled:opacity-60"
            >
              Manter
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
