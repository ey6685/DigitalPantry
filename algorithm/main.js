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
const wieght_finder= require('./recipe_weight_functions');
const logger = require('../functions/logger');
async function main(window,pantry_id) {
  // first check the window date
  // if it is null just assume the window is today
  logger.info("starting the Algorithm\n\n");

  if (window == null) {
    window = 1;
    logger.info('no window date provide, using: ' + window);
  }
  try {
    // finding all the ingredients the expire between today and the window
    // just like in this function, for somereason is the window is null
    // it just using todays date
    logger.info("\nCALLING find_ingredients\n")
    var expiring_ingredients = await ingredient_finder.find_ingredients(window,pantry_id);
    // logger.info("returned from find_ingredients: " + JSON.stringify(expiring_ingredients));
    // logger.info(expiring_ingredients[0].ingredient_name);
    if (expiring_ingredients.length == 0) {
      return 0;
    }

    // loop through the results of the search the get recipes that we can cook
    // the find recipes fuction checks inv before returning the recipe id of recipes we can cook
    var recipes_ids = new Array();
    if (expiring_ingredients.length > 1) {
      for (var i = 0; i < expiring_ingredients.length; i += 1) {
        // recipes_ids[i].push();
        recipes_ids.push(await recipe_id_finder.find_recipes(
          expiring_ingredients[i].ingredient_id, pantry_id
        ));
      }
    } else {
      logger.info('passing: ' + expiring_ingredients[0].ingredient_name+ '\n');
      recipes_ids = await recipe_id_finder.find_recipes(expiring_ingredients[0].ingredient_name,pantry_id);
    }

    logger.info("ENDING RECIPE IDS: \n" +JSON.stringify(recipes_ids));
    // ended here with getting the ids of recipes that

    //now we need only the ids sections that have values
    var final_ids =new Array()
    for(var i =0; i<recipes_ids.length;i++)
    {
      if(recipes_ids[i] != "")
      {
        console.log(recipes_ids[i]);
          for(var o=0;o<recipes_ids[i].length;o++)
          {
            if(final_ids.indexOf(recipes_ids[i][o]) == -1)
            {
              final_ids.push(recipes_ids[i][o]);
            }
          }
      }
      
      
    }
    // return the recipes
    // as JSON objects
    logger.info("FINAL IDS: \n" + final_ids + '\n');
    var returning_recipes = await recipe_t.findAll({
      where: {
        recipe_id: {
          [op.in]: final_ids
        },
        pantry_id: pantry_id
      }
    });

    logger.info(JSON.stringify(returning_recipes));


    // logger.info("this line jon\n" , JSON.stringify(new_recipe));
    return returning_recipes;
  } catch (err) {
    logger.info('error in main: \n' + err);
  }
}
// testing code
main(12);
