import {createNode, Node} from "flowcode";
import {Flame} from "../types";
import {
  countPathComponents,
  replacePathComponent,
  replacePathTail
} from "../utils";

export type In = {
  /** Output flame processed by children */
  d_out: Flame;

  /** Input flame passed down by parent */
  d_in: Flame;
};

export type Out = {
  /** Output flame processed by current node */
  d_out: Flame;

  /** Input flame to be passed down to children */
  d_in: Flame;
};

/**
 * Forwards input flame, collects output flame, and maps flame paths at
 * given depth.
 */
export type FlameBodyMapper = Node<In, Out>;

/**
 * Creates a FlameBodyMapper node.
 * @param cb Maps input path component to output path component.
 * @param depth Specifies location in the path.
 */
export function createFlameBodyMapper(
  cb: (component: string) => string,
  depth: number = 0
): FlameBodyMapper {
  return createNode<In, Out>(["d_out", "d_in"], (outputs) => ({
    d_in: (flameIn, tag) => {
      // passing input on towards children
      // (must be split up before children get its contents)
      outputs.d_in(flameIn, tag);

      // bouncing subtree delete paths
      const flameOut: Flame = {};
      for (const pathIn in flameIn) {
        if (flameIn[pathIn] === null && countPathComponents(pathIn) === depth + 1) {
          flameOut[replacePathTail(pathIn, cb)] = null;
        }
      }
      for (const path in flameOut) {
        outputs.d_out(flameOut, tag);
        break;
      }
    },

    d_out: (flameIn, tag) => {
      const flameOut = {};
      for (const pathIn in flameIn) {
        flameOut[replacePathComponent(pathIn, depth, cb)] = flameIn[pathIn];
      }
      outputs.d_out(flameOut, tag);
    }
  }));
}
