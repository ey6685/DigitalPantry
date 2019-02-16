///function to find all ingredients that are expiring within the window

//inputs
//system date : date
//window date : date


//requires
const ingredient_t = require('../DB_models/Ingredients'); //link to ingredients tables
const op = require("sequelize").Op; ///handles 

async function find_ingredients(window)
{
    var ingredients_results
    try{
        ingredients_results = await ingredient_t
    }
    catch(err)
    {
        
    }
}

module.exports.find_ingredients = find_ingredients;
