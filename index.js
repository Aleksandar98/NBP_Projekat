const express = require('express');
const app = express();
const cassandra = require('cassandra-driver');
//var cql = require('node-cassandra-cql');
const cors = require('cors')
const bodyParser = require('body-parser');
const nodemailer= require('nodemailer');
var _ = require('lodash');
var CronJob = require('cron').CronJob;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const KEYSPACE = 'lotoooooo';
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'lotoooooo', localDataCenter: 'datacenter1' });

/*function connectToCassandra(keyspace)
{
	return new Promise((success, failure)=>
	{
		var clientParams;
		if(_.isNil(keyspace))
		{
			clientParams = { contactPoints: ['localhost'],localDataCenter:'datacenter1'};
		}
		else
		{
		
			clientParams = 	{ contactPoints: ['localhost'],localDataCenter:'datacenter1' ,keyspace: keyspace};
		}
		const client = new cassandra.Client(clientParams);
		client.connect(function(connectError)
		{
			console.log("Connected. Executing query...");
			if(connectError)
			{
				console.log("connectError:", connectError);
				return failure(connectError);
			}
			success(client);
		});
	});	
}*/



app.post('/createkorisnik', function(req, res)
{
	var korisnik = req.body;
	console.log("korisnik:", korisnik);
	
		let params= [req.body.email];
		var queryPostoji= 'Select * FROM "Korisnik" WHERE email= ?';

		client.execute(queryPostoji, params, function(err,result){
			if(err){
				console.log("err:", err);
				return;
			}
			if(result.rows[0]!= undefined){
				console.log("Vec postoji korisnik sa tim emailom " + result.rows[0]);
				res.send(result.rows[0]);
			}
			else{
				var query = 'INSERT INTO "Korisnik" ("email", "password", "ime", "username", "prezime", "mesto", "racun", "telefon") VALUES ('+"'" + korisnik.email + "', '" + korisnik.password + "', '" +kosrisnik.username+ "', '" + korisnik.ime + "','" + korisnik.prezime + "', '"+korisnik.mesto + "', '" + korisnik.racun + "', '"+korisnik.telefon +  "')";
				console.log("query:", query);
				client.execute(query, function(err, result){
					if(err){
						console.log("err:", err);
						res.send(err);
						return;
					}
					res.json(true);
				});
			}
		})
	
});

app.get("/provera", function(req,res){
	var user= req.body;
	let params= [req.body.email, req.body.password];
		var query= 'SELECT * FROM "Korisnik" WHERE email= ? AND password= ?' ;
		client.execute(query, params, function(err,result){
			if(err){
				res.send(err);
				return;
			}
			if(result.rows[0]==undefined)
				res.json({msg: "Greska pri logovanju"});
			else
				res.json(result.rows[0]);
		})
})

app.post("/createFirma", function(req,res)
{
	var firma= [req.body.ime, req.body.brregistrovanih, req.body.profit]
		var query= 'INSERT INTO "Firma" (ime, brregistrovanih, profit) values (?, ? ,?)';              
		client.execute(query, firma, function(err,resulut){
			if(err){
				console.log("err:", err);
				res.send(err);
				return;
			}
			res.json(true);
		} );
})

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


const cron= require('node-cron');
let shell= require('shelljs');

