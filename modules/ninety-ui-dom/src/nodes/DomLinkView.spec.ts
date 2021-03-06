import {connect} from "flowcode";
import {createDomLinkView, DomLinkView} from "./DomLinkView";

describe("createDomLinkView()", () => {
  describe("on input (d_in)", () => {
    let node: DomLinkView;

    beforeEach(() => {
      node = createDomLinkView(() => "childNodes.0:A", 0);
    });

    describe("on set", () => {
      it("should emit mapped vm on 'd_out'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          "foo.text": "Hello",
          "foo.url": "http://"
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          "childNodes.0:A.innerText": "Hello"
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          "childNodes.0:A.href": "http://"
        }, "1");
      });
    });

    describe("on del", () => {
      beforeEach(() => {
        node.i.d_vm({
          "foo.text": "Hello",
          "foo.url": "http://"
        }, "1");
      });

      it("should emit mapped vm on 'd_out'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          "foo.text": null,
          "foo.url": null
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          "childNodes.0:A.innerText": null
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          "childNodes.0:A.href": null
        }, "2");
      });
    });
  });
});
