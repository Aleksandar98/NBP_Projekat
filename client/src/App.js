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
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setSeconds(tomorrow.getDate() + 5)

    function prikaziRezultate() {
      //UPDATE STATE 
      // Sakri Drum
      // Ucitaj podatke o izvlacenju
      console.log("PRIKAZI REZULTATE");
    }



  return (
  <div className="App">
    {console.log(new Date())}
    <Countdown date={tomorrow} istekao={count} onIstekao={increment} /> 
    {/* <Drum></Drum> */}
    {count === 1 && temp === 0 ? <Drum istekao={temp} onZavrsio={increment2} /> : null}
     {temp === 1 ? <BasicTable/> : null} 
    {/* <BasicTable></BasicTable> */}
    
  </div>
    
  );
  }


export default App;
