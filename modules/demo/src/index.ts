import {applyDomView} from "gravel-view-dom";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";

const locationHash = createLocationHash();

connect(locationHash.o.d_val, () => {
  applyDomView({
    set: {
      "body.childNodes.4:section.attributes.bar": "baz",
      "body.childNodes.4:section.childNodes.0:span.innerText": "Hello World!",
      "body.childNodes.4:section.childNodes.0:span.style.color": "red",
      "body.childNodes.4:section.classList.foo": true,
      "body.childNodes.4:section.style.backgroundColor": "green",
      "body.childNodes.4:section.style.height": "100px",
    }
  });
  applyDomView({
    set: {
      "body.childNodes.2:div.attributes.id": "quux",
      "body.childNodes.4:section.attributes.bar": "BAZ"
    }
  });
});
