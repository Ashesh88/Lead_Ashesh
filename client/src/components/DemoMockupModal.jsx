import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Smartphone,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  ShieldCheck,
  Check,
  Copy,
  Clock,
  ChevronRight,
  ShoppingBag,
  Zap,
  Palette,
  Maximize2,
  Percent,
  CheckCircle2,
  Share2,
  QrCode,
  Eye,
  MessageSquare,
  ThumbsUp,
  Award
} from 'lucide-react';

const THEMES = {
  modern_dark: {
    id: 'modern_dark',
    name: 'Luxury Dark',
    headerBg: 'bg-slate-950 text-white',
    heroBg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white',
    accentBadge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    waBtn: 'bg-[#25D366] hover:bg-[#1EBE5D] text-white',
    ring: 'ring-indigo-500/30'
  },
  emerald_fresh: {
    id: 'emerald_fresh',
    name: 'Organic Emerald',
    headerBg: 'bg-emerald-950 text-white',
    heroBg: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white',
    accentBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    waBtn: 'bg-[#25D366] hover:bg-[#1EBE5D] text-white',
    ring: 'ring-emerald-500/30'
  },
  crimson_bold: {
    id: 'crimson_bold',
    name: 'Power Red',
    headerBg: 'bg-slate-950 text-white',
    heroBg: 'bg-gradient-to-br from-rose-950 via-red-900 to-slate-900 text-white',
    accentBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white',
    waBtn: 'bg-[#25D366] hover:bg-[#1EBE5D] text-white',
    ring: 'ring-rose-500/30'
  }
};

