const express = require('express');
const app = express();
const cassandra = require('cassandra-driver');
//var cql = require('node-cassandra-cql');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var _ = require('lodash');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const KEYSPACE = "lotto_schema";
const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  keyspace: "lotto_schema",
  localDataCenter: "datacenter1",
});

app.post('/createkorisnik', function (req, res) {
  var korisnik = req.body;
  console.log('korisnik:', korisnik);

  let params = [req.body.email];
  var queryPostoji = 'Select * FROM "Korisnik" WHERE email= ?';

  client.execute(queryPostoji, params, function (err, result) {
    if (err) {
      console.log('err:', err);
      return;
    }
    if (result.rows[0] != undefined) {
      console.log('Vec postoji korisnik sa tim emailom ' + result.rows[0]);
      res.send(result.rows[0]);
    } else {
      var query =
        'INSERT INTO "Korisnik" ("email", "password", "ime", "username", "prezime", "mesto", "racun", "telefon", "kredit") VALUES (' +
        "'" +
        korisnik.email +
        "', '" +
        korisnik.password +
        "', '" +
        korisnik.ime +
        "', '" +
        korisnik.username +
        "','" +
        korisnik.prezime +
        "', '" +
        korisnik.mesto +
        "', '" +
        korisnik.racun +
        "', '" +
        korisnik.telefon +
        "', '" +
        0 +
        "')";
      console.log('query:', query);
      client.execute(query, function (err, result) {
        if (err) {
          console.log('err:', err);
          res.send(err);
          return;
        }
        res.json(true);
      });
    }
  });
});

app.put("/uplatiKredit", async function (req, res) {
  let uplata = parseInt(req.body.iznos);
  let korisnik = req.body.korisnik;
  let username = req.body.username;
  let password = req.body.password;
  let trenutnoStanje = parseInt(req.body.kredit);
  let novoStanje = trenutnoStanje + uplata;
  let query =
    'UPDATE "Korisnik" SET kredit=' +
    "'" +
    novoStanje +
    "' WHERE email='" +
    korisnik +
    "'AND password='" +
    password +
    "'AND username='" +
    username +
    "'";
  await client.execute(query, async function (err, result) {
    res.send("Azuriani su podaci korisnika, sada ima" + novoStanje + "kredita");
  });
});

app.post("/provera", function (req, res) {
  console.log(req.body);
  var email = req.body.email;
  var password = req.body.password;
  let params = [email, password];
  var query = 'SELECT * FROM "Korisnik" WHERE email= ? AND password= ?';
  console.log(query);
  console.log(params);
  client.execute(query, params, function (err, result) {
    if (err) {
      console.log('Greska');
      res.send(err);
      return;
    }
    console.log(result.rows[0]);
    if (result.rows[0] == undefined) res.json({ msg: 'Greska pri logovanju' });
    else res.json(result.rows[0]);
  });
});

app.post('/createFirma', function (req, res) {
  var firma = [req.body.ime, req.body.brregistrovanih, req.body.profit];
  var query =
    'INSERT INTO "Firma" (ime, brregistrovanih, profit) values (?, ? ,?)';
  client.execute(query, firma, function (err, resulut) {
    if (err) {
      console.log('err:', err);
      res.send(err);
      return;
    }
    res.json(true);
  });
});

/*async function returnNewIdKola(){
	let query= 'SELECT idkola FROM "Kolo" LIMIT 1'; //poslednje kolo
	let newId=0;
		await client.execute(query, function(err,result){

		});
		if(result.rows[0]!=undefined)
			newId= parseInt(result.rows[0].idkola) + 1;
		console.log("novi id je "+newId);
		return newId;	
}*/

const cron = require('node-cron');
let shell = require('shelljs');

// Kreira novo kolo

