
import React, { Fragment, useState, useEffect } from 'react';
import swal from 'sweetalert';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import StripeCheckout from "react-stripe-checkout";
import { Link, Redirect, useHistory } from 'react-router-dom';



const Loto = (props) => {
  const [formData, setFormData] = useState({
    trenutnoOdigrano: [],
    kredit: [localStorage.getItem("kredit")],
    username: localStorage.getItem("username"),
  });

  const history = useHistory();

  const { trenutnoOdigrano, kredit, username } = formData;

  const oderdiVrednost = () => {
    if (document.getElementById("uplataInput") != null)
      return parseInt(document.getElementById("uplataInput").value);
  };

  const Klik = (e) => {
    for (let i = 0; i < trenutnoOdigrano.length; i++) {
      if (trenutnoOdigrano[i] == e.target.parentElement.getAttribute("value")) {
        swal("Greska", "Vec si taj broj odigrao", "error");
        return;
      }
    }
    if (trenutnoOdigrano.length == 7) {
      swal("Greska", "Vec ste izabrali 7 brojeva!", "error"); 
      return;
    }
    console.log(e.target);

    //console.log(e.target.parentElement.getAttribute('value'));
    trenutnoOdigrano.push(e.target.parentElement.getAttribute("value"));
    //console.log(trenutnoOdigrano, trenutnoOdigrano.length);
    document.querySelectorAll(".dot")[
      trenutnoOdigrano.length - 1
    ].innerHTML = e.target.parentElement.getAttribute("value");
  };
  const uplati = (e) => {
    console.log('Kliknut sam'.green.inverse);
    if (kredit[0] < 100) {
      swal("Minimalna uplata je 100");
      return;
    }
    swal({
      title: "Da li ste sigurni?",
      text: "Nakon uplate nema povracaj novca",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Vasa kombinacija je uspesno uplacena!", {
          icon: "success",
        });
        let prostor = document.querySelector(".desni-gore");
        const red = document.createElement("h1");
        red.innerHTML = trenutnoOdigrano.join(", ");
        prostor.appendChild(red);
        setFormData({
          ...formData,
          kredit: [parseInt(kredit[0]) - 100],
        });
        localStorage.setItem("kredit", parseInt(kredit[0]) - 100);

        const niz = trenutnoOdigrano.toString().replaceAll(",", " ");
        console.log(kredit[0]);
        const zaSlanje = {
          kombinacija: niz,
          idkorisnika: username,
          kredit: parseInt(kredit[0]) - 100,
          korisnik: localStorage.getItem("email"),
          password: localStorage.getItem("password"),
        };
        try {
          const res = axios.put(
            "http://localhost:5000/uplatiKombinaciju",
            zaSlanje
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        swal("Uspesno ste odustali od uplate!");
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
      let pom= (Math.floor(Math.random() * 39) + 1);
      if(!trenutnoOdigrano.includes(pom))
        trenutnoOdigrano.push(pom);
      else
        i--; //posto sadrzi onda ponovi opet samo sa nekim drugim brojem
    }

    for (let i = 0; i < 7; i++) {
      document.querySelectorAll(".dot")[i].innerHTML = trenutnoOdigrano[i];
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
      document.querySelectorAll(".dot")[i].innerHTML = "";
    }
  };

  const azuriraj = () => {
    setFormData({
      ...formData,
      kredit: [
        parseInt(kredit[0]) +
          parseInt(document.getElementById("uplataInput").value),
      ],
    });
    localStorage.setItem(
      "kredit",
      parseInt(kredit[0]) +
        parseInt(document.getElementById("uplataInput").value)
    );
  };

  const obrisiNalog = (e) => {
    try {
      swal({
        title: "Da li ste sigurni?",
        text: "Ukoliko obrisete nalog gubite sav novac na njemu",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
      if(willDelete){
        const zaSlanje={
          email: localStorage.getItem("email")
        }
        axios.post(
          "http://localhost:5000/deleteNalog",
          zaSlanje
        )
        history.push("/login");
      }
    }) 
  }
  catch (err) {
    console.log(err);
  }
}
  // const uplatiNovac = (e) => {
  //   swal('Uplati na racun', {
  //     content: 'input',
  //   }).then((value) => {
  //     console.log(formData.kredit[0], localStorage.getItem("kredit"));
  //     let uplata = {
  //       iznos: value,
  //       korisnik: localStorage.getItem("email"),
  //       username: localStorage.getItem("username"),
  //       kredit: formData.kredit[0],
  //       password: localStorage.getItem("password"),
  //     };
  //     try {
  //       console.log(formData);
  //       const res = axios.put("http://localhost:5000/uplatiKredit", uplata);
  //     } catch (err) {
  //       console.log(err);
  //     }
  // setFormData({
  //   ...formData,
  //   kredit: [parseInt(kredit[0]) + parseInt(value)],
  // });

  // localStorage.setItem("kredit", parseInt(kredit[0]) + parseInt(value));
  //     swal(`Uplaceno: ${value}`);
  //   });
  // };

  return (
    <Fragment>
      <nav className="navbar navbar-dark bg-dark justify-content-between">
        <a className="navbar-brand" href="#">
          <i class="far fa-user fa-fw"></i> Username : {username}
        </a>
        <a className="navbar-brand" href="#">
          Stanje na računu: {kredit[0]} <i class="fas fa-dollar-sign fa-fw"></i>
        </a>
        <Link className="navbar-brand" to="/">
          Sledece izvlacenje <i class="fas fa-stopwatch fa-fw"></i>
        </Link>
        <Link className="navbar-brand" to="/login">
          Logout <i class="fas fa-sign-out-alt fa-fw"></i>
        </Link>
      </nav>
      <div className="flex-container">
        <div className="levi">
          <div className="levi-vrsta">
            <div className="round-button">
              <div className="round-button-circle" value={1}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  1
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={2}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  2
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={3}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  3
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={4}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  4
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={5}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  5
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={6}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  6
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={7}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  7
                </a>
              </div>
            </div>
          </div>
          <div className="levi-vrsta">
            <div className="round-button">
              <div className="round-button-circle" value={8}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  8
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={9}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  9
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={10}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  10
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={11}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  11
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={12}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  12
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={13}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  13
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={14}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  14
                </a>
              </div>
            </div>
          </div>
          <div className="levi-vrsta">
            <div className="round-button">
              <div className="round-button-circle" value={15}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  15
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={16}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  16
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={17}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  17
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={18}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  18
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={19}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  19
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={20}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  20
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={21}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  21
                </a>
              </div>
            </div>
          </div>
          <div className="levi-vrsta">
            <div className="round-button">
              <div className="round-button-circle" value={22}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  22
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={23}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  23
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={24}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  24
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={25}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  25
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={26}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  26
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={27}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  27
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={28}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  28
                </a>
              </div>
            </div>
          </div>
          <div className="levi-vrsta">
            <div className="round-button">
              <div className="round-button-circle" value={29}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  29
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={30}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  30
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={31}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  31
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={32}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  32
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={33}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  33
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={34}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  34
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={35}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  35
                </a>
              </div>
            </div>
          </div>
          <div className="levi-vrsta">
            <div className="round-button">
              <div className="round-button-circle" value={36}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  36
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={37}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  37
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={38}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  38
                </a>
              </div>
            </div>
            <div className="round-button">
              <div className="round-button-circle" value={39}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
            <div className="round-button" style={{ visibility: "hidden" }}>
              <div className="round-button-circle" value={39}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
            <div className="round-button" style={{ visibility: "hidden" }}>
              <div className="round-button-circle" value={39}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
            <div className="round-button" style={{ visibility: "hidden" }}>
              <div className="round-button-circle" value={39}>
                <a href="#!" className="round-button" onClick={(e) => Klik(e)}>
                  39
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="desni">
          <h3 className="naslov1">Odigrane kombinacije za tekuće kolo su:</h3>
          <div className="desni-gore"></div>
          <div className="desni-dole">
            <div className="desni-dole-vrsta">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={(e) => uplati(e)}
            >
              Uplati tiket
            </button>
            <button
              type="button"
              className="btn btn-danger btn-block"
              onClick={(e) => ponisti(e)}
            >
              Poništi
            </button>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={(e) => odigrajAutomatski(e)}
            >
              Odigraj automatksi
            </button>

            <div className="uplata">
              <input id="uplataInput" className="form-control"></input>
              <StripeCheckout
                name="Loto uplata"
                description="Uplata kredita"
                amount={0}
                token={(token) => {
                  axios.put("/uplatiKredit", {
                    iznos: oderdiVrednost(),
                    korisnik: localStorage.getItem("email"),
                    username: localStorage.getItem("username"),
                    kredit: formData.kredit[0],
                    password: localStorage.getItem("password"),
                    tokenZaUplatu: token,
                  })
                  .then(() => azuriraj());
                }
                 
                }
                stripeKey="pk_test_ORiqE7eJwIAbmJSSiJCMu0Fr00o4UEmm2V"
              >
                <button
                  type="button"
                  className="btn btn-dark btn-block uplataDugme"
                  //onClick={(e) => azuriraj(e)}
                >
                  Uplati na račun
                </button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      </div>
      <Link onClick={(e)=> obrisiNalog(e)}>Obrisi nalog</Link>
    </Fragment>
  );
};

export default Loto;
