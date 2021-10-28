const {validationResult} = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: 'First Post', 
            content: 'This is the first post.', 
            imageUrl: 'images/womens.png', 
            creator: {
                name: 'Hina Agrawal'
            },
            createdAt: new Date()

        }]
    });
};

//status 200 is just success, status 201 indicates that we created/added something which is more significant
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // res.status(422).json({
        //     message: 'Validation Failed. Entered data is not correct.',
        //     errors: errors.array()
        // })

        const error = new Error('Validation Failed. Entered data is not correct.'); //this msg will automatically be set in error 'message' field
        error.statusCode = 422; //storing status in any paramter lets say statusCode
        throw error;

    }
    const title = req.body.title;
    const content = req.body.content;
    //create post in db
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/womens.png',
        creator: {name: 'Hina Agrawal'}
    });
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); //throwing an error from here to go the common error handler in app js
    })
    
};