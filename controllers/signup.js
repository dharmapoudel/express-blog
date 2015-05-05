var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');

module.exports = {
	insertUser :function(req , res){
		
		User.findOne({email: req.body.email}, function(err, user){
			if(err){
				res.redirect('/signup?m=error occured');
			}else{
				if(user){
					res.redirect('/login?m=user already exists')
				}else{
					var user = new User();
					user.username = req.body.username;
					user.password = user.hashPassword(req.body.password);
					user.email = req.body.email;
					user.name = req.body.name;
					user.admin = 0;
					user.save(function(){
						var token = jwt.sign({username:user.username, email:user.email, admin: user.admin}, config.secret, {
							expiresInMinutes : 1440 //in minute: expires in 24 hours
						});
						var session = req.session;
						session.token = token;
						res.redirect('/?m=signup successful');
					});
				}
			}
		});
	}
	
}