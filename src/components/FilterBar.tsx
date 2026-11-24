import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Filter, RotateCcw } from 'lucide-react';
import { CITIES, ROLE_FAMILIES, SENIORITIES, WORK_MODES } from '../analytics/dataset';
import type {
  City,
  CompensationBasis,
  MarketFilters,
  RoleFamily,
  Seniority,
  WorkMode,
} from '../analytics/types';

interface FilterBarProps {
  filters: MarketFilters;
  onChange: (next: MarketFilters) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

interface MultiSelectDropdownProps<T extends string> {
  label: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
}

function MultiSelectDropdown<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: MultiSelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const hasSelection = selected.length > 0;
  const buttonText =
    selected.length === 0
      ? `All ${label}`
      : selected.length === 1
        ? selected[0]
        : `${label} (${selected.length})`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
          hasSelection
            ? 'bg-[#0F292E] text-white border-[#0F292E]'
            : 'bg-white text-[#1E2F33] border-[#D2DDDA] hover:border-[#0D9488]'
        }`}
      >
        <span className="truncate max-w-[140px]">{buttonText}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-60 rounded-lg bg-white border border-[#D2DDDA] shadow-lg py-1.5 z-40">
          <div className="px-3 py-1 text-[10px] font-mono-num uppercase tracking-wider text-[#64797E] border-b border-[#EDF2F0]">
            Filter by {label}
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[#1E2F33] hover:bg-[#F3F7F6] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(opt)}
                    className="rounded border-[#B8C7C4] text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <span className={checked ? 'font-medium text-[#0F292E]' : ''}>
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export function FilterBar({
  filters,
  onChange,
  onReset,
  filteredCount,
  totalCount,
}: FilterBarProps) {
  const activeFilterCount =
    filters.cities.length +
    filters.roleFamilies.length +
    filters.seniorities.length +
    filters.workModes.length;

  const setBasis = (basis: CompensationBasis) => {
    onChange({ ...filters, compensationBasis: basis });
  };

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#DCE4E2] shadow-[0_1px_2px_rgba(15,41,46,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Facet dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4F656A] mr-1">
              <Filter className="w-3.5 h-3.5 text-[#0D9488]" />
              <span className="hidden sm:inline">Slice:</span>
            </div>

            <MultiSelectDropdown<City>
              label="Cities"
              options={CITIES}
              selected={filters.cities}
              onToggle={(city) =>
                onChange({ ...filters, cities: toggleItem(filters.cities, city) })
              }
            />

            <MultiSelectDropdown<RoleFamily>
              label="Role Families"
              options={ROLE_FAMILIES}
              selected={filters.roleFamilies}
              onToggle={(rf) =>
                onChange({
                  ...filters,
                  roleFamilies: toggleItem(filters.roleFamilies, rf),
                })
              }
            />

            <MultiSelectDropdown<Seniority>
              label="Seniority"
              options={SENIORITIES}
              selected={filters.seniorities}
              onToggle={(s) =>
                onChange({
                  ...filters,
                  seniorities: toggleItem(filters.seniorities, s),
                })
              }
            />

            <MultiSelectDropdown<WorkMode>
              label="Work Modes"
              options={WORK_MODES}
              selected={filters.workModes}
              onToggle={(wm) =>
                onChange({
                  ...filters,
                  workModes: toggleItem(filters.workModes, wm),
                })
              }
            />

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#B45309] bg-[#FEF3C7]/70 hover:bg-[#FEF3C7] border border-[#F59E0B]/30 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>

          {/* Right: Compensation Basis Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono-num text-[#64797E] sm:hidden">
              {filteredCount}/{totalCount}
            </span>

            <div
              role="group"
              aria-label="Compensation basis"
              className="inline-flex items-center rounded-md bg-[#EEF3F2] p-0.5 border border-[#D2DDDA]"
            >
              <button
                type="button"
                onClick={() => setBasis('base')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  filters.compensationBasis === 'base'
                    ? 'bg-white text-[#0F292E] shadow-xs ring-1 ring-[#0F292E]/10'
                    : 'text-[#556B70] hover:text-[#0F292E]'
                }`}
              >
                Base AUD
              </button>
              <button
                type="button"
                onClick={() => setBasis('total_package')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                  filters.compensationBasis === 'total_package'
                    ? 'bg-[#0F292E] text-white shadow-xs'
                    : 'text-[#556B70] hover:text-[#0F292E]'
                }`}
              >
                Total Pkg (+12% Super)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
