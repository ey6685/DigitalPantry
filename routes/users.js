const express = require('express');
const router = express.Router();
const moment = require('moment');

const steps = require('../recipe_direction_parser');
const User = require('../DB_models/Users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cook_it = require('../cook_it/cook_it2');
const next_ing = require('../algorithm/find_next_ing');
const found_recipes = require('../algorithm/find_recipes');
const recipe_t = require('../DB_models/Recipes');
const op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const ing_table  = require('../DB_models/Ingredients');
const ing_in_pan_table = require("../DB_models/ingredients_in_pantry");

// Get request to localhost:3000/users/login
router.get('/login', function(req, res) {
  // renders signin page with content 'Sign In"
  res.render('signin', {
    title: 'Log In'
  });
});

// Set up LocalStrategy of how users will be authenticated
// Accepts username and password form the signin.pug
passport.use(
  new LocalStrategy(async function(username, password, done) {
    // First find if user exists
    let userData = await User.getUserByEmail(username);
    if (!userData) {
      // If user not found by email return Unknown User
      return done(null, false, { message: 'Unknown User' });
    } else {
      // If user found

      /*
				COMPARE PASSWORD HASHES
				Grab 'password' from the form
				Apply hash defined in DB_models/Users.js to the password
				Compare hashed password 'userData.pass' from the database with entered password
				*/
      User.comparePassword(password, userData.pass, function(err, isMatch) {
        // if error throw error
        if (err) throw err;
        // If hashes match
        if (isMatch) {
          return done(null, userData);
        }
        // If hashes dont match print invalid password
        else {
          return done(null, false, { message: 'Invalid Password' });
        }
      });
    }
  })
);

// serialized user instance
// Create cookies for sessions management
// This allows for using login credentials once for a single request and then keeping the user authenticated without making requests with same credentials
// Creates a cookie with user credentials
passport.serializeUser(function(user, done) {
  // We can stuff more stuff into session here by declaring a new varialbe and passing it into done() intead of user.user_id
  done(null, user.user_id);
});

// Invalidates the cookie based on the userId
passport.deserializeUser(async function(id, done) {
  try {
    let userData = await User.getUserById(id);
    done(null, userData);
  } catch (err) {
    throw err;
  }
});

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
);

// Get request to localhost:3000/users/register
router.get('/register', function(req, res) {
  // renders signin page with content 'Registration"
  console.log(req.session);
  res.render('register', {
    title: 'Registration'
  });
});

router.get('/adminPanel', async function(req, res) {
  var current_user_id = req.session.passport['user'];
  //Find which pantry user is from
  pantry_id="(SELECT (pantry_id) FROM users WHERE user_id="+current_user_id+")";
  //Find all users in that pantry and not the current user
  query="SELECT * FROM users WHERE pantry_id="+pantry_id+" AND user_id!="+current_user_id+";";
  db.query(query, function(err, results){
    if (err) throw err;
    res.render('admin_panel', {
      title: 'Admin Panel',
      userData: results
    });
  });
});

