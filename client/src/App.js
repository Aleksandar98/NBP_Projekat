import logo from './logo.svg';
import './App.css';
import React from 'react';
import Countdown from './Countdown';
import Drum from './Drum'
import BasicTable from './BasicTable';
function App(){

  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c = 1)

  const [temp, setTemp] = React.useState(0)
  // const increment2 = () => setTemp(c => c = 1)
  const increment2 = () => setTemp(c => c = 1)

  return (
  <div className="App">

    <Countdown  onIstekao={increment} /> 
    {count === 1 && temp === 0 ? <Drum onZavrsio={increment2} /> : null}
     {temp === 1 ? <BasicTable/> : null} 
    
  </div>
    
  );
  }


export default App;
