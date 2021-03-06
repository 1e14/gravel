import {connect} from "flowcode";
import {createFlameStore, FlameStore} from "./FlameStore";

describe("createFlameStore()", () => {
  describe("on input (a_smp)", () => {
    let node: FlameStore;

    beforeEach(() => {
      node = createFlameStore();
      node.i.d_val({
        foo: "bar"
      });
    });

    it("should emit store contents on 'd_val'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.a_smp(null, "2");
      expect(spy).toHaveBeenCalledWith({
        foo: "bar"
      }, "2");
    });
  });

  describe("on input (d_val)", () => {
    let node: FlameStore;

    beforeEach(() => {
      node = createFlameStore();
      node.i.d_val({
        foo: "bar"
      }, "1");
    });

    describe("for non-null properties", () => {
      describe("when property is not equal to stored", () => {
        it("should should include property in emitted flame", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.d_val({
            foo: "quux"
          }, "2");
          expect(spy).toHaveBeenCalledWith({
            foo: "quux"
          }, "2");
        });
      });

      describe("when property is equal to stored", () => {
        it("should should exclude property from emitted flame", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.d_val({
            foo: "bar"
          }, "2");
          expect(spy).toHaveBeenCalledWith({}, "2");
        });
      });
    });

    describe("for null properties", () => {
      describe("when property is stored", () => {
        it("should should include property in emitted flame", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.d_val({
            foo: null
          }, "2");
          expect(spy).toHaveBeenCalledWith({
            foo: null
          }, "2");
        });
      });

      describe("when property is not stored", () => {
        it("should should exclude property from emitted flame", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_val, spy);
          node.i.d_val({
            baz: null
          }, "2");
          expect(spy).toHaveBeenCalledWith({}, "2");
        });
      });
    });
  });
});
