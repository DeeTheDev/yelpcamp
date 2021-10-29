var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campgrounds = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

//Require Routes Files
var indexRoutes = require("./routes/index"), // auth stored here
  campgroundsRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments");

//mongoDB Atlas Cluster connection - this is the database storage connection
var mongodb_url = process.env.DATABASE_URL; // v10
mongoose.connect(mongodb_url, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // better way to call the public directory, it adds full dirname
app.use(methodOverride("_method"));

// seedDB(); // Seed Database

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Once again Nathalie is cute",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // used for middleware!
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next(); // neccessary
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//============================================== LISTEN to PORT
//-----------------LISTENING TO APP SERVER
const hostname = "127.0.0.1";
const port = 4000;
app.listen(port, hostname, () => {
  console.log(`Server running: http://${hostname}:${port}/`);
});
