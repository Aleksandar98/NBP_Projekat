import React, { Fragment, useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Loto = (props) => {
  const [formData, setFormData] = useState({
    trenutnoOdigrano: [],
    uplata: 0,
    username: localStorage.getItem('username'),
  });

  const { trenutnoOdigrano, uplata, username } = formData;

  const Klik = (e) => {
    for (let i = 0; i < trenutnoOdigrano.length; i++) {
      if (trenutnoOdigrano[i] == e.target.parentElement.getAttribute('value')) {
        swal('Greska', 'Vec si taj broj odigrao', 'error');
        return;
      }
    }
    if (trenutnoOdigrano.length == 7) {
      swal('Greska', 'Vec ste izabrali 7 brojeva!', 'error');
      return;
    }
    console.log(e.target);

    //console.log(e.target.parentElement.getAttribute('value'));
    trenutnoOdigrano.push(e.target.parentElement.getAttribute('value'));
    //console.log(trenutnoOdigrano, trenutnoOdigrano.length);
    document.querySelectorAll('.dot')[
      trenutnoOdigrano.length - 1
    ].innerHTML = e.target.parentElement.getAttribute('value');
  };
  const uplati = (e) => {
    if (uplata < 100) {
      swal('Minimalna uplata je 100');
      return;
    }
    swal({
      title: 'Da li ste sigurni?',
      text: 'Nakon uplate nema povracaj novca',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('Vasa kombinacija je uspesno uplacena!', {
          icon: 'success',
        });
        let prostor = document.querySelector('.desni-gore');
        const red = document.createElement('h1');
        red.innerHTML = trenutnoOdigrano.join(', ');
        prostor.appendChild(red);
        setFormData({ ...formData, uplata: uplata - 100 });

        const niz = trenutnoOdigrano.toString().replaceAll(',', ' ');
        const zaSlanje = {
          kombinacija: niz,
          idkorisnika: username,
        };
        try {
          const res = axios.put(
            'http://localhost:5000/uplatiKombinaciju',
            zaSlanje
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        swal('Uspesno ste odustali od uplate!');
        return;
      }
    });
  };

  const odigrajAutomatski = (e) => {
    if (trenutnoOdigrano.length > 0) {
      while (trenutnoOdigrano.length > 0) {
        trenutnoOdigrano.pop();
      }
    }

    for (let i = 0; i < 7; i++) {
      trenutnoOdigrano.push(Math.floor(Math.random() * 40) + 1);
    }

    for (let i = 0; i < 7; i++) {
      document.querySelectorAll('.dot')[i].innerHTML = trenutnoOdigrano[i];
    }
  };

  const ponisti = (e) => {
    if (trenutnoOdigrano.length == 0) {
      return;
    }
    while (trenutnoOdigrano.length > 0) {
      trenutnoOdigrano.pop();
    }

    for (let i = 0; i < 7; i++) {
      document.querySelectorAll('.dot')[i].innerHTML = '';
    }
  };

  const uplatiNovac = (e) => {
    swal('Uplati na racun', {
      content: 'input',
    }).then((value) => {
      setFormData({ ...formData, uplata: uplata + parseInt(value) });
      swal(`Uplaceno: ${value}`);
    });
  };

  return (
    <Fragment>
      <nav className='navbar navbar-dark bg-dark justify-content-between'>
        <a className='navbar-brand' href='#'>
          <i class='far fa-user fa-fw'></i> Username : {username}
        </a>
        <a className='navbar-brand' href='#'>
          Stanje na računu: {uplata} <i class='fas fa-dollar-sign fa-fw'></i>
        </a>
        <Link className='navbar-brand' to='/login'>
          Logout <i class='fas fa-sign-out-alt fa-fw'></i>
        </Link>
      </nav>
      <div className='flex-container'>
        <div className='levi'>
          <div className='levi-vrsta'>
            <div className='round-button'>
              <div className='round-button-circle' value={1}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  1
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={2}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  2
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={3}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  3
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={4}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  4
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={5}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  5
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={6}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  6
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={7}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  7
                </a>
              </div>
            </div>
          </div>
          <div className='levi-vrsta'>
            <div className='round-button'>
              <div className='round-button-circle' value={8}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  8
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={9}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  9
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={10}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  10
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={11}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  11
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={12}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  12
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={13}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  13
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={14}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  14
                </a>
              </div>
            </div>
          </div>
          <div className='levi-vrsta'>
            <div className='round-button'>
              <div className='round-button-circle' value={15}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  15
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={16}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  16
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={17}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  17
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={18}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  18
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={19}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  19
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={20}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  20
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={21}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  21
                </a>
              </div>
            </div>
          </div>
          <div className='levi-vrsta'>
            <div className='round-button'>
              <div className='round-button-circle' value={22}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  22
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={23}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  23
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={24}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  24
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={25}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  25
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={26}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  26
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={27}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  27
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={28}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  28
                </a>
              </div>
            </div>
          </div>
          <div className='levi-vrsta'>
            <div className='round-button'>
              <div className='round-button-circle' value={29}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  29
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={30}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  30
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={31}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  31
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={32}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  32
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={33}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  33
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={34}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  34
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={35}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  35
                </a>
              </div>
            </div>
          </div>
          <div className='levi-vrsta'>
            <div className='round-button'>
              <div className='round-button-circle' value={36}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  36
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={37}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  37
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={38}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  38
                </a>
              </div>
            </div>
            <div className='round-button'>
              <div className='round-button-circle' value={39}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
            <div className='round-button' style={{ visibility: 'hidden' }}>
              <div className='round-button-circle' value={39}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
            <div className='round-button' style={{ visibility: 'hidden' }}>
              <div className='round-button-circle' value={39}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
            <div className='round-button' style={{ visibility: 'hidden' }}>
              <div className='round-button-circle' value={39}>
                <a href='#!' className='round-button' onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='desni'>
          <h3 className='naslov1'>Odigrane kombinacije za tekuće kolo su:</h3>
          <div className='desni-gore'></div>
          <div className='desni-dole'>
            <div className='desni-dole-vrsta'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
            </div>
            <button
              type='button'
              className='btn btn-success btn-block'
              onClick={(e) => uplati(e)}
            >
              Uplati tiket
            </button>
            <button
              type='button'
              className='btn btn-danger btn-block'
              onClick={(e) => ponisti(e)}
            >
              Poništi
            </button>
            <button
              type='button'
              className='btn btn-primary btn-block'
              onClick={(e) => odigrajAutomatski(e)}
            >
              Odigraj automatksi
            </button>
            <button
              type='button'
              className='btn btn-dark btn-block'
              onClick={(e) => uplatiNovac(e)}
            >
              Uplati na račun
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Loto;
