# Lead Finder & Agency CRM

Internal prospecting engine and lightweight CRM built for web design & digital agencies to find local businesses without websites, calculate deal value, preview live storefront mockups, and run WhatsApp outreach.

---

## What It Solves

Small businesses (salons, gyms, furniture showrooms, cafes, boutiques, hotels) often have solid Google Maps ratings (4.5★+) but zero website or online catalog. That means they lose high-intent local search traffic to competitors every single day.

This tool:
1. Scans Google Maps for any niche + city.
2. Filters out businesses that already own an official website.
3. Scores deal opportunity (0–100) and estimates project value (₹15k – ₹35k).
4. Auto-generates an interactive mobile storefront prototype with niche-specific catalogs.
5. Lets you dispatch personalized WhatsApp pitches or phone calls in one click.
6. Tracks your pipeline in a visual Kanban board with persistent call logs.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Drag & Drop CRM
- **Backend**: Node.js, Express, ExcelJS
- **Data Providers**: Serper Google Places API & Google Places API (New)
- **State & Storage**: Client-side localStorage persistence for notes, stages, and daily counters

---

## Core Capabilities

### 1. Targeted Prospect Discovery
- Filters Google Maps listings specifically for `websiteUri: null`.
- Cleans and formats phone numbers (distinguishes 10-digit mobile numbers vs landlines).
- Zero-cost offline sandbox mode included for testing without spending API credits.

### 2. Live Storefront Mockup Generator
- Click **"Demo"** on any lead to load a simulated iPhone interactive preview with their business name, location, and Google star rating.
- 3 Instant Themes: *Luxury Dark*, *Organic Emerald*, *Power Red*.
- Niche-aware product & room catalogs (Hotels, Gyms, Furniture, Boutiques, Bakeries).
- Verified Google reviews tab + interactive WhatsApp booking/cart button.
- Live QR code generator to scan and review prototypes directly on physical phones.

### 3. Deal Scoring Engine
Leads are ranked based on algorithmic opportunity scoring:
- **Hot Leads (75–100 PTS)**: 4.5★+ rating, 50+ reviews, verified mobile number $\rightarrow$ High conversion probability, ₹25k–₹35k deal estimate.
- **Warm Leads (50–74 PTS)**: Active profile, moderate review volume.
- **Starter (0–49 PTS)**: Low review count or landline-only.

### 4. 5-Stage Kanban CRM
- Move leads through pipeline stages: `New` $\rightarrow$ `Contacted` $\rightarrow$ `In Discussion` $\rightarrow$ `High Intent` $\rightarrow$ `Closed / Archived`.
- Add inline call logs and negotiation notes that persist across browser refreshes.
- Daily velocity counter (30 clicks/day) to keep outreach within safe WhatsApp thresholds.

### 5. Multi-Format Export
- **Excel (.xlsx)**: Generates formatted sheets with frozen header row, column autosizing, opportunity score tags, notes, and clickable WhatsApp/Google Maps links.
- **CSV**: UTF-8 BOM formatted download for quick spreadsheet imports.

---

## Quickstart

### Prerequisites
- Node.js 18+ installed

### Setup

```bash
# 1. Clone repository
git clone https://github.com/Ashesh88/Lead_Ashesh.git
cd Lead_Ashesh

# 2. Install dependencies for root, client, and server
npm run install:all

# 3. Configure API keys (optional if using Demo Mode)
cp server/.env.example server/.env
```

Open `server/.env` and add your Serper or Google Places API key:

```env
SERPER_API_KEY=your_serper_api_key_here
PORT=5000
```

### Start Development Server

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Project Structure

```
Lead_Ashesh/
├── client/
│   ├── src/
│   │   ├── components/         # Table, Kanban, Storefront Mockup, Notes modal
│   │   ├── constants/          # Outreach templates & pitch scripts
│   │   ├── utils/              # Lead scorer, template renderer, localStorage
│   │   ├── App.jsx             # Main dashboard controller
│   │   └── main.jsx
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/
│   ├── index.js                # Search endpoint, Serper integration, ExcelJS
│   ├── mockData.js             # Built-in realistic Delhi datasets
│   └── .env.example
├── package.json
└── README.md
```

---

## License

MIT
