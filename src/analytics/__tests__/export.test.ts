import { describe, expect, it } from 'vitest';
import { JOB_RECORDS } from '../dataset';
import { recordsToCsv } from '../export';

describe('CSV market slice export', () => {
  it('generates valid RFC 4180 CSV with base salary header and matching row count', () => {
    const slice = JOB_RECORDS.slice(0, 5);
    const csv = recordsToCsv(slice, 'base');
    const lines = csv.split('\r\n');
    expect(lines.length).toBe(6);
    expect(lines[0]).toContain('Base Salary AUD');
    expect(lines[0]).not.toContain('incl. 12% Super');
    expect(lines[1]).toContain(slice[0].id);
  });

  it('applies 12% super header and adjusted compensation when total_package is active', () => {
    const sample = JOB_RECORDS[0];
    const csv = recordsToCsv([sample], 'total_package');
    const lines = csv.split('\r\n');
    expect(lines[0]).toContain('Total Package AUD (incl. 12% Super)');
    const expectedPkg = Math.round(sample.baseSalaryAud * 1.12);
    expect(lines[1]).toContain(String(expectedPkg));
  });
});
