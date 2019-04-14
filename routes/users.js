const express = require('express')

const router = express.Router()
const moment = require('moment')
const sequelized = require('sequelize')
const op = sequelized.Op
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const gm = require('gm')
const multer = require('multer')
const steps = require('../recipe_direction_parser')
const User = require('../DB_models/Users')
const Pantry = require('../DB_models/Pantry')
const cook_it = require('../cook_it/cook_it2')
const next_ing = require('../algorithm/find_next_ing')
const found_recipes = require('../algorithm/find_recipes')
const ingredients_in_a_recipe = require('../DB_models/ingredients_in_a_recipe')
const recipe_t = require('../DB_models/Recipes')
const ing_table = require('../DB_models/Ingredients')
const ing_in_pan_table = require('../DB_models/ingredients_in_pantry')
const logger = require('../functions/logger')
const algorithm = require('../algorithm/main')
const mail = require('../functions/mailer')
const fs = require('fs')
const str_generater = require('randomstring')

//defines where to store image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/../public/images/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})
// create an upload function using configuration above
const upload = multer({ storage: storage })

// Get request to localhost:3000/users/login
router.get('/login', function renderLoginPage(req, res) {
  // renders signin page with content 'Sign In"
  res.render('signin', {
    title: 'Log In'
  })
})

// Set up LocalStrategy of how users will be authenticated
// Accepts username and password form the signin.pug
passport.use(
  new LocalStrategy(async function login(username, password, done) {
    // First find if user exists
    const userData = await User.getUserByEmail(username)
    if (!userData) {
      // If user not found by email return Unknown User
      return done(null, false, { message: 'Unknown User' })
    }
    // Continue if user found
    /*
      COMPARE PASSWORD HASHES
      Grab 'password' from the form
      Apply hash defined in DB_models/Users.js to the password
      Compare hashed password 'userData.pass' from the database with entered password
      */
    User.comparePassword(password, userData.user_password, function compare(err, isMatch) {
      // if error throw error
      if (err) throw err
      // If hashes match
      if (isMatch) {
        return done(null, userData)
      }
      // If hashes dont match print invalid password
      return done(null, false, { message: 'Invalid Password' })
    })
  })
)

// serialized user instance
// Create cookies for sessions management
// This allows for using login credentials once for a single request and then keeping the user authenticated without making requests with same credentials
// Creates a cookie with user credentials
passport.serializeUser(function serialize(user, done) {
  // We can stuff more stuff into session here by declaring a new varialbe and passing it into done() intead of user.user_id
  done(null, user.user_id)
})

// Invalidates the cookie based on the userId
passport.deserializeUser(async function deserialize(id, done) {
  try {
    const userData = await User.getUserById(id)
    done(null, userData)
  } catch (err) {
    throw err
  }
})

// Does user authentication
// If success redirect to /users/dashboard
// If failure keep user at the login with proper message of what went wrong
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })
)

// Get request to localhost:3000/users/register
router.get('/register', function showRegistrationPage(req, res) {
  // renders signin page with content 'Registration"
  res.render('register', {
    title: 'Registration'
  })
})

// Get request to localhost:3000/users/register
router.get('/privacy', function showPrivacyPage(req, res) {
  // renders signin page with content 'Registration"
  res.render('privacy', {
    title: 'Privacy'
  })
})

// Get request to localhost:3000/users/register
router.get('/terms', function showPrivacyPage(req, res) {
  // renders signin page with content 'Registration"
  res.render('terms', {
    title: 'Terms'
  })
})

// Get request to localhost:3000/users/register
router.get('/support', function showPrivacyPage(req, res) {
  // renders signin page with content 'Registration"
  res.render('support', {
    title: 'Support'
  })
})


