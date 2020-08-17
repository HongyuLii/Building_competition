var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

//autho routes
//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to yelp camp " + user.username)
            res.redirect("/competitions"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login"); 
 });
 // handling login logic
router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/competitions",
         failureRedirect: "/login"
     }), function(req, res){
         req.flash("success", "Successfully logged in!")
 });

 // logic route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/competitions");
 });
 
 module.exports = router;