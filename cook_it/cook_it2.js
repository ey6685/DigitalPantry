////////////////////////////////////////////////////////////
// this file contains the function cook_it2. cook_it2 takes//
// an int of the recipe id that we are cooking. then it    //
// will check to make sure we can cook the recipe by       //
// checking our inventory for the ingredients if we have   //
// them then we can take out what we are using in the      //
// from the ingredients table from our db.                 //
// UPDATE:                                                 //
// now it will log the number of ingredients you cooked    //
// under your pantry                                       //
////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
// inputs:                                                        //
// 1.) recipe_id                                                  //
// 2.) pantry_id                                                  //
// 3.) scale                                                      //
//                                                               //
// outputs: none                                                  //
//                                                               //
// datebase updates:                                              //
// 1.)add # of ingredients cooked to pantry_ingredients_used_month//
// 2.)add # of ingredients cooded to pantry_ingredients_used_YTD  //
///////////////////////////////////////////////////////////////////

/////////////requires//////////////////////////////////////////////
const recipe_ingredient_t = require('../DB_models/recipe_ingredient');
const ingredient_t = require('../DB_models/Ingredients');
const pantry_t = require('../DB_models/Pantry');
const converter = require('../algorithm/Convert_unts');

// db connection for testing
// const mysql = require('mysql');

// // for testingset up my db connection
// const db = mysql.createConnection ({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'digital_pantry',
//     multipleStatements:true//may have to change this later for security.....(note for OSKARS)
// });