cron.schedule('50 25 18 * * Fri', async function () {
  var today = new Date();
  today.setDate(today.getDate() + 7);
  var dd = today.getDate().toString().padStart(2, '0');
  var mm = (today.getMonth() + 1).toString().padStart(2, '0');
  var yyyy = today.getFullYear();
  //var dat = yyyy + "-" + mm + "-" + dd;
  var dat = today.toString();

  let query = 'select count(*) from "Kolo"';
  //let newId=0;
  await client.execute(query, async function (err, result) {
    //if(result.rows[0]!=undefined)
    //newId= parseInt(result.rows[0].idkola);
    //console.log(result.rows[0].idkola);
    console.log('rez ' + result.first()['count']);
    let newId = parseInt(result.first()['count']) + 1;

    let sedmica = '5000';
    console.log('novi id u novokolo ' + newId);

    var kolo = {
      idKola: newId.toString(),
      datum: dat,
      vrednostsedmice: sedmica,
      stanje: 'otvoreno',
      // uplatili: null,
      dobitnakombinacija: null,
    };

    console.log(kolo);
    let params = [
      kolo.idKola,
      kolo.datum,
      kolo.vrednostsedmice,
      kolo.stanje,
      kolo.dobitnakombinacija,
      //kolo.uplatili,
    ];
    var query2 =
      'INSERT INTO "Kolo" (idkola, datum, vrednostsedmice, stanje, dobitnakombinacija) VALUES (?, ? ,? ,?, ?)';

    await client.execute(query2, params, function (err, result) {
      if (err) {
        console.log('err:', err);
        console.log(err);
        return;
      } else {
        var queryn1 =
          'INSERT INTO "BrojKombinacija_By_Kolo" (idkola) values(?)';
        client.execute(queryn1, [kolo.idKola], function (err, result) {
          var queryn2 = 'INSERT INTO "Kombinacija_By_Kolo" (idkola) values(?)';
          client.execute(queryn2, [kolo.idKola], function (err, result) {
            var query3 = 'SELECT email FROM "Korisnik"';
            client.execute(query3, (err, result) => {
              let emails = [];
              result.rows.forEach((r) => {
                emails.push(r.email);
              });

              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'urossmm1@gmail.com',
                  pass: 'urosurosuros',
                },
              });
              emails.forEach((e) => {
                var mailOptions = {
                  from: 'urossmm1@gmail.com',
                  to: e,
                  subject: 'Pocetak novog kola',
                  text:
                    'Novo kolo je krenulo, mozete vec sada da uplatite svoju novu kombinaciju! :)',
                };

                transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
              });
            });
          });
        });

        today.setDate(today.getDate() + 7);
        console.log(today);
        return today;
      }
    });
  });
});

app.put('/vrednostSedmice', async (req, res) => {
  let novaVrednost = req.body.vrednostSedmice;
  let query1 = 'SELECT idkola FROM "Kolo" limit 1';
  await client.execute(query1, async function (err, result) {
    let params = [result.rows[0].idkola];
    console.log(params);
    let query2 =
      'UPDATE "Kolo" SET vrednostsedmice=' +
      "'" +
      novaVrednost +
      "' WHERE idkola= ?";
    console.log(query2);
    await client.execute(query2, params, async function (err, result) {
      res.send('Vrednost sedmice postavljena je na ' + novaVrednost);
    });
  });
});

