import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  sublabel: string;
  badge?: string;
  badgeTone?: 'teal' | 'amber' | 'neutral';
  icon?: ReactNode;
}

export function KpiCard({
  label,
  value,
  sublabel,
  badge,
  badgeTone = 'teal',
  icon,
}: KpiCardProps) {
  const badgeStyles =
    badgeTone === 'teal'
      ? 'bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]'
      : badgeTone === 'amber'
        ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
        : 'bg-[#EEF3F2] text-[#475569] border-[#DCE4E2]';

  return (
    <div className="bg-white rounded-xl border border-[#DCE4E2] p-5 shadow-[0_1px_2px_rgba(15,41,46,0.03)] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-[#556B70]">
          {label}
        </span>
        {icon && <div className="text-[#0D9488]">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5 flex-wrap">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F292E] font-mono-num">
          {value}
        </span>
        {badge && (
          <span
            className={`text-[11px] font-mono-num font-medium px-2 py-0.5 rounded-full border ${badgeStyles}`}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-[#64797E] leading-relaxed">{sublabel}</p>
    </div>
  );
}
