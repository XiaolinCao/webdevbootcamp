var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // same as /middleware/index.js

// INDEX - show all campgrounds
router.get("/", function(req, res) {

	// get all campground from DB
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		}else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
	// res.render("campgrounds", {campgrounds: campgrounds});
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description; // the name attribute
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		}else {
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
	// campgrounds.push(newCampground);
	
});

// NEW - show the form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new")
});

// This need to go behind the above one
// SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err);
		}else {
			//render show template for that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
		
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground) {
		// foundCampground.author.id is a mongoose object
		// req.user._id is a string
		res.render("campgrounds/edit", {campground: foundCampground});
	});	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	// redirect somewhere (show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});





module.exports = router;