app.put('/uplatiKombinaciju', async (req, res) => {
  var kombinacija = req.body.kombinacija; // 1 14 5 12 15 3 5
  var idkorisnika = req.body.idkorisnika; //idkorisnika je njegov USERNAME
  var idkorisnika2 = req.body.idkorisnika + '_';
  //console.log(idkorisnika);
  var query1 = 'select idkola from "Kolo" limit 1';
  await client.execute(query1, async function (err, result) {
    //let params= [parseInt(result.first()['count']).toString()];
    let params = [result.rows[0]['idkola']];
    console.log('params ' + params);
    //console.log(result);
    var query2 = 'SELECT stanje FROM "Kolo" WHERE idkola=?';
    await client.execute(query2, params, async function (err, result) {
      if (result.rows[0].stanje == 'otvoreno') {
        var query10 =
          'SELECT ' +
          idkorisnika +
          ' FROM "BrojKombinacija_By_Kolo" WHERE idkola= ?';
        //var params10 = [/*idkorisnika,*/ params[0]];
        console.log(query10);
        console.log(params);
        await client.execute(query10, params, async function (err, result) {
          //console.log(result.rows[0]);
          if (result == undefined) {
            let korisnik = req.body.korisnik;
            let password = req.body.password;
            let kredit = req.body.kredit;
            let kreditQuery =
              'UPDATE "Korisnik" SET kredit=' +
              "'" +
              kredit +
              "' WHERE email='" +
              korisnik +
              "'AND password='" +
              password +
              "'AND username='" +
              idkorisnika +
              "'";
            console.log(korisnik, password, kredit, kreditQuery);

            await client.execute(kreditQuery, async function (err, result) {
                console.log("uso");
                var query6 =
                  'ALTER TABLE "BrojKombinacija_By_Kolo" ADD ' +
                  idkorisnika +
                  " text ";
                console.log("query6 " + query6);
                await client.execute(query6, async function (err, result) {
                  var query7 =
                    'UPDATE "BrojKombinacija_By_Kolo" SET ' +
                    idkorisnika +
                    " = '" +
                    "1' WHERE idkola=?";
                  console.log("query7 " + query7);
                  await client.execute(
                    query7,
                    params,
                    async function (err, result) {
                      idkorisnika2 += 1;
                      var query3 =
                        'ALTER TABLE "Kombinacija_By_Kolo" ADD ' +
                        idkorisnika2 +
                        " text ";
                      console.log("query3 " + query3);
                      await client.execute(query3, async function (err, result) {
                        var query4 =
                          'UPDATE "Kombinacija_By_Kolo" SET ' +
                          idkorisnika2 +
                          " = '" +
                          kombinacija +
                          "' WHERE idkola= ?";
                        console.log("QUERY4 " + query4);
                        //console.log(params);
                        await client.execute(
                          query4,
                          params,
                          async function (err, result) {
                            //res.send("Kombinacija uplacena");
                            /* var query5 =
                          'UPDATE "Kolo" SET bruplata=' +
                          "'" +
                          idkorisnika +
                          "' WHERE idkola= ?";
                        console.log(query5);
                        client.execute(query5, params, function (err, result) {
                          */
                            res.send("Kombinacija uplacena");
                            //});
                          }
                        );
                      });
                    }
                  );
                });
              });;
          } else {
            //console.log(Object.keys(result.rows[0][idkorisnika]));
            //console.log("log " + result.rows[0][idkorisnika]);
            var brKombinacija;
            console.log(result.rows[0][idkorisnika]);
            if (result.rows[0][idkorisnika] == null) brKombinacija = 1;
            else brKombinacija = parseInt(result.rows[0][idkorisnika]) + 1;
            console.log('BRK ' + brKombinacija);
            idkorisnika2 += brKombinacija
              //parseInt(result.rows[0][idkorisnika]) + 1
              .toString();
            console.log(idkorisnika2);
            var query3 =
              'ALTER TABLE "Kombinacija_By_Kolo" ADD ' +
              idkorisnika2 +
              ' text ';

            await client.execute(query3, async function (err, result) {
              let korisnik = req.body.korisnik;
              let password = req.body.password;
              let kredit = req.body.kredit;
              let kreditQuery =
                'UPDATE "Korisnik" SET kredit=' +
                "'" +
                kredit +
                "' WHERE email='" +
                korisnik +
                "'AND password='" +
                password +
                "'AND username='" +
                idkorisnika +
                "'";
              await client.execute(kreditQuery, async function (err, result) {
              var query4 =
                'UPDATE "Kombinacija_By_Kolo" SET ' +
                idkorisnika2 +
                " = '" +
                kombinacija +
                "' WHERE idkola= ?";
              console.log('QUERY4 ' + query4);
              console.log(params);
              await client.execute(
                query4,
                params,
                async function (err, result) {
                  var query5 =
                    'UPDATE "BrojKombinacija_By_Kolo" SET ' +
                    idkorisnika +
                    " = '" +
                    brKombinacija +
                    "' WHERE idkola= ?";
                  console.log('QUERY5 ' + query5);
                  await client.execute(
                    query5,
                    params,
                    async function (err, result) {
                      res.send('Kombinacija je uplacena');
                    }
                  );
                }
              );
              });
            });
          } //od else
        });
      } else {
        res.send('Zakasnili ste, kolo je zatvoreno. ');
      }
    });
  });
});

cron.schedule('00 17 * * Thu', async function () {
  var query1 = 'select count(*) from "Kolo"';
  await client.execute(query1, async function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    let params2 = ['zatvoreno', parseInt(result.first()['count']).toString()];
    var queryUpdate = 'UPDATE "Kolo" SET stanje= ? WHERE idkola= ? ';
    await client.execute(queryUpdate, params2, async function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Uplata je zabranjena za poslednje kolo ');
    });
  });
});

