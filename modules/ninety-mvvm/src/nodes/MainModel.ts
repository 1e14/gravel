import {Flame} from "flamejet";
import {createNoop, Node} from "flowcode";

export type In = {
  /** Model received from expanders. */
  d_model: Flame;
};

export type Out = {
  /** Model passed on to view-models. */
  d_model: Flame;
};

/**
 * Joins all (expanded) models to be processed by the view-model layer.
 */
export type MainModel = Node<In, Out>;

/**
 * Creates a MainModel node.
 */
export function createMainModel(): MainModel {
  const model = createNoop();
  return {
    i: {
      d_model: model.i.d_val
    },
    o: {
      d_model: model.o.d_val
    }
  };
}
