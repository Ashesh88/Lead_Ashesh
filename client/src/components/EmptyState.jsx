import React from 'react';
import { Building2, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { SAMPLE_QUERIES } from '../constants/templates';

export default function EmptyState({ onSelectQuery, isFilteredEmpty }) {
  if (isFilteredEmpty) {
    return (
      <div className="py-14 text-center max-w-md mx-auto px-4">
        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
          <Filter className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-slate-800">No prospects match the active filter</h3>
        <p className="text-[11px] text-slate-400 mt-1">
          Adjust the status filter or reset search to view your full batch.
        </p>
      </div>
    );
  }

  return (
    <div className="py-14 text-center max-w-xl mx-auto px-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
        <Building2 className="w-5 h-5" />
      </div>
      
      <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
        Target Local Businesses Without Online Presence
      </h3>
      
      <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-md mx-auto">
        Search any category and location to identify high-rated shops without websites, ready for direct WhatsApp and phone outreach.
      </p>

      {/* Suggested Search Prompts */}
      <div className="mt-5 pt-4 border-t border-slate-200/80">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
          Sample Queries
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {SAMPLE_QUERIES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuery(sample)}
              className="p-2.5 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs text-slate-700 font-medium transition-all flex items-center justify-between group shadow-xs"
            >
              <span className="truncate">{sample}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
