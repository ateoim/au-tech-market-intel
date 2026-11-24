import type {
  City,
  CityColMeta,
  JobRecord,
  QuarterlyTrendPoint,
  RoleFamily,
  Seniority,
  SkillMeta,
  TargetRoleProfile,
  WorkMode,
} from './types';

export const CITIES: City[] = [
  'Melbourne',
  'Sydney',
  'Brisbane',
  'Perth',
  'Adelaide',
  'Canberra',
  'Remote AU',
];

export const ROLE_FAMILIES: RoleFamily[] = [
  'AI & ML Engineering',
  'Data Analytics & BI',
  'Business Analysis',
  'Software Engineering',
  'Automation & Platform',
];

export const SENIORITIES: Seniority[] = [
  'Graduate',
  'Mid-Level',
  'Senior',
  'Lead / Principal',
];

export const WORK_MODES: WorkMode[] = ['Hybrid', 'Remote', 'On-site'];

export const CITY_COL_DATA: CityColMeta[] = [
  {
    city: 'Sydney',
    state: 'NSW',
    colIndex: 100,
    medianRentWeeklyAud: 760,
    techHubNote: 'Fintech, enterprise SaaS, and ASX200 headquarters',
  },
  {
    city: 'Melbourne',
    state: 'VIC',
    colIndex: 91,
    medianRentWeeklyAud: 620,
    techHubNote: 'Product engineering, AI labs, banking & retail tech',
  },
  {
    city: 'Canberra',
    state: 'ACT',
    colIndex: 92,
    medianRentWeeklyAud: 660,
    techHubNote: 'Federal government, defence, and cyber platforms',
  },
  {
    city: 'Brisbane',
    state: 'QLD',
    colIndex: 86,
    medianRentWeeklyAud: 610,
    techHubNote: 'Scale-ups, infrastructure, and health-tech delivery',
  },
  {
    city: 'Perth',
    state: 'WA',
    colIndex: 85,
    medianRentWeeklyAud: 630,
    techHubNote: 'Resources automation, industrial AI, and energy analytics',
  },
  {
    city: 'Adelaide',
    state: 'SA',
    colIndex: 79,
    medianRentWeeklyAud: 540,
    techHubNote: 'Defence systems, space tech, and Lot Fourteen startups',
  },
  {
    city: 'Remote AU',
    state: 'NAT',
    colIndex: 87,
    medianRentWeeklyAud: 590,
    techHubNote: 'Distributed ANZ engineering and specialist AI squads',
  },
];

