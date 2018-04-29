
var express = require('express');
var router = express.Router();
var allSchemas = require('../models/db');
var shortid = require('../node_modules/shortid');
var bodyParser = require('body-parser');
var moment = require('moment');
moment().format();

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_');
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
/* ALL GETS */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Search' });
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
router.get('/household', function(req, res, next) {
  res.render('createhousehold', { title: 'Register New Household' });
});

router.get('/student', function(req, res, next) {
  res.render('addstudent', { title: 'Add Student to Household' });
});

//get student details and household details
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
        console.log(result + " Student found");
        allSchemas.absence.find({studentID: studentId}, function(err, foundAbsences){

          if(err){
            console.log("error finding absences " + err);
          }else{
            console.log(foundAbsences + " Absences found");
            allSchemas.aftercare.find({studentID: studentId}, function(err, foundAftercares){

              if(err){
                console.log("error finding aftercares " + err);
              }else{
                console.log(foundAftercares + " Aftercares found");
                res.render('studentdetails', { title: 'Student Details', student: result, absences: foundAbsences, aftercares: foundAftercares});
              }
            });
          }
        });   
      }
    });
});


router.get('/billdetails/:householdId', function(req,res,next){

  allSchemas.household.find({householdID: req.params.householdId}, function(err, foundHousehold){
    if(err){
      console.log(err);
    }else{
      //console.log("Found Household " + foundHousehold);
      allSchemas.student.find({householdID: req.params.householdId}, function(err, foundStudents){
        if(err){
          console.log(err);
        }else{
          console.log("inside studentfinder else");
          res.render('billdetails', { title: 'Invoice', students: foundStudents, household: foundHousehold });
        }
      });
    }

  });
});
//Show household details page for :householdId
router.get('/household/:householdId', function(req, res, next) {
  //this is how to extract the :householdId from url
  const householdId = req.params.householdId;
  //find household by id result is the result of the search
  allSchemas.household.findOne({householdID: householdId})
  .exec(function(err, result){
    if(err){
      sendJsonResponse(res, 400, err);
    }else{
      console.log(result + "Household Found");

      allSchemas.student.find({householdID: result.householdID},function(err, foundStudents){
        console.log("Entering student finder");
        if(err){
          console.log(err + " Error finding students")
        }else{
          console.log("Found these students:" + foundStudents)
          //generate bills after finding household and students
          allSchemas.bill.find({householdID: req.params.householdId},function(err, foundBills){
            if(err){
              console.log(err + " inside billfinder");
            }else{
              if(foundBills.householdID == undefined){
                console.log("No Bills");
                //calculate grand total for bill
                
                // if there isn't a bill create one
                var createdBill = new allSchemas.bill({
                    householdID: result.householdID,

                });
                res.render('householddetails', { title: 'Household Details', household: result, students: foundStudents, bills: createdBill});
              }else{
                console.log("Found Bill HHID is: " + foundBills.householdID);
                res.render('householddetails', { title: 'Household Details', household: result, students: foundStudents, bills: foundBills});
              }
            }
          });
          //display the page
          //res.render('householddetails', { title: 'Household Details', household: result, students: foundStudents, bills: foundBills});
          
        }
      });
    }
  });

  
});

// router.get('/household/0', function(req, res, next) {
//   res.render('householddetails', { title: 'Household Details' });
// });
router.get('/allstudents', function(req,res,next){
  allSchemas.student.find({}, function(err, foundStudents){
    if(err){
      console.log("Error finding all students " + err);
    }else{
      res.render('allstudents', {title: 'All Students', students: foundStudents});
    }

  });
});
router.get('/household/:householdId/itemizedaftercare', function(req, res, next){
  console.log("inside router");
  allSchemas.student.find({householdID: req.params.householdId}, function(err, foundStudents){
    
    if(err){
      console.log("Error finding students in this household " +err);
    }else{
      console.log("Rendering");
      res.render('itemizedaftercare', {title: 'Itemized Aftercare Report', students: foundStudents});
    }

  });
  
});

