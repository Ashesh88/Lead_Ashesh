import React from 'react';
import { FileSpreadsheet, FileText, CheckSquare, Square, Search, LayoutGrid, Table, Flame } from 'lucide-react';

export default function ExportToolbar({
  leadsCount,
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onExportExcel,
  onExportCSV,
  isExporting,
  filterTab,
  setFilterTab,
  searchFilter,
  setSearchFilter,
  statusFilter,
  setStatusFilter,
  onBulkStatusUpdate,
  viewMode = 'table',
  setViewMode
}) {
  return (
    <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Left: View Mode Toggle & Segmented Filters & Search */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Table vs Kanban View Toggle */}
          {setViewMode && (
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Kanban CRM Pipeline View"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>
          )}

          {/* Segmented Filter Pills */}
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                filterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Leads
            </button>
            <button
              onClick={() => setFilterTab('hot')}
              className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                filterTab === 'hot'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'hover:text-rose-700'
              }`}
              title="Filter high rating & high review volume businesses"
            >
              <Flame className="w-3 h-3 text-amber-300" />
              Hot Leads
            </button>
            <button
              onClick={() => setFilterTab('mobile')}
              className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                filterTab === 'mobile'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'hover:text-emerald-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              WhatsApp
            </button>
            <button
              onClick={() => setFilterTab('landline')}
              className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                filterTab === 'landline'
                  ? 'bg-slate-800 text-white shadow-xs font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Call Only
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Pipeline: All</option>
            <option value="New">Pipeline: New</option>
            <option value="Contacted">Pipeline: Contacted</option>
            <option value="Replied">Pipeline: Replied</option>
            <option value="Interested">Pipeline: Interested</option>
            <option value="Not Interested">Pipeline: Not Interested</option>
          </select>

          {/* Instant filter input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name, phone..."
              className="text-xs pl-8 pr-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-40 sm:w-48 transition-all"
            />
          </div>

        </div>

        {/* Right: Selection & Export Actions */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          
          {/* Select All Toggle */}
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="text-xs px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>
              {selectedCount > 0 ? `${selectedCount} Selected` : 'Select All'}
            </span>
          </button>

          {/* Bulk status dropdown if items selected */}
          {selectedCount > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onBulkStatusUpdate(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none"
            >
              <option value="" disabled>Set Status ({selectedCount})...</option>
              <option value="New">Mark New</option>
              <option value="Contacted">Mark Contacted</option>
              <option value="Replied">Mark Replied</option>
              <option value="Interested">Mark Interested</option>
              <option value="Not Interested">Mark Closed</option>
            </select>
          )}

          {/* Export to CSV */}
          <button
            type="button"
            onClick={onExportCSV}
            disabled={leadsCount === 0}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-50 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            title="Download CSV raw file"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>

          {/* Export to Excel (.xlsx) */}
          <button
            type="button"
            onClick={onExportExcel}
            disabled={leadsCount === 0 || isExporting}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-emerald-300 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
            title="Download formatted Excel (.xlsx) with clickable WhatsApp & Maps links"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Preparing Sheet...' : `Export Excel (${selectedCount > 0 ? selectedCount : 'All'})`}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
