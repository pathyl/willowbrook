var mongoose = require('mongoose');
var dbURIlocal = 'mongodb://localhost/willowbrook';
var dbURIOnline = 'mongodb://pathyl:p42nt41@ds241699.mlab.com:41699/willowbrook';
var dbURI = dbURIOnline;
var autoIncrement = require('mongoose-auto-increment');
mongoose.connect(dbURI);
var connection = mongoose.createConnection(dbURI);


//Database connection

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

//require('./schemas');


//SCHEMAS

autoIncrement.initialize(connection);

var mongoose = require('mongoose');
var Schema = mongoose.Schema


const loginSchema = new mongoose.Schema({
	username: {type: String},
	password: {type: String}
});


const absenceSchema = new mongoose.Schema({
	studentID: {type: Number},
    dateAbsent: {type: String},
    absenceType: {type: String}
});

const aftercareSchema = new mongoose.Schema({
	studentID: {type: Number},
    time: {type: Number},
    date: {type: String}
});


const studentSchema = new mongoose.Schema({
    studentFirstName: {type: String},
    studentLastName: {type: String},
    aftercare: {type: String},
    programID: {type: String},
    studentID: {type: Number},
    householdID: {type: Number},
    fullID: {type: String},
    notes: {type: String},
	dateOfBirth: {type: String},
	aftercareUnits: {type: Number, default:0},
	aftercares:[aftercareSchema]
	});
	//Start studentID at and increment by 1 for each new student
	studentSchema.plugin(autoIncrement.plugin, {
		model: 'studentSchema',
		field: 'studentID',
		startAt: 10,
		incrementBy: 1
	});

const billSchema = new mongoose.Schema({
	billID: {type: Number},
	householdID: {type: Number},
	genDate:{type:String},
	dueDate: {type: String},
	parentName:{type:String},
	parentStreet:{type:String},
	parentPhone:{type:String},
	amount: {type: Number},
	monthlyDiscount: {type: String},
	multiDiscount: {type: String},
});
billSchema.plugin(autoIncrement.plugin, {
	model: 'billSchema',
	field: 'billID',
	startAt: 500,
	incrementBy: 1
});
const householdSchema = new mongoose.Schema({
	parentFirstName: {type: String},
	parentLastName: {type: String},
	householdID: {type: Number},
	streetAddress: {type: String},
	city: {type: String},
	state: {type: String},
	zip: {type: String},
	phone: {type: String},
	altphone: {type: String},
    billingCycle: {type: String},
});
//begin householdID at 100 and increment by 1 each time
householdSchema.plugin(autoIncrement.plugin, {
	model: 'householdSchema',
	field: 'householdID',
	startAt: 100,
	incrementBy: 1
});

module.exports.household = mongoose.model('Household', householdSchema);
module.exports.student = mongoose.model('Student', studentSchema);
module.exports.absence = mongoose.model('Absence', absenceSchema);
module.exports.aftercare = mongoose.model('Aftercare', aftercareSchema);
module.exports.bill = mongoose.model('Bill', billSchema);
module.exports.login = mongoose.model('Login', loginSchema);

