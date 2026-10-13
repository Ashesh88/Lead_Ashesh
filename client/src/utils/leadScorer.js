/**
 * Calculates a lead opportunity score (0 to 100) based on review volume,
 * rating, phone validity, and business reputation.
 * 
 * Score breakdown:
 * - High Review Volume (>100 reviews) = +35 (Proven cashflow & footfall)
 * - Good Rating (4.0 - 5.0) = +25 (Reputation worth protecting)
 * - Verified Mobile / WhatsApp = +25 (Direct access to decision maker)
 * - Operating in prime locality = +15
 */
export function calculateOpportunityScore(lead) {
  let score = 30; // base score (already verified no website)

  const reviewCount = Number(lead.userRatingCount || 0);
  const rating = Number(lead.rating || 0);

  // Review volume weights
  if (reviewCount >= 150) {
    score += 35;
  } else if (reviewCount >= 50) {
    score += 25;
  } else if (reviewCount >= 10) {
    score += 15;
  } else {
    score += 5;
  }

  // Rating weights
  if (rating >= 4.5) {
    score += 20;
  } else if (rating >= 4.0) {
    score += 15;
  } else if (rating >= 3.5) {
    score += 8;
  }

  // Mobile / WhatsApp connectivity
  if (lead.isMobile && lead.waNumber) {
    score += 15;
  } else if (lead.phone) {
    score += 5;
  }

  const finalScore = Math.min(100, Math.max(20, score));

  // Determine Badge & Estimated Deal Potential
  let tier = 'warm'; // 'hot' | 'warm' | 'nurture'
  let label = 'Warm Prospect';
  let color = 'text-amber-700 bg-amber-50 border-amber-200';
  let estimatedValue = '₹12,000 – ₹18,000';

  if (finalScore >= 80) {
    tier = 'hot';
    label = 'Hot Lead (High Intent)';
    color = 'text-rose-700 bg-rose-50 border-rose-200';
    estimatedValue = '₹20,000 – ₹35,000';
  } else if (finalScore < 50) {
    tier = 'cold';
    label = 'Starter Lead';
    color = 'text-slate-600 bg-slate-100 border-slate-200';
    estimatedValue = '₹8,000 – ₹12,000';
  }

  return {
    score: finalScore,
    tier,
    label,
    color,
    estimatedValue
  };
}
