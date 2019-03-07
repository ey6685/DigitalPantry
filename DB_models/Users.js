//AUTHORS:
    //Patrick
    //Oskars
//This file contains a model for the Users table in SQL database
//This file also contains functions required to communicate with the database


const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');
const bcrypt = require('bcryptjs');

//CREATED BY PATRICK
//Defines User model
const Users = db.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true},
    email: {
        type: Sequelize.STRING,
        
        notNull: true,
    },
    
    pass:{
        type: Sequelize.STRING,
        notNull: true},
  
    user_pantry_id: {type: Sequelize.INTEGER},
    
    user_type: {
        type: Sequelize.STRING},
},
{
    timestamps: false
});
// Users.removeAttribute('id');

var User = module.exports = Users;

//CREATED BY OSKARS
//Creates user with a hash and saves it to the database
module.exports.createUser = function(newUser, callback){
    //Generate salt
    bcrypt.genSalt(10, function(err, salt){
        console.log(err);
        //Hash password with the generated salt
        bcrypt.hash(newUser.pass,salt, async function(err,hash){
            console.log(err);
            newUser.pass = hash;
            await newUser.save();
            callback(hash);
        })
    })
}

//CREATED BY OSKARS
//Retrieves the user by email
module.exports.getUserByEmail = async function(username){
    var results = await User.findOne({where:{email:username}});
    // console.log(result);
    return results;
}

//CREATED BY OSKARS
//Retrieves the user by ID
module.exports.getUserById = async function(id){
    console.log("Finding ID");
    let results = await User.findById(id);
    // console.log(results);
    return results;
    // return User.findById(id, callback);
}

//CREATED BY OSKARS
//Recieves a password that user has entered in the login form
//Hashes that password and compares to the hash inside the database
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) throw err;
        callback(null, isMatch);
    });
}
