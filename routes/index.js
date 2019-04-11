const express = require('express');
const router = express.Router();
const User = require('../models/user')

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});


// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

//GET login
router.get('/login', (req, res, next)=>{
    res.render('login', {title: 'Log in!'})
})

//POST login
router.post('/login', (req, res, next)=>{
  if(req.body.email && req.body.password){
    
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user){
        const err = new Error("Email or password is incorrect.")
        err.status = 401
        next(err)
      }else{
       
        req.session.userId = user._id;
        res.redirect('/profile')
      }
    });

  }else{
    const err= new Error('Email and Password required.')
    err.status = 401
    next(err)
  }
 
})
//GET profile, password protected
router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    const err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});

//GET register
router.get('/register', (req, res)=>{
  return res.render('register', {title: 'Sign up!'})
})

// POST register form to our mongoDB
router.post('/register', (req, res, next)=>{
  //check to make sure all fields are filled out
    if(req.body.email &&
      req.body.name &&
      req.body.favoriteBook &&
      req.body.password &&
      req.body.confirmPassword){

        if(req.body.password !== req.body.confirmPassword){
          const err = new Error('Passwords do not match.')
          err.status = 400
          return next(err)
        }// checks to make sure passwords match

        //create document to be inserted into Mongo
        let userData = {
          email:  req.body.email,
          name:  req.body.name,
          favoriteBook:  req.body.favoriteBook,
          password:  req.body.password
          }

          //use schema create method to insert object into Mongo
          User.create(userData, (error, user)=>{
            if(error){
             return next(error)
            }else{
              //keeps them logged in by using the session and cookie creation here
              req.session.userId = user._id;
              res.redirect('/profile')
            }
          })

      }else{
        const err = new Error('All fields must be filled out.')
        err.status = 400
        return next(err)
      }// if all fields not filled out, throw this error
})

module.exports = router;
