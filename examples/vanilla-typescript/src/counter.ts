import { Helper, Properties } from './@types';

export function setupCounter(
  element: HTMLButtonElement,
  Helper: Helper,
  properties: Properties,
) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter} | ${properties.translations.random} ${Helper.getRandom()}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
