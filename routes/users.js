const express = require('express');
const router = express.Router();
const moment = require('moment');
const algorithm = require('./algorithm');
const steps = require('../recipe_direction_parser');
const User = require('../DB_models/Users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cook_it = require('../functions/cook_it');

//Get request to localhost:3000/users/login
router.get('/login', function(req, res){
    //renders signin page with content 'Sign In"
    res.render('signin',{
        title:"Sign In",
        test:true
    });
})

//Set up LocalStrategy of how users will be authenticated
//Accepts username and password form the signin.pug
passport.use(new LocalStrategy(async function(username, password, done) {
    //First find if user exists
    let userData = await User.getUserByEmail(username);
        if(!userData){
            //If user not found by email return Unknown User
            return done(null,false,{message:'Unknown User'});
        }
        else{
            //If user found

            /*
            COMPARE PASSWORD HASHES
            Grab 'password' from the form
            Apply hash defined in DB_models/Users.js to the password
            Compare hashed password 'userData.pass' from the database with entered password
            */
            User.comparePassword(password,userData.pass,function(err, isMatch){
                //if error throw error
                if(err) throw err;
                //If hashes match
                if(isMatch){
                    return done(null,userData);
                }
                //If hashes dont match print invalid password
                else{
                    return done(null,false,{message:'Invalid Password'});
                }
            });
        }
}));

//serialized user instance 
//Create cookies for sessions management
//This allows for using login credentials once for a single request and then keeping the user authenticated without making requests with same credentials
//Creates a cookie with user credentials
passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

//Invalidates the cookie based on the userId
passport.deserializeUser(async function(id, done) {
    try{
        let userData = await User.getUserById(id);
        done(null,userData);
    }
    catch(err){
        throw err;
    }    
  });

//Does user authentication
//If success redirect to /users/dashboard
//If failure keep user at the login with proper message of what went wrong
router.post('/login',
    passport.authenticate('local',{
        successRedirect:'/users/dashboard',
        failureRedirect:'/users/login',
        successFlash:'Welcome!',
        failureFlash:true
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
router.get('/register', function(req, res){
    //renders signin page with content 'Registration"
    console.log("Session"+req.session);
    res.render('register',{
        title:"Registration",
    });
    
})

//Get request to localhost:3000/users/login
router.get('/dashboard',async function(req, res){
    //Jon//pulls algorithm results from directAlgorithm into recipe_results
    //Jon//then parses recipe id into var recipe_id
    var recipe_results = await algorithm.directAlgorithm();
    var recipe_id = recipe_results[0]['recipe_id'];
    console.log("Recipe ID:" + recipe_id);
    //Jon//pulls recipes steps from recipe_direction_parser by the recipe_id
    //Oskars//then splits string by the delimeter so we can get all the individual steps
    var recipe_steps = await steps.recipe_direction_parser(recipe_id);
    var recipe_steps_array = recipe_steps.split('${<br>}');

    //var cookit = cookit.cook_it(id);

    //Grab relative image path for 2nd and 3rd recipe cards
    var chicken_stir_fry_image = '/images/chicken_stir_fry.jpg';
    var chicken_pot_pie_image = '/images/chicken_pot_pie.jpg';
    //Jon//renders dashboard page with next expiring ingredient
    db.query('SELECT * FROM ingredients WHERE ingredient_expiration_date IS NOT null ORDER BY ingredient_expiration_date LIMIT 1', function(err, results){
        if (err) throw err
        res.render('dashboard',{
            title:"Dashboard",
            results: results,
            i_total: results[0]['ingredient_total'],
            i_measurement: results[0]['ingredient_measurement'],
            i_name: results[0]['ingredient_name'],
            i_expire: moment(results[0]['ingredient_expiration_date']).format('LL'),
            //pulls recipe_name into recipe_name for referencing in dashboard
            recipe_name: recipe_results[0]['recipe_name'],
            recipe_steps: recipe_steps_array,
            rid:recipe_id,
            //Send individual recipe steps inside the array
            stir_fry_image: chicken_stir_fry_image,
            pot_pie_image: chicken_pot_pie_image,
            //cook_it: cookit
        });

    });
});

router.get('/cook/:id', async function(req,res){
    const recipe = req.params.id;
    var info = await cook_it.cook_it(recipe)
    console.log("REFRESH!");
    res.redirect(req.get('referer'));
    
});



//This will register a new user and add their credentials to the database
router.post('/register', function(req,res){

    //renders signin page with content 'Registration"
    //Checks that email field is not empty
    req.checkBody('email','Username field is required').notEmpty();
    //Checks that email field has proper email format
    req.checkBody('email','Invalid email format').isEmail();
    //Checks password field is not empty
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password','Password must be longer than 4 characters').isLength({min:4});
    req.checkBody('password',"Passwords don't match").matches(req.body.confirm_password);
    //Checks confirm password is not empty
    req.checkBody('confirm_password','Confirm password field required').notEmpty();

    //Get all errors is any based on above validators
    let errors = req.validationErrors();

    //if errors exist
    if(errors){
        //render register page and pass in errors defined above, which will be rendered as well
        res.render('register',{
            title:"Registration",
            errors:errors
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
    else{
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
        User.createUser(newUser, function(err, user){
            if (err) throw err;
        });

        //Upon sucessful creating take user to the dashboard
        req.flash("success", "Welcome");
        res.redirect('/users/dashboard');
    }

});

router.get('/logout', function(req,res){
    req.logOut();
    req.flash("success","You are logged out");
    res.locals.user = null;
    res.redirect('/users/login');
});

//Function to call from any route to check if user is authenticated
//This needs to be used for verification of user privilleges
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error', 'You are not logged in');
        res.redirect('/users/login');
    }
}

//TODO
//Remove user with DELETE

module.exports = router;