export const SKILLS_CATALOG: SkillMeta[] = [
  // AI & Data
  { name: 'Python', category: 'AI & Data', yoyGrowthPct: 24.5, basePremiumAud: 8500 },
  { name: 'RAG / LLMs', category: 'AI & Data', yoyGrowthPct: 68.4, basePremiumAud: 19500 },
  { name: 'PyTorch', category: 'AI & Data', yoyGrowthPct: 38.2, basePremiumAud: 15000 },
  { name: 'dbt', category: 'AI & Data', yoyGrowthPct: 34.6, basePremiumAud: 9200 },
  { name: 'Snowflake', category: 'AI & Data', yoyGrowthPct: 21.8, basePremiumAud: 8800 },
  { name: 'Databricks', category: 'AI & Data', yoyGrowthPct: 36.1, basePremiumAud: 13200 },
  { name: 'Apache Airflow', category: 'AI & Data', yoyGrowthPct: 16.4, basePremiumAud: 7400 },

  // Engineering
  { name: 'TypeScript', category: 'Engineering', yoyGrowthPct: 26.2, basePremiumAud: 7600 },
  { name: 'React', category: 'Engineering', yoyGrowthPct: 14.8, basePremiumAud: 5400 },
  { name: 'Node.js', category: 'Engineering', yoyGrowthPct: 12.1, basePremiumAud: 5200 },
  { name: 'Go', category: 'Engineering', yoyGrowthPct: 29.4, basePremiumAud: 13800 },
  { name: 'C# / .NET', category: 'Engineering', yoyGrowthPct: 6.3, basePremiumAud: 3400 },
  { name: 'PostgreSQL', category: 'Engineering', yoyGrowthPct: 18.7, basePremiumAud: 5800 },
  { name: 'GraphQL', category: 'Engineering', yoyGrowthPct: 11.2, basePremiumAud: 6200 },

  // Analytics & BI
  { name: 'SQL', category: 'Analytics & BI', yoyGrowthPct: 15.2, basePremiumAud: 4200 },
  { name: 'Power BI', category: 'Analytics & BI', yoyGrowthPct: 19.6, basePremiumAud: 4800 },
  { name: 'Tableau', category: 'Analytics & BI', yoyGrowthPct: 4.8, basePremiumAud: 3100 },
  { name: 'Excel / Power Query', category: 'Analytics & BI', yoyGrowthPct: 3.2, basePremiumAud: 1800 },
  { name: 'Looker', category: 'Analytics & BI', yoyGrowthPct: 13.5, basePremiumAud: 6100 },

  // Cloud & Platform
  { name: 'AWS', category: 'Cloud & Platform', yoyGrowthPct: 22.4, basePremiumAud: 9600 },
  { name: 'Azure', category: 'Cloud & Platform', yoyGrowthPct: 20.9, basePremiumAud: 8400 },
  { name: 'Terraform', category: 'Cloud & Platform', yoyGrowthPct: 31.5, basePremiumAud: 11800 },
  { name: 'Kubernetes', category: 'Cloud & Platform', yoyGrowthPct: 25.3, basePremiumAud: 13400 },
  { name: 'Docker', category: 'Cloud & Platform', yoyGrowthPct: 17.8, basePremiumAud: 5600 },
  { name: 'n8n / Automation', category: 'Cloud & Platform', yoyGrowthPct: 54.7, basePremiumAud: 11400 },

  // Business & Delivery
  { name: 'Requirements Engineering', category: 'Business & Delivery', yoyGrowthPct: 8.9, basePremiumAud: 3600 },
  { name: 'BPMN / Process Mapping', category: 'Business & Delivery', yoyGrowthPct: 11.4, basePremiumAud: 4400 },
  { name: 'Stakeholder Management', category: 'Business & Delivery', yoyGrowthPct: 9.7, basePremiumAud: 4100 },
];

export const QUARTERLY_TRENDS: QuarterlyTrendPoint[] = [
  { quarter: '2024 Q1', activeIndex: 92, medianBaseAud: 134000, aiMlIndex: 78, dataBiIndex: 94, softwareIndex: 95, baIndex: 96, automationIndex: 82 },
  { quarter: '2024 Q2', activeIndex: 95, medianBaseAud: 135500, aiMlIndex: 85, dataBiIndex: 96, softwareIndex: 96, baIndex: 97, automationIndex: 86 },
  { quarter: '2024 Q3', activeIndex: 98, medianBaseAud: 137000, aiMlIndex: 93, dataBiIndex: 99, softwareIndex: 98, baIndex: 98, automationIndex: 91 },
  { quarter: '2024 Q4', activeIndex: 100, medianBaseAud: 138500, aiMlIndex: 100, dataBiIndex: 100, softwareIndex: 100, baIndex: 100, automationIndex: 100 },
  { quarter: '2025 Q1', activeIndex: 104, medianBaseAud: 141000, aiMlIndex: 112, dataBiIndex: 103, softwareIndex: 102, baIndex: 101, automationIndex: 108 },
  { quarter: '2025 Q2', activeIndex: 108, medianBaseAud: 143000, aiMlIndex: 124, dataBiIndex: 107, softwareIndex: 105, baIndex: 103, automationIndex: 116 },
  { quarter: '2025 Q3', activeIndex: 112, medianBaseAud: 145500, aiMlIndex: 135, dataBiIndex: 110, softwareIndex: 108, baIndex: 105, automationIndex: 124 },
  { quarter: '2025 Q4', activeIndex: 115, medianBaseAud: 147500, aiMlIndex: 144, dataBiIndex: 112, softwareIndex: 110, baIndex: 107, automationIndex: 131 },
  { quarter: '2026 Q1', activeIndex: 119, medianBaseAud: 150000, aiMlIndex: 155, dataBiIndex: 116, softwareIndex: 113, baIndex: 109, automationIndex: 139 },
  { quarter: '2026 Q2', activeIndex: 123, medianBaseAud: 152500, aiMlIndex: 164, dataBiIndex: 119, softwareIndex: 116, baIndex: 111, automationIndex: 146 },
  { quarter: '2026 Q3', activeIndex: 127, medianBaseAud: 155000, aiMlIndex: 173, dataBiIndex: 122, softwareIndex: 119, baIndex: 113, automationIndex: 153 },
  { quarter: '2026 Q4', activeIndex: 131, medianBaseAud: 157500, aiMlIndex: 182, dataBiIndex: 125, softwareIndex: 122, baIndex: 115, automationIndex: 161 },
];

