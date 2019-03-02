const express = require("express");
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

//Get request to localhost:3000/users/login
router.get("/login", function(req, res) {
  //renders signin page with content 'Sign In"
  res.render("signin", {
    title: "Sign In",
  });
});

//Set up LocalStrategy of how users will be authenticated
//Accepts username and password form the signin.pug
passport.use(
  new LocalStrategy(async function(username, password, done) {
    //First find if user exists
    let userData = await User.getUserByEmail(username);
    if (!userData) {
      //If user not found by email return Unknown User
      return done(null, false, { message: "Unknown User" });
    } else {
      //If user found

      /*
            COMPARE PASSWORD HASHES
            Grab 'password' from the form
            Apply hash defined in DB_models/Users.js to the password
            Compare hashed password 'userData.pass' from the database with entered password
            */
      User.comparePassword(password, userData.pass, function(err, isMatch) {
        //if error throw error
        if (err) throw err;
        //If hashes match
        if (isMatch) {
          return done(null, userData);
        }
        //If hashes dont match print invalid password
        else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    }
  })
);

//serialized user instance
//Create cookies for sessions management
//This allows for using login credentials once for a single request and then keeping the user authenticated without making requests with same credentials
//Creates a cookie with user credentials
passport.serializeUser(function(user, done) {
  //We can stuff more stuff into session here by declaring a new varialbe and passing it into done() intead of user.user_id
  done(null, user.user_id);
});

//Invalidates the cookie based on the userId
passport.deserializeUser(async function(id, done) {
  try {
    let userData = await User.getUserById(id);
    done(null, userData);
  } catch (err) {
    throw err;
  }
});

//Does user authentication
//If success redirect to /users/dashboard
//If failure keep user at the login with proper message of what went wrong
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

//------------
//DEPRECATED METHOD
//PLAIN TEXT AUTHENTICATION
//------------

//This will login a user based on theirc redentials
// router.post('/login', function(req, res){
//     req.checkBody('email','Username is required').notEmpty();
//     req.checkBody('password','Password is required').notEmpty();

//     let errors = req.validationErrors();

//     if(errors){
//         res.render('signin',{
//             title:"Sign In",
//             errors:errors
//         });
//     }
//     else{
//         const u_email = req.body.email;
//         const u_pass = req.body.password;
//         // data = 'SELECT (userName,pass) FROM users WHERE userName="'+u_name+'" AND pass='+"'"+u_pass+"'";
//         // console.log("DATA:" + data);
//         db.query('SELECT * FROM users WHERE email="'+u_email+'" AND pass="'+u_pass+'"', function(err, results) {
//             if (results.length > 0) {
//                 req.flash("success", "Welcome");
//                 res.redirect('/users/dashboard');
//             }
//             else{
//                 customErr = "User not found";
//                 req.flash("error", "No such user");
//                 res.redirect('/users/login');
//             }
//         });
//     }

// })

//Get request to localhost:3000/users/register
router.get("/register", function(req, res) {
  //renders signin page with content 'Registration"
  console.log(req.session);
  res.render("register", {
    title: "Registration"
  });
});

//Get request to localhost:3000/users/login
router.get('/dashboard',checkAuthentication,async function(req, res){
    //Jon//pulls algorithm results from directAlgorithm into recipe_results
    //Jon//then parses recipe id into var recipe_id
    try
    {

      var results = await next_ing.next_exp_ingredient();
      console.log(JSON.stringify(results));
      var results2 = await found_recipes.find_recipes(results.ingredient_name);
      var recipe_id = results2[0];
      console.log(results2);
      // var recipe_results = await recipe_t.findOne({where:{recipe_id: recipe_id}});
      // console.log(JSON.stringify(recipe_results));
      //Jon//pulls recipes steps from recipe_direction_parser by the recipe_id
      //Oskars//then splits string by the delimeter so we can get all the individual steps
      var recipe_steps = await steps.recipe_direction_parser(recipe_id);
      var recipe_steps_array = recipe_steps.split('${<br>}');
      var recipe_info = await recipe_t.findAll({
        where: {recipe_id: {[op.in]: results2}}
      })

      //var cookit = cookit.cook_it(id);

      //Grab relative image path for 2nd and 3rd recipe cards
      var chicken_stir_fry_image = '/images/chicken_stir_fry.jpg';
      var chicken_pot_pie_image = '/images/chicken_pot_pie.jpg';
      //Jon//renders dashboard page with next expiring ingredient
      // results = await.
      // db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null ORDER BY ingredient_expiration_date LIMIT 1', function(err, results)
      // {
      //   if (err) throw err
        // results= results,
        
        i_total= results['ingredient_total'],
        i_measurement= results['ingredient_measurement'],
        i_name= results['ingredient_name'],
        i_expire= moment(results['ingredient_expiration_date']).format('LL'),
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
                stir_fry_image: chicken_stir_fry_image,
                pot_pie_image: chicken_pot_pie_image,
                //cook_it: cookit
            });

    }
    catch(err){
      console.log("routes/users/dashboard err: " + err);
    }  
})

