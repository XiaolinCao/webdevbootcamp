var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all middleware go here
var middlewareObj = {};


middlewareObj.checkCampgroudOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "Campground Not Found");
                res.redirect("back");
            } else {
                //does the user own this campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }else {
                    req.flash("error", "You don't have permisson to do that.");
                    res.redirect("back");
                }
                
            }
        });  
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
 
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
   if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                
                res.redirect("back");
            } else {
                //does the user own this comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }else {
                    req.flash("error", "You don't have permisson to do that.");
                    res.redirect("back");
                }
                
            }
        });  
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }

}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that."); //just adding this line won't display this message
    res.redirect("/login");
}

module.exports = middlewareObj;