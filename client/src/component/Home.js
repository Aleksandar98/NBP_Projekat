import React from 'react';
import Countdown from './Countdown';
import Drum from './Drum';
import BasicTable from './BasicTable';
import { Link } from 'react-router-dom';

export default function Home() {

  //Istekao tajmer
  const [count, setCount] = React.useState(0);
  const increment = () => setCount((c) => (c = 1));

  //Zavrsilo se izvlacenje
  const [temp, setTemp] = React.useState(0);
  const increment2 = () => setTemp((c) => (c = 1));

  return (
    <div className='App'>
       <nav className='navbar navbar-dark bg-dark justify-content-between'>
       
        <a className='navbar-brand' href='#'>
          Dobrodosli <i class='fas fa-dice fa-fw'></i>
        </a>
        <Link className='navbar-brand' to='/login'>
          Login/Logout <i class='fas fa-sign-out-alt fa-fw'></i>
        </Link>
      </nav>
      <h1>Sledece izvlacenje pocinje za:</h1>
      <Countdown onIstekao={increment} />
      {count === 1 && temp === 0 ? <Drum onZavrsio={increment2} /> : null}
      {/* TREBA DA BUDE VIDLJIVO I PRE NEGO DA ISTEKNE ZBOG PROSLOG KOLA */}
      {temp === 1 ? <BasicTable /> : null}
    </div>
  );
}
