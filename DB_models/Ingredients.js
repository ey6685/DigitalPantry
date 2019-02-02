//setting up the models for useing the database
//this is the model for the  table ingredients the digital_pantry db

const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');


const Ingredients = db.define('ingredients', {
    ingredient_id             : {type: Sequelize.INTEGER,
                                 primaryKey: true,
                                 autoIncrement: true},
   
                                 
    ingredient_name           : {type: Sequelize.STRING},
    ingredient_total          : {type: Sequelize.FLOAT},
    ingredient_measurement    : {type: Sequelize.STRING},
    ingredient_expiration_date : {type: Sequelize.INTEGER},
    },
    {  
        timestamps     : false
    
});
// Ingredients.removeAttribute('id');

module.exports = Ingredients;
