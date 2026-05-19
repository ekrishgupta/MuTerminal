export interface TickerMappingResult {
  ticker: string;
  confidence: number;
  keywords: string[];
}

const KNOWLEDGE_BASE = [
  { ticker: "MU:TRUMP_WIN_2026", keywords: ["TRUMP", "POLL", "ELECTION", "PRESIDENT", "REPUBLICAN"], weight: 1.5 },
  { ticker: "MU:FED_CUT_JUNE", keywords: ["FED", "RATE", "CPI", "INFLATION", "POWELL", "FOMC", "CUT"], weight: 1.2 },
  { ticker: "MU:SCOTUS_RULING", keywords: ["SCOTUS", "SUPREME", "COURT", "RULING", "JUDGE"], weight: 1.0 },
  { ticker: "MU:BTC_USD_100K", keywords: ["BTC", "BITCOIN", "ETF", "CRYPTO", "SEC", "GENSLER"], weight: 1.3 },
  { ticker: "MU:OPEC_CUT_Q3", keywords: ["OPEC", "OIL", "SAUDI", "PRODUCTION", "BARREL"], weight: 1.1 },
  { ticker: "MU:UKRAINE_PEACE", keywords: ["UKRAINE", "RUSSIA", "PEACE", "PUTIN", "ZELENSKYY", "KYIV", "MOSCOW"], weight: 1.4 },
  { ticker: "MU:NVDA_200_JUL", earnings: true, keywords: ["NVDA", "NVIDIA", "GPU", "AI", "EARNINGS", "GUIDANCE"], weight: 1.5 },
];

export class TickerMapper {
  /**
   * Maps an incoming news headline to a predictive ticker.
   * Returns null if no confidence threshold is met.
   */
  static mapHeadline(headline: string): TickerMappingResult | null {
    const text = headline.toUpperCase();
    let bestMatch: TickerMappingResult | null = null;
    let highestScore = 0;

    for (const kb of KNOWLEDGE_BASE) {
      let matches = 0;
      const matchedKeywords: string[] = [];

      for (const kw of kb.keywords) {
        if (text.includes(kw)) {
          matches++;
          matchedKeywords.push(kw);
        }
      }

      if (matches > 0) {
        const score = matches * kb.weight;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            ticker: kb.ticker,
            confidence: Math.min(1.0, score / 3.0),
            keywords: matchedKeywords
          };
        }
      }
    }

    if (highestScore > 1.0) {
      return bestMatch;
    }

    return null;
  }
}
