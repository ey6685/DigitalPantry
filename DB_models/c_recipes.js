//setting up the models for useing the database
//this is the model for the  table ingredients the digital_pantry db

const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');

/*
---------------------------------------------------------------------------------------------
|c_recipe_id | c_recipe_name | c_recipe_serving_size | c_recipe_directions | c_reciep_image_path|
---------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------
|  int PK    |  varchar(32)  |        float          |     tiny text       |    tinytext        |
--------------------------------------------------------------------------------------------------
*/
const c_recipe = db.define('community_recipes', {
        c_recipe_id: {
            type: Sequelize.INTEGER,
            primaryKey,
            autoIncrement: true},
        
        c_recipe_name :{
            type: Sequelize.STRING
            //varchar(32)
        },
        c_recipe_serving_size:{
            type: Sequelize.FLOAT
        },
        c_recipe_directions:{
            type: Sequelize.STRING
            //tinytext
        },
        c_recipe_image_path: {
            type: Sequelize.STRING
            //tinytext
        }
        
    },
    {  
        timestamps     : false
    
});
// Ingredients.removeAttribute('id');

module.exports = c_recipe;