router.get('/adminPanel', async function showAdminPanelPage(req, res) {
  const currentUserId = req.session.passport['user']
  // Find which pantry user is from
  const pantryId = await User.findOne({
    attributes: ['pantry_id'],
    where: {
      user_id: currentUserId
    }
  }).then(function getPantryID(result) {
    return result.pantry_id
  })
  // Find all users in that pantry and not the current user
  const users = await User.findAll({
    where: {
      pantry_id: pantryId,
      user_id: {
        [op.ne]: currentUserId
      }
    }
  }).then(function returnResults(results) {
    return results
  })
  var pantry_data = await Pantry.findOne({
    attributes: ["pantry_name",'pantry_image_path'],
    where :{
      pantry_id: pantryId
    }
  })
  console.log(JSON.stringify(pantry_data))
  console.log("image path: "+pantry_data["pantry_image_path"])
  // render page with all found users that are related to the pantry
  res.render('admin_panel', {
    title: 'Admin Panel',
    userData: users,
    pantry_data: pantry_data

  })
})

// Get request to localhost:3000/users/login
// router.get('/dashboard',checkAuthentication,async function(req, res){
// Get request to localhost:3000/users/login
router.get('/dashboard', async function showDashboard(req, res) {
  const currentUserId = req.session.passport['user']
  //need pantry id
  const currentPantryID = await User.findOne({
    attributes: ['pantry_id', 'user_type'],
    where: {
      user_id: currentUserId
    }
  })
  //need window
  const window = await Pantry.findOne({
    attributes: ['expire_window','people_cooking_for'],
    where: {
      pantry_id: currentPantryID.pantry_id
    }
  })
  // console.log("pantry data for main:")
  // console.log("=====================")
  // console.log(JSON.stringify())
  //grabing data for the page
  var data = await algorithm.main2(window.expire_window, currentPantryID.pantry_id,window.people_cooking_for)
  console.log('DATA ON DASHBOARD ROUTE')
  console.log('=======================')
  console.log(JSON.stringify(data))
  console.log(typeof data);
  res.render('dashboard', {
    title: 'Dashboard',
    data: data,
    expirationTimeFrame: window.expire_window,
    storedData: JSON.stringify(data),
    people_cooking_for: window.people_cooking_for
  })
  //Send individual recipe steps inside the array
  // res.render('dashboard',{
  //     title:"Dashboard",
  //     results: results,
  //     i_total: i_total,
  //     i_measurement: i_measurement,
  //     i_name: i_name,
  //     i_expire: i_expire,
  //     //pulls recipe_name into recipe_name for referencing in dashboard
  //     recipe_name: recipe_name,
  //     recipe_steps: recipe_steps,
  //     rid: rid,
  //     recipe_image_path: recipe_info[0]['recipe_image_path'],
  //     //Send individual recipe steps inside the array
  //     chicken_stir_fry_image: chicken_stir_fry_image,
  //     pot_pie_image: chicken_pot_pie_image,
  //     expirationTimeFrame: pantryExpirationTimeFrame.expire_window
  //     //cook_it: cookit
  // });
})

// catch(err){
//   console.log("routes/users/dashboard err: " + err);
// }
// })

// router.get('/cook/:id', checkAuthentication, async function(req, res) {
router.get('/cook/:id', async function(req, res) {
  const recipe = req.params.id
  console.log(
    '\n==================\ncook it route to with ' + recipe + ' id\n========================\n'
  )
    var currentPantryID = await User.findOne({
      attributes: ['pantry_id'],
      where: {
        user_id : req.session.passport["user"]
      }
    })
    var people = await Pantry.findOne({
      attributes: ['people_cooking_for']
    })
    console.log("data being sent into algor:")
    console.log("===========================")
    console.log("recipe: " + recipe)
    console.log("currentPantryID.pantry_id: " + currentPantryID.pantry_id)
    console.log("people.people_cooking_for:" + people.people_cooking_for)
  var info = await cook_it.cook_it2(recipe,currentPantryID.pantry_id, people.people_cooking_for)


  console.log('REFRESH!')
  res.redirect(req.get('referer'))
})

