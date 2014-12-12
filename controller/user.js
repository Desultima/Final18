var express = require('express');
var router  = express.Router();
var db   = require('../models/db');


/* View all users in a <table> */
router.get('/all', function (req, res) {
    db.GetEmail(function (err, result) {
            if (err) throw err;
            res.render('displayUserTable.ejs', {rs: result});
        }
    );
});
router.get('/Initial', function (req, res) {
    db.GetEmail(function (err, result) {
            if (err) throw err;
            res.render('displayUserTable2.ejs', {rs: result});
        }
    );
});

/* Create a User */

// Create User Form
router.get('/create', function(req, res){
    res.render('simpleform.ejs', {action: '/user/create'});
});

router.get('/edituser', function(req, res){
	db.GetEmail(function (err, result) {
		res.render('displayUserDropDownUpdate.ejs', {rs: result});
	}
	);
});
   
router.get('/edituser2', function(req, res){
	db.GetAll(req.query.AccountID, function (err, result) {
		res.render('simpleUpdateForm.ejs', {rs: result});
	}
	);
});

router.get('/Spouse', function(req, res){
	db.GetAllView(function (err, result) {
		if(err) throw err;
		res.render('FollowerPage1.ejs', {rs: result});
	}
	);
});

router.get('/Spouse2', function(req, res){
	db.GetAllView(function (err, result) {
		if(err) throw err;
	res.render('simpleFriendForm.ejs', {rs: result});
	}
	);
});

router.post('/Spouse3', function (req, res) {
    db.AddFollowers( req.body, function (err, result) {
    	if(result.PersonID != 'undefined') {
                var placeHolderValues = {
		    		personid: req.body.PersonID,
                    spousename: req.body.SpouseName,
                    spouseid: req.body.SpouseID
                };
                res.render('displayFromFriend.ejs', placeHolderValues);
                }
        });
});


router.get('/post', function(req, res){
    res.render('SimplePostForm.ejs', {action: '/user/post'});
});

router.get('/About', function(req, res){
    res.render('About.ejs');
});

router.get('/view', function(req, res){
	db.GetPostByID(req.query.AccountID, function (err, result) {
		if(err) throw err;
	res.render('displayUserPost.ejs', {rs: result});
	});
});
/* View a single user's information */
router.get('/', function (req, res) {
	db.GetAll(req.query.AccountID, function (err, result) {
	if(err) throw err;
	res.render('displayUserTableAll.ejs', {rs: result});
	});
});
router.get('/AllMore', function (req, res) {
	db.ShowAllData(req.query.AccountID, function (err, result) {
	if(err) throw err;
    if(result.AccountID != 'undefined'){
        var placeHolderValues = {
        Username: req.body.Username,
        AccountID: req.body.AccountID,
        FirstName: req.body.Firstname,
        LastName: req.body.Lastname,
        Bio: req.body.Bio,
        TotalRetweets: req.body.Totalretweets,
        AverageRetweets: req.body.Averageretweets,
        NumPostsMade: req.body.Numpostsmade,
        NumFollowers: req.body.Numfollowers
    };
	res.render('displayFinal.ejs', {rs: result});
	}
    });
});
router.get('/dropdown', function (req, res) {
	db.GetAllView(function (err, result) {
		if(err) throw err;
		res.render('displayUserDropDown.ejs', {rs: result});
	}
	);
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.Insert( req.body, function (err, result) {
            if (err) throw err;

            if(result.AccountID != 'undefined') {
                var placeHolderValues = {
                	personID: req.body.PersonID,
		    		money: req.body.Money,
                    firstname: req.body.FirstName,
                    lastname: req.body.LastName,
                    stateofresidence: req.body.StateofResidence,
                };
                res.render('displayUserInfo.ejs', placeHolderValues);
            }
            else {
                res.send('Person was not inserted.');
            }
        }
    );
});

router.post('/post', function (req, res) {
    db.InsertPost( req.body, function (err, result) {
            if (err) throw err;

            if(result.AccountID != 'undefined') {
                var placeHolderValues = {
		    		accountID: req.body.accountID,
		    		retweet: req.body.retweet,
                    post: req.body.post
                };
                res.render('displayFormPost.ejs', placeHolderValues);
            }
            else {
                res.send('Post not Added.');
            }
        }
    );
});



router.post('/view', function (req, res) {
	db.GetPostByID(req.body.PersonID, function (err, result) {
		if (err) {
			throw err;
		}
		console.log(result);
		res.render('displayUserPost.ejs', {rs: result});
		});
});

router.post('/edituser2', function (req, res) {
    db.EditUser( req.body, function (err, result) {
            if (err) throw err;

            if(result.AccountID != 'undefined') {
                var placeHolderValues = {
		    		accountID: req.body.accountID,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    bio: req.body.bio
                };
                res.render('displayFormData.ejs', placeHolderValues);
            }
            else {
                res.send('Post not Added.');
            }
        }
    );
});



module.exports = router;

