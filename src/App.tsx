import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { JOB_RECORDS } from './analytics/dataset';
import { downloadMarketCsv } from './analytics/export';
import {
  computeCityComparison,
  computeKpiSummary,
  computeRoleSalaryBands,
  computeSkillVelocity,
  DEFAULT_FILTERS,
  filterRecords,
} from './analytics/stats';
import type { MarketFilters } from './analytics/types';
import { CareerPathAnalyser } from './components/CareerPathAnalyser';
import { CityComparatorView } from './components/CityComparatorView';
import { FilterBar } from './components/FilterBar';
import { Footer } from './components/Footer';
import { type ActiveTab, Header } from './components/Header';
import { MarketOverview } from './components/MarketOverview';
import { SkillsDemandView } from './components/SkillsDemandView';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [filters, setFilters] = useState<MarketFilters>(DEFAULT_FILTERS);

  const filteredRecords = useMemo(
    () => filterRecords(JOB_RECORDS, filters),
    [filters],
  );

  const kpi = useMemo(
    () => computeKpiSummary(filteredRecords, filters.compensationBasis, JOB_RECORDS.length),
    [filteredRecords, filters.compensationBasis],
  );

  const roleBands = useMemo(
    () => computeRoleSalaryBands(filteredRecords, filters.compensationBasis),
    [filteredRecords, filters.compensationBasis],
  );

  const skillVelocity = useMemo(
    () => computeSkillVelocity(filteredRecords, filters.compensationBasis),
    [filteredRecords, filters.compensationBasis],
  );

  const cityComparison = useMemo(
    () => computeCityComparison(filteredRecords, filters.compensationBasis),
    [filteredRecords, filters.compensationBasis],
  );

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      compensationBasis: prev.compensationBasis,
    }));
  };

  const handleExportCsv = () => {
    downloadMarketCsv(filteredRecords, filters.compensationBasis);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-[#111D20]">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filteredCount={filteredRecords.length}
        totalCount={JOB_RECORDS.length}
        basis={filters.compensationBasis}
        onExportCsv={handleExportCsv}
      />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        filteredCount={filteredRecords.length}
        totalCount={JOB_RECORDS.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DCE4E2] p-12 text-center max-w-lg mx-auto my-8">
            <h2 className="font-editorial text-xl font-medium text-[#0F292E]">
              No roles match this exact filter combination
            </h2>
            <p className="text-sm text-[#556B70] mt-2">
              Try broadening your city, seniority, or work-mode criteria (for example, Remote AU listings only include Remote work mode).
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium bg-[#0F292E] hover:bg-[#173D44] text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <MarketOverview
                kpi={kpi}
                roleBands={roleBands}
                basis={filters.compensationBasis}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsDemandView
                skills={skillVelocity}
                basis={filters.compensationBasis}
              />
            )}
            {activeTab === 'cities' && (
              <CityComparatorView
                cities={cityComparison}
                basis={filters.compensationBasis}
              />
            )}
            {activeTab === 'career' && (
              <CareerPathAnalyser
                records={filteredRecords}
                basis={filters.compensationBasis}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
