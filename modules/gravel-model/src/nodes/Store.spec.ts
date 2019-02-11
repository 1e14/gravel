import {connect} from "@kwaia/mote";
import {diffObjects, mergeObject} from "../callbacks";
import {createStore, TStore} from "./Store";

describe("createStore()", () => {
  describe("when merger callback is supplied", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(mergeObject, null, {
        bar: true
      });
    });

    describe("on input (d_diff)", () => {
      it("should emit on d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_diff({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          foo: 5
        }, "1");
      });

      it("should emit on d_diff", function () {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_diff({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
      });
    });
  });

  describe("when merger is not supplied", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore();
    });

    it("should emit on ev_err", function () {
      const spy = jasmine.createSpy();
      connect(node.o.ev_err, spy);
      node.i.d_diff({
        del: ["bar"],
        set: [["foo", 5]]
      }, "1");
      expect(spy).toHaveBeenCalledWith(
        "Error: No merger callback. Can't merge.", "1");
    });
  });

  describe("when merger throws", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(() => {
        throw new Error();
      });
    });

    describe("on input (d_diff)", () => {
      it("should bounce", () => {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_diff, spy);
        node.i.d_diff({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
      });

      it("should emit on ev_err", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_diff({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });

  describe("when differ is supplied", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(null, diffObjects, {
        bar: true
      });
    });

    describe("on input (d_val)", () => {
      it("should emit on d_diff", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: ["bar"],
          set: [["foo", 5]]
        }, "1");
      });

      it("should emit on d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          foo: 5
        }, "1");
      });
    });
  });

  describe("when differ is not supplied", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(null, null, {
        bar: true
      });
    });

    describe("on input (d_val)", () => {
      it("should emit on d_val", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          foo: 5
        }, "1");
      });
    });
  });

  describe("when differ throws", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(null, () => {
        throw new Error();
      });
    });

    describe("on input (d_val)", () => {
      it("should bounce", () => {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_val, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          foo: 5
        }, "1");
      });

      it("should emit on ev_err", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_err, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith("Error", "1");
      });
    });
  });

  describe("on input (ev_inv)", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(null, null, {
        bar: true
      });
    });

    it("should emit on (st_inv)", () => {
      const spy = jasmine.createSpy();
      connect(node.o.st_inv, spy);
      node.i.ev_inv(null, "1");
      expect(spy).toHaveBeenCalledWith(true, "1");
    });
  });

  describe("on input (ev_smp)", () => {
    let node: TStore<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createStore(null, null, {
        bar: true
      });
    });

    it("should emit on d_val", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalledWith({
        bar: true
      }, "1");
    });
  });
});
