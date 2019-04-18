//modele for the sequilized ingredients in the recipe

const Sequelize = require('sequelize');
const ingredient = require('../DB_models/Ingredients');
const db = require('../databaseMySQL.js');



const recipe_ingredient = db.define('ingredients_in_a_recipe', {
    recipe_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    
    ingredient_id: {
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    pantry_id:{
        type: Sequelize.INTEGER,
        foreignKey: true
    },
    
    amount_of_ingredient_needed: {
        type: Sequelize.FLOAT
    },
    ingredient_unit_of_measurement: {
        type: Sequelize.STRING
    },
},
{
    //these are to stop sequelize to add timestaps fields
    //and plurlized the table name, respectily 
    timestamps: false,
    freezeTableName:true
},
);

//api auto adds the id need to takeit out for there are no plain id
recipe_ingredient.removeAttribute('id');
module.exports = recipe_ingredient;