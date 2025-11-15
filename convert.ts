import { shiftPath } from "./shift.ts";

/**
 * Type representing a nested object of paths.
 */
export type PathRecord = string[] | string | {
  [key: string]: PathRecord;
};

/**
 * Position of an entry within its parent.
 */
export type EntryPosition = "first" | null | "last";

/**
 * Information about a path for formatting purposes.
 */
export type PathInfo = {
  /**
   * Current indentation level.
   */
  indent: EntryPosition[];
  /**
   * The full path string.
   */
  path: string;
  /**
   * The base name of the current entry.
   */
  base: string;
  /**
   * The path record object.
   */
  record: PathRecord;
  /**
   * The parent path information.
   */
  parent: PathInfo | null;
};

/**
 * Create a lazy generator that yields full paths from a PathRecord.
 * @param rootRecord The PathRecord to iterate over.
 * @param parent The parent path prefix.
 */
export function* pathRecordToGenerator(
  rootRecord: PathRecord,
): Generator<PathInfo> {
  if (typeof rootRecord === "string") {
    rootRecord = { [rootRecord]: "" };
  } else if (Array.isArray(rootRecord)) {
    rootRecord = pathObjectFrom(rootRecord);
  }
  function* proc(
    parentRecord: Record<string, PathRecord>,
    parentInfo: PathInfo,
  ): Generator<PathInfo> {
    const entries = Object.entries(parentRecord);
    for (let [i, [base, record]] of entries.entries()) {
      let info = structuredClone(parentInfo);
      let position: EntryPosition = null;
      switch (i) {
        case entries.length - 1:
          position = "last";
          break;
        case 0:
          position = "first";
          break;
      }
      info.parent = parentInfo;
      info.record = record;
      info.base = base;
      const isTopLevel = Boolean(
        (rootRecord as Record<string, PathRecord>)[base] === record,
      );
      if (isTopLevel) {
        info.path = base;
      } else {
        info.path = info.path + "/" + base;
      }
      info.indent.push(position);
      yield info;
      switch (typeof record) {
        case "object": {
          if (Array.isArray(record)) {
            record = pathObjectFrom(record);
          }
          yield* proc(record as Record<string, PathRecord>, info);
          break;
        }
      }
    }
  }
  yield* proc(rootRecord, {
    indent: [],
    path: "",
    base: "",
    parent: null,
    record: rootRecord,
  });
}

/**
 * Converts a nested object representing paths into an array of string paths.
 * @param record The nested object to convert.
 * @returns Converted array of string paths
 */
export function pathRecordFilesSet(record: PathRecord): Set<string> {
  return new Set<string>(
    Array.from(
      pathRecordToGenerator(record).filter(({ record }) =>
        typeof record === "string"
      ),
      ({ path }) => path,
    ),
  );
}

/**
 * Converts an array of string paths into a nested object representing paths.
 * @param iterable The array of string paths to convert.
 * @returns Converted nested object representing paths
 */
export function pathObjectFrom(
  iterable: Iterable<string>,
): Record<string, PathRecord> {
  let root: PathRecord = {};

  for (const element of iterable) {
    let [next, other, isLast] = shiftPath(element);

    let parent: PathRecord = root;
    if (isLast) {
      parent[next] = "";
      continue;
    }

    let child: PathRecord = parent[next] ?? {};
    parent[next] = child;

    while (!isLast || (parent[next] = "")) {
      parent = child as { [key: string]: PathRecord };
      [next, other, isLast] = shiftPath(other);
      child = parent[next] ?? {};
      parent[next] = child;
    }
  }

  return root;
}
