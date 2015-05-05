var mongoose  = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: {type: String, default:'', trim: true, required:true},
	postbody: {type: String, default:'', trim: true, required: true},
	username: {type: String, required:true},
	comments: [{
		commentbody: {type: String, default:'', trim: true},
		username: {type: String, required:true},
		commentdate: {type: Date, default: Date.now}
	}],
	postdate: {type: Date, default: Date.now},
	approved: {type:Boolean, default: 0},
});

PostSchema.pre('save', function(next){
	var currentDate = new Date();
	this.postdate = currentDate;
	next();
});

module.exports = mongoose.model("Post", PostSchema);