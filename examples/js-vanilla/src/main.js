import container from './dependency-injection';
import { setupCounter } from './counter.js';
import app from "./app.js";

document.querySelector('#app').innerHTML = app(
  container.getAll(),
);

setupCounter(
  document.querySelector('#counter'),
  container.get('Helper'),
  container.getProps(),
);
