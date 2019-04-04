import {countCommonComponents, Flame} from "flamejet";
import {setDomProperty} from "./setDomProperty";

/**
 * Applies the 'set' side of a view diff to the DOM.
 * @param diffSet Collection of DOM path - value pairs.
 */
export function applyDomDiffSet(diffSet: Flame): Flame {
  const bounced: Flame = {};
  const stack = [window.document.body];
  let applied = true;
  let last: string = "body";
  for (const path in diffSet) {
    const count = countCommonComponents(path, last);
    if (stack.length > count) {
      // trimming stack back to common root
      stack.length = count;
    }
    const value = diffSet[path];
    const success = setDomProperty(stack, path, value);
    if (!success) {
      bounced[path] = value;
      applied = false;
    }
    last = path;
  }
  return applied ? undefined : bounced;
}