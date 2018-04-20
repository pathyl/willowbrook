
var express = require('express');
var router = express.Router();
var allSchemas = require('../models/db');
var shortid = require('../node_modules/shortid');
var bodyParser = require('body-parser');

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
router.get('/student/:studentId', function(req, res, next) {
  res.render('studentdetails', { title: 'Student Details' });

});

// router.get('/household/0', function(req, res, next) {
//   res.render('householddetails', { title: 'Household Details' });
// });

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

router.get('/household/0/bill', function(req, res, next) {
  res.render('billadd', { title: 'Add Bill to Household' });
    //this is how to extract the :householdId from url
    const householdId = req.params.householdId;
});

router.get('/household/:householdId', function(req, res, next) {
  
  //this is how to extract the :householdId from url
  const householdId = req.params.householdId;
  //find household by id result is the result of the search
  allSchemas.household.findOne({householdID: householdId})
  .exec(function(err, result){
    if(err){
      sendJsonResponse(res, 400, err);
    }else{
      console.log(result);
      res.render('householddetails', { title: 'Household Details', household: result});
    }
  });
  
  

});
// END OF GETS
//POSTS

router.post('/household', function(req, res, next){

  //create a household
	var myHousehold = new allSchemas.household({
		parentFirstName: req.body.parentfirstname,
		parentLastName: req.body.parentlastname,
    streetAddress: req.body.streetaddress,
		city: req.body.city,
		state: req.body.state,
		zip: req.body.zip,
		phone: req.body.phone,
		altphone: req.body.altphone,
    billingCycle: req.body.billingcycle
    
  },function(err, result){
		if (err){
			sendJsonResponse(res, 400, err);
		}else {
			sendJsonResponse(res, 201, "household : created");
		}
  });

  //save the household
	myHousehold.save().then(result => {
    console.log(result);
    //create a student only after the household is saved so we can reference result.householdID to set the householdID for student
  var myStudent = new allSchemas.student({
    studentFirstName: req.body.studentfirstname,
    studentLastName: req.body.studentlastname,
    aftercare:  req.body.aftercare,
    programID:  req.body.academicprogram,
    householdID: result.householdID,
    notes: req.body.notes,
    dateOfBirth: req.body.dateofbirth
  },function(err, result){
		if (err){
			sendJsonResponse(res, 400, err);
		}else {
			sendJsonResponse(res, 201, "student : created");
		}
  });

  //push student onto student array inside our household
  //myHousehold.student.push(myStudent);
  
  //save the student
  myStudent.save().then(result=> {
    console.log(result);
  }).catch(err => console.log(err));
  }).catch(err => console.log(err));
  
  


  res.redirect('/household')
});

router.post('/student', function(req, res, next) {

  //Create a student
  var myStudent = new allSchemas.student({
    studentFirstName: req.body.studentfirstname,
    studentLastName: req.body.studentlastname,
    aftercare:  req.body.aftercare,
    programID:  req.body.programid,
    notes:  req.body.notes,
    dateOfBirth:  req.body.dateofbirth
  });
  //lookup household by household id passed in req.body.householdid

  //push student onto household's array of students

  //save household

});


module.exports = router;