export const TARGET_ROLE_PROFILES: TargetRoleProfile[] = [
  {
    id: 'ai-engineer',
    label: 'AI Engineer',
    roleFamily: 'AI & ML Engineering',
    description: 'Production LLM/RAG pipelines, model evaluation, Python backends, and cloud inference deployment.',
    targetSeniority: 'Senior',
    coreSkills: [
      { skill: 'Python', weight: 10 },
      { skill: 'RAG / LLMs', weight: 10 },
      { skill: 'AWS', weight: 8 },
      { skill: 'Docker', weight: 7 },
      { skill: 'PyTorch', weight: 7 },
      { skill: 'TypeScript', weight: 6 },
      { skill: 'PostgreSQL', weight: 6 },
      { skill: 'Kubernetes', weight: 5 },
    ],
  },
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    roleFamily: 'Data Analytics & BI',
    description: 'Commercial analytics, semantic modelling, executive BI dashboards, and modern warehouse workflows.',
    targetSeniority: 'Mid-Level',
    coreSkills: [
      { skill: 'SQL', weight: 10 },
      { skill: 'Power BI', weight: 9 },
      { skill: 'Python', weight: 8 },
      { skill: 'dbt', weight: 8 },
      { skill: 'Snowflake', weight: 7 },
      { skill: 'Excel / Power Query', weight: 6 },
      { skill: 'Stakeholder Management', weight: 6 },
      { skill: 'Looker', weight: 5 },
    ],
  },
  {
    id: 'business-analyst',
    label: 'Business Analyst',
    roleFamily: 'Business Analysis',
    description: 'Requirements discovery, process redesign, data-backed business cases, and cross-functional delivery.',
    targetSeniority: 'Senior',
    coreSkills: [
      { skill: 'Requirements Engineering', weight: 10 },
      { skill: 'Stakeholder Management', weight: 9 },
      { skill: 'BPMN / Process Mapping', weight: 8 },
      { skill: 'SQL', weight: 8 },
      { skill: 'Power BI', weight: 7 },
      { skill: 'Excel / Power Query', weight: 6 },
      { skill: 'n8n / Automation', weight: 6 },
      { skill: 'Azure', weight: 5 },
    ],
  },
  {
    id: 'software-engineer',
    label: 'Software Engineer',
    roleFamily: 'Software Engineering',
    description: 'Full-stack TypeScript web platforms, distributed APIs, relational data stores, and cloud delivery.',
    targetSeniority: 'Senior',
    coreSkills: [
      { skill: 'TypeScript', weight: 10 },
      { skill: 'React', weight: 9 },
      { skill: 'Node.js', weight: 8 },
      { skill: 'PostgreSQL', weight: 8 },
      { skill: 'AWS', weight: 8 },
      { skill: 'Docker', weight: 7 },
      { skill: 'GraphQL', weight: 5 },
      { skill: 'Go', weight: 6 },
    ],
  },
  {
    id: 'automation-platform-engineer',
    label: 'Automation & Platform Engineer',
    roleFamily: 'Automation & Platform',
    description: 'Infrastructure-as-code, workflow orchestration, CI/CD reliability, and AI-assisted operational automation.',
    targetSeniority: 'Senior',
    coreSkills: [
      { skill: 'Terraform', weight: 10 },
      { skill: 'AWS', weight: 9 },
      { skill: 'Kubernetes', weight: 9 },
      { skill: 'n8n / Automation', weight: 8 },
      { skill: 'Python', weight: 8 },
      { skill: 'Docker', weight: 7 },
      { skill: 'Azure', weight: 6 },
      { skill: 'Go', weight: 5 },
    ],
  },
];