//Get request to localhost:3000/users/login
router.get('/dashboard',checkAuthentication,async function(req, res){
  // router.get('/dashboard',async function(req, res){
    //Jon//pulls algorithm results from directAlgorithm into recipe_results
    //Jon//then parses recipe id into var recipe_id
    try
    {

      var results = await next_ing.next_exp_ingredient();                                   //returns an int for the ingredient id of the next expiring ingredient
      console.log(JSON.stringify("\nresults of finding next ingredient: " + results));        //send the info to the console for debuging
      var results2 = await found_recipes.find_recipes(results);
      var recipe_id = results2[0];
      console.log("\nrecipe: ids: \n" + results2);
      // var recipe_results = await recipe_t.findOne({where:{recipe_id: recipe_id}});
      // console.log(JSON.stringify(recipe_results));
      //Jon//pulls recipes steps from recipe_direction_parser by the recipe_id
      //Oskars//then splits string by the delimeter so we can get all the individual steps
      var recipe_steps = await steps.recipe_direction_parser(recipe_id);
      var recipe_steps_array = recipe_steps.split('${<br>}');
      var recipe_info = await recipe_t.findAll({
        where: {recipe_id: {[op.in]: results2}}
      })

    // Grab relative image path for 2nd and 3rd recipe cards
    var chicken_stir_fry_image = '/images/chicken_stir_fry.jpg';
    var chicken_pot_pie_image = '/images/chicken_pot_pie.jpg';
    // Jon//renders dashboard page with next expiring ingredient
    // results = await.
    // db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null ORDER BY ingredient_expiration_date LIMIT 1', function(err, results)
    // {
    //   if (err) throw err
    // results= results,

      //Grab relative image path for 2nd and 3rd recipe cards
      var chicken_stir_fry_image = '/images/chicken.jpg';
      var chicken_pot_pie_image = '/images/chicken_pot_pie.jpg';
      //Jon//renders dashboard page with next expiring ingredient
      // results = await.
      // db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null ORDER BY ingredient_expiration_date LIMIT 1', function(err, results)
      // {
      //   if (err) throw err
        // results= results,
        var ingredient_results = await ing_table.findOne({
          where:{
            ingredient_id: results
          }
        });
        console.log(JSON.stringify(ingredient_results));
        var additional_ingredient_results = await ing_in_pan_table.findAll({
          where:{
            ingredient_id: results
          },
          order: ['ingredient_expiration_date']

        });
        i_total= additional_ingredient_results[0]['ingredient_amount'],
        i_measurement= additional_ingredient_results[0]['ingredient_unit_of_measurement'],
        i_name= ingredient_results['ingredient_name'],
        i_expire= moment(additional_ingredient_results[0]['ingredient_expiration_date']).format('LL'),
        
        //pulls recipe_name into recipe_name for referencing in dashboard
        
        recipe_name= recipe_info[0]['recipe_name'],
        recipe_steps= recipe_steps_array,
        rid= recipe_id,
      
        //Send individual recipe steps inside the array

        // db.query("SELECT recipe_image_path FROM recipes WHERE recipe_id = '"+recipe_id+"'", function (err, results2){
        //     if (err) throw err
        //     console.log(results2);
        //     console.log(results2.recipe_image_path);
            res.render('dashboard',{
                title:"Dashboard",
                results: results,
                i_total: i_total,
                i_measurement: i_measurement,
                i_name: i_name,
                i_expire: i_expire,
                //pulls recipe_name into recipe_name for referencing in dashboard
                recipe_name: recipe_name,
                recipe_steps: recipe_steps,
                rid: rid,
                recipe_image_path: recipe_info[0]['recipe_image_path'],
                //Send individual recipe steps inside the array
                chicken_stir_fry_image: chicken_stir_fry_image,
                pot_pie_image: chicken_pot_pie_image,
                //cook_it: cookit
            });

      // db.query("SELECT recipe_image_path FROM recipes WHERE recipe_id = '"+recipe_id+"'", function (err, results2){
      //     if (err) throw err
      //     console.log(results2);
      //     console.log(results2.recipe_image_path);
      res.render('dashboard', {
        title: 'Dashboard',
        results: results,
        i_total: i_total,
        i_measurement: i_measurement,
        i_name: i_name,
        i_expire: i_expire,
        // pulls recipe_name into recipe_name for referencing in dashboard
        recipe_name: recipe_name,
        recipe_steps: recipe_steps,
        rid: rid,
        recipe_image_path: recipe_info[0]['recipe_image_path'],
        // Send individual recipe steps inside the array
        stir_fry_image: chicken_stir_fry_image,
        pot_pie_image: chicken_pot_pie_image
        // cook_it: cookit
      });
  } catch (err) {
    console.log('routes/users/dashboard err: ' + err);
  }
});

router.get('/cook/:id', checkAuthentication, async function(req, res) {
  const recipe = req.params.id;
  ////////////////////////////////////
  // how do we get panty_id and scale?//
  // the function will work but wont //
  // scale higher than one and wont //
  // report the metrics with out it//
  //////////////////////////////////
  /////////<<TO DO>>////////////////
  ///////////////////////////////////
  var info = await cook_it.cook_it2(recipe);
  console.log('REFRESH!');
  res.redirect(req.get('referer'));
});

// This will register a new user and add their credentials to the database
router.post('/register', function(req, res) {
  // renders signin page with content 'Registration"
  // Checks that email field is not empty
  req.checkBody('email', 'Username field is required').notEmpty();
  // Checks that email field has proper email format
  req.checkBody('email', 'Invalid email format').isEmail();
  // Checks password field is not empty
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password', 'Password must be longer than 4 characters').isLength({ min: 4 });
  req.checkBody('password', "Passwords don't match").matches(req.body.confirm_password);
  // Checks confirm password is not empty
  req.checkBody('confirm_password', 'Confirm password field required').notEmpty();

  // Get all errors is any based on above validators
  let errors = req.validationErrors();

  // if errors exist
  if (errors) {
    // render register page and pass in errors defined above, which will be rendered as well
    res.render('register', {
      title: 'Registration',
      errors: errors
    });
  }

  // ENCRYPTED AUTHENTICATION
  // Creates a user and hashes their password into database
  else {
    // Get user's email
    const email = req.body.email;
    // Get user's password
    const password = req.body.password;
    // Instantiate new user model defined in DB_models/Users.js
    var newUser = new User({
      email: email,
      pass: password,
      //TODO still need to figure out stuff with how to assign pantry IDs???
      userType: 'admin'
    });

    // Call create function from DB_models/Users.js
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
    });

    // Upon sucessful creating take user to the dashboard
    res.redirect('/users/dashboard');
  }
});

router.get('/logout', function(req, res) {
  req.logOut();
  req.flash('success', 'You are logged out');
  res.locals.user = null;
  res.redirect('/users/login');
});


