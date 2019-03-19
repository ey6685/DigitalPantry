//////////recipe dirction parser/////////
// this file contains a string parse for//
// our use to get the data from our     //
// ingredients directions field from the//
// data base.                           //
// takes stings inthe format:           //
// #str#str#str to                      //
// 1.)str                               //
// 2.)str                               //
// 3.)str                               //
/////////////////////////////////////////

/////////requires//////////////
const recipe_ingredient_t = require('./DB_models/Recipes');

function recipe_direction_parser(recipe_id) {
  // takes in the recipe id of the recipe of the
  // recipe we are locking for and returns a formated
  // string as descined in the block at the top of file

  // query
  // SELECT `recipe_directions` FROM `recipes` AS `recipes`
  // WHERE `recipes`.`recipe_id` = 1;
  return recipe_ingredient_t
    .findOne({
      where: { recipe_id: recipe_id },
      attributes: ['recipe_directions']
    })
    .then(recipe => {
      console.log("starting string: \n" + recipe.recipe_directions);
      var counting_pound_sign = 1;
      var returning_string = '';
      for (var i = 0; i < recipe.recipe_directions.length; i += 1) {
        if (i == 0) {
          // starting the string with step one
          returning_string =  '1.)';
          returning_string += recipe.recipe_directions[0];
        } else if (recipe.recipe_directions[i] == '#') {
          // the start of a new step
          counting_pound_sign += 1;
          returning_string += '${<br>}' + counting_pound_sign + '.)';
        } else {
          // just adding the next character
          returning_string += recipe.recipe_directions[i];
        }
      } // end of for loop
      console.log("the parsed string :\n" +returning_string);

      return returning_string;
    });
}

// Added by Oskars Dauksts
// Taken and modified from the above method
function parse_recipe_directions_by_string(recipe_direction) {
  // takes in the recipe direction as a string

  var counting_pound_sign = 1;
  var returning_string = '';

  for (var i = 0; i < recipe_direction.length; i += 1) {
    if (i == 0) {
      // starting the string with step one
      returning_string = returning_string + '1.)' + recipe_direction[i];
    } else if (recipe_direction[i] == '#') {
      // the start of a new step
      counting_pound_sign += 1;
      returning_string += '${<br>}' + counting_pound_sign + '.)';
    } else {
      // just adding the next character
      returning_string += recipe_direction[i];
    }
  } // end of for loop
  console.log(returning_string);

  return returning_string;
}

module.exports.parse_recipe_directions_by_string = parse_recipe_directions_by_string;
module.exports.recipe_direction_parser = recipe_direction_parser;
// test function call
// recipe_direction_parser(1);
