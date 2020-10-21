const express=require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const topicsRouter = require('./topics-router')
const app = express();
mongoose.Promise = global.Promise;
const jsonParser = bodyParser.json();

//Will make the connection between this file and the router file. Now, we must add "/sports/api" on the URL
app.use('/wenglish/topics', jsonParser, topicsRouter);

//Loads the index.html file as the main page (when entering to localhst:8080)
app.use(express.static('./../public'));

//We also need to tell to load the database, so we cannot use the app.listen anymore.
let server;

function runServer(port, databaseUrl) {
	//Promise is similar to an AJAX call
	return new Promise( (resolve, reject) => {
		mongoose.connect(databaseUrl,
				err => {
					if (err) {
						return reject(err);
					}
					else {
						server = app.listen(port, () => {
							console.log("Topics server is running in port ", port);
							resolve();
						})
						.on("error", err => {
							mongoose.disconnect();
							return reject(err);
						});
					}
				}
			)
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then ( () => {
			return new Promise( (resolve, reject) => {
				console.log("Closing the server");
				server.close( err => {
					if (err) {
						return reject(err);
					}
					else {
						resolve();
					}
				});
			});
		});
}

//Creates the DB, in case it doesn't exist
runServer(8080, "mongodb://localhost/topics")
	.catch(err => console.log(err));

module.exports = {app, runServer, closeServer};