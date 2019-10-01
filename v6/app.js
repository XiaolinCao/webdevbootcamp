var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var port = process.env.PORT || 3000;


// connect to the database yelp_camp; if not exist, will be 
// automatically create
mongoose.connect("mongodb://localhost:27017/yelp_camp_v4", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Nian nian is the cutest cat",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
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

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
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


//================
// AUTH ROUTE
//================

// show register form
app.get("/register", function(req, res) {
	res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("/register");
		}
		// "local" can be "twitter"
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// show login form
app.get("/login", function(req, res) {
	res.render("login");
});

// handle login logic
// app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
	
});

// logout route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});
 
// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(port, function() {
	console.log("Serve Has Started!");
});
