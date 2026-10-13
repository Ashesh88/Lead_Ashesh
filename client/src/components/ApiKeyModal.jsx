import React, { useState } from 'react';
import { KeyRound, X, Check, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setErrorMsg('Please enter an API key');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/config/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save API key');
      }

      onKeySaved(keyInput.trim());
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/80 flex items-center justify-center border border-indigo-400/30">
              <KeyRound className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-slate-100">API Credentials</h3>
              <p className="text-[10px] text-slate-400 font-mono">Live Google Maps Data Stream</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5">
          
          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              API Key Token
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste key token..."
              className="w-full text-xs font-mono p-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-800"
              autoFocus
            />
            <p className="text-[10px] text-slate-400">
              Key is stored locally in <code>server/.env</code>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick instructions */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="font-medium text-slate-800 flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Supported Providers:
            </div>
            <ul className="space-y-0.5 text-[11px] text-slate-500">
              <li>• <strong>Serper Key:</strong> 2,500 free queries, instant live Google Maps results.</li>
              <li>• <strong>Places API Key:</strong> Official Google Cloud Places API key.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Dismiss
            </button>
            <button
              type="submit"
              disabled={isSaving || !keyInput.trim()}
              className="px-4 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300 text-white rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Key
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
