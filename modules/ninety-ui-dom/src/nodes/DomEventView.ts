import {createNode, Node} from "1e14";
import {Flame, replacePathTail} from "flamejet";
import {LeafViewIn, LeafViewOut} from "ninety-view";
import {DomEventType} from "../types";

export type In = LeafViewIn;

export type Out = LeafViewOut & {
  d_event: Flame;
};

// TODO: Re-introduce event type?
//  (Requires generic Flame)
export type DomEventView = Node<In, Out>;

/**
 * On VM, adds/removes a callback which wraps the affected VM path into a
 * Flame.
 * @param type
 */
export function createDomEventView<T extends Event>(
  type: DomEventType
): DomEventView {
  return createNode<In, Out>(["d_event", "d_view"], (outputs) => ({
    d_vm: (value, tag) => {
      const view = {};
      for (const path in value) {
        view[replacePathTail(path, () => type)] = (event) => {
          event.stopImmediatePropagation();
          // TODO: Timestamp event tag?
          outputs.d_event({
            [path]: event
          }, tag);
          return;
        };
      }
      outputs.d_view(view, tag);
    }
  }));
}