/*
/////////////////////////////////////////////////////////////////////////////////
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>,>,><><><><><><><><
HEY DO WE NEED THIS ANYMORE. THE COMMUNITY RECIPES ARE IN THE RECIPES TABLE.....
*/
router.post('/saveCommunityRecipe', async function(req,res){
  //get recipe id that user is trying to copy into their pantry
  var recipe_id_to_be_copied = req.body['community_recipe_id'];
  // get current user id, so we know which pantry to add recipe to
  var current_user_id = req.session.passport['user'];
  // Query for pantry ID that user belongs to
  await db.query('SELECT * FROM users WHERE user_id=' + current_user_id, function(err, results) {
    if (err) throw err;
    // Asssign the pantry that the user belons to
    users_pantry_id = results[0]['user_pantry_id'];
    // Get single recipe information from community recipe database
    query =
      'SELECT c_recipe_name,c_recipe_serving_size,c_recipe_directions,c_recipe_image_path FROM community_recipes WHERE c_recipe_id=' +
      recipe_id_to_be_copied +
      ';';
    db.query(query, async function(err, results) {
      if (err) throw err;
      // assign all the information needed from the recipe
      var recipe_name = results[0]['c_recipe_name'];
      var recipe_serving_size = results[0]['c_recipe_serving_size'];
      var recipe_directions = results[0]['c_recipe_directions'];
      var recipe_image = results[0]['c_recipe_image_path'];
      combined_values =
        "('" +
        recipe_name +
        "'," +
        recipe_serving_size +
        ",'" +
        recipe_directions +
        "','" +
        recipe_image +
        "'," +
        users_pantry_id +
        ');';
      // Insert copied recipe into pantry's recipes
      query =
        'INSERT INTO recipes  (recipe_name, recipe_serving_size, recipe_directions, recipe_image_path,recipe_pantry_id) VALUES ' +
        combined_values;
      db.query(query, function(err) {
        if (err) throw err;
        // respond to AJAX POST request
        res.send('Success');
      });
    });
  });
});

// Add new user from admin panel
router.post('/add', function(req, res) {
  var user_name = req.body.userName;
  var user_type = req.body.userType;
  switch (user_type) {
    case 'volunteer':
      user_type = 'V'
      break;
    case 'administrator':
      user_type = 'A'
      break;
  }
  var user_password = req.body.password;

  // Instantiate new user model defined in DB_models/Users.js
  var newUser = new User({
    email: user_name,
    pass: user_password,
    user_type: user_type,
    //TODO figure out how to assign pantry IDs
    user_pantry_id: 1
  });

  // Call create function from DB_models/Users.js
  User.createUser(newUser, function() {
    req.flash('success', 'User added!');
    console.log('SHOWING PAGE');
    res.redirect('/users/adminPanel');
  });
});

// Delete user from admin panel
router.delete('/delete/:id', async function(req, res) {
  var query = 'DELETE FROM users WHERE user_id=' + req.params.id + ';';
  await db.query(query);
  req.flash('success', 'User deleted!');
  res.send('success');
});

// Change user privilege from admin panel
router.post('/changePrivilege/:id', function(req, res) {
  var user_type = req.body.userType;
  // Change Volunteer or Administrator to N/NP for database insert
  switch (user_type) {
    case 'volunteer':
      user_type = 'NP';
      break;
    case 'administrator':
      user_type = 'P';
      break;
  }

// Get user id
  var user_id = req.params.id;
  // create database query
  var query = "UPDATE users SET user_type='" + user_type + "' WHERE user_id=" + user_id + ';';
  console.log(query);
  db.query(query, function(err, results) {
    if (err) throw err;
    else {
      // Show message to user
      req.flash('success', 'Privilege change successful!');
      res.redirect('/users/adminPanel');
    }
  });
});

// Reset users password and set a new password
router.post('/resetPassword/:id', async function(req, res) {
  var user_id = req.params.id;
  var user_password = req.body.password;

  // generate salt
  salt = bcrypt.genSaltSync(10);
  // generate hash using the passed in password
  var hash = bcrypt.hashSync(user_password, salt);

  // update password in database
  query = "UPDATE users SET pass='" + hash + "' WHERE user_id=" + user_id + ';';
  db.query(query);

  // Show message to user
  req.flash('success', 'Password reset successful!');
  res.redirect('/users/adminPanel');
});

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

router.post('/changeUsername', function changeUsername(req, res) {
  // get currently logged in user
  const currentUserId = req.session.passport['user']
  // get passed in username
  const newUsername = req.body.newUsername
  // create sql query
  const query = `UPDATE users SET email='${newUsername}' WHERE user_id=${currentUserId}`
  db.query(query, function updateUser(err) {
    if (err) throw err
    req.flash('success', 'Username Changed!')
    res.redirect('/users/settings')
  })
})

router.post('/changePassword', function changePassword(req, res) {
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
    const query = `SELECT * FROM users WHERE user_id=${currentUserId};`;
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
    // generate salt
    const salt = bcrypt.genSaltSync(10)
    // generate hash using the passed in password
    const hash = bcrypt.hashSync(newPassword, salt)
    const query = `UPDATE users SET pass='${hash}' WHERE user_id=${currentUserId};`
    db.query(query, function updatePassword(err) {
      if (err) throw err
      req.flash('success', 'Password Changed!')
      res.redirect('/users/settings')
    })
  }
})

// Function to call from any route to check if user is authenticated
// This needs to be used for verification of user privilleges
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('error', 'You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router
