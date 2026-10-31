import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const TOOLTIP_STYLE: React.CSSProperties = {
  background: "#101214",
  border: "1px solid rgba(230,232,235,0.12)",
  fontSize: 11,
  color: "#e6e8eb",
  fontFamily: "IBM Plex Mono, ui-monospace, monospace",
};

export const TICK = { fill: "#8b939e", fontSize: 10, fontFamily: "IBM Plex Mono, ui-monospace, monospace" };

export function padDomain(values: number[], pad = 0.1): [number, number] {
  const finite = values.filter((v) => Number.isFinite(v));
  if (!finite.length) return [0, 1];
  const lo = Math.min(...finite);
  const hi = Math.max(...finite);
  const span = hi - lo || Math.abs(hi) * 0.08 || 1;
  return [lo - span * pad, hi + span * pad];
}

function fmtTick(v: number) {
  const a = Math.abs(v);
  if (a >= 1000) return v.toFixed(0);
  if (a >= 100) return v.toFixed(1);
  if (a >= 10) return v.toFixed(1);
  if (a >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

type Row = Record<string, number | string>;

export function BoundArea({
  data,
  xKey,
  yKey,
  color = "var(--accent)",
  xFormatter,
  yFormatter,
}: {
  data: Row[];
  xKey: string;
  yKey: string;
  color?: string;
  xFormatter?: (v: number | string) => string;
  yFormatter?: (v: number) => string;
}) {
  const domain = padDomain(data.map((d) => Number(d[yKey])));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="rgba(230,232,235,0.06)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={TICK}
          stroke="rgba(230,232,235,0.16)"
          tickLine={false}
          tickFormatter={xFormatter as never}
        />
        <YAxis
          domain={domain}
          tick={TICK}
          stroke="rgba(230,232,235,0.16)"
          tickLine={false}
          width={52}
          tickFormatter={yFormatter ?? fmtTick}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey={yKey} stroke={color} fill={color} fillOpacity={0.12} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BoundLine({
  data,
  xKey,
  series,
  xFormatter,
}: {
  data: Row[];
  xKey: string;
  series: { key: string; color: string; name?: string }[];
  xFormatter?: (v: number | string) => string;
}) {
  const ys = data.flatMap((d) => series.map((s) => Number(d[s.key])));
  const domain = padDomain(ys);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="rgba(230,232,235,0.06)" vertical={false} />
        <XAxis dataKey={xKey} tick={TICK} stroke="rgba(230,232,235,0.16)" tickLine={false} tickFormatter={xFormatter as never} />
        <YAxis domain={domain} tick={TICK} stroke="rgba(230,232,235,0.16)" tickLine={false} width={52} tickFormatter={fmtTick} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name ?? s.key} stroke={s.color} dot={false} strokeWidth={1.5} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BoundBar({
  data,
  xKey,
  yKey,
  color = "var(--accent)",
}: {
  data: Row[];
  xKey: string;
  yKey: string;
  color?: string;
}) {
  const domain = padDomain(data.map((d) => Number(d[yKey])), 0.05);
  domain[0] = Math.min(0, domain[0]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="rgba(230,232,235,0.06)" vertical={false} />
        <XAxis dataKey={xKey} tick={TICK} stroke="rgba(230,232,235,0.16)" tickLine={false} />
        <YAxis domain={domain} tick={TICK} stroke="rgba(230,232,235,0.16)" tickLine={false} width={40} tickFormatter={fmtTick} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey={yKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BoundScatter({
  data,
  xKey,
  yKey,
  color = "var(--accent)",
  highlight,
}: {
  data: Row[];
  xKey: string;
  yKey: string;
  color?: string;
  highlight?: Row[];
}) {
  const xs = data.map((d) => Number(d[xKey]));
  const ys = data.map((d) => Number(d[yKey]));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="rgba(230,232,235,0.06)" />
        <XAxis
          dataKey={xKey}
          type="number"
          domain={padDomain(xs)}
          tick={TICK}
          stroke="rgba(230,232,235,0.16)"
          tickLine={false}
          tickFormatter={fmtTick}
        />
        <YAxis
          dataKey={yKey}
          type="number"
          domain={padDomain(ys)}
          tick={TICK}
          stroke="rgba(230,232,235,0.16)"
          tickLine={false}
          width={52}
          tickFormatter={fmtTick}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Scatter data={data} fill={color} fillOpacity={0.35} />
        {highlight && highlight.length > 0 && <Scatter data={highlight} fill="var(--warn)" />}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
