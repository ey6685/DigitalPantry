const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');



const recipe_ingredient = db.define('recipe_ingredient', {
    recipe_id                 : {type: Sequelize.INTEGER},
    
    recipe_ingredient_qty         : {type: Sequelize.FLOAT},
    recipe_ingredient_measurement : {type: Sequelize.STRING},
    recipe_pantry_id              : {type: Sequelize.INTEGER},
    recipe_ingredient_used        : {type: Sequelize.STRING}
},
{
    //these are to stop sequelize to add timestaps fields
    //and plurlized the table name, respectily 
    timestamps: false,
    freezeTableName:true
},
);
recipe_ingredient.removeAttribute('id');
module.exports = recipe_ingredient;