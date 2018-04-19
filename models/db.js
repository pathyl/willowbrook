var mongoose = require('mongoose');
var dbURIlocal = 'mongodb://localhost/willowbrook';
var dbURIOnline = 'mongodb://pathyl:p42nt41@ds241699.mlab.com:41699/willowbrook';
var dbURI = dbURIOnline;
mongoose.connect(dbURI);

/*Windows fix to emit proper signal for mongodb shutdown*/
var readLine = require("readline");
if(process.platform === "win32"){
	var r1 = readLine.createInterface ({
		input: process.stdin,
		output: process.stdout
	});
	r1.on ("SIGINT", function(){
		process.emit ("SIGINT");
	});
}

/*log when connected or disconnected to mongodb*/
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(){
	console.log('Mongoose connection error ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});


/*close connection to mongodb on exit*/
var gracefulShutdown = function (msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.on('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});

process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});

require('./schemas');