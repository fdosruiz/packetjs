export function setupCounter(
  element,
  Helper,
  properties,
) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter} | ${properties.translations.random} ${Helper.getRandom()}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
}
