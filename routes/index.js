var express = require('express');
var router = express.Router();

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

module.exports = router;
