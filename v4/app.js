var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var port = process.env.PORT || 3000;


// connect to the database yelp_camp; if not exist, will be 
// automatically create
mongoose.connect("mongodb://localhost:27017/yelp_camp_v4", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res) {
	res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
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
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new")
});

// This need to go behind the above one
// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
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

// =======================
// COMMENTS ROUTES
// =======================

app.get("/campgrounds/:id/comments/new", function(req, res) {
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

app.post("/campgrounds/:id/comments", function(req, res) {
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

app.listen(port, function() {
	console.log("Serve Has Started!");
});
