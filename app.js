const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

//app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>
app.use(bodyParser.json()); //application/json
app.use('/images', express.static(path.join(__dirname, 'images'))); //when it get path '/images', then go to images folder

//this is required so that request from other domain can access our server, methods and they dont get CORS error
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //allow access from all domains //can mention specific domain also
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); //can specify all or whatever methods we want request from other domain to access
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    //this is headers client side code (frontend) might set on their requests like we set for 'application/json'. 
    //If this allow headers for content type was not added here, our request would have failed and would CORS error
    next();
})

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const message = error.message;
    const status = error.statusCode || 500;
    res.status(status).json({message: message});
})

mongoose.connect('mongodb+srv://MongoDbUser:MongoDbUser@cluster0.kij6e.mongodb.net/RESTAPI?retryWrites=true&w=majority')
.then(result => {
    app.listen(8080);
})
.catch(err => {
    console.log(err);
})

