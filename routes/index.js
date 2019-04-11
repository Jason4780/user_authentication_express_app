var express = require('express');
var router = express.Router();
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


router.get('/register', (req, res)=>{
  return res.render('register', {title: 'Sign up!'})
})

// post register form to our mongoDB
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
              res.redirect('profile')
            }
          })

      }else{
        const err = new Error('All fields must be filled out.')
        err.status = 400
        return next(err)
      }// if all fields not filled out, throw this error
})

module.exports = router;
