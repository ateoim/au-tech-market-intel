import { applyCompensationBasis } from './stats';
import type { CompensationBasis, JobRecord } from './types';

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serializes a filtered slice of Australian tech job records into RFC 4180 CSV.
 */
export function recordsToCsv(
  records: JobRecord[],
  basis: CompensationBasis,
): string {
  const compHeader =
    basis === 'total_package'
      ? 'Total Package AUD (incl. 12% Super)'
      : 'Base Salary AUD';

  const headers = [
    'ID',
    'Title',
    'Role Family',
    'City',
    'State',
    'Seniority',
    'Work Mode',
    compHeader,
    'Base Salary AUD',
    'Sector',
    'Quarter',
    'YoY Demand Delta (%)',
    'Days to Fill',
    'Skills',
  ];

  const rows = records.map((r) => [
    r.id,
    r.title,
    r.roleFamily,
    r.city,
    r.state,
    r.seniority,
    r.workMode,
    applyCompensationBasis(r.baseSalaryAud, basis),
    r.baseSalaryAud,
    r.sector,
    r.quarter,
    r.yoyDemandDeltaPct,
    r.daysToFill,
    r.skills.join('; '),
  ]);

  return [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n');
}

/**
 * Triggers a browser download of the filtered CSV market slice.
 */
export function downloadMarketCsv(
  records: JobRecord[],
  basis: CompensationBasis,
  filenamePrefix = 'pulseau-market-slice',
): void {
  const csv = recordsToCsv(records, basis);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `${filenamePrefix}-${basis}-${dateStamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
