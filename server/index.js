import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { mockPlaces, generateRealisticLeads } from './mockData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper: Normalize Indian phone numbers
export function normalizePhone(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      raw: '',
      digits: '',
      waNumber: '',
      isMobile: false,
      display: 'No phone',
      badge: 'No Phone'
    };
  }

  // Strip all non-digits
  let digits = rawPhone.replace(/\D/g, '');

  // If 11 digits starting with 0 (e.g., 09811... or 011...) -> strip leading 0
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  let waNumber = '';
  let isMobile = false;

  // 10 digits Indian number
  if (digits.length === 10) {
    const firstDigit = digits[0];
    waNumber = '91' + digits;
    // Indian mobile numbers start with 6, 7, 8, or 9
    if (['6', '7', '8', '9'].includes(firstDigit)) {
      isMobile = true;
    } else {
      isMobile = false; // Landlines like Delhi 011, Mumbai 022
    }
  } else if (digits.length === 12 && digits.startsWith('91')) {
    // Already has 91 country code
    waNumber = digits;
    const subscriberFirstDigit = digits[2];
    if (['6', '7', '8', '9'].includes(subscriberFirstDigit)) {
      isMobile = true;
    } else {
      isMobile = false;
    }
  } else if (digits.length > 10) {
    // Non-standard or international format
    waNumber = digits;
    isMobile = false;
  } else {
    // Less than 10 digits
    waNumber = digits;
    isMobile = false;
  }

  const badge = isMobile ? 'WhatsApp Ready' : (digits.length > 0 ? 'Call only' : 'No Phone');

  return {
    raw: rawPhone,
    digits,
    waNumber,
    isMobile,
    display: rawPhone.trim(),
    badge
  };
}

// Helper: Extract sensible locality/area from formattedAddress
export function extractArea(address, query = '') {
  if (!address) {
    // Try to extract from query (e.g., "in Karol Bagh Delhi" -> "Karol Bagh")
    const match = query.match(/in\s+([^,]+)/i);
    return match ? match[1].trim() : 'your area';
  }
  const parts = address.split(',').map(p => p.trim());
  // Remove postal codes and "India"
  const cleanParts = parts.filter(p => !/\b\d{6}\b/.test(p) && !/india/i.test(p));
  if (cleanParts.length >= 2) {
    // Often 2nd or 3rd component is the sub-locality or neighborhood
    return cleanParts[Math.min(1, cleanParts.length - 1)];
  }
  return cleanParts[0] || 'your area';
}

// GET /api/health
app.get('/api/health', (req, res) => {
  const hasGoogleKey = Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY.trim() !== '' && process.env.GOOGLE_PLACES_API_KEY !== 'YOUR_GOOGLE_PLACES_API_KEY_HERE');
  const hasSerperKey = Boolean(process.env.SERPER_API_KEY && process.env.SERPER_API_KEY.trim() !== '');
  const hasKey = hasGoogleKey || hasSerperKey;
  const activeProvider = hasSerperKey ? 'Serper (Live Google Maps)' : (hasGoogleKey ? 'Google Places API (New)' : 'None');

  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    hasGoogleKey,
    hasSerperKey,
    activeProvider,
    port: PORT
  });
});

// POST /api/config/api-key - Save API key directly from UI
app.post('/api/config/api-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      return res.status(400).json({ error: 'API key cannot be empty' });
    }

    const trimmedKey = apiKey.trim();
    const isGoogleKey = trimmedKey.startsWith('AIzaSy');

    if (isGoogleKey) {
      process.env.GOOGLE_PLACES_API_KEY = trimmedKey;
    } else {
      process.env.SERPER_API_KEY = trimmedKey;
    }

    // Update .env file
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    if (isGoogleKey) {
      if (envContent.includes('GOOGLE_PLACES_API_KEY=')) {
        envContent = envContent.replace(/GOOGLE_PLACES_API_KEY=.*/g, `GOOGLE_PLACES_API_KEY=${trimmedKey}`);
      } else {
        envContent += `\nGOOGLE_PLACES_API_KEY=${trimmedKey}\n`;
      }
    } else {
      if (envContent.includes('SERPER_API_KEY=')) {
        envContent = envContent.replace(/SERPER_API_KEY=.*/g, `SERPER_API_KEY=${trimmedKey}`);
      } else {
        envContent += `\nSERPER_API_KEY=${trimmedKey}\n`;
      }
    }

    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log(`[Fluxilin Backend] Updated ${isGoogleKey ? 'GOOGLE_PLACES_API_KEY' : 'SERPER_API_KEY'} in .env successfully`);
    res.json({
      success: true,
      message: `${isGoogleKey ? 'Google Places API Key' : 'Serper Google Maps API Key'} saved successfully!`
    });
  } catch (err) {
    console.error('Error saving API key to .env:', err);
    res.status(500).json({ error: 'Failed to save API key to .env' });
  }
});

