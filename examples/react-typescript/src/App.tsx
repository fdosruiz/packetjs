import { useState } from 'react';
import { Properties, servicesMap } from "./@types";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './css/App.css';

// Definition of the props
interface AppProps {
  services: servicesMap,
  properties: Properties,
}

const App: React.FC<AppProps> = ({ services, properties }) => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{services.useHelper().getProjectName()}</h2>
      <h3>{properties.translations.random} {services.useHelper().getRandom()}</h3>
      <h3>{properties.translations.randomCached} {services.useHelperWithCache().getRandom()}</h3>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;
