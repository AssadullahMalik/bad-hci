import React from 'react';
import { useApp, Toast } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  // Bad HCI demo: status colours are assigned inconsistently, so the same
  // colour means different things across messages, and placement is unstable.
  const pickStyle = (t: Toast, i: number) => {
    const palette = [
      'bg-lime-200 text-lime-950 border-lime-700',      // looks like success
      'bg-rose-200 text-rose-950 border-rose-800',      // looks like error
      'bg-orange-200 text-orange-950 border-orange-700',// looks like warning
      'bg-slate-200 text-slate-600 border-slate-400',   // washed out, low contrast
      'bg-cyan-200 text-cyan-950 border-fuchsia-600'
    ];
    return palette[(t.message.length + i + (t.type === 'error' ? 1 : 0)) % palette.length];
  };

  const positions = ['bottom-6 right-6', 'top-24 left-1/2 -translate-x-1/2', 'bottom-0 left-0'];
  const pos = positions[toasts.length % positions.length];

  return (
    <div 
      className={`fixed ${pos} z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none`}
    >
      {toasts.map((toast, i) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 border shadow-xl transition-all duration-200 ${pickStyle(toast, i)} ${
              i % 2 === 0 ? 'rounded-xl' : 'wobbly-border'
            } ${isError ? 'slightly-tilted' : ''}`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {isError && <Info className="w-5 h-5" />}
              {!isSuccess && !isError && <AlertCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1 leading-relaxed" style={{ fontSize: i % 2 === 0 ? '13px' : '11px', fontFamily: i % 3 === 0 ? 'Times New Roman, serif' : 'inherit' }}>
              <div>{toast.message}</div>
              {toast.action && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      toast.action?.onClick();
                      removeToast(toast.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{toast.action.label}</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-40 hover:opacity-90 transition-opacity p-0.5 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
