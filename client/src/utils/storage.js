const STORAGE_KEYS = {
  SAFETY_COUNTER: 'fluxilin_wa_counter',
  SEARCH_HISTORY: 'fluxilin_search_history',
  LEAD_OVERRIDES: 'fluxilin_lead_overrides',
  TEMPLATES: 'fluxilin_templates_config',
};

// Returns current local YYYY-MM-DD string
function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 1. Daily Safety Counter
export function getDailySafetyCount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAFETY_COUNTER);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    const today = getTodayString();
    if (parsed.date !== today) {
      // New day, reset
      localStorage.setItem(STORAGE_KEYS.SAFETY_COUNTER, JSON.stringify({ date: today, count: 0 }));
      return 0;
    }
    return parsed.count || 0;
  } catch (e) {
    console.error('Error reading safety counter:', e);
    return 0;
  }
}

export function incrementDailySafetyCount() {
  try {
    const today = getTodayString();
    const current = getDailySafetyCount();
    const updated = current + 1;
    localStorage.setItem(STORAGE_KEYS.SAFETY_COUNTER, JSON.stringify({ date: today, count: updated }));
    return updated;
  } catch (e) {
    console.error('Error updating safety counter:', e);
    return 1;
  }
}

// 2. Search History (Last 10 queries)
export function getSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addSearchHistory(query) {
  if (!query || !query.trim()) return;
  try {
    const clean = query.trim();
    const history = getSearchHistory().filter(q => q.toLowerCase() !== clean.toLowerCase());
    history.unshift(clean);
    const limited = history.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
    return limited;
  } catch (e) {
    console.error('Error saving search history:', e);
  }
}

// 3. Lead Overrides (Status, edited Email, edited Message, Contacted timestamp)
export function getLeadOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEAD_OVERRIDES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveLeadOverride(leadId, patch) {
  if (!leadId) return;
  try {
    const all = getLeadOverrides();
    all[leadId] = {
      ...(all[leadId] || {}),
      ...patch,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.LEAD_OVERRIDES, JSON.stringify(all));
    return all[leadId];
  } catch (e) {
    console.error('Error saving lead override:', e);
  }
}

// 4. Template settings
export function getStoredTemplateConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredTemplateConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving template config:', e);
  }
}

// 5. Client-Side CSV Export with UTF-8 BOM
export function exportToCSV(leads, emailSubject = 'Website for business') {
  if (!leads || leads.length === 0) return;

  const headers = [
    'Business Name',
    'Category',
    'Address',
    'Rating',
    'Reviews',
    'Phone',
    'Email',
    'WhatsApp Link',
    'Email Link',
    'Google Maps Link',
    'Message',
    'Status'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map(lead => {
    const waUrl = lead.isMobile && lead.waNumber
      ? `https://wa.me/${lead.waNumber}?text=${encodeURIComponent(lead.message || '')}`
      : (lead.isMobile === false && lead.phone ? 'Call only' : 'N/A');

    const mailtoUrl = lead.email && lead.email.trim()
      ? `mailto:${lead.email.trim()}?subject=${encodeURIComponent(emailSubject.replace('{name}', lead.name))}&body=${encodeURIComponent(lead.message || '')}`
      : 'N/A';

    return [
      escapeCSV(lead.name),
      escapeCSV(lead.category),
      escapeCSV(lead.address),
      escapeCSV(lead.rating || ''),
      escapeCSV(lead.userRatingCount || 0),
      escapeCSV(lead.phone),
      escapeCSV(lead.email || ''),
      escapeCSV(waUrl),
      escapeCSV(mailtoUrl),
      escapeCSV(lead.googleMapsUri || ''),
      escapeCSV(lead.message || ''),
      escapeCSV(lead.status || 'New')
    ].join(',');
  });

  // UTF-8 BOM to ensure proper Indian characters render in Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Fluxilin_Leads_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
