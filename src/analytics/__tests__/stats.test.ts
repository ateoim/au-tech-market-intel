import { describe, expect, it } from 'vitest';
import {
  CITIES,
  CITY_COL_DATA,
  JOB_RECORDS,
  ROLE_FAMILIES,
  SKILLS_CATALOG,
  TARGET_ROLE_PROFILES,
} from '../dataset';
import {
  applyCompensationBasis,
  computeCityComparison,
  computeKpiSummary,
  computePercentiles,
  computeRoleSalaryBands,
  computeSkillsGap,
  computeSkillVelocity,
  DEFAULT_FILTERS,
  filterRecords,
  percentile,
  SUPER_GUARANTEE_RATE,
} from '../stats';
import type { MarketFilters } from '../types';

describe('dataset integrity', () => {
  it('contains 280 deterministic records covering all 7 cities, 5 role families, and 28 skills', () => {
    expect(JOB_RECORDS.length).toBeGreaterThanOrEqual(240);
    expect(JOB_RECORDS.length).toBe(280);
    expect(SKILLS_CATALOG.length).toBe(28);
    expect(CITY_COL_DATA.length).toBe(7);

    const observedCities = new Set(JOB_RECORDS.map((r) => r.city));
    const observedRoles = new Set(JOB_RECORDS.map((r) => r.roleFamily));
    for (const city of CITIES) {
      expect(observedCities.has(city)).toBe(true);
    }
    for (const role of ROLE_FAMILIES) {
      expect(observedRoles.has(role)).toBe(true);
    }
  });
});

describe('percentile & statistical primitives', () => {
  it('computes exact linear-interpolation percentiles (R-7) without mutating input', () => {
    const unsorted = [200, 100, 150, 120, 180];
    const snapshot = [...unsorted];
    expect(percentile(unsorted, 0)).toBe(100);
    expect(percentile(unsorted, 25)).toBe(120);
    expect(percentile(unsorted, 50)).toBe(150);
    expect(percentile(unsorted, 75)).toBe(180);
    expect(percentile(unsorted, 100)).toBe(200);
    expect(unsorted).toEqual(snapshot);
  });

  it('interpolates fractional ranks accurately on even-length arrays', () => {
    const values = [100, 120, 160, 200];
    // rank for p50 = 0.5 * 3 = 1.5 => 120 + 0.5 * (160 - 120) = 140
    expect(percentile(values, 50)).toBe(140);
    // rank for p25 = 0.25 * 3 = 0.75 => 100 + 0.75 * (120 - 100) = 115
    expect(percentile(values, 25)).toBe(115);
    // rank for p90 = 0.9 * 3 = 2.7 => 160 + 0.7 * (200 - 160) = 188
    expect(percentile(values, 90)).toBeCloseTo(188, 6);
  });

  it('handles empty and single-element arrays gracefully', () => {
    expect(percentile([], 50)).toBe(0);
    expect(percentile([145000], 90)).toBe(145000);
    const emptySummary = computePercentiles([]);
    expect(emptySummary.count).toBe(0);
    expect(emptySummary.p50).toBe(0);
  });

  it('produces monotonically non-decreasing percentile bands on full dataset', () => {
    const salaries = JOB_RECORDS.map((r) => r.baseSalaryAud);
    const summary = computePercentiles(salaries);
    expect(summary.min).toBeLessThanOrEqual(summary.p10);
    expect(summary.p10).toBeLessThanOrEqual(summary.p25);
    expect(summary.p25).toBeLessThanOrEqual(summary.p50);
    expect(summary.p50).toBeLessThanOrEqual(summary.p75);
    expect(summary.p75).toBeLessThanOrEqual(summary.p90);
    expect(summary.p90).toBeLessThanOrEqual(summary.max);
  });
});

describe('superannuation compensation basis math', () => {
  it('applies exact 12% Australian Superannuation Guarantee rate for total package', () => {
    expect(SUPER_GUARANTEE_RATE).toBe(0.12);
    expect(applyCompensationBasis(100000, 'base')).toBe(100000);
    expect(applyCompensationBasis(100000, 'total_package')).toBe(112000);
    expect(applyCompensationBasis(155000, 'total_package')).toBe(173600);
  });

  it('scales KPI median and quartiles consistently when toggling base vs total package', () => {
    const baseKpi = computeKpiSummary(JOB_RECORDS, 'base');
    const pkgKpi = computeKpiSummary(JOB_RECORDS, 'total_package');
    expect(pkgKpi.medianCompAud).toBeCloseTo(baseKpi.medianCompAud * 1.12, -2);
    expect(pkgKpi.p75CompAud).toBeCloseTo(baseKpi.p75CompAud * 1.12, -2);
    expect(pkgKpi.sampleSize).toBe(baseKpi.sampleSize);
  });
});

describe('multi-facet filtering', () => {
  it('returns all records when no facet filters are selected', () => {
    const result = filterRecords(JOB_RECORDS, DEFAULT_FILTERS);
    expect(result.length).toBe(JOB_RECORDS.length);
  });

  it('filters accurately by city, role family, seniority, and work mode', () => {
    const filters: MarketFilters = {
      cities: ['Melbourne', 'Sydney'],
      roleFamilies: ['AI & ML Engineering'],
      seniorities: ['Senior', 'Lead / Principal'],
      workModes: ['Hybrid', 'Remote'],
      compensationBasis: 'base',
    };
    const filtered = filterRecords(JOB_RECORDS, filters);
    expect(filtered.length).toBeGreaterThan(0);
    for (const r of filtered) {
      expect(['Melbourne', 'Sydney']).toContain(r.city);
      expect(r.roleFamily).toBe('AI & ML Engineering');
      expect(['Senior', 'Lead / Principal']).toContain(r.seniority);
      expect(['Hybrid', 'Remote']).toContain(r.workMode);
    }
  });

  it('enforces Remote AU listings are always Remote work mode', () => {
    const remoteAuOnSite = filterRecords(JOB_RECORDS, {
      ...DEFAULT_FILTERS,
      cities: ['Remote AU'],
      workModes: ['On-site'],
    });
    expect(remoteAuOnSite.length).toBe(0);
  });
});

