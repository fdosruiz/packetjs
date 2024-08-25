import container from './dependency-injection';
import { ServiceMap, Helper, Properties } from "./@types";
import app from './app.ts';
import { setupCounter } from './counter.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = app(
  container.getAll<ServiceMap>(),
);

setupCounter(
  document.querySelector<HTMLButtonElement>('#counter')!,
  container.get<Helper>('Helper'),
  container.getProps<Properties>(),
);
