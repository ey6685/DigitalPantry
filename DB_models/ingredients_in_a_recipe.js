/*
=========================================================================================================
variant_recipe_id | ingredient_id | amount_of_ingredient_needed | ingredient_unit_of_measurement        |
  int pf autoin   |  int fk ref   |     float                   |    emun("tsp.","tbsp.","fl oz","cup",)|
                  | ingredients   |                             |        "quart","ml","lb","oz"         |
=========================================================================================================

*/



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

// //FKs
// recipe_ingredient.belongsTo(ingredient, {foreignKey: "ingredient_id", targetKey: "ingredient_id"});
// recipe_ingredient.belongsTo(rec_var, {foreignKey: "variant_recipe_id", targetKey: "variant_recipe_id"});
recipe_ingredient.removeAttribute('id');
module.exports = recipe_ingredient;