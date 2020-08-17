var express = require("express");
var router  = express.Router({mergeParams: true}); //
var Competition = require("../models/competition");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments
router.get("/new", middleware.isLoggedIn, function(req,res){
    //Find the competition with provided ID
    Competition.findById(req.params.id, function(err, foundCompetition){
        if(err){
            console.log(err)
        } else{
            res.render("comments/new", {competition: foundCompetition})
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req,res){
    //Find the competition with provided ID
    Competition.findById(req.params.id, function(err, competition){
        if(err){
            console.log(err)
            res.redirect("/competitions");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    competition.comments.push(comment);
                    competition.save();
                    req.flash("success", "Successfully added comment!")
                    res.redirect('/competitions/' + competition._id);
                }
             });
        }
    })
});

//Edit
 // COMMENT EDIT ROUTE
 router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
         res.render("comments/edit", {competition_id: req.params.id, comment: foundComment});
       }
    });
 });
 
 // COMMENT UPDATE
 router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/competitions/" + req.params.id );
       }
    });
 });
 
 // COMMENT DESTROY ROUTE
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     //findByIdAndRemove
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment!")
            res.redirect("/competitions/" + req.params.id);
        }
     });
 });

 module.exports = router;