///////////////////////////////////////////////////////////////////////////////
// this file is the main function(like in c) that calls all the cogs in this  //
// this main function is to find the expiring ingredients within the user set //
// window and find recipes that are the best fit to use those ingredients     //
///////////////////////////////////////////////////////////////////////////////

/////////////////////////inputs/////////////////////////////////////////////////////////////
// today's date: date : take from computer, later? report to a master clock                //
// the window  : date : taken from the user, how far away for $today"s date we need to look//
// pantry id   : int  : to limit the search through all the recipes                        //
////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////outputs///////////////////////////////////////
// JSON object with all the recipes to cook                       //
///////////////////////////////////////////////////////////////////
// requires
const ingredient_finder = require('./find_ingredients');
const recipe_id_finder = require('./find_recipes');
const recipe_t = require('../DB_models/Recipes');
const op = require('sequelize').Op;
async function main(window) {
  // first check the window date
  // if it is null just assume the window is today
  if (window == null) {
    var new_date = new Date();
    var year = new_date.getUTCFullYear();
    var month = new_date.getUTCMonth() + 1;
    var day = new_date.getUTCDate() - 1;

    window = year + '-' + month + '-' + day;
    console.log('no window date provide, using: ' + window);
  }
  try {
    // finding all the ingredients the expire between today and the window
    // just like in this function, for somereason is the window is null
    // it just using todays date
    var expiring_ingredients = await ingredient_finder.find_ingredients(window);
    // console.log("returned from find_ingredients: " + JSON.stringify(expiring_ingredients));
    // console.log(expiring_ingredients[0].ingredient_name);
    if (expiring_ingredients.length == 0) {
      return 0;
    }

    // loop through the results of the search the get recipes that we can cook
    // the find recipes fuction checks inv before returning the recipe id of recipes we can cook
    var recipes_ids = new Array();
    if (expiring_ingredients.length > 1) {
      for (var i = 0; i < expiring_ingredients.length; i += 1) {
        recipes_ids[i].push();
        recipes_ids[i] = await recipe_id_finder.find_recipes(
          expiring_ingredients[i].ingredient_name
        );
      }
    } else {
      console.log('passing: ' + expiring_ingredients[0].ingredient_name);
      recipes_ids = await recipe_id_finder.find_recipes(expiring_ingredients[0].ingredient_name);
    }

    // console.log(recipes_ids);
    // ended here with getting the ids of recipes that

    // return the recipes
    // as JSON objects
    var returning_recipes = await recipe_t.findAll({
      where: {
        recipe_id: {
          [op.in]: recipes_ids
        }
      }
    });

    console.log(JSON.stringify(returning_recipes));
    return returning_recipes;
  } catch (err) {
    console.log('error in main: \n' + err);
  }
}
// testing code
main('2019-02-19', 1, 1);
