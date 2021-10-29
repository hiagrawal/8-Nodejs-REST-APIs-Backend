const {validationResult} = require('express-validator');

const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signUp = (req,res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    //with a salt of 12 so a strength of 12
    bcrypt.hash(password, 12).then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: name
        })
        return user.save();
    })
    .then(result => {
        res.status(201).json({message: 'User Created!', userId: result._id});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email}).then(userDoc => {
        if(!userDoc){
            const error = new Error('Email Not found');
            error.statusCode = 401; //401 refers to authentication error
            throw error;
        }
        loadedUser = userDoc;
        return bcrypt.compare(password, userDoc.password)
    })
    .then(isEqual => {
        if(!isEqual){
            const error = new Error('Password is not correct');
            error.statusCode = 401; //401 refers to authentication error
            throw error;
        }
    
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}