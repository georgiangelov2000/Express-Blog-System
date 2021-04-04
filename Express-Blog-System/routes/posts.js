const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images' })
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
	const categories = db.get('categories');

	categories.find({},{},function(err, categories){
		res.render('addpost',{
  			'title': 'Add Post',
  			'categories': categories
  		});
	});
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
  // Get Form Values
  const title = req.body.title;
  const category= req.body.category;
  const body = req.body.body;
  const author = req.body.author;
  const date = new Date();

  	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	const errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors
		});
	} else {
		const posts = db.get('posts');
		posts.insert({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainimage
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Post Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;