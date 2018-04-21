
var express = require('express');
var router = express.Router();
var allSchemas = require('../models/db');
var shortid = require('../node_modules/shortid');
var bodyParser = require('body-parser');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
/* ALL GETS */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search' });
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
 
  
    //this is how to extract the :studentId from url
    const studentId = req.params.studentId;
    //find household by id result is the result of the search
    allSchemas.student.findOne({studentID: studentId})
    .exec(function(err, result){
      if(err){
        sendJsonResponse(res, 400, err);
      }else{
        console.log(result);
        res.render('studentdetails', { title: 'Student Details', student: result});
      }
    });
    

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


router.post('/studentsearch', function(req, res, next){
  //get search term from searchbox
  var searchTerm = req.body.searchTerm;
  console.log(searchTerm + " this is the searchTerm");

  if( isNumeric(searchTerm) ){
    //if it is numeric expect a householdID number
    res.redirect('/student/' + searchTerm);

  }else{
    //if it's not numeric then expect a full name "Patrick Hyland"
    var splitString = searchTerm.split(" ");
    var first = splitString[0];
    var last = splitString[1];
    allSchemas.student.findOne( { studentFirstName: first, studentLastName: last} ).exec(function(err, result){
      if(err){
        sendJsonResponse(res, 400, err);
      }else{
        console.log(result + " Found results");
        res.redirect('/student/' + result.studentID);
      }
  });
  }
    
});


//COMPLETE
router.post('/householdsearch', function(req, res, next){
    //get search term from searchbox
    var searchTerm = req.body.searchTerm;
    console.log(searchTerm + " this is the searchTerm");

    if( isNumeric(searchTerm) ){
      //if it is numeric expect a householdID number
      res.redirect('/household/' + searchTerm);

    }else{
      //if it's not numeric then expect a full name "Patrick Hyland"
      var splitString = searchTerm.split(" ");
      var first = splitString[0];
      var last = splitString[1];
      allSchemas.household.findOne( { parentFirstName: first, parentLastName: last} ).exec(function(err, result){
        if(err){
          sendJsonResponse(res, 400, err);
        }else{
          console.log(result + " Found results");
          res.redirect('/household/' + result.householdID);
        }
    });
    }
      
  });


//Take data from form and create a new household with student
//COMPLETE
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

  //redirect us to see the details page of newly created household
  res.redirect('/household/' + result.householdID);

  }).catch(err => console.log(err));
  
  //take us back to the empty household form to enter another
  //must change this to view the details of household we just created later
  //res.redirect('/household/' + result.householdID)
  //res.redirect('/household');
});


//COMPLETE
router.post('/student', function(req, res, next) {

  //Create a student
  var myStudent = new allSchemas.student({
    studentFirstName: req.body.studentfirstname,
    studentLastName: req.body.studentlastname,
    householdID: req.body.householdid,
    aftercare:  req.body.aftercare,
    programID:  req.body.programid,
    notes:  req.body.notes,
    dateOfBirth:  req.body.dateofbirth
  });
  //Save student
  myStudent.save().then(result=> {
    console.log(result);
  }).catch(err => console.log(err));
});


module.exports = router;