// POST /api/search
// Query body: { query, pageToken, forceDemo }
app.post('/api/search', async (req, res) => {
  try {
    const { query, pageToken, forceDemo } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const serperKey = process.env.SERPER_API_KEY;
    const googleKey = process.env.GOOGLE_PLACES_API_KEY;
    const hasSerper = Boolean(serperKey && serperKey.trim() !== '');
    const hasGoogle = Boolean(googleKey && googleKey.trim() !== '' && googleKey !== 'YOUR_GOOGLE_PLACES_API_KEY_HERE');

    // 1. If Serper API key is active (Returns REAL Google Maps Data without ₹500 fee!)
    if (hasSerper && !forceDemo) {
      console.log(`[Fluxilin Backend] Querying Live Google Maps via Serper for: "${query}"`);
      
      const serperResponse = await fetch('https://google.serper.dev/places', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: query,
          gl: 'in'
        })
      });

      const serperData = await serperResponse.json();

      if (!serperResponse.ok) {
        console.error('[Fluxilin Backend] Serper API Error:', serperData);
        return res.status(serperResponse.status).json({
          error: serperData.message || 'Error fetching data from Serper Google Maps API',
          code: 'SERPER_ERROR',
          canFallbackToDemo: true
        });
      }

      const rawPlaces = serperData.places || [];
      const totalRaw = rawPlaces.length;
      let withWebsite = 0;

      // Filter: businesses WITHOUT website
      const operationalNoWebsite = rawPlaces.filter(p => {
        if (p.website && p.website.trim() !== '') {
          withWebsite++;
          return false;
        }
        return true;
      });

      // Deduplicate and process
      const seenTitles = new Set();
      const seenPhones = new Set();
      const leads = [];

      let mobileCount = 0;
      let landlineCount = 0;
      let noPhoneCount = 0;

      for (const place of operationalNoWebsite) {
        const titleKey = (place.title || '').toLowerCase().trim();
        if (seenTitles.has(titleKey)) continue;
        seenTitles.add(titleKey);

        const phoneInfo = normalizePhone(place.phoneNumber || '');
        if (phoneInfo.waNumber) {
          if (seenPhones.has(phoneInfo.waNumber)) continue;
          seenPhones.add(phoneInfo.waNumber);
        }

        if (phoneInfo.isMobile) {
          mobileCount++;
        } else if (phoneInfo.digits.length > 0) {
          landlineCount++;
        } else {
          noPhoneCount++;
        }

        const area = extractArea(place.address, query);
        const mapUrl = place.cid
          ? `https://maps.google.com/?cid=${place.cid}`
          : `https://maps.google.com/?q=${encodeURIComponent((place.title || '') + ' ' + (place.address || ''))}`;

        leads.push({
          id: `serper_${place.cid || Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: place.title || 'Business',
          category: place.category || 'Local Business',
          area,
          address: place.address || 'Delhi, India',
          rating: place.rating ? Number(place.rating) : 0,
          userRatingCount: place.ratingCount ? Number(place.ratingCount) : 0,
          phone: phoneInfo.display,
          digits: phoneInfo.digits,
          waNumber: phoneInfo.waNumber,
          isMobile: phoneInfo.isMobile,
          phoneBadge: phoneInfo.badge,
          email: '',
          googleMapsUri: mapUrl,
          businessStatus: 'OPERATIONAL',
          status: 'New'
        });
      }

      return res.json({
        leads,
        nextPageToken: null,
        isDemo: false,
        source: 'Live Google Maps (Serper)',
        stats: {
          totalFound: totalRaw,
          filteredWithWebsite: withWebsite,
          nonOperational: 0,
          leadsWithoutWebsite: leads.length,
          mobileCount,
          landlineCount,
          noPhoneCount
        }
      });
    }

    // 2. Fallback to dynamic lead generator if in Demo mode or no keys available
    if (forceDemo || (!hasSerper && !hasGoogle)) {
      console.log(`[Fluxilin Backend] Using dynamic lead generator for query: "${query}"`);
      const rawPlaces = generateRealisticLeads(query);

      // Filter: Keep only where websiteUri is missing/empty and businessStatus is OPERATIONAL
      const totalRaw = rawPlaces.length;
      let withWebsite = 0;
      let nonOperational = 0;

      const filtered = rawPlaces.filter(p => {
        if (p.websiteUri && p.websiteUri.trim() !== '') {
          withWebsite++;
          return false;
        }
        if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') {
          nonOperational++;
          return false;
        }
        return true;
      });

      // Deduplicate by id and normalized phone
      const seenIds = new Set();
      const seenPhones = new Set();
      const processedLeads = [];

      let mobileCount = 0;
      let landlineCount = 0;
      let noPhoneCount = 0;

      for (const place of filtered) {
        if (seenIds.has(place.id)) continue;
        seenIds.add(place.id);

        const phoneInfo = normalizePhone(place.nationalPhoneNumber || place.internationalPhoneNumber || '');
        if (phoneInfo.waNumber) {
          if (seenPhones.has(phoneInfo.waNumber)) continue;
          seenPhones.add(phoneInfo.waNumber);
        }

        if (phoneInfo.isMobile) {
          mobileCount++;
        } else if (phoneInfo.digits.length > 0) {
          landlineCount++;
        } else {
          noPhoneCount++;
        }

        const businessName = place.displayName?.text || place.displayName || 'Local Business';
        const category = place.primaryTypeDisplayName?.text || place.primaryTypeDisplayName || 'Local Business';
        const area = extractArea(place.formattedAddress, query);
        const rating = place.rating || 4.2;

        processedLeads.push({
          id: place.id,
          name: businessName,
          category,
          area,
          address: place.formattedAddress || 'Delhi, India',
          rating: place.rating || 0,
          userRatingCount: place.userRatingCount || 0,
          phone: phoneInfo.display,
          digits: phoneInfo.digits,
          waNumber: phoneInfo.waNumber,
          isMobile: phoneInfo.isMobile,
          phoneBadge: phoneInfo.badge,
          email: '', // inline editable on frontend
          googleMapsUri: place.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(businessName + ' ' + (place.formattedAddress || ''))}`,
          businessStatus: place.businessStatus || 'OPERATIONAL',
          status: 'New'
        });
      }

      return res.json({
        leads: processedLeads,
        nextPageToken: null,
        isDemo: true,
        stats: {
          totalFound: totalRaw,
          filteredWithWebsite: withWebsite,
          nonOperational,
          leadsWithoutWebsite: processedLeads.length,
          mobileCount,
          landlineCount,
          noPhoneCount
        },
        notice: (!hasSerper && !hasGoogle)
          ? 'Notice: API Key is not set in server/.env. Displaying realistic verified Delhi business leads for testing.'
          : null
      });
    }

    // Call official Google Places API (New) Text Search
    // Endpoint: POST https://places.googleapis.com/v1/places:searchText
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.nationalPhoneNumber',
      'places.internationalPhoneNumber',
      'places.websiteUri',
      'places.rating',
      'places.userRatingCount',
      'places.primaryTypeDisplayName',
      'places.googleMapsUri',
      'places.businessStatus',
      'nextPageToken'
    ].join(',');

    const requestBody = {
      textQuery: query,
      pageSize: 20
    };

    if (pageToken) {
      requestBody.pageToken = pageToken;
    }

    console.log(`[Fluxilin Backend] Querying Google Places API (New) for: "${query}" (pageToken: ${pageToken ? 'yes' : 'no'})`);

    const googleResponse = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleKey,
        'X-Goog-FieldMask': fieldMask
      },
      body: JSON.stringify(requestBody)
    });

    const data = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error('[Fluxilin Backend] Google Places API Error:', data);
      const errorMessage = data.error?.message || 'Failed to fetch places from Google Places API';
      const statusCode = googleResponse.status;

      let guidance = 'Please verify your API key in server/.env and ensure "Places API (New)" is enabled in Google Cloud Console.';
      if (statusCode === 403 || data.error?.status === 'PERMISSION_DENIED') {
        guidance = 'API key permission denied. Ensure "Places API (New)" is enabled, billing is linked, and no restrictive IP/HTTP restrictions block this server.';
      } else if (statusCode === 400) {
        guidance = 'Invalid request parameters or field mask.';
      }

      return res.status(statusCode).json({
        error: errorMessage,
        code: data.error?.status || 'GOOGLE_API_ERROR',
        guidance,
        canFallbackToDemo: true
      });
    }

    const places = data.places || [];
    const totalRaw = places.length;
    let withWebsite = 0;
    let nonOperational = 0;

    // Filter: keep only businesses where websiteUri is empty/missing AND businessStatus is OPERATIONAL
    const operationalNoWebsite = places.filter(place => {
      // Check website
      if (place.websiteUri && place.websiteUri.trim() !== '') {
        withWebsite++;
        return false;
      }
      // Check operational status
      if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') {
        nonOperational++;
        return false;
      }
      return true;
    });

    // Remove duplicates by place id and by phone number
    const seenIds = new Set();
    const seenPhones = new Set();
    const leads = [];

    let mobileCount = 0;
    let landlineCount = 0;
    let noPhoneCount = 0;

    for (const place of operationalNoWebsite) {
      if (place.id && seenIds.has(place.id)) {
        continue;
      }
      if (place.id) seenIds.add(place.id);

      const rawPhone = place.nationalPhoneNumber || place.internationalPhoneNumber || '';
      const phoneInfo = normalizePhone(rawPhone);

      if (phoneInfo.waNumber) {
        if (seenPhones.has(phoneInfo.waNumber)) {
          continue;
        }
        seenPhones.add(phoneInfo.waNumber);
      }

      if (phoneInfo.isMobile) {
        mobileCount++;
      } else if (phoneInfo.digits.length > 0) {
        landlineCount++;
      } else {
        noPhoneCount++;
      }

      const businessName = place.displayName?.text || place.displayName || 'Business';
      const category = place.primaryTypeDisplayName?.text || place.primaryTypeDisplayName || 'Local Business';
      const area = extractArea(place.formattedAddress, query);

      leads.push({
        id: place.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: businessName,
        category,
        area,
        address: place.formattedAddress || '',
        rating: place.rating || 0,
        userRatingCount: place.userRatingCount || 0,
        phone: phoneInfo.display,
        digits: phoneInfo.digits,
        waNumber: phoneInfo.waNumber,
        isMobile: phoneInfo.isMobile,
        phoneBadge: phoneInfo.badge,
        email: '',
        googleMapsUri: place.googleMapsUri || '',
        businessStatus: place.businessStatus || 'OPERATIONAL',
        status: 'New'
      });
    }

    res.json({
      leads,
      nextPageToken: data.nextPageToken || null,
      isDemo: false,
      stats: {
        totalFound: totalRaw,
        filteredWithWebsite: withWebsite,
        nonOperational,
        leadsWithoutWebsite: leads.length,
        mobileCount,
        landlineCount,
        noPhoneCount
      }
    });

  } catch (err) {
    console.error('[Fluxilin Backend] Unexpected search error:', err);
    res.status(500).json({
      error: err.message || 'Internal server error while searching leads',
      canFallbackToDemo: true
    });
  }
});

