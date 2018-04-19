var mongoose = require('mongoose');


const loginSchema = new mongoose.Schema({
	username: {type: String},
	password: {type: String}
});

module.exports = mongoose.model('Login', loginSchema);
