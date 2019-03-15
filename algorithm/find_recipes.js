/// function to recommend recipes for the expiring ingredient

//inputs
//ingredient id

// outputs: an array of recipe_ids

//outputs: an array of recipe_ids

//requires

const ingredients_in_a_recipe_t = require('../DB_models/ingredients_in_a_recipe');
const ingredients_in_pantry_t = require('../DB_models/ingredients_in_pantry');
const unit_convert = require('./Convert_unts');
const op = require('sequelize').Op;


async function find_recipes(exp_id,pantry_id)
{
    try{
        var recommened_recipes= new Array();
        console.log("starting find recipe with ingredient id: " + exp_id+"\n");
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

            console.log('\n' +JSON.stringify("recipe ids: " + recipe_ids));

            var recipe_ids_array = new Array();

            recipe_ids.forEach(ids => {

                recipe_ids_array.push(ids.recipe_id);
            });
            console.log("array of recipes : \n" + recipe_ids_array);

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
                console.log("///////////////////////////////////////\nrecipe_id: " + recipe_ids[i] )
                //get a list of ingredients need for 
                list_of_ingredients_in_recipe = await ingredients_in_a_recipe_t.findAll({
                    attributes: ['ingredient_id','amount_of_ingredient_needed', 'ingredient_unit_of_measurement'],
                    where:{
                        recipe_id: recipe_ids_array[i],
                        pantry_id: pantry_id
                    }
                });
                console.log(JSON.stringify(list_of_ingredients_in_recipe));
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
                    console.log(JSON.stringify(ingredents_from_pantry_data));
                    for(var p=0; p<ingredents_from_pantry_data.length; p++)
                    {
                        console.log("list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement: " + list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement + ' == ' + ingredents_from_pantry_data[p].ingredient_unit_of_measurement);
                        if(list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement == ingredents_from_pantry_data[p].ingredient_unit_of_measurement)
                        {
                            total_amount_ingredient += ingredents_from_pantry_data[p].ingredient_amount;
                        }
                        else
                        {
                            var new_amount;
                            console.log("have to convert units");
                            new_amount = await parseFloat(unit_convert.converter_raw(ingredents_from_pantry_data[p].ingredient_amount, ingredents_from_pantry_data[p].ingredient_unit_of_measurement,list_of_ingredients_in_recipe[o].ingredient_unit_of_measurement));
                            console.log(new_amount);
                            if(new_amount != 0)
                            {
                                total_amount_ingredient += new_amount;
                            }   
                        }
                        console.log("\ntotal: " + total_amount_ingredient + "\n");
                    }//end of double nesst for loop
                    // console.log("total_amount_ingredient: " + total_amount_ingredient + " < " +list_of_ingredients_in_recipe[o].amount_of_ingredient_needed);
                    if(total_amount_ingredient < list_of_ingredients_in_recipe[o].amount_of_ingredient_needed)
                    {
                        console.log("cant cook, next\n");
                        flag_have_needed_anmount =false;
                        break;
                    }


                }//end of nested for loop
                if(flag_have_needed_anmount)
                    {
                        recommened_recipes.push(recipe_ids_array[i]);
                    }
                console.log("///////////////////////////////////////\n");
            }//END OF FOR LOOP
            
            console.log((recommened_recipes));
            return recommened_recipes;
        }//end of if checking that we passed an id for ingfredients
        else{
            console.log("need ingredient id thank you");
        }
    }
    catch(err)
    {
        console.log(err);
    }

}

module.exports.find_recipes = find_recipes;
// find_recipes(1,1);