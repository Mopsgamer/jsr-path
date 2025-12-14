export type ShiftResult = {
  next: string;
  other: string;
  isLast: boolean;
};

/**
 * @example
 * "path/to/the/file" -> ["path", "to/the/file", false]
 * "file" -> ["file", "file", true]
 * "file/" -> ["file", "", false]
 */
export function shiftPath(p: string): ShiftResult {
  const slashIndex = p.search(/[/\\]/);
  const next = p.slice(0, Math.max(0, slashIndex));
  const other = p.slice(Math.max(0, slashIndex + 1));
  const r: ShiftResult = {
    next: next,
    other: other,
    isLast: next == "",
  };
  if (slashIndex < 0) {
    r.next = r.other;
  }
  return r;
}
