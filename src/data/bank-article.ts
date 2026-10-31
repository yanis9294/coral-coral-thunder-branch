export interface BankArticle {
  id: string;
  house: string;
  title: string;
  href: string;
  ts: number;
  summary: string;
  tag: string;
  source: "rss" | "desk";
}

export function tagFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (/\bfx\b|dollar|euro|yen|sterling|peso/.test(t)) return "FX";
  if (/rate|stir|sofr|ecb|fed |boj|banxico|gilt|bund/.test(t)) return "Rates";
  if (/oil|wti|brent|gas|hormuz|opec/.test(t)) return "Energy";
  if (/gold|metal|copper/.test(t)) return "Metals";
  if (/china|taiwan|iran|ukraine|geopolit/.test(t)) return "Geo";
  if (/equity|stock|nasdaq|s&p/.test(t)) return "Eq";
  return "Macro";
}