router.get('/allhouseholds', function(req,res,next){
  allSchemas.household.find({}, function(err, foundHouseholds){
    if(err){
      console.log("Error finding all households " + err);
    }else{
      res.render('allhouseholds', {title: 'All Households', households: foundHouseholds});
    }

  });
});
router.get('/date', function(req, res, next) {
  res.render('index', { title: 'Index' });
  console.log(moment());
});
router.get('/bill/:billId', function(req, res, next) {
  res.render('billdetails', { title: 'Itemized Bill' });
});
router.get('/billdetails/:householdId/billprintable', function(req, res, next) {

  allSchemas.household.find({householdID: req.params.householdId}, function(err, foundHousehold){
    if(err){
      console.log(err);
    }else{
      //console.log("Found Household " + foundHousehold);
      allSchemas.student.find({householdID: req.params.householdId}, function(err, foundStudents){
        if(err){
          console.log(err);
        }else{
          console.log("inside studentfinder else");
          res.render('billprintable', { title: 'Invoice', students: foundStudents, household: foundHousehold });
        }
      });
    }

  });

});
//forms to add an absence, aftercare hours, or bill, again 0 is a placeholder for the student or household id
router.get('/student/:studentId/absence', function(req, res, next) {
  res.render('absenceadd', { title: 'Add Absence to Student', id: req.params.studentId });
});

router.get('/student/:studentId/aftercare', function(req, res, next) {
  res.render('aftercareadd', { title: 'Add Aftercare Time to Student', id: req.params.studentId  });
});

router.get('/household/bill', function(req, res, next) {
  res.render('billadd', { title: 'Add Bill to Household' });


});

router.get('/household/:householdId/addstudent', function(req, res, next){
  console.log("inside get for /household/householdId/addstudent");

  res.render('householdaddstudent', { title: "Add Student to Household: " + req.params.householdId, householdid: req.params.householdId});
});



//form to create a new username/password
router.get('/createlogin', function(req, res, next) {
  res.render('createlogin', { title: 'Create Login' });
});

router.get('/student/:studentId/edit', function(req,res,next){
  allSchemas.student.findOne({studentID:req.params.studentId}, function(err, foundStudent){
    if(err){
      console.log(err);
    }else{
      console.log("found student " + foundStudent);
      res.render('studentedit',{title: "Edit Student Details", student: foundStudent, studentId: req.params.studentId});
    }
    
  });
  
});
router.get('/household/:householdId/edit', function(req,res,next){
  allSchemas.household.findOne({householdID:req.params.householdId}, function(err, foundHousehold){
    if(err){
      console.log(err);
    }else{
      console.log("found Household " + foundHousehold);
      res.render('householdedit',{title: "Edit Household Details", household: foundHousehold, householdId: req.params.householdId});
    }
    
  });
  
});
// END OF GETS

