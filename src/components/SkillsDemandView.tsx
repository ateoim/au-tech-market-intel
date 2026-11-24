import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type {
  CompensationBasis,
  SkillCategory,
  SkillVelocityMetric,
} from '../analytics/types';
import { formatAud, formatSignedAud, formatSignedPct } from '../utils/format';

interface SkillsDemandViewProps {
  skills: SkillVelocityMetric[];
  basis: CompensationBasis;
}

type SortKey = 'demandCount' | 'yoyGrowthPct' | 'medianCompAud' | 'salaryPremiumAud';

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  'AI & Data': '#D97706',
  Engineering: '#0F292E',
  'Analytics & BI': '#0D9488',
  'Cloud & Platform': '#2563EB',
  'Business & Delivery': '#64748B',
};

const ALL_CATEGORIES: SkillCategory[] = [
  'AI & Data',
  'Engineering',
  'Analytics & BI',
  'Cloud & Platform',
  'Business & Delivery',
];

export function SkillsDemandView({ skills, basis }: SkillsDemandViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('demandCount');
  const [sortAsc, setSortAsc] = useState(false);

  const visibleSkills = useMemo(() => {
    const filtered =
      selectedCategory === 'ALL'
        ? skills
        : skills.filter((s) => s.category === selectedCategory);
    return [...filtered].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    });
  }, [skills, selectedCategory, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const quadrantBadge = (quadrant: SkillVelocityMetric['quadrant']) => {
    switch (quadrant) {
      case 'Surging Core':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'Breakout Niche':
        return 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]';
      case 'Established Staple':
        return 'bg-[#E2E8F0] text-[#334155] border-[#CBD5E1]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#0F292E] tracking-tight">
            Skills Demand &amp; Velocity Quadrant
          </h2>
          <p className="text-sm text-[#556B70] mt-1">
            Mapping technical &amp; analytical capability demand share against YoY growth and median AUD salary premium.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#0F292E] text-white border-[#0F292E]'
                : 'bg-white text-[#4F656A] border-[#D2DDDA] hover:border-[#0D9488]'
            }`}
          >
            All ({skills.length})
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F292E] text-white border-[#0F292E]'
                  : 'bg-white text-[#4F656A] border-[#D2DDDA] hover:border-[#0D9488]'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quadrant Scatter Chart */}
      <div className="bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#0F292E]">
              Demand Share (%) vs YoY Growth Rate (%)
            </h3>
            <p className="text-xs text-[#64797E]">
              Bubble size reflects median compensation ({basis === 'total_package' ? 'incl. 12% Super' : 'Base AUD'}). Reference lines mark 18% demand share and +22% YoY growth.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono-num text-[#556B70]">
            <span className="px-2 py-0.5 rounded bg-[#FEF3C7]/70 text-[#B45309]">
              Top-Right: Surging Core
            </span>
            <span className="px-2 py-0.5 rounded bg-[#CCFBF1]/70 text-[#0F766E]">
              Top-Left: Breakout Niche
            </span>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 24, bottom: 20, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECEA" />
              <XAxis
                type="number"
                dataKey="demandSharePct"
                name="Demand Share"
                unit="%"
                tick={{ fontSize: 11, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                axisLine={{ stroke: '#D2DDDA' }}
                label={{
                  value: 'Market Demand Share (% of slice)',
                  position: 'insideBottom',
                  offset: -12,
                  style: { fontSize: 11, fill: '#556B70' },
                }}
              />
              <YAxis
                type="number"
                dataKey="yoyGrowthPct"
                name="YoY Growth"
                unit="%"
                tick={{ fontSize: 11, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                axisLine={{ stroke: '#D2DDDA' }}
                label={{
                  value: 'YoY Growth (%)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#556B70' },
                }}
              />
              <ZAxis
                type="number"
                dataKey="medianCompAud"
                range={[70, 360]}
                name="Median Comp"
              />
              <ReferenceLine x={18} stroke="#94A3B8" strokeDasharray="4 4" />
              <ReferenceLine y={22} stroke="#94A3B8" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const item = payload[0].payload as SkillVelocityMetric;
                  return (
                    <div className="bg-white border border-[#CBD7D4] rounded-lg shadow-lg p-3 text-xs min-w-[215px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-[#0F292E]">{item.skill}</span>
                        <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-[#F1F5F4] text-[#4F656A]">
                          {item.category}
                        </span>
                      </div>
                      <div className="space-y-1 mt-2 font-mono-num">
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">Demand Share</span>
                          <span className="font-medium text-[#0F292E]">
                            {item.demandSharePct.toFixed(1)}% ({item.demandCount} roles)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">YoY Velocity</span>
                          <span className="font-semibold text-[#D97706]">
                            {formatSignedPct(item.yoyGrowthPct)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">Median Comp</span>
                          <span className="font-semibold text-[#0D9488]">
                            {formatAud(item.medianCompAud)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">Salary Premium</span>
                          <span
                            className={
                              item.salaryPremiumAud >= 0
                                ? 'text-[#0F766E] font-medium'
                                : 'text-[#64748B]'
                            }
                          >
                            {formatSignedAud(item.salaryPremiumAud)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter data={visibleSkills} name="Skills">
                {visibleSkills.map((entry) => (
                  <Cell
                    key={entry.skill}
                    fill={CATEGORY_COLORS[entry.category]}
                    fillOpacity={0.82}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranked & Sortable Skills Table */}
      <div className="bg-white rounded-xl border border-[#DCE4E2] overflow-hidden shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
        <div className="px-5 py-3.5 border-b border-[#EDF2F0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0F292E]">
            Ranked Skills Intelligence Table
          </h3>
          <span className="text-[11px] font-mono-num text-[#64797E]">
            Click column headers to sort
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F8F7] text-[#556B70] border-b border-[#DCE4E2]">
              <tr>
                <th className="py-2.5 px-5 font-medium">Skill</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('demandCount')}
                    className="inline-flex items-center gap-1 hover:text-[#0F292E] cursor-pointer"
                  >
                    <span>Demand Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-4 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('yoyGrowthPct')}
                    className="inline-flex items-center gap-1 hover:text-[#0F292E] cursor-pointer"
                  >
                    <span>YoY Growth</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-4 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('medianCompAud')}
                    className="inline-flex items-center gap-1 hover:text-[#0F292E] cursor-pointer"
                  >
                    <span>Median AUD</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-4 font-medium text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('salaryPremiumAud')}
                    className="inline-flex items-center gap-1 hover:text-[#0F292E] cursor-pointer"
                  >
                    <span>Premium vs Slice</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-5 font-medium text-right">Quadrant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF2F0]">
              {visibleSkills.map((item) => (
                <tr key={item.skill} className="hover:bg-[#F9FBFA] transition-colors">
                  <td className="py-2.5 px-5 font-medium text-[#0F292E]">{item.skill}</td>
                  <td className="py-2.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-[#4F656A]">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                      />
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono-num text-[#0F292E]">
                    {item.demandCount}{' '}
                    <span className="text-[#64797E]">({item.demandSharePct.toFixed(1)}%)</span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono-num font-medium text-[#D97706]">
                    {formatSignedPct(item.yoyGrowthPct)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono-num font-semibold text-[#0F292E]">
                    {formatAud(item.medianCompAud)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono-num">
                    <span
                      className={
                        item.salaryPremiumAud >= 0
                          ? 'text-[#0D9488] font-medium'
                          : 'text-[#64748B]'
                      }
                    >
                      {formatSignedAud(item.salaryPremiumAud)}
                    </span>
                  </td>
                  <td className="py-2.5 px-5 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${quadrantBadge(
                        item.quadrant,
                      )}`}
                    >
                      {item.quadrant}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
