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
    recipe_directions: {
        type: Sequelize.TEXT
    },
    recipe_image_path: {
        type: Sequelize.TEXT
    },
    recipe_shareable:{
        type: Sequelize.BOOLEAN
    }
},
    {  
    timestamps     : false

    });
// Recipes.removeAttribute('id');
module.exports = Recipes;