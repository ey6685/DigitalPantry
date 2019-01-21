//Define variables for dependencies
const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');

// //Need to move to connect route
// mongoose.connect('mongodb://localhost/local');
// let db = mongoose.connection;

// //Need to move to connect route
// //Check connection
// db.once('open', function(){
//     console.log('Connected to MongoDB');
// });

// //Need to move to connect route
// //Check for MongoDB errors
// db.on('error', function(err){
//     console.log(err);
// });

//Initialize the application

const Sequelize = require('sequelize');
const db = new Sequelize('local', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

//created /config/database.js for connection module
//const db = require('./config/database');

//Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

const app = express();


//Bring in Models
//let Ingredient = require('./models/ingredient');

//TODO setup database connections somewhere here

//Loads the view engine and defines view folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Define middleware
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

//added Route for ingredient
//app.use('/ingredients', require('./routes/ingredients'));

//create connection on PORT 3000 for mysql
//const PORT = process.env.PORT || 3000;

//start listening on PORT 3000
//app.listen(PORT, console.log(`Server started on port ${PORT}`));

//Ingredient Add Route
app.get('/ingredients/add', function(req,res){
    res.render('add_ingredient',{
        title:'Add Ingredient'
    });
});

//Add Submit POST Route
app.post('/ingredients/add', function(req,res){
    let ingredient = new ingredient();
    console.log("testing" + req.body.name);

    ingredient.name = req.body.name;
    ingredient.measurement = req.body.measurement;
    ingredient.servingsize = req.body.servingsize;
    ingredient.expiration = req.body.expiration;

    ingredient.save(function(err){
        if(err){
            console.log(err);
            return;
        } else{
            res.redirect('/');
        }
    });
});

//Route files
const users = require('./routes/users');
app.use('/users', users);

//Start listening on localhost/127.0.0.1 on port 3000
app.listen(3000, function(){
    console.log('Server started on port 3000');
});