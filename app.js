//Define variables for dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


//Initialize the application
const app = express();

//TODO setup database connections somewhere here

//Loads the view engine and defines view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Define muiddleware
//define static folder 'public' for static files to serve
app.use(express.static(path.join(__dirname,'public')));

//Allows to get params from post requests 
app.use(bodyParser.urlencoded({extended: false}));


//Get request to localhost:3000
app.get('/', function(req, res){
    //renders index.pug with content "This is home page"
    res.render('index',{
        title:'This is home page'
    });
});

//Route files
const users = require('./routes/users');
app.use('/users', users);

//Start listening on localhost/127.0.0.1 on port 3000
app.listen(3000, function(){
    console.log('Server started on port 3000');
});