var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');


module.exports = {
	authenticateUser: function(req, res){
		var username = req.body.username,
			password = req.body.password;

		User.findOne({username: username}, function(err, dbuser){
			if(dbuser == null){
				res.redirect('/?m=invalid username');
			}else{
				var validUser = dbuser.validPassword(password);
				if(validUser){
					var token = jwt.sign({username:dbuser.username, email:dbuser.email, admin: dbuser.admin}, config.secret, {
						expiresInMinutes : 1440 //in minute: expires in 24 hours
					});
					var session = req.session;

					session.token = token;
					res.redirect('/');
				}else{
					res.redirect('/?m=invalid password');
				}
			}
		});
	},
	logout: function(req, res){
		var session = req.session;
		res.locals.token = null;
		session.token = null;
	},
	getLoggedInUserObject: function(req, res){
		var session = req.session;
		if(session.token){
			return jwt.verify(session.token, config.secret);
		}
	},
	ensureLoggedIn: function(req, res){
		var session = req.session;
		if(session.token){
			var user = jwt.verify(session.token, config.secret);
			if(user.email){
				return true;
			}
			return false;
		}
		return false;
	}
};