// POST /api/export
// Exports leads to styled Excel (.xlsx) file
app.post('/api/export', async (req, res) => {
  try {
    const { leads = [], emailSubject = 'Website for business' } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: 'No leads provided for export' });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Fluxilin Lead Finder';
    workbook.lastModifiedBy = 'Fluxilin Agency';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet('Fluxilin Verified Leads', {
      views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }] // Freeze top row
    });

    // Define Columns
    worksheet.columns = [
      { header: 'Business Name', key: 'name', width: 32 },
      { header: 'Deal Score', key: 'score', width: 14 },
      { header: 'Category', key: 'category', width: 24 },
      { header: 'Address', key: 'address', width: 45 },
      { header: 'Rating', key: 'rating', width: 12 },
      { header: 'Reviews', key: 'reviews', width: 12 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 26 },
      { header: 'Notes / Call Log', key: 'notes', width: 35 },
      { header: 'WhatsApp Link', key: 'whatsappLink', width: 24 },
      { header: 'Email Link', key: 'emailLink', width: 24 },
      { header: 'Google Maps Link', key: 'mapsLink', width: 24 },
      { header: 'Outreach Message', key: 'message', width: 55 },
      { header: 'Status', key: 'status', width: 16 }
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' } // Slate 800
      };
      cell.font = {
        name: 'Segoe UI',
        size: 11,
        bold: true,
        color: { argb: 'FFFFFFFF' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: false
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF334155' } },
        left: { style: 'thin', color: { argb: 'FF334155' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        right: { style: 'thin', color: { argb: 'FF334155' } }
      };
    });

    // Populate Rows
    leads.forEach((lead) => {
      const waUrl = lead.isMobile && lead.waNumber
        ? `https://wa.me/${lead.waNumber}?text=${encodeURIComponent(lead.message || '')}`
        : null;

      const mailtoUrl = lead.email && lead.email.trim()
        ? `mailto:${lead.email.trim()}?subject=${encodeURIComponent(emailSubject.replace('{name}', lead.name))}&body=${encodeURIComponent(lead.message || '')}`
        : null;

      // Score calculation fallback
      const reviewCount = Number(lead.userRatingCount || 0);
      const rating = Number(lead.rating || 0);
      let calculatedScore = 30;
      if (reviewCount >= 100) calculatedScore += 35;
      else if (reviewCount >= 20) calculatedScore += 20;
      if (rating >= 4.0) calculatedScore += 20;
      if (lead.isMobile) calculatedScore += 15;

      const row = worksheet.addRow({
        name: lead.name || '',
        score: lead.score || `${Math.min(100, calculatedScore)} PTS`,
        category: lead.category || '',
        address: lead.address || '',
        rating: lead.rating ? Number(lead.rating) : '',
        reviews: lead.userRatingCount ? Number(lead.userRatingCount) : 0,
        phone: lead.phone || '',
        email: lead.email || '',
        notes: lead.notes || '',
        whatsappLink: waUrl ? { text: 'Chat on WhatsApp', hyperlink: waUrl } : (lead.isMobile === false && lead.phone ? 'Call only' : 'N/A'),
        emailLink: mailtoUrl ? { text: 'Send Email', hyperlink: mailtoUrl } : 'N/A',
        mapsLink: lead.googleMapsUri ? { text: 'View on Maps', hyperlink: lead.googleMapsUri } : 'N/A',
        message: lead.message || '',
        status: lead.status || 'New'
      });

      row.height = 24;

      // Cell formatting
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { vertical: 'middle', wrapText: colNumber === 11 };
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        // If hyperlink cell, color blue and underline
        if (cell.value && typeof cell.value === 'object' && cell.value.hyperlink) {
          cell.font = {
            name: 'Segoe UI',
            size: 10,
            color: { argb: 'FF2563EB' },
            underline: true
          };
        }
      });
    });

    // Write buffer and send
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Fluxilin_Leads_${Date.now()}.xlsx"`);
    res.send(buffer);

  } catch (err) {
    console.error('[Fluxilin Backend] Excel export error:', err);
    res.status(500).json({ error: 'Failed to generate Excel export' });
  }
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Fluxilin Lead Finder Server running on http://localhost:${PORT}`);
  console.log(`🔑 Google Places API Key configured: ${Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY !== 'YOUR_GOOGLE_PLACES_API_KEY_HERE')}`);
  console.log(`===============================================`);
});
