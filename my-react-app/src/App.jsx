
import { useState } from 'react';
import './App.css';
import Samcode from './Component/Samcode';

function App() {
  const [count, setCount] = useState(0);

  const employee = [
    {
      empname: 'ankit',
      empid: '9675'
    },
    {
      empname: 'rishabh',
      empid: '9615'
    },
    {
      empname: 'manish',
      empid: '9645'
    }
  ];

  return (
    <>
      <h2>Welcome to JSX</h2>

      <div>
        {/* <Samcode empdata={employee[2]} /> */}
        {employee.map((ele) => (
          <Samcode key={ele.empid} empdata={ele} />
        ))}

        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>
    </>
  );
}

export default App;
