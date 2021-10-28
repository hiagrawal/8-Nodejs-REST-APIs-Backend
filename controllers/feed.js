const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find().then(posts => {
        if(!posts){
            const error = new Error('No Post Found'); //this msg will automatically be set in error 'message' field
            error.statusCode = 404; //storing status in any paramter lets say statusCode
            throw error; //we are throwing here irrespective of inside async call coz this will throw and go to catch where we are doing next to this will work as we want
        }
        res.status(200).json({message: 'Fetched Posts successfully!', posts: posts});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); //throwing an error from here to go the common error handler in app js
    })
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
    if(!req.file){
        const error = new Error('No Image provided'); 
        error.statusCode = 422; 
        throw error;
    }
    console.log(req.file);
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\","/");
    //create post in db
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if(!post){
            const error = new Error('Post not found.'); //this msg will automatically be set in error 'message' field
            error.statusCode = 404; //storing status in any paramter lets say statusCode
            throw error; //we are throwing here irrespective of inside async call coz this will throw and go to catch where we are doing next to this will work as we want
        }
        res.status(200).json({message: 'Post Fetched', post: post});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); //throwing an error from here to go the common error handler in app js
    })
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed. Entered data is not correct.'); //this msg will automatically be set in error 'message' field
        error.statusCode = 422; //storing status in any paramter lets say statusCode
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path.replace("\\","/");
    }
    if(!imageUrl){
        const error = new Error('Image not picked'); 
        error.statusCode = 422; 
        throw error;
    }
    Post.findById(postId).then(post => {
        if(!post){
            const error = new Error('Post not found.'); 
            error.statusCode = 404;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    })
    .then(result => {
        res.status(200).json({message: 'Post Updated', post: result});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); //throwing an error from here to go the common error handler in app js
    })
}

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => {
        console.log(err);
    });
}