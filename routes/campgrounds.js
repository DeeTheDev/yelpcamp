var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Campgrounds = require("../models/campground");

// INDEX - Show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campgrounds.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});
// CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
    // get data from from db and add to campground array
    //redirect back to campgrounds page
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    //create a new campground and save to DB
    Campgrounds.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
           res.redirect("/campgrounds"); //redirect back to campgrounds page
        }
    });
});
// NEW - Show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // find the campground with provided id - req.params.id
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render/show template show.ejs with that campground
            res.render("campgrounds/show", {campground: foundCampground});            
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",checkCampgroundOwnership, function(req, res) {
    //if user logged in?
        Campgrounds.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
        //otherwise redirect,
    //if not, redirect

});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
    //redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",checkCampgroundOwnership, function(req, res, next){
    Campgrounds.findById(req.params.id, function(err,campground){
        if(err) return next(err);
        
        campground.remove();
        res.redirect("/campgrounds");
    });
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else {
                //does user own the campground
                if(foundCampground.author.id.equals(req.user._id)){ // neccessary equals method
                   next(); 
                }else{
                    res.redirect("back");
                }
            }
        }); 
    }else{
        res.redirect("back");
    }
}

module.exports = router;