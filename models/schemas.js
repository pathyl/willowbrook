var mongoose = require('mongoose');
var Schema = mongoose.Schema


const loginSchema = new mongoose.Schema({
	username: {type: String},
	password: {type: String}
});


const absenceSchema = new mongoose.Schema({
    dateAbsent: {type:Date},
    absenceType:{type: String}
});

const aftercareSchema = new mongoose.Schema({
    time: {type: Number},
    date: {type: Date}
});


const studentSchema = new mongoose.Schema({
    studentFirstName: {type: String},
    studentLastName: {type: String},
    aftercare: {type: String},
    programID: {type: String},
    studentID: {type: String},
    notes: {type: String},
    dateOfBirth: {type: Date },
    absences:[absenceSchema],
    aftercare:[aftercareSchema]
    });


const billSchema = new mongoose.Schema({
	billID:{type: String},
	dueDate: {type: Date},
	paid: {type: Boolean},
	amount: {type: Number},
	discount: {type: Boolean}
});

const householdSchema = new mongoose.Schema({
	parentFirstName: {type: String},
	parentLastName: {type: String},
	householdID: {type: String},
	streetAddress: {type: String},
	city: {type: String},
	state: {type: String},
	zip: {type: Number},
	phone: {type: String},
	altphone: {type: String},
	billingCycle: {type: String},
	student: [studentSchema],
	bill: [billSchema]
});


module.exports.household = mongoose.model('Household', householdSchema);
module.exports.student = mongoose.model('Student', studentSchema);
module.exports.absence = mongoose.model('Absence', absenceSchema);
module.exports.aftercare = mongoose.model('Aftercare', aftercareSchema);
module.exports.bill = mongoose.model('Bill', billSchema);
module.exports.login = mongoose.model('Login', loginSchema);
