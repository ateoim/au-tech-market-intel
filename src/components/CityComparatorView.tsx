import { Building2, Home, Scale } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CityComparisonMetric, CompensationBasis } from '../analytics/types';
import { formatAud, formatAudCompact } from '../utils/format';

interface CityComparatorViewProps {
  cities: CityComparisonMetric[];
  basis: CompensationBasis;
}

export function CityComparatorView({ cities, basis }: CityComparatorViewProps) {
  const topPurchasingPower = cities[0];
  const topNominal = [...cities].sort((a, b) => b.nominalMedianAud - a.nominalMedianAud)[0];
  const basisLabel =
    basis === 'total_package' ? 'Total Package (incl. 12% Super)' : 'Base Salary AUD';

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#0F292E] tracking-tight">
            Australian City &amp; Cost-of-Living Comparator
          </h2>
          <p className="text-sm text-[#556B70] mt-1">
            Comparing nominal AUD compensation against Sydney-indexed purchasing power (COL = 100) and regional role concentration.
          </p>
        </div>
        <span className="text-xs font-mono-num text-[#556B70] bg-white px-3 py-1.5 rounded-md border border-[#DCE4E2]">
          {basisLabel}
        </span>
      </div>

      {/* Executive Callout Strip */}
      {topPurchasingPower && topNominal && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#DCE4E2] p-4 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#556B70]">
              <Scale className="w-4 h-4 text-[#0D9488]" />
              <span>Highest Purchasing Power</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-[#0F292E]">
                {topPurchasingPower.city}
              </span>
              <span className="font-mono-num text-sm font-semibold text-[#0D9488]">
                {formatAud(topPurchasingPower.colAdjustedAud)} eq.
              </span>
            </div>
            <p className="mt-1 text-xs text-[#64797E]">
              Purchasing Power Index{' '}
              <span className="font-mono-num font-medium text-[#0F292E]">
                {topPurchasingPower.purchasingPowerIndex.toFixed(1)}
              </span>{' '}
              (COL {topPurchasingPower.colIndex} vs Sydney 100).
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE4E2] p-4 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#556B70]">
              <Building2 className="w-4 h-4 text-[#D97706]" />
              <span>Highest Nominal Median</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-[#0F292E]">
                {topNominal.city}
              </span>
              <span className="font-mono-num text-sm font-semibold text-[#D97706]">
                {formatAud(topNominal.nominalMedianAud)}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#64797E]">
              Accounts for{' '}
              <span className="font-mono-num font-medium text-[#0F292E]">
                {topNominal.sharePct.toFixed(1)}%
              </span>{' '}
              of matched roles · Top family: {topNominal.topRoleFamily}.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE4E2] p-4 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#556B70]">
              <Home className="w-4 h-4 text-[#0F292E]" />
              <span>Rent Arbitrage Spread</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-[#0F292E] font-mono-num">
                $540 – $760
              </span>
              <span className="text-xs text-[#64797E]">/ wk median</span>
            </div>
            <p className="mt-1 text-xs text-[#64797E]">
              Lower housing costs in Melbourne, Brisbane, Perth, and Adelaide expand real take-home purchasing power.
            </p>
          </div>
        </div>
      )}

      {/* Nominal vs COL-Adjusted Bar Chart */}
      <div className="bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#0F292E]">
            Nominal Median vs Cost-of-Living Adjusted Compensation (Sydney-Equivalent AUD)
          </h3>
          <p className="text-xs text-[#64797E]">
            COL-adjusted salary = Nominal Median / (City COL Index / 100). Sorted by real purchasing power.
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cities}
              margin={{ top: 12, right: 20, left: 6, bottom: 8 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5ECEA" vertical={false} />
              <XAxis
                dataKey="city"
                tick={{ fontSize: 11, fill: '#4F656A' }}
                axisLine={{ stroke: '#D2DDDA' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatAudCompact(v)}
                tick={{ fontSize: 11, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip
                cursor={{ fill: '#F1F5F4' }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const c = payload[0].payload as CityComparisonMetric;
                  return (
                    <div className="bg-white border border-[#CBD7D4] rounded-lg shadow-lg p-3 text-xs min-w-[230px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#0F292E]">
                          {c.city} ({c.state})
                        </span>
                        <span className="font-mono-num text-[11px] text-[#64797E]">
                          n = {c.count}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64797E] mb-2">{c.techHubNote}</p>
                      <div className="space-y-1 font-mono-num">
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">Nominal Median</span>
                          <span className="font-medium text-[#0F292E]">
                            {formatAud(c.nominalMedianAud)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">COL-Adjusted Eq.</span>
                          <span className="font-semibold text-[#0D9488]">
                            {formatAud(c.colAdjustedAud)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">Purchasing Power Idx</span>
                          <span className="font-semibold text-[#D97706]">
                            {c.purchasingPowerIndex.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64797E]">Median Weekly Rent</span>
                          <span>${c.medianRentWeeklyAud}/wk</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar
                dataKey="nominalMedianAud"
                name="Nominal Median AUD"
                fill="#0F292E"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="colAdjustedAud"
                name="COL-Adjusted Purchasing Power (Sydney Eq.)"
                fill="#0D9488"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed City Ledger */}
      <div className="bg-white rounded-xl border border-[#DCE4E2] overflow-hidden shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
        <div className="px-5 py-3.5 border-b border-[#EDF2F0] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0F292E]">
            Regional Market Scorecard
          </h3>
          <span className="text-[11px] font-mono-num text-[#64797E]">
            Sydney COL Index = 100.0
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F8F7] text-[#556B70] border-b border-[#DCE4E2]">
              <tr>
                <th className="py-2.5 px-5 font-medium">Market</th>
                <th className="py-2.5 px-4 font-medium text-right">Role Share</th>
                <th className="py-2.5 px-4 font-medium text-right">Nominal Median</th>
                <th className="py-2.5 px-4 font-medium text-right">COL Index</th>
                <th className="py-2.5 px-4 font-medium text-right">COL-Adjusted Eq.</th>
                <th className="py-2.5 px-4 font-medium text-right">Purchasing Power</th>
                <th className="py-2.5 px-4 font-medium text-right">Flex Share</th>
                <th className="py-2.5 px-5 font-medium">Dominant Role Family</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF2F0]">
              {cities.map((c) => (
                <tr key={c.city} className="hover:bg-[#F9FBFA] transition-colors">
                  <td className="py-3 px-5">
                    <div className="font-medium text-[#0F292E]">
                      {c.city}{' '}
                      <span className="text-[11px] font-mono-num text-[#64797E]">
                        {c.state}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64797E]">{c.techHubNote}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#556B70]">
                    {c.sharePct.toFixed(1)}%{' '}
                    <span className="text-[#8CA0A4]">({c.count})</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-medium text-[#0F292E]">
                    {formatAud(c.nominalMedianAud)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#556B70]">
                    {c.colIndex}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#0D9488]">
                    {formatAud(c.colAdjustedAud)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        c.purchasingPowerIndex >= 102
                          ? 'bg-[#CCFBF1] text-[#0F766E]'
                          : c.purchasingPowerIndex >= 98
                            ? 'bg-[#EEF3F2] text-[#0F292E]'
                            : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {c.purchasingPowerIndex.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#556B70]">
                    {c.remoteHybridSharePct.toFixed(0)}%
                  </td>
                  <td className="py-3 px-5 text-[#4F656A]">{c.topRoleFamily}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
