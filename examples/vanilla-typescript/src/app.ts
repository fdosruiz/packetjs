import { ServiceMap } from './@types';
import typescriptLogo from '/typescript.svg';
import viteLogo from '/vite.svg';
import './css/style.css';

const app = (Services: ServiceMap) => {
  return `
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
      <h1>Vite + TypeScript</h1>
      <h2>${Services.Helper().getProjectName()}</h2>
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
      <p class="read-the-docs">
        Click on the Vite and TypeScript logos to learn more
      </p>
    </div>
  `;
};

export default app;
