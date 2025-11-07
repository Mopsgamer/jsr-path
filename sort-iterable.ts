import {
  cmpFileType,
  cmpFirstFiles,
  cmpFirstFolders,
  cmpMixed,
  cmpModified,
} from "./sort-cmp.ts";

/**
 * Creates new array.
 * Files and folders are sorted by their names.
 * Folders are displayed before files.
 */
export function sortFirstFolders(iterable: Iterable<string>): string[] {
  return Array.from(iterable).sort(cmpFirstFolders);
}

/**
 * Creates new array.
 * Files and folders are sorted by their names.
 * Files are displayed before folders.
 */
export function sortFirstFiles(iterable: Iterable<string>): string[] {
  return Array.from(iterable).sort(cmpFirstFiles);
}

/**
 * Creates new array.
 * Files and folders are sorted by last modified date in descending order.
 * Folders are displayed before files.
 */
export function sortModified(
  iterable: Iterable<[file: string, timestamp?: number]>,
): [string, number?][] {
  return Array.from(iterable).sort(
    ([filea, timea], [fileb, timeb]) => cmpModified(filea, fileb, timea, timeb),
  );
}

/**
 * Creates new array.
 * Files and folders are grouped by extension type then sorted by thir names.
 * Folders are displayed before files.
 */
export function sortFileType(iterable: Iterable<string>): string[] {
  return Array.from(iterable).sort(cmpFileType);
}

/**
 * Creates new array.
 * Files and folders are sorted by their names.
 * Files are interwoven with folders.
 */
export function sortMixed(iterable: Iterable<string>): string[] {
  return Array.from(iterable).sort(cmpMixed);
}