//Izvlaci dobitnu kombinaciju za tekuce kolo

cron.schedule('50 38 18 * * Fri', async function () {
  var query0 = 'SELECT COUNT(*) FROM "Kolo"';
  await client.execute(query0, async function (err, result) {
    console.log('TEST');
    //console.log(result.first()["count"]);
    console.log(parseInt(result.first()['count']));
    if (parseInt(result.first()['count']) == 0) return;

    //app.get("/test", async function (req, res) {
    var query1 = 'SELECT idkola FROM "Kolo" limit 1';
    await client.execute(query1, async function (err, result) {
      var params = [result.rows[0]['idkola']];
      console.log(params);
      //var query2 = 'SELECT username FROM "Korisnik"';
      var query2 = 'SELECT * FROM "BrojKombinacija_By_Kolo" WHERE idkola=?';
      await client.execute(
        query2,
        params,
        /*params,*/ async function (err, result) {
          var usernames = [];
          console.log(result.rows[0]);
          Object.keys(result.rows[0]).forEach((item) => {
            console.log(item);
            if (item != 'idkola') usernames.push(item);
          });
          //result.rows[0].forEach(item=>{

          //})
          //result.rows.forEach((row) => {
          // usernames.push(row.username);
          //}
          //);
          var kombinacije = [];
          console.log('USERI ' + usernames); //radi
          var query3 =
            'SELECT ' +
            usernames +
            ' FROM "BrojKombinacija_By_Kolo" WHERE idkola= ?';
          client.execute(query3, params, async function (err, result) {
            //console.log(Object.keys(result.rows[0]));
            //if (result != undefined) {
            var zaCitanje = [];
            console.log(result);
            //var keysLenght = Object.keys(result.rows[0]).length;
            Object.keys(result.rows[0]).forEach((key) => {
              var user = key + '_';
              var tmpuser = user;
              var count = result.rows[0][key];
              for (let i = 1; i <= count; i++) {
                user += i;
                //if(ind!=keysLenght && i!=count)
                //user+=" ,"
                zaCitanje.push(user);
                user = tmpuser;
              }
            });
            console.log('ok');
            //console.log(zaCitanje);
            var query4 =
              'SELECT ' +
              zaCitanje +
              ' FROM "Kombinacija_By_Kolo" WHERE idkola= ?';
            console.log(query4);
            client.execute(query4, params, function (err, result) {
              //console.log(result.rows[0]);
              var kombinacije = [];
              //console.log(Object.keys(result.rows[0]));
              Object.keys(result.rows[0]).forEach((key) => {
                //console.log("dodaje se kombinacija ");
                kombinacije.push(result.rows[0][key]);
                console.log(result.rows[0][key]);
              });
              console.log(kombinacije);
              var brojevi = [];
              kombinacije.forEach((kombinacija) => {
                kombinacija = kombinacija.split(' ');
                //console.log(kombinacija);
                kombinacija.forEach((broj) => {
                  broj = parseInt(broj);
                  //console.log(broj);
                  brojevi.push(broj);
                });
              });
              //console.log(brojevi);
              var tablica39 = [];
              for (let i = 1; i <= 39; i++) tablica39[i] = 0;
              brojevi.forEach((broj) => {
                tablica39[broj]++;
              });
              //console.log(tablica39);
              var sortiraniObjekti39 = [];
              tablica39.forEach((t, i) => {
                var obj = {
                  broj: i,
                  brojPojavljivanja: t,
                };
                sortiraniObjekti39.push(obj);
              });
              //console.log(sortiraniObjekti39);
              for (let i = 0; i < sortiraniObjekti39.length - 1; i++) {
                for (let j = i + 1; j < sortiraniObjekti39.length; j++) {
                  if (
                    sortiraniObjekti39[i].brojPojavljivanja >
                    sortiraniObjekti39[j].brojPojavljivanja
                  ) {
                    let tmp = sortiraniObjekti39[i];
                    sortiraniObjekti39[i] = sortiraniObjekti39[j];
                    sortiraniObjekti39[j] = tmp;
                  }
                }
              }
              console.log(sortiraniObjekti39);

              var dobitnaKombinacija = [];
              for (let i = 0; i < 7; i++) {
                dobitnaKombinacija.push(sortiraniObjekti39[i].broj);
              }
              console.log(dobitnaKombinacija);
              //res.send(dobitnaKombinacija);
              var dobitnaText = '';
              dobitnaKombinacija.forEach((db, ind) => {
                if (ind == dobitnaKombinacija.length - 1)
                  dobitnaText += db.toString();
                else dobitnaText += db.toString() + ' ';
              });
              console.log(dobitnaText);
              var query5 =
                'UPDATE "Kolo" SET dobitnakombinacija=' +
                "'" +
                dobitnaText +
                "' WHERE idkola=?";
              console.log(query5);
              client.execute(query5, params, function (err, result) {
                if (!err) {
                  console.log('Dobitna kombinacija generisana');
                }
              });
            });
            // }
          });
        }
      );
    });
    //});
  });
});
//Iz baze vidi kad pocinje novo kolo
app.get('/vratiPocetakKola', function (req, res) {
  /*const pocetakKola = new Date();
  pocetakKola.setSeconds(pocetakKola.getSeconds() + 15);
  console.log(pocetakKola);
  res.send(pocetakKola);*/
  var query1 = 'SELECT datum FROM "Kolo" limit 1';
  client.execute(query1, function (err, result) {
    console.log(result.rows[0]['datum']);
    res.json(result.rows[0]['datum']);
  });
});
//Kombinacija izvucena kao dobitna
app.get('/vratiKombinaciju', function (req, res) {
  //let niz = [6, 24, 11, 8, 11, 13, 26];

  var query1 = 'SELECT dobitnakombinacija FROM "Kolo" limit 1';
  client.execute(query1, function (err, result) {
    var brojevi = [];
    var kombinacija = result.rows[0]['dobitnakombinacija'];
    brojevi = kombinacija.split(' ');

    res.json(brojevi);
  });
  //res.send(niz);
});

