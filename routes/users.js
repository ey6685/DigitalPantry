const express = require('express');
const router = express.Router();

//Get request to localhost:3000/users/login
router.get('/login', function(req, res){
    //renders signin page with content 'Sign In"
    res.render('signin',{
        title:"Sign In"
    });
})

//Get request to localhost:3000/users/register
router.get('/register', function(req, res){
    //renders signin page with content 'Registration"
    res.render('register',{
        title:"Registration"
    });
})

//This will register a new user
//TODO Clean up this, since this is a test
router.post('/register', function(req,res){
    const u_name = req.body.email;
    const u_pass = req.body.password;
    const u_pass_confirm = req.body.confirm_password;
    user_data=u_name+','+u_pass+',5,'+u_pass_confirm;

    res.send("New User added!");
})

//TODO
//Retrieve user with GET

//TODO
//Add user with POST

//TODO
//Remove user with DELETE

module.exports = router;