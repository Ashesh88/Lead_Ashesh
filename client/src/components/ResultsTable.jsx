import React, { useState } from 'react';
import {
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  Star,
  Copy,
  Check,
  ArrowUpDown,
  CheckSquare,
  Square,
  Sparkles,
  FileText,
  Flame
} from 'lucide-react';
import { renderEmailSubject } from '../utils/templateRenderer';
import { calculateOpportunityScore } from '../utils/leadScorer';

const STATUS_OPTIONS = ['New', 'Contacted', 'Replied', 'Interested', 'Not Interested'];

const STATUS_BADGE_STYLES = {
  New: 'bg-slate-50 text-slate-600 border-slate-200',
  Contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium',
  Replied: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
  Interested: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold',
  'Not Interested': 'bg-slate-100 text-slate-400 border-slate-200'
};

export default function ResultsTable({
  leads,
  selectedIds,
  onToggleSelect,
  onLeadChange,
  onWhatsAppClick,
  onEmailClick,
  emailSubject,
  sortField,
  sortAsc,
  onSortChange,
  showToast,
  onOpenMockup,
  onOpenNotes
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyMessage = (lead) => {
    navigator.clipboard.writeText(lead.message || '');
    setCopiedId(lead.id);
    if (showToast) showToast(`Pitch copied for ${lead.name}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-40 inline ml-1" />;
    }
    return (
      <span className="text-indigo-600 font-bold inline ml-1 font-mono">
        {sortAsc ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse min-w-[1150px]">
        
        {/* Table Header */}
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-[10px] font-semibold uppercase tracking-wider select-none border-b border-slate-200/80">
            
            <th className="py-3 px-3 w-10 text-center">
              <span className="sr-only">Select</span>
            </th>

            <th
              onClick={() => onSortChange('name')}
              className="py-3 px-3 cursor-pointer hover:text-slate-900 transition-colors w-48"
            >
              Business Name {renderSortIcon('name')}
            </th>

            <th className="py-3 px-3 w-28 text-center">
              Deal Score
            </th>

            <th
              onClick={() => onSortChange('category')}
              className="py-3 px-3 cursor-pointer hover:text-slate-900 transition-colors w-32"
            >
              Category {renderSortIcon('category')}
            </th>

            <th className="py-3 px-3 w-40">Location</th>

            <th
              onClick={() => onSortChange('rating')}
              className="py-3 px-2 cursor-pointer hover:text-slate-900 transition-colors w-24 text-center"
            >
              Rating {renderSortIcon('rating')}
            </th>

            <th className="py-3 px-3 w-36">Direct Phone</th>

            <th className="py-3 px-3 w-36">Email</th>

            <th className="py-3 px-3 w-60">Personalized Pitch</th>

            <th className="py-3 px-3 w-44 text-center">Actions & Dispatch</th>

            <th
              onClick={() => onSortChange('status')}
              className="py-3 px-3 cursor-pointer hover:text-slate-900 transition-colors w-28 text-center"
            >
              Pipeline {renderSortIcon('status')}
            </th>

          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 text-xs text-slate-800 font-normal">
          {leads.map((lead) => {
            const isSelected = selectedIds.has(lead.id);
            const waUrl = lead.isMobile && lead.waNumber
              ? `https://wa.me/${lead.waNumber}?text=${encodeURIComponent(lead.message || '')}`
              : null;

            const mailSubject = renderEmailSubject(emailSubject, lead);
            const mailtoUrl = lead.email && lead.email.trim()
              ? `mailto:${lead.email.trim()}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(lead.message || '')}`
              : null;

            return (
              <tr
                key={lead.id}
                className={`transition-colors hover:bg-slate-50/80 ${
                  isSelected ? 'bg-indigo-50/30' : lead.status === 'Contacted' ? 'bg-blue-50/15' : ''
                }`}
              >
                
                {/* 1. Selection Checkbox */}
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleSelect(lead.id)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 focus:outline-none"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </td>

                {/* 2. Business Name & Maps link */}
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 group">
                    <span className="truncate max-w-[160px]">{lead.name}</span>
                    {lead.googleMapsUri && (
                      <a
                        href={lead.googleMapsUri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 shrink-0"
                        title="Open in Maps"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono truncate max-w-[160px]">
                    {lead.area || 'Local Area'}
                  </div>
                </td>

                {/* Deal Score Cell */}
                <td className="py-3 px-3 text-center">
                  {(() => {
                    const scoreData = calculateOpportunityScore(lead);
                    return (
                      <div>
                        <span className={`inline-block font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${scoreData.color}`}>
                          {scoreData.score} PTS
                        </span>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5" title="Estimated Project Value">
                          {scoreData.estimatedValue}
                        </div>
                      </div>
                    );
                  })()}
                </td>

                {/* 3. Category */}
                <td className="py-3 px-3">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-[120px]">
                    {lead.category || 'Business'}
                  </span>
                </td>

                {/* 4. Address */}
                <td className="py-3 px-3">
                  <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed" title={lead.address}>
                    {lead.address || 'Address not listed'}
                  </p>
                </td>

                {/* 5. Rating & Reviews */}
                <td className="py-3 px-2 text-center">
                  {lead.rating > 0 ? (
                    <div>
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-amber-50/80 border border-amber-200/60 px-1.5 py-0.5 rounded-md text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{lead.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                        {lead.userRatingCount} reviews
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Unrated</span>
                  )}
                </td>

                {/* 6. Phone / Call link / Micro-Badge */}
                <td className="py-3 px-3">
                  {lead.phone ? (
                    <div>
                      <a
                        href={`tel:${lead.digits || lead.phone}`}
                        className="font-mono text-xs font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1"
                        title="Click to dial"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        {lead.phone}
                      </a>
                      <div className="mt-1">
                        {lead.isMobile ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            WhatsApp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            Landline
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">No phone</span>
                  )}
                </td>

                {/* 7. Inline Editable Email */}
                <td className="py-3 px-3">
                  <input
                    type="email"
                    value={lead.email || ''}
                    onChange={(e) => onLeadChange(lead.id, { email: e.target.value })}
                    placeholder="Add email..."
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-700 placeholder-slate-400 transition-all font-mono text-[11px]"
                  />
                </td>

                {/* 8. Editable Message & Copy */}
                <td className="py-3 px-3">
                  <div className="relative group">
                    <textarea
                      rows={2}
                      value={lead.message || ''}
                      onChange={(e) => onLeadChange(lead.id, { message: e.target.value })}
                      className="w-full text-[11px] p-2 pr-7 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg bg-slate-50/70 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-800 leading-normal resize-y transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(lead)}
                      className="absolute right-1.5 top-2 p-1 text-slate-400 hover:text-slate-700 bg-white/90 rounded-md hover:bg-slate-100 transition-colors shadow-2xs border border-slate-200/60"
                      title="Copy pitch"
                    >
                      {copiedId === lead.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* 9. Actions & Outreach */}
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    
                    {/* Live Store Mockup Generator */}
                    {onOpenMockup && (
                      <button
                        type="button"
                        onClick={() => onOpenMockup(lead)}
                        className="px-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
                        title="Generate instant store website preview"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Demo</span>
                      </button>
                    )}

                    {/* Notes Modal Button */}
                    {onOpenNotes && (
                      <button
                        type="button"
                        onClick={() => onOpenNotes(lead)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          lead.notes
                            ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                        title={lead.notes ? `View notes: "${lead.notes}"` : "Add lead interaction notes"}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* WhatsApp Action */}
                    {lead.isMobile && waUrl ? (
                      <button
                        type="button"
                        onClick={() => onWhatsAppClick(lead, waUrl)}
                        className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] active:scale-95 text-white font-medium rounded-lg text-xs flex items-center gap-1 shadow-xs transition-all"
                        title="Open WhatsApp with pre-filled pitch"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-2 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-[10px] font-medium cursor-not-allowed flex items-center gap-1"
                        title={lead.phone ? "Direct landline call only" : "No phone number available"}
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Call</span>
                      </button>
                    )}

                    {/* Email Action */}
                    <button
                      type="button"
                      disabled={!mailtoUrl}
                      onClick={() => onEmailClick(lead, mailtoUrl)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        mailtoUrl
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                          : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed opacity-40'
                      }`}
                      title={mailtoUrl ? "Send email inquiry" : "Add an email to enable"}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </td>

                {/* 10. Status Dropdown */}
                <td className="py-3 px-3 text-center">
                  <select
                    value={lead.status || 'New'}
                    onChange={(e) => onLeadChange(lead.id, { status: e.target.value })}
                    className={`text-[11px] px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold transition-colors ${
                      STATUS_BADGE_STYLES[lead.status] || STATUS_BADGE_STYLES.New
                    }`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status} className="bg-white text-slate-800">
                        {status}
                      </option>
                    ))}
                  </select>
                  {lead.contactedAt && (
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {new Date(lead.contactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
