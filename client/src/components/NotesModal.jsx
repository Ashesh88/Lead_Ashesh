import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Check, Clock, User, Phone, MapPin } from 'lucide-react';

export default function NotesModal({ lead, isOpen, onClose, onSaveNotes, showToast }) {
  if (!isOpen || !lead) return null;

  const [notesText, setNotesText] = useState(lead.notes || '');

  useEffect(() => {
    setNotesText(lead.notes || '');
  }, [lead]);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveNotes(lead.id, notesText);
    if (showToast) showToast(`Notes saved for ${lead.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">
                Call Log & Lead Notes
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                {lead.name} • {lead.area || 'Delhi'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          {/* Quick Lead Meta Info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Phone / WhatsApp</span>
              <span className="font-semibold text-slate-800 font-mono">{lead.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Pipeline Status</span>
              <span className="font-semibold text-indigo-700">{lead.status || 'New'}</span>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Interaction Notes / Deal Details
            </label>
            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="E.g., Owner requested call on Thursday at 3 PM. Quoted ₹18,000 for 1-page catalog. Sent portfolio sample via WhatsApp."
              className="w-full text-xs font-sans text-slate-800 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 leading-relaxed transition-all"
              autoFocus
            />
            <p className="text-[11px] text-slate-400">
              Notes automatically persist in localStorage and export in your Excel sheets.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Notes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