//POSTS BEGIN
router.post('/household/:householdId/edit', function(req,res,next){
  allSchemas.household.findOneAndUpdate({householdID: req.params.householdId},
    {parentFirstName: req.body.parentfirstname,
    parentLastName: req.body.parentlastname,
    streetAddress:req.body.streetaddress,
    city:req.body.city,
    state:req.body.state,
    zip:req.body.zip,
    phone:req.body.phone,
    altphone:req.body.altphone,
    billingCycle:req.body.billingcycle })
  .then(function(){
    allSchemas.household.findOne({householdID: req.params.householdId}, function(err, foundHousehold){
      console.log("updated household: " + foundHousehold);
    })
    res.redirect('/household/' + req.params.householdId);
  });
 
});
router.post('/student/:studentId/delete', function(req,res,next){
  allSchemas.student.findOneAndRemove({studentID: req.params.studentId})
  .then(function(){
    console.log("student deleted");
    res.redirect('/index');
  })
});
router.post('/household/:householdId/delete', function(req,res,next){
  allSchemas.household.findOneAndRemove({householdID: req.params.householdId})
  .then(function(){
    console.log("household deleted");
    res.redirect('/index');
  })
});
router.post('/student/:studentId/edit', function(req,res,next){
  allSchemas.student.findOneAndUpdate({studentID: req.params.studentId},{studentFirstName: req.body.studentfirstname,studentLastName: req.body.studentlastname,programID: req.body.programid,aftercare: req.body.aftercare})
  .then(function(){
    allSchemas.student.findOne({studentID:req.params.studentId}, function(err, foundStudent){
      console.log("updated student: " + foundStudent);
    })
    res.redirect('/student/' + req.params.studentId)
  });
 
});
//create a new aftercare ticket for specific student
router.post('/student/:studentid/aftercare', function(req, res, next) {
  console.log("in post router for /student/add/aftercare");
  var newAftercare = new allSchemas.aftercare({
    studentID: req.params.studentid,
    time: req.body.aftercaretime,
    date: req.body.aftercaredate
  }); 
  
  newAftercare.save().then(result=>{
    console.log(result + " aftercare created");
  });
  allSchemas.student.find({studentID: req.params.studentid}, function(err, foundStudent){
    console.log("Trying to update student");
    console.log(foundStudent[0] + " Found inside new aftercarefinder");
    var totalUnits = (Number(req.body.aftercaretime) + Number(foundStudent[0].aftercareUnits));
    foundStudent[0].aftercares.push(newAftercare);
    foundStudent[0].set({aftercareUnits: totalUnits});
    foundStudent[0].save(function(err, updatedStudent){
      if(err){
        console.log("Error updating the student " + err);
      }else{
        console.log("Updated the student with more aftercare time " + updatedStudent);
      }
    });
    
  });
  //bring user back to the create aftercare form
  console.log("before aftercare REDIRECT");
  res.redirect('/student/'+req.params.studentid);
    //bring user back to the student they came from
  //res.redirect('/student/' + req.params.studentid);
});

//create an absence for specific student
router.post('/student/:studentid/absence', function(req, res, next) {
  console.log("in post router for /student/add/absence");
  var newAbsence = new allSchemas.absence({
    studentID: req.params.studentid,
    absenceType: req.body.absencetype,
    dateAbsent: req.body.absencedate
  }); 
  
  newAbsence.save().then(result=>{
    console.log(result + " absence created");
  });
  //bring user back to the student they came from
  res.redirect('/student/' + req.params.studentid);
});


// the student/add/* allow you to enter the student ID manually, may put these on the main switchboard later
//
router.post('/student/add/aftercare', function(req, res, next) {
  console.log("in post router for /student/add/aftercare");
  var newAftercare = new allSchemas.aftercare({
    studentID: req.body.studentid,
    time: req.body.aftercaretime,
    date: req.body.aftercaredate
  }); 
  
  newAftercare.save().then(result=>{
    console.log(result + " aftercare created");
  });
  allSchemas.student.find({studentID:newAftercare.studentID}, function(err, foundStudent){
    console.log("Trying to update student");
    foundStudent.aftercareUnits += req.body.aftercaretime;
    foundStudent.save().then(result=>{
      console.log("Updated student aftercareUnits " + result);
    });
  });
  //bring user back to the create aftercare form
  console.log("before aftercare REDIRECT");
  res.redirect('/student/add/aftercare');
});
router.post('/student/add/absence', function(req, res, next) {
  console.log("in post router for /student/add/absence");
  var newAbsence = new allSchemas.absence({
    studentID: req.body.studentid,
    dateAbsent: req.body.absencedate,
    absenceType: req.body.absencetype
  }); 
  
  newAbsence.save().then(result=>{
    console.log(result + " absence created");
  });
  //bring user back to the create absence form
  res.redirect('/student/add/absence');
});


//create a new bill
router.post('/household/bill', function(req, res, next){
  var newBill = new allSchemas.bill({
    householdID: req.body.householdid ,
    dueDate: req.body.duedate,
    paid: req.body.paid,
    amount: req.body.amount,
    discount: req.body.discount
  });

  newBill.save().then(result=>{
    console.log(result + " bill added")
  });
  res.redirect('/household/bill');

});

