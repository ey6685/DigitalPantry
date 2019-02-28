///function to find all ingredients that are expiring within the window

//inputs
//system date : date
//window date : date

//outputs
//JSON array with ingredient names


//requires
const ingredient_t = require('../DB_models/Ingredients'); //link to ingredients tables
const op = require("sequelize").Op; ///handles 

async function find_ingredients(window)
{
    var new_date = new Date()
    //if no window passed, assume today
    if(window == null)
    {
        
        var year = new_date.getUTCFullYear();
        var month = new_date.getUTCMonth() + 1;
        var day = new_date.getUTCDate() - 1;
        
        window = year + "-" + month + "-" + day;
        console.log("no window date provide, using: " + window);
    }
    //get today
    var year = new_date.getUTCFullYear();
    var month = new_date.getUTCMonth() + 1;
    var day = new_date.getUTCDate() - 1;
    var today = year + "-" + month + "-" + day;

    
    try{
        //SELECT ingredient_name
        //FROM   ingredients
        //WHERE ingrdient_exiration_date BETWEEN today and window
        var ingredients_results = await ingredient_t.findAll({
            attributes: ['ingredient_name'],
            where: {
                ingredient_expiration_date:{
                    [op.between]: [today, window]
                }
            }
        });
        return ingredients_results;
    }
    catch(err)
    {
        console.log("error in find_ingredients\n" + err);
    }
}

module.exports.find_ingredients = find_ingredients;
