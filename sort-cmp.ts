import path from "node:path";
import { shiftPath } from "./shift.ts";

/**
 * Contains all file sort names.
 * @see {@link SortName}
 */
export const sortNameList = [
  "firstFolders",
  "firstFiles",
  "fileType",
  "mixed",
  "modified",
] as const;

/**
 * Contains all file sort names as a type.
 * `firstFolders` - Files and folders are sorted by their names.
 * Folders are displayed before files.
 * `firstFiles` - Files and folders are sorted by their names.
 * Files are displayed before folders.
 * `fileType` - Files and folders are grouped by extension type then sorted by thir names.
 * Folders are displayed before files.
 * `mixed` - Files and folders are sorted by their names.
 * Files are interwoven with folders.
 * `modified` - Files and folders are sorted by last modified date in descending order.
 * Folders are displayed before files.
 */
export type SortName = typeof sortNameList[number];

/**
 * {@link Array.prototype.sort}'s file path comparator.
 */
export type SortFunction = (a: string, b: string) => number;

/**
 * Checks if the value is a valid {@link SortName}.
 */
export function isSortName(value: unknown): value is SortName {
  return typeof value === "string" && sortNameList.includes(value as SortName);
}

/**
 * Files and folders are sorted by their names.
 * Folders are displayed before files.
 */
export function cmpFirstFolders(a: string, b: string): number {
  if (a === b) return 0;
  let comp = 0;
  while (comp === 0) {
    const { next: next1, other: post1, isLast: last1 } = shiftPath(a);
    a = post1;
    const { next: next2, other: post2, isLast: last2 } = shiftPath(b);
    b = post2;

    comp = cmpMixed(next1, next2);

    if (!last1 && !last2) continue;
    if (last1 && last2) break;
    if (!last1) return -1;
    return +1;
  }

  return comp;
}

/**
 * Files and folders are sorted by their names.
 * Files are displayed before folders.
 */
export function cmpFirstFiles(a: string, b: string): number {
  if (a === b) return 0;
  let comp = 0;
  while (comp === 0) {
    const { next: next1, other: post1, isLast: last1 } = shiftPath(a);
    a = post1;
    const { next: next2, other: post2, isLast: last2 } = shiftPath(b);
    b = post2;

    comp = cmpMixed(next1, next2);

    if (!last1 && !last2) continue;
    if (last1 && last2) break;
    if (last1) return -1;
    return +1;
  }

  return comp;
}

/**
 * Files and folders are sorted by last modified date in descending order.
 * Folders are displayed before files.
 */
export function cmpModified(
  a: string,
  b: string,
  timea: number = 0,
  timeb: number = 0,
): number {
  let comp = 0;
  while (comp === 0) {
    const { next: next1, other: post1, isLast: last1 } = shiftPath(a);
    a = post1;
    const { next: next2, other: post2, isLast: last2 } = shiftPath(b);
    b = post2;

    comp = timeb - timea || cmpMixed(next1, next2);

    if (!last1 && !last2) continue;
    if (last1 && last2) break;
    if (!last1) return -1;
    return +1;
  }

  return comp || cmpFirstFolders(a, b);
}

/**
 * Files and folders are grouped by extension type then sorted by thir names.
 * Folders are displayed before files.
 */
export function cmpFileType(a: string, b: string): number {
  if (a === b) return 0;
  let comp = 0;
  while (comp === 0) {
    const { next: next1, other: post1, isLast: last1 } = shiftPath(a);
    a = post1;
    const { next: next2, other: post2, isLast: last2 } = shiftPath(b);
    b = post2;

    const ppa = path.parse(next1);
    const ppb = path.parse(next2);
    comp = cmpMixed(ppa.ext, ppb.ext) || cmpMixed(ppa.name, ppb.name);

    if (!last1 && !last2) continue;
    if (last1 && last2) break;
    if (!last1) return -1;
    return +1;
  }

  return comp;
}

/**
 * Files and folders are sorted by their names.
 * Files are interwoven with folders.
 */
export function cmpMixed(a: string, b: string): number {
  if (a === b) return 0;
  return a.localeCompare(b, undefined, { ignorePunctuation: false });
}