// Deterministic PRNG (Mulberry32) so benchmark slices never drift across runs
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T>(rng: () => number, items: { item: T; weight: number }[]): T {
  const total = items.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = rng() * total;
  for (const entry of items) {
    threshold -= entry.weight;
    if (threshold <= 0) return entry.item;
  }
  return items[items.length - 1].item;
}

const CITY_WEIGHTS: { item: City; weight: number }[] = [
  { item: 'Sydney', weight: 28 },
  { item: 'Melbourne', weight: 26 },
  { item: 'Brisbane', weight: 13 },
  { item: 'Remote AU', weight: 12 },
  { item: 'Perth', weight: 9 },
  { item: 'Canberra', weight: 7 },
  { item: 'Adelaide', weight: 5 },
];

const CITY_STATE: Record<City, string> = {
  Sydney: 'NSW',
  Melbourne: 'VIC',
  Brisbane: 'QLD',
  Perth: 'WA',
  Adelaide: 'SA',
  Canberra: 'ACT',
  'Remote AU': 'NAT',
};

const CITY_SALARY_MULT: Record<City, number> = {
  Sydney: 1.07,
  Melbourne: 1.01,
  Canberra: 1.04,
  'Remote AU': 1.0,
  Perth: 0.96,
  Brisbane: 0.95,
  Adelaide: 0.89,
};

const ROLE_WEIGHTS: { item: RoleFamily; weight: number }[] = [
  { item: 'Software Engineering', weight: 26 },
  { item: 'AI & ML Engineering', weight: 21 },
  { item: 'Data Analytics & BI', weight: 20 },
  { item: 'Business Analysis', weight: 17 },
  { item: 'Automation & Platform', weight: 16 },
];

const ROLE_SALARY_MULT: Record<RoleFamily, number> = {
  'AI & ML Engineering': 1.13,
  'Software Engineering': 1.04,
  'Automation & Platform': 1.03,
  'Data Analytics & BI': 0.95,
  'Business Analysis': 0.92,
};

const ROLE_YOY_BASE: Record<RoleFamily, number> = {
  'AI & ML Engineering': 34.2,
  'Automation & Platform': 24.8,
  'Data Analytics & BI': 14.5,
  'Software Engineering': 11.8,
  'Business Analysis': 8.4,
};

const SENIORITY_WEIGHTS: { item: Seniority; weight: number }[] = [
  { item: 'Graduate', weight: 12 },
  { item: 'Mid-Level', weight: 34 },
  { item: 'Senior', weight: 38 },
  { item: 'Lead / Principal', weight: 16 },
];

const SENIORITY_BASE_SALARY: Record<Seniority, number> = {
  Graduate: 84000,
  'Mid-Level': 124000,
  Senior: 164000,
  'Lead / Principal': 206000,
};

