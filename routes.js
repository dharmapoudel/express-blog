var jwt = require('jsonwebtoken');
var config = require('./config/config.js');
//controllers
var signupController = require('./controllers/signup.js');
var loginController = require('./controllers/login.js');
var postController = require('./controllers/post.js');

module.exports = function(router){
	router
	.use(function(req, res, next){
		res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

	    res.locals.token = req.session.token;

	    next();
	})
	.get('/', function(req, res){
		res.render('pages/index', {title: 'Welcome to express blog!', tagline: 'Home' });
	})
	.get('/about', function(req, res){
		res.render('pages/about', {title: 'About our express blog', tagline: 'About'});
	})
	.get('/posts', function(req, res){

					var blogPosts = postController.fetchAllPosts();
					blogPosts.then(function(blogPosts){
						// console.log(blogPosts);
						res.render('pages/listPost.ejs', {blogPosts: blogPosts, title: 'All Posts', tagline: 'All Posts'});
					});
	})
	.post('/posts', function(req, res){
		postController.insertPost(req,res);
	})
	.get('/posts/add', function(req, res){
		if(loginController.ensureLoggedIn(req, res))
			res.render('pages/addPost.ejs', {title: 'Add new blog post', tagline: 'Add Post'});
		res.redirect('/login');
	})
	.get('/posts/:id', function(req, res){
		var blogPost = postController.fetchPostById(req.params.id);
		blogPost.then(function(myPost){
				console.log(myPost);
				res.render('pages/singlePost.ejs', {myPost: myPost, title: myPost.title});
			});
	})
	.get('/users', function(req, res){
		User.find(function(err, users){
			if(err)
				res.send(err);

			res.json(users);
		});
	})
	.get('/login', function(req, res){
		if(!loginController.ensureLoggedIn(req, res))
			res.render('pages/login.ejs', {title: 'Login to our blog', tagline: 'Login'});
		res.redirect('/');
	})
	.post('/login', function(req, res){
		loginController.authenticateUser(req, res);
	})
	.get('/signup', function(req, res){
		if(!loginController.ensureLoggedIn(req, res))
			res.render('pages/signup.ejs', {title: 'Become a member', tagline: 'Signup'});
		res.redirect('/');
	})
	.post('/signup', function(req, res){
		signupController.insertUser(req, res);

	})
	.get('/logout', function(req, res){
		loginController.logout(req, res);
		res.render('pages/login.ejs', {title: 'Login to our blog', tagline: 'Login'});
	});

}