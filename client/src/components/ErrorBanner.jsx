import React from 'react';
import { AlertCircle, KeyRound, RefreshCw, Sparkles } from 'lucide-react';

export default function ErrorBanner({ error, onRetry, onSwitchToDemo, onOpenApiKeyModal }) {
  if (!error) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 shadow-2xs text-rose-900">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                API Connection Status
              </h4>
              {error.code && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-200/70 text-rose-800 font-bold">
                  {error.code}
                </span>
              )}
            </div>

            <p className="text-xs text-rose-800 font-medium leading-relaxed">
              {error.message || 'An error occurred while connecting to the API.'}
            </p>

            {error.guidance && (
              <p className="text-xs text-rose-700 bg-white/80 p-2 rounded-lg border border-rose-200/60">
                💡 {error.guidance}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {onOpenApiKeyModal && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Connect API
                </button>
              )}

              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              )}

              {onSwitchToDemo && (
                <button
                  type="button"
                  onClick={onSwitchToDemo}
                  className="px-3 py-1.5 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Switch to Offline Leads
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
