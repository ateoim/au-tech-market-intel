export function Footer() {
  return (
    <footer className="mt-14 border-t border-[#DCE4E2] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-[#556B70]">
          <div className="space-y-1 max-w-3xl">
            <p className="font-medium text-[#0F292E]">
              Methodology &amp; Synthetic Benchmark Disclosure
            </p>
            <p className="leading-relaxed">
              PulseAU operates on a deterministic synthetic benchmark dataset (280 structured
              records across 7 Australian markets, 5 role families, and 28 skills) modelled on
              public Australian technology hiring distributions and statutory 12% Superannuation
              Guarantee rates. It does not scrape or redistribute proprietary job-board listings.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 font-mono-num text-[11px] text-[#64797E] shrink-0">
            <span>SG Rate: 12.0% (FY25–26+)</span>
            <span>Percentiles: Linear R-7 Interpolation</span>
            <span>COL Baseline: Sydney = 100.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