const ROLE_TITLES: Record<RoleFamily, Record<Seniority, string[]>> = {
  'AI & ML Engineering': {
    Graduate: ['Junior Machine Learning Engineer', 'Graduate AI Engineer'],
    'Mid-Level': ['AI Engineer', 'Applied ML Engineer', 'LLM Application Engineer'],
    Senior: ['Senior AI Engineer', 'Senior ML Systems Engineer', 'Senior GenAI Engineer'],
    'Lead / Principal': ['Lead AI Architect', 'Principal Machine Learning Engineer'],
  },
  'Data Analytics & BI': {
    Graduate: ['Graduate Data Analyst', 'Junior BI Analyst'],
    'Mid-Level': ['Data Analyst', 'Analytics Engineer', 'Commercial BI Analyst'],
    Senior: ['Senior Data Analyst', 'Senior Analytics Engineer', 'Senior BI Developer'],
    'Lead / Principal': ['Lead Analytics Manager', 'Principal Data Strategist'],
  },
  'Business Analysis': {
    Graduate: ['Junior Business Analyst', 'Graduate Systems Analyst'],
    'Mid-Level': ['Business Analyst', 'Digital Business Analyst', 'Product BA'],
    Senior: ['Senior Business Analyst', 'Senior Technical BA', 'Senior Enterprise BA'],
    'Lead / Principal': ['Lead Business Analyst', 'Principal Transformation BA'],
  },
  'Software Engineering': {
    Graduate: ['Graduate Software Engineer', 'Junior Full-Stack Developer'],
    'Mid-Level': ['Software Engineer', 'Full-Stack TypeScript Engineer', 'Backend Engineer'],
    Senior: ['Senior Software Engineer', 'Senior Full-Stack Engineer', 'Senior Backend Engineer'],
    'Lead / Principal': ['Staff Software Engineer', 'Principal Engineer'],
  },
  'Automation & Platform': {
    Graduate: ['Junior Platform Engineer', 'Graduate Cloud Automation Analyst'],
    'Mid-Level': ['Platform Engineer', 'Workflow Automation Engineer', 'Cloud DevOps Engineer'],
    Senior: ['Senior Platform Engineer', 'Senior Site Reliability Engineer', 'Senior Automation Architect'],
    'Lead / Principal': ['Principal Platform Engineer', 'Head of Cloud Platform'],
  },
};

const ROLE_SKILL_POOLS: Record<RoleFamily, { core: string[]; secondary: string[] }> = {
  'AI & ML Engineering': {
    core: ['Python', 'RAG / LLMs', 'PyTorch', 'AWS', 'Docker'],
    secondary: ['Databricks', 'PostgreSQL', 'TypeScript', 'Kubernetes', 'Apache Airflow', 'Azure', 'n8n / Automation'],
  },
  'Data Analytics & BI': {
    core: ['SQL', 'Power BI', 'Python', 'dbt', 'Snowflake'],
    secondary: ['Tableau', 'Excel / Power Query', 'Looker', 'Databricks', 'Apache Airflow', 'Azure', 'Stakeholder Management'],
  },
  'Business Analysis': {
    core: ['Requirements Engineering', 'Stakeholder Management', 'BPMN / Process Mapping', 'SQL', 'Power BI'],
    secondary: ['Excel / Power Query', 'Tableau', 'n8n / Automation', 'Azure', 'Looker', 'Snowflake'],
  },
  'Software Engineering': {
    core: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    secondary: ['Docker', 'Go', 'C# / .NET', 'GraphQL', 'Kubernetes', 'Python', 'Terraform', 'Azure'],
  },
  'Automation & Platform': {
    core: ['Terraform', 'AWS', 'Kubernetes', 'Docker', 'n8n / Automation'],
    secondary: ['Python', 'Azure', 'Go', 'PostgreSQL', 'Node.js', 'RAG / LLMs', 'Apache Airflow'],
  },
};

const SECTORS = [
  'Financial Services',
  'Enterprise SaaS',
  'Government & Defence',
  'Retail & eCommerce',
  'Energy & Resources',
  'HealthTech',
  'Consulting & Advisory',
  'Telecommunications',
];

const QUARTERS_RECENT = ['2026 Q1', '2026 Q2', '2026 Q3', '2026 Q4'];

const SKILL_PREMIUM_MAP = new Map<string, number>(
  SKILLS_CATALOG.map((s) => [s.name, s.basePremiumAud]),
);

