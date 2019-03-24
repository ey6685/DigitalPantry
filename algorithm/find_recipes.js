/// function to recommend recipes for the expiring ingredient

//inputs
//ingredient id

// outputs: an array of recipe_ids

//outputs: an array of recipe_ids

//requires

const recipe_t = require('../DB_models/Recipes');
const ingredients_in_a_recipe_t = require('../DB_models/ingredients_in_a_recipe');
const ingredients_in_pantry_t = require('../DB_models/ingredients_in_pantry');
const unit_convert = require('./Convert_unts');
const op = require('sequelize').Op;
const logger = require('../functions/logger');
const ing_totaler = require('./total_of_ingredient');

async function find_recipes(exp_id,pantry_id)
{
    try{
        var recommened_recipes= new Array();
        logger.info("starting find recipe with ingredient id: " + exp_id+"\n");
        if(pantry_id == null) pantry_id = 1;
        if(exp_id != null)
        {
            //find all the variant recipe ids that have the ingredieint
            var recipe_ids = await ingredients_in_a_recipe_t.findAll({
                attributes :['recipe_id'],
                where:{
                    ingredient_id: exp_id,
                    pantry_id: pantry_id
                }
            });

            logger.info('\nrecipe ids: ' +JSON.stringify(recipe_ids));

            var recipe_ids_array = new Array();

            recipe_ids.forEach(ids => {

                recipe_ids_array.push(ids.recipe_id);
            });
            logger.info("array of recipes : \n" + recipe_ids_array);

            //new vars for for loops
            var flag_have_needed_anmount = false//starts false will flip if we have the ingredents
            var ingredents_from_pantry_data;//stores the db called data
            var list_of_ingredients_in_recipe;//for what is needed in the recipes
            var i = 0//counter for the loop
            var total_amount_ingredient=0//for totaling if there are mult instances of the ingredient
         
            for(i; i<recipe_ids_array.length;i++)
            {
                //set start data
                total_amount_ingredient = 0;
                flag_have_needed_anmount = true;
                logger.info("\nrecipe_id: " + JSON.stringify(recipe_ids[i] ));
                //get a list of ingredients need for 
                list_of_ingredients_in_recipe = await ingredients_in_a_recipe_t.findAll({
                    attributes: ['ingredient_id','amount_of_ingredient_needed', 'ingredient_unit_of_measurement'],
                    where:{
                        recipe_id: recipe_ids_array[i],
                        pantry_id: pantry_id
                    }
                });
                logger.info(JSON.stringify(list_of_ingredients_in_recipe));
                //check each needed amount of the recipe and change the flag if we doent
                for(var o=0; o< list_of_ingredients_in_recipe.length; o++)
                {
                    ingredents_from_pantry_data = await ingredients_in_pantry_t.findAll({
                        attributes: ['ingredient_amount','ingredient_unit_of_measurement'],
                        where: {
                            ingredient_id: list_of_ingredients_in_recipe[o].ingredient_id,
                            pantry_id: pantry_id
                        }
                    })

                    total_amount_ingredient = 0;
                    logger.info(JSON.stringify(ingredents_from_pantry_data));
                    for(var p=0; p<ingredents_from_pantry_data.length; p++)
                    {
                        logger.info("list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement: " + list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement + ' == ' + ingredents_from_pantry_data[p].ingredient_unit_of_measurement);
                        if(list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement == ingredents_from_pantry_data[p].ingredient_unit_of_measurement)
                        {
                            total_amount_ingredient += ingredents_from_pantry_data[p].ingredient_amount;
                        }
                        else
                        {
                            var new_amount;
                            logger.info("have to convert units");
                            new_amount = await parseFloat(unit_convert.converter_raw(ingredents_from_pantry_data[p].ingredient_amount, ingredents_from_pantry_data[p].ingredient_unit_of_measurement,list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement));
                            logger.info("converted amount: " +new_amount);
                            if(new_amount != 0)
                            {
                                total_amount_ingredient += new_amount;
                            }   
                        }
                        logger.info("\ntotal: " + total_amount_ingredient + "\n");
                    }//end of double nesst for loop
                    // logger.info("total_amount_ingredient: " + total_amount_ingredient + " < " +list_of_ingredients_in_recipe[o].amount_of_ingredient_needed);
                    if(total_amount_ingredient < list_of_ingredients_in_recipe[o].amount_of_ingredient_needed)
                    {
                        logger.info("cant cook, next\n");
                        flag_have_needed_anmount =false;
                        break;
                    }


                }//end of nested for loop
                if(flag_have_needed_anmount)
                    {
                        recommened_recipes.push(recipe_ids_array[i]);
                    }
                logger.info("\n");
            }//END OF FOR LOOP
            
            logger.info("recommended recipe ids: \n" + (recommened_recipes));
            return recommened_recipes;
        }//end of if checking that we passed an id for ingfredients
        else{
            logger.info("need ingredient id thank you");
        }
    }
    catch(err)
    {
        logger.info(err);
    }

}

