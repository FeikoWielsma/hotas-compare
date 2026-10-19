import { loadCatalog } from './catalog';
import type { Bundle, Component } from './schema';

export interface AuditItem {
  id: string;
  name: string;
  item_type: 'component' | 'bundle';
  verification: 'verified' | 'draft';
  prices: { verified: string }[];
  verdict?: unknown;
}

export interface AuditSummary {
  referenceDate: string;
  totalItems: number;
  verifiedCount: number;
  draftCount: number;
  stalePriceCount: number;
  missingPriceCount: number;
  missingVerdictCount: number;
}

/** Count an item as stale when it has prices, but every price is over 90 days old. */
export function createAuditSummary(items: AuditItem[], referenceDate = new Date()): AuditSummary {
  const cutoff = new Date(referenceDate);
  cutoff.setUTCDate(cutoff.getUTCDate() - 90);
  return {
    referenceDate: referenceDate.toISOString().slice(0, 10),
    totalItems: items.length,
    verifiedCount: items.filter((item) => item.verification === 'verified').length,
    draftCount: items.filter((item) => item.verification === 'draft').length,
    stalePriceCount: items.filter((item) => item.prices.length > 0 && item.prices.every((price) => new Date(`${price.verified}T00:00:00Z`) < cutoff)).length,
    missingPriceCount: items.filter((item) => item.prices.length === 0).length,
    missingVerdictCount: items.filter((item) => !item.verdict).length,
  };
}

export async function auditCatalog(referenceDate = new Date()): Promise<AuditSummary> {
  const catalog = await loadCatalog('EU', referenceDate);
  const items: AuditItem[] = [
    ...catalog.components.map(({ id, data }: { id: string; data: Component }) => ({
      id, name: data.name, item_type: 'component' as const, verification: data.verification, prices: data.prices, verdict: data.verdict,
    })),
    ...catalog.bundles.map(({ id, data }: { id: string; data: Bundle }) => ({
      id, name: data.name, item_type: 'bundle' as const, verification: data.verification, prices: data.prices, verdict: data.verdict,
    })),
  ];
  return createAuditSummary(items, referenceDate);
}

export function formatAuditMarkdown(summary: AuditSummary): string {
  return [
    `# Catalog audit (${summary.referenceDate})`,
    '',
    '| Check | Count |',
    '| --- | ---: |',
    `| Total items | ${summary.totalItems} |`,
    `| Verified | ${summary.verifiedCount} |`,
    `| Draft | ${summary.draftCount} |`,
    `| Stale prices (>90 days) | ${summary.stalePriceCount} |`,
    `| Missing prices | ${summary.missingPriceCount} |`,
    `| Missing verdicts | ${summary.missingVerdictCount} |`,
  ].join('\n');
}
