import { CalendarClock } from "lucide-react";

export type TemporalKind = "date" | "time" | "datetime-local" | "date-range";

export function temporalKindForField(label: string): TemporalKind | null {
  if (/(时间范围|日期范围|有效期)/.test(label)) return "date-range";
  if (/(开始时间|结束时间|简报时间)/.test(label)) return "time";
  if (/(完成时间|截止时间|生效时间|发布时间)/.test(label)) return "datetime-local";
  return null;
}

function TemporalInput({ label, type }: { label: string; type: Exclude<TemporalKind, "date-range"> }) {
  return <span className="kds-temporal-input">
    <input aria-label={label} title={label} type={type} />
    <CalendarClock aria-hidden="true" size={16} />
  </span>;
}

export default function TemporalControl({ label, kind = "datetime-local", compact = false }: { label: string; kind?: TemporalKind; compact?: boolean }) {
  if (kind === "date-range") {
    return <div className={`kds-temporal-control is-range${compact ? " is-compact" : ""}`} role="group" aria-label={label}>
      <TemporalInput label={`${label}开始日期`} type="date" />
      <i>至</i>
      <TemporalInput label={`${label}结束日期`} type="date" />
    </div>;
  }
  return <div className={`kds-temporal-control${compact ? " is-compact" : ""}`}>
    <TemporalInput label={label} type={kind} />
  </div>;
}