app.post("/proveriDobitnike", function(req, res) {
  var dobitnaKombinacijaQuery = 'SELECT dobitnakombinacija, idkola FROM "Kolo" limit 1';
  client.execute(dobitnaKombinacijaQuery, function(err, result) {
    var brojevi = [];
    var kombinacija = result.rows[0]["dobitnakombinacija"];
    var idKola = result.rows[0]["idkola"];
    brojevi = kombinacija.split(" ");

    var kombinacijeQuery = 'SELECT * from "Kombinacija_By_Kolo" WHERE idkola=' + "'" + idKola + "'";
    client.execute(kombinacijeQuery, function(err, result) {
      var brojevi1 = []
      var odigranaKombinacija = [];
      var rezultat = [];

      result.rows[0].forEach((val, index)=> {
        odigranaKombinacija = val;
        brojevi1 = odigranaKombinacija.split(" ");
        let presek = brojevi.filter(x => brojevi1.includes(x));
        var user = index.split('_')[0];
        if (presek.length >= 3){
          if (rezultat[user] === undefined){
            rezultat[user] = '';
          }
  
          rezultat[user] += presek.length + ' ';
        }
      })

      const usernames = Object.keys(rezultat);

      Object.values(usernames).forEach(username => {
        console.log(rezultat[username], username);
        let query = 'SELECT ' + username + ' FROM "Dobitak_By_Kolo"';

        client.execute(query, function(err, result) {
          if (result === undefined) {
          let query1 = 'ALTER TABLE "Dobitak_By_Kolo" ADD ' + username + " text ";
          client.execute(query1);
          }
          let inputQuery = 'INSERT INTO "Dobitak_By_Kolo" (idkola,' + username +') VALUES (' + "'" + idKola + "'" + ', ' + "'" + rezultat[username] + "'" + ')';
          client.execute(inputQuery);
        });
      })
    })
  })
});