describe('role salary bands & skill velocity', () => {
  it('computes ordered percentile bands for all 5 role families', () => {
    const bands = computeRoleSalaryBands(JOB_RECORDS, 'base');
    expect(bands.length).toBe(5);
    for (const band of bands) {
      expect(band.p25).toBeLessThanOrEqual(band.p50);
      expect(band.p50).toBeLessThanOrEqual(band.p75);
      expect(band.p75).toBeLessThanOrEqual(band.p90);
    }
  });

  it('ranks skills by demand volume and classifies high-growth skills like RAG / LLMs', () => {
    const skills = computeSkillVelocity(JOB_RECORDS, 'base');
    expect(skills.length).toBeGreaterThan(20);
    // Sorted descending by demand count
    for (let i = 1; i < skills.length; i++) {
      expect(skills[i - 1].demandCount).toBeGreaterThanOrEqual(skills[i].demandCount);
    }
    const rag = skills.find((s) => s.skill === 'RAG / LLMs');
    expect(rag).toBeDefined();
    expect(rag!.yoyGrowthPct).toBeGreaterThan(50);
    expect(rag!.salaryPremiumAud).toBeGreaterThan(0);
  });
});

describe('city & cost-of-living normalization', () => {
  it('anchors Sydney at COL 100 and purchasing power index 100.0', () => {
    const cities = computeCityComparison(JOB_RECORDS, 'base');
    const sydney = cities.find((c) => c.city === 'Sydney');
    expect(sydney).toBeDefined();
    expect(sydney!.colIndex).toBe(100);
    expect(sydney!.colAdjustedAud).toBe(sydney!.nominalMedianAud);
    expect(sydney!.purchasingPowerIndex).toBe(100);
  });

  it('gives lower-COL cities higher COL-adjusted purchasing power than nominal median', () => {
    const cities = computeCityComparison(JOB_RECORDS, 'base');
    const melbourne = cities.find((c) => c.city === 'Melbourne');
    const brisbane = cities.find((c) => c.city === 'Brisbane');
    expect(melbourne).toBeDefined();
    expect(brisbane).toBeDefined();
    expect(melbourne!.colAdjustedAud).toBeGreaterThan(melbourne!.nominalMedianAud);
    expect(brisbane!.colAdjustedAud).toBeGreaterThan(brisbane!.nominalMedianAud);
  });

  it('sorts cities descending by COL-adjusted compensation', () => {
    const cities = computeCityComparison(JOB_RECORDS, 'total_package');
    for (let i = 1; i < cities.length; i++) {
      expect(cities[i - 1].colAdjustedAud).toBeGreaterThanOrEqual(
        cities[i].colAdjustedAud,
      );
    }
  });
});

describe('career path & skills-gap analyser', () => {
  const aiProfile = TARGET_ROLE_PROFILES.find((p) => p.id === 'ai-engineer')!;

  it('returns 0% readiness when candidate holds no core skills', () => {
    const result = computeSkillsGap(JOB_RECORDS, aiProfile, [], 'base');
    expect(result.readinessScorePct).toBe(0);
    expect(result.matchedSkills).toHaveLength(0);
    expect(result.missingSkills).toHaveLength(aiProfile.coreSkills.length);
    expect(result.totalPotentialLiftAud).toBeGreaterThan(0);
  });

  it('returns 100% readiness and zero missing skills when all core skills are owned', () => {
    const allCore = aiProfile.coreSkills.map((s) => s.skill);
    const result = computeSkillsGap(JOB_RECORDS, aiProfile, allCore, 'base');
    expect(result.readinessScorePct).toBe(100);
    expect(result.missingSkills).toHaveLength(0);
    expect(result.totalPotentialLiftAud).toBe(0);
    expect(result.currentEstimatedCompAud).toBe(result.targetMedianCompAud);
  });

  it('increases readiness score and decreases remaining salary lift as skills are added', () => {
    const partial = computeSkillsGap(JOB_RECORDS, aiProfile, ['Python', 'Docker'], 'base');
    const stronger = computeSkillsGap(
      JOB_RECORDS,
      aiProfile,
      ['Python', 'Docker', 'RAG / LLMs', 'AWS'],
      'base',
    );
    expect(stronger.readinessScorePct).toBeGreaterThan(partial.readinessScorePct);
    expect(stronger.totalPotentialLiftAud).toBeLessThan(partial.totalPotentialLiftAud);
    expect(stronger.currentEstimatedCompAud).toBeGreaterThan(
      partial.currentEstimatedCompAud,
    );
  });

  it('scales estimated skill lift upward when total package (incl. 12% super) is selected', () => {
    const baseGap = computeSkillsGap(JOB_RECORDS, aiProfile, ['Python'], 'base');
    const pkgGap = computeSkillsGap(JOB_RECORDS, aiProfile, ['Python'], 'total_package');
    expect(pkgGap.targetMedianCompAud).toBeGreaterThan(baseGap.targetMedianCompAud);
    expect(pkgGap.totalPotentialLiftAud).toBeGreaterThanOrEqual(
      baseGap.totalPotentialLiftAud,
    );
  });
});
