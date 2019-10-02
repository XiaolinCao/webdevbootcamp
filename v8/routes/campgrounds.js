var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.post("/", function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description; // the name attribute
	var newCampground = {name: name, image: image, description: desc};
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
router.get("/new", function(req, res) {
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

module.exports = router;