import React from 'react';
import { Target, Globe2, Smartphone, Phone, Sparkles } from 'lucide-react';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const {
    totalFound = 0,
    filteredWithWebsite = 0,
    leadsWithoutWebsite = 0,
    mobileCount = 0,
    landlineCount = 0
  } = stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
        
        {/* Total found */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Discovered</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{totalFound}</div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center shrink-0">
            <Globe2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Filtered out with website */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Has Site (Omitted)</div>
            <div className="text-lg font-bold font-mono text-slate-400 mt-0.5">{filteredWithWebsite}</div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center shrink-0" title="Excluded from pipeline">
            <span className="text-[11px] font-bold">✕</span>
          </div>
        </div>

        {/* Verified Leads (No Website) */}
        <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
          <div>
            <div className="text-[10px] font-semibold text-indigo-900 uppercase tracking-wider">Qualified Prospects</div>
            <div className="text-lg font-bold font-mono text-indigo-700 mt-0.5">{leadsWithoutWebsite}</div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* WhatsApp Ready (Mobile) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">WhatsApp Ready</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{mobileCount}</div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Call Only (Landline) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Phone / Landline</div>
            <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{landlineCount}</div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </div>
  );
}