router.get('/cook/:id', checkAuthentication,async function(req,res){
  const recipe = req.params.id;
  ////////////////////////////////////
  //how do we get panty_id and scale?//
  //the function will work but wont //
  //scale higher than one and wont //
  //report the metrics with out it//
  //////////////////////////////////
  /////////<<TO DO>>////////////////
  ///////////////////////////////////
  var info = await cook_it.cook_it2(recipe)
  console.log("REFRESH!");
  res.redirect(req.get('referer'));
});


//This will register a new user and add their credentials to the database
router.post("/register", function(req, res) {
  //renders signin page with content 'Registration"
  //Checks that email field is not empty
  req.checkBody("email", "Username field is required").notEmpty();
  //Checks that email field has proper email format
  req.checkBody("email", "Invalid email format").isEmail();
  //Checks password field is not empty
  req.checkBody("password", "Password field is required").notEmpty();
  req
    .checkBody("password", "Password must be longer than 4 characters")
    .isLength({ min: 4 });
  req
    .checkBody("password", "Passwords don't match")
    .matches(req.body.confirm_password);
  //Checks confirm password is not empty
  req
    .checkBody("confirm_password", "Confirm password field required")
    .notEmpty();

  //Get all errors is any based on above validators
  let errors = req.validationErrors();

  //if errors exist
  if (errors) {
    //render register page and pass in errors defined above, which will be rendered as well
    res.render("register", {
      title: "Registration",
      errors: errors
    });
  }
  //METHOD BELOW IS DEPRECATED PLAIN TEXT AUTHENTICATION
  //if no errors
  // else{
  //     //Get user's email
  //     const u_name = req.body.email;
  //     //Get user's password
  //     const u_pass = req.body.password;
  //     //Prepare user's data for SQL INSERT
  //     user_data="('"+u_name+"','"+u_pass+"','"+"user"+"')";

  //     //Add new user to database
  //     db.query('INSERT INTO users (email, pass, user_type) VALUES '+user_data, function(err, results) {
  //         //If error on insert into database
  //         if (err){
  //             //prepare error message for user
  //             req.flash("error", "Could not add user to database");
  //             //show message on registration page
  //             res.redirect('/users/register');
  //             //Log the error to console
  //             console.log(err);
  //         }
  //         //If successful insert
  //         else{
  //             //Prepare message for user
  //             req.flash("success", "Welcome");
  //             //Redirect user to their dashboard
  //             res.redirect('/users/dashboard');
  //         }
  //     });
  // }

  //ENCRYPTED AUTHENTICATION
  //Creates a user and hashes their password into database
  else {
    //Get user's email
    const email = req.body.email;
    //Get user's password
    const password = req.body.password;
    //Instantiate new user model defined in DB_models/Users.js
    var newUser = new User({
      email: email,
      pass: password,
      //TODO add pantryID
      userType: "admin"
    });

    //Call create function from DB_models/Users.js
    User.createUser(newUser, function(err, user) {
      if (err) throw err;
    });

    //Upon sucessful creating take user to the dashboard
    res.redirect("/users/dashboard");
  }
});

router.get("/logout",function(req, res) {
  req.logOut();
  req.flash("success", "You are logged out");
  res.locals.user = null;
  res.redirect("/users/login");
});

router.post('/saveCommunityRecipe', async function(req,res){
  //get recipe id that user is trying to copy into their pantry
  var recipe_id_to_be_copied = req.body['community_recipe_id'];
  //get current user id, so we know which pantry to add recipe to
  var current_user_id = req.session.passport['user'];
  //get pantry ID that user belongs to
  await db.query("SELECT * FROM users WHERE user_id="+current_user_id, function(err, results){
      if(err) throw err;
      users_pantry_id = results[0]['user_pantry_id'];
      //Get recipe information from community recipe database
      query = "SELECT c_recipe_name,c_recipe_serving_size,c_recipe_directions,c_recipe_image_path FROM community_recipes WHERE c_recipe_id="+recipe_id_to_be_copied+";";
      db.query(query, async function(err, results) {
        if (err) throw err;
        var recipe_name = results[0]['c_recipe_name'];
        var recipe_serving_size = results[0]['c_recipe_serving_size'];
        var recipe_directions = results[0]['c_recipe_directions'];
        var recipe_image = results[0]['c_recipe_image_path'];
        combined_values = "('"+recipe_name+"',"+recipe_serving_size+",'"+recipe_directions+"','"+recipe_image+"',"+users_pantry_id+");";
        query = "INSERT INTO recipes  (recipe_name, recipe_serving_size, recipe_directions, recipe_image_path,recipe_pantry_id) VALUES "+combined_values;
        db.query(query,function(err){
          if (err) throw err;
            console.log(query);
            console.log("INSERTING INTO DATABASE");
            res.send("Success");
        })
      })
  });
});

//Function to call from any route to check if user is authenticated
//This needs to be used for verification of user privilleges
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You are not logged in");
    res.redirect("/users/login");
  }
}

//TODO
//Remove user with DELETE
module.exports = router;