// This will register a new user and add their credentials to the database
router.post('/register', async function registerUser(req, res) {
  // renders signin page with content 'Registration"
  // Checks that email field is not empty
  req.checkBody('email', 'Username field is required').notEmpty()
  // Checks that email field has proper email format
  req.checkBody('email', 'Invalid email format').isEmail()
  // Checks password field is not empty
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password', 'Password must be longer than 4 characters').isLength({ min: 4 })
  req.checkBody('password', "Passwords don't match").matches(req.body.confirm_password)
  // Checks confirm password is not empty
  req.checkBody('confirm_password', 'Confirm password field required').notEmpty()

  // Get all errors is any based on above validators
  const errors = req.validationErrors()
  
  var user_exists = await User.findAll({
    where: {
      user_email: req.body.email
    }
  })

  if(user_exists.length > 0)
  {
    req.flash("error", "Email " + req.body.email + " already exists!")
    res.redirect("/users/register")
  }
  else{
    // if errors exist
    if (errors) {
      // render register page and pass in errors defined above, which will be rendered as well
      res.render('register', {
        title: 'Registration',
        errors: errors
      })
    }

    // ENCRYPTED AUTHENTICATION
    // Creates a user and hashes their password into database
    else {
      // Get user's email
      const email = req.body.email
      // Get user's password
      const password = req.body.password
      // Create new pantry entry in the table, so the new pantry ID can be assigned to the new user
      db.query('INSERT INTO pantry (pantry_name) VALUES ("");', function getResults(err, results) {
        if (err) throw err
        const recipe_id_inserted = results.insertId
        const newUser = new User({
          user_type: 'Administrator',
          username: 'admin',
          user_email: email,
          user_password: password,
          pantry_id: recipe_id_inserted
        })
        mail.signup(email)
        // Call create function from DB_models/Users.js
        User.createUser(newUser, function createNewUser() {
          // Upon sucessful creating take user to the dashboard
          res.redirect('/users/login')
        })
      })
    }
  }
})

router.get('/logout', function logout(req, res) {
  req.logOut()
  req.flash('success', 'You are logged out')
  res.locals.user = null
  res.redirect('/users/login')
})


router.post('/saveCommunityRecipe', async function(req, res) {
  //get the panrty id of the logged in user
  userPantryId =req.user.pantry_id
  //get recipe id that user is trying to copy into their pantry
  var recipe_id_to_be_copied = req.body['community_recipe_id']
  console.log(recipe_id_to_be_copied)
  try{

  
  //grab data we need
  var recipe_data = await recipe_t.findOne({
    where :{
      recipe_id: recipe_id_to_be_copied
    }
  })
  var ingredin_needed_data = await ingredients_in_a_recipe.findAll({
    where: {
      recipe_id: recipe_id_to_be_copied
    }
  })
  
  console.log("the recipe data to copy")
  console.log("=======================")
  console.log(JSON.stringify(recipe_data));
  console.log(JSON.stringify(ingredin_needed_data))
  var new_recipe_id
  // var query =`INSERT INTO recipes (recipe_name,recipe_image_path,recipe_directions,pantry_id,num_people_it_feeds) VALUES ("${recipe_data.recipe_name}","${recipe_data.recipe_image_path}", "${recipe_data.recipe_directions}",${userPantryId},${recipe_data.num_people_it_feeds})`
  // console.log(query)
  var recipe_id = await recipe_t.create({
    recipe_name: recipe_data.recipe_name,
    recipe_image_path: recipe_data.recipe_image_path,
    recipe_directions: recipe_data.recipe_directions,
    pantry_id: userPantryId,
    num_people_it_feeds: recipe_data.num_people_it_feeds
  })

  new_recipe_id = recipe_id['null']
  // new_recipe_id = await db.query(query)
  console.log("new recipe")
  console.log("==========")
  
  for(var i = 0;i<ingredin_needed_data.length;i++){
    await ingredients_in_a_recipe.create({
      recipe_id : new_recipe_id,
      pantry_id: userPantryId,
      ingredient_id: ingredin_needed_data[i].ingredient_id,
      amount_of_ingredient_needed: ingredin_needed_data[i].amount_of_ingredient_needed,
      ingredient_unit_of_measurement: ingredin_needed_data[i].ingredient_unit_of_measurement
    })
  };

        res.send('Success')
  
  }
  catch(e)
  {
    console.log(e)
  }
})

