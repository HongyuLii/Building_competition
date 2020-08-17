var express = require("express");
var router  = express.Router(); //
var Competition = require("../models/competition");
var middleware = require("../middleware");


//index 
router.get("/", function(req, res){
    // Get all competitions from DB
   Competition.find({}, function(err, allCompetitions){
       if(err){
           console.log(err)
       } else {
           res.render("competitions/index", {competitions: allCompetitions})
       }
   })
});

//index 
router.get("/cases", function(req, res){
    // Get all competitions from DB
   Competition.find({}, function(err, allCompetitions){
       if(err){
           console.log(err)
       } else {
           res.render("competitions/cases", {competitions: allCompetitions})
       }
   })
});

//Create a new competition to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to Competition array
   var name = req.body.name;
   var image = req.body.image;
   var des = req.body.description;
   var data = req.body.data;
   var conclusion = req.body.conclusion;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCompetition = {name: name, image: image, description: des, data: data, conclusion: conclusion, author: author};

   //Create a new Competition and save to db
   Competition.create(newCompetition, function(err, newlyCreated){
       if(err){
           console.log(err)
       } else{
           //redirect back to Competition page
           console.log(newlyCreated); //print in terminal
           res.redirect("/Competitions");
       }
   });
});

//new form to 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("competitions/new")
});//show the form that will send the data to pot route

//SHOW - shows more info about one competition
router.get("/:id", function(req,res){
   //Find the competition with provided ID
   Competition.findById(req.params.id).populate("comments").exec(function(err, foundCompetition){
       if(err){
           console.log(err)
       } else{
           //render show template with that competition
           res.render("competitions/show", {competition: foundCompetition})
       }
   })
});

//EDIT
router.get("/:id/edit", middleware.checkCompetitionOwnership, function(req, res){
    Competition.findById(req.params.id, function(err, foundCompetition){
        res.render("competitions/edit", {competition: foundCompetition});
    });
});

//POST EDITION
router.put("/:id", middleware.checkCompetitionOwnership, function(req,res){
    Competition.findByIdAndUpdate(req.params.id, req.body.competition, function(err, updatedCompetition){
        if(err){
            res.redirect("/competition");
        } else {
            //redirect somewhere(show page)
            res.redirect("/competitions/" + req.params.id);
        }
     });
});

// DESTROY Comptition ROUTE
router.delete("/:id", middleware.checkCompetitionOwnership, function(req, res){
    Competition.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/competitions/cases");
       } else {
           res.redirect("/competitions/cases");
       }
    });
 });


module.exports = router;