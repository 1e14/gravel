import {createNode, Node} from "1e14";
import {Flame, FlameDiff, NullFlame} from "flamejet";

export type In = {
  d_view: FlameDiff;
  ev_next: any;
};

export type Out = {
  d_frame: FlameDiff;
  d_length: number;
};

export type FrameQueue = Node<In, Out>;

export function createFrameQueue(frameSize: number): FrameQueue {
  return createNode<In, Out>(["d_frame", "d_length"], (outputs) => {
    const frames = [];
    let lastSize = 0;

    /**
     * Spreads diff.set across scheduled frames.
     * @param diffSet
     */
    function spreadSet(diffSet: Flame): void {
      let applied = false;
      for (const path in diffSet) {
        const length = frames.length;
        // distributing path across existing frames
        for (let i = 0; i < length; i++) {
          const frame = frames[i];
          const frameSet = frame.set;
          const frameDel = frame.del;
          if (path in frameDel) {
            delete frameDel[path];
            applied = true;
            break;
          } else if (path in frameSet) {
            frameSet[path] = diffSet[path];
            applied = true;
            break;
          }
        }

        if (!applied) {
          let frame = frames[length - 1];
          let frameSet = frame && frame.set;
          let frameDel = frame && frame.del;
          if (frameDel && path in frameDel) {
            delete frameDel[path];
            lastSize--;
          } else if (frameSet && lastSize < frameSize) {
            // there is room in latest frame
            frameSet[path] = diffSet[path];
            lastSize++;
          } else {
            // must open new frame
            frameSet = {};
            frameDel = {};
            frame = {set: frameSet, del: frameDel};
            frames.push(frame);
            frameSet[path] = diffSet[path];
            lastSize = 1;
          }
        }
      }
    }

    /**
     * Spreads diff.del across scheduled frames.
     * @param diffDel
     */
    function spreadDel(diffDel: NullFlame): void {
      let applied = false;
      for (const path in diffDel) {
        const length = frames.length;
        // distributing path across existing frames
        for (let i = 0; i < length; i++) {
          const frame = frames[i];
          const frameSet = frame.set;
          const frameDel = frame.del;
          if (path in frameSet) {
            delete frameSet[path];
            applied = true;
            break;
          } else if (path in frameDel) {
            frameDel[path] = null;
            applied = true;
            break;
          }
        }

        if (!applied) {
          let frame = frames[length - 1];
          let frameSet = frame && frame.set;
          let frameDel = frame && frame.del;
          if (frameSet && path in frameSet) {
            delete frameSet[path];
            lastSize--;
          } else if (frameDel && lastSize < frameSize) {
            // there is room in latest frame
            frameDel[path] = null;
            lastSize++;
          } else {
            // must open new frame
            frameSet = {};
            frameDel = {};
            frame = {set: frameSet, del: frameDel};
            frames.push(frame);
            frameDel[path] = null;
            lastSize = 1;
          }
        }
      }
    }

    return {
      d_view: (value, tag) => {
        spreadDel(value.del);
        spreadSet(value.set);
        outputs.d_length(frames.length, tag);
      },

      ev_next: (value, tag) => {
        const frame = frames.length ?
          frames.shift() :
          undefined;
        outputs.d_frame(frame, tag);
        outputs.d_length(frames.length, tag);
      }
    };
  });
}