const express = require('express');
const router = express.Router();

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
    req.check('email','Invalid email address').isEmail();
    req.check('password','Password is invalid').isLength({min:4})

    var validated = true;

    var errors = req.validationErrors();
    if(errors){
        for (error in errors){
            console.log(errors[error]);
        }
        validated = false;
    }
    else{
            const u_name = req.body.email;
            const u_pass = req.body.password;
            // data = 'SELECT (userName,pass) FROM users WHERE userName="'+u_name+'" AND pass='+"'"+u_pass+"'";
            // console.log("DATA:" + data);
            db.query('SELECT * FROM users WHERE userName="'+u_name+'" AND pass="'+u_pass+'"', function(err, results) {
                if (err) throw err
                if(results > 0){
                    validated = true;
                }
                else{
                    validated = false;
                }
            })
    }
    res.render('signin',{
        title: "Sign In",
        test: validated
    })
})

//Get request to localhost:3000/users/register
router.get('/register', function(req, res){
    //renders signin page with content 'Registration"
    console.log("Session"+req.session);
    res.render('register',{
        title:"Registration",
        success:req.session.success,
        errors:req.session.errors
    });
    req.session.errors = null;
    
})

//This will register a new user and add their credentials to the database
router.post('/register', function(req,res){

    req.check('email','Invalid email address').isEmail();
    req.check('password','Password is invalid').isLength({min:4}).equals(req.body.confirm_password);

    var errors = req.validationErrors();
    if(errors){
        req.session.errors = errors;
        req.session.success = false;
    }
    else{
        req.session.success = true;
    }

    const u_name = req.body.email;
    const u_pass = req.body.password;
    user_data="('"+u_name+"','"+u_pass+"','"+"user"+"')";
    console.log(user_data);
    // result = "'"+ing_name+"',"+ing_measurement+",'"+ing_expiration+"',"+ing_serving_size;

    db.query('INSERT INTO users (userName, pass, userType) VALUES '+user_data, function(err, results) {
        if (err) throw err
        //Render same page with newly added ingredient
        // res.send("New user ")
    });

    //TODO redirect a user to a proper page
    res.redirect('/users/register')

})

//TODO
//Retrieve user with GET

//TODO
//Add user with POST

//TODO
//Remove user with DELETE

module.exports = router;