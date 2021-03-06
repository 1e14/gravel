import {delDomProperty} from "./delDomProperty";
import {setDomProperty} from "./setDomProperty";

describe("delDomProperty()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.Attr = function () {//
    };
    window.Comment = function () {
      this.parentNode = null;
    };
    window.Text = function () {
      this.parentNode = null;
    };
    window.CSSStyleDeclaration = function () {//
    };
    window.DOMTokenList = function () {
      this._items = {};
    };
    window.DOMTokenList.prototype = {
      add(name) {
        this._items[name] = name;
      },
      contains(name) {
        return this._items[name] !== undefined;
      },
      remove(name) {
        delete this._items[name];
      }
    };
    window.NamedNodeMap = function () {
      this._items = {};
    };
    window.NamedNodeMap.prototype = {
      getNamedItem(name) {
        return this._items[name];
      },
      removeNamedItem(name) {
        delete this._items[name];
      },
      setNamedItem(attr) {
        this._items[attr.name] = attr;
      }
    };
    window.Node = function () {
      this.childNodes = new window.NodeList();
      this.parentNode = null;
    };
    window.Node.prototype = {
      appendChild(newChild: Node) {
        this.childNodes[this.childNodes.length++] = newChild;
        (<any>newChild).parentNode = this;
      },
      replaceChild(newChild, oldChild) {
        for (let i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i] === oldChild) {
            this.childNodes[i] = newChild;
            (<any>newChild).parentNode = this;
            break;
          }
        }
      }
    };
    window.NodeList = function () {
      this.length = 0;
    };
    window.Element = function () {
      window.Node.call(this);
      this.attributes = new window.NamedNodeMap();
      this.classList = new window.DOMTokenList();
    };
    window.Element.prototype = Object.create(window.Node.prototype);
    window.HTMLElement = function () {
      window.Element.call(this);
      this.style = new window.CSSStyleDeclaration();
    };
    window.HTMLElement.prototype = Object.create(window.Element.prototype);
    window.document = new Node();
    window.document.body = new window.Node();
    window.document.createAttribute = (name) => {
      const attr = new window.Attr();
      attr.name = name;
      return attr;
    };
    window.document.createComment = (data) => {
      const comment = new window.Comment();
      comment.data = data;
      return comment;
    };
    window.document.createElement = (tagName) => {
      const node = new window.HTMLElement();
      node.tagName = tagName;
      return node;
    };
  });

  afterEach(() => {
    delete window.Attr;
    delete window.Comment;
    delete window.CSSStyleDeclaration;
    delete window.DOMTokenList;
    delete window.NamedNodeMap;
    delete window.Node;
    delete window.NodeList;
    delete window.Element;
    delete window.HTMLElement;
    delete window.document;
  });

  describe("for node", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProperty(stack, path, "bar");
    });

    it("should replace node w/ comment", () => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3";
      delDomProperty(stack, path);
      const node = window.document.body.childNodes[1].childNodes[3];
      expect(node instanceof window.Comment).toBeTruthy();
    });
  });

  describe("for attribute", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProperty(stack, path, "bar");
    });

    it("should remove attribute", () => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.attributes.foo";
      delDomProperty(stack, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].attributes
        .getNamedItem("foo")
      ).toBeUndefined();
    });
  });

  describe("for CSS class", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProperty(stack, path, "bar");
    });

    it("should remove class", () => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.classList.foo";
      delDomProperty(stack, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].classList.contains("foo")
      ).toBeFalsy();
    });
  });

  describe("for style", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.style.foo";
      setDomProperty(stack, path, "bar");
    });

    it("should remove class", () => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.style.foo";
      delDomProperty(stack, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].style.foo
      ).toBe(null);
    });
  });

  describe("for event handler", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.onclick";
      setDomProperty(stack, path, () => null);
    });

    it("should reset handler property", () => {
      const stack = [window.document.body];
      const path = "childNodes.1:div.childNodes.3:span.onclick";
      delDomProperty(stack, path);
      expect(window.document.body.childNodes[1].childNodes[3].onclick)
      .toBe(null);
    });
  });
});
