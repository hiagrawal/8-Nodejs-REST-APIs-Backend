const {validationResult} = require('express-validator/check');

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
        res.status(422).json({
            message: 'Validation Failed. Entered data is not correct.',
            errors: errors.array()
        })
    }
    const title = req.body.title;
    const content = req.body.content;
    //create post in db
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(), 
            title: title, 
            content: content, 
            creator: {
                name: 'Hina Agrawal'
            },
            createdAt: new Date()}
    });
};