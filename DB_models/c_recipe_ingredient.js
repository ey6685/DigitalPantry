//setting up the models for useing the database
//this is the model for the  table ingredients the digital_pantry db

const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');

/*
====================================================================================================
c_recipe_id | c_recipe_ingredient_used | c_recipe_ingredient_qty | c_recipe_measurement_measurement|
====================================================================================================
    int     |       varchar(32)        |        float            |"tsp.","tbsp.","fl oz","cup",    |
                                                                 |  "quart","ml","lb","oz"         |
 ===================================================================================================
 
 
*/
const c_recipe_ingredient = db.define('community_recipe_ingredient', {
        c_recipe_id: {
            type: Sequelize.INTEGER
        },

        c_recipe_ingredient_used: {
            type: Sequelize.STRING
        },

        c_recipe_ingredient_qty : {
            type: Sequelize.FLOAT
        },

        c_recipe_ingredient_measurement: {
            type: Sequelize.ENUM("tsp.","tbsp.","fl oz","cup","quart","ml","lb","oz")
        }
    },
    {  
        timestamps     : false
    
});
// Ingredients.removeAttribute('id');

module.exports = c_recipe_ingredient;