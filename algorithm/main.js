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
const ingredient_t = require('../DB_models/Ingredients.js')
const ingredients_pan_t = require('../DB_models/ingredients_in_pantry')
// async function main(window,pantry_id) {
//   // first check the window date
//   // if it is null just assume the window is today
//   logger.info("starting the Algorithm\n\n");

//   if (window == null) {
//     window = 1;
//     logger.info('no window date provide, using: ' + window);
//   }
//   try {
//     // finding all the ingredients the expire between today and the window
//     // just like in this function, for somereason is the window is null
//     // it just using todays date
//     logger.info("\nCALLING find_ingredients\n")
//     var expiring_ingredients = await ingredient_finder.find_ingredients(window,pantry_id);
//     // logger.info("returned from find_ingredients: " + JSON.stringify(expiring_ingredients));
//     // logger.info(expiring_ingredients[0].ingredient_name);
//     if (expiring_ingredients.length == 0) {
//       return 0;
//     }

//     // loop through the results of the search the get recipes that we can cook
//     // the find recipes fuction checks inv before returning the recipe id of recipes we can cook
//     var recipes_ids = new Array();
//     if (expiring_ingredients.length > 1) {
//       for (var i = 0; i < expiring_ingredients.length; i += 1) {
//         // recipes_ids[i].push();
//         recipes_ids.push(await recipe_id_finder.find_recipes(
//           expiring_ingredients[i].ingredient_id, pantry_id
//         ));
//       }
//     } else {
//       logger.info('passing: ' + expiring_ingredients[0].ingredient_name+ '\n');
//       recipes_ids = await recipe_id_finder.find_recipes(expiring_ingredients[0].ingredient_name,pantry_id);
//     }

//     logger.info("ENDING RECIPE IDS: \n" +JSON.stringify(recipes_ids));
//     // ended here with getting the ids of recipes that

//     //now we need only the ids sections that have values
//     var final_ids =new Array()
//     for(var i =0; i<recipes_ids.length;i++)
//     {
//       if(recipes_ids[i] != "")
//       {
//         console.log(recipes_ids[i]);
//           for(var o=0;o<recipes_ids[i].length;o++)
//           {
//             if(final_ids.indexOf(recipes_ids[i][o]) == -1)
//             {
//               final_ids.push(recipes_ids[i][o]);
//             }
//           }
//       }
      
      
//     }
//     // return the recipes
//     // as JSON objects
//     logger.info("FINAL IDS: \n" + final_ids + '\n');
//     var returning_recipes = await recipe_t.findAll({
//       where: {
//         recipe_id: {
//           [op.in]: final_ids
//         },
//         pantry_id: pantry_id
//       }
//     });

//     logger.info(JSON.stringify(returning_recipes));


//     // logger.info("this line jon\n" , JSON.stringify(new_recipe));
//     return returning_recipes;
//   } catch (err) {
//     logger.info('error in main: \n' + err);
//   }
// }
// testing code
// main(12);
// module.exports.main = main;

/*
function: main_no_inv

input:
1) int window: num of days to look at for ingredients
2) int pantry id: for checking and grabing only your data

outputs:
json data of a list of ingredients, with all the recipe data to go with it

discription:
first querys the ingredients in a pantry id with the window date. take the ingredient
ids and then gets the recipe data and reutrns all the data under the ingredient name
*/
async function main2(window, pantry_id)
{
  //data vaidation
  console.log("starting Algorithm with no inv reject");
  console.log("=====================================");

  var window_date = new Date();
  var today = await new Date();
  if(window == null || typeof window !='number')
    {
      console.log("no window using todays date: " + window_date);
    }
  else{
      window_date.setDate(window_date.getDate() + window);
       
      var dd = window_date.getDate();
      var mm = window_date.getMonth() +1;
      var yy = window_date.getFullYear();

      var d_str = yy + '-' + mm + '-' + dd;
      console.log(d_str);
      window_date = new Date(d_str);
  }
  if(pantry_id == null || typeof pantry_id !="number" )
  
  console.log("Dates for pulling info");
  console.log("======================");
  console.log("today: " + today + "\nwindow: " + window_date);
  //first we need the ingredients
  var expiring_ingredients = await ingredient_finder.find_ingredients(window, pantry_id);
  // console.log("data recived from finding ings")
  // console.log("==============================")
  // console.log(JSON.stringify(expiring_ingredients));
  //lets get rid of the dups of ids
  var ex_ids_array = new Array();
  for(var i=0; i<expiring_ingredients.length;i++)
  {
    if(ex_ids_array.indexOf(expiring_ingredients[i].ingredient_id) == -1)
    {
      ex_ids_array.push(expiring_ingredients[i].ingredient_id);
    }
  }
  console.log("no dups array of ingredient ids")
  console.log("===============================")
  console.log(JSON.stringify(ex_ids_array));
  var returing_JSON = new Array();
  for(var i = 0;i<ex_ids_array.length; i++)
  {
    var ingredient_data = await ingredient_t.findOne({
      attributes : ["ingredient_name"],
      where: {
        ingredient_id: ex_ids_array[i]
      }
    })
    var ing_in_pan_data = await ingredients_pan_t.findAll({
      attributes: ['ingredient_amount', 'ingredient_unit_of_measurement', 'ingredient_expiration_date'],
      where:{
        ingredient_id: ex_ids_array[i],
        ingredient_expiration_date: {
              [op.gte] : today      
        }
      },
      order:['ingredient_expiration_date']
    })

    returing_JSON.push({
      "ingredient_id": ex_ids_array[i],
      "ingredient_name" : ingredient_data.ingredient_name,
      "ingredient_amount" : ing_in_pan_data[0].ingredient_amount,
      "ingredient_unit_of_measurement": ing_in_pan_data[0].ingredient_unit_of_measurement,
      "recipe_data": await recipe_id_finder.find_recipes_no_inv(ex_ids_array[i],pantry_id)
      })
  }

  console.log("==========")
  console.log("FINAL DATA")
  console.log("==========")
  for(var i=0;i<returing_JSON.length; i++)
  {
    console.log(JSON.stringify(returing_JSON[i]));
    console.log("================")
  }
  console.log(JSON.stringify(returing_JSON))
  
  return returing_JSON
}

main2(12,1);
