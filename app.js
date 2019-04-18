// Define variables for dependencies
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const expressSession = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

// Initialize the application
const app = express()

// Initialize the application
// Define your credentials for your local sql server
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'digital_pantry',
  multipleStatements: true
})

// const Sequelize = require('sequelize')
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
// })

// //Test DB
// db.authenticate()
//     .then(() => console.log('Database connected...'))
//     .catch(err => console.log('Error: ' + err))

// connect to database
db.connect(err => {
  if (err) {
    throw err
  }
  console.log('Connected to database')
})
// This db variable can be accessed from anywhere
global.db = db

// Loads the view engine and defines view folder
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Define middleware
// define static folder 'public' for static files to serve
app.use(express.static(path.join(__dirname, 'public')))

// Allows to get params from post requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// This should be declared after body parser
app.use(expressValidator())

// Allows for parsing cookies
app.use(cookieParser())

// Sessiong management with cookies
// Parsing/validation
// saveUnitialized: false - session cookie will not be stored unless physically modified
// saveUnitialized: true - forces session cookie to be stored in any case
// Secret - used to set sessionID cookie
// Resave - forces the session to be saved back to the session store, even if the session was never modified during the request.
app.use(expressSession({ secret: 'pantry', saveUninitialized: true, resave: false }))

// Initialize passport authetication module
app.use(passport.initialize())
app.use(passport.session())

// connect-flash is used for displaying quick messages, like the ones you get when you enter wrong password or and empty field
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(flash())

// Define Global Vars
app.use(function (req, res, next) {
  // If user is not authenticated this variable will be null
  // Used to determine the state the user is in
  res.locals.user = req.user || null
  next()
})

// Get request to localhost:3000
app.get('/', function (req, res) {
  // renders signin.pug with content "Sign In"
  console.log(req.session)
  res.render('signin', {
    title: 'Sign In'
  })
})



app.get('/test', function (req, res) {
  res.render('user_view_template')
})

// Route files
// anything that has to do with user data route it through /users
const users = require('./routes/users')
app.use('/users', users)

const pantry = require('./routes/pantry')
app.use('/pantry', pantry)

// anything that has to do with recipe data route it through /recipe
const recipes = require('./routes/recipes')
app.use('/recipes', recipes)

// v1 of algorithm no sequelize
const test = require('./routes/test')
app.use('/test', test)

const ingredient = require('./routes/ingredients')
app.use('/ingredients', ingredient)

// Start listening on localhost or 127.0.0.1 on port 3000
app.listen(3000, function () {
  console.log('Server started on port 3000')
})