// Add new user from admin panel
router.post('/add', async function addNewUser(req, res) {
  const userName = req.body.userName
  const confirmUserName = req.body.confirmUserName
  if(confirmUserName != userName)
  {
    req.flash("error","Emails do not match!")
    res.redirect('/users/adminPanel')
  }
  else{
    var does_user_exitst = await User.findAll({
      where: {
        user_email: userName
      }
    })
    if(does_user_exitst.length > 0){
      req.flash("error","User has an account already!")
    res.redirect('/users/adminPanel')
    }
        else{
      let userType = req.body.userType
      switch (userType) {
        case 'volunteer':
          userType = 'Volunteer'
          break
        case 'administrator':
          userType = 'Administrator'
          break
        default:
          userType = 'N/A'
      }
      var userPassword = await str_generater.generate({
        length: 8,
        charset: "alphanumeric"
      })
      console.log("new pass")
      console.log("========")
      console.log(userPassword)
      //send out the email
      
      //salt the password please
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(userPassword, salt)
      const currentUserId = req.session.passport['user']
      // Find which pantry user is from
      const query = `SELECT (pantry_id) FROM users WHERE user_id=${currentUserId};`
      db.query(query, function getPantryID(err, results) {
        if (err) throw err
        const currentPantryID = results[0].pantry_id
        mail.add_user(userName,userPassword)
        // Instantiate new user model defined in DB_models/Users.js
        const newUser = new User({
          user_email: userName,
          username: userName,
          user_password: userPassword,
          user_type: userType,
          // TODO figure out how to assign pantry IDs
          pantry_id: currentPantryID
        })

        // Call create function from DB_models/Users.js
        User.createUser(newUser, function create() {
          req.flash('success', 'User added!')
          res.redirect('/users/adminPanel')
        })
      })
    }
  }
})

// Delete user from admin panel
router.delete('/delete/:id', async function deleteUser(req, res) {
  const userID = req.params.id
  const query = `DELETE FROM users WHERE user_id=${userID};`
  await db.query(query)
  req.flash('success', 'User deleted!')
  res.send('success')
})

// Change user privilege from admin panel
router.post('/changePrivilege/:id', function changePrivillege(req, res) {
  let userType = req.body.userType
  // Change Volunteer or Administrator to N/NP for database insert
  switch (userType) {
    case 'volunteer':
      userType = 'Volunteer'
      break
    case 'administrator':
      userType = 'Administrator'
      break
  }
  // Get user id
  const userId = req.params.id
  // create database query
  const query = `UPDATE users SET user_type='${userType}' WHERE user_id=${userId};`
  db.query(query, function showResults(err) {
    if (err) throw err
    // Show message to user
    req.flash('success', 'Privilege change successful!')
    res.redirect('/users/adminPanel')
  })
})

// Reset users password and set a new password
router.post('/resetPassword/:id', async function resetPassword(req, res) {
  const userId = req.params.id
  const userPassword = req.body.password

  var email_address = await User.findOne({
    attributes: ['user_email'],
    where: {
      user_id: userId
    }
  })
  // generate salt
  const salt = bcrypt.genSaltSync(10)
  // generate hash using the passed in password
  const hash = bcrypt.hashSync(userPassword, salt)

  // update password in database
  const query = `UPDATE users SET user_password='${hash}' WHERE user_id=${userId};`
  db.query(query)
  // console.log("emailing " + email_address.user_email + " new password " + userPassword);
  mail.password_reset(email_address.user_email, userPassword)
  // Show message to user
  req.flash('success', 'Password reset successful!')
  res.redirect('/users/adminPanel')
})

router.get('/settings', function showSettings(req, res) {
  const currentUserId = req.session.passport['user']
  const query = `SELECT * FROM users WHERE user_id=${currentUserId};`
  db.query(query, function getUser(err, results) {
    if (err) throw err
    res.render('user_profile', {
      title: 'Your Settings',
      data: results[0]
    })
  })
})

router.post('/changeUsername', async function changeUsername(req, res) {
  // get currently logged in user
  const currentUserId = req.session.passport['user']
  // get passed in username
  const newUsername = req.body.newUsername
  //check if there is anything in the textbox
  if(newUsername.length > 0)
  {
    //check to make sure the email is not in the db already
    var is_email_taken = await User.findAll({
      where:{
        user_email: newUsername
      }
    })
    // create sql query\
    if (is_email_taken == 0)
    {
      const query = `UPDATE users SET user_email='${newUsername}' WHERE user_id=${currentUserId}`
      db.query(query, function updateUser(err) {
        if (err) throw err
        req.flash('success', 'Username Changed!')
        res.redirect('/users/settings')
      })
    }
    else{
      req.flash('error','Email is Taken!')
      res.redirect("/users/settings")
    }
  }
  else{
    req.flash('error','Please enter a new Username')
    res.redirect("/users/settings")
  }
})

