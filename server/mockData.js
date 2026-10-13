export const mockPlaces = [
  {
    id: "places/ChIJw2b_mock_01",
    displayName: { text: "Sharma Furniture & Woodcrafts" },
    formattedAddress: "Shop 14, Furniture Block, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "098112 34567",
    internationalPhoneNumber: "+91 98112 34567",
    websiteUri: null,
    rating: 4.6,
    userRatingCount: 84,
    primaryTypeDisplayName: { text: "Furniture Store" },
    googleMapsUri: "https://maps.google.com/?cid=101010101",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_02",
    displayName: { text: "Karol Bagh Sofa Palace" },
    formattedAddress: "Plot 8B, Desh Bandhu Gupta Rd, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "011 2575 8899",
    internationalPhoneNumber: "+91 11 2575 8899",
    websiteUri: null,
    rating: 4.3,
    userRatingCount: 112,
    primaryTypeDisplayName: { text: "Furniture Maker" },
    googleMapsUri: "https://maps.google.com/?cid=101010102",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_03",
    displayName: { text: "Gupta Timber & Modular Interiors" },
    formattedAddress: "23, Guru Nanak Market, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "088261 45902",
    internationalPhoneNumber: "+91 88261 45902",
    websiteUri: null,
    rating: 4.7,
    userRatingCount: 63,
    primaryTypeDisplayName: { text: "Interior Designer" },
    googleMapsUri: "https://maps.google.com/?cid=101010103",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_04",
    displayName: { text: "Aggarwal Furnishing & Mattresses" },
    formattedAddress: "56, Arya Samaj Rd, WEA, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "097170 82341",
    internationalPhoneNumber: "+91 97170 82341",
    websiteUri: null,
    rating: 4.1,
    userRatingCount: 45,
    primaryTypeDisplayName: { text: "Bedding Store" },
    googleMapsUri: "https://maps.google.com/?cid=101010104",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_05",
    displayName: { text: "Delite Office Chairs & Tables" },
    formattedAddress: "12/4, Padam Singh Rd, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "011 2874 1122",
    internationalPhoneNumber: "+91 11 2874 1122",
    websiteUri: null,
    rating: 3.9,
    userRatingCount: 38,
    primaryTypeDisplayName: { text: "Office Furniture Store" },
    googleMapsUri: "https://maps.google.com/?cid=101010105",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_06",
    displayName: { text: "Royal Teak Living & Dining" },
    formattedAddress: "Opp. Metro Pillar 95, Pusa Road, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "070425 99182",
    internationalPhoneNumber: "+91 70425 99182",
    websiteUri: null,
    rating: 4.8,
    userRatingCount: 147,
    primaryTypeDisplayName: { text: "Furniture Manufacturer" },
    googleMapsUri: "https://maps.google.com/?cid=101010106",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_07",
    displayName: { text: "National Cane & Bamboo Handicrafts" },
    formattedAddress: "Shop 3, Ghaffar Market Ext, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "099582 33411",
    internationalPhoneNumber: "+91 99582 33411",
    websiteUri: null,
    rating: 4.4,
    userRatingCount: 52,
    primaryTypeDisplayName: { text: "Home Goods Store" },
    googleMapsUri: "https://maps.google.com/?cid=101010107",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_08",
    displayName: { text: "Modern Comfort Recliners" },
    formattedAddress: "77, Bank Street, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "062019 88472",
    internationalPhoneNumber: "+91 62019 88472",
    websiteUri: null,
    rating: 4.5,
    userRatingCount: 96,
    primaryTypeDisplayName: { text: "Furniture Store" },
    googleMapsUri: "https://maps.google.com/?cid=101010108",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_09",
    displayName: { text: "Urban Nest Woodworks" },
    formattedAddress: "45, Ajmal Khan Road, Karol Bagh, New Delhi, Delhi 110005",
    nationalPhoneNumber: "098711 65432",
    internationalPhoneNumber: "+91 98711 65432",
    websiteUri: "https://urbannestfurniture.in", // Has website! Will be filtered out
    rating: 4.6,
    userRatingCount: 210,
    primaryTypeDisplayName: { text: "Furniture Store" },
    googleMapsUri: "https://maps.google.com/?cid=101010109",
    businessStatus: "OPERATIONAL"
  },
  {
    id: "places/ChIJw2b_mock_10",
    displayName: { text: "Kuber Steel Almirah Works" },
    formattedAddress: "Shop 19, Old Rajinder Nagar Market, Karol Bagh, New Delhi, Delhi 110060",
    nationalPhoneNumber: "098188 77654",
    internationalPhoneNumber: "+91 98188 77654",
    websiteUri: null,
    rating: 4.2,
    userRatingCount: 31,
    primaryTypeDisplayName: { text: "Cabinet Maker" },
    googleMapsUri: "https://maps.google.com/?cid=101010110",
    businessStatus: "OPERATIONAL"
  }
];