module.exports.find_recipes = find_recipes;
// find_recipes(1,1);


/*
function: find_recipes_no_inv

inputs
1)ingredient id
2)pantry id

outputs
TBD

returns

description
checks for the best recipes for the ingredient id provided and returns them
*/

async function find_recipes_no_inv(ingredient_id, pantry_id){
    

    try{
        var returning_JSON = new Array();
        var recieps_ing_in = await ingredients_in_a_recipe_t.findAll({
            where : {
                ingredient_id: ingredient_id,
                pantry_id: pantry_id
            }
        });
        console.log("THE RECIPE IDS FOUND");
        console.log("====================");
        console.log(JSON.stringify(recieps_ing_in))

        //makeing JSON data
        var recipe_ids_arr = new Array();//mark name for later
        for(var i=0; i<recieps_ing_in.length; i++)
        {
            recipe_ids_arr.push(recieps_ing_in[i].recipe_id);
        }
        console.log(JSON.stringify(recipe_ids_arr));

        //get the rest of the date per id
        var ingredients_we_have = new Array();
        ingredients_we_have[0] = new Array()
        var ingredients_we_dont = new Array();
        ingredients_we_dont[0] = new Array();
        for(var i = 0;i<recipe_ids_arr.length;i++)
        {
            ingredients_we_have[i]= ""
            ingredients_we_dont[i] = ""
            var ingredients_recipe = await ingredients_in_a_recipe_t.findAll({
                attributes:['ingredient_id','amount_of_ingredient_needed','ingredient_unit_of_measurement'],
                where :{
                    recipe_id : recipe_ids_arr[i],
                    pantry_id: pantry_id
                }
            });
            //now to seperate the ingredients into have and dont have enought arrays
            for(var o=0;o<ingredients_recipe.length; o++)
            {
                var sum = await ing_totaler.total_ingredients(ingredients_recipe[i].ingredient_id, pantry_id, ingredients_recipe[i].ingredient_unit_of_measurement);
                if(sum >= ingredients_recipe[o].amount_of_ingredient_needed)
                {
                    ingredients_we_have[i].push( {
                        "ingredient_id" : ingredients_recipe[o].ingredient_id,
                        "ingredient_sum" : sum,
                        "ingredient_unit_of_measurement" : ingredients_recipe[o].ingredient_unit_of_measurement
                    })
                }
                else{
                    ingredients_we_dont[i].push({
                        "ingredient_id" : ingredients_recipe[o].ingredient_id,
                        "ingredient_sum" : sum,
                        "ingredient_unit_of_measurement" : ingredients_recipe[o].ingredient_unit_of_measurement
                    })
                }
            }
        }

        console.log("INGREDENTS WE HAVE")
        console.log("==================")
        console.log(JSON.stringify(ingredients_we_have))
        console.log("ingredients_we_dont")
        console.log("===================")
        console.log(JSON.stringify(ingredients_we_dont))

        

        console.log("FOUND REST OF INGREDIENTS");
        console.log("=========================");
        for(var i=0;i<all_ingredients_in_recipe.length;i++)
        {
            console.log(JSON.stringify(all_ingredients_in_recipe[i]));
        }
        //now need some data from the recipes table

        var recipe_table_data = new Array()
        for(var i= 0;i<recipe_ids_arr.length;i++)
        {
            recipe_table_data.push(await recipe_t.findAll({
                attributes: ['recipe_name','recipe_image_path','recipe_directions','num_people_it_feeds'],
                where:{
                    recipe_id: recipe_ids_arr[i],
                    pantry_id: pantry_id
                }
            }))
        }
 
        //now that we have the ingredients for each recipe
        //time to make the JSON object that we are reutnring
        for(var i=0;i<recipe_ids_arr.length;i++){
            returning_JSON.push({
                "recipe_name": recipe_table_data[i].recipe_name,
                "recipe_id" : recipe_ids_arr[i],//might not need
                "recipe_image_path": recipe_table_data[i].recipe_image_path,
                "recipe_directions" : recipe_table_data[i].recipe_directions,
                "num_of_people_it_feeds" : recipe_table_data[i].num_of_people_it_feeds,
                "ingredients_needed": all_ingredients_in_recipe[i]
            })
        }

        console.log("Returning json data")
        console.log("===================")
        console.log(JSON.stringify(returning_JSON));
    }catch(err){
        console.log(err)
        return -1;
    }
}
find_recipes_no_inv(1,1);