/// function to find all ingredients that are expiring within the window

// inputs
// system date : date
// window date : date

// outputs
// JSON array with ingredient ids

// requires
const ingredients_in_pan = require('../DB_models/ingredients_in_pantry');
const logger = require('../functions/logger');

const op = require('sequelize').Op; /// handles

async function find_ingredients(window,pantry_id) {
  // if no window passed, assume today
  console.log("STARTING FIND INGREDIENTS")
  console.log("=========================")
  //set of two dates. one for being today and one used for finding finding ingredients that are expiring in the 
  var window_date = new Date();
  var today = await new Date();
  //check if the window is a number 
  if(window == null || typeof window !='number')
    {
      //if not just use todat
      console.log("no window using todays date: " + window_date);
    }
  else{
    //get the date plus  window amount of days
      window_date.setDate(window_date.getDate() + window);
       
      var dd = window_date.getDate();
      var mm = window_date.getMonth() +1;
      var yy = window_date.getFullYear();

      var d_str = yy + '-' + mm + '-' + dd;
      console.log(d_str);
      window_date = new Date(d_str);
  }
  try {
    // SELECT ingredient_id
    // FROM   ingredients
    // WHERE ingrdient_exiration_date BETWEEN today and window
    
    var today = new Date();
    logger.info("today: " + today + "\nwindow: " + window_date);
    
    //query for the ids
    var expiring_ings = await ingredients_in_pan.findAll({
      attributes: ['ingredient_id'],
      where: 
      {
        ingredient_expiration_date: {
          [op.between]: [today, window_date]
        },
        pantry_id: pantry_id  
      },
      order : ["ingredient_expiration_date"]
    });
    logger.info("\nfound ingredient ids: \n" + JSON.stringify(expiring_ings));
    return expiring_ings;
  } catch (err) {
    logger.info('error in find_ingredients\n' + err);
    return 0
  }
}
//testing code
// find_ingredients(12,1);
module.exports.find_ingredients = find_ingredients;
