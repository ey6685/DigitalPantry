const express = require('express');
const router = express.Router();
const mysqlx = require('@mysql/xdevapi');

//Get request to localhost:3000/login
router.get('/login', function(req, res){
    //renders signin page with content 'Sign In"
    res.render('signin',{
        title:"Sign In"
    });
})

//Get request to localhost:3000/register
router.get('/register', function(req, res){
    //renders signin page with content 'Registration"
    res.render('register',{
        title:"Registration"
    });
})

//Clean up this post request
router.post('/register', function(req,res){
    const u_name = req.body.email;
    const u_pass = req.body.password;
    const u_pass_confirm = req.body.confirm_password;
    user_data=u_name+','+u_pass+',5,'+u_pass_confirm;
 
    var query = "INSERT INTO digital_pantry (userName, pass, pantryID, userType) VALUES ("+user_data+")";


    mysqlx
    .getSession({
      user: 'root',
      password: 'Waynestate2@',
      host: 'localhost',
      port: 33060
    })
    .then(function (session) {
      // Accessing an existing table
      myTable = session.getSchema('digital_pantry').getTable('users');
  
      // Insert SQL Table data
      return myTable
        .insert(['userName', 'pass', 'pantryID', 'userType'])
        .values([u_name, u_pass, 2, 'guest'])
        .execute()
    });
    // .then(function () {
    //   // Find a row in the SQL Table
    //   return myTable
    //       .select(['_id', 'name', 'birthday'])
    //       .where('name like :name && age < :age)')
    //       .bind('name', 'S%')
    //       .bind('age', 20)
    //       .execute(function (row) {
    //         console.log(row);
    //       });
    // })
    // .then(function (myResult) {
    //   console.log(myResult);
    // });

    res.send("New User added! +");

})
//Retrieve user with GET

//Add user with POST

//Remove user with DELETE

module.exports = router;