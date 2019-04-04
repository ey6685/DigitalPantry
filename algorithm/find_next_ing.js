/*
this file is to find the next exipiring ingredient for the recommenting recipes

inputs:
---date from the system

output:

returns
--id of ingredient that is expiring

requires
*/

const ingredient_table           = require('../DB_models/Ingredients');
const ingredient_in_pantry_table = require('../DB_models/ingredients_in_pantry');
const op = require('sequelize').Op;
const logger = require('../functions/logger');


//start of function

async function next_exp_ingredient()
{
    //first we need the date
    try
    {
        var date = new Date();
        var month = date.getMonth() +1 ;
        var day = date.getDate()-1;
        var year = date.getFullYear();
        var local_date = year + '-' + month + '-' + day;
        logger.info("todays date for checking: " + local_date + '\n');
    }
    catch(err)
    {
        logger.info("date err: " + err);
    }

    try 
    {
        //get the ingredients form the ingredients in pantry table that have an ex date
        // that is today or greater.
        var list_of_exp_ing = await ingredient_in_pantry_table.findAll({
            where: 
            {
                ingredient_expiration_date: {
                    [op.gte]: local_date
                },
                // ingredient_expiration_date: {
                //     [op.ne]: null
                // }
            },
            order: ["ingredient_expiration_date"],
            // include: [{model: ingredient_table}]
        });
        
        logger.info(JSON.stringify(list_of_exp_ing) + '\n');
        //now to find the one with the greatest weight
        var ex_date = list_of_exp_ing[0].ingredient_expiration_date;
        var i = 0;

        //now to get the weight of these ingredients to make sure we get rid of the best ingredient
        var ing_ids = new Array();
        do
        {
            ing_ids.push(list_of_exp_ing[i].ingredient_id);
            i++;
        }while(list_of_exp_ing.ingredient_expiration_date <= ex_date && i<list_of_exp_ing.length);

        //get the weights of the ingredients
        var weights = await ingredient_table.findAll({
            attributes:['ingredient_name', 'ingredient_id', 'ingredient_weight'],
            where:{
                ingredient_id : {
                    [op.in] : ing_ids
                    }
                }
        });
        
        //now to compare weights to 
        var best_weight = weights[0];
        for(var i = 1; i<weights.lenght; i++)
        {
            if(best_weight.ingredient_weight < weights[i].ingredient_weight)
                best_weight = weights[i];
        }
        
        logger.info(JSON.stringify(best_weight)+ '\n');

        //return the ingredient id
        return best_weight.ingredient_id;

    } 
    catch (err) {
        logger.info(err);
    }
}

module.exports.next_exp_ingredient = next_exp_ingredient;

//testing code
// next_exp_ingredient();
