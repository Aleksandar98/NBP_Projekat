const express = require('express');
const app = express();
const cassandra = require('cassandra-driver');
//var cql = require('node-cassandra-cql');
const cors = require('cors')
const bodyParser = require('body-parser');
var _ = require('lodash');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send({ hi: 'there'});


});
const KEYSPACE = 'loto';

function connectToCassandra(keyspace)
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
}

app.get('/api/testcassandra', function(req, res)
{
	const client = new cassandra.Client({ contactPoints: ['localhost'],localDataCenter:'datacenter1' ,keyspace: 'loto'});

	const query = 'SELECT * FROM "Korisnici"';
	client.execute(query, function(err, result) {
		if(err)
		{
			console.log("err:", err);
			return;
		}
		console.log('got user profile with email ' + result.rows[0]);
		res.send(result.rows[0]);
	});
});

app.post('/api/createkorisnik', function(req, res)
{
	var korisnik = req.body;
	console.log("korisnik:", korisnik);
	//console.log("req:", req.body);
	//res.sendStatus(200);
	
	connectToCassandra(KEYSPACE)
	.then((client)=>
	{
		var query = 'INSERT INTO "Korisnici" ("Ime", "Kombinacija", "Prezime", "korID") VALUES ('+"'" + korisnik.ime + "', '" + korisnik.kombinacija + "', '" + korisnik.prezime + "', '"+korisnik.korID + "')";
		console.log("query:", query);
		client.execute(query, function(err, result)
		{
			if(err)
			{
				console.log("err:", err);
				res.send(err);
				return;
			}
			console.log("insert korisnik result:", result);
			res.send({result: true, data: result});
		});
	})
	.catch((error)=>
	{
		console.log(error)
		res.send({result: false, error: error});
	});
	
});


app.listen(5000);