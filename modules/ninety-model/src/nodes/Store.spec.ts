import {connect} from "1e14";
import {createStore, Store} from "./Store";

describe("createModel()", () => {
  describe("on input (d_model)", () => {
    let node: Store<{
      "emails.home"?: string;
      "emails.work"?: string;
      "id": string;
      "name"?: string;
    }>;

    beforeEach(() => {
      node = createStore();
    });

    describe("when buffer is empty", () => {
      it("should merge input into buffer", () => {
        const spy = jasmine.createSpy();
        node.i.d_model({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
        connect(node.o.d_model, spy);
        node.i.a_smp(["5"], "2");
        expect(spy).toHaveBeenCalledWith({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "2");
      });

      it("should emit flame on 'd_model'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_model, spy);
        node.i.d_model({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
      });
    });

    describe("when buffer has matching content", () => {
      beforeEach(() => {
        node.i.d_model({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
      });

      it("should merge input into buffer", () => {
        const spy = jasmine.createSpy();
        node.i.d_model({
          5: {
            "emails.home": null,
            "emails.work": "phoebe@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
        connect(node.o.d_model, spy);
        node.i.a_smp(["5"], "2");
        expect(spy).toHaveBeenCalledWith({
          5: {
            "emails.work": "phoebe@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "2");
      });

      it("should emit diff on 'd_model'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_model, spy);
        node.i.d_model({
          5: {
            "emails.home": null,
            "emails.work": "phoebe@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          5: {
            "emails.home": null,
            "emails.work": "phoebe@friends.com"
          }
        }, "1");
      });
    });

    describe("when buffer has invalidated content", () => {
      beforeEach(() => {
        node.i.d_model({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5",
            "name": "Regina Phalange"
          }
        }, "1");
        node.i.a_inv(["5"], "2");
      });

      it("should reset invalid state", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_inv, spy);
        node.i.d_model({
          5: {
            "emails.home": "regphal@friends.com",
            "id": "5"
          }
        }, "3");
        expect(spy).toHaveBeenCalledWith({
          5: false
        }, "3");
      });
    });
  });

  describe("on input (a_inv)", () => {
    let node: Store<{
      "emails.home"?: string;
      "emails.work"?: string;
      "id": string;
      "name"?: string;
    }>;

    beforeEach(() => {
      node = createStore();
      node.i.d_model({
        5: {
          "emails.home": "regphal@friends.com",
          "id": "5",
          "name": "Regina Phalange"
        }
      }, "1");
    });

    it("should emit invalidated entries on 'a_inv'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.ev_inv, spy);
      node.i.a_inv(["5"], "1");
      expect(spy).toHaveBeenCalledWith({
        5: true
      }, "1");
    });

    describe("on invalid ID", () => {
      it("should not emit on 'a_inv'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_inv, spy);
        node.i.a_inv(["3"]);
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("when entry is already invalidated", () => {
      beforeEach(() => {
        node.i.a_inv(["5"]);
      });

      it("should not emit on 'e_inv'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_inv, spy);
        node.i.a_inv(["5"]);
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (a_smp)", () => {
    let node: Store<{
      "emails.home"?: string;
      "emails.work"?: string;
      "id": string;
      "name"?: string;
    }>;

    beforeEach(() => {
      node = createStore();
      node.i.d_model({
        5: {
          "emails.home": "regphal@friends.com",
          "id": "5",
          "name": "Regina Phalange"
        }
      }, "1");
    });

    it("should emit buffer contents on 'd_model'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_model, spy);
      node.i.a_smp(["5", "6"], "2");
      expect(spy).toHaveBeenCalledWith({
        5: {
          "emails.home": "regphal@friends.com",
          "id": "5",
          "name": "Regina Phalange"
        },
        6: null
      }, "2");
    });
  });
});
