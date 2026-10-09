export interface FraudAnalysisResult {
  riskScore: number; // 0 (safest) to 100 (extreme risk)
  riskLevel: 'safe' | 'low' | 'medium' | 'high';
  flags: string[];
  recommendations: string[];
}

export function analyzeListingRisk(
  title: string,
  description: string,
  price: number,
  category: string,
  isSellerVerified: boolean
): FraudAnalysisResult {
  const flags: string[] = [];
  const recommendations: string[] = [];
  let score = 5; // Base low baseline

  const combined = `${title} ${description}`.toLowerCase();

  // 1. Off-platform redirect patterns
  const redirectPatterns = [
    { pattern: /whatsapp|wa\.me|dm me on ig|telegram/i, message: 'Mentions external messaging (WhatsApp/Telegram)' },
    { pattern: /(\+27|0\d{2})\s?\d{3}\s?\d{4}/, message: 'Contains direct phone numbers to bypass in-app secure chat' },
    { pattern: /ewallet|instant money|cash send|mukuru|voucher/i, message: 'Mentions untraceable instant cash / eWallet services' },
    { pattern: /wire transfer|western union|crypto|usdt/i, message: 'Mentions irreversible wire or cryptocurrency transfer' },
  ];

  for (const { pattern, message } of redirectPatterns) {
    if (pattern.test(combined)) {
      flags.push(message);
      score += 28;
    }
  }

  // 2. Urgent / High-pressure language
  if (/(urgent sale|quick cash needed|today only|immediate payment)/i.test(combined)) {
    flags.push('High-urgency language detected (common pressure tactic in online scams)');
    score += 15;
  }

  // 3. Price anomalies (e.g. MacBook or Flagship iPhone under R3000)
  if (
    category === 'electronics' &&
    /(macbook|iphone 1[345]|galaxy s2[234]|playstation 5|ps5)/i.test(combined) &&
    price > 0 &&
    price < 2800
  ) {
    flags.push(`Suspiciously low price (R${price}) for high-value premium electronics`);
    score += 35;
  }

  // 4. Seller verification status penalty
  if (!isSellerVerified) {
    flags.push('Seller has not completed university .ac.za or CIPC business verification');
    score += 20;
  }

  // 5. Positive factors (Safe Campus Zone mentioned)
  if (/(safe zone|cps desk|security point|meet at library|campus protection)/i.test(combined)) {
    score = Math.max(0, score - 10);
  }

  // Cap score
  score = Math.min(100, Math.max(0, score));

  let riskLevel: 'safe' | 'low' | 'medium' | 'high' = 'safe';
  if (score > 60) riskLevel = 'high';
  else if (score > 35) riskLevel = 'medium';
  else if (score > 15) riskLevel = 'low';

  if (riskLevel === 'high') {
    recommendations.push('Do NOT pay upfront off-platform under any circumstances.');
    recommendations.push('Request to meet at an official Campus Protection Services (CPS) safe zone.');
    recommendations.push('Use Mzansi Escrow so funds are only released after physical inspection.');
  } else if (riskLevel === 'medium') {
    recommendations.push('Keep all communications within the campus store chat.');
    recommendations.push('Always verify the student or staff ID badge before handing over funds.');
  } else {
    recommendations.push('Meets standard campus safety benchmarks.');
  }

  return {
    riskScore: score,
    riskLevel,
    flags,
    recommendations,
  };
}

export function formatZAR(amount: number): string {
  if (amount === 0) return 'FREE';
  return `R ${amount.toLocaleString('en-ZA')}`;
}
