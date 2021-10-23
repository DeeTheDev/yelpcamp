var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Landing page
router.get("/", function(req, res) {
  res.render("landing");
});

//============
// AUTH ROUTES
//=============

// New register
router.get("/register", function(req, res) {
  res.render("register");
});

// Create New User - sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username }); //input username fields to db
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    });
  });
});
//show login form
router.get("/login", function(req, res) {
  res.render("login");
});
//Login user - login logic
router.post(
  "/login",
  passport.authenticate(
    "local", //middleware to authen
    {
      successRedirect: "/campgrounds", //passport if success > login
      failureRedirect: "/login" //passport checks if login failed
    }
  ),
  function(req, res) {
    // doesn't do anything
  }
);
//logout route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/campgrounds");
});

//are you logged in?
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
