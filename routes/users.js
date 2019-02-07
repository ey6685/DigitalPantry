const express = require('express');
const router = express.Router();
const moment = require('moment');
const algorithm = require('./algorithm');
const steps = require('../recipe_direction_parser')

//Get request to localhost:3000/users/login
router.get('/login', function(req, res){
    //renders signin page with content 'Sign In"
    res.render('signin',{
        title:"Sign In",
        test:true
    });
})

//This will login a user based on theirc redentials
router.post('/login', function(req, res){

    req.checkBody('email','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        res.render('signin',{
            title:"Sign In",
            errors:errors
        });
    }
    else{
        const u_email = req.body.email;
        const u_pass = req.body.password;
        // data = 'SELECT (userName,pass) FROM users WHERE userName="'+u_name+'" AND pass='+"'"+u_pass+"'";
        // console.log("DATA:" + data);
        db.query('SELECT * FROM users WHERE email="'+u_email+'" AND pass="'+u_pass+'"', function(err, results) {
            if (results.length > 0) {
                req.flash("success", "Welcome");
                res.redirect('/users/dashboard');
            }
            else{
                customErr = "User not found";
                req.flash("error", "No such user");
                res.redirect('/users/login');
            }
        });
    }

    
})

//Get request to localhost:3000/users/register
router.get('/register', function(req, res){
    //renders signin page with content 'Registration"
    console.log("Session"+req.session);
    res.render('register',{
        title:"Registration",
    });
    
})

//Get request to localhost:3000/users/login
router.get('/dashboard', async function(req, res){
    //pulls algorithm results from directAlgorithm into r_results
    var r_results = await algorithm.directAlgorithm();
    var rid = r_results[0]['recipe_id'];
    var r_steps = await steps.recipe_direction_parser(rid);
    console.log('done getting steps');    
    //renders dashboard page with next expiring ingredient
    db.query('SELECT * FROM ingredients ORDER BY ingredient_expiration_date LIMIT 1', function(err, results){
        if (err) throw err
        res.render('dashboard',{
            title:"Dashboard",
            results: results,
            i_total: results[0]['ingredient_total'],
            i_measurement: results[0]['ingredient_measurement'],
            i_name: results[0]['ingredient_name'],
            i_expire: moment(results[0]['ingredient_expiration_date']).format('LL'),
            //pulls recipe_name into r_name for referencing in dashboard
            r_name: r_results[0]['recipe_name'],
            r_steps: r_steps
        });

    });
})



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
    //if no errors
    else{
        //Get user's email
        const u_name = req.body.email;
        //Get user's password
        const u_pass = req.body.password;
        //Prepare user's data for SQL INSERT
        user_data="('"+u_name+"','"+u_pass+"','"+"user"+"')";

        //Add new user to database
        db.query('INSERT INTO users (email, pass, user_type) VALUES '+user_data, function(err, results) {
            //If error on insert into database
            if (err){ 
                //prepare error message for user
                req.flash("error", "Could not add user to database");
                //show message on registration page
                res.redirect('/users/register');
                //Log the error to console
                console.log(err);
            }
            //If successful insert
            else{
                //Prepare message for user
                req.flash("success", "Welcome");
                //Redirect user to their dashboard
                res.redirect('/users/dashboard');
            }
        });
    }

})

//TODO
//Remove user with DELETE

module.exports = router;