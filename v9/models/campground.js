var mongoose = require("mongoose");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			// associate comments with campgrounds using reference
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// compile to a model and there are several methods in it
module.exports = mongoose.model("Campground", campgroundSchema);