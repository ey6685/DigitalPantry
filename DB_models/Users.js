//setting up the models for useing the database
//this is the model for the user table in the digital_pantry db

const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');

const Users = db.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true},
    email: {
        type: Sequelize.STRING,
        
        notNull: true,},
    
    pass:{
        type: Sequelize.STRING,
        notNull: true},
  
    pantry_id: {type: Sequelize.INTEGER},
    
    user_type: {
        type: Sequelize.STRING},
},
{
    timestamps: false
});
// Users.removeAttribute('id');
module.exports = Users;