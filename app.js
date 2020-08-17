var express = require("express");
var app = express();
var bodyParser = require("body-parser");//for req below
var mongoose = require("mongoose");
var passport = require("passport");
var flash       = require("connect-flash");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Competition = require("./models/competition");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");


//requiring routes
var commentRoutes    = require("./routes/comments"),
    competitionRoutes = require("./routes/competitions"),
    indexRoutes      = require("./routes/index")



mongoose.connect("mongodb://localhost/building_competition_updated", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); // for editing and updating
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
    secret: "cuetest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

app.use("/", indexRoutes);
app.use("/competitions", competitionRoutes);
app.use("/competitions/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("Building_Competition Server Has Started!");
});