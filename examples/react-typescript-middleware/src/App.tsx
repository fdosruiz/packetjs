import { useEffect, useState } from "react";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Properties, servicesMap, Comments } from "./@types";
import './css/App.css';

// Definition of the props
interface AppProps {
  services: servicesMap,
  properties: Properties,
}

const App: React.FC<AppProps> = ({ services, properties }) => {
  const [count, setCount] = useState(0);
  const [comments, setComments] = useState([] as Comments[]);

  useEffect(() => {
    services.axios().get('/posts/1/comments').then(({ data }) => setComments(data));
  }, []);

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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <h3>{properties.translations.random} {services.useHelper().getRandom()}</h3>
      <h3>{properties.translations.randomCached} {services.useHelperWithCache().getRandom()}</h3>
      <h4>Comment emails</h4>
      <ul>
        {comments.map((comment) => (
          <div key={comment.id}>
            {comment.email} |
            Middleware UniqId: {comment.uniqId} |
            Middleware Random number: {comment.random}
          </div>
        ))}
      </ul>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;
