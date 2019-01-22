//Define variables for dependencies
const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

//Initialize the application
//Define your credentials for your local sql server
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'good_database'
});

// const Sequelize = require('sequelize');
// const db = new Sequelize('local', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
//     operatorsAliases: false,
    
//     pool:{
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// });

// //Test DB
// db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log('Error: ' + err))


//Initialize the application
const app = express();

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
//This db variable can be accessed from anywhere
global.db = db;

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

//Route files
//anything that has to do with user data route it through /users
const users = require('./routes/users');
app.use('/users', users);

//anything that has to do with recipe data route it through /recipe
const recipes = require('./routes/recipes');
app.use('/recipes', recipes);

const ingredient = require('./routes/ingredients');
app.use('/ingredients', ingredient);

//Start listening on localhost/127.0.0.1 on port 3000
app.listen(3000, function(){
    console.log('Server started on port 3000');
});