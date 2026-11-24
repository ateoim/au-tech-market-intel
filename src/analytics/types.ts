export type City =
  | 'Melbourne'
  | 'Sydney'
  | 'Brisbane'
  | 'Perth'
  | 'Adelaide'
  | 'Canberra'
  | 'Remote AU';

export type RoleFamily =
  | 'AI & ML Engineering'
  | 'Data Analytics & BI'
  | 'Business Analysis'
  | 'Software Engineering'
  | 'Automation & Platform';

export type Seniority =
  | 'Graduate'
  | 'Mid-Level'
  | 'Senior'
  | 'Lead / Principal';

export type WorkMode = 'Hybrid' | 'Remote' | 'On-site';

export type CompensationBasis = 'base' | 'total_package';

export type SkillCategory =
  | 'AI & Data'
  | 'Engineering'
  | 'Analytics & BI'
  | 'Cloud & Platform'
  | 'Business & Delivery';

export interface SkillMeta {
  name: string;
  category: SkillCategory;
  yoyGrowthPct: number;
  basePremiumAud: number;
}

export interface JobRecord {
  id: string;
  title: string;
  roleFamily: RoleFamily;
  city: City;
  state: string;
  seniority: Seniority;
  workMode: WorkMode;
  baseSalaryAud: number;
  sector: string;
  quarter: string;
  skills: string[];
  daysToFill: number;
  yoyDemandDeltaPct: number;
}

export interface CityColMeta {
  city: City;
  state: string;
  colIndex: number; // Sydney = 100 baseline
  medianRentWeeklyAud: number;
  techHubNote: string;
}

export interface QuarterlyTrendPoint {
  quarter: string;
  activeIndex: number;
  medianBaseAud: number;
  aiMlIndex: number;
  dataBiIndex: number;
  softwareIndex: number;
  baIndex: number;
  automationIndex: number;
}

export interface MarketFilters {
  cities: City[];
  roleFamilies: RoleFamily[];
  seniorities: Seniority[];
  workModes: WorkMode[];
  compensationBasis: CompensationBasis;
}

export interface PercentileSummary {
  count: number;
  min: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  max: number;
  mean: number;
}

export interface KpiSummary {
  sampleSize: number;
  medianCompAud: number;
  p25CompAud: number;
  p75CompAud: number;
  activeRoleIndex: number;
  yoyDemandGrowthPct: number;
  remoteHybridSharePct: number;
  avgDaysToFill: number;
}

export interface RoleBandSummary {
  roleFamily: RoleFamily;
  shortLabel: string;
  count: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  mean: number;
  yoyGrowthPct: number;
}

export type SkillQuadrant =
  | 'Surging Core'
  | 'Breakout Niche'
  | 'Established Staple'
  | 'Mature / Steady';

export interface SkillVelocityMetric {
  skill: string;
  category: SkillCategory;
  demandCount: number;
  demandSharePct: number;
  yoyGrowthPct: number;
  medianCompAud: number;
  salaryPremiumAud: number;
  quadrant: SkillQuadrant;
}

export interface CityComparisonMetric {
  city: City;
  state: string;
  count: number;
  sharePct: number;
  nominalMedianAud: number;
  colIndex: number;
  colAdjustedAud: number;
  purchasingPowerIndex: number;
  remoteHybridSharePct: number;
  topRoleFamily: RoleFamily;
  medianRentWeeklyAud: number;
  techHubNote: string;
}

export interface TargetRoleSkill {
  skill: string;
  weight: number; // 1-10 importance weight
}

export interface TargetRoleProfile {
  id: string;
  label: string;
  roleFamily: RoleFamily;
  description: string;
  targetSeniority: Seniority;
  coreSkills: TargetRoleSkill[];
}

export interface SkillLiftEstimate {
  skill: string;
  category: SkillCategory;
  weight: number;
  estimatedLiftAud: number;
  marketDemandSharePct: number;
  yoyGrowthPct: number;
}

export interface SkillsGapResult {
  roleId: string;
  roleLabel: string;
  readinessScorePct: number;
  matchedSkills: string[];
  missingSkills: SkillLiftEstimate[];
  currentEstimatedCompAud: number;
  targetMedianCompAud: number;
  totalPotentialLiftAud: number;
  sampleSize: number;
}
