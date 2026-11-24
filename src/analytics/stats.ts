import { CITY_COL_DATA, ROLE_FAMILIES, SKILLS_CATALOG } from './dataset';
import type {
  CityComparisonMetric,
  CompensationBasis,
  JobRecord,
  KpiSummary,
  MarketFilters,
  PercentileSummary,
  RoleBandSummary,
  RoleFamily,
  SkillLiftEstimate,
  SkillQuadrant,
  SkillsGapResult,
  SkillVelocityMetric,
  TargetRoleProfile,
} from './types';

/** Statutory Australian Superannuation Guarantee rate (12% from 1 July 2025). */
export const SUPER_GUARANTEE_RATE = 0.12;

export const DEFAULT_FILTERS: MarketFilters = {
  cities: [],
  roleFamilies: [],
  seniorities: [],
  workModes: [],
  compensationBasis: 'base',
};

const ROLE_SHORT_LABELS: Record<RoleFamily, string> = {
  'AI & ML Engineering': 'AI & ML',
  'Data Analytics & BI': 'Data & BI',
  'Business Analysis': 'Business Analysis',
  'Software Engineering': 'Software Eng',
  'Automation & Platform': 'Automation & Platform',
};

/**
 * Converts a base AUD salary to either base or total package (incl. 12% Super).
 */
export function applyCompensationBasis(
  baseSalaryAud: number,
  basis: CompensationBasis,
): number {
  if (basis === 'total_package') {
    return Math.round(baseSalaryAud * (1 + SUPER_GUARANTEE_RATE));
  }
  return Math.round(baseSalaryAud);
}

/**
 * Computes exact linear-interpolation percentile (R-7 / Hyndman-Fan type 7)
 * on an array of numbers (does not mutate input).
 */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  if (p <= 0) return Math.min(...values);
  if (p >= 100) return Math.max(...values);

  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];

  const rank = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) return sorted[lower];

  const weight = rank - lower;
  return sorted[lower] + weight * (sorted[upper] - sorted[lower]);
}

