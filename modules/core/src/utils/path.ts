import {Any} from "river-core";
import {Flames} from "../types";

export const PATH_DELIMITER = ".";

/**
 * Prepends all paths in the specified diff with the specified prefix.
 * @deprecated Only used in DomEventView
 * @param flames
 * @param prefix
 */
export function prefixFlamePaths(
  flames: Flames, prefix: string
): Flames {
  const result = {};
  for (const name in flames) {
    const branch = flames[name];
    const flame = result[name] = result[name] || {};
    for (const path in branch) {
      flame[prefix + PATH_DELIMITER + path] = branch[path];
    }
  }
  return result;
}

/**
 * Extracts root path from the specified path-indexed lookup.
 * @param paths
 */
export function getRootPath(paths: Any): string {
  let keys: Array<string>;
  let root: string;
  for (const path in paths) {
    if (keys) {
      if (!path.startsWith(root)) {
        const split = path.split(PATH_DELIMITER);
        const length = Math.min(keys.length, split.length);
        let i;
        for (i = 0; i < length; i++) {
          if (keys[i] !== split[i]) {
            break;
          }
        }
        keys = keys.splice(0, i);
        root = keys.join(PATH_DELIMITER);
      }
    } else {
      const split = path.split(PATH_DELIMITER);
      split.pop();
      keys = split;
      root = keys.join(PATH_DELIMITER);
    }
  }
  return root;
}

/**
 * Retrieves the specified path component.
 * Not protected from out-of-bounds indexes for performance reasons.
 * @param path
 * @param index
 * @link https://jsperf.com/path-component-extraction
 */
export function getPathComponent(path: string, index: number): string {
  let start = 0;
  let end = path.indexOf(PATH_DELIMITER, start);
  while (index--) {
    start = end + 1;
    end = path.indexOf(PATH_DELIMITER, start);
  }
  if (end === -1) {
    return path.substring(start);
  } else {
    return path.substring(start, end);
  }
}

/**
 * Replaces the specified path component with the result of the specified
 * callback.
 * @param path
 * @param at
 * @param cb
 */
export function replacePathComponent(
  path: string,
  at: number,
  cb: (comp: string) => string
) {
  let start = 0;
  let end = path.indexOf(PATH_DELIMITER, start);
  while (at--) {
    start = end + 1;
    end = path.indexOf(PATH_DELIMITER, start);
  }
  if (end === -1) {
    return path.slice(0, start) + cb(path.slice(start));
  } else {
    return path.slice(0, start) + cb(path.slice(start, end)) + path.slice(end);
  }
}

/**
 * Replaces the specified path component and the rest of the path with the
 * result of the specified callback.
 * @param path
 * @param cb
 * TODO: Rename to replacePathTail once other replacePathTail is removed.
 */
export function replacePathTail2(
  path: string,
  cb: (comp: string) => string
): string {
  const pos = path.lastIndexOf(PATH_DELIMITER);
  return path.slice(0, pos + 1) + cb(path.slice(pos + 1));
}

/**
 * Replaces the matching end of the path with the specified string.
 * @param path
 * @param to
 */
export function replacePathTail(path: string, to: string): string {
  return path.substring(0, path.lastIndexOf(PATH_DELIMITER) + 1) + to;
}
