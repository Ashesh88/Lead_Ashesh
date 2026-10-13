import React from 'react';
import { AlertTriangle, ShieldX } from 'lucide-react';

export default function SafetyWarningBanner({ dailyCount }) {
  if (dailyCount < 30) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-amber-100 text-amber-700 rounded-md shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-amber-950">
              Daily WhatsApp Safety Threshold Reached ({dailyCount}/30):
            </span>{' '}
            <span className="text-amber-800">
              To keep your sender number healthy and avoid WhatsApp spam rate limits, pause fresh WhatsApp outreach for today. Direct phone and email outreach remain unrestricted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
