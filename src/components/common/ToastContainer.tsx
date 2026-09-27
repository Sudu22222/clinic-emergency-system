import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHealth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-md w-full px-4">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        let borderColor = 'border-blue-500/30';
        let bgGradient = 'from-slate-900 to-slate-950';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderColor = 'border-emerald-500/40';
          bgGradient = 'from-emerald-950/90 to-slate-900';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />;
          borderColor = 'border-rose-500/50';
          bgGradient = 'from-rose-950/90 to-slate-900';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderColor = 'border-amber-500/40';
          bgGradient = 'from-amber-950/90 to-slate-900';
        }

        return (
          <div
            key={toast.id}
            className={`bg-gradient-to-r ${bgGradient} border ${borderColor} text-white p-4 rounded-xl shadow-2xl backdrop-blur-xl flex items-start justify-between space-x-3 transition-all transform translate-y-0`}
          >
            <div className="flex items-start space-x-3">
              {icon}
              <div>
                <h4 className="font-semibold text-sm text-slate-100">{toast.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
