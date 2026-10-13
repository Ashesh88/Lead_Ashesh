import React from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  FileText,
  Star,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { calculateOpportunityScore } from '../utils/leadScorer';

const PIPELINE_COLUMNS = [
  { id: 'New', label: 'New Prospects', color: 'border-t-slate-400 bg-slate-50/50' },
  { id: 'Contacted', label: 'Contacted', color: 'border-t-indigo-500 bg-indigo-50/30' },
  { id: 'Replied', label: 'In Discussion', color: 'border-t-purple-500 bg-purple-50/30' },
  { id: 'Interested', label: 'High Intent / Quote', color: 'border-t-emerald-500 bg-emerald-50/30' },
  { id: 'Not Interested', label: 'Closed / Archive', color: 'border-t-slate-300 bg-slate-50/20' }
];

export default function KanbanBoard({
  leads,
  onLeadChange,
  onOpenMockup,
  onOpenNotes,
  onWhatsAppClick,
  emailSubject
}) {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-2">
      <div className="flex gap-4 min-w-[1250px] px-4 sm:px-6 max-w-7xl mx-auto">
        {PIPELINE_COLUMNS.map((col) => {
          const colLeads = leads.filter(l => (l.status || 'New') === col.id);

          return (
            <div
              key={col.id}
              className={`flex-1 min-w-[240px] bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 border-t-4 ${col.color} flex flex-col max-h-[750px] shadow-xs`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-slate-800">
                    {col.label}
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs">
                    {colLeads.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400 font-medium">
                    No leads in this stage
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const scoreData = calculateOpportunityScore(lead);
                    const waUrl = lead.isMobile && lead.waNumber
                      ? `https://wa.me/${lead.waNumber}?text=${encodeURIComponent(lead.message || '')}`
                      : null;

                    return (
                      <div
                        key={lead.id}
                        className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all space-y-2 text-left"
                      >
                        {/* Top: Score Badge & Review */}
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ${scoreData.color}`}>
                            {scoreData.score} PTS • {scoreData.tier.toUpperCase()}
                          </span>
                          {lead.rating > 0 && (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{lead.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Category */}
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {lead.category || 'Store'} • <span className="text-slate-400">{lead.area || 'Delhi'}</span>
                          </p>
                        </div>

                        {/* Estimated Deal Size */}
                        <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-400">Deal Est:</span>
                          <span className="font-bold text-slate-800">{scoreData.estimatedValue}</span>
                        </div>

                        {/* Phone details */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-slate-700 font-medium">
                            {lead.phone || 'No phone'}
                          </span>
                          {lead.isMobile ? (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                              WhatsApp
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              Landline
                            </span>
                          )}
                        </div>

                        {/* Notes Preview if available */}
                        {lead.notes && (
                          <div className="text-[10px] text-slate-600 bg-amber-50/60 border border-amber-200/50 p-1.5 rounded-lg italic line-clamp-2">
                            "{lead.notes}"
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1">
                          
                          {/* Live Mockup Generator */}
                          <button
                            type="button"
                            onClick={() => onOpenMockup(lead)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors"
                            title="Generate instant store website preview"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Demo</span>
                          </button>

                          {/* Notes */}
                          <button
                            type="button"
                            onClick={() => onOpenNotes(lead)}
                            className={`p-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors ${
                              lead.notes ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                            title="Add / view notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{lead.notes ? 'Notes' : '+Note'}</span>
                          </button>

                          {/* WhatsApp Direct Send */}
                          {lead.isMobile && waUrl && (
                            <button
                              type="button"
                              onClick={() => onWhatsAppClick(lead, waUrl)}
                              className="px-2 py-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors ml-auto"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Send</span>
                            </button>
                          )}

                        </div>

                        {/* Stage Dropdown */}
                        <div className="pt-1">
                          <select
                            value={lead.status || 'New'}
                            onChange={(e) => onLeadChange(lead.id, { status: e.target.value })}
                            className="w-full text-[10px] font-medium bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700 focus:outline-none"
                          >
                            <option value="New">Stage: New</option>
                            <option value="Contacted">Stage: Contacted</option>
                            <option value="Replied">Stage: In Discussion</option>
                            <option value="Interested">Stage: High Intent</option>
                            <option value="Not Interested">Stage: Closed / Archive</option>
                          </select>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