function getCategoryCatalog(category = '') {
  const cat = category.toLowerCase();
  
  if (cat.includes('hotel') || cat.includes('resort') || cat.includes('stay') || cat.includes('villa') || cat.includes('guest house') || cat.includes('apartment') || cat.includes('inn') || cat.includes('room')) {
    return [
      {
        title: 'Deluxe King Room (City View & Breakfast)',
        price: '₹2,499/night',
        originalPrice: '₹3,500',
        badge: 'Best Value',
        desc: 'High-speed WiFi, AC, ensuite luxury bathroom & complimentary breakfast',
        img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Executive Studio Suite with Balcony',
        price: '₹3,999/night',
        originalPrice: '₹5,500',
        badge: 'Top Rated',
        desc: 'Spacious workspace, smart LED TV, mini-bar & private terrace access',
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Family 2-BHK Serviced Penthouse',
        price: '₹6,499/night',
        originalPrice: '₹9,000',
        badge: 'Family Pick',
        desc: 'Modular kitchenette, living lounge, 2 king beds & 24/7 dedicated concierge',
        img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  if (cat.includes('gym') || cat.includes('fitness')) {
    return [
      {
        title: 'Monthly Gym Access & Cardio Zone',
        price: '₹1,499/mo',
        originalPrice: '₹2,200',
        badge: 'Popular',
        desc: 'Unlimited equipment access, locker & cardio floor',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Personal Training (1-on-1 Certified Coach)',
        price: '₹4,999/mo',
        originalPrice: '₹7,500',
        badge: 'Transformation',
        desc: 'Custom diet macros + dedicated transformation mentor',
        img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: '3-Month Muscle Building Protocol',
        price: '₹3,999',
        originalPrice: '₹5,500',
        badge: 'Best Value',
        desc: 'Strength conditioning + monthly body fat analysis',
        img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  if (cat.includes('furniture') || cat.includes('interior')) {
    return [
      {
        title: 'Solid Teak Wood Sofa Set (3+1+1)',
        price: '₹24,999',
        originalPrice: '₹34,000',
        badge: 'Bestseller',
        desc: 'High-density foam, 5-year wood guarantee & stain-resistant fabric',
        img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'King Size Hydraulic Storage Bed',
        price: '₹18,500',
        originalPrice: '₹26,000',
        badge: 'Trending',
        desc: 'Heavy-duty termite resistant ply with silent hydraulic gas-lift',
        img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: '6-Seater Italian Marble Dining Table',
        price: '₹32,000',
        originalPrice: '₹45,000',
        badge: 'Premium',
        desc: 'Glossy polished composite marble top with ergonomic cushioned chairs',
        img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  if (cat.includes('boutique') || cat.includes('cloth') || cat.includes('fashion') || cat.includes('wear')) {
    return [
      {
        title: 'Designer Handcrafted Bridal Lehenga',
        price: '₹12,499',
        originalPrice: '₹18,500',
        badge: 'New Arrival',
        desc: 'Intricate zardozi embroidery with matching heavy net dupatta',
        img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Pure Banarasi Silk Festive Anarkali',
        price: '₹4,200',
        originalPrice: '₹6,000',
        badge: 'Limited',
        desc: 'Woven zari border with contrast organza hand-painted dupatta',
        img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Breathable Pure Cotton Daily Kurti Set',
        price: '₹1,899',
        originalPrice: '₹2,699',
        badge: 'Trending',
        desc: 'Block-print floral set with tailored straight pants',
        img: 'https://images.unsplash.com/photo-1583391733975-dd2897621c56?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  if (cat.includes('bakery') || cat.includes('cake') || cat.includes('cafe')) {
    return [
      {
        title: 'Dutch Truffle Dark Chocolate Cake (1Kg)',
        price: '₹650',
        originalPrice: '₹850',
        badge: 'Bestseller',
        desc: 'Rich 55% Belgian chocolate ganache with moist sponge',
        img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Custom Theme Birthday & Anniversary Cake',
        price: '₹950/kg',
        originalPrice: '₹1,200',
        badge: 'Custom',
        desc: '100% Eggless, handcrafted fondant designs with same-day bake',
        img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80'
      },
      {
        title: 'Fresh Artisanal Butter Croissant Box (4 Pcs)',
        price: '₹420',
        originalPrice: '₹560',
        badge: 'Fresh Daily',
        desc: 'Flaky 27-layer laminated French butter pastries',
        img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80'
      }
    ];
  }

  return [
    {
      title: 'Top Verified In-Store Collection',
      price: 'On Request',
      originalPrice: 'Best Price',
      badge: 'Verified',
      desc: 'Top-selling verified stock directly from official store',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Direct WhatsApp Quotation & Booking',
      price: 'Free Estimate',
      originalPrice: 'Zero Cost',
      badge: 'Direct Enquiry',
      desc: 'Connect directly with store owner for fast turnaround',
      img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Wholesale & Volume Discount Pricing',
      price: 'Special Rates',
      originalPrice: '20% Off',
      badge: 'Wholesale',
      desc: 'Exclusive manufacturer rates for bulk requirements',
      img: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80'
    }
  ];
}

// Generate realistic verified customer reviews based on Google rating
function getSimulatedReviews(lead) {
  const rating = Number(lead.rating || 4.8).toFixed(1);
  const cat = (lead.category || '').toLowerCase();
  const isHospitality = cat.includes('hotel') || cat.includes('resort') || cat.includes('stay') || cat.includes('villa') || cat.includes('guest house') || cat.includes('apartment') || cat.includes('inn');

  if (isHospitality) {
    return [
      {
        name: 'Rohit Malhotra',
        time: '1 week ago',
        rating: 5,
        comment: `Super clean rooms, fast check-in and prime location in ${lead.area || 'the city'}. Directly booked via WhatsApp and got instant confirmation without any OTA hassle.`
      },
      {
        name: 'Sneha Kapur',
        time: '3 weeks ago',
        rating: 5,
        comment: 'Staff was courteous, bed was super comfortable and breakfast was delicious. 10/10 recommendation for family and business stays!'
      }
    ];
  }

  return [
    {
      name: 'Aman Sharma',
      time: '2 weeks ago',
      rating: 5,
      comment: `Best ${lead.category || 'store'} in ${lead.area || 'this area'}. Staff is very helpful and prices are super genuine.`
    },
    {
      name: 'Pooja Verma',
      time: '1 month ago',
      rating: 5,
      comment: 'Loved the quality and quick delivery! Highly recommend to everyone.'
    }
  ];
}

export default function DemoMockupModal({ lead, isOpen, onClose, showToast }) {
  if (!isOpen || !lead) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTheme, setActiveTheme] = useState('modern_dark');
  const [cartCount, setCartCount] = useState(0);
  const [activeSection, setActiveSection] = useState('catalog'); // 'catalog' | 'reviews' | 'about'

  const catLower = (lead.category || '').toLowerCase();
  const isHospitality = catLower.includes('hotel') || catLower.includes('resort') || catLower.includes('stay') || catLower.includes('villa') || catLower.includes('guest house') || catLower.includes('apartment') || catLower.includes('inn') || catLower.includes('room');

  const theme = THEMES[activeTheme] || THEMES.modern_dark;
  const catalog = getCategoryCatalog(lead.category);
  const reviews = getSimulatedReviews(lead);

  const slug = (lead.name || (isHospitality ? 'hotel' : 'store'))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const previewUrl = `https://fluxilin.agency/preview/${slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(previewUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopiedLink(true);
    if (showToast) showToast('Live demo URL copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPitchWithLink = () => {
    const pitch = isHospitality
      ? `Hi Rohit here from Fluxilin Studio.\n\nMaine ${lead.name} (${lead.area || 'Noida'}) ke liye ek exclusive direct room booking prototype page ready kiya hai jisme room options, amenities, verified Google reviews (${lead.rating || 4.5}★) aur direct 0% commission WhatsApp booking button live hai:\n🔗 ${previewUrl}\n\n30 seconds me phone pe check karke batayein kaisa laga?`
      : `Hi Rohit here from Fluxilin Studio.\n\nMaine ${lead.name} (${lead.area || 'Delhi'}) ke liye ek exclusive 1-page mobile store prototype ready kiya hai jisme aapka photo catalog, Google reviews (${lead.rating || 4.5}★) aur direct 1-tap WhatsApp order button live hai:\n🔗 ${previewUrl}\n\n30 seconds me phone pe check karke batayein kaisa laga?`;
    navigator.clipboard.writeText(pitch);
    if (showToast) showToast('Pitch with live preview link copied!');
  };

  const handleAddToCart = (item) => {
    setCartCount(prev => prev + 1);
    if (showToast) showToast(`Added "${item.title}" to WhatsApp ${isHospitality ? 'Booking Request' : 'Cart'}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-100">
                  Interactive Storefront Prototype
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Ready to Close
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Custom responsive landing page & catalog for <span className="text-white font-medium">{lead.name}</span>
              </p>
            </div>
          </div>

          {/* Theme Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-medium px-2 flex items-center gap-1">
              <Palette className="w-3 h-3 text-indigo-400" /> Theme:
            </span>
            {Object.values(THEMES).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTheme(t.id)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  activeTheme === t.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy URL'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/70">
          
          {/* Left Column: Interactive Phone Device Frame */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            
            {/* Mock iPhone Device Shell */}
            <div className="w-full max-w-[340px] bg-slate-950 border-[7px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden relative ring-1 ring-slate-700/60">
              
              {/* Dynamic Island Notch */}
              <div className="h-5 bg-slate-900 flex items-center justify-center pt-1">
                <div className="w-20 h-3 bg-black rounded-full"></div>
              </div>

              {/* Mock Mobile Website Scroll Body */}
              <div className="bg-slate-50 text-slate-900 h-[530px] overflow-y-auto flex flex-col text-left font-sans select-none scroll-smooth">
                
                {/* 1. Header Navbar */}
                <div className={`${theme.headerBg} p-3 flex items-center justify-between sticky top-0 z-20 shadow-md transition-colors`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-black shadow-xs">
                      {lead.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <span className="font-bold text-xs truncate max-w-[130px] block leading-tight">{lead.name}</span>
                      <span className="text-[9px] text-slate-400 truncate block font-mono">{lead.area || 'Verified Store'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {cartCount > 0 && (
                      <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded-full font-mono animate-bounce">
                        {cartCount} item
                      </span>
                    )}
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Open
                    </span>
                  </div>
                </div>

                {/* 2. Hero Banner */}
                <div className={`${theme.heroBg} p-4 py-5 text-center space-y-2 border-b border-white/10 transition-colors`}>
                  <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded ${theme.accentBadge} border inline-block`}>
                    {lead.category || 'Featured Store'}
                  </span>
                  
                  <h1 className="text-base font-extrabold leading-tight text-white tracking-tight">
                    {lead.name}
                  </h1>
                  
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isHospitality
                      ? `Google Verified stay in ${lead.area || 'Noida'}. Instant check-in & 0% commission direct booking.`
                      : `Google Verified business in ${lead.area || 'Delhi'}. Direct orders & quick response.`}
                  </p>

                  {/* Rating Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[11px] border border-white/15 backdrop-blur-sm shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">{lead.rating || 4.8}★</span>
                    <span className="text-slate-300 font-mono text-[10px]">({lead.userRatingCount || 120}+ verified reviews)</span>
                  </div>
                </div>

                {/* 3. Fast Action CTAs */}
                <div className="p-2.5 grid grid-cols-2 gap-2 bg-white border-b border-slate-200 sticky top-[48px] z-10 shadow-2xs">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (showToast) showToast(isHospitality ? 'Connecting to direct reservation chat...' : 'Connecting directly to WhatsApp chat...');
                    }}
                    className={`p-2 ${theme.waBtn} rounded-xl text-center text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> {isHospitality ? 'Book on WhatsApp' : 'WhatsApp Order'}
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (showToast) showToast(`Dialing ${lead.phone || 'front desk'}...`);
                    }}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> {isHospitality ? 'Call Front Desk' : 'Call Store'}
                  </a>
                </div>

                {/* 4. Section Navigation Tabs */}
                <div className="px-3 pt-2.5 flex items-center gap-1 text-[10px] font-bold border-b border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setActiveSection('catalog')}
                    className={`pb-2 px-2.5 border-b-2 transition-colors ${
                      activeSection === 'catalog'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {isHospitality ? 'Rooms & Rates' : 'Products & Pricing'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('reviews')}
                    className={`pb-2 px-2.5 border-b-2 transition-colors ${
                      activeSection === 'reviews'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Google Reviews ({lead.rating || 4.8}★)
                  </button>
                </div>

                {/* 5. Limited Time Promo Banner */}
                <div className="mx-3 mt-3 p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-center gap-2 text-[10px] text-amber-900">
                  <Percent className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">{isHospitality ? 'Direct Guest Perk:' : 'Direct WhatsApp Deal:'}</span>{' '}
                    {isHospitality
                      ? 'Complimentary breakfast + early check-in on direct WhatsApp bookings.'
                      : 'Get 10% instant discount on direct orders this week.'}
                  </div>
                </div>

                {/* 6. Dynamic Section Content */}
                {activeSection === 'catalog' ? (
                  /* Catalog Section */
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-indigo-600" /> {isHospitality ? 'Available Rooms' : 'Featured Catalog'}
                      </span>
                      <span className="text-[9px] text-indigo-600 font-semibold font-mono">{isHospitality ? 'Best Rate Guarantee' : 'Verified Prices'}</span>
                    </div>

                    <div className="space-y-2">
                      {catalog.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs flex gap-2.5 items-start hover:border-indigo-400 transition-all group"
                        >
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-[11px] font-bold text-slate-900 leading-tight truncate">
                                {item.title}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 shrink-0 font-mono">
                                {item.badge}
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">
                              {item.desc}
                            </p>

                            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-extrabold text-xs text-slate-900 font-mono">
                                  {item.price}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-[9px] text-slate-400 line-through font-mono">
                                    {item.originalPrice}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(item)}
                                className="text-[10px] font-bold text-[#1EBE5D] hover:text-[#179B4B] flex items-center gap-0.5"
                              >
                                {isHospitality ? 'Reserve via WA' : 'Order via WA'} <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Verified Google Reviews Section */
                  <div className="p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-indigo-600" /> Customer Testimonials
                      </span>
                      <span className="text-[9px] font-bold text-amber-600 font-mono">Google Verified</span>
                    </div>

                    <div className="space-y-2">
                      {reviews.map((rev, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-slate-900">{rev.name}</span>
                            <span className="text-[9px] text-slate-400">{rev.time}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-600 leading-snug">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Store Assurance */}
                <div className="px-3 pb-3 space-y-2">
                  <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Store Assurance
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-800">100% Genuine</span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold text-slate-800">Same-Day Reply</span>
                    </div>
                  </div>

                  {/* Address Card */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] space-y-1 shadow-2xs">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> Verified Location
                    </div>
                    <p className="text-slate-600 leading-snug">
                      {lead.address || 'Karol Bagh Delhi, India'}
                    </p>
                  </div>
                </div>

                {/* 8. Footer */}
                <div className="p-3 bg-slate-100 text-center text-[9px] text-slate-400 border-t border-slate-200 mt-auto">
                  Powered by Fluxilin Web Studio • Instant Mobile Catalog
                </div>

              </div>

              {/* Home Indicator */}
              <div className="h-4 bg-slate-900 flex items-center justify-center">
                <div className="w-24 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-indigo-400" /> Scrollable responsive phone mockup
            </p>
          </div>

          {/* Right Column: Instant WhatsApp Pitch Integration & QR Scan */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Pitch Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> High-Converting Pitch With Catalog Link
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Send this customized message directly on WhatsApp with the live catalog prototype attached:
                </p>

                {/* Pre-crafted message */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-sans space-y-2 whitespace-pre-line leading-relaxed">
                  {isHospitality
                    ? `Hi Rohit here from Fluxilin Studio.

Came across ${lead.name} on Google Maps while looking at boutique stays & hotels in ${lead.area || 'your area'} (${lead.rating || 4.5}★ reviews).

Notice kiya ki aapka property profile kaafi accha hai par direct website link nahi hai, jisse guests MakeMyTrip/Goibibo pe chale jaate hain aur aapka 18-22% commission cut ho jata hai.

Maine aapki property ke liye ek quick direct room booking & WhatsApp reservation prototype ready kiya hai (0% commission):
🔗 ${previewUrl}

Aap 30 seconds me live dekh sakte hain. Pasand aaye toh hum isko fully activate kar denge.`
                    : `Hi Rohit here from Fluxilin Studio.

Came across ${lead.name} on Google while analyzing ${lead.category || 'local'} stores in ${lead.area || 'Delhi'} (${lead.rating || 4.5}★ reviews).

Notice kiya ki aapka profile strong hai par koi official website ya online catalog linked nahi hai, jisse customers dusri dukan pe switch ho jaate hain.

Maine aapke store ke liye ek quick 1-page mobile preview prototype ready kiya hai (photo catalog + direct WhatsApp order):
🔗 ${previewUrl}

Aap 30 seconds me live dekh sakte hain. Pasand aaye toh bataiyega, hum isko 48 hours me fully live kar dete hain.`}
                </div>

                <div className="pt-2 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={handleCopyPitchWithLink}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Pitch With Link
                  </button>

                  {lead.isMobile && lead.waNumber && (
                    <a
                      href={`https://wa.me/${lead.waNumber}?text=${encodeURIComponent(
                        `Hi Rohit here from Fluxilin Studio. Maine ${lead.name} (${lead.area || 'Delhi'}) ke liye ek exclusive 1-page mobile catalog prototype draft kiya hai. Aap yahan live check kar sakte hain: ${previewUrl} - 30 seconds me dekh ke bataiye kaisa laga!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Send on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* QR Code Quick Scan Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-16 h-16 rounded-lg bg-white p-1 shrink-0 border border-slate-700"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold text-slate-200 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-indigo-400" /> Scan On Your Own Phone
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Scan this QR code with your mobile camera to test how the storefront loads on a real smartphone.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px] text-slate-500">
              <span>Prototype ID: <span className="font-mono text-slate-400">{lead.id}</span></span>
              <button
                type="button"
                onClick={onClose}
                className="hover:text-slate-300 font-medium"
              >
                Close Mockup
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
