import React from 'react';
import { ShieldAlert, KeyRound, Radio, Zap, Layers } from 'lucide-react';

export default function Header({
  dailyCount,
  isDemoMode,
  onToggleMode,
  hasApiKey,
  onOpenApiKeyModal
}) {
  const isLimitReached = dailyCount >= 30;

  return (
    <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-extrabold text-sm tracking-tight border border-indigo-400/30">
              Fx
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-1.5">
                Fluxilin Studio
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                Outreach Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              High-intent local prospects without website
            </p>
          </div>
        </div>

        {/* Right: Controls & Metrics */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
          
          {/* Mode Switch Pill */}
          <button
            onClick={onToggleMode}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-2 ${
              isDemoMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title="Switch data stream (Sandbox 0-credits vs Live Network)"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className="font-mono text-[11px]">{isDemoMode ? 'Sandbox (0 Cost)' : 'Live Pipeline'}</span>
          </button>

          {/* API Connection Indicator */}
          <button
            onClick={onOpenApiKeyModal}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all flex items-center gap-1.5 ${
              hasApiKey
                ? 'bg-slate-900 text-slate-300 border-slate-700/80 hover:border-slate-600 hover:text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/40 shadow-sm shadow-indigo-600/30'
            }`}
            title="Configure data stream credentials"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium">{hasApiKey ? 'Keys Configured' : 'Connect Key'}</span>
          </button>

          {/* Daily WhatsApp Dispatch Meter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center gap-2.5">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center justify-end gap-1">
                {isLimitReached ? (
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
                Dispatched
              </div>
              <div className="text-[11px] font-bold font-mono flex items-center justify-end gap-0.5">
                <span className={isLimitReached ? 'text-rose-400' : dailyCount > 20 ? 'text-amber-400' : 'text-slate-200'}>
                  {dailyCount}
                </span>
                <span className="text-slate-500 font-normal">/30</span>
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isLimitReached
                    ? 'bg-rose-500'
                    : dailyCount > 20
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.min(100, (dailyCount / 30) * 100)}%` }}
              ></div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
