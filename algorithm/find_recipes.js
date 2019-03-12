/// function to recommend recipes for the expiring ingredient

// inputs
// ingredient name : string

// outputs: an array of recipe_ids

// requires
const recipe_ingredient_t = require('../DB_models/recipe_ingredient');
const ingredient_t = require('../DB_models/Ingredients');
const recipe_t = require('../DB_models/Recipes');
const op = require('sequelize').Op;

async function find_recipes(exp_ingredient) {
  console.log('staring find_recipe with ' + exp_ingredient);
  if (exp_ingredient != '') {
    // find the recipe ids and how much is needed of where it is
    try {
      var id_n_needed = await recipe_ingredient_t.findAll({
        attributes: [
          'recipe_id',
          'recipe_ingredient_qty',
          'recipe_ingredient_measurement',
          'recipe_ingredient_used'
        ],
        where: {
          recipe_ingredient_used: exp_ingredient
        }
      });
    } catch (err) {
      console.log(err);
      return 0;
    }

    // check to see if we got anything from the db
    if (id_n_needed.length <= 0) {
      console.log('no recipes for ' + exp_ingredient);
      return 0;
    }

    // now that we have the data and that something came back from the do we need to find out of we have all the
    // ingredients in our inv

    // place to store the ingredints and amount needed
    var ingredients_maybe = new Array();

    // find the rest of the needed ingredients

    // loop through and store the need ingredients in a 2d array
    // first dim is each new recipe
    // second dim is the ingredients needed for that recipe
    for (var i = 0; i < id_n_needed.length; i++) {
      console.log('started:' + i);
      try {
        ingredients_maybe[i] = await recipe_ingredient_t.findAll({
          attributes: [
            'recipe_id',
            'recipe_ingredient_qty',
            'recipe_ingredient_measurement',
            'recipe_ingredient_used'
          ],
          where: { recipe_id: id_n_needed[i].recipe_id }
        });
      } catch (err) {
        console.log(err + '\nhappened at:' + JSON.stringify(id_n_needed[i]));
        return 0;
      }
    }

    // console.log("///////////////////////////////////\n" +JSON.stringify(ingredients_maybe) + "\n////////////////////////////////////////\n");
    // console.log("length: " + ingredients_maybe[0].length);
    var err_flag = true; // flip this if not enough ingredients or if err occors
    var found_recipes_ids = new Array();
    var this_ingredient;
    try {
      for (var i = 0; i < ingredients_maybe.length; i += 1) {
        err_flag = true;
        // console.log('i: ' + i + ",length: " + ingredients_maybe[i].length );
        for (var o = 0; o < ingredients_maybe[i].length; o += 1) {
          try {
            this_ingredient = await ingredient_t.findAll({
              attributes: [
                'ingredient_total',
                'ingredient_measurement',
                'ingredient_expiration_date'
              ],
              where: { ingredient_name: ingredients_maybe[i][o].recipe_ingredient_used }
            });
            // console.log("lengnth: " + Object.keys(this_ingredient).length);
            // break the loop and dont log this recipe_id if the queary comes back with nothing

            if (this_ingredient == null) {
              console.log('no ingredient: ' + ingredients_maybe[i][o].ingredient_name + ' in db');
              err_flag = false;
              break;
            }
            for (var p = 0; p < this_ingredient.length; p += 1) {
              // console.log(this_ingredient[0].ingredient_measurement + '==' +ingredients_maybe[i][o].recipe_ingredient_measurement );
              if (
                this_ingredient[p].ingredient_measurement ==
                ingredients_maybe[i][o].recipe_ingredient_measurement
              ) {
                console.log(
                  this_ingredient[p].ingredient_total +
                    ' <= ' +
                    ingredients_maybe[i][o].recipe_ingredient_qty
                );
                if (
                  this_ingredient[p].ingredient_total <
                  ingredients_maybe[i][o].recipe_ingredient_qty
                ) {
                  if (p == this_ingredient.length - 1) {
                    err_flag = false;
                    console.log('p: ' + p, ', lenght: ' + this_ingredient.length - 1);
                    console.log(
                      'flipped flag on ' + ingredients_maybe[i][o].recipe_ingredient_used
                    );
                    break;
                  }
                }
              }
            } // end of this_ingredient
          } catch (err) {
            console.log(err);
          } // end of try/catch
        } // end of nest for
        if (err_flag)
          // if we have all the ingredients, then add it to the return array
          found_recipes_ids.push(id_n_needed[i].recipe_id);
      } // end of outer for
      // get the rest of the data for the recipes
      try {
        return found_recipes_ids;
      } catch (err) {
        console.log(err);
      }

      return final_results;
    } catch (err) {
      console.log(err);
    }
  } // end of check to see if the function was passed a name.
  else {
    console.log('need to pass an ingredient name, thank you');
  }
}

module.exports.find_recipes = find_recipes;
// testing code
// console.log(find_recipes("Chicken"));