router.post('/changePassword', async function changePassword(req, res) {
  // get currently logged in user
  const currentUserId = req.session.passport['user']
  // get passed in current password
  const currentPassword = req.body.currentPassword
  // TODO check current password. Make sure that the user is the TRUE user
  // get passed in new password
  const newPassword = req.body.newPassword
  // get passed in new password confirm
  const confirmNewPassword = req.body.confirmNewPassword
  req.checkBody('newPassword', "Passwords don't match").matches(confirmNewPassword)
  // Get all errors is any based on above validators
  const errors = req.validationErrors()

  // if errors exist
  if (errors) {
    const query = `SELECT * FROM users WHERE user_id=${currentUserId};`
    db.query(query, function getUser(err, results) {
      if (err) throw err
      // render register page and pass in errors defined above, which will be rendered as well
      res.render('user_profile', {
        title: 'Your Settings',
        data: results[0],
        errors: errors
      })
    })
  } else {
    //get the email
    var email = await User.findOne({
      attributes: ['user_email'],
      where: {
        user_id: currentUserId
      }
    })
    // generate salt
    const salt = bcrypt.genSaltSync(10)
    // generate hash using the passed in password
    const hash = bcrypt.hashSync(newPassword, salt)
    const query = `UPDATE users SET user_password='${hash}' WHERE user_id=${currentUserId};`
    db.query(query, function updatePassword(err) {
      if (err) throw err
      mail.password_change(email.user_email)
      req.flash('success', 'Password Changed!')
      res.redirect('/users/settings')
    })
  }
})

router.post('/addImg', upload.single('image'), async function addImg(req, res) {
  if (req.file) {
    var imagePath = req.file.filename
    console.log('File Uploaded Successfully')
    gm(req.file.path) // uses graphicsmagic and takes in image path
      .resize(1024, 576, '!') // Sets custom weidth and height, and ! makes it ignore aspect ratio, thus changing it. Then overwrites the origional file.
      .write(req.file.path, err => {
        if (err) {
          console.log(err)
        }
      })
    fs.rename(req.file.path, './public/images/PantryImage9001.jpg', function(err) {
      if (err) throw err
      console.log('File Renamed.')
    })
  } else {
    var imagePath = 'placeholder.jpg'
    console.log('File Upload Failed')
  }

  res.redirect('/users/adminPanel')
})

router.get('/forgotpass', function(req, res) {
  res.render('password_reset', {
    title: 'Reset Password'
  })
})
router.post('/forgotpass', async function(req, res) {
  //pull email from the page
  const email = req.body.email
  //check to see if email in db
  console.log('email:')
  console.log('======')
  console.log(email)
  var db_data = await User.findOne({
    where: {
      user_email: email
    }
  })
  console.log('user data')
  console.log('=========')
  console.log(JSON.stringify(db_data))
  if (db != null) {
    //help by okasers you are my only hope
    //randomly generate a new password
    var new_pass = await str_generater.generate({
      length: 8,
      charset: 'alphanumeric'
    })
    console.log('new pass')
    console.log('========')
    console.log(new_pass)
    //send out the email

    //salt the password please
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(new_pass, salt)
    const query = `Update users set user_password='${hash}' where user_id=${db_data.user_id};`
    console.log('the query')
    console.log('=========')
    console.log(query)
    db.query(query, function(err) {
      if (err) throw err
      mail.password_reset(email, new_pass)
      req.flash('success', 'Password Reset!')
      res.redirect('/users/login')
    })
  } else {
    req.flash('error', 'Email Unknown')
    res.redirect('user/forgotpass')
  }
})

// Function to call from any route to check if user is authenticated
// This needs to be used for verification of user privilleges
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'You are not logged in')
  res.redirect('/users/login')
}

module.exports = router
