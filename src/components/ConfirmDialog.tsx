import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="glass-card max-w-sm w-full p-6 animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/30">
            <AlertTriangle className="w-7 h-7 text-gold-400" />
          </div>
          <h3 className="text-lg font-display font-bold text-gold-100">{title}</h3>
          <p className="text-sm text-midnight-300 leading-relaxed">{message}</p>
          <div className="flex gap-3 w-full mt-2">
            <button className="btn-ghost flex-1" onClick={onCancel}>
              {cancelText}
            </button>
            <button className="btn-primary flex-1" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
