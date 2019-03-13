/*
=========================================================================================
recipe_id | recipe_name | recipe_image_path | recipe_num_times_cooked | pantry_id
int pf    | varchar 32  | text              | int                     | int fk ref pantry
==========================================================================================
*/


const Sequelize = require('sequelize');
const pantry = require('./Pantry');
const db = require('../databaseMySQL.js');


const Recipes = db.define('recipes', {
    recipe_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    
    recipe_name: {
        type: Sequelize.STRING
         },

    recipe_image_path: {
        type: Sequelize.INTEGER,
        default: null
         },
    recipe_directions:{
        type: Sequelize.TEXT
    },
    pantry_id: {
        type: Sequelize.INTEGER
        },
    recipe_num_times_cooked: {
        type: Sequelize.TEXT
    },

    num_people_it_feeds: {
        type: Sequelize.INTEGER
    }

},
    {  
    timestamps     : false

    });
// Recipes.removeAttribute('id');

//define relations
// Recipes.hasMany(rec_vars, {foreignKey: "recipe_id", sourceKey: "recipe_id"});
// Recipes.belongsTo(pantry, {foreignKey: "pantry_id", targetKey: "pantry_id"});
module.exports = Recipes;