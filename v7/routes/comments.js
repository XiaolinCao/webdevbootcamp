var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, function(req, res) {
	// res.send("This will be the comment form.");
	// find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
	
});

//Comments Create
router.post("/", isLoggedIn, function(req, res) {
	// lookup campground using Id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			redirect("/campgounds");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	})
	// create new comment
	// connect new comment to campground
	// redirect
});

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;

