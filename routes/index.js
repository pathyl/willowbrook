var express = require('express');
var router = express.Router();
var Household = require('../models/household');
var shortid = require('../node_modules/shortid');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');

/* ALL GETS */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/household', function(req, res, next) {
  res.render('createhousehold', { title: 'Register New Household' });
});

router.get('/student', function(req, res, next) {
  res.render('addstudent', { title: 'Add Student to Household' });
});

// the 0 is a placeholder for :studentid or :householdid
router.get('/student/0', function(req, res, next) {
  res.render('studentdetails', { title: 'Student Details' });
});

router.get('/household/0', function(req, res, next) {
  res.render('householddetails', { title: 'Household Details' });
});

router.get('/bill/0', function(req, res, next) {
  res.render('billdetails', { title: 'Itemized Bill' });
});

//forms to add an absence, aftercare hours, or bill, again 0 is a placeholder for the student or household id
router.get('/student/0/absence', function(req, res, next) {
  res.render('absenceadd', { title: 'Add Absence to Student' });
});

router.get('/student/0/aftercare', function(req, res, next) {
  res.render('aftercareadd', { title: 'Add Aftercare Time to Student' });
});

router.get('/household/0/bill', function(req, res, next) {
  res.render('billadd', { title: 'Add Bill to Household' });
});


// END OF GETS
//POSTS
router.post('household', function(req, res, next){

 //sendJsonResponse(res, 200, {"status" : "success", "student" : "created"});
  //console.log(req.body);
  //householdID: req.body.householdid,
  //			studentID:  req.body.studentid,
  //householdID: shortid.generate(),
	var household = new Household({
		parentFirstName: req.body.parentfirstname,
		parentLastName: req.body.parentlastname,
    streetAddress: req.body.streetaddress,
    householdID: shortid.generate(),
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		phone: req.body.phone,
		altphone: req.body.altphone,
		billingCycle: req.body.billingCycle,
		student:[{
			studentFirstName: req.body.studentfirstname,
      studentLastName: req.body.studentlastname,
      studentID: shortid.generate(),
			aftercare:  req.body.aftercare,
			programID:  req.body.programid,
			notes:  req.body.notes,
			dateOfBirth:  req.body.dateofbirth
    }]
  },function(err, location){
		if (err){
			sendJsonResponse(res, 400, err);
		}else {
			sendJsonResponse(res, 201, "it : success");
		}
	});
	household.save().then(result => {
		console.log(result);
	}).catch(err => console.log(err));


});
module.exports = router;
