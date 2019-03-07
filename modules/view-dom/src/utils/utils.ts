import {Diff, DiffDel, DiffSet} from "gravel-core";
import {Any} from "river-core";

/**
 * Adds placeholder comment nodes to the specified parent node up to the
 * (but not including) the specified index.
 * @param parent Parent DOM node
 * @param index Index up to which to create placeholder nodes.
 */
function addPlaceholders(parent: Node, index: number): void {
  for (let i = parent.childNodes.length; i < index; i++) {
    const placeholder = document.createComment("");
    parent.appendChild(placeholder);
  }
}

/**
 * Sets a single property in the DOM.
 * @param path Path to a DOM node. Elements must specify both childIndex &
 * tagName, otherwise follows hierarchy.
 * @param value Property value to be set.
 */
export function setDomProperty(path: string, value: any): boolean {
  const components = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  do {
    const component = components.shift();
    if (tmp instanceof Node) {
      if (components.length) {
        // setting current node as last parent, and going on to the specified
        // property
        parent = tmp;
        tmp = tmp[component];
      } else {
        // node property
        tmp[component] = value;
        return true;
      }
    } else if (tmp instanceof NodeList) {
      // extracting child index & tagName from path component
      const [index, tagName] = component.split(":");
      const node = tmp[index];
      if (node === undefined) {
        if (tagName === undefined) {
          // no tagName - can't proceed
          return false;
        }
        addPlaceholders(parent, +index);
        tmp = document.createElement(tagName);
        parent.appendChild(tmp);
      } else if (node instanceof Comment || node instanceof Text) {
        // replacing existing placeholder
        tmp = document.createElement(tagName);
        parent.replaceChild(tmp, node);
      } else {
        // in any other case - proceed to specified property
        tmp = tmp[index];
      }
    } else if (tmp instanceof NamedNodeMap) {
      // attributes
      let attribute = tmp.getNamedItem(component);
      if (!attribute) {
        attribute = document.createAttribute(component);
        tmp.setNamedItem(attribute);
      }
      attribute.value = value;
      return true;
    } else if (tmp instanceof DOMTokenList) {
      // CSS classes
      tmp.add(component, component);
      return true;
    } else if (tmp instanceof CSSStyleDeclaration) {
      // CSS styles
      tmp[component] = value;
      return true;
    } else {
      // unrecognized property parent
      return false;
    }
  } while (components.length);
}

/**
 * Deletes a single property from the DOM.
 * @param path Path to DOM node.
 */
export function delDomProperty(path: string): boolean {
  const components = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  let component: string;

  // finding parent node / property
  for (let i = 0, length = components.length - 1; i < length; i++) {
    component = components.shift();
    if (tmp instanceof Node) {
      parent = tmp;
      tmp = tmp[component];
    } else if (tmp instanceof NodeList) {
      const [index] = component.split(":");
      tmp = tmp[index];
    } else {
      tmp = tmp[component];
    }

    if (tmp === undefined) {
      // path not found
      return true;
    }
  }

  // deleting property
  component = components.shift();
  if (tmp instanceof Node) {
    // node property
    tmp[component] = null;
  } else if (tmp instanceof NodeList) {
    // extracting child index from path component
    const [index] = component.split(":");
    const node = tmp[index];
    if (node !== undefined) {
      // replacing node w/ placeholder
      tmp = document.createComment("");
      parent.replaceChild(tmp, node);
    }
  } else if (tmp instanceof NamedNodeMap) {
    // attributes
    tmp.removeNamedItem(component);
  } else if (tmp instanceof DOMTokenList) {
    // CSS classes
    tmp.remove(component);
  } else if (tmp instanceof CSSStyleDeclaration) {
    // CSS styles
    tmp[component] = null;
  } else {
    // unrecognized property parent
    return false;
  }

  return true;
}

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: Diff<Any>): Diff<Any> | true {
  const bounced: Diff<Any> = {};
  const viewSet = diff.set;
  let applied = true;
  const viewDel = diff.del;
  if (viewDel) {
    const bouncedDel: DiffDel<Any> = bounced.del = {};
    for (const path in viewDel) {
      if (!delDomProperty(path)) {
        bouncedDel[path] = null;
        applied = false;
      }
    }
  }
  if (viewSet) {
    const bouncedSet: DiffSet<Any> = bounced.set = {};
    for (const path in viewSet) {
      const value = viewSet[path];
      if (!setDomProperty(path, value)) {
        bouncedSet[path] = value;
        applied = false;
      }
    }
  }
  return applied || bounced;
}