///////////////////////////////////////////////////////////////////
async function cook_it2(recipe_id, pantry_id, scale) {
  // if no pantry id we wont log the ingredients but still cook
  // if no recipe id throw err.
  try {
    if (recipe_id == null) {
      throw 'no reicpe id';
    } else if (typeof recipe_id == 'number') {
      throw 'data passed to recipe_id is not a number';
    }
    // findf all the ingredients we need to cook
    var ingredients_in_recipe = await recipe_ingredient_t.findAll({
      attributes: [
        'recipe_ingredient_used',
        'recipe_ingredient_qty',
        'recipe_ingredient_measurement'
      ],
      where: { recipe_id: recipe_id }
    });
    console.log(JSON.stringify(ingredients_in_recipe));
    if (scale == null) {
      console.log('no scale provided: seting scale to 1');
      scale = 1;
    } else if (typeof scale == 'number') {
      throw 'data provide as scale is not a number';
    }
    var current_ingredient;
    var num_ingredients_cooked = 0;
    var do_it_flag = true; // flip if you cant cook it
    var query_str = '';
    // check inv for needed ingredient
    for (var i = 0; i < ingredients_in_recipe.length; i++) {
      console.log(
        '///////////////////////////////////////////\n' +
          query_str +
          '\n///////////////////////////////////////////\n'
      );
      // select ingredient_total, ingredient_measurement from ingredients
      // where
      current_ingredient = await ingredient_t.findOne({
        attributes: ['ingredient_total', 'ingredient_measurement'],
        where: {
          ingredient_name: ingredients_in_recipe[i].recipe_ingredient_used
        }
      });
      // console.log("============================\n" + JSON.stringify(current_ingredient) + "\n=================================\n");
      // if they measurement == then compare the totals
      // if not convert them if possible
      // if not flip flag
      if (
        current_ingredient.ingredient_measurement ==
        ingredients_in_recipe[i].recipe_ingredient_measurement
      ) {
        if (
          current_ingredient.ingredient_total >=
          (await parseFloat(ingredients_in_recipe[i].recipe_ingredient_qty * scale))
        ) {
          num_ingredients_cooked += scale;
          if (
            current_ingredient.ingredient_total - ingredients_in_recipe[i].recipe_ingredient_qty ==
            0
          )
            query_str +=
              "UPDATE ingredients SET ingredient_total = 0, ingredient_expiration_date = null WHERE ingredient_name = '" +
              ingredients_in_recipe[i].recipe_ingredient_used +
              "'; ";
          else
            query_str +=
              'UPDATE ingredients SET ingredient_total = ' +
              (await parseFloat(
                current_ingredient.ingredient_total - ingredients_in_recipe[i].recipe_ingredient_qty
              )) +
              " WHERE ingredient_name = '" +
              ingredients_in_recipe[i].recipe_ingredient_used +
              "'; ";
        } else {
          // console.log("dont have enough of " + ingredients_in_recipe[i].recipe_ingredient_measurement);
          do_it_flag = false;
          // console.log("flag flipped: ", current_ingredient.ingredient_name);
          break;
        }
      } else {
        // convert units
        // if they cannot flip flag
        var converted = await converter.converter_raw(
          ingredients_in_recipe[i].recipe_ingredient_qty * scale,
          ingredients_in_recipe[i].recipe_ingredient_measurement,
          current_ingredient.ingredient_measurement
        );
        if (converted != 0) {
          if (current_ingredient.ingredient_total >= converted) {
            num_ingredients_cooked += scale;
            if (current_ingredient.ingredient_total - converted == 0)
              query_str +=
                "UPDATE ingredients SET ingredient_total = 0, ingredient_expiration_date = null WHERE ingredient_name = '" +
                ingredients_in_recipe[i].recipe_ingredient_used +
                "';";
            else
              query_str +=
                'UPDATE ingredients SET ingredient_total = ' +
                (await parseFloat(current_ingredient.ingredient_total - converted)) +
                " WHERE ingredient_name = '" +
                ingredients_in_recipe[i].recipe_ingredient_used +
                "';";
          } else {
            do_it_flag = false;
            console.log('flag flipped: ', ingredients_in_recipe[i].recipe_ingredient_used);
            break;
          }
          // console.log("///////////////////////////////////////////\n" + query_str + "\n///////////////////////////////////////////\n");
        } else {
          console.log(
            "can't covert the units:" +
              ingredients_in_recipe[i].ingredient_measurement +
              ' to ' +
              current_ingredient.ingredient_measurement
          );
          do_it_flag = false;
          break;
        }
      }
    } // end of for loop

    // now that we have our string, and the flag is not flipped
    // if a pantry id is passed to us then
    if (do_it_flag) {
      if (pantry_id) {
        // if the pantry id is passed to the function
        // get the stats to update
        var current_pantry = await pantry_t.findOne({
          attributes: [
            'pantry_ingredients_used_month',
            'pantry_ingredients_used_YTD',
            'recipes_cooked_month',
            'recipes_cooked_YTD'
          ],
          where: {
            pantry_id: pantry_id
          }
        });
        // console.log(JSON.stringify(current_pantry))
        var new_used_month = current_pantry.pantry_ingredients_used_month + num_ingredients_cooked;
        var new_used_YTD = current_pantry.pantry_ingredients_used_YTD + num_ingredients_cooked;

        var new_recipes_month = current_pantry.recipes_cooked_month + 1;
        var new_recipes_YTD = current_pantry.recipes_cooked_YTD + 1;
        // console.log("new used mon: " + new_used_month);
        // console.log("new used YTD: " + new_used_YTD);
        // console.log("cooked month: " + new_recipes_month);
        // console.log("cooked YTD  : " + new_recipes_YTD);
        pantry_t.update(
          {
            pantry_ingredients_used_month: new_used_month,
            pantry_ingredients_used_YTD: new_used_YTD,
            recipes_cooked_month: new_recipes_month,
            recipes_cooked_YTD: new_recipes_YTD
          },
          {
            where: {
              pantry_id: pantry_id
            }
          }
        );
      }
      console.log('======================================\n');
      console.log('FINAL QUERY_STR\n');
      console.log(query_str);
      console.log('======================================\n');
      db.query(query_str, (err, results) => {
        if (err) throw err;
        console.log('cook_it_complete!');
      });
    } else {
      console.log('cant cook it.');
    }
  } catch (err) {
    console.log('error in cook it 2: ' + err);
  }
}

module.exports.cook_it2 = cook_it2;
// testing code
// cook_it2(2,1);