//submitting form to create a new username and password
router.post('/createlogin', function(req, res, next){

  var newLogin = new allSchemas.login({
    username: req.body.username,
    password: req.body.password
  });
  newLogin.save().then(result=>{
    console.log(result + " login added");
  });
});

//logging in
router.post('/login', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;

  console.log("Username: " + username + " Password: " + password);

  allSchemas.login.findOne( { username: req.body.username, password: req.body.password} ).exec(function(err, result){
    if(err){
      sendJsonResponse(res, 400, err);
    }else{
      console.log(result + " Found result");
      res.redirect('/home');
    }
  });

});

//search for student by studentID number or Firstname Lastname
router.post('/studentsearch', function(req, res, next){
  //get search term from searchbox
  var searchTerm = req.body.searchTerm;
  console.log(searchTerm + " this is the searchTerm");

  if( isNumeric(searchTerm) ){
    //if it is numeric expect a studentID number
    //check to see if that student exists
    allSchemas.student.findOne( { studentID: searchTerm}).exec(function(err, result){
      if(err){
        console.log(err + " error finding a student")
      }else{
        if(result != null){
          res.redirect('/student/' + searchTerm);
        }else{
          console.log("couldn't find a student by that number");
          res.render('index', { title: 'Could not find a student with that ID' });
        }
      }
    });
    

  }else{
    //if it's not numeric then expect a full name "Patrick Hyland"
    var splitString = searchTerm.split(" ");
    var first = splitString[0];
    var last = splitString[1];
    allSchemas.student.findOne( { studentFirstName: first, studentLastName: last} ).exec(function(err, result){
      if(err){
        sendJsonResponse(res, 400, err);
      }else{
        if(result != null){
          console.log(result + " Found results");
          res.redirect('/student/' + result.studentID);
        }else{
          console.log("couldn't find a student by that name");
          res.render('index', { title: 'Could not find a student with that Name' });
        }
        
        
      }
  });
  }
    
});


//search for household by HouseholdID number or Firstname Lastname
router.post('/householdsearch', function(req, res, next){
    //get search term from searchbox
    var searchTerm = req.body.searchTerm;
    console.log(searchTerm + " this is the searchTerm");

    if( isNumeric(searchTerm) ){
      //if it is numeric expect a householdID number
      //check to see if it exists
      allSchemas.household.findOne( { householdID: searchTerm}).exec(function(err, result){
        if(err){
          console.log(err + " error when searching for household by ID number");
        }else{
          if(result != null){
            res.redirect('/household/' + searchTerm);
          }else{
            console.log("couldn't find a household by that number");
            res.render('index', { title: 'Could not find a household with that ID' });
          }
        }
      });
      

    }else{
      //if it's not numeric then expect a full name "Patrick Hyland"
      var splitString = searchTerm.split(" ");
      var first = splitString[0];
      var last = splitString[1];
      allSchemas.household.findOne( { parentFirstName: first, parentLastName: last} ).exec(function(err, result){
        if(err){
          sendJsonResponse(res, 400, err);
          res.redirect('/index');
        }else{
          if(result != null){
            console.log(result + " Found results");
            res.redirect('/household/' + result.householdID);
          }else{
            console.log("couldn't find a household with that name");
            res.render('index', { title: 'Could not find a household with that name' });
          }
          
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


//create a new student and add to existing household
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
  res.redirect('/household/' + req.body.householdid);
});

//create a new student from the household details page button ---> household ID already known
router.post('/household/:householdId/addstudent', function(req, res, next) {

  //Create a student
  var myStudent = new allSchemas.student({
    studentFirstName: req.body.studentfirstname,
    studentLastName: req.body.studentlastname,
    householdID: req.params.householdId,
    aftercare:  req.body.aftercare,
    programID:  req.body.programid,
    notes:  req.body.notes,
    dateOfBirth:  req.body.dateofbirth
  });
  //Save student
  myStudent.save().then(result=> {
    console.log(result);
  }).catch(err => console.log(err));

  res.redirect('/household/' + req.params.householdId);
});


module.exports = router;
