import { Activity, Briefcase, DollarSign, Globe2 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { QUARTERLY_TRENDS } from '../analytics/dataset';
import type {
  CompensationBasis,
  KpiSummary,
  RoleBandSummary,
} from '../analytics/types';
import { formatAud, formatAudCompact, formatSignedPct } from '../utils/format';
import { KpiCard } from './KpiCard';

interface MarketOverviewProps {
  kpi: KpiSummary;
  roleBands: RoleBandSummary[];
  basis: CompensationBasis;
}

export function MarketOverview({ kpi, roleBands, basis }: MarketOverviewProps) {
  const basisLabel =
    basis === 'total_package' ? 'Total Package (incl. 12% Super)' : 'Base Salary AUD';

  return (
    <section className="space-y-6">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#0F292E] tracking-tight">
            Australian Tech Labour Market Overview
          </h2>
          <p className="text-sm text-[#556B70] mt-1">
            Compensation percentiles and quarterly hiring momentum across national tech hubs.
          </p>
        </div>
        <span className="text-xs font-mono-num text-[#556B70] bg-white px-3 py-1.5 rounded-md border border-[#DCE4E2]">
          Basis: {basisLabel}
        </span>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Median AUD Salary"
          value={formatAud(kpi.medianCompAud)}
          badge={`IQR ${formatAudCompact(kpi.p25CompAud)}–${formatAudCompact(kpi.p75CompAud)}`}
          badgeTone="teal"
          sublabel={`50th percentile across ${kpi.sampleSize} matched roles (${basis === 'total_package' ? 'incl. 12% super' : 'base excl. super'}).`}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Active Role Index"
          value={String(kpi.activeRoleIndex)}
          badge={`${kpi.avgDaysToFill}d avg fill`}
          badgeTone="neutral"
          sublabel="Indexed to 2024 Q4 national baseline (100), weighted by slice volume and demand velocity."
          icon={<Briefcase className="w-4 h-4" />}
        />
        <KpiCard
          label="YoY Demand Growth"
          value={formatSignedPct(kpi.yoyDemandGrowthPct)}
          badge={kpi.yoyDemandGrowthPct >= 18 ? 'High Velocity' : 'Steady Expansion'}
          badgeTone={kpi.yoyDemandGrowthPct >= 18 ? 'amber' : 'teal'}
          sublabel="Annualised hiring volume change across the active filter slice vs prior 12 months."
          icon={<Activity className="w-4 h-4" />}
        />
        <KpiCard
          label="Remote / Hybrid Share"
          value={`${kpi.remoteHybridSharePct.toFixed(1)}%`}
          badge="Flexible Work"
          badgeTone="teal"
          sublabel="Proportion of roles offering Hybrid or fully Remote AU working arrangements."
          icon={<Globe2 className="w-4 h-4" />}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Salary Percentile Band Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#0F292E]">
                Salary Percentile Bands by Role Family
              </h3>
              <p className="text-xs text-[#64797E]">
                P25, Median (P50), P75, and P90 distributions ({basisLabel})
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roleBands}
                margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5ECEA" vertical={false} />
                <XAxis
                  dataKey="shortLabel"
                  tick={{ fontSize: 11, fill: '#4F656A' }}
                  axisLine={{ stroke: '#D2DDDA' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => formatAudCompact(v)}
                  tick={{ fontSize: 11, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                  axisLine={false}
                  tickLine={false}
                  width={62}
                />
                <Tooltip
                  cursor={{ fill: '#F1F5F4' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0].payload as RoleBandSummary;
                    return (
                      <div className="bg-white border border-[#CBD7D4] rounded-lg shadow-lg p-3 text-xs min-w-[210px]">
                        <p className="font-semibold text-[#0F292E] mb-1">
                          {row.roleFamily}
                        </p>
                        <p className="text-[11px] text-[#64797E] mb-2 font-mono-num">
                          n = {row.count} roles · YoY {formatSignedPct(row.yoyGrowthPct)}
                        </p>
                        <div className="space-y-1 font-mono-num">
                          <div className="flex justify-between gap-4">
                            <span className="text-[#64797E]">P90 (Top Decile)</span>
                            <span className="font-semibold text-[#D97706]">
                              {formatAud(row.p90)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-[#64797E]">P75 (Upper Quartile)</span>
                            <span className="font-medium text-[#0F292E]">
                              {formatAud(row.p75)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-[#64797E]">P50 (Median)</span>
                            <span className="font-semibold text-[#0D9488]">
                              {formatAud(row.p50)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-[#64797E]">P25 (Lower Quartile)</span>
                            <span className="text-[#475569]">{formatAud(row.p25)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  iconType="square"
                />
                <Bar dataKey="p25" name="P25" fill="#94A3B8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="p50" name="Median (P50)" fill="#0D9488" radius={[3, 3, 0, 0]} />
                <Bar dataKey="p75" name="P75" fill="#0F292E" radius={[3, 3, 0, 0]} />
                <Bar dataKey="p90" name="P90" fill="#D97706" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quarterly Hiring Trend (2024 Q1 – 2026 Q4) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-[#0F292E]">
              Quarterly Hiring Trend (2024 Q1 – 2026 Q4)
            </h3>
            <p className="text-xs text-[#64797E]">
              Role demand index (2024 Q4 = 100) highlighting AI &amp; Automation divergence
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={QUARTERLY_TRENDS}
                margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5ECEA" vertical={false} />
                <XAxis
                  dataKey="quarter"
                  tick={{ fontSize: 10, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                  axisLine={{ stroke: '#D2DDDA' }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  domain={[70, 190]}
                  tick={{ fontSize: 11, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD7D4',
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: 'IBM Plex Mono',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line
                  type="monotone"
                  dataKey="aiMlIndex"
                  name="AI & ML"
                  stroke="#D97706"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="automationIndex"
                  name="Automation"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="activeIndex"
                  name="All Tech (Composite)"
                  stroke="#0F292E"
                  strokeWidth={2.2}
                  strokeDasharray="4 3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="softwareIndex"
                  name="Software Eng"
                  stroke="#64748B"
                  strokeWidth={1.6}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Role Family Summary Strip */}
      <div className="bg-white rounded-xl border border-[#DCE4E2] overflow-hidden shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
        <div className="px-5 py-3.5 border-b border-[#EDF2F0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0F292E]">
            Role Family Compensation Ledger
          </h3>
          <span className="text-[11px] font-mono-num text-[#64797E]">
            All figures in AUD · Linear R-7 percentiles
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F8F7] text-[#556B70] border-b border-[#DCE4E2]">
              <tr>
                <th className="py-2.5 px-5 font-medium">Role Family</th>
                <th className="py-2.5 px-4 font-medium text-right">Sample (n)</th>
                <th className="py-2.5 px-4 font-medium text-right">P25</th>
                <th className="py-2.5 px-4 font-medium text-right">Median (P50)</th>
                <th className="py-2.5 px-4 font-medium text-right">P75</th>
                <th className="py-2.5 px-4 font-medium text-right">P90</th>
                <th className="py-2.5 px-5 font-medium text-right">YoY Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF2F0]">
              {roleBands.map((band) => (
                <tr key={band.roleFamily} className="hover:bg-[#F9FBFA] transition-colors">
                  <td className="py-3 px-5 font-medium text-[#0F292E]">{band.roleFamily}</td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#556B70]">
                    {band.count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#556B70]">
                    {formatAud(band.p25)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#0D9488]">
                    {formatAud(band.p50)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#0F292E]">
                    {formatAud(band.p75)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-medium text-[#D97706]">
                    {formatAud(band.p90)}
                  </td>
                  <td className="py-3 px-5 text-right font-mono-num">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        band.yoyGrowthPct >= 20
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#CCFBF1] text-[#0F766E]'
                      }`}
                    >
                      {formatSignedPct(band.yoyGrowthPct)}
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
