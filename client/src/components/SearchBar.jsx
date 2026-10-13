import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, History, X, Sparkles, PlusCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_QUERIES } from '../constants/templates';

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  onLoadMore,
  isLoading,
  isLoadingMore,
  hasNextPage,
  searchHistory = [],
  onSelectHistory
}) {
  const [showHistory, setShowHistory] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowHistory(false);
    onSearch(query);
  };

  const handleSelectHistoryItem = (item) => {
    setQuery(item);
    setShowHistory(false);
    onSearch(item);
  };

  return (
    <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-2.5">
        
        {/* Main Search Command Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
          
          <div className="relative flex-1" ref={dropdownRef}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (searchHistory.length > 0) setShowHistory(true); }}
              placeholder="E.g. furniture shop in Karol Bagh Delhi, bakery in Bandra West..."
              className="w-full pl-10 pr-20 py-2.5 text-slate-900 placeholder-slate-400 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium text-xs sm:text-sm transition-all shadow-xs"
            />

            {/* Clear & Recent History Button */}
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {searchHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors"
                  title="Recent searches"
                >
                  <History className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Recent Searches Dropdown */}
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-xl shadow-slate-900/10 z-50 overflow-hidden text-xs">
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3 h-3 text-slate-400" /> Recent Queries
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-slate-600 text-[10px]"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {searchHistory.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectHistoryItem(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-indigo-50/60 hover:text-indigo-700 text-slate-700 flex items-center justify-between transition-colors group"
                    >
                      <span className="truncate">{item}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Select <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-300 text-white font-medium rounded-xl text-xs sm:text-sm shadow-sm shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 min-w-[125px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Scan Market</span>
                </>
              )}
            </button>

            {/* Load More Button */}
            {hasNextPage && (
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                title="Fetch next batch of results"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Next Batch</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 pt-0.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          {SAMPLE_QUERIES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(sample);
                onSearch(sample);
              }}
              className="bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 border border-slate-200/60 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            >
              {sample}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
