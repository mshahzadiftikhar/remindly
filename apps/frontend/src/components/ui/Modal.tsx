import { ReactNode, useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="animate-overlay-in absolute inset-0 bg-charcoal/50 backdrop-blur-[3px]"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="animate-modal-in relative mx-0 sm:mx-4 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl shadow-charcoal/15 border border-charcoal/8 overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-charcoal/15" />
        </div>

        <div className="px-6 pt-4 sm:pt-6 pb-6">
          <h3 className="text-[17px] font-semibold text-charcoal mb-2">{title}</h3>
          <div className="mb-6 text-sm text-charcoal/55 leading-relaxed">{children}</div>
          <div className="flex justify-end gap-2.5">
            <Button variant="outline" size="md" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              variant={danger ? 'danger' : 'primary'}
              size="md"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
