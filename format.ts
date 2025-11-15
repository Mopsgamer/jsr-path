import { pathRecordToGenerator } from "./convert.ts";
import type { PathInfo, PathObject } from "./convert.ts";

/**
 * Function type for formatting a path info object.
 * @param format The path information to format.
 * @returns Formatted string representation of the path.
 */
export type Formatter = (format: PathInfo) => string;

/**
 * Default formatter function for path info.
 * @param info The path information to format.
 * @returns Formatted string representation of the path.
 */
export function formatDefault(info: PathInfo): string {
  const preIndent = info.indent.slice(0, info.indent.length - 1);
  const pre = preIndent.map((pos) => pos === "last" ? "    " : "│   ").join("");
  const position = info.indent.at(-1);
  let own = "";
  if (position || position == null) {
    if (position === "last") {
      own = "└── ";
    } else {
      own = "├── ";
    }
  }
  return pre + own + info.base;
}

/**
 * Formats a nested object of paths into a string representation.
 * @param record The path record to format.
 * @param formatter Optional custom formatter function.
 * @returns Formatted string representation of the paths.
 */
export function format(
  record: PathObject,
  formatter: Formatter = formatDefault,
): string {
  return Array.from(pathRecordToGenerator(record), (info) => formatter(info))
    .join("\n") + "\n";
}
