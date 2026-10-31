import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function destination(
  lat: number,
  lng: number,
  headingDeg: number,
  distKm: number,
): [number, number] {
  const r = 6371;
  const d = distKm / r;
  const h = (headingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(h),
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(h) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    );
  return [((lat2 * 180) / Math.PI), ((((lng2 * 180) / Math.PI + 540) % 360) - 180)];
}

export function fmtNum(n: number, d = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export function fmtInt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtPct(n: number, d = 2, sign = true) {
  const body = `${Math.abs(n).toFixed(d)}%`;
  if (!sign) return n < 0 ? `−${body}` : body;
  if (n > 0) return `+${body}`;
  if (n < 0) return `−${body}`;
  return `+${body}`;
}

export function fmtSigned(n: number, d = 1) {
  const body = Math.abs(n).toFixed(d);
  if (n > 0) return `+${body}`;
  if (n < 0) return `−${body}`;
  return body;
}

export function utcStamp(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function utcDate(ts: number) {
  const d = new Date(ts);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${dd} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function utcFull(ts: number) {
  return `${utcDate(ts)}  ${utcStamp(ts)} UTC`;
}

export function dayKey(ts: number) {
  return Math.floor(ts / 86_400_000);
}

export function hourKey(ts: number) {
  return Math.floor(ts / 3_600_000);
}

export function series(seed: string, n: number, base: number, vol: number, ts: number) {
  const rand = mulberry32(hashStr(seed) ^ dayKey(ts));
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.48) * vol;
    out.push(v);
  }
  return out;
}
