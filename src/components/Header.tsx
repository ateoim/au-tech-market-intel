import { BarChart3, Download, MapPin, Radar, TrendingUp } from 'lucide-react';
import type { CompensationBasis } from '../analytics/types';

export type ActiveTab = 'overview' | 'skills' | 'cities' | 'career';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  filteredCount: number;
  totalCount: number;
  basis: CompensationBasis;
  onExportCsv: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Market Overview', icon: BarChart3 },
  { id: 'skills', label: 'Skills Demand & Velocity', icon: TrendingUp },
  { id: 'cities', label: 'City & COL Comparator', icon: MapPin },
  { id: 'career', label: 'Career Path & Skills-Gap', icon: Radar },
];

export function Header({
  activeTab,
  onTabChange,
  filteredCount,
  totalCount,
  basis,
  onExportCsv,
}: HeaderProps) {
  return (
    <header className="bg-[#0F292E] text-white border-b border-[#1D4047]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-[#0D9488] flex items-center justify-center shadow-sm ring-1 ring-white/15">
              <span className="font-mono-num text-sm font-semibold tracking-tight text-white">
                AU
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  PulseAU
                </h1>
                <span className="text-[11px] font-mono-num uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-[#99F6E4] border border-white/10">
                  2026 Q4 Benchmark
                </span>
              </div>
              <p className="text-xs text-[#A8C2C7]">
                Australian Technology Job Market Intelligence &amp; Compensation Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-[#C6D8DC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
              <span className="font-mono-num">
                {filteredCount} / {totalCount}
              </span>
              <span className="text-[#8CA8AE]">roles in slice</span>
            </div>

            <button
              type="button"
              onClick={onExportCsv}
              disabled={filteredCount === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer shadow-sm"
              title={`Export ${filteredCount} filtered roles (${basis === 'total_package' ? 'Total Package incl. 12% Super' : 'Base AUD'}) to CSV`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          aria-label="Analytical views"
          className="flex items-center gap-1 overflow-x-auto -mb-px pt-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#14B8A6] text-white bg-white/5 rounded-t-md'
                    : 'border-transparent text-[#A8C2C7] hover:text-white hover:border-white/25'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#2DD4BF]' : 'text-[#7A9AA0] group-hover:text-[#A8C2C7]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
