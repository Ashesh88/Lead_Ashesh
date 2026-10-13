export const FOLLOW_UP_SEQUENCES = {
  day1: {
    id: 'day1',
    label: 'Initial Pitch (Day 1)',
    template: 'Hi Rohit here from Fluxilin Studio.\n\nCame across {name} on Google while analyzing high-ranking {category} businesses in {area}. Your {rating}★ rating and customer reviews are excellent.\n\nHowever, your Google listing has no official website attached. When customers in {area} search for you, a large percentage drop off or click competing stores with active catalogs.\n\nWe design clean, high-speed mobile landing pages with direct 1-tap WhatsApp and call integration for local businesses. Would you be open to seeing a 2-minute prototype we drafted for {name}?'
  },
  day3: {
    id: 'day3',
    label: 'Quick Follow-up (Day 3)',
    template: 'Hi team {name}, Rohit from Fluxilin following up on my previous note.\n\nJust wanted to check if you had 2 minutes to review the concept prototype for {name}? Local search traffic in {area} is high this month, and having a 1-tap WhatsApp catalog live would convert those direct visits into instant inquiries.\n\nHappy to share a quick 30-sec demo screen recording if that\'s easier to review on WhatsApp?'
  },
  day7: {
    id: 'day7',
    label: 'Closing Note (Day 7)',
    template: 'Hi {name} team, Rohit from Fluxilin once more.\n\nAssuming you might be busy right now with store operations, so I won\'t follow up again. If you decide to link a modern mobile catalog or website to your Google profile later this quarter, feel free to reach out anytime. Wish {name} continued success!'
  }
};

export const TEMPLATE_PRESETS = [
  {
    id: 'agency_inquiry_leak',
    label: 'Revenue & Inquiry Leak (Recommended)',
    description: 'Direct, elite agency pitch highlighting high search volume vs zero landing page.',
    template: FOLLOW_UP_SEQUENCES.day1.template
  },
  {
    id: 'direct_business_owner',
    label: 'Direct to Owner / Decision Maker',
    description: 'Crisp Hindi-English business pitch directly addressing the owner.',
    template: 'Hello Sir, Rohit from Fluxilin Studio.\n\nGoogle Maps par {name} dekha ({rating}★ in {area}). Profile verify hai but website link missing hai, jis wajah se Google search se aane wale prospective customers direct contact nahi kar pa rahe.\n\nHumne aapke brand ke liye ek live demo design kiya hai jo direct calls aur WhatsApp inquiries generate kare. Ek quick link share karoon review ke liye?'
  },
  {
    id: 'executive_concise',
    label: 'Quick 3-Line Hook',
    description: 'Ultra-concise, professional message with high curiosity.',
    template: 'Hi team {name}, Rohit from Fluxilin.\n\nNoticed {name} ranks well on Google in {area} ({rating}★), but doesn\'t have a website or online catalog linked yet.\n\nWe put together a quick 1-page mobile site demo for your store to capture direct inquiries. May I send over the link?'
  }
];

export const DEFAULT_TEMPLATE = TEMPLATE_PRESETS[0].template;
export const DEFAULT_EMAIL_SUBJECT = '{name} - Online Presence & Direct Inquiries Proposal';

export const SAMPLE_QUERIES = [
  'furniture shop in Karol Bagh Delhi',
  'boutique in Bandra West Mumbai',
  'gym in Koramangala Bangalore',
  'bakery in Connaught Place New Delhi',
  'interior designer in Rajouri Garden Delhi'
];
