var mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
	parentFirstName: {type: String},
	parentLastName: {type: String},
	householdID: {type: Number},
	streetAddress: {type: String},
	city: {type: String},
	state: {type: String},
	zip: {type: Number},
	phone: {type: String},
	altphone: {type: String},
	billingCycle: {type: String},
	student: [{
        studentFirstName: {type: String},
		studentLastName: {type: String},
		aftercare: {type: String},
		programID: {type: String},
		studentID: {type: String, "default": '0'},
		notes: {type: String},
		dateOfBirth: {type: Date },
		absences:[{
			dateAbsent: {type:Date},
			absenceType:{type: String}
		}]
			
		}],
	bill: [{
		dueDate: {type: Date},
		paid: {type: Boolean},
		amount: {type: Number},
		discount: {type: Boolean}
	}]
});


module.exports = mongoose.model('Household', householdSchema);
