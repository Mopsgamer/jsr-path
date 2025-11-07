/**
 * @example
 * "path/to/the/file" -> ["path", "to/the/file", false]
 * "file" -> ["file", "file", true]
 * "file/" -> ["file", "", false]
 */
export function shiftPath(
  p: string,
): [next: string, other: string, isLast: boolean] {
  const slashIndex = p.search(/[/\\]/);
  const next = p.slice(0, Math.max(0, slashIndex));
  const other = p.slice(Math.max(0, slashIndex + 1));
  const isLast = next === "";
  return [slashIndex < 0 ? other : next, other, isLast];
}
