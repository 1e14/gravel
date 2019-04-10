import {connect} from "1e14";
import {createDomStyleView, DomStyleView} from "./DomStyleView";

describe("createDomStyleView()", () => {
  describe("on input (d_vm)", () => {
    let node: DomStyleView;

    beforeEach(() => {
      node = createDomStyleView("foo");
    });

    it("should emit on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_vm({
        "bar.baz": "a"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "bar.style,foo": "a"
      }, "1");
    });
  });
});
