import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SafetyWarningBanner from './components/SafetyWarningBanner';
import StatsBar from './components/StatsBar';
import TemplateSettings from './components/TemplateSettings';
import ExportToolbar from './components/ExportToolbar';
import ResultsTable from './components/ResultsTable';
import KanbanBoard from './components/KanbanBoard';
import DemoMockupModal from './components/DemoMockupModal';
import NotesModal from './components/NotesModal';
import SkeletonLoader from './components/SkeletonLoader';
import EmptyState from './components/EmptyState';
import ErrorBanner from './components/ErrorBanner';
import Toast from './components/Toast';
import ApiKeyModal from './components/ApiKeyModal';

import {
  DEFAULT_TEMPLATE,
  DEFAULT_EMAIL_SUBJECT,
  TEMPLATE_PRESETS
} from './constants/templates';

import { renderTemplate } from './utils/templateRenderer';
import { calculateOpportunityScore } from './utils/leadScorer';

import {
  getDailySafetyCount,
  incrementDailySafetyCount,
  getSearchHistory,
  addSearchHistory,
  getLeadOverrides,
  saveLeadOverride,
  getStoredTemplateConfig,
  saveStoredTemplateConfig,
  exportToCSV
} from './utils/storage';

export default function App() {
  // Query & Loading state
  const [query, setQuery] = useState('furniture shop in Karol Bagh Delhi');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [leads, setLeads] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const saved = localStorage.getItem('fluxilin_mode_demo');
    return saved !== null ? saved === 'true' : false;
  });
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Search History
  const [searchHistory, setSearchHistory] = useState([]);

  // Safety Counter
  const [dailyCount, setDailyCount] = useState(0);

  // Template Settings
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [selectedPresetId, setSelectedPresetId] = useState('agency_inquiry_leak');

  // Table Filters & Selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'mobile' | 'landline'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Sorting
  const [sortField, setSortField] = useState('rating');
  const [sortAsc, setSortAsc] = useState(false);

  // View Mode: 'table' | 'kanban'
  const [viewMode, setViewMode] = useState('table');

  // Interactive Modals State
  const [mockupModalLead, setMockupModalLead] = useState(null);
  const [notesModalLead, setNotesModalLead] = useState(null);

  // Export & Notification
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleToggleMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      localStorage.setItem('fluxilin_mode_demo', String(next));
      showToast(next ? 'Switched to Demo Mode (Safe - 0 Credits)' : 'Switched to Live API Mode');
      return next;
    });
  };

  // 1. Initial Load from LocalStorage & Health Check (Zero auto-calls on refresh to save credits!)
  useEffect(() => {
    // Load daily counter
    setDailyCount(getDailySafetyCount());

    // Load search history
    setSearchHistory(getSearchHistory());

    // Load template settings
    const storedConfig = getStoredTemplateConfig();
    if (storedConfig && storedConfig.template) {
      // If it has any old cringe template, reset to clean agency default
      if (storedConfig.template.includes('Bhaiya namaste') || storedConfig.template.includes('Namaste Sir, main Rohit')) {
        setTemplate(DEFAULT_TEMPLATE);
        setSelectedPresetId('agency_inquiry_leak');
      } else {
        setTemplate(storedConfig.template);
        if (storedConfig.emailSubject) setEmailSubject(storedConfig.emailSubject);
        if (storedConfig.selectedPresetId) setSelectedPresetId(storedConfig.selectedPresetId);
      }
    }

    // Check backend health only (does NOT spend any tokens)
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHasApiKey(data.hasApiKey);
      })
      .catch(err => {
        console.warn('Backend health check failed:', err);
      });
  }, []);

  // Save template settings on change
  useEffect(() => {
    saveStoredTemplateConfig({
      template,
      emailSubject,
      selectedPresetId
    });
  }, [template, emailSubject, selectedPresetId]);

  // 2. Perform Search
  const handleSearch = async (searchQuery, isLoadMore = false, overrideDemo = undefined) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    const useDemo = overrideDemo !== undefined ? overrideDemo : isDemoMode;

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          pageToken: isLoadMore ? nextPageToken : undefined,
          forceDemo: useDemo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed', { cause: data });
      }

      // Read stored lead overrides (status, edited email, custom messages)
      const overrides = getLeadOverrides();

      // Process raw leads with current outreach template & restore overrides
      const newLeads = (data.leads || []).map(lead => {
        const saved = overrides[lead.id] || {};
        const generatedMsg = renderTemplate(template, lead);

        return {
          ...lead,
          email: saved.email !== undefined ? saved.email : lead.email,
          status: saved.status || lead.status || 'New',
          contactedAt: saved.contactedAt || null,
          notes: saved.notes || lead.notes || '',
          message: saved.customMessage !== undefined ? saved.customMessage : generatedMsg
        };
      });

      if (isLoadMore) {
        setLeads(prev => {
          // Merge avoiding duplicates
          const existingIds = new Set(prev.map(l => l.id));
          const uniqueNew = newLeads.filter(l => !existingIds.has(l.id));
          return [...prev, ...uniqueNew];
        });
        showToast(`Loaded ${newLeads.length} more leads!`);
      } else {
        setLeads(newLeads);
        setSelectedIds(new Set());
        // Update history
        const updatedHistory = addSearchHistory(q);
        if (updatedHistory) setSearchHistory(updatedHistory);
      }

      setNextPageToken(data.nextPageToken || null);
      if (data.stats) {
        setStats(data.stats);
      }

      if (data.isDemo) {
        setIsDemoMode(true);
      }

      if (data.notice && !isLoadMore) {
        showToast(data.notice);
      }

    } catch (err) {
      console.error('Search error:', err);
      const cause = err.cause || {};
      setError({
        message: err.message,
        code: cause.code,
        guidance: cause.guidance
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // 3. Lead Inline Changes (Status, Email, Custom Message)
  const handleLeadChange = (leadId, patch) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updated = { ...lead, ...patch };
        return updated;
      }
      return lead;
    }));

    // Persist to localStorage
    const savedPatch = {};
    if (patch.status !== undefined) savedPatch.status = patch.status;
    if (patch.email !== undefined) savedPatch.email = patch.email;
    if (patch.message !== undefined) savedPatch.customMessage = patch.message;
    if (patch.contactedAt !== undefined) savedPatch.contactedAt = patch.contactedAt;
    if (patch.notes !== undefined) savedPatch.notes = patch.notes;

    saveLeadOverride(leadId, savedPatch);
  };

  // 4. WhatsApp Click Handler
  const handleWhatsAppClick = (lead, waUrl) => {
    // Open in new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Auto-set status to 'Contacted' with timestamp
    const now = new Date().toISOString();
    handleLeadChange(lead.id, {
      status: 'Contacted',
      contactedAt: now
    });

    // Increment daily safety counter
    const updatedCount = incrementDailySafetyCount();
    setDailyCount(updatedCount);

    showToast(`WhatsApp chat opened! Status marked as Contacted for ${lead.name}`);
  };

  // 5. Email Click Handler
  const handleEmailClick = (lead, mailtoUrl) => {
    window.location.href = mailtoUrl;

    const now = new Date().toISOString();
    handleLeadChange(lead.id, {
      status: 'Contacted',
      contactedAt: now
    });

    showToast(`Email client opened for ${lead.name}`);
  };

  // 6. Regenerate All Messages
  const handleRegenerateAll = () => {
    setLeads(prev => prev.map(lead => {
      const newMsg = renderTemplate(template, lead);
      // Update override
      saveLeadOverride(lead.id, { customMessage: newMsg });
      return {
        ...lead,
        message: newMsg
      };
    }));
    showToast('Regenerated outreach messages for all leads using current template!');
  };

  // 7. Selection Toggles
  const handleToggleSelect = (leadId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedLeads.map(l => l.id)));
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedIds.size === 0) return;
    const now = new Date().toISOString();
    setLeads(prev => prev.map(lead => {
      if (selectedIds.has(lead.id)) {
        const patch = {
          status: newStatus,
          ...(newStatus === 'Contacted' ? { contactedAt: now } : {})
        };
        saveLeadOverride(lead.id, patch);
        return { ...lead, ...patch };
      }
      return lead;
    }));
    showToast(`Updated status to "${newStatus}" for ${selectedIds.size} leads!`);
  };

  // 8. Excel Export via Backend ExcelJS
  const handleExportExcel = async () => {
    const leadsToExport = selectedIds.size > 0
      ? leads.filter(l => selectedIds.has(l.id))
      : leads;

    if (leadsToExport.length === 0) {
      showToast('No leads available to export');
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads: leadsToExport,
          emailSubject
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate Excel export file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fluxilin_Leads_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast(`Exported ${leadsToExport.length} leads to Excel (.xlsx) successfully!`);
    } catch (err) {
      console.error('Export error:', err);
      showToast(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // 9. Client-side CSV Export
  const handleExportCSV = () => {
    const leadsToExport = selectedIds.size > 0
      ? leads.filter(l => selectedIds.has(l.id))
      : leads;

    if (leadsToExport.length === 0) {
      showToast('No leads available to export');
      return;
    }

    exportToCSV(leadsToExport, emailSubject);
    showToast(`Exported ${leadsToExport.length} leads to CSV successfully!`);
  };

  // 10. Filter & Sort Calculation
  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter(lead => {
        // Tab filter
        if (filterTab === 'mobile' && !lead.isMobile) return false;
        if (filterTab === 'landline' && lead.isMobile) return false;
        if (filterTab === 'hot') {
          const scoreData = calculateOpportunityScore(lead);
          if (scoreData.tier !== 'hot') return false;
        }

        // Status filter
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

        // Keyword filter
        if (searchFilter.trim()) {
          const term = searchFilter.toLowerCase();
          const matchName = (lead.name || '').toLowerCase().includes(term);
          const matchCat = (lead.category || '').toLowerCase().includes(term);
          const matchPhone = (lead.phone || '').toLowerCase().includes(term);
          const matchAddr = (lead.address || '').toLowerCase().includes(term);
          if (!matchName && !matchCat && !matchPhone && !matchAddr) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [leads, filterTab, statusFilter, searchFilter, sortField, sortAsc]);

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'category');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      
      {/* 1. Top Header */}
      <Header
        dailyCount={dailyCount}
        isDemoMode={isDemoMode}
        onToggleMode={handleToggleMode}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* 2. Safety Limit Warning Banner if >= 30 */}
      <SafetyWarningBanner dailyCount={dailyCount} />

      {/* 3. Search Bar with History & Quick queries */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={(q) => handleSearch(q, false)}
        onLoadMore={() => handleSearch(query, true)}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasNextPage={Boolean(nextPageToken)}
        searchHistory={searchHistory}
        onSelectHistory={(item) => {
          setQuery(item);
          handleSearch(item, false);
        }}
      />

      {/* 4. API Error Banner if any */}
      {error && (
        <ErrorBanner
          error={error}
          onRetry={() => handleSearch(query, false)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          onSwitchToDemo={() => {
            setIsDemoMode(true);
            localStorage.setItem('fluxilin_mode_demo', 'true');
            setError(null);
            handleSearch(query, false, true);
          }}
        />
      )}

      {/* 5. Stats Cards */}
      {stats && <StatsBar stats={stats} />}

      {/* 6. Template Personalization Settings Panel */}
      <TemplateSettings
        template={template}
        setTemplate={setTemplate}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        selectedPresetId={selectedPresetId}
        setSelectedPresetId={setSelectedPresetId}
        onRegenerateAll={handleRegenerateAll}
        sampleLead={leads[0]}
        showToast={showToast}
      />

      {/* 7. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Table Toolbar (Filters, selection, CSV/Excel export, Table/Kanban toggle) */}
          <ExportToolbar
            leadsCount={leads.length}
            selectedCount={selectedIds.size}
            allSelected={filteredAndSortedLeads.length > 0 && selectedIds.size === filteredAndSortedLeads.length}
            onToggleSelectAll={handleToggleSelectAll}
            onExportExcel={handleExportExcel}
            onExportCSV={handleExportCSV}
            isExporting={isExporting}
            filterTab={filterTab}
            setFilterTab={setFilterTab}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Table / Kanban / Skeletons / Empty states */}
          {isLoading ? (
            <SkeletonLoader rows={8} />
          ) : leads.length === 0 ? (
            <EmptyState
              onSelectQuery={(q) => {
                setQuery(q);
                handleSearch(q, false);
              }}
              isFilteredEmpty={false}
            />
          ) : filteredAndSortedLeads.length === 0 ? (
            <EmptyState
              onSelectQuery={() => {}}
              isFilteredEmpty={true}
            />
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              leads={filteredAndSortedLeads}
              onLeadChange={handleLeadChange}
              onOpenMockup={(lead) => setMockupModalLead(lead)}
              onOpenNotes={(lead) => setNotesModalLead(lead)}
              onWhatsAppClick={handleWhatsAppClick}
              emailSubject={emailSubject}
            />
          ) : (
            <ResultsTable
              leads={filteredAndSortedLeads}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onLeadChange={handleLeadChange}
              onWhatsAppClick={handleWhatsAppClick}
              onEmailClick={handleEmailClick}
              emailSubject={emailSubject}
              sortField={sortField}
              sortAsc={sortAsc}
              onSortChange={handleSortChange}
              showToast={showToast}
              onOpenMockup={(lead) => setMockupModalLead(lead)}
              onOpenNotes={(lead) => setNotesModalLead(lead)}
            />
          )}

          {/* Footer inside table card with count and Load More shortcut */}
          {leads.length > 0 && (
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <span className="font-bold text-slate-800">{filteredAndSortedLeads.length}</span> of <span className="font-bold text-slate-800">{leads.length}</span> verified leads without website.
              </div>
              {nextPageToken && (
                <button
                  type="button"
                  onClick={() => handleSearch(query, true)}
                  disabled={isLoadingMore}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5"
                >
                  {isLoadingMore ? 'Loading next 20...' : 'Load 20 More Results ↵'}
                </button>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* API Key Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(newKey) => {
          setHasApiKey(true);
          setIsDemoMode(false);
          setError(null);
          showToast('API connected successfully!');
          handleSearch(query, false);
        }}
      />

      {/* Interactive Live Demo Storefront Mockup Modal */}
      <DemoMockupModal
        lead={mockupModalLead}
        isOpen={Boolean(mockupModalLead)}
        onClose={() => setMockupModalLead(null)}
        showToast={showToast}
      />

      {/* Lead Interaction Notes & Call Log Modal */}
      <NotesModal
        lead={notesModalLead}
        isOpen={Boolean(notesModalLead)}
        onClose={() => setNotesModalLead(null)}
        onSaveNotes={(leadId, notes) => handleLeadChange(leadId, { notes })}
        showToast={showToast}
      />

    </div>
  );
}
