
import { useEffect, useState } from 'react';
import './App.css';
import Samcode from './Component/Samcode';
import UseFetchApi from './Component/UseFetchApi';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component rendered');
    console.log('Counter: ' + count);
  });

  function ChangeCounter() {
    setCount(count + 2);
  }

  return (
    <>
      <h2>Welcome to JSX</h2>

      <div>
        <h2>Counter value: {count}</h2>
        <button onClick={ChangeCounter}>
          Counter
        </button>
        <Samcode/>
        <UseFetchApi/>
      </div>
    </>
  );
}

export default App;
