// tslint:disable:no-console

import {createDiffBuffer} from "gravel-core";
import {createRouter} from "gravel-routing";
import {createDomDiffApplier} from "gravel-view-dom";
import {createDomLinkView, createDomTextView} from "gravel-view-dom-lib";
import {createDomReadyNotifier, createLocationHash} from "river-browser";
import {connect} from "river-core";
import {createMapper, createNoop} from "river-stdlib";
import {createAnimatedTablePageView} from "./nodes";

// setting up bootstrapper
const domReadyNotifier = createDomReadyNotifier();

// setting up hash-based routing
const locationHash = createLocationHash();
const hash2Path = createMapper<string, string>((hash) => hash.substr(1));
connect(locationHash.o.d_val, hash2Path.i.d_val);

// setting up rendering engine
// flushes diff buffer to renderer every 10ms
const ticker = createNoop();
const viewBuffer = createDiffBuffer();
const domDiffApplier = createDomDiffApplier();
setInterval(ticker.i.d_val, 10);
connect(viewBuffer.o.d_diff, domDiffApplier.i.d_diff);
connect(ticker.o.d_val, viewBuffer.i.ev_res);

const ROOT_PATH = "body";

// menu
const MENU_PATH = `${ROOT_PATH}.childNodes.0:ul`;
const LINK_PATH = "childNodes.0:a";
const link1 = createDomLinkView(`${MENU_PATH}.childNodes.0:li.${LINK_PATH}`, {
  content: "Hello World",
  url: "#hello-world"
});
const link2 = createDomLinkView(`${MENU_PATH}.childNodes.1:li.${LINK_PATH}`, {
  content: "Animated table",
  url: "#animated-table"
});
connect(link1.o.v_diff, viewBuffer.i.d_diff);
connect(link2.o.v_diff, viewBuffer.i.d_diff);
connect(domReadyNotifier.o.ev_ready, link1.i.ev_smp);
connect(domReadyNotifier.o.ev_ready, link2.i.ev_smp);

// setting up routes
const ROUTE_CUSTOM_TEXT = /^hello-world$/;
const ROUTE_TABLE = /^animated-table$/;
const ROUTE_REST = /^.*$/;

// "page" 1: custom text field
const textView = createDomTextView(`${ROOT_PATH}.childNodes.1:span`, {
  content: "Hello World!"
});
connect(textView.o.v_diff, viewBuffer.i.d_diff);

// "page" 2: table w/ numbers
const tableRouteDetector = createMapper<RegExp, boolean>(
  (pattern) => pattern === ROUTE_TABLE);
const tablePageView = createAnimatedTablePageView(`${ROOT_PATH}.childNodes.1:div`);
connect(tableRouteDetector.o.d_val, tablePageView.i.st_active);
connect(tablePageView.o.v_diff, viewBuffer.i.d_diff);

// setting up routing table
const router = createRouter([
  ROUTE_CUSTOM_TEXT,
  ROUTE_TABLE,
  ROUTE_REST
]);
connect(hash2Path.o.d_val, router.i.d_route);
connect(router.o[`r_${ROUTE_CUSTOM_TEXT}`], textView.i.ev_smp);
connect(router.o.d_pattern, tableRouteDetector.i.d_val);
connect(router.o[`r_${ROUTE_TABLE}`], tablePageView.i.ev_smp);