app.get("/vratiDobitke", function (req, res) {
  // kombinacije sa 7,6,5,4,3 pogodaka
let niz = [];
  let query = 'SELECT idkola FROM "Kolo" limit 1';
  client.execute(query, function(err, result){
    let idkola = Object.values(result.rows[0])[0];
    let dobiciQuery = 'SELECT * FROM "Dobitak_By_Kolo" WHERE idkola=' + "'" + idkola + "'";

    client.execute(dobiciQuery, function(err, result) {
     let values = Object.values(result.rows[0]);
     values.shift();
     let allValues = '';
     values.forEach(param => {
        allValues += param;
      });
     let sedmice = allValues.split('7').length - 1;
     let sestice = allValues.split('6').length - 1;
     let petice = allValues.split('5').length - 1;
     let cetvorke = allValues.split('4').length - 1;
     let trojke = allValues.split('3').length - 1;

      niz = [sedmice, sestice, petice, cetvorke, trojke];
      
      res.send(niz);
    })
  });
});

app.put("/isplatiDobitnike", function (req, res){
  client.execute('SELECT vrednostsedmice FROM "Kolo" limit 1', function(err,result){
    let vrednostSedmice = parseInt(Object.values(result.rows[0])[0]);
    
  let query = 'SELECT * FROM "Dobitak_By_Kolo" limit 1';
  client.execute(query, function(err, result){
   
   result.rows[0].forEach((val, key) => {
     if (key === 'idkola') {
       return;
     }
     let zaIsplatu = 0;
     let dobici = val.split(" ");
     dobici.pop();
     dobici.forEach(dobitak => {
        switch (dobitak){
          case '7':
            zaIsplatu += vrednostSedmice;
            break;
          case '6':
            zaIsplatu += vrednostSedmice * 0.1;
            break;
          case '5':
            zaIsplatu += vrednostSedmice * 0.05;
            break;
          case '4':
            zaIsplatu += 1000;
            break;
          case '3':
            zaIsplatu += 100;
            break;
        } 
        
     })
     client.execute('SELECT * from "Korisnik" where username=' + "'" + key + "' ALLOW FILTERING", function(err, result){
        // const trenutnoStanje = Object.values(result.rows[0])[0];
       const email = Object.values(result.rows[0])[0];
       const password = Object.values(result.rows[0])[1];
       const trenutnoStanje = Object.values(result.rows[0])[4];
       const novoStanje = parseInt(trenutnoStanje) + zaIsplatu;

       let kreditQuery =
       'UPDATE "Korisnik" SET kredit=' +
       "'" +
       novoStanje +
       "' WHERE email='" +
       email +
       "'AND password='" +
       password +
       "'AND username='" +
       key +
       "'";
      client.execute(kreditQuery);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "urossmm1@gmail.com",
          pass: "urosurosuros",
        },
      });
        var mailOptions = {
          from: "urossmm1@gmail.com",
          to: email,
          subject: "Cestitamo!",
          text:
            "Osvojili ste nagradu na najnovijem loto izvlacenju, uplaceno je " + zaIsplatu + "na Vas loto racun.",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

    });
  })
})
})
});

app.get("/izracunajProfit", function(req, res) {
  client.execute('SELECT idkola, vrednostsedmice FROM "Kolo"', function (err,result){
    let vrednostSedmice = parseInt(Object.values(result.rows[0])[1]);
    let idkola = Object.values(result.rows.pop())[0];
    // console.log(Object.values(result.rows));
    let query = 'SELECT * FROM "Kombinacija_By_Kolo" where idkola=' + "'" + idkola + "'";
    client.execute(query, function (err, result) {
      let brKombinacija = result.columns.length - 1;
      let uplaceno = 100* brKombinacija;
      let dobitakQuery = 'SELECT * FROM "Dobitak_By_Kolo" where idkola=' + "'" + idkola + "'";
      client.execute(dobitakQuery, function(err, result){
        let dobici = Object.values(result.rows[0]);
        dobici.shift();
        console.log(dobici);
        let isplata = 0;
        dobici.forEach(dobitak => {
          let vrednosti = dobitak.split(" ");
          vrednosti.forEach(vrednost => {
            switch (vrednost){
              case '7':
                isplata += vrednostSedmice;
                break;
              case '6':
                isplata += vrednostSedmice * 0.1;
                break;
              case '5':
                isplata += vrednostSedmice * 0.05;
                break;
              case '4':
                isplata += 1000;
                break;
              case '3':
                isplata += 100;
                break;
            } 
          })
        })
        res.send([uplaceno, isplata, uplaceno - isplata]);
        // let dobici = Object.values(result.rows.pop())[0];
      })
    })
  });

});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