cron.schedule("17 01 * * Sun", async function(){
			var today= new Date();	
			var dd=(today.getDate()).toString().padStart(2,'0');
			var mm= (today.getMonth() +1).toString().padStart(2,'0');
			var yyyy= today.getFullYear();
			var dat = yyyy + "-" + mm + "-" + dd ;
			

			let query= 'select count(*) from "Kolo"'; 
			//let newId=0;
		    await client.execute(query, async function(err,result){
				//if(result.rows[0]!=undefined)
					//newId= parseInt(result.rows[0].idkola);
					//console.log(result.rows[0].idkola);
					console.log("rez " + result.first()['count']);
					let newId=parseInt(result.first()['count']) +1;

					let sedmica= "5000";
					console.log("novi id u novokolo " + newId);

					var kolo = {
						idKola: newId.toString(),
						datum: dat,
						vrednostsedmice: sedmica, 
						stanje: "otvoreno"
					}

					console.log(kolo);
					let params= [kolo.idKola, kolo.datum, kolo.vrednostsedmice, kolo.stanje];
					var query2= 'INSERT INTO "Kolo" (idkola, datum, vrednostsedmice, stanje) VALUES (?, ? ,? ,? )';
					

					await client.execute(query2,params, function(err,result){
						if(err){
							console.log("err:", err);
							res.send(err);
							return;
						}
						else{
								var query3='SELECT email FROM "Korisnik"';
								client.execute(query3,(err,result)=>{
									let emails= [];
									result.rows.forEach(r=>{
										emails.push(r.email);
									})
									/*const sgMail = require('@sendgrid/mail');
									sgMail.setApiKey(process.env.SENDGRID_API_KEY);
									
									const msg = {
									  to: emails, // replace these with your email addresses
									  from: 'Drzavna lutrija Srbije',
									  subject: '🍩 Pocetak novog kola 🍩',
									  text: 'Novo kolo je krenulo, mozete vec sada da uplatite svoju novu kombinaciju',
									  html: '<p>Izaberite vasu kombinaciju i mozda bas vi osvojite sedmicu</em></p>',
									};
									
									sgMail.sendMultiple(msg).then(() => {
									  console.log('emails sent successfully!');
									}).catch(error => {
									  console.log(error);
									});
									*/
									var transporter = nodemailer.createTransport({
										service: 'gmail',
										auth: {
										  user: 'urossmm1@gmail.com',
										  pass: 'urosurosuros'
										}
									  });
									  emails.forEach(e=>{
										var mailOptions = {
											from: 'urossmm1@gmail.com',
											to: e,
											subject: 'Pocetak novog kola',
											text: 'Novo kolo je krenulo, mozete vec sada da uplatite svoju novu kombinaciju! :)'
										  };
										  
										  transporter.sendMail(mailOptions, function(error, info){
											if (error) {
											  console.log(error);
											} else {
											  console.log('Email sent: ' + info.response);
											}
										  });
									  })
									  
								})
							today.setDate(today.getDate() + 7);
							console.log(today);
							return today;
						}
			})
			});
});

app.put('/vrednostSedmice', async (req,res)=>{
	let novaVrednost= req.body.vrednostSedmice;
	let query1= 'SELECT idkola FROM "Kolo" LIMIT 1';
	await client.execute(query1, async function(err,result){
		let params=[result.rows[0].idkola];
		console.log(params);
		let query2= 'UPDATE "Kolo" SET vrednostsedmice=' + "'" + novaVrednost + "' WHERE idkola= ?";
		console.log(query2);
		await client.execute(query2,params,async function(err,result){
			res.send("Vrednost sedmice postavljena je na " + novaVrednost)
		})
	})
	 
})

