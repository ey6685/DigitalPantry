const Sequelize = require('sequelize');
const db = require('../databaseMySQL.js');


const Recipes = db.define('recipes', {
    recipe_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true},
    recipe_name: {
        type: Sequelize.STRING
         },

    recipe_serving_size: {
        type: Sequelize.INTEGER,
        default: null
         },
    recipe_pantry_id: {
        type: Sequelize.INTEGER
        },
},
    {  
    timestamps     : false

    });
// Recipes.removeAttribute('id');
module.exports = Recipes;