function generateDataset(count: number): JobRecord[] {
  const rng = createRng(20260419);
  const records: JobRecord[] = [];

  for (let i = 0; i < count; i++) {
    const city = pickWeighted(rng, CITY_WEIGHTS);
    const roleFamily = pickWeighted(rng, ROLE_WEIGHTS);
    const seniority = pickWeighted(rng, SENIORITY_WEIGHTS);

    // Work mode depends on city (Remote AU is always Remote)
    let workMode: WorkMode;
    if (city === 'Remote AU') {
      workMode = 'Remote';
    } else if (city === 'Canberra') {
      workMode = pickWeighted(rng, [
        { item: 'Hybrid', weight: 58 },
        { item: 'On-site', weight: 32 },
        { item: 'Remote', weight: 10 },
      ]);
    } else {
      workMode = pickWeighted(rng, [
        { item: 'Hybrid', weight: 64 },
        { item: 'Remote', weight: 22 },
        { item: 'On-site', weight: 14 },
      ]);
    }

    // Select 4-6 unique skills weighted toward role core skills
    const pool = ROLE_SKILL_POOLS[roleFamily];
    const selectedSkills = new Set<string>();
    const coreTarget = 2 + Math.floor(rng() * 3); // 2 to 4 core skills
    const shuffledCore = [...pool.core].sort(() => rng() - 0.5);
    for (let k = 0; k < Math.min(coreTarget, shuffledCore.length); k++) {
      selectedSkills.add(shuffledCore[k]);
    }
    const secTarget = 1 + Math.floor(rng() * 3); // 1 to 3 secondary skills
    const shuffledSec = [...pool.secondary].sort(() => rng() - 0.5);
    for (let k = 0; k < Math.min(secTarget, shuffledSec.length); k++) {
      selectedSkills.add(shuffledSec[k]);
    }
    const skills = Array.from(selectedSkills);

    // Compute realistic AUD base salary
    const base = SENIORITY_BASE_SALARY[seniority];
    const cityMult = CITY_SALARY_MULT[city];
    const roleMult = ROLE_SALARY_MULT[roleFamily];

    // Skill premium contribution (scaled by seniority so grads don't get principal premiums)
    const senioritySkillFactor =
      seniority === 'Graduate' ? 0.35 : seniority === 'Mid-Level' ? 0.65 : seniority === 'Senior' ? 1.0 : 1.2;
    const rawSkillBonus =
      skills.reduce((acc, skill) => acc + (SKILL_PREMIUM_MAP.get(skill) ?? 3000), 0) /
      skills.length;
    const skillLift = (rawSkillBonus - 5500) * senioritySkillFactor * 1.15;

    // Slight Gaussian-like noise using sum of 3 uniforms
    const noise = ((rng() + rng() + rng()) / 3 - 0.5) * 24000;

    const rawSalary = base * cityMult * roleMult + skillLift + noise;
    const baseSalaryAud = Math.max(68000, Math.round(rawSalary / 1000) * 1000);

    const titles = ROLE_TITLES[roleFamily][seniority];
    const title = titles[Math.floor(rng() * titles.length)];
    const sector = SECTORS[Math.floor(rng() * SECTORS.length)];
    const quarter = QUARTERS_RECENT[Math.floor(rng() * QUARTERS_RECENT.length)];
    const daysToFill = Math.round(
      24 +
        (seniority === 'Lead / Principal' ? 18 : seniority === 'Senior' ? 11 : 4) +
        (roleFamily === 'AI & ML Engineering' ? 9 : 0) +
        rng() * 14,
    );
    const yoyDemandDeltaPct = Number(
      (ROLE_YOY_BASE[roleFamily] + (rng() - 0.45) * 8).toFixed(1),
    );

    records.push({
      id: `AU-${String(i + 1).padStart(4, '0')}`,
      title,
      roleFamily,
      city,
      state: CITY_STATE[city],
      seniority,
      workMode,
      baseSalaryAud,
      sector,
      quarter,
      skills,
      daysToFill,
      yoyDemandDeltaPct,
    });
  }

  return records;
}

export const JOB_RECORDS: JobRecord[] = generateDataset(280);