app.put("/uplatiKombinaciju", async(req,res)=>{
	var kombinacija= req.body.kombinacija;
	var idkorisnika= req.body.idkorisnika; //idkorisnika je njegov USERNAME
	var idkorisnika2=req.body.idkorisnika+"_";
	//console.log(idkorisnika);
	var query1= 'select idkola from "Kolo" limit 1'
	await client.execute(query1, async function(err,result){
		let params= [parseInt(result.first()['count']).toString()];
		var query2= 'SELECT stanje FROM "Kolo" WHERE idkola=?';
		await client.execute(query2,params, async function(err,result){
			if(result.rows[0].stanje=="otvoreno"){
				var query10= 'SELECT ' + idkorisnika +' FROM "BrojKombinacija_By_Kolo" WHERE idkola= ?';
				var params10= [/*idkorisnika,*/ params[0]];
				//console.log(params10);
				await client.execute(query10,params10,async function(err,result){
					//console.log(result.rows[0]);
					if(result==undefined){
						console.log("uso");
						var query6= 'ALTER TABLE "BrojKombinacija_By_Kolo" ADD ' + idkorisnika + " text ";
						console.log("query6 "+ query6);
						await client.execute(query6, async function(err,result){
							var query7= 'UPDATE "BrojKombinacija_By_Kolo" SET ' + idkorisnika + " = '" + "1' WHERE idkola=?";
							console.log("query7 "+ query7);
							await client.execute(query7,params,async function(err,result){
								idkorisnika2+=1;
								var query3= 'ALTER TABLE "Kombinacija_By_Kolo" ADD ' + idkorisnika2 + " text ";
								console.log("query3 "+query3);
									await client.execute(query3, async function(err,result){
										var query4= 'UPDATE "Kombinacija_By_Kolo" SET ' + idkorisnika2 + " = '" + kombinacija + "' WHERE idkola= ?";
										console.log("QUERY4 "+ query4);
										//console.log(params);
										await client.execute(query4, params, async function(err,result){
											res.send("Kombinacija uplacena");
										})
									})
							})
						})
					}
					else{
						console.log(Object.keys(result.rows[0][idkorisnika]));
						var brKombinacija=parseInt(result.rows[0][idkorisnika]) +1; // tu je greska ne vidi idkorisnika a sekaa vidi
						console.log("BRK "+brKombinacija);
						idkorisnika2+= (parseInt(result.rows[0][idkorisnika]) +1).toString(); //takodje i ovde
						console.log(idkorisnika2);
						var query3= 'ALTER TABLE "Kombinacija_By_Kolo" ADD ' + idkorisnika2 + " text ";
					//console.log("QUERY3 "+ query3);
					//var query3= 'INSERT INTO "Kombinacija_By_Kolo" (idkola, idkorisnika, kombinacija) values (?, ?, ?)';
					//let params3=[params2[0], idkorisnika, kombinacija]
						await client.execute(query3, async function(err,result){
						//res.json(result);
							var query4= 'UPDATE "Kombinacija_By_Kolo" SET ' + idkorisnika2 + " = '" + kombinacija + "' WHERE idkola= ?";
							console.log("QUERY4 "+ query4);
							console.log(params);
							await client.execute(query4, params, async function(err,result){
								//res.send("Kombinacija je uplacena");
								var query5= 'UPDATE "BrojKombinacija_By_Kolo" SET ' + idkorisnika + " = '"+ brKombinacija +"' WHERE idkola= ?";
								console.log("QUERY5 "+ query5);
								await client.execute(query5,params,async function(err,result){
									res.send("Kombinacija je uplacena");
								})
							})
						})
				}//od else
				})
	
			}
			else{
				res.send("Zakasnili ste, kolo je zatvoreno. ");
			}
		})
	})	
		
	
})


cron.schedule("14 16 * * Wed", async function(){
	var query1= 'select count(*) from "Kolo"'
		await client.execute(query1, async function(err,result){
			if(err){
				console.log(err);
				return;
			}
			let params2= ["zatvoreno", parseInt(result.first()['count']).toString()];
			var queryUpdate= 'UPDATE "Kolo" SET stanje= ? WHERE idkola= ? ';
			await client.execute(queryUpdate,params2, async function(err,result){
				if(err){
					console.log(err);
					return;
				}
				console.log("Uplata je zabranjena za poslednje kolo ");
			}) 
	})
}); 

//LOTO ALGORITAM
//cron.schedule("* * * * *", async function(){
	app.post('/test',function(req,res){
		/*var str = "Abc: Lorem ipsum sit amet";
		str = str.split(":").pop();
		console.log(str);*/
		let str= "3 14 33 37 11 8 29";
		str= str.split(" ");
		console.log(str);
		str.forEach(num=>{
			console.log(num); //svaki broj izdvojen posebno
		})
		// izvuci usernameove iz korisnik pa onda za svaki od njih vidi koliko ima uplata u brojkombinacijabykolo za tekuce kolo pa onda kroz petlju citas iz kombinacija by kolo
		// svaku kombinaciju koju je taj korisnik odigrao i tako za svakog korisnika
		// sve te kombinacije pamtis negde kao poseban niz 
		// osmisliti kako ce izgledati pretraga
	})
	
//})

//--------------------------------------------------------------------------------------
//ISPLATA DOBITNIKA NA RACUN + OBAVESTENJE DA SU OSVOJILI NAGRADU
//AUTOMATSKO BRISANJE SVIH KOLA KOJA SU STARIJA OD MESEC DANA (STARIJA OD CETVRTOG KOLA)
//RACUNANJE PROFITA OD KOLA


const PORT = process.env.PORT || 5000;
app.listen(PORT);

