import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    ime: '',
    prezime: '',
    racun: '',
    mesto: '',
    telefon: '',
    password: '',
    password2: '',
  });

  const {
    username,
    email,
    ime,
    prezime,
    racun,
    mesto,
    telefon,
    password,
    password2,
  } = formData;

  const history = useHistory();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  function allLetter(inputtxt) {
    var letters = /^[a-z]+$/;
    if (inputtxt.match(letters)) {
      return true;
    } else {
      return false;
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      swal('Lozinke se ne poklapaju');
    } else {
      // if (!allLetter(username)) {
      //   swal('Opseg vrednosti username-a mora biti: a-z');
      //   return;
      // }

      swal('Uspesno ste registrovani', {
        icon: 'success',
      });

      try {
        const zaSlanje = {
          username,
          email,
          ime,
          prezime,
          racun,
          mesto,
          telefon,
          password,
        };
        console.log(zaSlanje);
        const res = await axios.post(
          'http://localhost:5000/createkorisnik',
          zaSlanje
        );
        history.push('/login');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='form'>
        <h2>
          Registracija <i className='fas fa-dice fa-fw'></i>
        </h2>
        {/* <div className='form-control'>
          <label for='username'>Username</label>
          <input
            type='text'
            placeholder='Unesi username'
            name='username'
            value={username}
            onChange={onChange}
            required
          />
        </div> */}
        <div className='form-control'>
          <label for='email'>Email</label>
          <input
            type='text'
            placeholder='Unesi email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='ime'>Ime</label>
          <input
            type='text'
            placeholder='Unesi ime'
            name='ime'
            value={ime}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='prezime'>Prezime</label>
          <input
            type='text'
            placeholder='Unesi prezime'
            name='prezime'
            value={prezime}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='racun'>Racun</label>
          <input
            type='text'
            placeholder='Unesi racun'
            name='racun'
            value={racun}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='mesto'>Mesto</label>
          <input
            type='text'
            placeholder='Unesi mesto'
            name='mesto'
            value={mesto}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='telefon'>Telefon</label>
          <input
            type='text'
            placeholder='Unesi telefon'
            name='telefon'
            value={telefon}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='password'>Password</label>
          <input
            type='password'
            placeholder='Unesi password'
            name='password'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-control'>
          <label for='password2'>Potvrdi password</label>
          <input
            type='password'
            placeholder='Unesi password opet'
            name='password2'
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <button>Registruj se</button>
      </form>
    </div>
  );
};

export default Register;
