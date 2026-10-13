import React, { useState } from 'react';
import { Sliders, RefreshCw, Eye, ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { TEMPLATE_PRESETS } from '../constants/templates';
import { renderTemplate, renderEmailSubject } from '../utils/templateRenderer';

export default function TemplateSettings({
  template,
  setTemplate,
  emailSubject,
  setEmailSubject,
  selectedPresetId,
  setSelectedPresetId,
  onRegenerateAll,
  sampleLead,
  showToast
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  const demoPreviewLead = sampleLead || {
    name: 'Sharma Furniture House',
    category: 'Furniture Store',
    area: 'Karol Bagh Delhi',
    rating: 4.8
  };

  const previewMessage = renderTemplate(template, demoPreviewLead);
  const previewEmailSubject = renderEmailSubject(emailSubject, demoPreviewLead);

  const handlePresetChange = (presetId) => {
    setSelectedPresetId(presetId);
    const found = TEMPLATE_PRESETS.find(p => p.id === presetId);
    if (found) {
      setTemplate(found.template);
    }
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopiedPreview(true);
    if (showToast) showToast('Sample pitch copied to clipboard');
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        
        {/* Accordion Toggle Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2.5 bg-slate-50/70 hover:bg-slate-100/70 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-900">
                Outreach Template Studio
              </span>
              <span className="ml-2 text-xs text-slate-400 hidden md:inline font-mono">
                Tokens: &#123;name&#125;, &#123;category&#125;, &#123;area&#125;, &#123;rating&#125;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              {isOpen ? 'Minimize' : 'Configure Pitch'}
            </span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Studio Panel */}
        {isOpen && (
          <div className="p-4 sm:p-5 border-t border-slate-200/80 space-y-4 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Preset tabs & Editor */}
              <div className="lg:col-span-7 space-y-3.5">
                
                {/* Follow-up Sequence Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Follow-up Sequence Stage
                    </label>
                    <span className="text-[10px] text-indigo-600 font-medium">3-Step Outreach Funnel</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-indigo-50/60 p-1 rounded-xl border border-indigo-100/70 mb-3">
                    <button
                      type="button"
                      onClick={() => handlePresetChange('agency_inquiry_leak')}
                      className={`text-xs font-semibold py-1.5 px-2 rounded-lg transition-all text-center ${
                        selectedPresetId === 'agency_inquiry_leak'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-indigo-900/70 hover:text-indigo-950'
                      }`}
                    >
                      Step 1: First Pitch (Day 1)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPresetId('followup_day3');
                        setTemplate('Hi team {name}, Rohit from Fluxilin following up on my previous note.\n\nJust wanted to check if you had 2 minutes to review the concept prototype for {name}? Local search traffic in {area} is high this month, and having a 1-tap WhatsApp catalog live would convert those direct visits into instant inquiries.\n\nHappy to share a quick 30-sec demo screen recording if that\'s easier to review on WhatsApp?');
                      }}
                      className={`text-xs font-semibold py-1.5 px-2 rounded-lg transition-all text-center ${
                        selectedPresetId === 'followup_day3'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-indigo-900/70 hover:text-indigo-950'
                      }`}
                    >
                      Step 2: Follow-up (Day 3)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPresetId('followup_day7');
                        setTemplate('Hi {name} team, Rohit from Fluxilin once more.\n\nAssuming you might be busy right now with store operations, so I won\'t follow up again. If you decide to link a modern mobile catalog or website to your Google profile later this quarter, feel free to reach out anytime. Wish {name} continued success!');
                      }}
                      className={`text-xs font-semibold py-1.5 px-2 rounded-lg transition-all text-center ${
                        selectedPresetId === 'followup_day7'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-indigo-900/70 hover:text-indigo-950'
                      }`}
                    >
                      Step 3: Closing Note (Day 7)
                    </button>
                  </div>
                </div>

                {/* Segmented Preset Selector */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Alternative Tone Presets
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                    {TEMPLATE_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handlePresetChange(preset.id)}
                        className={`text-xs font-medium py-1.5 px-2 rounded-lg transition-all text-center truncate ${
                          selectedPresetId === preset.id
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {preset.label.split(' ')[0]} {preset.label.split(' ')[1] || ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variable Tokens */}
                <div className="flex items-center gap-1.5 flex-wrap text-xs">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dynamic tags:</span>
                  {['{name}', '{category}', '{area}', '{rating}'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTemplate(template + ' ' + tag)}
                      className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 px-2 py-0.5 rounded-md font-mono text-[11px] font-medium transition-colors"
                      title="Insert tag"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={template}
                    onChange={(e) => {
                      setTemplate(e.target.value);
                      setSelectedPresetId('custom');
                    }}
                    className="w-full text-xs font-sans text-slate-800 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 leading-relaxed transition-all"
                  />
                </div>

                {/* Email Subject Line */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full text-xs font-sans text-slate-800 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                {/* Bottom Action */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Edits dynamically format messages for all prospects in the table.
                  </span>
                  <button
                    type="button"
                    onClick={onRegenerateAll}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Apply to Table
                  </button>
                </div>

              </div>

              {/* Right Column: Live Message Preview */}
              <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-indigo-500" /> WhatsApp Preview
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPreview}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                    >
                      {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedPreview ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="text-[11px] bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-slate-600 flex items-center justify-between shadow-2xs">
                    <span className="font-semibold text-slate-800">{demoPreviewLead.name}</span>
                    <span className="text-amber-600 font-semibold">{demoPreviewLead.rating}★</span>
                  </div>

                  {/* Clean WhatsApp card */}
                  <div className="bg-[#E7FCE8] border border-[#d0f3d3] rounded-xl p-3.5 text-xs text-slate-800 whitespace-pre-line shadow-2xs leading-relaxed font-sans">
                    {previewMessage}
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">Subject: </span>
                    <span className="text-slate-600">{previewEmailSubject}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Row-level messages can also be tailored individually in the table below.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