export function computePercentiles(values: number[]): PercentileSummary {
  if (values.length === 0) {
    return {
      count: 0,
      min: 0,
      p10: 0,
      p25: 0,
      p50: 0,
      p75: 0,
      p90: 0,
      max: 0,
      mean: 0,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);

  return {
    count: sorted.length,
    min: sorted[0],
    p10: Math.round(percentile(sorted, 10)),
    p25: Math.round(percentile(sorted, 25)),
    p50: Math.round(percentile(sorted, 50)),
    p75: Math.round(percentile(sorted, 75)),
    p90: Math.round(percentile(sorted, 90)),
    max: sorted[sorted.length - 1],
    mean: Math.round(sum / sorted.length),
  };
}

/**
 * Filters market records by all active multi-facet criteria.
 * An empty array for any facet means "all values included".
 */
export function filterRecords(
  records: JobRecord[],
  filters: MarketFilters,
): JobRecord[] {
  return records.filter((record) => {
    if (filters.cities.length > 0 && !filters.cities.includes(record.city)) {
      return false;
    }
    if (
      filters.roleFamilies.length > 0 &&
      !filters.roleFamilies.includes(record.roleFamily)
    ) {
      return false;
    }
    if (
      filters.seniorities.length > 0 &&
      !filters.seniorities.includes(record.seniority)
    ) {
      return false;
    }
    if (
      filters.workModes.length > 0 &&
      !filters.workModes.includes(record.workMode)
    ) {
      return false;
    }
    return true;
  });
}

export function computeKpiSummary(
  records: JobRecord[],
  basis: CompensationBasis,
  totalUniverseSize = 280,
): KpiSummary {
  if (records.length === 0) {
    return {
      sampleSize: 0,
      medianCompAud: 0,
      p25CompAud: 0,
      p75CompAud: 0,
      activeRoleIndex: 0,
      yoyDemandGrowthPct: 0,
      remoteHybridSharePct: 0,
      avgDaysToFill: 0,
    };
  }

  const comps = records.map((r) => applyCompensationBasis(r.baseSalaryAud, basis));
  const stats = computePercentiles(comps);

  const avgYoy =
    records.reduce((sum, r) => sum + r.yoyDemandDeltaPct, 0) / records.length;
  const remoteHybridCount = records.filter(
    (r) => r.workMode === 'Hybrid' || r.workMode === 'Remote',
  ).length;
  const avgDays =
    records.reduce((sum, r) => sum + r.daysToFill, 0) / records.length;

  // Active Role Index: 100 = 2024 Q4 national baseline; scales with slice share and YoY momentum
  const activeRoleIndex = Math.round(
    100 * (records.length / Math.max(1, totalUniverseSize)) * (1 + avgYoy / 100) * 1.12,
  );

  return {
    sampleSize: records.length,
    medianCompAud: stats.p50,
    p25CompAud: stats.p25,
    p75CompAud: stats.p75,
    activeRoleIndex: Math.max(1, activeRoleIndex),
    yoyDemandGrowthPct: Number(avgYoy.toFixed(1)),
    remoteHybridSharePct: Number(
      ((remoteHybridCount / records.length) * 100).toFixed(1),
    ),
    avgDaysToFill: Math.round(avgDays),
  };
}

export function computeRoleSalaryBands(
  records: JobRecord[],
  basis: CompensationBasis,
): RoleBandSummary[] {
  return ROLE_FAMILIES.map((roleFamily) => {
    const group = records.filter((r) => r.roleFamily === roleFamily);
    if (group.length === 0) {
      return {
        roleFamily,
        shortLabel: ROLE_SHORT_LABELS[roleFamily],
        count: 0,
        p25: 0,
        p50: 0,
        p75: 0,
        p90: 0,
        mean: 0,
        yoyGrowthPct: 0,
      };
    }

    const comps = group.map((r) => applyCompensationBasis(r.baseSalaryAud, basis));
    const stats = computePercentiles(comps);
    const avgYoy =
      group.reduce((sum, r) => sum + r.yoyDemandDeltaPct, 0) / group.length;

    return {
      roleFamily,
      shortLabel: ROLE_SHORT_LABELS[roleFamily],
      count: group.length,
      p25: stats.p25,
      p50: stats.p50,
      p75: stats.p75,
      p90: stats.p90,
      mean: stats.mean,
      yoyGrowthPct: Number(avgYoy.toFixed(1)),
    };
  }).filter((band) => band.count > 0);
}

/**
 * Computes Skill Demand Volume, YoY Growth Rate, and Median Salary Premium
 * relative to the filtered slice baseline.
 */
export function computeSkillVelocity(
  records: JobRecord[],
  basis: CompensationBasis,
): SkillVelocityMetric[] {
  if (records.length === 0) return [];

  const allComps = records.map((r) => applyCompensationBasis(r.baseSalaryAud, basis));
  const baselineMedian = computePercentiles(allComps).p50;

  const results: SkillVelocityMetric[] = [];

  for (const meta of SKILLS_CATALOG) {
    const matching = records.filter((r) => r.skills.includes(meta.name));
    if (matching.length === 0) continue;

    const comps = matching.map((r) => applyCompensationBasis(r.baseSalaryAud, basis));
    const skillMedian = computePercentiles(comps).p50;
    const demandSharePct = Number(((matching.length / records.length) * 100).toFixed(1));
    const salaryPremiumAud = Math.round(skillMedian - baselineMedian);

    let quadrant: SkillQuadrant;
    if (demandSharePct >= 18 && meta.yoyGrowthPct >= 22) {
      quadrant = 'Surging Core';
    } else if (demandSharePct < 18 && meta.yoyGrowthPct >= 22) {
      quadrant = 'Breakout Niche';
    } else if (demandSharePct >= 18 && meta.yoyGrowthPct < 22) {
      quadrant = 'Established Staple';
    } else {
      quadrant = 'Mature / Steady';
    }

    results.push({
      skill: meta.name,
      category: meta.category,
      demandCount: matching.length,
      demandSharePct,
      yoyGrowthPct: meta.yoyGrowthPct,
      medianCompAud: skillMedian,
      salaryPremiumAud,
      quadrant,
    });
  }

  return results.sort((a, b) => b.demandCount - a.demandCount);
}

/**
 * Computes side-by-side Australian city comparison with Cost-of-Living
 * normalization (Sydney COL = 100 baseline).
 *
 * COL-adjusted compensation = nominalMedian / (colIndex / 100)
 * Purchasing Power Index = (colAdjusted / sydneyNominalOrMean) * 100
 */
export function computeCityComparison(
  records: JobRecord[],
  basis: CompensationBasis,
): CityComparisonMetric[] {
  if (records.length === 0) return [];

  const rawRows = CITY_COL_DATA.map((meta) => {
    const group = records.filter((r) => r.city === meta.city);
    if (group.length === 0) return null;

    const comps = group.map((r) => applyCompensationBasis(r.baseSalaryAud, basis));
    const nominalMedianAud = computePercentiles(comps).p50;
    const colAdjustedAud = Math.round(nominalMedianAud / (meta.colIndex / 100));

    const remoteHybridCount = group.filter(
      (r) => r.workMode === 'Hybrid' || r.workMode === 'Remote',
    ).length;

    // Find top role family in this city
    const roleCounts = new Map<RoleFamily, number>();
    for (const r of group) {
      roleCounts.set(r.roleFamily, (roleCounts.get(r.roleFamily) ?? 0) + 1);
    }
    let topRoleFamily: RoleFamily = group[0].roleFamily;
    let maxCount = 0;
    for (const [rf, cnt] of roleCounts.entries()) {
      if (cnt > maxCount) {
        maxCount = cnt;
        topRoleFamily = rf;
      }
    }

    return {
      city: meta.city,
      state: meta.state,
      count: group.length,
      sharePct: Number(((group.length / records.length) * 100).toFixed(1)),
      nominalMedianAud,
      colIndex: meta.colIndex,
      colAdjustedAud,
      remoteHybridSharePct: Number(((remoteHybridCount / group.length) * 100).toFixed(1)),
      topRoleFamily,
      medianRentWeeklyAud: meta.medianRentWeeklyAud,
      techHubNote: meta.techHubNote,
    };
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  if (rawRows.length === 0) return [];

  // Reference baseline: Sydney if present in slice, otherwise slice mean COL-adjusted comp
  const sydneyRow = rawRows.find((r) => r.city === 'Sydney');
  const referenceBaseline =
    sydneyRow?.colAdjustedAud ??
    Math.round(
      rawRows.reduce((sum, r) => sum + r.colAdjustedAud, 0) / rawRows.length,
    );

  return rawRows
    .map((row) => ({
      ...row,
      purchasingPowerIndex: Number(
        ((row.colAdjustedAud / Math.max(1, referenceBaseline)) * 100).toFixed(1),
      ),
    }))
    .sort((a, b) => b.colAdjustedAud - a.colAdjustedAud);
}

/**
 * Estimates Role Readiness Score (%) and per-skill AUD salary lift using
 * seniority-controlled residual compensation differential within the target role family.
 */
export function computeSkillsGap(
  records: JobRecord[],
  profile: TargetRoleProfile,
  ownedSkills: string[],
  basis: CompensationBasis,
): SkillsGapResult {
  const ownedSet = new Set(ownedSkills);
  const roleRecords = records.filter((r) => r.roleFamily === profile.roleFamily);
  const workingSet = roleRecords.length >= 6 ? roleRecords : records;

  const totalWeight = profile.coreSkills.reduce((sum, s) => sum + s.weight, 0);
  const matchedWeight = profile.coreSkills
    .filter((s) => ownedSet.has(s.skill))
    .reduce((sum, s) => sum + s.weight, 0);

  const readinessScorePct =
    totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  const matchedSkills = profile.coreSkills
    .filter((s) => ownedSet.has(s.skill))
    .map((s) => s.skill);

  // Compute seniority group means to residualize compensation (prevents seniority confounding)
  const senioritySums = new Map<string, { sum: number; count: number }>();
  for (const r of workingSet) {
    const comp = applyCompensationBasis(r.baseSalaryAud, basis);
    const entry = senioritySums.get(r.seniority) ?? { sum: 0, count: 0 };
    entry.sum += comp;
    entry.count += 1;
    senioritySums.set(r.seniority, entry);
  }
  const seniorityMeans = new Map<string, number>();
  for (const [sen, entry] of senioritySums.entries()) {
    seniorityMeans.set(sen, entry.sum / entry.count);
  }

  const skillMetaMap = new Map(SKILLS_CATALOG.map((s) => [s.name, s]));
  const superMultiplier = basis === 'total_package' ? 1 + SUPER_GUARANTEE_RATE : 1;

  const missingSkills: SkillLiftEstimate[] = profile.coreSkills
    .filter((s) => !ownedSet.has(s.skill))
    .map((coreItem) => {
      const meta = skillMetaMap.get(coreItem.skill);
      const withSkill = workingSet.filter((r) => r.skills.includes(coreItem.skill));
      const withoutSkill = workingSet.filter((r) => !r.skills.includes(coreItem.skill));

      let empiricalLift = 0;
      if (withSkill.length >= 2 && withoutSkill.length >= 2) {
        const meanResidualWith =
          withSkill.reduce((sum, r) => {
            const comp = applyCompensationBasis(r.baseSalaryAud, basis);
            return sum + (comp - (seniorityMeans.get(r.seniority) ?? comp));
          }, 0) / withSkill.length;

        const meanResidualWithout =
          withoutSkill.reduce((sum, r) => {
            const comp = applyCompensationBasis(r.baseSalaryAud, basis);
            return sum + (comp - (seniorityMeans.get(r.seniority) ?? comp));
          }, 0) / withoutSkill.length;

        empiricalLift = meanResidualWith - meanResidualWithout;
      }

      // Shrink empirical estimate toward structural skill prior to keep small-slice estimates stable
      const priorLift = (meta?.basePremiumAud ?? 5000) * superMultiplier * 0.72;
      const sampleWeight = Math.min(0.65, withSkill.length / 24);
      const blendedLift = Math.max(
        2000,
        Math.round((sampleWeight * Math.max(0, empiricalLift) + (1 - sampleWeight) * priorLift) / 500) * 500,
      );

      const demandSharePct =
        workingSet.length > 0
          ? Number(((withSkill.length / workingSet.length) * 100).toFixed(1))
          : 0;

      return {
        skill: coreItem.skill,
        category: meta?.category ?? 'Engineering',
        weight: coreItem.weight,
        estimatedLiftAud: blendedLift,
        marketDemandSharePct: demandSharePct,
        yoyGrowthPct: meta?.yoyGrowthPct ?? 12.0,
      };
    })
    .sort((a, b) => b.estimatedLiftAud - a.estimatedLiftAud);

  const targetSeniorityRecords = workingSet.filter(
    (r) => r.seniority === profile.targetSeniority,
  );
  const targetPool =
    targetSeniorityRecords.length >= 3 ? targetSeniorityRecords : workingSet;
  const targetMedianCompAud =
    targetPool.length > 0
      ? computePercentiles(
          targetPool.map((r) => applyCompensationBasis(r.baseSalaryAud, basis)),
        ).p50
      : 0;

  // Diminishing-returns cap so total lift stays realistic relative to role band
  const rawMissingSum = missingSkills.reduce((sum, s) => sum + s.estimatedLiftAud, 0);
  const totalPotentialLiftAud = Math.round(
    Math.min(rawMissingSum, targetMedianCompAud * 0.34) / 500,
  ) * 500;

  const currentEstimatedCompAud = Math.max(
    65000,
    Math.round((targetMedianCompAud - totalPotentialLiftAud) / 500) * 500,
  );

  return {
    roleId: profile.id,
    roleLabel: profile.label,
    readinessScorePct,
    matchedSkills,
    missingSkills,
    currentEstimatedCompAud,
    targetMedianCompAud,
    totalPotentialLiftAud,
    sampleSize: workingSet.length,
  };
}
