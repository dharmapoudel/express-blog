var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

//function to convert emails to lowercase
function toLower(s){
	return s.toLowerCase();
}

var UserSchema = new Schema({
	name: {type: String, required: true },
	email:{type: String, set:toLower, required: true},
	username:{type:String, required:true},
	password: {type:String, required:true},
	admin:{type: Boolean, default: 0}
});

UserSchema.methods.hashPassword =  function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
