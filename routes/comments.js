var express = require("express");
var router = express.Router({mergeParams: true}); //mergeParams connects a req.params with routers
var Campgrounds = require("../models/campground");
var Comment = require("../models/comment");

// -------------------
// COMMENTS ROUTES
//--------------------

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    //Find campground id
    console.log(req.params.id);
    Campgrounds.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
// Comments Create
router.post("/", isLoggedIn, function(req, res){
    //Find campground id
    Campgrounds.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});
//Edit Comment
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
//Update comment
router.put("/:comment_id", function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;