import React from 'react';

export default function SkeletonLoader({ rows = 6 }) {
  return (
    <div className="w-full bg-white border-t border-slate-200 animate-pulse">
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-b-0">
            <div className="w-4 h-4 bg-slate-200 rounded"></div>
            <div className="w-48 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
            <div className="w-28 h-6 bg-slate-100 rounded"></div>
            <div className="w-44 h-4 bg-slate-200 rounded"></div>
            <div className="w-20 h-6 bg-slate-100 rounded-full"></div>
            <div className="w-32 space-y-1">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
            <div className="flex-1 h-12 bg-slate-100 rounded-lg"></div>
            <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
            <div className="w-24 h-7 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
