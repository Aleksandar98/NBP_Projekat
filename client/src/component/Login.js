import React, { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const history = useHistory();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    //da li postoji u bazu, redirect na korisnikovu stranu
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    history.push('/profile');
  };

  return (
    <div>
      <section class='container1'>
        <h1 class='large1 text-primary1'>Login</h1>
        <p class='lead1'>
          <i class='fas fa-user'></i> Prijavi se na svoj nalog
        </p>
        <form class='form1' onSubmit={onSubmit}>
          <div class='form1-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              required
              value={email}
              onChange={onChange}
            />
          </div>
          <div class='form1-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              required
              value={password}
              onChange={onChange}
            />
          </div>
          <input type='submit' class='btn btn-primary' value='Login' />
        </form>
        <p class='my-1'>
          Nemas nalog? <Link to='/register'>Registruj se</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
