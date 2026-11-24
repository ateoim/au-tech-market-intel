import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, Sparkles, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TARGET_ROLE_PROFILES } from '../analytics/dataset';
import { computeSkillsGap } from '../analytics/stats';
import type { CompensationBasis, JobRecord } from '../analytics/types';
import { formatAud, formatAudCompact, formatSignedPct } from '../utils/format';

interface CareerPathAnalyserProps {
  records: JobRecord[];
  basis: CompensationBasis;
}

const DEFAULT_OWNED_BY_ROLE: Record<string, string[]> = {
  'ai-engineer': ['Python', 'TypeScript', 'PostgreSQL'],
  'data-analyst': ['SQL', 'Excel / Power Query', 'Power BI'],
  'business-analyst': ['Requirements Engineering', 'Stakeholder Management', 'Excel / Power Query'],
  'software-engineer': ['TypeScript', 'React', 'Node.js'],
  'automation-platform-engineer': ['Python', 'Docker', 'AWS'],
};

export function CareerPathAnalyser({ records, basis }: CareerPathAnalyserProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(TARGET_ROLE_PROFILES[0].id);
  const [ownedSkills, setOwnedSkills] = useState<string[]>(
    DEFAULT_OWNED_BY_ROLE[TARGET_ROLE_PROFILES[0].id] ?? [],
  );

  const activeProfile = useMemo(
    () =>
      TARGET_ROLE_PROFILES.find((p) => p.id === selectedRoleId) ?? TARGET_ROLE_PROFILES[0],
    [selectedRoleId],
  );

  const handleRoleSwitch = (roleId: string) => {
    setSelectedRoleId(roleId);
    setOwnedSkills(DEFAULT_OWNED_BY_ROLE[roleId] ?? []);
  };

  const toggleSkill = (skill: string) => {
    setOwnedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const gapResult = useMemo(
    () => computeSkillsGap(records, activeProfile, ownedSkills, basis),
    [records, activeProfile, ownedSkills, basis],
  );

  const readinessTone =
    gapResult.readinessScorePct >= 75
      ? 'text-[#0D9488]'
      : gapResult.readinessScorePct >= 45
        ? 'text-[#D97706]'
        : 'text-[#0F292E]';

  const basisLabel =
    basis === 'total_package' ? 'Total Pkg (incl. 12% Super)' : 'Base AUD';

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#0F292E] tracking-tight">
          Career Path &amp; Skills-Gap Analyser
        </h2>
        <p className="text-sm text-[#556B70] mt-1">
          Select a target Australian tech role and toggle the skills you already hold to model your readiness score and estimated AUD salary lift.
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TARGET_ROLE_PROFILES.map((profile) => {
          const isSelected = profile.id === activeProfile.id;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleRoleSwitch(profile.id)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0F292E] text-white border-[#0F292E] shadow-sm'
                  : 'bg-white text-[#0F292E] border-[#DCE4E2] hover:border-[#0D9488]'
              }`}
            >
              <div className="text-xs font-mono-num uppercase tracking-wider opacity-75">
                {profile.targetSeniority}
              </div>
              <div className="mt-1 text-sm font-semibold">{profile.label}</div>
              <div
                className={`mt-1.5 text-[11px] leading-snug line-clamp-2 ${
                  isSelected ? 'text-[#B5CDD2]' : 'text-[#64797E]'
                }`}
              >
                {profile.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Skill Checklist */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-semibold text-[#0F292E]">
                  Your Current Skill Stack
                </h3>
                <p className="text-xs text-[#64797E]">
                  Toggle core capabilities required for {activeProfile.label}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setOwnedSkills(activeProfile.coreSkills.map((s) => s.skill))
                  }
                  className="text-[11px] font-medium text-[#0D9488] hover:underline cursor-pointer"
                >
                  Select all
                </button>
                <span className="text-[#CBD5E1]">|</span>
                <button
                  type="button"
                  onClick={() => setOwnedSkills([])}
                  className="text-[11px] font-medium text-[#64797E] hover:text-[#0F292E] cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {activeProfile.coreSkills.map((core) => {
                const isOwned = ownedSkills.includes(core.skill);
                return (
                  <button
                    key={core.skill}
                    type="button"
                    onClick={() => toggleSkill(core.skill)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      isOwned
                        ? 'bg-[#F0FDFA] border-[#0D9488] text-[#0F292E]'
                        : 'bg-[#F9FBFA] border-[#DCE4E2] text-[#4F656A] hover:border-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isOwned ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#94A3B8] shrink-0" />
                      )}
                      <span className="text-xs font-medium">{core.skill}</span>
                    </div>
                    <span className="text-[11px] font-mono-num text-[#64797E]">
                      wt {core.weight}/10
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#EDF2F0] text-[11px] text-[#64797E] leading-relaxed">
            Readiness is weighted by core skill importance. Salary lift estimates use
            seniority-controlled residual differentials across{' '}
            <span className="font-mono-num text-[#0F292E] font-medium">
              n = {gapResult.sampleSize}
            </span>{' '}
            comparable {activeProfile.roleFamily} records.
          </div>
        </div>

        {/* Right: Readiness Scorecard & Salary Lift Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Readiness & Compensation Projection Card */}
          <div className="bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Readiness Score */}
              <div className="sm:border-r sm:border-[#EDF2F0] sm:pr-4">
                <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#64797E]">
                  Role Readiness Score
                </span>
                <div className={`mt-1 text-4xl font-semibold font-mono-num ${readinessTone}`}>
                  {gapResult.readinessScorePct}%
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#E5ECEA] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0D9488] transition-all duration-300"
                    style={{ width: `${gapResult.readinessScorePct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[#64797E]">
                  {gapResult.matchedSkills.length} of {activeProfile.coreSkills.length} core
                  skills matched
                </p>
              </div>

              {/* Estimated Current Positioning */}
              <div className="sm:border-r sm:border-[#EDF2F0] sm:pr-4">
                <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#64797E]">
                  Estimated Positioning
                </span>
                <div className="mt-1 text-2xl font-semibold font-mono-num text-[#0F292E]">
                  {formatAud(gapResult.currentEstimatedCompAud)}
                </div>
                <p className="mt-1 text-[11px] text-[#64797E]">
                  Target {activeProfile.targetSeniority} median:{' '}
                  <span className="font-mono-num font-medium text-[#0F292E]">
                    {formatAud(gapResult.targetMedianCompAud)}
                  </span>
                </p>
                <p className="text-[10px] font-mono-num text-[#8CA0A4] mt-0.5">
                  {basisLabel}
                </p>
              </div>

              {/* Upskill Potential */}
              <div>
                <span className="text-[11px] font-mono-num uppercase tracking-wider text-[#64797E]">
                  Remaining Upskill Lift
                </span>
                <div className="mt-1 text-2xl font-semibold font-mono-num text-[#D97706]">
                  +{formatAud(gapResult.totalPotentialLiftAud)}
                </div>
                <p className="mt-1 text-[11px] text-[#64797E]">
                  {gapResult.missingSkills.length === 0
                    ? 'Full core stack matched for target band.'
                    : `Across ${gapResult.missingSkills.length} missing core capabilities.`}
                </p>
              </div>
            </div>
          </div>

          {/* Missing Skills Salary Lift Chart & Action List */}
          <div className="bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)]">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D97706]" />
                <h3 className="text-base font-semibold text-[#0F292E]">
                  Estimated AUD Salary Lift by Missing Skill
                </h3>
              </div>
              <span className="text-[11px] font-mono-num text-[#64797E]">
                Sorted by ROI
              </span>
            </div>

            {gapResult.missingSkills.length === 0 ? (
              <div className="rounded-lg bg-[#F0FDFA] border border-[#99F6E4] p-6 text-center">
                <Sparkles className="w-6 h-6 text-[#0D9488] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#0F292E]">
                  100% Core Readiness Achieved
                </p>
                <p className="text-xs text-[#4F656A] mt-1">
                  Your selected stack covers every core requirement for {activeProfile.label} at
                  the {activeProfile.targetSeniority} benchmark band.
                </p>
              </div>
            ) : (
              <>
                <div className="h-56 w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={gapResult.missingSkills}
                      layout="vertical"
                      margin={{ top: 4, right: 24, left: 12, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5ECEA" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={(v: number) => `+${formatAudCompact(v)}`}
                        tick={{ fontSize: 11, fill: '#4F656A', fontFamily: 'IBM Plex Mono' }}
                        axisLine={{ stroke: '#D2DDDA' }}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="skill"
                        width={136}
                        tick={{ fontSize: 11, fill: '#0F292E' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: '#F1F5F4' }}
                        formatter={(value: number) => [
                          `+${formatAud(value)}`,
                          'Est. Salary Lift',
                        ]}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#CBD7D4',
                          borderRadius: 8,
                          fontSize: 12,
                          fontFamily: 'IBM Plex Mono',
                        }}
                      />
                      <Bar
                        dataKey="estimatedLiftAud"
                        fill="#D97706"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="divide-y divide-[#EDF2F0] border-t border-[#EDF2F0]">
                  {gapResult.missingSkills.map((item) => (
                    <div
                      key={item.skill}
                      className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-medium text-[#0F292E]">{item.skill}</span>
                        <span className="ml-2 text-[11px] text-[#64797E]">
                          {item.category} · {item.marketDemandSharePct.toFixed(0)}% role frequency
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono-num">
                        <span className="text-[11px] text-[#0D9488]">
                          YoY {formatSignedPct(item.yoyGrowthPct)}
                        </span>
                        <span className="font-semibold text-[#D97706]">
                          +{formatAud(item.estimatedLiftAud)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