// Dynamic generator for ANY user query so Rohit can search anything without paying Google ₹500
export function generateRealisticLeads(query) {
  if (!query || typeof query !== 'string') return mockPlaces;

  const q = query.trim();
  // Extract category and locality
  let category = 'Local Business';
  let locality = 'Karol Bagh Delhi';

  if (q.toLowerCase().includes(' in ')) {
    const parts = q.split(/ in /i);
    category = parts[0].trim();
    locality = parts[1].trim();
  } else {
    category = q;
  }

  // Capitalize category words
  const cleanCategory = category
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const prefixes = [
    'Sharma', 'Gupta', 'Verma', 'Royal', 'Modern', 'Aggarwal',
    'National', 'Elite', 'Om Sai', 'Shree Ram', 'Metro', 'Classic',
    'Prime', 'City', 'Golden', 'Apex', 'New India'
  ];

  const suffixes = [
    'Hub', 'Studio', 'Point', 'Centre', 'Enterprises', 'Works',
    'Corner', 'World', 'Gallery', 'Emporium', 'House', 'Plaza'
  ];

  const streets = [
    'Main Market Road', 'Station Road', 'Block B Market', 'Gandhi Chowk',
    'Desh Bandhu Road', 'Commercial Complex', 'Near Metro Station',
    'Arya Samaj Road', 'Shankar Market', 'Ring Road'
  ];

  const mobilePrefixes = ['98112', '98711', '88261', '97170', '70425', '99582', '62019', '98188', '99101', '88002'];
  const landlinePrefix = locality.toLowerCase().includes('mumbai') ? '022 ' : '011 ';

  const results = [];

  for (let i = 0; i < 14; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[i % suffixes.length];
    const name = `${prefix} ${cleanCategory} ${suffix}`;
    const street = streets[i % streets.length];
    const address = `Shop ${12 + i * 3}, ${street}, ${locality}`;
    
    // 2 out of 14 have websites to test filtering
    const hasWebsite = (i === 4 || i === 9);
    const websiteUri = hasWebsite ? `https://www.${prefix.toLowerCase()}${cleanCategory.toLowerCase().replace(/\s+/g, '')}.in` : null;

    // 2 out of remaining are landlines
    const isLandline = (i === 1 || i === 7);
    const phone = isLandline
      ? `${landlinePrefix}2874 ${1000 + i * 111}`
      : `0${mobilePrefixes[i % mobilePrefixes.length]} ${30000 + i * 1421}`;

    const rating = +(3.8 + ((i * 13) % 12) / 10).toFixed(1);
    const reviews = 25 + (i * 17);

    results.push({
      id: `places/ChIJ_dyn_${i}_${encodeURIComponent(q.substring(0, 10))}`,
      displayName: { text: name },
      formattedAddress: address,
      nationalPhoneNumber: phone,
      internationalPhoneNumber: isLandline ? `+91 ${phone.replace(/^0/, '')}` : `+91 ${phone.replace(/^0/, '')}`,
      websiteUri,
      rating,
      userRatingCount: reviews,
      primaryTypeDisplayName: { text: cleanCategory },
      googleMapsUri: `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address)}`,
      businessStatus: "OPERATIONAL"
    });
  }

  return results;
}
