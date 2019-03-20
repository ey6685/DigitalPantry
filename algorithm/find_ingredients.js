/// function to find all ingredients that are expiring within the window

// inputs
// system date : date
// window date : date

// outputs
// JSON array with ingredient names

// requires
const ingredient_t = require('../DB_models/Ingredients'); // link to ingredients tables
const ingredients_in_pan = require('../DB_models/ingredients_in_pantry');
const logger = require('../functions/logger');

const op = require('sequelize').Op; /// handles

async function find_ingredients(window,pantry_id) {
  var new_date = new Date();
  // if no window passed, assume today
  if (window == null) {
    window =1;
    logger.info('no window date provide, using: ' + window);
  }
  else{
    window = new Date(new_date.getUTCFullYear(),new_date.getUTCMonth(),new_date.getUTCDate() + window);
  } 
  try {
    // SELECT ingredient_name
    // FROM   ingredients
    // WHERE ingrdient_exiration_date BETWEEN today and window
    logger.info("")
    var today = new Date(new_date.getUTCFullYear(),new_date.getUTCMonth(),new_date.getUTCDate());
    logger.info("today: " + today + "\nwindow: " + window);
    

    var expiring_ings = await ingredients_in_pan.findAll({
      attributes: ['ingredient_id'],
      where: 
      {
        ingredient_expiration_date: {
          [op.between]: [today, window]
        },
        pantry_id: pantry_id  
      }
    });
    logger.info("\nfound ingredient ids: \n" + JSON.stringify(expiring_ings));
    return expiring_ings;
  } catch (err) {
    logger.info('error in find_ingredients\n' + err);
  }
}

module.exports.find_ingredients = find_ingredients;
