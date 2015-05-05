var User = require('../models/user.js');
var Post = require('../models/post.js');
var jwt = require('jsonwebtoken');
var config = require('../config/config.js');
var loginController = require('../controllers/login.js');

module.exports = {

	fetchAllPosts: function(){
		var promise = new Promise(function(resolve, reject){
				Post.find({approved: 0}).lean().exec(function(err, posts){
					//console.log(JSON.stringify(posts));
						resolve(posts);
						if(err) reject();
					
				});
		});
		return promise;
		
	},
	fetchPostById:function(id){
		var promise = new Promise(function(resolve, reject){
				Post.findOne({_id: id}, function(err, post){
					//console.log(JSON.stringify(posts));
						resolve(post);
						if(err) reject();
					
				});
		});
		return promise;
	},
	insertPost: function(req, res){

		Post.findOne({title: req.body.title}, function(err, post){
			if(err){
				res.redirect('/posts?m=error occured');
			}else{
				if(post){
					res.redirect('/posts/add?m=post already exists');
				}else{
					var post = new Post();
					post.title = req.body.title;
					post.postbody = req.body.postbody;
					var loggedInUser = loginController.getLoggedInUserObject(req, res);
					post.username = loggedInUser.username;
					if(loggedInUser.admin){
						post.approved = 1;
					}
					post.save(function(){
						res.redirect('/posts?m=post added successfully')
					});
					
				}
			}
		})
		
	}
}