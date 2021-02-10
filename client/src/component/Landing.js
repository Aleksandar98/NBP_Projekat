import React from 'react';
import { useHistory } from 'react-router-dom';

const Landing = () => {
  const history = useHistory();
  return (
    <header id='sekcija'>
      <h1>Zelis da oprobas srecu?</h1>
      <p>
        Ne cekaj ni minut, prijavi se i mozda bas ti postanes srecan dobitnik!
      </p>
      <a href='/login'>Prijavi se</a>
      <button class='live' onClick={() => history.push('/home')}>
        Live izvlacenje
      </button>
    </header>
  );
};

export default Landing;
