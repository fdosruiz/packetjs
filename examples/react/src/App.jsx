import { useState } from 'react';
import PropTypes from 'prop-types';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './css/App.css';

function App({
 services,
 properties,
}) {
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
      <h2>{services.Helper().getProjectName()}</h2>
      <h3>{properties.translations.random} {services.Helper().getRandom()}</h3>
      <h3>{properties.translations.randomCached} {services.HelperWithCache().getRandom()}</h3>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

App.propTypes = {
  services: PropTypes.shape({
    Helper: PropTypes.func.isRequired,
    HelperWithCache: PropTypes.func.isRequired,
  }).isRequired,
  properties: PropTypes.shape({
    translations: PropTypes.shape({
      random: PropTypes.string.isRequired,
      randomCached: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default App;
